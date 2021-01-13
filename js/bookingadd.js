//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "新增订舱单", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENTe",   
            "con_top_3" : "Booking Add", 
        };

$(function(){
	$('.navli33').addClass("active open")	
	this.title = get_lan('con_top_3')
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3'))
	$('.book22').addClass("active")
	
	$("#myModal").modal("show");
	
//	var crmCompanyId = '0';
//	if(GetQueryString('crmId')!=null){
//		crmCompanyId=GetQueryString('crmId')
//		_selectSupplier(crmCompanyId)
//		_selectBill(crmCompanyId)
//	}
	_selectSupplier(companyID)
	_selectBill(companyID)
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var isTemplate,movementType, incoterm, port1, port2, fromAddress, toAddress, okTime, packageNum=0, weightNum=0, volumeNum=0, package, weight, volume, GP20=0, GP40=0, HQ40=0, SGP20, SGP40, SHQ40, packageMarks, goodAbout, beizhu;
    var feeData='',trailerData='';
    var carrier,consignee,contractNo;
    var bookingType;
    //var crm='';
    var orderCode;
    var toId,sellId;
    var bill1Type,bill1Shipper,bill1Consignee,bill1NotifyParty,bill2Type,bill2Shipper,bill2Consignee,bill2NotifyParty;
	var allContainer='';
	var _toCompany='',_feeItem='',_feeUnit='',_numUnit='';
//	var coding = "";
//	for(var i = 0; i < 8; i++) {
//		coding += Math.floor(Math.random() * 10);
//	}	
	if(action == 'review') {
		$('#send1,#send2,#send3').addClass("none");
	}
	if(action == 'onemore') {
		//$('#send1,#send2,#send3').addClass("none");
	}

	//销售ID
	$("#toId").change(function() {
		$('#sellId').empty()
		var opt = $("#toId").val();
		//销售人员
		common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
		    'rolename': '销售',
			'companyId': opt
		}, function(data) {
			var _data = data.data;
			$('#sellId').append('<option value="0">请选择销售人员</option>')
			if(_data != null) {
				for(var i = 0; i < _data.length; i++) {
					var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
					$('#sellId').append(_html)
				}
			}
		}, function(error) {
			//console.log(parm)
		}, 1000);
		$('#toCompany').val($(this).val());   /////加了这个功能，当选择货代公司的时候，应付费用也变成这个名称的了。by daniel 20190731
	})

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
	
	//货代公司
	common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
		"customerId": companyID
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				var _html = '<option value="' + _data[i].comp_companyId + '">' + _data[i].userCompanyName  + '</option>';
				$('#toId').append(_html)
				$('#toCompany').append(_html)
				_toCompany=_toCompany+_html
			}
			if(_data.length==1){ //如果只有一条数据的时候，应该直接选择这条数据，不需要再次选择，下面的业务一样是这样的。by daniel 20190801
				$('#toId').val(_data[0].comp_companyId)
				$('#toCompany').val(_data[0].comp_companyId)
				var _compAdminId=_data[0].comp_adminId
				common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
					'role': 6,
					'companyId': _data[0].comp_companyId
				}, function(data) {
					var _data2 = data.data;
					if(_data2 != null) {
						for(var i = 0; i < _data2.length; i++) {
							var _html = '<option value="' + _data2[i].usin_id + '">' + _data2[i].usin_name + '</option>';
							$('#sellId').append(_html)
						}
						//alert(_compAdminId)
						//if(_data2.length==1){
							$('#sellId').val(_compAdminId)
						//}
					}
				}, function(error) {
					console.log(parm)
				}, 1000);
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)
	
	$("#GP20,#GP40,#HQ40").change(function() {
		switch($(this).attr("id")){
			case "GP20":
				$("#feeNum").val($(this).val());
				$("#numUnit").val()!=""?($("#numUnit").val($("#20GP").val())):"";
				break;
			case "GP40":
				$("#feeNum").val($(this).val());
				$("#numUnit").val()!=""?($("#numUnit").val($("#40GP").val())):"";
				break;
			case "HQ40":
				$("#feeNum").val($(this).val());
				$("#numUnit").val()!=""?($("#numUnit").val($("#40HQ").val())):"";
				break;
		}
	})

	function _selectSupplier(){
		//获取供应商列表
		common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
		    "companyId": companyID,
		    "isSupplier":1
		}, function(data) {
			//console.log(data)
			var _data = data.data;
			if(_data != null) {
				for(var i = 0; i < _data.length; i++) {
					//var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"> ' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].comp_contactName + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：' + _data[i].comp_contactPhone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：' + _data[i].comp_contactEmail + '</div>'
					var crmlist = '<tr class="margin-left-40"><td><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"></td><td> ' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;</td><td>联系人：' + _data[i].comp_contactName + '&nbsp;&nbsp;&nbsp;&nbsp;</td><td>联系电话：' + _data[i].comp_contactPhone + '&nbsp;&nbsp;&nbsp;&nbsp;</td><td>邮箱：' + _data[i].comp_contactEmail + '</td></tr>'
					$(".crmlist").append(crmlist)
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)
	}	

	function _selectBill(crmId){
		//SHIPPER
		common.ajax_req('GET', true, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 1,
			'actionId': companyID,
			'companyId': companyID
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
		common.ajax_req('GET', true, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 2,
			'actionId': companyID,
			'companyId': companyID
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
		common.ajax_req('GET', true, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 3,
			'actionId': companyID,
			'companyId': companyID
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
								'actionId': companyID,
								'companyId': companyID,
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


//	//贸易条款
//	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
//		'typeId': 3,
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
//			$('#incoterm').append(_html)
//		}
//	}, function(error) {
//		console.log(parm)
//	}, 1000)
	
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
		//console.log(parm)
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
	$("#port1,#port2").select2({
		ajax: {
			url: dataUrl+"ajax/publicdata.ashx?action=readport&companyId="+companyID,
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
		tags: true, //允许手动添加
		selectOnClose: true, //自动选择最匹配的那个数据
		//allowClear: true, //允许清空
		//minimumResultsForSearch: 1,
		//minimumInputLength: 3,

		escapeMarkup: function(markup) {
			return markup;
		}, // 自定义格式化防止xss注入
		formatResult: function formatRepo(repo) {
			return repo.text;
		}, // 函数用来渲染结果
		formatSelection: function formatRepoSelection(repo) {
			return repo.text;
		} // 函数用于呈现当前的选择
	});
	$('#port1').on("select2:select", function(e) { 
    	$("#fromAddress").val($("#port1").select2("val"))
	});
	$('#port2').on("select2:select", function(e) { 
    	$("#toAddress").val($("#port2").select2("val"))
	});
//	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readport', {
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
//			$('#port1').append(_html)
//		}	
//		//console.log(_data)
//	}, function(error) {
//		console.log(parm)
//	}, 2000)
//	$('#port2').html($('#port1').html())	
		
	//承运人
	$("#carrier").select2({
		ajax: {
			url: dataUrl+"ajax/publicdata.ashx?action=readcarrier&companyId="+companyID,
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
						"text": (users[i]["puda_name_en"])
					};
					//var option = [{id:users[i]["puda_name_en"],text:users[i]["puda_name_en"]},{id:users[i]["puda_name_cn"],text:users[i]["puda_name_cn"]}]
					
					options.push(option);
				};
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
		//autoFocus: true, 
		selectOnClose: true, //自动选择最匹配的那个数据
		//tags: true, //允许手动添加
		//allowClear: true, //允许清空
		escapeMarkup: function(markup) {
			return markup;
		}, // 自定义格式化防止xss注入
		minimumInputLength: 2,
		formatResult: function formatRepo(repo) {
			return repo.text;
		}, // 函数用来渲染结果
		formatSelection: function formatRepoSelection(repo) {
			return repo.text;
		} ,// 函数用于呈现当前的选择
		noResults: function (params) {
			alert("ddd");
             return "params";
         },

	});	
	$('#carrier').on("select2:select", function(e) {   //  只有当船司被选择的时候，才会出现那个截关日期以及开船日期，这里面如果是从价格那边转过来，也应该是直接显示的。by daniel 20190802
    	$("#etdTime_div,#cyTime_div").removeClass("none")
	});
//	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readcarrier', {
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
//			$('#carrier').append(_html)
//		}
//	    
//		//	console.log(_data)
//	}, function(error) {
//		console.log(parm)
//	}, 2000)
	
	//柜型	
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 4,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#20GP').append(_html)
			$('#40GP').append(_html)
			$('#40HQ').append(_html)						
		}
		$("#20GP").val("20'GP").trigger("change")
		$("#40GP").val("40'GP").trigger("change")
		$("#40HQ").val("40'HQ").trigger("change")
	}, function(error) {
		console.log(parm)
	}, 1000)
	
	//包装单位
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
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
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
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
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
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
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
			$('#feeItem').append(_html)
			_feeItem=_feeItem+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
		
	//币种
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#feeUnit').append(_html)
			_feeUnit=_feeUnit+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)		
	
	//单位
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readunit', {
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#numUnit').append(_html)
			_numUnit=_numUnit+_html
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
    $('#iscrm').on('click', function() {
    	if($("#iscrm").is(":checked")) {
    		$("#crmlist").removeClass('none');
    		$("#carrier1").removeClass('none');
    	}
    	else{ $("#crmlist").addClass('none');
    		$("#carrier1").addClass('none') }
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

    $('#isfee').on('click', function() {
    	if($("#isfee").is(":checked")) {
    		$("#isfeeList").removeClass('none');
    	}
    	else{ 
    		$("#isfeeList").addClass('none') 
    	}
    })

    
    
    
    //if(action == 'modify') {
    if(Id) {
    	if(action == 'modify') {
	    	$("#send2").hide();
	    	$("#send3").hide();
	    }
    	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
    		"Id": Id
    	}, function(data) {
    		console.log(data.Data)
    		//初始化信息
    		var _data = data.Data
			//((_data.book_state!=1)?($("[name='tipsNoedit']").removeClass("none")):"");
			stateId = _data.book_orderState
			var stateList=$('#shipmentMilestone li')
			$.each(stateList,function(i,item){
				if((i+12)<=stateId){
					//item.addClass('btn-blue')
					$('#shipmentMilestone li').eq(i).addClass('active')
				}
			})
    		orderCode = _data.book_code
    		bookingType = _data.book_type
    		crmCompanyId = _data.book_crmCompanyId
    		port1 = _data.book_port1
    		port2 = _data.book_port2
    		carrier = _data.book_carrier
    		$('#outCode').val(_data.book_outCode)
    		$("#toId").val(_data.book_crmCompanyId).trigger("change")
	  		$("#sellId").val(_data.book_sellId).trigger("change")
    		$("#movementType").val(_data.book_movementType).trigger("change")
    		//$("#incoterm").val(_data.book_incoterm).trigger("change")
			$('#port1').html('<option value="' + _data.book_port1 + '">' + _data.book_port1 + '</option>').trigger("change")
    		//$("#port1").val(_data.book_port1).trigger("change")
    		$('#port2').html('<option value="' + _data.book_port2 + '">' + _data.book_port2 + '</option>').trigger("change")
    		$('#carrier').html('<option value="' + _data.book_carrier + '">' + _data.book_carrier + '</option>').trigger("change");
    		(_data.book_carrier?($("#etdTime_div,#cyTime_div").removeClass("none")):""); // 添加如果carrier有数据，那么cy etd 的就显示 by daniel 20190803
    		//((_data.state_name_cn!="未处理")?($("[name='tipsNoedit']").removeClass("none")):""); //想添加当数据已经不是“未处理”了，那么就不能编辑了，仅能查看。by daniel 20190803
    		$('#fromAddress').val(_data.book_fromAddress)
    		$('#toAddress').val(_data.book_toAddress)
    		$('#okTime').val(_data.book_okTime.substring(0, 10))
    		//$('#GP20').val(_data.book_20GP);
    		var _GP20 = _data.book_20GP.split('×');
    		$('#GP20').val(_GP20[0]);
    		$('#20GP').val(_GP20[1]).trigger("change");
    		var _GP40 = _data.book_40GP.split('×');
    		$('#GP40').val(_GP40[0]);
    		$('#40GP').val(_GP40[1]).trigger("change");
    		var _HQ40 = _data.book_40HQ.split('×');
    		$('#HQ40').val(_HQ40[0]);
    		$('#40HQ').val(_HQ40[1]).trigger("change");
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
    		$("input[name='bill1Type'][value='" + _data.book_bill1Type + "']").attr("checked", true)
    		$('#Shipper').val(_data.book_bill1Shipper).trigger("change")
    		$('#inShipper').val(HtmlDecode(_data.book_bill1Shipper))
    		$('#Consignee').val(_data.book_bill1Consignee).trigger("change")
    		$('#inConsignee').val(HtmlDecode(_data.book_bill1Consignee))
    		$('#NotifyParty').val(_data.book_bill1NotifyParty).trigger("change")
    		$('#inNotifyParty').val(HtmlDecode(_data.book_bill1NotifyParty))
    		$("input[name='bill2Type'][value='" + _data.book_bill2Type + "']").attr("checked", true)
    		$('#inShipper2').val(HtmlDecode(_data.book_bill2Shipper))
    		$('#Shipper2').val(_data.book_bill2Shipper).trigger("change")
    		$('#inConsignee2').val(HtmlDecode(_data.book_bill2Consignee))
    		$('#Consignee2').val(_data.book_bill2Consignee).trigger("change")
    		$('#inNotifyParty2').val(HtmlDecode(_data.book_bill2NotifyParty))
    		$('#NotifyParty2').val(_data.book_bill2NotifyParty).trigger("change")
    		
    	}, function(err) {
    		console.log(err)
    	}, 1000)
		
    	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readsupplier", {
    		"bookingId": Id
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
        
        //加载费用
    	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfee", {
    		"bookingId": Id
    	}, function(data) {
    		console.log(data.Data)
    		if(data.State == 1) {
    			$(".feeAll").empty()
    			$("#isfeeList").removeClass('none')
    			$("#isfee").prop("checked",true);
    			var _data = data.Data;
    			for(var i = 0; i < _data.length; i++) {
    				//var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
    				var feilist = '<div class="col-sm-12 feeList">'+
    				'<select id="feeType" disabled="disabled" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:6%; float: left;"><option value="应收">应收</option><option value="应付" selected="selected">应付</option></select>'+
    				'<select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:15%;float: left;"></select>'+
    				'<select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"></select>'+
    				'<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"></select>'+
    				'<input type="email" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + _data[i].bofe_fee + '" style="width:10%;float: left;">'+
    				'<input type="email" class="form-control margin-right-5" id="feeNum" placeholder="" value="' + _data[i].bofe_num + '" style="width:5%;float: left;">'+
    				'<select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"></select>'+
    				'<input type="email" class="form-control margin-right-5" id="feeBeizhu" value="' + _data[i].bofe_beizhu + '" placeholder="" style="width:10%;float: left;">'+
    				//'<button type="submit" class="newFee btn btn-blue margin-right-5" style="width:3%;float: left;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:3%;float: left;">-</button>'
    				'<a class="newFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                    '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'
    				$(".feeAll").append(feilist)
    				
    				$('#feeType').val(_data[i].bofe_feeType).trigger("change")
    				$('.feeList').eq(i).find('#toCompany').html(_toCompany)	
    				$('.feeList').eq(i).find('#toCompany').val(_data[i].bofe_toCompany).trigger("change")
    				$('.feeList').eq(i).find('#feeItem').html(_feeItem)	
    				$('.feeList').eq(i).find('#feeItem').val(_data[i].bofe_feeItem).trigger("change")
    				$('.feeList').eq(i).find('#feeUnit').html(_feeUnit)	
    				$('.feeList').eq(i).find('#feeUnit').val(_data[i].bofe_feeUnit).trigger("change")
    				$('.feeList').eq(i).find('#numUnit').html(_numUnit)	
    				$('.feeList').eq(i).find('#numUnit').val(_data[i].bofe_numUnit).trigger("change")
    			}
    		}
    	
    	}, function(err) {
    		console.log(err)
    	}, 2000)
    	   	
    
    } else {
    	$("#okTime").val(getDate());
//  	$("#okTilerTime").val(getDate());
//  	$("#okBillTime").val(getDate());
//  	$("#okPortTime").val(getDate());
    }
	
//  //获取客户信息
//  common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=readbyid", {
//  	"Id": crmCompanyId
//  }, function(data) {
//  	//初始化信息
//  	var _data = data.Data
//  	if(_data!=null){
//  		console.log(orderCode)
////  		if(_data.comp_type == 'OVERSEA AGENT') {
////  			$('#title3').html('海外：' + _data.comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;订舱委托号：' + orderCode)
////  			bookingType = 5;
////  		} else {
////  			$('#title3').html(_data.comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;订舱委托号：' + orderCode)
////  			$('#crmhead').addClass('none')
////  			$('#carrier1').addClass('none')
////  			$('#carrier2').addClass('none')
////  			bookingType = 4;
////  		}
//			$('#title3').html(_data.comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;订舱委托号：' + orderCode)
//  	}
//  
//  }, function(err) {
//  	console.log(err)
//  }, 2000)
    
//  if(action == 'modify') {
//  	if(bookingType == 5) {
//  		common.ajax_req("get", false, dataUrl, "booking.ashx?action=readsupplier", {
//  			"bookingId": Id
//  		}, function(data) {
//  			console.log(bookingType)
//  			if(data.State == 1) {
//  				$("#crmlist").removeClass('none')
//  				var _data = data.Data;
//  				for(var i = 0; i < _data.length; i++) {
//  					$("input[name='crmli'][value='" + _data[i].bosu_crmId + "']").attr("checked", true)
//  				}
//  			}
//  
//  		}, function(err) {
//  			console.log(err)
//  		}, 2000)
//  	}
//  }
	

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
					'upId': companyID
				}, function(data) {
					if(data.State == 1) {
						//var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" checked="checked" value="' + data.Data + '"> ' + companyName + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：'+ contact + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：'+ phone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：'+ email + '</div>'
						
						var crmlist = '<tr class="margin-left-40"><td><input type="checkbox" name="crmli" checked="checked" value="' + data.Data + '"> </td><td>' + companyName + '&nbsp;&nbsp;&nbsp;&nbsp;</td><td>联系人：'+ contact + '&nbsp;&nbsp;&nbsp;&nbsp;</td><td>联系电话：'+ phone + '&nbsp;&nbsp;&nbsp;&nbsp;</td><td>邮箱：'+ email + '<td></tr>'
						$(".crmlist").append(crmlist)
						//comModel("新增成功")
				
					} else {
						comModel("新增失败")
					}
				}, function(error) {
					console.log(parm)
				}, 1000)
			}
			$("#addNewSuppliers").find("input").each(function() { ///当添加了新的供应商后，清空input, by daniel 20190730
				$(this).val("")
			})

	});
	
//	/*新增费用*/
//	$('#send11').on('click', function() {
//			var feeType = $('#feeType').val()
//			var feeUnit = $('#feeUnit').val()
//			var numUnit = $('#numUnit').val()
//			var fee = $('#fee').val()
//			var num = $('#num').val()
//			var allFee = fee*num
//			if(!fee){
//				comModel("请输入价格")
//			}else if(!num){
//				comModel("请输入数量")
//			}else{
//				var feilist='<div style="margin: 5px 0px;">'+feeType+' ：'+fee+' * '+num+'('+numUnit+') = '+feeUnit+allFee+'&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee">删除</a></div>'
//				$("#feelist").append(feilist)
//				$('#send11').text("继续添加")
//				feeData=feeData+feeType+','+feeUnit+','+fee+','+num+','+numUnit+','+allFee+';'
//				//console.log(feeData)
//				if(action == 'modify'){
//					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfee', {
//						'bookingId':Id,
//						'feeType':feeType,
//						'feeUnit':feeUnit,
//						'numUnit':numUnit,
//						'fee':fee,
//						'num':num,
//						'allFee':allFee
//					}, function(data) {
//						if(data.State == 1) {
//							//console.log(parm)
//							//comModel("新增费用成功")
//					
//						} else {
//							comModel("新增费用失败")
//						}
//					}, function(error) {
//						console.log(parm)
//					}, 1000)
//				}
//			}
//		
//			/*删除*/
//			$('.deleteFee').on('click', function() {
//				$(this).parent('div').remove()
//			})
//
//	});


	$('.feeAll').delegate('.newFee', 'click', function() {
		//$(this).addClass('none')
		//$(this).siblings('.removeContainer').removeClass('none')
		//var feeboxRow = '<div class="col-sm-12 feeList" id="addfee"><select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:6%; float: left;"><option value="应收">应收</option><option value="应付">应付</option></select><select id="toCompany0" class="no-padding-left no-padding-right margin-right-5" style="width:15%;float: left;"><option value="请选择">请选择</option></select><select id="feeItem0" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"><option value="请选择">请选择</option></select><select id="feeUnit0" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"><option value="请选择">请选择</option></select><input type="email" class="form-control margin-right-5" id="feePrice" placeholder="" style="width:10%;float: left;"><input type="email" class="form-control margin-right-5" id="feeNum" placeholder="" style="width:5%;float: left;"><select id="numUnit0" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"><option value="请选择">请选择</option></select><input type="email" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:10%;float: left;"><button type="submit" class="newFee btn btn-blue margin-right-5" style="width:3%;float: left;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:3%;float: left;">-</button></div>'
		var feeboxRow = $('#feeAll_add').html()
		$('.feeAll').append(feeboxRow)
		//feeboxRow = feeboxRow.clone()

		//货代公司
		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
		$('.feeList:last').find('#toCompany0').append(_toCompany)
//		
//		//费用类型
		$('.feeList:last').find('#feeItem0').append(_feeItem)
//		
//		//币种
		$('.feeList:last').find('#feeUnit0').append(_feeUnit)
//		
//		//单位
		$('.feeList:last').find('#numUnit0').append(_numUnit)

		$(this).parents('.feeList').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, by daniel 20190730
			$('.feeList:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})
		$(this).parents('.feeList').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select, by daniel 20190730
			$('.feeList:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})
		
	})
	$('.feeAll').delegate('.removeFee', 'click', function() {
		if($('.removeFee').length>1 && $(this).parents('.feeList').index()!=0){
			$(this).parents('.feeList').remove()
		}
	})
	
	
	/*下一步*/
	$('#send1,#send2,#send3').on('click', function() {   
		if($("#agreement").is(":checked")){
				var bt = $(this).attr("id");
				toId=$('#toId').val(),
				sellId=$('#sellId').val(),
								
				crmContactId = $('#crmcontact').val(),
				outCode = $('#outCode').val(),
				movementType = $('#movementType').val(),
				//incoterm = $('#incoterm').val(),
				port1 = $('#port1').val(),
				port2 = $('#port2').val(),

				fromAddress = $('#fromAddress').val(),
				toAddress = $('#toAddress').val(),
				okTime = $('#okTime').val(),
				packageNum = $('#packageNum').val(),
				weightNum = $('#weightNum').val(),
				volumeNum = $('#volumeNum').val(),
				package = packageNum + ' ' + $('#package').val(),
				weight = weightNum + ' ' + $('#weight').val(),
				volume = volumeNum + ' ' + $('#volume').val(),
				GP20 = $('#GP20').val(),
				SGP20=GP20 + '×' + $('#20GP').val()
				if(GP20!=''||GP20!=0){
					allContainer=SGP20+';'
				}
				GP40 = $('#GP40').val(),
				SGP40=GP40 + '×' + $('#40GP').val()
				if(GP40!=''||GP40!=0){
					allContainer=allContainer+SGP40+';'
				}				
				HQ40 = $('#HQ40').val(),
				SHQ40 = HQ40 + '×' + $('#40HQ').val()
				if(HQ40!=''||HQ40!=0){
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
				
				carrier = $('#carrier').val(),
				consignee = $('#inputConsignee').val()
				contractNo = $('#inputContractNo').val()

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
				
				for(var i = 0; i < $('.feeList').length; i++) {
					var toCompany = ''
					var feeItem = ''
					var feeUnit = ''
					var numUnit = ''
					//if(action == 'add') {
						//if(i == 0) {
							toCompany = $('.feeList').eq(i).find('#toCompany').val()
							feeItem = $('.feeList').eq(i).find('#feeItem').val()
							feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
							numUnit = $('.feeList').eq(i).find('#numUnit').val()
						// } else {
						// 	toCompany = $('.feeList').eq(i).find('#toCompany0').val()
						// 	feeItem = $('.feeList').eq(i).find('#feeItem0').val()
						// 	feeUnit = $('.feeList').eq(i).find('#feeUnit0').val()
						// 	numUnit = $('.feeList').eq(i).find('#numUnit0').val()
						//}
					//}
					//if(action == 'modify') {
					//if(Id) {
							// toCompany = $('.feeList').eq(i).find('#toCompany').val()
							// feeItem = $('.feeList').eq(i).find('#feeItem').val()
							// feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
							// numUnit = $('.feeList').eq(i).find('#numUnit').val()
					//}
					var feeType = $('.feeList').eq(i).find('#feeType').val()
					var feeNum = $('.feeList').eq(i).find('#feeNum').val()
					var feePrice= $('.feeList').eq(i).find('#feePrice').val()
					var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()
				
					var feeoneData = feeType + ',' + toCompany + ',' + feeItem + ',' + feeUnit + ',' + feeNum + ',' + feePrice + ',' + numUnit + ',' + feeBeizhu + ';'
					feeData = feeData + feeoneData
				}
				console.log(feeData)
				//feeboxRow = feeboxRow.clone()
				
			if(action == 'add') {
				if(toId==0) {
					comModel("请选择货代公司")				
				}else if(!port1) {
					comModel("请输入起运港")
				} else if(!port2) {
					comModel("请输入目的港")						
				} else {
				    var parm = {
				        'whichId': 3, //1=联系单，2=订单，3=订舱单
						'fromId' : 1,
						'orderCode': '',
						'code': orderCode,
						'outCode': outCode,
						'typeId': 0,
						'isTemplate': isTemplate,
						'companyId': companyID,
						'crmCompanyId': toId,
						'crmContactId': 0,
						'userId': userID,
						'userName': userName,
						'movementType': movementType,
						'incoterm': '',
						'port1': port1,
						'port2': port2,
						'port3': '',
						'route': '',
						'fromAddress': fromAddress,
						'toAddress': toAddress,
						'okTime': okTime,
						'okTrailerTime': '',
						'okBillTime': '',
						'okPortTime': '',
						'truePortTime': '',
						'truePortTime2': '',
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
						'luruId': 0,
						'kefuId': 0,
						'caozuoId': 0,
						'forwarder': 0,
						'warehouse': 0,
						'warehouseAddress': '',
						'warehouseContact': '',
						'warehouseContactWay': '',
						'warehouseInCode': '',
						'warehouseInTime': '',
						'warehouseOutCode': '',
						'warehouseOutTime': '',
						'warehouseBeizhu': '',
						'bill1Type': bill1Type,
						'bill1Shipper': bill1Shipper,
						'bill1Consignee': bill1Consignee,
						'bill1NotifyParty': bill1NotifyParty,
						'bill2Type': bill2Type,
						'bill2Shipper': bill2Shipper,
						'bill2Consignee': bill2Consignee,
						'bill2NotifyParty': bill2NotifyParty,						
						'trailerData': '',
						'feeData': (($("#isfee").is(":checked"))?feeData:''), //如果没有点开费用表，那么费用就不用更新。
						'carrier': carrier,
						'consignee': consignee,
						'contractNo': contractNo,
						'supplierData':supplierData
					}
					console.log(parm)
					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=new', parm, function(data) {
						if(data.State == 1) {
							if(bt == "send1"||bt == "send2") {
								comModel("新增订舱单成功")
								location.href = 'bookinglist.html';								
							} else {
								comModel("继续新增订舱单")
								location.href = 'bookingadd.html?action=add';
							}
			
						} else {
							comModel("新增订舱单失败")
						}
					}, function(error) {
						console.log(parm)
					}, 10000)
				}
			
			}
			
			if(action == 'modify') {
				if(toId==0) {
					comModel("请选择货代公司")				
				}else if(!port1) {
					comModel("请输入起运港")
				} else if(!port2) {
					comModel("请输入目的港")
				} else {
				    var parm = {
				        'whichId': 3, //1=联系单，2=订单，3=订舱单
						'Id': Id,
						'userId': userID,
						'userName': userName,
//						'crmContactId': crmContactId,
						'outCode': outCode,
						'movementType': movementType,
//						'incoterm': incoterm,
						'port1': port1,
						'port2': port2,
//						'port3': port3,
//						'route': route,						
						'fromAddress': fromAddress,
						'toAddress': toAddress,
						'okTime': okTime,
//						'okTrailerTime': okTrailerTime,
//						'okBillTime': okBillTime,
//						'okPortTime': okPortTime,						
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
//						'luruId': luruId,
//						'kefuId': kefuId,
//						'caozuoId': caozuoId,
//						'forwarder': forwarder,
//						'warehouse': warehouse,
//						'warehouseAddress': warehouseAddress,
//						'warehouseContact': warehouseContact,
//						'warehouseContactWay': warehouseContactWay,
//						'warehouseInCode': warehouseInCode,
//						'warehouseInTime': warehouseInTime,
//						'warehouseOutCode': warehouseOutCode,
//						'warehouseOutTime': warehouseOutTime,
//						'warehouseBeizhu': warehouseBeizhu,
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
						'feeData': (($("#isfee").is(":checked"))?feeData:''), //如果没有点开费用表，那么费用就不用更新。
						'supplierData':supplierData
					}
			
					common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=modify', parm, function(data) {
						if(data.State == 1) {
							comModel("修改成功")
							location.href = 'bookinglist.html';
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
	
    //获取系统信息
    if(action == 'add') {
    	common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
    		"companyId": companyID
    	}, function(data) {
    		//console.log(data)
    		if(data.State == 1) {
    			orderCode = data.Data.wein_preNum + getCode()
    		} else {
    			orderCode = getCode()
    		}
    		$('#title3').html('订舱委托号：' + orderCode)
    	})
    }

	
})



