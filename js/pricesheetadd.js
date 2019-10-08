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
	this.title = get_lan('nav_5_3') 	
	$('.navli5').addClass("active open")
	$('.financial3').addClass("active")	
	$('#title1').text(get_lan('nav_5_3'))
	$('#title2').text(get_lan('nav_5_3')) 
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var _toCompany, _port1, _port2, _20GP, _40GP, _40HQ, _CBM, _KGS, _CTNS, _remark;
	var _toCompany = '', _feeItem = '', _localChargeItem = '', _truckingChargeItem = '', _feeUnit = '', _feeType = ''
	//var AccountName, AccountPw;

	$("#checkAll").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});
	$("#checkAll2").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='checkList2']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});

    //本地费用
	common.ajax_req("get", false, dataUrl, "localcharge.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var feeItemAll = _data[i].loch_feeItem.split(';')
	            for (var j = 0; j < feeItemAll.length - 1; j++) {
	                var feeItem = feeItemAll[j].split(',')
	                var _html = '<tr class="feelist"><td><input type="checkbox" name="checkList" value="' + _data[i].loch_id + '"></td><td class="feeType">' + feeItem[0] + '</td><td class="feeUnit">' + feeItem[1] + '</td><td class="feePrice">' + feeItem[2] + '</td><td class="fee20GP">' + feeItem[3] + '</td><td class="fee40GP">' + feeItem[4] + '</td><td class="fee40HQ">' + feeItem[5] + '</td><td><span class="feeUseTime1">' + _data[i].loch_useTime1.substring(0, 10) + '</span> -- <span class="feeUseTime2">' + _data[i].loch_useTime2.substring(0, 10) + '</span></td><td class="feeRemark">' + feeItem[6] + '</td></tr>'
	                $('.localChargeItem').append(_html)

	            }
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

    //拖车费用
	common.ajax_req("get", false, dataUrl, "truckingcharge.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<tr class="feelist"><td><input type="checkbox" name="checkList2" value="' + _data[i].trch_id + '"></td><td class="feeDelivery">' + _data[i].trch_delivery + '</td><td class="feeUnit">' + _data[i].trch_feeUnit + '</td><td class="fee20GP">' + _data[i].trch_20GP + '</td><td class="fee40GP">' + _data[i].trch_40GP + '</td><td class="fee40HQ">' + _data[i].trch_40HQ + '</td><td><span class="feeUseTime1">' + _data[i].trch_useTime1.substring(0, 10) + '</span> -- <span class="feeUseTime2">' + _data[i].trch_useTime2.substring(0, 10) + '</span></td><td class="feeRemark">' + _data[i].trch_remark + '</td></tr>'
	            $('.truckingChargeItem').append(_html)
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

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
	
    //承运人
	$("#carrier").select2({
	    ajax: {
	        url: dataUrl + "ajax/publicdata.ashx?action=readcarrier&companyId=" + companyID,
	        dataType: 'json',
	        delay: 250,
	        data: function (params) {
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
	        processResults: function (res, params) {
	            var users = res.data;
	            var options = [];
	            for (var i = 0, len = users.length; i < len; i++) {
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
	    escapeMarkup: function (markup) {
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
	        var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
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
	        $('#feeUnit2').append(_html)
	        _feeUnit = _feeUnit + _html
	    }
	}, function (error) {
	    console.log(parm)
	}, 1000)

    //本地运费
	var feeboxRow0 = $('.feeList0').clone()
	$('.feeAll0').delegate('.addFee', 'click', function () {
	    var newid = parseInt(Math.random() * 1000)
	    var feeboxRow0 = '<div class="col-sm-12 feeList0">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="0" placeholder="" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="0" placeholder="" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="0" placeholder="" style="width:80px; float: left;">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="float:left;">'+
                                                '<select id=' + newid + '  class="carrier no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
                                            '</label>'+
                                            '<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="0" style="width:100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="0" style="width:100px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="" value="0" style="width:100px; float: left;">'+
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
                                                '<input class="form-control date-picker" id="id-date-picker-1" type="text" data-date-format="yyyy-mm-dd">'+
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                                            '</div>'+
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
                                                '<input class="form-control date-picker" id="id-date-picker-2" type="text" data-date-format="yyyy-mm-dd">'+
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                                            '</div>'+
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:150px; float: left;">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                                '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>'+
                                                '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>'+
                                            '</label>'+
                                        '</div>'
	    $('.feeAll0').append(feeboxRow0)
	    $('.date-picker').datepicker();
	    //承运人
	    $("#" + newid).select2({
	        ajax: {
	            url: dataUrl + "ajax/publicdata.ashx?action=readcarrier&companyId=" + companyID,
	            dataType: 'json',
	            delay: 250,
	            data: function (params) {
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
	            processResults: function (res, params) {
	                var users = res.data;
	                var options = [];
	                for (var i = 0, len = users.length; i < len; i++) {
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
	        escapeMarkup: function (markup) {
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
	})
	$('.feeAll0').delegate('.removeFee', 'click', function () {
	    $(this).parents('.feeList0').remove()
	})

    //本地费用
	var feeboxRow = $('.feeList').clone()
	$('.feeAll').delegate('.addFee', 'click', function () {
	    //var feeboxRow = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"></label><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="0" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:200px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button></label></div>'
	    $('.feeAll').append(feeboxRow)
	    feeboxRow = feeboxRow.clone()
	    $('.feeList:last').find('#feeItem').append(_feeItem)
	    $('.feeList:last').find('#feeUnit').append(_feeUnit)
	    $('.date-picker').datepicker();
	})
	$('.feeAll').delegate('.removeFee', 'click', function () {
	    $(this).parents('.feeList').remove()
	})
	
    //拖车费用
	var feeboxRow2 = $('.feeList2').clone()
	$('.feeAll2').delegate('.addFee', 'click', function () {
	    //var feeboxRow = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"></label><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="0" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:200px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button></label></div>'
	    $('.feeAll2').append(feeboxRow2)
	    feeboxRow2 = feeboxRow2.clone()
	    $('.feeList2:last').find('#feeUnit').append(_feeUnit)
	    $('.date-picker').datepicker();
	})
	$('.feeAll2').delegate('.removeFee', 'click', function () {
	    $(this).parents('.feeList2').remove()
	})

	if(action == 'modify') {		
		common.ajax_req("get", false, dataUrl, "pricesheet.ashx?action=readbyid", {
			"Id": Id
		}, function(data) {
			console.log(data.Data)
			//初始化信息
			var _data = data.Data
			$('#carrier').html('<option value="' + _data.prsh_carrier + '">' + _data.prsh_carrier + '</option>').trigger("change")
			$('#port1').html('<option value="' + _data.prsh_port1 + '">' + _data.prsh_port1 + '</option>').trigger("change")
			$('#port2').html('<option value="' + _data.prsh_port1 + '">' + _data.prsh_port1 + '</option>').trigger("change")
			$('#toCompany').val(_data.prsh_toCompany).trigger("change")
			$('#20GP').val(_data.prsh_20GP)
			$('#40GP').val(_data.prsh_40GP)
			$('#40HQ').val(_data.prsh_40HQ)
			$('#remark').val(_data.prsh_remark)
			$('#CBM').val(_data.prsh_CBM)
			$('#KGS').val(_data.prsh_KGS)
			$('#CTNS').val(_data.prsh_CTNS)

			$('.feeAll0').empty()
			var feeItemAll0 = _data.prsh_feeItem.split(';')
			for (var i = 0; i < feeItemAll0.length-1; i++) {
			    var feeItem0 = feeItemAll0[i].split(',')
			    var newid = parseInt(Math.random() * 1000)
			    var _html = '<div class="col-sm-12 feeList0">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" placeholder="" value="' + feeItem0[0] + '" style="width:80px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" placeholder="" value="' + feeItem0[1] + '" style="width:80px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" placeholder="" value="' + feeItem0[2] + '" style="width:80px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="float:left;">' +
                                                '<select id=' + newid + '  class="carrier no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
                                            '</label>' +
                                            '<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="' + feeItem0[4] + '" style="width:100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="' + feeItem0[5] + '" style="width:100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="" value="' + feeItem0[6] + '" style="width:100px; float: left;">' +
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">' +
                                                '<input class="form-control date-picker" id="id-date-picker-1" value="' + feeItem0[7] + '" type="text" data-date-format="yyyy-mm-dd">' +
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                                            '</div>' +
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">' +
                                                '<input class="form-control date-picker" id="id-date-picker-2" value="' + feeItem0[8] + '" type="text" data-date-format="yyyy-mm-dd">' +
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                                            '</div>' +
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem0[9] + '" style="width:150px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                                                '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>' +
                                                '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>' +
                                            '</label>' +
                                        '</div>'
			    $('.feeAll0').append(_html)

			    //承运人
			    $("#" + newid).select2({
			        ajax: {
			            url: dataUrl + "ajax/publicdata.ashx?action=readcarrier&companyId=" + companyID,
			            dataType: 'json',
			            delay: 250,
			            data: function (params) {
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
			            processResults: function (res, params) {
			                var users = res.data;
			                var options = [];
			                for (var i = 0, len = users.length; i < len; i++) {
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
			        escapeMarkup: function (markup) {
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
			    $('.feeList0').eq(i).find('#' + newid).html('<option value="' + feeItem0[3] + '">' + feeItem0[3] + '</option>').trigger("change")
			}

			$('.feeAll').empty()
			var feeItemAll = _data.prsh_localChargeItem.split(';')
			for (var i = 0; i < feeItemAll.length - 1; i++) {
			    var feeItem = feeItemAll[i].split(',')
			    var _html = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label><select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + feeItem[2] + '" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem[3] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem[4] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem[5] + '" placeholder="" style="width:100px; float: left;"><div class="input-group margin-right-5" style="width:130px; float: left;"><input class="form-control date-picker" id="id-date-picker-1" type="text" value="' + feeItem[6] + '" data-date-format="yyyy-mm-dd"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div><div class="input-group margin-right-5" style="width:130px; float: left;"><input class="form-control date-picker" id="id-date-picker-2" type="text" value="' + feeItem[7] + '" data-date-format="yyyy-mm-dd"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div><input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + feeItem[8] + '" placeholder="" style="width:150px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button></label></div>'
			    $('.feeAll').append(_html)

			    $('.date-picker').datepicker();
			    $('.feeList').eq(i).find('#feeType').html(_feeType)
			    $('.feeList').eq(i).find('#feeType').val(feeItem[0]).trigger("change")
			    $('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
			    $('.feeList').eq(i).find('#feeUnit').val(feeItem[1]).trigger("change")
			}

			$('.feeAll2').empty()
			var feeItemAll2 = _data.prsh_truckingChargeItem.split(';')
			for (var i = 0; i < feeItemAll2.length - 1; i++) {
			    var feeItem2 = feeItemAll2[i].split(',')
			    var _html = '<div class="col-sm-12 feeList2">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
                                            '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" value="' + feeItem2[0] + '" style="width:120px; float: left;">' +
                                            '<select id="feeUnit2" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;"></select>'+
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem2[2] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem2[3] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem2[4] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
                                                '<input class="form-control date-picker" id="id-date-picker-1" type="text" value="' + feeItem2[5] + '" data-date-format="yyyy-mm-dd">' +
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                                            '</div>'+
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
                                                '<input class="form-control date-picker" id="id-date-picker-2" type="text" value="' + feeItem2[6] + '" data-date-format="yyyy-mm-dd">' +
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                                            '</div>'+
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem2[7] + '" style="width:150px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                                '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>'+
                                                '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>'+
                                            '</label>'+
                                        '</div>' 
			    $('.feeAll2').append(_html)

			    $('.date-picker').datepicker();
			    $('.feeList2').eq(i).find('#feeUnit2').html(_feeUnit)
			    $('.feeList2').eq(i).find('#feeUnit2').val(feeItem2[1]).trigger("change")
			}

		}, function(err) {
			console.log(err)
		}, 5000)
	
	} else {
	
	}
	
	/*下一步*/
	$('#send1').on('click', function () {
		var bt= $(this).attr("id");
		_port1 = $('#port1').val(),
		_port2 = $('#port2').val(),
		_20GP = $('#20GP').val(),
        _40GP = $('#40GP').val(),
        _40HQ = $('#40HQ').val(),
		_remark = $('#remark').val(),
		_toCompany = $('#toCompany').val(),
		_CBM = $('#CBM').val(),
        _KGS = $('#KGS').val(),
		_CTNS = $('#CTNS').val();

		var feeData = ''
		for (var i = 0; i < $('.feeList0').length; i++) {
		    var fee20GP = $('.feeList0').eq(i).find('#fee20GP').val()
		    var fee40GP = $('.feeList0').eq(i).find('#fee40GP').val()
		    var fee40HQ = $('.feeList0').eq(i).find('#fee40HQ').val()
		    var carrier = $('.feeList0').eq(i).find('.carrier').val()
		    var hangqi = $('.feeList0').eq(i).find('#hangqi').val()
		    var hangcheng = $('.feeList0').eq(i).find('#hangcheng').val()
		    var zhongzhuang = $('.feeList0').eq(i).find('#zhongzhuang').val()
		    var useTime1 = $('.feeList0').eq(i).find('#id-date-picker-1').val()
		    var useTime2 = $('.feeList0').eq(i).find('#id-date-picker-2').val()
		    var feeBeizhu = $('.feeList0').eq(i).find('#feeBeizhu').val()

		    var feeoneData = fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + carrier + ',' + hangqi + ',' + hangcheng + ',' + zhongzhuang + ',' + useTime1 + ',' + useTime2 + ',' + feeBeizhu + ';'
		    feeData = feeData + feeoneData
		}
		console.log(feeData)

		var localChargeData = ''
		for (var i = 0; i < $('.feeList').length; i++) {
		    var feeType = $('.feeList').eq(i).find('#feeType').val()
		    var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
		    var feePrice = $('.feeList').eq(i).find('#feePrice').val()
		    var fee20GP = $('.feeList').eq(i).find('#fee20GP').val()
		    var fee40GP = $('.feeList').eq(i).find('#fee40GP').val()
		    var fee40HQ = $('.feeList').eq(i).find('#fee40HQ').val()
		    var useTime1 = $('.feeList').eq(i).find('#id-date-picker-1').val()
		    var useTime2 = $('.feeList').eq(i).find('#id-date-picker-2').val()
		    var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()

		    var feeoneData = feeType + ',' + feeUnit + ',' + feePrice + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + useTime1 + ',' + useTime2 + ',' + feeBeizhu + ';'
		    localChargeData = localChargeData + feeoneData
		}
		console.log(localChargeData)

		var truckingChargeData = ''
		for (var i = 0; i < $('.feeList2').length; i++) {
		    var delivery = $('.feeList2').eq(i).find('#delivery').val()
		    var feeUnit = $('.feeList2').eq(i).find('#feeUnit2').val()
		    var fee20GP = $('.feeList2').eq(i).find('#fee20GP').val()
		    var fee40GP = $('.feeList2').eq(i).find('#fee40GP').val()
		    var fee40HQ = $('.feeList2').eq(i).find('#fee40HQ').val()
		    var useTime1 = $('.feeList2').eq(i).find('#id-date-picker-1').val()
		    var useTime2 = $('.feeList2').eq(i).find('#id-date-picker-2').val()
		    var feeBeizhu = $('.feeList2').eq(i).find('#feeBeizhu').val()

		    var feeoneData = delivery + ',' + feeUnit + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + useTime1 + ',' + useTime2 + ',' + feeBeizhu + ';'
		    truckingChargeData = truckingChargeData + feeoneData
		}
		console.log(truckingChargeData)

		if(action == 'add') {
			if(!port1) {
				comModel("请选择起运港")
			} else {
				var parm = {
					'companyId': companyID,
					'userId': userID,
					'toCompany': _toCompany,
					'port1': _port1,
					'port2': _port2,
					'feeItem': feeData,
					'localChargeItem': localChargeData,
					'truckingChargeItem': truckingChargeData,
					'20GP': _20GP,
					'40GP': _40GP,
					'40HQ': _40HQ,
					'remark': _remark,
					'CBM': _CBM,
					'KGS': _KGS,
					'CTNS': _CTNS
				}
				console.log(parm)
				common.ajax_req('POST', false, dataUrl, 'pricesheet.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						comModel("新增成功")
						location.href = 'pricesheetlist.html';

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
				comModel("请选择起运港")
			}else{
				var parm = {
					'Id': Id,
					'toCompany': _toCompany,
					'port1': _port1,
					'port2': _port2,
					'feeItem': feeData,
					'localChargeItem': localChargeData,
					'truckingChargeItem': truckingChargeData,
					'20GP': _20GP,
					'40GP': _40GP,
					'40HQ': _40HQ,
					'remark': _remark,
					'CBM': _CBM,
					'KGS': _KGS,
					'CTNS': _CTNS
				}
				
				common.ajax_req('POST', false, dataUrl, 'pricesheet.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						location.href = 'pricesheetlist.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
	});

    /*下一步*/
	$('#btnSave').on('click', function () {
	    var feeData = '';
	    $("input[name='checkList']:checked").each(function (i, o) {  
	        var _feeType = $(this).parents(".feelist").find('.feeType').text();
	        var _feeUnit = $(this).parents(".feelist").find('.feeUnit').text();
	        var _feePrice = $(this).parents(".feelist").find('.feePrice').text();
	        var _fee20GP = $(this).parents(".feelist").find('.fee20GP').text();
	        var _fee40GP = $(this).parents(".feelist").find('.fee40GP').text();
	        var _fee40HQ = $(this).parents(".feelist").find('.fee40HQ').text();
	        var _feeUseTime1 = $(this).parents(".feelist").find('.feeUseTime1').text();
	        var _feeUseTime2 = $(this).parents(".feelist").find('.feeUseTime2').text();
	        var _feeRemark = $(this).parents(".feelist").find('.feeRemark').text();
	        var feeoneData = _feeType + ',' + _feeUnit + ',' + _feePrice + ',' + _fee20GP + ',' + _fee40GP + ',' + _fee40HQ + ',' + _feeUseTime1 + ',' + _feeUseTime2 + ',' + _feeRemark + ';'
	        feeData = feeData + feeoneData
	    });
	    if (feeData.length > 0) {
	        //alert("你选择的是：" + feeData);
	        //location.href = 'truckingchargeadd.html?action=modify&Id=' + IDS;
	        var feeItemAll = feeData.split(';')
	        for (var i = 0; i < feeItemAll.length - 1; i++) {
	            var feeItem = feeItemAll[i].split(',')
	            var _html = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label><select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + feeItem[2] + '" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem[3] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem[4] + '" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem[5] + '" placeholder="" style="width:100px; float: left;"><div class="input-group margin-right-5" style="width:130px; float: left;"><input class="form-control date-picker" id="id-date-picker-1" type="text" value="' + feeItem[6] + '" data-date-format="yyyy-mm-dd"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div><div class="input-group margin-right-5" style="width:130px; float: left;"><input class="form-control date-picker" id="id-date-picker-2" type="text" value="' + feeItem[7] + '" data-date-format="yyyy-mm-dd"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div><input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + feeItem[8] + '" placeholder="" style="width:150px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button></label></div>'
	            $('.feeAll').append(_html)

	            $('.date-picker').datepicker();
	            $('.feeList').find('#feeType').html(_feeType)
	            $('.feeList').find('#feeType').val(feeItem[0]).trigger("change")
	            $('.feeList').find('#feeUnit').html(_feeUnit)
	            $('.feeList').find('#feeUnit').val(feeItem[1]).trigger("change")
	        }
	        $("#checkAll").attr("checked", false)
	        $("input[name='checkList']").attr("checked", false)
	        $("#myModal").modal("hide");
	    } else {
	        alert("请选择要导入的费用!");
	    }
	})

    /*下一步*/
	$('#btnSave2').on('click', function () {
	    var feeData = '';
	    $("input[name='checkList2']:checked").each(function (i, o) {
	        var _feeDelivery = $(this).parents(".feelist").find('.feeDelivery').text();
	        var _feeUnit = $(this).parents(".feelist").find('.feeUnit').text();
	        var _fee20GP = $(this).parents(".feelist").find('.fee20GP').text();
	        var _fee40GP = $(this).parents(".feelist").find('.fee40GP').text();
	        var _fee40HQ = $(this).parents(".feelist").find('.fee40HQ').text();
	        var _feeUseTime1 = $(this).parents(".feelist").find('.feeUseTime1').text();
	        var _feeUseTime2 = $(this).parents(".feelist").find('.feeUseTime2').text();
	        var _feeRemark = $(this).parents(".feelist").find('.feeRemark').text();
	        var feeoneData = _feeDelivery + ',' + _feeUnit + ',' + _fee20GP + ',' + _fee40GP + ',' + _fee40HQ + ',' + _feeUseTime1 + ',' + _feeUseTime2 + ',' + _feeRemark + ';'
	        feeData = feeData + feeoneData
	    });
	    if (feeData.length > 0) {
	        //alert("你选择的是：" + feeData);
	        //location.href = 'truckingchargeadd.html?action=modify&Id=' + IDS;
	        var feeItemAll2 = feeData.split(';')
	        for (var i = 0; i < feeItemAll2.length - 1; i++) {
	            var feeItem2 = feeItemAll2[i].split(',')
	            var _html = '<div class="col-sm-12 feeList2">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                                            '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" value="' + feeItem2[0] + '" style="width:120px; float: left;">' +
                                            '<select id="feeUnit2" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;"></select>' +
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem2[2] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem2[3] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem2[4] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">' +
                                                '<input class="form-control date-picker" id="id-date-picker-1" type="text" value="' + feeItem2[5] + '" data-date-format="yyyy-mm-dd">' +
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                                            '</div>' +
                                            '<div class="input-group margin-right-5" style="width:130px; float: left;">' +
                                                '<input class="form-control date-picker" id="id-date-picker-2" type="text" value="' + feeItem2[6] + '" data-date-format="yyyy-mm-dd">' +
                                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                                            '</div>' +
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem2[7] + '" style="width:150px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                                                '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>' +
                                                '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>' +
                                            '</label>' +
                                        '</div>'
	            $('.feeAll2').append(_html)

	            $('.date-picker').datepicker();
	            $('.feeList2').find('#feeUnit2').html(_feeUnit)
	            $('.feeList2').find('#feeUnit2').val(feeItem2[1]).trigger("change")
	        }
	        $("#checkAll2").attr("checked", false)
	        $("input[name='checkList2']").attr("checked", false)
	        $("#myModal2").modal("hide");
	    } else {
	        alert("请选择要导入的费用!");
	    }
	})
	
})



