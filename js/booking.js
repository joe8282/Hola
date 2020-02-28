//语言包
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
var sellId,luruId,kefuId,caozuoId;

if(GetQueryString('fromId')!=null){
	fromId=GetQueryString('fromId')
	$('.book1').addClass("active")	
}else{
	$('.book3').addClass("active")	
}

var oTable;
$(document).ready(function() {
	this.title = get_lan('con_top_4') 
	$('.navli3').addClass("active open")	
	$('#title1').text(get_lan('con_top_4'))
	$('#title2').text(get_lan('con_top_4')) 

	oTable = initTable(fromId);
	//$('#example').colResizable();

});

	//销售人员
	common.ajax_req('GET', true, dataUrl, 'userinfo.ashx?action=read', {
		'role': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		if(_data!=null){
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
				$('#sellId').append(_html)
				console.log(_data[i].usin_id+"+"+_data[i].usin_name)
			}
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	//录入人员
	common.ajax_req('GET', true, dataUrl, 'userinfo.ashx?action=read', {
		'role': 11,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		if(_data!=null){
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
				$('#luruId').append(_html)
			}
		}
	}, function(error) {
		console.log(parm)
	}, 1000)	
	//客服人员
	common.ajax_req('GET', true, dataUrl, 'userinfo.ashx?action=read', {
		'role': 7,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		if(_data!=null){
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
				$('#kefuId').append(_html)
			}
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	//操作人员
	common.ajax_req('GET', true, dataUrl, 'userinfo.ashx?action=read', {
		'role': 8,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		if(_data!=null){
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
				$('#caozuoId').append(_html)
			}
		}
	}, function(error) {
		console.log(parm)
	}, 1000)	
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
			{ "mDataProp": "book_code",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html("<a href='bookingpreview.html?code=" + rowData.book_code + "' target='_blank'>" + rowData.book_code + "</a>")
				}		
			},
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
					var stateText = '';
					var pol=rowData.book_port1;
					var pod=rowData.book_port2;
					if(rowData.book_state == 1) {
						$(td).parent().find("td").css("background-color","#fdfdbf");
						$(td).html("<div class='btn-group' style='z-index:auto;'><a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_sureFun(" + cellData + ","+rowData.book_userId+",\""+pol+"\",\""+pod+"\")'>" + get_lan('con_top_5') + "</a>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
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
						$(td).html("<div class='btn-group' style='z-index:auto;'><a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li></li>"
	                    //+"<li><a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a></li>"
	                    //+"<li class='divider'></li>"
	                    //+"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
						// $(td).html("<a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a><br/>")
						// 	.append("<a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
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
    				$(td).html("NULL"); //这里是财务状况，还没有任何的数添加到这里来，到时候这里估计要体现从其他函数过来的数。
    			}    			
    		},    		
    		{
    			"mDataProp": "orderstate_name_cn"
    		},
			{
				"mDataProp": "book_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html("<div class='btn-group' style='z-index:auto;'><a class='btn btn-blue btn-sm' href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>"
	    			+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                    +"<ul class='dropdown-menu dropdown-azure'>"
                    +"<li><a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a></li>"
                    +"</ul></div>")
					if(rowData.book_orderState == 12) {
						$(td).parent().find("td").css("background-color","#fdfdbf");
					} 
					// $(td).html("<a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")	
					// .append("<a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a>")						
				}
			},    		
    	],
        aaaSorting=[[5, 'desc']],
        aaaColumDefs=[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [4,7,8,9]}
        ]
    }
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
//		"stateSave": true,
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
		initComplete: function(settings) {
        	$('#example').colResizable({headerOnly:true,liveDrag:true, fixed:true, postbackSafe:true, resizeMode:flex});
    	},
		"aoColumns": columns,
		// createdRow: function ( row, data, index ) { //针对修改行的一些样式。
  //           //if ( index %2 == 0 ) {
  //               $('td', row).css("background-color","yellow");
  //           //}
  //       },
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
 function _sureFun(id,crmId,pol,pod) {
 	$("#myModal2").modal("show");
 	$('#bookId').val(id)
 	$('#orderHblLi').empty();
 
 	//获取委托人列表
 	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
 		"companyId": companyID
 	}, function(data) {
 		//console.log(data)
 		$('#orderHblLi').empty();
 		var _data = data.data;
 		$('#crmuser').empty();
 		if(_data != null) {
 			for(var i = 0; i < _data.length; i++) {
 				var _html = '<option value="' + _data[i].comp_id + '" data-crmId="'+_data[i].comp_customerId+'">' + _data[i].comp_name + '</option>';
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
 		// "crmId": $("#crmuser").val()
 		"crmId": $("#crmuser").find("option:selected").attr("data-crmId")
 	}, function(data) {
 		//console.log(data)
 		$('#orderLi').empty();
 		$('#orderHblLi').empty();
 		var _data = data.data;
 		if(_data != null) {
			var _html2 = '<option value="0" data-pol="" data-pod="">New Shipments</option>';
			$('#orderLi').append(_html2)
 			for(var i = 0; i < _data.length; i++) {
 				var _html = '<option value="' + _data[i].book_id + '" data-pol="'+_data[i].book_port1+'" data-pod="'+_data[i].book_port2+'">' + _data[i].book_orderCode +' ['+ _data[i].book_port1 +' — '+_data[i].book_port2+']</option>';
 				$('#orderLi').append(_html)
 				if(_data[i].book_port1==pol && _data[i].book_port2==pod){
 					$("#orderLi").find("option[value='"+_data[i].book_id+"']").attr("selected",true);
 				}else{
 					$("#orderLi").find("option[value='0']").attr("selected",true);
 				}
 			}
 		}else{
			var _html = '<option value="0" data-pol="" data-pod="">New Shipments</option>';
			$('#orderLi').append(_html)
 		}
 	}, function(err) {
 		console.log(err)
 	}, 2000)
 	
 	$("#crmuser").change(function() {
 		$('#orderLi').empty();
 		$('#orderHblLi').empty();
 		//获取委托人订单
 		common.ajax_req("get", false, dataUrl, "booking.ashx?action=read", {
 			"companyId": companyID,
 			// "crmId": $("#crmuser").val()
 			"crmId": $("#crmuser").find("option:selected").attr("data-crmId")
 		}, function(data) {
 			//console.log(data)
 			var _data = data.data;
 			if(_data != null) {
				var _html2 = '<option value="0" data-pol="" data-pod="">New Shipments</option>';
				$('#orderLi').append(_html2)
 				for(var i = 0; i < _data.length; i++) {
 					var _html = '<option value="' + _data[i].book_id + '">' + _data[i].book_orderCode + ' ['+ _data[i].book_port1 +' — '+_data[i].book_port2+']</option>';
 					$('#orderLi').append(_html)
	 				if(_data[i].book_port1==pol && _data[i].book_port2==pod){
	 					$("#orderLi").find("option[value='"+_data[i].book_id+"']").attr("selected",true);
	 				}else{
	 					$("#orderLi").find("option[value='0']").attr("selected",true);
	 				}
 				}
 			}else{	 				
				var _html = '<option value="0" data-pol="" data-pod="">New Shipments</option>';
				$('#orderLi').append(_html)
 			}
 		}, function(err) {
 			console.log(err)
 		}, 2000)
	})
 	$("#orderLi").change(function() {
		var orderLiId=$("#orderLi").val();
 		common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbill", {
    			"bookingId": orderLiId
 		}, function(data) {
 			$('#orderHblLi').empty();
 			var _data = data.Data;
 			console.log(_data);
 			if(data.State == 1) {
				var _html3 = '<option value="0">New HBL</option>';
				$('#orderHblLi').append(_html3)
 				for(var i = 0; i < _data.length; i++) {
 					var _html = '<option value="' + _data[i].bobi_id + '">' + _data[i].bobi_billCode + '</option>';
 					$('#orderHblLi').append(_html);
	 				$("#orderHblLi").find("option[value='0']").attr("selected",true);
 				}
 				console.log("ddd")
 			}else{
				$('#orderHblLi').append('<option value="0">New HBL</option>')
 			}
 		}, function(err) {
 			console.log(err)
 		}, 2000)
	})
	
 }
 $('#btnSave2').on('click', function() {
 	var isNew=0;
 	//if($("#ordermore").is(":checked")) {
 	if($("#ismbl").is(":checked")) {
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