//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "CRM Home",        
        };

$(function(){

	this.title = get_lan('nav_2_2') 	
	$('.navli2').addClass("active open")
	$('.crm2').addClass("active")	
	$('#title1').text(get_lan('nav_2_2'))
	$('#title2').text(get_lan('nav_2_2')) 
	//$('#inputCompanyName').on('change',function(){ // 添加一个字段就是公司的CODE，这里自动获取CODE，也可以修改，20190815 by daniel
	//	var com_name=$('#inputCompanyName').val().split(" ");
	//	if($('#inputCompanyCode').val()==""){
	//		$('#inputCompanyCode').val(com_name[0].toUpperCase());
	//	}
	//	//alert(com_name[0])
	//});
	$('.yincang').hide();
	$('#send00').hide();
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var CompanyName, CompanyCode, CompanyContent, CompanyIsSupplier, CompanyType, CompanyAddress,
		CompanyCountry, CompanyTel, CompanyFax, CompanyWeb, CompanyOrg, CompanyRemark, ContactName,
		ContactPosition, ContactEmailFax, ContactSkype, ContactPhone, ContactWhatsapp, ContactFacebook,
		ContactLinkined, ContactQq;
	//var AccountName, AccountPw;

	//公司类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {'typeId':16,'companyId':companyID}, function(data) {
		var _data = data.data;
		//console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			//var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			var _html = '<label><input name="radio2" type="checkbox" value="' + _data[i].puda_name_en + '" class="none"> <span class="text">' + _data[i].puda_name_en + '</span></label>';
			$('#companyType').append(_html) //不再用radio, 改成了checkbox，也就是一家公司可以有多个角色的。20190815 by daniel
		}
		$("input[name=radio2]:eq(0)").attr("checked",'checked')
		
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
			$('#inputCompanyCode').val(_data.comp_code)
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
	$('#send1,#send2').on('click', function() {
		var bt= $(this).attr("id");
	    CompanyName = $('#inputCompanyName').val(),
        CompanyCode = $('#inputCompanyCode').val(),
			CompanyContent = $('#inputCompanyContent').val(),
			CompanyIsSupplier = $("input[name='radio1']:checked").val(),
			CompanyType = $("input[name='radio2']:checked").val(),
			CompanyAddress = $('#inputCompanyAddress').val(),
			CompanyCountry = $('#inputCompanyCountry').val(),
			CompanyTel = $('#inputCompanyTel').val(),
			CompanyFax = $('#inputCompanyFax').val(),
			CompanyWeb = $('#inputCompanyWeb').val(),
			CompanyOrg = $('#inputCompanyOrg').val(),
			CompanyRemark = $('#inputCompanyRemark').val(),
			ContactName = $('#inputContactName').val(),
			ContactPosition = $('#inputContactPosition').val(),
			ContactEmail = $('#inputContactEmail').val(),
			ContactSkype = $('#inputContactSkype').val(),
			ContactPhone = $('#inputContactPhone').val(),
			ContactWhatsapp = $('#inputContactWhatsapp').val(),
			ContactFacebook = $('#inputContactFacebook').val(),
			ContactLinkined = $('#inputContactLinkined').val(),
			ContactQq = $('#inputContactQq').val()
//			AccountName = $('#inputAccountName').val(),
//			AccountPw = $('#inputAccountPw').val();

		if(action == 'add') {
			if(!CompanyName) {
				comModel("请输入公司名称")
			} else if(!CompanyContent) {
				comModel("请输入公司简介")
			} else if(!CompanyCountry) {
				comModel("请输入国家")
			} else if(!CompanyTel) {
				comModel("请输入公司电话")
			} else if(!ContactName) {
				comModel("请输入联系人名称")
			} else if(!ContactEmail) {
				comModel("请输入联系人邮箱")
			} else if(!ContactPhone) {
				comModel("请输入联系人手机")
			} else {
				var parm = {
					'upId': 0,
					'companyId': companyID,
					'userId': userID,
					'adminId': userID,
					'name': CompanyName,
					'code': CompanyCode,
					'content': CompanyContent,
					'isSupplier': CompanyIsSupplier,
					'type': CompanyType,
					'address': CompanyAddress,
					'country': CompanyCountry,
					'tel': CompanyTel,
					'fax': CompanyFax,
					'web': CompanyWeb,
					'org': CompanyOrg,
					'remark': CompanyRemark,
					'contactName': ContactName,
					'contactPhone': ContactPhone,
					'contactEmail': ContactEmail,
					'contactWhatsapp': ContactWhatsapp,
					'contactSkype': ContactSkype,
					'contactFacebook': ContactFacebook,
					'contactLinkedin': ContactLinkined,
					'contactQq': ContactQq,
					'contactPosition': ContactPosition
//					'account': AccountName,
//					'pw': AccountPw
				}
				
				common.ajax_req('POST', false, dataUrl, 'crmcompany.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						if(bt=="send1"){
							comModel("新增客户成功")
							location.href = 'crmcompany.html';							
						}else{
							comModel("继续新增联系人")
							location.href = 'crmcompanycontactadd.html?action=add&companyId='+data.Data;
						}


					} else {
						comModel("新增客户失败")
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
					'code': CompanyCode,
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


	$('#send0').on('click', function() {
		$('.yincang').show()
		$('#send00').show();
		$('#send0').hide();
	})
	$('#send00').on('click', function() {
		$('.yincang').hide()
		$('#send0').show();
		$('#send00').hide();
	})
	
	
})



