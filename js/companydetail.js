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
        
var oTable, oblTable, oDemand, relatedComTable;
var typeId;
var Id = GetQueryString('Id');
var userCompanyId;

$(document).ready(function() {
//	initModal();
	
    this.title = get_lan('nav_0_1')
	$('.navli90').addClass("active open")
	$('.free1').addClass("active")	
	$('#title1').text(get_lan('nav_0'))
	$('#title2').text(get_lan('nav_0_1'))
	$('#mySmallModalLabel').text(get_lan('nav_2_1'))
	
	$('#send5').hide()
	
	GetDetail();	
	$('#send1').on('click', function() {
		location.href = 'crmcompanyadd.html?action=modify&Id='+Id;
	})
		

	$('#send0').on('click', function () {
	    location.href = 'usercompanyadd.html?action=edit&Id=' + Id;
	})
	$('#send3').on('click', function() {
	    location.href = 'crmcompanycontactadd.html?action=add&back=' + Id + '&userCompanyId=' + Id;
	})
	
	//oBill=GetBill();	
	$('#send00').hide()
	$('#send77').hide()
	
});
function GetDetail() 
{
    common.ajax_req("get", true, dataUrl, "usercompany.ashx?action=readbyid", {
		"Id": Id
	}, function(data) {
		//初始化信息;
		var _data = data.Data;
	    //userCompanyId = _data.comp_customerId;
		oTable2 = GetContact2();
		oDemand = GetDemand();
		periodTable = GetPeriod();

		relatedComTable=initRelateComListTable();
		$('.companyName').text(_data.comp_name)
		$('.companyContent').text(_data.comp_content)
			$('.companyTel').text(_data.comp_tel)
			$('.companyFax').text(_data.comp_fax)
			$('.companyEmail').text(_data.comp_email)
			
		//$('.adRemark1').html(HtmlDecode(_data.prin_beizhu))	
			oBill = GetBill(); //这里获取提单的信息，要不然会出现userCompanyId获取不到
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

function GetContact2() {
		$(".companyPersons").empty();
	common.ajax_req("get", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
		"companyId": Id
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
				}else{
					_htmlFirst='<a href="javascript:void(0);" onclick="_primaryFun(' + _data[i].coco_id + ')"><i class="glyphicon glyphicon-thumbs-up green" style="float:right; margin-right:10px;"></i></a>';
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
			"companyId": Id
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


//需求管理
function GetDemand() {
	var table1 = $("#Demand").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/crmcompanydemand.ashx?action=read&companyId='+Id,
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
				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
					$(nTd).html("<a href='javascript:void(0);' " +
								"onclick='_editDemandFun(\"" + oData.dema_id + "\")'>"+get_lan('edit')+"</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						.append("<a href='javascript:void(0);' onclick='_deleteDemandFun(" + sData + ")'>" + get_lan('delete') + "</a>")

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
			'companyId': Id,
			'actionId': Id,
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
		"sAjaxSource": dataUrl+'ajax/crmcompanybill.ashx?action=read&companyId='+Id,
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
				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
					$(nTd).html("<a href='javascript:void(0);' " +
								"onclick='_editBillFun(\"" + oData.cobi_id + "\")'>"+get_lan('edit')+"</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						.append("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>")

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
			'actionId': Id,
			'companyId': Id,
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



function initRelateComListTable() { 
    var ajaxUrlBl,tableTitleRelatedCom,columnsBl
    	ajaxUrlBl=dataUrl+'ajax/crmcompany.ashx?action=read&upId='+Id;
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
            'upId': Id
        }, function (data) {
            if (data.State == 1) {
                comModel("新增成功")
                $("#companyNameRelated").val("")
                $("#contactRelated").val("")
                $("#phoneRelated").val("")
                $("#emailRelated").val("")
                relatedComTable.fnReloadAjax(relatedComTable.fnSettings())

            } else {
                comModel("新增失败")
            }
        }, function (error) {
            //console.log(parm)
        }, 1000)
    }
    $("#addNewSuppliers").find("input").each(function () { ///当添加了新的供应商后，清空input, by daniel 20190730
        $(this).val("")
    })

});

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
        "sAjaxSource": dataUrl + 'ajax/crmcompanyperiod.ashx?action=read&companyId='+Id,
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
            'companyId': Id,
            'actionId': Id,
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