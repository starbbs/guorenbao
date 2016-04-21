require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {

        $('.rmbxh').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbtx').removeClass('bottomon');
            $('.recharge').show();
            $('.withdraw_deposit').hide();
        });
        $('.rmbtx').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
            //判断有无节点
            if($('.nutOutputManager').length >0){
                $('.nut-one').hide();
                $('.nut-two').show(); 
            }else{
                $('.nut-one').show();
                $('.nut-two').hide(); 
            }
                    
        });
        //果仁提现地址管理(如果有就显示)            
        api_mkt.gopAddressMan({          
            'pageNo':1,
            'pageSize':200
        }, function(data) {
            if (data.status == 200) {
                //果仁市场添加
                $('.nut-one').hide();
                $('.nut-two').show();
                for(var i=0;i<data.data.list.length;i++){
                    //创建节点
                    var Node1 = $('<div></div>');
                    Node1.addClass('nutOutputManager');
                    var Node2 = $('<p>地址：</p>').appendTo(Node1); 
                    var Node2_1 = $('<input type="text" class="nutIdName input" value="" />').appendTo(Node2); 
                    var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1); 
                    var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1); 
                    var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                    Node2_1.val(data.data.list[i].name);
                    Node2_1.attr('dataid',data.data.list[i].name);
                    Node3.text(data.data.list[i].address);
                    //$('.nut-two').appendBefore(Node1);
                    Node1.insertBefore($('.nutOutputManager-add'));
                    if($('.nutOutputManager').length % 2 == 0){
                        Node1.addClass('nutOutputManager-even');
                    }                   
                } 
                //再次添加果仁地址
                $('.nutOutputManager-addBtn').click(function(){
                    $('.nut-one').show();
                    $('.nut-two').hide();
                    $('#nut-paypwd').val('');
                    $('#nut-name').val('');
                    $('#nut-address').val('');
                    $('#nut-identifyingCode').val('');
                });
                //果仁提现地址管理删除
                $('.nutOutputManager-del').click(function(){
                    $(this).parent().remove();            
                    api_mkt.gopAddressManDel({          
                        'wallet':($(this).parent().find('.nutIdAddress').text())
                    }, function(data) {
                        if (data.status == 200) {
                          window.location.href='withdraw.html?id=rmbtx';
                        } else {
                            //alert(data.msg);
                            showWarnWin(data.msg,1e3);
                        }
                    });         
                });

                //果仁提现地址修改
                $('.nutOutputManager-modify').click(function(){
                    if($(this).parent().find('.cancleBtn').length >0){
                        
                    }else{
                       $(this).parent().find('.nutIdName').removeClass('input');
                        var Node = $('<input type="button" class="sureBtn" value="确认" /><input type="button" class="cancleBtn" value="取消" />');
                        Node.addClass('confirmUpdate');
                        Node.insertAfter($(this).parent().find('.nutIdName'));  
                    }

                    //确认修改
                    $('.sureBtn').click(function(){
                        api_mkt.gopAddressManUpdate({          
                            'id':data.data.list[$(this).parent().parent().index()].id,
                            'name':$(this).parent().find('.nutIdName').val()
                        }, function(data) {
                            if (data.status == 200) {
                                window.location.href = 'withdraw.html?id=rmbtx';
                            } else {
                            	showWarnWin(data.msg,1e3);
                            }
                        });
                    }); 
                    //取消修改
                    $('.cancleBtn').click(function(){
                        var  a = $(this).parent().find('.nutIdName').attr('dataid');
                        $(this).parent().find('.nutIdName').val(a);
                        $(this).parent().find('.nutIdName').addClass('input');
                        $(this).parent().find('.confirmUpdate').remove();
                        $(this).remove();
                        
                    });         
                });                
            } else {
            }
        });
        

        //twoBackOne  返回
        $('.twoBackOne').click(function(){
            /*$('.one').css('display','flex');
            $('.two').css('display','none');
            $(this).css('display','none');*/
            window.location.reload();
        });

        //点击-银行卡表单
        $('.bankIdCard-add').click(function(){
            $('.one').css('display','none');
            $('.two').css('display','flex');
            $('.newCard').hide();
        });
        
        $("#bank-idcard").keyup(function(){
            $(this).val($(this).val().replace(/[^0-9$]/g,''));
        });
        
        //校验银行账户
        var btnConfirm = false;
        //银行账号校验-人民币提现管理
        $("#bank-idcard").blur(function(){
            var bankIdcard = $("#bank-idcard").val();
            var reg = /^(\d{16}|\d{19})$/;
            if(!bankIdcard || !reg.exec(bankIdcard)){
                btnConfrim = false;
                $('.msg-bank-idcard').show().text('请输入正确的银行账号');
            }else{
                $('.msg-bank-idcard').hide();
                btnConfrim = true;
                //接口 银行卡识别
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: api_mkt.basePath2,
                    data: JSON.stringify({
                        'bankCard':$("#bank-idcard").val()
                    }),
                    cache: false,
                    success: function(data) {
                        if(data.msg = '无法识别此卡'){
                            $('.msg-bank-idcard').show().text('您输入的银行账号有误，请重新输入');
                        }else{
                            $('.msg-bank-idcard').hide();
                        }

                        //所属银行自动添加
                        if(data.data.bankName!='中国工商银行' && data.data.bankName!='中国建设银行' && data.data.bankName!='中国农业银行' 
                    		&& data.data.bankName!='交通银行' && data.data.bankName!='中国邮政储蓄银行'  && data.data.bankName!='招商银行' ){
                        	$("#bank").val('暂不支持('+data.data.bankName+')');
                            $('.msg-bank-idcard').hide();
                    	}else if(data.data.cardType == 'CREDIT_CARD'){
                            $('.msg-bank-idcard').show().text('仅支持储蓄卡提现');
                        }else{
                            $("#bank").val(data.data.bankName);
                            $('.msg-bank-idcard').hide();
                        }
                    },
                    error: function() {
                    }
                });
            }
        });

        //全国省市二级联动下拉选择菜单-人民币提现管理
        first("selectp","selectc","form1",0,0);
        
        //校验开户支行-人民币提现管理
        var subbankBtn = false;
        $('#subbank').blur(function(){
            var subbank = $.trim($(this).val());
            var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            
            if(!subbank || !reg.test(subbank) || $(".select-area").val()=="0"  || $(".select-city").val()=="0"){
                btnConfirm = false;
                $('.msg-subbank').show().text('请输入正确的开户支行地址');
                subbankBtn = false;
            }else{
                btnConfirm = true;
                $('.msg-subbank').hide();
                subbankBtn = true;
            }
        });
        
        //校验支付密码-人民币提现管理
        $('.pay-pwd').blur(function(){
            var reg = new RegExp("^[0-9]*$");//纯数字
            var hanzi = /[\u4e00-\u9fa5]/;//汉字
            if($(this).val().indexOf(" ")>0 || $(this).val().length>20||$(this).val().length<8 || reg.test($(this).val()) || hanzi.test($(this).val())){
                btnConfirm = false;
                $('.msg-pay-pwd').show().text('请输入正确的支付密码');
            }else{
                btnConfirm = true;
                $('.msg-pay-pwd').hide();
            }
        });

        //校验验证码-人民币提现管理
        $('#sendCodeByLoginAfter, #nut-identifyingCode').blur(function(){
            var code = $.trim($(this).val());
            if(isNaN(code) || code==""){
                btnConfirm = false;
                $('.msg-sendCodeByLoginAfter').show().text('请输入正确的验证码');
                $('.msg-nut-identifyingCode').show().text('请输入正确的验证码');
            }else{
                btnConfirm = true;
                $('.msg-sendCodeByLoginAfter').hide();
                $('.msg-nut-identifyingCode').hide();
            }
        });
        //获取验证码-人民币提现管理
        $('#sendCodeByLoginAfterBtn').click(function(){
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
            var resend = setInterval(function(){
                    count--;
                    if(count > 0){
                        $('#sendCodeByLoginAfterBtn').val(count+'s后重新发送');
                        $('#sendCodeByLoginAfterBtn').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
                    }else{
                        clearInterval(resend);
                        $('#sendCodeByLoginAfterBtn').attr('disabled',false).css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
                    }
                    
                },1000);     
        });

        //人民币提现管理添加 点击-确认添加银行卡
        $('.confirmAdd').click(function(){
        	if(global.payLocked){
        		window.location.reload();
        		$(window).scrollTop(0);
        		return false;
        	}
            if(btnConfirm == false || $('#sendCodeByLoginAfter').val() ==''){
//                showWarnWin('请完善填写信息！',1e3);
            	$("#bank-idcard").focus();
            	$('#subbank').focus();
            	$('.pay-pwd').focus();
            	$('#sendCodeByLoginAfter, #nut-identifyingCode').focus();
            	
            	$("#bank-idcard").blur();
            	$('#subbank').blur();
            	$('.pay-pwd').blur();
            	$('#sendCodeByLoginAfter, #nut-identifyingCode').blur();
            }else{       
            	//中国工商银行，中国建设银行，中国农业银行，中国交通银行，中国邮政储蓄银行，招商银行
            	if($('#bank').val()!='中国工商银行' && $('#bank').val()!='中国建设银行' && $('#bank').val()!='中国农业银行' 
            		&& $('#bank').val()!='交通银行' && $('#bank').val()!='中国邮政储蓄银行'  && $('#bank').val()!='招商银行' ){
            		$('.msg-bank').show().text('暂不支持此银行');
            		return false;
            	}
                var auth_name = $.cookie("global_loginusername");
                api_mkt.rmbWithdrawalsManageAdd({          
                    'name':auth_name, 
                    'bank': $('#bank').val(),
                    'bankId':$('#bank-idcard').val(),
                    'bankProvince':$('.select-area').find('option:selected').text(),
                    'bankCity':$('.select-city').find('option:selected').text(),
                    'subbank':$('#subbank').val(),
                    'payPwd':$('#pay-pwd').val(),
                    'identifyingCode':$('#sendCodeByLoginAfter').val()
                }, function(data) {
                	$('.msg-sendCodeByLoginAfter').text('');
                    if (data.status == 200) {  
                    	window.location.reload();
                    } else if(data.msg == '验证码错误'){
                        $('.msg-sendCodeByLoginAfter').show().text('验证码错误');
                    } else if(data.msg == '服务器异常'){
                        showWarnWin('服务器异常',1e3);
                    } else if(data.msg == '提现银行卡账户名必须与您的实名认证姓名一致'){
                        $('.msg-bank-idcard').show().text('提现银行卡账户名必须与您的实名认证姓名一致');
                    } else if(data.msg == '同一用户不能添加相同银行卡'){
                        //showWarnWin('同一用户不能添加相同银行卡',1e3);
                        $('.msg-bank-idcard').show().text('同一用户不能添加相同银行卡');
                    }else if(data.data && data.data.num){
            			var num=data.data?data.data.num:data.date.num;
                        if(3-num > 0 ){
                            $('.msg-sendCodeByLoginAfter').show().text("支付密码错误，您还有"+(3-num)+"次输入机会");
                        }else{                                
                            $('.msg-sendCodeByLoginAfter').show().html("为保证资金安全，您的支付密码已被锁定，请<a href='resetpaymentcode.html' class='moreCheck'>找回支付密码</a>");
                        }
            		}else if(data.msg.indexOf('锁定')>0){
            			$('.msg-sendCodeByLoginAfter').show().text(data.msg);
            			window.location.reload();
                		$(window).scrollTop(0);
            		}else{
                        showWarnWin(data.msg,1e3);
                    }             
                });
                
            }            
        });        

        //果仁提现地址备注-校验
        $('.msg-nut-name').show().html('<p style="color:#999;">果仁市场内互转即时极速到账</p>');
        var btnNut1 = false;
        $('#nut-name').blur(function(){
            var name = $(this).val();
            if(!name){
                btnNut1 = false;
                $('.msg-nut-name').show().text('请输入地址备注');
            }else{
                btnNut1 = true;
                $('.msg-nut-name').show().html('<p style="color:#999;">地址备注完成：果仁市场内互转即时极速到账</p>');
            }
        });
        //果仁提现地址-校验
        var btnNut2 = false;
        $('#nut-address').blur(function(){
            var address = $(this).val();
            if(!address){
                btnNut2 = false;
                $('.msg-nut-address').show().text('请输入正确地址');
            }else{
                btnNut2 = true;
                $('.msg-nut-address').hide();
            }
        });
        //校验支付宝密码
        var btnNut3 = false;
        $('#nut-paypwd').blur(function(){
            var nutPayPwd = $(this).val();
            if(!nutPayPwd){
                btnNut3 = false;
                $('.msg-nut-paypwd').show().text('请输入支付密码');
            }else{
                btnNut3 = true;
                $('.msg-nut-paypwd').hide();
            }
        });
        //验证码校验
        var btnNut4 = false;
        $('#nut-identifyingCode').blur(function(){
            var pwd = $(this).val();            
            if(!pwd || isNaN(pwd) || pwd.length !== 6){
                $('.msg-code').text('请输入正确的验证码');
                btnNut4 = false;
            }else{
                $('.msg-code').hide();
                btnNut4 = true;
            }
        });
        //获取验证码-人民币提现管理
        $('#nut-identifyingCodeBtn').click(function(){
            if(btnNut3 == false){
                showWarnWin('请完善填写信息！',1e3);
            }
            else{
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
                var resend = setInterval(function(){
                        count--;
                        if(count > 0){
                            $('#nut-identifyingCodeBtn').val(count+'s后重新发送');
                            $('#nut-identifyingCodeBtn').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
                        }else{
                            clearInterval(resend);
                            $('#nut-identifyingCodeBtn').attr('disabled',false).css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
                        }
                        
                    },1000); 
            }
            
        });
        //果仁提现地址管理添加
        $('.gopAddressManAdd').click(function(){
        	if(global.payLocked){
        		location.href = "withdraw.html?id=rmbtx ";
        		$(window).scrollTop(0);
        		return false;
        	}
            if(btnNut1 == false){
                $('.msg-nut-name').show().text('请输入地址备注');
            }else if(btnNut2 == false){
                $('.msg-nut-address').show().text('请输入正确地址');
            }else if(btnNut3 == false){
                $('.msg-nut-paypwd').show().text('请输入正确的支付密码');
            }else if(btnNut4 == false){
                $('.msg-nut-identifyingCode').show().text('请输入正确的短信验证码');
            }else{
                api_mkt.gopAddressManAdd({          
                    'name':$('#nut-name').val(),
                    'paypwd': $('#nut-paypwd').val(),
                    'address':$('#nut-address').val(),
                    'identifyingCode':$('#nut-identifyingCode').val()
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
                        if($('.nutOutputManager').length % 2 == 0){
                            Node1.addClass('nutOutputManager-even');
                        }
                        //再次添加果仁地址
                        $('.nutOutputManager-add').click(function(){
                            $('.nut-one').show();
                            $('.nut-two').hide();
                            $('#nut-paypwd').val('');
                            $('#nut-identifyingCode').val('');
                            $('#nut-name').val('');
                            $('#nut-address').val('');
                        }); 
                        window.location.href='withdraw.html?id=rmbtx'; 
                    }else if(data.msg == '验证码错误'){
                        $('.msg-nut-identifyingCode').show().text('请输入正确的短信验证码');
                    }else if(data.data && data.data.num){
            			var num=data.data?data.data.num:data.date.num;
                            if(3-num > 0 ){
                                $('.msg-nut-paypwd').show().text("支付密码错误，您还有"+(3-num)+"次输入机会");
                            }else{                                
                                $('.msg-nut-paypwd').show().html("提示为保证资金安全，您的支付密码已被锁定，请<a href='resetpaymentcode.html' class='moreCheck'>找回支付密码</a>");
                            }
            		}else if(data.msg.indexOf('锁定')>0){
            			$('.msg-nut-identifyingCode').show().text(data.msg);
            			window.location.href='withdraw.html?id=rmbtx'; 
                		$(window).scrollTop(0);
            		}else if(data.msg == '果仁提现地址管理添加错误'){
                        $('.msg-nut-address').show().text('非法地址');
                    }else if(data.msg == '钱包地址格式错误'){
                        $('.msg-nut-address').show().text('钱包地址格式错误');
                    }else{
                        showWarnWin(data.msg,1e3);
                    }
                });
            }            
        });        
        
        //接受跳转参数
        $(function(){
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
            
        })

    //判断是否有银行卡
    api_mkt.bankList({  
        'pageNo':1,
        'pageSize' :10  
    }, function(data) {
        if (data.status == 200) {
            for(var i=0;i<data.data.list.length;i++){
                var name = data.data.list[i].name;
                var num = data.data.list[i].acnumber;  //银行卡号
                var bankName = data.data.list[i].bank;  //所属银行
                var bankIP = data.data.list[i].province + data.data.list[i].city + data.data.list[i].subbank;  //支行
                
                var node = $('<div></div>').addClass('bankIdCard addBankCard newCard');
                var nodeList =$('<section class="bankIdCard-bankLogoName bankName">'+bankName+'</section>'+
                                '<section class="bankIdCard-Code">'+'尾号：'+num.substr(num.length-4)+'</section>'+            
                                '<section class="bankIdCard-CardAndBg">储蓄卡</section>'+
                                '<section class="bankIdCard-hr"></section>'+
                                '<section class="bankIdCard-Name">持卡人姓名：'+name.replace(name.substr(0,1),'*')+'</section>'+
                                '<section class="bankIdCard-del" data-cardId="'+num+'">删除</section>'+
                                '<section class="bankIdCard-address">'+bankIP+'</section>').appendTo(node);
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
            $('.bankIdCard-del').click(function(){
                api_mkt.rmbWithdrawalsManageDel({          
                    'bankId':$(this).attr('data-cardId')
                }, function(data) {
                    if (data.status == 200) {
                        window.location.reload();
                    } else {
                    }
                });
            });
        } else {
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