import React from 'react'
import moment from 'moment'

export const unique = array => array.filter((e, i, a) => a.indexOf(e)===i)

export const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

export const formatYMD = t => moment(t).format('YYYY-MM-DD')

export const sequence = n => Array.from(Array(n).keys())

export const hours24 = sequence(27)

function shouldShow(date, hour, job) {
	const t = moment(date).add(hour, 'hours')
	const mStart = moment(job.start)
	// console.log("T: ", t.format("YYYY-MM-DD HH:mm"))
	const starts = mStart.isSame(t, 'hour')
	const mEnd  = job.end && moment(job.end) || moment(job.start).add(1, 'hour')
	// console.log("end: ", mEnd.format("YYYY-MM-DD HH:mm"))
	const ends = job.end && mEnd && mEnd.diff(t, 'hours') == 1 //mEnd.isSame(t, 'hour')
	
	const show = t.isSameOrAfter(mStart, 'hour') && t.isBefore(mEnd, 'hour')
	return show ? {show, starts, ends} : null
}

export function jobsByDate(jobs) {
	let dates = new Map()
	jobs.forEach(job => {
		if(job.shifts.length) {
			job.shifts.forEach((shift, i) => {
				const date = formatYMD(shift.start)
				const t = dates.get(date) || {date, jobs: new Map()}
				const tjob = Object.assign({}, t.jobs.get(job._id) || {job, span: 1, hours: []})
				hours24.forEach(hour => {
					const show = shouldShow(date, hour, shift)
					let shown = 1
					if(show) {
						shown++
						const slot = tjob.hours[hour] || new Array(i)
						slot[i] = {shift, show}
						tjob.hours[hour] = slot
					}
					tjob.span = Math.max(tjob.span, shown)
				})
				t.jobs.set(job._id, tjob)
				dates.set(date, t)	
			})
		} else {
			const date = formatYMD(job.start)
			const t = dates.get(date) || {date, jobs: new Map}
			const tjob = Object.assign({}, t.jobs.get(job._id) || {job, span: 1, hours: []})
			hours24.forEach(hour => {
				const show = shouldShow(date, hour, job)
				if(show) {
					tjob.hours[hour] = Array.of({shift: job, show})
				}
			})
			t.jobs.set(job._id, tjob)
			dates.set(date, t)	
		}
	})

	const tables = Array.from(dates.entries(), e => {
		const {date, jobs} = e[1]
		return {
			date: moment(date), 
			jobs: Array.from(jobs.entries(), j => {
				const {job, span, hours} = j[1]
				const compact = hours.map(h => h.length > span ? squeeze(h, span) : h)
				return {job, span, hours: compact}
			})
		}
	})
	// console.log("TABLES>>>>", tables)
	return tables
}

export function sitesByDate(tickets) {
	let dates = new Map()
	tickets.forEach(ticket => {
		
			const date = formatYMD(ticket.gig.start)
			// console.log("ticket.date", date)
			const t = dates.get(date) || {date, jobs: new Map}
			// console.log("date.table", t)
			const tjob = Object.assign({}, t.jobs.get(ticket.gig.venue_id) || {job: ticket.gig, span: 1, hours: []})
			// console.log("TJOB", tjob)
			hours24.forEach(hour => {
				const show = shouldShow(date, hour, ticket.gig)
				// console.log("shown? ", show)
				if(show) {
					tjob.hours[hour] = Array.of({shift: ticket.gig, show})
				}
			})
			t.jobs.set(ticket.gig.venue_id, tjob)
			dates.set(date, t)	
	})
	const tables = Array.from(dates.entries(), e => {
		const {date, jobs} = e[1]
		return {
			date: moment(date), 
			jobs: Array.from(jobs.entries(), j => {
				const {job, span, hours} = j[1]
				const compact = hours.map(h => h.length > span ? squeeze(h, span) : h)
				return {job: job.venue, span, hours: compact}
			})
		}
	})
	// console.log("TABLESes >>>>", tables)
	return tables
}

function squeeze(hour, n) {
	const a = new Array(n)
	hour.forEach((h, i) => a[i%n] = h)
	return a
}



export const hacks = { Kspan }

export default hacks