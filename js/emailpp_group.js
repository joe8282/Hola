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
    hasPermission('1207'); //权限控制：新增群组邮件列表
//	initModal();
	this.title = get_lan('nav_6_1')
	$('.navli6').addClass("active open")
	$('.emailprompt2').addClass("active")	
	$('#title1').text(get_lan('nav_6_1'))
	$('#title2').text(get_lan('nav_6_1'))

	$('#addFun').on('click', function() {
	    location.href = 'emailpp_groupadd.html?action=add';
	})


	initFilterSelect();//这个方法是初始化下拉框使用的， 必须在oTable = initTable();的前面
	oTable = initTable();
	getSaveDropList();//这个方法是保存下拉框使用的， 必须在oTable = initTable();的后面
	$("#example_filter input").css({"width":"250px"});
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/mail.ashx?action=readmailgroup&companyId=' + companyID,
	    "bLengthChange": false,
        "aaSorting": [[1, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [5]}
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
		 	{ "mDataProp": "mg_name" },
		 	{ "mDataProp": "last_sent_time",
	    		"createdCell": function(td, cellData, rowData, row, col) {
	    			if(rowData.ml_sentdate != null) {
	    				$(td).html(rowData.ml_sentdate.substring(0, 10));
	    			} else {
	    				$(td).html("未发送");
	    			}
	    		}
	    	},
		 	{ "mDataProp": "count" },
		 	{ "mDataProp": "count_mlids" },	
		 	{ "mDataProp": "change_time",
	    		"createdCell": function(td, cellData, rowData, row, col) {
	    			if(rowData.ml_sentdate != null) {
	    				$(td).html(rowData.ml_sentdate.substring(0, 10));
	    			} else {
	    				$(td).html("NULL");
	    			}
	    		}
	    	},		
		 	{
		 	    "mDataProp": "mgid",
		 		"createdCell": function (td, cellData, rowData, row, col) {
		 			// $(td).html("<a href='emailpp_groupadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
		 			// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
                    $(td).html(function(n){  //让.HTML使用函数 20190831 by daniel

                        var _thisHtml="<div class='btn-group'><a class='btn btn-blue btn-sm' href='emailpp_groupadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>"
                        +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                        +"<ul class='dropdown-menu dropdown-azure'>"
                        +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
                        +"</ul></div>"                        

                        return (_thisHtml);

                    });
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
    alert("sdss")
}


//初始化选择列start////////////
function initFilterSelect(){
    var str='';
    var tableTh=$("#example").find("thead").find("th");
    for(var i=0;i<tableTh.length-1;i++){
        str+=' <li style="padding:3px 15px;cursor:pointer;" class="toggle-vis" data-column="'+i+'"><input type="checkbox" checked="checked" disabled="disabled"/> '+$("#example").find("thead").find("th").eq(i).html()+'</li>';
    } 
    $("#tableSelect").html(str); 
}
//初始化选择列end////////////////

/////动态显示下拉列表的数据，CHECKBOX的选中与否START
function getSaveDropList(){
	var tableThNum=$("#tableSelect").find("input");
    for(var j=0;j<tableThNum.length;j++){
        if($('#example').DataTable().column(j).visible()){
        	$("#tableSelect").find("input").eq(j).prop("checked",true);
        }else{        	
        	$("#tableSelect").find("input").eq(j).prop("checked",false);
        }
    }
}
/////动态显示下拉列表的数据，CHECKBOX的选中与否END

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
 * 删除
 * @param id
 * @private
 */
function _deleteFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
			    url: dataUrl + 'ajax/mail.ashx?action=cancelmailgroup',
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


$(document).ready(function() {
	/////选择下拉列表动态显示、隐藏列START
	$("#tableSelect").find('.toggle-vis').on( 'click', function (e) {
        var input=$("#tableSelect").find("input");
        var inputCheckedCount=0;//一个列表有n个列，不可能让所有的列都消失，会出问题，所以当出现只有一个列显示的时候，这个下拉选择框不可以选
		for(var i=0;i<input.length;i++){                        
			if($("#tableSelect").find("input").eq(i).prop("checked")==true){
            	inputCheckedCount++;
            }
 		}
 		e.stopPropagation();
        var column = $('#example').DataTable().column( $(this).attr('data-column'));
 		if(inputCheckedCount>1||($(this).find("input").prop("checked")==false)){
            e.preventDefault(); 
          	column.visible( ! column.visible());
            $("#example").css("width","100%");
	 		if(!column.visible()){
	 			$(this).find("input").prop("checked",false);
			}else{
				$(this).find("input").prop("checked",true);
	    	}
     	}
    });
	/////选择下拉列表动态显示、隐藏列END
});
