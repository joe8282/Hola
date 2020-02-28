//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "预览", 
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

	//function _selectSupplier(){
	//}	

	GetDetail();
});

function GetDetail() 
{
	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbycode", {
	    "code": code
	}, function(data) {
		//初始化信息
		var _data = data.Data
		bookingId=_data.book_id
		_movementType=_data.book_movementType

		stateId = _data.book_orderState
		var stateList=$('#shipmentMilestone li')
		$.each(stateList,function(i,item){
			if((i+12)<=stateId){
				$('#shipmentMilestone li').eq(i).addClass('active')
			}
		})
		if(_movementType!='FCL'){
			$('#containerInfo').addClass('none');
			$('#saidAllContainers').html(_data.book_package) //  这个sai container是不能修改，只显示即可，如果CONTAINER有更新，这个也会跟着更新的 20190905 by daniel
		}else{			
			$('#saidAllContainers').html(_data.book_allContainer) //  这个sai container是不能修改，只显示即可，如果CONTAINER有更新，这个也会跟着更新的 20190905 by daniel
		}
		$('#orderCode').html(_data.book_orderCode) // 暂时是Bill of Lading No.:，还不知道怎样显示——20190726 BY DANIEL
		$("#incoterm").val(_data.book_incoterm) //这个incoterm是不能修改，只显示即可 20190905 by daniel
		$("#b_port1").html(_data.book_port1)
		$("#b_port2").html(_data.book_port2)
		$("#b_port4").html(_data.book_port4?_data.book_port4:_data.book_port2)
		$('#Marks').html(_data.book_packageMarks?HtmlEncode(_data.book_packageMarks):"N/M")
		$('#Description').html(HtmlEncode(_data.book_goodAbout))
		$('#Package').text(_data.book_package)
		$('#Weight').text(_data.book_weight)
		$('#Measurement').text(_data.book_volume)
		$('#inRemark').val(HtmlDecode(_data.book_remark))
		$('#remark').html(HtmlEncode(_data.book_remark))
		$('#Shipper').html(HtmlEncode(_data.book_bill1Shipper))
		$('#Consignee').html(HtmlEncode(_data.book_bill1Consignee))
		$('#alsoNotifyParty').html(HtmlEncode(_data.book_alsoNotify))
		$('#NotifyParty').html(HtmlEncode(_data.book_bill1NotifyParty))
		$('#Vessel').text(_data.book_vessel+'/'+_data.book_voyage)
		$('#allContainer').val(_data.book_allContainer)
		//获取供应商列表
		common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
			"upId": _data.book_companyId
		}, function(data) {
			console.log("dataooo");
			var _data = data.data;
			if(_data != null) {
				for(var i = 0; i < _data.length; i++) {
					var crmlist = '<tr class="margin-left-40"><td><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"></td><td> ' + _data[i].comp_name + '</td><td>联系人：' + _data[i].comp_contactName + '</td><td>联系电话：' + _data[i].comp_contactPhone + '</td><td>邮箱：' + _data[i].comp_contactEmail + '</td></tr>'
					$(".crmlist").append(crmlist)
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)


    	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readsupplier", {
    		"bookingId": _data.book_id
    	}, function(data) {
    		//console.log(bookingType)
    		if(data.State == 1) {
    			$("#crmlist").removeClass('none')
    			$("#carrier1").removeClass('none'); // 当打开crmlist的时候也同时打开收货人，by daniel 20190802
    			var _data = data.Data;
    			for(var i = 0; i < _data.length; i++) {
    				$("input[name='crmli'][value='" + _data[i].bosu_crmId + "']").attr("checked", true)
    			}
    		}
    	
    	}, function(err) {
    		console.log(err)
    	}, 2000)

	}, function(err) {
		console.log(err)
	}, 1000)
}