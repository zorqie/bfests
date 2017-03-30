const styles = {
	gigType: {
		fontSize: '12dp',
		fontWeight: '300',
		float: 'right'
	},
	duration: {
		fontSize: 'smaller',
		color: 'grey'
	},
	dateInput: {
		width: '10em',
		marginRight: '2em'
	},
	timeInput: {
		width: '10em',
		marginRight: '2em'
	},
	footer: {
		position: 'fixed', 
		bottom: 0, 
		right: '1em', 
		fontSize: 'smaller', 
		
	},

	scheduleDate: {
		fontFamily: 'Roboto, sans-serif',
		fontWeight: 300,
		fontSize: '24px',
		padding: '24px',
		textAlign: 'left',
		whiteSpace: 'nowrap',
	},
	
	lineup: {
		date: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 300,
			fontSize: '24px'
		},
		item: {
			verticalAlign: 'top',
		},
		time: {
			verticalAlign: 'top',
			display: 'inline-block',
			fontWeight: 300,
			width: '30%',
		},
		gig: {
			display: 'inline-block',
			width: '40%',
		},
		name: {
			fontWeight: 500,
		},
		venue: {
			verticalAlign: 'top',
			display: 'inline-block',
			fontSize: 'small',
			fontWeight: 300,
			letterSpacing: '2px',
			textTransform: 'uppercase',
			width: '30%',
		},
		acts: {
			fontSize: 'small',
			fontWeight: 300,
			color: 'rgba(0, 0, 0, 0.870588)',
		}
	}
}

export default styles