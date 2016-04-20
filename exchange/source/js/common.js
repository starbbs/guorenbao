var global = {
    payLocked: false, //支付密码锁定状态
};

require(['api_mkt', 'mkt_info', 'cookie'], function(api_mkt, mkt_info) {



    if (location.href.indexOf("tradingfloor") === -1) {
        mkt_info.get();
    } else {
    }
    var popup_login_times = 0;
    var exchangeToken = $.cookie('exchangeToken');
    var whether_auth = false;
    $("#bg").width($(document).width());
    $('#bg').height($(document).height());
    $('#floor_bg').css('left', 0);
    $('#floor_bg').css('top', 0);
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);

    

    api_mkt.realAuth(function(data){
        if(data.status=="200"){
            $("#goone").on("click", function() {
                $.cookie("loginfromwhichpage","three");
                location.href = "./cnydepositswithdrawal.html";
            });
            $("#gotwo").on("click", function() {
                $.cookie("loginfromwhichpage","three");
                location.href = "./cnydepositswithdrawal.html?formindex='index'";
            });
            $(".quoted_price_top").css("margin-top","14px");
            $(".center_content").css("margin-top","14px");
        } else if(data.status=="400") {
            if(data.msg=="用户未实名认证"){
                $("#goone").on("click", function() {
                    $.cookie("loginfromwhichpage","three");
                    location.href = "./conditionofassets.html";
                });
                $("#gotwo").on("click", function() {
                    $.cookie("loginfromwhichpage","three");
                    location.href = "./conditionofassets.html";
                });
                if (location.href.indexOf("/index.html") === -1) {
                    $(".popuptips").slideDown();
                } else {
                    $(".popuptips").hide();
                }
                $(".quoted_price_top").css("margin-top","0px");
                $(".center_content").css("margin-top","0px");
            }
        } else {

        }
    });

    /**
     * 支付密码锁定校验
     */
    var isPayLocked = function() {
        api_mkt.isPayLocked({

        }, function(data) {
            if (data.status == 200) {
                // $(".popuptips").slideUp();
            } else {
                global.payLocked = true;
                console.log(data);
                $(".quoted_price_top").css("margin-top","0px");
                $(".center_content").css("margin-top","0px");
                $(".popuptips").html("为保证资金安全，您的支付密码已被锁定，请找回支付密码");
                $(".popuptips").slideDown();

            }
        });
    }



    $(".logoimg").on("click", function() {
        location.href = "./index.html";
    });


    $(".pageone,.pagetwo,.pagethree,.pagefour").on("click", function() {
        var exchangeToken = $.cookie('exchangeToken');
        var ff = $(this).html();
        if (!exchangeToken) {
            if (location.href.indexOf("/footer.html") === -1) {

            } else {
                if (ff == "首页") {
                    location.href = "./index.html";
                } else {
                    $(".popDiv").show();
                    $(".bg").show();
                }
            }
            if (ff == "首页") {
                $.cookie("loginfromwhichpage", "one");
            } else if (ff == "交易大厅") {
                $.cookie("loginfromwhichpage", "two");
                $(".popDiv").show();
                $(".bg").show();
            } else if (ff == "财务中心") {
                $.cookie("loginfromwhichpage", "three");
                $(".popDiv").show();
                $(".bg").show();
            } else if (ff == "我的账户") {
                $.cookie("loginfromwhichpage", "four");
                $(".popDiv").show();
                $(".bg").show();
            }
        } else {
            $(".popDiv").hide();
            $(".bg").hide();
            if (ff == "首页") {
                $.cookie("loginfromwhichpage", "one");
                location.href = "./index.html";
            } else if (ff == "交易大厅") {
                $.cookie("loginfromwhichpage", "two");
                location.href = "./tradingfloor.html";
            } else if (ff == "财务中心") {
                $.cookie("loginfromwhichpage", "three");
                location.href = "./conditionofassets.html";
            } else if (ff == "我的账户") {
                $.cookie("loginfromwhichpage", "four");
                location.href = "./basicinfo.html";
            }
        }
    });

    var verify = function(inputData, dataType) {
        var reg = "";
        var varMes = '';
        if (dataType === "name") {
            reg = /^[\u4E00-\u9FA5]{2,5}$/;
            varMes = "姓名请输入2~5个汉字";
        } else if (dataType === "tel") {
            reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            varMes = "请输入正确的手机号码";
        } else if (dataType === "salary") {
            reg = /^[1-9]\d{1,4}$/;
            varMes = "薪资请输入3~5位数字";
        } else if (dataType === "verCode") {
            reg = /^\d{6}$/;
            varMes = "验证码不正确";
        } else {
            reg = /^.*$/;
        }
        //如果输入数据不为空则去掉收尾空格
        if (inputData) {
            inputData = inputData.trim();
        }
        return reg.test(inputData) ? reg.test(inputData) : varMes;
    };

    // $(".center_content").on("click",function(){
    //     if(!exchangeToken){
    //         $(".bg").show();
    //         $(".login_regist").show();
    //         $(".popDiv").show();
    //         $(".afterlogin").hide();
    //         // return;
    //     } else {
    //         $(".bg").hide();
    //         $(".login_regist").hide();
    //         $(".popDiv").hide();
    //         $(".afterlogin").hide();
    //     }
    // });

    $(".ls_tab").on("click", function() {
        if (!exchangeToken) {
            $(".bg").show();
            $(".login_regist").show();
            $(".popDiv").show();
            $(".afterlogin").hide();
            // return;
            if ($(this).text() == "基本信息") {

            } else if ($(this).text() == "实名认证") {

            } else if ($(this).text() == "系统消息") {

            }
        } else {
            $(".bg").hide();
            $(".login_regist").hide();
            $(".popDiv").hide();
            $(".afterlogin").hide();
        }

    });

    if (!exchangeToken) {
        $(".login_regist").show();
        $(".loginarea").show();
        $(".afterlogin").hide();
    } else {
        $(".login_regist").hide();
        $(".login_header").show();
        $(".loginarea").hide();
        $(".afterlogin").show();
        var global_loginuserphone = $.cookie("global_loginuserphone");
        var global_loginusername = $.cookie("global_loginusername");
        // console.log("-------------"+global_loginuserphone);
        // console.log("-------------"+global_loginusername);
        if (global_loginusername != "" && global_loginusername) {
            $("#logined_username").html(global_loginusername);
        } else {
            $("#logined_username").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
        }
        $(".popDiv").hide();
        $(".bg").hide();
        isPayLocked(); //验证支付密码是否锁定
    }

    /**
     * 输入框通用校验
     */
    $(".password").on("keyup", function(e) {
    	//只允许输入 ASCII的33~126的字符
		if(this.value.charCodeAt()<33 || this.value.charCodeAt()>126){
			$(this).val($(this).val().replace(this.value,""));
		}
    });


    /**
     * 手机号输入框校验
     */
    $(".phone").on("keydown", function(e) {
        var keycode = e.which;
        if ((keycode != 8 && keycode != 9 && keycode != 16 && keycode != 20 && keycode < 48) || (keycode > 57 && keycode < 96) || keycode > 105) {
            return false;
        }
    });


    //右上角登录按钮点击之后出发的事件
    $(".popup_login_btn").on("click", function() {
        
        popup_login_times++;
        var phone = $(".phone").val();
        var password = $(".password").val();
        var authcode_common = $(".authcode_common").val();
        var flag = verify(phone, "tel");
        if (flag == "请输入正确的手机号码") {
            $(".err_tips_one").show().html("请输入正确的手机号码");
            return;
        } else {
            $(".err_tips_one").hide().html("");
        }
        if (password == "") {
            $(".error_tips").show().html("请输入密码");
            return;
        } else if (password.length > 20 || password.length < 6) {
            $(".error_tips").show().html("请输入6~20位密码");
            return;
        } else {
            $(".error_tips").hide().html("");
        }
        if (authcode_common == "") {
            $(".autocode_tips").show().html("请输入验证码");
            return;
        }
        if (flag == true && password != "" && password.length >= 6 && password.length < 20 && authcode_common != "") {
            $(".error_tips").hide();
            $(".autocode_tips").hide();
            api_mkt.login({
                phone: phone,
                password: password,
                code: authcode_common
            }, function(data) {
                $(".loc_img_topbar").click();
                if (data.status == 200) {
                    //$.cookie('exchangeToken', 'logined',{"expires":"h0.5"},"guorenmarket");
                    $.cookie('exchangeToken', 'logined');
                    $("#msg_num_top").text(0);
                    $(".login_regist").hide();
                    $(".login_header").show();
                    $(".popDiv").hide();
                    $(".bg").hide();
                    $(".loginarea").hide();
                    $(".afterlogin").show();
                    global_loginuserphone = data.data.phone;
                    global_loginusername = data.data.name ? data.data.name : "";
                    global_loginuseruid = data.data.uid;
                    $.cookie("global_loginuserphone", global_loginuserphone);
                    $.cookie("global_loginusername", global_loginusername);
                    $.cookie("global_loginuseruid", global_loginuseruid);
                    synchronous();
                    setInterval(synchronous, 60000);
                    if (global_loginusername != "") {
                        $("#logined_username").html(global_loginusername);
                        whether_auth = true;
                    } else {
                        whether_auth = false;
                        $("#logined_username").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
                    }
                    $("#uidval").html(global_loginuseruid);
                    $(".top_em").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
                    var whether_auth_val = "";
                    if (whether_auth) {
                        $("#goone").on("click", function() {
                            $.cookie("loginfromwhichpage","three");
                            location.href = "./cnydepositswithdrawal.html";
                        });
                        $("#gotwo").on("click", function() {
                            $.cookie("loginfromwhichpage","three");
                            location.href = "./cnydepositswithdrawal.html?formindex='index'";
                        });

                        whether_auth_val = global_loginusername;
                        $(".bottom_em_i")[0] ? $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)" : "";
                    } else {
                        $("#goone").on("click", function() {
                            $.cookie("loginfromwhichpage","three");
                            location.href = "./conditionofassets.html";
                        });
                        $("#gotwo").on("click", function() {
                            $.cookie("loginfromwhichpage","three");
                            location.href = "./conditionofassets.html";
                        });

                        whether_auth_val = '未认证';
                        $(".bottom_em_i")[0] ? $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)" : "";
                    }
                    $("#whether_auth").html(whether_auth_val); //是否实名认证的标识
                    var whichpage = $.cookie("loginfromwhichpage");
                    if (whichpage == "one") {
                        location.href = "./index.html";
                    } else if (whichpage == "two") {
                        location.href = "./tradingfloor.html";
                    } else if (whichpage == "three") {
                        location.href = "./conditionofassets.html";
                    } else if (whichpage == "four") {
                        location.href = "./basicinfo.html";
                    }
                    api_mkt.totalAssets({}, function(data) {
                        if (data.status == 200) {
                            var totalAssets = data.data.cnyBalance + data.data.cnyLock;
                            var totalNuts = data.data.gopBalance + data.data.gopLock;
                            //$('#thelatestprice').html(thelatestprice); //页面顶部 最新成交价
                            var totalvalue = totalNuts * $('#thelatestprice').html() + totalAssets;
                            $('.lf_asset_center').html(totalvalue.toFixed(2)); //总资产
                            $('.rg_asset_center').html(totalNuts.toFixed(2)); //总果仁

                            var cnyBalance = data.data.cnyBalance;
                            $.cookie('allCNY', cnyBalance);
                            $('.w_b_l_one').html("<em>账户余额：" + data.data.cnyBalance + " CNY</em>");
                            $('.w_b_l_two').html("<em>果仁余额：" + data.data.gopBalance + " GOP</em>");
                        } else if (data.status == 305) {} else if (data.status == 400) {} else {}
                    });
                } else if (data.status == 305) {
                    // alert(data.msg);
                    showWarnWin(data.msg,1e3);
                } else if (data.status == 400) {
                    if (data.msg == "验证码错误") {
                        $(".autocode_tips").show().html(data.msg);
                    } else if (data.msg == "手机号未注册") {
                        $(".err_tips_one").show().html("用户名或密码错误，请重新登录");
                    } else if (data.msg == "登录密码错误") {
                        $(".error_tips").show().html("用户名或密码错误，请重新登录");
                    } else if (data.data && data.data.num && data.data.num <= 10) {
                        if(data.data.num>=5){
                            if(data.data.num==10){
                                $(".error_tips").show().html("帐号已经锁定，请找回您的登录密码");
                            } else {
                                $(".error_tips").show().html("还有" + (10 - data.data.num) + "次输入机会");
                            }
                        } else if(data.data.num<5&&data.data.msg=="登录密码错误"){
                            $(".error_tips").show().html("用户名或密码错误，请重新登录");
                        }
                    } else if (data.msg == "error" && data.data.msg == "登录密码错误") {
                        $(".error_tips").show().html("用户名或密码错误，请重新登录");
                    } else if (data.msg=="密码长度错误"){
                        $(".error_tips").show().html("用户名或密码错误，请重新登录");
                    } else {
                        $(".autocode_tips").show().html(data.msg);
                    }
                } else {
                    $(".autocode_tips").show().html(data.msg);
                }
                // if(data.msg=="登录密码错误"){
                //     $(".error_tips_index").show().html(data.msg);
                // } else if(data.msg=="手机号未注册"){
                //     $(".error_tips_one").show().html(data.msg);
                // } else {
                //     $(".autocode_tips").show().html(data.msg);
                // }

                //err_tips_one
            });
        }
        // if (popup_login_times > 3) {
        //     $("#authcode").show();
        //     $(".popup_login_btn").css("top", "250px");
        //     $(".bottom_div").css("top", "284px");
        // } else {
        //     $(".popup_login_btn").css("top", "190px");
        //     $(".bottom_div").css("top", "226px");
        // }
    });
    $(".global_loginbtn").on('click', function() {
        $(".popDiv").show();
        $(".bg").show();
    });
    $(".close_btn").on("click", function() {
        $(".popDiv").hide();
        $(".bg").hide();
    });
    $("#logoutbtn").on("click", function() {
        $.cookie('exchangeToken', '');
        $.cookie("global_loginuserphone", '');
        $.cookie("global_loginusername", '');
        $.cookie("global_loginuseruid", '');
        $.cookie("totalAssets", "");
        $.cookie("totalNuts", "");
        $.cookie("mine_one", "");
        $.cookie("mine_two", "");
        $.cookie("mine_three", "");
        $.cookie("mine_four", "");
        $.cookie("loginfromwhichpage", "");
        api_mkt.userlogout({}, function(data) {
            if (data.status == 200) {
                showWarnWin(data.msg,1e3);
                window.location.href = "index.html";
            } else if (data.status == 305) {
                showWarnWin(data.msg,1e3);
            } else {
                showWarnWin(data.msg,1e3);
            }
        });
        setTimeout(function() {
            location.reload(true);
        }, 1000);
    });


    $("#mybox").on("click", function() {
        console.log("clcccc")
        $("#msg_num_top,#newinfor_result").html("0");
        var ff = "myboxclick";
        //synchronous(ff);
        location.href = "./ssmessage.html";
    });

    // var readMsg = function(){
    //     alert("ga")
    //     $("#msg_num_top,#newinfor_result").html("0");
    //     var ff = "myboxclick";
    //     synchronous(ff);
    //     location.href = "./ssmessage.html";
    // }
    var lookall = function() {
        $("#msg_num_top,#newinfor_result").html("0");
        var ff = "myboxclick";
        //synchronous(ff);
        location.href = "./ssmessage.html";
    }

    function synchronous(ff) {
        $("#mybox").html("");
        // if(ff=="myboxclick"){
        //     $("#msg_num_top,#newinfor_result").html("0");
        // } else {
        //     $("#msg_num_top,#newinfor_result").html("0");
        // }
        api_mkt.unReadMessage({

        }, function(data) {
            if (data.status == 200) {
                if (data.data) {
                    var dlist = data.data.list;
                    var unReadNum = data.data.unReadNum;
                    console.log(unReadNum);
                    $("#msg_num_top,#newinfor_result").html(unReadNum);
                    var dlisthtml = "";
                    console.log(dlist)
                    if (dlist.length == 1) {
                        dlisthtml += "<div class='message_flow'><p class='message_content_p'>" + dlist[0].content + "</p><p class='message_date_p'>" + dlist[0].createDate + "</p></div>";
                        dlisthtml += "<a href='ssmessage.html' onclick='lookall()'>查看全部</a>";
                    }
                    if (dlist.length == 2) {
                        dlisthtml += "<div class='message_flow'><p class='message_content_p'>" + dlist[0].content + "</p><p class='message_date_p'>" + dlist[0].createDate + "</p></div>";
                        dlisthtml += "<div class='message_flow second_message_flow'><p class='message_content_p'>" + dlist[1].content + "</p><p class='message_date_p'>" + dlist[1].createDate + "</p></div>";
                        dlisthtml += "<a href='ssmessage.html' onclick='lookall()'>查看全部</a>";
                    }
                    $(dlisthtml).appendTo("#mybox");
                }
            } else if (data.status == 400 && data.msg == "无数据") {
                console.log(data);
                $("#msg_num_top,#newinfor_result").html("0");
            }
        });
    }
    if (!exchangeToken) {

    } else {
        synchronous();
        setInterval(synchronous, 60000);
    }

    var flag = true;
    $('.messagenum_area').on("click", function() {
        if (flag) {
            flag = false;
            $(this).css("background-color", "#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color", "#333333");
            $(".msg_num").css("color", "#333333");
        } else {
            flag = true;
            $(this).css("background-color", "#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color", "#cccccc");
            $(".msg_num").css("color", "#cccccc");
        }
    });

});


var showWarnWin = function(mes, time) {
    var htmlStr = "<div class='warnWin'><span class='warn_font'>" + mes + "</span></div>";
    var time = time ? time : 1e3;
    if (!$(".warnWin").length) {
        $("body").append(htmlStr);
        $(".warnWin").css({
            position: "fixed",
            top: "40%",
            left: "50%",
            width: "auto",
            height: "40px",
            "line-height": "20px",
            margin: "-20px 0px 0px -75px",
            "border-radius": "5px",
            "vertical-align": "middle",
            background: "#000000",
            color: "#fff",
            "text-align": "center",
            opacity: "0.7",
            "z-index": 1000,
            padding: "0px 15px"
        });
        $(".warn_icon").css({
            display: "block",
            width: "32px",
            height: "32px",
            "text-align": "center",
            margin: "10px auto 0",
            "font-size": "30px"
        });
        $(".warn_font").css({
            display: "block",
            "font-family": "黑体",
            "margin-top": "10px",
            "font-size": "15px"
        });
        setTimeout(function() {
            $(".warnWin").remove();
        }, time);
    }
};
