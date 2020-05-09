//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "设置汇率",    
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "System Management",       
        };


var oTable;

$(document).ready(function() {
	this.title = get_lan('nav_5_6')
	$('.navli5').addClass("active open")
	$('.financial6').addClass("active")	
	$('#title1').text(get_lan('nav_5_6'))
	$('.widget-caption').text(get_lan('nav_5_6'))
	$('#title2').text(get_lan('nav_5_6'))
	$('#mySmallModalLabel').text(get_lan('nav_5_6'))

	$("#btnEdit").hide();
	$("#btnSave").click(_addFun);
	$("#btnEdit").click(_editFunAjax);
	$("#deleteFun").click(_deleteFun);
	oTable = initTable();

	//币种
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#oldCurrency').append(_html)
			$('#newCurrency').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)	

	common.ajax_req("get", false, dataUrl, "weiinfo.ashx?action=read", {
		"companyId": companyID
	}, function(data) {
		//console.log(data.Data)
		//初始化信息
		var _data = data.Data
		$('#oldCurrency').val(_data.wein_currency).trigger("change")
	}, function(err) {
		console.log(err)
	}, 2000)

	DatePicker("#timeFrom","#timeEnd");
});

function initTable() {
	var columns;
	columns = [
		    { "mDataProp": "rate_timeFrom" ,
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_timeFrom!=null){
						$(td).html(rowData.rate_timeFrom.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},
		    { "mDataProp": "rate_timeEnd" ,
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_timeEnd!=null){
						$(td).html(rowData.rate_timeEnd.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},
		    { "mDataProp": "rate_oldCurrency" }, 
		    { "mDataProp": "rate_newCurrency" }, 
		    { "mDataProp": "rate_symbol" }, 	
		    { "mDataProp": "rate_exchangeRate" }, 
		    { "mDataProp": "rate_addTime" ,
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_addTime!=null){
						$(td).html(rowData.rate_addTime.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},
		    { "mDataProp": "createUser" }, 
		    { "mDataProp": "rate_modifyTime",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_modifyTime!=null){
						$(td).html(rowData.rate_modifyTime.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},
		    { "mDataProp": "modifyUser" }, 
			{
				"mDataProp": "rate_id",
				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
					if(oData.rate_companyId == companyID || companyID == 0) {
						$(nTd).html("<a href='javascript:void(0);' " +
								"onclick='_editFun(\"" + oData.rate_id + "\",\"" + oData.rate_timeFrom + "\",\"" + oData.rate_timeEnd + "\",\"" + oData.rate_oldCurrency + "\",\"" + oData.rate_newCurrency + "\",\"" + oData.rate_symbol + "\",\"" + oData.rate_exchangeRate + "\")'>" + get_lan('edit') + "</a> | ")
							.append("<a href='javascript:void(0);' onclick='_deleteFun(\"" + sData + "\")'>" + get_lan('delete') + "</a>");
					} else {
						$(nTd).html('')
					}
				}
			},
		]
	
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/exchangerate.ashx?action=read&companyId='+companyID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": false,
		"aaSorting": [[ 0, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columns,
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
		"fnCreatedRow": function(nRow, aData, iDataIndex) {
			//add selected class
			$(nRow).click(function() {
				if($(this).hasClass('row_selected')) {
					$(this).removeClass('row_selected');
				} else {
					oTable.$('tr.row_selected').removeClass('row_selected');
					$(this).addClass('row_selected');
				}
			});
		},
		"fnInitComplete": function(oSettings, json) {
			$("#addFun").click(_init);
		}
	});
	return table;
}

function DatePicker(beginSelector,endSelector){
    // 仅选择日期
    $(beginSelector).datepicker(
    {
        language:  "zh-CN",
        autoclose: true,
        startView: 0,
        format: "yyyy-mm-dd",
        clearBtn:true,
        todayBtn:false
    }).on('changeDate', function(ev){               
        if(ev.date){
            $(endSelector).datepicker('setStartDate', new Date(ev.date.valueOf()))
        }else{
            $(endSelector).datepicker('setStartDate',null);
        }
    })

    $(endSelector).datepicker(
    {
        language:  "zh-CN",
        autoclose: true,
        startView:0,
        format: "yyyy-mm-dd",
        clearBtn:true,
        todayBtn:false,
        startDate:new Date()
    }).on('changeDate', function(ev){  
        if(ev.date){
            $(beginSelector).datepicker('setEndDate', new Date(ev.date.valueOf()))
        }else{
            $(beginSelector).datepicker('setEndDate',new Date());
        } 

    })
}
        

function _today(){	
	var myDate = new Date;
    var year = myDate.getFullYear(); //获取当前年
    var mon = myDate.getMonth() + 1; //获取当前月
    var date = myDate.getDate(); //获取当前日
	return (year+"-"+mon+"-"+date);
}
/**
 * 初始化
 * @private
 */
function _init() {
	//resetFrom();
	$('#timeFrom').val(_today());
	// var start=new Date($('#timeFrom').val().replace("-", "/").replace("-", "/"));
	// // var newDate = new Date(ev.date);
 // //    newDate.setDate(newDate.getDate() + 1);
	// var date2 = new Date($('#timeFrom').datepicker('setValue', '+1d')); 
	// alert("CheckIn")
	// CheckIn = $('#timeFrom').datepicker('getDate');
	// alert(CheckIn)
 //    CheckOut = moment(CheckIn).add(1, 'day').toDate();
 //    $('#CheckOut').datepicker('update', CheckOut);
	// //var date2 = new Date($('#timeFrom').val()); 
	// // console.log(date2)
	// //date2=date2.getDate()+30; 
	// alert(date2)

	// $('#timeEnd').datepicker('setValue', _today(date2));

	$("#btnEdit").hide();
	$("#btnSave").show();
}

function _addFun() {
	var jsonData = {
		'companyId': companyID,
		'userId': userID,
		'exchangeRate': $("#exchangeRate").val(),
		'symbol': $("#symbol").val(),
		'timeFrom': $("#timeFrom").val(),
		'timeEnd': $("#timeEnd").val(),
		'newCurrency': $("#newCurrency").val(),
		'oldCurrency': $("#oldCurrency").val()
	};
	$.ajax({
		url: dataUrl+'ajax/exchangerate.ashx?action=new',
		data: jsonData,
		dataType: "json",
		type: "post",
		success: function(backdata) {
			if(backdata.State == 1) {
				$("#myModal").modal("hide");
				//resetFrom();
				oTable.fnReloadAjax(oTable.fnSettings());
			} else if (backdata.State == 0)  {
				alert("Have same exchange rate already.");
			} else {
				alert("Failed to add !!")
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}


/**
 * 编辑数据
 * @private
 */
function _editFunAjax() {
	var Id = $("#objectId").val();
	var timeFrom = $("#timeFrom").val();
	var timeEnd = $("#timeEnd").val();
	var oldCurrency = $("#oldCurrency").val();
	var newCurrency = $("#newCurrency").val();
	var symbol = $("#symbol").val();
	var exchangeRate = $("#exchangeRate").val();
	var jsonData = {
		"Id": Id,
		'companyId': companyID,	
		'exchangeRate': $("#exchangeRate").val(),
		'symbol': $("#symbol").val(),
		'timeFrom': $("#timeFrom").val(),
		'timeEnd': $("#timeEnd").val(),
		'newCurrency': $("#newCurrency").val(),
		'oldCurrency': $("#oldCurrency").val()
	};
	$.ajax({
		type: 'POST',
		dataType: "json",
		url: dataUrl+'ajax/exchangerate.ashx?action=modify',
				data: {
					"Id": Id
				},
		data: jsonData,
		success: function(json) {
			// if(json.State) {
			// 	$("#myModal").modal("hide");
			// 	resetFrom();
			// 	oTable.fnReloadAjax(oTable.fnSettings());
			// } else {
			// 	alert("Edit Fail!");
			// }
			if(json.State == 1) {
				$("#myModal").modal("hide");
				//resetFrom();
				oTable.fnReloadAjax(oTable.fnSettings());
			} else if (json.State == 0)  {
				alert("Have same exchange rate already.");
			} else {
				alert("Failed to add !!")
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

/**
 * 编辑数据带出值
 */
function _editFun(id, timeFrom, timeEnd, oldCurrency, newCurrency, symbol, exchangeRate) {
	$("#timeFrom").val(timeFrom.substring(0, 10));
	$("#timeEnd").val(timeEnd.substring(0, 10));
	$("#oldCurrency").val(oldCurrency);
	$("#newCurrency").val(newCurrency);
	$("#symbol").val(symbol);
	$("#exchangeRate").val(exchangeRate);
	$("#objectId").val(id);
	$("#myModal").modal("show");
	$("#btnSave").hide();
	$("#btnEdit").show();
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
				url: dataUrl + 'ajax/exchangerate.ashx?action=cancel',
				data: {
					"Id": id
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State) {
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
	$('form').each(function(index) {
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