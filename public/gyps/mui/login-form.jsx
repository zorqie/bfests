import React from 'react';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Link, browserHistory } from 'react-router';

import app from '../main.jsx';

const focus = input => input && input.focus()

class LoginForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {email: "", password: "", errors: {}};
	}

	handleChange = e => {
		const { name, value } = e.target;
		this.setState({...this.state, [name] : value});
	}

	// componentDidMount() {

	// };

	doLogin = e => {
		e.preventDefault();
		// console.log("Attemptifying to login with state: ", this.state);
		const { email, password } = this.state;
		app.authenticate({
			type: 'local',
			email,
			password,
		})
		.then(() => {
			const user = app.get('user');
			console.log("Authenticated.then", user)
			app.service('users').patch(user._id, {online: true})
			.then(u => {
				app.emit('authenticated', user);
				browserHistory.push('/gyps/events');
				// console.log("Login complete");
			})
		})
		.catch(error => {
			console.error("Errorated: ", error);
			app.emit("error", error);
			this.setState({...this.state, errors: error});
		})
		
	}

	render() {
		const { email, password, errors } = this.state;
		return (
			<Paper style={{margin: '1em 3em', padding: '16px 48px'}}>
				<h2 style={{fontWeight:300, marginBottom: '1em'}}>Login</h2>
				<p>No account? Perhaps you can <Link to='/signup'>Sign up</Link></p>
				<form onSubmit={this.doLogin}>
					<div style={{visibility: errors.message ? 'visible' : 'hidden'}}>
						{errors.message}
					</div>
					<TextField 
						type='email'
						name='email'
						floatingLabelText="Email"
						value={email} 
						onChange={this.handleChange}
						fullWidth={true}
						ref={focus}
					/>
					<TextField 
						type='password'
						name='password'
						floatingLabelText="Password"
						value={password} 
						onChange={this.handleChange} 
						fullWidth={true}
					/>

					<div style={{marginTop:'1em', textAlign:'right'}}>
						<FlatButton label='Cancel' onTouchTap={browserHistory.goBack} />
						<RaisedButton type='submit' label='Login' primary/>
					</div>
				</form>
				
			</Paper>
		);
	}
};

export default LoginForm;