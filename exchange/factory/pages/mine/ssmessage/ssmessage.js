require(['api_mkt', 'cookie'], function(api_mkt) {
    /*var mymessage = function(gaga) {
        $("#itemContainer").html("");
        var obj = {};
        if (gaga == "ALL") {} else {
            obj.category = gaga;
        }
        api_mkt.message(obj, function(data) {
            //console.log(data.data.list);  right_reg_side_content  message_cont
            var messagehtml = "";
            if (data) {
                if (data.data) {
                    if (data.data.list) {
                        var dlist = data.data.list;
                        for (var i = 0; i < dlist.length; i++) {
                            var categoryname = dlist[i]['cmsNewsCategory'];
                            var categoryname_showvalue = "";
                            if (categoryname == "ASSETS") {
                                categoryname_showvalue = "资产";
                            } else if (categoryname == "SECURITY") {
                                categoryname_showvalue = "安全";
                            } else if (categoryname == "SYSTEM") {
                                categoryname_showvalue = "系统";
                            }
                            if (i%2== 0) {
                                messagehtml += "<li><div class='message_cont_box color_let'><span>" + categoryname_showvalue + "</span><span>" + dlist[i]['createDate'] + "</span><div>" + dlist[i]['content'] + "</div></div></li>";
                            } else {
                                messagehtml += "<li><div class='message_cont_box'><span>" + categoryname_showvalue + "</span><span>" + dlist[i]['createDate'] + "</span><div>" + dlist[i]['content'] + "</div></div></li>";
                            }
                        }
                    }
                } else {
                    $(".right_reg_side_content").css("border-bottom","none");
                    $(".holder").hide();
                }
            }
            $("#itemContainer").append(messagehtml);
            $("div.holder").jPages({
                containerID: "itemContainer",
                perPage: 10,
                startPage: 1,
                startRange: 1,
                midRange: 5,
                endRange: 1,
                previous: "←",
                next: "→"
            });
        });
    }*/

    api_mkt.realAuth({
    }, function(data) {
        if (data.status == 200) {
        } else if (data.status == 305) {
        } else if(data.status == 400){
        } else {
        }
    });

    /*mymessage("ALL"); //默认是全部选中*/
    $(".tab").on("click", function() {
        var messageonehtml = "";
        $(this).siblings().removeClass("choosed_on_mes");
        $(this).addClass("choosed_on_mes");

        if ($(this).hasClass("one")) { //全部
            mymessage("ALL");
        } else if ($(this).hasClass("two")) { //系统
            mymessage("SYSTEM");
        } else if ($(this).hasClass("three")) { //安全
            mymessage("SECURITY");
        } else if ($(this).hasClass("four")) { //资产
            mymessage("ASSETS");
        }
    });
    //hover 效果
    $('.ls_tab').hover(function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fafafa');
        }
    },function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fff');
        }
    });
});
