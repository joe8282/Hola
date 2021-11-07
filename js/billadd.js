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
	this.title = get_lan('nav_5_2') 	
	$('.navli5').addClass("active open")
	$('.financial2').addClass("active")	
	$('#title1').text(get_lan('nav_5_2'))
	$('#title2').text(get_lan('nav_5_2')) 
	
	var action = GetQueryString('action');	
	var typeId = GetQueryString('typeId');
	var _companyId, _carrier, _port1, _routes, _feeItem, _currency, _unit, _price, _useTime, _type;
	//var AccountName, AccountPw;

	//货代公司
	common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
		"customerId": companyID
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_companyId + '">' + _data[i].userCompanyName  + '</option>';
				$('#toCompany').append(_html)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)
	
	//币种
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#unit').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)	
	
	//费用类型
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#feeItem').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
	if(action == 'modify') {
		$('#conactModify1').hide()
		$('#conactModify2').hide()	
//		$('#accountModify1').hide()
//		$('#accountModify2').hide()			
		$('#send2').hide()	
		common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=readbyid", {
			"Id": Id
		}, function(data) {
			//console.log(data.Data)
			//初始化信息
			var _data = data.Data
			$('#inputCompanyName').val(_data.comp_name)
			$('#inputCompanyContent').val(_data.comp_content),
				$("input[name='radio1'][value='" + _data.comp_isSupplier + "']").attr("checked", true),
				$("input[name='radio2'][value='" + _data.comp_type + "']").attr("checked", true),
				$('#inputCompanyAddress').val(_data.comp_address),
				$('#inputCompanyCountry').val(_data.comp_country),
				$('#inputCompanyTel').val(_data.comp_tel),
				$('#inputCompanyFax').val(_data.comp_fax),
				$('#inputCompanyWeb').val(_data.comp_web),
				$('#inputCompanyOrg').val(_data.comp_org),
				$('#inputCompanyRemark').val(_data.comp_remark)
			//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
		}, function(err) {
			console.log(err)
		}, 5000)
	
	} else {
	
	}
	
	/*下一步*/
	$('#send1').on('click', function() {
		var bt= $(this).attr("id");
		_carrier = $('#carrier').val(),
		_port1 = $('#port1').val(),
		_routes = $('#inputRoutes').val(),
		_feeItem = $('#feeItem').val(),
		_feeType = $('#feeType').val(),
		_feeUnit= $('#feeUnit').val(),
		_price = $('#inputPrice').val(),
		_useTime = $('#id-date-picker-1').val(),
		_type= $('#inputtype').val();
		
		if(action == 'add') {
			if(!port1) {
				comModel("请选择起运港")
			} else {
				var parm = {
					'companyId': companyID,
					'userId': userID,
					'carrier': _carrier,
					'port1': _port1,
					'routes': _routes,					
					'feeItem': _feeItem,
					'currency': _feeType,
					'unit': _feeUnit,
					'price': _price,
					'type': _type,
					'useTime': _useTime
				}
				
				common.ajax_req('POST', false, dataUrl, 'localcharge.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						comModel("新增成功")
						location.href = 'localchargelist.html';

					} else {
						comModel("新增失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
			if(!CompanyName) {
				comModel("请输入公司名称")
			} else if(!CompanyContent) {
				comModel("请输入公司简介")
			} else if(!CompanyCountry) {
				comModel("请输入国家")
			} else if(!CompanyTel) {
				comModel("请输入公司电话")
			}else{
				var parm = {
					'Id': Id,
					'companyId': companyID,
					'userId': userID,
					'adminId': userID,
					'name': CompanyName,
					'content': CompanyContent,
					'isSupplier': CompanyIsSupplier,
					'type': CompanyType,
					'address': CompanyAddress,
					'country': CompanyCountry,
					'tel': CompanyTel,
					'fax': CompanyFax,
					'web': CompanyWeb,
					'org': CompanyOrg,
					'remark': CompanyRemark
				}
				
				common.ajax_req('POST', false, dataUrl, 'crmcompany.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						location.href = 'crmcompany.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
	});

	var arrCntrType=[["40'HQ","40HQ","40'HC","40HC"],["20'GP","20GP"],["40'GP","40GP"]];
	var str="20gp1000KGs/68CBM/MRKU3982456/SLDJFLW0WE";
	str=str.toUpperCase();
	for(var j=0;j<arrCntrType.length;j++){
		for(var i=0;i<arrCntrType[j].length;i++){
			if(str.indexOf(arrCntrType[j][i]) != -1){
				alert(arrCntrType[j][0])
			}
			str=str.replace(arrCntrType[j][i],'')
		}
	}
	var arrWeightUnit=["KGS","LB"];
	for(var j=0;j<arrWeightUnit.length;j++){
		if(str.indexOf(arrWeightUnit[j]) != -1){
			alert(arrWeightUnit[j])
		}
		str=str.replace(arrWeightUnit[j],'')
	}
	var arrVolumeUnit=["CBM","LIT"];
	for(var j=0;j<arrWeightUnit.length;j++){
		if(str.indexOf(arrVolumeUnit[j]) != -1){
			alert(arrVolumeUnit[j])
		}
		str=str.replace(arrVolumeUnit[j],'')
	}
	var reg = /\d+/g;  //匹配数字的正则
	var ms = str.match(reg);
	alert(ms[0]);
	alert(str)
	// $.each(arr, function (index, item) {
	// }
	
})



