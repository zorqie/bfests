import React from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'react-router'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import Mic from 'material-ui/svg-icons/av/mic';

import app from '../main.jsx'
import styles from './styles'


export default class MyAct extends React.Component{
	state = {
		act: {},
		errors: {},
	}

	componentDidMount() {
		const {actId} = this.props.params
		app.service('acts').get(actId)
		.then(act => {
			this.setState({act})
		})
	}

	handleChange = e => {
		const {name, value} = e.target
		const {act} = this.state
		this.setState({act: {...act, [name]:value}})
	}

	handleSubmit = e => {
		e.preventDefault()
		const {act} = this.state
		app.service('acts').patch(act._id, act)
		.then(act => {
			const user = app.get('user')
			user.acts = user.acts.map(a => a._id===act._id ? act : a)
			browserHistory.goBack()
		})
		.catch(({errors}) => this.setState({errors}))
	}

	render() {
		const {act, errors} = this.state
		return <div style={{margin:'1em'}}>
			<p><Mic />This is my Artist profile, nice, eh?</p>
			<form method='post' onSubmit={this.handleSubmit}>
				<TextField 
					name='name'
					hintText='Your stage name or pseudonym'
					floatingLabelText="Name"
					value={act.name || ''} 
					errorText={errors.name && errors.name.message || ''}
					onChange={this.handleChange}
					fullWidth={true}
					maxLength={42}
				/>
				<TextField 
					name='description'
					floatingLabelText="Description"
					value={act.description || ''} 
					errorText={errors.description && errors.decription.message || ''}
					onChange={this.handleChange}
					fullWidth={true}
					maxLength={66}
				/>
				<div style={{margin:'1em', textAlign:'right'}}> 
					<FlatButton label='Cancel' onTouchTap={browserHistory.goBack}/>
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