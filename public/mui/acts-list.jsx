import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import { Kspan } from './hacks.jsx'

export default function ActsList ({ acts, compact, title, onSelect, onEdit, onDelete }) {
	console.log("ACTS", acts)
	return <List>
		{acts.length && title || ''}
		{acts.map(act => 
			<ListItem 
				key={act._id} 
				primaryText={act.name}
				onTouchTap={onSelect ? onSelect.bind(null, act) : ()=>null}
				secondaryText={compact ? '' : (act.description || ' ')}
				rightIconButton={<Kspan>
					{onEdit && <FlatButton label="Edit" onTouchTap={onEdit.bind(null, act)}/>}
					{onDelete && <FlatButton label="Delete" onTouchTap={onDelete.bind(null, act)}/>}
				</Kspan>}
			/>
		)}
	</List>
}
