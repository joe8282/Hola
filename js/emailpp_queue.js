//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "邮件推广中心",
    "send": "重新发送",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Email Prompt Plan",
    "send": "send",
};

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
	this.title = get_lan('nav_6_1')
	$('.navli6').addClass("active open")
	$('.emailprompt6').addClass("active")	
	$('#title1').text(get_lan('nav_6_1'))
	$('#title2').text(get_lan('nav_6_1'))

	var Id = GetQueryString('Id');
	if (Id == null) { $('#addFun').addClass('none'); }
	$('#btnSave').on('click', function () {
	    comModel("邮件开始发送，请稍后查看！")
	    $.ajax({
	        url: dataUrl + 'ajax/mail.ashx?action=sendmail',
	        data: { 'msid': Id },
	        dataType: "json",
	        type: "get",
	        success: function (backdata) {
	            //if (backdata.State == 1) {
	            //    //comModel("发送成功！")
	            //    //location.href = 'emailpp_sendplan.html';
	            //} else {
	            //    //comModel("发送失败！")
	            //    //location.href = 'emailpp_gsendplan.html';
	            //}
	            location.reload;
	        },
	        error: function (error) {
	            console.log(error);
	        }
	    });
	})
	

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
    var Id = GetQueryString('Id');
    var tourl = '';
    if (Id) { tourl = dataUrl + 'ajax/mail.ashx?action=readmailqueue&Id=' + Id }
    else { tourl = dataUrl + 'ajax/mail.ashx?action=readmailqueue&companyId=' + companyID }
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": tourl,
	    "bLengthChange": false,
        "aaSorting": [[7, 'desc']],
        "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [5,8]}
        ],
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
           { "mDataProp": "name" },
           { "mDataProp": "email" },
           { "mDataProp": "mailaddress" },
           { "mDataProp": "mailreplyto" },
           { "mDataProp": "mailtitle" },
           { "mDataProp": "intervaltime" },
                      			{
                      			    "mDataProp": "mqid",
                      			    "createdCell": function (td, cellData, rowData, row, col) {
                      			        if (rowData.status == 1) {
                      			            $(td).html('待发送');
                      			        }else if (rowData.status == 2) {
                      			            $(td).html('成功');
                      			        }else {
                      			            $(td).html('失败');
                      			        }
                      			    }
                      			},
           			{
           			    "mDataProp": "change_time",
           			    "createdCell": function (td, cellData, rowData, row, col) {
           			        $(td).html(rowData.change_time.substring(0, 19).replace("T"," "));
           			    }
           			},
           {
               "mDataProp": "mqid",
               "createdCell": function (td, cellData, rowData, row, col) {
                   $(td).html("<a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_sendFun(" + cellData + ")'>" + get_lan('send') + "</a>");
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
 * 重新发送邮件
 * @param id
 * @private
 */
function _sendFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
			    url: dataUrl + 'ajax/mail.ashx?action=sendmail2',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "get",
				success: function(backdata) {
				    if (backdata.State == 1) {
				        comModel("邮件发送成功！")
						oTable.fnReloadAjax(oTable.fnSettings());
					} else {
				        comModel("邮件发送失败！")
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
