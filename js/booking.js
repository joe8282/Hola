//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "订舱列表", 
            "con_top_4" : "订单列表", 
            "con_top_5" : "确认订舱", 
            "con_top_6": "费用管理",
            "con_top_7": "打印管理",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENT",   
            "con_top_3" : "Booking List",    
            "con_top_4" : "Order List",  
            "con_top_6": "FEE MANAGEMENT",
            "con_top_7": "PRINT MANAGEMENT",
        };

var fromId = '0';
var sellId,luruId,kefuId,caozuoId;
var _getSellNameArr = new Array();

if(GetQueryString('fromId')!=null){
	fromId=GetQueryString('fromId')
	$('.book1').addClass("active")	
}else{
	$('.book3').addClass("active")	
}

var oTable;
$(document).ready(function() {
	this.title = get_lan('con_top_4') 
	$('.navli3').addClass("active open")	
	$('#title1').text(get_lan('con_top_4'))
	$('#title2').text(get_lan('con_top_4')) 

	oTable = initTable(fromId);
	$('#summernote,#cancel_summernote').summernote({
	toolbar: [
	    // [groupName, [list of button]]
	    ['style', ['bold', 'italic', 'underline']],
	    ['fontsize', ['fontsize']],
	    ['color', ['color']],
	    ['para', ['ul', 'ol', 'paragraph']],
	    ['height', ['height']]
  	]
	});
	//$('#example').colResizable();
	$("#ishbl").attr("checked", false);
 	$('#ishbl').on('click', function() {
 		if($(this).prop('checked')){
 			$('#orderHblLi').attr("disabled",false);
 		}else{
 			$('#orderHblLi').attr("disabled",true);
 		}
 	})

 	//获取销售人员的名字
	common.ajax_req("get", false, dataUrl, "userinfo.ashx?action=read", {
		"companyId": companyID
	}, function(data) {
		//console.log(data.Data)
		//初始化信息
		var _data = data.data
		for(var i = 0; i < _data.length; i++) {
			//var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' - '+_data[i].puda_name_en+'</option>';
			//$('#feeItem').append(_html)
			//_feeItem=_feeItem+_html
            _getSellNameArr.push(_data[i].usin_id+';'+_data[i].usin_name)
		}
	}, function(error) {
	}, 1000)


 	//common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
 	//	"companyId": companyID,
 	//	"comp_isSupplier": 1
 	//}, function(data) {
 	//	var _data = data.data;
 	//	$('#crmCarrierSupplier').empty();
 	//			$('#crmCarrierSupplier').append('<option value="0">Select Company</option>')
 	//	if(_data != null) {
 	//		for(var i = 0; i < _data.length; i++) {
 	//			var _html = '<option value="' + _data[i].comp_id + '" data-crmcompId="'+_data[i].comp_id+'">' + _data[i].comp_name + '</option>';
 	//			$('#crmCarrierSupplier').append(_html)
 	//		}
 	//	}
 	//}, function(err) {
 	//	console.log(err)
 	//}, 2000)

    //
	$("#crmCarrierSupplier").select2({
	    ajax: {
	        url: dataUrl + "ajax/crmcompany.ashx?action=read&companyId=" + companyID + "&comp_isSupplier=1",
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
	                    "id": users[i]["comp_id"],
	                    "text": users[i]["comp_name"]
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
	    dropdownParent: $("#myModal2"),
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

	//承运人
	$("#crmCarrier").select2({
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
		dropdownParent:$("#myModal2"),
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

});

 	$("#crmCarrierSupplier").change(function() {
 		var companyId_Contact=$("#crmCarrierSupplier").val();
 		common.ajax_req("GET", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
 			"companyId": companyId_Contact
	 	}, function(data) {
	 		var _data = data.data;
	 		$('#crmCarrierSupplierName').empty();
	 		$('#crmCarrierSupplierName').append('<option value="0">Select Company</option>')
	 		if(_data != null) {
	 			for(var i = 0; i < _data.length; i++) {
	 				var _html = '<option value="' + _data[i].coco_id + '" data-carrierContactName="'+_data[i].coco_name+'" data-carrierContactEmail="'+_data[i].coco_email+'">' + _data[i].coco_name + '</option>';
	 				$('#crmCarrierSupplierName').append(_html)
	 			}
	 		}
	 	}, function(err) {
	 		console.log(err)
	 	}, 2000)
 	})

 	$("#crmCarrierSupplierName").change(function() {
 		$("#crmCarrierSupplierEmail").val($("#crmCarrierSupplierName").find("option:selected").attr("data-carrierContactEmail")+",");
 	})

    $('#bookRightNowCkb').on('click', function() {
    	if($("#bookRightNowCkb").is(":checked")) {
    		$("#bookRightNow").removeClass('none')
    	}
    	else{ $("#bookRightNow").addClass('none') }
    })

    //销售人员userinfo.ashx?action=read
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        'rolename': '销售',
        'companyId': companyID
    }, function (data) {
        var _data = data.data;
        if (_data != null) {
            for (var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#sellId').append(_html)
            }
        }
    }, function (error) {
        console.log(parm)
    }, 1000)
    //录单人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        'rolename': '录单',
        'companyId': companyID
    }, function (data) {
        var _data = data.data;
        if (_data != null) {
            for (var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#luruId').append(_html)
            }
        }
    }, function (error) {
        console.log(parm)
    }, 1000)
    //客服人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        'rolename': '客服',
        'companyId': companyID
    }, function (data) {
        var _data = data.data;
        if (_data != null) {
            for (var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#kefuId').append(_html)
            }
        }
    }, function (error) {
        console.log(parm)
    }, 1000)
    //操作人员
    common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
        'rolename': '操作',
        'companyId': companyID
    }, function (data) {
        var _data = data.data;
        if (_data != null) {
            for (var i = 0; i < _data.length; i++) {
                var _html = '<option value="' + _data[i].usin_id + '">' + _data[i].usin_name + '</option>';
                $('#caozuoId').append(_html)
            }
        }
    }, function (error) {
        console.log(parm)
    }, 1000)

/**
 * 表格初始化
 * @returns {*|jQuery}
 */

function initTable(fromId) {
    var ajaxUrl,tableTitle,columns    
    if(fromId=='1'){
		hasPermission('1701'); //权限控制
		ajaxUrl = dataUrl + 'ajax/booking.ashx?action=read&crmId=' + companyID + '&fromId=' + fromId + '&userId=' + childrenIds + '&userOtherId=' + userID
    	tableTitle='<th>销售</th><th>订舱委托号</th><th>客户名称</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港 / 货量</th><th>货好时间</th><th>订舱时间</th><th>状态</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
    		{
    			"mDataProp": "book_sellId",
    			"mRender": function (td, cellData, rowData, row, col) {
    			    var role_text = ""
    			    if (rowData.book_sellId != 0) {
    			        role_text += "销售：" + getSellId(rowData.book_sellId) + "<br/>"
    			    }
    			    if (rowData.book_caozuoId != 0) {
    			        role_text += "操作：" + getSellId(rowData.book_caozuoId) + "<br/>"
    			    }
    			    if (rowData.book_luruId != 0) {
    			        role_text += "录单：" + getSellId(rowData.book_luruId) + "<br/>"
    			    }
    			    if (rowData.book_kefuId != 0) {
    			        role_text += "客服：" + getSellId(rowData.book_kefuId)
    			    }
    			    return (role_text)
    			}
    		},
			{ "mDataProp": "book_code",
			"mRender": function (td, cellData, rowData, row, col) {
			    return ("<a href='bookingpreview.html?code=" + rowData.book_code + "' target='_blank'>" + rowData.book_code + "</a><br/><a href='javascript:void(0);' onclick='_toOrderDetail(&quot;" + rowData.book_orderCode + "&quot;)'>[ " + rowData.book_orderCode + " ]</a>")
				}		
			},
//			{ "mDataProp": "type_name"},
			{ "mDataProp": "comp_name" },
//			{ "mDataProp": "book_movementType"},		
    		{
    			"mDataProp": "book_port1",
	            "mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
	                      return (full.book_port1 +" <i class='fa fa-long-arrow-right'></i> "+ full.book_port2+"</br>"+full.book_movementType + " / " +full.book_allContainer)
	                    }
    		},
			//{ "mDataProp": "book_port2" },
// 			{ 
// 				"mDataProp": "book_allContainer"
// //				"mDataProp": "book_id",
// //				"createdCell": function (td, cellData, rowData, row, col) {
// //					var tohtml=''
// //					if(rowData.book_20GP.substr(0, 1)!=' '){
// //						tohtml=rowData.book_20GP;
// //					}
// //					if(rowData.book_40GP.substr(0, 1)!=' '){
// //						tohtml=tohtml+'<br/>'+rowData.book_40GP;
// //					}
// //					if(rowData.book_40HQ.substr(0, 1)!=' '){
// //						tohtml=tohtml+'<br/>'+rowData.book_40HQ;
// //					}
// //					$(td).html(tohtml);
// //				}			    
// 			},
			{
				"mDataProp": "book_okTime",
				"mRender": function (td, cellData, rowData, row, col) {
					if(rowData.book_okTime!=null){
					    return (rowData.book_okTime.substring(0, 10));
					}else{
					    return ("");
					}
				}			
			},	
			{
				"mDataProp": "book_time",
				"mRender": function (td, cellData, rowData, row, col) {
					if(rowData.book_time!=null){
					    return (rowData.book_time.substring(0, 10));
					}else{
					    return ("");
					}						
				}			
			},		
			{ "mDataProp": "state_name_cn" },				
			{
				"mDataProp": "book_id",
				"createdCell": function (td, cellData, rowData, row, col) {
					var stateText = '';
					var pol=rowData.book_port1;
					var pod=rowData.book_port2;
					var allContainer = rowData.book_movementType + " / " +rowData.book_allContainer
					if (rowData.book_state == 1) {
					    var perSure = perCancel = ""
					    if (isPermission('1714') == 1) {
					        perSure = "<a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_sureFun(" + cellData + "," + rowData.book_userId + "," + rowData.book_sellId + ",\"" + pol + "\",\"" + pod + "\")'>" + get_lan('con_top_5') + "</a>"
					    }
					    if (isPermission('1715') == 1) {
					        perCancel = "<li><a href='javascript:void(0);' onclick='_cancelFun(" + cellData + "," + rowData.book_userId + "," + rowData.book_state + ",\"" + rowData.book_code + "\",\"" + allContainer.replace('\'', '_') + "\",\"" + pol + "\",\"" + pod + "\",\"" + rowData.book_carrierSupplierEmail + "\")'> " + get_lan('cancel') + "</a></li>"
					    }
						$(td).parent().find("td").css("background-color","#fdfdbf");
						$(td).html("<div class='btn-group' style='z-index:auto; width:90px;'>" + perSure
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    + perCancel
	                    //+"<li><a href='bookingadd.html?action=modify&Id=" + cellData +"&crmId=" + rowData.book_crmCompanyId + "&fromId=1'> " + get_lan('edit') + "</a></li>"
	                    +"<li class='divider'></li>"
	                    //+"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
						// $(td).html("<a href='javascript:void(0);' onclick='_sureFun(" + cellData + ","+rowData.book_crmCompanyId+")'>" + get_lan('con_top_5') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a><br/>")
						// 	.append("<a href='bookingadd.html?action=modify&Id=" + cellData +"&crmId=" + rowData.book_crmCompanyId + "&fromId=1'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")
					} else if (rowData.book_state == 2) {
					    var perCancel = ""
					    if (isPermission('1715') == 1) {
					        perCancel = "<a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_cancelFun(" + cellData + "," + rowData.book_userId + "," + rowData.book_state + ",\"" + rowData.book_code + "\",\"" + allContainer.replace('\'', '_') + "\",\"" + pol + "\",\"" + pod + "\",\"" + rowData.book_carrierSupplierEmail + "\")'>" + get_lan('cancel') + "</a>"
					    }
					    $(td).html("<div class='btn-group' style='z-index:auto; width:90px;'>" + perCancel
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li></li>"
	                    //+"<li><a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a></li>"
	                    //+"<li class='divider'></li>"
	                    //+"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"</ul></div>")
						// $(td).html("<a href='javascript:void(0);' onclick='_cancelFun(" + cellData + ")'> " + get_lan('cancel') + "</a><br/>")
						// 	.append("<a href='bookingadd.html?action=modify&Id=" + cellData + "&fromId=1'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
						// 	.append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")
					} else if (rowData.book_state == 3) {
					    $(td).parent().find("td").css("background-color", "#ABABAB");
					    $(td).html("<span><a class='btn btn-blue btn-sm' href='javascript:void(0);' onclick='_reasonFun(" + cellData + ",\"" + rowData.book_beizhu + "\")'>" + get_lan('reason') + "</a></span>")
					}
				
				}
			},
		],
        aaaSorting=[[5, 'desc']],
        aaaColumDefs=[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [3,6,7]}
        ]
    }else{
		hasPermission('1713'); //权限控制
		ajaxUrl = dataUrl + 'ajax/booking.ashx?action=read&companyId=' + companyID + '&userId=' + childrenIds + '&userOtherId=' + userID
		tableTitle = '<th>人员</th><th>单号/订舱号</th><th>SO NO. / MBL NO.</th><th>客户名称</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港 / 货量 / 船名-航次</th><th>订舱时间</th><th>离港时间</th><th>状态</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
    	columns = [
    		{
    			"mDataProp": "book_sellId",
    			"mRender": function (td, cellData, rowData, row, col) {
    			    var role_text = ""
    			    if (rowData.book_sellId != 0) {
    			        role_text += "<span style='color:#999;'>销售：</span>" + getSellId(rowData.book_sellId) + "<br/>"
    			    }
    			    if (rowData.book_caozuoId != 0) {
    			        role_text += "<span style='color:#999;'>操作：</span>" + getSellId(rowData.book_caozuoId) + "<br/>"
    			    }
    			    if (rowData.book_luruId != 0) {
    			        role_text += "<span style='color:#999;'>录单：</span>" + getSellId(rowData.book_luruId) + "<br/>"
    			    }
    			    if (rowData.book_kefuId != 0) {
    			        role_text += "<span style='color:#999;'>客服：</span>" + getSellId(rowData.book_kefuId)
    			    }
    			    return (role_text)
				}	
    		},
    		{
    		    "mDataProp": "book_orderCode",
    		    "mRender": function (td, cellData, rowData, row, col) {
    		        var _str = ""
    		        if (rowData.book_orderCode != '') {
    		            _str = _str + "<span style='color:#999;'>单号：</span>" + rowData.book_orderCode
    		        }
    		        if (rowData.book_code != '') {
    		            _str = _str + "<br/><span style='color:#999;'>订舱号：</span>" + rowData.book_code.replaceAll(";", "<br/>")
    		        }

    		        return (_str)
    		    }
    		},
            {
                "mDataProp": "book_code",
                "mRender": function (td, cellData, rowData, row, col) {
                    var _str = ""
                    if (rowData.book_sono != '') {
                        _str = _str + "<span style='color:#999;'>SO NO.：</span>" + rowData.book_sono
                    }
                    if (rowData.book_billCode != "") {
                        _str = _str + "<br/><span style='color:#999;'>MBL NO.:</span><br/>" + rowData.book_billCode
                    }
                    if (rowData.book_allContainer != "") {
                        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readbill", {
                            "bookingId": rowData.book_id
                        }, function (data) {
                            if (data.State == 1) {
                                var _data = data.Data;
                                if (_data.length > 0) {
                                    _str = _str + "<br/><span style='color:#999;'>HBL NO.:</span><br/>"
                                    for (var i = 0; i < _data.length; i++) {
                                        _str = _str + _data[i].bobi_billCode + '<br/>'
                                    }
                                }

                            }
                        }, function (err) {
                            console.log(err)
                        }, 2000)
                    }

                    return (_str)
                }
            },
    		{
    			"mDataProp": "crm_name"
    		},
    		// {
    		// 	"mDataProp": "book_movementType"
    		// },
    		{
    			"mDataProp": "book_port1",
    			"mRender": function (data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
    			    var voyage = ""
    			    if (full.book_vessel != "") {
    			        voyage = "</br>船名/航次："+full.book_vessel + "-" + full.book_voyage
    			    }
    			    return (full.book_port1 + " <i class='fa fa-long-arrow-right'></i> " + full.book_port2 + "</br>" + full.book_movementType + " / " + full.book_allContainer + voyage)
	                    }
    		},
    		// {
    		// 	"mDataProp": "book_port2"
    		// },
//     		{
//     			"mDataProp": "book_allContainer"
// //  			"mDataProp": "book_id",
// //  			"createdCell": function(td, cellData, rowData, row, col) {
// //  				var tohtml = ''
// //  				if(rowData.book_20GP.substr(0, 1) != ' ') {
// //  					tohtml = rowData.book_20GP;
// //  				}
// //  				if(rowData.book_40GP.substr(0, 1) != ' ') {
// //  					tohtml = tohtml + '<br/>' + rowData.book_40GP;
// //  				}
// //  				if(rowData.book_40HQ.substr(0, 1) != ' ') {
// //  					tohtml = tohtml + '<br/>' + rowData.book_40HQ;
// //  				}
// //  				$(td).html(tohtml);
// //  			}
//     		},
    		{
    			"mDataProp": "book_time",
    			"mRender": function (td, cellData, rowData, row, col) {
    				if(rowData.book_time != null) {
    				    return (rowData.book_time.substring(0, 10));
    				} else {
    				    return ("");
    				}
    			}
    		},    		
    		{
    			"mDataProp": "book_okPortTime",
    			"mRender": function (td, cellData, rowData, row, col) {
    				if(rowData.book_okPortTime != null) {
    				    return (rowData.book_okPortTime.substring(0, 10));
    				} else {
    				    return ("");
    				}
    			}
    		},
    		//{
    		//	"mDataProp": "book_id",
    		//	"createdCell": function(td, cellData, rowData, row, col) {
    		//		$(td).html("NULL"); //这里是财务状况，还没有任何的数添加到这里来，到时候这里估计要体现从其他函数过来的数。
    		//	}    			
    		//},    		
    		//{
    		//	"mDataProp": "orderstate_name_cn"
    		//},
    		{
    		    "mDataProp": "orderstate_name_cn",
    		    "mRender": function (td, cellData, rowData, row, col) {
    		        if (rowData.book_state != 3) {
    		            return (rowData.orderstate_name_cn);
    		        } else {
    		            return ("<a chref='javascript:void(0);' onclick='_cancelOrderFun(" + rowData.book_id + "," + rowData.book_state + ",\"" + rowData.book_beizhu + "\")'>已取消</a>");
    		        }
    				
    			}    			
    		},   
			{
				"mDataProp": "book_id",
				"createdCell": function (td, cellData, rowData, row, col) {
				    var perCancel = ""
				    if (rowData.book_orderState == 12 && rowData.book_state != 3) {
				        perCancel = "<li><a chref='javascript:void(0);' onclick='_cancelOrderFun(" + rowData.book_id + "," + rowData.book_state + ",\"" + rowData.book_beizhu + "\")'>" + get_lan('cancel') + "</a></li>"
				    }
				    if (rowData.book_state != 3) {
				        $(td).html("<div class='btn-group' style='z-index:auto; width:70px;'><a class='btn btn-blue btn-sm' href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>"
                        + "<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                        + "<ul class='dropdown-menu dropdown-azure'>"
                        + "<li><a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a></li>"
                        + "<li><a href='printrecord.html?aboutId=" + cellData + "'>" + get_lan('con_top_7') + "</a></li>"
                        + perCancel
                        + "</ul></div>")
				    } else {
				        $(td).html("")
				    }

					if(rowData.book_orderState == 2) {
						$(td).parent().find("td").css("background-color","#fdfdbf");
					} 
					// $(td).html("<a href='orderadd.html?action=modify&Id=" + cellData + "'> " + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")	
					// .append("<a href='orderfee.html?Id=" + cellData + "'>" + get_lan('con_top_6') + "</a>")						
				}
			},    		
    	],
        aaaSorting=[[4, 'desc']],
        aaaColumDefs=[//设置列的属性，此处设置第一列不排序
            //{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [3,6,7,8]}
        ]
    }
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
//		"stateSave": true,
		"sAjaxSource": ajaxUrl,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
        "aaSorting": aaaSorting,
        "aoColumnDefs": aaaColumDefs,
//		"bSort": true,
		"aaSorting": [[ 5, "desc" ]],
//		"bProcessing": true,
		initComplete: function(settings) {
        	//$('#example').colResizable({headerOnly:true,liveDrag:true, fixed:true, postbackSafe:true, resizeMode:flex});
    	},
		"aoColumns": columns,
		 //createdRow: function ( row, data, index ) { //针对修改行的一些样式。
		 //    if (data.book_state == 3) {
         //        $('td', row).css("background-color","yellow");
         //    }
         //},
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

	
/**
 * 确认订舱
 */
 function _sureFun(id,crmId,sellId,pol,pod) {
 	$("#myModal2").modal("show");
 	$('#bookId').val(id)
 	$('#orderHblLi').empty();
 
 	//获取委托人列表
 	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
 		"companyId": companyID
 	}, function(data) {
 		//console.log(data)
 		$('#orderHblLi').empty();
 		var _data = data.data;
 		$('#crmuser').empty();
 		if(_data != null) {
 			for(var i = 0; i < _data.length; i++) {
 				var _html = '<option value="' + _data[i].comp_id + '" data-crmId="'+_data[i].comp_customerId+'" data-crmName="'+_data[i].comp_contactName+'" data-crmEmail="'+_data[i].comp_contactEmail+'">' + _data[i].comp_name + '</option>';
 				$('#crmuser').append(_html)
 			}
 		}
 	}, function(err) {
 		console.log(err)
 	}, 2000)
 	console.log(crmId)
 	$("#sellId").val(sellId).trigger("change");
 	$("#crmuser").val(crmId).trigger("change");
 	$("#emailToBookingParty").val($("#crmuser").find("option:selected").attr("data-crmEmail")+",");
 	$('#summernote').summernote('code', "Dear "+$("#crmuser").find("option:selected").attr("data-crmName")+", </br></br>BeyondAdmin's Databoxes are meant to provide you a completely flexible  and very easy to customize tool to visualize data. You can create databoxes in multiple sizes and different styles.");
 	//获取委托人订单
 	common.ajax_req("get", false, dataUrl, "booking.ashx?action=read", {
 		"companyId": companyID,
 	    "crmId": $("#crmuser").val()
 		//"crmId": $("#crmuser").find("option:selected").attr("data-crmId")
 	}, function(data) {
 		//console.log(data)
 		$('#orderLi').empty();
 		$('#orderHblLi').empty();
 		var _data = data.data;
 		if(_data != null) {
			var _html2 = '<option value="" data-pol="" data-pod="">New Shipments</option>';
			$('#orderLi').append(_html2)
 			for(var i = 0; i < _data.length; i++) {
 				var _html = '<option value="' + _data[i].book_id + '" data-pol="'+_data[i].book_port1+'" data-pod="'+_data[i].book_port2+'">' + _data[i].book_orderCode +' ['+ _data[i].book_port1 +' — '+_data[i].book_port2+']</option>';
 				$('#orderLi').append(_html)
 				if(_data[i].book_port1==pol && _data[i].book_port2==pod){
 					$("#orderLi").find("option[value='"+_data[i].book_id+"']").attr("selected",true);
 				}else{
 					$("#orderLi").find("option[value='0']").attr("selected",true);
 				}
 			}
 		}else{
			var _html = '<option value="" data-pol="" data-pod="">New Shipments</option>';
			$('#orderLi').append(_html)
 		}
 	}, function(err) {
 		console.log(err)
 	}, 2000)
 	
 	$("#crmuser").change(function() {
 		$('#orderLi').empty();
 		$('#orderHblLi').empty();
 		//获取委托人订单
 		common.ajax_req("get", false, dataUrl, "booking.ashx?action=read", {
 			"companyId": companyID,
 			"crmId": $("#crmuser").val()
 		    //"crmId": $("#crmuser").find("option:selected").attr("data-crmId")
 		}, function(data) {
 			//console.log(data)
 			var _data = data.data;
 			if(_data != null) {
				var _html2 = '<option value="" data-pol="" data-pod="">New Shipments</option>';
				$('#orderLi').append(_html2)
 				for(var i = 0; i < _data.length; i++) {
 					var _html = '<option value="' + _data[i].book_id + '">' + _data[i].book_orderCode + ' ['+ _data[i].book_port1 +' — '+_data[i].book_port2+']</option>';
 					$('#orderLi').append(_html)
	 				if(_data[i].book_port1==pol && _data[i].book_port2==pod){
	 					$("#orderLi").find("option[value='"+_data[i].book_id+"']").attr("selected",true);
	 				}else{
	 					$("#orderLi").find("option[value='0']").attr("selected",true);
	 				}
 				}
 			}else{	 				
				var _html = '<option value="" data-pol="" data-pod="">New Shipments</option>';
				$('#orderLi').append(_html)
 			}
 		}, function(err) {
 			console.log(err)
 		}, 2000)
 		$("#emailToBookingParty").val($("#crmuser").find("option:selected").attr("data-crmEmail")+",");
 		$('#summernote').summernote('code', "Dear "+$("#crmuser").find("option:selected").attr("data-crmName")+", </br></br>BeyondAdmin's Databoxes are meant to provide you a completely flexible  and very easy to customize tool to visualize data. You can create databoxes in multiple sizes and different styles.");
	})
 	$("#orderLi").change(function() {
		var orderLiId=$("#orderLi").val();
 		common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbill", {
    			"bookingId": orderLiId
 		}, function(data) {
 			$('#orderHblLi').empty();
 			var _data = data.Data;
 			console.log(_data);
 			if(data.State == 1) {
				var _html3 = '<option value="0">New HBL</option>';
				$('#orderHblLi').append(_html3)
 				for(var i = 0; i < _data.length; i++) {
 					var _html = '<option value="' + _data[i].bobi_id + '">' + _data[i].bobi_billCode + '</option>';
 					$('#orderHblLi').append(_html);
	 				$("#orderHblLi").find("option[value='0']").attr("selected",true);
 				}
 				console.log("ddd")
 			}else{
				$('#orderHblLi').append('<option value="0">New HBL</option>')
 			}
 		}, function(err) {
 			console.log(err)
 		}, 2000)
	})
	
 }
 $('#btnSave2').on('click', function () {
    //是否更新MBL数据
     var isMBL = 0;
 	if($("#ismbl").is(":checked")) {
 	    isMBL = 1
 	} else {
 	    isMBL = 0
 	}
     //是否更新HBL数据
 	var isHBL = 0;
 	if ($("#ishbl").is(":checked")) {
 	    isHBL = 1
 	} else {
 	    isHBL = 0
 	}
     //是否安排订舱
 	var isBookRightNowCkb = 0;
 	if ($("#bookRightNowCkb").is(":checked")) {
 	    isBookRightNowCkb = 1
 	} else {
 	    isBookRightNowCkb = 0
 	}
     //是否发邮件
 	var isSendeMail = 0;
 	if ($("#BookSendEmail").is(":checked")) {
 	    isSendeMail = 1
 	} else {
 	    isSendeMail = 0
 	}
 	var parm = {
 		'bookingId': $('#bookId').val(),
 		'isMBL': isMBL,
 		'isHBL': isHBL,
 		'orderHblLi': $('#orderHblLi').val(),
 		'companyId': companyID,
 		'userId': userID,
 		'userName': userName,
 		'crmCompanyId': $('#crmuser').val(),
 		'orderId': $('#orderLi').val(),
 		'sellId': $('#sellId').val(),
 		'luruId': $('#luruId').val(),
 		'kefuId': $('#kefuId').val(),
 		'caozuoId': $('#caozuoId').val(),
 		'emailToBookingParty': $('#emailToBookingParty').val(),
 		'emailContent': $("#summernote").summernote("code"),
 		'isBookRightNowCkb':isBookRightNowCkb,
 		'crmCarrier': $("#crmCarrier").val(),
 		'crmCarrierSupplier': $("#crmCarrierSupplier").val(),
 		'crmCarrierSupplierName': $("#crmCarrierSupplierName").val(),
 		'crmCarrierSupplierEmail': $("#crmCarrierSupplierEmail").val(),
 		'isSendeMail': $("#isSendeMail").val(),
 		'okTrailerTime': $("#okTrailerTime").val(),
 		'okPortTime': $("#okPortTime").val()
 	}
 	console.log(parm)
 	common.ajax_req('POST', true, dataUrl, 'booking.ashx?action=changeorder', parm, function(data) {
 		if(data.State == 1) {
 			$("#myModal2").modal("hide");
 			comModel("确认订舱成功")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		} else {
 			$("#myModal2").modal("hide");
 			comModel("确认订舱失败")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		}
 	}, function(error) {
 		console.log(parm)
 	}, 1000)
 });
 
 /**
  * 跳转到订单详情
  */
 function _toOrderDetail(code) {
     console.log(code)
     common.ajax_req('GET', true, dataUrl, 'booking.ashx?action=readbyordercode', { 'code': code }, function (data) {
         if (data.State == 1) {
             location.href = 'orderadd.html?action=modify&Id=' + data.Data.book_id
         }
     }, function (error) {
         console.log(parm)
     }, 1000)
 }
/**
 * 取消
 */
 var emailTitle = '', emailContent = '', emailAccount = '', emailAccount2 = ''
 function _cancelFun(id, crmId, state, code, allContainer, pol, pod, carrierSupplierEmail) {
     emailAccount2 = carrierSupplierEmail
     if (state == 1) {
         $("#sendTH").hide();
     } else {
         $("#sendTH").show();
     }
 	$("#myModal").modal("show");
 	$('#bookId').val(id)

 	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
 	    "companyId": companyID
 	}, function (data) {
 	    //console.log(data)
 	    var _data = data.data;
 	    $('#crmuser_cancel').empty();
 	    if (_data != null) {
 	        for (var i = 0; i < _data.length; i++) {
 	            var _html = '<option value="' + _data[i].comp_id + '" data-crmId="' + _data[i].comp_customerId + '" data-crmName="' + _data[i].comp_contactName + '" data-crmEmail="' + _data[i].comp_contactEmail + '">' + _data[i].comp_name + '</option>';
 	            $('#crmuser_cancel').append(_html)
 	        }
 	    }
 	}, function (err) {
 	    console.log(err)
 	}, 2000)

 	common.ajax_req("GET", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
 	    "companyId": crmId
 	}, function (data) {
 	    var _data = data.data;
 	    $('#crmName').empty();
 	    $('#crmName').append('<option value="0">Select Contact</option>')
 	    if (_data != null) {
 	        for (var i = 0; i < _data.length; i++) {
 	            var _html = '<option value="' + _data[i].coco_id + '" data-Name="' + _data[i].coco_name + '" data-Email="' + _data[i].coco_email + '">' + _data[i].coco_name + '</option>';
 	            $('#crmName').append(_html)
 	        }
 	    }
 	}, function (err) {
 	    console.log(err)
 	}, 2000)

 	$("#crmuser_cancel").val(crmId).trigger("change");
 	$("#crmName").find(':contains(' + $("#crmuser_cancel").find("option:selected").attr("data-crmName") + ')').attr('selected', true).trigger("change");
 	$("#crmEmail").val($("#crmuser_cancel").find("option:selected").attr("data-crmEmail"));
 	$('#cancel_summernote').summernote('code', "Dear " + $("#crmuser_cancel").find("option:selected").attr("data-crmName") + ", </br></br>订舱委托号（BOOKING NO.)：" + code + "</br>起运港（POL）：" + pol + "</br>目的港（POD）：" + pod + "</br>货量（CARGO）：" + allContainer.replace('_', '\'') + "</br>以上订舱由于 " + $("#beizhu").val() + " 原因，已在系统取消，如需重新订舱，请再次发起。");
 	emailTitle = code + " // " + pol + " " + pod + " " + allContainer.replace('_', '\'') + ", CANCEL"
 	emailContent = $('#cancel_summernote').summernote("code")

 	$("#crmuser_cancel").change(function () {
 	    //获取委托人联系人
 	    var companyId_Contact = $("#crmuser_cancel").val();
 	    common.ajax_req("GET", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
 	        "companyId": companyId_Contact
 	    }, function (data) {
 	        var _data = data.data;
 	        $('#crmName').empty();
 	        $('#crmName').append('<option value="0">Select Contact</option>')
 	        if (_data != null) {
 	            for (var i = 0; i < _data.length; i++) {
 	                var _html = '<option value="' + _data[i].coco_id + '" data-Name="' + _data[i].coco_name + '" data-Email="' + _data[i].coco_email + '">' + _data[i].coco_name + '</option>';
 	                $('#crmName').append(_html)
 	            }
 	            $("#crmName").find(':contains(' + $("#crmuser_cancel").find("option:selected").attr("data-crmName") + ')').attr('selected', true).trigger("change");
 	            $('#cancel_summernote').summernote('code', "Dear " + $("#crmuser_cancel").find("option:selected").attr("data-crmName") + ", </br></br>订舱委托号（BOOKING NO.)：" + code + "</br>起运港（POL）：" + pol + "</br>目的港（POD）：" + pod + "</br>货量（CARGO）：" + allContainer.replace('_', '\'') + "</br>以上订舱由于 " + $("#beizhu").val() + " 原因，已在系统取消，如需重新订舱，请再次发起。");
 	            $("#crmEmail").val($("#crmuser_cancel").find("option:selected").attr("data-crmEmail"));
 	            emailContent = $('#cancel_summernote').summernote("code")

 	        }
 	    }, function (err) {
 	        console.log(err)
 	    }, 2000)
 	    
 	})
 	$("#crmName").change(function () {
 	    $("#crmEmail").val($("#crmName").find("option:selected").attr("data-Email"));
 	    $('#cancel_summernote').summernote('code', "Dear " + $("#crmName").find("option:selected").attr("data-Name") + ", </br></br>订舱委托号（BOOKING NO.)：" + code + "</br>起运港（POL）：" + pol + "</br>目的港（POD）：" + pod + "</br>货量（CARGO）：" + allContainer.replace('_', '\'') + "</br>以上订舱由于 " + $("#beizhu").val() + " 原因，已在系统取消，如需重新订舱，请再次发起。");
 	    emailContent = $('#cancel_summernote').summernote("code")
 	})

 }
 $('#btnSave').on('click', function () {
     //是否发邮件
     var isCancelSendeMail = 0;
     if ($("#CancelSendEmail").is(":checked")) {
         isCancelSendeMail = 1
     } else {
         isCancelSendeMail = 0
     }
     var isCancelSendeMail2 = 0;
     if ($("#CancelSendEmail2").is(":checked")) {
         isCancelSendeMail2 = 1
     } else {
         isCancelSendeMail2 = 0
     }

 	var parm = {
 		'Id': $('#bookId').val(),
 		'state': 3,
 		'beizhu': $('#beizhu').val(),
 		'userId': userID,
 		'userName': userName,
 		'isCancelSendeMail': isCancelSendeMail,
 		'isCancelSendeMail2': isCancelSendeMail2,
 		'emailContent': emailContent,
 		'emailTitle': emailTitle,
 		'emailAccount': $("#crmEmail").val(),
 		'emailAccount2': emailAccount2,

 	}
 	common.ajax_req('POST', true, dataUrl, 'booking.ashx?action=modify', parm, function(data) {
 		if(data.State == 1) {
 			$("#myModal").modal("hide");
 			comModel("取消成功")
 			//oTable.fnReloadAjax(oTable.fnSettings());
 		} else {
 			$("#myModal").modal("hide");
 			comModel("取消失败")
 			oTable.fnReloadAjax(oTable.fnSettings());
 		}
 	}, function(error) {
 		console.log(parm)
 	}, 10000)
 });
 

 /**
  * 取消订单
  */
 function _cancelOrderFun(id, state, beizhu) {
     $("#myOrderCancelModal").modal("show");
     $('#orderId').val(id)
     if (state == 1) {
         $('#cancel_order1').show()
         $('#cancel_order2').hide()
         $('#btnOrderCancelSave').show()
     } else if (state == 3) {
         $('#cancel_order2').show()
         $('#cancel_order1').hide()
         $('#btnOrderCancelSave').hide()
         $('#cancel_reason').html(beizhu)

         common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfollow", {
             "bookingId": id
         }, function (data) {
             //console.log(data.Data)
             $("#cancel_time").empty()
             if (data.State == 1) {
                 var _data = data.Data;
                 var feilist = '<p><span>时间：' + _data[0].bofo_time.substring(0, 16).replace('T', ' ') + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>操作人：' + _data[0].bofo_userName + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>操作：' + _data[0].bofo_state + '</span></p>'
                 $("#cancel_time").append(feilist)
             }

         }, function (err) {
             console.log(err)
         }, 2000)
     }

 }
 $('#btnOrderCancelSave').on('click', function () {

     var parm = {
         'Id': $('#orderId').val(),
         'state': 3,
         'beizhu': $('#order_beizhu').val(),
         'userId': userID,
         'userName': userName,

     }
     common.ajax_req('POST', true, dataUrl, 'booking.ashx?action=modify', parm, function (data) {
         if (data.State == 1) {
             $("#myOrderCancelModal").modal("hide");
             comModel("取消成功")
             oTable.fnReloadAjax(oTable.fnSettings());
         } else {
             $("#myOrderCancelModal").modal("hide");
             comModel("取消失败")
             oTable.fnReloadAjax(oTable.fnSettings());
         }
     }, function (error) {
         console.log(parm)
     }, 10000)
 });


/**
 * 删除
 * @param id
 * @private
 */
 function _deleteFun(id) {
 	bootbox.confirm("Are you sure?", function(result) {
 		if(result) {
 			$.ajax({
 				url: dataUrl + 'ajax/booking.ashx?action=cancel',
 				data: {
 					"Id": id
 				},
 				dataType: "json",
 				type: "post",
 				success: function(backdata) {
 					if(backdata.State == 1) {
 						oTable.fnReloadAjax(oTable.fnSettings());
 					} else {
 						alert("Delete Failed！");
 					}
 				},
 				error: function(error) {
 					console.log(error);
 				}
 			});
 		}
 	});
 }

 /**
  * 取消原因
  */
 function _reasonFun(id, beizhu) {
     console.log(beizhu)
     $('#bookId').val(id)
     $('#reason_beizhu').html(beizhu)
     $("#myModal0").modal("show");
 }

/*
add this plug in
// you can call the below function to reload the table with current state
Datatables刷新方法
oTable.fnReloadAjax(oTable.fnSettings());
*/
$.fn.dataTableExt.oApi.fnReloadAjax = function(oSettings) {
	//oSettings.sAjaxSource = sNewSource;
	this.fnClearTable(this);
	this.oApi._fnProcessingDisplay(oSettings, true);
	var that = this;

	$.getJSON(oSettings.sAjaxSource, null, function(json) {
		/* Got the data - add it to the table */
		for(var i = 0; i < json.data.length; i++) {
			that.oApi._fnAddData(oSettings, json.data[i]);
		}
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		that.fnDraw(that);
		that.oApi._fnProcessingDisplay(oSettings, false);
	});
}

/**
 * 初始化弹出层
 */
function initModal() {
	$('#myModal').on('show', function() {
		$(".page-body").addClass('modal-open');
		$('<div class="modal-backdrop fade in"></div>').appendTo($(".page-body"));
	});
	$('#myModal').on('hide', function() {
		$(".page-body").removeClass('modal-open');
		$('div.modal-backdrop').remove();
	});
}

function getSellId(o){
	for (var i = 0; i < _getSellNameArr.length; i++) {
        if (_getSellNameArr[i].indexOf(o) >= 0) {
            z = _getSellNameArr[i].split(";");
            if(z[0]==o){
            	return z[1];
            }
        }
    }
}

