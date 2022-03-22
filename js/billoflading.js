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

	GetDetail();

    $('#bookingFinancialBtn').on('click', function() {
    	location.href = 'getinvoice.html?Id='+bookingId;
    })
    $('#isvgminfo').on('click', function() {
    	if($("#isvgminfo").is(":checked")) {
    		$("#vgminfolist").removeClass('none')
    	} else {
    		$("#vgminfolist").addClass('none')
    	}
    })
    //显示修改补料的所有信息，这里应该需要修改的。
	$('#readbycheckBtn').on('click', function() {
		if ($('#example').hasClass('dataTable')) {
			var　dttable = $('#example').dataTable();
		　　dttable.fnClearTable(); //清空一下table
		　　dttable.fnDestroy(); //还原初始化了的datatable
		}
		oTable = GetBillCheck();
    	$("#myModal").modal("show");
	})

	//柜型	
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 4,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
		    //$('select[name="containerType"]').append(_html)
			$('#containerType').append(_html)
			_containerType=_containerType+_html

		}
		//alert(_containerType)
		//$("#containerType").val("20'GP").trigger("change")
	}, function(error) {
		console.log(parm)
	}, 1000)

	//包装单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 10,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#PackageSel,#package0').append(_html)
			_packageSel=_packageSel+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
	//重量单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 8,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#WeightSel,#weight0,#vgm0,#vgminfoUnit').append(_html)
			_weightSel=_weightSel+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
	//体积单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 9,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#MeasurementSel,#volume0').append(_html)
			_measurementSel=_measurementSel+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)


	//订单状态
	common.ajax_req("get", false, dataUrl, "state.ashx?action=readbytypeid", {
		"typeId": 4
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				//var crmlist = '<span class="col-sm-1 widget-caption text-align-center bordered-1 bordered-gray" stateId='+_data[i].state_id+'>' + _data[i].state_name_cn + '</span>'
				var crmlist = '<li data-target="#simplewizardstep'+_data[i].state_id+'>">' + _data[i].state_name_cn + '<span class="chevron"></span></li>'
				$("#shipmentMilestone").append(crmlist)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)



/*JQuery 限制文本框只能输入数字和小数点*/  
    $("#packageNum0,#weightNum0,#volumeNum0,#vgmNum0,#vgminfoNum").keyup(function(){    
            $(this).val($(this).val().replace(/[^0-9.]/g,''));    
        }).bind("paste",function(){  //CTR+V事件处理    
            $(this).val($(this).val().replace(/[^0-9.]/g,''));     
        }).css("ime-mode", "disabled"); //CSS设置输入法不可用   
/*JQuery 限制文本框只能输入数字和小数点*/  
    $("#packageNum0").keyup(function(){    
            $(this).val($(this).val().replace(/[^0-9]/g,''));    
        }).bind("paste",function(){  //CTR+V事件处理    
            $(this).val($(this).val().replace(/[^0-9]/g,''));     
        }).css("ime-mode", "disabled"); //CSS设置输入法不可用   
	
    $("#weightNum0").change(function() {  
    	//alert($(this).parents('.containerList').find('#vgmNum0').val());
        if($(this).parents('.containerList').find('#vgmNum0').val()==''){
        	//alert($(this).parents('.containerList').find('#vgmNum0').val())
        	$(this).parents('.containerList').find('#vgmNum0').val($(this).val());
        }   
    })
    //VGM责任人 by daniel 20190919
    $("#inputResponsibility").change(function() {  
    	$('#inputAuthorize').val($(this).val());
    	$('#inputWeighing').val($(this).val());
    })


	//加载未被修改的列表
	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbillcheck&state=1", {
		"bookingId": bookingId
	}, function(data) {
		var _data2 = data.data;
		console.log(_data2)
		for(var i = 0; i < _data2.length; i++) {
			$('[data-update-id$="'+_data2[i]["bich_item"]+'"]').html(_data2[i]["bich_content2"])
			$('[data-update-id$="'+_data2[i]["bich_item"]+'"]').css({"display":""});
			$('[data-update-id$="'+_data2[i]["bich_item"]+'"]').attr("data-update-status",_data2[i]["bich_id"])
		}
		GetContainerSum(); //加载完被修改的列表后，马上检查那些集装箱是否与这个一样的，如果是的话，就不用修改，不是的话，就要修改的了。by daniel 20190919
	}, function(err) {
		console.log(err)
	}, 1000)

	///当其中一个SELECT改变的时候，询问其他的是否也需要改变, by daniel 20190730
	$('.containerAll').delegate('select','change', function() {
		if($('#selectSamevalue').is(':checked')==true && $(this).attr("id")!="containerType"){				
    		$('.containerAll').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
    		GetContainerSum();
		}
	}); 

	//////计算件数，重量以及体积的总和，在countSumswitch的开关打开的时候算一次, by daniel 20190731		for(var i = 0; i < $('.containerList').length; i++) {
	$('#container_head').delegate('#countSumswitch','change', function() {
		GetContainerSum();
	}); 
	//////计算件数，重量以及体积的总和，每次在输入新的数据的时候计算一次, by daniel 20190731
	$('.containerAll').delegate('input[id="packageNum0"],input[id="weightNum0"],input[id="volumeNum0"]','change', function() {
		GetContainerSum();
		$('#Containers').attr("data-update-status","1")
	}); 
});

function GetContainerSum(){	
	var package0_sum=0
	var weightNum0_sum=0
	var volumeNum0_sum=0
	var package0_sel=''
	var weightNum0_sel=''
	var volumeNum0_sel=''
	var _containerListLength=$('.containerList').length;
	if($('#countSumswitch').is(':checked')==true){
		$('.containerAll').find("input[id='packageNum0']").each(function(){
			package0_sum+=Number($(this).val())
		});
		$('.containerAll').find("input[id='weightNum0']").each(function(){
			weightNum0_sum+=Number($(this).val())
		});
		$('.containerAll').find("input[id='volumeNum0']").each(function(){
			volumeNum0_sum+=Number($(this).val())
		});
		if(_containerListLength>1){
			// for(i=0;i<_containerListLength;i++){

			// }
			package0_sel=$('.containerAll').find("select[id='package0']").val()
			weightNum0_sel=$('.containerAll').find("select[id='weight0']").val()
			volumeNum0_sel=$('.containerAll').find("select[id='volume0']").val()
		}else{
			package0_sel=$('.containerAll').find("select[id='package0']").val()
			weightNum0_sel=$('.containerAll').find("select[id='weight0']").val()
			volumeNum0_sel=$('.containerAll').find("select[id='volume0']").val()
		}
		//下面是正则来替换件数，毛重，体积的数量，仅仅是数量而已 by daniel 20190731
		(volumeNum0_sum>0 && volumeNum0_sum!=$('#inMeasurement').val()?($("span[data-update-id='Measurement']").css({"display":""}) & $("span[data-update-id='Measurement']").attr("data-update-status","1") & $('[data-update-id$="Measurement"]').html(volumeNum0_sum+' '+volumeNum0_sel)):"");
		(package0_sum>0 && package0_sum!=$('#inpackageNum').val()?($("span[data-update-id='Package']").css({"display":""}) & $("span[data-update-id='Package']").attr("data-update-status","1") & $('[data-update-id$="Package"]').html(package0_sum+' '+package0_sel)):"");
		(weightNum0_sum>0 && weightNum0_sum!=$('#inWeight').val()?($("span[data-update-id='Weight']").css({"display":""}) & $("span[data-update-id='Weight']").attr("data-update-status","1") & $('[data-update-id$="Weight"]').html(weightNum0_sum+' '+weightNum0_sel)):"");
	}
}

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
//		orderCode = _data.book_orderCode
//		crmCompanyId = _data.book_crmCompanyId
//		//crmContactId=_data.book_crmContactId
//		port1 = _data.book_port1
//		port2 = _data.book_port2
//		port3 = _data.book_port3
//		port4 = _data.book_port4
//		port5 = _data.book_port5
//		carrier = _data.book_carrier
//		$('#title3').html('订单号：' + _data.book_orderCode)
//		$('#outCode').val(_data.book_outCode)
//		$('#billCode').val(_data.book_billCode)
//		$('#code').val(_data.book_code)
		$('#orderCode').html(_data.book_orderCode) // 暂时是Bill of Lading No.:，还不知道怎样显示——20190726 BY DANIEL
//		$('#outCode').val(_data.book_outCode)
//		$("#crmuser").val(_data.book_crmCompanyId).trigger("change")
//		//$("#crmcontact").val(_data.book_crmContactId).trigger("change")
//		$("#sellId").val(_data.book_sellId).trigger("change")
//		$("#luruId").val(_data.book_luruId).trigger("change")
//		$("#kefuId").val(_data.book_kefuId).trigger("change")
//		$("#caozuoId").val(_data.book_caozuoId).trigger("change")
//		$("#movementType").val(_data.book_movementType).trigger("change")
		$("#incoterm").val(_data.book_incoterm) //这个incoterm是不能修改，只显示即可 20190905 by daniel
		//$("#divport_receipt").html(_data.book_port1)
		$("#b_port1").html(_data.book_port1?_data.book_port1:'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		$('#port1').html('<option value="' + _data.book_port1 + '">' + _data.book_port1 + '</option>').trigger("change")
		$("#b_port2").html(_data.book_port2?_data.book_port2:'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		$('#port2').html('<option value="' + _data.book_port2 + '">' + _data.book_port2 + '</option>').trigger("change")
		$("#b_port4").html(_data.book_port4?_data.book_port4:_data.book_port2)//不是4就是2
		$('#port4').html('<option value="' + (_data.book_port4?_data.book_port4:_data.book_port2) + '">' + (_data.book_port4?_data.book_port4:_data.book_port2) + '</option>').trigger("change")
//		$("#b_port5").html(_data.book_port2)
//		$('#port5').html('<option value="' + _data.book_port5 + '">' + _data.book_port5 + '</option>').trigger("change")
		//  		$("#port4").val(_data.book_port4).trigger("change")
		//  		$("#port5").val(_data.book_port5).trigger("change")
		
//		$('#port3').html('<option value="' + _data.book_port3 + '">' + _data.book_port3 + '</option>').trigger("change")
//		//  		$("#port2").val(_data.book_port2).trigger("change")
//		//  		$("#port3").val(_data.book_port3).trigger("change")
//		$('#route').val(_data.book_route)
//		$("#forwarder").val(_data.book_forwarder).trigger("change")
//		//$("#carrier").val(_data.book_carrier).trigger("change")
//		$('#carrier').html('<option value="' + _data.book_carrier + '">' + _data.book_carrier + '</option>').trigger("change")
//		$('#fromAddress').val(_data.book_fromAddress)
//		$('#toAddress').val(_data.book_toAddress)
//		$('#okTime').val(_data.book_okTime.substring(0, 10))
//		$('#okTrailerTime').val(_data.book_okTrailerTime.substring(0, 10))
//		if(_data.book_okBillTime != null) {
//			$('#okBillTime').val(_data.book_okBillTime.substring(0, 10))
//		}
//		if(_data.book_okPortTime != null) {
//			$('#okPortTime').val(_data.book_okPortTime.substring(0, 10))
//		}
//		//  		$('#GP20').val(_data.book_20GP)
//		//  		var _GP20 = _data.book_20GP.split(' ')
//		//  		$('#GP20').val(_GP20[0])
//		//  		$('#20GP').val(_GP20[1]).trigger("change")
//		//  		var _GP40 = _data.book_40GP.split(' ')
//		//  		$('#GP40').val(_GP40[0])
//		//  		$('#40GP').val(_GP40[1]).trigger("change")
//		//  		var _HQ40 = _data.book_40HQ.split(' ')
//		//  		$('#HQ40').val(_HQ40[0])
//		//  		$('#40HQ').val(_HQ40[1]).trigger("change")
		$('#Marks').html(_data.book_packageMarks?HtmlEncode(_data.book_packageMarks):"N/M")
		$('#inMarks').val(HtmlDecode(_data.book_packageMarks?_data.book_packageMarks:"N/M"))
		$('#Description').html(_data.book_goodAbout?HtmlEncode(_data.book_goodAbout):'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		$('#inDescription').val(HtmlDecode(_data.book_goodAbout))

		// $('#inWeight').val(_data.book_weight)
		// $('#inMeasurement').val(_data.book_volume)
//		$('#beizhu').html(HtmlDecode(_data.book_beizhu))
		var package0 = _data.book_package.split(' ')
		$('#inPackage').val(package0[0])
		$('#PackageSel').val(package0[1]).trigger("change")
		$('#Package').html(_data.book_package ? _data.book_package : '<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')

		var weight0 = _data.book_weight.split(' ')
		$('#inWeight').val(weight0[0])
		$('#WeightSel').val(weight0[1]).trigger("change")
		$('#Weight').html(_data.book_weight ? _data.book_weight : '<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')

		var volume0 = _data.book_volume.split(' ')
		$('#inMeasurement').val(volume0[0])
		$('#MeasurementSel').val(volume0[1]).trigger("change")
		$('#Measurement').html(_data.book_volume ? _data.book_volume : '<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
//		//$('#inputConsignee').val(_data.book_consignee)
//		$('#inputContractNo').val(_data.book_contractNo)
//		$("#warehouse").val(_data.book_warehouse).trigger("change")
//		$('#warehouseAddress').val(_data.book_warehouseAddress)
//		$('#warehouseContact').val(_data.book_warehouseContact)
//		$('#warehouseContactWay').val(_data.book_warehouseContactWay)
//		$('#warehouseInCode').val(_data.book_warehouseInCode)
//		$('#warehouseInTime').val(_data.book_warehouseInTime.substring(0, 10))
//		$('#warehouseOutCode').val(_data.book_warehouseOutCode)
//		$('#warehouseOutTime').val(_data.book_warehouseOutTime.substring(0, 10))
//		$('#warehouseBeizhu').val(_data.book_warehouseBeizhu)
//		$("input[name='bill1Type'][value='" + _data.book_bill1Type + "']").attr("checked", true)
		$('#inRemark').val(HtmlDecode(_data.book_remark))
		$('#remark').html(_data.book_remark?HtmlEncode(_data.book_remark):'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')

		$('#inShipper').val(HtmlDecode(_data.book_bill1Shipper))
		$('#Shipper').html(_data.book_bill1Shipper?HtmlEncode(_data.book_bill1Shipper):'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		$('#inConsignee').val(HtmlDecode(_data.book_bill1Consignee))
		$('#Consignee').html(_data.book_bill1Consignee?HtmlEncode(_data.book_bill1Consignee):'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		$('#inAlsoNotifyParty').val(HtmlDecode(_data.book_alsoNotify))
		$('#alsoNotifyParty').html(_data.book_alsoNotify?HtmlEncode(_data.book_alsoNotify):'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		$('#inNotifyParty').val(HtmlDecode(_data.book_bill1NotifyParty))
		$('#NotifyParty').html(_data.book_bill1NotifyParty?HtmlEncode(_data.book_bill1NotifyParty):'<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>')
		//$('#inAlsoNotify').val(HtmlDecode(_data.book_alsoNotify))
		//$('#pre-carriage').text(_data.book_vessel+'/'+_data.book_voyage) //暂时放在这里，以后pre-carriage要修改的
		$('#Vessel').text(_data.book_vessel+'/'+_data.book_voyage)
		//$('#inVessel').val(_data.book_vessel+'/'+_data.book_voyage)
		//$('#AlsoNotify').val(_data.book_alsoNotify).trigger("change")
		//$('#inBillBeizhu').val(HtmlEncode(_data.book_billBeizhu))
		//$('#inBill2Beizhu').val(HtmlDecode(_data.book_bill2Beizhu))

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

		common.ajax_req("get", true, dataUrl, "booking.ashx?action=readvgmbyid", {
		    "bookingId": bookingId
		}, function (data) {
		    $('#vgminfoNum').val(data.Data.vgm_num),
            $('#vgminfoUnit').val(data.Data.vgm_unit),
            $('#vgminfoWay').val(data.Data.vgm_way),
            $('#inputResponsibility').val(data.Data.vgm_responsibility),
            $('#inputAuthorize').val(data.Data.vgm_authorize),
            $('#inputWeighing').val(data.Data.vgm_weighing),
            $('#weighingDate').val(data.Data.vgm_weighingDate),
            $('#inputVmgBeizhu').val(data.Data.vgm_beizhu)
		}, function (err) {
		    console.log(err)
		}, 1000)

		GetContainer();

	}, function(err) {
		console.log(err)
	}, 1000)
		//console.log("ok for detail")
}

function GetContainer(){

		//console.log("start for container")
	//加载集装箱
	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {
		"whichId": 1,
		"bookingId": bookingId
	}, function(data) {
		//alert(_containerType)
		if(data.State == 1) {
			$(".containerList").remove()
			var _data = data.Data;
			for(var i = 0; i < _data.length; i++) {
				var package0 = _data[i].boco_package.split(' ')
				var weight0 = _data[i].boco_weight.split(' ')
				var volume0 = _data[i].boco_volume.split(' ')
				var vgm0 = _data[i].boco_vgm.split(' ')
				var crmlist = '<div class="col-sm-12 containerList" style="margin-bottom:5px;">' +
					'<select id="containerType" name="containerType" class="no-padding-left no-padding-right margin-right-5 input-xs" style="width:6%; float: left;">' +
					'</select>' +
					'<input type="text" class="form-control input-xs margin-right-5" id="number" value="' + _data[i].boco_number + '" style="width:10%;float: left;">' +
					'<input type="text" class="form-control input-xs margin-right-5" id="sealNumber" value="' + _data[i].boco_sealNumber + '" style="width:10%;float: left;">' +
					'<input type="text" class="form-control input-xs margin-right-5" id="packageNum0" value="' + package0[0] + '" style="width:4%;float: left;">' +
					'<select id="package0" class="no-padding-left no-padding-right margin-right-5 input-xs" style="width:8%;float: left;">' +
					'</select>' +
					'<input type="text" class="form-control input-xs margin-right-5" id="weightNum0"  value="' + weight0[0] + '" style="width:5%;float: left;">' +
					'<select id="weight0" class="no-padding-left no-padding-right margin-right-5 input-xs" style="width:5%;float: left;">' +
					'</select>' +
					'<input type="text" class="form-control input-xs margin-right-5" id="volumeNum0"  value="' + volume0[0] + '" style="width:5%;float: left;">' +
					'<select id="volume0" class="no-padding-left no-padding-right margin-right-5 input-xs" style="width:5%;float: left;">' +
					'</select>' +
					'<input type="text" class="form-control input-xs margin-right-5" id="vgmNum0"  value="' + vgm0[0] + '" style="width:5%;float: left;">' +
					'<select id="vgm0" class="no-padding-left no-padding-right margin-right-5 input-xs" style="width:5%;float: left;">' +
					'</select>' +
					'<input type="text" class="form-control input-xs margin-right-5" id="customsCode" value="' + _data[i].boco_customsCode + '" style="width:9%;float: left;">' +
					'<input type="text" class="form-control input-xs margin-right-10" id="goodsName" value="' + _data[i].boco_goodsName + '" style="width:9%;float: left;">' +
					'<a class="newContainer btn btn-info input-xs"><i class="fa fa-plus-circle"></i></a> '+
					'<a class="removeContainer btn btn-danger input-xs"><i class="fa fa-times-circle"></i></a>' +
					'</div>'
				$(".containerAll").prepend(crmlist)
				$('#containerType').html(_containerType)
				//console.log(_containerType)
				$('#containerType').val(_data[i].boco_typeName).trigger("change")
				$('#package0').html(_packageSel)
				package0[1]?$('#package0').val(package0[1]).trigger("change"):$("#package0 option:first").prop("selected", 'selected');
				$('#volume0').html(_measurementSel)
				volume0[1]?$('#volume0').val(volume0[1]).trigger("change"):$("#volume0 option:first").prop("selected", 'selected');
				$('#weight0').html(_weightSel)
				weight0[1]?$('#weight0').val(weight0[1]).trigger("change"):$("weight0 option:first").prop("selected", 'selected');
				$('#vgm0').html(_weightSel)
				vgm0[1]?$('#vgm0').val(vgm0[1]).trigger("change"):$("#vgm0 option:first").prop("selected", 'selected');
				_content1Containers=_content1Containers+'<p>'+_data[i].boco_typeName+'/'+_data[i].boco_number+'/'+_data[i].boco_sealNumber+'/'+_data[i].boco_package+'/'+_data[i].boco_weight+'/'+_data[i].boco_volume+'/'+_data[i].boco_vgm+'/'+_data[i].boco_customsCode+'/'+_data[i].boco_goodsName+'</p>'
			}
		}
	}, function(err) {
		console.log(err)
	}, 2000);
}

$('#Shipper').click(function() {
	$(this).addClass('none')
	$('#inShipper').removeClass('none')
	$('#send1').removeClass('none')
	$('#send11').removeClass('none')
})
$('#send1').click(function() {
	if(HtmlDecode($('#inShipper').val())==HtmlDecode($('#Shipper').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inShipper').val()==''){
		comModel('请先输入信息，此次改动无效！');
		$('#inShipper').val(HtmlDecode($('#Shipper').html()))
	}else{		
		//Add('Shipper',$('#Shipper').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inShipper').val())
		//$('#Shipper').html(HtmlEncode($('#inShipper').val()))
		$('[data-update-id$="Shipper"]').html(HtmlEncode($('#inShipper').val().toUpperCase()))
		$("span[data-update-id='Shipper']").css({"display":""});
		$("span[data-update-id='Shipper']").attr("data-update-status","1");
	}	
	$('#Shipper').removeClass('none')	
	$('#inShipper').addClass('none')
	$('#send1').addClass('none')
	$('#send11').addClass('none')
})
$('#send11').click(function() {
	$('#Shipper').removeClass('none')
	$('#inShipper').addClass('none')
	$('#send1').addClass('none')
	$('#send11').addClass('none')
})

$('#Consignee').click(function() {
	$(this).addClass('none')
	$('#inConsignee').removeClass('none')
	$('#send2').removeClass('none')
	$('#send22').removeClass('none')
})
$('#send2').click(function() {
	if(HtmlDecode($('#inConsignee').val())==HtmlDecode($('#Consignee').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inConsignee').val()==''){
		comModel('请先输入信息，此次改动无效！');
		$('#inConsignee').val(HtmlDecode($('#Consignee').html()))
	}else{		
		//Add('Consignee',$('#Consignee').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inConsignee').val())
		//$('#Consignee').html(HtmlEncode($('#inConsignee').val()))
		$('[data-update-id$="Consignee"]').html(HtmlEncode($('#inConsignee').val().toUpperCase()))
		$("span[data-update-id='Consignee']").css({"display":""});
		$("span[data-update-id='Consignee']").attr("data-update-status","1");
	}		
	$('#Consignee').removeClass('none')	
	$('#inConsignee').addClass('none')
	$('#send2').addClass('none')
	$('#send22').addClass('none')
})
$('#send22').click(function() {
	$('#Consignee').removeClass('none')
	$('#inConsignee').addClass('none')
	$('#send2').addClass('none')
	$('#send22').addClass('none')
})

$('#NotifyParty').click(function() {
	$(this).addClass('none')
	$('#inNotifyParty').removeClass('none')
	$('#send3').removeClass('none')
	$('#send33').removeClass('none')
})
$('#send3').click(function() {
	if(HtmlDecode($('#inNotifyParty').val())==HtmlDecode($('#NotifyParty').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inNotifyParty').val()==''){
		comModel('请先输入信息，此次改动无效！');
		$('#inNotifyParty').val(HtmlDecode($('#NotifyParty').html()))
	}else{		
		//Add('NotifyParty',$('#NotifyParty').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inNotifyParty').val())
		//$('#NotifyParty').html(HtmlEncode($('#inNotifyParty').val()))
		$('[data-update-id$="NotifyParty"]').html(HtmlEncode($('#inNotifyParty').val().toUpperCase()))
		$("span[data-update-id='NotifyParty']").css({"display":""});
		$("span[data-update-id='NotifyParty']").attr("data-update-status","1");
	}
	
	$('#NotifyParty').removeClass('none')
	$('#inNotifyParty').addClass('none')
	$('#send3').addClass('none')
	$('#send33').addClass('none')
})
$('#send33').click(function() {
	$('#NotifyParty').removeClass('none')
	$('#inNotifyParty').addClass('none')
	$('#send3').addClass('none')
	$('#send33').addClass('none')
})

$('#alsoNotifyParty').click(function() {
	$(this).addClass('none')
	$('#inAlsoNotifyParty').removeClass('none')
	$('#send_alsoNotifyParty').removeClass('none')
	$('#send_cancel_alsoNotifyParty').removeClass('none')
})
$('#send_alsoNotifyParty').click(function() {
	if(HtmlDecode($('#inAlsoNotifyParty').val())==HtmlDecode($('#alsoNotifyParty').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inAlsoNotifyParty').val()==''){
		comModel('请先输入信息，此次改动无效！');
		$('#inAlsoNotifyParty').val(HtmlDecode($('#alsoNotifyParty').html()))
	}else{		
		//Add('NotifyParty',$('#alsoNotifyParty').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inAlsoNotifyParty').val())
		//$('#alsoNotifyParty').html(HtmlEncode($('#inAlsoNotifyParty').val()))
		$('[data-update-id$="alsoNotifyParty"]').html(HtmlEncode($('#inAlsoNotifyParty').val().toUpperCase()))
		$("span[data-update-id='alsoNotifyParty']").css({"display":""});
		$("span[data-update-id='alsoNotifyParty']").attr("data-update-status","1");
	}
	
	$('#alsoNotifyParty').removeClass('none')
	$('#inAlsoNotifyParty').addClass('none')
	$('#send_alsoNotifyParty').addClass('none')
	$('#send_cancel_alsoNotifyParty').addClass('none')
})
$('#send_cancel_alsoNotifyParty').click(function() {
	$('#alsoNotifyParty').removeClass('none')
	$('#inAlsoNotifyParty').addClass('none')
	$('#send_alsoNotifyParty').addClass('none')
	$('#send_cancel_alsoNotifyParty').addClass('none')
})

// $('#orderCode').click(function() {
// 	$(this).addClass('none')
// 	$('#divport1').removeClass('none')
// 	$('#send4').removeClass('none')
// 	$('#send44').removeClass('none')
// })

$('#b_port1').click(function() {
	$(this).addClass('none')
	$('#divport1').removeClass('none')
	$('#send4').removeClass('none')
	$('#send44').removeClass('none')
})

$('#send4').click(function() {
	if($('#port1').val()==$('#b_port1').html()){
		comModel('信息无变化，此次改动无效！');
	}else if($('#port1').val()==undefined){
		comModel('请先输入信息，此次改动无效！');
		$('#port1').val(HtmlEncode($('#b_port1').html())).trigger("change")
	}else{		
		//Add('Port1',$('#b_port1').text().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#port1').val())
		//$('#b_port1').html(HtmlEncode($('#port1').val()))
		$('[data-update-id$="b_port1"]').html(HtmlEncode($('#port1').val().toUpperCase()))
		$("span[data-update-id='b_port1']").css({"display":""});
		$("span[data-update-id='b_port1']").attr("data-update-status","1");
	}
	
	$('#b_port1').removeClass('none')
	//$('#b_port1').text($('#port1').val())
	$('#divport1').addClass('none')
	$('#send4').addClass('none')
	$('#send44').addClass('none')
})
$('#send44').click(function() {
	$('#b_port1').removeClass('none')
	$('#divport1').addClass('none')
	$('#send4').addClass('none')
	$('#send44').addClass('none')
})

// $('#Vessel').click(function() { //船名航次不需要他们二次修改等等，因为这里是货代必须要确认好的。 20190909 by daniel
// 	$(this).addClass('none')
// 	$('#inVessel').removeClass('none')
// 	$('#send5').removeClass('none')
// 	$('#send55').removeClass('none')
// })
// $('#send5').click(function() {
// 	Add('Vessel',$('#Vessel').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inVessel').val())
// 	$('#Vessel').removeClass('none')
// 	$('#Vessel').html($('#inVessel').val())
// 	$('#pre-carriage').html($('#inVessel').val()) //暂时放在这里，以后pre-carriage要修改的
// 	$('#inVessel').addClass('none')
// 	$('#send5').addClass('none')
// 	$('#send55').addClass('none')
// })
// $('#send55').click(function() {
// 	$('#Vessel').removeClass('none')
// 	$('#inVessel').addClass('none')
// 	$('#send5').addClass('none')
// 	$('#send55').addClass('none')
// })

$('#b_port2').click(function() {
	$(this).addClass('none')
	$('#divport2').removeClass('none')
	$('#send6').removeClass('none')
	$('#send66').removeClass('none')
})

$('#send6').click(function() {
	if($('#port2').val()==$('#b_port2').html()){
		comModel('信息无变化，此次改动无效！');
	}else if($('#port2').val()==undefined){
		comModel('请先输入信息，此次改动无效！');
		$('#port2').val(HtmlEncode($('#b_port2').html())).trigger("change")
	}else{		
		//Add('Port2',$('#b_port2').text().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#port2').val())
		//$('#b_port2').html(HtmlEncode($('#port2').val()))
		$('[data-update-id$="b_port2"]').html(HtmlEncode($('#port2').val().toUpperCase()))
		$("span[data-update-id='b_port2']").css({"display":""});
		$("span[data-update-id='b_port2']").attr("data-update-status","1");
	}
	
	$('#b_port2').removeClass('none')
	//$('#b_port2').text($('#port2').val())
	$('#divport2').addClass('none')
	$('#send6').addClass('none')
	$('#send66').addClass('none')
})
$('#send66').click(function() {
	$('#b_port2').removeClass('none')
	$('#divport2').addClass('none')
	$('#send6').addClass('none')
	$('#send66').addClass('none')
})

$('#b_port4').click(function() {
	$(this).addClass('none')
	$('#divport4').removeClass('none')
	$('#send7').removeClass('none')
	$('#send77').removeClass('none')
})

$('#send7').click(function() {
	if($('#port4').val()==$('#b_port4').html()){
		comModel('信息无变化，此次改动无效！');
	}else if($('#port4').val()==undefined){
		comModel('请先输入信息，此次改动无效！');
		$('#port4').val(HtmlEncode($('#b_port4').html())).trigger("change")
	}else{		
		//Add('Port4',$('#b_port4').text().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#port4').val())
		//$('#b_port4').html(HtmlEncode($('#port4').val()))
		$('[data-update-id$="b_port4"]').html(HtmlEncode($('#port4').val().toUpperCase()))
		$("span[data-update-id='b_port4']").css({"display":""});
		$("span[data-update-id='b_port4']").attr("data-update-status","1");
	}
	
	$('#b_port4').removeClass('none')
	//$('#b_port4').text($('#port4').val())
	$('#divport4').addClass('none')
	$('#send7').addClass('none')
	$('#send77').addClass('none')
})
$('#send77').click(function() {
	$('#b_port4').removeClass('none')
	$('#divport4').addClass('none')
	$('#send7').addClass('none')
	$('#send77').addClass('none')
})

$('#Marks').click(function() {
	$(this).addClass('none')
	$('#inMarks').removeClass('none')
	$('#send8').removeClass('none')
	$('#send88').removeClass('none')
})
$('#send8').click(function() {
	if(HtmlDecode($('#inMarks').val())==HtmlDecode($('#Marks').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inMarks').val()==''){
		comModel('不填写唛头即显示为“N/M”。');
		$('#inMarks').val("N/M");
		$('#Marks').html("N/M");
	}else{
		//Add('Port4',$('#b_port4').text().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#port4').val())
		//$('#Marks').html(HtmlEncode($('#inMarks').val()))
		$('[data-update-id$="Marks"]').html(HtmlEncode($('#inMarks').val().toUpperCase()))
		$("span[data-update-id='Marks']").css({"display":""});
		$("span[data-update-id='Marks']").attr("data-update-status","1");
	}
	$('#Marks').removeClass('none')
	//$('#Marks').html(HtmlEncode($('#inMarks').val()))
	$('#inMarks').addClass('none')
	$('#send8').addClass('none')
	$('#send88').addClass('none')
})
$('#send88').click(function() {
	$('#Marks').removeClass('none')
	$('#inMarks').addClass('none')
	$('#send8').addClass('none')
	$('#send88').addClass('none')
})

$('#Description').click(function() {
	$(this).addClass('none')
	$('#inDescription').removeClass('none')
	$('#send9').removeClass('none')
	$('#send99').removeClass('none')
})
$('#send9').click(function() {
	if(HtmlDecode($('#inDescription').val())==HtmlDecode($('#Description').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inDescription').val()==''){
		$('#inDescription').val(HtmlDecode($('#Description').html()))
		comModel('请先输入信息，此次改动无效！');
	}else{
		//Add('Description',$('#Description').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inDescription').val())
		//$('#Description').html(HtmlEncode($('#inDescription').val()))
		$('[data-update-id$="Description"]').html(HtmlEncode($('#inDescription').val().toUpperCase()))
		$("span[data-update-id='Description']").css({"display":""});
		$("span[data-update-id='Description']").attr("data-update-status","1");
	}
	
	$('#Description').removeClass('none')
	//$('#Description').html(HtmlEncode($('#inDescription').val()))
	$('#inDescription').addClass('none')
	$('#send9').addClass('none')
	$('#send99').addClass('none')
})
$('#send99').click(function() {
	$('#Description').removeClass('none')
	$('#inDescription').addClass('none')
	$('#send9').addClass('none')
	$('#send99').addClass('none')
})



$('#Package').click(function() {
	$(this).addClass('none')
	$('#inPackage').removeClass('none')
	$('#PackageSel').removeClass('none')
	$('#send_package').removeClass('none')
	$('#send_send_package').removeClass('none')
})
$('#send_package').click(function() {
	if(($('#inPackage').val()+' '+$('#PackageSel').val())==HtmlDecode($('#Package').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inPackage').val()==''){
		$('#inPackage').val($('#Package').html().split(' ')[0])
		comModel('请先输入信息，此次改动无效！');
	}else{
		//Add('Weight', $('#Weight').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''), $('#inWeight').val())
		//$('#Package').html($('#inPackage').val()+' '+$('#PackageSel').val())
		$('[data-update-id$="Package"]').html($('#inPackage').val()+' '+$('#PackageSel').val().toUpperCase())
		$("span[data-update-id='Package']").css({"display":""});
		$("span[data-update-id='Package']").attr("data-update-status","1");
	}
	
	$('#Package').removeClass('none')
	//$('#Weight').html($('#inWeight').val())
	$('#inPackage').addClass('none')
	$('#PackageSel').addClass('none')
	$('#send_package').addClass('none')
	$('#send_send_package').addClass('none')
})
$('#send_send_package').click(function() {
	$('#Package').removeClass('none')
	$('#inPackage').addClass('none')
	$('#PackageSel').addClass('none')
	$('#send_package').addClass('none')
	$('#send_send_package').addClass('none')
})

$('#Weight').click(function() {
	$(this).addClass('none')
	$('#inWeight').removeClass('none')
	$('#WeightSel').removeClass('none')
	$('#send10').removeClass('none')
	$('#send1010').removeClass('none')
})
$('#send10').click(function() {
	if(($('#inWeight').val()+' '+$('#WeightSel').val())==HtmlDecode($('#Weight').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inWeight').val()==''){
		$('#inWeight').val($('#Weight').html().split(' ')[0])
		comModel('请先输入信息，此次改动无效！');
	}else{
		//Add('Weight', $('#Weight').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''), $('#inWeight').val())
		//$('#Weight').html($('#inWeight').val()+' '+$('#WeightSel').val())
		$('[data-update-id$="Weight"]').html($('#inWeight').val()+' '+$('#WeightSel').val().toUpperCase())
		$("span[data-update-id='Weight']").css({"display":""});
		$("span[data-update-id='Weight']").attr("data-update-status","1");
	}
	
	$('#Weight').removeClass('none')
	//$('#Weight').html($('#inWeight').val())
	$('#inWeight').addClass('none')
	$('#WeightSel').addClass('none')
	$('#send10').addClass('none')
	$('#send1010').addClass('none')
})
$('#send1010').click(function() {
	$('#Weight').removeClass('none')
	$('#inWeight').addClass('none')
	$('#WeightSel').addClass('none')
	$('#send10').addClass('none')
	$('#send1010').addClass('none')
})

$('#Measurement').click(function() {
	$(this).addClass('none')
	$('#inMeasurement').removeClass('none')
	$('#MeasurementSel').removeClass('none')
	$('#send1a').removeClass('none')
	$('#send1aa').removeClass('none')
})
$('#send1a').click(function() {
	if(($('#inMeasurement').val()+' '+$('#MeasurementSel').val())==HtmlDecode($('#Measurement').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inMeasurement').val()==''){
		$('#inMeasurement').val($('#Measurement').html().split(' ')[0])
		comModel('请先输入信息，此次改动无效！');
	}else{
		//Add('Measurement', $('#Measurement').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''), $('#inMeasurement').val())
		//$('#Measurement').html($('#inMeasurement').val()+' '+$('#MeasurementSel').val())
		$('[data-update-id$="Measurement"]').html($('#inMeasurement').val()+' '+$('#MeasurementSel').val().toUpperCase())
		$("span[data-update-id='Measurement']").css({"display":""});
		$("span[data-update-id='Measurement']").attr("data-update-status","1");
	}
	
	$('#Measurement').removeClass('none')
	//$('#Measurement').html($('#inMeasurement').val())
	$('#inMeasurement').addClass('none')
	$('#MeasurementSel').addClass('none')
	$('#send1a').addClass('none')
	$('#send1aa').addClass('none')
})
$('#send1aa').click(function() {
	$('#Measurement').removeClass('none')
	$('#inMeasurement').addClass('none')
	$('#MeasurementSel').addClass('none')
	$('#send1a').addClass('none')
	$('#send1aa').addClass('none')
})

$('#remark').click(function() {
	$(this).addClass('none')
	$('#inRemark').removeClass('none')
	$('#send_remark').removeClass('none')
	$('#send_cancel_remark').removeClass('none')
})
$('#send_remark').click(function() {
	if(($('#inRemark').val())==HtmlDecode($('#remark').html())){
		comModel('信息无变化，此次改动无效！');
	}else if($('#inRemark').val()==''){
		$('#inRemark').val($('#remark').html())
		comModel('请先输入信息，此次改动无效！');
	}else{
		//Add('Remark',$('#remark').html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>',''),$('#inRemark').val())
		//$('#Measurement').html($('#inMeasurement').val()+' '+$('#MeasurementSel').val())
		$('[data-update-id$="remark"]').html($('#inRemark').val())
		$("span[data-update-id='remark']").css({"display":""});
		$("span[data-update-id='remark']").attr("data-update-status","1");
	}
	
	$('#remark').removeClass('none')
	//$('#remark').html(HtmlEncode($('#inRemark').val()))
	$('#inRemark').addClass('none')
	$('#send_remark').addClass('none')
	$('#send_cancel_remark').addClass('none')
})
$('#send_cancel_remark').click(function() {
	$('#remark').removeClass('none')
	$('#inRemark').addClass('none')
	$('#send_remark').addClass('none')
	$('#send_cancel_remark').addClass('none')
})

// function Add(item,content1,content2) //所有得添加在最后发送的时候才添加，所以这个功能失效了。by daniel 20190918
// {
// 	common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newbillcheck', {
// 		'bookingId': bookingId,
// 		'companyId': companyID,
// 		'userId': userID,
// 		'item': item,
// 		'content1': content1,
// 		'content2': content2
// 	}, function(data) {
// 		if(data.State == 1) {
// 			comModel("提交成功")
// 		} else {
// 			comModel("提交失败")
// 		}
// 	}, function(error) {
// 		console.log(error)
// 	}, 1000)
// }

//港口
$("#port1,#port2,#port4").select2({
	ajax: {
		url: dataUrl + "ajax/publicdata.ashx?action=readport&companyId=" + companyID,
		dataType: 'json',
		delay: 250,
		data: function(params) {
			params.offset = 10; //显示十条 
			params.page = params.page || 1; //页码 
			return {
				q: params.term,
				page: params.page,
				offset: params.offset
			};
		},
		cache: true,
		/* *@params res 返回值 *@params params 参数 */
		processResults: function(res, params) {
			var users = res.data;
			var options = [];
			for(var i = 0, len = users.length; i < len; i++) {
				var option = {
					"id": users[i]["puda_name_en"],
					"text": users[i]["puda_name_en"]
				};
				options.push(option);
			}
			return {
				results: options,
				pagination: {
					more: (params.page * params.offset) < res.total
				}
			};
		}
	},
	placeholder: '请选择', //默认文字提示
	language: "zh-CN",
	tags: false, //允许手动添加
	allowClear: true, //允许清空
	escapeMarkup: function(markup) {
		return markup;
	}, // 自定义格式化防止xss注入
	minimumInputLength: 3,
	formatResult: function formatRepo(repo) {
		return repo.text;
	}, // 函数用来渲染结果
	formatSelection: function formatRepoSelection(repo) {
		return repo.text;
	} // 函数用于呈现当前的选择
});

$('#send0').click(function() {
	var containerData = [];
	$("[data-update='dataModify']").each(function() { ///当添加了新的供应商后，清空input, by daniel 20190730
		if($(this).attr("data-update-status")==1){
			//function Add(item,content1,content2) 
			_item=$(this).attr("data-update-id");
			_content1=$('#'+_item).html().replace('<i class="fa fa-edit tooltip-info" data-toggle="tooltip" data-original-title="点击修改"></i>','')
			_content2=$(this).html();
			if(_movementType=='FCL' && _item=="Containers"){
				//alert(_content1Containers);
				var _content2 = [];
				for(var i = 0; i < $('.containerList').length; i++) {
					var containerType = $('.containerList').eq(i).find('#containerType').val()
					var number = $('.containerList').eq(i).find('#number').val()
					var sealNumber = $('.containerList').eq(i).find('#sealNumber').val()
					var package0 = $('.containerList').eq(i).find('#packageNum0').val() + ' ' + $('.containerList').eq(i).find('#package0').val()
					var weight0 = $('.containerList').eq(i).find('#weightNum0').val() + ' ' + $('.containerList').eq(i).find('#weight0').val()
					var vgm0 = $('.containerList').eq(i).find('#vgmNum0').val() + ' ' + $('.containerList').eq(i).find('#vgm0').val()
					var volume0 = $('.containerList').eq(i).find('#volumeNum0').val() + ' ' + $('.containerList').eq(i).find('#volume0').val()
					var customsCode = $('.containerList').eq(i).find('#customsCode').val()
					var goodsName = $('.containerList').eq(i).find('#goodsName').val()
				
					//var oneData = containerType + ',' + number + ',' + sealNumber + ',' + package0 + ',' + weight0 + ',' + volume0 + ',' + vgm0 + ',' + customsCode + ',' + goodsName + ';'
					var oneData='<p>' +containerType+'/'+number+'/'+sealNumber+'/'+package0+'/'+weight0+'/'+volume0+'/'+vgm0+'/'+customsCode+'/'+goodsName+'</p>';
					_content2 = _content2+ oneData;
				}
				_content1 = _content1Containers;
			}
			common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newbillcheck', {
				'bookingId': bookingId,
				'companyId': companyID,
				'userId': userID,
				'userName': userName,
				'item': _item,
				'content1': _content1,
				'content2': _content2
			}, function(data) {
				if(data.State == 1) {
					comModel("提交成功"+_item)
				} else {
					comModel("提交失败"+_item)
				}
			}, function(error) {
				console.log(error)
			}, 1000)
		}
	})

	if(_movementType=='FCL'){
		for(var i = 0; i < $('.containerList').length; i++) {
			var containerType = $('.containerList').eq(i).find('#containerType').val()
			var number = $('.containerList').eq(i).find('#number').val()
			var sealNumber = $('.containerList').eq(i).find('#sealNumber').val()
			var package0 = $('.containerList').eq(i).find('#packageNum0').val() + ' ' + $('.containerList').eq(i).find('#package0').val()
			var weight0 = $('.containerList').eq(i).find('#weightNum0').val() + ' ' + $('.containerList').eq(i).find('#weight0').val()
			var vgm0 = $('.containerList').eq(i).find('#vgmNum0').val() + ' ' + $('.containerList').eq(i).find('#vgm0').val()
			var volume0 = $('.containerList').eq(i).find('#volumeNum0').val() + ' ' + $('.containerList').eq(i).find('#volume0').val()
			var customsCode = $('.containerList').eq(i).find('#customsCode').val()
			var goodsName = $('.containerList').eq(i).find('#goodsName').val()
		
			var oneData = containerType + ',' + number + ',' + sealNumber + ',' + package0 + ',' + weight0 + ',' + volume0 + ',' + vgm0 + ',' + customsCode + ',' + goodsName + ';'
			containerData = containerData + oneData
		}
		console.log(containerData)
		//boxRow = boxRow.clone()
		
		var vgminfoNum = $('#vgminfoNum').val(),
			vgminfoUnit = $('#vgminfoUnit').val(),
			vgminfoWay = $('#vgminfoWay').val(),
			responsibility = $('#inputResponsibility').val(),
			authorize = $('#inputAuthorize').val(),
			weighing = $('#inputWeighing').val(),
			weighingDate = $('#weighingDate').val(),
			vgmBeizhu = $('#inputVmgBeizhu').val()
		console.log(weighingDate)
		common.ajax_req('get', false, dataUrl, 'booking.ashx?action=modifycontainer', {
			'bookingId': bookingId,
			'containerData': containerData,
			'num': vgminfoNum,
			'unit': vgminfoUnit,
			'way': vgminfoWay,
			'responsibility': responsibility,
			'authorize': authorize,
			'weighing': weighing,
			'weighingDate': weighingDate,
			'beizhu': vgmBeizhu
		}, function(data) {
			if(data.State == 1) {
				containerData = ''
				$('#saidAllContainers').val(data.Data)
				comModel("保存成功")
			} else {
				containerData = ''
				comModel("保存失败")
			}
		}, function(error) {
			console.log(error)
		}, 1000)
	}

	common.ajax_req('POST', true, dataUrl, 'booking.ashx?action=modify', {
		'Id':bookingId,
		'checkState':4
	}, function(data) {
		if(data.State == 1) {
			comModel("确认完成对单！")
			$("[data-update='dataModify']").attr("data-update-status","")
			//location.href = 'bookinglist.html';	
		} else {
			comModel("对单失败")
		}
	}, function(error) {
		console.log(parm)
	}, 2000)

})

$('.containerAll').delegate('.newContainer', 'click', function() {
	var containerboxRow = '<div class="col-sm-12 containerList" style="margin-bottom: 5px;">'+ $(this).parents('.containerList').html()+'</div>';
	$('.containerAll').append(containerboxRow)

	$(this).parents('.containerList').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, by daniel 20190730
		$('.containerList:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
	})
	$(this).parents('.containerList').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select, by daniel 20190730
		$('.containerList:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
	})
	$('#Containers').attr("data-update-status","1")
	GetContainerSum();
})

$('.containerAll').delegate('.removeContainer', 'click', function() {
    //$("#delContainer").modal("show");
	//if($('.removeContainer').length>1 && $(this).parents('.containerList').index()!=0 && $(this).parents('.containerList').find("#number").val()==""){
	if($('.removeContainer').length>1 && $(this).parents('.containerList').index()!=0){
		$(this).parents('.containerList').remove();		
		$('#Containers').attr("data-update-status","1")
		GetContainerSum();
	}
})

function GetBillCheck() {
	var table = $("#example").dataTable({
		"iDisplayLength":100,
		"sAjaxSource": dataUrl + 'ajax/booking.ashx?action=readbillcheck&bookingId='+bookingId+'&state=1',
		'bPaginate': false,
		"bInfo": false,
		"bFilter": false,
		"bSort": false,
		"aaSorting": [[3, "desc"]],
		"aoColumns": [{"mDataProp": "bich_item"},
			{"mDataProp": "bich_content1"},
			{"mDataProp": "bich_content2"},
			{"mDataProp": "bich_time",
				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
					$(nTd).html(oData.bich_time.substring(0, 16).replace('T',' '));
				}
			},
			{"mDataProp": "bich_id",
				"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
					$(nTd).html(oData.bich_sure==1?"未修改":"已修改")
				}
			},
		]
	});
	return table;
}