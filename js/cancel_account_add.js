﻿//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "财务管理中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Financial MANAGEMENT",
};

var oTable;
var typeId;
var exchangeRate;
var cancel_all_money = 0;
var _feeItemArr = new Array();

$(document).ready(function() {
//	initModal();
    this.title = get_lan('nav_5_11')
    $('.navli5').addClass("active open")
    $('.financial11').addClass("active")
    $('#title1').text(get_lan('nav_5_11'))
    $('#title2').text(get_lan('nav_5_11'))

	var action = GetQueryString('action');
	var toCompany = GetQueryString('toCompanyId');
	var Id = GetQueryString('Id');
	var feeType = GetQueryString('feeType') == null ? '' : GetQueryString('feeType')
	$("#btnBackSave").hide();
	$("#btnBackSave").click(_editSaveFun);

	var codeType='';
	if (feeType == 'credit') {
	    $("#cancel_type").val(1).trigger("change")
	    codeType = 'CP'
	} else if (feeType == 'debit') {
	    $("#cancel_type").val(2).trigger("change")
	    codeType = 'CR'
	} else {
	    $("#cancel_type").val(0).trigger("change")
	}

	if (action == 'add') {
	    common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=getcancelcode", {
	        "companyId": companyID,
	        "type": codeType
	    }, function (data) {
	        //console.log(data)
	        if (data.State == 1) {
	            $("#code").val(data.Data)
	        }
	    })
	}


	oTable = initTable(toCompany, action, feeType);

	$("#cancel_type").change(function () {
	    if (action == 'add') {
	        if ($("#cancel_type").val() == '1') {
	            location.href = "cancel_account_add.html?action=add&toCompanyId=" + toCompany + "&feeType=credit"
	        } else if ($("#cancel_type").val() == '2') {
	            location.href = "cancel_account_add.html?action=add&toCompanyId=" + toCompany + "&feeType=debit"
	        } else {
	            location.href = "cancel_account_add.html?action=add&toCompanyId=" + toCompany
	        }
	    }

	})

	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
	    'typeId': 6,
	    'companyId': companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    for (var i = 0; i < _data.length; i++) {
	        _feeItemArr.push(_data[i].puda_id + ';' + _data[i].puda_name_cn + ' / ' + _data[i].puda_name_en)
	    }
	}, function (error) {
	}, 1000)

    //币种
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
	    'typeId': 13,
	    'companyId': companyID
	}, function (data) {
	    var _data = data.data;
	    for (var i = 0; i < _data.length; i++) {
	        var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
	        $('#unit').append(_html)
	    }
	}, function (error) {
	    console.log(parm)
	}, 1000)
	$("#unit").change(function () {
	    var opt = $("#unit").val();
	    if (opt == 'USD') {
	        common.ajax_req("get", true, dataUrl, "exchangerate.ashx?action=readbyowner", {
	            "owner": opt,
	            "other": 'RMB'
	        }, function (data) {
	            if (data.State == 1) {
	                exchangeRate = data.Data.rate_exchangeRate
	            }
	        })
	    } else if (opt == 'RMB') {
	        common.ajax_req("get", true, dataUrl, "exchangerate.ashx?action=readbyowner", {
	            "owner": opt,
	            "other": 'USD'
	        }, function (data) {
	            if (data.State == 1) {
	                exchangeRate = data.Data.rate_exchangeRate
	            }
	        })
	    } else {
	        alert("暂时只支持美元、人名币");    
	    }
	})

    //银行
	common.ajax_req("get", false, dataUrl, "remark.ashx?action=read", {
	    "companyId": companyID,
	    "typeCode": 'bank'
	}, function (data) {
	    //console.log(data)
	    var _data = data.data;
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<option value="' + _data[i].rema_id + '" data-remarkContent="' + _data[i].rema_content + '">' + _data[i].rema_type + '</option>';
	            $('#bank').append(_html)
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)

	

	$("#checkAll").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});

	$('#example').delegate('#editEmail', 'click', function() {
		var _td=$(this).parents('tr').find("td")//.eq(0).html()
	    $("#inputEmailppname").val(_td.eq(1).html());
	    $("#inputEmailppcompany").val(_td.eq(6).html());
	    $("#inputEmailppaddress").val(_td.eq(3).html());
	    $("#inputEmailpptel").val(_td.eq(4).html());
	    $("#inputEmailppcountry").val(_td.eq(5).html());
	    $("#inputEmailppsource").val(_td.eq(7).html());
	    $("#objectId").val($(this).attr("data-id"));
	    $("#myModal").modal("show");
	    $("#btnSave").hide();
	    $("#btnEdit").show();
	    $("#mySmallModalLabel").text('编辑邮件');
	    // $("#inputEmailppname").val(_td.eq(1).html());
	    // $("#inputEmailppcompany").val(_td.eq(5).html());
	    // $("#inputEmailppaddress").val(_td.eq(2).html());
	    // $("#inputEmailpptel").val(_td.eq(3).html());
	    // $("#inputEmailppcountry").val(_td.eq(4).html());
	    // $("#inputEmailppsource").val(_td.eq(6).html());
	    // $("#objectId").val($(this).attr("data-id"));
	    // $("#myModal").modal("show");
	    // $("#btnSave").hide();
	    // $("#btnEdit").show();
	    // $("#mySmallModalLabel").text('编辑邮件');
	})

    // 选择图片  
	$("#img").on("change", function () {
	    var img = event.target.files[0];
	    // 判断是否图片  
	    if (!img) {
	        return;
	    }

	    // 判断图片格式  
	    if (!(img.type.indexOf('image') == 0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name))) {
	        alert('图片只能是jpg,gif,png');
	        return;
	    }

	    var reader = new FileReader();
	    reader.readAsDataURL(img);

	    reader.onload = function (e) { // reader onload start  
	        // ajax 上传图片  
	        $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, action: 'fee' }, function (ret) {
	            if (ret.State == '100') {
	                //alert(ret.Picurl);
	                $('#showimg').attr('src', ret.Picurl);
	                $('#Pname').val(ret.Pname);
	                //$('#showimg').html('<img src="' + ret.Data + '">');
	            } else {
	                alert('上传失败');
	            }
	        }, 'json');
	    } // reader onload end  
	})

	$("#btnAddSave").on("click", function () {
	    var str = '';
	    $("input[name='checkList']:checked").each(function (i, o) {
	        str += $(this).val();
	        str += ",";
	    });

	    var iscancel = 0,isapply=0
	    if (action == 'modify') {
	        iscancel = 1
	    }
	    if (action == 'apply') {
	        isapply = Id
	    }

	    if ($("#unit").val() == '') {
	        comModel("币种不能为空！")
	    } else if ($("#bank").val() == '') {
	        comModel("银行不能为空！")
	    } else if ($("#cancel_money").val() == '') {
	        comModel("实际销账金额不能为空！")
	    } else if ($("#code").val() == '') {
	        comModel("编号不能为空！")
	    } else if (str.length == 0) {
	        comModel("请选择销账明细！")
	    } else {
	        var jsonData = {
	            'companyId': companyID,
	            'toCompany': toCompany,
	            'userId': userID,
	            'code': $("#code").val(),
	            'bank': $("#bank").val(),
	            'money': $("#cancel_money").val(),
	            'currency': $("#unit").val(),
	            'typeId': $("#cancel_type").val(),
	            'beizhu': $("#beizhu").val(),
	            'file': $("#Pname").val(),
	            'iscancel': iscancel,
	            'isapply':isapply,
	            'bill': str
	        };
	        $.ajax({
	            url: dataUrl + 'ajax/cancelaccount.ashx?action=new',
	            data: jsonData,
	            dataType: "json",
	            type: "post",
	            success: function (backdata) {
	                if (backdata.State == 1) {
	                    comModel("提交成功！")
	                    location.href = 'cancel_account.html';
	                } else {
	                    comModel("提交失败！")
	                    //location.href = 'emailpp_group.html';
	                }
	            },
	            error: function (error) {
	                console.log(error);
	            }
	        });
	        //if (action == 'modify') {
	        //    //console.log(str)
	        //    //alert(str)
	        //    //alert(str.split(",").length-1)
	        //    var jsonData = {
            //        'Id': Id,
	        //        'userId': userID,
	        //        'mg_name': $("#emailGroupname").val(),
	        //        'mlids': str,
	        //        'count_mlids': str.split(",").length-1
	        //    };
	        //    $.ajax({
	        //        url: dataUrl + 'ajax/mail.ashx?action=modifymailgroup',
	        //        data: jsonData,
	        //        dataType: "json",
	        //        type: "post",
	        //        success: function (backdata) {
	        //            if (backdata.State == 1) {
	        //                comModel("编辑成功！")
	        //                location.href = 'emailpp_group.html';
	        //            } else {
	        //                comModel("编辑失败！")
	        //                location.href = 'emailpp_group.html';
	        //            }
	        //        },
	        //        error: function (error) {
	        //            console.log(error);
	        //        }
	        //    });
	        //}
	    }
	});

	

	if (action == 'modify') {
	    $('input,textarea').prop('disabled', true);
	    $('select').prop('disabled', true);
	    $('#btnAddSave').prop('disabled', true);
    	//hasPermission('1206'); //权限控制：修改群组邮件列表
	    common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=readbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        $("#cancel_type").val(data.Data.caac_typeId).trigger("change")
	        $("#code").val(data.Data.caac_code)
	        $("#cancel_money").val(data.Data.caac_money)
	        $("#unit").val(data.Data.caac_currency).trigger("change")
	        $("#bank").val(data.Data.caac_bank).trigger("change")
	        $("#beizhu").val(data.Data.caac_beizhu)
	        if (data.Data.caac_file != "") {
	            $('#showimg').attr('src', dataUrl+"uppic/feePic/" + data.Data.caac_file);
	        }
	        cancel_all_money = data.Data.caac_money
	        var maillist = data.Data.caac_bill.split(',')
	        setTimeout(function () {
	            $('input,textarea').prop('disabled', true);
	            for (var i = 0; i < maillist.length; i++) {
	                $("input[name='checkList'][value='" + maillist[i] + "']").attr("checked", true)
	            }
	            $("input[name='checkList']:checked").each(function (i, o) {
	                var value_one = 0
	                var value = $(this).parents('tr').find("td:eq(5)").text()
	                var value_unit = $(this).parents('tr').find("td:eq(4)").text()
	                if (value_unit == $("#unit").val()) {
	                    value_one = value_one + value * 1
	                } else {
	                    value_one = value_one + value * exchangeRate
	                }
	                $(this).parents('tr').find("td:eq(6)").text(value_one)
	            });
	            // $("input[name='checkList']:checked").each(function (i, o) {
	            //     var value_one = 0
	            //     var value = $(this).parents('tr').find("td:eq(4)").text()
	            //     var value_unit = $(this).parents('tr').find("td:eq(3)").text()
	            //     if (value_unit == $("#unit").val()) {
	            //         value_one = value_one + value * 1
	            //     } else {
	            //         value_one = value_one + value * exchangeRate
	            //     }
	            //     $(this).parents('tr').find("td:eq(5)").text(value_one)
	            // });
	            if(cancel_all_money<0){
	    			$("#btnBackSave").show(); // 2021-10-15 DANIEL修改：计算完后才显示这个按钮
	            	$('#btnBackSave').val("已返销");
	            	$('#btnBackSave').text("已返销");
	            	$('#btnBackSave').prop('disabled', true);
	            } else {
	    			$("#btnBackSave").show(); // 2021-10-15 DANIEL修改：计算完后才显示这个按钮
	            }
	        }, 2000)

	    }, function (err) {
	        console.log(err)
	    }, 5000)

	} else if (action == 'apply') {
	    $('input,textarea').prop('disabled', true);
	    $('select').prop('disabled', true);
	    common.ajax_req("get", false, dataUrl, "bill.ashx?action=readbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        if (data.Data.bill_payType == 'debit') { $("#cancel_type").val("2").trigger("change"); codeType = 'CR' }
	        else if (data.Data.bill_payType == 'credit') { $("#cancel_type").val("1").trigger("change"); codeType = 'CP';}
	        common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=getcancelcode", {
	            "companyId": companyID,
	            "type": codeType
	        }, function (data) {
	            //console.log(data)
	            if (data.State == 1) {
	                $("#code").val(data.Data)
	            }
	        })

	        $("#cancel_money").val(data.Data.bill_payPrice)
	        $("#unit").val(data.Data.bill_currency).trigger("change")
	        $("#bank").val(data.Data.bill_bank).trigger("change")
	        $("#beizhu").val(data.Data.bill_beizhu)
	        if (data.Data.bill_file != "") {
	            $('#showimg').attr('src', dataUrl + "uppic/feePic/" + data.Data.bill_file);
	        }
	        cancel_all_money = data.Data.bill_payPrice
	        var maillist = data.Data.bill_feeItem.split(',')
	        setTimeout(function () {
	            $('input,textarea').prop('disabled', true);
	            $('#beizhu').removeAttr("disabled");
	            for (var i = 0; i < maillist.length; i++) {
	                $("input[name='checkList'][value='" + maillist[i] + "']").attr("checked", true)
	            }
	            //$("input[name='checkList']:checked").each(function (i, o) {
	            //    var value_one = 0
	            //    var value = $(this).parents('tr').find("td:eq(5)").text()
	            //    var value_unit = $(this).parents('tr').find("td:eq(4)").text()
	            //    if (value_unit == $("#unit").val()) {
	            //        value_one = value_one + value * 1
	            //    } else {
	            //        value_one = value_one + value * exchangeRate
	            //    }
	            //    $(this).parents('tr').find("td:eq(6)").text(value_one)
	            //});
	            //if (cancel_all_money < 0) {
	            //    $("#btnBackSave").show(); // 2021-10-15 DANIEL修改：计算完后才显示这个按钮
	            //    $('#btnBackSave').val("已返销");
	            //    $('#btnBackSave').text("已返销");
	            //    $('#btnBackSave').prop('disabled', true);
	            //} else {
	            //    $("#btnBackSave").show(); // 2021-10-15 DANIEL修改：计算完后才显示这个按钮
	            //}
	        }, 2000)

	    }, function (err) {
	        console.log(err)
	    }, 5000)
	}

});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable(toCompany, action, feeType) {
    var url = dataUrl + 'ajax/booking.ashx?action=readfee&which=table&state=1&companyId=' + companyID + '&tocompany=' + toCompany + '&feeType=' + feeType
    if (action == 'modify') {
        url = dataUrl + 'ajax/booking.ashx?action=readfee&which=table&companyId=' + companyID + '&tocompany=' + toCompany
    }
    if (action == 'apply') {
        url = dataUrl + 'ajax/booking.ashx?action=readfee&which=table&state=2&companyId=' + companyID + '&tocompany=' + toCompany
    }
    var table = $("#zhangdan").dataTable({
		//"iDisplayLength":10,
        "sAjaxSource": url,
	    'bPaginate': false,
	    "bInfo": false,
	    //		"bDestory": true,
	    //		"bRetrieve": true,
	    "bFilter": false,
	    "bSort": false,
	    "aaSorting": [[0, "desc"]],
	    //		"bProcessing": true,
	    "aoColumns": [
            				{
            				    "mDataProp": "bofe_id",
            				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				        $(nTd).html("<input type='checkbox' name='checkList' onclick='_checkFun(this," + iRow + ")' value='" + sData + "'>");
            				    }
            				},
                            {
                                "mDataProp": "bofe_feeType",
                                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                    if (oData.bofe_feeType == 'debit') {
                                        $(nTd).html("应收 "+oData.comp_name)
                                    } else if (oData.bofe_feeType == 'credit') {
                                        $(nTd).html("应付 "+oData.comp_name)
                                    }

                                }
                            },
                            { "mDataProp": "book_orderCode" },
                            {
                                "mDataProp": "bofe_feeItem",
                                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                    $(nTd).html(_getFeeItemFun(oData.bofe_feeItem))
                                }
                            },
            { "mDataProp": "bofe_feeUnit" },
            { "mDataProp": "bofe_allFee" },
           {"mDataProp": "bofe_cancelMoney"},
            { "mDataProp": "bofe_addTime" ,
				"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
					if(oData.bofe_addTime!=null){
						$(nTd).html(oData.bofe_addTime.substring(0, 10));
					}else{
						$(nTd).html("NULL");
					}
				}	
        	},
            { "mDataProp": "bofe_beizhu" },
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

/**
 * 初始化
 * @private
 */
function _init() {
	resetFrom();
	$("#btnEdit").hide();
	$("#btnSave").show();	
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

/**
 * 重置表单
 */
function resetFrom() {
    $('form').each(function (index) {
        $('form')[index].reset();
    });
}


/**
 * 编辑数据带出值
 */
function _editFun(id, ml_name, ml_com, ml_email, ml_tel, ml_country, ml_source) {
    $("#inputEmailppname").val(ml_name);
    $("#inputEmailppcompany").val(ml_com);
    $("#inputEmailppaddress").val(ml_email);
    $("#inputEmailpptel").val(ml_tel);
    $("#inputEmailppcountry").val(ml_country);
    $("#inputEmailppsource").val(ml_source);
    $("#objectId").val(id);
    $("#myModal").modal("show");
    $("#btnSave").hide();
    $("#btnEdit").show();
    $("#mySmallModalLabel").text('编辑邮件');
}

/**
 * 销账
 * @private
 */
function _editSaveFun() {
	$('#btnAddSave').prop('disabled', false);
    $("input[name='checkList']:checked").each(function (i, o) {
        //$(this).prop("checked", false) 
        $(this).parents('tr').find("td:eq(6)").text(0)
    });
    $("#cancel_money").val(0 - $("#cancel_money").val())
	$('#btnBackSave').prop('disabled', true);
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/mail.ashx?action=cancelmaillist',
                data: {
                    "Id": id
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        oTable.fnReloadAjax(oTable.fnSettings());
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

function _getFeeItemFun(o) {
    var z = new Array();
    var x;
    for (var i = 0; i < _feeItemArr.length; i++) {
        if (_feeItemArr[i].indexOf(o) >= 0) {
            z = _feeItemArr[i].split(";");
            x = z[1];
        }
    }
    return x;
}
/**
 * 选择
 * @param id
 * @private
 */
function _checkFun(obj, iRow) {
    if ($("#unit").val() == '') {
        comModel("请选择币种")
        obj.checked = false
    } else {
        //console.log(exchangeRate)
        //console.log(obj.checked)
        //console.log(iRow)
        var value_one = 0
        // var value = $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(4)").text()
        // var value_unit = $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(3)").text()
        // if (value_unit == $("#unit").val()) {
        //     value_one = value_one + value * 1
        // } else {
        //     value_one = value_one + value * exchangeRate
        // }
        
        // if (obj.checked) {
        //     $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(5)").text(value_one)
        //     cancel_all_money = cancel_all_money + value_one
        //     $("#cancel_money").val(cancel_all_money)
        // } else {
        //     $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(5)").text('')
        //     cancel_all_money = cancel_all_money - value_one
        //     $("#cancel_money").val(cancel_all_money)
            
        // }
        var value = $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(5)").text()
        var value_unit = $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(4)").text()
        if (value_unit == $("#unit").val()) {
            value_one = value_one + value * 1
        } else {
            value_one = value_one + value * exchangeRate
        }
        
        if (obj.checked) {
            $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(6)").text(value_one)
            cancel_all_money = cancel_all_money + value_one
            $("#cancel_money").val(cancel_all_money)
        } else {
            $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(6)").text('')
            cancel_all_money = cancel_all_money - value_one
            $("#cancel_money").val(cancel_all_money)
            
        }
    }

    
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