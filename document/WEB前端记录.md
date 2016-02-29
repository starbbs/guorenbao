

[plan]: https://github.com/starbbs/guorenbao/blob/master/document/%E6%9E%9C%E4%BB%81%E5%AE%9D%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84%E8%AE%A1%E5%88%92.png "重构计划"


WEB前端记录.md

张树垚([ccforeverd](https://github.com/ccforeverd)) 2016-02-29 16:24:16 创建

github地址: <https://github.com/starbbs/guorenbao/blob/master/document/WEB前端记录.md>

(如果图片无法加载, 请移步到github上查看原文档)



## 宗旨

1. 方便查找和维护
2. 增强易读性和效率
3. 提取枝干类和公共功能, 方便应用到未来项目
4. 增强工程化工具, 可以应用到更多项目
5. 能够更加快捷方便的跳出(结束)一个项目和创建一个新项目
6. 定好规范, 以此为基准进行前端协同开发
7. 正确合理的文件分类和规划
8. 建立包管理


## 一 JS规范(需要一致)

__(一) 语义化__

- 使用英文单词而不是拼音

__(二) 书写__

- 驼峰命名
- 使用分号
- 使用单引号
- 使用1个制表符作为缩进

__(三) 注释__

- 使用DocBlockr插件为关键函数或方法进行注释
- 逻辑节点加上单行注释

__(四) 细节__

- 函数全部使用 var name = function() {…}; 来定义
- 使用 === 而不是 == (api返回状态码除外, obj==null 判断null或undefined除外)
- 除了document和navigator, 其他浏览器全局变量需增加windows前缀


## 二 CSS规范(作为参考)

- css使用简单BEM命名规则, 以命名空间和短横线分隔
- 使用sass实现oocss
- 父子组件, 兄弟组件互不干扰
- 重用, 公共样式


## 三 HTML规范(作为参考)

- 属性值使用双引号


## 四 关于工程化

- 开始的设计思路是统一输入输出和组件化
- 中间加入了目录结构规划, 本地环境和线上环境的功能分化, 各种编译的实现
- 现在又刚刚解决windows系统下的兼容问题(并没有完全解决)
- 将来还要有很多功能要实现, 比如yargs, mocks, browsersync, 目的是更加细化, 无脑化和可定制化
- 有兴趣的同学可以看一看, 入门教程自己找找, 就只在下面放上官网和插件网站的地址了


## 五 关于Git

- 现在大家统一使用github的客户端, 记得如果没有修改, 直接点同步即可; 如果有修改的, 先提交再同步; 如果有冲突, 确认是否会覆盖原文件
- 记得一定要先提交再同步, 有冲突没关系
- 了解一下git原理, 有兴趣可以看看git命令, 希望大家能一起在github学到东西


### 参考

- [BEM](http://www.w3cplus.com/blog/tags/325.html)
- [OOCSS概念篇](http://www.w3cplus.com/css/oocss-concept)
- [OOCSS核心篇](http://www.w3cplus.com/css/oocss-core)
- [DocBlockr](https://packagecontrol.io/packages/DocBlockr)
- [前端工程 基础篇](https://github.com/fouber/blog/issues/10#)
- [gulp中文](http://www.gulpjs.com.cn/)
- [gulp插件](http://gulpjs.com/plugins/)


### 重构计划(持续更新)

![重构计划][plan]


[原文档](https://github.com/starbbs/guorenbao/blob/master/document/WEB前端记录.md)


