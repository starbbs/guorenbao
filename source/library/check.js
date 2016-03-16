// 张树垚 2015-08-24 16:56:17 创建
// 检测模块


define('check', function() {

	String.prototype.reverse = String.prototype.reverse || function() {
		return this.split('').reverse().join('');
	};
	String.prototype.join = String.prototype.join || function(arg) {
		return Array.prototype.join.call(this, arg);
	};

	var messages = { // 提示语
		'200': '验证成功',
		'310': '请输入正确的手机号',
		'311': '手机号不能为空',
		'320': '不是正确的密码格式',
		'321': '密码不能为空',
		'322': '非6-20位字符',
		'323': '只能包含字母、数字以及标点符号（除空格）',
		'324': '大写字母、小写字母、数字以和标点符号至少两种',
		'330': '不是正确的支付密码',
		'331': '不是六位数字',
		'332': '六位相同数字',
		'333': '六位连续数字',
		'340': '不是正确的验证码格式'
	};
	var result = function(code) {
		return {
			result: code === '200',
			code: code,
			message: messages[code]
		};
	};
	var check = {};
	var trim = function(value) { // 字符串整理
		return (value + '').trim();
	};
	var empty = check.empty = function(value) { // 是否为空
		if (typeof value === 'undefined' || value == undefined) { // null, undefined
			return true;
		}
		if (typeof value === 'string') {
			return trim(value) === '';
		}
		if ($.isArray(value)) {
			return value.length === 0;
		}
		if ($.isPlainObject(value)) {
			return $.isEmptyObject(value);
		}
		if ($.isNumeric(value)) {
			return parseFloat(value) == 0;
		}
		return false;
	};
	var characters = function(value) { // 字符种类数
		var count = 0;
		charactersRegs.forEach(function(re) {
			re.test(value) && count++;
		});
		return count;
	};
	var charactersRegs = [ // 字符所有种类
		/[A-Z]/, // 大写字符
		/[a-z]/, // 小写字符
		/[\d]/, // 数字
		/[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\|\[\]\{\}\;\:\"\'\,\<\.\>\/\?]/ // 标点
	];
	var charactersReg = new RegExp('^' + charactersRegs.join('').replace(/^\/|\/$|\]\/\/\[/g, '') + '+$'); // /^[a-zA-Z\d\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\|\[\]\{\}\;\:\"\'\,\<\.\>\/\?]+$/.test(value) 串联正则
	var paypassAvailable = (function(length) { // 支付密码格式
		var numbers = '01234567890';
		// [提示文字, 校验结果, 校验正则]
		// if(校验正则.test(value) === 校验结果) { alert(提示文字); }
		return [
			['331', false, new RegExp('^(\\d{' + length + '})$')],
			['332', true, new RegExp('^(' + numbers.join('{' + length + '}|') + '{' + length + '})$')],
			['333', true, (function() {
				var array = [];
				for (var i = 0; i < numbers.length; i++) {
					array.push(numbers.slice(i, length + i));
					array.push(numbers.slice(i, length + i).reverse());
					if (length + i === numbers.length) {
						break;
					}
				}
				return new RegExp('^(' + array.join('|') + ')$');
			})()]
		];
	})(6);

	/** 校验
	 * @Author   张树垚
	 * @DateTime 2015-11-19T13:44:52+0800
	 * @param	{任意类型}	value	[传入参数]
	 * @return	1.{boolean}			[是否满足校验]
	 *         	2.{json}
	 *         		json.result		{boolean}	[是否满足条件]
	 *         		json.reason		{string}	[校验失败的原因]
	 */
	$.extend(check, {
		// 简单校验
		number: function(value) { // 数字类型
			return $.isNumeric(value);
		},
		gopBuyValidate: function(value, gopPrice) { // 买入校验
			return (parseFloat(value)>=1&&parseFloat(value)<=3000);
			//return parseFloat(value) / parseFloat(gopPrice) >= 0.01;
		},
		// 有oninput校验条件
		card: function(value) { // 银行卡校验
			return /^((\d{16})|(\d{19}))$/.test(trim(value));
		},
		cardCondition: function(value) {
			if (value.length === 16 || value.length === 19 || value.length === 18) {
				return true;
			} else {
				return false;
			}
			//return value.length === 16 || value.length === 19;
		},
		idcard: function(value) { // 身份证验证
			return /^((\d{15})|(\d{17}[\dXx]))$/.test(trim(value));

		},
		idcardCondition: function(value) {
			return value.length >= 15;
		},
		ident: function(value) { // 验证码
			return result(/\d{6}/.test(trim(value)) ? '200' : '340');
		},
		identCondition: function(value) {
			return value.length >= 6;
		},
		realname: function(value) { // 人名校验
			return /[\u4e00-\u9fa5]{2,}/.test(trim(value));
		},
		realnameCondition: function(value) {
			return value.length > 2;
		},
		// 复杂校验
		password: function(value) { // 登录密码格式验证
			//密码不为空
			if (empty(value)) {
				return result('321');
			}
			// 1. 6-20位字符
			if (value.length < 6 || value.length > 20) {
				return result('322');
			}
			// 2. 只能包含字母、数字以及标点符号（除空格）
			if (!charactersReg.test(value)) {
				return result('323');
			}
			// 3. 大写字母、小写字母、数字以和标点符号至少两种
			if (characters(value) < 2) {
				return result('324');
			}
			return result('200');
		},
		passwordCondition: function(value) {
			return value.length >= 6;
		},
		paypass: function(value) { // 支付密码格式验证
			return value.length === 6;
		},
		paypassCondition: function(value) {
			return value.length === 6;
		},
		paypass2: function(value) { // 支付密码格式验证 -- 旧版
			if (empty(value)) {
				return false;
			}
			// 1. 交易密码为6位数字
			if (!/^\d{6}$/.test(value)) {
				return {
					result: false,
					reason: '非六位数字'
				};
			}
			// 2. 不要使用连续的数字
			if (['012345', '123456', '234567', '345678', '456789', '567890', '543210', '654321', '765432', '876543', '987654', '098765'].indexOf(value) > -1) {
				return {
					result: false,
					reason: '是连续数字'
				};
			}
			// 3. 不要使用相同数字
			if (/^\d$/.test((value / 111111) + '')) {
				return {
					result: false,
					reason: '是相同数字'
				};
			}
			return {
				result: true
			};
		},
		paypass3: function(value) { // 支付密码格式验证 -- 次版
			for (var i = 0; i < paypassAvailable.length; i++) {
				if (paypassAvailable[i][2].test(value) === paypassAvailable[i][1]) {
					return result(paypassAvailable[i][0]);
				}
			}
			return result('200');
		},
		phone: function(value) { // 手机号校验
			if (empty(value)) {
				return result('311');
			}
			return result(/^(\+86)?((13[0-9])|(14[57])|(15[0-35-9])|(17[0678])|(18[0-9]))\d{8}$/.test(value + '') ? '200' : '310');
		},
		phoneCondition: function(value) {
			return value.length >= 11;
		},
		safe: function(value, withoutPassword) {
			if (check.safeCondition(value)) {
				if (!withoutPassword) { // 是否验证密码格式
					var password = check.password(value);
					// if (password === false || password.result === false) { return '密码格式不正确'; }
					if (password === false || password.result === false) {
						return '低';
					}
				}
				// total: 总等级数
				// 字符种类数/字符位数   6-10位(0)   11-15位(1)   16-20位(2)
				//       2(0)           低(0)       低(1)        中(2)
				//       3(1)           低(1)       中(2)        高(3)
				//       4(2)           中(2)       高(3)        高(4)
				var num = function(arr, str) { // 判断位置
					var now = arr.length - 1;
					for (var i = 0; i < arr.length; i++) {
						if (arr[i] > str) {
							now--;
						}
					}
					return now;
				};
				return ['低', '低', '中', '高', '高'][num([6, 11, 16], value.length) + num([2, 3, 4], characters(value))];
			}

		},
		safeCondition: function(value) {
			return value.length >= 6;
		}
	});

	/** check扫描
	 * @Author   张树垚
	 * @DateTime 2015-11-19T11:31:20+0800
	 * input绑定属性:
		data-check='xxx'			启用check组件, 值为要使用的校验
		data-check-type='xxx'		绑定的方法, change|input|blur, 若为input则 1.何时使用校验 2.输入校验 3.失焦校验
		data-check-success='xxx'	校验成功后添加的样式(默认为success), 若设置其为false, 则校验成功后不添加success样式
		data-check-error='xxx'		校验失败后添加的样式(默认为error), 若设置其为false, 则校验失败后不添加error样式
	 */
	check.selector = 'input[data-check]';
	check.scan = function(context) { // 扫描
		$(this.selector, context).each(function() {
			new Check(this);
		});
	};

	/** Check类
	 * @Author   张树垚
	 * @DateTime 2015-11-19T16:58:44+0800
	 * @param    {domInputElement}		element		要绑定的input的元素
	 */
	var Check = function(element) {
		this.element = element; // 元素
		element.check = this; // 将校验类绑定到元素上
		this.data = element.dataset; // 绑定数据
		this.kind = this.data.check; // 校验种类
		if (this.kind in check) {
			this.init();
		} else {
			element.dataset.check += ':不存在于check中';
		}
	};
	Check.prototype.init = function() { // 设置
		this.self = $(this.element); // jQuery对象
		this.type = this.data.checkType || 'blur'; // 默认失焦校验
		this.condition = this.kind + 'Condition'; // input校验条件
		this.classSuccess = this.data.classSuccess === 'false' ? '' : (this.data.classSuccess || 'success'); // 校验成功后添加样式
		this.classError = this.data.classError === 'false' ? '' : (this.data.classError || 'error'); // 校验失败后添加样式
		this.classOther = 'other'; // 校验出现其他情况后添加样式
		this.classAll = [this.classSuccess, this.classError, this.classOther].join(' ') // 所有用到的样式
		this.bind();
	};
	Check.prototype.bind = function() { // 绑定
		this.self.on('focus', this.onFocus);
		if (this.type === 'input') {
			this.self.on('input', this.onInput);
			this.self.on('blur', this.onBlur);
		} else {
			this.self.on(this.type, this.onBlur); // 'change', 'blur', 'focus'
		}
	};
	Check.prototype.onFocus = function() { // 获得焦点 -- this->InputElement, _this->Check
		this.check.self.removeClass(this.classAll);
	};
	Check.prototype.onInput = function() { // 输入时 -- this->InputElement, _this->Check
		var _this = this.check;
		if (_this.condition in check && !check[_this.condition](this.value)) {
			return;
		}
		_this.onBlur.call(this);
	};
	Check.prototype.onBlur = function() { // 失去焦点 -- this->InputElement, _this->Check
		var _this = this.check;
		_this.result = check[_this.kind](this.value);
		_this.self.addClass(_this.addClass);
	};
	Check.prototype.addClass = function() { // 最终要添加的class
		if (this.result === true || this.result.result === true) {
			return this.classSuccess; // 正确
		} else if (this.result === false || this.result.result === false) {
			return this.classError; // 错误
		} else {
			return this.classOther; // 意外
		}
	};
	Check.prototype.config = function(config) { // 设置
		$.extend(this, config);
	};

	check.scan();

	/** jQuery补充 -- 判断是否校验成功
	 * @Author   张树垚
	 * @DateTime 2015-11-19T17:13:25+0800
	 * @return   {[type]}                 [description]
	 */
	$.fn.check = function() {
		var array = this.find(check.selector);
		var i = 0;
		var l = array.length;
		for (; i < l; i++) {
			if (array[i].check.result !== true) {
				return false;
			}
		}
		return true;
	};


	return check;
});