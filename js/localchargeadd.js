//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Financial MANAGEMENT",        
        };

$(function(){
	this.title = get_lan('nav_4_2') 	
	$('.navli4').addClass("active open")
	$('.rate2').addClass("active")	
	$('#title1').text(get_lan('nav_4_2'))
	$('#title2').text(get_lan('nav_4_2')) 

	//如果是添加当地费用的时候，用这个来做船司的默认值即可 20190823 by daniel
	$('#carrier').html('<option value="All Carriers">All Carriers</option>')
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');

	var _toCompany, _carrier, _port1, _routes, _from, _useTime1, _useTime2, _type, _remark;
	var _toCompany = '', _feeItem = '', _feeUnit = '', _feeType = ''
	//var AccountName, AccountPw;

	$("#port1").select2({
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
	
	//承运人
	$("#carrier").select2({
		ajax: {
			url: dataUrl + "ajax/publicdata.ashx?action=readcarrier&companyId=" + companyID,
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
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)
	
	////单位
	//common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readunit', {
	//	'companyId': companyID
	//}, function(data) {
	//	var _data = data.data;
	//	for(var i = 0; i < _data.length; i++) {
	//		var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
	//		$('#feeUnit').append(_html)
	//	}
	//}, function(error) {
	//	console.log(parm)
	//}, 1000)
	
    //费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
	    'typeId': 6,
	    'companyId': companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    for (var i = 0; i < _data.length; i++) {
	        var _html = '<option value="' + _data[i].puda_name_cn + ' / ' + _data[i].puda_name_en + '">' + _data[i].puda_name_cn + ' / ' + _data[i].puda_name_en + '</option>';
	        $('#feeType').append(_html)
	        _feeType = _feeType + _html
	    }
	}, function (error) {
	}, 1000)

    //币种
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
	    'typeId': 13,
	    'companyId': companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    for (var i = 0; i < _data.length; i++) {
	        var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
	        $('#feeUnit').append(_html)
	        _feeUnit = _feeUnit + _html
	    }
	}, function (error) {
	    console.log(parm)
	}, 1000)


    //费用项目
	//var feeboxRow = $('.feeList').clone()
	$('.feeAll').delegate('.addFee', 'click', function () {
		var feeboxRow='';
	    var feeboxRow = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:60px; float: left;"></label><select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:300px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="0" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:200px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> <a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a></label></div>'
	    //$('.feeAll').append(feeboxRow)
	    $('.feeAll').append(feeboxRow)
	    //feeboxRow = feeboxRow.clone()
	    $('.feeList:last').find('#feeType').append(_feeType)
	    $('.feeList:last').find('#feeUnit').append(_feeUnit)
		$(this).parents('.feeList').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, 这里区分之前的一些不一样的是，这里用i的图标后，parent不能用，要用parents了。 by daniel 20190730

			$('.feeList:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

		$(this).parents('.feeList').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select,这里区分之前的一些不一样的是，这里用i的图标后，parent不能用，要用parents了。 by daniel 20190730
			$('.feeList:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

	})
	$('.feeAll').delegate('.removeFee', 'click', function () {
		if($('.removeFee').length>1 && $(this).parents('.feeList').index()!=0){
	    	$(this).parents('.feeList').remove()
		}
	})
	
	if(action == 'modify') {	
	    $("#saveAsNew").addClass('none');
		common.ajax_req("get", false, dataUrl, "localcharge.ashx?action=readbyid", {
			"Id": Id
		}, function(data) {
			console.log(data.Data)
			//初始化信息
			var _data = data.Data
			$('#carrier').html('<option value="' + _data.loch_carrier + '">' + _data.loch_carrier + '</option>').trigger("change")
			$('#port1').html('<option value="' + _data.loch_port1 + '">' + _data.loch_port1 + '</option>').trigger("change")
			$('#toCompany').val(_data.loch_toCompany).trigger("change")
			$('#inputRoutes').val(_data.loch_routes)
			$('#remark').val(_data.loch_remark)
			$('#from').val(_data.loch_from).trigger("change")
			$('#id-date-picker-1').val(_data.loch_useTime1.substring(0, 10))
			$('#id-date-picker-2').val(_data.loch_useTime2.substring(0, 10))
			$('#inputtype').val(_data.loch_type)

			$('.feeAll').empty()
			var feeItemAll = _data.loch_feeItem.split(';')
			for (var i = 0; i < feeItemAll.length-1; i++) {
			    var feeItem0 = feeItemAll[i].split(',')
			    var _html = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:60px; float: left;"></label><select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:300px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + feeItem0[2] + '" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem0[3] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem0[4] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem0[5] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + feeItem0[6] + '" placeholder="" style="width:200px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> <a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a></label></div>'
			    $('.feeAll').append(_html)

			    $('.feeList').eq(i).find('#feeType').html(_feeType)
			    $('.feeList').eq(i).find('#feeType').val(feeItem0[0]).trigger("change")
			    $('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
			    $('.feeList').eq(i).find('#feeUnit').val(feeItem0[1]).trigger("change")
			}

		}, function(err) {
			console.log(err)
		}, 5000)
	
	} else {
	
	}
	
	/*下一步*/
	$('#send1').on('click', function () {
		var bt= $(this).attr("id");
		_carrier = $('#carrier').val(),
		_port1 = $('#port1').val(),
		_routes = $('#inputRoutes').val(),
		_from = $('#from').val(),
		_remark = $('#remark').val(),
		_toCompany = $('#toCompany').val(),
		_useTime1 = $('#id-date-picker-1').val(),
        _useTime2 = $('#id-date-picker-2').val(),
		_type= $('#inputtype').val();

		var feeData = ''
		for (var i = 0; i < $('.feeList').length; i++) {
		    var feeType = $('.feeList').eq(i).find('#feeType').val()
		    var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
		    var feePrice = $('.feeList').eq(i).find('#feePrice').val()
		    var fee20GP = $('.feeList').eq(i).find('#fee20GP').val()
		    var fee40GP = $('.feeList').eq(i).find('#fee40GP').val()
		    var fee40HQ = $('.feeList').eq(i).find('#fee40HQ').val()
		    var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()

		    var feeoneData = feeType + ',' + feeUnit + ',' + feePrice + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + feeBeizhu + ';'
		    feeData = feeData + feeoneData
		}
		console.log(feeData)

		if(action == 'add') {
			if(!port1) {
				comModel("请选择港口！！！")
			} else {
				var parm = {
					'companyId': companyID,
					'userId': userID,
					'toCompany': _toCompany,
					'carrier': _carrier,
					'port1': _port1,
					'routes': _routes,					
					'feeItem': feeData,
					'from': _from,
					'remark': _remark,
					'type': _type,
					'useTime1': _useTime1,
					'useTime2': _useTime2
				}
				console.log(parm)
				common.ajax_req('POST', false, dataUrl, 'localcharge.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						comModel("新增成功")
						location.href = 'localchargelist.html';

					} else {
						comModel("新增失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
			}
		
		}
		
		if(action == 'modify') {
			if(!port1) {
				comModel("请选择港口！！！")
			}else{
				var parm = {
					'Id': Id,
					'toCompany': _toCompany,
					'carrier': _carrier,
					'port1': _port1,
					'routes': _routes,
					'feeItem': feeData,
					'from': _from,
					'remark': _remark,
					'type': _type,
					'useTime1': _useTime1,
					'useTime2': _useTime2
				}
				
				common.ajax_req('POST', false, dataUrl, 'localcharge.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						location.href = 'localchargelist.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
	});
	/*另存为新费用*/
	$('#saveAsNew').on('click', function () {
		var bt= $(this).attr("id");
		_carrier = $('#carrier').val(),
		_port1 = $('#port1').val(),
		_routes = $('#inputRoutes').val(),
		_from = $('#from').val(),
		_remark = $('#remark').val(),
		_toCompany = $('#toCompany').val(),
		_useTime1 = $('#id-date-picker-1').val(),
        _useTime2 = $('#id-date-picker-2').val(),
		_type= $('#inputtype').val();

		var feeData = ''
		for (var i = 0; i < $('.feeList').length; i++) {
		    var feeType = $('.feeList').eq(i).find('#feeType').val()
		    var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
		    var feePrice = $('.feeList').eq(i).find('#feePrice').val()
		    var fee20GP = $('.feeList').eq(i).find('#fee20GP').val()
		    var fee40GP = $('.feeList').eq(i).find('#fee40GP').val()
		    var fee40HQ = $('.feeList').eq(i).find('#fee40HQ').val()
		    var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()

		    var feeoneData = feeType + ',' + feeUnit + ',' + feePrice + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + feeBeizhu + ';'
		    feeData = feeData + feeoneData
		}
		console.log(feeData)

		if(!port1) {
			comModel("请选择港口！！！")
		} else {
			var parm = {
				'companyId': companyID,
				'userId': userID,
				'toCompany': _toCompany,
				'carrier': _carrier,
				'port1': _port1,
				'routes': _routes,					
				'feeItem': feeData,
				'from': _from,
				'remark': _remark,
				'type': _type,
				'useTime1': _useTime1,
				'useTime2': _useTime2
			}
			console.log(parm)
			common.ajax_req('POST', false, dataUrl, 'localcharge.ashx?action=new', parm, function(data) {
				if(data.State == 1) {
					comModel("新增成功")
					location.href = 'localchargelist.html';

				} else {
					comModel("新增失败")
				}
			}, function(error) {
				console.log(parm)
			}, 10000)
		}
	});
	
})



