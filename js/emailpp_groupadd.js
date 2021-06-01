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
	this.title = get_lan('nav_6_1')
	$('.navli6').addClass("active open")
	$('.emailprompt2').addClass("active")	
	$('#title1').text(get_lan('nav_6_1'))
	$('#title2').text(get_lan('nav_6_1'))

	var action = GetQueryString('action');
	var Id = GetQueryString('Id');
	$("#btnEdit").hide();
	$("#btnEdit").click(_editSaveFun);

	oTable = initTable();

	$("#checkAll").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});
	$('#example').delegate('#editEmail', 'click', function() {
		var _td=$(this).parents('tr').find("td")//.eq(0).html()
	    $("#inputEmailppname").val(_td.eq(1).html());
	    $("#inputEmailppcompany").val(_td.eq(5).html());
	    $("#inputEmailppaddress").val(_td.eq(2).html());
	    $("#inputEmailpptel").val(_td.eq(3).html());
	    $("#inputEmailppcountry").val(_td.eq(4).html());
	    $("#inputEmailppsource").val(_td.eq(6).html());
	    $("#objectId").val($(this).attr("data-id"));
	    $("#myModal").modal("show");
	    $("#btnSave").hide();
	    $("#btnEdit").show();
	    $("#mySmallModalLabel").text('编辑邮件');
	})

	$("#btnAddSave").on("click", function () {
	    var str = '';
	    $("input[name='checkList']:checked").each(function (i, o) {
	        str += $(this).val();
	        str += ",";
	    });

	    if ($("#emailGroupname").val() == '') {
	        comModel("邮件群组识别名称不能为空！")
	    } else if (str.length == 0) {
	        comModel("请选择邮件地址！")
	    } else {
	        if (action == 'add') {
	            var jsonData = {
	                'companyId': companyID,
	                'userId': userID,
	                'mg_name': $("#emailGroupname").val(),
	                'mlids': str
	            };
	            $.ajax({
	                url: dataUrl + 'ajax/mail.ashx?action=newmailgroup',
	                data: jsonData,
	                dataType: "json",
	                type: "post",
	                success: function (backdata) {
	                    if (backdata.State == 1) {
	                        comModel("新增成功！")
	                        //location.href = 'emailpp_group.html';
	                    } else {
	                        comModel("新增失败！")
	                        //location.href = 'emailpp_group.html';
	                    }
	                },
	                error: function (error) {
	                    console.log(error);
	                }
	            });
	        }
	        if (action == 'modify') {
	            //console.log(str)
	            //alert(str)
	            //alert(str.split(",").length-1)
	            var jsonData = {
                    'Id': Id,
	                'userId': userID,
	                'mg_name': $("#emailGroupname").val(),
	                'mlids': str,
	                'count_mlids': str.split(",").length-1
	            };
	            $.ajax({
	                url: dataUrl + 'ajax/mail.ashx?action=modifymailgroup',
	                data: jsonData,
	                dataType: "json",
	                type: "post",
	                success: function (backdata) {
	                    if (backdata.State == 1) {
	                        comModel("编辑成功！")
	                        location.href = 'emailpp_group.html';
	                    } else {
	                        comModel("编辑失败！")
	                        location.href = 'emailpp_group.html';
	                    }
	                },
	                error: function (error) {
	                    console.log(error);
	                }
	            });
	        }
	    }
	});

	

	if (action == 'modify') {
    	hasPermission('1206'); //权限控制：修改群组邮件列表
	    common.ajax_req("get", false, dataUrl, "mail.ashx?action=readmailgroupbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        $("#emailGroupname").val(data.Data.mg_name)
	        var maillist = data.Data.mlids.split(',')
	        setTimeout(function() {
	            for (var i = 0; i < maillist.length; i++) {
	                $("input[name='checkList'][value='" + maillist[i] + "']").attr("checked", true)
	            }
	        }, 2000)

	    }, function (err) {
	        console.log(err)
	    }, 5000)

	} else {
    	hasPermission('1205'); //权限控制：新增群组邮件列表
	}

});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/mail.ashx?action=readmaillist&companyId=' + companyID,
	    //"bLengthChange": false,
	    //'bPaginate': false,
      	"iDisplayLength":10,
      	"aLengthMenu": [[100,500], ["100","500"]],//二组数组，第一组数量，第二组说明文字;
        //"aaSorting": [[7, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,8]}
        ],
        "ordering":false,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		//"bSort": false,
		//"aaSorting": [[ 0, "desc" ]],
		//"stateSave": false,  //保存表格动态
		//"columnDefs":[{
	    //    "targets": [ 0 ], //隐藏第0列，从第0列开始   
	    //    "visible": false
        //}],
	    "aoColumns": [
            				{
            				    "mDataProp": "ml_id",
            				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				        $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
            				    }
            				},
           { "mDataProp": "ml_name" },
           { "mDataProp": "ml_email" },
           { "mDataProp": "ml_tel" },
           { "mDataProp": "ml_country" },
           { "mDataProp": "ml_com" },
           { "mDataProp": "ml_source" },
            { "mDataProp": "ml_sentdate",
	    		"createdCell": function(td, cellData, rowData, row, col) {
	    			if(rowData.ml_sentdate != null) {
	    				$(td).html(rowData.ml_sentdate.substring(0, 10));
	    			} else {
	    				$(td).html("NULL");
	    			}
	    		}
    		},		
           {
               "mDataProp": "ml_id",
               "createdCell": function (td, cellData, rowData, row, col) {
                   // $(td).html("<a href='javascript:void(0);' onclick='_editFun(" + rowData.ml_id + ",\"" + rowData.ml_name + "\",\"" + rowData.ml_email + "\",\"" + rowData.ml_tel + "\",\"" + rowData.ml_country + "\",\"" + rowData.ml_com + "\",\"" + rowData.ml_source + "\")'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                   //     .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
                    $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel

                        var _thisHtml="<div class='btn-group'><a class='btn btn-blue btn-sm' href='javascript:void(0);' id='editEmail' data-id='"+rowData.ml_id+"'>" + get_lan('edit') + "</a>"
                        +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                        +"<ul class='dropdown-menu dropdown-azure'>"
                        +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
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

/**
 * 重置表单
 */
function resetFrom() {
    $('form').each(function (index) {
        $('form')[index].reset();
    });
}


/**
 * 编辑数据带出值
 */
function _editFun(id, ml_name, ml_com, ml_email, ml_tel, ml_country, ml_source) {
    $("#inputEmailppname").val(ml_name);
    $("#inputEmailppcompany").val(ml_com);
    $("#inputEmailppaddress").val(ml_email);
    $("#inputEmailpptel").val(ml_tel);
    $("#inputEmailppcountry").val(ml_country);
    $("#inputEmailppsource").val(ml_source);
    $("#objectId").val(id);
    $("#myModal").modal("show");
    $("#btnSave").hide();
    $("#btnEdit").show();
    $("#mySmallModalLabel").text('编辑邮件');
}

/**
 * 编辑数据
 * @private
 */
function _editSaveFun() {
    var jsonData = {
        "Id": $("#objectId").val(),
        'userId': userID,
        'ml_name': $("#inputEmailppname").val(),
        'ml_com': $("#inputEmailppcompany").val(),
        'ml_email': $("#inputEmailppaddress").val(),
        'ml_tel': $("#inputEmailpptel").val(),
        'ml_country': $("#inputEmailppcountry").val(),
        'ml_source': $("#inputEmailppsource").val()
    };
    $.ajax({
        type: 'POST',
        dataType: "json",
        url: dataUrl + 'ajax/mail.ashx?action=modifymaillist',
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
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/mail.ashx?action=cancelmaillist',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        oTable.fnReloadAjax(oTable.fnSettings());
                    } else {
                        alert("Delete Failed！");
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