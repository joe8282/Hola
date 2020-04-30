//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "系统设置管理",    
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "System Management",       
        };

$(function(){
	this.title = get_lan('nav_0_4')
	$('.navli0').addClass("active open")
	$('.sys4').addClass("active")	
	$('#title1').text(get_lan('nav_0_4'))
	$('#title2').text(get_lan('nav_0_4'))
	
	var preNum,address1,address2,currency;
	//币种
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#localCurrency').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)		
	
	
	common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
		"companyId": companyID
	}, function(data) {
		//console.log(data.Data)
		//初始化信息
		var _data = data.Data
		$('#inputPreNum').val(_data.wein_preNum)
		$('#localCurrency').val(_data.wein_currency).trigger("change")
		$('#inputAddress1').val(_data.wein_gameTitle1)
		$('#inputAddress2').val(_data.wein_gameTitle2)
	}, function(err) {
		console.log(err)
	}, 2000)

	/*下一步*/
	$('#send1').on('click', function() {

		preNum = $('#inputPreNum').val()
		address1 = $('#inputAddress1').val()
		address2 = $('#inputAddress2').val()
		currency = $('#localCurrency').val()
		
		if(!preNum) {
			comModel("请输入工作单号前缀")
		} else {
			var parm = {
				'companyId': companyID,
				'preNum': preNum,
				'currency': currency,
				'address1': address1,
				'address2': address2
			}
		
			common.ajax_req('Post', true, dataUrl, 'weiinfo.ashx?action=modify', parm, function(data) {
				if(data.State == 1) {
					comModel("设置成功")
					//location.href = 'usercompanydepartment.html';	
				} else {
					comModel("设置失败")
				}
			}, function(error) {
				console.log(parm)
			}, 2000)
		}
	
	});

	
})



