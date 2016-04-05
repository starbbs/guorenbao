require(['api_mkt_management'], function(api_mkt_management) {
    //管理员列表
    api_mkt_management.adminList({
        'pageNo':1,
        'pageSize':10
    },function(data) {
            if (data.status == 200) {
                console.log(data);
                var html = [];
                var num = data.data.list.length < 10?data.data.list.length:10;
                for(var i=0;i<num;i++){
                    html.push('<option value='+data.data.list[i].uid+'>'+ data.data.list[i].mobile+'</option>');
                    $('.btnLockManager').html(html);
                }
                //后台锁定管理员
                $('#btnLock').click(function(){
                    api_mkt_management.lockAdmin({
                        'adminId':parseInt($('.btnLockManager').find('option:selected').val())
                    },function(data) {
                        if (data.status == 200) {
                            console.log(data);
                        } else {
                            //alert('输入原密码有误！');
                            console.log(data.msg);
                        }
                    });
                });
                //后台解锁管理员
                $('#btnUnlock').click(function(){
                    api_mkt_management.unlockAdmin({
                        'adminId':$('.btnUnlockManager').find('option:selected').text()
                    },function(data) {
                        if (data.status == 200) {
                            console.log(data);
                        } else {
                            console.log(data.msg);
                        }
                    });
                });
            } else {
                console.log(data.msg);
            }
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
        api_mkt_management.create({
            'userName':$('#CreateManagerUserName').val(),
            'password':$('#CreateManagerPwd').val(),
            'role':$('.selectRole').find('option:selected').text(),
            'phone':$('#CreateManagerPhone').val()
        },function(data) {
            if (data.status == 200) {
                console.log(data);
                $('.msg_complete').text('创建成功').css('color','green');
                //window.location.href="controllPanel.html";
            } else {
                console.log(data.msg);
            }
        });
    });    
 
  
//end
});



