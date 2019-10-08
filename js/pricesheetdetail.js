//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Financial MANAGEMENT",        
        };

$(function(){
	this.title = get_lan('nav_5_3') 	
	$('.navli5').addClass("active open")
	$('.financial3').addClass("active")	
	$('#title1').text(get_lan('nav_5_3'))
	$('#title2').text(get_lan('nav_5_3')) 
	
	var Id = GetQueryString('Id');

	common.ajax_req("get", false, dataUrl, "pricesheet.ashx?action=readbyid", {
	    "Id": Id
	}, function (data) {
	    console.log(data.Data)
	    console.log(data.Data2)
	    //初始化信息
	    var _data = data.Data
	    var _data2 = data.Data2
	    $('.companyName').text(_data2.comp_name)
	    $('.companyNameEn').text(_data2.comp_name_en)
	    $('.companyTel').text(_data2.comp_tel)
	    $('.companyFax').text(_data2.comp_fax)
	    $('.companyEmail').text(_data2.comp_email)
	    $('.toCompany').text(_data.comp_name)
	    $('.toCompanyContact').text(_data.comp_contactName)
	    $('.addTime').text(_data.prsh_time.substring(0, 10))
	    $('.port1').text(_data.prsh_port1)
	    $('.port2').text(_data.prsh_port2)

	    var feeItemAll0 = _data.prsh_feeItem.split(';')
	    for (var i = 0; i < feeItemAll0.length - 1; i++) {
	        var feeItem0 = feeItemAll0[i].split(',')
	        var _html = '<tr><td>' + feeItem0[0] + '</td><td>' + feeItem0[1] + '</td><td>' + feeItem0[2] + '</td><td>' + feeItem0[3] + '</td><td>' + feeItem0[4] + '</td><td>' + feeItem0[5] + '</td><td>' + feeItem0[6] + '</td><td>' + feeItem0[7] + ' -- ' + feeItem0[8] + '</td><td>' + feeItem0[9] + '</td></tr>'
	        $('.feeItem').append(_html)
	    }

	    var feeItemAll = _data.prsh_localChargeItem.split(';')
	    for (var i = 0; i < feeItemAll.length - 1; i++) {
	        var feeItem = feeItemAll[i].split(',')
	        var _html = '<tr><td>' + feeItem[0] + '</td><td>' + feeItem[1] + feeItem[2] + '</td><td>' + feeItem[1] + feeItem[3] + '</td><td>' + feeItem[1] + feeItem[4] + '</td><td>' + feeItem[1] + feeItem[5] + '</td><td>' + feeItem[6] + ' -- ' + feeItem[7] + '</td><td>' + feeItem[8] + '</td></tr>'
	        $('.localChargeItem').append(_html)

	    }

	    var feeItemAll2 = _data.prsh_truckingChargeItem.split(';')
	    for (var i = 0; i < feeItemAll2.length - 1; i++) {
	        var feeItem2 = feeItemAll2[i].split(',')
	        var _html = '<tr><td>' + feeItem2[0] + '</td><td>' + feeItem2[1] + feeItem2[2] + '</td><td>' + feeItem2[1] + feeItem2[3] + '</td><td>' + feeItem2[1] + feeItem2[4] + '</td><td>' + feeItem2[5] + ' -- ' + feeItem2[6] + '</td><td>' + feeItem2[7] + '</td></tr>'
	        $('.truckingChargeItem').append(_html)

	    }

	}, function (err) {
	    console.log(err)
	}, 5000)

})



