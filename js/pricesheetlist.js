//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "运价管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "Rates MANAGEMENT",
        };

var oTable;
var typeId;
$(document).ready(function() {
    hasPermission('1301'); //权限控制：查看费用清单
//	initModal();
	this.title = get_lan('nav_4_5')
	$('.navli4').addClass("active open")
	$('.rate5').addClass("active")
	$('#title1').text(get_lan('nav_4_5'))
	$('#title2').text(get_lan('nav_4_5'))

	$('#newPricesheet').on('click', function() {
		location.href = 'pricesheetadd.html?action=add';
	})
	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/pricesheet.ashx?action=read&companyId=' + companyID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 4, "desc" ]],
		"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            {"bSortable": false, "aTargets": [0,3,5]}
        ],
//		"bProcessing": true,
		"aoColumns": [
            { "mDataProp": "prsh_code" },
			{ "mDataProp": "comp_name" },
			{ "mDataProp": "prsh_port1" },
			{ "mDataProp": "prsh_port2" },
			{ "mDataProp": "prsh_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					var p20gp="", p40gp="", p40hq="", pCbm="", pKgs="", pCtns="";
					(rowData.prsh_20GP.split("*")[0])?(p20gp='<span class="badge badge-primary badge-square">'+rowData.prsh_20GP+"</span> "):(p20gp="");
					(rowData.prsh_40GP.split("*")[0])?(p40gp='<span class="badge badge-primary badge-square">'+rowData.prsh_40GP+"</span> "):(p40gp="");
					(rowData.prsh_40HQ.split("*")[0])?(p40hq='<span class="badge badge-primary badge-square">'+rowData.prsh_40HQ+"</span> "):(p40hq="");
					(rowData.prsh_CBM=="")?(pCbm=""):(pCbm='<span class="badge badge-primary badge-square">'+rowData.prsh_CBM+" CBM</span> ");
					(rowData.prsh_KGS=="")?(pKgs=""):(pKgs='<span class="badge badge-primary badge-square">'+rowData.prsh_KGS+" KGS</span> ");
					(rowData.prsh_CTNS=="")?(pCtns=""):(pCtns='<span class="badge badge-primary badge-square">'+rowData.prsh_CTNS+" CTNS</span> ");
					$(td).html(p20gp+p40gp+p40hq+pCbm+pKgs+pCtns);
				}
			},
			// { "mDataProp": "prsh_20GP" },
			// { "mDataProp": "prsh_40GP" },
			// { "mDataProp": "prsh_40HQ" },
   //          { "mDataProp": "prsh_CBM" },
			// { "mDataProp": "prsh_KGS" },
			// { "mDataProp": "prsh_CTNS" },		
			{ "mDataProp": "prsh_time",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.prsh_time!=null){
						$(td).html(rowData.prsh_time.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}
			},		
			{
			    "mDataProp": "prsh_id",
				"createdCell": function (td, cellData, rowData, row, col) {
				 //    $(td).html("<a href='pricesheetdetail.html?Id="+cellData +"' target='_blank'>预览</a>&nbsp;&nbsp;&nbsp;&nbsp;")
					// 	.append("<a href='pricesheetadd.html?action=modify&Id=" + cellData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
				    // .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
				    var _perDel = "";
				    if (isPermission('1304') == 1) {
				        _perDel = "<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
				    }
	    			$(td).html("<div class='btn-group'><a class='btn btn-blue btn-sm' href='pricesheetdetail.html?Id="+cellData +"' target='_blank'> " + get_lan('review') + "</a>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    + "<li><a href='pricesheetadd.html?action=modify&Id=" + cellData + "'> " + get_lan('edit') + "</a></li>"
	                    + _perDel
	                    +"</ul></div>");
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
			    url: dataUrl + 'ajax/pricesheet.ashx?action=cancel',
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