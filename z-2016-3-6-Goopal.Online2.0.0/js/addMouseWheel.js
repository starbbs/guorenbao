function addMouseWheel(obj,fn){

	if(window.navigator.userAgent.toLowerCase().indexOf("firefox") != -1){
		obj.addEventListener("DOMMouseScroll",fnWheel,false);//ff
	} else {
		obj.onmousewheel  = fnWheel;//ie chrome
	}
	
	function fnWheel(ev){
		var oEvent = ev || event;

		var bDown = true;//往下
		
		if(oEvent.wheelDelta){	
			bDown = oEvent.wheelDelta < 0 ? true : false;
		} else {
			bDown = oEvent.detail > 0 ? true : false;
		}

		fn && fn(bDown);

		//往下 负
		//往上 正
		//alert(oEvent.wheelDelta);//ie chrome
		
		//往上 负
		//往下 正
		//alert(oEvent.detail);//FF
	}

}