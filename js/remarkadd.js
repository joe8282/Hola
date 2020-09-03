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
	this.title = get_lan('nav_0_5')
	$('.navli0').addClass("active open")
	$('.sys2').addClass("active")	
	$('#title1').text(get_lan('nav_0_5'))
	$('#title2').text(get_lan('nav_0_5'))

	var Id = GetQueryString('Id');
	var action = GetQueryString('action');
	
	if (action == 'modify') {
	    common.ajax_req("get", true, dataUrl, "remark.ashx?action=readbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        var _data = data.Data
	        $('#selectRemarkTypeCode').val(_data.rema_typeCode)
	        $('#inputRemarkType').val(_data.rema_type)
	        $('#inputRemarkContent').val(_data.rema_content)
	    }, function (err) {
	        console.log(err)
	    }, 5000)
	
	} else {
	
	}

	
	/*下一步*/
	$('#send1').on('click', function () {
	    var RemarkTypeCode = $('#selectRemarkTypeCode').val()
	    var RemarkType = $('#inputRemarkType').val()
	    var RemarkContent = $('#inputRemarkContent').val()
	    //console.log(str)
		if(action == 'add') {
		    if (!RemarkType) {
		        comModel("请输入备注标题")
		    } else if (!RemarkContent) {
		        comModel("请输入备注内容")
			} else {
				var parm = {
					'userId': userID,
					'companyId': companyID,
					'type': RemarkType,
					'typeCode': RemarkTypeCode,
					'content': RemarkContent
				}
				
				common.ajax_req('Post', true, dataUrl, 'remark.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
					    comModel("新增备注成功")
							location.href = 'remark.html';	
					} else {
					    comModel("新增备注失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
		    if (!RemarkType) {
		        comModel("请输入备注标题")
		    } else if (!RemarkContent) {
		        comModel("请输入备注内容")
		    } else {
				var parm = {
					'Id': Id,
					'userId': userID,
					'companyId': companyID,
					'typeCode': RemarkTypeCode,
					'type': RemarkType,
					'content': RemarkContent
				}
				
				common.ajax_req('POST', true, dataUrl, 'remark.ashx?action=modify', parm, function (data) {
				    if (data.State == 1) {
				        comModel("修改备注成功")
				        location.href = 'remark.html';
				    } else {
				        comModel("修改备注失败")
				    }
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}

	});

	
})



