//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
            "con_top_3" : "财务管理", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "Financial MANAGEMENTe",
            "con_top_3" : "Fee Manage", 
        };

var _feeItemArr = new Array();

$(function(){
    hasPermission('1310'); //权限控制：查看费用管理
    hasPermission('1315');
    hasPermission('1318');
    hasPermission('1320');
	$('.navli5').addClass("active open")
	$('.financial7').addClass("active")

	this.title = get_lan('con_top_3')
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3'))

//	var crmCompanyId = '0',crmContactId = '0';
//	if(GetQueryString('crmId')!=null){
//		crmCompanyId=GetQueryString('crmId')
//		_selectSupplier(crmCompanyId)
//		_selectBill(crmCompanyId)
//	}

	//var Id = GetQueryString('Id');
    var _toCompany='',_feeItem='',_feeUnit='',_numUnit='';
    
    var _toCompanySettleArr=new Array();
    var _htmlCompanySettle='';
    var _CompanySettle='';
	var oTable, invoiceTable, billPayTable, billGetTable;
	var orderCode;
	var crmId;
    var forwarder_id;
    var localCurrency;
    var containerType;    
    var _arrExchangeRate= new Array();
    var _arrfee00dataGather_toString;
    //initLocalchargeListTable();

    common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
        "companyId": companyID
    }, function(data) {
        //console.log(data.Data)
        //初始化信息
        var _data = data.Data
        localCurrency=_data.wein_currency;
    }, function(err) {
        console.log(err)
    }, 2000)
	
	
    //费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' - '+_data[i].puda_name_en+'</option>';
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
        var fee55data = [];
        var fee55dataTostring = [];
        var _arrfee55Unit = [];
        var z="0";
        var fee55dataCurrency;
        var _arrfee55dataAmount=[];
        var _arrfee55dataGather=[];
        $(".fee55 input[name='feeli']:checked").each(function (index, item) {
            fee55data.push($(this).attr("getUnit")+" "+$(this).attr("getAllfee"));
            if($.inArray($(this).attr("getUnit"), _arrfee55Unit)==-1){
                _arrfee55Unit.push($(this).attr("getUnit"));
            }
        });

        if(_arrfee55Unit.length>1){
            _arrfee55dataGather=[];
            for(var i = 0; i < _arrfee55Unit.length; i++) {

                $(".fee55 input[name='feeli']:checked").each(function(){
                    if($(this).attr("getUnit")==_arrfee55Unit[i]){
                            //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                            z=+z*1+(+$(this).attr("getAllfee"))*1;
                    }
                })
                _arrfee55dataAmount.push(z.toFixed(2));
                fee55dataCurrency=fee55dataCurrency+_arrfee55Unit[i]+" "+(i>0?parseFloat(+_arrfee55dataAmount[i] - +_arrfee55dataAmount[i-1]).toFixed(2):parseFloat(_arrfee55dataAmount[i]).toFixed(2))+", ";
                _arrfee55dataGather.push(_arrfee55Unit[i]+" "+(i>0?parseFloat(+_arrfee55dataAmount[i] - +_arrfee55dataAmount[i-1]).toFixed(2):parseFloat(_arrfee55dataAmount[i]).toFixed(2)));
            }
            $("#payPrice5").val(_arrfee55dataGather.toString())
        }else if(_arrfee55Unit.length==0){
            $("#payPrice5").val("");
        }else{
            _arrfee55dataGather=[];
            $(".fee55 input[name='feeli']:checked").each(function(){
                        //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
                z=+z*1+(+$(this).attr("getAllfee"))*1;
            })
            _arrfee55dataGather.push(_arrfee55Unit[0]+" "+z);
            $("#payPrice5").val(_arrfee55dataGather.toString())
        }
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
        //console.log(data)
        var _data = data.data;
        if(_data != null) {
            for(var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].comp_customerId + '" name="'+_data[i].comp_id+'">' + _data[i].comp_name + '</option>';
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
    


    ////统计总利润，总应收，总应付
    //function gatherDebitCredit(){
    //    var _arrDebit = new Array();
    //    var _arrDebitAmount = new Array();
    //    var _arrCredit = new Array();
    //    var _arrCreditAmount = new Array();
    //    var _debitCurrency=""
    //    var _creditCurrency=""
    //    var z="0";
    //    var _arrDebitGather= new Array();        
    //    var y="0";
    //    var _arrCreditGather= new Array();

    //    $(".feeList").each(function(){
    //        if($(this).find("#feeType").val()=="debit"){
    //            //alert("1111")
    //            if($.inArray($(this).find("#feeUnit").val(), _arrDebit)==-1){
    //                _arrDebit.push($(this).find("#feeUnit").val());
    //            }
    //        }else if($(this).find("#feeType").val()=="credit"){
    //            //alert("2222")
    //            if($.inArray($(this).find("#feeUnit").val(), _arrCredit)==-1){
    //                _arrCredit.push($(this).find("#feeUnit").val());
    //            }
    //        }
    //    })
    //    console.log(_arrDebit)
    //    //算出应收的各币种总和
    //    if(_arrDebit.length>1){
    //        for(var i = 0; i < _arrDebit.length; i++) {

    //            $(".feeList").each(function(){
    //                if($(this).find("#feeType").val()=="debit" && $(this).find("#feeUnit").val()==_arrDebit[i]){
    //                        //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
    //                        z=+z*1+(+$(this).find("#feePrice").val()*$(this).find("#feeNum").val())*1;
    //                }
    //            })
    //            _arrDebitAmount.push(z.toFixed(2));
    //            _debitCurrency=_debitCurrency+_arrDebit[i]+" "+(i>0?parseFloat(+_arrDebitAmount[i] - +_arrDebitAmount[i-1]).toFixed(2):parseFloat(_arrDebitAmount[i]).toFixed(2))+", ";
    //            _arrDebitGather.push(_arrDebit[i]+" "+(i>0?parseFloat(+_arrDebitAmount[i] - +_arrDebitAmount[i-1]).toFixed(2):parseFloat(_arrDebitAmount[i]).toFixed(2)));
    //        }
            
    //        $("#debitTotal").text(_debitCurrency)

    //    }else if(_arrDebit.length==0){
    //        $("#debitTotal").text(localCurrency+" "+parseFloat(z).toFixed(2));
    //        _arrDebitGather.push(localCurrency+" "+parseFloat(z).toFixed(2));
    //    }else{
    //        $(".feeList").each(function(){
    //            if($(this).find("#feeType").val()=="debit"){
    //                //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
    //                z=+z + (+$(this).find("#feePrice").val() * +$(this).find("#feeNum").val());
    //            }
    //        })
    //        $("#debitTotal").text(_arrDebit[0]+" "+parseFloat(z).toFixed(2))
    //        _arrDebitGather.push(_arrDebit[0]+" "+parseFloat(z).toFixed(2));
    //    console.log(_arrDebitGather)
    //    }
    //    //算出应付的各币种总和
    //    if(_arrCredit.length>1){
    //        for(var i = 0; i < _arrCredit.length; i++) {

    //            $(".feeList").each(function(){
    //                if($(this).find("#feeType").val()=="credit" && $(this).find("#feeUnit").val()==_arrCredit[i]){
    //                        //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
    //                        y=+y + (+$(this).find("#feePrice").val() * +$(this).find("#feeNum").val());
    //                }
    //            })
    //            _arrCreditAmount.push(y);
    //            _creditCurrency=_creditCurrency+_arrCredit[i]+" "+(i>0?parseFloat(+_arrCreditAmount[i] - +_arrCreditAmount[i-1]).toFixed(2):parseFloat(_arrCreditAmount[i]).toFixed(2))+", ";
    //            _arrCreditGather.push(_arrCredit[i]+" "+(i>0?parseFloat(+_arrCreditAmount[i] - +_arrCreditAmount[i-1]).toFixed(2):parseFloat(_arrCreditAmount[i]).toFixed(2)));
    //        }
            
    //        $("#creditTotal").text(_creditCurrency)

    //    }else if(_arrCredit.length==0){
    //        $("#creditTotal").text(localCurrency+" "+parseFloat(y).toFixed(2));
    //        _arrCreditGather.push(localCurrency+" "+parseFloat(y).toFixed(2));
    //    }else{

    //        $(".feeList").each(function(){
    //            if($(this).find("#feeType").val()=="credit"){
    //                //数值前添加+号  number加号和数值加号需要用空格隔开 即实现加法运算
    //                y=+y + (+$(this).find("#feePrice").val() * +$(this).find("#feeNum").val());
    //            }
    //        })
    //        $("#creditTotal").text(_arrCredit[0]+" "+y.toFixed(2));
    //        _arrCreditGather.push(_arrCredit[0]+" "+y.toFixed(2));
    //    }
    //    getProfit(_arrDebitGather,_arrCreditGather);
    //}

//    //计算当票利润，根据DEBIT/CREDIT来计算的。
//    function getProfit(debit,credit){
//        console.log(debit)
//        console.log(credit)
//        var _debitCurInProfit;
//        var _debitRateInProfit=0;
//        var _creditCurInProfit;
//        var _creditRateInProfit=0;
//        var _debits=new Array();
//        var _credits=new Array();
//        var _debitJudge=0;
//        var _creditJudge=0;
//        var _currencyJudge=0;

//        //将汇率装进数组中，便于使用
//        common.ajax_req('GET', false, dataUrl, 'exchangerate.ashx?action=read', {
//            'companyId': companyID
//        }, function(data) {
//            var _data = data.data;            
//            for(var i = 0; i < _data.length; i++) {
//                _arrExchangeRate.push(_data[i]);
//            }
//        }, function(err) {
//            console.log(err)
//        }, 1000)

//        for(var j=0;j<debit.length;j++){
//            console.log(debit[j])
//            _debits=debit[j].split(" ");
//            var _debitAmount=0;
//            if(_debits[0]==localCurrency){
//                _debitAmount=_debits[1];
//            }else{
//                for(var z=0;z<_arrExchangeRate.length;z++){
//                    var _timeFrom=new Date((_arrExchangeRate[z].rate_timeFrom).split('T')[0]);
//                    var _timeFromFormat=_timeFrom.getTime();
//                    var _timeEnd=new Date((_arrExchangeRate[z].rate_timeEnd).split('T')[0]);
//                    var _timeEndFormat=_timeEnd.getTime();
//                    var _nowTime=new Date();
//                    var _nowTimeFormat=_nowTime.getTime();
//                    if(_debits[0]==_arrExchangeRate[z].rate_oldCurrency && _arrExchangeRate[z].rate_newCurrency==localCurrency && _timeFromFormat<_nowTimeFormat<_timeEndFormat){
//                        if(_arrExchangeRate[z].rate_symbol=="multiply"){
//                            _debitAmount=(_debits[1]*_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
//                        }else{
//                            _debitAmount=(_debits[1]/_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
//                        }
//                        _debitJudge=1;
//                    }
//                }
//                //一种折中的办法来测试该币种是否有汇率存在，如果没有的话目前只能是通知，不能动态显示在利润上。
//                if(_debitJudge==0){
//                        _currencyJudge=1;
//                    alert("No Exchange Rate for "+_debits[0]+", Please ask your Manager to add it.");
//                }
//                _debitJudge=0;
//            }

//            //下面有个*1是为了转换类型
//            _debitRateInProfit=_debitRateInProfit*1+_debitAmount*1;
//        }

//        for(var j=0;j<credit.length;j++){
//            console.log(credit[j])
//            _credits=credit[j].split(" ");
//            var _creditAmount=0;
//            if(_credits[0]==localCurrency){
//                _creditAmount=_credits[1];
//            }else{
//                for(var z=0;z<_arrExchangeRate.length;z++){
//                    console.log(_arrExchangeRate[z]);
//                    var _timeFrom=new Date((_arrExchangeRate[z].rate_timeFrom).split('T')[0]);
//                    var _timeFromFormat=_timeFrom.getTime();
//                    var _timeEnd=new Date((_arrExchangeRate[z].rate_timeEnd).split('T')[0]);
//                    var _timeEndFormat=_timeEnd.getTime();
//                    var _nowTime=new Date();
//                    var _nowTimeFormat=_nowTime.getTime();
//                    if(_credits[0]==_arrExchangeRate[z].rate_oldCurrency && _arrExchangeRate[z].rate_newCurrency==localCurrency && _timeFromFormat<_nowTimeFormat<_timeEndFormat){
//                        if(_arrExchangeRate[z].rate_symbol=="multiply"){
//                            _creditAmount=(_credits[1]*_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
//                        }else{
//                            _creditAmount=(_credits[1]/_arrExchangeRate[z].rate_exchangeRate).toFixed(2);
//                        }
//                        _creditJudge=1;
//                    }
//                }
//                if(_creditJudge==0){
//                        _currencyJudge=1;
//                    alert("No Exchange Rate for "+_credits[0]+", Please ask your Manager to add it.");
//                }
//                _creditJudge=0;
//            }
//            //下面有个*1是为了转换类型
//            _creditRateInProfit=_creditRateInProfit*1+_creditAmount*1;
//        }



//        //$("#profit").text(localCurrency+(_debitRateInProfit*1-_creditRateInProfit*1).toFixed(2)+" "+()+" "+())
//        $("#profit").html(localCurrency+(_debitRateInProfit*1-_creditRateInProfit*1).toFixed(2)+(_currencyJudge==1?" <i class='fa fa-question-circle tooltip-info blue' data-toggle='tooltip' data-placement='top' data-original-title='The profit should not right because there is no right exchange rate for some currency.'></i>":""))
//        $('[data-toggle="tooltip"]').tooltip();
//    }


//        console.log(_arrExchangeRate[1])
////feePrice, feeNum
//    //让费用列表按照应收在上面，应付在下面这样来重新排序
//    function feeNewOrder(){
//        var newOrder = $('.feeList').toArray()
//        newOrder=newOrder.sort(function (a, b) {
//            return $(a).attr("orderName") - $(b).attr("orderName")
//        });
//        $(".feeAll").append(newOrder)
//    }

//    $('.feeAll').delegate('#feeType', 'change', function() {
//        if($(this).val()=='debit'){
//            $(this).parent('.feeList').css("background-color","#b0e0e6")
//        }else{
//            $(this).parent('.feeList').css("background-color","pink")
//        }
//    })

    ////订单状态
    //common.ajax_req("get", false, dataUrl, "state.ashx?action=readbytypeid", {
    //    "typeId": 4
    //}, function(data) {
    //    console.log(data)
    //    var _data = data.data;
    //    if(_data != null) {
    //        for(var i = 0; i < _data.length; i++) {
    //            //var statelist = '<span class="col-sm-1 widget-caption text-align-center bordered-1 bordered-gray" stateId='+_data[i].state_id+'>' + _data[i].state_name_cn + '</span>'
    //            var statelist = '<li data-target="#simplewizardstep'+_data[i].state_id+'>">' + _data[i].state_name_cn + '<span class="chevron"></span></li>'
    //            $("#STATELIST").append(statelist)
    //        }
    //    }
        
    //    $('#STATELIST li').on('click', function() {
    //        var which=$(this)
    //        if((which.attr('stateId')-stateId)==1){             
    //            common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfollow', {
    //                'bookingId': Id,
    //                'userId': userID,
    //                'userName': userName,
    //                'stateId': which.attr('stateId'),
    //                'state': which.text()
    //            }, function(data) {
    //                if(data.State == 1) {
    //                    //console.log(which.text())
    //                    which.addClass('btn-blue')
    //                    comModel("操作成功")
    //                } else {
    //                    comModel("操作失败")
    //                }
    //            }, function(error) {
    //                console.log(parm)
    //            }, 1000)
    //        }else {
    //            comModel("不可操作")
    //        }

    //    })
    
    //}, function(err) {
    //    console.log(err)
    //}, 2000)

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

    ////销售人员
    //common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
    //    //'role': 6,
    //    'companyId': companyID
    //}, function(data) {
    //    var _data = data.data;
    //    if(_data!=null){
    //        for(var i = 0; i < _data.length; i++) {
    //            var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
    //            $('#sellId').append(_html)
    //        }
    //    }
    //}, function(error) {
    //    console.log(parm)
    //}, 1000)
    ////录入人员
    //common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
    //    //'role': 11,
    //    'companyId': companyID
    //}, function(data) {
    //    var _data = data.data;
    //    if(_data!=null){
    //        for(var i = 0; i < _data.length; i++) {
    //            var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
    //            $('#luruId').append(_html)
    //        }
    //    }
    //}, function(error) {
    //    console.log(parm)
    //}, 1000)    
    ////客服人员
    //common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
    //    //'role': 7,
    //    'companyId': companyID
    //}, function(data) {
    //    var _data = data.data;
    //    if(_data!=null){
    //        for(var i = 0; i < _data.length; i++) {
    //            var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
    //            $('#kefuId').append(_html)
    //        }
    //    }
    //}, function(error) {
    //    console.log(parm)
    //}, 1000)
    ////操作人员
    //common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
    //    //'role': 8,
    //    'companyId': companyID
    //}, function(data) {
    //    var _data = data.data;
    //    if(_data!=null){
    //        for(var i = 0; i < _data.length; i++) {
    //            var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
    //            $('#caozuoId').append(_html)
    //        }
    //    }
    //}, function(error) {
    //    console.log(parm)
    //}, 1000)    

    //var baseinfo_id = GetQueryString('Id');
    //if(baseinfo_id){        
    //    //加载基本信息
    //    common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
    //        "Id": Id
    //    }, function(data) {
    //        console.log(data.Data)
    //        //初始化信息
    //        var _data = data.Data
    //        stateId = _data.book_orderState
    //        var stateList=$('#STATELIST li')
    //        $.each(stateList,function(i,item){
    //            if((i+12)<=stateId){
    //                //item.addClass('btn-blue')
    //                //$('#STATELIST span').eq(i).addClass('btn-blue')
    //                $('#STATELIST li').eq(i).addClass('active')
    //            }
    //        })
    //        orderCode = _data.book_orderCode
    //        $('#title3').html('订单号：' + _data.book_orderCode)/////有用

    //        $('#payNumber').val('INV-'+_data.book_orderCode)
    //        $('#payNumber4').val('AD-'+_data.book_orderCode)
    //        $('#vesselName').val(_data.book_vessel)
    //        $('#voyage').val(_data.book_voyage)
    //        $('#port1').val(_data.book_port1)
    //        $('#port2').val(_data.book_port2)
    //        $('#outCode').val(_data.book_outCode)/////有用
    //        $('#billCode').val(_data.book_billCode)/////有用
    //        $('#code').val(_data.book_code)/////有用
    //        $("#crmuser").val(_data.book_crmCompanyId).trigger("change") /////有用
    //        //$("#crmcontact").val(_data.book_crmContactId).trigger("change")
    //        $("#sellId").val(_data.book_sellId).trigger("change")/////有用
    //        $("#luruId").val(_data.book_luruId).trigger("change")/////有用
    //        $("#kefuId").val(_data.book_kefuId).trigger("change")/////有用
    //        $("#caozuoId").val(_data.book_caozuoId).trigger("change")/////有用
    //        $("#movementType").val(_data.book_movementType).trigger("change")/////有用
    //        $("#incoterm").val(_data.book_incoterm).trigger("change")/////有用
    //        forwarder_id=_data.book_forwarder;
    //    }, function(err) {
    //        console.log(err)
    //    }, 1000)
    //}

    //账单管理
    function GetBill() {
        var table = $("#example").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&companyId='+companyID,
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
                { "mDataProp": "bill_formatId" },
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
                            var perDetail = perDel = perSend = perGet = ""
                            if (isPermission('1311') == 1) {
                                perDetail = "<a href='javascript:void(0);' onclick='_detailBillFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            if (isPermission('1312') == 1) {
                                perDel = "<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            if (isPermission('1313') == 1) {
                                perSend = "<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            if (isPermission('1314') == 1) {
                                perGet = "<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            $(nTd).html(perDetail)
                                .append(perDel)
                                .append(perSend)
                                .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append(perGet)
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

    //发票申请管理
    function GetInvoice() {
        var table = $("#InvoiceList").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/invoice.ashx?action=read&companyId='+companyID,
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
                            var perDetail = perDel = ""
                            if (isPermission('1316') == 1) {
                                perDetail = "<a href='javascript:void(0);' onclick='_detailInvoiceFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            if (isPermission('1317') == 1) {
                                perDel = "<a href='javascript:void(0);' onclick='_deleteInvoiceFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            $(nTd).html(perDetail)
                                .append(perDel)
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html(perDetail)
                                .append(perDel)
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
            "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&typeId=3&companyId=' + companyID,
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
                            var perDel = ""
                            if (isPermission('1319') == 1) {
                                perDel = "<a href='javascript:void(0);' onclick='_deleteBillPayFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillPayFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append(perDel)
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillPayFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append(perDel)
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
            "sAjaxSource": dataUrl + 'ajax/bill.ashx?action=read&typeId=4&companyId=' + companyID,
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
                            var perDel = ""
                            if (isPermission('1321') == 1) {
                                perDel = "<a href='javascript:void(0);' onclick='_deleteBillGetFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                            }
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillGetFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append(perDel)
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailBillGetFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append(perDel)
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
            ]
        });
        return table;
    }

    //销账申请管理
    function GetCancelApply() {
        var table = $("#cancelapplyList").dataTable({
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
                            {
                                "mDataProp": "rema_content",
                                "createdCell": function (td, cellData, rowData, row, col) {
                                    $(td).html(rowData.rema_content.replace(/\n/g, '<br/>'));
                                }
                            },
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
                            .append("<a href='cancel_account_add.html?action=apply&Id=" + cellData + "&toCompanyId=" + rowData.bill_toCompany + "'>审核</a>")
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
            "drawCallback": function () {
                $('[data-toggle="tooltip"]').tooltip();
            }
        });

        // Apply the search
        table.api().columns().eq(0).each(function (colIdx) {
            $('input', table.api().column(colIdx).footer()).on('keyup change', function () {
                table.api()
                    .column(colIdx)
                    .search(this.value)
                    .draw();
            });
        });

        return table;
    }

    ////收款销账列表
    //function GetGYSBill() {
    //    var table = $("#gysBillList").dataTable({
    //        //"iDisplayLength":10,
    //        "sAjaxSource": dataUrl + 'ajax/supplierbill.ashx?action=read',
    //        'bPaginate': false,
    //        "bInfo": false,
    //        //		"bDestory": true,
    //        //		"bRetrieve": true,
    //        "bFilter": false,
    //        "bSort": false,
    //        "aaSorting": [[0, "desc"]],
    //        //		"bProcessing": true,
    //        "aoColumns": [
    //            { "mDataProp": "comp_name" },
    //            { "mDataProp": "subi_number" },
	//		    {
	//		        "mDataProp": "subi_addTime",
	//		        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	//		            $(nTd).html(oData.subi_addTime.substring(0, 10));
	//		        }
	//		    },
    //            { "mDataProp": "subi_state" },
    //            {
    //                "mDataProp": "subi_id",
    //                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
    //                    $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")

    //                }
    //            },
    //        ]
    //    });
    //    return table;
    //}

    ////文件列表
    //function GetFiles() {
    //    var table = $("#filesList").dataTable({
    //        //"iDisplayLength":10,
    //        "sAjaxSource": dataUrl + 'ajax/files.ashx?action=read&bookingId=' + Id,
    //        'bPaginate': false,
    //        "bInfo": false,
    //        //		"bDestory": true,
    //        //		"bRetrieve": true,
    //        "bFilter": false,
    //        "bSort": false,
    //        "aaSorting": [[0, "desc"]],
    //        //		"bProcessing": true,
    //        "aoColumns": [
	//		    {
	//		        "mDataProp": "file_bookingId",
	//		        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	//		            $(nTd).html(orderCode);
	//		        }
	//		    },
    //            { "mDataProp": "file_name" },
	//		    {
	//		        "mDataProp": "file_addTime",
	//		        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	//		            $(nTd).html(oData.file_addTime.substring(0, 10));
	//		        }
	//		    },
    //            { "mDataProp": "usin_name" },
    //            {
    //                "mDataProp": "file_id",
    //                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
    //                    $(nTd).html("<a href='javascript:void(0);' onclick='_deleteBillFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    //                    //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    //                    //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    //                    //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    //                    //    .append("<a href='#'>发票</a>")

    //                }
    //            },
    //        ]
    //    });
    //    return table;
    //}

    //$("input:radio[name='invDebOrCrd']").on('change',function() {
    //    if($('#toCompany_2').val()!=""){
    //        _getFee($('#toCompany_2').val());
    //    }
    //})
    ////费用明细
    //function _getFee(toCompany) {
    //    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    //        "bookingId": Id,
    //        "toCompany": toCompany,
    //        "feeType": $("input[name='invDebOrCrd']:checked").val()
    //    }, function (data) {
    //        console.log(data)
    //        if (data.State == 1) {
    //            $(".fee00").empty()
    //            var _data = data.Data;
    //            for (var i = 0; i < _data.length; i++) {
    //                var feelist = '<p style="clear:both;"><div class="margin-left-40 margin-top-10">' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="'+_data[i].bofe_feeUnit+'" getAllfee="'+_data[i].bofe_allFee+'" /></label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;">' + _data[i].bofe_feeType + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptRate + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFeeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFee + '</label>' +
    //                                '</div></p>'
    //                $(".fee00").prepend(feelist)
    //            }
    //        }else{
    //            $(".fee00").empty()
    //        }

    //    }, function (err) {
    //        console.log(err)
    //    }, 2000)
    //}
    //$("#_invThisBkgId").on('change',function() {
    //    if($('#toCompany_3').val()!=""){
    //        _getFee3($('#toCompany_3').val());
    //    }
    //})
    ////账单费用明细
    //function _getFee3(toCompany) {
    //    var _thisBkgId;
    //    $('#_invThisBkgId').is(':checked')?_thisBkgId=Id:_thisBkgId=0;
    //    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    //        "bookingId": _thisBkgId,
    //        "toCompany": toCompany,
    //        "companyId": companyId,
    //        "feeType": "debit" //0是debit & credit，1是debit，2是credit
    //    }, function (data) {
    //        console.log(data)
    //        if (data.State == 1) {
    //            $(".fee33").empty()
    //            var _data = data.Data;
    //            for (var i = 0; i < _data.length; i++) {
    //                var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="' + _data[i].bofe_feeUnit + '" getAllfee="' + _data[i].bofe_allFee + '" /></label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_orderCode + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptRate + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_settlementRate + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFeeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_receiptFee + '</label>' +
    //                                '</div>'
    //                $(".fee33").prepend(feelist)
    //            }
    //        }else{
    //            $(".fee33").empty()
    //        }

    //    }, function (err) {
    //        console.log(err)
    //    }, 2000)
    //}
    //$("#_billpayThisBkgId").on('change',function() {
    //    if($('#toCompany_4').val()!=""){
    //        _getFee4($('#toCompany_4').val());
    //    }
    //})
    ////付款申请
    //function _getFee4(toCompany) {
    //    var _thisBkgId;
    //    $('#_billpayThisBkgId').is(':checked')?_thisBkgId=Id:_thisBkgId=0;
    //    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    //        "bookingId": _thisBkgId,
    //        "toCompany": toCompany,
    //        "feeType": "credit" //0是debit & credit，1是debit，2是credit
    //    }, function (data) {
    //        console.log(data)
    //        if (data.State == 1) {
    //            $(".fee44").empty()
    //            var _data = data.Data;
    //            for (var i = 0; i < _data.length; i++) {
    //                var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="' + _data[i].bofe_feeUnit + '" getAllfee="' + _data[i].bofe_allFee + '" /></label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_orderCode + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
    //                                '</div>'
    //                $(".fee44").prepend(feelist)
    //            }
    //        }else{
    //            $(".fee44").empty()
    //        }

    //    }, function (err) {
    //        console.log(err)
    //    }, 2000)
    //}


    //$("#_billgetThisBkgId").on('change',function() {
    //    if($('#toCompany_5').val()!=""){
    //        _getFee5($('#toCompany_5').val());
    //    }
    //})
    ////收款销账
    //function _getFee5(toCompany) {
    //    var _thisBkgId;
    //    $('#_billgetThisBkgId').is(':checked')?_thisBkgId=Id:_thisBkgId=0;
    //    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    //        "bookingId": _thisBkgId,
    //        "toCompany": toCompany,
    //        "feeType": "debit" //0是debit & credit，1是debit，2是credit
    //    }, function (data) {
    //        console.log(data)
    //        if (data.State == 1) {
    //            $(".fee55").empty()
    //            var _data = data.Data;
    //            for (var i = 0; i < _data.length; i++) {
    //                var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" getUnit="' + _data[i].bofe_feeUnit + '" getAllfee="' + _data[i].bofe_allFee + '" /></label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_orderCode + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_cancelMoney + '</label>' +
    //                                '</div>'
    //                $(".fee55").prepend(feelist)
    //            }
    //        }else{
    //            $(".fee55").empty()
    //        }

    //    }, function (err) {
    //        console.log(err)
    //    }, 2000)
    //}
    ////账单费用明细
    //function _getFee6(toCompany) {
    //    var _thisBkgId;
    //    $('#checkbox-id').is(':checked')?_thisBkgId=Id:_thisBkgId=0;
    //    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    //        "bookingId": _thisBkgId,
    //        "toCompany": toCompany,
    //        "feeType": "credit" //0是debit & credit，1是debit，2是credit
    //    }, function (data) {
    //        console.log(data)
    //        if (data.State == 1) {
    //            $(".fee66").empty()
    //            var _data = data.Data;
    //            for (var i = 0; i < _data.length; i++) {
    //                var feelist = '<div class="margin-left-40 margin-top-10" style="clear:both;">' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:2%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="feeli" value="' + _data[i].bofe_id + '" /></label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].book_outCode + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _getFeeItemFun(_data[i].bofe_feeItem) + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_feeUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_fee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_num + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_numUnit + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">' + _data[i].bofe_allFee + '</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">&nbsp;</label>' +
    //                                    '<label for="inputPassword3" class="margin-right-10" style="width:6%; float: left;">&nbsp;</label>' +
    //                                '</div>'
    //                $(".fee66").prepend(feelist)
    //            }
    //        }

    //    }, function (err) {
    //        console.log(err)
    //    }, 2000)
    //}


    oTable = GetBill();
    //billPayTable = GetBillPay()
    //billGetTable = GetBillGet()
    invoiceTable = GetInvoice()
    cancelApplyTable = GetCancelApply()
    //gysBillTable = GetGYSBill()
    //filesTable = GetFiles()


    //$('.shoufutab').on('click', function () {
    //    $('#send_shoufu').removeClass('none')
    //    $('#send_bill').addClass('none')
    //    $('#send_bill_pay').addClass('none')
    //    $('#send_bill_get').addClass('none')
    //    $('#send_bill_gys').addClass('none')
    //    $('#send_file').addClass('none')
    //    $('#send_invoice').addClass('none')
    //})
    $('.billtab').on('click', function () {
        $('#send_bill').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_get').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')
        $('#send_invoice').addClass('none')
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
    $('.billgettab').on('click', function () {
        $('#send_bill_get').removeClass('none')
        $('#send_shoufu').addClass('none')
        $('#send_bill').addClass('none')
        $('#send_bill_pay').addClass('none')
        $('#send_bill_gys').addClass('none')
        $('#send_file').addClass('none')

        // $('#toCompany_5').append(_toCompany)
        // $("#toCompany_5").change(function () {
        //     _getFee4($('#toCompany_5').val())
        // })
    })
    //$('.gysbilltab').on('click', function () {
    //    $('#send_bill_gys').removeClass('none')
    //    $('#send_shoufu').addClass('none')
    //    $('#send_bill').addClass('none')
    //    $('#send_bill_pay').addClass('none')
    //    $('#send_bill_get').addClass('none')
    //    $('#send_file').addClass('none')

    //    //供应商
    //    common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
    //        "upId": crmId
    //    }, function (data) {
    //        var _data = data.data;
    //        console.log(_data)
    //        if (_data != null) {
    //            for (var i = 0; i < _data.length; i++) {
    //                var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
    //                $('#toCompany_6').append(_html)
    //            }
    //        }
    //        $("#toCompany_6").change(function () {
    //            _getFee6($('#toCompany_6').val())
    //        })

    //    }, function (err) {
    //        console.log(err)
    //    }, 2000)
    //})
    //$('.filetab').on('click', function () {
    //    $('#send_file').removeClass('none')
    //    $('#send_shoufu').addClass('none')
    //    $('#send_bill').addClass('none')
    //    $('#send_bill_pay').addClass('none')
    //    $('#send_bill_get').addClass('none')
    //    $('#send_bill_gys').addClass('none')
    //})

    //$("#toCompany_2").change(function () {
    //    _getFee($('#toCompany_2').val())
    //})
    //$("#toCompany_3").change(function () {
    //    _getFee3($('#toCompany_3').val())
    //})
    //$("#toCompany_4").change(function () {
    //    _getFee4($('#toCompany_4').val())
    //})
    //$("#toCompany_5").change(function () {
    //    _getFee5($('#toCompany_5').val())
    //})
    //$("#toCompany_6").change(function () {
    //    _getFee6($('#toCompany_6').val())
    //})

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

//	//添加应收应付
//	$('#addFee1').on('click', function() {
//        feeboxAll_len=$('.feeList').length+1;
//		var feeboxRow = '<div class="col-sm-12 feeList">'+
//            '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
//            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
//            '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
//            '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
//            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
//            '<input type="text" class="form-control" id="feePrice" placeholder="" value="0" ></div>'+
//            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
//            '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
//            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;" disabled="disabled">'+
//            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" disabled="disabled"></select></span>'+
//            '<input type="text" class="form-control" id="receiptFee" value="0" placeholder="" disabled="disabled"></div>'+
//            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;">'+
//            '<label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'		
//		$('.feeAll').append(feeboxRow)
//		//feeboxRow = feeboxRow.clone()
//		//货代公司
//		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
//		$('.feeList:last').find('.toCompany').append(_toCompany)
//        $("#toCompany"+feeboxAll_len).select2({
//            language: "zh-CN",
//            minimumInputLength: 2
//        });
//        $('.feeList:last').find('.toCompany').val($('#crmuser option:selected').attr("name")).trigger("change")
////		//费用类型
//		$('.feeList:last').find('.feeItem').append(_feeItem)
//        $("#feeItem"+feeboxAll_len).select2({
//            language: "zh-CN",
//            minimumInputLength: 2
//        });
////		//币种
//		$('.feeList:last').find('#feeUnit').append(_feeUnit)
////      币种
//		$('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
////		//单位
//		$('.feeList:last').find('#numUnit').append(_numUnit)
//        $('.feeList:last').find('#feeType').val('debit').trigger("change")
//        $('.feeList:last').css("background-color","#b0e0e6")
		
//	})
//	$('#addFee2').on('click', function() {	
//        feeboxAll_len=$('.feeList').length+1;
//        var feeboxRow = '<div class="col-sm-12 feeList">'+
//            '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
//            '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
//            '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
//            '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
//            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
//            '<input type="text" class="form-control" id="feePrice" placeholder="" value="0" ></div>'+
//            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
//            '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
//            '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;">'+
//            '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit"></select></span>'+
//            '<input type="text" class="form-control" id="receiptFee" value="0" placeholder=""></div>'+
//            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;">'+
//            '<label id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
//            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'     
//        $('.feeAll').append(feeboxRow)
//        //feeboxRow = feeboxRow.clone()
//        //货代公司
//        //console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
//        $('.feeList:last').find('.toCompany').append(_toCompany)
//        $("#toCompany"+feeboxAll_len).select2({
//            language: "zh-CN",
//            minimumInputLength: 2
//        });
////      //费用类型
//        $('.feeList:last').find('.feeItem').append(_feeItem)
//        $("#feeItem"+feeboxAll_len).select2({
//            language: "zh-CN",
//            minimumInputLength: 2
//        });
//        $('.feeList:last').find('.toCompany').val(forwarder_id).trigger("change")
////      //币种
//        $('.feeList:last').find('#feeUnit').append(_feeUnit)
////      币种
//        $('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
////      //单位
//        $('.feeList:last').find('#numUnit').append(_numUnit)
//        $('.feeList:last').find('#feeType').val('credit').trigger("change")
//        $('.feeList:last').css("background-color","pink")
		
//	})	
//	$('.feeAll').delegate('.removeFee', 'click', function() {
//		$(this).parents('.feeList').remove()
//	})
	
	
	///*保存应收应付*/
	//$('#send_shoufu').on('click', function () {
	//	var feeData=''
	//	for(var i = 0; i < $('.feeList').length; i++) {
	//		var toCompany = $('.feeList').eq(i).find('.toCompany').val()
	//		var feeItem = $('.feeList').eq(i).find('.feeItem').val()
	//		var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
	//		var numUnit = $('.feeList').eq(i).find('#numUnit').val()
	//		var feeType = $('.feeList').eq(i).find('#feeType').val()
	//		var feeNum = $('.feeList').eq(i).find('#feeNum').val()
	//		var feePrice = $('.feeList').eq(i).find('#feePrice').val()
	//		var receiptRate = $('.feeList').eq(i).find('#receiptRate').val()
	//		var receiptFeeUnit = $('.feeList').eq(i).find('#receiptFeeUnit').val()
	//		var receiptFee = $('.feeList').eq(i).find('#receiptFee').val()
	//		var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()
		
	//		var feeoneData = feeType + ',' + toCompany + ',' + feeItem + ',' + feeUnit + ',' + feeNum + ',' + feePrice + ',' + numUnit + ',' + receiptRate + ',' + receiptFeeUnit + ',' + receiptFee + ',' + feeBeizhu + ';'
	//		feeData = feeData + feeoneData
	//	}
	//	console.log(feeData)
		
	//	var parm = {
	//		'bookingId': Id,
	//		'userId': userID,
	//		'feeData': feeData
	//	}
	//	console.log(parm)
	//	common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfee', parm, function(data) {
	//		if(data.State == 1) {
	//			comModel("保存成功")
	//		} else {
	//			comModel("保存失败")
	//		}
	//	}, function(error) {
	//		console.log(parm)
	//	}, 2000)
	//    feeNewOrder()
	//});

    ///*新增账单*/
	//$('#send_bill').on('click', function () {
	//    var feedata = [];
	//    $("input[name='feeli']:checked").each(function (index, item) {
	//        feedata.push($(this).val());
	//    });
	//    var feeItem = "";
	//    if (feedata.toString() != '') {
	//        feeItem = feedata.toString()
	//    }
	//    if (feeItem == "") {
	//        comModel("请选择费用项目！")
	//    } else if ($('#payNumber').val() == "") {
	//        comModel("请填写账单号码！")
	//    }else{
	//        var parm = {
	//            'bookingId': Id,
	//            'companyId': companyID,
	//            'userId': userID,
	//            'toCompany': $('#toCompany_2').val(),
	//            'payNumber': $('#payNumber').val(),
    //            'typeId': 1,
    //            //'typeId': $("input[name='invDebOrCrd']:checked").val(),
	//            'bank': $('#bank').val(),
	//            'beizhu': $('#beizhu').val(),
	//            'addtime': $('#id-date-picker-1').val(),
    //            'payPrice': _arrfee00dataGather_toString,
	//            'feeItem': feeItem
	//        }
	//        console.log(parm)
	//        common.ajax_req('POST', false, dataUrl, 'bill.ashx?action=new', parm, function (data) {
	//            if (data.State == 1) {
	//                comModel("新增成功")
	//                oTable.fnReloadAjax(oTable.fnSettings());
	//            } else {
	//                comModel("新增失败")
	//            }
	//        }, function (error) {
	//        }, 2000)
	//    }
	//});

    ///*保存发票*/
	//$('#send_invoice').on('click', function () {
	//    var feedata = [];
	//    $("input[name='feeli']:checked").each(function (index, item) {
	//        feedata.push($(this).val());
	//    });
	//    var feeItem = "";
	//    if (feedata.toString() != '') {
	//        feeItem = feedata.toString()
	//    }
	//    if (feeItem == "") {
	//        comModel("请选择账单！")
	//    } else {
	//        var parm = {
	//            'bookingId': Id,
	//            'companyId': companyID,
	//            'userId': userID,
	//            'toCompany': $('#toCompany_3').val(),
	//            'number': $('#number').val(),
	//            'feeUnit': $('#unit3').val(),
	//            'format': $('#iformat').val(),
	//            'vesselName': $('#vesselName').val(),
	//            'voyage': $('#voyage').val(),
	//            'port1': $('#port1').val(),
	//            'port2': $('#port2').val(),
	//            'invoiceTitle': $('#invoiceTitle').val(),
	//            'invoiceTaxNumber': $('#invoiceTaxNumber').val(),
	//            'invoiceAddressTel': $('#invoiceAddressTel').val(),
	//            'invoiceBrank': $('#invoiceBrank').val(),
	//            'invoiceNumber': $('#cninvoiceNumber').val(),
	//            'logistics': $('#logistics').val(),
	//            'logisticsAddress': $('#logisticsAddress').val(),
	//            'logisticsContact': $('#logisticsContact').val(),
	//            'logisticsTel': $('#logisticsTel').val(),
	//            'logisticsNumber': $('#logisticsNumber').val(),
	//            'addtime': $('#id-date-picker-invoice').val(),
	//            'feeItem': feeItem
	//        }
	//        console.log(parm)
	//        common.ajax_req('POST', false, dataUrl, 'invoice.ashx?action=new', parm, function (data) {
	//            if (data.State == 1) {
	//                comModel("保存成功")
	//                invoiceTable.fnReloadAjax(invoiceTable.fnSettings());
	//            } else {
	//                comModel("保存失败")
	//            }
	//        }, function (error) {
	//        }, 2000)
	//    }
	//});

    ///*新增付款申请*/
	//$('#send_bill_pay').on('click', function () {
	//    var feedata = [];
	//    $("input[name='feeli']:checked").each(function (index, item) {
	//        feedata.push($(this).val());
	//    });
	//    var feeItem = "";
	//    if (feedata.toString() != '') {
	//        feeItem = feedata.toString()
	//    }
	//    if (feeItem == "") {
	//        comModel("请选择账单！")
	//    } else {
	//        var parm = {
	//            'bookingId': Id,
	//            'companyId': companyID,
	//            'userId': userID,
	//            'toCompany': $('#toCompany_4').val(),
	//            'payNumber': $('#payNumber4').val(),
	//            'typeId': 3,
	//            'invoiceNumber': $('#cninvoiceNumber4').val(),
	//            'payType': $('#payType').val(),
	//            'payPrice': $('#payPrice').val(),
	//            'beizhu': $('#beizhu4').val(),
	//            'addtime': $('#id-date-picker-2').val(),
	//            'feeItem': feeItem
	//        }
	//        console.log(parm)
	//        common.ajax_req('POST', false, dataUrl, 'bill.ashx?action=new', parm, function (data) {
	//            if (data.State == 1) {
	//                comModel("保存成功")
	//                billPayTable.fnReloadAjax(billPayTable.fnSettings());
	//            } else {
	//                comModel("保存失败")
	//            }
	//        }, function (error) {
	//        }, 2000)
	//    }
	//});


    ///*新增收款销账*/
	//$('#send_bill_get').on('click', function () {
	//    var feedata = [];
	//    $("input[name='feeli']:checked").each(function (index, item) {
	//        feedata.push($(this).val());
	//    });
	//    var feeItem = "";
	//    if (feedata.toString() != '') {
	//        feeItem = feedata.toString()
	//    }
	//    if (feeItem == "") {
	//        comModel("请选择账单！")
	//    } else {
	//        var parm = {
	//            'bookingId': Id,
	//            'companyId': companyID,
	//            'userId': userID,
	//            'toCompany': $('#toCompany_5').val(),
	//            'payNumber': $('#payNumber5').val(),
	//            'typeId': 4,
	//            'bank': $('#bank5').val(),
	//            'payPrice': $('#payPrice5').val(),
	//            'beizhu': $('#beizhu5').val(),
	//            'addtime': $('#id-date-picker-3').val(),
	//            'feeItem': feeItem
	//        }
	//        console.log(parm)
	//        common.ajax_req('POST', false, dataUrl, 'bill.ashx?action=new', parm, function (data) {
	//            if (data.State == 1) {
	//                comModel("保存成功")
	//                billGetTable.fnReloadAjax(billGetTable.fnSettings());
	//            } else {
	//                comModel("保存失败")
	//            }
	//        }, function (error) {
	//        }, 2000)
	//    }
	//});


    ///**
    // * 表格初始化
    // * @returns {*|jQuery}
    // */
    //function initLocalchargeListTable() {
        
    //    var table = $("#dataTableLocalCharge").dataTable({
    //        //"iDisplayLength":10,
    //        "sAjaxSource": dataUrl+'ajax/localcharge.ashx?action=read&companyId='+companyID,
    //        'bPaginate': false,
    //        //"searching": false, //去掉搜索框 
    ////      "bDestory": true,
    ////      "bRetrieve": true,
    ////      "bFilter": false,
    //        "bSort": false,
    //        // "aaSorting": [[ 7, "desc" ]],
    //        // "aoColumnDefs":[//设置列的属性，此处设置第一列不排序
    //        //     {"bSortable": false, "aTargets": [0,6,8]}
    //        // ],
    ////      "bProcessing": true,
    //        "aoColumns": [
    //            {
    //                "mDataProp": "comp_code",
    //                "createdCell": function (td, cellData, rowData, row, col) {
    //                    if (cellData) {
    //                        $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
    //                    }
    //                }
    //            },
    //            { "mDataProp": "loch_type",
    //                "createdCell": function (td, cellData, rowData, row, col) {
    //                    // $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    //                    //  .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
    //                    $(td).html("<a target='_blank' href='localchargeview.html?action=view&Id="+ rowData.loch_id +"'> " + cellData + "</a>")
    //                }
    //            },
    //            { "mDataProp": "loch_from" },
    //            { "mDataProp": "loch_carrier" },
    //            { "mDataProp": "loch_port1" },
    //            // {
    //            //     "mDataProp": "loch_id",
    //            //     "createdCell": function (td, cellData, rowData, row, col) {
    //            //         $(td).html(rowData.loch_useTime1.substring(0, 10) + ' <i class="fa fa-long-arrow-right"></i> ' + rowData.loch_useTime2.substring(0, 10));
    //            //     }           
    //            // },          
    //            {
    //                "mDataProp": "loch_id",
    //                "createdCell": function (td, cellData, rowData, row, col) {
    //                    // $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    //                    //  .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
    //                    $(td).html("<a class='btn btn-blue btn-sm' id='_chooseLocalcharge' href='javascript:void(0);' name='"+rowData.loch_id+"'>" + get_lan('pickup') + "</a>")
    //                }
    //            },
    //        ],
    ////      "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
    ////      "sPaginationType": "bootstrap",
    //        "oLanguage": {
    ////          "sUrl": "js/zh-CN.txt"
    ////          "sSearch": "快速过滤："
    //            "sProcessing": "正在加载数据，请稍后...",
    //            "sLengthMenu": "每页显示 _MENU_ 条记录",
    //            "sZeroRecords": get_lan('nodata'),
    //            "sEmptyTable": "表中无数据存在！",
    //            "sInfo": get_lan('page'),
    //            "sInfoEmpty": "显示0到0条记录",
    //            "sInfoFiltered": "数据表中共有 _MAX_ 条记录",
    //            //"sInfoPostFix": "",
    //            "sSearch": get_lan('search'),
    //            //"sUrl": "",
    //            //"sLoadingRecords": "载入中...",
    //            //"sInfoThousands": ",",
    //            "oPaginate": {
    //                "sFirst": get_lan('first'),
    //                "sPrevious": get_lan('previous'),
    //                "sNext": get_lan('next'),
    //                "sLast": get_lan('last'),
    //            }
    //            //"oAria": {
    //            //    "sSortAscending": ": 以升序排列此列",
    //            //    "sSortDescending": ": 以降序排列此列"
    //            //}
    //        },
    //        "drawCallback": function(){
    //            $('[data-toggle="popover"]').popover();
    //        }
    //    });

        
    //    return table;
    //}


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

    //$("#addFeeDebitLocal_btn").on("click",function(){
    //    $("#debitOrCredit").val("debit");
    //    $("#myModal").modal("show");
    //    $('#toCompanyLocal').val($('#crmuser option:selected').attr("name")).trigger("change")
    //});

    //$("#addFeeCreditLocal_btn").on("click",function(){
    //    $("#debitOrCredit").val("credit");
    //    $("#myModal").modal("show");
    //    $('#toCompanyLocal').val(forwarder_id).trigger("change")
    //    //alert(containerType);
    //});

    //$.fn.modal.Constructor.prototype.enforceFocus = function(){};

   //// function _chooseLocalcharge(o){
   // $("#_chooseLocalcharge").on("click",function(){
   //     var o=$(this).attr('name');
   //     alert(o);
   //     var feeboxAll_len="";
   //         common.ajax_req("get", true, dataUrl, "localcharge.ashx?action=readbyid", {
   //             "Id": o
   //         }, function(data) {
   //             console.log(data.Data)
   //             var _data = data.Data

   //             var feeItemAll = _data.loch_feeItem.split(';')
   //             var containerTypeAll=containerType.split(';')

   //             for (var i = 0; i < feeItemAll.length-1; i++) {
   //                 var feeItem0 = feeItemAll[i].split(',')
   //                 var _html ='<tr><td>'+feeItem0[0]+'</td><td>'+(feeItem0[2]!=0?(feeItem0[1]+feeItem0[2]):"")+'</td><td>'+(feeItem0[3]!=0?(feeItem0[1]+feeItem0[3]):"")+'</td><td>'+(feeItem0[4]!=0?(feeItem0[1]+feeItem0[4]):"")+'</td><td>'+(feeItem0[5]!=0?(feeItem0[1]+feeItem0[5]):"")+'</td><td>'+feeItem0[6]+'</td></tr>'
   //                 var _feeUnitLocal="";
   //                 var _feePriceLocal="";

   //                 if(feeItem0[2]!=0){

   //                     _feeUnitLocal="Bill of Loading";
   //                     _feePriceLocal=feeItem0[2];
   //                     var feeboxRow = '<div class="col-sm-12 feeList">'+
   //                         '<button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>'+
   //                         '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>'+
   //                         '<select id="toCompany'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 toCompany" style="width:200px; float: left;"></select>'+
   //                         '<select id="feeItem'+feeboxAll_len+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>'+
   //                         '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit"></select></span>'+
   //                         '<input type="text" class="form-control" id="feePrice" placeholder="" value="'+_feePriceLocal+'" ></div>'+
   //                         '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" value="1" placeholder="">'+
   //                         '<span class="input-group-addon" style="padding:0;"><select id="numUnit"></select></span></div>'+
   //                         '<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
   //                         '<input type="text" class="form-control margin-right-5" id="receiptRate" value="1" placeholder="" style="width:60px; float: left;" disabled="disabled">'+
   //                         '<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" disabled="disabled"></select></span>'+
   //                         '<input type="text" class="form-control" id="receiptFee" value="'+_feePriceLocal+'" placeholder="" disabled="disabled"></div>'+
   //                         '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;"></div>'  
   //                         feeboxAll_len=$('.feeList').length+1;   
   //                         $('.feeAll').append(feeboxRow)   
   //                         $('.feeList:last').find('#numUnit').append(_numUnit)
   //                         $('.feeList:last').find('#numUnit').val(_feeUnitLocal).trigger("change")

   //                 }else{
   //                     for(var j=0; j<containerTypeAll.length-1; j++){
   //                         var containerTypeAllNumType=containerTypeAll[j].split('x');
   //                         _feeUnitLocal=containerTypeAllNumType[1];
   //                         _feeNumLocal=containerTypeAllNumType[0];
   //                         if(_feeUnitLocal=="20'GP"){
   //                             alert("20'gp")
   //                         }else if(_feeUnitLocal=="40'GP"){
   //                             alert("40'gp")
   //                         }else if(_feeUnitLocal=="40'HQ"){
   //                             alert("40'hq")
   //                         }else{
   //                             alert("else")
   //                         }
   //                         //_feePriceLocal=feeItem0[2];
   //                     }
   //                 }

   //                 $('.feeList:last').find('.toCompany').append(_toCompany)
   //                 $("#toCompany"+feeboxAll_len).select2({
   //                     language: "zh-CN",
   //                     minimumInputLength: 2
   //                 });
   //                 $('.feeList:last').find('.toCompany').val($('#crmuser option:selected').attr("name")).trigger("change")
   //         //      //费用类型
   //                 $('.feeList:last').find('.feeItem').append(_feeItem)
   //                 $("#feeItem"+feeboxAll_len).select2({
   //                     language: "zh-CN",
   //                     minimumInputLength: 2
   //                 });
   //         //      //币种
   //                 $('.feeList:last').find('#feeUnit').append(_feeUnit)
   //                 $('.feeList:last').find('#feeUnit').val(feeItem0[1]).trigger("change")
   //         //      币种
   //                 $('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
   //                 $('.feeList:last').find('#receiptFeeUnit').val(feeItem0[1]).trigger("change")
   //         //      //单位

   //                 $('.feeList:last').find('#feeType').val('debit').trigger("change")
   //                 $('.feeList:last').css("background-color","#b0e0e6")

   //             }

   //         }, function(err) {
   //             console.log(err)
   //         }, 5000)
   //     if($("#debitOrCredit").val()=="debit"){
   //         console.log("cc")  
   //     }else if($("#debitOrCredit").val()=="credit"){   
   //         console.log("dd")  
   //     }
   // })

   // function OpenLocalChargeModal() {
   //     $("#myModal").modal("show");
   // //$('#bookId').val(id)
   // }

   // /**
   //  * 初始化弹出层
   //  */
   // function initModal() {
   //     $('#myModal').on('show', function() {
   //         $(".page-body").addClass('modal-open');
   //         $('<div class="modal-backdrop fade in"></div>').appendTo($(".page-body"));
   //     });
   // }

})

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
        $(".bill_bank").text(_data.bill_bank)
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


/*收款销账详情*/
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
        $(".bill_bank").text(_data.bill_bank)
        $(".bill_payNumber").text(_data.bill_payNumber)
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


