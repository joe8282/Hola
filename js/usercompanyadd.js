//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_22" : "平台用户管理",   
            "con_top_2" : "系统设置管理",  
            "con_top_33" : "修改用户信息", 
            "con_top_3" : "完善公司信息",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_22" : "User List", 
            "con_top_2" : "System Management", 
            "con_top_33" : "User Edit", 
            "con_top_3" : "Company Info",            
        };

$(function(){
	//hasPermission('1001'); //权限控制
	
	var action = GetQueryString('action');	
	if(action=='add'){
		this.title = get_lan('nav_00_2') 	
		$('.navli00').addClass("active open")
		$('.account2').addClass("active")	
		$('#title1').text(get_lan('nav_00_2'))
		$('#title2').text(get_lan('nav_00_2')) 		
	}else if(action=='modify'){
		this.title = get_lan('con_top_33') 	
		$('.navli00').addClass("active open")
		$('.account1').addClass("active")	
		$('#title1').text(get_lan('con_top_33'))
		$('#title2').text(get_lan('con_top_33')) 		
	}else if(action=='edit'){
		this.title = get_lan('con_top_3') 	
		$('.navli0').addClass("active open")
		$('.sys1').addClass("active")	
		$('#title1').text(get_lan('con_top_3'))
		$('#title2').text(get_lan('con_top_3')) 		
	}

	
	var Id = GetQueryString('Id');
	var uId = GetQueryString('uId');
	var CompanyType, CompanyName, CompanyContent, CompanyHead, CompanyCode, CompanyNameEn, CompanyTel, CompanyFax, CompanyPhone, CompanyEmail, port, 
		AccountName, AccountPw;

	//港口	
	$("#e2").select2({
		ajax: {
			url: dataUrl+"ajax/publicdata.ashx?action=readport&companyId="+companyID,
			dataType: 'json',
			delay: 250,
			data: function(params) {
				params.offset = 10; //显示十条 
				params.page = params.page || 1; //页码 
				return {
					q: params.term,
					page: params.page,
					offset: params.offset
				};
			},
			cache: true,
			/* *@params res 返回值 *@params params 参数 */
			processResults: function(res, params) {
				var users = res.data;
				var options = [];
				for(var i = 0, len = users.length; i < len; i++) {
					var option = {
						"id": users[i]["puda_name_en"],
						"text": users[i]["puda_name_en"]
					};
					options.push(option);
				}
				return {
					results: options,
					pagination: {
						more: (params.page * params.offset) < res.total
					}
				};
			}
		},
		placeholder: '请选择', //默认文字提示
		language: "zh-CN",
		tags: true, //允许手动添加
		allowClear: true, //允许清空
		escapeMarkup: function(markup) {
			return markup;
		}, // 自定义格式化防止xss注入
		minimumInputLength: 3,
		formatResult: function formatRepo(repo) {
			return repo.text;
		}, // 函数用来渲染结果
		formatSelection: function formatRepoSelection(repo) {
			return repo.text;
		} // 函数用于呈现当前的选择
	});
	//港口
//	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readport', {
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
//			$('#e2').append(_html)
//		}
//	
//		//	console.log(_data)
//	}, function(error) {
//		console.log(parm)
//	}, 500)
	
	if (action == 'modify' || action == 'edit') {
	    if (leixing != 1) { $('#isvip').hide() }
		$('#conactModify1').hide()
		$('#conactModify2').hide()	
		if(action == 'edit') {
			$('#inputCompanyCode').attr("disabled","disabled");
		}
		common.ajax_req("get", false, dataUrl, "usercompany.ashx?action=readbyid", {
			"Id": Id
		}, function(data) {
			//初始化信息
			var _data = data.Data
			$("input[name='radio1'][value='" + _data.comp_typeId + "']").attr("checked", true),
			$('#inputCompanyName').val(_data.comp_name)
			$('#inputCompanyContent').val(_data.comp_content)
			$('#inputCompanyCode').val(_data.comp_code)
			$('#inputCompanyNameEn').val(_data.comp_name_en)
			$('#inputCompanyHead').val(_data.comp_head)
			$('#inputCompanyTel').val(_data.comp_tel)
			$('#inputCompanyFax').val(_data.comp_fax)
			$('#inputCompanyPhone').val(_data.comp_phone)
			$('#inputCompanyEmail').val(_data.comp_email)
			$('#inputCompanyAddress').val(_data.comp_address)
			var arrPort = _data.comp_port.split(',')
			$("#e2").val(arrPort).trigger("change")
			//$('#e2').html('<option value="' + arrPort[0] + '">' + arrPort[0] + '</option>').trigger("change")
			//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
		}, function(err) {
			console.log(err)
		}, 1000)
	
	} else {
	
	}
	
	if(action == 'pw') {
		$('#companyModify1').hide()
		$('#companyModify2').hide()		
		$('#inputAccountName').attr("disabled","disabled");
		setTimeout(function() {
			common.ajax_req("get", false, dataUrl, "user.ashx?action=readbyid", {
				"userId": uId
			}, function(data) {
				//console.log(data.Data)
				//初始化信息
				var _data = data.Data
				$('#inputAccountName').val(_data.usin_email)		
				//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
			}, function(err) {
				console.log(err)
			}, 5000)
		}, 100)
	
	} 
	
	/*下一步*/
	$('#send1').on('click', function() {
		var bt= $(this).attr("id");
		CompanyType = $("input[name='radio1']:checked").val(),
		CompanyName = $('#inputCompanyName').val(),
			CompanyContent = $('#inputCompanyContent').val(),
			CompanyCode = $('#inputCompanyCode').val(),
			CompanyNameEn = $('#inputCompanyNameEn').val(),
			CompanyHead = $('#inputCompanyHead').val(),
			CompanyTel = $('#inputCompanyTel').val(),
			CompanyFax = $('#inputCompanyFax').val(),
			CompanyPhone = $('#inputCompanyPhone').val(),
			CompanyEmail = $('#inputCompanyEmail').val(),
            CompanyAddress = $('#inputCompanyAddress').val(),
			port = $("#e2").val(),
			AccountName = $('#inputAccountName').val(),
			AccountPw = $('#inputAccountPw').val()
			
		if(action == 'add') {
			if(!CompanyName) {
				comModel("请输入本地公司名称")
			} else if(!CompanyContent) {
				comModel("请输入公司简介")
			} else if(!CompanyNameEn) {
				comModel("请输入英文公司名称")
			} else if(!CompanyTel) {
				comModel("请输入电话")
			} else if(!CompanyEmail) {
				comModel("请输入邮箱")
			} else if(!CompanyPhone) {
				comModel("请输入手机")
			} else if(!port) {
				comModel("请输入涉及港口")				
			} else if(!AccountName) {
				comModel("请输入用户登录账号")
			} else if(!AccountPw) {
				comModel("请输入用户登录密码")				
			} else {
				port = $("#e2").val().join(",")
				
				var parm = {
					'userId': userID,
					'typeId': CompanyType,
					'name': CompanyName,
					'content': CompanyContent,
					'head': CompanyHead,
					'code': CompanyCode,
					'nameEn': CompanyNameEn,
					'tel': CompanyTel,
					'fax': CompanyFax,
					'phone': CompanyPhone,
					'email': CompanyEmail,
					'address': CompanyAddress,
					'port': port,
					'account': AccountName,
					'pw': AccountPw
				}
				
				common.ajax_req('Post', false, dataUrl, 'usercompany.ashx?action=new', parm, function(data) {
//					console.log(data)
					if(data.State == 1) {
							comModel("新增用户成功")
							location.href = 'usercompany.html';	
					} else {
						comModel("新增用户失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify'||action == 'edit') {
			if(!CompanyName) {
				comModel("请输入本地公司名称")
			} else if(!CompanyContent) {
				comModel("请输入公司简介")
			} else if(!CompanyNameEn) {
				comModel("请输入英文公司名称")
			} else if(!CompanyTel) {
				comModel("请输入电话")
			} else if(!CompanyEmail) {
				comModel("请输入邮箱")
			} else if(!CompanyPhone) {
				comModel("请输入手机")
			} else if(!port) {
				comModel("请输入涉及港口")				
			}else{
				port = $("#e2").val().join(",")
				var parm = {
					'Id': Id,
					'userId': userID,
					'typeId': CompanyType,
					'name': CompanyName,
					'content': CompanyContent,
					'head': CompanyHead,
					'code': CompanyCode,
					'nameEn': CompanyNameEn,
					'tel': CompanyTel,
					'fax': CompanyFax,
					'phone': CompanyPhone,
					'email': CompanyEmail,
					'address': CompanyAddress,
					'port': port
				}
				
				common.ajax_req('POST', false, dataUrl, 'usercompany.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						if(action == 'modify'){
							comModel("修改成功")
							location.href = 'usercompany.html';							
						}else{
							comModel("修改成功")
							location.reload()							
						}

					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
		
		if(action == 'pw') {
			if(!AccountPw) {
				comModel("请输入用户登录密码")				
			} else {
				var parm = {
					'userId': uId,
					'pw': AccountPw
				}
				
				common.ajax_req('POST', false, dataUrl, 'user.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						location.href = 'usercompany.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 1000)				
				
			}
		}
	});

})



