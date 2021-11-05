//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2": "财务管理中心",
            "follow" : "跟进",
            "addcontact" : "新增联系人",
            "addbooking" : "新增联系单",
            "sendemail" : "发送账号邮件",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "Financial MANAGEMENT",
            "follow" : "Follow Up",
            "addbooking" : "Booking",  
            "sendemail" : "Send Account Email",
        };

var oTable;
var typeId;
var _feeItemArr = new Array();
$(document).ready(function() {
    //	initModal();

    //hasPermission('1601'); //权限控制
    this.title = get_lan('nav_5_13')
    $('.navli5').addClass("active open")
    $('.financial13').addClass("active")
    $('#title1').text(get_lan('nav_5_13'))
    $('#title2').text(get_lan('nav_5_13'))

    //费用类型
    common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
        'typeId': 6,
        'companyId': companyID
    }, function (data) {
        var _data = data.data;
        console.log(_data)
        for (var i = 0; i < _data.length; i++) {
            var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' - ' + _data[i].puda_name_en + '</option>';
            //$('#feeItem').append(_html)
            _feeItem = _feeItem + _html
            _feeItemArr.push(_data[i].puda_id + ';' + _data[i].puda_name_cn + ' / ' + _data[i].puda_name_en)
        }
    }, function (error) {
    }, 1000)

	oTable = initTable();
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {  
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&typeId=4&companyId=' + companyID,
		'bPaginate': true,
	    "bInfo": false,
	    //		"bDestory": true,
	    //		"bRetrieve": true,
	    "bFilter": false,
	    "bSort": false,
		//"aaSorting": [[ 6, "desc" ]],
		//"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
        //    {"bSortable": false, "aTargets": [0,3,4,5,7]}
        //],
//		"bProcessing": true,
	    "aoColumns": [
            			{
            			    "mDataProp": "bill_payType",
            			    "createdCell": function (td, cellData, rowData, row, col) {
            			        var typeName = ''
            			        if (rowData["bill_payType"] == "debit") { typeName = '应收销账' }
            			        if (rowData["bill_payType"] == "credit") { typeName = '应付销账' }
            			        $(td).html(typeName);
            			    }
            			},
            { "mDataProp": "comp_name" },
                { "mDataProp": "bill_payNumber" },
                { "mDataProp": "rema_content" },
			    {
			        "mDataProp": "bill_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.bill_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "bill_currency" },
                        {
                            "mDataProp": "bill_payPrice",
                            "createdCell": function (td, cellData, rowData, row, col) {
                                if (rowData.bill_file != "") {
                                    $(td).html(rowData.bill_payPrice + '&nbsp;&nbsp;<a href="' + dataUrl + "uppic/feePic/" + rowData.bill_file + '" target="_blank"><i class="glyphicon glyphicon-picture"></a></i>');
                                } else {
                                    $(td).html(rowData.bill_payPrice);
                                }
                            }
                        },
			    {
			        "mDataProp": "bill_state",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            if (oData.bill_state == 1) {
			                $(nTd).html('未销账');
			            } else {
			                $(nTd).html(oData.bill_cancelCode);
			            }
			        }
			    },
			{
			    "mDataProp": "bill_id",
// 				"createdCell": function (td, cellData, rowData, row, col) {
// 					$(td).html("<a href='crmcompanyadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
// 						.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>")
// 						//.append("<a href='crmcompanyadd.html?action=modify&Id="+sData +"'>" + get_lan('follow') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
// 						.append("<a href='crmcompanycontactadd.html?action=add&companyId="+rowData.comp_customerId +"'>" + get_lan('addcontact') + "</a><br/>")
// //						.append("<a href='bookingadd.html?action=add&crmId="+cellData +"&fromId=1'>" + get_lan('addbooking') + "</a><br/>")
// 						.append("<a href='javascript:void(0);' onclick='_sendEmail(" + cellData + ")'>" + get_lan('sendemail') + "</a>");
				"createdCell": function (td, cellData, rowData, row, col) {
				    $(td).html("<a href='javascript:void(0);' onclick='_detailBillGetFun(" + cellData + ")'>" + get_lan('detail') + "</a><br/>")
                        .append("<a href='cancel_account_add.html?action=apply&Id=" + cellData + "&toCompanyId=" + rowData.bill_toCompany + "'>销账处理</a>")
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

/*销账申请详情*/
function _detailBillGetFun(Id) {
    $("#myModal4").modal("show");
    $(".fee_44").empty()
    common.ajax_req("get", true, dataUrl, "bill.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".bill_toCompany").text(_data.comp_name)
        $(".bill_addTime").text(_data.bill_addTime.substring(0, 10))
        $(".bill_bank").text(_data.rema_content)
        $(".bill_payNumber").text(_data.bill_payNumber)
        $(".bill_payPrice").text(_data.bill_payPrice)
        $(".bill_currency").text(_data.bill_currency)
        $(".bill_beizhu").text(_data.bill_beizhu)
        //$(".bill_file").text(_data.bill_currency)
        if (_data.bill_file != "") {
            $('#showimg55').attr('src', dataUrl + "uppic/feePic/" + _data.bill_file);
        }

        var arrItem = _data.bill_feeItem.split(',')
        var xuhao = 0;
        for (var i = 0; i < arrItem.length; i++) {
            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfeebyid", {
                "Id": arrItem[i]
            }, function (data) {
                console.log(data.Data)
                if (data.State == 1) {
                    //初始化信息
                    var _data = data.Data
                    xuhao = xuhao + 1;
                    var feelist = '<p style="clear:both;"><div class="margin-top-10">' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:4%; float: left;">' + xuhao + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_feeType + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:16%; float: left;">' + _getFeeItemFun(_data.bofe_feeItem) + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data.bofe_feeUnit + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data.bofe_fee + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data.bofe_num + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data.bofe_numUnit + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data.bofe_allFee + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_cancelMoney + '</label>' +
                    '</div></p>'
                    $(".fee_44").append(feelist)
                }

            }, function (err) {
                console.log(err)
            }, 1000)
        }

    }, function (err) {
        console.log(err)
    }, 1000)
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

function _getFeeItemFun(o) {
    console.log("111111111111111111111111111111111111")
    var z = new Array();
    var x;
    for (var i = 0; i < _feeItemArr.length; i++) {
        if (_feeItemArr[i].indexOf(o) >= 0) {
            z = _feeItemArr[i].split(";");
            x = z[1];
        }
    }
    return x;
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