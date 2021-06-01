//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "运价管理中心",   
            "con_top_3" : "新增运价", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Rates MANAGEMENT",   
            "con_top_3" : "Rate Add", 
        };

$(function(){
    hasPermission('1402'); //权限控制：新增运价
	$('.navli4').addClass("active open")	
	$('#title1').text(get_lan('con_top_3'))
	$('#title2').text(get_lan('con_top_3'))
	$('.rate4').addClass("active")
	
	
	var isTemplate,movementType, carrier, time1, time2, schedule, transit,_toCompany,_route;
    var otherData='';
    var _toCurrency = '';

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
	
	//币种添加 20190818 by daniel 不知道数据表里面是否有这个字段，但是这个字段要加进去的。
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 13,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length ; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#currency').append(_html)
			_toCurrency=_toCurrency+_html
		}
	}, function(error) {
		//console.log(parm)
	}, 1000)


    //结算公司
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
	            $('#toCompany').append(_html)
	            _toCompany=_toCompany+_html
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

	//运输方式
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 7,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < 3; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#movementType').append(_html)
		}
	}, function(error) {
		//console.log(parm)
	}, 1000)
	$("#movementType").change(function() {
		var opt = $("#movementType").val();
		containerList_len=$(".containerList").length
		if(containerList_len>1){
			for (var i=1; i<containerList_len; i++) {
				//alert(i);
				$("#addcontainer:last").remove()	
			}
		}
		
		if(opt=='FCL'){
			$(".carrier").removeClass('none')
			$(".20GP").text('20\'GP')
			$(".20GP").removeClass('none')
			$("#20GP").removeClass('none')
			$(".40GP").text('40\'GP')
			$(".40GP").removeClass('none')
			$("#40GP").removeClass('none')	
			$(".40HQ").text('40\'HQ')
			$(".40HQ").removeClass('none')
			$("#40HQ").removeClass('none')	
			$(".1000kgs").text('1000+kgs')
			$(".1000kgs").addClass('none')
			$("#1000kgs").addClass('none')	
			$("#addcontainer").remove()		
		}else if(opt=='LCL'){
			$(".carrier").addClass('none')
			$(".20GP").text('W/T')
			$(".20GP").removeClass('none')
			$("#20GP").removeClass('none')			
			$(".40GP").addClass('none')
			$("#40GP").addClass('none')	
			$(".40HQ").addClass('none')
			$("#40HQ").addClass('none')	
			$(".1000kgs").addClass('none')
			$("#1000kgs").addClass('none')	
			$("#addcontainer").remove()	
		}else if(opt=='AIR'){
			$(".carrier").removeClass('none')
			$(".20GP").text('45+kgs')
			$(".20GP").removeClass('none')
			$("#20GP").removeClass('none')
			$(".40GP").text('100+kgs')
			$(".40GP").removeClass('none')
			$("#40GP").removeClass('none')	
			$(".40HQ").text('500+kgs')
			$(".40HQ").removeClass('none')
			$("#40HQ").removeClass('none')	
			$(".1000kgs").text('1000+kgs')
			$(".1000kgs").removeClass('none')	
			$("#1000kgs").removeClass('none')
			$("#addcontainer").remove()		
		}
	})

	//港口	
	$("#port1,#port2").select2({
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
		tags: true, //允许手动添加
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
						"id": users[i]["puda_code"],
						"text": users[i]["puda_code"]+' / '+users[i]["puda_name_en"]
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
		allowClear: true, //允许清空
		selectOnClose: true, //自动选择最匹配的那个数据
		escapeMarkup: function(markup) {
			return markup;
		}, // 自定义格式化防止xss注入
		minimumInputLength: 1,
		formatResult: function formatRepo(repo) {
			return repo.text;
		}, // 函数用来渲染结果
		formatSelection: function formatRepoSelection(repo) {
			return repo.text;
		} // 函数用于呈现当前的选择
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

    //集装箱处理
    //var boxRow = $('.containerList').clone()
    $('.containerAll').delegate('.newContainer','click', function() {
    	//$(this).addClass('none')
    	//$(this).siblings('.removeContainer').removeClass('none')
    	//console.log(boxRow)
    	
    	var boxRow='';

		//containerAll_len=$('.newContainer').length;
		containerAll_len=$('.containerList').length;
		port1_new='port1_'+containerAll_len;
		port2_new='port2_'+containerAll_len;
		////下面的港口的ID都被改动过了，需要提交表单后，重新看如何入库。20190821 by daniel
    	if($("#movementType").val() == 'FCL') {
    		boxRow = '<div class="col-sm-12 margin-bottom-5 containerList" id="addcontainer"><select id="'+port1_new+'" class="margin-right-10 pol_select2" style="width:10%; float: left;"></select><select id="'+port2_new+'" class="margin-right-10 pod_select2" style="width:10%; float: left;"></select><select id="currency" class="margin-right-10" style="width:5%; float: left;"></select><input type="email" class="form-control margin-right-10" id="20GP" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="40GP" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="40HQ" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10 none" id="1000kgs" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="voyage" placeholder="" style="width:10%;float: left;"><input type="email" class="form-control margin-right-10" id="beizhu" placeholder="" style="width:15%;float: left;"><a class="newContainer btn btn-info"><i class="fa fa-plus-circle"></i></a> <a class="removeContainer btn btn-danger"><i class="fa fa-times-circle"></i></a></div>'
    	} else if($("#movementType").val() == 'LCL') {
    	    boxRow = '<div class="col-sm-12 margin-bottom-5 containerList" id="addcontainer"><select id="' + port1_new + '" class="margin-right-10 pol_select2" style="width:10%; float: left;"></select><select id="' + port2_new + '" class="margin-right-10 pod_select2" style="width:10%; float: left;"></select><select id="currency" class="margin-right-10" style="width:5%; float: left;"></select><input type="email" class="form-control margin-right-10" id="20GP" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10 none" id="40GP" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10 none" id="40HQ" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10 none" id="1000kgs" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="voyage" placeholder="" style="width:10%;float: left;"><input type="email" class="form-control margin-right-10" id="beizhu" placeholder="" style="width:15%;float: left;"><a class="newContainer btn btn-info"><i class="fa fa-plus-circle"></i></a> <a class="removeContainer btn btn-danger"><i class="fa fa-times-circle"></i></a></div>'
    	} else if($("#movementType").val() == 'AIR') {
    	    boxRow = '<div class="col-sm-12 margin-bottom-5 containerList" id="addcontainer"><select id="' + port1_new + '" class="margin-right-10 pol_select2" style="width:10%; float: left;"></select><select id="' + port2_new + '" class="margin-right-10 pod_select2" style="width:10%; float: left;"></select><select id="currency" class="margin-right-10" style="width:5%; float: left;"></select><input type="email" class="form-control margin-right-10" id="20GP" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="40GP" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="40HQ" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="1000kgs" placeholder="" style="width:5%;float: left;"><input type="email" class="form-control margin-right-10" id="voyage" placeholder="" style="width:10%;float: left;"><input type="email" class="form-control margin-right-10" id="beizhu" placeholder="" style="width:15%;float: left;"><a class="newContainer btn btn-info"><i class="fa fa-plus-circle"></i></a> <a class="removeContainer btn btn-danger"><i class="fa fa-times-circle"></i></a></div>'
    	}

		 $('.containerAll').append(boxRow)
		 $('.containerList:last').find('#currency').append(_toCurrency)
		//boxRow = boxRow.clone()
		
		$(this).parent('.containerList').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, by daniel 20190730
			$('.containerList:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

		$(this).parent('.containerList').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select, by daniel 20190730
			$('.containerList:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

    	//港口	
    	$("#"+port1_new+",#"+port2_new).select2({
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
    		tags: true, //允许手动添加
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

    	//$("#"+port1_new).val()
    	$(this).parent('.containerList').find(".pol_select2").each(function() { ///当克隆到新的港口的时候，复制现在的数据过去的input, by daniel 20190730
    		if($(this).val()){
    			$("#"+port1_new).html('<option value="' + $(this).val()  + '">' + $(this).val()  + '</option>').trigger("change")
    		}			
		})
    	$(this).parent('.containerList').find(".pod_select2").each(function() { ///当克隆到新的港口的时候，复制现在的数据过去的input, by daniel 20190730
    		if($(this).val()){
				$("#"+port2_new).html('<option value="' + $(this).val()  + '">' + $(this).val()  + '</option>').trigger("change")
			}
		})
    
    })
    $('.containerAll').delegate('.removeContainer','click', function() {
    	if($('.removeContainer').length>1){
    		$(this).parents('.containerList').remove()
    	}
    })
    
    //获取系统信息
//  if(action == 'add') {
//  	common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
//  		"companyId": companyID
//  	}, function(data) {
//  		//console.log(data)
//  		if(data.State == 1) {
//  			orderCode = data.Data.wein_preNum + getCode()
//  		} else {
//  			orderCode = getCode()
//  		}
//  		$('#title3').html('订舱委托号：' + orderCode)
//  	})
//  }
    
    

	
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
    
	
	/*下一步*/
	$('#send1,#send2').on('click', function() { 
		
		// containerAll_len=$('.newContainer').length;
		// port1_new='port1_'+containerAll_len;
		// port2_new='port2_'+containerAll_len;
		var containerAll_len=$('.containerList').length;
		for(var i = 0; i < containerAll_len; i++) {
			var _port1 = ''
			var _port2 = ''
			if(i==0){
				_port1 = $('.containerList').eq(i).find('#port1').val()
				_port2 = $('.containerList').eq(i).find('#port2').val()
			}else{
				// _port1 = $('.containerList').eq(i).find('#port3').val()
				// _port2 = $('.containerList').eq(i).find('#port4').val()		
				_port1 = $('.containerList').eq(i).find('#port1_'+i).val()
				_port2 = $('.containerList').eq(i).find('#port2_'+i).val()				
			}

			var _20GP = $('.containerList').eq(i).find('#20GP').val()
			var _40GP = $('.containerList').eq(i).find('#40GP').val()
			var _40HQ = $('.containerList').eq(i).find('#40HQ').val()
			var _1000kgs = $('.containerList').eq(i).find('#1000kgs').val()
			var _voyage = $('.containerList').eq(i).find('#voyage').val()
			var _currency = $('.containerList').eq(i).find('#currency').val()
			var _beizhu = $('.containerList').eq(i).find('#beizhu').val()
		
			var oneData = _port1 + ',' + _port2 + ',' + _20GP + ',' + _40GP + ',' + _40HQ + ',' + _1000kgs + ',' + _voyage + ',' + _currency + ',' + _beizhu + ';'
			otherData = otherData + oneData
		}
		console.log(otherData)
		
		var bt = $(this).attr("id");
		if(bt == "send2") {
			isTemplate = 1;
		} else {
			isTemplate = 0;
		}
		movementType = $('#movementType').val(),
		carrier = $('#carrier').val(),
		time1 = $('#time1').val(),
		time2 = $('#time2').val(),
		schedule = $('#schedule').val(),
		transit = $('#transit').val()
	    _toCompany = $('#toCompany').val(),
        _route = $('#svccode').val()

		var parm = {
			'isTemplate': isTemplate,
			'companyId': companyID,
			'userId': userID,
			'toCompany': _toCompany,
			'route': _route,
			'movementType': movementType,
			'carrier': carrier,
			'time1': time1,
			'time2': time2,
			'schedule': schedule,
			'transit': transit,
			'otherData': otherData
		}
		console.log(parm)
		common.ajax_req('POST', false, dataUrl, 'rate.ashx?action=new', parm, function(data) {
			if(data.State == 1) {
				comModel("新增运价成功")
				location.href = 'ratelist.html';
		
			} else {
				comModel("新增运价失败")
			}
		}, function(error) {
			console.log(parm)
		}, 10000)
		
	});
	

	
})



