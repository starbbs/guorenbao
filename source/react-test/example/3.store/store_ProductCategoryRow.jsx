'use strict';

var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<tr>
				<th colSpan="2">
					{this.props.category}
				</th>
			</tr>
		);
	}
});








