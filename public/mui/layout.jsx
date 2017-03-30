import React from 'react'

import { Link, browserHistory } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { 
	red900, red700, 
	grey100, grey400, grey500, 
	lightGreen700, lightGreen900 } from 'material-ui/styles/colors'

import AppBar from 'material-ui/AppBar'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Drawer from 'material-ui/Drawer'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'

import app from '../main.jsx'
import errorHandler from './err'
import UserCard from './user-card.jsx'

const theme = {
	palette: {
		primary1Color: lightGreen700,	// normal
		primary2Color: lightGreen900,	// date & time picker
		primary3Color: grey100, 		// slider & toggle

		accent1Color: red900, //secondary flat button text
		accent2Color: grey100, //table row, toggle & toolbar
		accent3Color: grey500, //slider, table footer & tablce column header
	}
}

const sections = [
	{ text: "Events", path: "/events"},		//TODO with only one section
													// do we need them?
]

export default class Layout extends React.Component {
	state = { 
		drawerOpen: false, 
		user: null, 
		section: 'BFest',
		snackbarOpen: false,
		message: '',
	}

	componentDidMount() {
		app.authenticate()
			.then(this.loginListener())
			.catch(err => console.error)
		app.on('authenticated', this.loginListener)
		app.on('error', this.errorListener) 
		app.service('users').on('patched', this.userPatched)
	}

	componentWillUnmount() {
		if(app) {
			app.removeListener('authenticated', this.loginListener)
			app.removeListener('error', this.errorListener)
		}
	}

	closeDrawer = () => {
		this.setState({drawerOpen: false})
	}

	toggleDrawer = () => {
		this.setState({drawerOpen: !this.state.drawerOpen})
	}

	handleMenu = section => {
		// console.log("Menu: ", section)
		const {path, text} = section
		this.setState({section: text, drawerOpen: false})
		// this.closeDrawer()
		browserHistory.push(path)
	}

	handleLogout = () => {
		app.service('users').patch(this.state.user._id, {online: false})
		.then(u => {
			this.setState({user: null})
			app.logout()
			browserHistory.push('/out')
		})
	}

	errorListener = error => {
		console.log("ERRORED out.", error)
		this.setState({snackbarOpen: true, message: error.message})
		// this.setState({snackbarOpen: true, message: `User logged out (${u.name}`})
	}

	loginListener = u => {
		const user = app.get('user')
		if(!this.state.user && user) {
			this.setState({ user })
		}
	}

	userPatched = u => {
		if(u) {
			const name = u.name || (u.facebook && u.facebook.name)
			const message = name + ' signed ' + (u.online ? 'in' : 'out')
			this.setState({snackbarOpen: true, message})
		}
	}

	handleDrawer = (open, reason) => {
		// console.log(`Drawer: open: ${open} for ${reason}`)
		this.setState({drawerOpen: open})
	}
	handleSnackbarClose = () => this.setState({ snackbarOpen: false, message: ''})

	render() { 
		const {user} = this.state
		return (
		<MuiThemeProvider muiTheme={getMuiTheme(theme)}>
			<div>
				<AppBar 
					title={this.state.section}
					iconElementRight={
						user 
						?	<FlatButton label="Logout" onTouchTap={this.handleLogout}/>
						: 	<Link to='login'>
								<RaisedButton label="Login"  primary={true}/>
							</Link>
					}
					onLeftIconButtonTouchTap={this.toggleDrawer}
					className='gyps-bar'
				/>
				<Drawer 
					docked={false}
					width={266}
					open={this.state.drawerOpen}
					onRequestChange={this.handleDrawer}
				>
					{ user && <UserCard user={user} onNavigate={this.handleMenu}/> }
					{sections.map( section => 
						<MenuItem onTouchTap={this.handleMenu.bind(this, section)} primaryText={section.text} key={section.path}/>
					)}
				</Drawer>
				{this.props.children}
				<footer style={{position:'fixed', bottom: 0, right: 8, fontSize: 'smaller'}}>
					© 2017 Intergalactic Balkan Festivals Unlimited
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
}