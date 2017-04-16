import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, IndexRoute, Link, browserHistory } from 'react-router'

import Layout from './mui/layout.jsx'

import LoginForm from './mui/login-form.jsx'
import SignupForm from './mui/signup-form.jsx'

import ActDetailsPage from './mui/act-details-page.jsx'
import EventsList from './mui/events-list.jsx'

import EventPage from './mui/event/details-page.jsx'
import EventPurchasePage from './mui/event/purchase.jsx'
import EventTrainingPage from './mui/event/training.jsx'
import EventVolunteerPage from './mui/event/volunteer-page.jsx'
import EventSchedule from './mui/event/schedule.jsx';
import EventInfo from './mui/event/info.jsx'
import EventGrid from './mui/event/details-grid.jsx'
import EventCards from './mui/event/details-cards.jsx'

import GigDetailsPage from './mui/gig-details-page.jsx'
import Lineup from './mui/lineup.jsx'
import MyAct from './mui/my-act.jsx'
import MyGigs from './mui/my-gigs.jsx'
import MyGigDetails from './mui/my-gig-details.jsx'
import MyProfile from './mui/my-profile.jsx'
import Passes from './mui/passes.jsx'
import QrPage from './mui/qr-check.jsx'
import SitePage from './mui/site-details-page.jsx'
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
		<Route path='/checkqr/:ticketId/:seqId/:userId' component={QrPage} />
		<Route path='/' component={Layout}>
			<IndexRoute component={Home} />

			<Route path='login' component={LoginForm} />
			<Redirect from='auth/success' to='events' />
			<Route path='signup' component={SignupForm} />
			
			<Route path='acts/:actId' component={ActDetailsPage} />
			<Route path='gig/:gigId' component={GigDetailsPage} />
			<Route path='sites/:venueId' component={SitePage} />
			
			<Route path='events' component={EventsList} />
			<Route path='events/:eventId(/:type)' component={EventPage} />
			<Route path='volunteer/:eventId' component={EventVolunteerPage} />
			<Route path='eventinfo/:eventId' component={EventInfo} />
			<Route path='grid/:eventId' component={EventGrid} />
			<Route path='cards/:eventId' component={EventCards} />

			<Route path='purchase/:eventId' component={EventPurchasePage} />
			
			<Route path='training/:eventId' component={EventTrainingPage} />

			<Route path='schedule/:eventId(/:type)' component={EventSchedule} />
			
			<Route path='my-gigs' component={MyGigs} />
			<Route path='my-gigs/:gigId' component={MyGigDetails} />

			<Route path='my-act/:actId' component={MyAct} />
			<Route path='my-lineup' component={Lineup} />
			<Route path='my-profile' component={MyProfile} />
			<Route path='my-schedule(/:eventId)' component={MySchedule} />
			<Route path='my-tasks' component={Tasks} />

			<Route path='passes(/:eventId)' component={Passes} />

			<Route path='*' component={NotFound} />
		</Route>


	</Router>

export default routes;