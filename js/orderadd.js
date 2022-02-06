//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "新增订单", 
            "con_top_4" : "订单详情",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENTe",   
            "con_top_3" : "Order Add", 
            "con_top_4" : "Order Detail", 
        };
        
var oTable;
var filesTable, openGoodsTable, openGoodsId;
var loadTime = new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ");

$(function(){
	$('.navli3').addClass("active open")
	$('.book5').addClass("active")

	
	
//	var crmCompanyId = '0',crmContactId = '0';
//	if(GetQueryString('crmId')!=null){
//		crmCompanyId=GetQueryString('crmId')
//		_selectSupplier(crmCompanyId)
//		_selectBill(crmCompanyId)
    //	}

	$('#upload_container').hide()

	if (isPermission('1705') != 1) {
	    $('#lock_per').hide()
	}
	if (isPermission('1706') != 1) {
	    $('#lock_per').hide()
	}
	if (isPermission('1707') != 1) {
	    $('#copyFun').hide()
	}
	if (isPermission('1708') != 1) {
	    $('#pringType').hide()
	}
	if (isPermission('1709') != 1) {
	    $('#file_add').hide()
	}
	if (isPermission('1712') != 1) {
	    $('.billnew').hide()
	}

	var crmCompanyId = '0';
	var customerId = '0';
	var action = GetQueryString('action');	
	var Id = GetQueryString('Id');
	var isTemplate,movementType, incoterm, port1, port2, port3, route, fromAddress, toAddress, okTime, okTrailerTime,okBillTime,okPortTime,packageNum=0, weightNum=0, volumeNum=0, package, weight, volume, GP20=0, GP40=0, HQ40=0, SGP20, SGP40, SHQ40, packageMarks, goodAbout, beizhu;
    var feeData='',trailerData='',containerData='';
    var carrier,consignee,contractNo;
    //var crm='';
    var orderCode,outCode;
    var sellId,luruId,kefuId,caozuoId;
    var forwarder,warehouse,warehouseAddress,warehouseContact,warehouseContactWay,warehouseInCode,warehouseInTime,warehouseOutCode,warehouseOutTime,warehouseBeizhu;
    var bill1Type,bill1Shipper,bill1Consignee,bill1NotifyParty;
    var billCode,alsoNotify,billBeizhu,bill2Beizhu,vessel,voyage,port4, port5,okPortTime2,truePortTime,truePortTime2,vgmNum=0, vgm,allContainer='',shippingTerm,shippingFeeTerm,payAddress,signAddress;
	var stateId;
	var bill2Type,bill2Shipper,bill2Consignee,bill2NotifyParty,alsoNotify2,billBeizhu2,bill2Beizhu2,packageNum2=0, weightNum2=0, volumeNum2=0, package2, weight2, volume2,vgmNum2=0, vgm2,allContainer2='',shippingTerm2,shippingFeeTerm2,payAddress2,signAddress2;
	var bill3Type,bill3Shipper,bill3Consignee,bill3NotifyParty,alsoNotify3,billBeizhu3,bill2Beizhu3,packageNum3=0, weightNum3=0, volumeNum3=0, package3, weight3, volume3,vgmNum3=0, vgm3,allContainer3='',shippingTerm3,shippingFeeTerm3,payAddress3,signAddress3;
	var bookingId,billId;
	var _toCompany = '', _feeItem = '', _feeUnit = '', _numUnit = '';
	var isLock = 0;

	if (Id) {
	    filesTable = GetFiles()
	    openGoodsTable = GetOpenGoods()
	}
	

	$("#weighingDate").val(getDate());

    //打印
	if (action == 'add') {
    	hasPermission('1702'); //权限控制
		$('#printDetail').hide() 
	}else{
    	hasPermission('1703'); //权限控制
	}
	$('#printMBL').click(function () {
	    window.open("printdetail.html?action=add&typeId=1&aboutId=" + Id,"_blank");
	});
	$('#printContainer').click(function () {
	    window.open("printdetail.html?action=add&typeId=2&aboutId=" + Id, "_blank");
	});

    //发送邮件
	$('#sendEmail').click(function () {
	    $("#myModal_sendemail").modal("show");
	});


    //复制订单
	$('#copyFun').click(function () {
	    $("#myModal_copy").modal("show");
	});
	$('#btnCopySave').click(function () {
	    //是否复制费用
	    var isCopyFee = 0;
	    if ($("#copy_orderFee").is(":checked")) {
	        isCopyFee = 1
	    } else {
	        isCopyFee = 0
	    }
	    //是否复制仓库
	    var isCopyWarehouse = 0;
	    if ($("#copy_orderWarehouse").is(":checked")) {
	        isCopyWarehouse = 1
	    } else {
	        isCopyWarehouse = 0
	    }
	    //是否复制拖车
	    var isCopyTrailer = 0;
	    if ($("#copy_orderTrailer").is(":checked")) {
	        isCopyTrailer = 1
	    } else {
	        isCopyTrailer = 0
	    }

	    if ($('#copy_orderCode').val() == "") {
	        comModel("订单号不能为空！")
	    } else {
	        var parm = {
	            'ordercode': $('#copy_orderCode').val(),
	            'companyId': companyID,
	            'userId': userID,
	            'isCopyFee': isCopyFee,
	            'isCopyWarehouse': isCopyWarehouse,
	            'isCopyTrailer': isCopyTrailer
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=copyorder', parm, function (data) {
	            if (data.State == 1) {
	                comModel("订单复制成功")
	            } else {
	                comModel("订单复制失败")
	            }
	            $("#myModal_copy").modal("hide");
	        }, function (error) {
	        }, 2000)
	    }

	});

	/**
	 * 表格初始化
	 * @returns {*|jQuery}
	 */
	function GetBillCheck() {
		var table = $("#example").dataTable({
			"iDisplayLength":100,
			"sAjaxSource": dataUrl + 'ajax/booking.ashx?action=readbillcheck&bookingId=' + Id+'&state=1',
			'bPaginate': false,
			"bInfo": false,
			//		"bDestory": true,
			//		"bRetrieve": true,
			"bFilter": false,
			"bSort": false,
			"aaSorting": [[3, "asc"]],
			//		"bProcessing": true,
			"aoColumns": [{
					"mDataProp": "bich_item"
				},
				{
					"mDataProp": "bich_content1"
				},
				{
					"mDataProp": "bich_content2"
				},
				{
					"mDataProp": "bich_time",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						$(nTd).html(oData.bich_time.substring(0, 10));
					}
				},
				{
					"mDataProp": "bich_id",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						$(nTd).html("<a href='javascript:void(0);' onclick='_sureCheckFun(" + sData + ")'> " + get_lan('submit') + "</a>")
						//	.append("<a href='javascript:void(0);' onclick='_deleteCheckFun(" + sData + ")'>" + get_lan('delete') + "</a>")
	
					}
				},
			]
		});
		return table;
	}
	
    /*新增放货申请*/
	$('#send_openGoods').on('click', function () {
	    if ($('#toCompany_6').val() == "") {
	        comModel("请选择公司！")
	        return
	    } else {
	        var parm = {
	            'state': 1,
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
	            'toCompany': $('#toCompany_6').val(),
	            'openType': $('#opgo_openType').val(),
	            'orderCode_open': $('#opgo_orderCode_open').val(),
	            'orderCode_close': $('#opgo_orderCode_close').val(),
	            'beizhu': $('#beizhu6').val(),
	            'orderType': $('#opgo_orderType').val()
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'opengoods.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("保存成功")
	                openGoodsTable.fnReloadAjax(openGoodsTable.fnSettings());
	            } else {
	                comModel("保存失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

    //放货申请列表
	function GetOpenGoods() {
	    var table = $("#openGoodsList").dataTable({
	        //"iDisplayLength":10,
	        "sAjaxSource": dataUrl + 'ajax/opengoods.ashx?action=read&bookingId=' + Id,
	        'bPaginate': false,
	        "bInfo": false,
	        //		"bDestory": true,
	        //		"bRetrieve": true,
	        "bFilter": false,
	        "bSort": false,
	        "aaSorting": [[0, "desc"]],
	        //		"bProcessing": true,
	        "aoColumns": [
                { "mDataProp": "comp_name" },
                { "mDataProp": "opgo_openType" },
                { "mDataProp": "opgo_orderCode_open" },
                { "mDataProp": "opgo_orderType" },
                { "mDataProp": "opgo_orderCode_close" },
			    {
			        "mDataProp": "opgo_addTime",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            $(nTd).html("申请人：" + oData.addUser + "<br/>申请时间：" + oData.opgo_addTime.substring(0, 10));
			        }
			    },
                			    {
                			        "mDataProp": "opgo_opetionTime",
                			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                			            if (oData.opgo_opetionTime!=null) {
                			                $(nTd).html("审核人：" + oData.checkUser + "<br/>审核时间：" + oData.opgo_opetionTime.substring(0, 10));
                			            }
                			        }
                			    },
			    {
			        "mDataProp": "opgo_state",
			        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			            if (oData.opgo_state == 1) {
			                $(nTd).html('待审核');
			            } else if (oData.opgo_state == 2) {
			                $(nTd).html("审核通过");
			            } else if (oData.opgo_state == 3) {
			                $(nTd).html("审核不通过");
			            }
			        }
			    },
                {
                    "mDataProp": "opgo_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.opgo_state == 1) {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailOpenGoodsFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                                .append("<a href='javascript:void(0);' onclick='_deleteOpenGoodsFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发送</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //    .append("<a href='#'>发票</a>")
                        } else {
                            $(nTd).html("<a href='javascript:void(0);' onclick='_detailOpenGoodsFun(" + sData + ")'>" + get_lan('detail') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteBillGetFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                            //.append("<a href='javascript:void(0);' onclick='_deleteContactFun(" + sData + ")'>" + get_lan('delete') + "</a><br/>")
                            //.append("<a href='javascript:void(0);' onclick='_primaryFun(" + sData + ")'>" + get_lan('primary') + "</a>")
                        }

                    }
                },
	        ]
	    });
	    return table;
	}

    //文件列表
	function GetFiles() {
	    var table = $("#filesList").dataTable({
	        //"iDisplayLength":10,
	        "sAjaxSource": dataUrl + 'ajax/files.ashx?action=read&bookingId=' + Id,
	        'bPaginate': false,
	        "bInfo": false,
	        //		"bDestory": true,
	        //		"bRetrieve": true,
	        "bFilter": false,
	        "bSort": false,
	        "aaSorting": [[0, "desc"]],
	        //		"bProcessing": true,
	        "aoColumns": [
                {"mDataProp": "book_orderCode"},
                { "mDataProp": "file_name" },
                {
                    "mDataProp": "file_addTime",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(oData.file_addTime.substring(0, 10));
                    }
                },
                { "mDataProp": "usin_name" },
                {
                    "mDataProp": "file_id",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        var perView = perDel = ""
                        if (isPermission('1710') == 1) {
                            perView = "<a href='javascript:void(0);' onclick='_deleteFileFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                        }
                        if (isPermission('1711') == 1) {
                            perDel = "<a href='" + dataUrl + oData.file_nav + oData.file_url + "' target='_blank'>查看</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                        }
                        $(nTd).html(perView)
                            .append(perDel)
                        //    .append("<a href='#'>导出</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>收款</a>&nbsp;&nbsp;&nbsp;&nbsp;")
                        //    .append("<a href='#'>发票</a>")

                    }
                },
	        ]
	    });
	    return table;
	}

    /*新增文件*/
	$('#send_file').on('click', function () {
	    if ($('#filename').val() == "") {
	        comModel("请填写文件名称！")
	    } else if ($("#Pname").val() == "") {
	        comModel("请选择上传的文件！")
	    } else if (Id == null) {
	        comModel("请保存订单之后新增文件！")
	    } else {
	        var parm = {
	            'bookingId': Id,
	            'companyId': companyID,
	            'userId': userID,
                'userName':userName,
	            'typeId': 1,
	            'name': $('#filename').val(),
	            'nav': $('#Nav').val(),
	            "url": $("#Pname").val()
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'files.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("新增成功")
	                $('#filename').val("")
	                $('#Nav').val(""),
                    $("#Pname").val("")
	                filesTable.fnReloadAjax(filesTable.fnSettings());
	            } else {
	                comModel("新增失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

    // 选择图片  
	$("#img").on("change", function () {
	    var fileUpload = $("#img").get(0);
	    var files = fileUpload.files;

	    var data = new FormData();
	    for (var i = 0; i < files.length; i++) {
	        data.append(files[i].name, files[i]);
	        data.append("companyId", companyID);
	    }

	    $.ajax({
	        url: dataUrl + "ajax/uploadFile.ashx",
	        type: "POST",
	        data: data,
	        contentType: false,
	        processData: false,
	        success: function (result) {    
	            res = JSON.parse(result)
	            if (res.State == '100') {
	                $('#showimg').text(res.Picurl);
	                $('#toShow').attr("href",res.Picurl);
	                $('#Pname').val(res.Pname);
	                $('#Nav').val(res.Nav);
	            } else if (res.State == '101') {
	                $('#showimg').text("上传文件格式不对");
	            } else{
	                $('#showimg').text("上传失败");
	            }

	        },
	        error: function (err) {
	            alert(err.statusText)
	        }
	    });

	    //var img = event.target.files[0];
	    //// 判断是否图片  
	    //if (!img) {
	    //    return;
	    //}

	    //// 判断图片格式  
	    //if (!(img.type.indexOf('image') == 0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name))) {
	    //    alert('图片只能是jpg,gif,png');
	    //    return;
	    //}

	    //var reader = new FileReader();
	    //reader.readAsDataURL(img);

	    //reader.onload = function (e) { // reader onload start  
	    //    // ajax 上传图片  
	    //    $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, action: 'order' }, function (ret) {
	    //        if (ret.State == '100') {
	    //            //alert(ret.Picurl);
	    //            $('#showimg').attr('src', ret.Picurl);
	    //            $('#Pname').val(ret.Pname);
	    //            //$('#showimg').html('<img src="' + ret.Data + '">');
	    //        } else {
	    //            alert('上传失败');
	    //        }
	    //    }, 'json');
	    //} // reader onload end  
	})
	
    // 上传附件 
	$("#emailfile").on("change", function () {
	    var fileUpload = $("#emailfile").get(0);
	    var files = fileUpload.files;

	    var data = new FormData();
	    for (var i = 0; i < files.length; i++) {
	        data.append(files[i].name, files[i]);
	        data.append("companyId", companyID);
	    }

	    $.ajax({
	        url: dataUrl + "ajax/uploadFile.ashx",
	        type: "POST",
	        data: data,
	        contentType: false,
	        processData: false,
	        success: function (result) {
	            res = JSON.parse(result)
	            if (res.State == '100') {
	                $('#showimg5').text(res.Picurl);
	                $('#toShow5').attr("href", res.Picurl);
	                $('#Pname5').val(res.Pname);
	                $('#Nav5').val(res.Nav);
	            } else if (res.State == '101') {
	                $('#showimg5').text("上传文件格式不对");
	            } else {
	                $('#showimg5').text("上传失败");
	            }

	        },
	        error: function (err) {
	            alert(err.statusText)
	        }
	    });
	})
	//$("#btnUpload").click(function (evt) {
	//    var fileUpload = $("#emailfile").get(0);
	//    var files = fileUpload.files;

	//    var data = new FormData();
	//    for (var i = 0; i < files.length; i++) {
	//        data.append(files[i].name, files[i]);
	//    }

	//    $.ajax({
	//        url: dataUrl + "ajax/uploadFile.ashx",
	//        type: "POST",
	//        data: data,
	//        contentType: false,
	//        processData: false,
	//        success: function (result) { alert(result); },
	//        error: function (err) {
	//            alert(err.statusText)
	//        }
	//    });

	//    evt.preventDefault();
	//});
	//$("#emailfile").on("change", function () {
	//    var file = event.target.files[0];

	//    var data = new FormData();
	//    data.append(file.name, file);

	//    //var file = event.target.files[0];
	//    //// 判断是否文件 
	//    //if (!file) {
	//    //    return;
	//    //}

	//    //// 判断图片格式  
	//    //if (!(/\.(?:pdf|doc|docx|xls|xlsx)$/.test(file.name))) {
	//    //    alert('上传文件只能是pdf,doc,docx,xls,xlsx');
	//    //    return;
	//    //}

	//    //var reader = new FileReader();
	//    //reader.readAsDataURL(file);

	//    reader.onload = function (e) { // reader onload start  
	//        // ajax 上传文件
	//        $.post(dataUrl + "ajax/uploadFile.ashx", { data: data}, function (ret) {
	//            if (ret.State == '100') {
	//                //alert(ret.Picurl);
	//            } else {
	//                alert('上传失败');
	//            }
	//        }, 'json');
	//    } // reader onload end  
	//})

//	var coding = "";
//	for(var i = 0; i < 8; i++) {
//		coding += Math.floor(Math.random() * 10);
//	}	

	$('#orderFee').on('click', function() {
		location.href = 'orderfee.html?Id='+Id;
	})

	/*Tab切换*/
	$('.ordertab').on('click', function() {
		$('#sendbt1').addClass('none')
		$('#sendbt2').addClass('none')
		$('#sendcontainer').addClass('none')
		$('#send_file').addClass('none')
		$('#send1').removeClass('none')
		$('#isChange').prop("checked", false);
		$('#send_openGoods').addClass('none')
	})
	$('.opentab').on('click', function () {
	    $('#sendbt1').addClass('none')
	    $('#sendbt2').addClass('none')
	    $('#sendcontainer').addClass('none')
	    $('#send1').addClass('none')
	    $('#send_file').addClass('none')
	    $('#send_openGoods').removeClass('none')
	})
	$('.filetab').on('click', function () {
	    $('#sendbt1').addClass('none')
	    $('#sendbt2').addClass('none')
	    $('#sendcontainer').addClass('none')
	    $('#send1').addClass('none')
	    $('#send_file').removeClass('none')
	    $('#send_openGoods').addClass('none')
	})
	$('.followtab').on('click', function() {
		$("#FOLLOWLIST").empty()
		if(action=='modify'){
			//跟进管理
			common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfollow", {
				"bookingId": Id
			}, function(data) {
				//console.log(data.Data)
				if(data.State == 1) {
					var _data = data.Data;
					for(var i = 0; i < _data.length; i++) {
					    var feilist = '<tr><td>' + _data[i].bofo_time.substring(0, 16).replace('T', ' ') + '</td><td>' + _data[i].bofo_userName + '</td><td>' + _data[i].bofo_state + '</td></tr>'
						$("#FOLLOWLIST").append(feilist)
					}
				}
			
			}, function(err) {
				console.log(err)
			}, 2000)
		}
	})	

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
			(volumeNum0_sum>0 && volumeNum0_sum!=$('#volumeNum').val()?($('#volumeNum').val(volumeNum0_sum)):"");
			(package0_sum>0 && package0_sum!=$('#packageNum').val()?($('#packageNum').val(package0_sum)):"");
			(weightNum0_sum>0 && weightNum0_sum!=$('#weightNum').val()?($('#weightNum').val(weightNum0_sum)):"");
		}
	}

	$('.containertab').on('click', function() {
		$('#sendbt1').addClass('none')
		$('#sendbt2').addClass('none')
		$('#send1').addClass('none')
		$('#send_file').addClass('none')
		$('#sendcontainer').removeClass('none')
		$('#send_openGoods').addClass('none')
		// $('#selectSamevalueTooltip').tooltip('toggle')
		// setTimeout(function(){
		// 	$('#selectSamevalueTooltip').tooltip('hide');
		// }, 5000);
		//var _containerTabStatusVal=$('#containerTabStatus').val();
		// if(action=='modify' && _containerTabStatusVal==0){
		// }
		
	})	

	/*新增HBL*/
	$('.billnew').on('click', function() {
		$('#sendbt1').removeClass('none')
		$('#sendbt2').addClass('none')
		$('#send1').addClass('none')
		$('#sendcontainer').addClass('none')
		$('#send_file').addClass('none')
		$('#send_openGoods').addClass('none')
		$('.HBLNav').text('新增HBL订单信息')

		$('#isChange').prop("checked", false);
		
		$('#shippingTerm2').val($('#shippingTerm').val())
		$('#shippingFeeTerm2').val($('#shippingFeeTerm').val())
		$('#payAddress2').val($('#payAddress').val())
		$('#signAddress2').val($('#signAddress').val())
		$('#packageMarks2').val($('#packageMarks').val())
		$('#goodAbout2').val($('#goodAbout').val())
		$('#packageNum2').val($('#packageNum').val())
		$('#package2').val($("#package").val()).trigger("change")
		$('#weightNum2').val($('#weightNum').val())
		$('#weight2').val($("#weight").val()).trigger("change")
		$('#volumeNum2').val($('#volumeNum').val())
		$('#volume2').val($("#volume").val()).trigger("change")
		$('#vgmNum2').val($('#vgmNum').val())
		$('#vgm2').val($("#vgm").val()).trigger("change")
		$('#volumeShow2').val($('#volumeNum2').val() + ' ' + $("#volume2").val())
		$('#weightShow2').val($('#weightNum2').val() + ' ' + $("#weight2").val())

		$("#billcontainer").add('none')
		if(action=='modify'){
			loadContainer(1,Id)
		}
	})

	//加载集装箱
	function loadContainer(whichId,Id){
		$(".containerlist00").empty()
		common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {
			"whichId": whichId,
			"bookingId": Id
		}, function(data) {
			console.log(data)
			if(data.State == 1) {
				var _data = data.Data;
				for(var i = 0; i < _data.length; i++) {
					var package0 = _data[i].boco_package.split(' ')
					var weight0 = _data[i].boco_weight.split(' ')
					var volume0 = _data[i].boco_volume.split(' ')
					var vgm0 = _data[i].boco_vgm.split(' ')
					var crmlist = '<div class="margin-left-40" style="clear: both;">'+
					'<label for="inputPassword3" class="margin-right-5 margin-top-5" style="width:2%; float: left;"><input type="checkbox" name="containerli" value="' + _data[i].boco_id + '" checked></label>' + 
					'<select id="containerType00" class="no-padding-left no-padding-right margin-right-5" style="width:7%; float: left;">' +
					'</select>' +
					'<input type="text" class="form-control margin-right-5" id="number00" value="' + _data[i].boco_number + '" style="width:10%;float: left;">' +
						'<input type="text" class="form-control margin-right-5" id="sealNumber00" value="' + _data[i].boco_sealNumber + '" style="width:10%;float: left;">' +
						'<input type="text" class="form-control margin-right-5" id="packageNum00" value="' + package0[0] + '" style="width:4%;float: left;">' +
						'<select id="package00" class="no-padding-left no-padding-right margin-right-5" style="width:8%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="weightNum00"  value="' + weight0[0] + '" style="width:5%;float: left;">' +
						'<select id="weight00" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="volumeNum00"  value="' + volume0[0] + '" style="width:5%;float: left;">' +
						'<select id="volume00" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="vgmNum00"  value="' + vgm0[0] + '" style="width:5%;float: left;">' +
						'<select id="vgm00" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="customsCode00" value="' + _data[i].boco_customsCode + '" style="width:10%;float: left;">' +
						'<input type="text" class="form-control margin-right-10" id="goodsName00" value="' + _data[i].boco_goodsName + '" style="width:10%;float: left;"></div>'

						$(".containerlist00").prepend(crmlist)
						$('#containerType00').html($('#trailerNumUnit').html())
						$('#containerType00').val(_data[i].boco_typeName).trigger("change")
						$('#package00').html($('#package').html())
						$('#package00').val(package0[1]).trigger("change")
						$('#volume00').html($('#volume').html())
						$('#volume00').val(volume0[1]).trigger("change")
						$('#weight00').html($('#weight').html())
						$('#weight00').val(weight0[1]).trigger("change")
						$('#vgm00').html($('#weight').html())
						$('#vgm00').val(vgm0[1]).trigger("change")	
						
						
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)
	}	
	function loadContainer2(whichId,Id){
	    $(".containerlist3").empty()
        var arrContainer = []
		common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {
			"whichId": whichId,
			"bookingId": Id
		}, function(data) {
			console.log(data)
			if(data.State == 1) {
				var _data = data.Data;
				for (var i = 0; i < _data.length; i++) {
				    arrContainer.push(_data[i].boco_number + "/" + _data[i].boco_sealNumber + "/" + _data[i].boco_sealNumber + "/" + _data[i].boco_package + "/" + _data[i].boco_weight + "/" + _data[i].boco_volume + "/" + _data[i].boco_vgm + "/" + _data[i].boco_customsCode + "/" + _data[i].boco_goodsName)
					var package0 = _data[i].boco_package.split(' ')
					var weight0 = _data[i].boco_weight.split(' ')
					var volume0 = _data[i].boco_volume.split(' ')
					var vgm0 = _data[i].boco_vgm.split(' ')
					var crmlist = '<div class="margin-left-40" style="clear: both;">'+
					'<label for="inputPassword3" class="margin-right-5 margin-top-5" style="width:2%; float: left;"><input type="checkbox" name="containerli" checked="checked" value="' + _data[i].boco_id + '"></label>' + 
					'<select id="containerType30" class="no-padding-left no-padding-right margin-right-5" style="width:7%; float: left;">' +
					'</select>' +
					'<input type="text" class="form-control margin-right-5" id="number30" value="' + _data[i].boco_number + '" style="width:10%;float: left;">' +
						'<input type="text" class="form-control margin-right-5" id="sealNumber30" value="' + _data[i].boco_sealNumber + '" style="width:10%;float: left;">' +
						'<input type="text" class="form-control margin-right-5" id="packageNum30" value="' + package0[0] + '" style="width:4%;float: left;">' +
						'<select id="package30" class="no-padding-left no-padding-right margin-right-5" style="width:8%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="weightNum30"  value="' + weight0[0] + '" style="width:5%;float: left;">' +
						'<select id="weight30" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="volumeNum30"  value="' + volume0[0] + '" style="width:5%;float: left;">' +
						'<select id="volume30" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="vgmNum30"  value="' + vgm0[0] + '" style="width:5%;float: left;">' +
						'<select id="vgm30" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="customsCode30" value="' + _data[i].boco_customsCode + '" style="width:10%;float: left;">' +
						'<input type="text" class="form-control margin-right-10" id="goodsName30" value="' + _data[i].boco_goodsName + '" style="width:10%;float: left;"></div>'

						$(".containerlist3").prepend(crmlist)
						$('#containerType30').html($('#trailerNumUnit').html())
						$('#containerType30').val(_data[i].boco_typeName).trigger("change")
						$('#package30').html($('#package').html())
						$('#package30').val(package0[1]).trigger("change")
						$('#volume30').html($('#volume').html())
						$('#volume30').val(volume0[1]).trigger("change")
						$('#weight30').html($('#weight').html())
						$('#weight30').val(weight0[1]).trigger("change")
						$('#vgm30').html($('#weight').html())
						$('#vgm30').val(vgm0[1]).trigger("change")	
						
						
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)

		if (action == 'modify') {
		    common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {
		        "whichId": 1,
		        "bookingId": GetQueryString('Id')
		    }, function (data) {
		        console.log(data)
		        if (data.State == 1) {
		            var _data = data.Data;
		            for (var i = 0; i < _data.length; i++) {
		                var _container = _data[i].boco_number + "/" + _data[i].boco_sealNumber + "/" + _data[i].boco_sealNumber + "/" + _data[i].boco_package + "/" + _data[i].boco_weight + "/" + _data[i].boco_volume + "/" + _data[i].boco_vgm + "/" + _data[i].boco_customsCode + "/" + _data[i].boco_goodsName
		                if (arrContainer.indexOf(_container) == -1) {
		                    var package0 = _data[i].boco_package.split(' ')
		                    var weight0 = _data[i].boco_weight.split(' ')
		                    var volume0 = _data[i].boco_volume.split(' ')
		                    var vgm0 = _data[i].boco_vgm.split(' ')
		                    var crmlist = '<div class="margin-left-40" style="clear: both;">' +
                            '<label for="inputPassword3" class="margin-right-5 margin-top-5" style="width:2%; float: left;"><input type="checkbox" name="containerli" value="' + _data[i].boco_id + '"></label>' +
                            '<select id="containerType30" class="no-padding-left no-padding-right margin-right-5" style="width:7%; float: left;">' +
                            '</select>' +
                            '<input type="text" class="form-control margin-right-5" id="number30" value="' + _data[i].boco_number + '" style="width:10%;float: left;">' +
                                '<input type="text" class="form-control margin-right-5" id="sealNumber30" value="' + _data[i].boco_sealNumber + '" style="width:10%;float: left;">' +
                                '<input type="text" class="form-control margin-right-5" id="packageNum30" value="' + package0[0] + '" style="width:4%;float: left;">' +
                                '<select id="package30" class="no-padding-left no-padding-right margin-right-5" style="width:8%;float: left;" disabled>' +
                                '</select>' +
                                '<input type="text" class="form-control margin-right-5" id="weightNum30"  value="' + weight0[0] + '" style="width:5%;float: left;">' +
                                '<select id="weight30" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
                                '</select>' +
                                '<input type="text" class="form-control margin-right-5" id="volumeNum30"  value="' + volume0[0] + '" style="width:5%;float: left;">' +
                                '<select id="volume30" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
                                '</select>' +
                                '<input type="text" class="form-control margin-right-5" id="vgmNum30"  value="' + vgm0[0] + '" style="width:5%;float: left;">' +
                                '<select id="vgm30" class="no-padding-left no-padding-right margin-right-5" style="width:5%;float: left;" disabled>' +
                                '</select>' +
                                '<input type="text" class="form-control margin-right-5" id="customsCode30" value="' + _data[i].boco_customsCode + '" style="width:10%;float: left;">' +
                                '<input type="text" class="form-control margin-right-10" id="goodsName30" value="' + _data[i].boco_goodsName + '" style="width:10%;float: left;"></div>'

		                    $(".containerlist3").prepend(crmlist)
		                    $('#containerType30').html($('#trailerNumUnit').html())
		                    $('#containerType30').val(_data[i].boco_typeName).trigger("change")
		                    $('#package30').html($('#package').html())
		                    $('#package30').val(package0[1]).trigger("change")
		                    $('#volume30').html($('#volume').html())
		                    $('#volume30').val(volume0[1]).trigger("change")
		                    $('#weight30').html($('#weight').html())
		                    $('#weight30').val(weight0[1]).trigger("change")
		                    $('#vgm30').html($('#weight').html())
		                    $('#vgm30').val(vgm0[1]).trigger("change")
		                }



		            }
		        }

		    }, function (err) {
		        console.log(err)
		    }, 2000)
		}
	}
	
	//订单状态
	common.ajax_req("get", false, dataUrl, "state.ashx?action=readbytypeid", {
		"typeId": 4
	}, function(data) {
		console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
				//var statelist = '<span class="col-sm-1 widget-caption text-align-center bordered-1 bordered-gray" stateId='+_data[i].state_id+'>' + _data[i].state_name_cn + '</span>'
			    var statelist = '<li data-target="#simplewizardstep' + _data[i].state_id + '" stateId="' + _data[i].state_id + '">' + _data[i].state_name_cn + '<span class="chevron"></span></li>'
				$("#STATELIST").append(statelist)
			}
		}
		
		$('#STATELIST li').on('click', function() {
		    var which = $(this)
            console.log(which)
			if((which.attr('stateId')-stateId)==1){				
				common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newfollow', {
					'bookingId': Id,
					'userId': userID,
					'userName': userName,
					'stateId': which.attr('stateId'),
					'state': which.text()
				}, function(data) {
					if(data.State == 1) {
						//console.log(which.text())
					    //which.addClass('btn-blue')
					    which.addClass('active')
						comModel("操作成功")
					} else {
						comModel("操作失败")
					}
				}, function(error) {
					console.log(parm)
				}, 1000)
			}else {
				comModel("不可操作")
			}

		})
	
	}, function(err) {
		console.log(err)
	}, 2000)

	//销售人员userinfo.ashx?action=read
	common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
	    'rolename': '销售',
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
    //录单人员
	common.ajax_req('GET', false, dataUrl, 'userinfo.ashx?action=read', {
	    'rolename': '录单',
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
	    'rolename': '客服',
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
	    'rolename': '操作',
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

    	
	//获取委托人列表
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
		"companyId": companyID
	}, function(data) {
		//console.log(data)
		var _data = data.data;
		if(_data != null) {
			for(var i = 0; i < _data.length; i++) {
			    var _html = '<option value="' + _data[i].comp_id + '" data-adminId=' + _data[i].comp_adminId + ' data-customerId=' + _data[i].comp_customerId + '>' + _data[i].comp_name + '</option>';
			    $('#crmuser').append(_html)
			    $('#toCompany_6').append(_html)
			}
		}	
	}, function(err) {
		console.log(err)
	}, 2000)
	
	$("#crmuser").change(function() {
		crmCompanyId = $("#crmuser").val();
		_selectSupplier(crmCompanyId)
		customerId = $("#crmuser").find("option:selected").attr("data-customerId")
		_selectBill(customerId)
		crmCompanyName = $("#crmuser").find("option:selected").text();
		_selectPackingCom(crmCompanyId, crmCompanyName) //获取装箱公司

		var adminId = $("#crmuser").find("option:selected").attr("data-adminId")
		$("#sellId").val(adminId).trigger("change")

	    //判断委托人是否有订单
		if (action == "add") { 
		    common.ajax_req("get", false, dataUrl, "booking.ashx?action=read", {
		        "companyId": companyID,
		        "crmId": crmCompanyId
		    }, function (data) {
		        //console.log(data)
		        var _data = data.data;
		        if (_data != null) {
		            $("#has_copy_orderCode").val(_data[0].book_orderCode);
		            $("#myModal_has_copy").modal("show");
		        }
		    }, function (err) {
		        console.log(err)
		    }, 2000)

		    $('#btnHasCopySave').click(function () {
		        //是否复制费用
		        var isCopyFee = 0;
		        if ($("#has_copy_orderFee").is(":checked")) {
		            isCopyFee = 1
		        } else {
		            isCopyFee = 0
		        }
		        //是否复制仓库
		        var isCopyWarehouse = 0;
		        if ($("#has_copy_orderWarehouse").is(":checked")) {
		            isCopyWarehouse = 1
		        } else {
		            isCopyWarehouse = 0
		        }
		        //是否复制拖车
		        var isCopyTrailer = 0;
		        if ($("#has_copy_orderTrailer").is(":checked")) {
		            isCopyTrailer = 1
		        } else {
		            isCopyTrailer = 0
		        }

		        if ($('#has_copy_orderCode').val() == "") {
		            comModel("订单号不能为空！")
		        } else {
		            var parm = {
		                'ordercode': $('#has_copy_orderCode').val(),
		                'companyId': companyID,
		                'userId': userID,
		                'isCopyFee': isCopyFee,
		                'isCopyWarehouse': isCopyWarehouse,
		                'isCopyTrailer': isCopyTrailer
		            }
		            console.log(parm)
		            common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=copyorder', parm, function (data) {
		                if (data.State == 1) {
		                    comModel("订单复制成功")
		                    location.href = "orderadd.html?action=modify&Id=" + data.Data
		                } else {
		                    comModel("订单复制失败")
		                }
		                $("#myModal_has_copy").modal("hide");
		            }, function (error) {
		            }, 2000)
		        }

		    });
		}
	})
	
	function _selectSupplier(crmId){
		//获取供应商列表
		common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
			"upId": crmId
		}, function(data) {
			//console.log(data)
			var _data = data.data;
			if(_data != null) {
				for(var i = 0; i < _data.length; i++) {
					//var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"> ' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].comp_contactName + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：' + _data[i].comp_contactPhone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：' + _data[i].comp_contactEmail + '</div>'
					var crmlist = '<tr class="margin-left-40"><td><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"></td><td> ' + _data[i].comp_name + '</td><td>联系人：' + _data[i].comp_contactName + '</td><td>联系电话：' + _data[i].comp_contactPhone + '</td><td>邮箱：' + _data[i].comp_contactEmail + '</td></tr>'
					$(".crmlist").append(crmlist)
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)
	}

	function _selectPackingCom(crmId, crmCompanyName) {
	    //获取装箱公司
	    $("#packingCompany").append('<option value="' + crmId + '" selected>' + crmCompanyName + '</option>')
	    common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=readbyid", {
	        "Id": crmId
	    }, function (data) {
	        var _data = data.Data;
	        $("#trailerAddress").val(_data.comp_address);
	        $("#trailerContact").val(_data.comp_contactName);
	        $("#trailerContactWay").val(_data.comp_contactPhone + '|' + _data.comp_contactEmail);
	    }, function (err) {
	        console.log(err)
	    }, 2000)
	    common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=read", {
	        "upId": crmId
	    }, function (data) {
	        //console.log(data)
	        var _data = data.data;
	        if (_data != null) {
	            for (var i = 0; i < _data.length; i++) {
	                //var crmlist = '<div class="margin-left-40"><input type="checkbox" name="crmli" value="' + _data[i].comp_customerId + '"> ' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].comp_contactName + '&nbsp;&nbsp;&nbsp;&nbsp;联系电话：' + _data[i].comp_contactPhone + '&nbsp;&nbsp;&nbsp;&nbsp;邮箱：' + _data[i].comp_contactEmail + '</div>'
	                var crmlist = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>'
	                $("#packingCompany").append(crmlist)
	            }
	        }

	    }, function (err) {
	        console.log(err)
	    }, 2000)
	}
	
	//自定货
	//common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
	//	"companyId": companyID,
	//	'isSupplier': '1'
	//}, function(data) {
	//	//console.log(data)
	//	var _data = data.data;
	//	if(_data != null) {
	//		for(var i = 0; i < _data.length; i++) {
	//			var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name + '</option>';
	//			$('#forwarder').append(_html)
	//		}
	//	}	
	//}, function(err) {
	//	console.log(err)
    //}, 2000)
	$("#forwarder").select2({
	    ajax: {
	        //url: dataUrl + "ajax/crmcompany.ashx?action=readforwarder&isSupplier=1&companyId=" + companyID,
	        url: dataUrl + "ajax/crmcompany.ashx?action=readforwarder&companyId=" + companyID,
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
	    placeholder: '请选择自定货', //默认文字提示
	    language: "zh-CN",
	    tags: true, //允许手动添加
	    allowClear: true, //允许清空
	    escapeMarkup: function (markup) {
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
	
	//仓储代理
	//common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
	//	"companyId": companyID,
	//	'type': 'WAREHOUSE AGENT'
	//}, function(data) {
	//	console.log(data)
	//	var _data = data.data;
	//	if(_data != null) {
	//		for(var i = 0; i < _data.length; i++) {
	//			var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name  + '</option>';
	//			$('#warehouse').append(_html)
	//		}
	//	}	
	//}, function(err) {
	//	console.log(err)
    //}, 2000)
	$("#warehouse").select2({
	    ajax: {
	        url: dataUrl + "ajax/crmcompany.ashx?action=readbytype&type=WAREHOUSE AGENT&companyId=" + companyID,
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
	    placeholder: '请选择仓储', //默认文字提示
	    language: "zh-CN",
	    tags: true, //允许手动添加
	    allowClear: true, //允许清空
	    escapeMarkup: function (markup) {
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
	$("#warehouse").change(function () {
	    var companyId_Contact = $("#warehouse").val();
	    if (companyId_Contact != null) {
	        common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=readbyid", {
	            "Id": companyId_Contact
	        }, function (data) {
	            var _data = data.Data;
	            $("#warehouseAddress").val(_data.comp_address);
	        }, function (err) {
	            console.log(err)
	        }, 2000)
	        common.ajax_req("get", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
	            "companyId": companyId_Contact
	        }, function (data) {
	            var _data = data.data;
	            $('#warehouseContact').empty();
	            $('#warehouseContact').append('<option value="0">选择联系人</option>')
	            if (_data != null) {
	                for (var i = 0; i < _data.length; i++) {
	                    var _html = ''
	                    if (i == 0) {
	                        _html = '<option selected value="' + _data[i].coco_id + '" data-carrierContactName="' + _data[i].coco_name + '" data-carrierContactEmail="' + _data[i].coco_phone + ";" + _data[i].coco_email + '">' + _data[i].coco_name + '</option>';
	                    } else {
	                        _html = '<option value="' + _data[i].coco_id + '" data-carrierContactName="' + _data[i].coco_name + '" data-carrierContactEmail="' + _data[i].coco_phone + ";" + _data[i].coco_email + '">' + _data[i].coco_name + '</option>';
	                    }

	                    $('#warehouseContact').append(_html)
	                }
	            }
	        }, function (err) {
	            console.log(err)
	        }, 2000)
	    }

	})

	$("#warehouseContact").change(function () {
	    $("#warehouseContactWay").val($("#warehouseContact").find("option:selected").attr("data-carrierContactEmail"));
	})
	
	//陆运代理
	//common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
	//	"companyId": companyID,
	//	'type': 'LAND TRANSPORTATION AGENT'
	//}, function(data) {
	//	//console.log(data)
	//	var _data = data.data;
	//	if(_data != null) {
	//		for(var i = 0; i < _data.length; i++) {
	//			var _html = '<option value="' + _data[i].comp_id + '">' + _data[i].comp_name  + '</option>';
	//			$('#trailer').append(_html)
	//		}
	//	}	
	//}, function(err) {
	//	console.log(err)
    //}, 2000)
	$("#trailer").select2({
	    ajax: {
	        url: dataUrl + "ajax/crmcompany.ashx?action=readbytype&type=LAND TRANSPORTATION AGENT&companyId=" + companyID,
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
	    placeholder: '请选择车行', //默认文字提示
	    language: "zh-CN",
	    tags: true, //允许手动添加
	    allowClear: true, //允许清空
	    escapeMarkup: function (markup) {
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
	$("#packingCompany").change(function () {
	    var companyId_Contact = $("#packingCompany").val();
	    common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=readbyid", {
	        "Id": companyId_Contact
	    }, function (data) {
	        var _data = data.Data;
	        $("#trailerAddress").val(_data.comp_address);
	        $("#trailerContact").val(_data.comp_contactName);
	        $("#trailerContactWay").val(_data.comp_contactPhone + '|' + _data.comp_contactEmail);
	    }, function (err) {
	        console.log(err)
	    }, 2000)
	    //common.ajax_req("get", true, dataUrl, "crmcompanycontact.ashx?action=readtop", {
	    //    "companyId": companyId_Contact
	    //}, function (data) {
	    //    var _data = data.data;
	    //    $('#trailerContact').empty();
	    //    $('#trailerContact').append('<option value="0">选择联系人</option>')
	    //    if (_data != null) {
	    //        for (var i = 0; i < _data.length; i++) {
	    //            var _html = '<option value="' + _data[i].coco_id + '" data-carrierContactName="' + _data[i].coco_name + '" data-carrierContactEmail="' + _data[i].coco_phone + "|" + _data[i].coco_email + '">' + _data[i].coco_name + '</option>';
	    //            $('#trailerContact').append(_html)
	    //        }
	    //    }
	    //}, function (err) {
	    //    console.log(err)
	    //}, 2000)
	})

	//$("#trailerContact").change(function () {
	//    $("#trailerContactWay").val($("#trailerContact").find("option:selected").attr("data-carrierContactEmail"));
	//})

	function _selectBill(customerId) {
		//SHIPPER
		$('#Shipper').empty()
		$('#Shipper2').empty()
		$('#Shipper3').empty()
		common.ajax_req('GET', false, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 1,
			'actionId': companyID,
			'companyId': customerId
		}, function(data) {
			var _data = data.data;
			if(_data != null) {
				$("#inShipper").val(HtmlDecode(_data[0].cobi_content))
				$("#inShipper2").val(HtmlDecode(_data[0].cobi_content))
				$("#inShipper3").val(HtmlDecode(_data[0].cobi_content))
				for(var i = 0; i < _data.length; i++) {
					var content = _data[i].cobi_content.split('<br>')
					var _html = '<option value="' + _data[i].cobi_content + '">' + content[0] + '</option>';
					$('#Shipper').append(_html)
					$('#Shipper2').append(_html)
					$('#Shipper3').append(_html)
				}
			}
			$('#Shipper').append('<option value="0">新增</option>')
			$('#Shipper2').append('<option value="0">新增</option>')
			$('#Shipper3').append('<option value="0">新增</option>')
		}, function(error) {
			//console.log(parm)
		}, 1000)
		$("#Shipper").click(function() {
			var opt = $("#Shipper").val();
			if(opt != '0') {
				$("#inShipper").val(HtmlDecode(opt))
			} else {
			    _addBillFun(1, 1, customerId)
			}
		})
		$("#Shipper2").click(function() {
			var opt = $("#Shipper2").val();
			if(opt != '0') {
				$("#inShipper2").val(HtmlDecode(opt))
			} else {
			    _addBillFun(1, 2, customerId)
			}
		})
		$("#Shipper3").click(function() {
			var opt = $("#Shipper3").val();
			if(opt != '0') {
				$("#inShipper3").val(HtmlDecode(opt))
			} else {
			    _addBillFun(1, 3, customerId)
			}
		})		
		
		//CONSIGNEE
		$('#Consignee').empty()
		$('#Consignee2').empty()
		$('#Consignee3').empty()
		common.ajax_req('GET', false, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 2,
			'actionId': companyID,
			'companyId': customerId
		}, function(data) {
			var _data = data.data;
			if(_data != null) {
				$("#inConsignee").val(HtmlDecode(_data[0].cobi_content))
				$("#inConsignee2").val(HtmlDecode(_data[0].cobi_content))
				$("#inConsignee3").val(HtmlDecode(_data[0].cobi_content))
				for(var i = 0; i < _data.length; i++) {
					var content = _data[i].cobi_content.split('<br>')
					var _html = '<option value="' + _data[i].cobi_content + '">' + content[0] + '</option>';
					$('#Consignee').append(_html)
					$('#Consignee2').append(_html)
					$('#Consignee3').append(_html)
				}
			}
			$('#Consignee').append('<option value="0">新增</option>')
			$('#Consignee2').append('<option value="0">新增</option>')
			$('#Consignee3').append('<option value="0">新增</option>')
		}, function(error) {
			//console.log(parm)
		}, 1000)
		$("#Consignee").click(function() {
			var opt = $("#Consignee").val();
			if(opt != '0') {
				$("#inConsignee").val(HtmlDecode(opt))
			} else {
			    _addBillFun(2, 1, customerId)
			}
		})
		$("#Consignee2").click(function() {
			var opt = $("#Consignee2").val();
			if(opt != '0') {
				$("#inConsignee2").val(HtmlDecode(opt))
			} else {
			    _addBillFun(2, 2, customerId)
			}
		})
		$("#Consignee3").click(function() {
			var opt = $("#Consignee3").val();
			if(opt != '0') {
				$("#inConsignee3").val(HtmlDecode(opt))
			} else {
			    _addBillFun(2, 3, customerId)
			}
		})
		
		//NOTIFYPARTY
		$('#NotifyParty').empty()
		$('#NotifyParty2').empty()
		$('#NotifyParty3').empty()
		$('#AlsoNotify').empty()
		$('#AlsoNotify2').empty()
		$('#AlsoNotify3').empty()
		common.ajax_req('GET', false, dataUrl, 'crmCompanybill.ashx?action=read', {
			'typeId': 3,
			'actionId': companyID,
			'companyId': customerId
		}, function(data) {
			var _data = data.data;
			if(_data != null) {
				$("#inNotifyParty").val(HtmlDecode(_data[0].cobi_content))
				$("#inNotifyParty2").val(HtmlDecode(_data[0].cobi_content))
				$("#inNotifyParty3").val(HtmlDecode(_data[0].cobi_content))
				$("#inAlsoNotify").val(HtmlDecode(_data[0].cobi_content))
				$("#inAlsoNotify2").val(HtmlDecode(_data[0].cobi_content))
				$("#inAlsoNotify3").val(HtmlDecode(_data[0].cobi_content))
				for(var i = 0; i < _data.length; i++) {
					var content = _data[i].cobi_content.split('<br>')
					var _html = '<option value="' + _data[i].cobi_content + '">' + content[0] + '</option>';
					$('#NotifyParty').append(_html)
					$('#NotifyParty2').append(_html)
					$('#NotifyParty3').append(_html)
					$('#AlsoNotify').append(_html)
					$('#AlsoNotify2').append(_html)
					$('#AlsoNotify3').append(_html)
				}
			}
			$('#NotifyParty').append('<option value="0">新增</option>')
			$('#NotifyParty2').append('<option value="0">新增</option>')
			$('#NotifyParty3').append('<option value="0">新增</option>')
			$('#AlsoNotify').append('<option value="0">新增</option>')
			$('#AlsoNotify2').append('<option value="0">新增</option>')
			$('#AlsoNotify3').append('<option value="0">新增</option>')
		}, function(error) {
			//console.log(parm)
		}, 1000)
		$("#NotifyParty").click(function() {
			var opt = $("#NotifyParty").val();
			if(opt != '0') {
				$("#inNotifyParty").val(HtmlDecode(opt))
			} else {
			    _addBillFun(3, 1, customerId)
			}
		})
		$("#NotifyParty2").click(function() {
			var opt = $("#NotifyParty2").val();
			if(opt != '0') {
				$("#inNotifyParty2").val(HtmlDecode(opt))
			} else {
			    _addBillFun(3, 2, customerId)
			}
		})
		$("#NotifyParty3").click(function() {
			var opt = $("#NotifyParty3").val();
			if(opt != '0') {
				$("#inNotifyParty3").val(HtmlDecode(opt))
			} else {
			    _addBillFun(3, 3, customerId)
			}
		})		
		$("#AlsoNotify").click(function() {
			var opt = $("#AlsoNotify").val();
			if(opt != '0') {
				$("#inAlsoNotify").val(HtmlDecode(opt))
			} else {
			    _addBillFun(3, 4, customerId)
			}
		})
		$("#AlsoNotify2").click(function() {
			var opt = $("#AlsoNotify2").val();
			if(opt != '0') {
				$("#inAlsoNotify2").val(HtmlDecode(opt))
			} else {
			    _addBillFun(3, 5, customerId)
			}
		})
		$("#AlsoNotify3").click(function() {
			var opt = $("#AlsoNotify3").val();
			if(opt != '0') {
				$("#inAlsoNotify3").val(HtmlDecode(opt))
			} else {
			    _addBillFun(3, 6, customerId)
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
								'companyId': customerId,
								//'name': billName,
								'content': billContent,
								'typeId': billTypeId,
								'typeName': billTypeName
							}
							
							common.ajax_req('POST', true, dataUrl, 'crmcompanybill.ashx?action=new', parm, function(data) {
								if(data.State == 1) {
									comModel("新增成功")
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
									if(where == 3 && typeId == 1) {
										$('#Shipper3').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#Shipper3').val(billContent).trigger("change")
										$("#inShipper3").val(HtmlDecode(billContent))
									}
									if(where == 3 && typeId == 2) {
										$('#Consignee3').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#Consignee3').val(billContent).trigger("change")
										$("#inConsignee3").val(HtmlDecode(billContent))
									}
									if(where == 3 && typeId == 3) {
										$('#NotifyParty3').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#NotifyParty3').val(billContent).trigger("change")
										$("#inNotifyParty3").val(HtmlDecode(billContent))
									}
									if(where == 4 && typeId == 3) {
										$('#AlsoNotify').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#AlsoNotify').val(billContent).trigger("change")
										$("#inAlsoNotify").val(HtmlDecode(billContent))
									}
									if(where == 5 && typeId == 3) {
										$('#AlsoNotify2').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#AlsoNotify2').val(billContent).trigger("change")
										$("#inAlsoNotify2").val(HtmlDecode(billContent))
									}	
									if(where == 6 && typeId == 3) {
										$('#AlsoNotify3').prepend('<option value="' + billContent + '">' + newBillContent[0] + '</option>')
										$('#AlsoNotify3').val(billContent).trigger("change")
										$("#inAlsoNotify3").val(HtmlDecode(billContent))
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
						$('#Shipper3').val(HtmlEncode($("#inShipper3").val())).trigger("change")
						$('#Consignee3').val(HtmlEncode($("#inConsignee3").val())).trigger("change")
						$('#NotifyParty3').val(HtmlEncode($("#inNotifyParty3").val())).trigger("change")
						$('#AlsoNotify').val(HtmlEncode($("#inAlsoNotify").val())).trigger("change")
						$('#AlsoNotify2').val(HtmlEncode($("#inAlsoNotify2").val())).trigger("change")
						$('#AlsoNotify3').val(HtmlEncode($("#inAlsoNotify3").val())).trigger("change")
					}
				}
			}
		});
	}	

	//提单类型
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 12,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#billType').append(_html)
			$('#billType2').append(_html)
			$('#billType3').append(_html)
			$('#opgo_orderType').append(_html)
		}
		$("#billType").val('OMBL').trigger("change")
		$("#billType2").val('OHBL').trigger("change")
		$("#billType3").val('OMBL').trigger("change")
	}, function(error) {
		console.log(parm)
	}, 1000)
	
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
	$("#port1,#port2,#port3,#port4,#port5").select2({
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
		allowClear: true, //允许清空
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
	$("#port3").on('change',function() {
		var opt = $("#port3").val();
	    //console.log(opt)
		if (opt != '') {
		    $('#port2,#port4').html('<option value="' + opt + '">' + opt + '</option>').trigger("change")
		}
	})		
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
//	$('#port3').html($('#port1').html())
//	$('#port4').html($('#port1').html())
//	$('#port5').html($('#port1').html())
//	$("#port3").click(function() {
//		var opt = $("#port3").val();
//		$("#port2").val(opt).trigger("change")
//		$("#port4").val(opt).trigger("change")
//	})	
		
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
//		//console.log(parm)
//	}, 2000)
	
	//柜型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 4,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#containerType').append(_html)
			$('#trailerNumUnit').append(_html)
		}
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
			$('#package2').append(_html)
			$('#package3').append(_html)
			$('#package0').append(_html)
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
			$('#weight2').append(_html)
			$('#weight3').append(_html)
			$('#weight0').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	$('#vgm').html($('#weight').html())
	$('#vgm2').html($('#weight').html())
	$('#vgm3').html($('#weight').html())
	$('#vgm0').html($('#weight').html())
	$('#vgminfoUnit').html($('#weight').html())
	
	//体积单位
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 9,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < _data.length; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#volume').append(_html)
			$('#volume2').append(_html)
			$('#volume3').append(_html)
			$('#volume0').append(_html)
		}
	}, function(error) {
		console.log(parm)
	}, 1000)
	
//	//费用类型
//	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
//		'typeId': 17,
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
//			$('#feeType').append(_html)
//		}
//	}, function(error) {
//		console.log(parm)
//	}, 1000)	
//	
//	//费用单位
//	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
//		'typeId': 13,
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
//			$('#feeUnit').append(_html)
//		}
//	}, function(error) {
//		console.log(parm)
//	}, 1000)		
//	
//	//单位
//	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
//		'typeId': 18,
//		'companyId': companyID
//	}, function(data) {
//		var _data = data.data;
//		for(var i = 0; i < _data.length; i++) {
//			var _html = '<option value="' + _data[i].puda_name_cn + '">' + _data[i].puda_name_cn + '</option>';
//			$('#numUnit').append(_html)
//		}
//	}, function(error) {
//		console.log(parm)
//	}, 1000)	
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

    $('#ordermore').on('click', function() {
    	if($("#ordermore").is(":checked")) {
    		$("#ordermorelist").removeClass('none')
    	}
    	else{ $("#ordermorelist").addClass('none') }
    })
    
    $('#iscrm').on('click', function() {
    	if($("#iscrm").is(":checked")) {
    		$("#crmlist").removeClass('none')
    	}
    	else{ $("#crmlist").addClass('none') }
    })
    
    $('#iscontainer').on('click', function() {
    	if($("#iscontainer").is(":checked")) {
    		$("#containerlist").removeClass('none')
    	}
    	else{ $("#containerlist").addClass('none') }
    })
    
    $('#iscontainer3').on('click', function() {
    	if($("#iscontainer3").is(":checked")) {
    		$("#containerlist3").removeClass('none')
    	}
    	else{ $("#containerlist3").addClass('none') }
    })
    
//  $('#isbill1').on('click', function() {
//  	if($("#isbill1").is(":checked")) {
//  		$("#bill1list").removeClass('none')
//  	}
//  	else{ $("#bill1list").addClass('none') }
//  })
//  
//  $('#isbill2').on('click', function() {
//  	if($("#isbill2").is(":checked")) {
//  		$("#bill2list").removeClass('none')
//  	}
//  	else{ $("#bill2list").addClass('none') }
//  })
        
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

    $('#isvgminfo').on('click', function() {
    	if($("#isvgminfo").is(":checked")) {
    		$("#vgminfolist").removeClass('none')
    	} else {
    		$("#vgminfolist").addClass('none')
    	}
    })

    $('#isLock').on('click', function () {
        if ($("#isLock").is(":checked")) {
            isLock = 1;
            $('input,textarea').prop('disabled', true);
            $('select').prop('disabled', true);
        }
        else {
            isLock = 0;
            $('input,textarea').prop('disabled', false);
            $('select').prop('disabled', false);
        }
        $('#isLock').prop('disabled', false);
    })

    $('#isChange').on('click', function () {
        if ($("#isChange").is(":checked")) {
            if ($('.billmodiy').length==1) {
                var weightNum = $('#weightNum').val();
                var weight = $('#weight').val();
                $('#weightNum3').val(weightNum)
                $('#weight3').val(weight).trigger("change")
                $('#weightShow3').val(weightNum + ' ' + weight)

                var volumeNum = $('#weightNum').val();
                var volume = $('#weight').val();
                $('#volumeNum3').val(volumeNum)
                $('#volume3').val(volume).trigger("change")
                $('#volumeShow3').val(volumeNum + ' ' + volume)

                $('#packageNum3').val($('#packageNum').val())
                $('#package3').val($('#package').val()).trigger("change")

                $('#vgmNum3').val($('#vgmNum').val())
                $('#vgm3').val($('#vgm').val()).trigger("change")

                $('#packageMarks3').val($('#packageMarks').val())
                $('#goodAbout3').val($('#goodAbout').val())
            }

        }
        else {
        }
    })

    
    //集装箱处理
    // var boxRow = $('.containerList').clone()
    // $('.containerAll').delegate('.newContainer','click', function() {
    // 	//$(this).addClass('none')
    // 	//$(this).siblings('.removeContainer').removeClass('none')
    // 	$('.containerAll').append(boxRow)
    // 	boxRow = boxRow.clone()
    // })
    // $('.containerAll').delegate('.removeContainer','click', function() {
    // 	$(this).parents('.containerList').remove()
    // })


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
		if($('.removeContainer').length>1){
			$(this).parents('.containerList').remove();		
			$('#Containers').attr("data-update-status","1")
			GetContainerSum();
		}
	})

/*JQuery 限制文本框只能输入数字和小数点*/  
    $("#volumeNum,#weightNum,#packageNum,#packageNum0,#weightNum0,#volumeNum0,#vgmNum0,#vgminfoNum").keyup(function(){    
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

    $('#sendcontainer').click(function() {
    	if(!bookingId && action == 'add') {
    		comModel("请先保存MBL订单信息")
    	} else {
    	    var allPackageNum = 0, allWeightNum = 0, allVolumeNum = 0, allVgmNum = 0, allPackage, allWeight, allVolume, allVgm
    	    for (var i = 0; i < $('.containerList').length; i++) {
    	        if ($('.containerList').eq(i).find('#packageNum0').val() != '') {
    	            allPackageNum = parseInt(allPackageNum) + parseInt($('.containerList').eq(i).find('#packageNum0').val())
    	        }
    	        if ($('.containerList').eq(i).find('#weightNum0').val() != '') {
    	            allWeightNum = parseFloat(allWeightNum.toFixed(2)) + parseFloat($('.containerList').eq(i).find('#weightNum0').val())
    	        }
    	        if ($('.containerList').eq(i).find('#volumeNum0').val() != '') {
    	            allVolumeNum = parseFloat(allVolumeNum.toFixed(2)) + parseFloat($('.containerList').eq(i).find('#volumeNum0').val())
    	        }
    	        if ($('.containerList').eq(i).find('#vgmNum0').val() != '') {
    	            allVgmNum = parseInt(allVgmNum) + parseInt($('.containerList').eq(i).find('#vgmNum0').val())
    	        }
    	        allPackage = $('.containerList').eq(i).find('#package0').val()
    	        allWeight = $('.containerList').eq(i).find('#weight0').val()
    	        allVolume = $('.containerList').eq(i).find('#volume0').val()
    	        allVgm = $('.containerList').eq(i).find('#vgm0').val()
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

    		if (allPackageNum == 0 && allWeightNum == 0 && allVolumeNum == 0 && allVgmNum == 0) {
    		    comModel("请检查完善信息再保存")
    		} else {
    		    common.ajax_req('get', false, dataUrl, 'booking.ashx?action=modifycontainer', {
    		        'userId': userID,
    		        'userName': userName,
    		        'bookingId': Id,
    		        'containerData': containerData,
    		        'allPackageNum': allPackageNum + ' ' + allPackage,
    		        'allWeightNum': allWeightNum + ' ' + allWeight,
    		        'allVolumeNum': allVolumeNum + ' ' + allVolume,
    		        'allVgmNum': allVgmNum + ' ' + allVgm,
    		        'num': vgminfoNum,
    		        'unit': vgminfoUnit,
    		        'way': vgminfoWay,
    		        'responsibility': responsibility,
    		        'authorize': authorize,
    		        'weighing': weighing,
    		        'weighingDate': weighingDate,
    		        'beizhu': vgmBeizhu
    		    }, function (data) {
    		        if (data.State == 1) {
    		            containerData = ''
    		            $('#allContainer').val(data.Data)
    		            $('#packageNum').val(allPackageNum)
    		            $('#weightNum').val(allWeightNum)
    		            $('#volumeNum').val(allVolumeNum)
    		            $('#package').val(allPackage).trigger("change")
    		            $('#weight').val(allWeight).trigger("change")
    		            $('#volume').val(allVolume).trigger("change")
    		            $('#vgm').val(allVgm).trigger("change")
    		            $('#vgmNum').val(allVgmNum)
    		            $('#weightShow').val(allWeightNum + ' ' + allWeight)
    		            $('#volumeShow').val(allVolumeNum + ' ' + allVolume)
    		            comModel("保存成功")
    		        } else {
    		            containerData = ''
    		            comModel("保存失败")
    		        }
    		    }, function (error) {
    		        console.log(error)
    		    }, 1000)
    		}


    	}
    })
    
    //新增
    if(action == 'add') {
    	this.title = get_lan('con_top_3')
		$('#title1').text(get_lan('con_top_3'))
		$('#title2').text(get_lan('con_top_3'))
		$('#copyFun').hide()
		common.ajax_req("get", true, dataUrl, "booking.ashx?action=getordercode", {
		    "companyId": companyID
		}, function (data) {
		    //console.log(data)
		    if (data.State == 1) {
		        orderCode = data.Data
		    } 
		    $('#title3').html('订单号：' + orderCode)
		    $('#warehouseInCode').val(orderCode + 'WH');
		    $('#warehouseOutCode').val(orderCode + 'WH');
		})
    	common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
    		"companyId": companyID
    	}, function(data) {
    		//console.log(data)
    		if(data.State == 1) {
    			$('#payAddress').val(data.Data.wein_gameTitle1)
    			$('#signAddress').val(data.Data.wein_gameTitle2)
    			$('#payAddress2').val(data.Data.wein_gameTitle1)
    			$('#signAddress2').val(data.Data.wein_gameTitle2)
    		} 
    	}) 	
    	//$('#STATELIST span').eq(0).addClass('btn-blue')
    	$('#STATELIST li').eq(0).addClass('active')
    	
    }
    	
    if(action == 'modify') {
    	this.title = get_lan('con_top_4')
    	$('#title1').text(get_lan('con_top_4'))
    	$('#title2').text(get_lan('con_top_4'))
    	
    	$(".allContainer").removeClass('none');
    	
    	$("#send2").hide();
    	$("#send3").hide();
    	
    	oTable = GetBillCheck()
    	
    	setTimeout(function() {
    		var billcount = oTable.fnSettings().aoData.length;
    		if(billcount != 0) {
    			$("#myModal").modal("show");
    		}
    	}, 2000);
    	//加载集装箱数据，从上面移动到这里 by daniel 20200228
		common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {  
			"whichId": 1,
			"bookingId": Id
		}, function(data) {
			//console.log(data)
			if(data.State == 1) {
				$(".containerList").remove()
				var _data = data.Data;
				//$('#containerTabStatus').val('1');
				for(var i = 0; i < _data.length; i++) {
					var package0 = _data[i].boco_package.split(' ')
					var weight0 = _data[i].boco_weight.split(' ')
					var volume0 = _data[i].boco_volume.split(' ')
					var vgm0 = _data[i].boco_vgm.split(' ')
					var crmlist = '<div class="col-sm-12 containerList" style="margin:5px 0;">' +
						'<select id="containerType" class="no-padding-left no-padding-right margin-right-5" style="width:6%; float: left;">' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="number" value="' + _data[i].boco_number + '" style="width:8%;float: left;">' +
						'<input type="text" class="form-control margin-right-5" id="sealNumber" value="' + _data[i].boco_sealNumber + '" style="width:6%;float: left;">' +
						'<input type="text" class="form-control margin-right-5" id="packageNum0" value="' + package0[0] + '" style="width:4%;float: left;">' +
						'<select id="package0" class="no-padding-left no-padding-right margin-right-5" style="width:8%;float: left;">' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="weightNum0"  value="' + weight0[0] + '" style="width:5%;float: left;">' +
						'<select id="weight0" class="no-padding-left no-padding-right margin-right-5" style="width:6%;float: left;">' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="volumeNum0"  value="' + volume0[0] + '" style="width:5%;float: left;">' +
						'<select id="volume0" class="no-padding-left no-padding-right margin-right-5" style="width:6%;float: left;">' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="vgmNum0"  value="' + vgm0[0] + '" style="width:5%;float: left;">' +
						'<select id="vgm0" class="no-padding-left no-padding-right margin-right-5" style="width:6%;float: left;">' +
						'</select>' +
						'<input type="text" class="form-control margin-right-5" id="customsCode" value="' + _data[i].boco_customsCode + '" style="width:9%;float: left;">' +
						'<input type="text" class="form-control margin-right-10" id="goodsName" value="' + _data[i].boco_goodsName + '" style="width:9%;float: left;">' +
						//'<button type="submit" class="newContainer btn btn-blue margin-right-5" style="width:3%;float: left;">+</button>'+
						//'<button type="submit" class="removeContainer btn btn-blue" style="width:3%;float: left;">-</button>' +
						'<a class="newContainer btn btn-info input-xs"><i class="fa fa-plus-circle"></i></a> '+
						'<a class="removeContainer btn btn-danger input-xs"><i class="fa fa-times-circle"></i></a>' +
						'</div>'
					$(".containerAll").prepend(crmlist)
					$('#containerType').html($('#trailerNumUnit').html())
					$('#containerType').val(_data[i].boco_typeName).trigger("change")
					$('#package0').html($('#package').html())
					package0[1]?$('#package0').val(package0[1]).trigger("change"):$("#package0 option:first").prop("selected", 'selected');
					
					$('#volume0').html($('#volume').html())
					volume0[1]?$('#volume0').val(volume0[1]).trigger("change"):$("#volume0 option:first").prop("selected", 'selected');

					$('#weight0').html($('#weight').html())
					weight0[1]?$('#weight0').val(weight0[1]).trigger("change"):$("#weight0 option:first").prop("selected", 'selected');

					$('#vgm0').html($('#weight').html())
					vgm0[1]?$('#vgm0').val(vgm0[1]).trigger("change"):$("#vgm0 option:first").prop("selected", 'selected');
					
				}
			}
		
		}, function(err) {
			console.log(err)
		}, 2000)
		//加载集装箱VGM数据，从上面移动到这里 by daniel 20200228
		common.ajax_req('GET', false, dataUrl, 'booking.ashx?action=readvgmbyid', {
			'bookingId': Id
		}, function(data) {
			if(data.State==1){
				$("#isvgminfo").attr("checked", true)
				$("#vgminfolist").removeClass('none')
				var _data = data.Data;
				$('#vgminfoNum').val(_data.vgm_num)
				$('#vgminfoUnit').val(_data.vgm_unit).trigger("change")
				$('#vgminfoWay').val(_data.vgm_way)
				$('#inputResponsibility').val(_data.vgm_responsibility)
				$('#inputAuthorize').val(_data.vgm_authorize)
				$('#inputWeighing').val(_data.vgm_weighing)
				$('#weighingDate').val(_data.vgm_weighingDate.substring(0, 10))
				$('#inputVmgBeizhu').val(_data.vgm_beizhu)
			}
			else{
				
			}

		}, function(error) {
			console.log(parm)
		}, 1000)

		$('#upload_container').show()
        //上传集装箱列表
		$('#uploadExcel').on('click', function () {
		    //location.href = 'fileinput.html?action=container&bookingId=' + Id;
		    window.open('fileinput.html?action=container&bookingId=' + Id)
		})

		common.ajax_req("get", false, dataUrl, "booking.ashx?action=readbyid", {
		    "Id": Id,
		    "loadTime":true
    	}, function(data) {
    	    console.log(data.Data)
    		//初始化信息
    	    var _data = data.Data

    	    //获取自定货名称
    	    var forwarderName = ''
    	    common.ajax_req('GET', false, dataUrl, 'crmcompany.ashx?action=readbyid', {
    	        'Id': _data.book_forwarder
    	    }, function (data) {
    	        if (data.State == 1) {
    	            var _data = data.Data;
    	            forwarderName = _data.comp_name
    	        }
    	        else {

    	        }

    	    }, function (error) {
    	        console.log(parm)
    	    }, 1000)

    		stateId = _data.book_orderState
    		var stateList=$('#STATELIST li')
    		$.each(stateList,function(i,item){
    			if((i+12)<=stateId){
    				//item.addClass('btn-blue')
    				//$('#STATELIST span').eq(i).addClass('btn-blue')
    				$('#STATELIST li').eq(i).addClass('active')
    			}
    		})
    		$('#copy_orderCode').val(_data.book_orderCode)
    		orderCode = _data.book_orderCode
    		crmCompanyId = _data.book_crmCompanyId
    		//crmContactId=_data.book_crmContactId
    		port1 = _data.book_port1
    		port2 = _data.book_port2
    		port3 = _data.book_port3
    		carrier = _data.book_carrier
    		if (_data.book_code == '' || _data.book_code == null) {
                $('#title3').html('订单号：' + _data.book_orderCode)
    		} else {
    		    $('#title3').html('订单号：' + _data.book_orderCode + ' （订舱单号：' + _data.book_code + '）')
    		}
    		
    		$('#outCode').val(_data.book_outCode)
    		$('#billCode').val(_data.book_billCode)
    		$('#sono').val(_data.book_sono)
    		$('#contractNo').val(_data.book_contractNo)
    		$('#outCode').val(_data.book_outCode)
    		$("#crmuser").val(_data.book_crmCompanyId).trigger("change")
    		//$("#crmcontact").val(_data.book_crmContactId).trigger("change")
    		$("#sellId").val(_data.book_sellId).trigger("change")
    		$("#luruId").val(_data.book_luruId).trigger("change")
    		$("#kefuId").val(_data.book_kefuId).trigger("change")
    		$("#caozuoId").val(_data.book_caozuoId).trigger("change")
    		$("#movementType").val(_data.book_movementType).trigger("change")
    		$("#incoterm").val(_data.book_incoterm).trigger("change")
    		//$("#port1").val(_data.book_port1).trigger("change")
    		$('#port1').html('<option value="' + _data.book_port1 + '">' + _data.book_port1 + '</option>').trigger("change")
    		$('#port2').html('<option value="' + _data.book_port2 + '">' + _data.book_port2 + '</option>').trigger("change")
    		$('#port3').html('<option value="' + _data.book_port3 + '">' + _data.book_port3 + '</option>').trigger("change")
//  		$("#port2").val(_data.book_port2).trigger("change")
//  		$("#port3").val(_data.book_port3).trigger("change")
    		$('#route').val(_data.book_route)
    	    //$("#forwarder").val(_data.book_forwarder).trigger("change")
    		$('#forwarder').html('<option value="' + _data.book_forwarder + '">' + forwarderName + '</option>').trigger("change")
    		//$("#carrier").val(_data.book_carrier).trigger("change")
    		$('#carrier').html('<option value="' + _data.book_carrier + '">' + _data.book_carrier + '</option>').trigger("change")
    		$('#fromAddress').val(_data.book_fromAddress)
    		$('#toAddress').val(_data.book_toAddress)
    		$('#okTime').datepicker('setDate', _data.book_okTime ? _data.book_okTime.substring(0, 10) : '')
    		//$('#okTrailerTime').val(_data.book_okTrailerTime ? _data.book_okTrailerTime.substring(0, 10) : '')
    		$('#okTrailerTime').datepicker('setDate', _data.book_okTrailerTime ? _data.book_okTrailerTime.substring(0, 10) : '');
	  		if(_data.book_okBillTime != null) {
	  		    //$('#okBillTime').val(_data.book_okBillTime.substring(0, 10))
	  		    $('#okBillTime').datepicker('setDate', _data.book_okBillTime.substring(0, 10));
	  		}
	  		if(_data.book_okPortTime != null) {
	  		    //$('#okPortTime').val(_data.book_okPortTime.substring(0, 10))
	  		    $('#okPortTime').datepicker('setDate', _data.book_okPortTime.substring(0, 10));
	  		}	  		
//  		$('#GP20').val(_data.book_20GP)
//  		var _GP20 = _data.book_20GP.split(' ')
//  		$('#GP20').val(_GP20[0])
//  		$('#20GP').val(_GP20[1]).trigger("change")
//  		var _GP40 = _data.book_40GP.split(' ')
//  		$('#GP40').val(_GP40[0])
//  		$('#40GP').val(_GP40[1]).trigger("change")
//  		var _HQ40 = _data.book_40HQ.split(' ')
//  		$('#HQ40').val(_HQ40[0])
//  		$('#40HQ').val(_HQ40[1]).trigger("change")
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
    		$('#weightShow').val(_data.book_weightShow)
    		$('#volumeShow').val(_data.book_volumeShow)
    		//$('#inputConsignee').val(_data.book_consignee)
    		$('#inputContractNo').val(_data.book_contractNo)
    		$("#warehouse").val(_data.book_warehouse).trigger("change")
    		$('#warehouseAddress').val(_data.book_warehouseAddress)
    		$('#warehouseContact').val(_data.book_warehouseContact)
    		$('#warehouseContactWay').val(_data.book_warehouseContactWay)
    		if (_data.book_warehouseInCode == '') {
    		    $('#warehouseInCode').val(orderCode + 'WH');
    		    $('#warehouseOutCode').val(orderCode + 'WH');
    		} else {
    		    $('#warehouseInCode').val(_data.book_warehouseInCode)
    		    $('#warehouseOutCode').val(_data.book_warehouseOutCode)
    		}
    		
    		//$('#warehouseInTime').val(_data.book_warehouseInTime ? _data.book_warehouseInTime.substring(0, 10) : "")
    		$('#warehouseInTime').datepicker('setDate', _data.book_warehouseInTime ? _data.book_warehouseInTime.substring(0, 10) : "");
    		//$('#warehouseOutTime').val(_data.book_warehouseOutTime ? _data.book_warehouseOutTime.substring(0, 10) : "")
    		$('#warehouseOutTime').datepicker('setDate', _data.book_warehouseOutTime ? _data.book_warehouseOutTime.substring(0, 10) : "");
    		$('#warehouseBeizhu').val(_data.book_warehouseBeizhu)
    		$("input[name='bill1Type'][value='" + _data.book_bill1Type + "']").attr("checked", true)
    		$('#inShipper').val(HtmlDecode(_data.book_bill1Shipper))
    		$('#Shipper').val(_data.book_bill1Shipper).trigger("change")
    		$('#inConsignee').val(HtmlDecode(_data.book_bill1Consignee))
    		$('#Consignee').val(_data.book_bill1Consignee).trigger("change")
    		$('#inNotifyParty').val(HtmlDecode(_data.book_bill1NotifyParty))
    		$('#NotifyParty').val(_data.book_bill1NotifyParty).trigger("change")
    		$('#inAlsoNotify').val(HtmlDecode(_data.book_alsoNotify))
    		$('#AlsoNotify').val(_data.book_alsoNotify).trigger("change")
    		$('#inBillBeizhu').val(HtmlDecode(_data.book_billBeizhu))
    		$('#inBill2Beizhu').val(HtmlDecode(_data.book_bill2Beizhu))
    		$('#vessel').val(_data.book_vessel)
    		$('#voyage').val(_data.book_voyage)
    		port4 = _data.book_port4
    		port5 = _data.book_port5
    		$('#port4').html('<option value="' + _data.book_port4 + '">' + _data.book_port4 + '</option>').trigger("change")
    		$('#port5').html('<option value="' + _data.book_port5 + '">' + _data.book_port5 + '</option>').trigger("change")
//  		$("#port4").val(_data.book_port4).trigger("change")
//  		$("#port5").val(_data.book_port5).trigger("change")
    		if(_data.book_vgm!=''){
    			var vgm0 = _data.book_vgm.split(' ')
    			$('#vgmNum').val(vgm0[0])
    			$('#vgm').val(vgm0[1]).trigger("change")
    		}
    		if(_data.book_okPortTime2!=null){
    		    //$('#okPortTime2').val(_data.book_okPortTime2.substring(0, 10))
    		    $('#okPortTime2').datepicker('setDate', _data.book_okPortTime2.substring(0, 10));
    		}
    		else{
    		    //$('#okPortTime2').datepicker('setDate', new Date());
    		    $('#okPortTime2').datepicker('setDate', new Date());
    		}
    		if(_data.book_truePortTime!=null){
    		    //$('#truePortTime').val(_data.book_truePortTime.substring(0, 10))
    		    $('#truePortTime').datepicker('setDate', _data.book_truePortTime.substring(0, 10));
    		}  
    		if(_data.book_truePortTime2!=null){
    		    //$('#truePortTime2').val(_data.book_truePortTime2.substring(0, 10))
    		    $('#truePortTime2').datepicker('setDate', _data.book_truePortTime2.substring(0, 10));
    		}      		
    		$('#allContainer').val(_data.book_allContainer)
    		$("#shippingTerm").val(_data.book_shippingTerm).trigger("change")
    		$("#shippingFeeTerm").val(_data.book_shippingFeeTerm).trigger("change")
    		$('#payAddress').val(_data.book_payAddress)
    		$('#signAddress').val(_data.book_signAddress)
    		if (_data.book_locked == 1)
    		{
    		    $("#isLock").attr("checked", true)
    		    $('input,textarea').prop('readonly', true);
    		    $('select').prop('disabled', true);
    		}
    		
    	}, function(err) {
    		console.log(err)
    	}, 1000)
    	
    	
    	//HBL订单信息
    	loadHBL()
    	function loadHBL(){
    		$(".billmodiy").parent('li').hide()
    		common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbill", {
    			"bookingId": Id
    		}, function(data) {
    			var _data = data.Data;
    			console.log(_data)
    			if(data.State == 1) {
    				for(var i = 0; i < _data.length; i++) {
    				    var crmlist = '<li style="border:1px solid #ccc"><a class="billmodiy" data-toggle="tab" href="#dropdown2" billId=' + _data[i].bobi_id + '>' + _data[i].bobi_billCode + '</a><a class="billdelete" billId=' + _data[i].bobi_id + '>删除</a></li>'
    					$("#billList").append(crmlist)
    					var crmlist = '<li><span class="printHBL" data-billid="' + _data[i].bobi_id + '" style="cursor: pointer; padding-left: 20px; ">HBL打印(' + _data[i].bobi_billCode + ')</span></li>'
    					$("#pringType").append(crmlist)
    				}

    				$('.printHBL').click(function (e) {
    				    window.open("printdetail.html?action=add&typeId=3&aboutId=" + e.target.dataset.billid, "_blank");

    				});
    			}
    			/*编辑HBL*/
    			$('.billmodiy').on('click', function() {
    				$('#sendbt1').addClass('none')
    				$('#sendbt2').removeClass('none')
    				$('#send1').addClass('none')
    				$('#sendcontainer').addClass('none')
    				//$("#billcontainer").removeClass('none')
    		
    				$("#iscontainer3").attr("checked", true)
    				$("#containerlist3").removeClass('none')

    				$('#isChange').prop("checked", false);

    				$('#send_openGoods').addClass('none')

    				billId = $(this).attr('billId')
    				if (action == 'modify') {
    				    loadContainer2(2, billId)
    				}
    				common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbillbyid", {
    					"Id": billId
    				}, function(data) {
    					console.log(data.Data)
    					//初始化信息
    					var _data = data.Data
    					$(".HBLNav").text('HBL订单信息 ' + _data.bobi_billCode)
    					$('#billCode3').val(_data.bobi_billCode)
    					$('#packageMarks3').html(HtmlDecode(_data.bobi_packageMarks))
    					$('#goodAbout3').html(HtmlDecode(_data.bobi_goodAbout))
    					var package0 = _data.bobi_package.split(' ')
    					$('#packageNum3').val(package0[0])
    					$('#package3').val(package0[1]).trigger("change")
    					var weight0 = _data.bobi_weight.split(' ')
    					$('#weightNum3').val(weight0[0])
    					$('#weight3').val(weight0[1]).trigger("change")
    					var volume0 = _data.bobi_volume.split(' ')
    					$('#volumeNum3').val(volume0[0])
    					$('#volume3').val(volume0[1]).trigger("change")
    					$('#weightShow3').val(_data.bobi_weight)
    					$('#volumeShow3').val(_data.bobi_volume)
    					$('#inShipper3').val(HtmlDecode(_data.bobi_shipper))
    					$('#Shipper3').val(_data.bobi_shipper).trigger("change")
    					$('#inConsignee3').val(HtmlDecode(_data.bobi_consignee))
    					$('#Consignee3').val(_data.bobi_consignee).trigger("change")
    					$('#inNotifyParty3').val(HtmlDecode(_data.bobi_notifyParty))
    					$('#NotifyParty3').val(_data.bobi_notifyParty).trigger("change")
    					$('#inAlsoNotify3').val(_data.bobi_alsoNotify)
    					$('#AlsoNotify3').val(_data.bobi_alsoNotify).trigger("change")
    					$('#inBillBeizhu3').val(HtmlDecode(_data.bobi_agentInfo))
    					$('#inBill2Beizhu3').val(HtmlDecode(_data.bobi_beizhu))
    					if(_data.bobi_vgm!=''){
	    					var vgm0 = _data.bobi_vgm.split(' ')
	    					$('#vgmNum3').val(vgm0[0])
	    					$('#vgm3').val(vgm0[1]).trigger("change")    						
    					}
    					$('#allContainer3').val(_data.bobi_allcount)
    					$("#shippingTerm3").val(_data.bobi_shippingTerm).trigger("change")
    					$("#shippingFeeTerm3").val(_data.bobi_shippingFeeTerm).trigger("change")
    					$('#payAddress3').val(_data.bobi_address1)
    					$('#signAddress3').val(_data.bobi_address2)
    		
    					//  				var containerList=_data.bobi_containerType.split(',')
    					//  				for(var i = 0; i < containerList.length; i++) {
    					//  					$("input[name='containerli'][value='" + containerList[i] + "']").attr("checked", true)
    					//  				}
    				}, function(err) {
    					console.log(err)
    				}, 1000)
    		
    			})

    		    /*删除HBL*/
    			$('.billdelete').on('click', function () {
    			    billId = $(this).attr('billId')
    			    bootbox.confirm("Are you sure?", function (result) {
    			        if (result) {
    			            $.ajax({
    			                url: dataUrl + 'ajax/booking.ashx?action=cancelbill',
    			                data: {
    			                    "Id": billId
    			                },
    			                dataType: "json",
    			                type: "post",
    			                success: function (backdata) {
    			                    if (backdata.State == 1) {
    			                        loadHBL()
    			                    } else {
    			                        alert("Delete Failed！");
    			                    }
    			                },
    			                error: function (error) {
    			                    console.log(error);
    			                }
    			            });
    			        }
    			    });

    			})
    		
    		}, function(err) {
    			console.log(err)
    		}, 2000)
    	}

    	
//      //加载费用
//  	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfee", {
//  		"bookingId": Id
//  	}, function(data) {
//  		//console.log(data.Data)
//  		if(data.State == 1) {
//  			var _data = data.Data;
//  			for(var i = 0; i < _data.length; i++) {
//  				var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
//  				$("#feelist").append(feilist)
//  			}
//  			$('#send11').text("继续添加")
//  		}
//  	
//  		/*删除*/
//  		$('.deleteFee').on('click', function() {
//  			console.log($(this).attr('artiid'))
//  			$(this).parent('div').remove()
//  			$.ajax({
//  				url: dataUrl + 'ajax/booking.ashx?action=cancelfee',
//  				data: {
//  					"Id": $(this).attr('artiid')
//  				},
//  				dataType: "json",
//  				type: "post",
//  				success: function(backdata) {
//  					if(backdata.State == 1) {
//  						//oTable.fnReloadAjax(oTable.fnSettings());
//  						//comModel("删除成功！")
//  					} else {
//  						alert("Delete Failed！");
//  					}
//  				},
//  				error: function(error) {
//  					console.log(error);
//  				}
//  			});
//  		})
//  	
//  	}, function(err) {
//  		console.log(err)
//  	}, 2000)

//      //加载费用
//  	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfee", {
//  		"bookingId": Id
//  	}, function(data) {
//  		console.log(data.Data)
//  		if(data.State == 1) {
//  			$(".feeAll").empty()
//  			var _data = data.Data;
//  			for(var i = 0; i < _data.length; i++) {
//  				//var feilist = '<div style="margin: 5px 0px;">' + _data[i].bofe_feeType + ' ：' + _data[i].bofe_fee + ' * ' + _data[i].bofe_num + '(' + _data[i].bofe_numUnit + ') = ' + _data[i].bofe_feeUnit + _data[i].bofe_allFee + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteFee" artiid="' + _data[i].bofe_id + '">删除</a></div>'
//  				var feilist = '<div class="col-sm-12 feeList">'+
//  				'<select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:6%; float: left;"><option value="应收">应收</option><option value="应付">应付</option></select>'+
//  				'<select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:15%;float: left;"></select>'+
//  				'<select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"></select>'+
//  				'<select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"></select>'+
//  				'<input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" value="' + _data[i].bofe_fee + '" style="width:10%;float: left;">'+
//  				'<input type="text" class="form-control margin-right-5" id="feeNum" placeholder="" value="' + _data[i].bofe_num + '" style="width:5%;float: left;">'+
//  				'<select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:10%;float: left;"></select>'+
//  				'<input type="text" class="form-control margin-right-5" id="feeBeizhu" value="' + _data[i].bofe_beizhu + '" placeholder="" style="width:10%;float: left;">'+
//  				'<button type="submit" class="removeFee btn btn-blue" style="width:3%;float: left;">-</button>'
//  				
//  				$(".feeAll").append(feilist)
//  				
//  				$('#feeType').val(_data[i].bofe_feeType).trigger("change")
//  				$('.feeList').eq(i).find('#toCompany').html(_toCompany)	
//  				$('.feeList').eq(i).find('#toCompany').val(_data[i].bofe_toCompany).trigger("change")
//  				$('.feeList').eq(i).find('#feeItem').html(_feeItem)	
//  				$('.feeList').eq(i).find('#feeItem').val(_data[i].bofe_feeItem).trigger("change")
//  				$('.feeList').eq(i).find('#feeUnit').html(_feeUnit)	
//  				$('.feeList').eq(i).find('#feeUnit').val(_data[i].bofe_feeUnit).trigger("change")
//  				$('.feeList').eq(i).find('#numUnit').html(_numUnit)	
//  				$('.feeList').eq(i).find('#numUnit').val(_data[i].bofe_numUnit).trigger("change")
//  			}
//  		}
//  	
//  	}, function(err) {
//  		console.log(err)
//  	}, 2000)
    	
        //加载拖车报关
    	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readtrailer", {
    		"bookingId": Id
    	}, function(data) {
    		//console.log(data.Data)
    		if(data.State == 1) {
    			var _data = data.Data;
    			for(var i = 0; i < _data.length; i++) {
    			    //var trailerlist = '<div style="margin: 5px 0px;">' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;地址：' + _data[i].botr_address + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].botr_contact + '&nbsp;&nbsp;&nbsp;&nbsp;联系方式：' + _data[i].botr_contactWay + '&nbsp;&nbsp;&nbsp;&nbsp;时间：' + _data[i].botr_time + '&nbsp;&nbsp;&nbsp;&nbsp;柜型：' + _data[i].botr_container + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteTrailer" artiid="' + _data[i].botr_id + '">删除</a></div>'
    			    var trailerlist = '<tr><td> ' + _data[i].comp_name + '</td><td> ' + _data[i].packing_comp_name + '</td><td>' + _data[i].botr_address + '</td><td>' + _data[i].botr_contact + '</td><td>' + _data[i].botr_contactWay + '</td><td>' + _data[i].botr_time.substring(0, 10) + '</td><td>' + _data[i].botr_container + '</td><td> ' + _data[i].botr_so + '</td><td>' + _data[i].botr_remark + '</td><td><a class="deleteTrailer" artiid="' + _data[i].botr_id + '">删除</a>&nbsp;&nbsp;<a class="detailTrailer"  artiid="' + _data[i].botr_id + '" contact="' + _data[i].botr_contact + '" contactWay="' + _data[i].botr_contactWay + '" container="' + _data[i].botr_container + '" address="' + _data[i].botr_address + '" so="' + _data[i].botr_so + '" remark="' + _data[i].botr_remark + '" time="' + _data[i].botr_time.substring(0, 10) + '" comp_name="' + _data[i].comp_name + '" packing_comp_name="' + _data[i].packing_comp_name + '">派车单</a></td></tr>'
    				$(".trailerAll").append(trailerlist)
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

    	    /*派车单*/
    		$('.detailTrailer').on('click', function () {
    		    console.log($(this).attr('artiid'))
    		    $("#myModal3").modal("show");
    		    $("#t_contact").text($(this).attr('contact'))
    		    $("#t_contactWay").text($(this).attr('contactWay'))
    		    $("#t_address").text($(this).attr('address'))
    		    $("#t_container").text($(this).attr('container'))
    		    $("#t_time").text($(this).attr('time'))
    		    $("#t_so").text($(this).attr('so'))
    		    $("#t_remark").text($(this).attr('remark'))
    		    $("#t_comp_name").text($(this).attr('comp_name'))
    		    $("#t_packing_comp_name").text($(this).attr('packing_comp_name'))
    		})
    	
    	}, function(err) {
    		console.log(err)
    	}, 2000)    	
    
    } else {
//    	$("#okTime").val(getDate());
//  	$("#okTrailerTime").val(getDate());
//  	$("#okBillTime").val(getDate());
//  	$("#okPortTime").val(getDate());
//    	$("#okPortTime2").val(getDate());
//  	$("#truePortTime").val(getDate());
//  	$("#truePortTime2").val(getDate());
    	//$("#warehouseInTime").val(getDate());
    	//$("#warehouseOutTime").val(getDate());
    	//$("#trailerTime").val(getDate());
    	$('#okTime').datepicker('setDate', new Date());
    	//$('#okPortTime2').datepicker('setDate', new Date());
    	$('#warehouseInTime').datepicker('setDate', new Date());
    	$('#warehouseOutTime').datepicker('setDate', new Date());
    	$('#trailerTime').datepicker('setDate', new Date());
    }
    
    if(action == 'modify') {
    		common.ajax_req("get", true, dataUrl, "booking.ashx?action=readsupplier", {
    			"bookingId": Id
    		}, function(data) {
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
			var pckingCompanyId = $('#packingCompany').val()
			var pckingCompanyName = $('#packingCompany').find("option:selected").text()
			var trailerAddress = $('#trailerAddress').val()
			var trailerContact = $('#trailerContact').val()
			var trailerContactWay = $('#trailerContactWay').val()
			var trailerTime = $('#trailerTime').val()
			var trailerNumUnit = $('#trailerNumUnit').val()
			var trailerNum = $('#trailerNum').val()
			var newNumUnit = trailerNum + '*' + trailerNumUnit
			var trailerSo = $('#trailerSo').val()
			var trailerRemark = $('#trailerRemark').val()
			if(!trailer){
				comModel("请选择车行")
			}else if(!trailerAddress){
				comModel("请输入地址")
			}else{
			    //var trailerlist = '<div style="margin: 5px 0px;">' + trailerName + '&nbsp;&nbsp;&nbsp;&nbsp;地址：' + trailerAddress + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + trailerContact + '&nbsp;&nbsp;&nbsp;&nbsp;联系方式：' + trailerContactWay + '&nbsp;&nbsp;&nbsp;&nbsp;时间：' + trailerTime + '&nbsp;&nbsp;&nbsp;&nbsp;柜型：' + newNumUnit + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deletetrailer">删除</a></div>'
			    var trailerlist = '<tr><td>' + trailerName + '</td><td> ' + pckingCompanyName + '</td><td>' + trailerAddress + '</td><td>' + trailerContact + '</td><td>' + trailerContactWay + '</td><td>' + trailerTime + '</td><td>' + newNumUnit + '</td><td> ' + trailerSo + '</td><td>' + trailerRemark + '</td><td><a class="deletetrailer">删除</a></td></tr>'
				$(".trailerAll").append(trailerlist)
				$('#addTrailer').text("继续添加")
				trailerData = trailerData + trailer + ',' + pckingCompanyId + ',' + trailerAddress + ',' + trailerContact + ',' + trailerContactWay + ',' + trailerTime + ',' + newNumUnit + ',' + trailerSo + ',' + trailerRemark + ';'
				//console.log(trailerData)
				if(action == 'modify'){
				    common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newtrailer', {
						'bookingId':Id,
						'crmId': trailer,
						'packingCrmId': pckingCompanyId,
						'address':trailerAddress,
						'contact':trailerContact,
						'contactWay':trailerContactWay,
						'time':trailerTime,
						'container': newNumUnit,
						'so': trailerSo,
						'remark': trailerRemark
					}, function(data) {
						if(data.State == 1) {
							//console.log(parm)
						    comModel("新增拖车成功")
					
						} else {
							comModel("新增拖车失败")
						}
					}, function(error) {
						console.log(parm)
					}, 1000)
				}
			}
		
			/*删除*/
			$('.deletetrailer').on('click', function() {
			    $(this).parents('tr').remove()
			    console.log(trailerData)
			})

	});

	$('#addTrailer0').click(function () {
	    $("#myModal2").modal("show");
	    $("#trailerList").empty()
	    //加载拖车报关
	    common.ajax_req("get", true, dataUrl, "booking.ashx?action=readtrailer", {
	        "crmId": crmCompanyId
	    }, function (data) {
	        //console.log(data.Data)
	        if (data.State == 1) {
	            var _data = data.Data;
	            for (var i = 0; i < _data.length; i++) {
	                //var trailerlist = '<div style="margin: 5px 0px;">' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;地址：' + _data[i].botr_address + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].botr_contact + '&nbsp;&nbsp;&nbsp;&nbsp;联系方式：' + _data[i].botr_contactWay + '&nbsp;&nbsp;&nbsp;&nbsp;时间：' + _data[i].botr_time + '&nbsp;&nbsp;&nbsp;&nbsp;柜型：' + _data[i].botr_container + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteTrailer" artiid="' + _data[i].botr_id + '">删除</a></div>'
	                var trailerlist = '<tr><td> ' + _data[i].comp_name + '</td><td> ' + _data[i].packing_comp_name + '</td><td>' + _data[i].botr_address + '</td><td>' + _data[i].botr_contact + '</td><td>' + _data[i].botr_contactWay + '</td><td>' + _data[i].botr_container + '</td><td><a class="selectTrailer" artiid="' + _data[i].botr_id + '" contact="' + _data[i].botr_contact + '" contactWay="' + _data[i].botr_contactWay + '" container="' + _data[i].botr_container + '" address="' + _data[i].botr_address + '">选择</a></td></tr>'
	                $("#trailerList").append(trailerlist)
	            }
	        }

	        /*选择*/
	        $('.selectTrailer').on('click', function () {
	            console.log($(this).attr('artiid'))
	            $("#myModal2").modal("hide");
	            $("#trailerContact").val($(this).attr('contact'))
	            $("#trailerContactWay").val($(this).attr('contactWay'))
	            $("#trailerAddress").val($(this).attr('address'))
	            var container = $(this).attr('container').split('*')
	            $("#trailerNum").val(container[0])
	            $("#trailerNumUnit").find("option:contains("+container[1]+")").attr("selected", true)
	        })

	    }, function (err) {
	        console.log(err)
	    }, 2000)

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
	
//	//结算公司
//	common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
//		"customerId": companyID
//	}, function(data) {
//		console.log(data)
//		var _data = data.data;
//		if(_data != null) {
//			for(var i = 0; i < _data.length; i++) {
//				var _html = '<option value="' + _data[i].comp_companyId + '">' + _data[i].userCompanyName + '</option>';
//				_toCompany = _toCompany + _html
//			}
//		}
//	}, function(err) {
//		console.log(err)
//	}, 2000)

//	//添加应收应付
//	$('#addFee1').on('click', function() {
//		var feeboxRow = '<div class="col-sm-12 feeList"><button type="submit" class="removeFee btn btn-blue" style="width:30px;float: left;">-</button><select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="应收">应收</option></select><select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:200px; float: left;"><option value="请选择">请选择</option></select><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeNum" placeholder="" style="width:100px; float: left;"><select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">总额</label><input type="text" class="form-control margin-right-5" id="feeNum" placeholder="" style="width:100px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'		
//		$('.feeAll').append(feeboxRow)
//		//feeboxRow = feeboxRow.clone()
//		//货代公司
//		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
//		$('.feeList:last').find('#toCompany').append(_toCompany)	
////		//费用类型
//		$('.feeList:last').find('#feeItem').append(_feeItem)
////		//币种
//		$('.feeList:last').find('#feeUnit').append(_feeUnit)
////		//单位
//		$('.feeList:last').find('#numUnit').append(_numUnit)
//		
//	})
//	$('#addFee2').on('click', function() {
//		var feeboxRow = '<div class="col-sm-12 feeList"><button type="submit" class="removeFee btn btn-blue" style="width:30px;float: left;">-</button><select id="feeType" class="no-padding-left no-padding-right margin-left-5 margin-right-5" style="width:100px; float: left;"><option value="应付">应付</option></select><select id="toCompany" class="no-padding-left no-padding-right margin-right-5" style="width:200px; float: left;"><option value="请选择">请选择</option></select><select id="feeItem" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeNum" placeholder="" style="width:100px; float: left;"><select id="numUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;">总额</label><input type="text" class="form-control margin-right-5" id="feeNum" placeholder="" style="width:100px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><select id="feeUnit" class="no-padding-left no-padding-right margin-right-5" style="width:100px; float: left;"><option value="请选择">请选择</option></select><input type="text" class="form-control margin-right-5" id="feePrice" placeholder="" style="width:100px; float: left;"><input type="text" class="form-control margin-right-5" id="feeBeizhu" placeholder="" style="width:100px; float: left;"><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label><label for="inputPassword3" class="margin-right-5" style="width:100px; line-height: 30px; float: left;"></label></div>'		
//		$('.feeAll').append(feeboxRow)
//		//feeboxRow = feeboxRow.clone()
//		//货代公司
//		//console.log($('.feeList:last').find('#toCompany0').append(_toCompany))
//		$('.feeList:last').find('#toCompany').append(_toCompany)	
////		//费用类型
//		$('.feeList:last').find('#feeItem').append(_feeItem)
////		//币种
//		$('.feeList:last').find('#feeUnit').append(_feeUnit)
////		//单位
//		$('.feeList:last').find('#numUnit').append(_numUnit)
//		
//	})	
//	$('.feeAll').delegate('.removeFee', 'click', function() {
//		$(this).parents('.feeList').remove()
//	})
//	//添加应收应付
//	$('#addbill1').on('click', function() {
//	})
	
	
	//新增HBL信息
	$('#sendbt1').on('click', function() {  
		var containerdata = [];
		$(".containerlist00 input[name='containerli']:checked").each(function(index, item) {
			containerdata.push($(this).val());
			console.log($(this).val())
		});
		var containerType00
		if(containerdata.toString() != '') {
			containerType00 = containerdata.toString()
		}
		
		var containerData00 = '', packageNum22 = 0, weightNum22 = 0, volumeNum22 = 0, vgmNum22=0
		for(var i = 0; i < $('.containerlist00 div').length; i++) {			
    		var containerType = $('.containerlist00 div').eq(i).find('#containerType00').val()
    		var number = $('.containerlist00 div').eq(i).find('#number00').val()
    		var sealNumber = $('.containerlist00 div').eq(i).find('#sealNumber00').val()
    		var package0 = $('.containerlist00 div').eq(i).find('#packageNum00').val()+' '+$('.containerlist00 div').eq(i).find('#package00').val()
    		var weight0 = $('.containerlist00 div').eq(i).find('#weightNum00').val()+' '+$('.containerlist00 div').eq(i).find('#weight00').val()
    		var vgm0 = $('.containerlist00 div').eq(i).find('#vgmNum00').val()+' '+$('.containerlist00 div').eq(i).find('#vgm00').val()
    		var volume0 = $('.containerlist00 div').eq(i).find('#volumeNum00').val()+' '+$('.containerlist00 div').eq(i).find('#volume00').val()
    		var customsCode = $('.containerlist00 div').eq(i).find('#customsCode00').val()
    		var goodsName = $('.containerlist00 div').eq(i).find('#goodsName00').val()
			var oneData = containerType + ',' + number + ',' + sealNumber + ',' + package0 + ',' + weight0 + ',' + volume0 + ',' + vgm0 + ',' + customsCode + ',' + goodsName + ';'
			if($('.containerlist00 div').eq(i).find('input[name="containerli"]').is(":checked")){
			    containerData00 = containerData00 + oneData
			    packageNum22 = packageNum22 + $('.containerlist00 div').eq(i).find('#packageNum00').val() * 1
			    weightNum22 = weightNum22 + $('.containerlist00 div').eq(i).find('#weightNum00').val() * 1
			    volumeNum22 = volumeNum22 + $('.containerlist00 div').eq(i).find('#volumeNum00').val() * 1
			    vgmNum22 = vgmNum22 + $('.containerlist00 div').eq(i).find('#vgmNum00').val() * 1
			}
    	}
		
		//packageNum2= $('#packageNum2').val()
		//weightNum2 = $('#weightNum2').val()
		//volumeNum2 = $('#volumeNum2').val()
		//vgmNum2 = $('#vgmNum2').val()
		packageNum2 = packageNum22
		weightNum2 = weightNum22
		volumeNum2 = volumeNum22
		vgmNum2 = vgmNum22
		package2 = packageNum2 + ' ' + $('#package2').val()
		weight2 = weightNum2 + ' ' + $('#weight2').val()
		volume2 = volumeNum2 + ' ' + $('#volume2').val()
		vgm2 = vgmNum2 + ' ' + $('#vgm2').val()
		packageMarks2 = HtmlEncode($('#packageMarks2').val())
		goodAbout2 = HtmlEncode($('#goodAbout2').val())
		bill2Type = $('#billType2').val()
		bill2Shipper = HtmlEncode($('#inShipper2').val())
		bill2Consignee = HtmlEncode($('#inConsignee2').val())
		bill2NotifyParty = HtmlEncode($('#inNotifyParty2').val())
		alsoNotify2 = HtmlEncode($('#inAlsoNotify2').val())
		billBeizhu2 = HtmlEncode($('#inBillBeizhu2').val())
		bill2Beizhu2 = HtmlEncode($('#inBill2Beizhu2').val())
		//allContainer2 = $('#allContainer2').val()
		shippingTerm2 = $('#shippingTerm2').val()
		shippingFeeTerm2 = $('#shippingFeeTerm2').val()
		payAddress2 = $('#payAddress2').val()
		signAddress2 = $('#signAddress2').val()
		
		if(!bookingId&&action=='add') {
			comModel("请先保存MBL订单信息")
			//return false
		} else if(!bill2Shipper) {
			comModel("SHIPPER不能为空")
		} else {
			var parm = {
			    'bookingId': Id,
			    'userId': userID,
                'userName':userName,
				'companyId': companyID,
				'package2': package2,
				'weight2': weight2,
				'volume2': volume2,
				'packageMarks2': packageMarks2,
				'goodAbout2': goodAbout2,
				'bill2Type': bill2Type,
				'bill2Shipper': bill2Shipper,
				'bill2Consignee': bill2Consignee,
				'bill2NotifyParty': bill2NotifyParty,
				'alsoNotify2': alsoNotify2,
				'billBeizhu2': billBeizhu2,
				'bill2Beizhu2': bill2Beizhu2,
				'shippingTerm2': shippingTerm2,
				'shippingFeeTerm2': shippingFeeTerm2,
				'payAddress2': payAddress2,
				'signAddress2': signAddress2,
				'vgm2': vgm2,
				//'allContainer2': allContainer2,
				'containerType': containerType00,
				'containerData': containerData00
			}
			console.log(parm)
			common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=newbill', parm, function(data) {
				if(data.State == 1) {
					comModel("新增HBL订单信息成功")
					loadHBL()
					//location.reload()
//					var crmlist = '<li><a class="billmodiy" data-toggle="tab" href="#dropdown2" billId=' + data.Data + '>' + data.Data2 + '</a></li>'
//  				$(".dropdown-menu").append(crmlist)
					$(".HBLNav").text('HBL订单信息 ' + data.Data2)

					$('#packageNum2').val(packageNum2)
					$('#weightNum2').val(weightNum2)
					$('#volumeNum2').val(volumeNum2)
					$('#vgmNum2').val(vgmNum2)
					$('#weightShow2').val(weightNum2 + " " + $('#weight2').val())
					$('#volumeShow2').val(volumeNum2 + " " + $('#volume2').val())
					
				} else {
					comModel("新增HBL订单信息失败")
				}
			}, function(error) {
				console.log(parm)
			}, 2000)
		}
	})
	
	
	//修改HBL信息
	$('#sendbt2').on('click', function() {  
		var containerdata = [];
		$(".containerlist3 input[name='containerli']:checked").each(function(index, item) {
			containerdata.push($(this).val());
		});
		var containerType00
		if(containerdata.toString() != '') {
			containerType00 = containerdata.toString()
		}		
		
		var containerData00='', packageNum33 = 0, weightNum33 = 0, volumeNum33 = 0, vgmNum33=0
		for(var i = 0; i < $('.containerlist3 div').length; i++) {			
    		var containerType = $('.containerlist3 div').eq(i).find('#containerType30').val()
    		var number = $('.containerlist3 div').eq(i).find('#number30').val()
    		var sealNumber = $('.containerlist3 div').eq(i).find('#sealNumber30').val()
    		var package0 = $('.containerlist3 div').eq(i).find('#packageNum30').val()+' '+$('.containerlist3 div').eq(i).find('#package30').val()
    		var weight0 = $('.containerlist3 div').eq(i).find('#weightNum30').val()+' '+$('.containerlist3 div').eq(i).find('#weight30').val()
    		var vgm0 = $('.containerlist3 div').eq(i).find('#vgmNum30').val()+' '+$('.containerlist3 div').eq(i).find('#vgm30').val()
    		var volume0 = $('.containerlist3 div').eq(i).find('#volumeNum30').val()+' '+$('.containerlist3 div').eq(i).find('#volume30').val()
    		var customsCode = $('.containerlist3 div').eq(i).find('#customsCode30').val()
    		var goodsName = $('.containerlist3 div').eq(i).find('#goodsName30').val()
			var oneData = containerType + ',' + number + ',' + sealNumber + ',' + package0 + ',' + weight0 + ',' + volume0 + ',' + vgm0 + ',' + customsCode + ',' + goodsName + ';'
			if($('.containerlist3 div').eq(i).find('input[name="containerli"]').is(":checked")){
			    containerData00 = containerData00 + oneData
			    packageNum33 = packageNum33 + $('.containerlist3 div').eq(i).find('#packageNum30').val() * 1
			    weightNum33 = weightNum33 + $('.containerlist3 div').eq(i).find('#weightNum30').val() * 1
			    volumeNum33 = volumeNum33 + $('.containerlist3 div').eq(i).find('#volumeNum30').val() * 1
			    vgmNum33 = vgmNum33 + $('.containerlist3 div').eq(i).find('#vgmNum30').val() * 1
			}
    	}
		

		//packageNum3 = $('#packageNum3').val()
		//weightNum3 = $('#weightNum3').val()
		//volumeNum3 = $('#volumeNum3').val()
	    //vgmNum3 = $('#vgmNum3').val()
		packageNum3 = packageNum33
		weightNum3 = weightNum33
		volumeNum3 = volumeNum33
		vgmNum3 = vgmNum33
		package3 = packageNum3 + ' ' + $('#package3').val()
		weight3 = weightNum3 + ' ' + $('#weight3').val()
		volume3 = volumeNum3 + ' ' + $('#volume3').val()
		vgm3 = vgmNum3 + ' ' + $('#vgm3').val()
		packageMarks3 = HtmlEncode($('#packageMarks3').val())
		goodAbout3 = HtmlEncode($('#goodAbout3').val())
		bill3Type = $('#billType3').val()
		bill3Shipper = HtmlEncode($('#inShipper3').val())
		bill3Consignee = HtmlEncode($('#inConsignee3').val())
		bill3NotifyParty = HtmlEncode($('#inNotifyParty3').val())
		alsoNotify3 = HtmlEncode($('#inAlsoNotify3').val())
		billBeizhu3 = HtmlEncode($('#inBillBeizhu3').val())
		bill2Beizhu3 = HtmlEncode($('#inBill2Beizhu3').val())

		//allContainer3 = $('#allContainer3').val()
		shippingTerm3 = $('#shippingTerm3').val()
		shippingFeeTerm3 = $('#shippingFeeTerm3').val()
		payAddress3 = $('#payAddress3').val()
		signAddress3 = $('#signAddress3').val()
		
		if(!bill3Shipper) {
			comModel("SHIPPER不能为空")
		} else {
			var parm = {
				'Id': billId,
				'package': package3,
				'weight': weight3,
				'volume': volume3,
				'packageMarks': packageMarks3,
				'goodAbout': goodAbout3,
				'bill1Type': bill3Type,
				'bill1Shipper': bill3Shipper,
				'bill1Consignee': bill3Consignee,
				'bill1NotifyParty': bill3NotifyParty,
				'alsoNotify': alsoNotify3,
				'billBeizhu': billBeizhu3,
				'bill2Beizhu': bill2Beizhu3,
				'shippingTerm': shippingTerm3,
				'shippingFeeTerm': shippingFeeTerm3,
				'payAddress': payAddress3,
				'signAddress': signAddress3,
				'vgm': vgm3,
				//'allContainer': allContainer3,
				'containerType': containerType00,
				'containerData': containerData00
			}
			console.log(parm)
			common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=modifybill', parm, function(data) {
				if(data.State == 1) {
					comModel("保存成功")
				    //location.reload()
					$('#packageNum3').val(packageNum3)
					$('#weightNum3').val(weightNum3)
					$('#volumeNum3').val(volumeNum3)
					$('#vgmNum3').val(vgmNum3)
					$('#weightShow3').val(weightNum3 + " " + $('#weight3').val())
					$('#volumeShow3').val(volumeNum3 + " " + $('#volume3').val())

				} else {
					console.log(data.State)
					comModel("保存失败")
				}
			}, function(error) {
				console.log(parm)
			}, 2000)
		}
	})
	
    /*下一步*/
    $('#send1,#send2,#send3').on('click', function () {

        if (action == 'modify') {
            _isUpdateFun($(this).attr("id"));
            
        } else {
            _doFun($(this).attr("id"))
        }
    })

    function _doFun(bt_id) {

        var bt = bt_id;

		//crmContactId = $('#crmcontact').val(),
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
			//				GP20 = $('#GP20').val(),
			//				SGP20=GP20 + ' ' + $('#20GP').val(),
			//				GP40 = $('#GP40').val(),
			//				SGP40=GP40 + ' ' + $('#40GP').val(),
			//				HQ40 = $('#HQ40').val(),
			//				SHQ40 = HQ40 + ' ' + $('#40HQ').val(),
			packageMarks = HtmlEncode($('#packageMarks').val()),
			goodAbout = HtmlEncode($('#goodAbout').val()),
			beizhu = HtmlEncode($('#beizhu').val());
		if(bt == "send2") {
			isTemplate = 1;
		} else {
			isTemplate = 0;
		}
		
		sellId = $('#sellId').val(),
			luruId = $('#luruId').val(),
			kefuId = $('#kefuId').val(),
			caozuoId = $('#caozuoId').val(),
		
			carrier = $('#carrier').val(),
			//consignee = $('#inputConsignee').val()
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
		bill1Type = $('#billType').val()
		bill1Shipper = HtmlEncode($('#inShipper').val())
		bill1Consignee = HtmlEncode($('#inConsignee').val())
		bill1NotifyParty = HtmlEncode($('#inNotifyParty').val())
		
		billCode = $('#billCode').val()
		sono = $('#sono').val()
		contractNo = $('#contractNo').val()
		alsoNotify = HtmlEncode($('#inAlsoNotify').val())
		billBeizhu = HtmlEncode($('#inBillBeizhu').val())
		bill2Beizhu = HtmlEncode($('#inBill2Beizhu').val())
		port4 = $('#port4').val()
		port5 = $('#port5').val()
		okPortTime2 = $('#okPortTime2').val()
		truePortTime = $('#truePortTime').val()
		truePortTime2 = $('#truePortTime2').val()
		vgmNum = $('#vgmNum').val()
		vgm = vgmNum + ' ' + $('#vgm').val()
		allContainer = ''
		shippingTerm = $('#shippingTerm').val()
		shippingFeeTerm = $('#shippingFeeTerm').val()
		payAddress = $('#payAddress').val()
		signAddress = $('#signAddress').val()
		vessel = $('#vessel').val()
		voyage = $('#voyage').val()
		
		var crmdata = [];
		$("input[name='crmli']:checked").each(function(index, item) {
			crmdata.push($(this).val());
		});
		var supplierData
		if(crmdata.toString() != '') {
			supplierData = crmdata.toString()
		}
		
//		for(var i = 0; i < $('.feeList').length; i++) {
//			var toCompany = $('.feeList').eq(i).find('#toCompany').val()
//			var feeItem = $('.feeList').eq(i).find('#feeItem').val()
//			var feeUnit = $('.feeList').eq(i).find('#feeUnit').val()
//			var numUnit = $('.feeList').eq(i).find('#numUnit').val()
//			var feeType = $('.feeList').eq(i).find('#feeType').val()
//			var feeNum = $('.feeList').eq(i).find('#feeNum').val()
//			var feePrice = $('.feeList').eq(i).find('#feePrice').val()
//			var feeBeizhu = $('.feeList').eq(i).find('#feeBeizhu').val()
//		
//			var feeoneData = feeType + ',' + toCompany + ',' + feeItem + ',' + feeUnit + ',' + feeNum + ',' + feePrice + ',' + numUnit + ',' + feeBeizhu + ';'
//			feeData = feeData + feeoneData
//		}
//		console.log(feeData)
		
		if(action == 'add') {
			if(crmCompanyId == '0') {
				comModel("请选择委托人")
			} else {
			    var parm = {
			        'whichId': 2, //1=联系单，2=订单，3=订舱单
					'fromId': 0,
					'orderCode': orderCode,
					'sono': sono,
					'contractNo': contractNo,
					'outCode': outCode,
					'typeId': 0,
					'isTemplate': isTemplate,
					'companyId': companyID,
					'crmCompanyId': crmCompanyId,
					'crmContactId': 0,
					'userId': userID,
					'userName': userName,
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
					'GP20': '',
					'GP40': '',
					'HQ40': '',
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
					'bill2Type': '',
					'bill2Shipper': '',
					'bill2Consignee': '',
					'bill2NotifyParty': '',
					'billCode': billCode,
					'alsoNotify': alsoNotify,
					'billBeizhu': billBeizhu,
					'bill2Beizhu': bill2Beizhu,
					'shippingTerm': shippingTerm,
					'shippingFeeTerm': shippingFeeTerm,
					'payAddress': payAddress,
					'signAddress': signAddress,
					'port4': port4,
					'port5': port5,
					'vessel': vessel,
					'voyage': voyage,
					'okPortTime2': okPortTime2,
					'truePortTime': truePortTime,
					'truePortTime2': truePortTime2,
					'vgm': vgm,
					'allContainer': allContainer,
					'trailerData': trailerData,
					'feeData': feeData,
					'carrier': carrier,
					//'consignee': consignee,
					'contractNo': contractNo,
					'supplierData': supplierData,
				    'locked':isLock
				}
				console.log(parm)
				common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=new', parm, function(data) {
					if(data.State == 1) {
						console.log(parm)
						bookingId=data.Data;
						if(bt == "send1" || bt == "send2") {
							comModel("新增成功")
							location.href = 'orderadd.html?action=modify&Id='+bookingId;
		
						} else {
							comModel("继续新增订单")
							location.href = 'bookingadd.html?action=add&companyId=' + companyId;
		
						}
		
					} else {
						comModel("新增失败")
					}
				}, function(error) {
					console.log(parm)
				}, 2000)
			}
		
		}
		
		if(action == 'modify') {
		    if (crmCompanyId == '0') {
		        comModel("请选择委托人")
		    } else {
			    var parm = {
			        'whichId': 2, //1=联系单，2=订单，3=订舱单
					'Id': Id,
					'userId': userID,
					'userName': userName,
					'crmCompanyId': crmCompanyId,
					'crmContactId': 0,
					'sono': sono,
					'contractNo': contractNo,
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
					// 'okBillTime': okBillTime,
					'okPortTime': okPortTime,
					'package': package,
					'weight': weight,
					'volume': volume,
					'GP20': SGP20,
					'GP40': SGP40,
					'HQ40': SHQ40,
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
					// 'warehouseInTime': warehouseInTime,
					'warehouseOutCode': warehouseOutCode,
					// 'warehouseOutTime': warehouseOutTime,
					'warehouseBeizhu': warehouseBeizhu,
					'bill1Type': bill1Type,
					'bill1Shipper': bill1Shipper,
					'bill1Consignee': bill1Consignee,
					'bill1NotifyParty': bill1NotifyParty,
					'bill2Type': '',
					'bill2Shipper': '',
					'bill2Consignee': '',
					'bill2NotifyParty': '',
					'billCode': billCode,
					'alsoNotify': alsoNotify,
					'billBeizhu': billBeizhu,
					'bill2Beizhu': bill2Beizhu,
					'shippingTerm': shippingTerm,
					'shippingFeeTerm': shippingFeeTerm,
					'payAddress': payAddress,
					'signAddress': signAddress,
					'port4': port4,
					'port5': port5,
					'vessel': vessel,
					'voyage': voyage,
					'okPortTime2': okPortTime2,
					'truePortTime': truePortTime,
					'truePortTime2': truePortTime2,
					'vgm': vgm,
					'carrier': carrier,
					'contractNo': contractNo,
					'supplierData': supplierData,
					'locked': isLock
					//'allContainer': allContainer,
					//'consignee': consignee
				}
		
				common.ajax_req('POST', false, dataUrl, 'booking.ashx?action=modify', parm, function(data) {
					if(data.State == 1) {
						comModel("修改成功")
						//location.href = 'booking.html';
					} else {
						comModel("修改失败")
					}
				}, function(error) {
					console.log(parm)
				}, 10000)
		
			}
		}

	};

    //是否更新
    function _isUpdateFun(bt_id) {
        common.ajax_req("get", false, dataUrl, "booking.ashx?action=readbyid", {
            "Id": Id
        }, function (data) {
            console.log(data.Data.book_updateTime.replace('T', " "))
            console.log(loadTime)
            //初始化信息
            if (data.Data.book_updateTime != null && data.Data.book_updateTime.replace('T', " ") > loadTime) {
                bootbox.confirm("<div style='font-size:16px; color:red;'>提示：订单处理期间已被其他人更新编辑过，是否还继续提交更新？</div><div>最近一次更新时间为：" + data.Data.book_updateTime.substr(0, 19).replace("T", " ") + "</div><div>可进入订单动态查看操作记录。</div>", function (result) {
                    if (result) {      
                        _doFun(bt_id)
                        setTimeout(function() {
                            loadTime = new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ");
                        }, 1000);
                        
                    }
                });
            } else {
                _doFun(bt_id)
                setTimeout(function () {
                    loadTime = new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ");
                }, 1000);
                
            }
        })

    }

	///当其中一个SELECT改变的时候，询问其他的是否也需要改变, by daniel 20190730
	$('.containerAll').delegate('select','change', function() {
		if($('#selectSamevalue').is(':checked')==true && $(this).attr("id")!="containerType"){				
    		$('.containerAll').find("select[id='"+($(this).attr("id"))+"']").val($(this).val())
    		GetContainerSum();
		}
	}); 

	//////计算件数，重量以及体积的总和，在countSumswitch的开关打开的时候算一次, by daniel 20190731		for(var i = 0; i < $('.containerList').length; i++) {
	$('#container_head').delegate('#countSumswitch','change', function() {
		alert("dd")
		GetContainerSum();
	}); 
	//////计算件数，重量以及体积的总和，每次在输入新的数据的时候计算一次, by daniel 20190731
	$('.containerAll').delegate('input[id="packageNum0"],input[id="weightNum0"],input[id="volumeNum0"]','change', function() {
		GetContainerSum();
		$('#Containers').attr("data-update-status","1")
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
		    weightNum0_sum += Number($(this).val())
		});
		$('.containerAll').find("input[id='volumeNum0']").each(function(){
		    volumeNum0_sum += Number($(this).val())
		});
		// if(_containerListLength>1){
		// 	// for(i=0;i<_containerListLength;i++){

		// 	// }
		// 	package0_sel=$('.containerAll').find("select[id='package0']").val()
		// 	weightNum0_sel=$('.containerAll').find("select[id='weight0']").val()
		// 	volumeNum0_sel=$('.containerAll').find("select[id='volume0']").val()
		// }else{
			package0_sel=$('.containerAll').find("select[id='package0']").val();
			weightNum0_sel=$('.containerAll').find("select[id='weight0']").val();
			volumeNum0_sel=$('.containerAll').find("select[id='volume0']").val();
			// $('#volumeNum').val(volumeNum0_sum);
			// $('#packageNum').val(package0_sum);
			// $('#weightNum').val(weightNum0_sum);
			// $("#package option[value='"+package0_sel+"']").prop("selected", true);
			// $("#volume option[value='"+volumeNum0_sel+"']").prop("selected", true);
			// $("#weight option[value='"+weightNum0_sel+"']").prop("selected", true);
		// }
		//上面是正则来替换件数，毛重，体积的数量，仅仅是数量而已 by daniel 20190731
			(volumeNum0_sum > 0 ? ($('#volumeNum').val(volumeNum0_sum.toFixed(3)) & $("#volume option[value='" + volumeNum0_sel + "']").prop("selected", true) & $('#volumeShow').val(volumeNum0_sum.toFixed(3) + ' ' + volumeNum0_sel)) : "");
		(package0_sum>0?($('#packageNum').val(package0_sum) & $("#package option[value='"+package0_sel+"']").prop("selected", true)):"");
		(weightNum0_sum > 0 ? ($('#weightNum').val(weightNum0_sum.toFixed(3)) & $("#weight option[value='" + weightNum0_sel + "']").prop("selected", true) & $('#weightShow').val(weightNum0_sum.toFixed(3) + ' ' + weightNum0_sel)) : "");
	}
	
}

})




/**
 * 确定
 * @param id
 * @private
 */
function _sureCheckFun(id) {
			bootbox.confirm("Are you sure?", function(result) {
				if(result) {
					$.ajax({
						url: dataUrl + 'ajax/booking.ashx?action=modifybillcheck',
						data: {
							"Id": id,
							"companyId": companyID,
							"userId": userID
						},
						dataType: "json",
						type: "post",
						success: function(backdata) {
							if(backdata.State) {
								comModel("处理成功")
								oTable.fnReloadAjax(oTable.fnSettings());
							} else {
								alert("Failed！");
							}
						},
						error: function(error) {
							console.log(error);
						}
					});
				}
			});
}

//同步显示重量体积
function getWeight() {
    var weightNum = $('#weightNum').val();
    var weight = $('#weight').val();
    $('#weightShow').val(weightNum + ' ' + weight)
}
function getVolume() {
    var volumeNum = $('#volumeNum').val();
    var volume = $('#volume').val();
    $('#volumeShow').val(volumeNum + ' ' + volume)
}
function getWeight2() {
    var weightNum2 = $('#weightNum2').val();
    var weight2 = $('#weight2').val();
    $('#weightShow2').val(weightNum2 + ' ' + weight2)
}
function getVolume2() {
    var volumeNum2 = $('#volumeNum2').val();
    var volume2 = $('#volume2').val();
    $('#volumeShow2').val(volumeNum2 + ' ' + volume2)
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFileFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/files.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        filesTable.fnReloadAjax(filesTable.fnSettings());
                    } else {
                        alert("Delete Failed！");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
}



/*放货详情*/
function _detailOpenGoodsFun(Id) {
    $("#myModal4").modal("show");
    $("#opetionBeizhu").val('')
    openGoodsId = Id
    common.ajax_req("get", true, dataUrl, "opengoods.ashx?action=readbyid", {
        "Id": Id
    }, function (data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
        $(".opgo_toCompany").text(_data.comp_name)
        $(".opgo_addTime").text(_data.addUser + "/" + _data.opgo_addTime.substring(0, 10))
        $(".opgo_openType").text(_data.opgo_openType)
        $(".opgo_orderType").text(_data.opgo_orderType)
        $(".opgo_orderCode_open").text(_data.opgo_orderCode_open)
        $(".opgo_orderCode_close").text(_data.opgo_orderCode_close)
        $(".opgo_beizhu").text(_data.opgo_beizhu)

        if (_data.opgo_state != 1) {
            $("#opetionBeizhu").val(_data.opgo_opetionBeizhu)
            $('#passState').hide()
            $('#nopassState').hide()
        } else {
            $("#opetionBeizhu").val(_data.opgo_opetionBeizhu)
            $('#passState').show()
            $('#nopassState').show()
        }

    }, function (err) {
        console.log(err)
    }, 1000)
}

$('#passState').on('click', function () {
    var jsonData = {
        'Id': openGoodsId,
        'state': 2,
        'opetionUser': userID,
        'opetionBeizhu': $("#opetionBeizhu").val()
    };
    $.ajax({
        url: dataUrl + 'ajax/opengoods.ashx?action=modify',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                comModel("提交成功！")
                $("#myModal4").modal("hide");
                openGoodsTable.fnReloadAjax(openGoodsTable.fnSettings());
            } else {
                comModel("提交失败！")
                //location.href = 'emailpp_group.html';
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

})


$('#nopassState').on('click', function () {
    var jsonData = {
        'Id': openGoodsId,
        'state': 3,
        'opetionUser': userID,
        'opetionBeizhu': $("#opetionBeizhu").val()
    };
    $.ajax({
        url: dataUrl + 'ajax/opengoods.ashx?action=modify',
        data: jsonData,
        dataType: "json",
        type: "post",
        success: function (backdata) {
            if (backdata.State == 1) {
                comModel("提交成功！")
                $("#myModal4").modal("hide");
                openGoodsTable.fnReloadAjax(openGoodsTable.fnSettings());
            } else {
                comModel("提交失败！")
                //location.href = 'emailpp_group.html';
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

})

/**
 * 删除
 * @param id
 * @private
 */
function _deleteOpenGoodsFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/opengoods.ashx?action=cancel',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        openGoodsTable.fnReloadAjax(openGoodsTable.fnSettings());
                    } else {
                        alert("Delete Failed！");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
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


