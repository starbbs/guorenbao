
// 张树垚 2015-09-02 14:15:09 创建
// 银行构造器

define(function() {
	var index = 0;
	var Bank = function(name, en, id) {
		en = en || 'default';
		index ++;
		this.id = id || index;
		this.name = name;
		this.en = en;
		this.className = 'bank-img-' + en;
		this.iconName = 'bank-icon-' + en;
	};
	Bank.prototype.getId = function() {
		return this.id;
	};
	Bank.prototype.getName = function() {
		return this.name;
	};
	Bank.prototype.getEnName = function() {
		return this.en;
	};
	Bank.prototype.getClassName = function() {
		return this.className;
	};
	Bank.prototype.getIconName = function() {
		return this.iconName;
	};
	return Bank;
});

