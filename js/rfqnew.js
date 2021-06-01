//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2": "询盘管理中心",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "RFQ Management",
        };

$(function(){
	hasPermission('1501'); //权限控制：新增询盘
	this.title = get_lan('nav_7_1') 	
	$('.navli7').addClass("active open")
	$('.rfq0').addClass("active")
	$('#title1').text(get_lan('nav_7_1'))
	$('#title2').text(get_lan('nav_7_1'))

	var action = GetQueryString('action');

	var incoterm;

	//贸易条款
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 3,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#incoterm').append(_html)
		}
		$("#incoterm").val('FOB').trigger("change")
	}, function(error) {
		console.log(parm)
	}, 1000)

	$("#incoterm").change(function() {
		var opt = $("#incoterm").val();
		if(opt!='FOB'){
			$("#rfqOthers").removeClass('none')
		}
		else{
			$("#rfqOthers").addClass('none')
		}
	})

	$("input[type=radio][name=rfqShowPlace]").change(function() {
		if(this.value=="1"){
			//自动加载填写人的信息到联系方式上。
			$("#rfqContact").val();
		}else{
			//选回是企业内的话，自动加载在联系方式上的信息就全部清空。
		}
	})

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
	
	//运输方式
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 7,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			//var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
		    var _html = '<div class="radio" style="float:left;margin-right:20px;"><label><input name="rfqMovementType" id="rfqMovementType" type="radio" class="colored-blue" value="' + _data[i].puda_name_en + '"><span class="text" style="margin-left: -20px;">' + _data[i].puda_name_en + '</span></div>'
			$('#movementType').append(_html)
		}
		$('input[name="rfqMovementType"]:eq(0)').attr('checked', 'true');
	}, function(error) {
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
			$('#container').append(_html)					
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	

	//港口
	$("#inputPol,#inputPod").select2({
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
		placeholder: '请选择港口', //默认文字提示
		language: "zh-CN",
		tags: true, //允许手动添加
		allowClear: true, //允许清空
        //templateResult: formatState,
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


	/*下一步*/
	$('#send1').on('click', function() {
	    var typeId = $("input[name='rfqShowPlace']:checked").val(),
        incoterm = $('#incoterm').val(),
        port1 = $('#inputPol').val(),
        port2 = $('#inputPod').val(),
        fromAddress = $('#inputPortReceipt').val(),
        toAddress = $('#inputPortDelivery').val(),
        okTime = $('#cargoReadyTime').val(),
        packageNum = $('#grossWeight').val(),
        weightNum = $('#volumeCbm').val(),
        volumeNum = $('#packageCartons').val(),
        package = packageNum + ' CARTONS',
        weight = weightNum + ' KGS',
        volume = volumeNum + ' CBM',
	    container = $('#container').val(),
	    goodsNum = $('#containerNum').val() + ' ' + container,
        remark = HtmlEncode($('#inputCompanyContent').val()),
        goods = $('#cargoName').val(),
        customsCode = $('#hscode').val(),
        movementType = $('input[name="rfqMovementType"]:checked').val(),
	    contactCompany = $('#rfqCompany').val(),
	    contact = $('#rfqContact').val(),
	    contactPhone = $('#rfqTel').val(),
	    contactEmail = $('#rfqEmail').val(),
	    contactCountry = $('#rfqCountry').val()

        var isCustoms = 0;
        if ($("#rfqNeedCustoms").is(":checked")) {
            isCustoms = 1
        } else {
            isCustoms = 0
        }

        var isInsurance = 0;
        if ($("#rfqNeedInsurance").is(":checked")) {
            isInsurance = 1
        } else {
            isInsurance = 0
        }

        var isWarehouse = 0;
        if ($("#rfqNeedWarehouse").is(":checked")) {
            isWarehouse = 1
        } else {
            isWarehouse = 0
        }

        if (action == 'add') {
            if (port1 == '') {
                comModel("请选择港口")
            } else if (port2 == '') {
                comModel("请选择港口")
            } else {
                var parm = {
                    'typeId': typeId,
                    'companyId': companyID,
                    'userId': userID,
                    'movementType': movementType,
                    'incoterm': incoterm,
                    'port1': port1,
                    'port2': port2,
                    'fromAddress': fromAddress,
                    'toAddress': toAddress,
                    'okTime': okTime,
                    'package': package,
                    'weight': weight,
                    'volume': volume,
                    'goodsNum': goodsNum,
                    'goods': goods,
                    'customsCode': customsCode,
                    'remark': remark,
                    'isCustoms': isCustoms,
                    'isInsurance': isInsurance,
                    'isWarehouse': isWarehouse,
                    'contactCompany': contactCompany,
                    'contact': contact,
                    'contactPhone': contactPhone,
                    'contactEmail': contactEmail,
                    'contactCountry': contactCountry
                }
                //console.log(parm)
                //return false
                common.ajax_req('POST', false, dataUrl, 'rfqinfo.ashx?action=new', parm, function (data) {
                    if (data.State == 1) {
                        //console.log(parm)
                        comModel("新增成功")
                        if (typeId == 1) {
                            location.href = 'rfqincompany.html';
                        }else if (typeId == 2) {
                            location.href = 'rfqoutcompany.html';
                        }

                    } else {
                        comModel("新增失败")
                    }
                }, function (error) {
                    console.log(parm)
                }, 2000)
            }

        }

	});

	
})



