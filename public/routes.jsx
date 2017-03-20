import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import Layout from './mui/layout.jsx'

import LoginForm from './mui/login-form.jsx'
import SignupForm from './mui/signup-form.jsx'

import ActDetailsPage from './mui/act-details-page.jsx'
import EventsList from './mui/events-list.jsx'
import EventPage from './mui/event-page.jsx'
import EventTrainPage from './mui/event-volunteer-page.jsx'
import EventVolunteerPage from './mui/event-volunteer-page.jsx'
import EventInfo from './mui/event-info.jsx'
import GigDetailsPage from './mui/gig-details-page.jsx'
import Lineup from './mui/lineup.jsx'

const Home = () => <div style={{textAlign:'center', margin:'3em'}}>
	<h2>Europa Roots - A Bulgarian Spring Project</h2>
	<p>For more information follow the rumors.</p>
</div>

const NotFound = () => <div style={{color:'red', textAlign:'center', margin:'3em'}}>
	<h2>She's not here.</h2>
</div>

const Tasks = () => <Lineup status='Volunteering' />

export const routes = 
	<Router history={browserHistory}>
		<Route path='/' component={Layout}>
			<IndexRoute component={Home} />

			<Route path='login' component={LoginForm} />
			<Route path='signup' component={SignupForm} />
			
			<Route path='acts/:actId' component={ActDetailsPage} />
			
			<Route path='events' component={EventsList} />
			<Route path='events/:eventId' component={EventPage} />
			<Route path='volunteer/:eventId' component={EventVolunteerPage} />
			<Route path='train/:eventId' component={EventTrainPage} />
			<Route path='eventinfo/:eventId' component={EventInfo} />

			<Route path='lineup' component={Lineup} />
			<Route path='tasks' component={Tasks} />

			<Route path='gigs/:gigId' component={GigDetailsPage} />
			
			<Route path='*' component={NotFound} />
		</Route>
	</Router>

export default routes;