//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
            "follow" : "跟进",
            "addcontact" : "新增联系人",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "CRM Home", 
            "follow" : "Follow Up",
            "addcontact" : "Add Contact",            
        };

var _url = document.referrer;

$(function(){
    $("body").keydown(function(){
        if (window.event.keyCode == 13) {
            //如果发生了按下回车键事件，回车键对应的编号是13

            $("#Login").trigger("click"); //则激活登录按钮的click事件
        }
    });
})



//登录
////验证手机号
//$('.loPhone input').blur(function() {
//	var phoneNum = $(this).val()
//	if(common.checkmobileNo(phoneNum) == false) {
//		comModel('手机号码格式不正确！')
//	}
//})
////验证密码
//$('.loPass input').blur(function() {
//	var userPass = $(this).val()
//	if(common.isPasswd(userPass) == false) {
//		comModel('密码格式不正确！')
//	}
//})
$('#Login').click(function() {
	var sEmail = $('#Email').val()
	var sPassw = $('#Password').val()
	function getLogin(data) {
		if(data.State == 0) {
			comModel(data.Data)
		} else if(data.State == 1) {
			document.cookie = 'userID=' + data.UserID
			document.cookie = 'companyID=' + data.CompanyID
			location.replace('index.html')
		}
	}
	
	function getLoginerr(err) {
		console.log(err)
	}
	common.ajax_req('get', true, dataUrl, 'user.ashx?action=login', {
		phone: sEmail,
		pw: sPassw
	}, getLogin, getLoginerr, 5000)
//	if(common.checkmobileNo(sEmail) == true && common.isPasswd(sPassw) == true) {
//
//	}
})
$('.forgetPass').click(function() {

	window.location.href = 'myData.html?uid=' + userID + '&bs=2';
})
$('.applyLogin').click(function() {
	location.href = 'signIn.html?uid=' + userID
})
var nU = navigator.userAgent;
if(nU.indexOf("Android") != -1 || nU.indexOf("iPhone") != -1||nU.indexOf("iPad") != -1 ){
	$('.forgetPass').addClass('d_none')
}else{
	$('.myUserF').addClass('d_none')
	$('.otherMain').addClass('d_none')
	$('.forgetPass').addClass('d_none')
}
