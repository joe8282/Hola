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
    var forwarder_id;
    var localCurrency;
    var containerType;    
    var _arrExchangeRate= new Array();
    initLocalchargeListTable();
    //转回到订单详情
    $('#orderDetail').on('click', function() {
        location.href = 'orderadd.html?action=modify&Id='+Id;
    })


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
		crmId = _data.book_crmCompanyId;
        containerType=_data.book_allContainer;
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
			var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' - '+_data[i].puda_name_en+'</option>';
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
            $('#toCompanyLocal').append(_toCompany)
		}
	}, function(err) {
		console.log(err)
	}, 2000)


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
    			var feilist = '<div class="col-sm-12 feeList"><button type="submit" class="removeFee btn btn-danger input-xs" style="width:30px;float: left;"><i class="fa fa-times-circle"></i></button>' +
                    //'<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="' + _data[i].bofe_feeType + '">' + _data[i].bofe_feeType + '</option></select>' +
                    '<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="debit">应收</option><option value="credit">应付</option></select>' +
    				'<select id="toCompany'+i+'" class="no-padding-left no-padding-right margin-right-5 toCompany" name="toCompany" style="width:200px; float: left;"></select>' +
    				'<select id="feeItem'+i+'" class="no-padding-left no-padding-right margin-right-5 feeItem" style="width:100px; float: left;"></select>' +
    				'<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="feeUnit" style="height:20px;"></select></span>' +
    				'<input type="text" class="form-control" id="feePrice" placeholder="" value="' + _data[i].bofe_fee + '"></div>' +
    				'<div class="input-group" style="float: left; width:150px; margin-right:5px;"><input type="text" class="form-control" id="feeNum" placeholder="" value="' + _data[i].bofe_num + '">' +
    				'<span class="input-group-addon" style="padding:0;"><select id="numUnit" style="height:20px;"></select></span></div>' +
    				'<label for="inputPassword3" id="allFee" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_feeUnit+ ' ' + _data[i].bofe_allFee + '</label>' + 
    				'<input type="text" class="form-control margin-right-5" id="receiptRate" placeholder="" value="' + _data[i].bofe_receiptRate+ '" style="width:60px; float: left;"  disabled="disabled">' +
    				'<div class="input-group" style="float: left; width:150px; margin-right:5px;"><span class="input-group-addon" style="padding:0;"><select id="receiptFeeUnit" style="height:20px;" disabled="disabled"></select></span>' +
    				'<input type="text" class="form-control" id="receiptFee" placeholder="" value="' + _data[i].bofe_receiptFee+ '" disabled="disabled"></div>' +
    				'<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + _data[i].bofe_beizhu + '" placeholder="" style="width:100px; float: left;">'+
                    '<label for="inputPassword3" id="rate" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_settlementRate + '</label>' + 
    				'<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_cancelMoney + '</label>' + 
    				'<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_receiptNumber + '</label>' + 
    				'<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_invoiceNumber + '</label>' + 
    				'<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">' + _data[i].bofe_cancelTime + '</label>'
    
    			$(".feeAll").append(feilist)
    			$('.feeList').eq(i).find('#toCompany'+i).html(_toCompany)
    			$('.feeList').eq(i).find('#toCompany'+i).val(_data[i].bofe_toCompany).trigger("change")
                $("#toCompany"+i).select2({
                    language: "zh-CN",
                    minimumInputLength: 2
                });
                //alert($("[name='toCompany"+i+"']").val())
    			$('.feeList').eq(i).find('#feeItem'+i).html(_feeItem)
    			$('.feeList').eq(i).find('#feeItem'+i).val(_data[i].bofe_feeItem).trigger("change")
                $("#feeItem"+i).select2({
                    language: "zh-CN",
                    minimumInputLength: 2
                });
                if(_data[i].bofe_feeType=="应收" || _data[i].bofe_feeType=="debit"){
                    $('.feeList').eq(i).find('#feeType').val("debit").trigger("change")
                }else{
                    $('.feeList').eq(i).find('#feeType').val("credit").trigger("change")
                }
    			$('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
    			$('.feeList').eq(i).find('#feeUnit').val(_data[i].bofe_feeUnit).trigger("change")
    			$('.feeList').eq(i).find('#receiptFeeUnit').html(_feeUnit)
    			$('.feeList').eq(i).find('#receiptFeeUnit').val(_data[i].bofe_receiptFeeUnit).trigger("change")
    			$('.feeList').eq(i).find('#numUnit').html(_numUnit)
    			$('.feeList').eq(i).find('#numUnit').val(_data[i].bofe_numUnit).trigger("change")
                if($('.feeList').eq(i).find('#feeType').val()=='debit'){
                    $('.feeList').eq(i).css("background-color","#b0e0e6")
                    $('.feeList').eq(i).attr("orderName","0")
                }else{
                    $('.feeList').eq(i).css("background-color","pink")
                    $('.feeList').eq(i).attr("orderName","1")
                }
    		}        
            feeNewOrder();
            gatherDebitCredit();
    	}
    
    }, function(err) {
    	console.log(err)
    }, 4000)



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
        var _creditRateInProfit;
        var _debits=new Array();
        var _credits=new Array();

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
                _debitAmount=_debits[1];
            }else{
                _debitAmount=_debits[1]*10;
            }
            alert(_debits[1])
            //下面有个*1是为了转换类型
            _debitRateInProfit=_debitRateInProfit*1+_debitAmount*1;
        }

        $("#profit").text(localCurrency+_debitRateInProfit)
        console.log(_debitRateInProfit)
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
        common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
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
            forwarder_id=_data.book_forwarder;
        }, function(err) {
            console.log(err)
        }, 1000)
    }
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
                    var feelist = '<p><div class="margin-left-40 margin-top-10">' +
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
                                    '</div></p>'
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
		var feeboxRow = '<div class="col-sm-12 feeList">'+
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
            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'		
		$('.feeAll').append(feeboxRow)
		//feeboxRow = feeboxRow.clone()
		//货代公司
		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
		$('.feeList:last').find('.toCompany').append(_toCompany)
        $("#toCompany"+feeboxAll_len).select2({
            language: "zh-CN",
            minimumInputLength: 2
        });
        $('.feeList:last').find('.toCompany').val($('#crmuser option:selected').attr("name")).trigger("change")
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
        $('.feeList:last').find('#feeType').val('debit').trigger("change")
        $('.feeList:last').css("background-color","#b0e0e6")
		
	})
	$('#addFee2').on('click', function() {	
        feeboxAll_len=$('.feeList').length+1;
        var feeboxRow = '<div class="col-sm-12 feeList">'+
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
            '<label for="inputPassword3" id="cancelMoney" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="receiptNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="invoiceNumber" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label>'+
            '<label for="inputPassword3" id="cancelTime" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'     
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
        $('.feeList:last').find('#feeType').val('credit').trigger("change")
        $('.feeList:last').css("background-color","pink")
		
	})	
	$('.feeAll').delegate('.removeFee', 'click', function() {
		$(this).parents('.feeList').remove()
	})
	
	
	/*保存应收应付*/
	$('#send_shoufu').on('click', function () {
		var feeData=''
		for(var i = 0; i < $('.feeList').length; i++) {
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

    $("#addFeeDebitLocal_btn").on("click",function(){
        $("#debitOrCredit").val("debit");
        $("#myModal").modal("show");
        $('#toCompanyLocal').val($('#crmuser option:selected').attr("name")).trigger("change")
    });

    $("#addFeeCreditLocal_btn").on("click",function(){
        $("#debitOrCredit").val("credit");
        $("#myModal").modal("show");
        $('#toCompanyLocal').val(forwarder_id).trigger("change")
        //alert(containerType);
    });

    $.fn.modal.Constructor.prototype.enforceFocus = function(){};

   // function _chooseLocalcharge(o){
    $("#_chooseLocalcharge").on("click",function(){
        var o=$(this).attr('name');
        alert(o);
        var feeboxAll_len="";
            common.ajax_req("get", true, dataUrl, "localcharge.ashx?action=readbyid", {
                "Id": o
            }, function(data) {
                console.log(data.Data)
                var _data = data.Data

                var feeItemAll = _data.loch_feeItem.split(';')
                var containerTypeAll=containerType.split(';')

                for (var i = 0; i < feeItemAll.length-1; i++) {
                    var feeItem0 = feeItemAll[i].split(',')
                    var _html ='<tr><td>'+feeItem0[0]+'</td><td>'+(feeItem0[2]!=0?(feeItem0[1]+feeItem0[2]):"")+'</td><td>'+(feeItem0[3]!=0?(feeItem0[1]+feeItem0[3]):"")+'</td><td>'+(feeItem0[4]!=0?(feeItem0[1]+feeItem0[4]):"")+'</td><td>'+(feeItem0[5]!=0?(feeItem0[1]+feeItem0[5]):"")+'</td><td>'+feeItem0[6]+'</td></tr>'
                    var _feeUnitLocal="";
                    var _feePriceLocal="";

                    if(feeItem0[2]!=0){

                        _feeUnitLocal="Bill of Loading";
                        _feePriceLocal=feeItem0[2];
                        var feeboxRow = '<div class="col-sm-12 feeList">'+
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
                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;"></div>'  
                            feeboxAll_len=$('.feeList').length+1;   
                            $('.feeAll').append(feeboxRow)   
                            $('.feeList:last').find('#numUnit').append(_numUnit)
                            $('.feeList:last').find('#numUnit').val(_feeUnitLocal).trigger("change")

                    }else{
                        for(var j=0; j<containerTypeAll.length-1; j++){
                            var containerTypeAllNumType=containerTypeAll[j].split('x');
                            _feeUnitLocal=containerTypeAllNumType[1];
                            _feeNumLocal=containerTypeAllNumType[0];
                            if(_feeUnitLocal=="20'GP"){
                                alert("20'gp")
                            }else if(_feeUnitLocal=="40'GP"){
                                alert("40'gp")
                            }else if(_feeUnitLocal=="40'HQ"){
                                alert("40'hq")
                            }else{
                                alert("else")
                            }
                            //_feePriceLocal=feeItem0[2];
                        }
                    }

                    $('.feeList:last').find('.toCompany').append(_toCompany)
                    $("#toCompany"+feeboxAll_len).select2({
                        language: "zh-CN",
                        minimumInputLength: 2
                    });
                    $('.feeList:last').find('.toCompany').val($('#crmuser option:selected').attr("name")).trigger("change")
            //      //费用类型
                    $('.feeList:last').find('.feeItem').append(_feeItem)
                    $("#feeItem"+feeboxAll_len).select2({
                        language: "zh-CN",
                        minimumInputLength: 2
                    });
            //      //币种
                    $('.feeList:last').find('#feeUnit').append(_feeUnit)
                    $('.feeList:last').find('#feeUnit').val(feeItem0[1]).trigger("change")
            //      币种
                    $('.feeList:last').find('#receiptFeeUnit').append(_feeUnit)
                    $('.feeList:last').find('#receiptFeeUnit').val(feeItem0[1]).trigger("change")
            //      //单位

                    $('.feeList:last').find('#feeType').val('debit').trigger("change")
                    $('.feeList:last').css("background-color","#b0e0e6")

                }

            }, function(err) {
                console.log(err)
            }, 5000)
        if($("#debitOrCredit").val()=="debit"){
            console.log("cc")  
        }else if($("#debitOrCredit").val()=="credit"){   
            console.log("dd")  
        }
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
















})
