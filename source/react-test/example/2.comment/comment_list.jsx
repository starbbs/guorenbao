'use strict';

var React = require('react');
var Comment = require('./comment.jsx');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="comment_list">
				{
					this.props.data.map(function(item) {
						return (
							<Comment author={item.author}>
								{item.text}
							</Comment>
						);
					})
				}
			</div>
		);
	}
})