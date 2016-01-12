'use strict';

var React = require('react');
var $ = require('../../tools/jquery-1.10.0.min.js');
var CommentList = require('./comment_list.jsx');
var CommentForm = require('./comment_form.jsx');

module.exports = React.createClass({
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data})
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString())
			}.bind(this)
		});
	},
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		var newComments = comments.concat([comment]);
		console.log(newComments)
		this.setState({data: newComments});
		// TODO: submit to the server and refresh the list
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		// setInterval(this.loadCommentsFromServer, this.props.pollInterval)
	},
	render: function() {
		return (
			<div className="comment_box">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
			</div>
		);
	}
})