'use strict';

var React = require('react');
var exchange = function(num) {
	return -1 < num && num < 10 ? "0" + num : "" + num
};

module.exports = React.createClass({
	render: function() {
		var time = this.props.time,
			parse = [
				time.getFullYear(),
				time.getMonth() + 1,
				time.getDate()
			].join('-') + ' ' + [
				exchange(time.getHours()),
				exchange(time.getMinutes()),
				exchange(time.getSeconds())
			].join(':');
		return (
			<div>
				<h1>Hello, world!</h1>
				<h4>{parse}</h4>
			</div>
		);
	}
});

