//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "运价管理中心",   
            "con_top_3" : "运价列表", 
            "con_top_4" : "确认订舱", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Rates MANAGEMENT",   
            "con_top_3" : "Rate List",    
            "con_top_4" : "Confirm Booking", 
        };

var fromId = 'FCL';
if(GetQueryString('fromId')!=null){
	fromId=GetQueryString('fromId')
}

$('.rate11').addClass("active")

var oTable;

$(document).ready(function() {
	this.title = get_lan('con_top_3') 
	$('.navli44').addClass("active open")	
	$('#title1').text(get_lan('con_top_3'))

	oTable = initTable(fromId);

    $('input.global_filter').on( 'keyup click', function () {  //移动了全局搜索在其他的位置，这里是全局搜索的那个input的动作 20190822 by daniel
    	filterGlobal();
    } );
	
	//运输方式
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 7,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < 3; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#movementType').append(_html)
		}
		
		$("#movementType").val(fromId)
		
	}, function(error) {
		//console.log(parm)
	}, 1000)
	$("#movementType").change(function() {
		var opt = $("#movementType").val();
		location.href='rate.html?fromId='+opt
	})

	// $('#example tbody').on( 'mouseenter', 'td', function () {
 //        var colIdx = $("#example").dataTable().cell(this).index().column;
	// 	$( $("#example").dataTable().cells().nodes() ).removeClass( 'highlight' );
 //        $( $("#example").dataTable().column( colIdx ).nodes() ).addClass( 'highlight' );
 //    } );
	//$("#example thead tbody th:first").removeClass("sorting_asc");
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable(fromId) {
    var ajaxUrl,tableTitle,columns   
    if(fromId=='FCL'){   
    	ajaxUrl=dataUrl+'ajax/rate.ashx?action=readall&companyId='+companyID+'&movementType=FCL'
    	tableTitle='<th>来自</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>20\'GP</th><th>40\'GP</th><th>40\'HQ</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	//tableTitle='<th>来自</th><th>起运港</th><th>目的港</th><th>20\'GP</th><th>40\'GP</th><th>40\'HQ</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
			{ "mDataProp": "userCompanyName"},
			{ "mDataProp": "rate_port1",
				"mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   return (full.rate_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.rate_port2)
                }
		},
			//{ "mDataProp": "rate_port2"},
			{ "mDataProp": "rate_20GP"},
			{ "mDataProp": "rate_40GP"},			
			{ "mDataProp": "rate_40HQ" },
			{ "mDataProp": "rate_carrier" },
			{ "mDataProp": "rate_schedule" },
			{ "mDataProp": "rate_voyage" },
			{ "mDataProp": "rate_transit" },
			{
				"mDataProp": "rate_time1",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_time1!=null){
						$(td).html(rowData.rate_time1.substring(0, 10)+' <i class="fa fa-caret-right"></i><br/>'+rowData.rate_time2.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},		
			{ "mDataProp": "rate_beizhu",
				// "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
    //                return ("<a href='javascript:void(0)' data-toggle='popover' title='Example popover'><i class='fa fa-comment'></i></a>")
    //             }
				"createdCell": function (td, cellData, rowData, row, col) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
			},
			{
				"mDataProp": "rate_id",
				"createdCell": function (td, cellData, rowData, row, col) {
						// $(td).html("<a href='bookingadd.html?action=add&Id=" + cellData + "'>订舱</a><br/>")
						// 	.append("<a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a>")	
	    			$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>在线订舱</a></li>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a><li>"
	                    +"</ul></div>")										
				}
			},
		]
		,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
			//{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,5,6,7,8,10,11]}
        ]
        ,_aaSorting=[[9, 'desc']]

   }else if(fromId=='LCL'){
   		ajaxUrl = dataUrl + 'ajax/rate.ashx?action=readall&companyId=' + companyID + '&movementType=LCL'
    	tableTitle='<th>来自</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>价格(USD/RT)</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
    		{ "mDataProp": "userCompanyName"},
			{ "mDataProp": "rate_port1",
				"mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   return (full.rate_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.rate_port2)
                }
		},
			//{ "mDataProp": "rate_port2"},
			{ "mDataProp": "rate_20GP"},
			{ "mDataProp": "rate_carrier" },
			{ "mDataProp": "rate_schedule" },
			{ "mDataProp": "rate_voyage" },
			{ "mDataProp": "rate_transit" },
			{
				"mDataProp": "rate_time1",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_time1!=null){
						$(td).html(rowData.rate_time1.substring(0, 10)+'<i class="fa fa-caret-right"></i><br/>'+rowData.rate_time2.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},		
			{ "mDataProp": "rate_beizhu",
				// "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
    //                return ("<a href='javascript:void(0)' data-toggle='popover' title='Example popover'><i class='fa fa-comment'></i></a>")
    //             }
				"createdCell": function (td, cellData, rowData, row, col) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
			},	
			{
				"mDataProp": "rate_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					// $(td).html("<a href='bookingadd.html?action=add&Id=" + cellData + "'>订舱</a><br/>")
					// 	.append("<a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a>")
	    			$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>在线订舱</a></li>" // 这里需要修改一下：如果这个价格已经过期，应该询问是否继续订舱。 by daniel, 20190805
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</li></a>"
	                    +"</ul></div>")
				}
			},  		
    	]
		,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
			//{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,4,5,6,8,9]}
        ]
        ,_aaSorting=[[7, 'desc']]
    	
   }else if(fromId=='AIR'){
   		ajaxUrl=dataUrl+'ajax/rate.ashx?action=readall&companyId='+companyID+'&movementType=AIR'
    	tableTitle='<th>来自</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>45+(kgs)</th><th>100+(kgs)</th><th>500+(kgs)</th><th>1000+(kgs)</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
    		{ "mDataProp": "userCompanyName"},
			{ "mDataProp": "rate_port1",
				"mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   return (full.rate_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.rate_port2)
                }
		},
			//{ "mDataProp": "rate_port2"},
			{ "mDataProp": "rate_20GP"},
			{ "mDataProp": "rate_40GP"},			
			{ "mDataProp": "rate_40HQ" },
			{ "mDataProp": "rate_1000kgs" },
			{ "mDataProp": "rate_carrier" },
			{ "mDataProp": "rate_schedule" },
			{ "mDataProp": "rate_voyage" },
			{ "mDataProp": "rate_transit" },
			{
				"mDataProp": "rate_time1",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_time1!=null){
						$(td).html(rowData.rate_time1.substring(0, 10)+'<i class="fa fa-caret-right"></i><br/>'+rowData.rate_time2.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},		
			{ "mDataProp": "rate_beizhu",
				// "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
    //                return ("<a href='javascript:void(0)' data-toggle='popover' title='Example popover'><i class='fa fa-comment'></i></a>")
    //             }
				"createdCell": function (td, cellData, rowData, row, col) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
			},	
			{
				"mDataProp": "rate_id",
				"createdCell": function (td, cellData, rowData, row, col) {
						// $(td).html("<a href='bookingadd.html?action=add&Id=" + cellData + "'>订舱</a><br/>")
						// 	.append("<a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a>")
	    			$(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>在线订舱</a></li>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a></li>"
	                    +"</ul></div>")											
				}
			},
		]
		,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
			//{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,6,7,8,9,11,12]}
        ]
        ,_aaSorting=[[10, 'desc']]
    }
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"dom": 't',
		"sAjaxSource": ajaxUrl,
		//"bSortable": true,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
//		"bSort": true,
//		"aaSorting": [[ 9, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columns,
		"aoColumnDefs": aoColumnDefs,
		"aaSorting": _aaSorting,
		// "columnDefs": [
		//     { "orderable": false, "targets":[0,1,6,7,8,10,11] }
		// ],
		//"order": [],
//		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
//		"sPaginationType": "bootstrap",
		"oLanguage": {
//			"sUrl": "js/zh-CN.txt"
//			"sSearch": "快速过滤："
			"lengthChange": false,
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

 //移动了全局搜索在其他的位置，这里是全局搜索的那个input的搜索动作 20190822 by daniel
function filterGlobal () {
    $('#example').DataTable().search(
        $('#global_filter').val()
    ).draw();
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
 				url: dataUrl + 'ajax/rate.ashx?action=cancel',
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

//  function _getBeizhu(id) {
//  	alert('ddd')
//  }
// $(document).ready(function() {
// 	$("[data-toggle='popover']").popover();
// });