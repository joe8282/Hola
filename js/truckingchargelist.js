//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Financial MANAGEMENT", 
        };

var oTable;
var typeId;
$(document).ready(function() {
	hasPermission('1414'); //权限控制：查看拖箱费用
//	initModal();
	this.title = get_lan('nav_4_3')
	$('.navli4').addClass("active open")
	$('.rate3').addClass("active")	
	$('#title1').text(get_lan('nav_4_3'))
	$('#title2').text(get_lan('nav_4_3'))

	//$('.btn-blue').on('click', function() {
	//	location.href = 'truckingchargeadd.html?action=add';
	//})

	$('#newTurckchargeButton').on('click', function() {
		location.href = 'truckingchargeadd.html?action=add';
	});
	$('#uploadTruckchargeButton').on('click', function () {
	    //location.href = 'fileinput.html?action=truckingcharge';
	    window.open('fileinput.html?action=truckingcharge')
	});
	// $('#editFun').on('click', function() {
	// 	location.href = 'truckingchargeadd.html?action=add';
	// });
	oTable = initTable();

	$("#checkAll").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});


	var clipboard = new ClipboardJS('.copyTruckfee',{ 
		text: function(e) {
			var _eId=$(e).attr("id");
			var _20gpFee = $("#"+_eId).parents('tr').find("td:eq(5)").html()+"/20GP, ";
			var _40gpFee = $("#"+_eId).parents('tr').find("td:eq(6)").html()+"/40GP, ";
			var _40hqFee = $("#"+_eId).parents('tr').find("td:eq(7)").html()+"/40HQ";
			var _copyTruckfeeAll= "拖车费 / TRUCKING FEE: "+ _20gpFee+_40gpFee+_40hqFee;
			//alert(_copyTruckfeeAll);
			$("#copyFeeAll").text(_copyTruckfeeAll)
            return $("#copyFeeAll").text();
        }
	});

	clipboard.on('success', function(e) {
	    Notify('All Fee have been copied.', 'bottom-right', '5000', 'success', 'fa-check', true);
	    e.clearSelection();
	});

	clipboard.on('error', function(e) {
	    Notify('Fee have not been copied.', 'bottom-right', '5000', 'warning', 'fa-check', true);
	});




	// function _copyTruckfee(id) {
	// 	//alert($("#tckchr_"+id).parents('tr').find("td:eq(4)").html());
	// 	var _20gpFee = $("#tckchr_"+id).parents('tr').find("td:eq(5)").html()+"/20GP, ";
	// 	var _40gpFee = $("#tckchr_"+id).parents('tr').find("td:eq(6)").html()+"/40GP, ";
	// 	var _40hqFee = $("#tckchr_"+id).parents('tr').find("td:eq(7)").html()+"/40HQ";
	// 	var _copyTruckfeeAll= "拖车费 / TRUCKING FEE: "+ _20gpFee+_40gpFee+_40hqFee;
	// 	alert(_copyTruckfeeAll)
	// 	$("#copyFeeAll").text(_copyTruckfeeAll)
	// 	var clipboard = new ClipboardJS('#copyFeeall',{
	// 		text: function() {
	// 		alert("dd")
	//             return $("#copyFeeAll").text();
	//         }
	// 	})
	// }




});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/truckingcharge.ashx?action=read&companyId=' + companyID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 10, "desc" ]],
		"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            {"bSortable": false, "aTargets": [0,1,2,3,4,5,9,11]}
        ],
//		"bProcessing": true,
		"aoColumns": [
            				{
            				    "mDataProp": "trch_id",
            				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				        $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
            				    }
            				},
                            			{
                            			    "mDataProp": "comp_code",
                            			    "createdCell": function (td, cellData, rowData, row, col) {
                            			        if (cellData) {
                            			            $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                            			        }
                            			    }
                            			},
			{ "mDataProp": "trch_from" },
			{ "mDataProp": "trch_port" },
			{ "mDataProp": "trch_dropback" },
			{ "mDataProp": "trch_delivery" },
			{
			    "mDataProp": "trch_id",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        $(td).html(rowData.trch_feeUnit + rowData.trch_20GP);
			    }
			},
			{
			    "mDataProp": "trch_id",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        $(td).html(rowData.trch_feeUnit + rowData.trch_40GP);
			    }
			},
			{
			    "mDataProp": "trch_id",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        $(td).html(rowData.trch_feeUnit + rowData.trch_40HQ);
			    }
			},
			{ "mDataProp": "trch_remark",
				"createdCell": function (td, cellData, rowData, row, col) { //备注使用了图标的popover的功能，能节省空间。 by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
            },
			{
			    "mDataProp": "trch_id",
				"createdCell": function (td, cellData, rowData, row, col) {
				    $(td).html(rowData.trch_useTime1.substring(0, 10) + ' <i class="fa fa-long-arrow-right"></i> ' + rowData.trch_useTime2.substring(0, 10));
				}			
			},			
			{
			    "mDataProp": "trch_id",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        var perCopy = perEdit = perDel = ""
			        if (isPermission('1419') == 1) {
			            perCopy = "<button class='btn btn-blue btn-sm copyTruckfee' id='tckchr_" + cellData + "' data-clipboard-target='#copyFeeAll'> " + get_lan('copyitem') + "</button>"
			        }
			        if (isPermission('1417') == 1) {
			            perEdit = "<li><a href='truckingchargeadd.html?action=modify&Id=" + cellData + "'> " + get_lan('edit') + "</a></li>"
			        }
			        if (isPermission('1418') == 1) {
			            perDel = "<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
			        }
					// $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
					// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
			        $(td).html("<div class='btn-group'>" + perCopy
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    + perEdit
	                    + perDel
	                    +"</ul></div>")
				}
			},
		],
		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
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
		"fnCreatedRow": function (nRow, aData, iDataIndex) {
		    //add selected class
		    $(nRow).click(function () {
		        if ($(this).hasClass('row_selected')) {
		            $(this).removeClass('row_selected');
		        } else {
		            oTable.$('tr.row_selected').removeClass('row_selected');
		            $(this).addClass('row_selected');
		        }
		    });
		},
		"fnInitComplete": function(oSettings, json) {
		   // $('<a href="truckingchargeadd.html?action=add" class="btn btn-primary" id="addFun">' + get_lan('new') + '</a> &nbsp;' +
		    //'<a href="#" class="btn btn-primary" id="editFun">' + get_lan('edit') + '</a>').appendTo($('.myBtnBox'));
            //'<a href="#" class="btn btn-danger" id="deleteFun">' + get_lan('delete') + '</a>').appendTo($('.myBtnBox'));

		    //$("#deleteFun").click(_deleteList);
		    $("#editFun").click(_edit);
		    //$("#addFun").click(_init);
		},
		"drawCallback": function(){
			$('[data-toggle="popover"]').popover();
		}
	});

    
	return table;
}




/**
 * 批量编辑
 * @private
 */
function _edit() {
    var str = '';
    $("input[name='checkList']:checked").each(function (i, o) {
        str += $(this).val();
        str += ",";
    });
    if (str.length > 0) {
        var IDS = str.substr(0, str.length - 1);
        //alert("你要处理的id为" + IDS);
        location.href = 'truckingchargeadd.html?action=modify&Id=' + IDS;
    } else {
        alert("Please choose to delete the data!");
    }
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
				url: dataUrl + 'ajax/truckingcharge.ashx?action=cancel',
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