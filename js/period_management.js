//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2": "财务管理中心",
            "follow" : "跟进",
            "addcontact" : "新增联系人",
            "addbooking" : "新增联系单",
            "sendemail" : "发送账号邮件",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "Financial MANAGEMENT",
            "follow" : "Follow Up",
            "addbooking" : "Booking",  
            "sendemail" : "Send Account Email",
        };

var oTable;
var typeId;

$(document).ready(function() {
    //	initModal();

    //hasPermission('1601'); //权限控制
    this.title = get_lan('nav_5_14')
    $('.navli5').addClass("active open")
    $('.financial14').addClass("active")
    $('#title1').text(get_lan('nav_5_14'))
    $('#title2').text(get_lan('nav_5_14'))

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {  
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/crmcompanyperiod.ashx?action=read&actionId=' + companyID,
		'bPaginate': true,
	    "bInfo": false,
	    //		"bDestory": true,
	    //		"bRetrieve": true,
	    "bFilter": false,
	    "bSort": false,
		//"aaSorting": [[ 6, "desc" ]],
		//"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
        //    {"bSortable": false, "aTargets": [0,3,4,5,7]}
        //],
//		"bProcessing": true,
	    "aoColumns": [
            { "mDataProp": "comp_name" },
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
            			            $(td).html('待审核');
            			        } else if (rowData.acpe_state == 2) {
            			            $(td).html("<b>已通过</b><br/>审核人：" + rowData.usin_name + "<br/>审核时间：" + rowData.acpe_opetionTime.substring(0, 10) + "<br/>备注：" + rowData.acpe_opetionBeizhu);
            			        } else if (rowData.acpe_state == 3) {
            			            $(td).html("<b>未通过</b><br/>审核人：" + rowData.usin_name + "<br/>审核时间：" + rowData.acpe_opetionTime.substring(0, 10) + "<br/>备注：" + rowData.acpe_opetionBeizhu);
            			        }
            			    }
            			},
			{
			    "mDataProp": "acpe_id",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        if (rowData.acpe_state == 1) {
			            $(td).html("<a href='javascript:void(0);' onclick='_detailBillGetFun(" + cellData + ")'>审核处理</a><br/>")
			        } else {
			            $(td).html("")
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
		},
		"drawCallback": function(){
			$('[data-toggle="tooltip"]').tooltip();
		}
	});
	
    // Apply the search
    table.api().columns().eq(0).each(function(colIdx) {
        $('input', table.api().column(colIdx).footer()).on('keyup change', function () {
            table.api()
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });
    
	return table;
}

var cancelId;
function _detailBillGetFun(Id) {
    $("#myModal4").modal("show");
    $("#opetionBeizhu").val('')
    cancelId = Id
}

$('#passState').on('click', function () {
    var jsonData = {
        'Id': cancelId,
        'state': 2,
        'opetionUser': userID,
        'opetionBeizhu': $("#opetionBeizhu").val()
    };
    $.ajax({
        url: dataUrl + 'ajax/crmcompanyperiod.ashx?action=modify',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                comModel("提交成功！")
                $("#myModal4").modal("hide");
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                comModel("提交失败！")
                //location.href = 'emailpp_group.html';
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

})


$('#nopassState').on('click', function () {
    var jsonData = {
        'Id': cancelId,
        'state': 3,
        'opetionUser': userID,
        'opetionBeizhu': $("#opetionBeizhu").val()
    };
    $.ajax({
        url: dataUrl + 'ajax/crmcompanyperiod.ashx?action=modify',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                comModel("提交成功！")
                $("#myModal4").modal("hide");
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                comModel("提交失败！")
                //location.href = 'emailpp_group.html';
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

})



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