'use strict';

var React = require('react');

module.exports = React.createClass({
	render: function() {
		var product = this.props.product;
		var name = product.stocked ?
			product.name :
			<span style={{color: 'red'}} >
				{product.name}
			</span>
		return (
			<tr>
				<td>{name}</td>
				<td>{product.price}</td>
			</tr>
		);
	}
});