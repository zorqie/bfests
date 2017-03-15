import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import moment from 'moment';

const ShiftDialog = ({ shift, open, onCancel, onSubmit }) => {
	const actions = [
					<FlatButton
						label={onSubmit ? "Cancel": "Ok"}
						primary={true}
						onTouchTap={onCancel}
					/>,
				]
	if(onSubmit) {
		actions.push(<RaisedButton
			label="Save"
			primary={true}
			onTouchTap={onSubmit}
		/>)
	}
	return <Dialog 
				open={open}
				actions={actions}
				onRequestClose={onCancel}
			>
				<form >
					<div>
						<TextField 
							name='name'
							floatingLabelText="Name"
							value={shift.name || ''} 
							maxLength={30}
						/>
						<TextField 
							name='venue'
							floatingLabelText="Location"
							value={(shift.venue && shift.venue.name) || ''} 
						/>
					</div>
					<TextField 
						name='description'
						floatingLabelText="Short description"
						value={shift.description || ''} 
						fullWidth={true}
						maxLength={60}
					/>
					<div>
						<TextField 
							type='date'
							name='start'
							floatingLabelFixed={true}
							floatingLabelText="Start date"
							value={(shift.start && moment(shift.start).format('YYYY-MM-DD')) || ''} 
						/>
						<TextField 
							type='time'
							name='startTime'
							floatingLabelFixed={true}
							floatingLabelText="Start time"
							value={(shift.start && moment(shift.start).format('HH:mm')) || ''} 
						/>
					</div>
					<div>
						<TextField 
							type='date'
							name='end'
							floatingLabelFixed={true}
							floatingLabelText="End date"
							value={(shift.end && moment(shift.end).format('YYYY-MM-DD')) || ''} 
						/>
						<TextField 
							type='time'
							name='endTime'
							floatingLabelFixed={true}
							floatingLabelText="End time"
							value={(shift.end && moment(shift.end).format('HH:mm')) || ''} 
						/>
					</div>
				</form>
			</Dialog>
}
export default ShiftDialog