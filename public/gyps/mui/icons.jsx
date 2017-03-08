import React from 'react'

import SvgIcon from 'material-ui/SvgIcon';
import FontIcon from 'material-ui/FontIcon';

export const addBoxOutline = <SvgIcon viewBox="0 0 60 60">
	<path d="M0,0v60h60V0H0z M58,58H2V2h56V58z"/>
	<polygon points="29,51 31,51 31,31 51,31 51,29 31,29 31,9 29,9 29,29 9,29 9,31 29,31 	"/>
</SvgIcon>

export const addIcon = <FontIcon className="material-icons" >add</FontIcon>
export const addBoxIcon = <FontIcon className="material-icons" >add_box</FontIcon>

export const removeIcon = <FontIcon className="material-icons" >remove</FontIcon>
export const removeBox = <SvgIcon viewBox="0 0 455 455">
	<path d="M0,0v455h455V0H0z M358.865,242.5h-263v-30h263V242.5z" />
	<polygon points="29,51 31,51 31,31 51,31 51,29 31,29 31,9 29,9 29,29 9,29 9,31 29,31 	"/>
</SvgIcon>

export const plusOutline = <SvgIcon viewBox="0 0 24 24">
	<path d="M21,1H3C1.896,1,1,1.896,1,3v18c0,1.104,0.896,2,2,2h18c1.104,0,2-0.896,2-2V3C23,1.896,22.104,1,21,1z M21,21H3V3h18V21z
			"/>
		<polygon points="11,19 13,19 13,13 19,13 19,11 13,11 13,5 11,5 11,11 5,11 5,13 11,13 		"/>
</SvgIcon>

export const minusBox = <SvgIcon viewBox="0 0 24 24">
	<path d="M21,1H3C1.896,1,1,1.896,1,3v18c0,1.104,0.896,2,2,2h18c1.104,0,2-0.896,2-2V3C23,1.896,22.104,1,21,1z M19,13H5v-2h14V13z
		"/>
</SvgIcon>

export const Icons = { 
	addIcon, addBoxIcon, addBoxOutline,
	removeBox,
	plusOutline, minusBox
}

export default Icons