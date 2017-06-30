import React, { Component } from 'react'

export default class Video extends Component {
	render() {
		return (
			<div>
				<div id="player"></div>
				<div>Currently playing: </div>
			</div>
		)
	}
}