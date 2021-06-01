//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "系统设置管理",    
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "System Management",       
        };

$(function () {
    hasPermission('1010')

	this.title = get_lan('nav_0_5')
	$('.navli0').addClass("active open")
	$('.sys2').addClass("active")	
	$('#title1').text(get_lan('nav_0_5'))
	$('#title2').text(get_lan('nav_0_5'))

	var Id = GetQueryString('Id');
	var action = GetQueryString('action');
	var RoleName;

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
	
	if (action == 'modify') {
		hasPermission('1012'); //权限控制：修改角色
	    common.ajax_req("get", true, dataUrl, "userinfo.ashx?action=readrolebyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        var _data = data.Data
	        $('#inputRoleName').val(_data.role_name)
	        var permission = _data.role_permission.split(',')
	        for (var i = 0; i < permission.length - 1; i++) {
	            $("#permission").find("input:checkbox[value='" + permission[i] + "']").prop('checked', true);
	        }
	    }, function (err) {
	        console.log(err)
	    }, 5000)
	
	} else {
		hasPermission('1011'); //权限控制：新增角色
	
	}

	
	/*下一步*/
	$('#send1').on('click', function() {
	    RoleName = $('#inputRoleName').val()
	    var str = '';
	    $(".permission:checked").each(function (i, o) {
	        str += $(this).val();
	        str += ",";
	    });
	    //console.log(str)
		if(action == 'add') {
		    if (!RoleName) {
		        comModel("请输入角色名称")
		    } else if (str == '') {
		        comModel("请设置权限")
			} else {
				var parm = {
					'userId': userID,
					'companyId': companyID,
					'name': RoleName,
					'permission': str
				}
				
				common.ajax_req('Post', true, dataUrl, 'userinfo.ashx?action=newrole', parm, function(data) {
					if(data.State == 1) {
					    comModel("新增角色成功")
							location.href = 'role.html';	
					} else {
					    comModel("新增角色失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
		    if (!RoleName) {
		        comModel("请输入角色名称")
		    } else if (str == '') {
		        comModel("请设置权限")
		    } else {
				var parm = {
					'Id': Id,
					'userId': userID,
					'companyId': companyID,
					'name': RoleName,
					'permission': str
				}
				
				common.ajax_req('POST', true, dataUrl, 'userinfo.ashx?action=modifyrole', parm, function (data) {
				    if (data.State == 1) {
				        comModel("修改角色成功")
				        location.href = 'role.html';
				    } else {
				        comModel("修改角色失败")
				    }
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}

	});

	
})



