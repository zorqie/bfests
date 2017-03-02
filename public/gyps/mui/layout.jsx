import React from 'react';

import { Link, browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

import app from '../main.jsx';
import errorHandler from './err'
import UserCard from './user-card.jsx'

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			drawerOpen: false, 
			user: null, 
			section: 'BFest',
			snackbarOpen: false,
			message: ''
		};

		this.sections = [
			// { text: "Venues", path: "/gyps/venues"},
			{ text: "Events", path: "/gyps/events"},
			{ text: "Users", path: "/gyps/users"},
		]
	}
	componentDidMount() {
		app.authenticate()
			.then(this.loginListener())
			.catch(err => console.error);
		app.on('authenticated', this.loginListener);
		app.service('users').on('patched', this.patchedListener);
		app.on('error', this.errorListener);
	}
	componentWillUnmount() {
		if(app) {
			app.removeListener('authenticated', this.loginListener);
			app.removeListener('error', this.errorListener);
		}
	}

	handleUserChange = u => {
		console.log("User loginified: ", u);
		this.setState({snackbarOpen: true, message: "User logged in"});
	}

	closeDrawer = () => {
		this.setState({...this.state, drawerOpen: false})
	}
	toggleDrawer = () => {
		this.setState({...this.state, drawerOpen: !this.state.drawerOpen});
	}
	handleMenu = section => {
		// console.log("Menu: ", section);
		const {path, text} = section;
		this.setState({...this.state, section: text, drawerOpen: false});
		// this.closeDrawer();
		browserHistory.push(path);
	}

	handleLogout = () => {
		app.service('users').patch(this.state.user._id, {online: false})
		.then(u => {
			console.log('User offline', u);
			this.setState({user: null});
			app.logout();
			browserHistory.push('/out');
		});
	}
	errorListener = error => {
		console.log("ERRORED out.", error);
		this.setState({snackbarOpen: true, message: error.message});
		// this.setState({snackbarOpen: true, message: `User logged out (${u.name}`});
	}
	loginListener = u => {
		const user = app.get('user');
		if(!this.state.user && user) {
			console.log("-=-=- AUTHENTICATED (app.user) -=-=-", user);
			this.setState({ user });
		}
	}
	patchedListener = u => {
		console.log("Patched user", u);
		if(u) {
			const message = u.name + ' signed ' + (u.online ? 'in' : 'out')
			this.setState({snackbarOpen: true, message})
		}
	}
	handleDrawer = (open, reason) => {
		console.log(`Drawer: open: ${open} for ${reason}`);
		this.setState({...this.state, drawerOpen: open})
	}
	handleSnackbarClose = () => this.setState({ snackbarOpen: false, message: ''});

	render() { 
		const {user} = this.state;
		return ( 
		<MuiThemeProvider>
			<div>
				<AppBar 
					title={this.state.section}
					iconElementRight={
						user ? 
							<FlatButton onClick={this.handleLogout} label="Logout"/>
							:
							<Link to='login'><FlatButton label="Login" /></Link>
					}
					onLeftIconButtonTouchTap={this.toggleDrawer}
				/>
				<Drawer 
					docked={false}
					width={266}
					open={this.state.drawerOpen}
					onRequestChange={this.handleDrawer}
				>
					{ user && <UserCard user={user} /> }
					{this.sections.map( section => 
						<MenuItem onTouchTap={this.handleMenu.bind(this, section)} primaryText={section.text} key={section.path}/>
					)}
				</Drawer>
				{this.props.children}
				<footer>
					Footering business goes here
				</footer>
				<Snackbar
					open={this.state.snackbarOpen}
					message={this.state.message}
					autoHideDuration={4000}
					onRequestClose={this.handleSnackbarClose}
		        />
			</div>
		</MuiThemeProvider>
		)
	}
};