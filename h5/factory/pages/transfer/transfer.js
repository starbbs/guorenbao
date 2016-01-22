// 余效俭 2016-01-09 20:58:22 创建
// H5微信端 --- 转果仁


require(['router', 'api', 'h5-view', 'h5-price', 'get',
    'h5-view-nickname', 'h5-view-address-mine', 'h5-view-address-wallet',
    'h5-dialog-paypass',
    'h5-text', 'h5-view-authentication', 'h5-weixin'
], function(router, api, View, price, get,
    nickname, address_mine, address_wallet,
    dialogPaypass) {

    router.init(true);
    var gopToken = $.cookie('gopToken');
    var transfer = $('.transfer');
    var transfer_new = new View('transfer-new');
    var transfer_contacts = new View('transfer-contacts');
    var transfer_target_view = new View('transfer-target');
    var transfer_bill = new View('transfer-bill');
    var vm = avalon.define({
        $id: 'transfer',
        hasWallet: false,
        marketGopAddress: '',
        transferOutType: '',
        gopNum: 0,
        list: [],
        newTarget_click: function(e) {
            //新目标
            vm.transferOutType = 'NEW';
            transfer_new.newTarget = '';
            router.go('/view/transfer-new');
        },
        myWallet_click: function(e) {
            //我的钱包
            if (vm.hasWallet) {
                vm.transferOutType = 'ME_WALLET';
                api.walletList({
                    gopToken: gopToken
                }, function(data) {
                    if (data.status == 200) {
                        var nowData = {};
                        nowData.name = '我的钱包';
                        for (var i = 0; i < data.data.walletList.length; i++) {
                            var item = data.data.walletList[i];
                            if (!nowData.address) {
                                nowData.address = item.address;
                                nowData.walletId = item.id;
                            }
                            if (item.defaultWallet) {
                                nowData.address = item.address;
                                nowData.walletId = item.id;
                                break;
                            }
                        }
                        $.extend(transfer_target, nowData);
                        targetInit(vm.transferOutType);
                        router.go('/view/transfer-target');
                    } else {
                        console.log(data);
                    }
                });
            } else {
                //跳转到钱包地址
                address_wallet.vm.hasNext = true;
                address_wallet.vm.callback = function() {
                    init();
                    router.go('/');
                }
                router.go('/view/address-wallet');
            }
        },
        marketWallet_click: function(e) {
            //果仁市场
            if (vm.marketGopAddress != '') {
                vm.transferOutType = 'GOP_MARKET';
                vm.gopAddress = vm.marketGopAddress;
                var nowData = {};
                nowData.address = vm.marketGopAddress;
                nowData.name = '果仁市场';
                nowData.isMarket = true;
                $.extend(transfer_target, nowData);
                targetInit(vm.transferOutType);
                router.go('/view/transfer-target');
            } else {
                //跳转到设置果仁市场
                address_mine.vm.hasNext = true;
                address_mine.vm.callback = function() {
                    api.info({
                        gopToken: gopToken
                    }, function(data) {
                        if (data.status == 200) {
                            if (data.data.marketGopAddress) {
                                vm.marketGopAddress = data.data.marketGopAddress; //果仁市场地址
                                vm.transferOutType = 'GOP_MARKET';
                                vm.gopAddress = vm.marketGopAddress;
                                var nowData = {};
                                nowData.address = vm.marketGopAddress;
                                nowData.name = '果仁市场';
                                nowData.isMarket = true;
                                $.extend(transfer_target, nowData);
                                targetInit(vm.transferOutType);
                                router.go('/view/transfer-target');
                            }
                        } else {
                            console.log(data);
                        }
                    });
                }
                router.go('/view/address-mine');
            }
        },
        gopContact_click: function(e) {
            //果仁宝联系人
            vm.transferOutType = 'GOP_CONTACT';
            router.go('/view/transfer-contacts');
            transfer_contacts.query();
        },
        walletContact_click: function(e) {
            //钱包联系人
            vm.transferOutType = 'WALLET_CONTACT';
            router.go('/view/transfer-contacts');
            transfer_contacts.query();
        },
        transfer_click: function(e) {
            //最近联系人
            vm.transferOutType = $(this).attr("transferOutType");
            vm.gopAddress = $(this).attr("address");
            var nowData = {};
            nowData.address = $(this).attr("address");
            nowData.name = $(this).attr("name");
            nowData.personId = $(this).attr("personId");
            nowData.photo = $(this).attr("photo");
            $.extend(transfer_target, nowData);
            targetInit(vm.transferOutType);
            router.go('/view/transfer-target');

        }
    });

    var transfer_new = avalon.define({
        $id: 'transfer-new',
        newTarget: '',
        checked: true,
        check: function(e) {
            if (this.value.length != 11 && this.value.length != 67 && this.value.length != 68) {
                transfer_new.checked = true;
            } else if (this.value.length == 11) {
                var reg = /^0?1[3|4|5|8\7][0-9]\d{8}$/;
                if (!reg.test(this.value)) {
                    transfer_new.checked = true;
                } else {
                    transfer_new.checked = false;
                }
            } else if (this.value.indexOf('GOP') != 0) {
                transfer_new.checked = true;
            } else {
                transfer_new.checked = false;
            }
            if (transfer_new.checked) {
                $(this).addClass("error");
            } else {
                $(this).removeClass("error");
            }
        },
        new_next_click: function(e) {
            if (transfer_new.newTarget == '') {
                $.alert("手机号或地址为空");
                return;
            } else if (transfer_new.newTarget.length == 11) {
                var reg = /^0?1[3|4|5|8\7][0-9]\d{8}$/;
                if (!reg.test(transfer_new.newTarget)) {
                    $.alert("该手机号格式不正确");
                    return;
                }
            } else if (transfer_new.newTarget.length == 67 || transfer_new.newTarget.length == 68) {
                if (transfer_new.newTarget.indexOf('GOP') != 0) {
                    $.alert("该地址格式不正确");
                    return;
                }
            } else {
                $.alert("该地址格式不正确");
                return;
            }

            if (transfer_new.newTarget != '') {
                var nowData = {};
                var re = /^1\d{10}$/
                if (re.test(transfer_new.newTarget)) {
                    vm.transferOutType = 'GOP_NEW';
                    nowData.phone = transfer_new.newTarget;
                } else if (transfer_new.newTarget.indexOf('GOP') >= 0) {
                    vm.transferOutType = 'WALLET_NEW';
                }
                nowData.address = transfer_new.newTarget;
                api.transferValidate({
                    gopToken: gopToken,
                    address: transfer_new.newTarget
                }, function(data) {
                    if (data.status == 200) {
                        if (data.data) {
                            if (data.data.photo) {
                                nowData.photo = data.data.photo;
                            }
                            if (data.data.nick) {
                                nowData.name = data.data.nick;
                            } else {
                                nowData.name = "未命名地址";
                                transfer_bill.hasSetup = false;
                            }
                        } else {
                            nowData.name = "未命名地址";
                        }
                        $.extend(transfer_target, nowData);
                        targetInit(vm.transferOutType);
                        router.go('/view/transfer-target');
                    } else {
                        if (transfer_new.newTarget.length == 11) {
                            $.alert('该手机号未注册');
                        } else {
                            nowData.name = "未命名地址";
                            $.extend(transfer_target, nowData);
                            targetInit(vm.transferOutType);
                            router.go('/view/transfer-target');
                        }
                        console.log(data);
                    }
                });
            } else {
                $.alert('地址格式错误');
            }
        },
    });
    var transfer_contacts = avalon.define({
        $id: 'transfer-contacts',
        search: '',
        list: [],
        submit: function() {
            transfer_contacts.query();
            return false;
        },
        query: function() {
            api.person({
                contactType: vm.transferOutType,
                contactQuery: transfer_contacts.search,
                gopToken: gopToken
            }, function(data) {
                if (data.status == 200) {
                    transfer_contacts.list = dataHandler(data.data);
                } else {
                    console.log(data);
                }
            });
        },
        listClick: function(ev) {
            var item = $(ev.target).closest('.contacts-item');
            if (!item.length) {
                return;
            }
            var arr = item.get(0).dataset.path.split('/');
            var models = transfer_contacts.list[arr[0]].list[arr[1]];
            var nowData = {};
            nowData.personId = models.$model.id;
            if (models.$model.address) {
                nowData.address = models.$model.address;
            };
            if (models.$model.phone) {
                nowData.address = models.$model.phone;
            };
            if (models.$model.picture) {
                nowData.photo = models.$model.picture;
            };
            if (models.$model.name) {
                nowData.name = models.$model.name;
            };
            $.extend(transfer_target, nowData);
            targetInit(vm.transferOutType);
            router.go('/view/transfer-target');
        }
    });
    var transfer_target = avalon.define({
        $id: 'transfer-target',
        address: '',
        phone: '',
        name: '未命名地址',
        photo: './images/index-2.jpg',
        gopUserNick: '未命名',
        personId: null,
        walletId: null,
        payPassword: '123456', //支付密码
        serviceFee: 0.01, //服务费
        transferNum: '', //转果仁数	
        gopNum: 0, //拥有果仁数	
        price: 0, //实价
        cnyMoney: 0, //约合人民币
        content: '', //转账说明
        notchecked: true, //是否没有检验通过
        isMarket: false, //是否是果仁市场
        getCnyMoney: function(e) {
            if (this.value > 0 && this.value <= transfer_target.gopNum) {
                transfer_target.notchecked = false;
            } else {
                transfer_target.notchecked = true;
            }
            var whether_include_numrice = this.value.indexOf(".");
            if (whether_include_numrice != -1) {
                if (this.value.substring(whether_include_numrice + 1, whether_include_numrice + 4).length > 2) {
                    transfer_target.transferNum = this.value.substring(0, whether_include_numrice + 3);
                }
            }
            transfer_target.cnyMoney = transfer_target.price * this.value;
        },
        commit_send: function() {


        },
        transfer_commit_click: function() {
            if (transfer_target.transferNum > 0 && transfer_target.transferNum <= transfer_target.gopNum) {
                dialogPaypass.show();
                dialogPaypass.vm.callback = function(value) {
                    var transferOutType = vm.transferOutType;
                    if (vm.transferOutType.indexOf('NEW') > 0) {
                        transferOutType = 'NEW';
                    }
                    api.transfer({
                        gopToken: gopToken,
                        transferType: transferOutType,
                        personId: transfer_target.personId,
                        address: transfer_target.address,
                        walletId: transfer_target.walletId,
                        serviceFee: parseFloat(transfer_target.serviceFee),
                        content: transfer_target.content,
                        transferNum: parseFloat(transfer_target.transferNum),
                        payPassword: value
                    }, function(data) {
                        if (data.status == 200) {
                            var nowData = {};
                            nowData.successFlag = true;
                            if (transfer_target.address) {
                                if (transfer_target.address.length == 11) {
                                    nowData.address = transfer_target.address.substr(0, 3) + '****' + transfer_target.address.substr(7, 4);
                                } else {
                                    nowData.address = transfer_target.address.substr(0, 8) + '**********';
                                }
                            };
                            if (transfer_target.phone) {
                                nowData.phone = transfer_target.phone;
                            }
                            nowData.name = transfer_target.name;
                            nowData.photo = transfer_target.photo;
                            nowData.personId = transfer_target.personId;
                            nowData.walletId = transfer_target.walletId;
                            nowData.serviceFee = transfer_target.serviceFee;
                            nowData.transferNum = transfer_target.transferNum;
                            nowData.content = transfer_target.content;
                            nowData.transferOutId = data.data.transferOutId;
                            nowData.createTime = data.data.createTime;
                            $.extend(transfer_bill, nowData);
                            router.go('/view/transfer-bill');
                            transfer_bill_init(nowData);
                        } else {
                            console.log(data);
                            $.alert(data.msg);
                        }
                    });
                };
            } else {
            	if(transfer_target.transferNum < 0){
	            	$.alert('请输入大于0的数');
	            }
	            if(transfer_target.gopNum <= 0){
	            	$.alert('您的果仁币为0');
	            }
            }
        },
    });
    var transfer_bill = avalon.define({
        $id: 'transfer-bill',
        address: '',
        phone: '',
        name: '未命名地址',
        photo: './images/index-2.jpg',
        gopUserNick: '未命名',
        personId: null,
        walletId: null,
        serviceFee: 0.01, //服务费
        transferNum: '', //转果仁数	
        content: '', //转账说明
        successFlag: true, //是否提交成功
        tradeNo: '2015110563563544101', //流水号
        stage: 'half',
        transferOutId: null,
        createTime: new Date(),
        successTime: new Date(),
        isSuccess: false,
        isProcessing: false,
        hasSetup:true,
        back_click: function(e) {
            router.go('/');
        },
        remark_click: function(e) {
            var nowData = {};
            nowData.id = transfer_bill.personId;
            nowData.callback = function() {
                window.history.back();
                window.history.back();
                window.history.back();
                refresh_list();
            }
            $.extend(nickname.vm, nowData);
            router.go('/view/nickname');
        }
    });
    var transfer_bill_init = function(data) {
        $('.bill-head').hide();
        $('.transfer-icon').hide();
        $('.bill-detail').hide();
        $('.bill-get-number').removeClass("light");
        $('.bill-get-label').removeClass("light");
        $('.bill-get-label').removeClass("ash");


        if (vm.transferOutType == 'WALLET_NEW') {
            //新钱包
            if (data.photo) {
                $('.img-w').show();
            } else {
                $('.transfer-icon-1').show();
            }
        } else if (vm.transferOutType == 'GOP_NEW') {
            //新果仁宝
            if (data.photo) {
                $('.img-w').show();
            } else {
                $('.transfer-icon-1').show();
            }
        } else if (vm.transferOutType == 'WALLET_CONTACT') {
            //钱包联系人
            $('.transfer-icon-5').show();
        } else if (vm.transferOutType == 'GOP_CONTACT') {
            //果仁宝联系人
            $('.img-w').show();
        } else if (vm.transferOutType == 'GOP_MARKET') {
            //果仁市场
            $('.transfer-icon-3').show();
        } else if (vm.transferOutType == 'ME_WALLET') {
            //我的钱包
            $('.transfer-icon-2').show();
        }

        api.transferQuery({
            gopToken: gopToken,
            transferOutId: data.transferOutId
        }, function(datas) {
            if (datas.status == 200) {
                transfer_bill.personId = datas.data.transferOut.personId;
                transfer_bill.walletId = datas.data.transferOut.walletId;
                transfer_bill.failureMsg = datas.data.transferOut.failureMsg;
                transfer_bill.transContent = datas.data.transferOut.transContent;
                //transfer_bill.serviceFee=datas.data.transferOut.serviceFee;
                // transfer_bill.address=datas.data.transferOut.address;
                transfer_bill.status = datas.data.transferOut.status;
                transfer_bill.createTime = datas.data.transferOut.createTime;
                transfer_bill.updateTime = datas.data.transferOut.updateTime;
                transfer_bill.tradeNo = datas.data.transferOut.serialNum;
                if (transfer_bill.personId) {
                    $('.remark').show();
                } else {
                    $('.remark').hide();
                }
                if (transfer_bill.status == 'SUCCESS') {
                    $('.bill-head.success').show();
                    $('.bill-get-number').removeClass("light");
                    $('.bill-get-label').removeClass("light");
                    $('.bill-detail-success').show();
                    $('.transfer-bill-desc-right').show();
                    transfer_bill.stage = 'finish';
                    transfer_bill.successTip = "";
                    transfer_bill.isSuccess = true;
                    $('.back').hide();
                } else if (transfer_bill.status == 'PROCESSING') {
                    $('.bill-head.going').show();
                    $('.bill-get-number').removeClass("light");
                    $('.bill-get-label').removeClass("light");
                    $('.bill-detail-success').show();
                    $('.transfer-bill-desc-left').show();
                    transfer_bill.stage = 'half';
                    var myDate = new Date(); //TODO兼容晚上
                    myDate.setHours(myDate.getHours() + 2);
                    transfer_bill.successTime = myDate;
                    transfer_bill.isProcessing = true;
                    transfer_bill.hasSetup = false;
                    $('.back').hide();
                } else {
                    $('.bill-head.fail').show();
                    $('.bill-get-number').addClass("light");
                    $('.bill-get-label').addClass("light");
                    $('.bill-detail-failure').show();
                    $('.back').show();
                }
            } else {
                console.log(datas);
            }
        });
    }
    var dataHandler = function(data) {
        var result = {
            arr: [],
            other: []
        };
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                result[i.length === 1 ? 'arr' : 'other'].push({ // 字母放到arr, 其他放到other
                    name: i,
                    list: data[i]
                });
            }
        };
        result.arr.sort(function(a1, a2) {
            return a1.name > a2.name;
        });
        return result.arr.concat(result.other);
    };
    var targetInit = function(transferOutType) {
        transfer_target.transferNum = ''; //转果仁数
        transfer_target.cnyMoney = 0; //约合人民币
        transfer_target.content = ''; //转账说明
        transfer_target.notchecked = true, //是否没有检验通过
            $('.transfer-target-head').hide();
        $('.transfer-target-box').hide();
        if (transferOutType == 'WALLET_NEW') {
            //新钱包
            $('.wallet-address').show();
            $('.wallet').show();
        } else if (transferOutType == 'GOP_NEW') {
            //新果仁宝
            $('.phone-address').show();
            $('.gop').show();
        } else if (transferOutType == 'WALLET_CONTACT') {
            //钱包联系人
            $('.wallet-address').show();
            $('.wallet').show();
        } else if (transferOutType == 'GOP_CONTACT') {
            //果仁宝联系人
            $('.phone-address').show();
            $('.gop').show();
        } else if (transferOutType == 'GOP_MARKET') {
            //果仁市场
            $('.gop-market').show();
            $('.wallet').show();
        } else if (transferOutType == 'ME_WALLET') {
            //我的钱包
            $('.my-wallet').show();
            $('.wallet').show();
        }
        //获取当前实价
        getprice();
    };
    var getprice = function() {
        price.once(setprice);
    };
    var setprice = function(price) {
        var nowData = {};
        nowData.price = price;
        $.extend(transfer_target, nowData);
    };
    var init = function() {
        api.info({
            gopToken: gopToken
        }, function(data) {
            if (data.status == 200) {
                if (!data.data.realname) {
                    router.go('/view/authentication');
                    setTimeout(function() {
                        router.go('/view/authentication');
                    });
                }
                if (data.data.marketGopAddress) {
                    vm.marketGopAddress = data.data.marketGopAddress; //果仁市场地址
                }
                if (data.data.hasWallet) {
                    vm.hasWallet = data.data.hasWallet; //果仁市场地址。null或空字符串都表示未设置
                }

            } else {
                console.log(data);
            }
        });

        api.getGopNum({
            gopToken: gopToken
        }, function(data) {
            if (data.status == 200) {
                if (data.data.gopNum) {
                    vm.gopNum = data.data.gopNum; //果仁数量
                    transfer_target.gopNum = data.data.gopNum; //果仁数量
                }
            } else {
                console.log(data);
            }
        });

        refresh_list();
    };
    var refresh_list = function() {
        api.transferRecent({
            gopToken: gopToken
        }, function(data) {
            if (data.status == 200) {
                vm.list.clear();
                for (var i = 0; i < data.data.transferOutList.length; i++) {
                    var item = data.data.transferOutList[i];
                    if (item.type == 'WALLET_NEW') {
                        if (item.photo) {
                            $('.img-w-' + data.personId).show();
                        } else {
                            item.icon = '1';
                            $('.img-w-' + data.personId).hide();
                        }
                    } else if (item.type == 'GOP_NEW') { //新果仁宝
                        if (item.photo) {
                            $('.img-w-' + data.personId).show();
                        } else {
                            item.icon = '1';
                            $('.img-w-' + data.personId).hide();
                        }
                    } else if (item.type == 'WALLET_CONTACT') { //钱包联系人
                        item.icon = '5';;
                    } else if (item.type == 'GOP_CONTACT') { //果仁宝联系人
                        if (item.photo) {
                            $('.img-w-' + data.personId).show();
                        } else {
                            item.icon = '5';
                            $('.img-w-' + data.personId).hide();
                        }
                    } else if (item.type == 'GOP_MARKET') { //果仁市场
                        item.icon = '3';
                    } else if (item.type == 'ME_WALLET') { //我的钱包
                        item.icon = '2';
                    }

                    if (item.phone) {
                        item.phone = item.phone;
                        item.address = item.phone;
                    } else {
                        item.address = item.address;
                    }
                    if (item.address) {
                        if (item.address.length == 11) {
                            item.addressStr = item.address.substr(0, 3) + '****' + item.address.substr(7, 4);

                        } else if (item.address.length > 11) {
                            item.addressStr = item.address.substr(0, 8) + '**********';
                        }
                    }
                    vm.list.push(item);
                }

            } else {
                console.log(data);
            }
        });
    };
    avalon.scan();
    init();
    // transfer_target_view.on("root", function() {
    //     dialogPaypass.hide();
    // });
    transfer_target_view.on("hide", function() {
    	dialogPaypass.hide();
        transfer_target.transferNum = '';
        $('.transfer-target-box .text-input').val('');
    });
    transfer_target_view.on("show", function() {
        transfer_target.transferNum = '';
        $('.transfer-target-box .text-input').val('');
    });
    setTimeout(function() {
        transfer.addClass('on');
        if (get.data.from === 'contact') {
            var data = $.cookie('gop_contact');
            if (data) {
                data = JSON.parse(data); //联系人数据
                console.log(data);
                transfer_target.address = data.address;
                transfer_target.name = data.name;
                transfer_target.personId = data.id;
                transfer_target.photo = data.picture;
                transfer_target.phone = data.phone;
                console.log("++++++++++++"+transfer_target.phone);
                if (data.type == "guoren") {
                    vm.transferOutType = "GOP_CONTACT";
                }
                if (data.type == "wallet") {
                    vm.transferOutType = "GOP_MARKET";
                }
                console.log(transfer_target);
                console.log(vm.transferOutType);
                targetInit(vm.transferOutType);
                router.go('/view/transfer-target');
            } else {
                api.log('cookie中并没有联系人数据');
            }
        }
    }, 100);
});
