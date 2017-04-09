import React from 'react';

import { Link, browserHistory } from 'react-router';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
import {List} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';

import app from '../main.jsx';
import errorHandler from './err'

const hasRole = (user, role) => {
	return user && user.roles && user.roles.indexOf(role) > -1
}

const userSections = [
	{
		text: "My lineup",
		path: "/lineup",
	},
	{
		text: "My tasks",
		path: "/tasks",
	},
	{
		text: "My performances",
		path: "/my-gigs",
		role: "performer",
	},
	{
		text: "My workshops",
		path: "/workshops",
		role: "master",
	},
	// {
	// 	text: "My schedule",
	// 	path: "/my-schedule",
	// },
]

export default function UserCard ({ user, onNavigate }) { 
	return <Card>
				<CardHeader
					title={user.name || (user.facebook && user.facebook.name)}
					subtitle={user.email}
					avatar=""
				/>
				<List>
					{userSections.map(s => {
						return (!s.role || hasRole(user, s.role)) 
							? <MenuItem key={s.text} primaryText={s.text} onTouchTap={onNavigate.bind(null, s)} /> 
							: null
					})}
				</List>
				}
			</Card>
}