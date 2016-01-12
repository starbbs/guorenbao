'use strict';

// - FilterableProductTable 主容器
// 	- searchBar 搜索栏
// 	- ProductTable 产品表
// 		- ProductCategoryRow 分类表头
// 		- ProductRow 产品列

var React = require('react');

var FilterableProductTable = require('./store_FilterableProductTable.jsx');

React.render(<FilterableProductTable url="./store_data.json"></FilterableProductTable>, document.body);




