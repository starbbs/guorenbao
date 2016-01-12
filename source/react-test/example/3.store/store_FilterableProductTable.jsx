'use strict';

var React = require('react');
var $ = require('../../tools/jquery-1.10.0.min.js');

var SearchBar = require('./store_SearchBar.jsx');
var ProductTable = require('./store_ProductTable.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			filterText: '',
			isStockOnly: false,
			products: []
		};
	},
	handleUserInput: function(filterText, isStockOnly) {
		// var newState = JSON.parse(JSON.stringify(this.state));
		// var newState = this.state;
		// newState.filterText = filterText;
		// newState.isStockOnly = isStockOnly
		this.setState({ // 将传入的对象与原state合并
			filterText: filterText,
			isStockOnly: isStockOnly
		});
	},
	componentDidMount: function() {
		var _this = this;
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				// var newState = JSON.parse(JSON.stringify(_this.state));
				// var newState = _this.state;
				// newState.products = data;
				_this.setState({
					products: data
				});
			},
			error: function(xhr, status, err) {
				console.log(_this.props.url, status, err.toString())
			}
		});
	},
	render: function() {
		return (
			<div>
				<SearchBar
					filterText={this.state.filterText}
					isStockOnly={this.state.isStockOnly}
					onUserInput={this.handleUserInput}
				/>
				<ProductTable
					products={this.state.products}
					filterText={this.state.filterText}
					isStockOnly={this.state.isStockOnly}
				/>
			</div>
		);
	}
});








