require(['api_mkt', 'mkt_info', 'cookie'], function(api_mkt, mkt_info) {

    $('.rmbxh').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbtx').removeClass('bottomon');
        $('.recharge').show();
        $('.withdraw_deposit').hide();
    });
    $('.rmbtx').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbxh').removeClass('bottomon');
        $('.recharge').hide();
        $('.withdraw_deposit').show();
        //判断有无节点
        if ($('.nutOutputManager').length > 0) {
            $('.nut-one').hide();
            $('.nut-two').show();
        } else {
            $('.nut-one').show();
            $('.nut-two').hide();
        }

    });
    //果仁提现地址管理(如果有就显示)            
    api_mkt.gopAddressMan({
        'pageNo': 1,
        'pageSize': 200
    }, function(data) {
        if (data.status == 200) {
            //果仁市场添加
            $('.nut-one').hide();
            $('.nut-two').show();
            for (var i = 0; i < data.data.list.length; i++) {
                //创建节点
                var Node1 = $('<div></div>');
                Node1.addClass('nutOutputManager');
                var Node2 = $('<p>地址：</p>').appendTo(Node1);
                var Node2_1 = $('<input type="text" class="nutIdName input" value="" />').appendTo(Node2);
                var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1);
                var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1);
                var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                Node2_1.val(data.data.list[i].name);
                Node2_1.attr('dataid', data.data.list[i].name);
                Node3.text(data.data.list[i].address);
                //$('.nut-two').appendBefore(Node1);
                Node1.insertBefore($('.nutOutputManager-add'));
                if ($('.nutOutputManager').length % 2 == 0) {
                    Node1.addClass('nutOutputManager-even');
                }
            }
            //再次添加果仁地址
            $('.nutOutputManager-addBtn').click(function() {
                $('.nut-one').show();
                $('.nut-two').hide();
                $('#nut-paypwd').val('');
                $('#nut-name').val('');
                $('#nut-address').val('');
                $('#nut-identifyingCode').val('');
            });
            //果仁提现地址管理删除
            $('.nutOutputManager-del').click(function() {
                $(this).parent().remove();
                api_mkt.gopAddressManDel({
                    'wallet': ($(this).parent().find('.nutIdAddress').text())
                }, function(data) {
                    if (data.status == 200) {
                        window.location.href = 'withdraw.html?id=rmbtx';
                    } else {
                        //alert(data.msg);
                        showWarnWin(data.msg, 1e3);
                    }
                });
            });

            //果仁提现地址修改
            $('.nutOutputManager-modify').click(function() {
                if ($(this).parent().find('.cancleBtn').length > 0) {

                } else {
                    $(this).parent().find('.nutIdName').removeClass('input');
                    var Node = $('<input type="button" class="sureBtn" value="确认" /><input type="button" class="cancleBtn" value="取消" />');
                    Node.addClass('confirmUpdate');
                    Node.insertAfter($(this).parent().find('.nutIdName'));
                }

                //确认修改
                $('.sureBtn').click(function() {
                    api_mkt.gopAddressManUpdate({
                        'id': data.data.list[$(this).parent().parent().index()].id,
                        'name': $(this).parent().find('.nutIdName').val()
                    }, function(data) {
                        if (data.status == 200) {
                            window.location.href = 'withdraw.html?id=rmbtx';
                        } else {
                            showWarnWin(data.msg, 1e3);
                        }
                    });
                });
                //取消修改
                $('.cancleBtn').click(function() {
                    var a = $(this).parent().find('.nutIdName').attr('dataid');
                    $(this).parent().find('.nutIdName').val(a);
                    $(this).parent().find('.nutIdName').addClass('input');
                    $(this).parent().find('.confirmUpdate').remove();
                    $(this).remove();

                });
            });
        } else {}
    });


    //twoBackOne  返回
    $('.twoBackOne').click(function() {
        /*$('.one').css('display','flex');
        $('.two').css('display','none');
        $(this).css('display','none');*/
        window.location.reload(true);
    });

    //点击-银行卡表单
    $('.bankIdCard-add').click(function() {
        $('.one').css('display', 'none');
        $('.two').css('display', 'flex');
        $('.newCard').hide();
    });

    $("#bank-idcard").keyup(function() {
        $(this).val($(this).val().replace(/[^0-9$]/g, ''));
    });

    //校验银行账户
    var btnConfirm = false;
    var cardConfirm=false;//银行卡校验
    var subbankConfirm = false;//开户行校验
    var paypwdConfirm=false;//支付密码校验
    var codeConfirm=false;//短息验证码校验
    //银行账号校验-人民币提现管理
    $("#bank-idcard").blur(function() {
        var bankIdcard = $("#bank-idcard").val();
        var reg = /^(\d{16}|\d{19})$/;
        if (!bankIdcard || !reg.exec(bankIdcard)) {
        	cardConfirm = false;
            $('.msg-bank-idcard').show().text('请输入正确的银行账号');
        } else {
            $('.msg-bank-idcard').hide();
            
            //接口 银行卡识别
            $.ajax({
                type: "POST",
                dataType: "json",
                url: api_mkt.basePath2,
                data: JSON.stringify({
                    'bankCard': $("#bank-idcard").val()
                }),
                cache: false,
                success: function(data) {
                	cardConfirm = false;
                    if (data.msg = '无法识别此卡') {
                        $('.msg-bank-idcard').show().text('您输入的银行账号有误，请重新输入');
                    } else {
                        $('.msg-bank-idcard').hide();
                    }

                    //所属银行自动添加
                    if (data.data.bankName != '中国工商银行' && data.data.bankName != '中国建设银行' && data.data.bankName != '中国农业银行' && data.data.bankName != '交通银行' && data.data.bankName != '中国邮政储蓄银行' && data.data.bankName != '招商银行') {
                        $("#bank").val('暂不支持(' + data.data.bankName + ')');
                        $('.msg-bank-idcard').hide();
                    } else if (data.data.cardType == 'CREDIT_CARD') {
                        $('.msg-bank-idcard').show().text('仅支持储蓄卡提现');
                    } else {
                        $("#bank").val(data.data.bankName);
                        $('.msg-bank-idcard').hide();
                        cardConfirm = true;
                    }
                },
                error: function() {cardConfirm = false;}
            });
        }
    });

    //全国省市二级联动下拉选择菜单-人民币提现管理
    first("selectp", "selectc", "form1", 0, 0);

    //校验开户支行-人民币提现管理
    var subbankBtn = false;
    $('#subbank').blur(function() {
        var subbank = $.trim($(this).val());
        var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

        if (!subbank || !reg.test(subbank) || $(".select-area").val() == "0" || $(".select-city").val() == "0") {
            $('.msg-subbank').show().text('请输入正确的开户支行地址');
            subbankConfirm = false;
        } else {
            $('.msg-subbank').hide();
            subbankConfirm = true;
        }
    });

    //校验支付密码-人民币提现管理
    $('.pay-pwd').blur(function() {
        var reg = new RegExp("^[0-9]*$"); //纯数字
        var hanzi = /[\u4e00-\u9fa5]/; //汉字
        if ($(this).val().indexOf(" ") > 0 || $(this).val().length > 20 || $(this).val().length < 8 || reg.test($(this).val()) || hanzi.test($(this).val())) {
        	paypwdConfirm = false;
            $('.msg-pay-pwd').show().text('请输入正确的支付密码');
        } else {
        	paypwdConfirm = true;
            $('.msg-pay-pwd').hide();
        }
    });

    //校验验证码-人民币提现管理
    $('#sendCodeByLoginAfter, #nut-identifyingCode').blur(function() {
        var code = $.trim($(this).val());
        if (isNaN(code) || code == "") {
        	codeConfirm = false;
        	codeConfirm =false;
            $('.msg-sendCodeByLoginAfter').show().text('请输入正确的验证码');
            $('.msg-nut-identifyingCode').show().text('请输入正确的验证码');
        } else {
            btnConfirm = true;
            codeConfirm=true;
            $('.msg-sendCodeByLoginAfter').hide();
            $('.msg-nut-identifyingCode').hide();
        }
    });
    //获取验证码-人民币提现管理
    $('#sendCodeByLoginAfterBtn').click(function() {
        api_mkt.sendCodeByLoginAfter(function(data) {
            if (data.status == 200) {
                $('.msg-sendCodeByLoginAfter').text('');
                $('.msg-nut-identifyingCode').text('');
            } else {
                $('.msg-sendCodeByLoginAfter').text('请输入正确的验证码');
                $('.msg-nut-identifyingCode').text('请输入正确的验证码');
            }
        });

        //30秒内只能发送一次
        var count = 60;
        var resend = setInterval(function() {
            count--;
            if (count > 0) {
                $('#sendCodeByLoginAfterBtn').val(count + 's后重新发送');
                $('#sendCodeByLoginAfterBtn').attr('disabled', true).css({ 'cursor': 'not-allowed', 'backgroundColor': '#eee', 'color': '#999' });
            } else {
                clearInterval(resend);
                $('#sendCodeByLoginAfterBtn').attr('disabled', false).css({ 'cursor': 'pointer', 'backgroundColor': '#0bbeee', 'color': '#fff' }).val('获取验证码');
            }

        }, 1000);
    });

    //人民币提现管理添加 点击-确认添加银行卡
    $('.confirmAdd').click(function() {
        if (global.payLocked) {
            window.location.reload(true);
            document.documentElement.scrollTop = 0;
            return false;
        }
        if(!cardConfirm ||!subbankConfirm || !paypwdConfirm || !codeConfirm || $('#sendCodeByLoginAfter').val() ==''){
            //                showWarnWin('请完善填写信息！',1e3);
            $("#bank-idcard").focus();
            $('#subbank').focus();
            $('.pay-pwd').focus();
            $('#sendCodeByLoginAfter, #nut-identifyingCode').focus();

            $("#bank-idcard").blur();
            $('#subbank').blur();
            $('.pay-pwd').blur();
            $('#sendCodeByLoginAfter, #nut-identifyingCode').blur();
        } else {
            //中国工商银行，中国建设银行，中国农业银行，中国交通银行，中国邮政储蓄银行，招商银行
            if ($('#bank').val() != '中国工商银行' && $('#bank').val() != '中国建设银行' && $('#bank').val() != '中国农业银行' && $('#bank').val() != '交通银行' && $('#bank').val() != '中国邮政储蓄银行' && $('#bank').val() != '招商银行') {
                $('.msg-bank').show().text('暂不支持此银行');
                return false;
            }
            var auth_name = $.cookie("global_loginusername");
            api_mkt.rmbWithdrawalsManageAdd({
                'name': auth_name,
                'bank': $('#bank').val(),
                'bankId': $('#bank-idcard').val(),
                'bankProvince': $('.select-area').find('option:selected').text(),
                'bankCity': $('.select-city').find('option:selected').text(),
                'subbank': $('#subbank').val(),
                'payPwd': $('#pay-pwd').val(),
                'identifyingCode': $('#sendCodeByLoginAfter').val()
            }, function(data) {
                $('.msg-sendCodeByLoginAfter').text('');
                $('.msg-pay-pwd').text('');
                if (data.status == 200) {
                    window.location.reload(true);
                } else if (data.msg == '验证码错误') {
                    $('.msg-sendCodeByLoginAfter').show().text('验证码错误');
                } else if (data.msg == '服务器异常') {
                    showWarnWin('服务器异常', 1e3);
                } else if (data.msg == '提现银行卡账户名必须与您的实名认证姓名一致') {
                    $('.msg-bank-idcard').show().text('提现银行卡账户名必须与您的实名认证姓名一致');
                } else if (data.msg == '同一用户不能添加相同银行卡') {
                    //showWarnWin('同一用户不能添加相同银行卡',1e3);
                    $('.msg-bank-idcard').show().text('同一用户不能添加相同银行卡');
                } else if (data.data && data.data.num) {
                    var num = data.data ? data.data.num : data.date.num;
                    if (3 - num > 0) {
                        $('.msg-pay-pwd').show().text("支付密码错误，您还有" + (3 - num) + "次输入机会");
                    } else {
                        $('.msg-pay-pwd').show().html("为保证资金安全，您的支付密码已被锁定，请<a href='resetpaymentcode.html' class='moreCheck'>找回支付密码</a>");
                    }
                } else if (data.msg.indexOf('锁定') > 0) {
                    $('.msg-sendCodeByLoginAfter').show().text(data.msg);
                    //window.location.reload(true);
                    $(".popuptips").html("为保证资金安全，您的支付密码已被锁定，请找回支付密码");
                    $(".popuptips").slideDown();
                    $(".quoted_price_top").css("margin-top", "0px");
                    $(".center_content").css("margin-top", "0px");
                    document.documentElement.scrollTop = 0;
                } else {
                    showWarnWin(data.msg, 1e3);
                }
            });

        }
    });

    //果仁提现地址备注-校验
    $('.msg-nut-name').show().html('<p style="color:#999;">果仁市场内互转即时极速到账</p>');
    var btnNut1 = false;
    $('#nut-name').blur(function() {
        var name = $(this).val();
        if (!name) {
            btnNut1 = false;
            $('.msg-nut-name').show().text('请输入地址备注');
        } else {
            btnNut1 = true;
            $('.msg-nut-name').show().html('<p style="color:#999;">地址备注完成：果仁市场内互转即时极速到账</p>');
        }
    });
    //果仁提现地址-校验
    var btnNut2 = false;
    $('#nut-address').blur(function() {
        var address = $(this).val();
        if (!address) {
            btnNut2 = false;
            $('.msg-nut-address').show().text('请输入正确地址');
        } else {
            btnNut2 = true;
            $('.msg-nut-address').hide();
        }
    });
    //校验支付宝密码
    var btnNut3 = false;
    $('#nut-paypwd').blur(function() {
        var nutPayPwd = $(this).val();
        if (!nutPayPwd) {
            btnNut3 = false;
            $('.msg-nut-paypwd').show().text('请输入支付密码');
        } else {
            btnNut3 = true;
            $('.msg-nut-paypwd').hide();
        }
    });
    //验证码校验
    var btnNut4 = false;
    $('#nut-identifyingCode').blur(function() {
        var pwd = $(this).val();
        if (!pwd || isNaN(pwd) || pwd.length !== 6) {
            $('.msg-code').text('请输入正确的验证码');
            btnNut4 = false;
        } else {
            $('.msg-code').hide();
            btnNut4 = true;
        }
    });
    //获取验证码-人民币提现管理
    $('#nut-identifyingCodeBtn').click(function() {
            if (btnNut3 == false) {
                showWarnWin('请完善填写信息！', 1e3);
            } else {
                api_mkt.sendCodeByLoginAfter(function(data) {
                    if (data.status == 200) {
                        $('.msg-sendCodeByLoginAfter').text('');
                        $('.msg-nut-identifyingCode').text('');
                    } else {
                        $('.msg-sendCodeByLoginAfter').text('请输入正确的验证码');
                        $('.msg-nut-identifyingCode').text('请输入正确的验证码');
                    }
                });

                //30秒内只能发送一次
                var count = 60;
                var resend = setInterval(function() {
                    count--;
                    if (count > 0) {
                        $('#nut-identifyingCodeBtn').val(count + 's后重新发送');
                        $('#nut-identifyingCodeBtn').attr('disabled', true).css({ 'cursor': 'not-allowed', 'backgroundColor': '#eee', 'color': '#999' });
                    } else {
                        clearInterval(resend);
                        $('#nut-identifyingCodeBtn').attr('disabled', false).css({ 'cursor': 'pointer', 'backgroundColor': '#0bbeee', 'color': '#fff' }).val('获取验证码');
                    }

                }, 1000);
            }
        });

        //果仁提现地址管理添加
        $('.gopAddressManAdd').click(function() {
            if (global.payLocked) {
                location.href = "withdraw.html?id=rmbtx ";
                document.documentElement.scrollTop = 0;
                return false;
            }
            if (btnNut1 == false) {
                $('.msg-nut-name').show().text('请输入地址备注');
            } else if (btnNut2 == false) {
                $('.msg-nut-address').show().text('请输入正确地址');
            } else if (btnNut3 == false) {
                $('.msg-nut-paypwd').show().text('请输入正确的支付密码');
            } else if (btnNut4 == false) {
                $('.msg-nut-identifyingCode').show().text('请输入正确的短信验证码');
            } else {
                api_mkt.gopAddressManAdd({
                    'name': $('#nut-name').val(),
                    'paypwd': $('#nut-paypwd').val(),
                    'address': $('#nut-address').val(),
                    'identifyingCode': $('#nut-identifyingCode').val()
                }, function(data) {
                    if (data.status == 200) {
                        //果仁市场添加
                        $('.nut-one').hide();
                        $('.nut-two').show();
                        //创建节点
                        var Node1 = $('<div></div>');
                        Node1.addClass('nutOutputManager');
                        var Node2 = $('<p></p>').appendTo(Node1);
                        var Node2_1 = $('<input type="text" class="nutIdName" style="outline:none;border:0;background-color:#FAFAFA;" value="" disabled/>').appendTo(Node2);
                        var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1);
                        var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1);
                        var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                        Node2_1.val($('#nut-name').val());
                        Node3.text($('#nut-address').val());
                        //$('.nut-two').appendBefore(Node1);
                        Node1.insertBefore($('.nutOutputManager-add'));
                        if ($('.nutOutputManager').length % 2 == 0) {
                            Node1.addClass('nutOutputManager-even');
                        }
                        //再次添加果仁地址
                        $('.nutOutputManager-add').click(function() {
                            $('.nut-one').show();
                            $('.nut-two').hide();
                            $('#nut-paypwd').val('');
                            $('#nut-identifyingCode').val('');
                            $('#nut-name').val('');
                            $('#nut-address').val('');
                        });
                        window.location.href = 'withdraw.html?id=rmbtx';
                    } else if (data.msg == '验证码错误') {
                        $('.msg-nut-identifyingCode').show().text('请输入正确的短信验证码');
                    } else if (data.data && data.data.num) {
                        var num = data.data ? data.data.num : data.date.num;
                        if (3 - num > 0) {
                            $('.msg-nut-paypwd').show().text("支付密码错误，您还有" + (3 - num) + "次输入机会");
                        } else {
                            $('.msg-nut-paypwd').show().html("提示为保证资金安全，您的支付密码已被锁定，请<a href='resetpaymentcode.html' class='moreCheck'>找回支付密码</a>");
                        }
                    } else if (data.msg.indexOf('锁定') > 0) {
                        $('.msg-nut-identifyingCode').show().text(data.msg);
                        window.location.href = 'withdraw.html?id=rmbtx';
                        document.documentElement.scrollTop = 0;
                    } else if (data.msg == '果仁提现地址管理添加错误') {
                        $('.msg-nut-address').show().text('非法地址');
                    } else if (data.msg == '钱包地址格式错误') {
                        $('.msg-nut-address').show().text('钱包地址格式错误');
                    } else {
                        showWarnWin(data.msg, 1e3);
                    }
                });
            }
        });

        //果仁提现地址管理添加
        /*$('.gopAddressManAdd').click(function() {
            if (global.payLocked) {
                location.href = "withdraw.html?id=rmbtx ";
                $(window).scrollTop(0);
                return false;
            }
            if (btnNut1 == false) {
                $('.msg-nut-name').show().text('请输入地址备注');
            } else if (btnNut2 == false) {
                $('.msg-nut-address').show().text('请输入正确地址');
            } else if (btnNut3 == false) {
                $('.msg-nut-paypwd').show().text('请输入正确的支付密码');
            } else if (btnNut4 == false) {
                $('.msg-nut-identifyingCode').show().text('请输入正确的短信验证码');
            } else {
                api_mkt.gopAddressManAdd({
                    'name': $('#nut-name').val(),
                    'paypwd': $('#nut-paypwd').val(),
                    'address': $('#nut-address').val(),
                    'identifyingCode': $('#nut-identifyingCode').val()
                }, function(data) {
                    if (data.status == 200) {
                        //果仁市场添加
                        $('.nut-one').hide();
                        $('.nut-two').show();
                        //创建节点
                        var Node1 = $('<div></div>');
                        Node1.addClass('nutOutputManager');
                        var Node2 = $('<p></p>').appendTo(Node1);
                        var Node2_1 = $('<input type="text" class="nutIdName" style="outline:none;border:0;background-color:#FAFAFA;" value="" disabled/>').appendTo(Node2);
                        var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1);
                        var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1);
                        var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                        Node2_1.val($('#nut-name').val());
                        Node3.text($('#nut-address').val());
                        //$('.nut-two').appendBefore(Node1);
                        Node1.insertBefore($('.nutOutputManager-add'));
                        if ($('.nutOutputManager').length % 2 == 0) {
                            Node1.addClass('nutOutputManager-even');
                        }
                        //再次添加果仁地址
                        $('.nutOutputManager-add').click(function() {
                            $('.nut-one').show();
                            $('.nut-two').hide();
                            $('#nut-paypwd').val('');
                            $('#nut-identifyingCode').val('');
                            $('#nut-name').val('');
                            $('#nut-address').val('');
                        });
                        window.location.href = 'withdraw.html?id=rmbtx';
                    } else if (data.msg == '验证码错误') {
                        $('.msg-nut-identifyingCode').show().text('请输入正确的短信验证码');
                    } else if (data.data && data.data.num) {
                        var num = data.data ? data.data.num : data.date.num;
                        if (3 - num > 0) {
                            $('.msg-nut-paypwd').show().text("支付密码错误，您还有" + (3 - num) + "次输入机会");
                        } else {
                            $('.msg-nut-paypwd').show().html("提示为保证资金安全，您的支付密码已被锁定，请<a href='resetpaymentcode.html' class='moreCheck'>找回支付密码</a>");
                            window.location.reload();
                        }
                    } else if (data.msg.indexOf('锁定') > 0) {
                        $('.msg-nut-identifyingCode').show().text(data.msg);
                        window.location.href = 'withdraw.html?id=rmbtx';
                        $(window).scrollTop(0);
                    } else if (data.msg == '果仁提现地址管理添加错误') {
                        $('.msg-nut-address').show().text('非法地址');
                    } else if (data.msg == '钱包地址格式错误') {
                        $('.msg-nut-address').show().text('钱包地址格式错误');
                    } else {
                        showWarnWin(data.msg, 1e3);
                    }
                });
            }
        });*/

        //接受跳转参数
        $(function() {
            function getQueryString(name) {
                href = decodeURIComponent(location.href);
                // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
                if (href.indexOf("?") == -1
                        || href.indexOf(name + '=') == -1) {
                    return '';
                }
                // 获取链接中参数部分
                var queryString = href.substring(href.indexOf("?") + 1);
                // 分离参数对 ?key=value&key2=value2
                var parameters = queryString.split("&");
                var pos, paraName, paraValue;
                for ( var i = 0; i < parameters.length; i++) {
                    // 获取等号位置
                    pos = parameters[i].indexOf('=');
                    if (pos == -1) {
                        continue;
                    }
                    // 获取name 和 value
                    paraName = parameters[i].substring(0, pos);
                    paraValue = parameters[i].substring(pos + 1);
                    // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
                    if (paraName == name) {
                        return unescape(paraValue.replace(/\+/g, " "));
                    }
                }
                return '';
            };

            var b = getQueryString("id");
            //console.log(b);
            if(b){
                $('.rmbtx').addClass('bottomon');
                $('.rmbxh').removeClass('bottomon');
                $('.recharge').hide();
                $('.withdraw_deposit').show();
                $('.nut-two').hide();
            }
        });

    //判断是否有银行卡
    api_mkt.bankList({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            for (var i = 0; i < data.data.list.length; i++) {
                var name = data.data.list[i].name;
                var num = data.data.list[i].acnumber; //银行卡号
                var bankName = data.data.list[i].bank; //所属银行
                var bankIP = data.data.list[i].province + data.data.list[i].city + data.data.list[i].subbank; //支行

                var node = $('<div></div>').addClass('bankIdCard addBankCard newCard');
                var nodeList = $('<section class="bankIdCard-bankLogoName bankName">' + bankName + '</section>' +
                    '<section class="bankIdCard-Code">' + '尾号：' + num.substr(num.length - 4) + '</section>' +
                    '<section class="bankIdCard-CardAndBg">储蓄卡</section>' +
                    '<section class="bankIdCard-hr"></section>' +
                    '<section class="bankIdCard-Name">持卡人姓名：' + name.replace(name.substr(0, 1), '*') + '</section>').appendTo(node);
                if(data.data.list.length>1){
                	$('<section class="bankIdCard-del" data-cardId="' + num + '">删除</section>').appendTo(node);
                }
                $('<section class="bankIdCard-address">' + bankIP + '</section>').appendTo(node);
                node.insertBefore($('.bankIdCard-add'));
                //判断显示银行logo
                $('.bankName').filter(":contains('中国工商银行')").addClass('ICBC').text('');
                $('.bankName').filter(":contains('中国建设银行')").addClass('CBC').text('');
                $('.bankName').filter(":contains('交通银行')").addClass('BC').text('');
                $('.bankName').filter(":contains('招商银行')").addClass('CMB').text('');
                $('.bankName').filter(":contains('中国邮政储蓄银行')").addClass('PSBC').text('');
                $('.bankName').filter(":contains('中国农业银行')").addClass('ABC').text('');
            }

            //删除银行卡
            $('.bankIdCard-del').click(function() {
                api_mkt.rmbWithdrawalsManageDel({
                    'bankId': $(this).attr('data-cardId')
                }, function(data) {
                    if (data.status == 200) {
                        window.location.reload(true);
                    } else {}
                });
            });
        } else {}
    });

    //hover 效果
    $('.ls_tab').hover(function() {
        if ($(this).hasClass('ls_tab_on')) {
            $(this).css('backgroundColor', '#f1f1f1');
        } else {
            $(this).css('backgroundColor', '#fafafa');
        }
    }, function() {
        if ($(this).hasClass('ls_tab_on')) {
            $(this).css('backgroundColor', '#f1f1f1');
        } else {
            $(this).css('backgroundColor', '#fff');
        }
    });


});


cityareaname = new Array(35);
cityareacode = new Array(35);

function first(preP, preC, VeryHuo, selectP, selectC) {
    a = 0;
    if (selectP == '01') {
        a = 1;
        tempoption = new Option('北京', '01', false, true);
    } else { tempoption = new Option('北京', '01'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[1]=tempoption;');
    cityareacode[0] = new Array('0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108');
    cityareaname[0] = new Array('东城区', '西城区', '崇文区', '宣武区', '朝阳区', '海淀区', '丰台区', '石景山');
    if (selectP == '02') {
        a = 2;
        tempoption = new Option('深圳', '02', false, true);
    } else { tempoption = new Option('深圳', '02'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[2]=tempoption;');
    cityareacode[1] = new Array('0201', '0202', '0203', '0204', '0205', '0206');
    cityareaname[1] = new Array('罗湖', '福田', '南山', '盐田', '宝安', '龙岗');
    if (selectP == '03') {
        a = 3;
        tempoption = new Option('上海', '03', false, true);
    } else { tempoption = new Option('上海', '03'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[3]=tempoption;');
    cityareacode[2] = new Array('0301', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0311', '0312', '0313', '0314', '0315', '0316', '0317', '0318', '0319', '0320');
    cityareaname[2] = new Array('宝山', '金山', '南市', '长宁', '静安', '青浦', '崇明', '卢湾', '松江', '奉贤', '浦东', '杨浦', '虹口', '普陀', '闸北', '黄浦', '闵行', '徐汇', '嘉定', '南汇');
    if (selectP == '04') {
        a = 4;
        tempoption = new Option('重庆', '04', false, true);
    } else { tempoption = new Option('重庆', '04'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[4]=tempoption;');
    cityareacode[3] = new Array('0401', '0402', '0403', '0404', '0405', '0406');
    cityareaname[3] = new Array('渝中', '江北', '沙坪坝', '南岸', '九龙坡', '大渡口');
    if (selectP == '05') {
        a = 5;
        tempoption = new Option('天津', '05', false, true);
    } else { tempoption = new Option('天津', '05'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[5]=tempoption;');
    cityareacode[4] = new Array('0501', '0502', '0503', '0504', '0505', '0506', '0507', '0508', '0509', '0510', '0511', '0512', '0513', '0514', '0515');
    cityareaname[4] = new Array('和平', '河北', '河西', '河东', '南开', '红桥', '塘沽', '汉沽', '大港', '东丽', '西青', '津南', '北辰', '武清', '滨海');
    if (selectP == '06') {
        a = 6;
        tempoption = new Option('广东', '06', false, true);
    } else { tempoption = new Option('广东', '06'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[6]=tempoption;');
    cityareacode[5] = new Array('0601', '0602', '0603', '0604', '0605', '0606', '0607', '0608', '0609', '0610', '0611', '0612', '0613', '0614', '0615');
    cityareaname[5] = new Array('广州', '珠海', '中山', '佛山', '东莞', '清远', '肇庆', '阳江', '湛江', '韶关', '惠州', '河源', '汕尾', '汕头', '梅州');
    if (selectP == '07') {
        a = 7;
        tempoption = new Option('河北', '07', false, true);
    } else { tempoption = new Option('河北', '07'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[7]=tempoption;');
    cityareacode[6] = new Array('0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709', '0710', '0711');
    cityareaname[6] = new Array('石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '张家口', '承德', '廊坊', '沧州', '保定', '衡水');
    if (selectP == '08') {
        a = 8;
        tempoption = new Option('山西', '08', false, true);
    } else { tempoption = new Option('山西', '08'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[8]=tempoption;');
    cityareacode[7] = new Array('0801', '0802', '0803', '0804', '0805', '0806', '0807');
    cityareaname[7] = new Array('太原', '大同', '阳泉', '朔州', '长治', '临汾', '晋城');
    if (selectP == '09') {
        a = 9;
        tempoption = new Option('内蒙古', '09', false, true);
    } else { tempoption = new Option('内蒙古', '09'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[9]=tempoption;');
    cityareacode[8] = new Array('0901', '0902', '0903', '0904', '0905', '0906', '0907', '0908', '0909', '0910', '0911');
    cityareaname[8] = new Array('呼和浩特', '包头', '乌海', '临河', '东胜', '集宁', '锡林浩特', '通辽', '赤峰', '海拉尔', '乌兰浩特');
    if (selectP == '10') {
        a = 10;
        tempoption = new Option('辽宁', '10', false, true);
    } else { tempoption = new Option('辽宁', '10'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[10]=tempoption;');
    cityareacode[9] = new Array('1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010', '1011', '1012', '1013', '1014');
    cityareaname[9] = new Array('沈阳', '大连', '鞍山', '锦州', '丹东', '盘锦', '铁岭', '抚顺', '营口', '辽阳', '阜新', '本溪', '朝阳', '葫芦岛');
    if (selectP == '11') {
        a = 11;
        tempoption = new Option('吉林', '11', false, true);
    } else { tempoption = new Option('吉林', '11'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[11]=tempoption;');
    cityareacode[10] = new Array('1101', '1102', '1103', '1104', '1105', '1106', '1107', '1108', '1109');
    cityareaname[10] = new Array('长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边');
    if (selectP == '12') {
        a = 12;
        tempoption = new Option('黑龙江', '12', false, true);
    } else { tempoption = new Option('黑龙江', '12'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[12]=tempoption;');
    cityareacode[11] = new Array('1201', '1202', '1203', '1204', '1205', '1206', '1207', '1208', '1209', '1210', '1211', '1212', '1213');
    cityareaname[11] = new Array('哈尔滨', '齐齐哈尔', '牡丹江', '佳木斯', '大庆', '伊春', '黑河', '鸡西', '鹤岗', '双鸭山', '七台河', '绥化', '大兴安岭');
    if (selectP == '13') {
        a = 13;
        tempoption = new Option('江苏', '13', false, true);
    } else { tempoption = new Option('江苏', '13'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[13]=tempoption;');
    cityareacode[12] = new Array('1301', '1302', '1303', '1304', '1305', '1306', '1307', '1308', '1309', '1310', '1311', '1312', '1313');
    cityareaname[12] = new Array('南京', '苏州', '无锡', '常州', '镇江', '连云港 ', '扬州', '徐州 ', '南通', '盐城', '淮阴', '泰州', '宿迁');
    if (selectP == '14') {
        a = 14;
        tempoption = new Option('浙江', '14', false, true);
    } else { tempoption = new Option('浙江', '14'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[14]=tempoption;');
    cityareacode[13] = new Array('1401', '1402', '1403', '1404', '1405', '1406', '1407', '1408', '1409', '1410', '1411');
    cityareaname[13] = new Array('杭州', '湖州', '丽水', '温州', '绍兴', '舟山', '嘉兴', '金华', '台州', '衢州', '宁波');
    if (selectP == '15') {
        a = 15;
        tempoption = new Option('安徽', '15', false, true);
    } else { tempoption = new Option('安徽', '15'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[15]=tempoption;');
    cityareacode[14] = new Array('1501', '1502', '1503', '1504', '1505', '1506', '1507', '1508', '1509', '1510', '1511', '1512', '1513', '1514', '1515', '1516', '1517');
    cityareaname[14] = new Array('合肥  ', '芜湖 ', '蚌埠 ', '滁州 ', '安庆 ', '六安 ', '黄山 ', '宣城 ', '淮南 ', '宿州 ', '马鞍山 ', '铜陵', '淮北 ', '阜阳 ', '池州 ', '巢湖 ', '亳州');
    if (selectP == '16') {
        a = 16;
        tempoption = new Option('福建', '16', false, true);
    } else { tempoption = new Option('福建', '16'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[16]=tempoption;');
    cityareacode[15] = new Array('1601', '1602', '1603', '1604', '1605', '1606', '1607', '1608', '1609');
    cityareaname[15] = new Array('福州 ', '厦门 ', '泉州 ', '漳州 ', '龙岩 ', '南平 ', '宁德 ', '莆田 ', '三明');
    if (selectP == '17') {
        a = 17;
        tempoption = new Option('江西', '17', false, true);
    } else { tempoption = new Option('江西', '17'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[17]=tempoption;');
    cityareacode[16] = new Array('1701', '1702', '1703', '1704', '1705', '1706', '1707', '1708', '1709', '1710', '1711');
    cityareaname[16] = new Array('南昌', '景德镇', '九江', '萍乡', '新余', '鹰潭', '赣州', '宜春', '吉安', '上饶', '抚州');
    if (selectP == '18') {
        a = 18;
        tempoption = new Option('山东', '18', false, true);
    } else { tempoption = new Option('山东', '18'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[18]=tempoption;');
    cityareacode[17] = new Array('1801', '1802', '1803', '1804', '1805', '1806', '1807', '1808', '1809', '1810', '1811', '1812', '1813', '1814', '1815', '1816', '1817');
    cityareaname[17] = new Array('济南', '青岛', '淄博', '德州', '烟台', '潍坊', '济宁', '泰安', '临沂', '菏泽', '威海', '枣庄', '日照', '莱芜', '聊城', '滨州', '东营');
    if (selectP == '19') {
        a = 19;
        tempoption = new Option('河南', '19', false, true);
    } else { tempoption = new Option('河南', '19'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[19]=tempoption;');
    cityareacode[18] = new Array('1901', '1902', '1903', '1904', '1905', '1906', '1907', '1908', '1909', '1910', '1911', '1912', '1913', '1914', '1915', '1916', '1917', '1918');
    cityareaname[18] = new Array('郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '周口', '驻马店', '信阳', '济源');
    if (selectP == '20') {
        a = 20;
        tempoption = new Option('湖北', '20', false, true);
    } else { tempoption = new Option('湖北', '20'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[20]=tempoption;');
    cityareacode[19] = new Array('2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017');
    cityareaname[19] = new Array('武汉', '黄石', '十堰', '荆州', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '黄冈', '咸宁', '恩施', '随州', '仙桃', '天门', '潜江', '神农架');
    if (selectP == '21') {
        a = 21;
        tempoption = new Option('湖南', '21', false, true);
    } else { tempoption = new Option('湖南', '21'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[21]=tempoption;');
    cityareacode[20] = new Array('2101', '2102', '2103', '2104', '2105', '2106', '2107', '2108', '2109', '2110', '2111', '2112', '2113');
    cityareaname[20] = new Array('长沙', '株州', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '郴州', '益阳', '永州', '怀化', '娄底', '湘西 ');
    if (selectP == '22') {
        a = 22;
        tempoption = new Option('广西', '22', false, true);
    } else { tempoption = new Option('广西', '22'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[22]=tempoption;');
    cityareacode[21] = new Array('2201', '2202', '2203', '2204', '2205', '2206', '2207', '2208', '2209', '2210', '2211', '2212');
    cityareaname[21] = new Array('南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '贺州', '百色', '河池');
    if (selectP == '23') {
        a = 23;
        tempoption = new Option('海南', '23', false, true);
    } else { tempoption = new Option('海南', '23'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[23]=tempoption;');
    cityareacode[22] = new Array('2301', '2302', '2303', '2304', '2305', '2306', '2307', '2308', '2309');
    cityareaname[22] = new Array('海口 ', '三亚', '通什', '琼海', '琼山', '文昌', '万宁', '东方', '儋州');
    if (selectP == '24') {
        a = 24;
        tempoption = new Option('四川', '24', false, true);
    } else { tempoption = new Option('四川', '24'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[24]=tempoption;');
    cityareacode[23] = new Array('2401', '2402', '2403', '2404', '2405', '2406', '2407', '2408', '2409', '2410', '2411', '2412', '2413', '2414', '2415', '2416', '2417', '2418', '2419', '2420');
    cityareaname[23] = new Array('成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充  ', '宜宾', '广安', '达川', '巴中', '雅安', '眉山  ', '阿坝 ', '甘孜 ', '凉山 ');
    if (selectP == '25') {
        a = 25;
        tempoption = new Option('贵州', '25', false, true);
    } else { tempoption = new Option('贵州', '25'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[25]=tempoption;');
    cityareacode[24] = new Array('2501', '2502', '2503', '2504', '2505', '2506', '2507', '2508', '2509');
    cityareaname[24] = new Array('贵阳 ', '六盘水', '遵义', '铜仁', '毕节', '安顺', '黔西南 ', '黔东南', '黔南');
    if (selectP == '26') {
        a = 26;
        tempoption = new Option('云南', '26', false, true);
    } else { tempoption = new Option('云南', '26'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[26]=tempoption;');
    cityareacode[25] = new Array('2601', '2602', '2603', '2604', '2605', '2606', '2607', '2608', '2609', '2610', '2611', '2612', '2613', '2614', '2615', '2616', '2617');
    cityareaname[25] = new Array('昆明', '东川', '曲靖', '玉溪', '昭通', '思茅', '临沧', '保山', '丽江', '文山 ', '红河 ', '西双版纳 ', '楚雄 ', '大理 ', '德宏 ', '怒江', '迪庆');
    if (selectP == '27') {
        a = 27;
        tempoption = new Option('西藏', '27', false, true);
    } else { tempoption = new Option('西藏', '27'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[27]=tempoption;');
    cityareacode[26] = new Array('2701', '2702', '2703', '2704', '2705', '2706', '2707');
    cityareaname[26] = new Array('拉萨', '那曲', '昌都', '山南', '日喀则', '阿里', '林芝');
    if (selectP == '28') {
        a = 28;
        tempoption = new Option('陕西', '28', false, true);
    } else { tempoption = new Option('陕西', '28'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[28]=tempoption;');
    cityareacode[27] = new Array('2801', '2802', '2803', '2804', '2805', '2806', '2807', '2808', '2809', '2810');
    cityareaname[27] = new Array('西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '商洛', '安康');
    if (selectP == '29') {
        a = 29;
        tempoption = new Option('甘肃', '29', false, true);
    } else { tempoption = new Option('甘肃', '29'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[29]=tempoption;');
    cityareacode[28] = new Array('2901', '2902', '2903', '2904', '2905', '2906', '2907', '2908', '2909', '2910', '2911', '2912', '2913', '2914');
    cityareaname[28] = new Array('兰州', '金昌', '白银', '天水', '嘉峪关', '定西', '平凉', '庆阳', '陇南', '武威', '张掖', '酒泉', '甘南 ', '临夏');
    if (selectP == '30') {
        a = 30;
        tempoption = new Option('青海', '30', false, true);
    } else { tempoption = new Option('青海', '30'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[30]=tempoption;');
    cityareacode[29] = new Array('3001', '3002', '3003', '3004', '3005', '3006', '3007', '3008');
    cityareaname[29] = new Array('西宁', '海东', ' 海北 ', '黄南', '海南', '果洛', '玉树', '海西');
    if (selectP == '31') {
        a = 31;
        tempoption = new Option('宁夏', '31', false, true);
    } else { tempoption = new Option('宁夏', '31'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[31]=tempoption;');
    cityareacode[30] = new Array('3101', '3102', '3103', '3104');
    cityareaname[30] = new Array('银川', '石嘴山', '银南', '固原');
    if (selectP == '32') {
        a = 32;
        tempoption = new Option('新疆', '32', false, true);
    } else { tempoption = new Option('新疆', '32'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[32]=tempoption;');
    cityareacode[31] = new Array('3201', '3202', '3203', '3204', '3205', '3206', '3207', '3208', '3209', '3210', '3211', '3212', '3213');
    cityareaname[31] = new Array('乌鲁木齐', '克拉玛依', '石河子', '吐鲁番', '哈密', '和田', '阿克苏', '喀什', '克孜勒苏', '巴音郭楞', '昌吉', '博尔塔拉', '伊犁');
    if (selectP == '33') {
        a = 33;
        tempoption = new Option('香港', '33', false, true);
    } else { tempoption = new Option('香港', '33'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[33]=tempoption;');
    cityareacode[32] = new Array();
    cityareaname[32] = new Array();
    if (selectP == '34') {
        a = 34;
        tempoption = new Option('澳门', '34', false, true);
    } else { tempoption = new Option('澳门', '34'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[34]=tempoption;');
    cityareacode[33] = new Array();
    cityareaname[33] = new Array();
    if (selectP == '35') {
        a = 35;
        tempoption = new Option('台湾', '35', false, true);
    } else { tempoption = new Option('台湾', '35'); }
    eval('document.' + VeryHuo + '.' + preP + '.options[35]=tempoption;');
    cityareacode[34] = new Array();
    cityareaname[34] = new Array();
    eval('document.' + VeryHuo + '.' + preP + '.options[a].selected=true;');
    cityid = selectP;
    if (cityid != '0') {
        b = 0;
        for (i = 0; i < cityareaname[cityid - 1].length; i++) {
            if (selectC == cityareacode[cityid - 1][i]) {
                b = i + 1;
                tempoption = new Option(cityareaname[cityid - 1][i], cityareacode[cityid - 1][i], false, true);
            } else
                tempoption = new Option(cityareaname[cityid - 1][i], cityareacode[cityid - 1][i]);
            eval('document.' + VeryHuo + '.' + preC + '.options[i+1]=tempoption;');
        }
        eval('document.' + VeryHuo + '.' + preC + '.options[b].selected=true;');
    }
}

function selectcityarea(preP, preC, VeryHuo) {
    cityid = eval('document.' + VeryHuo + '.' + preP + '.selectedIndex;');
    j = eval('document.' + VeryHuo + '.' + preC + '.length;');
    for (i = 1; i < j; i++) { eval('document.' + VeryHuo + '.' + preC + '.options[j-i]=null;') }
    if (cityid != "0") {
        for (i = 0; i < cityareaname[cityid - 1].length; i++) {
            tempoption = new Option(cityareaname[cityid - 1][i], cityareacode[cityid - 1][i]);
            eval('document.' + VeryHuo + '.' + preC + '.options[i+1]=tempoption;');
        }
    }
}
