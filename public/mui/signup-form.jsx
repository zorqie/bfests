import React from 'react'

import { browserHistory } from 'react-router'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import app from '../main.jsx'

const focus = input => input && input.focus()

export default class SignupForm extends React.Component {
	state = {
		email: "",
		name: "",
		password: "",
		password2: "",
		errors: {},
	}

	handleChange = e => {
		const { name, value } = e.target
		this.setState({...this.state, errors: {[name] : null}, [name] : value})
	}
	
	handleSubmit = e => {
		e.preventDefault()
		const {email, name, password, password2} = this.state
		if(!password2 || password2 !== password) {
			this.setState({errors: {password2: "Passwords don't match"}})
		} else {
			app.service('users').create({
				name,
				email,
				password,
			})
			.then(user => browserHistory.push('/login'))
			.catch(err => {
				console.error("Error signing up: ", JSON.stringify(err))
				this.setState({errors: err.errors})
			})
		}
	}
	
	handleCancel = e => {
		browserHistory.goBack()
	}
	
	render() {
		const { errors } = this.state
		return (
			<Paper style={{margin:'1em 2em', padding:'16px 48px'}}>
				<h2>Signup</h2>
				<form method="post" action="/signup" onSubmit={this.handleSubmit}>
					<TextField
						type="email" 
						name='email'
						hintText='Where you at'
						floatingLabelText="E-mail"
						errorText={errors.email || ''}
						value={this.state.email} 
						onChange={this.handleChange}
						fullWidth={true}
						maxLength={42}
						ref={focus}
					/>
				
				
					<TextField 
						name='name'
						hintText='What you wish to be called'
						floatingLabelText="Name"
						value={this.state.name} 
						errorText={errors.name || ''}
						onChange={this.handleChange}
						fullWidth={true}
						maxLength={42}
					/>
				
				
					<TextField 
						type='password'
						name='password'
						floatingLabelText="Password"
						value={this.state.password} 
						onChange={this.handleChange}
						fullWidth={true}
						maxLength={42}
					/>
				
				
					<TextField 
						type='password'
						name='password2'
						floatingLabelText="Confirm password"
						value={this.state.password2} 
						onChange={this.handleChange} 
						errorText={errors.password2 || ''}
						fullWidth={true}
						maxLength={42}
					/>
					
					<div style={{textAlign:'right'}}>
						<FlatButton
							label='Cancel'
							onTouchTap={this.handleCancel}
						/>
						<RaisedButton 
							type='submit' 
							label='Signup' 
							primary 

						/>
					</div>
				</form>
			</Paper>
		)
	}
}
