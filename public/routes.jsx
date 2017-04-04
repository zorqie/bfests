import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, IndexRoute, Link, browserHistory } from 'react-router'

import Layout from './mui/layout.jsx'

import LoginForm from './mui/login-form.jsx'
import SignupForm from './mui/signup-form.jsx'

import ActDetailsPage from './mui/act-details-page.jsx'
import EventsList from './mui/events-list.jsx'
import EventPage from './mui/event-page.jsx'
import EventPurchasePage from './mui/event-purchase.jsx'
import EventTrainingPage from './mui/event-training.jsx'
import EventTrainPage from './mui/event-volunteer-page.jsx'
import EventVolunteerPage from './mui/event-volunteer-page.jsx'
import EventInfo from './mui/event-info.jsx'
import GigDetailsPage from './mui/gig-details-page.jsx'
import Lineup from './mui/lineup.jsx'
import MyGigs from './mui/my-gigs.jsx'
import Passes from './mui/passes.jsx'
import QrPage from './mui/qr-check.jsx'
import SitePage from './mui/site-details-page.jsx'
import Schedule from './mui/event-schedule.jsx';
import MySchedule from './mui/my-schedule.jsx';

const Home = () => <div style={{textAlign:'center', margin:'3em'}}>
	<h2>Europa Roots - A Bulgarian Spring Project</h2>
	<p>For more information follow the rumors.</p>
</div>

const NotFound = () => <div style={{color:'red', textAlign:'center', margin:'3em'}}>
	<h2>She's not here.</h2>
</div>

// make sure we pass along all (props)
const Tasks = (props) => <Lineup {...props} status='Volunteering' />

export const routes = 
	<Router history={browserHistory}>
		<Route path='/' component={Layout}>
			<IndexRoute component={Home} />

			<Route path='login' component={LoginForm} />
			<Redirect from='auth/success' to='events' />
			<Route path='signup' component={SignupForm} />
			
			{// TODO move items under event/:id
				// like event/:eventId/gig/:gigId and keep tickets object in Event
			}

			<Route path='acts/:actId' component={ActDetailsPage} />
			
			<Route path='events' component={EventsList} />
			<Route path='events/:eventId' component={EventPage} />
			<Route path='volunteer/:eventId' component={EventVolunteerPage} />
			<Route path='eventinfo/:eventId' component={EventInfo} />

			<Route path='purchase/:eventId' component={EventPurchasePage} />
			
			<Route path='train/:eventId' component={EventTrainPage} />
			<Route path='training/:eventId' component={EventTrainingPage} />

			<Route path='gig/:gigId' component={GigDetailsPage} />
			
			<Route path='schedule/:eventId(/:type)' component={Schedule} />
			<Route path='my-schedule(/:eventId)' component={MySchedule} />
			
			<Route path='sites/:venueId' component={SitePage} />

			<Route path='lineup' component={Lineup} />
			<Route path='tasks' component={Tasks} />

			{/*TODO these should be restricted to role*/}
			<Route path='performances' component={MyGigs} />

			<Route path='gigs/:gigId' component={GigDetailsPage} />
			
			<Route path='passes(/:eventId)' component={Passes} />

			<Route path='checkqr/:ticketId/:seqId/:userId' component={QrPage} />


			<Route path='*' component={NotFound} />
		</Route>
	</Router>

export default routes;