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
    this.title = get_lan('nav_4_3')
	$('.navli4').addClass("active open")
	$('.rate3').addClass("active")	
	$('#title1').text(get_lan('nav_4_3'))
	$('#title2').text(get_lan('nav_4_3')) 
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var _port1, _port2, _from, _useTime1, _useTime2, _type, _feeUnit = '', _remark, _toCompany;
	//var AccountName, AccountPw;

	$("#port1").change(function() {
		$("#port2").html('<option value="' + $(this).val()  + '">' + $(this).val()  + '</option>').trigger("change")
	})

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
	var feeboxRow = $('.feeList').clone()
	$('.feeAll').delegate('.addFee', 'click', function () {
	    var newid1 = parseInt(Math.random() * 1000), newid2 = parseInt(Math.random() * 1000)
	    var feeboxRow = '<div class="col-sm-12 feeList">'+
                                            //'<select id="from" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;">'+
                                            //    '<option value="Export">Export</option>'+
                                            //    '<option value="Import">Import</option>'+
                                            //'</select>'+
                                            '<label for="inputPassword3" class="margin-right-5" style="float:left;">'+
                                                '<select id=' + newid1 + ' class="port1 no-padding-left no-padding-right margin-right-5" style="width:120px; float: left;"></select> ' +
                                                '<select id=' + newid2 + ' class="port2 no-padding-left no-padding-right margin-right-5" style="width:120px; float: left;"></select> ' +
                                            '</label>'+
                                            '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" style="width:200px; float: left;">'+
                                            '<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:80px; float: left;"></select>'+
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" placeholder="0" style="width:60px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" placeholder="0" style="width:60px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" placeholder="0" style="width:60px; float: left;">'+
                                            //'<div class="input-group margin-right-5" style="width:260px; float: left;">'+
                                            //'<input class="form-control date_select date-picker" id="id-date-picker-1" type="text" data-date-format="yyyy-mm-dd">'+
                                            //'<span class="input-group-addon">to</span>'+
                                            //'<input class="form-control date_select date-picker" id="id-date-picker-2" type="text" data-date-format="yyyy-mm-dd">'+
                                            //'</div>'+
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:120px; float: left;">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a>'+
                                                ' <a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
                                            '</label>'+
                                        '</div>'
	    $('.feeAll').append(feeboxRow)
	    $('.date-picker').datepicker();

	    $('.feeList:last').find('#from').append(_from)
	    $('.feeList:last').find('#feeUnit').append(_feeUnit)
	    $('.feeList:last').find('#toCompany').append(_toCompany)

		$(this).parents('.feeList').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, 这里区分之前的一些不一样的是，这里用i的图标后，parent不能用，要用parents了。 by daniel 20190730

			$('.feeList:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})
		
		$(this).parents('.feeList').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select,这里区分之前的一些不一样的是，这里用i的图标后，parent不能用，要用parents了。 by daniel 20190730
			$('.feeList:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

	    //feeboxRow = feeboxRow.clone()
	    console.log($('#' + newid1).text())
	    $("#" + newid1 + "," + "#" + newid2).select2({
	        ajax: {
	            url: dataUrl + "ajax/publicdata.ashx?action=readport&companyId=" + companyID,
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
	        tags: false, //允许手动添加
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
    	//$("#"+port1_new).val()
    	$(this).parents('.feeList').find(".port1").each(function() { ///当克隆到新的港口的时候，复制现在的数据过去的input, by daniel 20190730
    		if($(this).val()){
    			$("#"+newid1).html('<option value="' + $(this).val()  + '">' + $(this).val()  + '</option>').trigger("change")
    		}			
		})
    	$(this).parents('.feeList').find(".port2").each(function() { ///当克隆到新的港口的时候，复制现在的数据过去的input, by daniel 20190730
    		if($(this).val()){
				$("#"+newid2).html('<option value="' + $(this).val()  + '">' + $(this).val()  + '</option>').trigger("change")
			}
		})
	})
	$('.feeAll').delegate('.removeFee', 'click', function () {
		if($('.removeFee').length>1 && $(this).parents('.feeList').index()!=0){
	    	$(this).parents('.feeList').remove()
	    }
	})
	
	if(action == 'modify') {	
		hasPermission('1417'); //权限控制：查看拖箱费用	
		common.ajax_req("get", false, dataUrl, "truckingcharge.ashx?action=readbyid2", {
			"Id": Id
		}, function(data) {
			//console.log(data.Data)
		    //初始化信息
		    $('.feeAll').empty()
		    $.each(data.Data, function (i, n) {
		        $('#toCompany').val(n.trch_toCompany).trigger("change")
		        $('#from').val(n.trch_from).trigger("change")
		        $('#id-date-picker-1').val(n.trch_useTime1.substring(0, 10))
		        $('#id-date-picker-2').val(n.trch_useTime1.substring(0, 10))
		        var newid1 = parseInt(Math.random() * 1000), newid2 = parseInt(Math.random() * 1000)
			    var feeboxRow = '<div class="col-sm-12 feeList">' +
                                                    //'<select id="from" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;">' +
                                                    //    '<option value="Export">Export</option>' +
                                                    //    '<option value="Import">Import</option>' +
                                                    //'</select>' +
                                                    '<label for="inputPassword3" class="margin-right-5" style="float:left;">' +
                                                        '<select id=' + newid1 + ' class="port1 no-padding-left no-padding-right margin-right-5" style="width:120px; float: left;"></select> ' +
                                                        '<select id=' + newid2 + ' class="port2 no-padding-left no-padding-right margin-right-5" style="width:120px; float: left;"></select> ' +
                                                    '</label>' +
                                                    '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" value="' + n.trch_delivery + '"  style="width:200px; float: left;">' +
                                                    '<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:80px; float: left;"></select>' +
                                                    '<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + n.trch_20GP + '"  placeholder="" style="width:60px; float: left;">' +
                                                    '<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + n.trch_40GP + '"  placeholder="" style="width:60px; float: left;">' +
                                                    '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + n.trch_40HQ + '"  placeholder="" style="width:60px; float: left;">' +
                                                    //'<div class="input-group margin-right-5" style="width:260px; float: left;">' +
			                                        //    '<input class="form-control date_select date-picker" id="id-date-picker-1" type="text" value="' + n.trch_useTime1.substring(0, 10) + '" data-date-format="yyyy-mm-dd">'+
			                                        //    '<span class="input-group-addon">to</span>'+
			                                        //    '<input class="form-control date_select date-picker" id="id-date-picker-2" type="text" value="' + n.trch_useTime2.substring(0, 10) + '" data-date-format="yyyy-mm-dd">'+
                                                    //'</div>' +
                                                    '<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + n.trch_remark + '" placeholder="" style="width:120px; float: left;">' +
                                                    '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;display:none;">' +
		                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a>'+
		                                                ' <a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
                                                    '</label>' +
                                                '</div>'
			    $('.feeAll').append(feeboxRow)

			    $('.date-picker').datepicker();
			    $('.feeList').eq(i).find('#from').val(n.trch_from).trigger("change")
			    $('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
			    $('.feeList').eq(i).find('#feeUnit').val(n.trch_feeUnit).trigger("change")
	    		$('.feeList').eq(i).find('#toCompany').html(_toCompany)
	    		$('.feeList').eq(i).find('#toCompany').val(n.trch_toCompany).trigger("change") //这里是修改这个trch_toCompany新增的字段，20190828 by daniel
			    $("#" + newid1 + "," + "#" + newid2).select2({
			        ajax: {
			            url: dataUrl + "ajax/publicdata.ashx?action=readport&companyId=" + companyID,
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
			        tags: false, //允许手动添加
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
			    $('.feeList').eq(i).find('#' + newid1).html('<option value="' + n.trch_port + '">' + n.trch_port + '</option>').trigger("change")
			    $('.feeList').eq(i).find('#' + newid2).html('<option value="' + n.trch_dropback + '">' + n.trch_dropback + '</option>').trigger("change")
			})

		}, function(err) {
			console.log(err)
		}, 5000)
	
	} else {
		hasPermission('1415'); //权限控制：查看拖箱费用
	}
	
	/*下一步*/
	$('#send1').on('click', function () {
		var bt= $(this).attr("id");
		_from = $('#from').val(),
        _toCompany = $('#toCompany').val(),
        _useTime1 = $('#id-date-picker-1').val(),
        _useTime2 = $('#id-date-picker-2').val();
		var feeData = ''
		for (var i = 0; i < $('.feeList').length; i++) {
		    //var toCompany = $('.feeList').eq(i).find('#toCompany').val() //这里是修改这个trch_toCompany新增的字段，20190828 by daniel
		    //var from = $('.feeList').eq(i).find('#from').val()
		    var port1 = $('.feeList').eq(i).find('.port1').val()
		    var port2 = $('.feeList').eq(i).find('.port2').val()
		    var delivery = $('.feeList').eq(i).find('#delivery').val()
		    var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
		    var fee20GP = $('.feeList').eq(i).find('#fee20GP').val()
		    var fee40GP = $('.feeList').eq(i).find('#fee40GP').val()
		    var fee40HQ = $('.feeList').eq(i).find('#fee40HQ').val()
		    //var useTime1 = $('.feeList').eq(i).find('#id-date-picker-1').val()
		    //var useTime2 = $('.feeList').eq(i).find('#id-date-picker-2').val()
		    var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()

		    var feeoneData = port1 + ',' + port2 + ',' + delivery + ',' + feeUnit + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + feeBeizhu + ';'
		    feeData = feeData + feeoneData
		}
		console.log(feeData)

		if(action == 'add') {
		    var parm = {
		        'companyId': companyID,
		        'userId': userID,
		        'toCompany': _toCompany,
		        'from': _from,
		        'useTime1': _useTime1,
		        'useTime2': _useTime2,
		        'feeItem': feeData
		    }
		    console.log(parm)
		    common.ajax_req('POST', false, dataUrl, 'truckingcharge.ashx?action=new', parm, function (data) {
		        if (data.State == 1) {
		            comModel("新增成功")
		            location.href = 'truckingchargelist.html';

		        } else {
		            comModel("新增失败")
		        }
		    }, function (error) {
		        console.log(parm)
		    }, 10000)
		
		}
		
		if(action == 'modify') {
		    var parm = {
		        'Id': Id + ',',
		        'toCompany': _toCompany,
		        'from': _from,
		        'useTime1': _useTime1,
		        'useTime2': _useTime2,
		        'feeItem': feeData
		    }

		    common.ajax_req('POST', false, dataUrl, 'truckingcharge.ashx?action=modify', parm, function (data) {
		        if (data.State == 1) {
		            comModel("修改成功")
		            location.href = 'truckingchargelist.html';
		        } else {
		            comModel("修改失败")
		        }
		    }, function (error) {
		        console.log(parm)
		    }, 10000)
		}
	});
	
})



