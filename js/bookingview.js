//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "对单", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENT",       
            "con_top_3" : "BILL OF LADING",  
        };
        
var typeId,oTable;
var code = GetQueryString('code');
var bookingId;

var _containerType='', _packageSel='', _weightSel='', _measurementSel='',_movementType='', _content1Containers='';

$(document).ready(function() {
	this.title = get_lan('con_top_3')
	$('.navli33').addClass("active open")
	$('.book11').addClass("active")
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3'))
	$(".detail td").css({"vertical-align":"text-top"});
	$("input[name='blReleaseType']").css({"display":"none"});
	$("span[data-update='dataModify']").css({"display":"none"});

	//订单状态
	common.ajax_req("get", false, dataUrl, "state.ashx?action=readbytypeid", {
		"typeId": 4
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var crmlist = '<li data-target="#simplewizardstep'+_data[i].state_id+'>">' + _data[i].state_name_cn + '<span class="chevron"></span></li>'
				$("#shipmentMilestone").append(crmlist)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)

	GetDetail();

});


function GetDetail() 
{
	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbycode", {
	    "code": code
	}, function(data) {
		//console.log(data.Data)
		//初始化信息
		var _data = data.Data
		bookingId=_data.book_id
		_movementType=_data.book_movementType

		stateId = _data.book_orderState
		var stateList=$('#shipmentMilestone li')
		$.each(stateList,function(i,item){
			if((i+12)<=stateId){
				//item.addClass('btn-blue')
				$('#shipmentMilestone li').eq(i).addClass('active')
			}
		})
		//alert(bookingId)
		if(_movementType!='FCL'){
			$('#containerInfo').addClass('none');
			$('#saidAllContainers').html(_data.book_package) //  这个sai container是不能修改，只显示即可，如果CONTAINER有更新，这个也会跟着更新的 20190905 by daniel
		}else{			
			$('#saidAllContainers').html(_data.book_allContainer) //  这个sai container是不能修改，只显示即可，如果CONTAINER有更新，这个也会跟着更新的 20190905 by daniel
		}
		$('#orderCode').html(_data.book_orderCode) // 暂时是Bill of Lading No.:，还不知道怎样显示——20190726 BY DANIEL
		$("#incoterm").val(_data.book_incoterm) //这个incoterm是不能修改，只显示即可 20190905 by daniel
		$("#b_port1").html(_data.book_port1)
		$('#port1').html('<option value="' + _data.book_port1 + '">' + _data.book_port1 + '</option>').trigger("change")
		$("#b_port2").html(_data.book_port2)
		$('#port2').html('<option value="' + _data.book_port2 + '">' + _data.book_port2 + '</option>').trigger("change")
		$("#b_port4").html(_data.book_port4?_data.book_port4:_data.book_port2)//不是4就是2
		$('#port4').html('<option value="' + (_data.book_port4?_data.book_port4:_data.book_port2) + '">' + (_data.book_port4?_data.book_port4:_data.book_port2) + '</option>').trigger("change")
		$('#Marks').html(_data.book_packageMarks?HtmlEncode(_data.book_packageMarks):"N/M")
		$('#inMarks').val(HtmlDecode(_data.book_packageMarks?_data.book_packageMarks:"N/M"))
		$('#Description').html(_data.book_goodAbout)
		$('#inDescription').val(HtmlDecode(_data.book_goodAbout))
		var package0 = _data.book_package.split(' ')
		$('#inPackage').val(package0[0])
		$('#PackageSel').val(package0[1]).trigger("change")
		$('#Package').text(_data.book_package)

		var weight0 = _data.book_weight.split(' ')
		$('#inWeight').val(weight0[0])
		$('#WeightSel').val(weight0[1]).trigger("change")
		$('#Weight').text(_data.book_weight)

		var volume0 = _data.book_volume.split(' ')
		$('#inMeasurement').val(volume0[0])
		$('#MeasurementSel').val(volume0[1]).trigger("change")
		$('#Measurement').text(_data.book_volume)
		$('#inRemark').val(HtmlDecode(_data.book_remark))
		$('#remark').html(_data.book_remark)

		$('#inShipper').val(HtmlDecode(_data.book_bill1Shipper))
		$('#Shipper').html(_data.book_bill1Shipper)
		$('#inConsignee').val(HtmlDecode(_data.book_bill1Consignee))
		$('#Consignee').html(_data.book_bill1Consignee)
		$('#inAlsoNotifyParty').val(HtmlDecode(_data.book_alsoNotify))
		$('#alsoNotifyParty').html(_data.book_alsoNotify)
		$('#inNotifyParty').val(HtmlDecode(_data.book_bill1NotifyParty))
		$('#NotifyParty').html(_data.book_bill1NotifyParty)
		//$('#pre-carriage').text(_data.book_vessel+'/'+_data.book_voyage) //暂时放在这里，以后pre-carriage要修改的
		$('#Vessel').text(_data.book_vessel+'/'+_data.book_voyage)

		if(_data.book_vgm != '') {
			var vgm0 = _data.book_vgm.split(' ')
			$('#vgmNum').val(vgm0[0])
			$('#vgm').val(vgm0[1]).trigger("change")
		}
		if(_data.book_okPortTime2 != null) {
			$('#okPortTime2').val(_data.book_okPortTime2.substring(0, 10))
		} else {
			$("#okPortTime2").val(getDate())
		}
		if(_data.book_truePortTime != null) {
			$('#truePortTime').val(_data.book_truePortTime.substring(0, 10))
		}
		if(_data.book_truePortTime2 != null) {
			$('#truePortTime2').val(_data.book_truePortTime2.substring(0, 10))
		}
		$('#allContainer').val(_data.book_allContainer)
		$("#shippingTerm").val(_data.book_shippingTerm).trigger("change")
		$("#shippingFeeTerm").val(_data.book_shippingFeeTerm).trigger("change")
		$('#payAddress').val(_data.book_payAddress)
		$('#signAddress').val(_data.book_signAddress)
	}, function(err) {
		console.log(err)
	}, 1000)
}
