require(['api_mkt_management'], function(api_mkt_management) {

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
                //$.cookie('key','');
                window.location.href="controllPanel.html";
            } else {
                //alert('输入原密码有误！');
                console.log(data.msg);
            }
        });
    });
    //后台锁定管理员
    $('#btnLock').click(function(){
        api_mkt_management.lockAdmin({
            'adminId':$('.btnLockManager').find('option:selected').text()
        },function(data) {
            if (data.status == 200) {
                console.log(data);
                //$.cookie('key','');
                window.location.href="controllPanel.html";
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
                //$.cookie('key','');
                window.location.href="controllPanel.html";
            } else {
                //alert('输入原密码有误！');
                console.log(data.msg);
            }
        });
    });
    
 
  
//end
});



