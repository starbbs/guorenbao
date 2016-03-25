/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
define('iscrollLoading',['iScroll4'],function(iScroll4){
	var bottomHeight = 20; // 下拉加载的高度
	var iscrollLoading = {}
	//以下均是业务函数
	iscrollLoading.beforeScrollStart = function(){};    //开始移动前
	iscrollLoading.scrollMove = function(){};			//手指移动时候
	iscrollLoading.beforeScrollEndTrue = function(){};	//手指移开前 满足条件
	iscrollLoading.beforeScrollEndFalse = function(){};//手指移开前 不满足条件
	iscrollLoading.scrollEnd = function(){};           //滑动完成后	
	iscrollLoading.downLoadingData = function(){}; 	   //下拉加载数据API
	iscrollLoading.upLoadingData = function(){};	  //上拉加载数据API


	iscrollLoading.set = function(id , options){
		if(!id){
			return;
		}
		options = options ||  {};
		//if (typeof options.onScrollMove === 'function') {
			//var _onScrollMove = options.onScrollMove;
			//delete options.onScrollMove;
		// }
		options = $.extend({
			vScrollbar: false,
			preventDefault: true,
			fixedScrollbar: true,
			useTransition: true,
			click: true,
			onBeforeScrollStart:function(){
			},
			onScrollMove: function() {
				if (this.y >= 0) {
					iscrollLoading.scrollMove && iscrollLoading.scrollMove();
				}
				//_onScrollMove && _onScrollMove.call(this);//此函数用于正在移动时候同时执行其它函数
			},
			onBeforeScrollEnd: function() {//松手时
				if(this.y >= 60){
					iscrollLoading.beforeScrollEndTrue && iscrollLoading.beforeScrollEndTrue();	
				}else{
					iscrollLoading.beforeScrollEndFalse && iscrollLoading.beforeScrollEndFalse();
				}
			},
			onScrollEnd: function() {
				//长帐单
				if(this.y < 0 && (this.y - bottomHeight < this.maxScrollY)){
					iscrollLoading.scrollEnd && iscrollLoading.scrollEnd ();
				}		
			},
		},options);
		return iScroll4Obj = (new iScroll4(id , options));
	};

	return iscrollLoading;
});
