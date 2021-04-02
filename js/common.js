
//var dataUrl = 'http://localhost:48349/'
var dataUrl = 'http://47.97.188.85:8088/'
var imgUrl = 'http://192.168.1.211:8082/'

var common = {

	/*ajax请求封装
	url: 请求路径
	param_name: ?后面的参数名称以及值
	successCallback:成功回调函数
	failCallback: 失败的回调函数
	timeout: 请求超时时间(单位：毫秒)
	 注: 如果超时会进失败的回调函数
	 */

	ajax_req: function(_type, _async, _url, url, param_name, successCallback, failCallback, timeout) {
		var xhr = $.ajax({
			type: _type,
			dataType: "json",
			async: _async,
			url: _url + 'ajax/' + url,
			data: param_name,
			cache: false,
			success: sucback,
			error: failCallback,
		});

		//ajax请求超时默认时间为30秒
		if(!timeout) {
			timeout = 30000;
		}
		setTimeout(function() {
			if(xhr) {
				var readyState = xhr.readyState;
				if(readyState != 4) {
					alert("网络加载延迟，请点击底部导航刷新");
					//中断ajax请求
					xhr.abort();
				}
			}
		}, 20000);

		function sucback(e) {
			//请求成功之后的判断
			successCallback(e);

		}
	}
}

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 


//写入cookie函数
function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//获取cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}	

//登录处理
function getUerID() {
	var userId = getCookie('userID')
	if(userId != null) {
		return getCookie('userID');
	} else {
		return '0';
	}
}
var userID = getUerID();
function getCompanyID() {
	var companyId = getCookie('companyID')
	if(companyId != null) {
		return getCookie('companyID');
	} else {
		return '0';
	}
}
var companyID = getCompanyID();

var userName = '', userPosition = '', userCode = '', userRole = ''
//加载左边导航
getNav()

if(userID != '0') {
	//加载用户信息
	getUserInfo()	
	
}else{
	if(location.href.indexOf('login.html') == -1) {
		location.href = 'login.html';
	}		
}

//截取地址栏值
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return(r[2]);
	return null;
}


//简单公共弹框
/*text:提示信息
 * flag:是否刷新页面
 */
function comModel(text,flag) {
	$('body').append('<div class="com_model" style="z-index:9999;;position: fixed;width:100%;top: 40%;left:0;font-size: 14px;text-align:center;"><span style="padding: 10px;background: #646464;color: white;border-radius: 3rem;text-align:center;display:inline-block;">' + text + '</span></div>')
	if($('.com_model').length >1){
		$('.com_model').eq(0).remove()
	}else{
		setTimeout(function() {
		$('.com_model').remove()
		if(flag){
			location.reload()
		}
	}, 2000)
	}
	
}
	
//公共弹窗
/*
 *p1标题
 * p2内容
 * b1关闭弹窗text
 * b2下一步text
 * fuc下一步执行函数
 * */
    function poppume(p1,p2,b1,b2,fuc){
        var popHtmlp =     '<div class="allsha_back">'+
                            '</div>'+
                            '<div class="all_shadow">'+
                                '<div class="allls_hea">'+
                                    '<p class="popTbod">'+p1+'</p>'+
                                    '<p>'+p2+'</p>'+
                                '</div>'+
                                '<div class="alls_foo">'+
                                    '<span class="pup_cancle">'+b1+'</span>'+
                                    '<span class="pup_sure">'+b2+'</span>'+
                                '</div>'+
                            '</div>';
                            
        $('body').append(popHtmlp)
        $('.pup_cancle').on('click',function(){
        	var that = $(this);
        	pupr(that)
        })
        $('.pup_sure').on('click',function(){
        	
         	var that = $(this);
         	pupr(that);
$('.allsha_back').remove()
        	$('.all_shadow').remove()
         	fuc();
        })

$('.allsha_back').click(function(){
        	$('.allsha_back').remove()
        	$('.all_shadow').remove()
        })
        function pupr(that){
         	$('.allsha_back').remove();
        	that.parents('.all_shadow').remove();
        }
    }
    
 
//左侧导航
function getNav(){
         
    var NavHtm = '<li class="navli100"><a href="index.html"><i class="menu-icon glyphicon glyphicon-home"></i><span class="menu-text" set-lan="html:navHome"> Home </span></a></li>'+
                    '<li class="navli90 active open"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_0"> SYSTEM MANAGEMENT </span><i class="menu-expand"></i></a>' +
                        '<ul class="submenu">' +
                            '<li class="free1"><a href="companydetail.html?Id=' + companyID + '"><span class="menu-text" set-lan="html:nav_0_1">Company Info</span></a></li>' +
							'<li class="free2"><a href="bookinglist.html"><span class="menu-text" set-lan="html:nav_3_1">Booking List</span></a></li>' +
                            '<li class="free3"><a href="bookingadd.html?action=add"><span class="menu-text" set-lan="html:nav_3_2">Booking Add</span></a></li>' +
							'<li class="free4"><a href="rate.html"><span class="menu-text" set-lan="html:nav_4_1">Rate List</span></a></li>' +
                        '</ul>' +
                    '</li>' +
					'<li class="navli2"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_2"> CRM Home </span><i class="menu-expand"></i></a>'+
                        '<ul class="submenu">'+
                            '<li class="crm2"><a href="crmcompany.html"><span class="menu-text" set-lan="html:nav_2_2">My Customer</span></a></li>' +
                            '<li class="crm3"><a href="crmcompanyrole.html"><span class="menu-text" set-lan="html:nav_2_3">Company Customer</span></a></li>' +
                            '<li class="crm4"><a href="crmcompanygroup.html"><span class="menu-text" set-lan="html:nav_2_4">Customer Group</span></a></li>' +
                            '<li class="crm1"><a href="crmcompanyadd.html?action=add"><span class="menu-text" set-lan="html:nav_2_1">Customer Add</span></a></li>' +
                        '</ul>'+
                    '</li>' +
					'<li class="navli3"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_3"> SHIPMENT MANAGEMENT</span><i class="menu-expand"></i></a>'+
                        '<ul class="submenu">'+
                            '<li class="book3"><a href="booking.html"><span class="menu-text" set-lan="html:nav_3_3">Order List</span></a></li>' +
                            '<li class="book1"><a href="booking.html?fromId=1"><span class="menu-text" set-lan="html:nav_3_1">Booking List</span></a></li>' +
                            //'<li class="book2"><a href="bookingadd.html?fromId=1"><span class="menu-text" set-lan="html:nav_3_2">Booking Add</span></a></li>' +
                            '<li class="book4"><a href="contactsheetadd.html?action=add"><span class="menu-text" set-lan="html:nav_3_4">ContactSheet Add</span></a></li>' +
                            '<li class="book5"><a href="orderadd.html?action=add"><span class="menu-text" set-lan="html:nav_3_5">Order Add</span></a></li>' +
                            '<li class="book6"><a href="printtemplatelist.html"><span class="menu-text" set-lan="html:nav_3_6">Print Template</span></a></li>' +
                            '<li class="book7"><a href="profit_report.html"><span class="menu-text" set-lan="html:nav_3_8">Profit Report</span></a></li>' +
						'</ul>'+
                    '</li>' +       
                    '<li class="navli4"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_4"> RATES MANAGEMENT</span><i class="menu-expand"></i></a>' +
	                    '<ul class="submenu">' +
	                    '<li class="rate1"><a href="ratelist.html"><span class="menu-text" set-lan="html:nav_4_1">Rate List</span></a></li>' +
	                    '<li class="rate2"><a href="localchargelist.html"><span class="menu-text" set-lan="html:nav_4_2">Localcharge</span></a></li>' +
                        '<li class="rate3"><a href="truckingchargelist.html"><span class="menu-text" set-lan="html:nav_4_3">Trucking List</span></a></li>' +
	                    '<li class="rate4"><a href="rateadd.html"><span class="menu-text" set-lan="html:nav_4_4">Add Rate</span></a></li>' +
	                    '</ul>' +
                    '</li>' +  
                    '<li class="navli5"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_5"> FINANCIAL MANAGEMENT</span><i class="menu-expand"></i></a>' +
	                    '<ul class="submenu">' +
                        '<li class="financial3"><a href="pricesheetlist.html"><span class="menu-text" set-lan="html:nav_5_3">Price Sheet</span></a></li>' +
                        '<li class="financial4"><a href="billadd.html?typeId=1"><span class="menu-text" set-lan="html:nav_5_4">Payment Request</span></a></li>' +
	                    '<li class="financial5"><a href="billadd.html?typeId=2"><span class="menu-text" set-lan="html:nav_5_5">Receivables</span></a></li>' +
	                    '<li class="financial6"><a href="exchangerate.html"><span class="menu-text" set-lan="html:nav_5_6">Set Exchangerate</span></a></li>' +
                        '<li class="financial7"><a href="feemanage.html"><span class="menu-text" set-lan="html:nav_5_7">Fee Management</span></a></li>' +
                        '<li class="financial8"><a href="receivable_report.html?type=debit"><span class="menu-text" set-lan="html:nav_5_8">Receivable Report</span></a></li>' +
                        '<li class="financial9"><a href="receivable_report.html?type=credit"><span class="menu-text" set-lan="html:nav_5_9">Payable Report</span></a></li>' +
                        '<li class="financial10"><a href="financial_statement.html"><span class="menu-text" set-lan="html:nav_5_10">Payable Report</span></a></li>' +
	                    '</ul>' +
                    '</li>' +             
                    '<li class="navli6"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_6"> EMAIL PROMPT PLAN</span><i class="menu-expand"></i></a>' +
	                    '<ul class="submenu">' +
	                    '<li class="emailprompt1"><a href="emailpp_list.html"><span class="menu-text" set-lan="html:nav_6_1">Localcharge</span></a></li>' +
                        '<li class="emailprompt2"><a href="emailpp_group.html"><span class="menu-text" set-lan="html:nav_6_2">Trucking List</span></a></li>' +
                        '<li class="emailprompt3"><a href="emailpp_account.html"><span class="menu-text" set-lan="html:nav_6_3">Price Sheet</span></a></li>' +
                        '<li class="emailprompt4"><a href="emailpp_template.html"><span class="menu-text" set-lan="html:nav_6_4">Payment Request</span></a></li>' +
	                    '<li class="emailprompt5"><a href="emailpp_sendplan.html"><span class="menu-text" set-lan="html:nav_6_5">Receivables</span></a></li>' +
	                    '<li class="emailprompt6"><a href="emailpp_queue.html"><span class="menu-text" set-lan="html:nav_6_6">Receivables</span></a></li>' +
	                    '</ul>' +
                    '</li>' +                    
					'<li class="navli1"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_1"> BASIC DATA </span><i class="menu-expand"></i></a>'+
                        '<ul class="submenu">'+
                            '<li class="typeId1"><a href="publicdata.html?typeid=1"><span class="menu-text" set-lan="html:nav_1_1">Air Line</span></a></li>'+
							'<li class="typeId11"><a href="publicdata.html?typeid=11"><span class="menu-text" set-lan="html:nav_1_11">Carriers</span></a></li>'+
                            '<li class="typeId2"><a href="publicdata.html?typeid=2"><span class="menu-text" set-lan="html:nav_1_2">Sea Ports</span></a></li>'+
                            '<li class="typeId3"><a href="publicdata.html?typeid=3"><span class="menu-text" set-lan="html:nav_1_3">Incoterms</span></a></li>'+
                            '<li class="typeId4"><a href="publicdata.html?typeid=4"><span class="menu-text" set-lan="html:nav_1_4">Container Type</span></a></li>'+
                            '<li class="typeId5"><a href="publicdata.html?typeid=5"><span class="menu-text" set-lan="html:nav_1_5">Air Ports</span></a></li>'+
                            '<li class="typeId6"><a href="publicdata.html?typeid=6"><span class="menu-text" set-lan="html:nav_1_6">Charge Item</span></a></li>'+
                            '<li class="typeId7"><a href="publicdata.html?typeid=7"><span class="menu-text" set-lan="html:nav_1_7">Movement Type</span></a></li>'+
                            '<li class="typeId8"><a href="publicdata.html?typeid=8"><span class="menu-text" set-lan="html:nav_1_8">Weight Unit</span></a></li>'+
                            '<li class="typeId9"><a href="publicdata.html?typeid=9"><span class="menu-text" set-lan="html:nav_1_9">Volume Unit</span></a></li>'+
                            '<li class="typeId10"><a href="publicdata.html?typeid=10"><span class="menu-text" set-lan="html:nav_1_10">Package Unit</span></a></li>'+  
                            '<li class="typeId12"><a href="publicdata.html?typeid=12"><span class="menu-text" set-lan="html:nav_1_12">BL Type</span></a></li>'+
                            '<li class="typeId13"><a href="publicdata.html?typeid=13"><span class="menu-text" set-lan="html:nav_1_13">Currency</span></a></li>'+
                            '<li class="typeId14"><a href="publicdata.html?typeid=14"><span class="menu-text" set-lan="html:nav_1_14">Follow Way</span></a></li>'+
                            '<li class="typeId15"><a href="publicdata.html?typeid=15"><span class="menu-text" set-lan="html:nav_1_15">Email Type</span></a></li>'+   
                            '<li class="typeId16"><a href="publicdata.html?typeid=16"><span class="menu-text" set-lan="html:nav_1_16">Company Type</span></a></li>'+      
//                          '<li class="typeId17"><a href="publicdata.html?typeid=17"><span class="menu-text" set-lan="html:nav_1_17">Expense Item</span></a></li>'+ 
                        '</ul>'+
                    '</li>' +
					'<li class="navli0"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_0"> SYSTEM MANAGEMENT </span><i class="menu-expand"></i></a>'+
                        '<ul class="submenu">'+
                            '<li class="sys1"><a href="usercompanyadd.html?action=edit&Id='+companyID+'"><span class="menu-text" set-lan="html:nav_0_1">Company Info</span></a></li>'+  
                            '<li class="sys2"><a href="usercompanydepartment.html"><span class="menu-text" set-lan="html:nav_0_2">Department Management</span></a></li>'+ 
                            '<li class="sys3"><a href="userinfo.html"><span class="menu-text" set-lan="html:nav_0_3">Worker Management</span></a></li>'+ 
                            '<li class="sys4"><a href="systerm.html"><span class="menu-text" set-lan="html:nav_0_4">Parameter Settings</span></a></li>' +
                            '<li class="sys5"><a href="role.html"><span class="menu-text" set-lan="html:nav_0_5">Role Management</span></a></li>' +
                            '<li class="sys5"><a href="remark.html"><span class="menu-text" set-lan="html:nav_0_6">Remark Management</span></a></li>' +
                        '</ul>'+
                    '</li>' +
					'<li class="navli"><a href="#" class="menu-dropdown"><i class="menu-icon fa fa-desktop"></i><span class="menu-text" set-lan="html:nav_00"> USER MANAGEMENT </span><i class="menu-expand"></i></a>'+
                        '<ul class="submenu">'+
                            '<li class="account1"><a href="usercompany.html"><span class="menu-text" set-lan="html:nav_00_1">User List</span></a></li>'+  
                            '<li class="account2"><a href="usercompanyadd.html?action=add"><span class="menu-text" set-lan="html:nav_00_2">User Add</span></a></li>'+ 
                        '</ul>'+
                    '</li>'                   
	$('.sidebar-menu').append(NavHtm)
	
//	$('.pro_footer li').eq(imgIndex).find('img').attr('src',src)
//	$('.pro_footer li').eq(imgIndex).find('p').css('color','#000000')
}

//头部导航
function getHead(){
         
	var NavHtm = '<li>' +
		'<a class="wave in dropdown-toggle"  style="width: 120px;" data-toggle="dropdown" title="Help" href="#">' +
		'<i class="icon fa fa-tasks"> Language</i>' +
		'</a>' +
		'<ul class="pull-right dropdown-menu dropdown-arrow dropdown-messages" style="width: 100px;">' +
		'<li><a href="#" class="lan" typeid="en">Englist</a></li>' +
		'<li><a href="#" class="lan" typeid="cn">中文版</a></li>' +
		'</ul>' +
		'</li>' +
		'<li>' +
		'<a class="wave in dropdown-toggle" style="width: 120px;" data-toggle="dropdown">' +
		'<i class="icon fa fa-user"> '+userName+'</i>' +
		'</a>' +
		'<ul class="pull-right dropdown-menu dropdown-arrow dropdown-login-area">' +
		'<li class="email"><a>职位：'+userPosition+'</a></li>' +
		'<li class="email"><a>代码：'+userCode+'</a></li>' +
		//'<li>' +
		//'<div class="avatar-area">' +
		//'<img src="assets/img/avatars/adam-jansen.jpg" class="avatar">' +
		//'<span class="caption">Change Photo</span>' +
		//'</div>' +
		//'</li>' +
		//'<li class="theme-area">' +
		//'<ul class="colorpicker" id="skin-changer">' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#5DB2FF;" rel="assets/css/skins/blue.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#2dc3e8;" rel="assets/css/skins/azure.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#03B3B2;" rel="assets/css/skins/teal.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#53a93f;" rel="assets/css/skins/green.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#FF8F32;" rel="assets/css/skins/orange.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#cc324b;" rel="assets/css/skins/pink.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#AC193D;" rel="assets/css/skins/darkred.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#8C0095;" rel="assets/css/skins/purple.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#0072C6;" rel="assets/css/skins/darkblue.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#585858;" rel="assets/css/skins/gray.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#474544;" rel="assets/css/skins/black.min.css"></a></li>' +
		//'<li><a class="colorpick-btn" href="#" style="background-color:#001940;" rel="assets/css/skins/deepblue.min.css"></a></li>' +
		//'</ul>' +
		//'</li>' +
		'<li class="dropdown-footer"><a href="userinfoadd.html?action=pw&Id=' + userID + '">修改密码</a>&nbsp;&nbsp;<a Id="loginout">退出</a></li>' +
		'</ul>' +
		'</li>'            
	$('.account-area').append(NavHtm)
	
	//语言选择
	$('.lan').click(function(e) {
		setCookie('lan', $(this).attr('typeid'))
		window.location.reload()
	})
}


var leixing, level
//获取用户信息
function getUserInfo() {
	function getPsuc(data) {
		console.log(data)
		leixing=data.Data.usin_leixing,level=data.Data.usin_level
		var userName = data.Data.usin_name
		userPosition=data.Data.usin_position
		userCode=data.Data.usin_code
		companyId = data.Data.usin_companyId
		userPermission = data.Data.usin_permission
		
		var userPermissionArr = userPermission.split(',')
		if (GetQueryString('permission')!=null) {
		    if ($.inArray(GetQueryString('permission'), userPermissionArr) == -1) {
		        alert("没有权限，请联系管理员！")
		        history.go(-1)
		    }
		}

		getHead()
		
		//退出
		$('#loginout').click(function() {
			delCookie('userID') 
			delCookie('companyID')
			location.replace('login.html')
		})
		
		//菜单控制
		if(leixing==1) {  //管理员
		    $('.navli90,.navli0,.navli2,.navli3,.navli4,.navli5,.navli6').hide()
		} else if (leixing == 2) { //VIP用户
		    $('.navli90,.navli').hide()
		}else{ //普通用户
		    $('.navli,.navli0,.navli1,.navli2,.navli3,.navli4,.navli5,.navli6').hide()
		}
		
	}

	function getPerr(err) {
		console.log(err)
	}
	common.ajax_req('GET', true, dataUrl, 'userinfo.ashx?action=readbyid', {
		Id: userID
	}, getPsuc, getPerr, 5000)
}	

//获取权限
//function hasPermission(userRole) {
//    function getPsuc(data) {
//        console.log(data)
//        if (data.State == 1) {
//            if (data.Data == 0) {
//                alert("没有权限，请联系管理员！")
//                history.go(-1)
//            }
//        }

//    }

//    function getPerr(err) {
//        console.log(err)
//    }
//    common.ajax_req('GET', true, dataUrl, 'userinfo.ashx?action=haspermission', {
//        'permission': GetQueryString('permission'),
//        'userRole': userRole
//    }, getPsuc, getPerr, 5000)
//}


//没有数据时
function DataEmpty() {
    var dEmpty = '<div class="allPageEmpty" style="position:fixed;top:0;bottom:0;width:10rem;background:#F5F5F5;padding-top:7rem;text-align:center;color:#646464;font-size:0.35rem"><img src="images/allEmpty.png" style="width:30%"><p>暂无数据，正在拼命准备中</p></div>'
    $('body').append(dEmpty)
}

/// HTML编码
function HtmlEncode(str) {
//	var sb = input;
//	sb = sb.replace(" ", "&nbsp;");
//	sb = sb.replace("\n", "<br>");
//	return sb;
    var reg=new RegExp("\n","g");
    var regSpace=new RegExp(" ","g");
    var regAnd=new RegExp("&","g");
    
    //str = str.replace(regAnd,"&amp;");
    str = str.replace(reg,"<br>");
    str = str.replace(regSpace,"&nbsp;");
    
    return str;
}
/// HTML解码
function HtmlDecode(str) {
//	var sb = input;
//	sb = sb.replace("&nbsp;", " ");
//	sb = sb.replace("<br>", "\n");
//	return sb;
	var reg = new RegExp("<br>", "g");
	var regSpace = new RegExp("&nbsp;", "g");
	var regAnd = new RegExp("&amp;", "g"); //增加了一个&的转换 by daniel 20190906
	
	str = str.replace(reg, "\n");
	str = str.replace(regAnd, "&");
	str = str.replace(regSpace, " ");
	
	return str;
}

function insert_flg(str,flg,sn){
    var newstr="";
    for(var i=0;i<str.length;i+=sn){
        var tmp=str.substring(i, i+sn);
        newstr+=tmp+flg;
    }
    return newstr;
}

/**
 * 
 * 获取当前时间
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}

function getCode() {
	var myDate = new Date();
	//获取当前年
	var year = myDate.getFullYear();
	//获取当前月
	var month = myDate.getMonth() + 1;
	//获取当前日
	var date = myDate.getDate();
	var h = myDate.getHours(); //获取当前小时数(0-23)
	var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	var s = myDate.getSeconds();
	
	var now = year + p(month) + p(date);
	
	var Num = "";
	for(var i = 0; i < 5; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	
	return now+Num;
}
function getDate() {
	var myDate = new Date();
	//获取当前年
	var year = myDate.getFullYear();
	//获取当前月
	var month = myDate.getMonth() + 1;
	//获取当前日
	var date = myDate.getDate();
	
	var data = year+'-' + p(month) +'-'+ p(date);
	return data;
}


//两个时间相差多少天 date1和date2是2019-06-18格式 
function daysDistance(date1, date2) {
    //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数
    date1 = Date.parse(date1);
    date2 = Date.parse(date2);
    //计算两个日期之间相差的毫秒数的绝对值
    var ms = Math.abs(date2 - date1);
    //毫秒数除以一天的毫秒数,就得到了天数
    var days = Math.floor(ms / (24 * 3600 * 1000));
    return days;

}


////下拉选择框
//$('.ohead').click(function(e){
//	e.stopPropagation()
//	if($('.option').css('display')=='block'){
//		$('.option').css('display','none')
//	}else{
//		$('.option').css('display','block')
//	}
//})
//$('.lan').click(function(e){
//	e.stopPropagation()
//	$('.ohead span').text($(this).find('span').text())
//	$('.option').css('display','none')
//	$('.ohead').attr('typeid',$(this).attr('typeid'))
//	setCookie('lan',$(this).attr('typeid'))
//	window.location.reload()
//})

