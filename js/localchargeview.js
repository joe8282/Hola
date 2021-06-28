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
    hasPermission('1411'); //权限控制：查看当地费用详细
    if (isPermission('1413') != 1) {
        $('#copyFeeall').hide()
    }
	this.title = get_lan('nav_4_2') 	
	$('.navli4').addClass("active open")
	$('.rate2').addClass("active")	
	$('#title1').text(get_lan('nav_4_2'))
	$('#title2').text(get_lan('nav_4_2')) 
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');

	$('#goAndEdit').on('click', function() {
		location.href = 'localchargeadd.html?action=modify&Id='+Id;
	})

	var _toCompany, _carrier, _port1, _routes, _from, _useTime1, _useTime2, _type, _remark;
	var _toCompany = '', _feeItem = '', _feeUnit = '', _feeType = ''
	//var AccountName, AccountPw;
	

    //结算公司
  //   function getCrmCompany(o){
		// common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		//     "companyId": o
		// }, function (data) {
		//     var _data = data.data;
		//     console.log(_data)
		//     if (_data != null) {
		//         for (var i = 0; i < _data.length; i++) {
		//             var _html = _data[i].comp_name;
		//             $('#toCompany').html(_html)
		//         }
		//     }
		// }, function (err) {
		//     console.log(err)
		// }, 2000)		
  //   }
	
	common.ajax_req("get", true, dataUrl, "localcharge.ashx?action=readbyid", {
		"Id": Id
	}, function(data) {
		console.log(data.Data)
		var _data = data.Data
		$('#carrier').html(_data.loch_carrier)
		$('#port1').html(_data.loch_port1)
		$('#inputRoutes').html(_data.loch_routes)
		$('#remark').html(_data.loch_remark)
		$('#from').html(_data.loch_from)
		$('#id-date-picker-1').html(_data.loch_useTime1.substring(0, 10))
		$('#id-date-picker-2').html(_data.loch_useTime2.substring(0, 10))
		$('#inputtype').html(_data.loch_type)
		$('#toCompany').html(_data.comp_name)

		$('.feeAll').empty()
		var feeItemAll = _data.loch_feeItem.split(';')
		for (var i = 0; i < feeItemAll.length-1; i++) {
		    var feeItem0 = feeItemAll[i].split(',')
		    var _htmlCopy = feeItem0[0]+': '+(feeItem0[2]!=0?(feeItem0[1]+feeItem0[2]+'/BL, '):"")+(feeItem0[3]!=0?(feeItem0[1]+feeItem0[3]+'/20GP, '):"")+(feeItem0[4]!=0?(feeItem0[1]+feeItem0[4]+'/40GP, '):"")+(feeItem0[5]!=0?(feeItem0[1]+feeItem0[5]+'/40HQ, '):"")+feeItem0[6]+'\n'
		    var _html ='<tr><td>'+feeItem0[0]+'</td><td>'+(feeItem0[2]!=0?(feeItem0[1]+feeItem0[2]):"")+'</td><td>'+(feeItem0[3]!=0?(feeItem0[1]+feeItem0[3]):"")+'</td><td>'+(feeItem0[4]!=0?(feeItem0[1]+feeItem0[4]):"")+'</td><td>'+(feeItem0[5]!=0?(feeItem0[1]+feeItem0[5]):"")+'</td><td>'+feeItem0[6]+'</td></tr>'
		    $('.feeAll').append(_html)
		    $('#copyFeeAll').append(_htmlCopy)
		}

	}, function(err) {
		console.log(err)
	}, 5000)
	

	var clipboard = new ClipboardJS('#copyFeeall',{
		text: function() {
            return $("#copyFeeAll").text();
        }
	});

	clipboard.on('success', function(e) {
	    Notify('All Fee have been copied.', 'bottom-right', '5000', 'success', 'fa-check', true);
	    e.clearSelection();
	});

	clipboard.on('error', function(e) {
	    Notify('All Fee have not been copied.', 'bottom-right', '5000', 'warning', 'fa-check', true);
	});
})



