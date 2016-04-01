require(['api_mkt', 'cookie'], function(api_mkt) {
    var mymessage = function(gaga) {
        $("#itemContainer").html("");
        console.log(gaga);
        var obj = {};
        if (gaga == "ALL") {} else {
            obj.category = gaga;
        }
        api_mkt.message(obj, function(data) {
            console.log(data.data.list);
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
                previous: "←",
                next: "→"
            });
        });
    }
    mymessage("ALL"); //默认是全部选中
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
});
