﻿//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "平台用户管理",   
            "admin" : "账号管理"
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "User List", 
            "admin" : "account"        
        };

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
	this.title = get_lan('nav_00_1')
	$('.navli00').addClass("active open")
	$('.account1').addClass("active")	
	$('#title1').text(get_lan('nav_00_1'))
	$('#title2').text(get_lan('nav_00_1'))

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
  
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/usercompany.ashx?action=read',
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 0, "desc" ]],
//		"bProcessing": true,
		"aoColumns": [
			{ "mDataProp": "state_name_cn"},
			{ "mDataProp": "comp_code"},
			{ "mDataProp": "comp_name"},
			{ "mDataProp": "comp_head"},			
			{ "mDataProp": "comp_tel" },
			{ "mDataProp": "comp_phone" },
			{ "mDataProp": "comp_email" },
			{ "mDataProp": "usin_name" },		
			{
				"mDataProp": "comp_updateTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html(rowData.comp_updateTime.substring(0, 10));
				}			
			},				
			{
				"mDataProp": "comp_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html("<a href='usercompanyadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>")
						//.append("<a href='crmcompanyadd.html?action=modify&Id="+sData +"'>" + get_lan('follow') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						.append("<a href='usercompanyadd.html?action=pw&uId="+rowData.comp_adminId +"'>" + get_lan('admin') + "</a>");
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
    
	return table;
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/usercompany.ashx?action=cancel',
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