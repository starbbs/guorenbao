'use strict';

var React = require('react');

module.exports = React.createClass({
	handleChange: function() {
		this.props.onUserInput(
			this.refs.filterTextInput.getDOMNode().value,
			this.refs.inStockOnlyInput.getDOMNode().checked
		);
	},
	render: function() {
		return (
			<form>
				<input
					type="text"
					placeholder="Search..."
					value={this.props.filterText}
					ref="filterTextInput"
					onChange={this.handleChange}
				/>
				<p>
					<input
						type="checkbox"
						checked={this.props.isStrockOnly}
						ref="inStockOnlyInput"
						onChange={this.handleChange}
					/>
					{' '}
					Only show products in stock
				</p>
			</form>
		);
	}
});