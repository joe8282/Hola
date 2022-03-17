//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "财务管理中心",

};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Financial MANAGEMENTe",

};

var _feeItemArr = new Array();

$(document).ready(function() {
    hasPermission('1326'); //权限控制：查看对账通知单
    if (isPermission('1327') != 1) {
        $('#printDetail').hide()
    }
    //	initModal();
    this.title = get_lan('nav_5_10')
    $('.navli5').addClass("active open")
    $('.financial10').addClass("active")
    $('#title1').text(get_lan('nav_5_10'))
    $('#title2').text(get_lan('nav_5_10'))

    $("#printDetail").click(function () {
        var content = $("#printArea").html()
        $("#printArea").print({
            globalStyles: true,//是否包含父文档的样式，默认为true
            mediaPrint: false,//是否包含media='print'的链接标签。会被globalStyles选项覆盖，默认为false
            stylesheet: null,//外部样式表的URL地址，默认为null
            noPrintSelector: ".no-print",//不想打印的元素的jQuery选择器，默认为".no-print"
            iframe: false,//是否使用一个iframe来替代打印表单的弹出窗口，true为在本页面进行打印，false就是说新开一个页面打印，默认为true
            append: null,//将内容添加到打印内容的后面
            prepend: null,//将内容添加到打印内容的前面，可以用来作为要打印内容
            deferred: $.Deferred((function () { //回调函数
                console.log('Printing done');

            }))
        });
    })

    $('#send').on('click', function () {
        GetStatement($("input[name='radio2']:checked").val(), $("input[name='radio1']:checked").val(), $("#crmuser").val())
	})

	common.ajax_req("get", true, dataUrl, "usercompany.ashx?action=readbyid", {
	    "Id": companyID
	}, function (data) {
	    //初始化信息;
	    var _data = data.Data;
	    $('.companyName').text(_data.comp_name)
	    $('.companyAddress').text(_data.comp_address)
	    $('.companyTel').text(_data.comp_tel)
	    $('.companyFax').text(_data.comp_fax)
	    $('.companyEmail').text(_data.comp_email)
	}, function (err) {
	    console.log(err)
	}, 2000)

	var OWNER_Unit = '', exchangeRate=1
	common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    //console.log(data)
	    if (data.State == 1) {
	        OWNER_Unit = data.Data.wein_currency
	        $('.OWNER_Unit').text(OWNER_Unit)

	        if (OWNER_Unit != 'USD') {
	            common.ajax_req("get", true, dataUrl, "exchangerate.ashx?action=readbyowner", {
	                "owner": OWNER_Unit,
	                "other": 'USD'
	            }, function (data) {
	                if (data.State == 1) {
	                    exchangeRate = data.Data.rate_exchangeRate
	                }
	            })
	        }
	        
	    }
	})


    //费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
	    'typeId': 6,
	    'companyId': companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    for (var i = 0; i < _data.length; i++) {
	        _feeItemArr.push(_data[i].puda_id + ';' + _data[i].puda_name_cn + ' / ' + _data[i].puda_name_en)
	    }
	}, function (error) {
	}, 1000)

	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    //console.log(data)
	    var _data = data.data;
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<option value="' + _data[i].comp_id + '" data-contactName="' + _data[i].comp_contactName + '">' + _data[i].comp_name + '</option>';
	            $('#crmuser').append(_html)
	        }
	        $("#crmuser").select2({
	            language: "zh-CN",
	            minimumInputLength: 2
	        });
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

	$("#crmuser").change(function () {
	    $("#crmCompanyName").text($('#crmuser option:selected').text())
	    $("#crmCompanyContact").text($("#crmuser").find("option:selected").attr("data-contactName"))
	})

	common.ajax_req("get", false, dataUrl, "remark.ashx?action=read", {
	    "companyId": companyID,
	    "typeCode": 'bank'
	}, function (data) {
	    //console.log(data)
	    var _data = data.data;
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<option value="' + _data[i].rema_id + '" data-remarkContent="' + _data[i].rema_content + '">' + _data[i].rema_type + '</option>';
	            $('#bank').append(_html)
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

	$("#bank").change(function () {
	    $("#bank_content").html(HtmlEncode($("#bank").find("option:selected").attr("data-remarkContent")))
	})

	common.ajax_req("get", false, dataUrl, "remark.ashx?action=read", {
	    "companyId": companyID,
	    "typeCode": 'others'
	}, function (data) {
	    //console.log(data)
	    var _data = data.data;
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<option value="' + _data[i].rema_id + '" data-remarkContent="' + _data[i].rema_content + '">' + _data[i].rema_type + '</option>';
	            $('#beizhu').append(_html)
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

	$("#beizhu").change(function () {
	    $("#beizhu_content").html(HtmlEncode($("#beizhu").find("option:selected").attr("data-remarkContent")))
	})
	

	function GetStatement(timeType, timeWhich, crmId)
	{
	    $('#timePrint').text(getDate())
	    if (timeType == 1) {
	        $('#timeType').text('离港日期')
	    } else if (timeType == 2) {
	        $('#timeType').text('工作单日期')
	    } else {
	        $('#timeType').text('截关日期')
	    }
	    if (timeWhich == 1) {
	        $('#timeFromTo').text($('#month').val())
	    } else {
	        $('#timeFromTo').text('从' + $('#date1').val() + '到' + $('#date2').val())
	    }

	    $('#statement_data').empty()
	    $('#allProfit').empty()
	    $('#allCount').empty()
	    $('#allBili').empty()

	    common.ajax_req('GET', false, dataUrl, 'booking.ashx?action=read', {
	        'companyId': companyID,
	        'crmId': crmId,
	        'state': 21,
	        'timeType': timeType,
	        'timeWhich': timeWhich,
	        'time0': $('#month').val(),
	        'time1': $('#date1').val(),
	        'time2': $('#date2').val()
	    }, function (data) {
	        //console.log(data)
	        if (data.data != null) {

	            //var all_USD = 0, all_OWNER = 0, all_OWNER_ALL = 0
	            //for (i in data.data) {
	            //    var feeUnit = data.data[i]["bofe_feeUnit"]
	            //    if (feeUnit == 'USD') {
	            //        all_USD = all_USD + data.data[i]["bofe_allFee"]
	            //    } else if (feeUnit == OWNER_Unit && OWNER_Unit != 'USD') {
	            //        all_OWNER = all_OWNER + data.data[i]["bofe_allFee"]
	            //    }
	            //}

	            //all_OWNER_ALL = all_USD * exchangeRate + all_OWNER
	            //console.log(all_USD)
	            //console.log(all_OWNER)
	            //console.log(all_OWNER_ALL)
	            //$('#allPrice').text(all_OWNER_ALL)
	            //$('#allCount').text(data.data.length)

	            var all_ALL = 0
	            var all_ALL_fu = 0
	            var all_USD_ALL = 0
	            var all_OWNER_ALL = 0
	            var all_USD_ALL_fu = 0
	            var all_OWNER_ALL_fu = 0
	            for (i in data.data) {
	                var all_USD = 0, all_OWNER = 0, all_USD_fu = 0, all_OWNER_fu = 0
	                common.ajax_req('GET', false, dataUrl, 'booking.ashx?action=readfee', {
	                    'bookingId': data.data[i]["book_id"],
	                    //'feeType': 'debit',
	                    'state': 0,
	                }, function (data) {
	                    if (data.State == 1) {
	                        for (j in data.Data) {
	                            var feeUnit = data.Data[j]["bofe_feeUnit"]
	                            if (data.Data[j]["bofe_feeType"] == 'debit') {
	                                if (feeUnit == 'USD') {
	                                    all_USD = all_USD + data.Data[j]["bofe_allFee"]
	                                    all_USD_ALL = all_USD_ALL + data.Data[j]["bofe_allFee"]
	                                    //$('#statement_data').text()
	                                } else if (feeUnit == OWNER_Unit && OWNER_Unit != 'USD') {
	                                    all_OWNER = all_OWNER + data.Data[j]["bofe_allFee"]
	                                    all_OWNER_ALL = all_OWNER_ALL + data.Data[j]["bofe_allFee"]
	                                }
	                            } else {
	                                if (feeUnit == 'USD') {
	                                    all_USD_fu = all_USD_fu + data.Data[j]["bofe_allFee"]
	                                    all_USD_ALL_fu = all_USD_ALL_fu + data.Data[j]["bofe_allFee"]
	                                } else if (feeUnit == OWNER_Unit && OWNER_Unit != 'USD') {
	                                    all_OWNER_fu = all_OWNER_fu + data.Data[j]["bofe_allFee"]
	                                    all_OWNER_ALL_fu = all_OWNER_ALL_fu + data.Data[j]["bofe_allFee"]
	                                }
	                            }

	                            
	                        }
	                    }

	                })

	                var dateNum = 0
	                var book_truePortTime = ""
	                if (data.data[i]["book_truePortTime"] != null) {
	                    dateNum = daysDistance(data.data[i]["book_truePortTime"].substring(0, 10), getDate())
	                    book_truePortTime = data.data[i]["book_truePortTime"].substring(0, 10)
	                }
	                
	                var mingxi = ""
	                common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
	                    'bookingId': data.data[i]["book_id"],
	                    'state': 0,
	                }, function (data) {
	                    //console.log(data.Data)
	                    if (data.State == 1) {
	                        //初始化信息
	                        var _data = data.Data
	                        for (var i = 0; i < _data.length; i++) {
	                            mingxi += '<tr><td>' + (i + 1) + '</td><td>' + _data[i].comp_name + '</td><td>' + _getFeeItemFun(_data[i].bofe_feeItem) + '</td><td>' + _data[i].bofe_feeUnit + '</td><td>' + _data[i].bofe_fee + '</td><td>' + _data[i].bofe_num + '</td><td>' + _data[i].bofe_numUnit + '</td><td>' + _data[i].bofe_allFee + '</td></tr>'
	                        }
	                    }
	                }, function (err) {
	                    console.log(err)
	                }, 1000)

	                var _html = '<tr><td>' + data.data[i]["book_orderCode"] + '</td><td>' + book_truePortTime + '</td><td>' + data.data[i]["book_billCode"] + '</td><td>' + data.data[i]["book_port1"] + '</td><td>' + data.data[i]["book_port2"] + '</td><td>' + data.data[i]["book_movementType"] + '/' + data.data[i]["book_allContainer"] + '</td><td id="USD_Price">' + all_USD + '</td><td class="OWNER_Unit" id="OWNER_Price">' + all_OWNER + '</td><td id="USD_Price">' + all_USD_fu + '</td><td class="OWNER_Unit" id="OWNER_Price">' + all_OWNER_fu + '</td><td>' + dateNum + '</td></tr><tr><td colspan="11" class="mingxi"><table cellspacing="0" width="100%"><tr><thead><th width="5%">序号</th><th width="30%">客户</th><th width="30%">费用项目</th><th width="5%">币种</th><th width="5%">金额</th><th width="5%">数量</th><th width="5%">单位</th><th width="5%">总额</th></tr></thead><tbody>' + mingxi + '</tbody></table></td></tr>';

	                $('#statement_data').append(_html)

	                //var d_USD = 0, d_OWNER = 0, d_OWNER_ALL = 0
	                //for (j in obj2[i]) {
	                //    var USD = 0, OWNER = 0, OWNER_ALL = 0
	                //    for (k in obj2[i][j]) {
	                //        var feeUnit = obj2[i][j][k]["bofe_feeUnit"]
	                //        if (feeUnit == 'USD') {
	                //            USD = USD + obj2[i][j][k]["bofe_allFee"]
	                //        } else if (feeUnit == OWNER_Unit && OWNER_Unit != 'USD') {
	                //            OWNER = OWNER + obj2[i][j][k]["bofe_allFee"]
	                //        }
	                //    }
	                //    OWNER_ALL = USD*exchangeRate + OWNER
	                //    $('.item:last').append('<div style="width:100%;"><div style="float:left;width:25%;">' + j + '</div><div style="float:left;width:25%;">' + USD + '</div><div style="float:left;width:25%;">' + OWNER + '</div><div style="float:left;width:25%;">' + OWNER_ALL + '</div></div>')
	                //    d_USD = d_USD + USD
	                //    d_OWNER = d_OWNER + OWNER
	                //    d_OWNER_ALL = d_OWNER_ALL + OWNER_ALL
	                //}
	                //$('.d_num:last').text(d_USD)
	                //$('.d_profit:last').text(d_OWNER)
	                //$('.d_bili:last').text(d_OWNER_ALL)
	                
	            }

	            all_ALL = all_USD_ALL * exchangeRate + all_OWNER_ALL
	            all_ALL_fu = all_USD_ALL_fu * exchangeRate + all_OWNER_ALL_fu

	            $('#allUSDPrice').text(all_USD_ALL)
	            $('#allOWNPrice').text(all_OWNER_ALL)
	            $('#allUSDPrice_fu').text(all_USD_ALL_fu)
	            $('#allOWNPrice_fu').text(all_OWNER_ALL_fu)
	            $('#allPrice').text((all_ALL-all_ALL_fu).toFixed(2))
	            $('#allCount').text(data.data.length)
	        }

	    }, function (error) {
	        //console.log(parm)
	    }, 1000)
	}

	$('#ordermore').on('click', function () {
	    if ($("#ordermore").is(":checked")) {
	        $(".mingxi").show()
	    }
	    else { $(".mingxi").hide() }
	})

});

function _getFeeItemFun(o) {
    //console.log("111111111111111111111111111111111111")
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
