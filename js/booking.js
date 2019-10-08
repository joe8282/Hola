﻿//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "订舱列表", 
            "con_top_4" : "订单列表", 
            "con_top_5" : "确认订舱", 
            "con_top_6" : "费用管理", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENT",   
            "con_top_3" : "Booking List",    
            "con_top_4" : "Order List",  
            "con_top_6" : "FEE MANAGEMENT", 
        };

var fromId = '0';
if(GetQueryString('fromId')!=null){
	fromId=GetQueryString('fromId')
	$('.book1').addClass("active")	
}
else{
	$('.book3').addClass("active")	
}

var oTable;
$(document).ready(function() {
	this.title = get_lan('con_top_4') 
	$('.navli3').addClass("active open")	
	$('#title1').text(get_lan('con_top_4'))
	$('#title2').text(get_lan('con_top_4')) 

	oTable = initTable(fromId);
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable(fromId) {
    var ajaxUrl,tableTitle,columns    
    if(fromId=='1'){
    	ajaxUrl=dataUrl+'ajax/booking.ashx?action=read&crmId='+companyID+'&fromId='+fromId
    	tableTitle='<th>订舱委托号</th><th>客户名称</th><th>运输方式</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>货量</th><th>货好时间</th><th>订舱时间</th><th>状态</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
			{ "mDataProp": "book_code"},
//			{ "mDataProp": "type_name"},
			{ "mDataProp": "comp_name1"},
			{ "mDataProp": "book_movementType"},			
			{ "mDataProp": "book_port1",
	            "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
	                      return (full.book_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.book_port2)
	                    }
	        },
			//{ "mDataProp": "book_port2" },
			{ 
				"mDataProp": "book_allContainer"
//				"mDataProp": "book_id",
//				"createdCell": function (td, cellData, rowData, row, col) {
//					var tohtml=''
//					if(rowData.book_20GP.substr(0, 1)!=' '){
//						tohtml=rowData.book_20GP;
//					}
//					if(rowData.book_40GP.substr(0, 1)!=' '){
//						tohtml=tohtml+'<br/>'+rowData.book_40GP;
//					}
//					if(rowData.book_40HQ.substr(0, 1)!=' '){
//						tohtml=tohtml+'<br/>'+rowData.book_40HQ;
//					}
//					$(td).html(tohtml);
//				}			    
			},
			{
				"mDataProp": "book_okTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.book_okTime!=null){
						$(td).html(rowData.book_okTime.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},	
			{
				"mDataProp": "book_time",
				"createdCell": function (td, cellData, rowData, row, col) {					
					if(rowData.book_time!=null){
						$(td).html(rowData.book_time.substring(0, 10));
					}else{
						$(td).html("NULL");
					}						
				}			
			},		
			{ "mDataProp": "state_name_cn" },				
			{
				"mDataProp": "book_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					var stateText = ''
					if(rowData.book_state == 1) {
						$(td).parent().css("background-color","yellow")
						$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='javascript:void(0);' onclick='_sureFun(" + cellData + ","+rowData.book_crmCompanyId+")'>" + get_lan('con_top_5') + "</a></li>"
	                    +"<li><a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a></li>"
	                    //+"<li><a href='bookingadd.html?action=modify&Id=" + cellData +"&crmId=" + rowData.book_crmCompanyId + "&fromId=1'> " + get_lan('edit') + "</a></li>"
	                    +"<li class='divider'></li>"
	                    //+"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
						// $(td).html("<a href='javascript:void(0);' onclick='_sureFun(" + cellData + ","+rowData.book_crmCompanyId+")'>" + get_lan('con_top_5') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a><br/>")
						// 	.append("<a href='bookingadd.html?action=modify&Id=" + cellData +"&crmId=" + rowData.book_crmCompanyId + "&fromId=1'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")
					} else if(rowData.book_state == 2) {
						$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a></li>"
	                    //+"<li><a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a></li>"
	                    //+"<li class='divider'></li>"
	                    //+"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
						// $(td).html("<a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a><br/>")
						// 	.append("<a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")
					} else{
						$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    //+"<li><a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a></li>"
	                    +"<li class='divider'></li>"
	                    //+"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
						// $(td).html("<a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")						
					}
				
				}
			},
		],
        aaaSorting=[[6, 'desc']],
        aaaColumDefs=[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [4,7,8]}
        ]
    }else{
    	ajaxUrl=dataUrl+'ajax/booking.ashx?action=read&companyId='+companyID
    	tableTitle='<th>订单号</th><th>客户名称</th><th>运输方式</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>货量</th><th>订舱时间</th><th>离港时间</th><th>财务状况</th><th>状态</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
    		{
    			"mDataProp": "book_orderCode"
    		},
    		{
    			"mDataProp": "comp_name2"
    		},
    		{
    			"mDataProp": "book_movementType"
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
    			"mDataProp": "book_id",
    			"createdCell": function(td, cellData, rowData, row, col) {
    				$(td).html("NULL");
    			}    			
    		},    		
    		{
    			"mDataProp": "orderstate_name_cn"
    		},
			{
				"mDataProp": "book_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
                    +"<ul class='dropdown-menu dropdown-azure'>"
                    +"<li><a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a></li>"
                    +"<li><a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a></li>"
                    +"</ul></div>")
					// $(td).html("<a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")	
					// .append("<a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a>")						
				}
			},    		
    	],
        aaaSorting=[[0, 'desc']],
        aaaColumDefs=[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [4,7,8,9]}
        ]
    }
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": ajaxUrl,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
        "aaSorting": aaaSorting,
        "aoColumnDefs": aaaColumDefs,
//		"bSort": true,
//		"aaSorting": [[ 9, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columns,
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

	
	
/**
 * 确认订舱
 */
 function _sureFun(id,crmId) {
 	$("#myModal2").modal("show");
 	$('#bookId').val(id)
 
 	//获取委托人列表
 	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
 		"companyId": companyID
 	}, function(data) {
 		//console.log(data)
 		var _data = data.data;
 		if(_data != null) {
 			for(var i = 0; i < _data.length; i++) {
 				var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
 				$('#crmuser').append(_html)
 			}
 		}
 	}, function(err) {
 		console.log(err)
 	}, 2000)
 	
 	$("#crmuser").val(crmId).trigger("change")
 	//获取委托人订单
 	common.ajax_req("get", false, dataUrl, "booking.ashx?action=read", {
 		"companyId": companyID,
 		"crmId": $("#crmuser").val()
 	}, function(data) {
 		//console.log(data)
 		var _data = data.data;
 		if(_data != null) {
 			for(var i = 0; i < _data.length; i++) {
 				var _html = '<option value="' + _data[i].book_id + '">' + _data[i].book_orderCode + '</option>';
 				$('#orderLi').append(_html)
 			}
 		}
 	}, function(err) {
 		console.log(err)
 	}, 2000)
 	
 	$("#crmuser").change(function() {
 		$('#orderLi').empty()
 		//获取委托人订单
 		common.ajax_req("get", false, dataUrl, "booking.ashx?action=read", {
 			"companyId": companyID,
 			"crmId": $("#crmuser").val()
 		}, function(data) {
 			//console.log(data)
 			var _data = data.data;
 			if(_data != null) {
 				for(var i = 0; i < _data.length; i++) {
 					var _html = '<option value="' + _data[i].book_id + '">' + _data[i].book_orderCode + '</option>';
 					$('#orderLi').append(_html)
 				}
 			}
 		}, function(err) {
 			console.log(err)
 		}, 2000)
	})
	
 }
 $('#btnSave2').on('click', function() {
 	var isNew=0;
 	if($("#ordermore").is(":checked")) {
 		isNew=1
 	} else {
 		isNew=0
 	}
 	var parm = {
 		'bookingId': $('#bookId').val(),
 		'isNew': isNew,
 		'companyId': companyID,
 		'userId': userID,
 		'userName': userName,
 		'crmCompanyId': $('#crmuser').val(),
 		'orderId': $('#orderLi').val()
 	}
 	console.log(parm)
 	common.ajax_req('POST', true, dataUrl, 'booking.ashx?action=changeorder', parm, function(data) {
 		if(data.State == 1) {
 			$("#myModal2").modal("hide");
 			comModel("确认订舱成功")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		} else {
 			$("#myModal2").modal("hide");
 			comModel("确认订舱失败")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		}
 	}, function(error) {
 		console.log(parm)
 	}, 1000)
 });
 
 
/**
 * 取消
 * @param id
 * @private
 */
 function _cancelFun(id) {
 	$("#myModal").modal("show");
 	$('#bookId').val(id)
 }
 $('#btnSave').on('click', function() {
 	var parm = {
 		'Id': $('#bookId').val(),
 		'state': 3,
 		'beizhu': $('#beizhu').val()
 	}
 	common.ajax_req('POST', true, dataUrl, 'booking.ashx?action=modify', parm, function(data) {
 		if(data.State == 1) {
 			$("#myModal").modal("hide");
 			comModel("取消成功")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		} else {
 			$("#myModal").modal("hide");
 			comModel("取消失败")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		}
 	}, function(error) {
 		console.log(parm)
 	}, 10000)
 });
 
/**
 * 删除
 * @param id
 * @private
 */
 function _deleteFun(id) {
 	bootbox.confirm("Are you sure?", function(result) {
 		if(result) {
 			$.ajax({
 				url: dataUrl + 'ajax/booking.ashx?action=cancel',
 				data: {
 					"Id": id
 				},
 				dataType: "json",
 				type: "post",
 				success: function(backdata) {
 					if(backdata.State == 1) {
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

/**
 * 初始化弹出层
 */
function initModal() {
	$('#myModal').on('show', function() {
		$(".page-body").addClass('modal-open');
		$('<div class="modal-backdrop fade in"></div>').appendTo($(".page-body"));
	});
	$('#myModal').on('hide', function() {
		$(".page-body").removeClass('modal-open');
		$('div.modal-backdrop').remove();
	});
}