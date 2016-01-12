
# zSass #

*张树垚 2014-12-06 12:18:59 创建*

*sass库 v0.1.2*

## 1. 命名规范
* `a-b` &nbsp; __短横线__ &nbsp;&nbsp; css样式, 原生sass方法(可以和下划线互换使用, 在这里用于区分)
* `a_b` &nbsp; __下划线__ &nbsp;&nbsp; class, mixin名称, 命名空间, 前缀
* `aBc` &nbsp; __小驼峰__ &nbsp;&nbsp; 自定义function

## 2. 目录结构
*依据SMACSS规范建立目录结构*

- #### base 基本
	- __function__
		- _typeof.scss
		- _math.scss
		- _percent.scss
		- _deg.scss
		- _selector.scss
		- _unit.scss
		- _list.scss
		- _string.scss
		- _function.scss
	- __mixin__
		- _animation.scss
		- _background.scss
		- _mixin.scss
	- __extend__
		- _extend.scss
	- _prefix.scss
	- _mobile.scss
	- _base.scss

- #### layout 布局
	- __立方体demo__
		- main.scss
	- __旋转demo__
		- main.scss

- #### module 模块
	- __animate__
		- _animate.scss
		- _attention_seekers.scss
		- _bouncing_entrances.scss
	- __show__
		- _base.scss
		- _fade.scss
		- _from.scss
	- _module.scss
	- test.scss

- #### state 状态

		暂无

- #### theme 皮肤

		暂无

- #### project 项目

		使用OOCSS方式, 通过zSass编写的项目.

- #### _main.scss

		主文件, 引入即可.






