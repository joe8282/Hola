//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
            "primary" : "设为主要",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "CRM Home", 
            "primary" : "set primary",            
        };
        
var oTable, oblTable, oFollow, oDemand, ogetOrderSum, relatedComTable, filesTable;
var typeId;
var Id = GetQueryString('Id');
var userCompanyId;

$(document).ready(function() {
//	initModal();
	hasPermission('1606'); //权限控制
	if (isPermission('1607') != 1) {
	    $('#follow_add').hide()
	}
	if (isPermission('1610') != 1) {
	    $('#Demand_add').hide()
	}
	if (isPermission('1613') != 1) {
	    $('#Bill_add').hide()
	}
	if (isPermission('1616') != 1) {
	    $('#relatedComPanel_add').hide()
	}
	this.title = get_lan('nav_2_1')
	$('.navli2').addClass("active open")
	$('.crm2').addClass("active")	
	$('#title1').text(get_lan('nav_2_5'))
	$('#title2').text(get_lan('nav_2_5'))
	$('#mySmallModalLabel').text(get_lan('nav_2_5'))
	
	$('#send5').hide()
	
	GetDetail();	
	$('#send1').on('click', function() {
		location.href = 'crmcompanyadd.html?action=modify&Id='+Id;
	})
		
	//oTable=GetContact();
	

	$('#send3').on('click', function() {
	    location.href = 'crmcompanycontactadd.html?action=add&back='+Id+'&userCompanyId=' + userCompanyId;
	})

	
		
	//oBill=GetBill();	
	$('#send00').hide()

	$('#send77').hide()
	
	
});
function GetDetail() 
{
	common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=readbyid", {
		"Id": Id
	}, function(data) {
		//初始化信息;
		var _data = data.Data;
		userCompanyId = _data.comp_customerId;
		oblTable = initBlListTable();
		orderTable = initOrderListTable();
		relatedComTable=initRelateComListTable();
		$('.companyName').text(_data.comp_name)
		$('.companyContent').text(_data.comp_content)
		if(_data.comp_isSupplier==1){
			$('.companyIsSupplier').text("是")
		}else{
			$('.companyIsSupplier').text("否")
		}
		if(_data.comp_type){
			var _compType=[];
			var _compTypeHtml="";
			_compType=_data.comp_type.split(",");
			for (var i = 0; i < _compType.length; i++) {
				_compTypeHtml+='<span class="badge badge-green badge-square">'+_compType[i]+'</span> ';
			}
		}
			$('.companyType').html(_compTypeHtml)
			$('.companyAddress').text(_data.comp_address)
			$('.companyCountry').text(_data.comp_country)
			$('.companyTel').text(_data.comp_tel)
			$('.companyFax').text(_data.comp_fax)
			$('.companyWeb').text(_data.comp_web)
			if(_data.comp_org){$('.companyOrg').text("Member of "+_data.comp_org+"; ")}
			$('.companyUpdateTime').text(_data.comp_updateTime.substring(0, 19).replace('T',' '))
			$('.companyRemark').text(_data.comp_remark)
			var _badgesArr = new Array();
			_badgesArr=_data.comp_badges.split(";");
			for(var z=0;z<_badgesArr.length;z++){
				var appendBadges='<span class="label label-success">'+_badgesArr[z]+'</span> '
				$('.companyBadges').append(appendBadges)
			}
			
		//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
			oBill = GetBill(); //这里获取提单的信息，要不然会出现userCompanyId获取不到
			oFollow = GetFollow();
			oDemand = GetDemand();
			oTable2 = GetContact2();

			filesTable = GetFiles();
			periodTable = GetPeriod();
			//getOrderSum();
	}, function(err) {
		console.log(err)
	}, 2000)
	
	$('#send22').hide()
}

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
//function GetContact() {
//	var table = $("#example").dataTable({
//		//"iDisplayLength":10,
//		"sAjaxSource": dataUrl+'ajax/crmcompanycontact.ashx?action=readtop&companyId='+Id,
//		'bPaginate': false,
//		"bInfo" : false,
////		"bDestory": true,
////		"bRetrieve": true,
//		"bFilter": false,
//		"bSort": false,
//		"aaSorting": [[ 0, "desc" ]],
////		"bProcessing": true,
//		"aoColumns": [
//			{ "mDataProp": "coco_name" },
//			{ "mDataProp": "coco_email" },
//			{ "mDataProp": "coco_phone" },
//			{ "mDataProp": "coco_position" },
//			{ "mDataProp": "coco_qq" },
//			{ "mDataProp": "coco_skype" },
//			{ "mDataProp": "coco_whatsapp" },
//			{ "mDataProp": "coco_facebook" },
//			{ "mDataProp": "coco_linkedin" },						
//			{
//				"mDataProp": "coco_id",
//				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
//					if(oData.coco_first==1){
//						$(nTd).html("<div class='btn-group' style='z-index:auto; width:70px;'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
//	                    +"<ul class='dropdown-menu dropdown-azure'>"
//	                    +"<li><a href='crmcompanycontactadd.html?action=modify&Id="+sData +"'> " + get_lan('edit') + "</a></li>"
//	                    +"<li><a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a></li>"
//	                    +"</ul></div>")
//					// $(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id="+sData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
//					// 	.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")					
//					}else{
//						$(nTd).html("<div class='btn-group' style='z-index:auto; width:70px;'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
//	                    +"<ul class='dropdown-menu dropdown-azure'>"
//	                    +"<li><a href='crmcompanycontactadd.html?action=modify&Id="+sData +"'> " + get_lan('edit') + "</a></li>"
//	                    +"<li><a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a></li>"
//	                    +"<li><a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a></li>"
//	                    +"</ul></div>")
//						// $(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id="+sData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
//						// .append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
//						// .append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
//					}

//				}
//			},
//		]
//	});
//	return table;
//}

function GetContact2() {
		$(".companyPersons").empty();
	common.ajax_req("get", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
	    "companyId": userCompanyId,
        "actionId": companyID
	}, function(data) {
		if(data) {
			var _data = data.data;
			var _htmlSkype="";
			var _htmlWhatsapp="";
			var _htmlFacebook="";
			var _htmlLinkedin="";
			var _htmlQq="";
			for(var i = 0; i < _data.length; i++) {
				var _htmlFirst="";
				var _htmlFirstStyle=""; //放在这里可以区分是否是关键人

				_data[i].coco_skype?(_htmlSkype='<div class="databox-text"><i class="stat-icon icon-xlg fa fa-skype" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_skype+'</i></div>'):_htmlSkype="";
				_data[i].coco_whatsapp?(_htmlWhatsapp='<div class="databox-text"><i class="stat-icon icon-xlg fa fa-skype" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_whatsapp+'</i></div>'):_htmlWhatsapp="";
				_data[i].coco_facebook?(_htmlFacebook='<div class="databox-text"><i class="stat-icon icon-xlg fa fa-skype" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_facebook+'</i></div>'):_htmlFacebook="";
				_data[i].coco_linkedin?(_htmlLinkedin='<div class="databox-text"><i class="stat-icon icon-xlg fa fa-skype" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_linkedin+'</i></div>'):_htmlLinkedin="";
				_data[i].coco_qq?(_htmlQq='<div class="databox-text"><i class="stat-icon icon-xlg fa fa-skype" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_qq+'</i></div>'):_htmlQq="";
				if(_data[i].coco_first==1){
					_htmlFirstStyle='background-image: linear-gradient(to right,#f9f499,#fff)';
				} else {
				    if (isPermission('1617') != 1) {
				        _htmlFirst = '<a href="javascript:void(0);" onclick="_primaryFun(' + _data[i].coco_id + ')"><i class="glyphicon glyphicon-thumbs-up green" style="float:right; margin-right:10px;"></i></a>';
				    }
				};
				var contactlist='<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'+
                                    '<div class="databox radius-bordered databox-shadowed databox-graded" style="margin-bottom: 10px; height: auto;'+_htmlFirstStyle+'">'+
                                        '<div class="databox-right" style="width: 100%; height: auto;">'+
                                            '<div class="databox-text">'+
                                        		'<a href="javascript:void(0);" onclick="_deleteContactFun(' + _data[i].coco_id + ')"><i class="glyphicon glyphicon-remove orange" style="float:right;"></i></a>'+
                                        		'<a href="crmcompanycontactadd.html?action=modify&Id=' + _data[i].coco_id + '"><i class="glyphicon glyphicon-cog blue" style="float:right; margin-right:10px;"></i></a>' + _htmlFirst + 
                                            	'<strong><span style="font-size: 14px;">'+_data[i].coco_name+'</span></strong> <span>'+_data[i].coco_position+'</span></div>'+
                                                '<div class="databox-text"><i class="stat-icon icon-xlg fa fa-phone" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_phone+'</i>' +
                                                '<i class="stat-icon icon-xlg fa fa-envelope" style="font-size: 14px; margin: 5px;"> '+_data[i].coco_email+'</i> '+
                                            '</div>'+_htmlSkype+_htmlWhatsapp+_htmlFacebook+_htmlLinkedin+_htmlQq+                                                
                                        '</div>'+
                                    '</div>'+
                                '</div>'
						$(".companyPersons").prepend(contactlist)
			}
		}
	
	}, function(err) {
		console.log(err)
	}, 2000)
}
/**
 * 删除
 * @param id
 * @private
 */
function _deleteContactFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/crmcompanycontact.ashx?action=cancel',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State) {
						comModel("删除成功")
						oTable.fnReloadAjax(oTable.fnSettings());
					} else {
						alert("Delete Failed！");
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});
}


/**
 * 设为主要
 * @param id
 * @private
 */
function _primaryFun(cocoId) {
	$.ajax({
		url: dataUrl+'ajax/crmcompanycontact.ashx?action=primary',
		data: {
			"Id": cocoId,
			"companyId": userCompanyId
		},
		dataType: "json",
		type: "post",
		success: function(backdata) {
			if(backdata.State) {
				comModel("更新成功")
				oTable.fnReloadAjax(oTable.fnSettings());
			} else {
				alert("Update Failed！");
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

$("#id-date-picker-1").val(getDate());
function GetFollow() {
	var table1 = $("#follow").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/crmcompanyfollow.ashx?action=read&actionId=' + companyID + '&companyId=' + userCompanyId,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": false,
		"aaSorting": [[ 0, "desc" ]],
//		"bProcessing": true,
		"aoColumns": [
			{ "mDataProp": "usin_name" },
			{ "mDataProp": "cofo_content" },
			{ "mDataProp": "cofo_followWay" },
			{
				"mDataProp": "cofo_followTime",
				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
					$(nTd).html(oData.cofo_followTime.substring(0, 10));
				}			
			},					
			{
				"mDataProp": "cofo_id",
				"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
				    var perEdit = perDel = ""
				    if (isPermission('1608') == 1) {
				        perEdit = "<a href='javascript:void(0);' " +  "onclick='_editFollowFun(\"" + oData.cofo_id + "\")'>"+get_lan('edit')+"</a>&nbsp;&nbsp;&nbsp;&nbsp;"
				    }
				    if (isPermission('1609') == 1) {
				        perDel = "<a href='javascript:void(0);' onclick='_deleteFollowFun(" + sData + ")'>" + get_lan('delete') + "</a>"
				    }
				    $(nTd).html(perEdit)
						.append(perDel)

				}
			},
		],
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
	return table1;
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFollowFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/crmcompanyfollow.ashx?action=cancel',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State) {
						comModel("删除成功")
						oFollow.fnReloadAjax(oFollow.fnSettings());
					} else {
						alert("Delete Failed！");
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});

}


var followId, followWay, followTime, followContent;

/**
 * 编辑数据带出值
 */
function _editFollowFun(fId) {
	followId=fId;
	common.ajax_req("get", true, dataUrl, "crmcompanyfollow.ashx?action=readbyid", {
		"Id": fId
	}, function(data) {
		//console.log(data.Data)
		//初始化信息
		var _data = data.Data
		$("input[name='radio1'][value='"+_data.cofo_followWay+"']").attr("checked",true),
		$("#id-date-picker-1").val(_data.cofo_followTime.substring(0, 10));
		$("#editor").html(_data.cofo_content);
		$("#send4").hide();
		$("#send5").show();		
	}, function(err) {
		console.log(err)
	}, 5000)
	

}

/*下一步*/
$('#send4').on('click', function() {
	followWay = $("input[name='radio1']:checked").val(),
	followTime = $('#id-date-picker-1').val(),
	followContent= $('#editor').html();
    
	if(!followTime) {
		comModel("请输入跟进时间")
	} else if(!followContent) {
		comModel("请输入跟进内容")
	} else {
		var parm = {
			'userId': userID,
			'companyId': userCompanyId,
		    'actionId':companyID,
			'content': followContent,
			'followWay': followWay,
			'followTime': followTime
		}
	
		common.ajax_req('POST', true, dataUrl, 'crmcompanyfollow.ashx?action=new', parm, function(data) {
			if(data.State == 1) {
				comModel("新增跟进信息成功")
				$("input[name='radio1'][value='Phone']").attr("checked",true),
				$('#id-date-picker-1').val("")
				$('#editor').html("")
				oFollow.fnReloadAjax(oFollow.fnSettings());
				//location.href = 'crmcompanydetail.html?Id=' + Id;
			} else {
				comModel("新增跟进信息失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
	}
});

$('#send5').on('click', function() {
	followWay = $("input[name='radio1']:checked").val(),
	followTime = $('#id-date-picker-1').val(),
	followContent= $('#editor').html();
    
	if(!followTime) {
		comModel("请输入跟进时间")
	} else if(!followContent) {
		comModel("请输入跟进内容")
	} else {
		var parm = {
			'Id': followId,
			'userId': userID,
			'content': followContent,
			'followWay': followWay,
			'followTime': followTime
		}
	
		common.ajax_req('POST', true, dataUrl, 'crmcompanyfollow.ashx?action=modify', parm, function(data) {
			if(data.State == 1) {
				comModel("修改跟进信息成功")
				$("input[name='radio1'][value='Phone']").attr("checked",true),
				$('#id-date-picker-1').val("")
				$('#editor').html("")
				oFollow.fnReloadAjax(oFollow.fnSettings());
				//location.href = 'crmcompanydetail.html?Id=' + Id;
			} else {
				comModel("修改跟进信息失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
	}
});

//需求管理
function GetDemand() {
	var table1 = $("#Demand").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/crmcompanydemand.ashx?action=read&actionId=' + companyID + '&companyId=' + userCompanyId,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": false,
		"aaSorting": [[ 0, "desc" ]],
//		"bProcessing": true,
		"aoColumns": [
			{ "mDataProp": "dema_incoterm" },
			{ "mDataProp": "dema_port1" },
			{ "mDataProp": "dema_port2" },
			{ "mDataProp": "dema_movement" },
			{ "mDataProp": "dema_product" },							
			{
				"mDataProp": "dema_id",
				"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
				    var perEdit = perDel = ""
				    if (isPermission('1611') == 1) {
				        perEdit = "<a href='javascript:void(0);' " + "onclick='_editDemandFun(\"" + oData.dema_id + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
				    }
				    if (isPermission('1612') == 1) {
				        perDel = "<a href='javascript:void(0);' onclick='_deleteDemandFun(" + sData + ")'>" + get_lan('delete') + "</a>"
				    }
				    $(nTd).html(perEdit)
						.append(perDel)

				}
			},
		],
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
	return table1;
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteDemandFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/crmcompanydemand.ashx?action=cancel',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State) {
						comModel("删除成功")
						oDemand.fnReloadAjax(oDemand.fnSettings())
					} else {
						alert("Delete Failed！");
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});

}


var demandId, incoterm,port1,port2,movement,product;

$('#send0').on('click', function() {
	incoterm = $("#e1").val(),
	port1 = $("#e2").val(),
	port2 = $("#e3").val(),
	movement = $("#e4").val(),
	product = $("#inputProduct").val();
    
	if(!incoterm) {
		comModel("请输入贸易条款")
	} else if(!port1) {
		comModel("请输入起运港口")
	} else if(!port2) {
		comModel("请输入到运港口")
	} else if(!movement) {
		comModel("请输入运输方式")
	} else if(!product) {
		comModel("请输入产品")		
	} else {
		var parm = {
			'userId': userID,
			'actionId': companyID,
			'companyId': userCompanyId,
			'incoterm': incoterm,
			'port1': port1,
			'port2': port2,
			'movement': movement,
			'product': product
		}
	
		common.ajax_req('POST', true, dataUrl, 'crmcompanydemand.ashx?action=new', parm, function(data) {
			if(data.State == 1) {
				comModel("新增需求信息成功")
				$("#e1").val(null).trigger("change");
				$("#e2").val(null).trigger("change");
				$("#e3").val(null).trigger("change");
				$("#e4").val(null).trigger("change");
				$("#inputProduct").val("FAK")
				oDemand.fnReloadAjax(oDemand.fnSettings())
				//location.href = 'crmcompanydetail.html?Id=' + Id;
			} else {
				comModel("新增需求信息失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
	}
});

/**
 * 编辑数据带出值
 */
function _editDemandFun(fId) {
	demandId=fId;
	common.ajax_req("get", true, dataUrl, "crmcompanydemand.ashx?action=readbyid", {
		"Id": fId
	}, function(data) {
		//console.log(data.Data)
		//初始化信息
		var _data = data.Data
		$("#inputProduct").val(_data.dema_product);
		$("#e1").val(_data.dema_incoterm).trigger("change")
		$('#e2').html('<option value="' + _data.dema_port1 + '">' + _data.dema_port1 + '</option>').trigger("change")
		$('#e3').html('<option value="' + _data.dema_port2 + '">' + _data.dema_port2 + '</option>').trigger("change")
		// $("#e2").val(_data.dema_port1).trigger("change")
		// $("#e3").val(_data.dema_port2).trigger("change")
		$("#e4").val(_data.dema_movement).trigger("change")
		
		$('#send00').show()
		$('#send0').hide()
		
	}, function(err) {
		console.log(err)
	}, 5000)
}

$('#send00').on('click', function() {
	incoterm = $("#e1").val(),
	port1 = $("#e2").val(),
	port2 = $("#e3").val(),
	movement = $("#e4").val(),
	product = $("#inputProduct").val();
    
	if(!incoterm) {
		comModel("请输入贸易条款")
	} else if(!port1) {
		comModel("请输入起运港口")
	} else if(!port2) {
		comModel("请输入到运港口")
	} else if(!movement) {
		comModel("请输入运输方式")
	} else if(!product) {
		comModel("请输入产品")		
	} else {
		var parm = {
			'userId': userID,
			'Id': demandId,
			'incoterm': incoterm,
			'port1': port1,
			'port2': port2,
			'movement': movement,
			'product': product
		}
	
		common.ajax_req('POST', true, dataUrl, 'crmcompanydemand.ashx?action=modify', parm, function(data) {
			if(data.State == 1) {
				comModel("修改需求信息成功")
				$("#e1").val(null).trigger("change");
				$("#e2").val(null).trigger("change");
				$("#e3").val(null).trigger("change");
				$("#e4").val(null).trigger("change");
				$("#inputProduct").val("FAK")
				oDemand.fnReloadAjax(oDemand.fnSettings())
				//location.href = 'crmcompanydetail.html?Id=' + Id;
			} else {
				comModel("修改需求信息失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
	}
});


//提单管理
function GetBill() {
	console.log(userCompanyId)
	var table1 = $("#Bill").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/crmcompanybill.ashx?action=read&actionId='+companyID+'&companyId='+userCompanyId,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bAutoWidth":false,
		"bSort": false,
		"aaSorting": [[ 2, "desc" ]],
//		"bProcessing": true,
		"aoColumns": [
//			{ "mDataProp": "cobi_name"},
			{ "mDataProp": "cobi_typeName" },
			{
				"mDataProp": "cobi_content"
//				"createdCell": function (td, cellData, rowData, row, col) {
//					$(td).html(HtmlEncode(rowData.cobi_content));
//				}			
			},
			{
				"mDataProp": "cobi_updateTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html(rowData.cobi_updateTime.substring(0, 10));
				}			
			},					
			{
				"mDataProp": "cobi_id",
				"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
				    var perEdit = perDel = ""
				    if (isPermission('1614') == 1) {
				        perEdit = "<a href='javascript:void(0);' " + "onclick='_editBillFun(\"" + oData.cobi_id + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
				    }
				    if (isPermission('1615') == 1) {
				        perDel = "<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>"
				    }
				    $(nTd).html(perEdit)
						.append(perDel)

				}
			},
		],
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
	return table1;
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteBillFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/crmcompanybill.ashx?action=cancel',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State) {
						comModel("删除成功")
						oBill.fnReloadAjax(oBill.fnSettings())
					} else {
						alert("Delete Failed！");
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});

}


var billId, billName,billTypeId,billTypeName,billContent;

$('#send11').on('click', function() {
	billTypeId = $("#e11").val(),
	billTypeName = $("#e11").find("option:selected").text(),
	//billName = $("#inputBillName").val(),
	billContent = HtmlEncode($("#inputBillContent").val());
//	var reg=new RegExp("\n","g");
	if(billContent.indexOf("<br>") == -1){
		billContent=insert_flg(billContent,"<br>",40);	
	}
    console.log(billContent)
	if(!billContent) {
		comModel("请输入提单信息内容")	
	} else {
		var parm = {
			'userId': userID,
			'actionId': companyID,
			'companyId': userCompanyId,
			//'name': billName,
			'content': billContent,
			'typeId': billTypeId,
			'typeName': billTypeName
		}
	
		common.ajax_req('POST', true, dataUrl, 'crmcompanybill.ashx?action=new', parm, function(data) {
			if(data.State == 1) {
				comModel("新增提单信息成功")
				$("#inputBillName").val("")
				$("#inputBillContent").val("")
				oBill.fnReloadAjax(oBill.fnSettings())
				//location.href = 'crmcompanydetail.html?Id=' + Id;
			} else {
				comModel("新增提单信息失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
	}
});

/**
 * 编辑数据带出值
 */
function _editBillFun(fId) {
	billId=fId;
	common.ajax_req("get", true, dataUrl, "crmcompanybill.ashx?action=readbyid", {
		"Id": fId
	}, function(data) {
		//初始化信息
		var _data = data.Data
		//$("#inputBillName").val(_data.cobi_name);
		$("#inputBillContent").val(HtmlDecode(_data.cobi_content));
		$("#e11").val(_data.cobi_typeId).trigger("change")
		
		$('#send22').show()
		$('#send11').hide()
		
	}, function(err) {
		console.log(err)
	}, 5000)
}

$('#send22').on('click', function() {
	billTypeId = $("#e11").val(),
	billTypeName = $("#e11").find("option:selected").text(),
	//billName = $("#inputBillName").val(),
	billContent = HtmlEncode($("#inputBillContent").val());
    
	if(!billContent) {
		comModel("请输入提单信息内容")	
	} else {
		var parm = {
			'userId': userID,
			'Id': billId,
			//'name': billName,
			'content': billContent,
			'typeId': billTypeId,
			'typeName': billTypeName
		}
	
		common.ajax_req('POST', true, dataUrl, 'crmcompanybill.ashx?action=modify', parm, function(data) {
			if(data.State == 1) {
				comModel("修改提单信息成功")
				$("#inputBillName").val("")
				$("#inputBillContent").val("")				
				oBill.fnReloadAjax(oBill.fnSettings())
				//location.href = 'crmcompanydetail.html?Id=' + Id;
			} else {
				comModel("修改提单信息失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
	}
});


$(function(){
//港口
$("#e2,#e3").select2({
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
	selectOnClose: true, //自动选择最匹配的那个数据
	//allowClear: true, //允许清空
	//minimumResultsForSearch: 1,
	//minimumInputLength: 3,

	escapeMarkup: function(markup) {
		return markup;
	}, // 自定义格式化防止xss注入
	formatResult: function formatRepo(repo) {
		return repo.text;
	}, // 函数用来渲染结果
	formatSelection: function formatRepoSelection(repo) {
		return repo.text;
	} // 函数用于呈现当前的选择
});

//港口
common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {'typeId':3,'companyId':companyID}, function(data) {
	var _data = data.data;
	for(var i = 0; i < _data.length; i++) {
		var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
		$('#e1').append(_html)
	}
}, function(error) {
	console.log(parm)
}, 10000)

//港口
common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {'typeId':7,'companyId':companyID}, function(data) {
	var _data = data.data;
	for(var i = 0; i < _data.length; i++) {
		var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
		$('#e4').append(_html)
	}
}, function(error) {
	console.log(parm)
}, 10000)



/*
add this plug in
// you can call the below function to reload the table with current state
Datatables刷新方法
oTable.fnReloadAjax(oTable.fnSettings());
*/
$.fn.dataTableExt.oApi.fnReloadAjax = function(oSettings) {
	//oSettings.sAjaxSource = sNewSource;
	this.fnClearTable(this);
	this.oApi._fnProcessingDisplay(oSettings, true);
	var that = this;

	$.getJSON(oSettings.sAjaxSource, null, function(json) {
		/* Got the data - add it to the table */
		for(var i = 0; i < json.data.length; i++) {
			that.oApi._fnAddData(oSettings, json.data[i]);
		}
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		that.fnDraw(that);
		that.oApi._fnProcessingDisplay(oSettings, false);
	});
}
});

function initBlListTable() {   //这里加一个相关的订单，但是还不知道如何查询这些订单是相关的公司的 20190816 by daniel
    var ajaxUrlBl,tableTitleBl,columnsBl
    	ajaxUrlBl=dataUrl+'ajax/booking.ashx?action=read&fromId=1&companyId='+userCompanyId+'&crmId='+companyID;
    	tableTitleBl='<th>订舱委托号</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>货量</th><th>订舱时间</th><th>离港时间</th><th>状态</th>'
    	$('#tableTitleBl').html(tableTitleBl)
    	columnsBl = [
    		{
    			"mDataProp": "book_code"
    		},
    		{
    			"mDataProp": "book_port1",
	            "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
	                      return (full.book_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.book_port2)
	                    }
    		},
    		// {
    		// 	"mDataProp": "book_port2"
    		// },
    		{
    			"mDataProp": "book_allContainer"
//  			"mDataProp": "book_id",
//  			"createdCell": function(td, cellData, rowData, row, col) {
//  				var tohtml = ''
//  				if(rowData.book_20GP.substr(0, 1) != ' ') {
//  					tohtml = rowData.book_20GP;
//  				}
//  				if(rowData.book_40GP.substr(0, 1) != ' ') {
//  					tohtml = tohtml + '<br/>' + rowData.book_40GP;
//  				}
//  				if(rowData.book_40HQ.substr(0, 1) != ' ') {
//  					tohtml = tohtml + '<br/>' + rowData.book_40HQ;
//  				}
//  				$(td).html(tohtml);
//  			}
    		},
    		{
    			"mDataProp": "book_time",
    			"createdCell": function(td, cellData, rowData, row, col) {
    				if(rowData.book_time != null) {
    					$(td).html(rowData.book_time.substring(0, 10));
    				} else {
    					$(td).html("NULL");
    				}
    			}
    		},    		
    		{
    			"mDataProp": "book_okPortTime",
    			"createdCell": function(td, cellData, rowData, row, col) {
    				if(rowData.book_okPortTime != null) {
    					$(td).html(rowData.book_okPortTime.substring(0, 10));
    				} else {
    					$(td).html("NULL");
    				}
    			}
    		}, 		
    		{
    			"mDataProp": "state_name_cn"
    		},
			// {
			// 	"mDataProp": "book_id",
			// 	"createdCell": function (td, cellData, rowData, row, col) {
			// 		// $(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
   //   //                +"<ul class='dropdown-menu dropdown-azure'>"
   //   //                +"<li><a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a></li>"
   //   //                +"<li><a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a></li>"
   //   //                +"</ul></div>")
			// 		// $(td).html("<a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")	
			// 		// .append("<a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a>")						
   //                  $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel

   //                      var _thisHtml="<div class='btn-group'><a class='btn btn-blue btn-sm' href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>"
   //                      +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
   //                      +"<ul class='dropdown-menu dropdown-azure'>"
   //                      +"<li><a href='orderfee.html?Id=" + cellData + "'>财务状况</a></li>"
   //                      +"</ul></div>"                        

   //                      return (_thisHtml);

   //                  })
			// 	}
			// }, 		
    	]
    
	var tableBl = $("#blpanel_list").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": ajaxUrlBl,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
        "aaSorting": [[3, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [1,2,4,5]}
        ],
//		"bSort": true,
//		"aaSorting": [[ 9, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columnsBl,
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
    setTimeout(function () {
     	var _dataTable = $('#blpanel_list').DataTable();
		var info = _dataTable.page.info();
		var dataRows = info.recordsTotal; 
		$("#bookingSum").text(dataRows);
	}, 2000);
	return tableBl;
}

function initOrderListTable() {   //相关订单
    var ajaxUrlBl, columnsBl
    ajaxUrlBl = dataUrl + 'ajax/booking.ashx?action=read&fromId=0&companyId=' + companyID + '&crmId=' + Id;
    //console.log(tableTitleOrder)
    columnsBl = [
        {
            "mDataProp": "book_orderCode"
        },
        {
            "mDataProp": "book_port1",
            "mRender": function (data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                return (full.book_port1 + " <i class='fa fa-long-arrow-right'></i></br> " + full.book_port2)
            }
        },
        // {
        // 	"mDataProp": "book_port2"
        // },
        {
            "mDataProp": "book_allContainer"
            //  			"mDataProp": "book_id",
            //  			"createdCell": function(td, cellData, rowData, row, col) {
            //  				var tohtml = ''
            //  				if(rowData.book_20GP.substr(0, 1) != ' ') {
            //  					tohtml = rowData.book_20GP;
            //  				}
            //  				if(rowData.book_40GP.substr(0, 1) != ' ') {
            //  					tohtml = tohtml + '<br/>' + rowData.book_40GP;
            //  				}
            //  				if(rowData.book_40HQ.substr(0, 1) != ' ') {
            //  					tohtml = tohtml + '<br/>' + rowData.book_40HQ;
            //  				}
            //  				$(td).html(tohtml);
            //  			}
        },
        {
            "mDataProp": "book_time",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (rowData.book_time != null) {
                    $(td).html(rowData.book_time.substring(0, 10));
                } else {
                    $(td).html("NULL");
                }
            }
        },
        {
            "mDataProp": "book_okPortTime",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (rowData.book_okPortTime != null) {
                    $(td).html(rowData.book_okPortTime.substring(0, 10));
                } else {
                    $(td).html("NULL");
                }
            }
        },
        {
            "mDataProp": "orderstate_name_cn"
        },
        // {
        // 	"mDataProp": "book_id",
        // 	"createdCell": function (td, cellData, rowData, row, col) {
        // 		// $(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
//   //                +"<ul class='dropdown-menu dropdown-azure'>"
//   //                +"<li><a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a></li>"
//   //                +"<li><a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a></li>"
//   //                +"</ul></div>")
        // 		// $(td).html("<a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")	
        // 		// .append("<a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a>")						
//                  $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel

//                      var _thisHtml="<div class='btn-group'><a class='btn btn-blue btn-sm' href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>"
//                      +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
//                      +"<ul class='dropdown-menu dropdown-azure'>"
//                      +"<li><a href='orderfee.html?Id=" + cellData + "'>财务状况</a></li>"
//                      +"</ul></div>"                        

//                      return (_thisHtml);

//                  })
        // 	}
        // }, 		
    ]

    var tableOrder = $("#orderpanel_list").dataTable({
        //"iDisplayLength":10,
        "sAjaxSource": ajaxUrlBl,
        //		'bPaginate': true,
        //		"bDestory": true,
        //		"bRetrieve": true,
        //		"bFilter": false,
        "bLengthChange": false,
        "aaSorting": [[3, 'desc']],
        "aoColumnDefs": [//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            { "bSortable": false, "aTargets": [1, 2, 4, 5] }
        ],
        //		"bSort": true,
        //		"aaSorting": [[ 9, "desc" ]],
        //		"bProcessing": true,
        "aoColumns": columnsBl,
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
    setTimeout(function () {
        var _dataTable = $('#orderpanel_list').DataTable();
        var info = _dataTable.page.info();
        var dataRows = info.recordsTotal;
        $("#orderSum").text(dataRows);
    }, 2000);
    return tableOrder;
}

function initRelateComListTable() { 
    var ajaxUrlBl,tableTitleRelatedCom,columnsBl
    	ajaxUrlBl=dataUrl+'ajax/crmcompany.ashx?action=read&upId='+userCompanyId;
    	//tableTitleRelatedCom='<th>公司名称</th><th>联系人</th><th>联系电话</th><th>邮箱</th><th>添加时间</th>'
    	//$('#tableTitleRelatedCom').html(tableTitleRelatedCom)
    	columnsBl = [
    		{
    			"mDataProp": "comp_name"
    		},
    		{
    			"mDataProp": "comp_contactName"
    		},
    		{
    			"mDataProp": "comp_contactPhone"
    		},
    		{
    			"mDataProp": "comp_contactEmail"
    		},    		
    		{
    			"mDataProp": "comp_updateTime",
    			"createdCell": function(td, cellData, rowData, row, col) {
    				if(rowData.comp_updateTime != null) {
    					$(td).html(rowData.comp_updateTime.substring(0, 10));
    				} else {
    					$(td).html("");
    				}
    			}
    		},
            {
                "mDataProp": "comp_id",
                "createdCell": function (td, cellData, rowData, row, col) {
                    $(td).html("");
                }
            },
    	]
    
	var tableBl = $("#relatedComPanel_list").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": ajaxUrlBl,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
        "aaSorting": [[4, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,2,3,4]}
        ],
	    "bSort": false,
//		"aaSorting": [[ 9, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columnsBl,
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
	return tableBl;
}

/*新增供应商*/
$('#sendRelatedCom').on('click', function () {
    var companyName = $('#companyNameRelated').val()
    var contact = $('#contactRelated').val()
    var phone = $('#phoneRelated').val()
    var email = $('#emailRelated').val()
    if (!email) {
        comModel("请输入公司名称")
    } else if (!contact) {
        comModel("请输入联系人")
    } else if (!phone) {
        comModel("请输入联系电话")
    } else if (!email) {
        comModel("请输入邮箱")
    } else {
        common.ajax_req('POST', true, dataUrl, 'crmcompany.ashx?action=new', {
            'companyId': companyID,
            'userId': userID,
            'adminId': userID,
            'name': companyName,
            'isSupplier': 1,
            'type': 'FACTORY',
            'contactName': contact,
            'contactPhone': phone,
            'contactEmail': email,
            'upId': userCompanyId
        }, function (data) {
            if (data.State == 1) {
                comModel("新增成功")
                $("#companyNameRelated").val("")
                $("#contactRelated").val("")
                $("#phoneRelated").val("")
                $("#emailRelated").val("")
                relatedComTable.fnReloadAjax(relatedComTable.fnSettings())

            } else {
                comModel("新增失败：" + data.Data)
            }
        }, function (error) {
            //console.log(parm)
        }, 1000)
    }
    $("#addNewSuppliers").find("input").each(function () { ///当添加了新的供应商后，清空input, by daniel 20190730
        $(this).val("")
    })

});


function GetFiles() {
    var table = $("#crmFile").dataTable({
        //"iDisplayLength":10,
        "sAjaxSource": dataUrl + 'ajax/crmcompanyfile.ashx?action=read&&actionId=' + companyID + '&companyId=' + userCompanyId,
        'bPaginate': false,
        "bInfo": false,
        //		"bDestory": true,
        //		"bRetrieve": true,
        "bFilter": false,
        "bSort": false,
        "aaSorting": [[0, "desc"]],
        //		"bProcessing": true,
        "aoColumns": [
            { "mDataProp": "cofi_name" },
            {
                "mDataProp": "cofi_updateTime",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(oData.cofi_updateTime.substring(0, 10));
                }
            },
            { "mDataProp": "usin_name" },
            {
                "mDataProp": "cofi_id",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='javascript:void(0);' onclick='_deleteFileFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                     .append("<a href='" + dataUrl + oData.cofi_navUrl + oData.cofi_fileUrl + "' target='_blank'>查看</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                    //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                    //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                    //    .append("<a href='#'>发票</a>")

                }
            },
        ]
    });
    return table;
}


/*新增文件*/
$('#send_file').on('click', function () {
    if ($('#filename').val() == "") {
        comModel("请填写文件名称！")
    } else if ($("#Pname5").val() == "") {
        comModel("请选择上传的文件！")
    } else {
        var parm = {
            'companyId': userCompanyId,
            'actionId': companyID,
            'userId': userID,
            'name': $('#filename5').val(),
            'navUrl': $('#Nav5').val(),
            "fileUrl": $("#Pname5").val()
        }
        console.log(parm)
        common.ajax_req('POST', false, dataUrl, 'crmcompanyfile.ashx?action=new', parm, function (data) {
            if (data.State == 1) {
                comModel("新增成功")
                $('#filename5').val("")
                $('#Nav5').val(""),
                $("#Pname5").val("")
                filesTable.fnReloadAjax(filesTable.fnSettings());
            } else {
                comModel("新增失败")
            }
        }, function (error) {
        }, 2000)
    }
});

// 选择图片  
$("#img5").on("change", function () {
    var img = event.target.files[0];
    // 判断是否图片  
    if (!img) {
        return;
    }

    // 判断图片格式  
    if (!(img.type.indexOf('image') == 0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name))) {
        alert('图片只能是jpg,gif,png');
        return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(img);

    reader.onload = function (e) { // reader onload start  
        // ajax 上传图片  
        $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, companyId: companyID }, function (ret) {
            if (ret.State == '100') {
                //alert(ret.Picurl);
                $('#showimg5').attr('src', ret.Picurl);
                $('#Nav5').val(ret.Nav);
                $('#Pname5').val(ret.Pname);
                //$('#showimg').html('<img src="' + ret.Data + '">');
            } else {
                alert('上传失败');
            }
        }, 'json');
    } // reader onload end  
})

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFileFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/crmcompanyfile.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        filesTable.fnReloadAjax(filesTable.fnSettings());
                    } else {
                        alert("Delete Failed！");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
}

//获取订单的数量，暂时还获取不了。 by daniel 20191028
//function getOrderSum(){
//	common.ajax_req('GET', true, dataUrl, 'booking.ashx?action=read', {'companyId':companyID,'crmId':userCompanyId}, function(data) {
//		var _data = data.data;
//		//console.log(userCompanyId);
//		$("#orderSum").text(_data.length);
//	}, function(error) {
//		console.log(parm)
//	}, 1000)
//}

//账期管理
function GetPeriod() {
    var table1 = $("#Period").dataTable({
        //"iDisplayLength":10,
        "sAjaxSource": dataUrl + 'ajax/crmcompanyperiod.ashx?action=read&actionId=' + companyID + '&companyId=' + userCompanyId,
        //		'bPaginate': true,
        //		"bDestory": true,
        //		"bRetrieve": true,
        //		"bFilter": false,
        "bSort": false,
        "bAutoWidth": false,
        "aaSorting": [[0, "desc"]],
        //		"bProcessing": true,
        "aoColumns": [
			{ "mDataProp": "acpe_type" },
			{ "mDataProp": "acpe_dateNum" },
			{
			    "mDataProp": "acpe_money",
			    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			        $(nTd).html(oData.acpe_money + oData.acpe_currency)
			    }
			},
			{ "mDataProp": "acpe_way" },
			{
			    "mDataProp": "acpe_updateTime",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        $(td).html(rowData.acpe_updateTime.substring(0, 10));
			    }
			},
            			{
            			    "mDataProp": "acpe_state",
            			    "createdCell": function (td, cellData, rowData, row, col) {
            			        if (rowData.acpe_state == 1) {
            			            $(td).html("待审核");
            			        } else if (rowData.acpe_state == 2) {
            			            $(td).html("审核通过");
            			        } else if (rowData.acpe_state == 3) {
            			            $(td).html("审核不通过");
            			        }
            			        
            			    }
            			},
			{
			    "mDataProp": "acpe_id",
			    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			        var perEdit = perDel = ""
			        //if (isPermission('1611') == 1) {
			            
			        //}
			        //if (isPermission('1612') == 1) {
			            
			        //}
			        if (oData.acpe_state == 1) {
			            perEdit = "<a href='javascript:void(0);' " + "onclick='_editPeriodFun(\"" + oData.acpe_id + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
			            perDel = "<a href='javascript:void(0);' onclick='_deletePeriodFun(" + sData + ")'>" + get_lan('delete') + "</a>"
			            $(nTd).html(perEdit)
                            .append(perDel)
			        } else {
			            $(nTd).html("")
			        }


			    }
			},
        ],
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
    return table1;
}

common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
    'typeId': 13,
    'companyId': companyID
}, function (data) {
    var _data = data.data;
    for (var i = 0; i < _data.length; i++) {
        var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
        $('#acpe_currency').append(_html)
    }
}, function (error) {
    console.log(parm)
}, 1000)

var periodId, acpe_type, acpe_dateNum, acpe_way, acpe_currency, acpe_money
$('#send7').on('click', function () {
    acpe_type = $("#acpe_type").val(),
	acpe_dateNum = $("#acpe_dateNum").val(),
	acpe_way = $("#acpe_way").val(),
	acpe_currency = $("#acpe_currency").val(),
	acpe_money = $("#acpe_money").val();

    if (!acpe_dateNum) {
        comModel("请输入账期天数")
    } else if (!acpe_money) {
        comModel("请输入账期金额")
    } else {
        var parm = {
            'userId': userID,
            'actionId': companyID,
            'companyId': userCompanyId,
            'type': acpe_type,
            'way': acpe_way,
            'dateNum': acpe_dateNum,
            'currency': acpe_currency,
            'money': acpe_money
        }

        common.ajax_req('POST', true, dataUrl, 'crmcompanyperiod.ashx?action=new', parm, function (data) {
            if (data.State == 1) {
                comModel("新增账期成功")
                $("#acpe_dateNum").val("")
                $("#acpe_money").val("")
                periodTable.fnReloadAjax(periodTable.fnSettings())
                //location.href = 'crmcompanydetail.html?Id=' + Id;
            } else {
                comModel("新增账期失败")
            }
        }, function (error) {
            console.log(parm)
        }, 10000)
    }
});


/**
 * 编辑数据带出值
 */
function _editPeriodFun(fId) {
    periodId = fId;
    common.ajax_req("get", true, dataUrl, "crmcompanyperiod.ashx?action=readbyid", {
        "Id": fId
    }, function (data) {
        //console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $("#acpe_dateNum").val(_data.acpe_dateNum);
        $("#acpe_money").val(_data.acpe_money);
        $("#acpe_type").val(_data.acpe_type).trigger("change")
        $("#acpe_currency").val(_data.acpe_currency).trigger("change")
        $("#acpe_way").val(_data.acpe_way).trigger("change")


        $('#send77').show()
        $('#send7').hide()

    }, function (err) {
        console.log(err)
    }, 5000)
}

$('#send77').on('click', function () {
    acpe_type = $("#acpe_type").val(),
	acpe_dateNum = $("#acpe_dateNum").val(),
	acpe_way = $("#acpe_way").val(),
	acpe_currency = $("#acpe_currency").val(),
	acpe_money = $("#acpe_money").val();

    if (!acpe_dateNum) {
        comModel("请输入账期天数")
    } else if (!acpe_money) {
        comModel("请输入账期金额")
    } else {
        var parm = {
            'userId': userID,
            'Id': periodId,
            'type': acpe_type,
            'way': acpe_way,
            'dateNum': acpe_dateNum,
            'currency': acpe_currency,
            'money': acpe_money
        }

        common.ajax_req('POST', true, dataUrl, 'crmcompanyperiod.ashx?action=modify', parm, function (data) {
            if (data.State == 1) {
                comModel("修改账期成功")
                $("#acpe_dateNum").val("")
                $("#acpe_money").val("")
                periodTable.fnReloadAjax(periodTable.fnSettings())
                //location.href = 'crmcompanydetail.html?Id=' + Id;
            } else {
                comModel("修改账期失败")
            }
        }, function (error) {
            console.log(parm)
        }, 10000)
    }
});

/**
 * 删除
 * @param id
 * @private
 */
function _deletePeriodFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/crmcompanyperiod.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State) {
                        comModel("删除成功")
                        periodTable.fnReloadAjax(periodTable.fnSettings())
                    } else {
                        alert("Delete Failed！");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

}