# mixin #

		默认 -webkit- 前缀

## 1. animation

- __基本__

	> - __keyframes__
	>
	>			@include keyframes(frame, webkit w3c) {
	>				0%   { opacity: 0; }
	>				100% { opacity: 1; }
	>			}
	>			=>	@-webkit-keyframes frame {
	>					0%   { opacity: 0; }
	>					100% { opacity: 1; }
	>				}
	>				@keyframes frame {
	>					0%   { opacity: 0; }
	>					100% { opacity: 1; }
	>				}
	>
	> - __animation-name__
	>
	>			@include animation-name(frame);
	>			=>	-webkit-animation-name: frame;
	>
	> - __animation-duration__
	>
	>			@include animation-duration(1s);
	>			=>	-webkit-animation-duration: 1s;
	>
	> - __animation-timing-function__
	>
	>			@include animation-timing-function(ease);
	>			=>	-webkit-animation-timing-function: ease;
	>
	> - __animation-iteration-count__
	>
	>			@include animation-iteration-count(infinite);
	>			=>	-webkit-animation-iteration-count: infinite;
	>
	> - __animation-fill-mode__
	>
	>			@include animation-fill-mode(forwards);
	>			=>	-webkit-animation-fill-mode: forwards;
	>
	> - __animation-delay__
	>
	>			@include animation-delay(.2s);
	>			=>	-webkit-animation-delay: .2s;
	>
	> - __animation-direction__
	>
	>			@include animation-direction(alternate);
	>			=>	-webkit-animation-direction: alternate;
	>
	> - __animation-play-state__
	>
	>			@include animation-play-state(paused);
	>			=>	-webkit-animation-play-state: paused;

- __简写__

	- __aniname__

			@include aniname(frame);
			=>	-webkit-animation-name: frame;

	- __anitime__

			@include anitime(1s);
			=>	-webkit-animation-duration: 1s;

	- __anitype__

			@include anitype(ease);
			=>	-webkit-animation-timing-function: ease;

	- __anicount__

			@include anicount(infinite);
			=>	-webkit-animation-iteration-count: infinite;

	- __aniend__

			@include aniend(forwards);
			=>	-webkit-animation-fill-mode: forwards;

	- __anidelay__

			@include anidelay(.2s);
			=>	-webkit-animation-delay: .2s;

	- __anidirection__

			@include anidirection(alternate);
			=>	-webkit-animation-direction: alternate;

	- __anipause__

			@include anipause(paused);
			=>	-webkit-animation-play-state: paused;

- __复合__

	- __cubic-bezier__

			@include cubic-bezier;
			=>	-webkit-animation-timing-function: cubic-bezier(0, 0, 1, 1); // linear

			@include cubic-bezier(0.5, 0.5, 0, 1);
			=>	-webkit-animation-timing-function: cubic-bezier(0.5, 0.5, 0, 1);

	- __animation__

			@include animation(frame);
			=>	-webkit-animation: frame .5s ease; // 默认.5s

			@include animation(frame .3s ease);
			=>	-webkit-animation: frame .3s ease;

			@include animation(frame, .3s, ease);
			=>	-webkit-animation: frame .3s ease;

			@include animation(frame, .3s ease);
			=>	-webkit-animation: frame .3s ease;

			@include animation(frame, .3s ease, forwards);
			=>	-webkit-animation: frame .3s ease forwards;

	- __aniframe__

			.class {
				@include aniframe(frame, 1s both) {
					0%   { opacity: 0; }
					100% { opacity: 1; }
				}
			}
			=>	.class {
					-webkit-animation: frame 1s both;
				}
				@-webkit-keyframes frame {
					0%   { opacity: 0; }
					100% { opacity: 1; }
				}

	- __aniframe2__

			.class {
				@include aniframe2(1s both) {
					0%   { opacity: 0; }
					100% { opacity: 1; }
				}
			}
			=>	.class {
					-webkit-animation: class 1s both;
				}
				@-webkit-keyframes class {
					0%   { opacity: 0; }
					100% { opacity: 1; }
				}


## 2. background

- __基本__

	> - __background-size__
	>
	>			@include background-size;
	>			=>	background-size: 100% 100%;
	>
	>			@include background-size(50% 50%);
	>			=>	background-size: 50% 50%;
	>
	>			@include background-size(50%, 50%);
	>			=>	background-size: 50% 50%;
	>
	>			@include background-size(cover);
	>			=>	background-size: cover;
	>
	>			@include background-size(auto);
	>			=>	background-size: auto;
	>
	>			@include background-size(null);
	>			=>	background-size: null;

- __复合__

	- __background-full__

			@include background-full("img.jpg", #fff);
			=>	background: #fff url("img.jpg") no-repeat;
				background-size: 100% 100%;

	- __background-cover__

			@include background-cover("img.jpg", #fff);
			=>	background: #fff url("img.jpg") no-repeat;
				background-size: cover;

	- __background-center__

			@include background-center("img.jpg", #fff);
			=>	background: #fff url("img.jpg") center center no-repeat;

	- __background-no-repeat__

			@include background-no-repeat("img.jpg");
			=>	background: url("img.jpg") no-repeat;

			@include background-no-repeat("img.jpg", top right);
			=>	background: url("img.jpg") top right no-repeat;

			@include background-no-repeat("img.jpg", top right, #fff);
			=>	background: #fff url("img.jpg") top right no-repeat;

	- __background-black__

			@include background-black(.5);
			=>	background-color: rgba(0, 0, 0, .5); // 默认#000


## 3. filter

		css3 滤镜, 可多个同时添加

- __基本__

	> - __filter__
	>
	>			@include filter(blur(2px) opacity(.7));
	>			=>	-webkit-filter: blur(2px) opacity(.7);
	>
	> - __grayscale__
	>
	>			@include grayscale(.5);
	>			=>	-webkit-filter: grayscale(.5); // 灰度, 默认100%
	>
	> - __sepia__
	>
	>			@include sepia(.6);
	>			=>	-webkit-filter: sepia(.6); // 褐色, 默认100%
	>
	> - __saturate__
	>
	>			@include saturate(.7);
	>			=>	-webkit-filter: saturate(.7); // 饱和度, 默认100%
	>
	> - __hue-rotate__
	>
	>			@include hue-rotate(90deg);
	>			=>	-webkit-filter: hue-rotate(90deg); // 色相旋转, 默认0deg
	>
	> - __invert__
	>
	>			@include invert(.8);
	>			=>	-webkit-filter: invert(.8); // 反色, 默认100%
	>
	> - __opacity__
	>
	>			@include opacity(.9);
	>			=>	-webkit-filter: opacity(.9); // 透明度, 默认100%
	>
	> - __brightness__
	>
	>			@include brightness(.1);
	>			=>	-webkit-filter: brightness(.1); // 亮度, 默认100%
	>
	> - __contrast__
	>
	>			@include contrast(.2);
	>			=>	-webkit-filter: contrast(.2); // 对比度, 默认100%
	>
	> - __blur__
	>
	>			@include blur(3px);
	>			=>	-webkit-filter: blur(3px); // 模糊, 默认0px
	>
	> - __drop-shadow__
	>
	>			@include drop-shadow(5px 5px 5px #ccc);
	>			=>	-webkit-filter: drop-shadow(5px 5px 5px #ccc); // 阴影, 同 box-shadow


## 4. box_flex

		css3 伸缩布局

- __基本__

	> - __box__
	>
	>			@include box;
	>			=>	display: -webkit-box; // 伸缩布局
	>
	> - __box-flex__
	>			
	>			@include box-flex(10);
	>			=>	-webkit-box-flex: 10; // 伸缩布局比例, 默认1
	>
	> - __box-orient__
	>			
	>			@include box-orient( w | x | horizontal | width );
	>			=>	-webkit-box-orient: horizontal; // 伸缩流方向, 默认horizontal
	>			
	>			@include box-orient( h | y | vertical | height );
	>			=>	-webkit-box-orient: vertical;
	>
	> - __box-direction__
	>
@include box-direction( normal | reverse );
-webkit-box-direction: normal | reverse; // 布局顺序, 正常或反序, 默认normal







