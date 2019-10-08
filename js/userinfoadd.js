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
	this.title = get_lan('nav_0_2')
	$('.navli0').addClass("active open")
	$('.sys3').addClass("active")	
	$('#title1').text(get_lan('nav_0_2'))
	$('#title2').text(get_lan('nav_0_2'))
	
	$('#Account').hide()
	var Id = GetQueryString('Id');
	var action = GetQueryString('action');	
	var CompanyName, CompanyRemark, CompanyDepartmentId, CompanyCode, CompanyPosition, CompanyTel, CompanyPhone, CompanyEmail,CompanySalary, CompanyWelfare,CreateTime, CancelTime, AccountPw;
    
    //获取部门
	common.ajax_req('GET', true, dataUrl, 'usercompanydepartment.ashx?action=read', {
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].code_id + '">' + _data[i].code_name + '</option>';
			$('#e1').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 2000)
	
	//获取权限列表
	common.ajax_req("get", true, dataUrl, "state.ashx?action=readbytypeid", {
		"typeId": 3
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var crmlist = '<div class="col-sm-1 control-label  no-padding-left"><input type="checkbox" name="crmli" value="' + _data[i].state_id + '"> ' + _data[i].state_name_cn + '</div>'
				$(".role").append(crmlist)
			}
		}
	
	}, function(err) {
		console.log(err)
	}, 2000)

	if(action == 'modify') {
		$('#conactModify1').hide()
		$('#conactModify2').hide()	
		setTimeout(function() {
			common.ajax_req("get", true, dataUrl, "userinfo.ashx?action=readbyid", {
				"Id": Id
			}, function(data) {
				//console.log(data.Data)
				//初始化信息
				var _data = data.Data
				$('#inputCompanyName').val(_data.usin_name)
				$('#inputCompanyRemark').val(_data.usin_introduce)
				$('#inputCompanyCode').val(_data.usin_code)
				$('#inputCompanyPosition').val(_data.usin_position)
				$('#inputCompanyTel').val(_data.usin_tel)
				$('#inputCompanyPhone').val(_data.usin_phone)
				$('#inputCompanyEmail').val(_data.usin_email)	
				$('#inputCompanySalary').val(_data.usin_salary)
				$('#inputCompanyWelfare').val(_data.usin_welfare)				
				$("#e1").val(_data.usin_departmentId).trigger("change")
				if(_data.usin_createTime!=null){
					$("#id-date-picker-1").val(_data.usin_createTime.substring(0, 10))
				}
				if(_data.usin_cancelTime!=null){
					$("#id-date-picker-2").val(_data.usin_cancelTime.substring(0, 10))
				}
				var userRole= _data.usin_role.split(',')
				console.log(userRole)
				for(var i = 0; i < userRole.length; i++) {
					$("input[name='crmli'][value='" + userRole[i] + "']").attr("checked", true)
				}
				//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
			}, function(err) {
				console.log(err)
			}, 5000)
		}, 500)
	
	} else {
	
	}

	
	if(action == 'pw') {
		$('#companyModify1').hide()
		$('#companyModify2').hide()	
		$('#Account').show()
		$('#inputAccountName').attr("disabled","disabled");
		setTimeout(function() {
			common.ajax_req("get", true, dataUrl, "user.ashx?action=readbyid", {
				"userId": Id
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

		CompanyName = $('#inputCompanyName').val(),
			CompanyRemark = $('#inputCompanyRemark').val(),
			CompanyCode = $('#inputCompanyCode').val(),
			CompanyPosition = $('#inputCompanyPosition').val(),
			CompanyTel = $('#inputCompanyTel').val(),
			CompanyPhone = $('#inputCompanyPhone').val(),
			CompanyEmail = $('#inputCompanyEmail').val(),	
			CompanySalary = $('#inputCompanySalary').val(),
			CompanyWelfare = $('#inputCompanyWelfare').val(),				
			CompanyDepartmentId = $("#e1").val(),
			CreateTime = $('#id-date-picker-1').val(),
			CancelTime = $('#id-date-picker-2').val(),
			AccountPw = $('#inputAccountPw').val()
			var role = [];
			$("input[name='crmli']:checked").each(function(index, item) {
				role.push($(this).val());
			});
			var roleData
			if(role.toString() != '') {
				roleData = role.toString()
			}

		if(action == 'add') {
			if(!CompanyName) {
				comModel("请输入姓名")
			} else if(!CompanyPosition) {
				comModel("请输入职能")
			} else if(!CompanyDepartmentId) {
				comModel("请选择所属部门")	
			} else if(!roleData) {
				comModel("请选择权限")				
			} else {
				var parm = {
					'adminId': userID,
					'companyId': companyID,
					'departmentId': CompanyDepartmentId,				
					'name': CompanyName,
					'code': CompanyCode,
					'position': CompanyPosition,
					'remark':CompanyRemark,
					'tel': CompanyTel,
					'phone': CompanyPhone,
					'email': CompanyEmail,
					'salary': CompanySalary,
					'welfare': CompanyWelfare,						
					'createTime': CreateTime,
					'cancelTime': CancelTime,
					'pw': AccountPw,
					'role': roleData
				}
				
				common.ajax_req('get', true, dataUrl, 'userinfo.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
							comModel("新增职员成功")
							location.href = 'userinfo.html';	
					} else {
						comModel("新增职员失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
			if(!CompanyName) {
				comModel("请输入姓名")
			} else if(!CompanyPosition) {
				comModel("请输入职能")
			} else if(!CompanyDepartmentId) {
				comModel("请选择所属部门")
			} else if(!roleData) {
				comModel("请选择权限")					
			}else{
				var parm = {
					'Id': Id,
					'adminId': userID,
					'companyId': companyID,
					'departmentId': CompanyDepartmentId,				
					'name': CompanyName,
					'code': CompanyCode,
					'position': CompanyPosition,
					'remark':CompanyRemark,
					'tel': CompanyTel,
					'phone': CompanyPhone,
					'email': CompanyEmail,
					'salary': CompanySalary,
					'welfare': CompanyWelfare,						
					'createTime': CreateTime,
					'cancelTime': CancelTime,
					'role': roleData
				}
				
				common.ajax_req('POST', true, dataUrl, 'userinfo.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
							comModel("修改成功")
							location.href = 'userinfo.html';

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
				comModel("请输入登录密码")				
			} else {
				var parm = {
					'userId': Id,
					'pw': AccountPw
				}
				
				common.ajax_req('POST', true, dataUrl, 'user.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						location.href = 'userinfo.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}

	});

	
})



