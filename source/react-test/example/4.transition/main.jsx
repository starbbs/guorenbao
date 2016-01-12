'use strict';

var React = require('react/addons');
var Transition = React.addons.CSSTransitionGroup;

var TodoList = React.createClass({
	getInitialState: function() {
		return {
			items: ['hello', 'world', 'click', 'me']
		};
	},
	handleAdd: function() {
		var newItems = this.state.items.concat([])
	},
	handleRemove: function() {},
	render: function() {
		var items = this.state.items.map(function(item) {
			return (
				<div key={item} onClick={this.handleRemove.bind(this, i)} >{item}</div>
			);
		}.bind(this));
		return (
			<div>
				<botten onClick="this.handleAdd" >Add Item</botten>
				<Transition transitionName="example" >{items}</Transition>
			</div>
		);
	}
});






