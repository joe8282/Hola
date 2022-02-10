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

var _feeItemArr = new Array();
var oTable, invoiceTable, billPayTable, billGetTable, gysBillTable, filesTable;
var toYingFuUser = 0;
var exchangeRate;
var cancel_all_money = 0;
var cancel_type = 1;
var toCompany_yingfu = 0, toCompany_yingshou = 0

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
    var _toCompany='',_feeItem='',_feeUnit='',_numUnit='', _remaItem='';
    var allprofit=0
    var _toCompanySettleArr=new Array();
    var _htmlCompanySettle='';
    var _CompanySettle = '';

	var orderCode;
	var crmId;
    var forwarder_id;
    var localCurrency;
    var containerType;    
    var _arrExchangeRate= new Array();
    var _arrfee00dataGather_toString;

    initLocalchargeListTable();

    //转回到订单详情
    $('#orderDetail').on('click', function() {
        location.href = 'orderadd.html?action=modify&Id='+Id;
    })

    common.ajax_req("get", false, dataUrl, "weiinfo.ashx?action=read", {
        "companyId": companyID
    }, function(data) {
        //console.log(data.Data)
        //初始化信息
        var _data = data.Data
        localCurrency=_data.wein_currency;
    }, function(err) {
        console.log(err)
    }, 2000)

    common.ajax_req("get", true, dataUrl, "remark.ashx?action=read", {
        "typeCode": "bank",
        "companyId": companyID
    }, function(data) {
        //console.log(data.Data)
        //初始化信息
        var _data = data.data

        for(var i = 0; i < _data.length; i++) {
            var _html = '<option value="' + _data[i].rema_id + '">' + _data[i].rema_type +'</option>';
            $('#bank').append(_html)
            $('#bank5').append(_html)
        }
    }, function(err) {
        console.log(err)
    }, 2000)

	//加载订单信息
	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readbyid", {
		"Id": Id
	}, function(data) {
		console.log(data.Data)
		//初始化信息
		var _data = data.Data
		orderCode = _data.book_orderCode
		$('#title3').html('订单号：' + _data.book_orderCode)
		$('#ordercode').val(orderCode)
		crmId = _data.book_crmCompanyId;
		console.log(crmId)
		containerType = _data.book_allContainer;
		forwarder_id = _data.book_forwarder;
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
			var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' / '+_data[i].puda_name_en+'</option>';
			//$('#feeItem').append(_html)
			_feeItem=_feeItem+_html
            _feeItemArr.push(_data[i].puda_id+';'+_data[i].puda_name_cn+' / '+_data[i].puda_name_en)
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
            $('#toCompanyLocal').append(_toCompany)
            $('#toCompany_6').append(_toCompany)
            $("#toCompany_6").select2({
                language: "zh-CN",
                minimumInputLength: 2
            });
		}
	}, function(err) {
		console.log(err)
	}, 2000)

    /////计算付款申请里面的付款金额的总额。
    $('.fee44').delegate("input[name='feeli']", 'click', function () {
        var fee44data = [];
        var fee44dataTostring = [];
        var _arrFee44Unit = [];
        var z="0";
        var fee44dataCurrency;
        var _arrFee44dataAmount=[];
        var _arrFee44dataGather=[];
        $(".fee44 input[name='feeli']:checked").each(function (index, item) {
            fee44data.push($(this).attr("getUnit")+" "+$(this).attr("getAllfee"));
            if($.inArray($(this).attr("getUnit"), _arrFee44Unit)==-1){
                _arrFee44Unit.push($(this).attr("getUnit"));
            }
        });

        if(_arrFee44Unit.length>1){
            _arrFee44dataGather=[];
            for(var i = 0; i < _arrFee44Unit.length; i++) {

                $(".fee44 input[name='feeli']:checked").each(function(){
                    if($(this).attr("getUnit")==_arrFee44Unit[i]){
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            z=+z*1+(+$(this).attr("getAllfee"))*1;
                    }
                })
                _arrFee44dataAmount.push(z.toFixed(2));
                fee44dataCurrency=fee44dataCurrency+_arrFee44Unit[i]+" "+(i>0?parseFloat(+_arrFee44dataAmount[i] - +_arrFee44dataAmount[i-1]).toFixed(2):parseFloat(_arrFee44dataAmount[i]).toFixed(2))+", ";
                _arrFee44dataGather.push(_arrFee44Unit[i]+" "+(i>0?parseFloat(+_arrFee44dataAmount[i] - +_arrFee44dataAmount[i-1]).toFixed(2):parseFloat(_arrFee44dataAmount[i]).toFixed(2)));
            }
            $("#payPrice").val(_arrFee44dataGather.toString())
        }else if(_arrFee44Unit.length==0){
            $("#payPrice").val("")
        }else{
            _arrFee44dataGather=[];
            $(".fee44 input[name='feeli']:checked").each(function(){
                        //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                z=+z*1+(+$(this).attr("getAllfee"))*1;
            })
            _arrFee44dataGather.push(_arrFee44Unit[0]+" "+z);
            $("#payPrice").val(_arrFee44dataGather.toString())
        }
    })

        /////计算账单制作里面的付款金额的总额。
    $('.fee00').delegate("input[name='feeli']", 'click', function () {
        var fee00data = [];
        var fee00dataTostring = [];
        var _arrfee00Unit = [];
        var z="0";
        var fee00dataCurrency;
        var _arrfee00dataAmount=[];
        var _arrfee00dataGather=[];
        $(".fee00 input[name='feeli']:checked").each(function (index, item) {
            fee00data.push($(this).attr("getUnit")+" "+$(this).attr("getAllfee"));
            if($.inArray($(this).attr("getUnit"), _arrfee00Unit)==-1){
                _arrfee00Unit.push($(this).attr("getUnit"));
            }
        });

        if(_arrfee00Unit.length>1){
            _arrfee00dataGather=[];
            for(var i = 0; i < _arrfee00Unit.length; i++) {

                $(".fee00 input[name='feeli']:checked").each(function(){
                    if($(this).attr("getUnit")==_arrfee00Unit[i]){
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            z=+z*1+(+$(this).attr("getAllfee"))*1;
                    }
                })
                _arrfee00dataAmount.push(z.toFixed(2));
                fee00dataCurrency=fee00dataCurrency+_arrfee00Unit[i]+" "+(i>0?parseFloat(+_arrfee00dataAmount[i] - +_arrfee00dataAmount[i-1]).toFixed(2):parseFloat(_arrfee00dataAmount[i]).toFixed(2))+", ";
                _arrfee00dataGather.push(_arrfee00Unit[i]+" "+(i>0?parseFloat(+_arrfee00dataAmount[i] - +_arrfee00dataAmount[i-1]).toFixed(2):parseFloat(_arrfee00dataAmount[i]).toFixed(2)));
            }
            _arrfee00dataGather_toString=_arrfee00dataGather.toString();
        }else if(_arrfee00Unit.length==0){
            _arrfee00dataGather_toString="";
        }else{
            _arrfee00dataGather=[];
            $(".fee00 input[name='feeli']:checked").each(function(){
                        //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                z=+z*1+(+$(this).attr("getAllfee"))*1;
            })
            _arrfee00dataGather.push(_arrfee00Unit[0]+" "+z);
            _arrfee00dataGather_toString=_arrfee00dataGather.toString();
        }
    })


        /////计算收款销账里面的付款金额的总额。
    $('.fee55').delegate("input[name='feeli']", 'click', function () {
        
        console.log($(this).prop('checked'))
        if ($("#cancel_unit").val() == '') {
            comModel("请选择币种")
            $(this).prop("checked", false)
            return
        } else {
            var value_one = 0
            var value = $(this).attr("getAllfee");
            var value_unit = $(this).attr("getUnit")
            if (value_unit == $("#cancel_unit").val()) {
                value_one = value_one + value * 1
            } else {
                value_one = value_one + value * exchangeRate
            }
            if ($(this).prop('checked')) {
                //console.log($(this).parent().parent().find("label:eq(8)").html())
                $(this).parent().parent().find("label:eq(9)").text(value_one)
                $(this).attr("getCancelfee", value_one)
                cancel_all_money = cancel_all_money + value_one
                $("#payPrice5").val(cancel_all_money)
            } else {
                $(this).parent().parent().find("label:eq(9)").text('0')
                $(this).attr("getCancelfee", "0")
                cancel_all_money = cancel_all_money - value_one
                $("#payPrice5").val(cancel_all_money)

            }
        }
        //var fee55data = [];
        //var fee55dataTostring = [];
        //var _arrfee55Unit = [];
        //var z="0";
        //var fee55dataCurrency;
        //var _arrfee55dataAmount=[];
        //var _arrfee55dataGather=[];
        //$(".fee55 input[name='feeli']:checked").each(function (index, item) {
        //    fee55data.push($(this).attr("getUnit")+" "+$(this).attr("getAllfee"));
        //    if($.inArray($(this).attr("getUnit"), _arrfee55Unit)==-1){
        //        _arrfee55Unit.push($(this).attr("getUnit"));
        //    }
        //});

        //if(_arrfee55Unit.length>1){
        //    _arrfee55dataGather=[];
        //    for(var i = 0; i < _arrfee55Unit.length; i++) {

        //        $(".fee55 input[name='feeli']:checked").each(function(){
        //            if($(this).attr("getUnit")==_arrfee55Unit[i]){
        //                    //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
        //                    z=+z*1+(+$(this).attr("getAllfee"))*1;
        //            }
        //        })
        //        _arrfee55dataAmount.push(z.toFixed(2));
        //        fee55dataCurrency=fee55dataCurrency+_arrfee55Unit[i]+" "+(i>0?parseFloat(+_arrfee55dataAmount[i] - +_arrfee55dataAmount[i-1]).toFixed(2):parseFloat(_arrfee55dataAmount[i]).toFixed(2))+", ";
        //        _arrfee55dataGather.push(_arrfee55Unit[i]+" "+(i>0?parseFloat(+_arrfee55dataAmount[i] - +_arrfee55dataAmount[i-1]).toFixed(2):parseFloat(_arrfee55dataAmount[i]).toFixed(2)));
        //    }
        //    $("#payPrice5").val(_arrfee55dataGather.toString())
        //}else if(_arrfee55Unit.length==0){
        //    $("#payPrice5").val("");
        //}else{
        //    _arrfee55dataGather=[];
        //    $(".fee55 input[name='feeli']:checked").each(function(){
        //                //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
        //        z=+z*1+(+$(this).attr("getAllfee"))*1;
        //    })
        //    _arrfee55dataGather.push(_arrfee55Unit[0]+" "+z);
        //    $("#payPrice5").val(_arrfee55dataGather.toString())
        //}
    })


    //添加本地 费用列表的结算公司
    $("#toCompanyLocal").select2({
        language: "zh-CN",
        minimumInputLength: 2
    });

    //获取委托人列表
    common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
        "companyId": companyID
    }, function(data) {
        console.log(data)
        var _data = data.data;
        if(_data != null) {
            for(var i = 0; i < _data.length; i++) {
                var _html = '<option name="' + _data[i].comp_customerId + '" value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
                $('#crmuser').append(_html)
            }
        }
    }, function(err) {
        console.log(err)
    }, 2000)


    // $("#crmuser").change(function() {
    //     crmCompanyId = $("#crmuser").val();
    //     _selectSupplier(crmCompanyId)
    //     //_selectBill(crmCompanyId)
    // })

    // function _selectSupplier(crmId){
    //     //获取供应商列表
    //     common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
    //         "upId": crmId
    //     }, function(data) {
    //         //console.log(data)
    //         var _data = data.data;
    //         if(_data != null) {
    //             for(var i = 0; i < _data.length; i++) {
    //                 //var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"> ' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].comp_contactName + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：' + _data[i].comp_contactPhone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：' + _data[i].comp_contactEmail + '</div>'
    //                 var crmlist = '<tr class="margin-left-40"><td><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"></td><td> ' + _data[i].comp_name + '</td><td>联系人：' + _data[i].comp_contactName + '</td><td>联系电话：' + _data[i].comp_contactPhone + '</td><td>邮箱：' + _data[i].comp_contactEmail + '</td></tr>'
    //                 $(".crmlist").append(crmlist)
    //             }
    //         }
        
    //     }, function(err) {
    //         console.log(err)
    //     }, 2000)
    // }

    function loadFee()
    {
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "bookingId": Id
        }, function (data) {
            console.log(data.Data)
            if (data.State == 1) {
                $(".feeAll").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    var cancelTime = _data[i].bofe_cancelTime != null ? _data[i].bofe_cancelTime.substring(0, 10) : ""
                    var addTime = _data[i].bofe_addTime != null ? _data[i].bofe_addTime.substring(0, 10) : ""
                    var modifyTime = _data[i].bofe_modifyTime != null ? _data[i].bofe_modifyTime.substring(0, 10) : ""
                    if (_data[i].bofe_isLock == 1 || _data[i].bofe_state == 2 || _data[i].bofe_state == 3 || _data[i].bofe_receiptNumber != "0" || _data[i].bofe_invoiceNumber != "0" || _data[i].bofe_payNumber != "0") {
                        //var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
                        var feilist = '<div class="col-sm-12 feeList"><input type="hidden" id="feeId" value="' + _data[i].bofe_id + '"><input type="hidden" id="isLock" value="' + _data[i].bofe_isLock + '"><span style="width:30px; float: left; text-align:center; font-size:20px; "><i class="fa fa-ban"></i></span>' +
                            //'<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="' + _data[i].bofe_feeType + '">' + _data[i].bofe_feeType + '</option></select>' +
                            '<select id="feeType" disabled class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>' +
                            '<select id="toCompany' + i + '" disabled class="no-padding-left no-padding-right margin-right-5 toCompany" name="toCompany" style="width:200px; float: left;"></select>' +
                            '<select id="feeItem' + i + '" disabled class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>' +
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit" disabled style="height:20px;"></select></span>' +
                            '<input type="text" disabled class="form-control" id="feePrice" placeholder="" value="' + _data[i].bofe_fee + '"></div>' +
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" disabled class="form-control" id="feeNum" placeholder="" value="' + _data[i].bofe_num + '">' +
                            '<span class="input-group-addon" style="padding:0;"><select id="numUnit" disabled style="height:20px;"></select></span></div>' +
                            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_feeUnit + ' ' + _data[i].bofe_allFee + '</label>' +
                            '<input type="text" class="form-control margin-right-5" id="receiptRate" placeholder="" value="' + _data[i].bofe_receiptRate + '" style="width:60px; float: left;"  disabled="disabled">' +
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" style="height:20px;" disabled="disabled"></select></span>' +
                            '<input type="text" class="form-control" id="receiptFee" placeholder="" value="' + _data[i].bofe_receiptFee + '" disabled="disabled"></div>' +
                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + _data[i].bofe_beizhu + '" placeholder="" disabled style="width:100px; float: left;">' +
                            '<label for="inputPassword3" id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
                            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
                            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + cancelTime + '</label>' +
                            '<label for="inputPassword3" id="cancelName" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].cancelName + '</label>' +
                            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + _data[i].bofe_receiptNumber + '</label>' +
                            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + _data[i].bofe_invoiceNumber + '</label>' +
                            '<label for="inputPassword3" id="addName" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].addName + '</label>' +
                            '<label for="inputPassword3" id="addTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + addTime + '</label>' +
                            '<label for="inputPassword3" id="modifyName" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + _data[i].modifyName + '</label>' +
                            '<label for="inputPassword3" id="modifyTime" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + modifyTime + '</label>'
                    } else {
                        //var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
                        var feilist = '<div class="col-sm-12 feeList"><input type="hidden" id="feeId" value="' + _data[i].bofe_id + '"><input type="hidden" id="isLock" value="' + _data[i].bofe_isLock + '"><button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>' +
                            //'<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="' + _data[i].bofe_feeType + '">' + _data[i].bofe_feeType + '</option></select>' +
                            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>' +
                            '<select id="toCompany' + i + '" class="no-padding-left no-padding-right margin-right-5 toCompany" name="toCompany" style="width:200px; float: left;"></select>' +
                            '<select id="feeItem' + i + '" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>' +
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit" style="height:20px;"></select></span>' +
                            '<input type="text" class="form-control" id="feePrice" placeholder="" value="' + _data[i].bofe_fee + '"></div>' +
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" placeholder="" value="' + _data[i].bofe_num + '">' +
                            '<span class="input-group-addon" style="padding:0;"><select id="numUnit" style="height:20px;"></select></span></div>' +
                            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_feeUnit + ' ' + _data[i].bofe_allFee + '</label>' +
                            '<input type="text" class="form-control margin-right-5" id="receiptRate" placeholder="" value="' + _data[i].bofe_receiptRate + '" style="width:60px; float: left;"  disabled="disabled">' +
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" style="height:20px;" disabled="disabled"></select></span>' +
                            '<input type="text" class="form-control" id="receiptFee" placeholder="" value="' + _data[i].bofe_receiptFee + '" disabled="disabled"></div>' +
                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + _data[i].bofe_beizhu + '" placeholder="" style="width:100px; float: left;">' +
                            '<label for="inputPassword3" id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
                            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
                            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + cancelTime + '</label>' +
                            '<label for="inputPassword3" id="cancelName" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].cancelName + '</label>' +
                            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + _data[i].bofe_receiptNumber + '</label>' +
                            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + _data[i].bofe_invoiceNumber + '</label>' +
                            '<label for="inputPassword3" id="addName" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].addName + '</label>' +
                            '<label for="inputPassword3" id="addTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + addTime + '</label>' +
                            '<label for="inputPassword3" id="modifyName" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + _data[i].modifyName + '</label>' +
                            '<label for="inputPassword3" id="modifyTime" class="margin-right-5" style="width:120px; line-height: 30px; float: left;">' + modifyTime + '</label>'
                    }


                    $(".feeAll").append(feilist)
                    $('.feeList').eq(i).find('#toCompany' + i).html(_toCompany)
                    $('.feeList').eq(i).find('#toCompany' + i).val(_data[i].bofe_toCompany).trigger("change")
                    $("#toCompany" + i).select2({
                        language: "zh-CN",
                        minimumInputLength: 2
                    });
                    if ($.inArray((_data[i].bofe_toCompany + ';' + $('#toCompany' + i).find("option:selected").text()), _toCompanySettleArr) < 0) {
                        _toCompanySettleArr.push(_data[i].bofe_toCompany + ';' + $('#toCompany' + i).find("option:selected").text());
                        _htmlCompanySettle = '<option value="' + _data[i].bofe_toCompany + '">' + $('#toCompany' + i).find("option:selected").text() + '</option>';
                        _CompanySettle = _CompanySettle + _htmlCompanySettle
                    }

                    console.log(_toCompanySettleArr)
                    console.log("slk;ajkljsal;dfkjas;ldkfja;lsdkj;lkjk")


                    //alert($("[name='toCompany"+i+"']").val())
                    $('.feeList').eq(i).find('#feeItem' + i).html(_feeItem)
                    $('.feeList').eq(i).find('#feeItem' + i).val(_data[i].bofe_feeItem).trigger("change")
                    $("#feeItem" + i).select2({
                        language: "zh-CN",
                        minimumInputLength: 2
                    });
                    if (_data[i].bofe_feeType == "应收" || _data[i].bofe_feeType == "debit") {
                        $('.feeList').eq(i).find('#feeType').val("debit").trigger("change")
                    } else {
                        $('.feeList').eq(i).find('#feeType').val("credit").trigger("change")
                        forwarder_id = toYingFuUser = _data[i].bofe_toCompany
                    }
                    $('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
                    $('.feeList').eq(i).find('#feeUnit').val(_data[i].bofe_feeUnit).trigger("change")
                    $('.feeList').eq(i).find('#receiptFeeUnit').html(_feeUnit)
                    $('.feeList').eq(i).find('#receiptFeeUnit').val(_data[i].bofe_receiptFeeUnit).trigger("change")
                    $('.feeList').eq(i).find('#numUnit').html(_numUnit)
                    $('.feeList').eq(i).find('#numUnit').val(_data[i].bofe_numUnit).trigger("change")
                    if ($('.feeList').eq(i).find('#feeType').val() == 'debit') {
                        $('.feeList').eq(i).css("background-color", "#b0e0e6")
                        $('.feeList').eq(i).attr("orderName", "0")
                    } else {
                        $('.feeList').eq(i).css("background-color", "pink")
                        $('.feeList').eq(i).attr("orderName", "1")
                    }
                }
                $('#toCompany_2').html('<option value="">请选择</option>' + _CompanySettle);
                $('#toCompany_3').html('<option value="">请选择</option>' + _CompanySettle);
                $('#toCompany_4').html('<option value="">请选择</option>' + _CompanySettle);
                $('#toCompany_5').html('<option value="">请选择</option>' + _CompanySettle);
                //$('#toCompany_6').append(_CompanySettle);
                feeNewOrder();
                gatherDebitCredit();
            }

        }, function (err) {
            console.log(err)
        }, 4000)
    }
    //加载费用
    loadFee()


    console.log(forwarder_id)

    //统计总利润，总应收，总应付
    function gatherDebitCredit(){
        var _arrDebit = new Array();
        var _arrDebitAmount = new Array();
        var _arrCredit = new Array();
        var _arrCreditAmount = new Array();
        var _debitCurrency=""
        var _creditCurrency=""
        var z="0";
        var _arrDebitGather= new Array();        
        var y="0";
        var _arrCreditGather= new Array();

        $(".feeList").each(function(){
            if($(this).find("#feeType").val()=="debit"){
                //alert("1111")
                if($.inArray($(this).find("#feeUnit").val(), _arrDebit)==-1){
                    _arrDebit.push($(this).find("#feeUnit").val());
                }
            }else if($(this).find("#feeType").val()=="credit"){
                //alert("2222")
                if($.inArray($(this).find("#feeUnit").val(), _arrCredit)==-1){
                    _arrCredit.push($(this).find("#feeUnit").val());
                }
            }
        })
        console.log(_arrDebit)
        //算出应收的各币种总和
        if(_arrDebit.length>1){
            for(var i = 0; i < _arrDebit.length; i++) {

                $(".feeList").each(function(){
                    if($(this).find("#feeType").val()=="debit" && $(this).find("#feeUnit").val()==_arrDebit[i]){
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            z=+z*1+(+$(this).find("#feePrice").val()*$(this).find("#feeNum").val())*1;
                    }
                })
                _arrDebitAmount.push(z.toFixed(2));
                _debitCurrency=_debitCurrency+_arrDebit[i]+" "+(i>0?parseFloat(+_arrDebitAmount[i] - +_arrDebitAmount[i-1]).toFixed(2):parseFloat(_arrDebitAmount[i]).toFixed(2))+", ";
                _arrDebitGather.push(_arrDebit[i]+" "+(i>0?parseFloat(+_arrDebitAmount[i] - +_arrDebitAmount[i-1]).toFixed(2):parseFloat(_arrDebitAmount[i]).toFixed(2)));
            }
            
            $("#debitTotal").text(_debitCurrency)

        }else if(_arrDebit.length==0){
            $("#debitTotal").text(localCurrency+" "+parseFloat(z).toFixed(2));
            _arrDebitGather.push(localCurrency+" "+parseFloat(z).toFixed(2));
        }else{
            $(".feeList").each(function(){
                if($(this).find("#feeType").val()=="debit"){
                    //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                    z=+z + (+$(this).find("#feePrice").val() * +$(this).find("#feeNum").val());
                }
            })
            $("#debitTotal").text(_arrDebit[0]+" "+parseFloat(z).toFixed(2))
            _arrDebitGather.push(_arrDebit[0]+" "+parseFloat(z).toFixed(2));
        console.log(_arrDebitGather)
        }
        //算出应付的各币种总和
        if(_arrCredit.length>1){
            for(var i = 0; i < _arrCredit.length; i++) {

                $(".feeList").each(function(){
                    if($(this).find("#feeType").val()=="credit" && $(this).find("#feeUnit").val()==_arrCredit[i]){
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            y=+y + (+$(this).find("#feePrice").val() * +$(this).find("#feeNum").val());
                    }
                })
                _arrCreditAmount.push(y);
                _creditCurrency=_creditCurrency+_arrCredit[i]+" "+(i>0?parseFloat(+_arrCreditAmount[i] - +_arrCreditAmount[i-1]).toFixed(2):parseFloat(_arrCreditAmount[i]).toFixed(2))+", ";
                _arrCreditGather.push(_arrCredit[i]+" "+(i>0?parseFloat(+_arrCreditAmount[i] - +_arrCreditAmount[i-1]).toFixed(2):parseFloat(_arrCreditAmount[i]).toFixed(2)));
            }
            
            $("#creditTotal").text(_creditCurrency)

        }else if(_arrCredit.length==0){
            $("#creditTotal").text(localCurrency+" "+parseFloat(y).toFixed(2));
            _arrCreditGather.push(localCurrency+" "+parseFloat(y).toFixed(2));
        }else{

            $(".feeList").each(function(){
                if($(this).find("#feeType").val()=="credit"){
                    //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                    y=+y + (+$(this).find("#feePrice").val() * +$(this).find("#feeNum").val());
                }
            })
            $("#creditTotal").text(_arrCredit[0]+" "+y.toFixed(2));
            _arrCreditGather.push(_arrCredit[0]+" "+y.toFixed(2));
        }
        
        getProfit(_arrDebitGather,_arrCreditGather);
    }

    //计算当票利润，根据DEBIT/CREDIT来计算的。
    function getProfit(debit,credit){
        console.log(debit)
        console.log(credit)
        var _debitCurInProfit;
        var _debitRateInProfit=0;
        var _creditCurInProfit;
        var _creditRateInProfit=0;
        var _debits=new Array();
        var _credits=new Array();
        var _debitJudge=0;
        var _creditJudge=0;
        var _currencyJudge=0;

        //将汇率装进数组中，便于使用
        common.ajax_req('GET', false, dataUrl, 'exchangerate.ashx?action=read', {
            'companyId': companyID
        }, function(data) {
            var _data = data.data;            
            for(var i = 0; i < _data.length; i++) {
                _arrExchangeRate.push(_data[i]);
            }
        }, function(err) {
            console.log(err)
        }, 1000)

        for(var j=0;j<debit.length;j++){
            console.log(debit[j])
            _debits=debit[j].split(" ");
            var _debitAmount=0;
            if(_debits[0]==localCurrency){
                _debitAmount = _debits[1];
            }else{
                for(var z=0;z<_arrExchangeRate.length;z++){
                    var _timeFrom=new Date((_arrExchangeRate[z].rate_timeFrom).split('T')[0]);
                    var _timeFromFormat=_timeFrom.getTime();
                    var _timeEnd=new Date((_arrExchangeRate[z].rate_timeEnd).split('T')[0]);
                    var _timeEndFormat=_timeEnd.getTime();
                    var _nowTime=new Date();
                    var _nowTimeFormat=_nowTime.getTime();
                    if(_debits[0]==_arrExchangeRate[z].rate_oldCurrency && _arrExchangeRate[z].rate_newCurrency==localCurrency && _timeFromFormat<_nowTimeFormat<_timeEndFormat){
                        if(_arrExchangeRate[z].rate_symbol=="multiply"){
                            _debitAmount=(_debits[1]*_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
                        }else{
                            _debitAmount=(_debits[1]/_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
                        }
                        _debitJudge=1;
                    }
                }
                //一种折中的办法来测试该币种是否有汇率存在，如果没有的话目前只能是通知，不能动态显示在利润上。
                if(_debitJudge==0){
                        _currencyJudge=1;
                    alert("No Exchange Rate for "+_debits[0]+", Please ask your Manager to add it.");
                }
                _debitJudge=0;
            }

            //下面有个*1是为了转换类型
            _debitRateInProfit=_debitRateInProfit*1+_debitAmount*1;
        }

        for(var j=0;j<credit.length;j++){
            console.log(credit[j])
            _credits=credit[j].split(" ");
            var _creditAmount=0;
            if(_credits[0]==localCurrency){
                _creditAmount=_credits[1];
            }else{
                for(var z=0;z<_arrExchangeRate.length;z++){
                    console.log(_arrExchangeRate[z]);
                    var _timeFrom=new Date((_arrExchangeRate[z].rate_timeFrom).split('T')[0]);
                    var _timeFromFormat=_timeFrom.getTime();
                    var _timeEnd=new Date((_arrExchangeRate[z].rate_timeEnd).split('T')[0]);
                    var _timeEndFormat=_timeEnd.getTime();
                    var _nowTime=new Date();
                    var _nowTimeFormat=_nowTime.getTime();
                    if(_credits[0]==_arrExchangeRate[z].rate_oldCurrency && _arrExchangeRate[z].rate_newCurrency==localCurrency && _timeFromFormat<_nowTimeFormat<_timeEndFormat){
                        if(_arrExchangeRate[z].rate_symbol=="multiply"){
                            _creditAmount=(_credits[1]*_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
                        }else{
                            _creditAmount=(_credits[1]/_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
                        }
                        _creditJudge=1;
                    }
                }
                if(_creditJudge==0){
                        _currencyJudge=1;
                    alert("No Exchange Rate for "+_credits[0]+", Please ask your Manager to add it.");
                }
                _creditJudge=0;
            }
            //下面有个*1是为了转换类型
            _creditRateInProfit=_creditRateInProfit*1+_creditAmount*1;
        }


        console.log(_debitJudge)
        allprofit = (_debitRateInProfit*1-_creditRateInProfit*1).toFixed(2)
        //$("#profit").text(localCurrency+(_debitRateInProfit*1-_creditRateInProfit*1).toFixed(2)+" "+()+" "+())
        $("#profit").html(localCurrency+(_debitRateInProfit*1-_creditRateInProfit*1).toFixed(2)+(_currencyJudge==1?" <i class='fa fa-question-circle tooltip-info blue' data-toggle='tooltip' data-placement='top' data-original-title='The profit should not right because there is no right exchange rate for some currency.'></i>":""))
        $('[data-toggle="tooltip"]').tooltip();
    }


        console.log(_arrExchangeRate[1])
//feePrice, feeNum
    //让费用列表按照应收在上面，应付在下面这样来重新排序
    function feeNewOrder(){
        var newOrder = $('.feeList').toArray()
        newOrder=newOrder.sort(function (a, b) {
            return $(a).attr("orderName") - $(b).attr("orderName")
        });
        $(".feeAll").append(newOrder)
    }

    $('.feeAll').delegate('#feeType', 'change', function() {
        if($(this).val()=='debit'){
            $(this).parent('.feeList').css("background-color","#b0e0e6")
        }else{
            $(this).parent('.feeList').css("background-color","pink")
        }
    })

    //订单状态
    common.ajax_req("get", false, dataUrl, "state.ashx?action=readbytypeid", {
        "typeId": 4
    }, function(data) {
        console.log(data)
        var _data = data.data;
        if(_data != null) {
            for(var i = 0; i < _data.length; i++) {
                //var statelist = '<span class="col-sm-1 widget-caption text-align-center bordered-1 bordered-gray" stateId='+_data[i].state_id+'>' + _data[i].state_name_cn + '</span>'
                var statelist = '<li data-target="#simplewizardstep'+_data[i].state_id+'>">' + _data[i].state_name_cn + '<span class="chevron"></span></li>'
                $("#STATELIST").append(statelist)
            }
        }
        
        $('#STATELIST li').on('click', function() {
            var which=$(this)
            if((which.attr('stateId')-stateId)==1){             
                common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfollow', {
                    'bookingId': Id,
                    'userId': userID,
                    'userName': userName,
                    'stateId': which.attr('stateId'),
                    'state': which.text()
                }, function(data) {
                    if(data.State == 1) {
                        //console.log(which.text())
                        which.addClass('btn-blue')
                        comModel("操作成功")
                    } else {
                        comModel("操作失败")
                    }
                }, function(error) {
                    console.log(parm)
                }, 1000)
            }else {
                comModel("不可操作")
            }

        })
    
    }, function(err) {
        console.log(err)
    }, 2000)

    //贸易条款
    common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
        'typeId': 3,
        'companyId': companyID
    }, function(data) {
        var _data = data.data;
        for(var i = 0; i < _data.length; i++) {
            var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
            $('#incoterm').append(_html)
        }
    }, function(error) {
        console.log(parm)
    }, 1000)
    
    //运输方式
    common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
        'typeId': 7,
        'companyId': companyID
    }, function(data) {
        var _data = data.data;
        for(var i = 0; i < _data.length; i++) {
            var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
            $('#movementType').append(_html)
        }
    }, function(error) {
        console.log(parm)
    }, 1000)
    $("#movementType").change(function() {
        var opt = $("#movementType").val();
        if(opt!='FCL'){
            $("#Movement").addClass('none')
        }
        else{
            $("#Movement").removeClass('none')
        }
    })

    //销售人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        //'role': 6,
        'companyId': companyID
    }, function(data) {
        var _data = data.data;
        if(_data!=null){
            for(var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#sellId').append(_html)
            }
        }
    }, function(error) {
        console.log(parm)
    }, 1000)
    //录入人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        //'role': 11,
        'companyId': companyID
    }, function(data) {
        var _data = data.data;
        if(_data!=null){
            for(var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#luruId').append(_html)
            }
        }
    }, function(error) {
        console.log(parm)
    }, 1000)    
    //客服人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        //'role': 7,
        'companyId': companyID
    }, function(data) {
        var _data = data.data;
        if(_data!=null){
            for(var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#kefuId').append(_html)
            }
        }
    }, function(error) {
        console.log(parm)
    }, 1000)
    //操作人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        //'role': 8,
        'companyId': companyID
    }, function(data) {
        var _data = data.data;
        if(_data!=null){
            for(var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#caozuoId').append(_html)
            }
        }
    }, function(error) {
        console.log(parm)
    }, 1000)    

    var baseinfo_id = GetQueryString('Id');
    if(baseinfo_id){        
        //加载基本信息
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readbyid", {
            "Id": Id
        }, function(data) {
            console.log(data.Data)
            //初始化信息
            var _data = data.Data
            stateId = _data.book_orderState
            var stateList=$('#STATELIST li')
            $.each(stateList,function(i,item){
                if((i+12)<=stateId){
                    //item.addClass('btn-blue')
                    //$('#STATELIST span').eq(i).addClass('btn-blue')
                    $('#STATELIST li').eq(i).addClass('active')
                }
            })
            orderCode = _data.book_orderCode
            $('#title3').html('订单号：' + _data.book_orderCode)/////有用
            
            var tableTrNumPayNumber4=getChar($("#billPayList tr").length-1);
            $('#payNumber').val('INV'+_data.book_orderCode)
            $('#payNumber4').val('AD'+_data.book_orderCode+tableTrNumPayNumber4)
            $('#vesselName').val(_data.book_vessel)
            $('#voyage').val(_data.book_voyage)
            $('#port1').val(_data.book_port1)
            $('#port2').val(_data.book_port2)
            $('#outCode').val(_data.book_outCode)/////有用
            $('#billCode').val(_data.book_billCode)/////有用
            $('#code').val(_data.book_code)/////有用
            $("#crmuser").val(_data.book_crmCompanyId).trigger("change") /////有用
            //$("#crmcontact").val(_data.book_crmContactId).trigger("change")
            $("#sellId").val(_data.book_sellId).trigger("change")/////有用
            $("#luruId").val(_data.book_luruId).trigger("change")/////有用
            $("#kefuId").val(_data.book_kefuId).trigger("change")/////有用
            $("#caozuoId").val(_data.book_caozuoId).trigger("change")/////有用
            $("#movementType").val(_data.book_movementType).trigger("change")/////有用
            $("#incoterm").val(_data.book_incoterm).trigger("change")/////有用
        }, function(err) {
            console.log(err)
        }, 1000)
    }

    $("#cancel_type").change(function () {
        if($("#billGetList tbody td").hasClass("dataTables_empty")){
            var tableTrNum=getChar($("#billGetList tr").length-2);
        }else{
            var tableTrNum=getChar($("#billGetList tr").length-1);
        }
        if ($("#cancel_type").val() == 'debit') {
            $("#payNumber5").val('PRECR' + orderCode+tableTrNum)
        } else if ($("#cancel_type").val() == 'credit') {
            $("#payNumber5").val('PRECP' + orderCode+tableTrNum)
        }
        _getFee5($('#toCompany_5').val(), $('#cancel_type').val());

    })

    $("#cancel_unit").change(function () {
        var opt = $("#cancel_unit").val();
        if (opt == 'USD') {
            common.ajax_req("get", true, dataUrl, "exchangerate.ashx?action=readbyowner", {
                "owner": opt,
                "other": 'RMB'
            }, function (data) {
                if (data.State == 1) {
                    exchangeRate = data.Data.rate_exchangeRate
                }
            })
        } else if (opt == 'RMB') {
            common.ajax_req("get", true, dataUrl, "exchangerate.ashx?action=readbyowner", {
                "owner": opt,
                "other": 'USD'
            }, function (data) {
                if (data.State == 1) {
                    exchangeRate = data.Data.rate_exchangeRate
                }
            })
        } else {
            alert("暂时只支持美元、人名币");
        }
        $("#payPrice5").val(0);
        $(".fee55 input:checkbox").prop("checked", false);
        cancel_all_money = 0;
    })

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
                { "mDataProp": "bill_payType" },
                { "mDataProp": "comp_name" },
                { "mDataProp": "bill_payNumber" },
			    {
			        "mDataProp": "bill_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.bill_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "bill_payPrice" },
                { "mDataProp": "bill_formatId" ,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_formatId == 0) {
                            $(nTd).html('<a href="invoicedetail.html?billid='+oData.bill_id+'" target="_blank">Invoice</a>')
                        } else {
                            //$(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id=" + sData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
                { "mDataProp": "bill_state",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("新增账单")
                        } else {
                            //$(nTd).html("<a href='crmcompanycontactadd.html?action=modify&Id=" + sData + "'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
                {
                    "mDataProp": "bill_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                //.append("<a href='invoicedetail.html?billid=" + oData.bill_id + "' target='_blank'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='invoicedetail.html?billid="+oData.bill_id+"' target='_blank'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                //.append("<a href='javascript:void(0);' onclick='_toShouKuangFun(" + oData.bill_toCompany + ")'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                //.append("<a href='javascript:void(0);' onclick='_toFaPiaoFun(" + oData.bill_toCompany + ")'>发票</a>")
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
                        if (oData.invo_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailInvoiceFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='javascript:void(0);' onclick='_deleteInvoiceFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailInvoiceFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("")
                                //.append("<a href='javascript:void(0);' onclick='_deleteInvoiceFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
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
                {
                    "mDataProp": "bill_state",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html('待处理');
                        } else {
                            $(nTd).html("");
                        }
                    }
                },
                {
                    "mDataProp": "bill_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.bill_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillPayFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='javascript:void(0);' onclick='_deleteBillPayFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='billdetail.html?billid=" + oData.bill_id + "' target='_blank'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillPayFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            .append("<a href='billdetail.html?billid=" + oData.bill_id + "' target='_blank'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
            ]
        });
        return table;
    }

    //销账申请列表
    function GetBillGet() {
        $("#billGetList").dataTable().fnClearTable(); //清空一下table
        $("#billGetList").dataTable().fnDestroy(); //还原初始化了的dataTable
        var table = $("#billGetList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/cancelaccount.ashx?action=read&preCode=has&typeId=' + cancel_type + '&bookingId=' + Id,
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
                { "mDataProp": "caac_preCode" },
                { "mDataProp": "rema_type" },
			    {
			        "mDataProp": "caac_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html(oData.caac_addTime.substring(0, 10));
			        }
			    },
                { "mDataProp": "caac_currency" },
                { "mDataProp": "caac_money" },
			    {
			        "mDataProp": "caac_state",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            if (oData.caac_state == 1) {
			                $(nTd).html('未销账');
			            } else {
			                $(nTd).html(oData.caac_code);
			            }
			        }
			    },
                {
                    "mDataProp": "caac_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.caac_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillGetFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='javascript:void(0);' onclick='_deleteBillGetFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='cancel_detail.html?cancel_id=" + oData.caac_id + "' target='_blank'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillGetFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='cancel_detail.html?cancel_id=" + oData.caac_id + "' target='_blank'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
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

    //供应商列表
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
                        $(nTd).html("<a href='javascript:void(0);' onclick='_deleteGysFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")

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
                        $(nTd).html("<a href='javascript:void(0);' onclick='_deleteFileFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                         .append("<a href='" + dataUrl + oData.file_nav + oData.file_url + "' target='_blank'>查看</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>发票</a>")

                    }
                },
            ]
        });
        return table;
    }

    $("input:radio[name='invDebOrCrd']").on('change',function() {
        if($('#toCompany_2').val()!=""){
            _getFee($('#toCompany_2').val());
        }
    })
    //费用明细
    function _getFee(toCompany) {
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "bookingId": Id,
            "toCompany": toCompany,
            "feeType": $("input[name='invDebOrCrd']:checked").val()
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee00").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    if (_data[i].bofe_receiptNumber=="0") {  //20211105 判断该挑费用是否已经有了账单号码
                        var feelist = '<p style="clear:both;"><div class="margin-left-40 margin-top-10">' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="'+_data[i].bofe_feeUnit+'" getAllfee="'+_data[i].bofe_allFee+'" /></label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;">' + _data[i].bofe_feeType + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptRate + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFeeUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFee + '</label>' +
                            '</div></p>'
                    }else{
                        var feelist=""
                    }
                    $(".fee00").prepend(feelist)
                }
            }else{
                $(".fee00").empty()
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }

    $("#_invThisBkgId").on('change',function() {
        if($('#toCompany_3').val()!=""){
            _getFee3($('#toCompany_3').val());
        }
    })

    $("#_billpayThisBkgId").on('change',function() {
        if($('#toCompany_4').val()!=""){
            _getFee4($('#toCompany_4').val());
        }
    })
    //付款申请
    function _getFee4(toCompany) {
        var _thisBkgId;
        $('#_billpayThisBkgId').is(':checked')?_thisBkgId=Id:_thisBkgId=0;
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "bookingId": _thisBkgId,
            "toCompany": toCompany,
            "feeType": "credit" //0是debit & credit，1是debit，2是credit
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee44").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    if (_data[i].bofe_payNumber == '0') {
                        var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="' + _data[i].bofe_feeUnit + '" getAllfee="' + _data[i].bofe_allFee + '" /></label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_orderCode + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
                        '</div>'
                        $(".fee44").prepend(feelist)
                    }

                }
            }else{
                $(".fee44").empty()
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }


    $("#_billgetThisBkgId").on('change',function() {
        if($('#toCompany_5').val()!=""){
            _getFee5($('#toCompany_5').val(), $('#cancel_type').val());
        }
    })

    //供应商费用明细
    function _getFee6(toCompany) {
        var _thisBkgId;
        $('#checkbox-id').is(':checked')?_thisBkgId=Id:_thisBkgId=0;
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "bookingId": _thisBkgId,
            "toCompany": toCompany,
            "feeType": "credit" //0是debit & credit，1是debit，2是credit
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee66").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                        var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" /></label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_outCode + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">&nbsp;</label>' +
                            '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">&nbsp;</label>' +
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
        $('#send_invoice').addClass('none')
        loadFee()
    })
    $('.billtab').on('click', function () {
        $('#send_bill').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')
        $('#send_invoice').addClass('none')

        _getFee($('#toCompany_2').val())

        $(".checkAll").prop("checked", false);
        $("input[name='feeli']").prop("checked", false)
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
        // $('#toCompany_3').append(_toCompany)
        // $("#toCompany_3").change(function () {
        //     _getFee3($('#toCompany_3').val())
        // })
        $(".checkAll").prop("checked", false);
        $("input[name='feeli']").prop("checked", false)
    })
    $('.billpaytab').on('click', function () {
        $('#send_bill_pay').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')
        $('#send_invoice').addClass('none')

        // $('#toCompany_4').append(_toCompany)
        // $("#toCompany_4").change(function () {
        //     _getFee4($('#toCompany_4').val())
        // })
    })
    $('.cancel_billgettab').on('click', function () {
        $('#send_bill_get').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        $('#cancel_unit').empty()
        $('#cancel_unit').append('<option value="">币种</option>')
        $('#cancel_unit').append(_feeUnit)

        $("#payPrice5").val(0)

        cancel_type = 1
        $("#cancel_type").val("debit").trigger("change");

        //if ($("#billGetList tbody td").hasClass("dataTables_empty")) {
        //    var tableTrNum = getChar($("#billGetList tr").length - 2);
        //} else {
        //    var tableTrNum = getChar($("#billGetList tr").length - 1);
        //}
        //$("#payNumber5").val('PRECR' + orderCode + tableTrNum)

        console.log(toCompany_yingshou)
        console.log(toCompany_yingfu)
        if (toCompany_yingshou != 0) {
            $("#toCompany_5").val(toCompany_yingshou).trigger("change");
        } else {
            $("#toCompany_5").val('').trigger("change");
        }

        billGetTable = GetBillGet()

        //_getFee5($('#toCompany_5').val(), $('#cancel_type').val());

        // $('#toCompany_5').append(_toCompany)
        // $("#toCompany_5").change(function () {
        //     _getFee4($('#toCompany_5').val())
        // })
        $(".checkAll_shoufu").prop("checked", false);
        $("input[name='feeli']").prop("checked", false)
    })
    $('.cancel_billpaytab').on('click', function () {
        $('#send_bill_get').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        $('#cancel_unit').empty()
        $('#cancel_unit').append('<option value="">币种</option>')
        $('#cancel_unit').append(_feeUnit)

        $("#payPrice5").val(0)

        cancel_type = 2
        $("#cancel_type").val("credit").trigger("change");

        //if ($("#billGetList tbody td").hasClass("dataTables_empty")) {
        //    var tableTrNum = getChar($("#billGetList tr").length - 2);
        //} else {
        //    var tableTrNum = getChar($("#billGetList tr").length - 1);
        //}
        //$("#payNumber5").val('PRECP' + orderCode + tableTrNum)

        console.log(toCompany_yingshou)
        console.log(toCompany_yingfu)
        if (toCompany_yingfu != 0) {
            $("#toCompany_5").val(toCompany_yingfu).trigger("change");
        } else {
            $("#toCompany_5").val('').trigger("change");
        }

        billGetTable = GetBillGet()

        // $('#toCompany_5').append(_toCompany)
        // $("#toCompany_5").change(function () {
        //     _getFee4($('#toCompany_5').val())
        // })
        $(".checkAll_shoufu").prop("checked", false);
        $("input[name='feeli']").prop("checked", false)
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
                    $('#toCompany_6').append(_html)
                }
            }
            $("#toCompany_6").change(function () {
                _getFee6($('#toCompany_6').val())
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

    $("#toCompany_2").change(function () {
        if($("#example tbody td").hasClass("dataTables_empty")){
            var tableTrNumPayNumber=getChar($("#example tr").length-2);
        }else{
            var tableTrNumPayNumber=getChar($("#example tr").length-1);
        }
        $('#payNumber').val('INV' + orderCode + tableTrNumPayNumber)
        _getFee($('#toCompany_2').val())
    })
    $("#toCompany_3").change(function () {
        _getFee3($('#toCompany_3').val())
    })
    $("#toCompany_4").change(function () {
        //if($("#billPayList tbody td").hasClass("dataTables_empty")){
        //    var tableTrNumPayNumber4=getChar($("#billPayList tr").length-2);
        //}else{
        //    var tableTrNumPayNumber4=getChar($("#billPayList tr").length-1);
        //}
        //$('#payNumber4').val('AD'+orderCode+tableTrNumPayNumber4)
        _getFee4($('#toCompany_4').val())
    })
    $("#toCompany_5").change(function () {
        if($("#billGetList tbody td").hasClass("dataTables_empty")){
            var tableTrNum=getChar($("#billGetList tr").length-2);
        }else{
            var tableTrNum=getChar($("#billGetList tr").length-1);
        }
        console.log(cancel_type)
        if (cancel_type == 1 && $('#toCompany_5').val()!='') { toCompany_yingshou = $('#toCompany_5').val(); }
        else if (cancel_type == 2 && $('#toCompany_5').val() != '') { toCompany_yingfu = $('#toCompany_5').val(); }
        _getFee5($('#toCompany_5').val(), $('#cancel_type').val())
        console.log(toCompany_yingshou)
        console.log(toCompany_yingfu)
    })
    $("#toCompany_6").change(function () {
        _getFee6($('#toCompany_6').val())
    })

    //修改应收应付后更改收据金额，汇率以及币种

    //*JQuery 限制文本框只能输入数字和小数点*/  
    //$(this).val($(this).val().replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, ''));
    $(".feeList #feePrice,.feeList #feeNum").keyup(function(){
        $(this).val($(this).val().replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, ''));
        //parseFloat($(this).val()).toFixed(2);
    }).bind("paste",".feeList #feePrice,.feeList #feeNum",function(){  //CTR+V事件处理    
        $(this).val(parseFloat($(this).val().replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')).toFixed(2));
        //parseFloat($(this).val()).toFixed(2);
    }).css("ime-mode", "disabled"); //CSS设置输入法不可用   

    //*JQuery 文本框失去焦点时显示只能输入数字和小数点*/  
    $("body").on('blur',".feeList #feePrice,.feeList #feeNum", function() {
        $(this).val(parseFloat($(this).val().replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')).toFixed(2));
    }) 

    //输入的费用自动转发到收据费用那边去。
    $("body").on('change',".feeList #feeUnit,.feeList #feePrice,.feeList #feeNum", function() {
        //alert($(this).parents('.feeList').find("#receiptFeeUnit").val())
        if($(this).attr("id")!="feeUnit"){
            parseFloat($(this).val()).toFixed(2);
        }
        var _newfeeUnit=$(this).parents('.feeList').find("#feeUnit").val();
        var _newfeePrice=$(this).parents('.feeList').find("#feePrice").val();
        var _newfeeNum=$(this).parents('.feeList').find("#feeNum").val();
        $(this).parents('.feeList').find("#allFee").text(_newfeeUnit+" "+(parseFloat(_newfeePrice).toFixed(2)*parseFloat(_newfeeNum).toFixed(2)));
        $(this).parents('.feeList').find("#receiptRate").val("1");
        $(this).parents('.feeList').find("#receiptFeeUnit").val(_newfeeUnit);
        $(this).parents('.feeList').find("#receiptFee").val(parseFloat(_newfeePrice).toFixed(2)*parseFloat(_newfeeNum).toFixed(2));
    })

	//添加应收应付
	$('#addFee1').on('click', function() {
        feeboxAll_len=$('.feeList').length+1;
        var feeboxRow = '<div class="col-sm-12 feeList"><input type="hidden" id="feeId" value="0"><input type="hidden" id="isLock" value="0">' +
            '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
            '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
            '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
            '<input type="text" class="form-control" id="feePrice" placeholder="" value="0" ></div>'+
            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
            '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;" disabled="disabled">'+
            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" disabled="disabled"></select></span>'+
            '<input type="text" class="form-control" id="receiptFee" value="0" placeholder="" disabled="disabled"></div>'+
            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;">'+
            '<label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>' +
            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'
	
		$('.feeAll').append(feeboxRow)
		//feeboxRow = feeboxRow.clone()
		//货代公司
		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
		$('.feeList:last').find('.toCompany').append(_toCompany)
        $("#toCompany"+feeboxAll_len).select2({
            language: "zh-CN",
            minimumInputLength: 2
        });
	    //$('.feeList:last').find('.toCompany').val($('#crmuser option:selected').attr("id")).trigger("change")
        $('.feeList:last').find('.toCompany').val($('#crmuser').val()).trigger("change")
//		//费用类型
		$('.feeList:last').find('.feeItem').append(_feeItem)
        $("#feeItem"+feeboxAll_len).select2({
            language: "zh-CN",
            minimumInputLength: 2
        });
//		//币种
		$('.feeList:last').find('#feeUnit').append(_feeUnit)
//      币种
		$('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
//		//单位
		$('.feeList:last').find('#numUnit').append(_numUnit)
		if ($('.feeList').length != 1) {
		    $('.feeList:last').find('#numUnit').val($('.feeList').eq(-2).find('#numUnit').val()).trigger("change")
		}
        $('.feeList:last').find('#feeType').val('debit').trigger("change")
        $('.feeList:last').css("background-color", "#b0e0e6")

        //新增保存一条
        var parm = {
            'bookingId': Id,
            'userId': userID,
            'userName': userName,
            'feeType': $('.feeList:last').find('#feeType').val(),
            'toCompany': $('.feeList:last').find('.toCompany').val(),
            'feeItem': $('.feeList:last').find('.feeItem').val(),
            'feeUnit': $('.feeList:last').find('#feeUnit').val(),
            'numUnit': $('.feeList:last').find('#numUnit').val(),
            'feeNum': $('.feeList:last').find('#feeNum').val(),
            'feePrice': $('.feeList:last').find('#feePrice').val(),
            'receiptRate': $('.feeList:last').find('#receiptRate').val(),
            'receiptFeeUnit': $('.feeList:last').find('#receiptFeeUnit').val(),
            'receiptFee': $('.feeList:last').find('#receiptFee').val(),
            'beizhu': $('.feeList:last').find('#feeBeizhu').val()
        }
        console.log(parm)
        common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfeeone', parm, function (data) {
            if (data.State == 1) {
                $('.feeList:last').find('#feeId').val(data.Data)
                comModel("新增成功")
            } else {
                $('.feeList:last').remove()
                comModel("新增失败")
            }
        }, function (error) {
            console.log(parm)
            $('.feeList:last').remove()
            comModel("新增失败")
        }, 2000)
		
	})
	$('#addFee2').on('click', function() {	
        feeboxAll_len=$('.feeList').length+1;
        var feeboxRow = '<div class="col-sm-12 feeList"><input type="hidden" id="feeId" value="0"><input type="hidden" id="isLock" value="0">' +
            '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
            '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
            '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
            '<input type="text" class="form-control" id="feePrice" placeholder="" value="0" ></div>'+
            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
            '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;">'+
            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit"></select></span>'+
            '<input type="text" class="form-control" id="receiptFee" value="0" placeholder=""></div>'+
            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;">'+
            '<label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>' +
            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'
  
        $('.feeAll').append(feeboxRow)
        //feeboxRow = feeboxRow.clone()
        //货代公司
        //console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
        $('.feeList:last').find('.toCompany').append(_toCompany)
        $("#toCompany"+feeboxAll_len).select2({
            language: "zh-CN",
            minimumInputLength: 2
        });
//      //费用类型
        $('.feeList:last').find('.feeItem').append(_feeItem)
        $("#feeItem"+feeboxAll_len).select2({
            language: "zh-CN",
            minimumInputLength: 2
        });
        $('.feeList:last').find('.toCompany').val(forwarder_id).trigger("change")
//      //币种
        $('.feeList:last').find('#feeUnit').append(_feeUnit)
//      币种
        $('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
//      //单位
        $('.feeList:last').find('#numUnit').append(_numUnit)
        if ($('.feeList').length != 1) {
            $('.feeList:last').find('#numUnit').val($('.feeList').eq(-2).find('#numUnit').val()).trigger("change")
        }
        $('.feeList:last').find('#feeType').val('credit').trigger("change")
        $('.feeList:last').css("background-color", "pink")

	    //新增保存一条
        var parm = {
            'bookingId': Id,
            'userId': userID,
            'userName': userName,
            'feeType': $('.feeList:last').find('#feeType').val(),
            'toCompany': $('.feeList:last').find('.toCompany').val(),
            'feeItem': $('.feeList:last').find('.feeItem').val(),
            'feeUnit': $('.feeList:last').find('#feeUnit').val(),
            'numUnit': $('.feeList:last').find('#numUnit').val(),
            'feeNum': $('.feeList:last').find('#feeNum').val(),
            'feePrice': $('.feeList:last').find('#feePrice').val(),
            'receiptRate': $('.feeList:last').find('#receiptRate').val(),
            'receiptFeeUnit': $('.feeList:last').find('#receiptFeeUnit').val(),
            'receiptFee': $('.feeList:last').find('#receiptFee').val(),
            'beizhu': $('.feeList:last').find('#feeBeizhu').val()
        }
        console.log(parm)
        common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfeeone', parm, function (data) {
            if (data.State == 1) {
                $('.feeList:last').find('#feeId').val(data.Data)
                comModel("新增成功")
            } else {
                $('.feeList:last').remove()
                comModel("新增失败")
            }
        }, function (error) {
            console.log(parm)
            $('.feeList:last').remove()
            comModel("新增失败")
        }, 2000)
		
	})	
	$('.feeAll').delegate('.removeFee', 'click', function () {
	    var _this = $(this).parents('.feeList')
	    //删除一条费用
	    var parm = {
	        'Id': _this.find('#feeId').val(),
	    }
	    console.log(parm)
	    common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=cancelfee', parm, function (data) {
	        if (data.State == 1) {
	            _this.remove()
	            comModel("删除成功")
	        } else {
	            comModel("删除失败")
	        }
	    }, function (error) {
	        comModel("删除失败")
	    }, 2000)
	})
	
	
	/*保存应收应付*/
	$('#send_shoufu').on('click', function () {
	    var feeData = ''
        var flat = false
		for (var i = 0; i < $('.feeList').length; i++) {
		    if ($('.feeList').eq(i).find('.toCompany').val() == null) {
		        flat = true
		    }
		    if ($('.feeList').eq(i).find('#feePrice').val() != '0' && $('.feeList').eq(i).find('#isLock').val() == '0') {
		        var feeId = $('.feeList').eq(i).find('#feeId').val()
                var toCompany = $('.feeList').eq(i).find('.toCompany').val()
                var feeItem = $('.feeList').eq(i).find('.feeItem').val()
                var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
                var numUnit = $('.feeList').eq(i).find('#numUnit').val()
                var feeType = $('.feeList').eq(i).find('#feeType').val()
                var feeNum = $('.feeList').eq(i).find('#feeNum').val()
                var feePrice = $('.feeList').eq(i).find('#feePrice').val()
                var receiptRate = $('.feeList').eq(i).find('#receiptRate').val()
                var receiptFeeUnit = $('.feeList').eq(i).find('#receiptFeeUnit').val()
                var receiptFee = $('.feeList').eq(i).find('#receiptFee').val()
                var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()
            
                //if ($('.feeList').eq(i).find("#cancelMoney").text()!="0" || $('.feeList').eq(i).find("#receiptNumber").text()!="0" || $('.feeList').eq(i).find("#invoiceNumber").text()!="0") {
                //if ($('.feeList').eq(i).find("#cancelMoney").text()=="0" || $('.feeList').eq(i).find("#cancelMoney").text()=="") {
                //if ($('.feeList').eq(i).find("#receiptNumber").text()=="0" || $('.feeList').eq(i).find("#receiptNumber").text()=="") {
                    //alert($('.feeList').eq(i).find("#cancelMoney").text())
                var feeoneData = feeId + ',' + feeType + ',' + toCompany + ',' + feeItem + ',' + feeUnit + ',' + feeNum + ',' + feePrice + ',' + numUnit + ',' + receiptRate + ',' + receiptFeeUnit + ',' + receiptFee + ',' + feeBeizhu + ';'
                    feeData = feeData + feeoneData
                //}
		    }
		    if ($.inArray(($('.feeList').eq(i).find('.toCompany').val() + ';' + $('.feeList').eq(i).find('.toCompany').find("option:selected").text()), _toCompanySettleArr) < 0) {
		        _toCompanySettleArr.push($('.feeList').eq(i).find('.toCompany').val() + ';' + $('.feeList').eq(i).find('.toCompany').find("option:selected").text());
		        _htmlCompanySettle = '<option value="' + $('.feeList').eq(i).find('.toCompany').val() + '">' + $('.feeList').eq(i).find('.toCompany').find("option:selected").text() + '</option>';
		        _CompanySettle = _CompanySettle + _htmlCompanySettle
		    }
		}
		console.log(feeData)
		if (flat == true) {
		    comModel("结算公司不能为空")
            return
		}
		
		var parm = {
			'bookingId': Id,
			'userId': userID,
			'userName': userName,
			'feeData': feeData,
			'allprofit': allprofit
		}
		console.log(parm)
		common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfee', parm, function(data) {
			if(data.State == 1) {
			    comModel("保存成功")
			    $('#toCompany_4').html('<option value="">请选择</option>' + _CompanySettle);
			    $('#toCompany_5').html('<option value="">请选择</option>' + _CompanySettle);
			} else {
				comModel("保存失败")
			}
		}, function(error) {
			console.log(parm)
		}, 2000)
	    feeNewOrder()
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
	        return
	    } else if ($('#payNumber').val() == "") {
	        comModel("请填写账单号码！")
	        return
	    }else{
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'userName': userName,
	            'toCompany': $('#toCompany_2').val(),
	            'payNumber': $('#payNumber').val(),
	            'typeId': 1,
	            'payType': $("input[name='invDebOrCrd']:checked").val(),
                //'typeId': $("input[name='invDebOrCrd']:checked").val(),
	            'bank': $('#bank').val(),
	            'beizhu': $('#beizhu').val(),
	            'addtime': $('#id-date-picker-1').val(),
                'payPrice': _arrfee00dataGather_toString,
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
        _getFee($('#toCompany_2').val())

        if($("#example tbody td").hasClass("dataTables_empty")){
            var tableTrNumPayNumber=getChar($("#example tr").length-2);
        }else{
            var tableTrNumPayNumber=getChar($("#example tr").length-1);
        }        
        $('#payNumber').val('INV'+orderCode+tableTrNumPayNumber)
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
	        return
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany_3').val(),
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
	            'invoiceNumber': $('#cninvoiceNumber').val(),
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
	        return
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany_4').val(),
	            //'payNumber': $('#payNumber4').val(),
	            'typeId': 3,
	            'invoiceNumber': $('#cninvoiceNumber4').val(),
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


    /*新增销账申请*/
	$('#send_bill_get').on('click', function () {
	    var feedata = [], cancelFee = [];
	    $("input[name='feeli']:checked").each(function (index, item) {
	        feedata.push($(this).val());
	        cancelFee.push($(this).attr("getCancelfee"));
	    });
	    console.log(cancelFee.toString())
	    var feeItem = "";
	    if (feedata.toString() != '') {
	        feeItem = feedata.toString()
	    }
	    if (feeItem == "") {
	        comModel("请选择账单！")
            return
	    } if ($('#cancel_type').val() == "") {
	        comModel("请选择销账类别！")
	        return
	    } else {
	        var parm = {
	            'state': 1,
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany_5').val(),
	            //'payNumber': $('#payNumber5').val(),
	            'preCode': $('#payNumber5').val(),
	            'typeId': cancel_type,
	            'bank': $('#bank5').val(),
	            //'payPrice': $('#payPrice5').val(),
	            'money': $('#payPrice5').val(),
	            'beizhu': $('#beizhu5').val(),
	            'payType': $('#cancel_type').val(),
	            'currency': $('#cancel_unit').val(),
	            'file': $("#Nav5").val()+$("#Pname5").val(),
	            'addtime': $('#id-date-picker-3').val(),
	            'feeItem': feeItem,
	            'cancelFee': cancelFee.toString()
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'cancelaccount.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("保存成功")
	                billGetTable.fnReloadAjax(billGetTable.fnSettings());
	            } else {
	                comModel("保存失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }        
        //$("#cancel_type option:first").prop("selected", 'selected');
        _getFee5($('#toCompany_5').val(), $('#cancel_type').val());
        $("#payPrice5").val(0);
        cancel_all_money = 0;
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
	        return
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany_6').val(),
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
	        return
	    } else if ($("#Pname").val() == "") {
	        comModel("请选择上传的文件！")
	        return
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'typeId': 1,
	            'name': $('#filename').val(),
	            'nav': $('#Nav').val(),
	            "url": $("#Pname").val()
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'files.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("新增成功")
	                $('#filename').val("")
	                $('#Nav').val(""),
                    $("#Pname").val("")
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
	    var fileUpload = $("#img").get(0);
	    var files = fileUpload.files;

	    var data = new FormData();
	    for (var i = 0; i < files.length; i++) {
	        data.append(files[i].name, files[i]);
	        data.append("companyId", companyID);
	    }

	    $.ajax({
	        url: dataUrl + "ajax/uploadFile.ashx",
	        type: "POST",
	        data: data,
	        contentType: false,
	        processData: false,
	        success: function (result) {
	            res = JSON.parse(result)
	            if (res.State == '100') {
	                $('#showimg').text(res.Picurl);
	                $('#toShow').attr("href", res.Picurl);
	                $('#Pname').val(res.Pname);
	                $('#Nav').val(res.Nav);
	            } else if (res.State == '101') {
	                $('#showimg').text("上传文件格式不对");
	            } else {
	                $('#showimg').text("上传失败");
	            }

	        },
	        error: function (err) {
	            alert(err.statusText)
	        }
	    });
	    //var img = event.target.files[0];
	    //// 判断是否图片  
	    //if (!img) {
	    //    return;
	    //}

	    //// 判断图片格式  
	    //if (!(img.type.indexOf('image') == 0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name))) {
	    //    alert('图片只能是jpg,gif,png');
	    //    return;
	    //}

	    //var reader = new FileReader();
	    //reader.readAsDataURL(img);

	    //reader.onload = function (e) { // reader onload start  
	    //    // ajax 上传图片  
	    //    $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, action: 'order' }, function (ret) {
	    //        if (ret.State == '100') {
	    //            //alert(ret.Picurl);
	    //            $('#showimg').attr('src', ret.Picurl);
	    //            $('#Pname').val(ret.Pname);
	    //            //$('#showimg').html('<img src="' + ret.Data + '">');
	    //        } else {
	    //            alert('上传失败');
	    //        }
	    //    }, 'json');
	    //} // reader onload end  
	})

    // 选择图片  
	$("#img5").on("change", function () {
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
	        $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, companyId: companyID }, function (ret) {
	            if (ret.State == '100') {
	                //alert(ret.Picurl);
	                $('#showimg5').attr('src', ret.Picurl);
	                $('#Nav5').val(ret.Nav);
	                $('#Pname5').val(ret.Pname);
	                //$('#showimg').html('<img src="' + ret.Data + '">');
	            } else {
	                alert('上传失败');
	            }
	        }, 'json');
	    } // reader onload end  
	})


    /**
     * 表格初始化
     * @returns {*|jQuery}
     */
    function initLocalchargeListTable() {
        
        var table = $("#dataTableLocalCharge").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl+'ajax/localcharge.ashx?action=read&companyId='+companyID,
            'bPaginate': false,
            //"searching": false, //去掉搜索框 
    //      "bDestory": true,
    //      "bRetrieve": true,
    //      "bFilter": false,
            "bSort": false,
            // "aaSorting": [[ 7, "desc" ]],
            // "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            //     {"bSortable": false, "aTargets": [0,6,8]}
            // ],
    //      "bProcessing": true,
            "aoColumns": [
                {
                    "mDataProp": "comp_code",
                    "createdCell": function (td, cellData, rowData, row, col) {
                        if (cellData) {
                            $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                        }
                    }
                },
                { "mDataProp": "loch_type",
                    "createdCell": function (td, cellData, rowData, row, col) {
                        // $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //  .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
                        $(td).html("<a target='_blank' href='localchargeview.html?action=view&Id="+ rowData.loch_id +"'> " + cellData + "</a>")
                    }
                },
                { "mDataProp": "loch_from" },
                { "mDataProp": "loch_carrier" },
                { "mDataProp": "loch_port1" },
                // {
                //     "mDataProp": "loch_id",
                //     "createdCell": function (td, cellData, rowData, row, col) {
                //         $(td).html(rowData.loch_useTime1.substring(0, 10) + ' <i class="fa fa-long-arrow-right"></i> ' + rowData.loch_useTime2.substring(0, 10));
                //     }           
                // },          
                {
                    "mDataProp": "loch_id",
                    "createdCell": function (td, cellData, rowData, row, col) {
                        // $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //  .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
                        $(td).html("<a class='btn btn-blue btn-sm' id='_chooseLocalcharge' href='javascript:void(0);' name='"+rowData.loch_id+"'>" + get_lan('pickup') + "</a>")
                    }
                },
            ],
    //      "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
    //      "sPaginationType": "bootstrap",
            "oLanguage": {
    //          "sUrl": "js/zh-CN.txt"
    //          "sSearch": "快速过滤："
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
                $('[data-toggle="popover"]').popover();
            }
        });

        
        return table;
    }

    //添加本地应收费用模板按钮
    $("#addFeeDebitLocal_btn").on("click",function(){
        $("#debitOrCredit").val("debit");
        $("#localChargeDebitOrCredit").text("应收");
        $("#myModal").modal("show");
        $('#toCompanyLocal').val($('#crmuser').val()).trigger("change")
    });

    //添加本地应付费用模板按钮
    $("#addFeeCreditLocal_btn").on("click", function () {
        if (forwarder_id != 0 || toYingFuUser != 0) {
            $("#debitOrCredit").val("credit");
            $("#localChargeDebitOrCredit").text("应付");
            $("#myModal").modal("show");
            console.log(forwarder_id)
            $('#toCompanyLocal').val(forwarder_id).trigger("change")
        } else {
            alert("先增加一条应付费用并保存再添加本地费用模板")
        }

        //alert(containerType);
    });
    $("#copyFee").on("click", function () {
        $("#myModalFee").modal("show");
    });

    /*下一步*/
    $('#btnSaveCopy').on('click', function () {
        copy_code = $('#inputOrderCode').val()
        var str = '';
        $(".checkCopy:checked").each(function (i, o) {
            str += $(this).val();
            str += ",";
        });


        if (!copy_code) {
            comModel("请输入复制的订单号")
        } else if (str == '') {
            comModel("请选择复制的类型")
        } else {
            var parm = {
                'userId': userID,
                'orderId': Id,
                'copy_code': copy_code,
                'copy_feetype': str.substring(0, str.length - 1)
            }

            common.ajax_req('Post', true, dataUrl, 'booking.ashx?action=copyfee', parm, function (data) {
                if (data.State == 1) {
                    comModel(data.Data)
                    location.reload();
                } else {
                    comModel(data.Data)
                }
            }, function (error) {
                console.log(parm)
            }, 10000)
        }

    });


    $.fn.modal.Constructor.prototype.enforceFocus = function(){};

    //添加应收应付模板
   // function _chooseLocalcharge(o){
    $('#dataTableLocalCharge').delegate('#_chooseLocalcharge','click', function() {
    //$("#_chooseLocalcharge").on("click",function(){
        var o=$(this).attr('name');
        //alert(o);
        //var feeboxAll_len="";
        
            common.ajax_req("get", true, dataUrl, "localcharge.ashx?action=readbyid", {
                "Id": o
            }, function(data) {
                console.log(data.Data)
                var _data = data.Data

                var feeItemAll = _data.loch_feeItem.split(';')
                var containerTypeAll=containerType.split(';')
                console.log(feeItemAll.length);
                for (var i = 0; i < feeItemAll.length-1; i++) {
                    feeboxAll_len=$('.feeList').length+1;
                    console.log(i);
                    var feeItem0 = feeItemAll[i].split(',')
                    var _html ='<tr><td>'+feeItem0[0]+'</td><td>'+(feeItem0[2]!=0?(feeItem0[1]+feeItem0[2]):"")+'</td><td>'+(feeItem0[3]!=0?(feeItem0[1]+feeItem0[3]):"")+'</td><td>'+(feeItem0[4]!=0?(feeItem0[1]+feeItem0[4]):"")+'</td><td>'+(feeItem0[5]!=0?(feeItem0[1]+feeItem0[5]):"")+'</td><td>'+feeItem0[6]+'</td></tr>'
                    var _feeUnitLocal="";
                    var _feePriceLocal="";

                    if(feeItem0[2]!=""){
                        _feePriceLocal=feeItem0[2];
                        var feeboxRow = '<div class="col-sm-12 feeList"><input type="hidden" id="feeId" value="0"><input type="hidden" id="isLock" value="0">'+
                            '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
                            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
                            '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
                            '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
                            '<input type="text" class="form-control" id="feePrice" placeholder="" value="'+_feePriceLocal+'" ></div>'+
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
                            '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
                            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;" disabled="disabled">'+
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" disabled="disabled"></select></span>'+
                            '<input type="text" class="form-control" id="receiptFee" value="'+_feePriceLocal+'" placeholder="" disabled="disabled"></div>'+
                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;">'+
                            '<label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>' +
                            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'
                            //feeboxAll_len=$('.feeList').length+1;   
                        $('.feeAll').append(feeboxRow)
                        $('.feeList:last').find('#numUnit').append(_numUnit)
                        $('.feeList:last').find('#numUnit').val("SET").trigger("change")
                //      //费用类型
                        $('.feeList:last').find('.feeItem').append(_feeItem)
                        $('.feeList:last .feeItem option').filter(function(){return $(this).text()==feeItem0[0];}).attr("selected",true); //要再先插入数据后，SELECT2之前才生效
                        $("#feeItem"+feeboxAll_len).select2({
                            language: "zh-CN",
                            minimumInputLength: 2
                        });
                        console.log(feeItem0[0])

                //      //币种
                        $('.feeList:last').find('#feeUnit').append(_feeUnit)
                        $('.feeList:last').find('#feeUnit').val(feeItem0[1]).trigger("change")
                //      币种
                        $('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
                        $('.feeList:last').find('#receiptFeeUnit').val(feeItem0[1]).trigger("change")
                //      //单位

                    }else{
                        _feePriceLocal=0;
                        var feeboxRow = '<div class="col-sm-12 feeList"><input type="hidden" id="feeId" value="0"><input type="hidden" id="isLock" value="0">'+
                            '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
                            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
                            '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
                            '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
                            '<input type="text" class="form-control" id="feePrice" placeholder="" value="'+_feePriceLocal+'" ></div>'+
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
                            '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
                            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;" disabled="disabled">'+
                            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" disabled="disabled"></select></span>'+
                            '<input type="text" class="form-control" id="receiptFee" value="'+_feePriceLocal+'" placeholder="" disabled="disabled"></div>'+
                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;">'+
                            '<label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>' +
                            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
                            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>' 
                            //feeboxAll_len=$('.feeList').length+1;   
                        $('.feeAll').append(feeboxRow)
                        $('.feeList:last').find('#numUnit').append(_numUnit)

                        for(var j=0; j<containerTypeAll.length-1; j++){
                            var containerTypeAllNumType=containerTypeAll[j].split('×');
                            _feeUnitLocal=containerTypeAllNumType[1];
                            _feeNumLocal=containerTypeAllNumType[0];
                            if(_feeUnitLocal=="20'GP"){
                                console.log("20'gp")
                                $('.feeList:last').find('#numUnit').val("20'GP").trigger("change")
                                $('.feeList:last').find('#feePrice').val(feeItem0[3])
                            }else if(_feeUnitLocal=="40'GP"){
                                console.log("40'gp")
                                $('.feeList:last').find('#numUnit').val("40'GP").trigger("change")
                                $('.feeList:last').find('#feePrice').val(feeItem0[4])
                            }else if(_feeUnitLocal=="40'HQ"){
                                console.log("40'hq")
                                $('.feeList:last').find('#numUnit').val("40'HQ").trigger("change")
                                $('.feeList:last').find('#feePrice').val(feeItem0[5])
                            }else{
                                console.log("else")
                            }
                        }
                //      //费用类型
                        $('.feeList:last').find('.feeItem').append(_feeItem)
                        $('.feeList:last .feeItem option').filter(function(){return $(this).text()==feeItem0[0];}).attr("selected",true); //要再先插入数据后，SELECT2之前才生效
                        $("#feeItem"+feeboxAll_len).select2({
                            language: "zh-CN",
                            minimumInputLength: 2
                        });
                        console.log(feeItem0[0])

                //      //币种
                        $('.feeList:last').find('#feeUnit').append(_feeUnit)
                        $('.feeList:last').find('#feeUnit').val(feeItem0[1]).trigger("change")
                //      币种
                        $('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
                        $('.feeList:last').find('#receiptFeeUnit').val(feeItem0[1]).trigger("change")
                //      //单位

                    }

            //      //企业
                    $('.feeList:last').find('.toCompany').append(_toCompany)
                    //$("#toCompany"+feeboxAll_len).append(_toCompany)
                    $('.feeList:last').find('.toCompany').select2({
                        language: "zh-CN",
                        minimumInputLength: 2
                    });
                    $('.feeList:last').find('.toCompany').val($('#toCompanyLocal option:selected').attr("value")).trigger("change")

                    if($("#debitOrCredit").val()=="debit"){
                        $('.feeList:last').find('#feeType').val('debit').trigger("change")
                        $('.feeList:last').css("background-color","#b0e0e6")
                    }else if($("#debitOrCredit").val()=="credit"){   
                        $('.feeList:last').find('#feeType').val('credit').trigger("change")
                        $('.feeList:last').css("background-color","pink")
                    }

                    //新增保存一条
                    var parm = {
                        'bookingId': Id,
                        'userId': userID,
                        'userName': userName,
                        'feeType': $('.feeList:last').find('#feeType').val(),
                        'toCompany': $('.feeList:last').find('.toCompany').val(),
                        'feeItem': $('.feeList:last').find('.feeItem').val(),
                        'feeUnit': $('.feeList:last').find('#feeUnit').val(),
                        'numUnit': $('.feeList:last').find('#numUnit').val(),
                        'feeNum': $('.feeList:last').find('#feeNum').val(),
                        'feePrice': $('.feeList:last').find('#feePrice').val(),
                        'receiptRate': $('.feeList:last').find('#receiptRate').val(),
                        'receiptFeeUnit': $('.feeList:last').find('#receiptFeeUnit').val(),
                        'receiptFee': $('.feeList:last').find('#receiptFee').val(),
                        'beizhu': $('.feeList:last').find('#feeBeizhu').val()
                    }
                    console.log(parm)
                    common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfeeone', parm, function (data) {
                        if (data.State == 1) {
                            $('.feeList:last').find('#feeId').val(data.Data)
                            comModel("新增成功")
                        } else {
                            $('.feeList:last').remove()
                            comModel("新增失败")
                        }
                    }, function (error) {
                        console.log(parm)
                        $('.feeList:last').remove()
                        comModel("新增失败")
                    }, 2000)
                    $("#myModal").modal("hide");

                }

            }, function(err) {
                console.log(err)
            }, 5000)
    })

    function OpenLocalChargeModal() {
        $("#myModal").modal("show");
    //$('#bookId').val(id)
    }

    /**
     * 初始化弹出层
     */
    function initModal() {
        $('#myModal').on('show', function() {
            $(".page-body").addClass('modal-open');
            $('<div class="modal-backdrop fade in"></div>').appendTo($(".page-body"));
        });
    }




    function _toShouKuangFun(Id) {
        $("#myTab li").removeClass('active');
        $("#myTab li").eq(5).addClass('active');
        $(".tab-content div").removeClass('in active');
        $("#SHOUKUANG").addClass('in active');
        $("#toCompany_5").val(Id).trigger("change")
        _getFee5(Id, $('#cancel_type').val())
    }
    function _toFaPiaoFun(Id) {
        $("#myTab li").removeClass('active');
        $("#myTab li").eq(3).addClass('active');
        $(".tab-content div").removeClass('in active');
        $("#FAPIAO").addClass('in active');
        $("#toCompany_3").val(Id).trigger("change")
        _getFee3(Id)
    }

    //发票费用明细
    function _getFee3(toCompany) {
        var _thisBkgId;
        $('#_invThisBkgId').is(':checked') ? _thisBkgId=Id:_thisBkgId=0;
        //alert(Id);
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "bookingId": _thisBkgId,
            "toCompany": toCompany,
            "companyId": companyId,
            "feeType": "debit" //0是debit & credit，1是debit，2是credit
        }, function (data) {
            //console.log(data)
            if (data.State == 1) {
                $(".fee33").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    if (_data[i].bofe_invoiceNumber=="0") {  //20211105 判断该挑费用是否已经有了发票号码
                        var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="' + _data[i].bofe_feeUnit + '" getAllfee="' + _data[i].bofe_allFee + '" /></label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_orderCode + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptRate + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFeeUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFee + '</label>' +
                            '</div>'
                        $(".fee33").prepend(feelist)
                    }
                }
            } else {
                $(".fee33").empty()
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }

    //收款销账
    function _getFee5(toCompany, feeType) {
        if (toCompany == '') {
            toCompany = -1
        }
        var _thisBkgId;
        $('#_billgetThisBkgId').is(':checked') ? _thisBkgId = Id : _thisBkgId = 0;
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
            "bookingId": _thisBkgId,
            "toCompany": toCompany,
            "feeType": feeType, //0是debit & credit，1是debit，2是credit
            "state":1
        }, function (data) {
            console.log(data)
            if (data.State == 1) {
                $(".fee55").empty()
                var _data = data.Data;
                for (var i = 0; i < _data.length; i++) {
                    if (_data[i].bofe_shasprecrcp == '0' || _data[i].bofe_hascrcp == '0') {  //20211105 判断该挑费用是否已经有了发票号码
                        var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="' + _data[i].bofe_feeUnit + '" getAllfee="' + _data[i].bofe_allFee + '" getCancelfee="0" /></label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;">' + _data[i].bofe_feeType + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_orderCode + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
                                '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
                            '</div>'
                        $(".fee55").prepend(feelist)
                    }
                }
            } else {
                $(".fee55").empty()
            }

        }, function (err) {
            console.log(err)
        }, 2000)
    }

    $(".checkAll").on("click", function () {
        if ($(this).prop('checked')) {
            var ck = $("input[name='feeli']").prop("checked", true);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
            var fee00data = [];
            var fee00dataTostring = [];
            var _arrfee00Unit = [];
            var z = "0";
            var fee00dataCurrency;
            var _arrfee00dataAmount = [];
            var _arrfee00dataGather = [];
            $(".fee00 input[name='feeli']:checked").each(function (index, item) {
                fee00data.push($(this).attr("getUnit") + " " + $(this).attr("getAllfee"));
                if ($.inArray($(this).attr("getUnit"), _arrfee00Unit) == -1) {
                    _arrfee00Unit.push($(this).attr("getUnit"));
                }
            });

            if (_arrfee00Unit.length > 1) {
                _arrfee00dataGather = [];
                for (var i = 0; i < _arrfee00Unit.length; i++) {

                    $(".fee00 input[name='feeli']:checked").each(function () {
                        if ($(this).attr("getUnit") == _arrfee00Unit[i]) {
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            z = +z * 1 + (+$(this).attr("getAllfee")) * 1;
                        }
                    })
                    _arrfee00dataAmount.push(z.toFixed(2));
                    fee00dataCurrency = fee00dataCurrency + _arrfee00Unit[i] + " " + (i > 0 ? parseFloat(+_arrfee00dataAmount[i] - +_arrfee00dataAmount[i - 1]).toFixed(2) : parseFloat(_arrfee00dataAmount[i]).toFixed(2)) + ", ";
                    _arrfee00dataGather.push(_arrfee00Unit[i] + " " + (i > 0 ? parseFloat(+_arrfee00dataAmount[i] - +_arrfee00dataAmount[i - 1]).toFixed(2) : parseFloat(_arrfee00dataAmount[i]).toFixed(2)));
                }
                _arrfee00dataGather_toString = _arrfee00dataGather.toString();
            } else if (_arrfee00Unit.length == 0) {
                _arrfee00dataGather_toString = "";
            } else {
                _arrfee00dataGather = [];
                $(".fee00 input[name='feeli']:checked").each(function () {
                    //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                    z = +z * 1 + (+$(this).attr("getAllfee")) * 1;
                })
                _arrfee00dataGather.push(_arrfee00Unit[0] + " " + z);
                _arrfee00dataGather_toString = _arrfee00dataGather.toString();
            }
        } else {
            var ck = $("input[name='feeli']").prop("checked", false);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
            var fee00data = [];
            var fee00dataTostring = [];
            var _arrfee00Unit = [];
            var z = "0";
            var fee00dataCurrency;
            var _arrfee00dataAmount = [];
            var _arrfee00dataGather = [];
            $(".fee00 input[name='feeli']:checked").each(function (index, item) {
                fee00data.push($(this).attr("getUnit") + " " + $(this).attr("getAllfee"));
                if ($.inArray($(this).attr("getUnit"), _arrfee00Unit) == -1) {
                    _arrfee00Unit.push($(this).attr("getUnit"));
                }
            });

            if (_arrfee00Unit.length > 1) {
                _arrfee00dataGather = [];
                for (var i = 0; i < _arrfee00Unit.length; i++) {

                    $(".fee00 input[name='feeli']:checked").each(function () {
                        if ($(this).attr("getUnit") == _arrfee00Unit[i]) {
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            z = +z * 1 + (+$(this).attr("getAllfee")) * 1;
                        }
                    })
                    _arrfee00dataAmount.push(z.toFixed(2));
                    fee00dataCurrency = fee00dataCurrency + _arrfee00Unit[i] + " " + (i > 0 ? parseFloat(+_arrfee00dataAmount[i] - +_arrfee00dataAmount[i - 1]).toFixed(2) : parseFloat(_arrfee00dataAmount[i]).toFixed(2)) + ", ";
                    _arrfee00dataGather.push(_arrfee00Unit[i] + " " + (i > 0 ? parseFloat(+_arrfee00dataAmount[i] - +_arrfee00dataAmount[i - 1]).toFixed(2) : parseFloat(_arrfee00dataAmount[i]).toFixed(2)));
                }
                _arrfee00dataGather_toString = _arrfee00dataGather.toString();
            } else if (_arrfee00Unit.length == 0) {
                _arrfee00dataGather_toString = "";
            } else {
                _arrfee00dataGather = [];
                $(".fee00 input[name='feeli']:checked").each(function () {
                    //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                    z = +z * 1 + (+$(this).attr("getAllfee")) * 1;
                })
                _arrfee00dataGather.push(_arrfee00Unit[0] + " " + z);
                _arrfee00dataGather_toString = _arrfee00dataGather.toString();
            }
        }


    });
    $(".checkAll_shoufu").on("click", function () {
        if ($(this).prop('checked')) {
            if ($("#cancel_unit").val() == '') {
                comModel("请选择币种")
                $(this).prop("checked", false)
                return
            } else {
                var ck = $("input[name='feeli']").prop("checked", true);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
                $("input[name='feeli']:checked").each(function (i, o) {
                    var value_one = 0
                    var value = $(this).attr("getAllfee");
                    var value_unit = $(this).attr("getUnit")
                    if (value_unit == $("#cancel_unit").val()) {
                        value_one = value_one + value * 1
                    } else {
                        value_one = value_one + value * exchangeRate
                    }
                    //console.log($(this).parent().parent().find("label:eq(8)").html())
                    $(this).parent().parent().find("label:eq(9)").text(value_one)
                    $(this).attr("getCancelfee", value_one)
                    cancel_all_money = cancel_all_money + value_one
                });
                $("#payPrice5").val(cancel_all_money)
            }
        } else {
            var ck = $("input[name='feeli']").prop("checked", false);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
            $("input[name='feeli']").each(function (i, o) {
                $(this).parent().parent().find("label:eq(9)").text('0')
                $(this).attr("getCancelfee", "0")
            });
            $("#payPrice5").val("0")
        }
    });

})

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

/*账单对账详情*/
function _detailBillFun(Id) {
    $("#myModal1").modal("show");
    $(".fee_11").empty()
    common.ajax_req("get", true, dataUrl, "bill.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".bill_toCompany").text(_data.comp_name)
        $(".bill_addTime").text(_data.bill_addTime.substring(0, 10))
        $(".bill_bank").html(_data.rema_content.replace(/\n/g, '<br/>'))
        $(".bill_payNumber").text(_data.bill_payNumber)
        $(".bill_beizhu").text(_data.bill_beizhu)

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
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_receiptRate + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_settlementRate + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_receiptFeeUnit + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_receiptFee + '</label>' +
                    '</div></p>'
                    $(".fee_11").append(feelist)
                }


            }, function (err) {
                console.log(err)
            }, 1000)
        }

    }, function (err) {
        console.log(err)
    }, 1000)
}

/*发票详情*/
function _detailInvoiceFun(Id) {
    $("#myModal2").modal("show");
    $(".fee_22").empty()
    common.ajax_req("get", true, dataUrl, "invoice.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".invo_toCompany").text(_data.comp_name)
        $(".invo_addTime").text(_data.invo_addTime.substring(0, 10))
        $(".invo_number").text(_data.invo_number)
        $(".invo_feeUnit").text(_data.invo_feeUnit)
        $(".invo_vesselName").text(_data.invo_vesselName)
        $(".invo_voyage").text(_data.invo_voyage)
        $(".invo_format").text(_data.invo_format)
        $(".invo_port1").text(_data.invo_port1)
        $(".invo_port2").text(_data.invo_port2)
        $(".invo_invoiceTitle").text(_data.invo_invoiceTitle)
        $(".invo_invoiceTaxNumber").text(_data.invo_invoiceTaxNumber)
        $(".invo_logisticsAddress").text(_data.invo_logisticsAddress)
        $(".invo_logisticsContact").text(_data.invo_logisticsContact)
        $(".invo_invoiceAddressTel").text(_data.invo_invoiceAddressTel)
        $(".invo_logisticsTel").text(_data.invo_logisticsTel)
        $(".invo_invoiceBrank").text(_data.invo_invoiceBrank)
        $(".invo_invoiceNumber").text(_data.invo_invoiceNumber)
        $(".invo_logistics").text(_data.invo_logistics)
        $(".invo_logisticsNumber").text(_data.invo_logisticsNumber)

        var arrItem = _data.invo_feeItem.split(',')
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
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_receiptRate + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_settlementRate + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_receiptFeeUnit + '</label>' +
                        '<label for="inputPassword3" class="margin-right-10" style="width:7%; float: left;">' + _data.bofe_receiptFee + '</label>' +
                    '</div></p>'
                    $(".fee_22").append(feelist)
                }

            }, function (err) {
                console.log(err)
            }, 1000)
        }

    }, function (err) {
        console.log(err)
    }, 1000)
}

/*付款申请详情*/
function _detailBillPayFun(Id) {
    $("#myModal3").modal("show"); 
    $(".fee_33").empty()
    common.ajax_req("get", true, dataUrl, "bill.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".bill_toCompany").text(_data.comp_name)
        $(".bill_addTime").text(_data.bill_addTime.substring(0, 10))
        $(".bill_payType").text(_data.bill_payType)
        $(".bill_payNumber").text(_data.bill_payNumber)
        $(".bill_invoiceNumber").text(_data.bill_invoiceNumber)
        $(".bill_payPrice").text(_data.bill_payPrice)
        $(".bill_beizhu").text(_data.bill_beizhu)

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
                    $(".fee_33").append(feelist)
                }

            }, function (err) {
                console.log(err)
            }, 1000)
        }

    }, function (err) {
        console.log(err)
    }, 1000)
}


/*销账申请详情*/
function _detailBillGetFun(Id) {
    $("#myModal4").modal("show");
    $(".fee_44").empty()
    if (cancel_type == 4) { $("#mySmallModalLabel_Cancel").text("应收销账申请") }
    else if (cancel_type == 5) { $("#mySmallModalLabel_Cancel").text("应付销账申请") }
    
    common.ajax_req("get", true, dataUrl, "cancelaccount.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".bill_toCompany").text(_data.comp_name)
        $(".bill_addTime").text(_data.caac_addTime.substring(0, 10))
        if (_data.rema_content != null) {
            $(".bill_bank").html(_data.rema_content.replace(/\n/g, '<br/>'))
        }
        $(".bill_payNumber").text(_data.caac_preCode)
        $(".bill_payPrice").text(_data.caac_money)
        $(".bill_currency").text(_data.caac_currency)
        $(".bill_beizhu").text(_data.caac_beizhu)
        //$(".bill_file").text(_data.bill_currency)
        if (_data.caac_file != "") {
            $('#showimg55').show()
            $('#showimg55').attr('src', dataUrl + _data.caac_file);
        } else {
            $('#showimg55').hide()
        }

        var arrItem = _data.caac_feeItem.split(',')
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
 * 删除
 * @param id
 * @private
 */
function _deleteBillFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/bill.ashx?action=cancel',
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
        $("#toCompany_2 option:first").prop("selected", 'selected');
        $(".fee00").empty();
    });
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteBillPayFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/bill.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        billPayTable.fnReloadAjax(oTable.fnSettings());
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

/**
 * 删除
 * @param id
 * @private
 */
function _deleteBillGetFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/cancelaccount.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        billGetTable.fnReloadAjax(billGetTable.fnSettings());
                    } else {
                        alert("Delete Failed！");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        $("#toCompany_5 option:first").prop("selected", 'selected');
        $(".fee55").empty();

    });
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteInvoiceFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/invoice.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        invoiceTable.fnReloadAjax(oTable.fnSettings());
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

/**
 * 删除
 * @param id
 * @private
 */
function _deleteGysFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/supplierbill.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        gysBillTable.fnReloadAjax(oTable.fnSettings());
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

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFileFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/files.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        filesTable.fnReloadAjax(oTable.fnSettings());
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
$.fn.dataTableExt.oApi.fnReloadAjax = function (oSettings) {
    //oSettings.sAjaxSource = sNewSource;
    this.fnClearTable(this);
    this.oApi._fnProcessingDisplay(oSettings, true);
    var that = this;

    $.getJSON(oSettings.sAjaxSource, null, function (json) {
        /* Got the data - add it to the table */
        for (var i = 0; i < json.data.length; i++) {
            that.oApi._fnAddData(oSettings, json.data[i]);
        }
        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        that.fnDraw(that);
        that.oApi._fnProcessingDisplay(oSettings, false);
    });
}
