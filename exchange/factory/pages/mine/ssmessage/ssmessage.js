require(['api_mkt','cookie'], function(api_mkt) {
	$(".tab").on("click",function(){
		var messageonehtml = "";
		$(this).siblings().removeClass("choosed_on_mes");
		$(this).addClass("choosed_on_mes");
		
		if($(this).hasClass("one")){		  //全部
			mymessage("all");
		} else if($(this).hasClass("two")){   //系统
			mymessage("system");
		} else if($(this).hasClass("three")){ //安全
			mymessage("security");
		} else if($(this).hasClass("four")){  //资产
			mymessage("assets");
		}
	});
	var mymessage = function(gaga){
		$("#itemContainer").html("");
		api_mkt.message(function(data){
			console.log(data.data.list);
			var messagehtml = "";
			if(data){
				if(data.data){
					if(data.data.list){
						var dlist = data.data.list;
							if(gaga=="all"){
								for (var i = 0; i < dlist.length; i++) {
									var categoryname = dlist[i]['cmsNewsCategory'];
									var categoryname_showvalue = "";
									if(categoryname=="ASSETS"){
										categoryname_showvalue = "资产";
									} else if(categoryname=="SECURITY"){
										categoryname_showvalue = "安全";
									} else if(categoryname=="SYSTEM"){
										categoryname_showvalue = "系统";
									}
									if(i==0){
										messagehtml += "<li><div class='message_cont_box color_let'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
									} else {
										messagehtml += "<li><div class='message_cont_box'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
									}
								}
							} else if(gaga=="security"){
								for (var i = 0; i < dlist.length; i++) {
									var categoryname = dlist[i]['cmsNewsCategory'];
									var categoryname_showvalue = "";
									if(categoryname=="ASSETS"){
										categoryname_showvalue = "资产";
									} else if(categoryname=="SECURITY"){
										categoryname_showvalue = "安全";
										if(i==0){
											messagehtml += "<li><div class='message_cont_box color_let'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
										} else {
											messagehtml += "<li><div class='message_cont_box'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
										}
									} else if(categoryname=="SYSTEM"){
										categoryname_showvalue = "系统";
									}
								}
							} else if(gaga=="system"){
								for (var i = 0; i < dlist.length; i++) {
									var categoryname = dlist[i]['cmsNewsCategory'];
									var categoryname_showvalue = "";
									if(categoryname=="ASSETS"){
										categoryname_showvalue = "资产";
									} else if(categoryname=="SECURITY"){
										categoryname_showvalue = "安全";
									} else if(categoryname=="SYSTEM"){
										categoryname_showvalue = "系统";
										if(i==0){
											messagehtml += "<li><div class='message_cont_box color_let'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
										} else {
											messagehtml += "<li><div class='message_cont_box'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
										}
									}
								}
							} else if(gaga=="assets"){
								for (var i = 0; i < dlist.length; i++) {
									var categoryname = dlist[i]['cmsNewsCategory'];
									var categoryname_showvalue = "";
									if(categoryname=="ASSETS"){
										categoryname_showvalue = "资产";
										if(i==0){
											messagehtml += "<li><div class='message_cont_box color_let'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
										} else {
											messagehtml += "<li><div class='message_cont_box'><span>"+categoryname_showvalue+"</span><span>"+dlist[i]['createDate']+"</span><div>"+dlist[i]['content']+"</div></div></li>";
										}
									} else if(categoryname=="SECURITY"){
										categoryname_showvalue = "安全";
									} else if(categoryname=="SYSTEM"){
										categoryname_showvalue = "系统";
									}
								}
							}
					}
				}
			}
			$("#itemContainer").append(messagehtml);
			$("div.holder").jPages({
		        containerID: "itemContainer",
		        perPage: 2,
		        startPage: 1,
		        startRange: 1,
		        midRange: 5,
		        endRange: 1,
		        previous : "←",
	      		next : "→"
		    });
		});
	}
});