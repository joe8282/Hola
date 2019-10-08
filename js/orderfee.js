//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "订单费用管理", 
            "con_top_4" : "订单详情",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENTe",   
            "con_top_3" : "Order Fee Manage", 
            "con_top_4" : "Order Detail", 
        };
        

$(function(){
	$('.navli3').addClass("active open")
	$('.book3').addClass("active")

	this.title = get_lan('con_top_3')
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3'))

//	var crmCompanyId = '0',crmContactId = '0';
//	if(GetQueryString('crmId')!=null){
//		crmCompanyId=GetQueryString('crmId')
//		_selectSupplier(crmCompanyId)
//		_selectBill(crmCompanyId)
//	}

	var Id = GetQueryString('Id');
	var _toCompany='',_feeItem='',_feeUnit='',_numUnit='';
	var oTable, invoiceTable, billPayTable, billGetTable, gysBillTable, filesTable;
	var orderCode;
	var crmId;
	//加载订单信息
	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
		"Id": Id
	}, function(data) {
		console.log(data.Data)
		//初始化信息
		var _data = data.Data
		orderCode = _data.book_orderCode
		$('#title3').html('订单号：' + _data.book_orderCode)
		$('#ordercode').val(orderCode)
		crmId = _data.book_crmCompanyId
	}, function(err) {
		console.log(err)
	}, 1000)
	
	
    //费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
			//$('#feeItem').append(_html)
			_feeItem=_feeItem+_html
		}
	}, function(error) {
	}, 1000)
		
	//币种
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			//$('#feeUnit').append(_html)
			_feeUnit=_feeUnit+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)		
	
	//单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readunit', {
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			//$('#numUnit').append(_html)
			_numUnit=_numUnit+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
		
	//结算公司
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		"companyId": companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
				_toCompany = _toCompany + _html
			}
		}
	}, function(err) {
		console.log(err)
	}, 2000)

    	
    //加载费用
    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    	"bookingId": Id
    }, function(data) {
    	console.log(data.Data)
    	if(data.State == 1) {
    		$(".feeAll").empty()
    		var _data = data.Data;
    		for(var i = 0; i < _data.length; i++) {
    			//var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
    			var feilist = '<div class="col-sm-12 feeList"><button type="submit" class="removeFee btn btn-blue" style="width:30px;float: left;">-</button>' +
    				'<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="' + _data[i].bofe_feeType + '">' + _data[i].bofe_feeType + '</option></select>' +
    				'<select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:200px; float: left;"></select>' +
    				'<select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
    				'<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
    				'<input type="email" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + _data[i].bofe_fee + '" style="width:100px; float: left;">' +
    				'<input type="email" class="form-control margin-right-5" id="feeNum" placeholder="" value="' + _data[i].bofe_num + '" style="width:100px; float: left;">' +
    				'<select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
    				'<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_allFee + '</label>' + 
    				'<input type="email" class="form-control margin-right-5" id="receiptRate" placeholder="" value="' + _data[i].bofe_receiptRate+ '" style="width:100px; float: left;">' +
    				'<label for="inputPassword3" id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_settlementRate + '</label>' + 
    				'<select id="receiptFeeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
    				'<input type="email" class="form-control margin-right-5" id="receiptFee" placeholder="" value="' + _data[i].bofe_receiptFee+ '" style="width:100px; float: left;">' +
    				'<input type="email" class="form-control margin-right-5" id="feeBeizhu" value="' + _data[i].bofe_beizhu + '" placeholder="" style="width:100px; float: left;">'+
    				'<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_cancelMoney + '</label>' + 
    				'<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_receiptNumber + '</label>' + 
    				'<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_invoiceNumber + '</label>' + 
    				'<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_cancelTime + '</label>'
    
    			$(".feeAll").append(feilist)
    			$('.feeList').eq(i).find('#toCompany').html(_toCompany)
    			$('.feeList').eq(i).find('#toCompany').val(_data[i].bofe_toCompany).trigger("change")
    			$('.feeList').eq(i).find('#feeItem').html(_feeItem)
    			$('.feeList').eq(i).find('#feeItem').val(_data[i].bofe_feeItem).trigger("change")
    			$('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
    			$('.feeList').eq(i).find('#feeUnit').val(_data[i].bofe_feeUnit).trigger("change")
    			$('.feeList').eq(i).find('#receiptFeeUnit').html(_feeUnit)
    			$('.feeList').eq(i).find('#receiptFeeUnit').val(_data[i].bofe_receiptFeeUnit).trigger("change")
    			$('.feeList').eq(i).find('#numUnit').html(_numUnit)
    			$('.feeList').eq(i).find('#numUnit').val(_data[i].bofe_numUnit).trigger("change")
    		}
    	}
    
    }, function(err) {
    	console.log(err)
    }, 4000)


    //账单列表
    function GetBill() {
        var table = $("#example").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&bookingId=' + Id,
            'bPaginate': false,
            "bInfo": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
            "bFilter": false,
            "bSort": false,
            "aaSorting": [[0, "desc"]],
            //		"bProcessing": true,
            "aoColumns": [
                { "mDataProp": "comp_name" },
                { "mDataProp": "bill_payNumber" },
			    {
			        "mDataProp": "bill_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.bill_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "bill_payPrice" },
                { "mDataProp": "bill_payPrice" },
                { "mDataProp": "bill_state" },
                {
                    "mDataProp": "bill_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='#'>发票</a>")
                        } else {
                            //$(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id=" + sData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
            ]
        });
        return table;
    }

    //发票列表
    function GetInvoice() {
        var table = $("#InvoiceList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/invoice.ashx?action=read&bookingId=' + Id,
            'bPaginate': false,
            "bInfo": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
            "bFilter": false,
            "bSort": false,
            "aaSorting": [[0, "desc"]],
            //		"bProcessing": true,
            "aoColumns": [
                { "mDataProp": "comp_name" },
                { "mDataProp": "invo_number" },
                { "mDataProp": "invo_format" },
			    {
			        "mDataProp": "invo_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.invo_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "invo_feeUnit" },
                { "mDataProp": "invo_state" },
                {
                    "mDataProp": "invo_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            //$(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id=" + sData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
            ]
        });
        return table;
    }

    //付款申请列表
    function GetBillPay() {
        var table = $("#billPayList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&typeId=3&bookingId=' + Id,
            'bPaginate': false,
            "bInfo": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
            "bFilter": false,
            "bSort": false,
            "aaSorting": [[0, "desc"]],
            //		"bProcessing": true,
            "aoColumns": [
                { "mDataProp": "comp_name" },
                { "mDataProp": "bill_payNumber" },
                { "mDataProp": "bill_invoiceNumber" },
			    {
			        "mDataProp": "bill_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.bill_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "bill_payPrice" },
                { "mDataProp": "bill_state" },
                {
                    "mDataProp": "bill_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            //$(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id=" + sData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
            ]
        });
        return table;
    }

    //收款销账列表
    function GetBillGet() {
        var table = $("#billGetList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&typeId=4&bookingId=' + Id,
            'bPaginate': false,
            "bInfo": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
            "bFilter": false,
            "bSort": false,
            "aaSorting": [[0, "desc"]],
            //		"bProcessing": true,
            "aoColumns": [
                { "mDataProp": "comp_name" },
                { "mDataProp": "bill_payNumber" },
                { "mDataProp": "bill_bank" },
			    {
			        "mDataProp": "bill_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.bill_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "bill_payPrice" },
                { "mDataProp": "bill_state" },
                {
                    "mDataProp": "bill_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            //$(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id=" + sData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
            ]
        });
        return table;
    }

    //收款销账列表
    function GetGYSBill() {
        var table = $("#gysBillList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/supplierbill.ashx?action=read&bookingId=' + Id,
            'bPaginate': false,
            "bInfo": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
            "bFilter": false,
            "bSort": false,
            "aaSorting": [[0, "desc"]],
            //		"bProcessing": true,
            "aoColumns": [
                { "mDataProp": "comp_name" },
                { "mDataProp": "subi_number" },
			    {
			        "mDataProp": "subi_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.subi_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "subi_state" },
                {
                    "mDataProp": "subi_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")

                    }
                },
            ]
        });
        return table;
    }

    //文件列表
    function GetFiles() {
        var table = $("#filesList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/files.ashx?action=read&bookingId=' + Id,
            'bPaginate': false,
            "bInfo": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
            "bFilter": false,
            "bSort": false,
            "aaSorting": [[0, "desc"]],
            //		"bProcessing": true,
            "aoColumns": [
			    {
			        "mDataProp": "file_bookingId",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(orderCode);
			        }
			    },
                { "mDataProp": "file_name" },
			    {
			        "mDataProp": "file_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.file_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "usin_name" },
                {
                    "mDataProp": "file_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>发票</a>")

                    }
                },
            ]
        });
        return table;
    }

    //费用明细
    function _getFee(toCompany) {
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "toCompany": toCompany
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee00").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    var feelist = '<div class="margin-left-40 margin-top-10">' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" /></label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_feeItem + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_num + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_receiptRate + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_receiptFeeUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_receiptFee + '</label>' +
                                    '</div>'
                    $(".fee00").prepend(feelist)
                }
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }
    //账单费用明细
    function _getFee3(toCompany) {
        common.ajax_req("get", false, dataUrl, "bill.ashx?action=readbillfee", {
            "toCompany": toCompany
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee33").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    var feelist = '<div class="margin-left-40 margin-top-10">' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bife_id + '" /></label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bill_payNumber + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_feeItem + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_num + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_receiptRate + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_receiptFeeUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_receiptFee + '</label>' +
                                    '</div>'
                    $(".fee33").prepend(feelist)
                }
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }
    //账单费用明细
    function _getFee4(toCompany) {
        common.ajax_req("get", false, dataUrl, "bill.ashx?action=readbillfee", {
            "toCompany": toCompany
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee44").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    var feelist = '<div class="margin-left-40 margin-top-10">' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bife_id + '" /></label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bill_payNumber + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:12%; float: left;">' + _data[i].bofe_feeItem + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_num + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:12%; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
                                    '</div>'
                    $(".fee44").prepend(feelist)
                }
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }
    //账单费用明细
    function _getFee6(toCompany) {
        common.ajax_req("get", false, dataUrl, "bill.ashx?action=readbillfee", {
            "toCompany": toCompany
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee66").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    var feelist = '<div class="margin-left-40 margin-top-10">' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bife_id + '" /></label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_outCode + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_feeItem + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:8%; float: left;">' + _data[i].bofe_num + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">&nbsp;</label>' +
                                        '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">&nbsp;</label>' +
                                    '</div>'
                    $(".fee66").prepend(feelist)
                }
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }


    oTable = GetBill();
    billPayTable = GetBillPay()
    billGetTable = GetBillGet()
    invoiceTable = GetInvoice()
    gysBillTable = GetGYSBill()
    filesTable = GetFiles()

    $('.shoufutab').on('click', function () {
        $('#send_shoufu').removeClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')
    })
    $('.billtab').on('click', function () {
        $('#send_bill').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        $('#toCompany2').append(_toCompany)
        $("#toCompany2").change(function () {
            _getFee($('#toCompany2').val())
        })
    })
    $('.invoicetab').on('click', function () {
        $('#send_invoice').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        $('#unit3').append(_feeUnit)
        $('#toCompany3').append(_toCompany)
        $("#toCompany3").change(function () {
            _getFee3($('#toCompany3').val())
        })
    })
    $('.billpaytab').on('click', function () {
        $('#send_bill_pay').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        $('#toCompany4').append(_toCompany)
        $("#toCompany4").change(function () {
            _getFee4($('#toCompany4').val())
        })
    })
    $('.billgettab').on('click', function () {
        $('#send_bill_get').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        $('#toCompany5').append(_toCompany)
        $("#toCompany5").change(function () {
            _getFee4($('#toCompany5').val())
        })
    })
    $('.gysbilltab').on('click', function () {
        $('#send_bill_gys').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_file').addClass('none')

        //供应商
        common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
            "upId": crmId
        }, function (data) {
            var _data = data.data;
            console.log(_data)
            if (_data != null) {
                for (var i = 0; i < _data.length; i++) {
                    var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
                    $('#toCompany6').append(_html)
                }
            }
            $("#toCompany6").change(function () {
                _getFee6($('#toCompany6').val())
            })
        }, function (err) {
            console.log(err)
        }, 2000)
    })
    $('.filetab').on('click', function () {
        $('#send_file').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
    })

	//添加应收应付
	$('#addFee1').on('click', function() {
		var feeboxRow = '<div class="col-sm-12 feeList"><button type="submit" class="removeFee btn btn-blue" style="width:30px;float: left;">-</button><select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="应收">应收</option></select><select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:200px; float: left;"></select><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="email" class="form-control margin-right-5" id="feePrice" placeholder="" value="0" style="width:100px; float: left;"><input type="email" class="form-control margin-right-5" id="feeNum" value="0" placeholder="" style="width:100px; float: left;"><select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><input type="email" class="form-control margin-right-5" id="receiptRate" value="0" placeholder="" style="width:100px; float: left;"><label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><select id="receiptFeeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="email" class="form-control margin-right-5" id="receiptFee" value="0" placeholder="" style="width:100px; float: left;"><input type="email" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;"><label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'		
		$('.feeAll').append(feeboxRow)
		//feeboxRow = feeboxRow.clone()
		//货代公司
		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
		$('.feeList:last').find('#toCompany').append(_toCompany)	
//		//费用类型
		$('.feeList:last').find('#feeItem').append(_feeItem)
//		//币种
		$('.feeList:last').find('#feeUnit').append(_feeUnit)
//      币种
		$('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
//		//单位
		$('.feeList:last').find('#numUnit').append(_numUnit)
		
	})
	$('#addFee2').on('click', function() {	
		var feeboxRow = '<div class="col-sm-12 feeList"><button type="submit" class="removeFee btn btn-blue" style="width:30px;float: left;">-</button><select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="应付">应付</option></select><select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:200px; float: left;"></select><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="email" class="form-control margin-right-5" id="feePrice" placeholder="" value="0" style="width:100px; float: left;"><input type="email" class="form-control margin-right-5" id="feeNum" value="0" placeholder="" style="width:100px; float: left;"><select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><input type="email" class="form-control margin-right-5" id="receiptRate" value="0" placeholder="" style="width:100px; float: left;"><label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><select id="receiptFeeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="email" class="form-control margin-right-5" id="receiptFee" value="0" placeholder="" style="width:100px; float: left;"><input type="email" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;"><label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'	
		$('.feeAll').append(feeboxRow)
		//feeboxRow = feeboxRow.clone()
		//货代公司
		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
		$('.feeList:last').find('#toCompany').append(_toCompany)	
//		//费用类型
		$('.feeList:last').find('#feeItem').append(_feeItem)
//		//币种
		$('.feeList:last').find('#feeUnit').append(_feeUnit)
//      币种
		$('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)		
//		//单位
		$('.feeList:last').find('#numUnit').append(_numUnit)
		
	})	
	$('.feeAll').delegate('.removeFee', 'click', function() {
		$(this).parents('.feeList').remove()
	})
	
	
	/*保存应收应付*/
	$('#send_shoufu').on('click', function () {
		var feeData=''
		for(var i = 0; i < $('.feeList').length; i++) {
			var toCompany = $('.feeList').eq(i).find('#toCompany').val()
			var feeItem = $('.feeList').eq(i).find('#feeItem').val()
			var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
			var numUnit = $('.feeList').eq(i).find('#numUnit').val()
			var feeType = $('.feeList').eq(i).find('#feeType').val()
			var feeNum = $('.feeList').eq(i).find('#feeNum').val()
			var feePrice = $('.feeList').eq(i).find('#feePrice').val()
			var receiptRate = $('.feeList').eq(i).find('#receiptRate').val()
			var receiptFeeUnit = $('.feeList').eq(i).find('#receiptFeeUnit').val()
			var receiptFee = $('.feeList').eq(i).find('#receiptFee').val()
			var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()
		
			var feeoneData = feeType + ',' + toCompany + ',' + feeItem + ',' + feeUnit + ',' + feeNum + ',' + feePrice + ',' + numUnit + ',' + receiptRate + ',' + receiptFeeUnit + ',' + receiptFee + ',' + feeBeizhu + ';'
			feeData = feeData + feeoneData
		}
		console.log(feeData)
		
		var parm = {
			'bookingId': Id,
			'userId': userID,
			'feeData': feeData
		}
		console.log(parm)
		common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfee', parm, function(data) {
			if(data.State == 1) {
				comModel("保存成功")
			} else {
				comModel("保存失败")
			}
		}, function(error) {
			console.log(parm)
		}, 2000)
	
	});

    /*新增账单*/
	$('#send_bill').on('click', function () {
	    var feedata = [];
	    $("input[name='feeli']:checked").each(function (index, item) {
	        feedata.push($(this).val());
	    });
	    var feeItem = "";
	    if (feedata.toString() != '') {
	        feeItem = feedata.toString()
	    }
	    if (feeItem == "") {
	        comModel("请选择费用项目！")
	    } else if ($('#payNumber').val() == "") {
	        comModel("请填写账单号码！")
	    }else{
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany2').val(),
	            'payNumber': $('#payNumber').val(),
	            'typeId': $("input[name='radio1']:checked").val(),
	            'bank': $('#bank').val(),
	            'beizhu': $('#beizhu').val(),
	            'addtime': $('#id-date-picker-1').val(),
	            'feeItem': feeItem
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'bill.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("新增成功")
	                oTable.fnReloadAjax(oTable.fnSettings());
	            } else {
	                comModel("新增失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

    /*保存发票*/
	$('#send_invoice').on('click', function () {
	    var feedata = [];
	    $("input[name='feeli']:checked").each(function (index, item) {
	        feedata.push($(this).val());
	    });
	    var feeItem = "";
	    if (feedata.toString() != '') {
	        feeItem = feedata.toString()
	    }
	    if (feeItem == "") {
	        comModel("请选择账单！")
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany3').val(),
	            'number': $('#number').val(),
	            'feeUnit': $('#unit3').val(),
	            'format': $('#iformat').val(),
	            'vesselName': $('#vesselName').val(),
	            'voyage': $('#voyage').val(),
	            'port1': $('#port1').val(),
	            'port2': $('#port2').val(),
	            'invoiceTitle': $('#invoiceTitle').val(),
	            'invoiceTaxNumber': $('#invoiceTaxNumber').val(),
	            'invoiceAddressTel': $('#invoiceAddressTel').val(),
	            'invoiceBrank': $('#invoiceBrank').val(),
	            'invoiceNumber': $('#invoiceNumber').val(),
	            'logistics': $('#logistics').val(),
	            'logisticsAddress': $('#logisticsAddress').val(),
	            'logisticsContact': $('#logisticsContact').val(),
	            'logisticsTel': $('#logisticsTel').val(),
	            'logisticsNumber': $('#logisticsNumber').val(),
	            'addtime': $('#id-date-picker-invoice').val(),
	            'feeItem': feeItem
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'invoice.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("保存成功")
	                invoiceTable.fnReloadAjax(invoiceTable.fnSettings());
	            } else {
	                comModel("保存失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

    /*新增付款申请*/
	$('#send_bill_pay').on('click', function () {
	    var feedata = [];
	    $("input[name='feeli']:checked").each(function (index, item) {
	        feedata.push($(this).val());
	    });
	    var feeItem = "";
	    if (feedata.toString() != '') {
	        feeItem = feedata.toString()
	    }
	    if (feeItem == "") {
	        comModel("请选择账单！")
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany4').val(),
	            'payNumber': $('#payNumber4').val(),
	            'typeId': 3,
	            'invoiceNumber': $('#invoiceNumber4').val(),
	            'payType': $('#payType').val(),
	            'payPrice': $('#payPrice').val(),
	            'beizhu': $('#beizhu4').val(),
	            'addtime': $('#id-date-picker-2').val(),
	            'feeItem': feeItem
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'bill.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("保存成功")
	                billPayTable.fnReloadAjax(billPayTable.fnSettings());
	            } else {
	                comModel("保存失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});


    /*新增收款销账*/
	$('#send_bill_get').on('click', function () {
	    var feedata = [];
	    $("input[name='feeli']:checked").each(function (index, item) {
	        feedata.push($(this).val());
	    });
	    var feeItem = "";
	    if (feedata.toString() != '') {
	        feeItem = feedata.toString()
	    }
	    if (feeItem == "") {
	        comModel("请选择账单！")
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany5').val(),
	            'payNumber': $('#payNumber5').val(),
	            'typeId': 4,
	            'bank': $('#bank5').val(),
	            'payPrice': $('#payPrice5').val(),
	            'beizhu': $('#beizhu5').val(),
	            'addtime': $('#id-date-picker-3').val(),
	            'feeItem': feeItem
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'bill.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("保存成功")
	                billGetTable.fnReloadAjax(billGetTable.fnSettings());
	            } else {
	                comModel("保存失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});


    /*新增供应商账单*/
	$('#send_bill_gys').on('click', function () {
	    var feedata = [];
	    $("input[name='feeli']:checked").each(function (index, item) {
	        feedata.push($(this).val());
	    });
	    var feeItem = "";
	    if (feedata.toString() != '') {
	        feeItem = feedata.toString()
	    }
	    if (feeItem == "") {
	        comModel("请选择费用项目！")
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany6').val(),
	            'payNumber': $('#payNumber6').val(),
	            'addtime': $('#id-date-picker-6').val(),
	            'feeItem': feeItem
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'supplierbill.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("保存成功")
	                gysBillTable.fnReloadAjax(gysBillTable.fnSettings());
	            } else {
	                comModel("保存失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

    /*新增文件*/
	$('#send_file').on('click', function () {
	    if ($('#filename').val() == "") {
	        comModel("请填写文件名称！")
	    } else if ($("#Pname").val() == "") {
	        comModel("请选择上传的文件！")
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'typeId': 1,
	            'name': $('#filename').val(),
	            "url": $("#Pname").val()
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'files.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("新增成功")
	                filesTable.fnReloadAjax(filesTable.fnSettings());
	            } else {
	                comModel("新增失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

    // 选择图片  
	$("#img").on("change", function () {
	    var img = event.target.files[0];
	    // 判断是否图片  
	    if (!img) {
	        return;
	    }

	    // 判断图片格式  
	    if (!(img.type.indexOf('image') == 0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name))) {
	        alert('图片只能是jpg,gif,png');
	        return;
	    }

	    var reader = new FileReader();
	    reader.readAsDataURL(img);

	    reader.onload = function (e) { // reader onload start  
	        // ajax 上传图片  
	        $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, action: 'fee' }, function (ret) {
	            if (ret.State == '100') {
	                //alert(ret.Picurl);
	                $('#showimg').attr('src', ret.Picurl);
	                $('#Pname').val(ret.Pname);
	                //$('#showimg').html('<img src="' + ret.Data + '">');
	            } else {
	                alert('上传失败');
	            }
	        }, 'json');
	    } // reader onload end  
	})

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


