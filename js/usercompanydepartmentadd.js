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
	$('.sys2').addClass("active")	
	$('#title1').text(get_lan('nav_0_2'))
	$('#title2').text(get_lan('nav_0_2'))

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
	}, 10000)
	
	var Id = GetQueryString('Id');
	var action = GetQueryString('action');	
	var CompanyName, CompanyContent, CompanyHead, CompanyDepartmentId, CompanyCode, CompanyNumber, CreateTime, CancelTime;
	
	if(action == 'modify') {	
		setTimeout(function() {
			common.ajax_req("get", true, dataUrl, "usercompanydepartment.ashx?action=readbyid", {
				"Id": Id
			}, function(data) {
				//console.log(data.Data)
				//初始化信息
				var _data = data.Data
				$('#inputCompanyName').val(_data.code_name)
				$('#inputCompanyContent').val(_data.code_content)
				$('#inputCompanyCode').val(_data.code_code)
				//$('#inputCompanyNumber').val(_data.code_number)
				$('#inputCompanyHead').val(_data.code_head)
				$("#e1").val(_data.code_upDepartmentId).trigger("change")
				if(_data.code_createTime!=null){
					$("#id-date-picker-1").val(_data.code_createTime.substring(0, 10))
				}
				if(_data.code_cancelTime!=null){
					$("#id-date-picker-2").val(_data.code_cancelTime.substring(0, 10))
				}						
				//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
			}, function(err) {
				console.log(err)
			}, 5000)
		}, 100)
	
	} else {
	
	}

	
	/*下一步*/
	$('#send1').on('click', function() {

		CompanyName = $('#inputCompanyName').val(),
			CompanyContent = $('#inputCompanyContent').val(),
			CompanyCode = $('#inputCompanyCode').val(),
			//CompanyNumber = $('#inputCompanyNumber').val(),
			CompanyHead = $('#inputCompanyHead').val(),
			CompanyDepartmentId = $("#e1").val(),
			CreateTime = $('#id-date-picker-1').val(),
			CancelTime = $('#id-date-picker-2').val()

		if(action == 'add') {
			if(!CompanyName) {
				comModel("请输入部门名称")
			} else if(!CompanyHead) {
				comModel("请输入部门负责人")			
			} else {
				var parm = {
					'userId': userID,
					'companyId': companyID,
					'upDepartmentId': CompanyDepartmentId,
					'name': CompanyName,
					'head': CompanyHead,
					'code': CompanyCode,
					'createTime': CreateTime,
					'cancelTime': CancelTime
				}
				
				common.ajax_req('Post', true, dataUrl, 'usercompanydepartment.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
							comModel("新增部门成功")
							location.href = 'usercompanydepartment.html';	
					} else {
						comModel("新增部门失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
			if(!CompanyName) {
				comModel("请输入部门名称")
			} else if(!CompanyHead) {
				comModel("请输入部门负责人")	
			}else{
				var parm = {
					'Id': Id,
					'upDepartmentId': CompanyDepartmentId,
					'name': CompanyName,
					'head': CompanyHead,
					'code': CompanyCode,
					'createTime': CreateTime,
					'cancelTime': CancelTime
				}
				
				common.ajax_req('POST', true, dataUrl, 'usercompanydepartment.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
							comModel("修改成功")
							location.href = 'usercompanydepartment.html';

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



