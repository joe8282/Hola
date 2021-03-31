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
	
	var action = GetQueryString('action');	
	var back = GetQueryString('back');
	var userCompanyId = GetQueryString('userCompanyId');
	var Id = GetQueryString('Id');
	var ContactName,ContactPosition, ContactEmailFax, ContactSkype, ContactPhone, ContactWhatsapp, ContactFacebook,
		ContactLinkined, ContactQq;
	
	if(action == 'modify') {
		//setTimeout(function() {
				console.log(Id)
			common.ajax_req("get", true, dataUrl,"crmcompanycontact.ashx?action=readbyid", {
				"Id": Id
			}, function(data) {
				console.log("data.Data")
				//初始化信息
				var _data = data.Data
				$('#inputContactName').val(_data.coco_name)
				$('#inputContactPosition').val(_data.coco_position),
				$('#inputContactEmail').val(_data.coco_email),
				$('#inputContactFacebook').val(_data.coco_facebook),
				$('#inputContactLinkined').val(_data.coco_linkedin),
				$('#inputContactPhone').val(_data.coco_phone),
				$('#inputContactQq').val(_data.coco_qq),
				$('#inputContactSkype').val(_data.coco_skype),
				$('#inputContactWhatsapp').val(_data.coco_whatsapp)			
				//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
			}, function(err) {
				console.log(err)
			}, 5000)
		//}, 100)
	} else {
	
	}
	
	/*下一步*/
	$('#send1').on('click', function() {
			ContactName = $('#inputContactName').val(),
			ContactPosition = $('#inputContactPosition').val(),
			ContactEmail = $('#inputContactEmail').val(),
			ContactSkype = $('#inputContactSkype').val(),
			ContactPhone = $('#inputContactPhone').val(),
			ContactWhatsapp = $('#inputContactWhatsapp').val(),
			ContactFacebook = $('#inputContactFacebook').val(),
			ContactLinkined = $('#inputContactLinkined').val(),
			ContactQq = $('#inputContactQq').val();
		
		if(action == 'add') {
			if(!ContactName) {
				comModel("请输入联系人名称")
			} else {
				var parm = {
					'userId': userID,
					'actionId': companyID,
					'companyId': userCompanyId,
					'contactName': ContactName,
					'contactPhone': ContactPhone,
					'contactEmail': ContactEmail,
					'contactWhatsapp': ContactWhatsapp,
					'contactSkype': ContactSkype,
					'contactFacebook': ContactFacebook,
					'contactLinkedin': ContactLinkined,
					'contactQq': ContactQq,
					'contactPosition': ContactPosition
				}
				
				common.ajax_req('POST', true, dataUrl, 'crmcompanycontact.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						comModel("新增联系人成功")
						if(back==null){
							location.href = 'crmcompany.html';							
						} else if (back == userCompanyId) {
						    location.href = 'companydetail.html?Id=' + back
						} else {
						    location.href = 'crmcompanydetail.html?Id=' + back
						}

					} else {
						comModel("新增联系人失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
			if(!ContactName) {
				comModel("请输入联系人名称")
			} else if(!ContactEmail) {
				comModel("请输入联系人邮箱")
			} else if(!ContactPhone) {
				comModel("请输入联系人手机")
			}else{
				var parm = {
					'Id': Id,
					'userId': userID,
					'contactName': ContactName,
					'contactPhone': ContactPhone,
					'contactEmail': ContactEmail,
					'contactWhatsapp': ContactWhatsapp,
					'contactSkype': ContactSkype,
					'contactFacebook': ContactFacebook,
					'contactLinkedin': ContactLinkined,
					'contactQq': ContactQq,
					'contactPosition': ContactPosition
				}
				
				common.ajax_req('POST', true, dataUrl, 'crmcompanycontact.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改联系人成功")
						location.href = 'crmcompany.html';
					} else {
						comModel("修改联系人失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
	});
})



