import React from 'react'
import { browserHistory } from 'react-router'

import ContentAdd from 'material-ui/svg-icons/content/add'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import {Tabs, Tab} from 'material-ui/Tabs'


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import app from '../main.jsx'
import GigListItem from './gig-list-item.jsx'

export default class ActDetailsPage extends React.Component {
	state = {
		act: {},
		gigs:[], 
	}

	componentWillMount() {
		app.authenticate().then(this.fetchData)

		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('patched', this.fetchData)
		app.service('gigs').on('removed', this.removedListener)
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('patched', this.fetchData)
			app.service('gigs').removeListener('removed', this.removedListener)
		}
	}

	createdListener = gig => {
		console.log("Added: ", gig)
		// TODO this will add any gigs, even if not by this act
		this.setState({gigs: this.state.gigs.concat(gig)})
	}

	removedListener = gig => {
		console.log("Removed: ", gig)
		this.setState({gigs: this.state.gigs.filter(v => v._id !== gig._id)})
	}

	fetchData = () => {
		const {actId} = this.props.params
		// console.log("Looking for parent: " + parentId)
		app.service('acts').get(actId)
		.then(act => {
			document.title = act.name
			app.service('gigs').find({query: {act_id: act._id, $sort: { start: 1}}})
			.then(result => {
				this.setState({...this.state, act, gigs: result.data})
			})
		})
		.catch(err => console.error("ERAR: ", err))
	}
	selectGig = gig => browserHistory.push('/gig/'+gig._id)

	render() {
		// console.log("VenuePage props: ", this.props)
		const { act, gigs } = this.state

		const title = <CardTitle 
			title={act.name} 
			subtitle={act.description} 
			actAsExpander={true} 
			showExpandableButton={true}
		/>
		return (
			<Card>
			    {title}
			    {act.poster_uri && 
			    	<CardMedia overlay={title} expandable={true}>
						<img src={act.poster_uri} />
					</CardMedia>
				}
				<CardText>
					{gigs.map(gig =>
						<GigListItem 
							key={gig._id} 
							gig={gig} 
							onSelect={this.selectGig.bind(this, gig)}
						/>
					)}
				</CardText>
				
			</Card>
		)
	}
}

