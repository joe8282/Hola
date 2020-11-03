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

	this.title = get_lan('nav_2_1') 	
	$('.navli2').addClass("active open")
	$('.crm1').addClass("active")	
	$('#title1').text(get_lan('nav_2_1'))
	$('#title2').text(get_lan('nav_2_1')) 
	$('#inputCompanyName').on('change',function(){ // 添加一个字段就是公司的CODE，这里自动获取CODE，也可以修改，20190815 by daniel
		var com_name=$('#inputCompanyName').val().split(" ");
		var _codes="";
		if($('#inputCompanyCode').val()==""){
			for (var i = 0; i< com_name.length; i++) {
				var _code=com_name[i].substring(0,1);
				_codes=_codes+_code;
			}
			$('#inputCompanyCode').val(_codes);
		}
		//alert(com_name[0]).toUpperCase()
	});
	$('.yincang').hide();
	$('#send00').hide();
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var sellId, CompanyName, CompanyCode, CompanyName, CompanyBadges='', CompanyIsSupplier, CompanyType, CompanyAddress,
		CompanyCountry, CompanyTel, CompanyFax, CompanyWeb, CompanyOrg, CompanyRemark, ContactName,
		ContactPosition, ContactEmailFax, ContactSkype, ContactPhone, ContactWhatsapp, ContactFacebook,
		ContactLinkined, ContactQq;
	//var AccountName, AccountPw;

	//销售人员
	common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
		'role': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		if(_data!=null){
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
				$('#sellId').append(_html)
			}
		}
	}, function(error) {
		console.log(parm)
	}, 1000)

	//公司类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {'typeId':16,'companyId':companyID}, function(data) {
		var _data = data.data;
		//console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			//var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			var _html = '<label><input name="radio2" type="checkbox" value="' + _data[i].puda_name_en + '" class="none"> <span class="text">' + _data[i].puda_name_en + '</span></label>';
			$('#companyType').append(_html) //不再用radio, 改成了checkbox，也就是一家公司可以有多个角色的。20190815 by daniel
		}
		//$("input[name=radio2]:eq(0)").attr("checked",'checked')
		
	}, function(error) {
		console.log(parm)
	}, 1000)
	
	if(action == 'modify') {
		$('#conactModify1').hide()
		$('#conactModify2').hide()	
//		$('#accountModify1').hide()
//		$('#accountModify2').hide()			
		$('#send2').hide()	
		var checkBoxArray=[]
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
				 checkBoxArray = _data.comp_type.split(",");
			    for(var i=0;i<checkBoxArray.length;i++){
			    	$("input[name='radio2']").each(function(){
					    if($(this).val()==checkBoxArray[i]){
					    	$(this).attr("checked","checked");
					    }
				    })
			    }
			    if (_data.comp_badges != '') {
			        CompanyBadges = _data.comp_badges
			        var _badges = _data.comp_badges.split(',')
			        for (var i = 0; i < _badges.length; i++) {
			            $('#Badges').append('<span class="label label-success" style="margin-right: 5px; ">' + _badges[i] + '</span> ');
			        }
			    }
				//$("input[name='radio2'][value='" + _data.comp_type + "']").attr("checked", true),
				$('#inputCompanyAddress').val(_data.comp_address),
				$('#inputCompanyCountry').val(_data.comp_country),
    			$("#sellId").val(_data.comp_adminId).trigger("change"),
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
		var cType=""
		$("input[name=radio2]:checked").each(function() { 
			cType+=$(this).val()+",";
	    });
	    cType==""?cType="":cType=cType.substring(0,cType.length-1);
		console.log(cType.length)
	    CompanyName = $('#inputCompanyName').val(),
        CompanyCode = $('#inputCompanyCode').val(),
			CompanyContent = $('#inputCompanyContent').val(),
			CompanyIsSupplier = $("input[name='radio1']:checked").val(),
			//CompanyType = $("input[name='radio2']:checked").val(),
			CompanyType = cType,
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
			sellId = $('#sellId').val(),
			ContactQq = $('#inputContactQq').val()
//			AccountName = $('#inputAccountName').val(),
//			AccountPw = $('#inputAccountPw').val();

	    if (action == 'add') {
	        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //邮箱正则表达式
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
			} else if (!reg.test(ContactEmail)) {
			    comModel("联系人邮箱格式不正确")
			} else if(!ContactPhone) {
				comModel("请输入联系人手机")
			} else {
				var parm = {
					'upId': 0,
					'companyId': companyID,
					'userId': userID,
					'adminId': sellId,
					'name': CompanyName,
					'code': CompanyCode,
					'badges': CompanyBadges,
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
							//location.href = 'crmcompany.html';							
						}else{
							comModel("继续新增联系人")
							//location.href = 'crmcompanycontactadd.html?action=add&companyId='+data.Data;
						}
					} else if (data.State == 0) {
					    //comModel(data.Data)
					    bootbox.alert(data.Data);
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
					'adminId': sellId,
					'name': CompanyName,
					'code': CompanyCode,
					'badges': CompanyBadges,
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
						//location.href = 'crmcompany.html';
					} else if (data.State == 0) {
					    comModel(data.Data)
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
	});

	$('.newBadges').on('click', function () {
	    var text = $('#inputBadges').val();
	    if (text != '') {
	        CompanyBadges = CompanyBadges + text + ','
	    }
	    $('#inputBadges').val('')
	    $('#Badges').append('<span class="label label-success" style="margin-right: 5px; ">' + text + '</span> ');
	})


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



