//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
            "follow" : "跟进",
            "addcontact" : "新增联系人",
            "addbooking" : "新增联系单",
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

    if (GetQueryString('type') == 'myselft') {
        hasPermission('1601'); //权限控制
        this.title = get_lan('nav_2_2')
        $('.navli2').addClass("active open")
        $('.crm2').addClass("active")
        $('#title1').text(get_lan('nav_2_2'))
        $('#title2').text(get_lan('nav_2_2'))
        $('#mySmallModalLabel').text(get_lan('nav_2_2'))
    }else if (GetQueryString('type') == 'isSupplier') {
        hasPermission('1618'); //权限控制
        //	initModal();
        this.title = get_lan('nav_2_3')
        $('.navli2').addClass("active open")
        $('.crm3').addClass("active")	
        $('#title1').text(get_lan('nav_2_3'))
        $('#title2').text(get_lan('nav_2_3'))
        $('#mySmallModalLabel').text(get_lan('nav_2_3'))
	} else {
		hasPermission('1618'); //权限控制
	    this.title = get_lan('nav_2_0')
	    $('.navli2').addClass("active open")
	    $('.crm0').addClass("active")
	    $('#title1').text(get_lan('nav_2_0'))
	    $('#title2').text(get_lan('nav_2_0'))
	    $('#mySmallModalLabel').text(get_lan('nav_2_0'))
	}


	$('#addFun').on('click', function() {
		location.href = 'crmcompanyadd.html?action=add';
	})

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    // Setup - add a text input to each footer cell
    var table_tfoot_th_len=$('#example tfoot th').length; // 最后一行不需要显示搜索栏 20190815 by daniel
    $('#example tfoot th').each(function () {
        var title = $('#example thead th').eq( $(this).index() ).text();
        if($(this).index()!=table_tfoot_th_len-1){  // 最后一行不需要显示搜索栏 20190815 by daniel
        	$(this).html('<input style="width:100%;" type="text" placeholder="搜索 '+title+'" />');
        }
    });

    var tourl = ''
    if (GetQueryString('type') == 'myselft') {
        tourl = dataUrl + 'ajax/crmcompany.ashx?action=read&companyId=' + companyID + '&userId=' + userID + '&state=0'
    } else if (GetQueryString('type') == 'isSupplier') {
        tourl = dataUrl + 'ajax/crmcompany.ashx?action=read&companyId=' + companyID + '&isSupplier=1'
    }else {
        tourl = dataUrl + 'ajax/crmcompany.ashx?action=read&companyId=' + companyID + '&userId=' + childrenIds + '&state=0'
    }
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": tourl,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 6, "desc" ]],
		"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            {"bSortable": false, "aTargets": [0,3,4,5,7]}
        ],
//		"bProcessing": true,
		"aoColumns": [
            			{
            			    "mDataProp": "usin_name",
            			    "sWidth": "180px",
            			    "createdCell": function (td, cellData, rowData, row, col) {
            			        $(td).html("<span style='color:#999;'>建档：</span>" + rowData.usin_name + " <br/><span style='color:#999;'>业务：</span>" + rowData.sellName);
            			    }
            			},
			{
//				"mDataProp": "comp_name",
//				"createdCell": function (td, cellData, rowData, row, col) {
//					$(td).html("<a href='crmcompanydetail.html?Id="+rowData.comp_id +"'> " + rowData.comp_name + "</a><br/>"+rowData.comp_contactName);
//				}
				"render": function(data, type, row) {
					if(row["comp_isSupplier"]=="1"){
					    return "<a href='crmcompanydetail.html?Id=" + row["comp_id"] + "'>" + row["comp_name"] + "</a><br/><span class='badge badge-primary'>" + row["comp_rank"] + "</span>  [" + row["comp_code"] + "] <i class='fa fa-file-text-o tooltip-info' data-toggle='tooltip' data-placement='top' data-original-title='Can be suppliers'></i><br/>" + row["comp_contactName"]
					}else{
					    return "<a href='crmcompanydetail.html?Id=" + row["comp_id"] + "'> " + row["comp_name"] + "</a><br/><span class='badge badge-primary'>" + row["comp_rank"] + "</span> [" + row["comp_code"] + "] <br/>" + row["comp_contactName"]
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
			{ "mDataProp": "comp_country",
				"sWidth":"38px"
			},  //去掉供应商，变成国家，但是没有显示数据，不知道是否没有数据。20190815 by daniel
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
			    "mDataProp": "comp_state",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        var _stateText = ""
			        if (rowData.comp_state == 1) {
			            _stateText = "待审核"
			        } else if (rowData.comp_state == 2) {
			            _stateText = "正常"
			        } else if (rowData.comp_state == 3) {
			            _stateText = "已停用"
			        } else if (rowData.comp_state == 4) {
			            _stateText = "审核不通过"
			        }
			        $(td).html(_stateText);
			    }
			},
			{
				"mDataProp": "comp_id",
// 				"createdCell": function (td, cellData, rowData, row, col) {
// 					$(td).html("<a href='crmcompanyadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
// 						.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>")
// 						//.append("<a href='crmcompanyadd.html?action=modify&Id="+sData +"'>" + get_lan('follow') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
// 						.append("<a href='crmcompanycontactadd.html?action=add&companyId="+rowData.comp_customerId +"'>" + get_lan('addcontact') + "</a><br/>")
// //						.append("<a href='bookingadd.html?action=add&crmId="+cellData +"&fromId=1'>" + get_lan('addbooking') + "</a><br/>")
// 						.append("<a href='javascript:void(0);' onclick='_sendEmail(" + cellData + ")'>" + get_lan('sendemail') + "</a>");
				"createdCell": function (td, cellData, rowData, row, col) {
				    var perSend = ""
				    if (isPermission('1605') == 1) {
				        perSend = "<li><a href='javascript:void(0);' onclick='_sendEmail(" + cellData + ")'>" + get_lan('sendemail') + "</a></li>"
				    }
				    var stateString = ""
				    if (isPermission('1605') == 1) {
				        if (GetQueryString('type') == null) {
				            if (rowData.comp_state == 1) {
				                stateString = "<li><a href='javascript:void(0);' onclick='_stateFun(" + rowData.comp_id + ",2," + '"确认审核通过？"' + ")'>" + get_lan('check_pass') + "</a></li><li><a href='javascript:void(0);' onclick='_stateFun(" + rowData.comp_id + ",4," + '"确认审核不通过？"' + ")'>" + get_lan('check_no_pass') + "</a></li>"
				            } else if (rowData.comp_state == 2) {
				                stateString = "<li><a href='javascript:void(0);' onclick='_stateFun(" + rowData.comp_id + ",3," + '"确认停用？"' + ")'>" + get_lan('stop') + "</a></li>"
				            } else if (rowData.comp_state == 3) {
				                stateString = "<li><a href='javascript:void(0);' onclick='_stateFun(" + rowData.comp_id + ",2," + '"确认启动？"' + ")'>" + get_lan('start') + "</a></li>"
				            }

				        }
				    }

	    			$(td).html("<div class='btn-group'><a class='btn btn-blue btn-sm' href='crmcompanydetail.html?Id="+rowData.comp_id +"'> " + get_lan('follow') + "</a>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='crmcompanyadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a></li>"
	                    //+"<li><a href='crmcompanyadd.html?action=modify&Id="+cellData +"'>" + get_lan('follow') + "</a></li>"
	                    + "<li><a href='crmcompanycontactadd.html?action=add&userCompanyId=" + rowData.comp_customerId + "'>" + get_lan('addcontact') + "</a></li>"
	                    + "<li><a href='contactsheetadd.html?action=add&crmId=" + cellData + "'>" + get_lan('addbooking') + "</a></li>"
	                    + perSend
	                    +"<li class='divider'></li>"
	                    + "<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + ((rowData.comp_state == 1) ? get_lan('delete') : "") + "</a></li>"
                        + stateString
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

/**
 * 更新状态
 * @param id
 * @private
 */
function _stateFun(id, state, stateText) {
    bootbox.confirm(stateText, function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/crmcompany.ashx?action=editState',
                data: {
                    "Id": id,
                    "state": state
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        oTable.fnReloadAjax(oTable.fnSettings());
                    } else {
                        alert("Update Failed！");
                    }
                },
                error: function (error) {
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