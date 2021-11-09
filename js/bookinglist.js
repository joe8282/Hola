//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "订舱列表", 
            "con_top_4" : "补料", 
            "con_top_5" : "确认订舱", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENT",   
            "con_top_3" : "Booking List",    
            "con_top_4" : "Submit S/I",  
            "con_top_5" : "Confirm Booking", 
        };



var oTable;
$(document).ready(function() {
	this.title = get_lan('con_top_3') 
	$('.navli33').addClass("active open")	
	$('.book11').addClass("active")	
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3')) 

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    var ajaxUrl,columns    
    ajaxUrl = dataUrl + 'ajax/booking.ashx?action=read&companyId=' + companyID + '&fromId=1&userId=' + childrenIds + '&userOtherId=' + userID
    columns = [{
    		"mDataProp": "book_code"
    	},
//  	{
//  		"mDataProp": "type_name"
//  	},
    	{
    		"mDataProp": "crm_name"
    	},
    	{
    		"mDataProp": "book_movementType"
    	},
    	{
            "mDataProp": "book_port1",
            // "createdCell": function(td, cellData, rowData, row, col) {
            //     $(td).html(rowData.book_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ rowData.book_port2);
            // }
            "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                      return (full.book_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.book_port2)
                    }
    	},
    	// {
    	// 	"mDataProp": "book_port2"
    	// },
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
    		"createdCell": function(td, cellData, rowData, row, col) {
    			if(rowData.book_okTime != null) {
    				$(td).html(rowData.book_okTime.substring(0, 10));
    			} else {
    				$(td).html("NULL");
    			}
    		}
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
    		"mDataProp": "state_name_cn"
    	},
    	{
    		"mDataProp": "book_id",
    		"createdCell": function(td, cellData, rowData, row, col) {
                    // $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                    //  .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
                    // $(td).html("<div class='btn-group'><a class='btn btn-blue btn-sm' href='bookingadd.html?action=modify&Id=" + cellData + "'> " + ((rowData.book_state==1)?get_lan('edit'):(get_lan('review'))) + "</a>"
                    //     +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                    //     +"<ul class='dropdown-menu dropdown-azure'>"
                    //     +"<li><a href='billoflading.html?code="+rowData.book_code+"'>" + get_lan('con_top_4') + "</a></li>"
                    //     +"<li class='divider'></li>"
                    //     +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + ((rowData.book_state==1)?get_lan('delete'):"") + "</a></li>"
    		    //     +"</ul></div>")
    		        if (rowData.book_state == 3) {
    		            $(td).parent().find("td").css("background-color", "red");
    		        }
                    $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel
                        var _thisHtml_head='';
                        if(rowData.book_state==1){
                            _thisHtml_head="<div class='btn-group'><a class='btn btn-blue btn-sm' href='bookingadd.html?action=modify&Id=" + cellData + "'> " + get_lan('edit') + "</a>";
                            _thisHtml_del = "<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('cancel') + "</a></li>";
                        }else{                            
                            _thisHtml_head="<div class='btn-group'><a class='btn btn-blue btn-sm' href='bookingadd.html?action=review&Id=" + cellData + "'> " + get_lan('review') + "</a>";
                            _thisHtml_del="";
                        }

                        var _thisHtml_middle="<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                        +"<ul class='dropdown-menu dropdown-azure'>"
                        + "<li><a href='billoflading.html?code=" + rowData.book_code + "'>" + get_lan('con_top_4') + "</a></li>"
                        +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>" + get_lan('onemore_booking') + " </a></li>"
                        +"<li class='divider'></li>"                        

                        var _thisHtml_end="</ul></div>";

                        return (_thisHtml_head+_thisHtml_middle+_thisHtml_del+_thisHtml_end);

                    })
    			// $(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
       //              +"<ul class='dropdown-menu dropdown-azure'>"
       //              +"<li><a href='bookingadd.html?action=modify&Id=" + cellData + "'> " + ((rowData.book_state==1)?get_lan('edit'):(get_lan('review'))) + "</a></li>"
       //              +"<li><a href='billoflading.html?code="+rowData.book_code+"'>" + get_lan('con_top_4') + "</a></li>"
       //              +"<li class='divider'></li>"
       //              +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + ((rowData.book_state==1)?get_lan('delete'):"") + "</a></li>"
       //              +"</ul></div>")
                    // 这里修改了列表的操作样式 by daniel 20190803
                                            
                                        
    		}
    	},
    ]
        // ,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
        //     //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
        //     //{"bSortable": false, "aTargets": [1,2,3,4,7,8]}
        //     //{"order": [ 6, 'desc' ]},
        // ]
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": ajaxUrl,
        "aaSorting": [[6, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [4,7,8]}
        ],
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
//		"bSort": true,
//		"aaSorting": [[ 9, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columns,
        //"aoColumnDefs": aoColumnDefs,
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
 	bootbox.confirm("Are you sure to cancel?", function(result) {
 		if(result) {
 			$.ajax({
 			    url: dataUrl + 'ajax/booking.ashx?action=modify',
 				data: {
 				    "Id": id,
                    'state': 3
 				},
 				dataType: "json",
 				type: "post",
 				success: function(backdata) {
 				    if (backdata.State == 1) {
 				        comModel("取消成功")
 						oTable.fnReloadAjax(oTable.fnSettings());
 					} else {
 				        comModel("取消失败")
 				        oTable.fnReloadAjax(oTable.fnSettings());
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