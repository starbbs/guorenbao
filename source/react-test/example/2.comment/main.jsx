'use strict';

var React = require('react');
var CommentBox = require('./comment_box.jsx');

React.render(
	<CommentBox url="./comment_data.json" pollInterval={2000} />,
	document.getElementById('comment')
);






