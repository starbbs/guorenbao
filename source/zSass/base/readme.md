
# base #

## 1. function

> 详见: [function/readme.md](https://github.com/ccforeverd/zSass/tree/master/base/function)

## 2. prefix

- __$prefix-global__

		$prefix-global: "webkit" "moz" "ms" "w3c" !default;

- __prefix__

		@include prefix("transition", "1s ease");
		=>	-webkit-transition: 1s ease;
			-moz-transition: 1s ease;
			-ms-transition: 1s ease;
			transition: 1s ease;

		@include prefix("display", "box", "suf", "webkit");
		=>	display: -webkit-box;


## 3. mixin

> 详见: [mixin/readme.md](https://github.com/ccforeverd/zSass/tree/master/base/mixin)

## 4. mobile

- __mobile-scroll__

		@include mobile-scroll;
		=>	-webkit-overflow-scrolling: touch;
			-overflow-scrolling: touch;

- __mobile-tap__

		@include mobile-tap;
		=> -webkit-tap-highlight-color: transparent;

## 5. extend

> 详见: [extend/readme.md](https://github.com/ccforeverd/zSass/tree/master/base/extend)












