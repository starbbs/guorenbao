/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
define('iscrollLoading',['iScroll4'],function(iScroll4){
	var iscrollLoading = {}
	iscrollLoading.upLoadingData = function(){

	};	
	iscrollLoading.downLoadingData = function(){

	};
	iscrollLoading.set = function(id , options){
		if(!id){
			return;
		}		
		options = $.extend(options,{
			vScrollbar: false,
			preventDefault: true,
			fixedScrollbar: true,
			useTransition: true,
			click: true,
		});
		return iScroll4Obj = (new iScroll4(id , options));
	};

	return iscrollLoading;
});
