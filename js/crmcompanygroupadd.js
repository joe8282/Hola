//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "客户管理中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Crm Home",
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

	var action = GetQueryString('action');
	var Id = GetQueryString('Id');
	//$("#btnEdit").hide();
    //$("#btnEdit").click(_editSaveFun);

	if (action == 'add') {
	    oTable = initTable();
	}
	

	$("#checkAll").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});

	var strArrg = [];
	$('#example tbody').on('click', '.ckGroupId', function (event) {    
	    if ($(this).prop("checked") == true) {
	        strArrg.push($(this).val())
	    } else {
	        strArrg.splice(jQuery.inArray($(this).val(), strArrg), 1)
	    }
	    //console.log(strArrg.toString())
	})
    


	$("#btnAddSave").on("click", function () {
	    //var str = '';
	    //$("input[name='checkList']:checked").each(function (i, o) {
	    //    str += $(this).val();
	    //    str += ",";
	    //});

	    if ($("#emailGroupname").val() == '') {
	        comModel("客户群组名称不能为空！")
	    } else if (strArrg.length == 0) {
	        comModel("请选择客户！")
	    } else {
	        if (action == 'add') {
	            var jsonData = {
	                'companyId': companyID,
	                'userId': userID,
	                'cg_name': $("#crmGroupname").val(),
	                'cg_crmIds': strArrg.toString()
	            };
	            $.ajax({
	                url: dataUrl + 'ajax/crmcompanygroup.ashx?action=newcrmCompanyGroup',
	                data: jsonData,
	                dataType: "json",
	                type: "post",
	                success: function (backdata) {
	                    if (backdata.State == 1) {
	                        comModel("新增成功！")
	                        location.href = 'crmcompanygroup.html';
	                    } else {
	                        comModel("新增失败！")
	                        location.href = 'crmcompanygroup.html';
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
                    'cg_name': $("#crmGroupname").val(),
                    'cg_crmIds': strArrg.toString(),
                    'cg_crmIdsCount': strArrg.length
	            };
	            $.ajax({
	                url: dataUrl + 'ajax/crmcompanygroup.ashx?action=modifycrmCompanyGroup',
	                data: jsonData,
	                dataType: "json",
	                type: "post",
	                success: function (backdata) {
	                    if (backdata.State == 1) {
	                        comModel("编辑成功！")
	                        location.href = 'crmcompanygroup.html';
	                    } else {
	                        comModel("编辑失败！")
	                        location.href = 'crmcompanygroup.html';
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
	    common.ajax_req("get", false, dataUrl, "crmcompanygroup.ashx?action=readcrmCompanyGroupbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        $("#crmGroupname").val(data.Data.cg_name)
	        strArrg = data.Data.cg_crmIds.split(',')
	        oTable = initTable(strArrg);
	        //setTimeout(function() {
	        //    for (var i = 0; i < maillist.length; i++) {
	        //        $("input[name='checkList'][value='" + maillist[i] + "']").attr("checked", true)
	        //    }
	        //}, 2000)

	    }, function (err) {
	        console.log(err)
	    }, 5000)

	} else {

	}

});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable(maillist) {
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/crmcompany.ashx?action=read&companyId=' + companyID,
	    //"bLengthChange": false,
	    //'bPaginate': false,
      	"iDisplayLength":10,
      	"aLengthMenu": [[100,500], ["100","500"]],//二组数组，第一组数量，第二组说明文字;
        //"aaSorting": [[7, 'desc']],
        //"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
        //    {"bSortable": false, "aTargets": [0,8]}
        //],
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
            				    "mDataProp": "comp_id",
            				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				        //console.log($.inArray(sData.toString(), maillist))
            				        if ($.inArray(sData.toString(), maillist) > -1) {
            				            $(nTd).html("<input type='checkbox' checked class='ckGroupId' name='checkList' value='" + sData + "'>");
            				        } else {
            				            $(nTd).html("<input type='checkbox' class='ckGroupId' name='checkList' value='" + sData + "'>");
            				        }
            				        
            				    }
            				},
           { "mDataProp": "comp_name" },
            {
	            "mDataProp": "comp_type",
	            "createdCell": function (td, cellData, rowData, row, col) {
		            var checkBoxArray = [];
		            var _checkboxValues = "";
		            checkBoxArray = cellData.split(",");
		            for (var i = 0; i < checkBoxArray.length; i++) {
			            var _checkboxValue = '<span class="badge badge-primary badge-square">' + checkBoxArray[i] + '</span> ';
			            _checkboxValues = _checkboxValues + _checkboxValue;
		            }
		            //console.log(_checkboxValues)
		            $(td).html(_checkboxValues);
	            }
            },
			{ "mDataProp": "comp_contactPhone" },
			{ "mDataProp": "comp_contactEmail" },
			{ "mDataProp": "comp_country" },
            {
                "mDataProp": "comp_addTime",
	    		"createdCell": function(td, cellData, rowData, row, col) {
	    		    if (rowData.comp_addTime != null) {
	    		        $(td).html(rowData.comp_addTime.substring(0, 10));
	    			} else {
	    				$(td).html("NULL");
	    			}
	    		}
    		},		
           //{
           //    "mDataProp": "comp_id",
           //    "createdCell": function (td, cellData, rowData, row, col) {
           //         $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel

           //             var _thisHtml = "<div class='btn-group'><a class='btn btn-blue btn-sm' href='javascript:void(0);' id='editEmail' data-id='" + rowData.comp_id + "'>" + get_lan('edit') + "</a>"
           //             +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
           //             +"<ul class='dropdown-menu dropdown-azure'>"
           //             +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
           //             +"</ul></div>"                        

           //             return (_thisHtml);

           //         })
           //    }
           //},
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
	//$("#btnEdit").hide();
	//$("#btnSave").show();	
}


/**
 * 重置表单
 */
function resetFrom() {
    $('form').each(function (index) {
        $('form')[index].reset();
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