'use strict';

var React = require('react');

var ProductCategoryRow = require('./store_ProductCategoryRow.jsx');
var ProductRow = require('./store_ProductRow.jsx');

module.exports = React.createClass({
	render: function () {
		console.log(this.props);
		var rows = [];
		var lastCategory = null;
		this.props.products.forEach(function(product) {
			if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.isStockOnly)) {
				return;
			}
			if (product.category != lastCategory) {
				rows.push(<ProductCategoryRow category={product.category} key={product.category} ></ProductCategoryRow>);
			};
			rows.push(<ProductRow product={product} key={product.name} ></ProductRow>);
			lastCategory = product.category;
		}.bind(this));
		return (
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
});