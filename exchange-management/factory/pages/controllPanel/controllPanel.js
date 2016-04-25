require(['api_mkt_management'], function(api_mkt_management) {
	
	var role=$.cookie('role');
	if(role){
		$(".normalController").show();
		$(".adminController").hide();
		if(role=='ADMIN'){//管理员
			$(".adminController").show();
		}else if(role=='ACCOUNTANT'){//财务
		}else if(role=='CUSTOM_SERVICE'){//客服
		}
	}
    //管理员列表
    api_mkt_management.adminList({
        'pageNo':1,
        'pageSize':10
    },function(data) {
            if (data.status == 200) {
                var htmlLocked = [];
                var htmlUnloked = [];
                var num = data.data.list.length;
                for(var i=0;i<num;i++){
                    if(data.data.list[i].locked == 'UNLOCK'){
                    	htmlUnloked.push('<option class="opt" value='+data.data.list[i].uid+' key='+data.data.list[i].locked+'>'+ data.data.list[i].opName+'</option>');
                    }else{
                        //alert($('.opt').attr('key') === 'LOCK');
                    	htmlLocked.push('<option class="opt" value='+data.data.list[i].uid+' key='+data.data.list[i].locked+'>'+ data.data.list[i].opName+'</option>');
                    }
                }  
                $('.btnLockManager').html(htmlLocked.toString());
                $('.btnUnlockManager').html(htmlUnloked.toString());    
               
            } else {
                console.log(data.msg);
            }
    });
    
    
    //后台锁定管理员
    $("body").on("click", "#btnLock", function() {
        api_mkt_management.lockAdmin({
            'adminId':parseInt($('.btnUnlockManager').find('option:selected').val())
        },function(data) {
            if (data.status == 200) {
                window.location.href="controllPanel.html";
            } else {
                console.log(data.msg);
            }
        });
    });
    
    
    //后台解锁管理员
    $("body").on("click", "#btnUnlock", function() {
        api_mkt_management.unlockAdmin({
            'adminId':parseInt($('.btnLockManager').find('option:selected').val())
        },function(data) {
            if (data.status == 200) {
                window.location.href="controllPanel.html";
            } else {
                console.log(data.msg);
            }
        });
    });
    
    //后台重置密码
    $('#btnResetPwd').click(function(){
        api_mkt_management.setLoginPassword({
            'oldPassword':$('#oldPwd').val(),
            'newPassword':$('#newPwd').val()
        },function(data) {
            if (data.status == 200) {
                console.log(data);
                //$.cookie('key','');
                window.location.href="controllPanel.html";
            } else {
                alert('输入原密码有误！');
                console.log(data.msg);
            }
        });
    });

    //后台创建管理员
    $('#btnCreateManager').click(function(){
        if($('#CreateManagerUserName').val() == ''){
            $('.msg_complete').text('请添加用户名').css('color','red');
        }else if($('#CreateManagerPwd').val() == ''){
            $('.msg_complete').text('请输入电话').css('color','red');
        }else if($('#CreateManagerPhone').val() == ''){
            $('.msg_complete').text('请输入电话').css('color','red');
        }else{
            api_mkt_management.create({
                'userName':$('#CreateManagerUserName').val(),
                'password':$('#CreateManagerPwd').val(),
                'role':$('.selectRole').find('option:selected').val(),
                'phone':$('#CreateManagerPhone').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $('.msg_complete').text('创建成功').css('color','green');
                    setTimeout(function(){
                        window.location.href="controllPanel.html";
                    },3000);
                } else{
                    $('.msg_complete').text(data.msg).css('color','red');
                }
            });
        }
    }); 
    //点击解锁管理员
    /*$('#btnUnlock').click(function(){
        window.location.href = 'controllPanel-1.html';
    });*/   
 
  
//end
});



