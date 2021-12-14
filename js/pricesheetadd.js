//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "运价管理中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Rates MANAGEMENT",
};

var oTable;
$(function(){
    this.title = get_lan('nav_4_6')
	$('.navli4').addClass("active open")
	$('.rate5').addClass("active")
	$('#title1').text(get_lan('nav_4_6'))
	$('#title2').text(get_lan('nav_4_6'))
	
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var _toCompany, _port1, _port2, _20GP, _40GP, _40HQ, _CBM, _KGS, _CTNS, _remark;
	var _toCompany = '', _feeItem = '', _localChargeItem = '', _truckingChargeItem = '', _feeUnit = '', _feeType = ''
	//var AccountName, AccountPw;

	$("#20GPSel").on("change", function () {
		$('[cont-type-id$="contTypeOne"]').html($("#20GPSel").val())
	});
	$("#40GPSel").on("change", function () {
		$('[cont-type-id$="contTypeTwo"]').html($("#40GPSel").val())
	});

	$("#40HQSel").on("change", function () {
		$('[cont-type-id$="contTypeThree"]').html($("#40HQSel").val())
	});
	$('#load_localchargelist').on('click', function () {
		$('#pricesheet_tabel_localcharge').dataTable();
	});

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
		
		//$("#movementType").val(fromId)
		
	}, function(error) {
		//console.log(parm)
	}, 1000)



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
				if(!users){
					console.log(params.term);
					//$(this).val(params.term);
				}
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

	$('#port2').on('select2:close', function(e) {
   		tabel_localcharge.api().search($(this).val()).draw(); //加载localcharge和truckcharge的默认搜索框 20191017 by daniel
	});
	
	$('#port1').on('select2:close', function(e) {
   		table_truckcharge.api().search($(this).val()).draw();
	 //    var $me = $(this);
	 //    //var $tag = $me.find('option[data-select2-tag]');
	 //    var $tag = $me.find('option[data-select2-tag]');
		// console.log($tag)
	 //    //We only want to select this tag if its the only tag there
	 //    if ($tag && $tag.length && $me.find('option').length === 1) {
	 //        $me.val($tag.attr('value'));
	 //        $me.trigger('change');
	 //        //Do stuff with $me.val()
	 //    }
	});

	$('#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#feebyRT,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs,#labelRt').css({ "display": "none" });
	$('#fee20GP,#fee40GP,#fee40HQ,#label20gp,#label40gp,#label40hq').css({"display":""});
	$("#movementType").change(function () {
		var opt = $("#movementType").val();
		if(opt=="FCL"){
		    $('#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#feebyRT,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs,#labelRt').css({ "display": "none" });
			$('#fee20GP,#fee40GP,#fee40HQ,#label20gp,#label40gp,#label40hq').css({"display":""});
		}else if(opt=="AIR"){			
			$('#fee20GP,#fee40GP,#fee40HQ,#feebyRT,#label20gp,#label40gp,#label40hq,#labelRt').css({"display":"none"});
			$('#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs').css({ "display": "" });
		}else{
		    $('#fee20GP,#fee40GP,#fee40HQ,#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#label20gp,#label40gp,#label40hq,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs').css({ "display": "none" });
			$('#feebyRT,#labelRt').css({"display":""});
		}
	})

	// $("#checkAll").on("click", function () {
	//     var xz = $(this).prop("checked");//判断全选按钮的选中状态
	//     var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	// });
	// $("#checkAll2").on("click", function () {
	//     var xz = $(this).prop("checked");//判断全选按钮的选中状态
	//     var ck = $("input[name='checkList2']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	// });

	//var table=$('#pricesheet_tabel_localcharge').dataTable();
	//$("#pricesheet_tabel_localcharge").DataTable().ajax.reload(null, false );


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
	        $('#feeCurrency').append(_html)
	        _feeUnit = _feeUnit + _html
	    }
	}, function (error) {
	    console.log(parm)
	}, 1000)

	//柜型	
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 4,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#20GPSel').append(_html)
			$('#40GPSel').append(_html)
			$('#40HQSel').append(_html)						
		}
		$("#20GPSel").val("20'GP").trigger("change")
		$("#40GPSel").val("40'GP").trigger("change")
		$("#40HQSel").val("40'HQ").trigger("change")
	}, function(error) {
		console.log(parm)
	}, 1000)

    //添加
	var feeboxRow0 = $('.feeList0').clone()
	$('.feeAll0').delegate('.addFee', 'click', function () {
	    var newid = parseInt(Math.random() * 1000)
	    var feeboxRow0 = '<div class="col-sm-12 feeList0">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
                                            '<select class="no-padding-left no-padding-right margin-right-5" id="feeCurrency" style="width:100px; float: left;"></select>'+
                                            '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="feebyRT" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="" placeholder="0" style="width:80px; float: left;">'+
                                            // '<label for="inputPassword3" class="margin-right-5" style="float:left;">'+
                                            //     '<select id=' + newid + '  class="carrier no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>' +
                                            // '</label>'+
                                            '<select id=' + newid + ' class="carrier no-padding-left no-padding-right" style="width:180px;float:left;"></select>'+
                                            //'<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="0" style="width:100px; float: left;">' +
                                            '<select id="hangqi" class="margin-right-5" style="width:80px; float: left;">' +
                                                '<option value="Mon">Mon</option>' +
                                                '<option value="Tur">Tue</option>' +
                                                '<option value="Wed">Wed</option>' +
                                                '<option value="Thu">Thu</option>' +
                                                '<option value="Fri">Fri</option>' +
                                                '<option value="Sat">Sat</option>' +
                                                '<option value="Sun">Sun</option>' +
                                            '</select>' +
                                            //'<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="0" style="width:100px; float: left;">'+
                                            '<div class="input-group margin-right-5" style="width:80px; float: left;">' +
                                                '<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="0" value="">' +
                                                '<span class="input-group-addon">Days</span>' +
                                            '</div>' +
                                            '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="Ports" value="" style="width:100px; float: left;">'+
                                            '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
                                                '<div class="input-group">'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" type="text" data-date-format="yyyy-mm-dd">'+
                                                     '<span class="input-group-addon">to</span>'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" type="text" data-date-format="yyyy-mm-dd">'+
                                                '</div>'+
                                            //     '<input class="form-control date-picker" id="id-date-picker-1" type="text" data-date-format="yyyy-mm-dd">'+
                                            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                                            // '</div>'+
                                            // '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
                                            //     '<input class="form-control date-picker" id="id-date-picker-2" type="text" data-date-format="yyyy-mm-dd">'+
                                            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                                            '</div>'+
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:150px; float: left;">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                                // '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>'+
                                                // '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>'+
                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
                                            '</label>'+
                                        '</div>'
	    $('.feeAll0').append(feeboxRow0)
	    $('.feeList0:last').find('#feeCurrency').html(_feeUnit);
	    $('.date-picker').datepicker();
	    $('.date-picker').datepicker();

		$(this).parents('.feeList0').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, by daniel 20190730
			$('.feeList0:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

		$(this).parents('.feeList0').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select, by daniel 20190730
			$('.feeList0:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})
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

		if($("#movementType").val()=="FCL"){         //by daniel 20191015
			console.log("test")
			$('#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#feebyRT,#labelRt,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs').css({ "display": "none" });
			$('#fee20GP,#fee40GP,#fee40HQ,#label20gp,#label40gp,#label40hq').css({"display":""});
		}else if($("#movementType").val()=="AIR"){			
			console.log("test2")
			$('#fee20GP,#fee40GP,#fee40HQ,#feebyRT,#label20gp,#label40gp,#label40hq,#labelRt').css({"display":"none"});
			$('#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs').css({ "display": "" });
		}else{
			console.log("test3")
			$('#fee20GP,#fee40GP,#fee40HQ,#fee45kgs,#fee100kgs,#fee500kgs,#fee1000kgs,#label20gp,#label40gp,#label40hq,#label45kgs,#label100kgs,#label500kgs,#labe11000kgs').css({ "display": "none" });
			$('#feebyRT,#labelRt').css({"display":""});
		}
	})
	// $('.feeAll0').delegate('.removeFee', 'click', function () {
	//     $(this).parents('.feeList0').remove()
	// })
	$('.feeAll0').delegate('.removeFee', 'click', function() {
		if($('.feeAll0 .removeFee').length>1){
			$(this).parents('.feeList0').remove()
		}
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
		$(this).parents('.feeList').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, by daniel 20190730
			$('.feeList:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

		$(this).parents('.feeList').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select, by daniel 20190730
			$('.feeList:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})
		if($("#movementType").val()=="FCL"){         //by daniel 20191015
			console.log("test")
			$('#feebyKgs,#feebyRT,#labelKgs,#labelRt').css({"display":"none"});
			$('#fee20GP,#fee40GP,#fee40HQ,#label20gp,#label40gp,#label40hq').css({"display":""});
		}else if($("#movementType").val()=="AIR"){			
			console.log("test2")
			$('#fee20GP,#fee40GP,#fee40HQ,#feebyRT,#label20gp,#label40gp,#label40hq,#labelRt').css({"display":"none"});
			$('#feebyKgs,#labelKgs').css({"display":""});
		}else{
			console.log("test3")
			$('#fee20GP,#fee40GP,#fee40HQ,#feebyKgs,#label20gp,#label40gp,#label40hq,#labelKgs').css({"display":"none"});
			$('#feebyRT,#labelRt').css({"display":""});
		}
	})
	// $('.feeAll').delegate('.removeFee', 'click', function () {
	//     $(this).parents('.feeList').remove()
	// })
	$('.feeAll').delegate('.removeFee', 'click', function() {
		if($('.feeAll .removeFee').length>1){
			$(this).parents('.feeList').remove()
			if($('.feeList').length==1 && $('.feeList2').length==1){
				$("#movementType").attr("disabled",false);//添加了这个拖车费后不能修改这个货物类型。 by daniel 20191015
			}
		}
	})
	
    //拖车费用
	var feeboxRow2 = $('.feeList2').clone()
	$('.feeAll2').delegate('.addFee', 'click', function () {
	    //var feeboxRow = '<div class="col-sm-12 feeList"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"></label><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="0" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee20GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40GP" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="fee40HQ" value="0" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:200px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;"><button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button><button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button></label></div>'
	    $('.feeAll2').append(feeboxRow2)
	    feeboxRow2 = feeboxRow2.clone()
	    $('.feeList2:last').find('#feeUnit').append(_feeUnit)
	    $('.date-picker').datepicker();
		$(this).parents('.feeList2').find("input").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的input, by daniel 20190730
			$('.feeList2:last').find("input[id='"+($(this).attr("id"))+"']").val($(this).val())
		})

		$(this).parents('.feeList2').find("select").each(function() { ///当克隆到新的费用的时候，复制现在的数据过去的select, by daniel 20190730
			$('.feeList2:last').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
		})
		if($("#movementType").val()=="FCL"){         //by daniel 20191015
			console.log("test")
			$('#feebyKgs,#feebyRT,#labelKgs,#labelRt').css({"display":"none"});
			$('#fee20GP,#fee40GP,#fee40HQ,#label20gp,#label40gp,#label40hq').css({"display":""});
		}else if($("#movementType").val()=="AIR"){			
			console.log("test2")
			$('#fee20GP,#fee40GP,#fee40HQ,#feebyRT,#label20gp,#label40gp,#label40hq,#labelRt').css({"display":"none"});
			$('#feebyKgs,#labelKgs').css({"display":""});
		}else{
			console.log("test3")
			$('#fee20GP,#fee40GP,#fee40HQ,#feebyKgs,#label20gp,#label40gp,#label40hq,#labelKgs').css({"display":"none"});
			$('#feebyRT,#labelRt').css({"display":""});
		}
	})
	// $('.feeAll2').delegate('.removeFee', 'click', function () {
	//     $(this).parents('.feeList2').remove()
	// })
	$('.feeAll2').delegate('.removeFee', 'click', function() {
		if($('.feeAll2 .removeFee').length>1){
			$(this).parents('.feeList2').remove()
			if($('.feeList').length==1 && $('.feeList2').length==1){
				$("#movementType").attr("disabled",false);//添加了这个拖车费后不能修改这个货物类型。 by daniel 20191015
			}
		}
	})

	if(action == 'modify') {	
    	hasPermission('1303'); //权限控制：修改费用清单	
		common.ajax_req("get", false, dataUrl, "pricesheet.ashx?action=readbyid", {
			"Id": Id
		}, function(data) {
			console.log(data.Data)
			//初始化信息
			var _data = data.Data
			$('#carrier').html('<option value="' + _data.prsh_carrier + '">' + _data.prsh_carrier + '</option>').trigger("change")
			$('#port1').html('<option value="' + _data.prsh_port1 + '">' + _data.prsh_port1 + '</option>').trigger("change")
			$('#port2').html('<option value="' + _data.prsh_port2 + '">' + _data.prsh_port2 + '</option>').trigger("change")
			$('#toCompany').val(_data.prsh_toCompany).trigger("change")
			$('#movementType').val(_data.prsh_movetype).trigger("change")
			$('#20GP').val(_data.prsh_20GP.split("*")[0])
			$('#40GP').val(_data.prsh_40GP.split("*")[0])
			$('#40HQ').val(_data.prsh_40HQ.split("*")[0])
			$('#remark').val(_data.prsh_remark)
			$('#CBM').val(_data.prsh_CBM)
			$('#KGS').val(_data.prsh_KGS)
			$('#CTNS').val(_data.prsh_CTNS)

//$('#pricesheet_tabel_localcharge').on('search.dt', function (e, settings) {
       		tabel_localcharge.api().search(_data.prsh_port2).draw(); //加载localcharge和truckcharge的默认搜索框 20191017 by daniel
       		table_truckcharge.api().search(_data.prsh_port1).draw();
  //  });
			$('.feeAll0').empty()
			if(feeItemAll0!=""){
				//var feeItemAll0 = _data.prsh_feeItem.split(';')
				var feeItemAll0 = _data.prsh_feeItem.split('||')
				for (var i = 0; i < feeItemAll0.length-1; i++) {
				    var feeItem0 = feeItemAll0[i].split(';')
				    var newid = parseInt(Math.random() * 1000)
				    var _html = '<div class="col-sm-12 feeList0">' +
	                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
	                                            '<select class="no-padding-left no-padding-right margin-right-5" id="feeCurrency" style="width:100px; float: left;"></select>'+
	                                            '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="' + feeItem0[1] + '" placeholder="0" style="width:80px; float: left;">'+
	                                            '<input type="text" class="form-control margin-right-5" id="feebyRT" value="' + feeItem0[2] + '" placeholder="0" style="width:80px; float: left;">'+
	                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" placeholder="0" value="' + feeItem0[3] + '" style="width:80px; float: left;">' +
	                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" placeholder="0" value="' + feeItem0[4] + '" style="width:80px; float: left;">' +
	                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" placeholder="0" value="' + feeItem0[5] + '" style="width:80px; float: left;">' +
	                                            '<select id=' + newid + '  class="carrier no-padding-left no-padding-right" style="width:180px; float: left;"></select>' +
	                                            //'<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="' + feeItem0[4] + '" style="width:100px; float: left;">' +
	                                            '<select id="hangqi" class="margin-right-5" style="width:80px; float: left;" value="' + feeItem0[7] + '">' +
	                                                '<option value="Mon">Mon</option>' +
	                                                '<option value="Tur">Tue</option>' +
	                                                '<option value="Wed">Wed</option>' +
	                                                '<option value="Thu">Thu</option>' +
	                                                '<option value="Fri">Fri</option>' +
	                                                '<option value="Sat">Sat</option>' +
	                                                '<option value="Sun">Sun</option>' +
	                                            '</select>' +
	                                            //'<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="' + feeItem0[5] + '" style="width:100px; float: left;">' +
	                                            '<div class="input-group margin-right-5" style="width:80px; float: left;">' +
	                                                '<input type="text" class="form-control margin-right-5" id="hangcheng" value="' + feeItem0[8] + '" placeholder="0" value="">' +
	                                                '<span class="input-group-addon">Days</span>' +
	                                            '</div>' +
	                                            '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="Ports" value="' + feeItem0[9] + '" style="width:100px; float: left;">' +
	                                            '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
	                                                '<div class="input-group">'+
	                                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem0[10] + '" type="text" data-date-format="yyyy-mm-dd">'+
	                                                     '<span class="input-group-addon">to</span>'+
	                                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem0[11] + '" type="text" data-date-format="yyyy-mm-dd">'+
	                                                '</div>'+
	                                            // '<div class="input-group margin-right-5" style="width:130px; float: left;">' +
	                                            //     '<input class="form-control date-picker" id="id-date-picker-1" value="' + feeItem0[7] + '" type="text" data-date-format="yyyy-mm-dd">' +
	                                            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
	                                            // '</div>' +
	                                            // '<div class="input-group margin-right-5" style="width:130px; float: left;">' +
	                                            //     '<input class="form-control date-picker" id="id-date-picker-2" value="' + feeItem0[8] + '" type="text" data-date-format="yyyy-mm-dd">' +
	                                            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
	                                            '</div>' +
	                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem0[12] + '" style="width:150px; float: left;">' +
	                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
	                                                // '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>' +
	                                                // '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>' +
	                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
	                                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
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
				    $('.feeList0').eq(i).find('#' + newid).html('<option value="' + feeItem0[6] + '">' + feeItem0[6] + '</option>').trigger("change");
				    $('.feeList0').eq(i).find('#feeCurrency').html(_feeUnit);
				    $('.feeList0').eq(i).find('#feeCurrency').val(feeItem0[0]).trigger("change");
				}
			}else{
				var newid = parseInt(Math.random() * 1000)
			    var _html = '<div class="col-sm-12 feeList0">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                                            '<select class="no-padding-left no-padding-right margin-right-5" id="feeCurrency" style="width:100px; float: left;"></select>'+
                                            '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="feebyRT" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" placeholder="0" value="" style="width:80px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" placeholder="0" value="" style="width:80px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" placeholder="0" value="" style="width:80px; float: left;">' +
                                            '<select id=' + newid + '  class="carrier no-padding-left no-padding-right" style="width:180px; float: left;"></select>' +
                                            '<select id="hangqi" class="margin-right-5" style="width:80px; float: left;" value="">' +
                                                '<option value="Mon">Mon</option>' +
                                                '<option value="Tur">Tue</option>' +
                                                '<option value="Wed">Wed</option>' +
                                                '<option value="Thu">Thu</option>' +
                                                '<option value="Fri">Fri</option>' +
                                                '<option value="Sat">Sat</option>' +
                                                '<option value="Sun">Sun</option>' +
                                            '</select>' +
                                            '<div class="input-group margin-right-5" style="width:80px; float: left;">' +
                                                '<input type="text" class="form-control margin-right-5" id="hangcheng" value="" placeholder="0" value="">' +
                                                '<span class="input-group-addon">Days</span>' +
                                            '</div>' +
                                            '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="Ports" value="" style="width:100px; float: left;">' +
                                            '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
                                                '<div class="input-group">'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" value="" type="text" data-date-format="yyyy-mm-dd">'+
                                                     '<span class="input-group-addon">to</span>'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" value="" type="text" data-date-format="yyyy-mm-dd">'+
                                                '</div>'+
                                            '</div>' +
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="" style="width:150px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
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
			    $('.feeList0').eq(0).find('#feeCurrency').html(_feeUnit);
			}

			$('.feeAll').empty()
			if(feeItemAll!=""){
				var feeItemAll = _data.prsh_localChargeItem.split('||')
				for (var i = 0; i < feeItemAll.length - 1; i++) {
				    var feeItem = feeItemAll[i].split(';')
				    var _html = '<div class="col-sm-12 feeList">'+
				    				'<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
				    				'<select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>'+
				    				'<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>'+
				    				'<input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + feeItem[2] + '" style="width:100px; float: left;">'+
	                                '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="' + feeItem[3] + '" placeholder="0" style="width:80px; float: left;">'+
	                                '<input type="text" class="form-control margin-right-5" id="feebyRT" value="' + feeItem[4] + '" placeholder="0" style="width:80px; float: left;">'+
				    				'<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem[5] + '" placeholder="" style="width:100px; float: left;">'+
				    				'<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem[6] + '" placeholder="" style="width:100px; float: left;">'+
				    				'<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem[7] + '" placeholder="" style="width:100px; float: left;">'+
	                                '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
	                                    '<div class="input-group">'+
	                                        '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem[8] + '" type="text" data-date-format="yyyy-mm-dd">'+
	                                         '<span class="input-group-addon">to</span>'+
	                                        '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem[9] + '" type="text" data-date-format="yyyy-mm-dd">'+
	                                    '</div>'+
				    				// '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
				    				// 	'<input class="form-control date-picker" id="id-date-picker-1" type="text" value="' + feeItem[6] + '" data-date-format="yyyy-mm-dd">'+
				    				// 	'<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
				    				// '</div>'+
				    				// '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
				    				// 	'<input class="form-control date-picker" id="id-date-picker-2" type="text" value="' + feeItem[7] + '" data-date-format="yyyy-mm-dd">'+
				    				// 	'<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
				    				'</div>'+
				    				'<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + feeItem[10] + '" placeholder="" style="width:150px; float: left;">'+
				    				'<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
					    				// '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>'+
					    				// '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>'+
	                                    '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
	                                    '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
				    				'</label></div>'
				    $('.feeAll').append(_html)

				    $('.date-picker').datepicker();
				    $('.feeList').eq(i).find('#feeType').html(_feeType)
				    $('.feeList').eq(i).find('#feeType').val(feeItem[0]).trigger("change")
				    $('.feeList').eq(i).find('#feeUnit').html(_feeUnit)
				    $('.feeList').eq(i).find('#feeUnit').val(feeItem[1]).trigger("change")
				}
			}else{
			    var _html = '<div class="col-sm-12 feeList">'+
			    				'<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
			    				'<select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>'+
			    				'<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>'+
			    				'<input type="text" class="form-control margin-right-5" id="feePrice" placeholder="0" value="" style="width:100px; float: left;">'+
                                '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="" placeholder="0" style="width:80px; float: left;">'+
                                '<input type="text" class="form-control margin-right-5" id="feebyRT" value="" placeholder="0" style="width:80px; float: left;">'+
			    				'<input type="text" class="form-control margin-right-5" id="fee20GP" value="" placeholder="" style="width:100px; float: left;">'+
			    				'<input type="text" class="form-control margin-right-5" id="fee40GP" value="" placeholder="" style="width:100px; float: left;">'+
			    				'<input type="text" class="form-control margin-right-5" id="fee40HQ" value="" placeholder="" style="width:100px; float: left;">'+
                                '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
                                    '<div class="input-group">'+
                                        '<input class="form-control date-picker date_select" id="id-date-picker-1" value="" type="text" data-date-format="yyyy-mm-dd">'+
                                         '<span class="input-group-addon">to</span>'+
                                        '<input class="form-control date-picker date_select" id="id-date-picker-2" value="" type="text" data-date-format="yyyy-mm-dd">'+
                                    '</div>'+
			    				'</div>'+
			    				'<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="" placeholder="" style="width:150px; float: left;">'+
			    				'<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                    '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                                    '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
			    				'</label></div>'
			    $('.feeAll').append(_html)
			    $('.date-picker').datepicker();
			    $('.feeList').eq(0).find('#feeType').html(_feeType)
			    $('.feeList').eq(0).find('#feeUnit').html(_feeUnit)
			}

			$('.feeAll2').empty()
			if(feeItemAll2!=""){
				var feeItemAll2 = _data.prsh_truckingChargeItem.split('||')
				for (var i = 0; i < feeItemAll2.length - 1; i++) {
				    var feeItem2 = feeItemAll2[i].split(';')
				    var _html = '<div class="col-sm-12 feeList2">'+
	                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
	                                            '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" value="' + feeItem2[0] + '" style="width:120px; float: left;">' +
	                                            '<select id="feeUnit2" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;"></select>'+
				                                '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="' + feeItem[2] + '" placeholder="0" style="width:80px; float: left;">'+
				                                '<input type="text" class="form-control margin-right-5" id="feebyRT" value="' + feeItem[3] + '" placeholder="0" style="width:80px; float: left;">'+
	                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem2[4] + '" placeholder="" style="width: 100px; float: left;">' +
	                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem2[5] + '" placeholder="" style="width: 100px; float: left;">' +
	                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem2[6] + '" placeholder="" style="width: 100px; float: left;">' +
	                                            '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
	                                                '<div class="input-group">'+
	                                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" type="text" value="' + feeItem2[7] + '" data-date-format="yyyy-mm-dd">'+
	                                                     '<span class="input-group-addon">to</span>'+
	                                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" type="text" value="' + feeItem2[8] + '" data-date-format="yyyy-mm-dd">'+
	                                                '</div>'+
	                                            // '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
	                                            //     '<input class="form-control date-picker" id="id-date-picker-1" type="text" value="' + feeItem2[5] + '" data-date-format="yyyy-mm-dd">' +
	                                            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
	                                            // '</div>'+
	                                            // '<div class="input-group margin-right-5" style="width:130px; float: left;">'+
	                                            //     '<input class="form-control date-picker" id="id-date-picker-2" type="text" value="' + feeItem2[6] + '" data-date-format="yyyy-mm-dd">' +
	                                            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
	                                            '</div>'+
	                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem2[9] + '" style="width:150px; float: left;">' +
	                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
	                                                // '<button type="submit" class="addFee btn btn-blue" style="width:40px;float: left; margin-right:5px;">+</button>'+
	                                                // '<button type="submit" class="removeFee btn btn-blue" style="width:40px;float: left;">-</button>'+
	                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
	                                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
	                                            '</label>'+
	                                        '</div>' 
				    $('.feeAll2').append(_html)

				    $('.date-picker').datepicker();
				    $('.feeList2').eq(i).find('#feeUnit2').html(_feeUnit)
				    $('.feeList2').eq(i).find('#feeUnit2').val(feeItem2[1]).trigger("change")
				}
			}else{
			    var _html = '<div class="col-sm-12 feeList2">'+
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
                                            '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" value="" style="width:120px; float: left;">' +
                                            '<select id="feeUnit2" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;"></select>'+
			                                '<input type="text" class="form-control margin-right-5" id="feebyKgs" value="" placeholder="0" style="width:80px; float: left;">'+
			                                '<input type="text" class="form-control margin-right-5" id="feebyRT" value="" placeholder="0" style="width:80px; float: left;">'+
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="" placeholder="" style="width: 100px; float: left;">' +
                                            '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
                                                '<div class="input-group">'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" type="text" value="" data-date-format="yyyy-mm-dd">'+
                                                     '<span class="input-group-addon">to</span>'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" type="text" value="" data-date-format="yyyy-mm-dd">'+
                                                '</div>'+
                                            '</div>'+
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="" style="width:150px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
                                            '</label>'+
                                        '</div>' 
			    $('.feeAll2').append(_html)

			    $('.date-picker').datepicker();
			    $('.feeList2').eq(0).find('#feeUnit2').html(_feeUnit)
			}

			
			var opt_if = _data.prsh_movetype;
			if(opt_if=="FCL"){         //by daniel 20191015
				$('#feebyKgs,#feebyRT,#labelKgs,#labelRt').css({"display":"none"});
				$('#fee20GP,#fee40GP,#fee40HQ,#label20gp,#label40gp,#label40hq').css({"display":""});
			}else if(opt_if=="AIR"){			
				$('#fee20GP,#fee40GP,#fee40HQ,#feebyRT,#label20gp,#label40gp,#label40hq,#labelRt').css({"display":"none"});
				$('#feebyKgs,#labelKgs').css({"display":""});
			}else{
				$('#fee20GP,#fee40GP,#fee40HQ,#feebyKgs,#label20gp,#label40gp,#label40hq,#labelKgs').css({"display":"none"});
				$('#feebyRT,#labelRt').css({"display":""});
			}
			$("#movementType").attr("disabled","disabled");//修改的时候不能修改这个货物类型。 by daniel 20191015
			$("#toCompany").attr("disabled","disabled");//修改的时候不能修改这个公司。 by daniel 20191015

		}, function(err) {
			console.log(err)
		}, 5000)
	
	} else {
    	hasPermission('1302'); //权限控制：修改费用清单	
	}
	$('tr').on('click', function () { //点击TR即可选择上了。不需要每次都点击那个checkbox, by daniel 20191015
		checkbox_or=$(this).find(':checkbox');
		if(checkbox_or.prop('checked')){
			checkbox_or.prop("checked", false);
		}else{
			checkbox_or.prop("checked", true);
		}
	})

	$('#myModal,#myModal2').on('shown.bs.modal', function () { //非整柜类型询盘不支持导入数据。 by daniel 20191015
		if($("#movementType").val()!="FCL"){
			alert("非整柜类型询盘不支持导入数据。")
			$('#btnSave,#btnSave2').prop("disabled","disabled");
		}else{
			$('#btnSave,#btnSave2').prop("disabled",false);
		}
  	})

	/*下一步*/
	$('#send1').on('click', function () {
		var bt= $(this).attr("id");
		_port1 = $('#port1').val(),
		_port2 = $('#port2').val(),
		_20GP = $('#20GP').val()?($('#20GP').val()+'*'+$('#20GPSel').val()):'*'+$('#20GPSel').val(),
        _40GP = $('#40GP').val()?($('#40GP').val()+'*'+$('#40GPSel').val()):'*'+$('#40GPSel').val(),
        _40HQ = $('#40HQ').val()?($('#40HQ').val()+'*'+$('#40HQSel').val()):'*'+$('#40HQSel').val(),
		_remark = $('#remark').val(),
		_toCompany = $('#toCompany').val(),
		_CBM = $('#CBM').val(),
        _KGS = $('#KGS').val(),
		_CTNS = $('#CTNS').val();
		_movementType = $('#movementType').val();

		var feeData = ''
		if($('.feeList0').length==1 && $('.feeList0').eq(0).find('#feebyKgs').val()=="" && $('.feeList0').eq(0).find('#feebyRT').val()=="" && $('.feeList0').eq(0).find('#fee20GP').val()=="" && $('.feeList0').eq(0).find('#fee40GP').val()=="" && $('.feeList0').eq(0).find('#fee40HQ').val()==""){
			var feeoneData="";
		}else{
			for (var i = 0; i < $('.feeList0').length; i++) {
			    var feeCurrency = $('.feeList0').eq(i).find('#feeCurrency').val()
			    var feebyKgs = $('.feeList0').eq(i).find('#feebyKgs').val()
			    var feebyRT = $('.feeList0').eq(i).find('#feebyRT').val()
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

			    //var feeoneData = fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + carrier + ',' + hangqi + ',' + hangcheng + ',' + zhongzhuang + ',' + useTime1 + ',' + useTime2 + ',' + feeBeizhu + ';'
			    var feeoneData =   feeCurrency + ';'+feebyKgs + ';'+feebyRT + ';'+fee20GP + ';' + fee40GP + ';' + fee40HQ + ';' + carrier + ';' + hangqi + ';' + hangcheng + ';' + zhongzhuang + ';' + useTime1 + ';' + useTime2 + ';' + feeBeizhu + '||'
			    feeData = feeData + feeoneData
			}
		}
		console.log(feeData)

		var localChargeData = ''
		if($('.feeList').length==1 && $('.feeList').eq(0).find('#feebyKgs').val()=="" && $('.feeList').eq(0).find('#feebyRT').val()=="" && $('.feeList').eq(0).find('#fee20GP').val()=="" && $('.feeList').eq(0).find('#fee40GP').val()=="" && $('.feeList').eq(0).find('#fee40HQ').val()==""){
			var feeoneData="";
		}else{
			for (var i = 0; i < $('.feeList').length; i++) {
			    var feeType = $('.feeList').eq(i).find('#feeType').val()
			    var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
			    var feePrice = $('.feeList').eq(i).find('#feePrice').val()
			    var feebyKgs = $('.feeList').eq(i).find('#feebyKgs').val()
			    var feebyRT = $('.feeList').eq(i).find('#feebyRT').val()
			    var fee20GP = $('.feeList').eq(i).find('#fee20GP').val()
			    var fee40GP = $('.feeList').eq(i).find('#fee40GP').val()
			    var fee40HQ = $('.feeList').eq(i).find('#fee40HQ').val()
			    var useTime1 = $('.feeList').eq(i).find('#id-date-picker-1').val()
			    var useTime2 = $('.feeList').eq(i).find('#id-date-picker-2').val()
			    var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()

			    //var feeoneData = feeType + ',' + feeUnit + ',' + feePrice + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + useTime1 + ',' + useTime2 + ',' + feeBeizhu + ';'
			    var feeoneData =  feeType + ';' + feeUnit + ';' + feePrice + ';' + feebyKgs + ';'+feebyRT + ';'+fee20GP + ';' + fee40GP + ';' + fee40HQ + ';' + useTime1 + ';' + useTime2 + ';' + feeBeizhu + '||'
			    localChargeData = localChargeData + feeoneData
			}
		}
		console.log(localChargeData)

		var truckingChargeData = ''
		if($('.feeList2').length==1 && $('.feeList2').eq(0).find('#feebyKgs').val()=="" && $('.feeList2').eq(0).find('#feebyRT').val()=="" && $('.feeList2').eq(0).find('#fee20GP').val()=="" && $('.feeList2').eq(0).find('#fee40GP').val()=="" && $('.feeList2').eq(0).find('#fee40HQ').val()==""){
			var feeoneData="";
		}else{
			for (var i = 0; i < $('.feeList2').length; i++) {
			    var delivery = $('.feeList2').eq(i).find('#delivery').val()
			    var feeUnit = $('.feeList2').eq(i).find('#feeUnit2').val()
			    var feebyKgs = $('.feeList2').eq(i).find('#feebyKgs').val()
			    var feebyRT = $('.feeList2').eq(i).find('#feebyRT').val()
			    var fee20GP = $('.feeList2').eq(i).find('#fee20GP').val()
			    var fee40GP = $('.feeList2').eq(i).find('#fee40GP').val()
			    var fee40HQ = $('.feeList2').eq(i).find('#fee40HQ').val()
			    var useTime1 = $('.feeList2').eq(i).find('#id-date-picker-1').val()
			    var useTime2 = $('.feeList2').eq(i).find('#id-date-picker-2').val()
			    var feeBeizhu = $('.feeList2').eq(i).find('#feeBeizhu').val()

			    //var feeoneData = delivery + ',' + feeUnit + ',' + fee20GP + ',' + fee40GP + ',' + fee40HQ + ',' + useTime1 + ',' + useTime2 + ',' + feeBeizhu + ';'
			    var feeoneData =  delivery + ';' + feeUnit + ';' + feebyKgs + ';'+feebyRT + ';'+fee20GP + ';' + fee40GP + ';' + fee40HQ + ';' + useTime1 + ';' + useTime2 + ';' + feeBeizhu + '||'
			    truckingChargeData = truckingChargeData + feeoneData
			}
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
					'CTNS': _CTNS,
					'movetype':_movementType
				}
				console.log(parm)
				common.ajax_req('POST', false, dataUrl, 'pricesheet.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						comModel("新增成功")
						//location.href = 'pricesheetlist.html';

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
					'CTNS': _CTNS,
					'movetype':_movementType
				}
				
				common.ajax_req('POST', false, dataUrl, 'pricesheet.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						//location.href = 'pricesheetlist.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)				
				
			}
		}
	});

	$('#btnSave0').on('click', function () {
	    $("#remark").val($("input[name='radioList']:checked").val());
	    $("#myRemarkList").modal("hide");
	})

    /*下一步*/
	$('#btnSave').on('click', function () {
	    var feeData = '';
	    $("input[name='checkList']:checked").each(function (i, o) {  
	        var _feeType = $(this).parents("tr").find('.feeType').text();
	        var _feeUnit = $(this).parents("tr").find('.feeUnit').text();
	        var _feePrice = $(this).parents("tr").find('.feePrice').text();
	        var _fee20GP = $(this).parents("tr").find('.fee20GP').text();
	        var _fee40GP = $(this).parents("tr").find('.fee40GP').text();
	        var _fee40HQ = $(this).parents("tr").find('.fee40HQ').text();
	        var _feeUseTime1 = $(this).parents("tr").find('.feeUseTime1').text();
	        var _feeUseTime2 = $(this).parents("tr").find('.feeUseTime2').text();
	        var _feeRemark = $(this).parents("tr").find('.feeRemark').text();
	        var feeoneData = _feeType + ';' + _feeUnit + ';' + _feePrice + ';' + _fee20GP + ';' + _fee40GP + ';' + _fee40HQ + ';' + _feeUseTime1 + ';' + _feeUseTime2 + ';' + _feeRemark + '||'
	        feeData = feeData + feeoneData
	    });
        console.log(feeData.length)
	    if (feeData.length > 0) {
	    	//$('.feeList').find("#fee20GP")==
	    	////////////////////检测复制这条数据得时候，是否有原来未修改的数据，如果有的话，那么就删除，如果已经修改，那么就保留。by daniel 20191015////////////////////////////////////////////////
	    	var z_total=''
	    	for(j=0;j<$('.feeList').find("input").length;j++){
	    		var z=$('.feeList input:eq('+j+')').val();
	    		z_total=z_total+z;
	    	}
	    	if(!z_total){
	    		$('.feeList:eq(0)').remove();
	    	}
	    	////////////////////////////////////////////////////////////////////
	        //alert("你选择的是：" + feeData);
	        //location.href = 'truckingchargeadd.html?action=modify&Id=' + IDS;
	        var feeItemAll = feeData.split('||')
	        for (var i = 0; i < feeItemAll.length - 1; i++) {
	            var feeItem = feeItemAll[i].split(';')
	            var _html = '<div class="col-sm-12 feeList">'+
	            				'<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>'+
	            				'<select id="feeType" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>'+
	            				'<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"></select>'+
	            				'<input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + feeItem[2] + '" style="width:100px; float: left;">'+
	            				'<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem[3] + '" placeholder="" style="width:100px; float: left;">'+
	            				'<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem[4] + '" placeholder="" style="width:100px; float: left;">'+
	            				'<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem[5] + '" placeholder="" style="width:100px; float: left;">'+
                                '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
                                    '<div class="input-group">'+
                                        '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem[6] + '" type="text" data-date-format="yyyy-mm-dd">'+
                                         '<span class="input-group-addon">to</span>'+
                                        '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem[7] + '" type="text" data-date-format="yyyy-mm-dd">'+
                                    '</div>'+
                                '</div>'+
	            				'<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + feeItem[8] + '" placeholder="" style="width:150px; float: left;">'+
	            				'<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">'+
                                    '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                                    '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
	            				'</label>'+
	            			'</div>'
	            $('.feeAll').append(_html)

	            $('.date-picker').datepicker();
	            $('.feeList:last').find('#feeType').html(_feeType)
	            $('.feeList:last').find('#feeType').val(feeItem[0]).trigger("change")
	            $('.feeList:last').find('#feeUnit').html(_feeUnit)
	            $('.feeList:last').find('#feeUnit').val(feeItem[1]).trigger("change")
	        }
	        //$("#checkAll").attr("checked", false)
	        $("input[name='checkList']").attr("checked", false)
	        $("#myModal").modal("hide");
			$("#movementType").attr("disabled","disabled");//添加了这个拖车费后不能修改这个货物类型。 by daniel 20191015
	    } else {
	        alert("请选择要导入的费用!");
	    }
	})

    /*下一步*/
	$('#btnSave2').on('click', function () {
	    var feeData = '';
	    $("input[name='checkList2']:checked").each(function (i, o) {
	        var _feeDelivery = $(this).parents("tr").find('.feeDelivery').text();
	        var _feeUnit = $(this).parents("tr").find('.feeUnit').text();
	        var _fee20GP = $(this).parents("tr").find('.fee20GP').text();
	        var _fee40GP = $(this).parents("tr").find('.fee40GP').text();
	        var _fee40HQ = $(this).parents("tr").find('.fee40HQ').text();
	        var _feeUseTime1 = $(this).parents("tr").find('.feeUseTime1').text();
	        var _feeUseTime2 = $(this).parents("tr").find('.feeUseTime2').text();
	        var _feeRemark = $(this).parents("tr").find('.feeRemark').text();
	        var feeoneData = _feeDelivery + ';' + _feeUnit + ';' + _fee20GP + ';' + _fee40GP + ';' + _fee40HQ + ';' + _feeUseTime1 + ';' + _feeUseTime2 + ';' + _feeRemark + '||'
	        feeData = feeData + feeoneData
	    });
	    if (feeData.length > 0) {
	    	////////////////////检测复制这条数据得时候，是否有原来未修改的数据，如果有的话，那么就删除，如果已经修改，那么就保留。by daniel 20191015////////////////////////////////////////////////
	    	var z_total=''
	    	for(j=0;j<$('.feeList2').find("input").length;j++){
	    		var z=$('.feeList2 input:eq('+j+')').val();
	    		z_total=z_total+z;
	    	}
	    	if(!z_total){
	    		$('.feeList2:eq(0)').remove();
	    	}
	    	////////////////////////////////////////////////////////////////////
	        //alert("你选择的是：" + feeData);
	        //location.href = 'truckingchargeadd.html?action=modify&Id=' + IDS;
	        var feeItemAll2 = feeData.split('||')
	        for (var i = 0; i < feeItemAll2.length - 1; i++) {
	            var feeItem2 = feeItemAll2[i].split(';')
	            var _html = '<div class="col-sm-12 feeList2">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                                            '<input type="text" class="form-control margin-right-5" id="delivery" placeholder="" value="' + feeItem2[0] + '" style="width:120px; float: left;">' +
                                            '<select id="feeUnit2" class="no-padding-left no-padding-right margin-right-5" style="width: 100px; float: left;"></select>' +
                                            '<input type="text" class="form-control margin-right-5" id="fee20GP" value="' + feeItem2[2] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40GP" value="' + feeItem2[3] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" value="' + feeItem2[4] + '" placeholder="" style="width: 100px; float: left;">' +
                                            '<div class="input-group margin-right-5" style="width:220px; float: left;">'+
                                                '<div class="input-group">'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem2[5] + '" type="text" data-date-format="yyyy-mm-dd">'+
                                                     '<span class="input-group-addon">to</span>'+
                                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem2[6] + '" type="text" data-date-format="yyyy-mm-dd">'+
                                                '</div>'+
                                            '</div>' +
                                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem2[7] + '" style="width:150px; float: left;">' +
                                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> '+
                                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>'+
                                            '</label>' +
                                        '</div>'
	            $('.feeAll2').append(_html)

	            $('.date-picker').datepicker();
	            $('.feeList2:last').find('#feeUnit2').html(_feeUnit)
	            $('.feeList2:last').find('#feeUnit2').val(feeItem2[1]).trigger("change")
	        }
	        //$("#checkAll2").attr("checked", false)
	        $("input[name='checkList2']").attr("checked", false)
	        $("#myModal2").modal("hide");
			$("#movementType").attr("disabled","disabled");//添加了这个拖车费后不能修改这个货物类型。 by daniel 20191015
	    } else {
	        alert("请选择要导入的费用!");
	    }
	})

	oTable = initTable();

	rateTable1('', '', '');
	rateTable2('', '', '');
	rateTable3('', '', '');
	$('#load_oceanfreight').on('click', function () {
	    var opt = $("#movementType").val();
	    if (opt == "FCL") {
	        $("#pricesheet_tabel_rate1_wrapper").show();
	        $("#pricesheet_tabel_rate2_wrapper").hide();
	        $("#pricesheet_tabel_rate3_wrapper").hide();
	        $("#pricesheet_tabel_rate1").show();
	        $("#pricesheet_tabel_rate2").hide();
	        $("#pricesheet_tabel_rate3").hide();
	    } else if (opt == "LCL") {
	        $("#pricesheet_tabel_rate1_wrapper").hide();
	        $("#pricesheet_tabel_rate2_wrapper").show();
	        $("#pricesheet_tabel_rate3_wrapper").hide();
	        $("#pricesheet_tabel_rate1").hide();
	        $("#pricesheet_tabel_rate2").show();
	        $("#pricesheet_tabel_rate3").hide();
	    } else if (opt == "AIR") {
	        $("#pricesheet_tabel_rate1_wrapper").hide();
	        $("#pricesheet_tabel_rate2_wrapper").hide();
	        $("#pricesheet_tabel_rate3_wrapper").show();
	        $("#pricesheet_tabel_rate1").hide();
	        $("#pricesheet_tabel_rate2").hide();
	        $("#pricesheet_tabel_rate3").show();
	    }
	    
	})

    /*下一步*/
	$('#btnSaveRate').on('click', function () {
	    var opt = $("#movementType").val();
	    var feeData = '';
	    $("input[name='checkListRate']:checked").each(function (i, o) {
	        feeData = feeData + $(this).val() + '||'
	    });
	    console.log(feeData)
	    if (feeData.length > 0) {
	        var feeItemAll0 = feeData.split('||')
	        for (var i = 0; i < feeItemAll0.length - 1; i++) {
	            var feeItem0 = feeItemAll0[i].split(';')
	            var newid = parseInt(Math.random() * 1000)
	            var _html = ''
	            if (opt == "FCL") {
	                 _html = '<div class="col-sm-12 feeList0">' +
                            '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                            '<select class="no-padding-left no-padding-right margin-right-5" id="feeCurrency" style="width:80px; float: left;"></select>' +
                            //'<input type="text" class="form-control margin-right-5" id="feebyKgs" value="' + feeItem0[1] + '" placeholder="0" style="width:80px; float: left;">' +
                            //'<input type="text" class="form-control margin-right-5" id="feebyRT" value="' + feeItem0[2] + '" placeholder="0" style="width:80px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee20GP" placeholder="0" value="' + feeItem0[1] + '" style="width:80px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee40GP" placeholder="0" value="' + feeItem0[2] + '" style="width:80px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee40HQ" placeholder="0" value="' + feeItem0[3] + '" style="width:80px; float: left;">' +
                            '<select id=' + newid + '  class="carrier no-padding-left no-padding-right" style="width:150px; float: left;"></select>' +
                            //'<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="' + feeItem0[4] + '" style="width:100px; float: left;">' +
                            '<select id="hangqi" class="margin-right-5" style="width:80px; float: left;" value="' + feeItem0[5] + '">' +
                                '<option value="Mon">Mon</option>' +
                                '<option value="Tur">Tue</option>' +
                                '<option value="Wed">Wed</option>' +
                                '<option value="Thu">Thu</option>' +
                                '<option value="Fri">Fri</option>' +
                                '<option value="Sat">Sat</option>' +
                                '<option value="Sun">Sun</option>' +
                            '</select>' +
                            //'<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="' + feeItem0[5] + '" style="width:100px; float: left;">' +
                            '<div class="input-group margin-right-5" style="width:80px; float: left;">' +
                                '<input type="text" class="form-control margin-right-5" id="hangcheng" value="' + feeItem0[6] + '" placeholder="0" value="">' +
                                '<span class="input-group-addon">Days</span>' +
                            '</div>' +
                            '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="Ports" value="' + feeItem0[7] + '" style="width:100px; float: left;">' +
                            '<div class="input-group margin-right-5" style="width:220px; float: left;">' +
                                '<div class="input-group">' +
                                    '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem0[8] + '" type="text" data-date-format="yyyy-mm-dd">' +
                                     '<span class="input-group-addon">to</span>' +
                                    '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem0[9] + '" type="text" data-date-format="yyyy-mm-dd">' +
                                '</div>' +
                            '</div>' +
                            '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem0[10] + '" style="width:150px; float: left;">' +
                            '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                                '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> ' +
                                '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>' +
                            '</label>' +
                        '</div>'
	            }
	            if (opt == "LCL") {
	                _html = '<div class="col-sm-12 feeList0">' +
                           '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                           '<select class="no-padding-left no-padding-right margin-right-5" id="feeCurrency" style="width:80px; float: left;"></select>' +
                           //'<input type="text" class="form-control margin-right-5" id="feebyKgs" value="' + feeItem0[1] + '" placeholder="0" style="width:80px; float: left;">' +
                           '<input type="text" class="form-control margin-right-5" id="feebyRT" value="' + feeItem0[1] + '" placeholder="0" style="width:80px; float: left;">' +
                           '<select id=' + newid + '  class="carrier no-padding-left no-padding-right" style="width:150px; float: left;"></select>' +
                           //'<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="' + feeItem0[4] + '" style="width:100px; float: left;">' +
                           '<select id="hangqi" class="margin-right-5" style="width:80px; float: left;" value="' + feeItem0[3] + '">' +
                               '<option value="Mon">Mon</option>' +
                               '<option value="Tur">Tue</option>' +
                               '<option value="Wed">Wed</option>' +
                               '<option value="Thu">Thu</option>' +
                               '<option value="Fri">Fri</option>' +
                               '<option value="Sat">Sat</option>' +
                               '<option value="Sun">Sun</option>' +
                           '</select>' +
                           //'<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="' + feeItem0[5] + '" style="width:100px; float: left;">' +
                           '<div class="input-group margin-right-5" style="width:80px; float: left;">' +
                               '<input type="text" class="form-control margin-right-5" id="hangcheng" value="' + feeItem0[4] + '" placeholder="0" value="">' +
                               '<span class="input-group-addon">Days</span>' +
                           '</div>' +
                           '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="Ports" value="' + feeItem0[5] + '" style="width:100px; float: left;">' +
                           '<div class="input-group margin-right-5" style="width:220px; float: left;">' +
                               '<div class="input-group">' +
                                   '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem0[6] + '" type="text" data-date-format="yyyy-mm-dd">' +
                                    '<span class="input-group-addon">to</span>' +
                                   '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem0[7] + '" type="text" data-date-format="yyyy-mm-dd">' +
                               '</div>' +
                           '</div>' +
                           '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem0[8] + '" style="width:150px; float: left;">' +
                           '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                               '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> ' +
                               '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>' +
                           '</label>' +
                       '</div>'
	            }
	            if (opt == "AIR") {
	                _html = '<div class="col-sm-12 feeList0">' +
                           '<label for="inputPassword3" class="margin-right-5" style="width:20px; float: left;"></label>' +
                           '<select class="no-padding-left no-padding-right margin-right-5" id="feeCurrency" style="width:80px; float: left;"></select>' +
                           //'<input type="text" class="form-control margin-right-5" id="feebyKgs" value="' + feeItem0[1] + '" placeholder="0" style="width:80px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee45kgs" placeholder="0" value="' + feeItem0[1] + '" style="width:70px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee100kgs" placeholder="0" value="' + feeItem0[2] + '" style="width:70px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee500kgs" placeholder="0" value="' + feeItem0[3] + '" style="width:70px; float: left;">' +
                            '<input type="text" class="form-control margin-right-5" id="fee1000kgs" placeholder="0" value="' + feeItem0[4] + '" style="width:70px; float: left;">' +
                           '<select id=' + newid + '  class="carrier no-padding-left no-padding-right" style="width:150px; float: left;"></select>' +
                           //'<input type="text" class="form-control margin-right-5" id="hangqi" placeholder="" value="' + feeItem0[4] + '" style="width:100px; float: left;">' +
                           '<select id="hangqi" class="margin-right-5" style="width:80px; float: left;" value="' + feeItem0[6] + '">' +
                               '<option value="Mon">Mon</option>' +
                               '<option value="Tur">Tue</option>' +
                               '<option value="Wed">Wed</option>' +
                               '<option value="Thu">Thu</option>' +
                               '<option value="Fri">Fri</option>' +
                               '<option value="Sat">Sat</option>' +
                               '<option value="Sun">Sun</option>' +
                           '</select>' +
                           //'<input type="text" class="form-control margin-right-5" id="hangcheng" placeholder="" value="' + feeItem0[5] + '" style="width:100px; float: left;">' +
                           '<div class="input-group margin-right-5" style="width:80px; float: left;">' +
                               '<input type="text" class="form-control margin-right-5" id="hangcheng" value="' + feeItem0[7] + '" placeholder="0" value="">' +
                               '<span class="input-group-addon">Days</span>' +
                           '</div>' +
                           '<input type="text" class="form-control margin-right-5" id="zhongzhuang" placeholder="Ports" value="' + feeItem0[8] + '" style="width:100px; float: left;">' +
                           '<div class="input-group margin-right-5" style="width:220px; float: left;">' +
                               '<div class="input-group">' +
                                   '<input class="form-control date-picker date_select" id="id-date-picker-1" value="' + feeItem0[9] + '" type="text" data-date-format="yyyy-mm-dd">' +
                                    '<span class="input-group-addon">to</span>' +
                                   '<input class="form-control date-picker date_select" id="id-date-picker-2" value="' + feeItem0[10] + '" type="text" data-date-format="yyyy-mm-dd">' +
                               '</div>' +
                           '</div>' +
                           '<input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" value="' + feeItem0[11] + '" style="width:150px; float: left;">' +
                           '<label for="inputPassword3" class="margin-right-5" style="width:100px; float: left;">' +
                               '<a class="addFee btn btn-info"><i class="fa fa-plus-circle"></i></a> ' +
                               '<a class="removeFee btn btn-danger"><i class="fa fa-times-circle"></i></a>' +
                           '</label>' +
                       '</div>'
	            }

	            $('.feeAll0').prepend(_html)

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
	            $('.date-picker').datepicker();
	            $('.feeList0:first').find('#feeCurrency').html(_feeUnit);
	            $('.feeList0:first').find('#feeCurrency').val(feeItem0[0]).trigger("change"); 
	            if (opt == "FCL") {
	                $('.feeList0:first').find('#hangqi').val(feeItem0[5]).trigger("change");
	                $('.feeList0:first').find('#' + newid).html('<option value="' + feeItem0[4] + '">' + feeItem0[4] + '</option>').trigger("change");
	            }
	            if (opt == "LCL") {
	                $('.feeList0:first').find('#hangqi').val(feeItem0[3]).trigger("change");
	                $('.feeList0:first').find('#' + newid).html('<option value="' + feeItem0[2] + '">' + feeItem0[2] + '</option>').trigger("change");
	            }
	            if (opt == "AIR") {
	                $('.feeList0:first').find('#hangqi').val(feeItem0[6]).trigger("change");
	                $('.feeList0:first').find('#' + newid).html('<option value="' + feeItem0[5] + '">' + feeItem0[5] + '</option>').trigger("change");
	            }

	        }
	        $("input[name='checkListRate']").attr("checked", false)
	        $("#myModal3").modal("hide");
	        $("#movementType").attr("disabled", "disabled");
	    } else {
	        alert("请选择要导入的费用!");
	    }
	})
	
})


/**
 * 备注表格初始化
 * @returns {*|jQuery}
 */
function initTable() {

    var table = $("#pricesheet_tabel_remark").dataTable({
        "sAjaxSource": dataUrl + 'ajax/remark.ashx?action=read&companyId=' + companyID,
        //"bLengthChange": false,
        //'bPaginate': false,
        //"iDisplayLength": 10,
        //"aLengthMenu": [[100, 500], ["100", "500"]],//二组数组，第一组数量，第二组说明文字;
        //"aaSorting": [[7, 'desc']],
        "aoColumnDefs": [//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            { "bSortable": false, "aTargets": [0] }
        ],
        "ordering": false,
        //		"bDestory": true,
        //		"bRetrieve": true,
        //		"bFilter": false,
        //"bSort": false,
        //"aaSorting": [[ 0, "desc" ]],
        //"stateSave": false,  //保存表格动态
        //"columnDefs":[{
        //    "targets": [ 0 ], //隐藏第0列，从第0列开始   
        //    "visible": false
        //}],
        "aoColumns": [
            				{
            				    "mDataProp": "rema_id",
            				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				        $(nTd).html("<input type='radio' name='radioList' value='" + oData.rema_content + "'>");
            				    }
            				},
           { "mDataProp": "rema_type" },
            			{
            			    "mDataProp": "rema_content",
            			    "createdCell": function (td, cellData, rowData, row, col) {
            			        $(td).html(rowData.rema_content.replace(/\n/g, '<br/>'));
            			    }
            			},
            {
                "mDataProp": "rema_time",
                "createdCell": function (td, cellData, rowData, row, col) {
                    if (rowData.rema_time != null) {
                        $(td).html(rowData.rema_time.substring(0, 10));
                    } else {
                        $(td).html("NULL");
                    }
                }
            },

        ],
        //		"bProcessing": true,
        //		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
        //		"sPaginationType": "bootstrap",

        "oLanguage": {
            //			"sUrl": "js/zh-CN.txt"
            //			"sSearch": "快速过滤："
            "sProcessing": "正在加载数据，请稍后...",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": get_lan('nodata'),
            "sEmptyTable": "表中无数据存在！",
            "sInfo": get_lan('page'),
            "sInfoEmpty": "显示0到0条记录",
            "sInfoFiltered": "数据表中共有 _MAX_ 条记录",
            //"sInfoPostFix": "",
            "sSearch": get_lan('search'),
            //"sUrl": "",
            //"sLoadingRecords": "载入中...",
            //"sInfoThousands": ",",
            "oPaginate": {
                "sFirst": get_lan('first'),
                "sPrevious": get_lan('previous'),
                "sNext": get_lan('next'),
                "sLast": get_lan('last'),
            }
            //"oAria": {
            //    "sSortAscending": ": 以升序排列此列",
            //    "sSortDescending": ": 以降序排列此列"
            //}
        }
    });

    return table;
}

	var _dataArrs=[];
    //本地费用
	common.ajax_req("get", false, dataUrl, "localcharge.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    var _data = data.data;
	    //var _dataArrs=[];
	    console.log(_data)
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var feeItemAll = _data[i].loch_feeItem.split(';')
	            for (var j = 0; j < feeItemAll.length - 1; j++) {
	                var feeItem = feeItemAll[j].split(',')
	                // var _html = '<tr class="feelist">'+
	                // 				'<td><input type="checkbox" name="checkList" value="' + _data[i].loch_id + '" id="' + _data[i].loch_id + '"></td>'+
	                // 				'<td class="lochtype">' + _data[i].loch_type + '</td>'+
	                // 				'<td class="lochport1">' + _data[i].loch_port1 + '</td>'+
	                // 				'<td class="feeType">' + feeItem[0] + '</td>'+
	                // 				'<td class="feeUnit">' + feeItem[1] + '</td>'+
	                // 				'<td class="feePrice">' + feeItem[2] + '</td>'+
	                // 				'<td class="fee20GP">' + feeItem[3] + '</td>'+
	                // 				'<td class="fee40GP">' + feeItem[4] + '</td>'+
	                // 				'<td class="fee40HQ">' + feeItem[5] + '</td>'+
	                // 				'<td><span class="feeUseTime1">' + _data[i].loch_useTime1.substring(0, 10) + '</span> <i class="fa fa-long-arrow-right"></i> <span class="feeUseTime2">' + _data[i].loch_useTime2.substring(0, 10) + '</span></td>'+
	                // 				'<td class="feeRemark">' + feeItem[6] + '</td>'+
	                // 			'</tr>'
	                //$('.localChargeItem').append(_html)
					var _dataArr = {
						"loch_id": _data[i].loch_id,
						"loch_type": _data[i].loch_type,
						"loch_port1":_data[i].loch_port1,
						"feeType":feeItem[0],
						"feeUnit":feeItem[1],
						"feePrice":feeItem[2],
						"fee20GP":feeItem[3],
						"fee40GP":feeItem[4],
						"fee40HQ":feeItem[5],
						"feeUseTime1":_data[i].loch_useTime1.substring(0, 10),
						"feeUseTime2":_data[i].loch_useTime1.substring(0, 10),
						"feeRemark":feeItem[6]
					};
					_dataArrs.push(_dataArr);
	            }
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)


	var tabel_localcharge=$('#pricesheet_tabel_localcharge').dataTable({
		data:_dataArrs,
		"bSort": false,
		// "search": {
		//     "search": ($("#port1").val())
		//  },
		"aoColumns": [
			{ "mDataProp": "loch_id",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td><input type="checkbox" name="checkList" value="' + cellData + '" id="' + cellData + '"></td>');
				}
			},
			{ "mDataProp": "loch_type",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="lochtype">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "loch_port1",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="loch_port1">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "feeType" ,
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feeType">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "feeUnit",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feeUnit">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "feePrice",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feePrice">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "fee20GP",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="fee20GP">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "fee40GP",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="fee40GP">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "fee40HQ",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="fee40HQ">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "feeUseTime1",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td><span class="feeUseTime1">' + rowData.feeUseTime1.substring(0, 10) + '</span> <i class="fa fa-long-arrow-right"></i> <span class="feeUseTime2">'  + rowData.feeUseTime2.substring(0, 10)+'</span></td>');
				}
			},
			{ "mDataProp": "feeRemark",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feeRemark">'+cellData+'</td>');
				}
			}
		]
	});

    //拖车费用
	var _dataArrs2=[];
	common.ajax_req("get", false, dataUrl, "truckingcharge.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            // var _html = '<tr class="feelist">'+
	            // 				'<td><input type="checkbox" name="checkList2" value="' + _data[i].trch_id + '" id="' + _data[i].trch_id + '"></td>'+
	            // 				'<td class="feeDelivery">' + _data[i].trch_delivery + '</td>'+
	            // 				'<td class="feeUnit">' + _data[i].trch_feeUnit + '</td>'+
	            // 				'<td class="fee20GP">' + _data[i].trch_20GP + '</td>'+
	            // 				'<td class="fee40GP">' + _data[i].trch_40GP + '</td>'+
	            // 				'<td class="fee40HQ">' + _data[i].trch_40HQ + '</td>'+
	            // 				'<td><span class="feeUseTime1">' + _data[i].trch_useTime1.substring(0, 10) + '</span> <i class="fa fa-long-arrow-right"></i> <span class="feeUseTime2">' + _data[i].trch_useTime2.substring(0, 10) + '</span></td>'+
	            // 				'<td class="feeRemark">' + _data[i].trch_remark + '</td>'+
	            // 			'</tr>'
	            // $('.truckingChargeItem').append(_html)
				var _dataArr2 = {
					"trch_id": _data[i].trch_id,
					"trch_delivery": _data[i].trch_delivery,
					"trch_feeUnit":_data[i].trch_feeUnit,
					"trch_port":_data[i].trch_port,
					"trch_20GP":_data[i].trch_20GP,
					"trch_40GP":_data[i].trch_40GP,
					"trch_40HQ":_data[i].trch_40HQ,
					"trch_useTime1":_data[i].trch_useTime1.substring(0, 10),
					"trch_useTime2":_data[i].trch_useTime2.substring(0, 10),
					"trch_remark":_data[i].trch_remark
				};
				_dataArrs2.push(_dataArr2);
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

	var table_truckcharge=$('#pricesheet_tabel_truckcharge').dataTable({
		data:_dataArrs2,
		"bSort": false,
		"aoColumns": [
			{ "mDataProp": "trch_id",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td><input type="checkbox" name="checkList2" value="' + cellData + '" id="' + cellData + '"></td>');
				}
			},
			{ "mDataProp": "trch_delivery",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feeDelivery">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "trch_port" ,
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td>'+cellData+'</td>');
				}
			},
			{ "mDataProp": "trch_feeUnit",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feeUnit">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "trch_20GP",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="fee20GP">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "trch_40GP",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="fee40GP">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "trch_40HQ",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="fee40HQ">'+cellData+'</td>');
				}
			},
			{ "mDataProp": "trch_useTime1",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td><span class="feeUseTime1">' + rowData.trch_useTime1.substring(0, 10) + '</span> <i class="fa fa-long-arrow-right"></i> <span class="feeUseTime2">'  + rowData.trch_useTime2.substring(0, 10)+'</span></td>');
				}
			},
			{ "mDataProp": "trch_remark",
				"createdCell": function (td, cellData, rowData, row, col) {
			    	$(td).html('<td class="feeRemark">'+cellData+'</td>');
				}
			}
		]
	});


	function rateTable1(port1, port2, usetime) {
	    var ajaxUrl, tableTitle, columns
	    ajaxUrl = dataUrl + 'ajax/rate.ashx?action=read&companyId=' + companyID + '&port1=' + port1 + '&port2=' + port2 + '&movementType=FCL'
	    console.log(ajaxUrl)
	    tableTitle = '<th></th><th>企业</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>20\'GP</th><th>40\'GP</th><th>40\'HQ</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th>'
	    $('.tableTitle1').html(tableTitle)
	    columns = [
                        				{
                        				    "mDataProp": "rate_id",
                        				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        				        $(nTd).html("<input type='checkbox' name='checkListRate' value='" + oData.rate_numUnit + ';' + oData.rate_20GP + ';' + oData.rate_40GP + ';' + oData.rate_40HQ + ';' + oData.rate_carrier + ';' + oData.rate_schedule + ';' + oData.rate_voyage + ';' + oData.rate_transit + ';' + oData.rate_time1.substring(0, 10) + ';' + oData.rate_time2.substring(0, 10) + ';' + oData.rate_beizhu + "'>");
                        				    }
                        				},
                                                    {
                                                        "mDataProp": "comp_code",
                                                        "createdCell": function (td, cellData, rowData, row, col) {
                                                            if (cellData) {
                                                                $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                                                            }
                                                        }
                                                    },
            {
                "mDataProp": "rate_port1",
                "mRender": function (data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                    return (full.rate_port1 + " <i class='fa fa-long-arrow-right'></i></br> " + full.rate_port2)
                }
            },
            //{ "mDataProp": "rate_port2"},
            {
                "mDataProp": "rate_20GP",
                "createdCell": function (td, cellData, rowData, row, col) {
                    $(td).html(rowData.rate_numUnit + rowData.rate_20GP);
                }
            },
            {
                "mDataProp": "rate_40GP",
                "createdCell": function (td, cellData, rowData, row, col) {
                    $(td).html(rowData.rate_numUnit + rowData.rate_40GP);
                }
            },
            {
                "mDataProp": "rate_40HQ",
                "createdCell": function (td, cellData, rowData, row, col) {
                    $(td).html(rowData.rate_numUnit + rowData.rate_40HQ);
                }
            },
            { "mDataProp": "rate_carrier" },
            { "mDataProp": "rate_schedule" },
            { "mDataProp": "rate_voyage" },
            { "mDataProp": "rate_transit" },
            {
                "mDataProp": "rate_time2",
                "createdCell": function (td, cellData, rowData, row, col) {
                    if (rowData.rate_time1 != null) {
                        $(td).html(rowData.rate_time1.substring(0, 10) + '<br/>' + rowData.rate_time2.substring(0, 10));
                    } else {
                        $(td).html("NULL");
                    }
                }
            },
	    ]
        , aoColumnDefs = [//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            { "bSortable": false, "aTargets": [0, 8, 5, 6, 7] }
        ]
        , _aaSorting = [[9, 'desc']]

	    var table = $("#pricesheet_tabel_rate1").dataTable({
	        //"iDisplayLength":10,
	        //"searching": false, //去掉搜索框 
	        "sAjaxSource": ajaxUrl,
	        //		'bPaginate': true,
	        //		"bDestory": true,
	        //		"bRetrieve": true,
	        //		"bFilter": false,
	        "bLengthChange": false,
	        //		"bSort": true,
	        //		"aaSorting": [[ 9, "desc" ]],
	        //		"bProcessing": true,
	        "aoColumns": columns,
	        "aoColumnDefs": aoColumnDefs,
	        "aaSorting": _aaSorting,
	        //		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	        //		"sPaginationType": "bootstrap",
	        "oLanguage": {
	            //			"sUrl": "js/zh-CN.txt"
	            //			"sSearch": "快速过滤："
	            "sProcessing": "正在加载数据，请稍后...",
	            "sLengthMenu": "每页显示 _MENU_ 条记录",
	            "sZeroRecords": get_lan('nodata'),
	            "sEmptyTable": "表中无数据存在！",
	            "sInfo": get_lan('page'),
	            "sInfoEmpty": "显示0到0条记录",
	            "sInfoFiltered": "数据表中共有 _MAX_ 条记录",
	            //"sInfoPostFix": "",
	            "sSearch": get_lan('search'),
	            //"sUrl": "",
	            //"sLoadingRecords": "载入中...",
	            //"sInfoThousands": ",",
	            "oPaginate": {
	                "sFirst": get_lan('first'),
	                "sPrevious": get_lan('previous'),
	                "sNext": get_lan('next'),
	                "sLast": get_lan('last'),
	            }
	            //"oAria": {
	            //    "sSortAscending": ": 以升序排列此列",
	            //    "sSortDescending": ": 以降序排列此列"
	            //}
	        },
	        "drawCallback": function () {
	            $('[data-toggle="popover"]').popover();
	        }
	    });

	    return table;
	}

	function rateTable2(port1, port2, usetime) {
	    var ajaxUrl, tableTitle, columns
	    ajaxUrl = dataUrl + 'ajax/rate.ashx?action=read&companyId=' + companyID + '&movementType=LCL'
	    tableTitle = '<th></th><th>企业</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>价格(USD/RT)</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th>'
	    $('.tableTitle2').html(tableTitle)
	    columns = [
                        				{
                        				    "mDataProp": "rate_id",
                        				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        				        $(nTd).html("<input type='checkbox' name='checkListRate' value='" + oData.rate_numUnit + ';' + oData.rate_20GP + ';' + oData.rate_carrier + ';' + oData.rate_schedule + ';' + oData.rate_voyage + ';' + oData.rate_transit + ';' + oData.rate_time1.substring(0, 10) + ';' + oData.rate_time2.substring(0, 10) + ';' + oData.rate_beizhu + "'>");
                        				    }
                        				},
                                         {
                                             "mDataProp": "comp_code",
                                             "createdCell": function (td, cellData, rowData, row, col) {
                                                 if (cellData) {
                                                     $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                                                 }
                                             }
                                         },
             {
                 "mDataProp": "rate_port1",
                 "mRender": function (data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                     return (full.rate_port1 + " <i class='fa fa-long-arrow-right'></i></br> " + full.rate_port2)
                 }
             },
             //{ "mDataProp": "rate_port2"},
             {
                 "mDataProp": "rate_20GP",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     $(td).html(rowData.rate_numUnit + rowData.rate_20GP);
                 }
             },
             { "mDataProp": "rate_carrier" },
             { "mDataProp": "rate_schedule" },
             { "mDataProp": "rate_voyage" },
             { "mDataProp": "rate_transit" },
             {
                 "mDataProp": "rate_time2",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     if (rowData.rate_time1 != null) {
                         $(td).html(rowData.rate_time1.substring(0, 10) + '<br/>' + rowData.rate_time2.substring(0, 10));
                     } else {
                         $(td).html("NULL");
                     }
                 }
             },
	    ]
         , aoColumnDefs = [//设置列的属性，此处设置第一列不排序
             //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
             { "bSortable": false, "aTargets": [0, 1, 3, 4, 5, 6] }
         ]
         , _aaSorting = [[7, 'desc']]

	    var table = $("#pricesheet_tabel_rate2").dataTable({
	        //"iDisplayLength":10,
	        //"searching": false, //去掉搜索框 
	        "sAjaxSource": ajaxUrl,
	        //		'bPaginate': true,
	        //		"bDestory": true,
	        //		"bRetrieve": true,
	        //		"bFilter": false,
	        "bLengthChange": false,
	        //		"bSort": true,
	        //		"aaSorting": [[ 9, "desc" ]],
	        //		"bProcessing": true,
	        "aoColumns": columns,
	        "aoColumnDefs": aoColumnDefs,
	        "aaSorting": _aaSorting,
	        //		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	        //		"sPaginationType": "bootstrap",
	        "oLanguage": {
	            //			"sUrl": "js/zh-CN.txt"
	            //			"sSearch": "快速过滤："
	            "sProcessing": "正在加载数据，请稍后...",
	            "sLengthMenu": "每页显示 _MENU_ 条记录",
	            "sZeroRecords": get_lan('nodata'),
	            "sEmptyTable": "表中无数据存在！",
	            "sInfo": get_lan('page'),
	            "sInfoEmpty": "显示0到0条记录",
	            "sInfoFiltered": "数据表中共有 _MAX_ 条记录",
	            //"sInfoPostFix": "",
	            "sSearch": get_lan('search'),
	            //"sUrl": "",
	            //"sLoadingRecords": "载入中...",
	            //"sInfoThousands": ",",
	            "oPaginate": {
	                "sFirst": get_lan('first'),
	                "sPrevious": get_lan('previous'),
	                "sNext": get_lan('next'),
	                "sLast": get_lan('last'),
	            }
	            //"oAria": {
	            //    "sSortAscending": ": 以升序排列此列",
	            //    "sSortDescending": ": 以降序排列此列"
	            //}
	        },
	        "drawCallback": function () {
	            $('[data-toggle="popover"]').popover();
	        }
	    });

	    return table;
	}

	function rateTable3(port1, port2, usetime) {
	    var ajaxUrl, tableTitle, columns
	    ajaxUrl = dataUrl + 'ajax/rate.ashx?action=read&companyId=' + companyID + '&movementType=AIR'
	    tableTitle = '<th></th><th>企业</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>45+(kgs)</th><th>100+(kgs)</th><th>500+(kgs)</th><th>1000+(kgs)</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th>'
	    $('.tableTitle3').html(tableTitle)
	    columns = [
                        				{
                        				    "mDataProp": "rate_id",
                        				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        				        $(nTd).html("<input type='checkbox' name='checkListRate' value='" + oData.rate_numUnit + ';' + oData.rate_20GP + ';' + oData.rate_40GP + ';' + oData.rate_40HQ + ';' + oData.rate_1000kgs + ';' + oData.rate_carrier + ';' + oData.rate_schedule + ';' + oData.rate_voyage + ';' + oData.rate_transit + ';' + oData.rate_time1.substring(0, 10) + ';' + oData.rate_time2.substring(0, 10) + ';' + oData.rate_beizhu + "'>");
                        				    }
                        				},
                                                 {
                                                     "mDataProp": "comp_code",
                                                     "createdCell": function (td, cellData, rowData, row, col) {
                                                         if (cellData) {
                                                             $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                                                         }
                                                     }
                                                 },
             {
                 "mDataProp": "rate_port1",
                 "mRender": function (data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                     return (full.rate_port1 + " <i class='fa fa-long-arrow-right'></i></br> " + full.rate_port2)
                 }
             },
             //{ "mDataProp": "rate_port2"},
             {
                 "mDataProp": "rate_20GP",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     $(td).html(rowData.rate_numUnit + rowData.rate_20GP);
                 }
             },
             {
                 "mDataProp": "rate_40GP",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     $(td).html(rowData.rate_numUnit + rowData.rate_40GP);
                 }
             },
             {
                 "mDataProp": "rate_40HQ",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     $(td).html(rowData.rate_numUnit + rowData.rate_40HQ);
                 }
             },
             {
                 "mDataProp": "rate_1000kgs",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     $(td).html(rowData.rate_numUnit + rowData.rate_1000kgs);
                 }
             },
             { "mDataProp": "rate_carrier" },
             { "mDataProp": "rate_schedule" },
             { "mDataProp": "rate_voyage" },
             { "mDataProp": "rate_transit" },
             {
                 "mDataProp": "rate_time2",
                 "createdCell": function (td, cellData, rowData, row, col) {
                     if (rowData.rate_time1 != null) {
                         $(td).html(rowData.rate_time1.substring(0, 10) + '<br/>' + rowData.rate_time2.substring(0, 10));
                     } else {
                         $(td).html("NULL");
                     }
                 }
             },
	    ]
         , aoColumnDefs = [//设置列的属性，此处设置第一列不排序
             //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
             { "bSortable": false, "aTargets": [0, 1, 6, 7, 8, 9] }
         ]
         , _aaSorting = [[10, 'desc']]

	    var table = $("#pricesheet_tabel_rate3").dataTable({
	        //"iDisplayLength":10,
	        //"searching": false, //去掉搜索框 
	        "sAjaxSource": ajaxUrl,
	        //		'bPaginate': true,
	        //		"bDestory": true,
	        //		"bRetrieve": true,
	        //		"bFilter": false,
	        "bLengthChange": false,
	        //		"bSort": true,
	        //		"aaSorting": [[ 9, "desc" ]],
	        //		"bProcessing": true,
	        "aoColumns": columns,
	        "aoColumnDefs": aoColumnDefs,
	        "aaSorting": _aaSorting,
	        //		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	        //		"sPaginationType": "bootstrap",
	        "oLanguage": {
	            //			"sUrl": "js/zh-CN.txt"
	            //			"sSearch": "快速过滤："
	            "sProcessing": "正在加载数据，请稍后...",
	            "sLengthMenu": "每页显示 _MENU_ 条记录",
	            "sZeroRecords": get_lan('nodata'),
	            "sEmptyTable": "表中无数据存在！",
	            "sInfo": get_lan('page'),
	            "sInfoEmpty": "显示0到0条记录",
	            "sInfoFiltered": "数据表中共有 _MAX_ 条记录",
	            //"sInfoPostFix": "",
	            "sSearch": get_lan('search'),
	            //"sUrl": "",
	            //"sLoadingRecords": "载入中...",
	            //"sInfoThousands": ",",
	            "oPaginate": {
	                "sFirst": get_lan('first'),
	                "sPrevious": get_lan('previous'),
	                "sNext": get_lan('next'),
	                "sLast": get_lan('last'),
	            }
	            //"oAria": {
	            //    "sSortAscending": ": 以升序排列此列",
	            //    "sSortDescending": ": 以降序排列此列"
	            //}
	        },
	        "drawCallback": function () {
	            $('[data-toggle="popover"]').popover();
	        }
	    });

	    return table;
	}
