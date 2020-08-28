//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Financial MANAGEMENT",        
        };

var _feeItemArr = new Array();

$(function(){
	$('.navli3').addClass("active open")
	$('.book3').addClass("active")

	this.title = get_lan('con_top_3')
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3')) 
	
	

	var Id = GetQueryString('billId');


	common.ajax_req("get", false, dataUrl, "bill.ashx?action=readbyid", {
	    "Id": Id
	}, function (data) {
	    console.log(data.Data)
	    //初始化信息
	    var _data = data.Data
	    //var _data2 = data.Data2
	    //alert(_data.bill_companyId)
	    getUserCompany(_data.bill_companyId);
	    getToCompany(_data.bill_toCompany);
	    getShpmInfo(_data.bill_bookingId);
	    loadContainer(1,_data.bill_bookingId)
	    $('.addTime').text(_data.bill_addTime.substring(0, 10));
	    $('.totalFee').text(_data.bill_payPrice);
	    $('.InvNo').text(_data.bill_payNumber);
	    $('#remark').text(_data.bill_beizhu);
	    $('#bankInfo').text(_data.bill_bank);

        var arrItem = _data.bill_feeItem.split(',');

        for (var i = 0; i < arrItem.length; i++) {
            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfeebyid", {
                "Id": arrItem[i]
            }, function (data) {
                console.log(data.Data)
                if (data.State == 1) {
                    //初始化信息
                    var _data2 = data.Data

                    var feelist = '<tr>' +
                            '<td>'+_getFeeItemFun(_data2.bofe_feeItem)+'</td>'+
                            '<td>'+ _data2.bofe_feeUnit +'</td>'+
                            '<td>'+ _data2.bofe_fee +'</td>'+
                            '<td>' + _data2.bofe_num + '</td>'+
                            '<td>' + _data2.bofe_numUnit + '</td>'+
                            '<td>' + _data2.bofe_feeUnit+_data2.bofe_allFee + '</td>'+
                    '</tr>'
                    $(".feeItem").append(feelist)
                }


            }, function (err) {
                console.log(err)
            }, 1000)
        }

	}, function (err) {
	    console.log(err)
	}, 5000)



})

function _getFeeItemFun(o) {
    var z = new Array();
    var x;
    //费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			//var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' - '+_data[i].puda_name_en+'</option>';
			//$('#feeItem').append(_html)
			//_feeItem=_feeItem+_html
            _feeItemArr.push(_data[i].puda_id+';'+_data[i].puda_name_cn+' / '+_data[i].puda_name_en)
		}
	}, function(error) {
	}, 1000)
    for (var i = 0; i < _feeItemArr.length; i++) {
        if (_feeItemArr[i].indexOf(o) >= 0) {
            z = _feeItemArr[i].split(";");
            x = z[1];
        }
    }
    return x;
}

function getUserCompany(o){
	common.ajax_req("get", false, dataUrl, "usercompany.ashx?action=readbyid", {
	    "Id": o
	}, function (data) {
	    console.log(data.Data)
	    //初始化信息
	    var _data = data.Data
	    //var _data2 = data.Data2
	    $('.companyNameEn').text(_data.comp_name_en)
	    $('.companyName').text(_data.comp_name)
	    $('.companyTel').text(_data.comp_tel)
	    $('.companyFax').text(_data.comp_fax)
	    $('.companyEmail').text(_data.comp_email)
	    $('.companyAdd').text(_data.comp_address)
	    $('#signNature').text(_data.comp_name_en);
	    //alert(_data.comp_name)

	}, function (err) {
	    console.log(err)
	}, 5000)
}

function getToCompany(o){
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=readbyid", {
	    "Id": o
	}, function (data) {
	    console.log(data.Data)
	    //初始化信息
	    var _data = data.Data
	    //var _data2 = data.Data2
	    $('.toCompany').text(_data.comp_name)
	    $('.toCompanyContact').text(_data.comp_contactName+' / '+_data.comp_contactPhone+' / '+_data.comp_contactEmail)
	    //alert(_data.comp_name)

	}, function (err) {
	    console.log(err)
	}, 5000)
}


function getShpmInfo(o){	
    //加载基本信息
    common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
        "Id": o
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
        $('.RefNo').text(_data.book_outCode)//参考号码
        $('.hblNo').text(_data.book_orderCode)//系统单号
        $('.mblNo').text(_data.book_billCode)
        $('.qty').text(_data.book_movementType=="FCL"?"FCL":"LCL")
        //$('.cntrNo').text(_data.book_outCode)

        $('.vesselvoy').text(_data.book_vessel+"/"+_data.book_voyage)
        $('.port1').text(_data.book_port1)
        $('.port2').text(_data.book_port2)
        $('.onBoardDate').text(_data.book_truePortTime)
    }, function(err) {
        console.log(err)
    }, 1000)
}

//加载集装箱
function loadContainer(whichId,Id){
	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {
		"whichId": whichId,
		"bookingId": Id
	}, function(data) {
		console.log(data)
		if(data.State == 1) {
			var _data = data.Data;
			for(var i = 0; i < _data.length; i++) {
				var crmlist =_data[i].boco_number+"/"+_data[i].boco_typeName+", ";
					$(".cntrNo").prepend(crmlist)
			}
		}
	
	}, function(err) {
		console.log(err)
	}, 2000)
}	