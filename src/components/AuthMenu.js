import React, { Component } from 'react'

export default class AuthMenu extends Component {
	constructor(props) {
		super(props)
	}

	_handleAuthClick = () => {
		this.props.onHandleAuthClick()
	}

	// Set the access token
	_handleGrantClick = () => {
		this.props.onHandleGrantClick()
	}

	render() {
		return (
			<div>
				<button onClick={this._handleAuthClick} type="button">Request Authorization</button>
				<button onClick={this._handleGrantClick} type="button">ImplicitGrant</button>
			</div>
		)
	}
}