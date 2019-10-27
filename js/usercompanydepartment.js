//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "系统设置管理",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "System Management",       
        };

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
	this.title = get_lan('nav_0_2')
	$('.navli0').addClass("active open")
	$('.sys2').addClass("active")	
	$('#title1').text(get_lan('nav_0_2'))
	$('#title2').text(get_lan('nav_0_2'))

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
  
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/usercompanydepartment.ashx?action=read&companyId='+companyID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
//		"bSort": true,
		//"aaSorting": [[ 6, "desc" ]],
        "aaSorting": [[6, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,2,3,7]}
        ],
//		"bProcessing": true,
		"aoColumns": [
			{ "mDataProp": "code_code"},
			{ "mDataProp": "code_name"},
			{ "mDataProp": "code_head"},			
			{ "mDataProp": "code_number" },
			{
				"mDataProp": "code_createTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.code_createTime!=null){
						$(td).html(rowData.code_createTime.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},	
			{
				"mDataProp": "code_cancelTime",
				"createdCell": function (td, cellData, rowData, row, col) {					
					if(rowData.code_cancelTime!=null){
						$(td).html(rowData.code_cancelTime.substring(0, 10));
					}else{
						$(td).html("NULL");
					}						
				}			
			},		
			{
				"mDataProp": "code_updateTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html(rowData.code_updateTime.substring(0, 10));
				}			
			},				
			{
				"mDataProp": "code_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					// $(td).html("<a href='usercompanydepartmentadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
					// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")
						//.append("<a href='crmcompanyadd.html?action=modify&Id="+sData +"'>" + get_lan('follow') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
//						.append("<a href='usercompanyadd.html?action=pw&uId="+rowData.comp_adminId +"'>" + get_lan('admin') + "</a>");
                    $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel

                        var _thisHtml="<div class='btn-group'><a class='btn btn-blue btn-sm' href='usercompanydepartmentadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>"
                        +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                        +"<ul class='dropdown-menu dropdown-azure'>"
                        +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
                        +"</ul></div>"                        
                        return (_thisHtml);
					})
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
 				url: dataUrl + 'ajax/usercompanydepartment.ashx?action=cancel',
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