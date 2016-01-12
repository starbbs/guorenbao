'use strict';

var React = require('react');
// var Showdown = require('../tools/showdown.min.js'); // require('fs')返回空对象
var converter = new Showdown.converter();

module.exports = React.createClass({
	render: function() {
		// console.log(this.props.children.toString())
		var rawMarkup = converter.makeHtml(this.props.children.toString());
		return (
			<div className="comment">
				<h2 className="comment-author">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={{__html: rawMarkup}}></span>
			</div>
		);
	}
})