'use strict';

var React = require('react');

module.exports = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var inputAuthor = this.refs.author.getDOMNode();
		var textAuthor = this.refs.text.getDOMNode();
		var author = inputAuthor.value.trim();
		var text = textAuthor.value.trim();
		if (!author || !text) {
			return;
		}
		this.props.onCommentSubmit({
			author: author,
			text: text
		});
		inputAuthor.value = '';
		textAuthor.value = '';
		return;
	},
	render: function() {
		return (
			<form className="comment_form" onSubmit={this.handleSubmit} >
				<input type="text" placeholder="Your name" ref="author" />
				<input type="text" placeholder="Say something..." ref="text" />
				<input type="submit" valur="Post"/>
			</form>
		);
	}
})