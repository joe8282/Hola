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
	common.ajax_req("get", true, dataUrl, "userinfo.ashx?action=readrole", {
	    "companyId": companyID
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
			    var crmlist = '<div class="col-sm-1 control-label  no-padding-left"><input type="checkbox" name="crmli" value="' + _data[i].role_id + '"> ' + _data[i].role_name + '</div>'
				$(".role").append(crmlist)
			}
		}
	
	}, function(err) {
		console.log(err)
	}, 2000)

	if(action == 'modify') {
		$('#conactModify1').hide()
		$('#conactModify2').hide()
		$('#permissionModify1').hide()
		$('#permissionModify2').hide()
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
		$('#permissionModify1').hide()
		$('#permissionModify2').hide()
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

	if (action == 'permission') {
	    $('#companyModify1').hide()
	    $('#companyModify2').hide()
	    $('#conactModify1').hide()
	    $('#conactModify2').hide()
	    //加载权限数据
	    for (i = 0; i < permissionData.length; i++) {
	        var _html1 = '', _html2 = ''
	        var Data2 = permissionData[i].children
	        for (j = 0; j < Data2.length; j++) {
	            _html2 = _html2 + '<div class="col-sm-2"><input type="checkbox" class="permission" name="' + permissionData[i].value + '" value="' + Data2[j].value + '">' + Data2[j].text + '</div>'
	        }
	        _html1 = '<div class="form-group"><label class="col-sm-12">' + permissionData[i].text + '&nbsp;&nbsp;<input type="checkbox" data="' + permissionData[i].value + '" class="permissionType"></label>' + _html2 + '</div>'
	        $('#permission').append(_html1)
	    }
	    $(".permissionType").on("click", function () {
	        var xz = $(this).prop("checked");//判断全选按钮的选中状态 
	        var data = $(this).attr('data');
	        var ck = $("input[name=" + data + "]").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	    });

	    setTimeout(function () {
	        common.ajax_req("get", true, dataUrl, "user.ashx?action=readbyid", {
	            "userId": Id
	        }, function (data) {
	            //console.log(data.Data)
	            //初始化信息
	            var _data = data.Data
	            var permission = _data.usin_permission.split(',')
	            for (var i = 0; i < permission.length - 1; i++) {
	                $("#permission").find("input:checkbox[value='" + permission[i] + "']").prop('checked', true);
	            }
	        }, function (err) {
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
					'Id': Id,
					'pw': AccountPw
				}
				
				common.ajax_req('POST', true, dataUrl, 'userinfo.ashx?action=modify', parm, function (data) {
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

		if (action == 'permission') {
		    var str = '';
		    $(".permission:checked").each(function (i, o) {
		        str += $(this).val();
		        str += ",";
		    });
		    if (str == '') {
		        comModel("请设置权限")
		    } else {
		        var parm = {
		            'Id': Id,
		            'permission': str
		        }

		        common.ajax_req('POST', true, dataUrl, 'userinfo.ashx?action=modify', parm, function (data) {
		            if (data.State == 1) {
		                comModel("设置成功")
		                location.href = 'userinfo.html';
		            } else {
		                comModel("设置失败")
		            }
		        }, function (error) {
		            console.log(parm)
		        }, 10000)

		    }
		}

	});

	
})



