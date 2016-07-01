$.fn.bigGlass = function(type){
	var glassT = $(this).offset().top, glassL = $(this).offset().left;//定义预展示输入框的坐标
	var gId = $(this).attr("id");
	var glassStr = '<div id="bigGlass"><nobr><span></span><span></span><span></span><span></span></nobr></div>';
	$(this).after($(glassStr));
	//var glassStr = '<div id="bigGlass"><nobr><span></span><span></span><span></span><span></span></nobr></div>';
	//$(this).after($(glassStr));
	//
	$(this).focus(function(){
		$("#bigGlass2").hide();
		showBigGlass();
	});
	$(this).keyup(function(){
		console.log(gId);
		showBigGlass();
	});
	//生成放大镜
	function showBigGlass(){
		var inputVal;
		// if(gId==""){
		// 	inputVal = $("#"+gId).val();
		// } else {

		// }
		inputVal = $("#"+gId).val(), l = inputVal.length;
		// $("#bigGlass").css({"top":(glassT-46)+"px","left":glassL-1+"px"});
		 // style="top:'+(glassT-46)+'px;left:'+glassL-1+'px;"
		
		if(!inputVal){
			$("#bigGlass").show();
			$("#bigGlass").html("充值金额");
			return false;
		} else {
			// $("#bigGlass").hide();
			// return false;
			//console.log("asdfJKL")
		}
		//身份证号码与电话号码展示逻辑不同，做区分
		$("#bigGlass").html('<nobr><span></span><span></span><span></span><span></span><span></span></nobr>');
		if(type == 1){
			if(l <= 4){
				$("#bigGlass").find("span").eq(0).text(inputVal);
			}else if(l <= 8){
				$("#bigGlass").find("span").eq(0).text(inputVal.substring(0,4));
				$("#bigGlass").find("span").eq(1).text(inputVal.substring(4,l));
			}else if(l <= 12){
				$("#bigGlass").find("span").eq(0).text(inputVal.substring(0,4));
				$("#bigGlass").find("span").eq(1).text(inputVal.substring(4,8));
				$("#bigGlass").find("span").eq(2).text(inputVal.substring(8,l));
			}else if(l <= 16){
				$("#bigGlass").find("span").eq(0).text(inputVal.substring(0,4));
				$("#bigGlass").find("span").eq(1).text(inputVal.substring(4,8));
				$("#bigGlass").find("span").eq(2).text(inputVal.substring(8,12));
				$("#bigGlass").find("span").eq(3).text(inputVal.substring(12,l));
			}else{
				$("#bigGlass").find("span").eq(0).text(inputVal.substring(0,4));
				$("#bigGlass").find("span").eq(1).text(inputVal.substring(4,8));
				$("#bigGlass").find("span").eq(2).text(inputVal.substring(8,12));
				$("#bigGlass").find("span").eq(3).text(inputVal.substring(12,16));
				$("#bigGlass").find("span").eq(4).text(inputVal.substring(16,l));
			}
		}else if(type ==2){
			if(l <= 12){
				$("#bigGlass").find("span").eq(0).text(inputVal);
			}
			// if(l <= 3){
			// 	$("#bigGlass").find("span").eq(0).text(inputVal);
			// }else if(l <= 7){
			// 	$("#bigGlass").find("span").eq(0).text(inputVal.substring(0,3));
			// 	$("#bigGlass").find("span").eq(1).text(inputVal.substring(3,l));
			// }else{
			// 	$("#bigGlass").find("span").eq(0).text(inputVal.substring(0,3));
			// 	$("#bigGlass").find("span").eq(1).text(inputVal.substring(3,7));
			// 	$("#bigGlass").find("span").eq(2).text(inputVal.substring(7,l));
			// }
		}
		$("#bigGlass").show();
	}
	//控制数字放大镜的显示与销毁
	$(document).click(function(event){
		var obj = event.srcElement || event.target;
		if($(obj).attr("id") != gId){
			$("#bigGlass").html("").hide();
		}else{
			showBigGlass();
		}
	});
}
