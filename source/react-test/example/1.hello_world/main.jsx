'use strict';

var React = require('react');
var HelloWorld = require('./hello_world.jsx');

React.render(
	<HelloWorld time={new Date()}/>, // 必须首字母大写, 否则编译出来带引号
	document.getElementById('hello_world')
);







