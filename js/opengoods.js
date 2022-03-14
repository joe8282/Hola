//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2": "货物管理中心",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "SHIPMENTS MANAGEMENTe",
        };


var oTable;

$(document).ready(function() {
    hasPermission('1723'); //权限控制：
    //if (isPermission('1307') != 1) {
    //    $('#addFun').hide()
    //}
	this.title = "放货管理"
	$('.navli3').addClass("active open")
	$('.book8').addClass("active")
	$('#title1').text("放货管理")
	$('.widget-caption').text("放货管理")
	$('#title2').text("放货管理")

	oTable = GetOpenGoods();

});

//放货申请列表
function GetOpenGoods() {
    var table = $("#openGoodsList").dataTable({
        //"iDisplayLength":10,
        "sAjaxSource": dataUrl + 'ajax/opengoods.ashx?action=read&companyId=' + companyID,
        'bPaginate': false,
        "bInfo": false,
        //		"bDestory": true,
        //		"bRetrieve": true,
        //"bFilter": false,
        "bSort": false,
        "aaSorting": [[0, "desc"]],
        //		"bProcessing": true,
        "aoColumns": [
                        {
                            "mDataProp": "comp_name",
                            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                $(nTd).html("<a href='crmcompanydetail.html?Id=" + oData.opgo_toCompany + "' target='_blank'>" + oData.comp_name + "</a><br/>" + oData.company_period);
                            }
                        },
            { "mDataProp": "opgo_openType" },
                                    {
                                        "mDataProp": "book_orderCode_open",
                                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                            if (oData.book_truePortTime_open != null) {
                                                $(nTd).html("<a href='orderadd.html?action=modify&Id="+oData.opgo_orderCode_open+"' target='_blank'>"+oData.book_orderCode_open + "</a></br>" + oData.book_port1_open + " <i class='fa fa-long-arrow-right'></i> " + oData.book_port2_open + "</br>" + oData.book_movementType_open + " / " + oData.book_allContainer_open + "</br>实离港日：" + oData.book_truePortTime_open.substring(0, 10));
                                            } else {
                                                $(nTd).html("<a href='orderadd.html?action=modify&Id=" + oData.opgo_orderCode_open + "' target='_blank'>" + oData.book_orderCode_open + "</a></br>" + oData.book_port1_open + " <i class='fa fa-long-arrow-right'></i> " + oData.book_port2_open + "</br>" + oData.book_movementType_open + " / " + oData.book_allContainer_open);
                                            }
                                            
                                        }
                                    },
            { "mDataProp": "opgo_orderType" },
                                    {
                                        "mDataProp": "book_orderCode_close",
                                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                            if (oData.book_truePortTime_close != null) {
                                                $(nTd).html("<a href='orderadd.html?action=modify&Id=" + oData.opgo_orderCode_close + "' target='_blank'>" + oData.book_orderCode_close + "</a></br>" + oData.book_port1_close + " <i class='fa fa-long-arrow-right'></i> " + oData.book_port2_close + "</br>" + oData.book_movementType_close + " / " + oData.book_allContainer_close + "</br>实离港日：" + oData.book_truePortTime_close.substring(0, 10));
                                            } else {
                                                $(nTd).html("<a href='orderadd.html?action=modify&Id=" + oData.opgo_orderCode_close + "' target='_blank'>" + oData.book_orderCode_close + "</a></br>" + oData.book_port1_close + " <i class='fa fa-long-arrow-right'></i> " + oData.book_port2_close + "</br>" + oData.book_movementType_close + " / " + oData.book_allContainer_close);
                                            }
                                        }
                                    },
            {
                "mDataProp": "opgo_addTime",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("申请人：" + oData.addUser + "<br/>申请时间：" + oData.opgo_addTime.substring(0, 10));
                }
            },
                            {
                                "mDataProp": "opgo_opetionTime",
                                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                    if (oData.opgo_opetionTime != null) {
                                        $(nTd).html("审核人：" + oData.checkUser + "<br/>审核时间：" + oData.opgo_opetionTime.substring(0, 10));
                                    }
                                }
                            },
            {
                "mDataProp": "opgo_state",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if (oData.opgo_state == 1) {
                        $(nTd).html('待审核');
                    } else if (oData.opgo_state == 2) {
                        $(nTd).html("审核通过");
                    } else if (oData.opgo_state == 3) {
                        $(nTd).html("审核不通过");
                    }
                }
            },
            {
                "mDataProp": "opgo_id",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if (oData.opgo_state == 1) {
                        $(nTd).html("<a href='javascript:void(0);' onclick='_detailOpenGoodsFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            .append("<a href='javascript:void(0);' onclick='_deleteOpenGoodsFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>发票</a>")
                    } else {
                        $(nTd).html("<a href='javascript:void(0);' onclick='_detailOpenGoodsFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //.append("<a href='javascript:void(0);' onclick='_deleteBillGetFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                        //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                    }

                }
            },
        ]
    });
    return table;
}

/*放货详情*/
function _detailOpenGoodsFun(Id) {
    $("#myModal4").modal("show");
    $("#opetionBeizhu").val('')
    openGoodsId = Id
    common.ajax_req("get", true, dataUrl, "opengoods.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".opgo_toCompany").text(_data.comp_name)
        $(".opgo_addTime").text(_data.addUser + "/" + _data.opgo_addTime.substring(0, 10))
        $(".opgo_openType").text(_data.opgo_openType)
        $(".opgo_orderType").text(_data.opgo_orderType)
        $(".opgo_orderCode_open").text(_data.book_orderCode_open)
        $(".opgo_orderCode_close").text(_data.book_orderCode_close)
        $(".opgo_beizhu").text(_data.opgo_beizhu)

        if (_data.opgo_state != 1) {
            $("#opetionBeizhu").val(_data.opgo_opetionBeizhu)
            $('#passState').hide()
            $('#nopassState').hide()
        } else {
            $("#opetionBeizhu").val(_data.opgo_opetionBeizhu)
            $('#passState').show()
            $('#nopassState').show()
        }

    }, function (err) {
        console.log(err)
    }, 1000)
}

$('#passState').on('click', function () {
    var jsonData = {
        'Id': openGoodsId,
        'state': 2,
        'opetionUser': userID,
        'opetionBeizhu': $("#opetionBeizhu").val()
    };
    $.ajax({
        url: dataUrl + 'ajax/opengoods.ashx?action=modify',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                comModel("提交成功！")
                $("#myModal4").modal("hide");
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                comModel("提交失败！")
                //location.href = 'emailpp_group.html';
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

})


$('#nopassState').on('click', function () {
    var jsonData = {
        'Id': openGoodsId,
        'state': 3,
        'opetionUser': userID,
        'opetionBeizhu': $("#opetionBeizhu").val()
    };
    $.ajax({
        url: dataUrl + 'ajax/opengoods.ashx?action=modify',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                comModel("提交成功！")
                $("#myModal4").modal("hide");
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                comModel("提交失败！")
                //location.href = 'emailpp_group.html';
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

})

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