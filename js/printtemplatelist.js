//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2": "货物管理中心",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "SHIPMENTS MANAGEMENT",
        };

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
    this.title = get_lan('nav_3_6')
	$('.navli3').addClass("active open")
	$('.book6').addClass("active")
	$('#title1').text(get_lan('nav_3_6'))
	$('#title2').text(get_lan('nav_3_6'))

	oTable = initTable();

    //新建
	$('#printFun').click(function () {
	    location.href = 'printtemplateadd.html?action=add'
	});
	$('#btnPrintSave').click(function () {
	    

	});
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/printtemplate.ashx?action=read&companyId='+companyID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 3, "desc" ]],
		"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            {"bSortable": false, "aTargets": [0,1,2,5]}
        ],
//		"bProcessing": true,
		"aoColumns": [
			{ "mDataProp": "prtp_name" },
			{
			    "mDataProp": "prtp_typeId",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        var value
			        if (rowData.prtp_typeId == 1) { value = 'MBL打印' }
			        else if (rowData.prtp_typeId == 2) { value = '集装箱打印' }
			        else if (rowData.prtp_typeId == 3) { value = 'HBL打印' }
			        else if (rowData.prtp_typeId == 4) { value = '联系单打印' }
			        $(td).html(value);
			    }
			},
			{ "mDataProp": "prtp_usedCount" },
			{
			    "mDataProp": "prtp_id",
				"createdCell": function (td, cellData, rowData, row, col) {
				    $(td).html(rowData.prtp_created_at.substring(0, 10));
				}			
			},
            {
            	"mDataProp": "prtp_id",
            	"createdCell": function (td, cellData, rowData, row, col) {
            	    $(td).html(rowData.prtp_updated_at.substring(0, 10));
            	}
            },
            //{ "mDataProp": "prtp_state" },
			{
			    "mDataProp": "prtp_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					// $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
					// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
				    $(td).html("<div class='btn-group' style='z-index:auto; width:70px;'><a class='btn btn-blue btn-sm' href='printtemplateadd.html?action=modify&Id=" + cellData + "'> " + get_lan('edit') + "</a>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
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
		},
		"drawCallback": function(){
			$('[data-toggle="popover"]').popover();
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
			    url: dataUrl + 'ajax/printtemplate.ashx?action=cancel',
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