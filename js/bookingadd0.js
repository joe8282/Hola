//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "新增订舱单", 
            "con_top_4" : "新增联系单",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENTe",   
            "con_top_3" : "Booking Add", 
            "con_top_4" : "ContactOrder Add", 
        };

$(function(){
	$('.navli3').addClass("active open")
	
	var fromId = '0';
	if(GetQueryString('fromId')!=null){
		fromId=GetQueryString('fromId')
	}
	
	if(fromId=='1'){
		this.title = get_lan('con_top_3')
		$('#title1').text(get_lan('con_top_3'))
		$('#title2').text(get_lan('con_top_3'))
		$('.book2').addClass("active")
	}else{
		this.title = get_lan('con_top_4')
		$('#title1').text(get_lan('con_top_4'))
		$('#title2').text(get_lan('con_top_4'))
		$('#title3').hide()
		$('.book4').addClass("active")
	}

	var crmCompanyId = '0',crmContactId = '0';
	if(GetQueryString('crmId')!=null){
		crmCompanyId=GetQueryString('crmId')
		_selectSupplier(crmCompanyId)
		_selectBill(crmCompanyId)
	}
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var isTemplate,movementType, incoterm, port1, port2, port3, route, fromAddress, toAddress, okTime, okTrailerTime,okBillTime,okPortTime,packageNum=0, weightNum=0, volumeNum=0, package, weight, volume, GP20=0, GP40=0, HQ40=0, SGP20, SGP40, SHQ40, packageMarks, goodAbout, beizhu;
    var feeData='',trailerData='';
    var carrier,consignee,contractNo;
    var bookingType;
    //var crm='';
    var orderCode,outCode;
    var sellId,luruId,kefuId,caozuoId;
    var forwarder,warehouse,warehouseAddress,warehouseContact,warehouseContactWay,warehouseInCode,warehouseInTime,warehouseOutCode,warehouseOutTime,warehouseBeizhu;
    var bill1Type,bill1Shipper,bill1Consignee,bill1NotifyParty,bill2Type,bill2Shipper,bill2Consignee,bill2NotifyParty;
	var allContainer;
//	var coding = "";
//	for(var i = 0; i < 8; i++) {
//		coding += Math.floor(Math.random() * 10);
//	}	

	//销售人员
	common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
		'role': 6,
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
		'role': 11,
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
		'role': 7,
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
		'role': 8,
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

	function _selectSupplier(crmId){
		//获取供应商列表
		common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
			"upId": crmId
		}, function(data) {
			//console.log(data)
			var _data = data.data;
			if(_data != null) {
				for(var i = 0; i < _data.length; i++) {
					var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" value="' + _data[i].comp_id + '"> ' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].comp_contactName + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：' + _data[i].comp_contactPhone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：' + _data[i].comp_contactEmail + '</div>'
					$(".crmlist").append(crmlist)
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)
	}

    	
	//获取委托人列表
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		"companyId": companyID
	}, function(data) {
		//console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
				$('#crmuser').append(_html)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)	
	$("#crmuser").change(function() {
		crmCompanyId = $("#crmuser").val();
		_selectSupplier(crmCompanyId)
		_selectBill(crmCompanyId)
		//获取联系人列表
		common.ajax_req("get", false, dataUrl, "crmcompanycontact.ashx?action=readtop", {
			"companyId": crmCompanyId
		}, function(data) {
			//console.log(data)
			var _data = data.data;
			if(_data != null) {
				for(var i = 0; i < _data.length; i++) {
					var _html = '<option value="' + _data[i].coco_id + '">' + _data[i].coco_name + '</option>';
					$('#crmcontact').append(_html)
				}
			}
		}, function(err) {
			console.log(err)
		}, 2000)
	})
	
	//自定货
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		"companyId": companyID,
		'type': 'LOCAL FORWARDER'
	}, function(data) {
		//console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
				$('#forwarder').append(_html)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)
	
	//仓储代理
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		"companyId": companyID,
		'type': 'WAREHOUSE AGENT'
	}, function(data) {
		//console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name  + '</option>';
				$('#warehouse').append(_html)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)
	
	//陆运代理
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		"companyId": companyID,
		'type': 'LAND TRANSPORTATION AGENT'
	}, function(data) {
		//console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name  + '</option>';
				$('#trailer').append(_html)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)		

	function _selectBill(crmId){
		//SHIPPER
		common.ajax_req('GET', false, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 1,
			'companyId': crmId
		}, function(data) {
			var _data = data.data;
			if(_data != null) {
				$("#inShipper").val(HtmlDecode(_data[0].cobi_content))
				$("#inShipper2").val(HtmlDecode(_data[0].cobi_content))
				for(var i = 0; i < _data.length; i++) {
					var content = _data[i].cobi_content.split('<br>')
					var _html = '<option value="' + _data[i].cobi_content + '">' + content[0] + '</option>';
					$('#Shipper').append(_html)
					$('#Shipper2').append(_html)
				}
			}
			$('#Shipper').append('<option value="0">新增</option>')
			$('#Shipper2').append('<option value="0">新增</option>')
		}, function(error) {
			//console.log(parm)
		}, 1000)
		$("#Shipper").click(function() {
			var opt = $("#Shipper").val();
			if(opt != '0') {
				$("#inShipper").val(HtmlDecode(opt))
			} else {
				_addBillFun(1, 1,crmId)
			}
		})
		$("#Shipper2").click(function() {
			var opt = $("#Shipper2").val();
			if(opt != '0') {
				$("#inShipper2").val(HtmlDecode(opt))
			} else {
				_addBillFun(1, 2,crmId)
			}
		})
		
		//CONSIGNEE
		common.ajax_req('GET', false, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 2,
			'companyId': crmId
		}, function(data) {
			var _data = data.data;
			if(_data != null) {
				$("#inConsignee").val(HtmlDecode(_data[0].cobi_content))
				$("#inConsignee2").val(HtmlDecode(_data[0].cobi_content))
				for(var i = 0; i < _data.length; i++) {
					var content = _data[i].cobi_content.split('<br>')
					var _html = '<option value="' + _data[i].cobi_content + '">' + content[0] + '</option>';
					$('#Consignee').append(_html)
					$('#Consignee2').append(_html)
				}
			}
			$('#Consignee').append('<option value="0">新增</option>')
			$('#Consignee2').append('<option value="0">新增</option>')
		}, function(error) {
			//console.log(parm)
		}, 1000)
		$("#Consignee").click(function() {
			var opt = $("#Consignee").val();
			if(opt != '0') {
				$("#inConsignee").val(HtmlDecode(opt))
			} else {
				_addBillFun(2, 1,crmId)
			}
		})
		$("#Consignee2").click(function() {
			var opt = $("#Consignee2").val();
			if(opt != '0') {
				$("#inConsignee2").val(HtmlDecode(opt))
			} else {
				_addBillFun(2, 2,crmId)
			}
		})
		
		//NOTIFYPARTY
		common.ajax_req('GET', false, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 3,
			'companyId': crmId
		}, function(data) {
			var _data = data.data;
			if(_data != null) {
				$("#inNotifyParty").val(HtmlDecode(_data[0].cobi_content))
				$("#inNotifyParty2").val(HtmlDecode(_data[0].cobi_content))
				for(var i = 0; i < _data.length; i++) {
					var content = _data[i].cobi_content.split('<br>')
					var _html = '<option value="' + _data[i].cobi_content + '">' + content[0] + '</option>';
					$('#NotifyParty').append(_html)
					$('#NotifyParty2').append(_html)
				}
			}
			$('#NotifyParty').append('<option value="0">新增</option>')
			$('#NotifyParty2').append('<option value="0">新增</option>')
		}, function(error) {
			//console.log(parm)
		}, 1000)
		$("#NotifyParty").click(function() {
			var opt = $("#NotifyParty").val();
			if(opt != '0') {
				$("#inNotifyParty").val(HtmlDecode(opt))
			} else {
				_addBillFun(3, 1,crmId)
			}
		})
		$("#NotifyParty2").click(function() {
			var opt = $("#NotifyParty2").val();
			if(opt != '0') {
				$("#inNotifyParty2").val(HtmlDecode(opt))
			} else {
				_addBillFun(3, 2,crmId)
			}
		})
	}
	
	//新增提单
	function _addBillFun(typeId, where, crmId) {
		bootbox.dialog({
			message: "<div id='myModal'><div class='row'><div class='col-md-12'><div class='form-group'><textarea class='form-control' id='inputBillContent' rows='5' maxlength='200' onchange='this.value=this.value.substring(0, 200)' onkeydown='this.value=this.value.substring(0, 200)' onkeyup='this.value=this.value.substring(0, 200)'></textarea></div></div></div></div>",
			title: "新增提单信息",
			className: "modal-darkorange",
			buttons: {
				success: {
					label: "确定",
					className: "btn-blue",
					callback: function() {
						var billTypeId,billTypeName,billContent;
						billTypeId=typeId;
						if(typeId==1){billTypeName='SHIPPER';}
						else if(typeId==2){billTypeName='CONSIGNEE';}
						else if(typeId==3){billTypeName='NOTIFYPARTY';}
						billContent=HtmlEncode($("#inputBillContent").val());
						if(!billContent){
							comModel("请输入提单内容信息")
							return false;
						}else{
							var parm = {
								'userId': userID,
								'companyId': crmId,
								//'name': billName,
								'content': billContent,
								'typeId': billTypeId,
								'typeName': billTypeName
							}
							
							common.ajax_req('POST', true, dataUrl, 'crmcompanybill.ashx?action=new', parm, function(data) {
								if(data.State == 1) {
									comModel("新增提单信息成功")
									var newBillContent=billContent.split('<br>')
									if(where==1&&typeId==1){
										$('#Shipper').prepend('<option value="'+billContent+'">'+newBillContent[0]+'</option>')
										$('#Shipper').val(billContent).trigger("change")
										$("#inShipper").val(HtmlDecode(billContent))
									}
									if(where==1&&typeId==2){
										$('#Consignee').prepend('<option value="'+billContent+'">'+newBillContent[0]+'</option>')
										$('#Consignee').val(billContent).trigger("change")										
										$("#inConsignee").val(HtmlDecode(billContent))
									}
									if(where==1&&typeId==3){
										$('#NotifyParty').prepend('<option value="'+billContent+'">'+newBillContent[0]+'</option>')
										$('#NotifyParty').val(billContent).trigger("change")										
										$("#inNotifyParty").val(HtmlDecode(billContent))
									}	
									if(where == 2 && typeId == 1) {
										$('#Shipper2').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#Shipper2').val(billContent).trigger("change")
										$("#inShipper2").val(HtmlDecode(billContent))
									}
									if(where == 2 && typeId == 2) {
										$('#Consignee2').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#Consignee2').val(billContent).trigger("change")
										$("#inConsignee2").val(HtmlDecode(billContent))
									}
									if(where == 2 && typeId == 3) {
										$('#NotifyParty2').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#NotifyParty2').val(billContent).trigger("change")
										$("#inNotifyParty2").val(HtmlDecode(billContent))
									}
								} else {
									comModel("新增提单信息失败")
								}
							}, function(error) {
								console.log(parm)
							}, 1000)
						}
					}
				},
				"取消": {
					className: "btn-danger",
					callback: function() {
						$('#Shipper').val(HtmlEncode($("#inShipper").val())).trigger("change")
						$('#Consignee').val(HtmlEncode($("#inConsignee").val())).trigger("change")
						$('#NotifyParty').val(HtmlEncode($("#inNotifyParty").val())).trigger("change")
						$('#Shipper2').val(HtmlEncode($("#inShipper2").val())).trigger("change")
						$('#Consignee2').val(HtmlEncode($("#inConsignee2").val())).trigger("change")
						$('#NotifyParty2').val(HtmlEncode($("#inNotifyParty2").val())).trigger("change")
					}
				}
			}
		});
	}	


	//贸易条款
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
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
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
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
	
	//港口
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readport', {
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#port1').append(_html)
		}	
		//console.log(_data)
	}, function(error) {
		console.log(parm)
	}, 2000)
	$('#port2').html($('#port1').html())
	$('#port3').html($('#port1').html())
		
	//承运人
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readcarrier', {
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#carrier').append(_html)
		}
	    
		//	console.log(_data)
	}, function(error) {
		console.log(parm)
	}, 2000)
	
	//柜型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 4,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#20GP').append(_html)
			$('#40GP').append(_html)
			$('#40HQ').append(_html)
			$('#trailerNumUnit').append(_html)
		}
		$("#20GP").val("20'GP").trigger("change")
		$("#40GP").val("40'GP").trigger("change")
		$("#40HQ").val("40'HQ").trigger("change")
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
			$('#package').append(_html)
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
			$('#weight').append(_html)
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
			$('#volume').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
	//费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 17,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
			$('#feeType').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)	
	
	//费用单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#feeUnit').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)		
	
	//单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 18,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
			$('#numUnit').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)	
	
    $('#iscrm').on('click', function() {
    	if($("#iscrm").is(":checked")) {
    		$("#crmlist").removeClass('none')
    	}
    	else{ $("#crmlist").addClass('none') }
    })
    
    $('#isbill1').on('click', function() {
    	if($("#isbill1").is(":checked")) {
    		$("#bill1list").removeClass('none')
    	}
    	else{ $("#bill1list").addClass('none') }
    })
    
    $('#isbill2').on('click', function() {
    	if($("#isbill2").is(":checked")) {
    		$("#bill2list").removeClass('none')
    	}
    	else{ $("#bill2list").addClass('none') }
    })
        
    $('#iswarehouse').on('click', function() {
    	if($("#iswarehouse").is(":checked")) {
    		$("#warehouselist").removeClass('none')
    	}
    	else{ $("#warehouselist").addClass('none') }
    })
        
    $('#istrailer').on('click', function() {
    	if($("#istrailer").is(":checked")) {
    		$("#trailerlist").removeClass('none')
    	}
    	else{ $("#trailerlist").addClass('none') }
    })
    
    //获取系统信息
    if(action == 'add') {
    	common.ajax_req("get", false, dataUrl, "weiinfo.ashx?action=read", {
    		"companyId": companyID
    	}, function(data) {
    		//console.log(data)
    		if(data.State == 1) {
    			orderCode = data.Data.wein_preNum + getCode()
    		} else {
    			orderCode = getCode()
    		}
    	})
    }
    
    
    if(action == 'modify') {
    	$("#send2").hide();
    	$("#send3").hide();
    	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readbyid", {
    		"Id": Id
    	}, function(data) {
    		console.log(data.Data)
    		//初始化信息
    		var _data = data.Data
    		orderCode = _data.book_code
    		bookingType = _data.book_type
    		crmCompanyId = _data.book_crmCompanyId
    		crmContactId=_data.book_crmContactId
    		port1 = _data.book_port1
    		port2 = _data.book_port2
    		port3 = _data.book_port3
    		carrier = _data.book_carrier
    		$('#outCode').val(_data.book_outCode)
    		$("#crmuser").val(_data.book_crmCompanyId).trigger("change")
    		$("#crmcontact").val(_data.book_crmContactId).trigger("change")
    		$("#sellId").val(_data.book_sellId).trigger("change")
    		$("#luruId").val(_data.book_luruId).trigger("change")
    		$("#kefuId").val(_data.book_kefuId).trigger("change")
    		$("#caozuoId").val(_data.book_caozuoId).trigger("change")
    		$("#movementType").val(_data.book_movementType).trigger("change")
    		$("#incoterm").val(_data.book_incoterm).trigger("change")
    		$("#port1").val(_data.book_port1).trigger("change")
    		$("#port2").val(_data.book_port2).trigger("change")
    		$("#port3").val(_data.book_port3).trigger("change")
    		$('#route').val(_data.book_route)
    		$("#forwarder").val(_data.book_forwarder).trigger("change")
    		$("#carrier").val(_data.book_carrier).trigger("change")
    		$('#fromAddress').val(_data.book_fromAddress)
    		$('#toAddress').val(_data.book_toAddress)
    		$('#okTime').val(_data.book_okTime.substring(0, 10))
    		$('#okTrailerTime').val(_data.book_okTrailerTime.substring(0, 10))
    		$('#okBillTime').val(_data.book_okBillTime.substring(0, 10))
    		$('#okPortTime').val(_data.book_okPortTime.substring(0, 10))
    		$('#GP20').val(_data.book_20GP)
    		var _GP20 = _data.book_20GP.split('×')
    		$('#GP20').val(_GP20[0])
    		$('#20GP').val(_GP20[1]).trigger("change")
    		var _GP40 = _data.book_40GP.split('×')
    		$('#GP40').val(_GP40[0])
    		$('#40GP').val(_GP40[1]).trigger("change")
    		var _HQ40 = _data.book_40HQ.split('×')
    		$('#HQ40').val(_HQ40[0])
    		$('#40HQ').val(_HQ40[1]).trigger("change")
    		$('#packageMarks').html(HtmlDecode(_data.book_packageMarks))
    		$('#goodAbout').html(HtmlDecode(_data.book_goodAbout))
    		$('#beizhu').html(HtmlDecode(_data.book_beizhu))
    		var package0 = _data.book_package.split(' ')
    		$('#packageNum').val(package0[0])
    		$('#package').val(package0[1]).trigger("change")
    		var weight0 = _data.book_weight.split(' ')
    		$('#weightNum').val(weight0[0])
    		$('#weight').val(weight0[1]).trigger("change")
    		var volume0 = _data.book_volume.split(' ')
    		$('#volumeNum').val(volume0[0])
    		$('#volume').val(volume0[1]).trigger("change")
    		$('#inputConsignee').val(_data.book_consignee)
    		$('#inputContractNo').val(_data.book_contractNo)
    		$("#warehouse").val(_data.book_warehouse).trigger("change")
    		$('#warehouseAddress').val(_data.book_warehouseAddress)
    		$('#warehouseContact').val(_data.book_warehouseContact)
    		$('#warehouseContactWay').val(_data.book_warehouseContactWay)
    		$('#warehouseInCode').val(_data.book_warehouseInCode)
    		$('#warehouseInTime').val(_data.book_warehouseInTime.substring(0, 10))
    		$('#warehouseOutCode').val(_data.book_warehouseOutCode)
    		$('#warehouseOutTime').val(_data.book_warehouseOutTime.substring(0, 10))
    		$('#warehouseBeizhu').val(_data.book_warehouseBeizhu)
    		$("input[name='bill1Type'][value='" + _data.book_bill1Type + "']").attr("checked", true)
    		$('#inShipper').val(_data.book_bill1Shipper)
    		$('#Shipper').val(_data.book_bill1Shipper).trigger("change")
    		$('#inConsignee').val(_data.book_bill1Consignee)
    		$('#Consignee').val(_data.book_bill1Consignee).trigger("change")
    		$('#inNotifyParty').val(_data.book_bill1NotifyParty)
    		$('#NotifyParty').val(_data.book_bill1NotifyParty).trigger("change")
    		$("input[name='bill2Type'][value='" + _data.book_bill2Type + "']").attr("checked", true)
    		$('#inShipper2').val(_data.book_bill2Shipper)
    		$('#Shipper2').val(_data.book_bill2Shipper).trigger("change")
    		$('#inConsignee2').val(_data.book_bill2Consignee)
    		$('#Consignee2').val(_data.book_bill2Consignee).trigger("change")
    		$('#inNotifyParty2').val(_data.book_bill2NotifyParty)
    		$('#NotifyParty2').val(_data.book_bill2NotifyParty).trigger("change")
    	}, function(err) {
    		console.log(err)
    	}, 1000)
        
        //加载费用
    	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readfee", {
    		"bookingId": Id
    	}, function(data) {
    		//console.log(data.Data)
    		if(data.State == 1) {
    			var _data = data.Data;
    			for(var i = 0; i < _data.length; i++) {
    				var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
    				$("#feelist").append(feilist)
    			}
    			$('#send11').text("继续添加")
    		}
    	
    		/*删除*/
    		$('.deleteFee').on('click', function() {
    			console.log($(this).attr('artiid'))
    			$(this).parent('div').remove()
    			$.ajax({
    				url: dataUrl + 'ajax/booking.ashx?action=cancelfee',
    				data: {
    					"Id": $(this).attr('artiid')
    				},
    				dataType: "json",
    				type: "post",
    				success: function(backdata) {
    					if(backdata.State == 1) {
    						//oTable.fnReloadAjax(oTable.fnSettings());
    						//comModel("删除成功！")
    					} else {
    						alert("Delete Failed！");
    					}
    				},
    				error: function(error) {
    					console.log(error);
    				}
    			});
    		})
    	
    	}, function(err) {
    		console.log(err)
    	}, 2000)
    	
        //加载拖车报关
    	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readtrailer", {
    		"bookingId": Id
    	}, function(data) {
    		//console.log(data.Data)
    		if(data.State == 1) {
    			var _data = data.Data;
    			for(var i = 0; i < _data.length; i++) {
    				var trailerlist='<div style="margin: 5px 0px;">'+_data[i].comp_name+'&nbsp;&nbsp;&nbsp;&nbsp;地址：'+_data[i].botr_address+'&nbsp;&nbsp;&nbsp;&nbsp;联系人：'+_data[i].botr_contact+'&nbsp;&nbsp;&nbsp;&nbsp;联系方式：'+_data[i].botr_contactWay+'&nbsp;&nbsp;&nbsp;&nbsp;时间：'+_data[i].botr_time+'&nbsp;&nbsp;&nbsp;&nbsp;柜型：'+_data[i].botr_container+'&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteTrailer" artiid="' + _data[i].botr_id + '">删除</a></div>'
    				$("#trailerAll").append(trailerlist)
    			}
    			$('#addTrailer').text("继续添加")
    		}
    	
    		/*删除*/
    		$('.deleteTrailer').on('click', function() {
    			console.log($(this).attr('artiid'))
    			$(this).parent('div').remove()
    			$.ajax({
    				url: dataUrl + 'ajax/booking.ashx?action=canceltrailer',
    				data: {
    					"Id": $(this).attr('artiid')
    				},
    				dataType: "json",
    				type: "post",
    				success: function(backdata) {
    					if(backdata.State == 1) {
    						//oTable.fnReloadAjax(oTable.fnSettings());
    						//comModel("删除成功！")
    					} else {
    						alert("Delete Failed！");
    					}
    				},
    				error: function(error) {
    					console.log(error);
    				}
    			});
    		})
    	
    	}, function(err) {
    		console.log(err)
    	}, 2000)    	
    
    } else {
    	$("#okTime").val(getDate());
//  	$("#okTrailerTime").val(getDate());
//  	$("#okBillTime").val(getDate());
//  	$("#okPortTime").val(getDate());
    	$("#warehouseInTime").val(getDate());
    	$("#warehouseOutTime").val(getDate());
    	$("#trailerTime").val(getDate());
    }
	
    //获取客户信息
    common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=readbyid", {
    	"Id": crmCompanyId
    }, function(data) {
    	//初始化信息
    	var _data = data.Data
    	if(_data!=null){
    		console.log(orderCode)
    		if(_data.comp_type == 'OVERSEA AGENT') {
    			$('#title3').html('海外：' + _data.comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;订舱委托号：' + orderCode)
    			if(fromId == '1') {
    				$('#crm').addClass('none')
    				$('#luruId').addClass('none')
    				$('#kefuId').addClass('none')
    				$('#caozuoId').addClass('none')
    				$('#carrier3').addClass('none')
    				$('#carrier4').addClass('none')
    				$('#carrier5').addClass('none')
    				$('#warehouseDiv').addClass('none')
    				$('#trailerDiv').addClass('none')
    			}
    			bookingType = 5;
    		} else {
    			if(fromId == '1') {
    				$('#title3').html(_data.comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;订舱委托号：' + orderCode)
    				$('#crm').addClass('none')
    				$('#luruId').addClass('none')
    				$('#kefuId').addClass('none')
    				$('#caozuoId').addClass('none')
    				$('#crmhead').addClass('none')
    				$('#carrier1').addClass('none')
    				$('#carrier2').addClass('none')
    				$('#carrier3').addClass('none')
    				$('#carrier4').addClass('none')
    				$('#carrier5').addClass('none')
    				$('#warehouseDiv').addClass('none')
    				$('#trailerDiv').addClass('none')
//  				$('#bill1Div').addClass('none')
//  				$('#bill2Div').addClass('none')
    			}
    			bookingType = 4;
    		}
    	}
    
    }, function(err) {
    	console.log(err)
    }, 2000)
    
    if(action == 'modify') {
    	if(bookingType == 5) {
    		common.ajax_req("get", false, dataUrl, "booking.ashx?action=readsupplier", {
    			"bookingId": Id
    		}, function(data) {
    			console.log(bookingType)
    			if(data.State == 1) {
    				$("#crmlist").removeClass('none')
    				var _data = data.Data;
    				for(var i = 0; i < _data.length; i++) {
    					$("input[name='crmli'][value='" + _data[i].bosu_crmId + "']").attr("checked", true)
    				}
    			}
    
    		}, function(err) {
    			console.log(err)
    		}, 2000)
    	}
    }
	

	/*新增供应商*/
	$('#send22').on('click', function() {
			var companyName = $('#companyName').val()
			var contact = $('#contact').val()
			var phone = $('#phone').val()
			var email = $('#email').val()
			if(!email){
				comModel("请输入公司名称")
			}else if(!contact){
				comModel("请输入联系人")
			}else if(!phone){
				comModel("请输入联系电话")
			}else if(!email){
				comModel("请输入邮箱")				
			}else{
				common.ajax_req('POST', true, dataUrl, 'crmcompany.ashx?action=new', {
					'companyId': companyID,
					'userId': userID,
					'adminId': userID,
					'name': companyName,
					'isSupplier': 1,
					'type': 'FACTORY',
					'contactName': contact,
					'contactPhone': phone,
					'contactEmail': email,
					'upId': crmCompanyId
				}, function(data) {
					if(data.State == 1) {
						var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" checked="checked" value="' + data.Data + '"> ' + companyName + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：'+ contact + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：'+ phone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：'+ email + '</div>'
						$(".crmlist").append(crmlist)
						//comModel("新增成功")
				
					} else {
						comModel("新增失败")
					}
				}, function(error) {
					console.log(parm)
				}, 1000)
			}

	});

	/*新增拖车报关*/
	$('#addTrailer').on('click', function() {
			var trailer = $('#trailer').val()
			var trailerName = $('#trailer').find("option:selected").text()
			var trailerAddress = $('#trailerAddress').val()
			var trailerContact = $('#trailerContact').val()
			var trailerContactWay = $('#trailerContactWay').val()
			var trailerTime = $('#trailerTime').val()
			var trailerNumUnit = $('#trailerNumUnit').val()
			var trailerNum = $('#trailerNum').val()
			var newNumUnit = trailerNum+'*'+trailerNumUnit
			if(!trailer){
				comModel("请选择车行")
			}else if(!trailerAddress){
				comModel("请输入地址")
			}else{
				var trailerlist='<div style="margin: 5px 0px;">'+trailerName+'&nbsp;&nbsp;&nbsp;&nbsp;地址：'+trailerAddress+'&nbsp;&nbsp;&nbsp;&nbsp;联系人：'+trailerContact+'&nbsp;&nbsp;&nbsp;&nbsp;联系方式：'+trailerContactWay+'&nbsp;&nbsp;&nbsp;&nbsp;时间：'+trailerTime+'&nbsp;&nbsp;&nbsp;&nbsp;柜型：'+newNumUnit+'&nbsp;&nbsp;&nbsp;&nbsp;<a class="deletetrailer">删除</a></div>'
				$("#trailerAll").append(trailerlist)
				$('#addTrailer').text("继续添加")
				trailerData=trailerData+trailer+','+trailerAddress+','+trailerContact+','+trailerContactWay+','+trailerTime+','+newNumUnit+';'
				//console.log(trailerData)
				if(action == 'modify'){
					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfee', {
						'bookingId':Id,
						'crmId':trailer,
						'address':trailerAddress,
						'contact':trailerContact,
						'contactWay':trailerContactWay,
						'time':trailerTime,
						'container':newNumUnit
					}, function(data) {
						if(data.State == 1) {
							//console.log(parm)
							//comModel("新增费用成功")
					
						} else {
							comModel("新增费用失败")
						}
					}, function(error) {
						console.log(parm)
					}, 1000)
				}
			}
		
			/*删除*/
			$('.deletetrailer').on('click', function() {
				$(this).parent('div').remove()
			})

	});
	
	/*新增费用*/
	$('#send11').on('click', function() {
			var feeType = $('#feeType').val()
			var feeUnit = $('#feeUnit').val()
			var numUnit = $('#numUnit').val()
			var fee = $('#fee').val()
			var num = $('#num').val()
			var allFee = fee*num
			if(!fee){
				comModel("请输入价格")
			}else if(!num){
				comModel("请输入数量")
			}else{
				var feilist='<div style="margin: 5px 0px;">'+feeType+' ：'+fee+' * '+num+'('+numUnit+') = '+feeUnit+allFee+'&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee">删除</a></div>'
				$("#feelist").append(feilist)
				$('#send11').text("继续添加")
				feeData=feeData+feeType+','+feeUnit+','+fee+','+num+','+numUnit+','+allFee+';'
				//console.log(feeData)
				if(action == 'modify'){
					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfee', {
						'bookingId':Id,
						'feeType':feeType,
						'feeUnit':feeUnit,
						'numUnit':numUnit,
						'fee':fee,
						'num':num,
						'allFee':allFee
					}, function(data) {
						if(data.State == 1) {
							//console.log(parm)
							//comModel("新增费用成功")
					
						} else {
							comModel("新增费用失败")
						}
					}, function(error) {
						console.log(parm)
					}, 1000)
				}
			}
		
			/*删除*/
			$('.deleteFee').on('click', function() {
				$(this).parent('div').remove()
			})

	});
	
	
	/*下一步*/
	$('#send1,#send2,#send3').on('click', function() {   
		if($("#agreement").is(":checked")){
				var bt = $(this).attr("id");
				
				crmContactId = $('#crmcontact').val(),
				outCode = $('#outCode').val(),
				movementType = $('#movementType').val(),
				incoterm = $('#incoterm').val(),
				port1 = $('#port1').val(),
				port2 = $('#port2').val(),
				port3 = $('#port3').val(),
				route = $('#route').val(),

				fromAddress = $('#fromAddress').val(),
				toAddress = $('#toAddress').val(),
				okTime = $('#okTime').val(),
				okTrailerTime = $('#okTrailerTime').val(),
				okBillTime = $('#okBillTime').val(),
				okPortTime = $('#okPortTime').val(),
				packageNum = $('#packageNum').val(),
				weightNum = $('#weightNum').val(),
				volumeNum = $('#volumeNum').val(),
				package = packageNum + ' ' + $('#package').val(),
				weight = weightNum + ' ' + $('#weight').val(),
				volume = volumeNum + ' ' + $('#volume').val(),
				GP20 = $('#GP20').val(),
				SGP20=GP20 + '×' + $('#20GP').val()
				if(GP20!=''){
					allContainer=SGP20+';'
				}
				GP40 = $('#GP40').val(),
				SGP40=GP40 + '×' + $('#40GP').val()
				if(GP40!=''){
					allContainer=allContainer+SGP40+';'
				}				
				HQ40 = $('#HQ40').val(),
				SHQ40 = HQ40 + '×' + $('#40HQ').val()
				if(HQ40!=''){
					allContainer=allContainer+SHQ40+';'
				}	
				packageMarks = HtmlEncode($('#packageMarks').val()),
				goodAbout = HtmlEncode($('#goodAbout').val()),
				beizhu = HtmlEncode($('#beizhu').val());
				if(bt == "send2") {
					isTemplate=1;
				}else{
					isTemplate=0;
				}
				
				sellId=$('#sellId').val(),
				luruId=$('#luruId').val(),
				kefuId=$('#kefuId').val(),
				caozuoId=$('#caozuoId').val(),
				
				carrier = $('#carrier').val(),
				consignee = $('#inputConsignee').val()
				contractNo = $('#inputContractNo').val()
				
				forwarder = $('#forwarder').val()
				warehouse = $('#warehouse').val()
				warehouseAddress = $('#warehouseAddress').val()
				warehouseContact = $('#warehouseContact').val()
				warehouseContactWay = $('#warehouseContactWay').val()
				warehouseInCode = $('#warehouseInCode').val()
				warehouseInTime = $('#warehouseInTime').val()
				warehouseOutCode = $('#warehouseOutCode').val()
				warehouseOutTime = $('#warehouseOutTime').val()
				warehouseBeizhu = $('#warehouseBeizhu').val()
				bill1Type = $("input[name='bill1Type']:checked").val()
				bill1Shipper = HtmlEncode($('#inShipper').val())
				bill1Consignee = HtmlEncode($('#inConsignee').val())
				bill1NotifyParty = HtmlEncode($('#inNotifyParty').val())
				bill2Type = $("input[name='bill1Type2']:checked").val()
				bill2Shipper = HtmlEncode($('#inShipper2').val())
				bill2Consignee = HtmlEncode($('#inConsignee2').val())
				bill2NotifyParty = HtmlEncode($('#inNotifyParty2').val())
				
				var crmdata = [];
				$("input[name='crmli']:checked").each(function(index, item) {
					crmdata.push($(this).val());
				});
				var supplierData
				if(crmdata.toString()!=''){
					supplierData=crmdata.toString()
				}
				
			if(action == 'add') {
				if(!port1) {
					comModel("请输入起运港")
				} else if(!port2) {
					comModel("请输入目的港")		
				} else if(fromId=='0'&&crmCompanyId=='0') {
					comModel("请选择委托人")						
				} else {
					var parm = {
						'fromId' : fromId,
						'orderCode': orderCode,
						'code': orderCode,
						'outCode': outCode,
						'typeId': bookingType,
						'isTemplate': isTemplate,
						'companyId': companyID,
						'crmCompanyId': crmCompanyId,
						'crmContactId': crmContactId,
						'userId': userID,
						'movementType': movementType,
						'incoterm': incoterm,
						'port1': port1,
						'port2': port2,
						'port3': port3,
						'route': route,
						'fromAddress': fromAddress,
						'toAddress': toAddress,
						'okTime': okTime,
						'okTrailerTime': okTrailerTime,
						'okBillTime': okBillTime,
						'okPortTime': okPortTime,
						'package': package,
						'weight': weight,
						'volume': volume,
						'GP20': SGP20,
						'GP40': SGP40,
						'HQ40': SHQ40,
						'allContainer':allContainer,
						'packageMarks': packageMarks,
						'goodAbout': goodAbout,
						'beizhu': beizhu,
						'sellId': sellId,
						'luruId': luruId,
						'kefuId': kefuId,
						'caozuoId': caozuoId,
						'forwarder': forwarder,
						'warehouse': warehouse,
						'warehouseAddress': warehouseAddress,
						'warehouseContact': warehouseContact,
						'warehouseContactWay': warehouseContactWay,
						'warehouseInCode': warehouseInCode,
						'warehouseInTime': warehouseInTime,
						'warehouseOutCode': warehouseOutCode,
						'warehouseOutTime': warehouseOutTime,
						'warehouseBeizhu': warehouseBeizhu,
						'bill1Type': bill1Type,
						'bill1Shipper': bill1Shipper,
						'bill1Consignee': bill1Consignee,
						'bill1NotifyParty': bill1NotifyParty,
						'bill2Type': bill2Type,
						'bill2Shipper': bill2Shipper,
						'bill2Consignee': bill2Consignee,
						'bill2NotifyParty': bill2NotifyParty,						
						'trailerData': trailerData,
						'feeData': feeData,
						'carrier': carrier,
						'consignee': consignee,
						'contractNo': contractNo,
						'supplierData':supplierData
					}
			
					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=new', parm, function(data) {
						if(data.State == 1) {
							console.log(parm)
							if(bt == "send1"||bt == "send2") {
								comModel("新增订舱单成功")
								if(fromId=='1'){
									location.href = 'booking.html?fromId=1';
								}
								else{
									location.href = 'booking.html';
								}
								
							} else {
								comModel("继续新增订舱单")
								if(fromId=='1'){
									location.href = 'bookingadd.html?action=add&fromId=1&companyId=' + companyId;
								}
								else{
									location.href = 'bookingadd.html?action=add&companyId=' + companyId;
								}
								
							}
			
						} else {
							comModel("新增订舱单户失败")
						}
					}, function(error) {
						console.log(parm)
					}, 10000)
				}
			
			}
			
			if(action == 'modify') {
				if(!port1) {
					comModel("请输入起运港")
				} else if(!port2) {
					comModel("请输入目的港")
				} else {
					var parm = {
						'Id': Id,
						'userId': userID,
						'crmContactId': crmContactId,
						'outCode': outCode,
						'movementType': movementType,
						'incoterm': incoterm,
						'port1': port1,
						'port2': port2,
						'port3': port3,
						'route': route,						
						'fromAddress': fromAddress,
						'toAddress': toAddress,
						'okTime': okTime,
						'okTrailerTime': okTrailerTime,
						'okBillTime': okBillTime,
						'okPortTime': okPortTime,						
						'package': package,
						'weight': weight,
						'volume': volume,
						'GP20': SGP20,
						'GP40': SGP40,
						'HQ40': SHQ40,
						'allContainer':allContainer,
						'packageMarks': packageMarks,
						'goodAbout': goodAbout,
						'beizhu': beizhu,
						'sellId': sellId,
						'luruId': luruId,
						'kefuId': kefuId,
						'caozuoId': caozuoId,
						'forwarder': forwarder,
						'warehouse': warehouse,
						'warehouseAddress': warehouseAddress,
						'warehouseContact': warehouseContact,
						'warehouseContactWay': warehouseContactWay,
						'warehouseInCode': warehouseInCode,
						'warehouseInTime': warehouseInTime,
						'warehouseOutCode': warehouseOutCode,
						'warehouseOutTime': warehouseOutTime,
						'warehouseBeizhu': warehouseBeizhu,
						'bill1Type': bill1Type,
						'bill1Shipper': bill1Shipper,
						'bill1Consignee': bill1Consignee,
						'bill1NotifyParty': bill1NotifyParty,
						'bill2Type': bill2Type,
						'bill2Shipper': bill2Shipper,
						'bill2Consignee': bill2Consignee,
						'bill2NotifyParty': bill2NotifyParty,						
						'carrier': carrier,
						'consignee': consignee,
						'contractNo': contractNo,						
						'supplierData':supplierData
					}
			
					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=modify', parm, function(data) {
						if(data.State == 1) {
							comModel("修改成功")
							if(fromId == '1') {
								location.href = 'booking.html?fromId=1';
							} else {
								location.href = 'booking.html';
							}
						} else {
							comModel("修改失败")
						}
					}, function(error) {
						console.log(parm)
					}, 10000)
			
				}
			}
		}else{
			comModel("请阅读并同意条款！")
		}

	});
	

	
})



