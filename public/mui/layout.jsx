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
import deny from './err'
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
		ticketsByGig: {},
		tickets: [],
	}
	
	componentDidMount() {
		app.authenticate()
			.then(this.loginListener())
			.catch(err => console.error)
		app.on('authenticated', this.loginListener)
		app.on('error', this.errorListener) 
		app.service('users').on('patched', this.userPatched)
		app.service('tickets').on('created', this.ticketCreated)
		app.service('tickets').on('removed', this.ticketRemoved)

	}

	componentWillUnmount() {
		if(app) {
			app.removeListener('authenticated', this.loginListener)
			app.removeListener('error', this.errorListener)
			app.service('tickets').removeListener('removed', this.ticketRemoved)
			app.service('tickets').removeListener('created', this.ticketCreated)
		}
	}

	loginListener = u => {
		const user = app.get('user')
		if(!this.state.user && user) {
			this.setState({ user })
		}
		this.fetchTickets()
	}

	fetchTickets = () => {
		app.service('tickets').find()
		.then(result => {
				// store tickets as a Map of _id = ticket.status pairs
			// console.log("Got tickets", result)
			const ticketsByGig = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
			// console.log("Got by gig", result)
			this.setState({ticketsByGig, tickets: result.data})
		})
		.catch(err => console.error)
	}

// Listen for tickets
	ticketCreated = t => {
		const {user} = this.state
		if(user && t.owner_id===user._id) {
			console.log("Ticket created", t)
			const {tickets, ticketsByGig} = this.state
			Object.assign(ticketsByGig, {[t.gig_id]: t.status})
			app.service('tickets').get(t._id)
			.then(ticket => this.setState({ticketsByGig, tickets: tickets.concat(ticket)}) )
		}
	}
	ticketRemoved = t => {
		// console.log("Ticket removed", t)
		const {user} = this.state
		if(user && t.owner_id===user._id) {
			console.log("Ticket removed", t)
			const {tickets, ticketsByGig} = this.state
			Object.assign(ticketsByGig, {[t.gig_id]: null})
			this.setState({ticketsByGig, tickets: tickets.filter(tk => tk._id!==t._id)})
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


	userPatched = u => {
		if(u) {
			const name = u.name || (u.facebook && u.facebook.name)
			const message = name + ' signed ' + (u.online ? 'in' : 'out')
			this.setState({snackbarOpen: true, message, tickets:[], ticketsByGig:{}})			
		}
		if(app.get('user') && u._id === app.get('user')._id) {
			this.fetchTickets()
		}
	}

	handleDrawer = (open, reason) => {
		// console.log(`Drawer: open: ${open} for ${reason}`)
		this.setState({drawerOpen: open})
	}
	handleSnackbarClose = () => this.setState({ snackbarOpen: false, message: ''})

	render() { 
		const {user, section, ticketsByGig, tickets} = this.state
		const {children} = this.props
		// inject our stuff
		const grandchildren = Object.assign({}, children, {props: {...children.props, tickets, ticketsByGig}})
		return (
		<MuiThemeProvider muiTheme={getMuiTheme(theme)}>
			<div>
				<AppBar 
					title={section}
					iconElementRight={
						user 
						?	<Link to='/my-schedule'><FlatButton label='My schedule' style={{color: 'white'}}/></Link>
						: 	<Link to='/login' activeStyle={{display: 'none'}}>
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
					{ user && <MenuItem key='logout' primaryText="Logout" onTouchTap={this.handleLogout}/>}
					{sections.map( section => 
						<MenuItem onTouchTap={this.handleMenu.bind(this, section)} primaryText={section.text} key={section.path}/>
					)}
				</Drawer>
				{grandchildren}
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