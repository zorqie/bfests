import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'react-router'

import Checkbox from 'material-ui/Checkbox'
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField'

import Mic from 'material-ui/svg-icons/av/mic';
import MicOff from 'material-ui/svg-icons/av/mic-off';

import app from '../main.jsx'
import ActsList from './acts-list.jsx'
import styles from './styles'
import {viewAct} from './utils.jsx'


// TODO move these to db.event_config linked by event._id
// or something like that
// all required unless optional: true
const extraFields = [
	{	name: "city",
		optional: true,
	},
	{	name: "phone",
	},
	{	name: "arriving",
		type: 'enum',
		label: "How are you arriving",
		enum: [
			'By car',
			'By air, need ride from airport', 
			'By bus/train, need ride from station',
			"I have a ride, don't need parking"
		]
	},
	{	name: "overnight",
		type: 'enum',
		label: 'Overnight arrangements',
		enum: [
			'Bringing a tent, need a camp spot',
			'Staying overnight but no spot needed',
			'Not staying overnight'
		]
	},
	{	name: "performer",
		type: Boolean, 
		label: "I will perform/teach a class",
	},
]

function EventFields({fields, prefix='extra.', data, errors, onChange}) {

	return data && <div style={styles.extraFields}>
		{fields.map(f => 
			f.type==='enum'
			? <SelectField
				key={f.name}
				name={prefix+f.name}
				value={data[prefix+f.name] || ''}
				floatingLabelText={f.label || f.name}
				errorText={errors[prefix+f.name] && errors[prefix+f.name].message || ''}
				onChange={onChange.bind(null, {target:{name: prefix+f.name}})}
				fullWidth={true}
				>
					{f.enum.map(o => 
						<MenuItem key={o} value={o} primaryText={o} />
					)}
				</SelectField>
			: f.type===Boolean
			? <Checkbox
				checkedIcon={<Mic />}
				
				name={prefix+f.name}
				label={f.label}

				/>

			: <TextField key={f.name} 
				name={prefix+f.name}
				value={data[prefix+f.name] || ''}
				fullWidth={true}
				floatingLabelText={f.label || f.name}
				onChange={onChange}
				errorText={errors[prefix+f.name] && errors[prefix+f.name].message || ''}
			/>
		)}
	</div>
	|| null
}

export default class MyProfile extends React.Component{
	state = {
		profile: {},
		errors: {},
		extra: {},
	}

	componentDidMount() {
		const user = app.get('user')
		this.setState({profile: {...user, extra: user.extra || {}}})
	}

	handleExtraChange = (e, ev, i, val) => {
		const {name, value} = e.target
		const {extra} = this.state
		this.setState({extra: {...extra, [name]: val || value}})
	}

	handleChange = e => {
		const {name, value} = e.target
		const {profile} = this.state
		this.setState({profile: {...profile, [name]:value}})
	}

	handleSubmit = e => {
		e.preventDefault()
		console.log("Submet")
	}

	editAct = act => browserHistory.push('/my-act/'+act._id)

	render() {
		const {profile, extra, errors} = this.state
		return <div style={{margin:'1em'}}>
			<form method='post' onSubmit={this.handleSubmit}>
				<TextField 
					name='name'
					hintText='What you wish to be called'
					floatingLabelText="Name"
					value={profile.name || ''} 
					errorText={errors.name && errors.name.message || ''}
					onChange={this.handleChange}
					fullWidth={true}
					maxLength={42}
				/>
				<TextField 
					name='email'
					hintText='Where you at?'
					floatingLabelText="Email"
					value={profile.email || ''} 
					errorText={errors.email && errors.email.message || ''}
					onChange={this.handleChange}
					fullWidth={true}
					maxLength={42}
				/>
				{/*<EventFields 
					prefix='extra.'
					fields={extraFields} 
					data={extra}
					errors={errors}
					onChange={this.handleExtraChange}
				/>*/}
				{profile.acts && profile.acts.length 
					&& 	<div style={{marginTop:'1em'}}>
							<div style={{color: 'rgba(0, 0, 0, 0.298039)', fontSize:'smaller'}}>
								Performing as:
							</div>
							<ActsList 
								acts={profile.acts} 
								onSelect={viewAct}
								onEdit={this.editAct}
							/>
						</div>
					|| ''
				}
				<div style={{margin:'1em', textAlign: 'right'}}>
					<RaisedButton
						type='submit'
						primary={true}
						label='Save'
					/>
				 </div>
			</form>
		</div>
	}
}