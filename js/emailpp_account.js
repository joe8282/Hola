//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "邮件推广中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Email Prompt Plan",
};

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
	this.title = get_lan('nav_6_3')
	$('.navli6').addClass("active open")
	$('.emailprompt3').addClass("active")	
	$('#title1').text(get_lan('nav_6_3'))
	$('#title2').text(get_lan('nav_6_3'))


//	$("#addFun").click(_init);
	$("#btnSave").click(_addFun);
	$("#btnEdit").click(_editSaveFun);

	oTable = initTable();

});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/mail.ashx?action=readmailuser&companyId=' + companyID,
	    "bLengthChange": false,
        "aaSorting": [[5, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [4,6]}
        ],
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		//"bSort": true,
		//"aaSorting": [[ 0, "desc" ]],
		//"stateSave": true,  //保存表格动态
		//"columnDefs":[{
	    //    "targets": [ 0 ], //隐藏第0列，从第0列开始   
	    //    "visible": false
        //}],
	    "aoColumns": [
           { "mDataProp": "us_name" },
           { "mDataProp": "us_mail" },
           { "mDataProp": "us_host" },
           { "mDataProp": "us_replyto" },
           { "mDataProp": "us_pwd",
                "createdCell": function (td, cellData, rowData, row, col) {
                    $(td).html(rowData.us_pwd.substring(0, 1)+"*******");
                }
            },
		   {
			    "mDataProp": "change_time",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        $(td).html(rowData.change_time.substring(0, 10));
			    }
		   },
           {
               "mDataProp": "us_id",
               "createdCell": function (td, cellData, rowData, row, col) {
                   // $(td).html("<a href='javascript:void(0);' onclick='_editFun(" + rowData.us_id + ",\"" + rowData.us_name + "\",\"" + rowData.us_mail + "\",\"" + rowData.us_host + "\"," + rowData.us_ssl + "," + rowData.us_hostport + ",\"" + rowData.us_replyto + "\",\"" + rowData.us_pwd + "\")'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                   //     .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
                    $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel
                        var _perDel="";
                        if(isPermission('1211')==1){
                            _perDel="<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
                        }

                        var _thisHtml="<div class='btn-group'><a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_editFun(" + rowData.us_id + ",\"" + rowData.us_name + "\",\"" + rowData.us_mail + "\",\"" + rowData.us_host + "\"," + rowData.us_ssl + "," + rowData.us_hostport + ",\"" + rowData.us_replyto + "\",\"" + rowData.us_pwd + "\")'> " + get_lan('edit') + "</a>"
                        +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                        +"<ul class='dropdown-menu dropdown-azure'>"
                        +_perDel
                        +"</ul></div>"                        

                        return (_thisHtml);

                    })
               }
           },
	    ],
//		"bProcessing": true,
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
        "fnInitComplete": function (oSettings, json) {
            if (isPermission('1209') == 1) {
                $('<a href="#myModal" id="addFun" class="label label-primary tooltip-darkorange" data-toggle="modal"><i class="fa fa-plus-circle"></i></a>').appendTo($('.header-buttons'));
            }
            $("#addFun").click(_init);
        }
	});

	return table;
}


/**
 * 初始化
 * @private
 */
function _init() {
	resetFrom();
	$("#btnEdit").hide();
	$("#btnSave").show();	
}

/**
 * 重置表单
 */
function resetFrom() {
    $('form').each(function (index) {
        $('form')[index].reset();
    });
}


/**
 * 添加数据
 * @private
 */
function _addFun() {
    var ssl = 1;
    if ($("input[name='emailppSentssl']").is(':checked')) {
        ssl = 1
    } else {
        ssl = 0
    }
    var jsonData = {
        'companyId': companyID,
        'userId': userID,
        'us_name': $("#inputEmailppSentname").val(),
        'us_mail': $("#inputEmailppSentaddress").val(),
        'us_host': $("#inputEmailppSenthost").val(),
        'us_ssl': ssl,
        'us_hostport': $("#inputEmailppHostport").val(),
        'us_replyto': $("#inputEmailppSentreply").val(),
        'us_pwd': $("#inputEmailppSentpwd").val()
    };
    //console.log(jsonData);
    $.ajax({
        url: dataUrl + 'ajax/mail.ashx?action=newmailuser',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                $("#myModal").modal("hide");
                resetFrom();
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                alert("Add Fail!");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 * 编辑数据带出值
 */
function _editFun(id, us_name, us_mail, us_host, us_ssl, us_hostport, us_replyto, us_pwd) {
    $("#inputEmailppSentname").val(us_name);
    $("#inputEmailppSentaddress").val(us_mail);
    $("#inputEmailppSenthost").val(us_host);
    if (us_ssl == 1) {
        $("checkbox[name='emailppSentssl']").attr("checked", true)
    } else {
        $("checkbox[name='emailppSentssl']").attr("checked", false)
    }
    $("#inputEmailppHostport").val(us_hostport);
    $("#inputEmailppSentreply").val(us_replyto);
    $("#inputEmailppSentpwd").val(us_pwd.substring(0, 1)+"*******");
    $("#objectId").val(id);
    if(isPermission('1210')==1){
        $("#myModal").modal("show");
    }else{        
        alert("权限获取出现错误，请咨询管理员！")
        $("#myModal").modal("hide");
    }
    $("#btnSave").hide();
    $("#btnEdit").show();
    $("#mySmallModalLabel").text('发送邮箱设置');
}

/**
 * 编辑数据
 * @private
 */
function _editSaveFun() {
    var ssl = 1;
    if ($("input[name='emailppSentssl']").is(':checked')) {
        ssl = 1
    } else {
        ssl = 0
    }
    var jsonData = {
        "Id": $("#objectId").val(),
        'userId': userID,
        'us_name': $("#inputEmailppSentname").val(),
        'us_mail': $("#inputEmailppSentaddress").val(),
        'us_host': $("#inputEmailppSenthost").val(),
        'us_ssl': ssl,
        'us_hostport': $("#inputEmailppHostport").val(),
        'us_replyto': $("#inputEmailppSentreply").val(),
        'us_pwd': $("#inputEmailppSentpwd").val()
    };
    $.ajax({
        type: 'POST',
        dataType: "json",
        url: dataUrl + 'ajax/mail.ashx?action=modifymailuser',
        data: jsonData,
        success: function (json) {
            if (json.State) {
                $("#myModal").modal("hide");
                resetFrom();
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                alert("Edit Fail!");
            }
        },
        error: function (error) {
            console.log(error);
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
			    url: dataUrl + 'ajax/mail.ashx?action=cancelmailuser',
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
