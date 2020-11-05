//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
            "follow" : "跟进",
            "addcontact" : "新增联系人",
            "addbooking" : "新增订舱单",
            "sendemail" : "发送账号邮件",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "CRM Home", 
            "follow" : "Follow Up",
            "addbooking" : "Booking",  
            "sendemail" : "Send Account Email",
        };

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
	this.title = get_lan('nav_2_4')
	$('.navli2').addClass("active open")
	$('.crm4').addClass("active")	
	$('#title1').text(get_lan('nav_2_4'))
	$('#title2').text(get_lan('nav_2_4'))
	$('#mySmallModalLabel').text(get_lan('nav_2_2'))

	$('#addFun').on('click', function() {
		location.href = 'crmcompanyadd.html?action=add';
	})

	var Id = GetQueryString('Id');

	oTable = initTable(Id);
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable(Id) {
    // Setup - add a text input to each footer cell
    var table_tfoot_th_len=$('#example tfoot th').length; // 最后一行不需要显示搜索栏 20190815 by daniel
    $('#example tfoot th').each(function () {
        var title = $('#example thead th').eq( $(this).index() ).text();
        if($(this).index()!=table_tfoot_th_len-1){  // 最后一行不需要显示搜索栏 20190815 by daniel
        	$(this).html('<input style="width:100%;" type="text" placeholder="搜索 '+title+'" />');
        }
    });
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/crmcompanygroup.ashx?action=readcrmCompanyGroupDetailbyid&Id=' + Id,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 5, "desc" ]],
		"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            {"bSortable": false, "aTargets": [2,3,4,6]}
        ],
//		"bProcessing": true,
		"aoColumns": [
			//{ "mDataProp": "usin_name"},
			{
//				"mDataProp": "comp_name",
//				"createdCell": function (td, cellData, rowData, row, col) {
//					$(td).html("<a href='crmcompanydetail.html?Id="+rowData.comp_id +"'> " + rowData.comp_name + "</a><br/>"+rowData.comp_contactName);
//				}
				"render": function(data, type, row) {
					if(row["comp_isSupplier"]=="1"){
						return "<a href='crmcompanydetail.html?Id="+row["comp_id"] +"'> " + row["comp_name"] + "</a> ["+row["comp_code"]+"] <i class='fa fa-file-text-o tooltip-info' data-toggle='tooltip' data-placement='top' data-original-title='Can be suppliers'></i><br/>"+row["comp_contactName"]
					}else{
						return "<a href='crmcompanydetail.html?Id="+row["comp_id"] +"'> " + row["comp_name"] + "</a> ["+row["comp_code"]+"] <br/>"+row["comp_contactName"]
					}
					
				}
			},
			{ "mDataProp": "comp_type" ,
				"createdCell": function (td, cellData, rowData, row, col) {
					var checkBoxArray=[];
					var _checkboxValues="";
					checkBoxArray = cellData.split(",");
				    for(var i=0;i<checkBoxArray.length;i++){
				    	var _checkboxValue = '<span class="badge badge-primary badge-square">'+checkBoxArray[i]+'</span> ';
				    	_checkboxValues=_checkboxValues + _checkboxValue;
				    }
				    console.log(_checkboxValues)
					$(td).html(_checkboxValues);
				}
			},
			{ "mDataProp": "comp_contactPhone" },
			{ "mDataProp": "comp_contactEmail" ,
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html('<a href="mailto:'+rowData.comp_contactEmail+'">'+rowData.comp_contactEmail+'<a>');
				}	
			},
			{ "mDataProp": "comp_country" },  //去掉供应商，变成国家，但是没有显示数据，不知道是否没有数据。20190815 by daniel
			// {
			// 	"mDataProp": "comp_isSupplier",
			// 	"createdCell": function (td, cellData, rowData, row, col) {
			// 		if(cellData=="1"){
			// 			$(td).html("是");
			// 		}else{
			// 			$(td).html("否");
			// 		}
			// 	}			
			// },			
			{
				"mDataProp": "comp_followTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html(rowData.comp_followTime.substring(0, 10)+"<br>"+rowData.comp_updateTime.substring(0, 10));
				}			
			},	
			// {
			// 	"mDataProp": "comp_updateTime",
			// 	"createdCell": function (td, cellData, rowData, row, col) {
			// 		$(td).html(rowData.comp_updateTime.substring(0, 10));
			// 	}			
			// },				
			{
				"mDataProp": "comp_id",
// 				"createdCell": function (td, cellData, rowData, row, col) {
// 					$(td).html("<a href='crmcompanyadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
// 						.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>")
// 						//.append("<a href='crmcompanyadd.html?action=modify&Id="+sData +"'>" + get_lan('follow') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
// 						.append("<a href='crmcompanycontactadd.html?action=add&companyId="+rowData.comp_customerId +"'>" + get_lan('addcontact') + "</a><br/>")
// //						.append("<a href='bookingadd.html?action=add&crmId="+cellData +"&fromId=1'>" + get_lan('addbooking') + "</a><br/>")
// 						.append("<a href='javascript:void(0);' onclick='_sendEmail(" + cellData + ")'>" + get_lan('sendemail') + "</a>");
	    		"createdCell": function(td, cellData, rowData, row, col) {
	    			$(td).html("<div class='btn-group'><a class='btn btn-blue btn-sm' href='crmcompanydetail.html?Id="+rowData.comp_id +"'> " + get_lan('follow') + "</a>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='crmcompanyadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a></li>"
	                    //+"<li><a href='crmcompanyadd.html?action=modify&Id="+cellData +"'>" + get_lan('follow') + "</a></li>"
	                    +"<li><a href='crmcompanycontactadd.html?action=add&companyId="+rowData.comp_customerId +"'>" + get_lan('addcontact') + "</a></li>"
	                    +"<li><a href='bookingadd.html?action=add&crmId="+cellData +"&fromId=1'>" + get_lan('addbooking') + "</a></li>"
	                    +"<li><a href='javascript:void(0);' onclick='_sendEmail(" + cellData + ")'>" + get_lan('sendemail') + "</a></li>"
	                    +"<li class='divider'></li>"
	                    +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + ((rowData.book_state==1)?get_lan('delete'):"") + "</a></li>"
	                    +"</ul></div>")
	                    // 这里修改了列表的操作样式 by daniel 20190803
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

/**
 * 发送邮件
 * @param id
 * @private
 */
function _sendEmail(id) {
	bootbox.confirm("确认要给客户发送账号邮件吗?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/crmcompany.ashx?action=sendemail',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State == 1) {
						comModel('Email Send Sueecss')
						oTable.fnReloadAjax(oTable.fnSettings());
					} else {
						alert("Email Send Failed！");
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});
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
				url: dataUrl + 'ajax/crmcompany.ashx?action=cancel',
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