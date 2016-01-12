# function #

- __原生__
	
	> - __call__
	>
	>			call(rgb, 10, 100, 255) => #0a64ff
	>			call(scale-color, #0a64ff, $lightness: -10%) => #0058ef
	>			
	>			$fn: nth;
	>			call($fn, (a b c), 2) => b
	>
	> - __function-exists__
	>
	>			function-exists(lighten) => true
	>			
	>			@function myfunc { @return "something"; }
	>			function-exists(myfunc) => true

## 1. typeof

- __原生__

	> - __type-of__
	>
	>			type-of(100px)  => number
	>			type-of(asdf)   => string
	>			type-of("asdf") => string
	>			type-of(true)   => bool
	>			type-of(#fff)   => color
	>			type-of(blue)   => color

- __isNumber__

		isNumber(1px) => true

- __isString__

		isString(str) => true

- __isList__

		isList(a b c) => true

- __isMap__

		$map: (a:1, b:2);
		isMap($map) => true

- __isBool, isBoolean__

		isBool(true)     => true
		isBoolean(false) => true

- __isNull__

		isNull(null) => true

- __isArglist__

		@mixin abc($arg...) {
			isArglist($arg) => true
		}

- __isFunction__

		isFunction(call) => true

- __isMixin__

		@mixin abc() {
			width: 100%;
		}
		isMixin(abc) => true

- __isUnit__

		isUnit("")    => 没有单位  null
		isUnit("%")   => 是单位    true
		isUnit("abc") => 不是单位  false

- __isSelector__

		未完成


## 2. math

- 原生

	> - __abs__
	>
	>			abs(10px)  => 10px
	>			abs(-10px) => 10px
	>
	> - __ceil__
	>
	>			ceil(10.4px) => 11px
	>			ceil(10.6px) => 11px
	>
	> - __floor__
	>
	>			floor(10.4px) => 10px
	>			floor(10.6px) => 10px
	>
	> - __max__
	>
	>			max(1px, 4px) => 4px
	>			max(5em, 3em, 4em) => 5em
	>
	> - __min__
	>
	>			min(1px, 4px) => 1px
	>			min(5em, 3em, 4em) => 3em
	>
	> - __random__
	>
	>			[0, 1)区间的随机数
	>
	> - __round__
	>
	>			round(10.4px) => 10px
	>			round(10.6px) => 11px

- __math_pow__ `幂数是整数`

		math_pow(2, 3)   => 8
		math_pow(1.5, 2) => 2.25

- __cubic-bezier__ 

		cubic-bezier()               => cubic-bezier(0, 0, 1, 1) linear
		cubic-bezier(0.5, 0.5, 0, 1) => cubic-bezier(0.5, 0.5, 0, 1)


## 3. percent

- __原生__
	
	> - __percentage__
	>
	>			percentage(0.2)          => 20%
	>			percentage(100px / 50px) => 200%

- __percent__

		percent(10px, 100px) => 10%

## 4. deg

- __原生__

- __$pi__

		$pi: 3.14159265;

- __getDeg__ `将一个角度映射到[0, 360)区间`

		getDeg(-24deg) => 336deg
		getDeg(24deg)  => 24deg
		getDeg(384deg) => 24deg

- __sin__

		sin(1deg) => 0.0175

- __cos__

		cos(1deg) => 0.9998

## 5. selector

- __原生__

	> - __is-superselector__
	>
	>			is-superselector(".foo", ".foo.bar") => true
	>			is-superselector(".foo.bar", ".foo") => false
	>			is-superselector(".bar", ".foo .bar") => true
	>			is-superselector(".foo .bar", ".bar") => false
	>
	> - __selector-append__
	>
	>			selector-append(".foo", ".bar", ".baz") => .foo.bar.baz
	>			selector-append(".a .foo", ".b .bar")   => "a .foo.b .bar"
	>			selector-append(".foo", "-suffix")      => ".foo-suffix"
	>
	> - __selector-extend__
	>
	>			selector-extend(".a .b", ".b", ".foo .bar") => .a .b, .a .foo .bar, .foo .a .bar
	>
	> - __selector-nest__
	>
	>			selector-nest(".foo", ".bar", ".baz") => .foo .bar .baz
	>			selector-nest(".a .foo", ".b .bar")   => .a .foo .b .bar
	>			selector-nest(".foo", "&.bar")        => .foo.bar
	>
	> - __selector-parse__
	>
	>			selector-parse(".foo .bar, .baz .bang") => ('.foo' '.bar', '.baz' '.bang')
	>
	> - __selector-replace__
	>
	>			selector-replace(".foo .bar", ".bar", ".baz")        => ".foo .baz"
	>			selector-replace(".foo.bar.baz", ".foo.baz", ".qux") => ".bar.qux"
	>
	> - __selector-unify__
	>
	>			selector-unify(".a", ".b")       => .a.b
	>			selector-unify(".a .b", ".x .y") => .a .x .b.y, .x .a .b.y
	>			selector-unify(".a.b", ".b.c")   => .a.b.c
	>			selector-unify("#a", "#b")       => null
	>
	> - __simple-selectors__
	>
	>			simple-selectors(".foo.bar")     => ".foo", ".bar"
	>			simple-selectors(".foo.bar.baz") => ".foo", ".bar", ".baz"

## 6. unit

- __原生__

	> - __unit__
	>
	>			unit(100)                      => ""
	>			unit(100px)                    => "px"
	>			unit(3em)                      => "em"
	>			unit(10px * 5em)               => "em*px"
	>			unit(10px * 5em / 30cm / 1rem) => "em*px/cm*rem"
	>
	> - __unitless__
	>
	>			unitless(100)   => true
	>			unitless(100px) => false

- __getUnit__

		getUnit(1px)      => "px"  返回单位
		getUnit(1px, 3px) => true  判断单位是否相同

- __checkUnit__

		checkUnit(1px, "px") => true

- __isUnUnit, isUnitless__

		isUnUnit(1)     => true
		isUnitless(1px) => false

- __isPercent__

		isPercent(100%) => true

- __isPx, isPX__

		isPx(10px) => true
		isPX(100%) => false

- __isEm, isEM__

		isEm(10em) => true
		isEM(100%) => false

- __isRem, isREM__

		isRem(10rem) => true
		isREM(100%)  => false

- __isDeg, isDEG__

		isDeg(10deg) => true
		isDEG(100%)  => false

- __isS, isSecond__

		isS(10s)       => true
		isSecond(100%) => false

- __isMs, isMS, isMillisecond__

		isMs(10ms)          => true
		isMS(10s)           => false
		isMillisecond(100%) => false

- __isTime__

		isTime(10ms) => true

- __removeUnit__

		removeUnit(10ms) => 10

- __setUnit__

		setUnit(10, "ms")    => 10ms
		setUnit(10ms, "deg") => 10deg

## 7. list

- __原生__

	> - __append__
	>
	>			append(10px 20px, 30px)           => 10px 20px 30px
	>			append((blue, red), green)        => blue, red, green
	>			append(10px 20px, 30px 40px)      => 10px 20px (30px 40px)
	>			append(10px, 20px, comma)         => 10px, 20px
	>			append((blue, red), green, space) => blue red green
	>
	> - __index__
	>
	>			index(1px solid red, solid)                       => 2
	>			index(1px solid red, dashed)                      => null
	>			index((width: 10px, height: 20px), (height 20px)) => 2
	>
	> - __join__
	>
	>			join(10px 20px, 30px 40px)             => 10px 20px 30px 40px
	>			join((blue, red), (#abc, #def))        => blue, red, #abc, #def
	>			join(10px, 20px)                       => 10px 20px
	>			join(10px, 20px, comma)                => 10px, 20px
	>			join((blue, red), (#abc, #def), space) => blue red #abc #def
	>
	> - __length__
	>
	>			length(10px)                        => 1
	>			length(10px 20px 30px)              => 3
	>			length((width: 10px, height: 20px)) => 2
	>
	> - __list-separator__
	>
	>			list-separator(1px 2px 3px)   => space
	>			list-separator(1px, 2px, 3px) => comma
	>			list-separator('foo')         => space
	>
	> - __nth__
	>
	>			nth(10px 20px 30px, 1)                 => 10px
	>			nth((Helvetica, Arial, sans-serif), 3) => sans-serif
	>			nth((width: 10px, length: 20px), 2)    => length, 20px

- __spaceList__

		spaceList((red green blue)) => "red green blue"

- __commaList__

		spaceList((red green blue)) => "red,green,blue"

- __argsSort__

		argsSort((1px 1em 1rem), (rem px em)) => 1rem 1px 1em

## 8. string

- __原生__

	> - __quote__
	>
	>			quote("foo") => "foo"
	>			quote(foo)   => "foo"
	>
	> - __str-index__
	>
	>			str-index(abcd, a)  => 1
	>			str-index(abcd, ab) => 1
	>			str-index(abcd, X)  => null
	>			str-index(abcd, c)  => 3
	>
	> - __str-insert__
	>
	>			str-insert("abcd", "X", 1) => "Xabcd"
	>			str-insert("abcd", "X", 4) => "abcXd"
	>			str-insert("abcd", "X", 5) => "abcdX"
	>
	> - __str-length__
	>
	>			str-length("foo") => 3
	>
	> - __str-slice__
	>
	>			str-slice("abcd", 2, 3)   => "bc"
	>			str-slice("abcd", 2)      => "bcd"
	>			str-slice("abcd", -3, -2) => "bc"
	>			str-slice("abcd", 2, -2)  => "bc"
	>
	> - __to-lower-case__
	>
	>			to-lower-case(ABCD) => abcd
	>
	> - __to-upper-case__
	>
	>			to-upper-case(abcd) => ABCD
	>
	> - __unquote__
	>
	>			unquote("foo") => foo
	>			unquote(foo)   => foo

- 与原生相同带 `str-` 前缀

- __str-replace__

		str-replace("aaabbbccc", "a")             => "aabbbccc"
		str-replace("aaabbbccc", "a", "d")        => "daabbbccc"
		str-replace(".page1_btn_click", "_click") => .page1_btn (用于选择器需要加#{})

- __str-replace-g__

		str-replace-g("aaabbbccc", "b")      => "aaaccc"
		str-replace-g("aaabbbccc", "b", "d") => "aaadddccc"

- __str-capitalize__

		str-capitalize("abc") => "Abc"



