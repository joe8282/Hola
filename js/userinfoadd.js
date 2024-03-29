//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "系统设置管理",    
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "System Management",       
        };

var Id = GetQueryString('Id');
var action = GetQueryString('action');
var _departmentArr = new Array();
var oTable;
$(function(){
	this.title = get_lan('nav_0_3')
	$('.navli0').addClass("active open")
	$('.sys3').addClass("active")	
	$('#title1').text(get_lan('nav_0_3'))
	$('#title2').text(get_lan('nav_0_3'))
	
	$('#Account').hide()
	$('#permissionModify1').hide()
	$('#permissionModify2').hide()
	$('#data_permissionModify1').hide()
	$('#data_permissionModify2').hide()

	var CompanyName, CompanyRemark, CompanyDepartmentId, CompanyCode, CompanyPosition, CompanyTel, CompanyPhone, CompanyEmail,CompanySalary, CompanyWelfare,CreateTime, CancelTime, AccountPw;
	var departmentData;

    //获取部门
	common.ajax_req('GET', false, dataUrl, 'usercompanydepartment.ashx?action=read', {
		'companyId': companyID
	}, function(data) {
	    var _data = data.data;
	    departmentData = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].code_id + '">' + _data[i].code_name + '</option>';
			$('#e1').append(_html)
			_departmentArr.push(_data[i].code_id + ';' + _data[i].code_name)
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
		hasPermission('1006'); //权限控制：修改职员
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
				if (_data.usin_level==1) {
				    $('#inputCompanyEmail').attr("disabled", "disabled")
				}
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
	}else{
		hasPermission('1005'); //权限控制：新增职员
	}

	
	if(action == 'pw') {
		hasPermission('1009'); //权限控制：修改密码
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

	if (action == 'permission') {
		hasPermission('1008'); //权限控制：职员权限
	    $('#companyModify1').hide()
	    $('#companyModify2').hide()
	    $('#conactModify1').hide()
	    $('#conactModify2').hide()
	    $('#permissionModify1').show()
	    $('#permissionModify2').show()
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
	            $(".username").text(_getDepartmentFun(_data.usin_departmentId) + " - " + _data.usin_name)
	            var permission = _data.usin_permission.split(',')
	            for (var i = 0; i < permission.length - 1; i++) {
	                $("#permission").find("input:checkbox[value='" + permission[i] + "']").prop('checked', true);
	            }
	        }, function (err) {
	            console.log(err)
	        }, 5000)
	    }, 100)

	}

	if (action == 'data_permission') {
	    hasPermission('10088'); //权限控制：职员数据权限
	    $('#companyModify1').hide()
	    $('#companyModify2').hide()
	    $('#conactModify1').hide()
	    $('#conactModify2').hide()
	    $('#data_permissionModify1').show()
	    $('#data_permissionModify2').show()
	    var department1 = departmentData.filter(function (e) {
	        return e.code_upDepartmentId == 0;
	    });
	    //加载权限数据
	    for (i = 0; i < department1.length; i++) {
	        var _html1 = ''
	        _html1 = _html1 + '<div class="col-sm-2"><input type="checkbox" class="data_permission" value="' + department1[i].code_id + '">' + department1[i].code_name + '</div>'
	        $('#data_permission').append(_html1)
	    }

	    setTimeout(function () {
	        common.ajax_req("get", true, dataUrl, "user.ashx?action=readbyid", {
	            "userId": Id
	        }, function (data) {
	            //console.log(data.Data)
	            //初始化信息
	            var _data = data.Data
	            $(".username").text(_getDepartmentFun(_data.usin_departmentId) + " - " + _data.usin_name)
	            var data_permission = _data.usin_data_permission.split(',')
	            for (var i = 0; i < data_permission.length - 1; i++) {
	                $("#data_permission").find("input:checkbox[value='" + data_permission[i] + "']").prop('checked', true);
	            }
	        }, function (err) {
	            console.log(err)
	        }, 5000)
	    }, 100)

	    oTable = initTable();

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
		                //location.href = 'userinfo.html';
		            } else {
		                comModel("设置失败")
		            }
		        }, function (error) {
		            console.log(parm)
		        }, 10000)

		    }
		}

		if (action == 'data_permission') {
		    var str = '';
		    $(".data_permission:checked").each(function (i, o) {
		        str += $(this).val();
		        str += ",";
		    });
		    if (str == '') {
		        comModel("请设置数据权限")
		    } else {
		        var parm = {
		            'Id': Id,
		            'data_permission': str
		        }

		        common.ajax_req('POST', true, dataUrl, 'userinfo.ashx?action=modify', parm, function (data) {
		            if (data.State == 1) {
		                comModel("设置成功")
		                //location.href = 'userinfo.html';
		            } else {
		                comModel("设置失败")
		            }
		        }, function (error) {
		            console.log(parm)
		        }, 10000)

		    }
		}

	});


    /**
 * 表格初始化
 * @returns {*|jQuery}
 */
	function initTable() {

	    var table = $("#example0").dataTable({
	        "sAjaxSource": dataUrl + 'ajax/crmcompany.ashx?action=read&companyId=' + companyID,
	        //"bLengthChange": false,
	        'bPaginate': false,
	        //"iDisplayLength": 10,
	        //"aLengthMenu": [[100, 500], ["100", "500"]],//二组数组，第一组数量，第二组说明文字;
	        //"aaSorting": [[7, 'desc']],
	        "aoColumnDefs": [//设置列的属性，此处设置第一列不排序
                //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
                { "bSortable": false, "aTargets": [0, 2] }
	        ],
	        "ordering": false,
	        //		"bDestory": true,
	        //		"bRetrieve": true,
	        //		"bFilter": false,
	        //"bSort": false,
	        //"aaSorting": [[ 0, "desc" ]],
	        //"stateSave": false,  //保存表格动态
	        //"columnDefs":[{
	        //    "targets": [ 0 ], //隐藏第0列，从第0列开始   
	        //    "visible": false
	        //}],
	        "aoColumns": [
                                {
                                    "mDataProp": "comp_id",
                                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                        $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
                                    }
                                },
               { "mDataProp": "usin_name" },
               { "mDataProp": "comp_name" },
               { "mDataProp": "comp_type" },
               { "mDataProp": "comp_contactPhone" },
               { "mDataProp": "comp_country" },
	        ],
	        //		"bProcessing": true,
	        //		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	        //		"sPaginationType": "bootstrap",

	        "oLanguage": {
	            //			"sUrl": "js/zh-CN.txt"
	            //			"sSearch": "快速过滤："
	            "sProcessing": "正在加载数据，请稍后...",
	            "sLengthMenu": "每页显示 _MENU_ 条记录",
	            "sZeroRecords": get_lan('nodata'),
	            "sEmptyTable": "表中无数据存在！",
	            "sInfo": get_lan('page'),
	            "sInfoEmpty": "显示0到0条记录",
	            "sInfoFiltered": "数据表中共有 _MAX_ 条记录",
	            //"sInfoPostFix": "",
	            "sSearch": get_lan('search'),
	            //"sUrl": "",
	            //"sLoadingRecords": "载入中...",
	            //"sInfoThousands": ",",
	            "oPaginate": {
	                "sFirst": get_lan('first'),
	                "sPrevious": get_lan('previous'),
	                "sNext": get_lan('next'),
	                "sLast": get_lan('last'),
	            }
	            //"oAria": {
	            //    "sSortAscending": ": 以升序排列此列",
	            //    "sSortDescending": ": 以降序排列此列"
	            //}
	        }
	    });

	    return table;
	}

})



/*客户管理权限设置*/
function _setCrmRoleFun() {
    $("#myModal1").modal("show");
    $(".crmCompanyList").empty()
    var roleId = [];
    common.ajax_req("get", true, dataUrl, "crmcompanyrole.ashx?action=read", {
        "companyId": companyID,
        "userId": userID
    }, function (data) {
        console.log(data.data)
        var _data = data.data
        for (var i = 0; i < _data.length; i++) {
            roleId.push(_data[i].crmro_crmId);
        }
    }, function (err) {
        console.log(err)
    }, 1000)

    setTimeout(function () {
        for (var i = 0; i < roleId.length; i++) {
            console.log(roleId[i])
            $("input[name='checkList'][value='" + roleId[i] + "']").attr("checked", true)
        }
    }, 1000)

    //common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
    //    "companyId": companyID
    //}, function (data) {
    //    console.log(data.data)
    //    var _data = data.data
    //    for (var i = 0; i < _data.length; i++) {
    //        var xuhao=i+1
    //        var feelist = '<p style="clear:both;"><div class="margin-top-10">' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:4%; float: left;"><input type="checkbox" name="checkList" value=' + _data[i].comp_id + '></label>' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:4%; float: left;">' + xuhao + '</label>' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].usin_name + '</label>' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:27%; float: left;">' + _data[i].comp_name + '</label>' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].comp_type + '</label>' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:15%; float: left;">' + _data[i].comp_contactPhone + '</label>' +
    //        //'<label for="inputPassword3" class="margin-right-10" style="width:15%; float: left;">' + _data[i].comp_contactEmail + '</label>' +
    //        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].comp_country + '</label>' +
    //        '</div></p>'
    //        $(".crmCompanyList").append(feelist)
    //    }

    //}, function (err) {
    //    console.log(err)
    //}, 1000)
}


$("#checkAll").on("click", function () {
    var xz = $(this).prop("checked");//判断全选按钮的选中状态
    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
});

$("#btnAddSave").on("click", function () {
    var str = '';
    $("input[name='checkList']:checked").each(function (i, o) {
        str += $(this).val();
        str += ",";
    });

    if (str.length == 0) {
        comModel("请选择要分配的客户公司！")
    } else {
        var jsonData = {
            'companyId': companyID,
            'userId': userID,
            'crmIds': str
        };
        $.ajax({
            url: dataUrl + 'ajax/crmcompanyrole.ashx?action=new',
            data: jsonData,
            dataType: "json",
            type: "post",
            success: function (backdata) {
                if (backdata.State == 1) {
                    comModel("设置成功！",true)
                    //location.href = 'emailpp_group.html';
                } else {
                    comModel("设置失败！")
                    //location.href = 'emailpp_group.html';
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});

function _getDepartmentFun(o) {
    var z = new Array();
    var x;
    for (var i = 0; i < _departmentArr.length; i++) {
        if (_departmentArr[i].indexOf(o) >= 0) {
            z = _departmentArr[i].split(";");
            x = z[1];
        }
    }
    return x;
}

