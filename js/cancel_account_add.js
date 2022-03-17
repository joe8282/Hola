//语言包
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
var Ids = ""
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
	$("#btnAddSave_apply").hide();
	$("#btnGetAllApply").hide();
	var codeType='';
	if (feeType == 'credit') {
	    $("#cancel_type").val(2).trigger("change")
	    codeType = 'CP'
	} else if (feeType == 'debit') {
	    $("#cancel_type").val(1).trigger("change")
	    codeType = 'CR'
	} else {
	    $("#cancel_type").val(0).trigger("change")
	}

	$(".code").hide()

	//if (action == 'add') {
	//    common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=getcancelcode", {
	//        "companyId": companyID,
	//        "type": codeType
	//    }, function (data) {
	//        //console.log(data)
	//        if (data.State == 1) {
	//            $("#code").val(data.Data)
	//        }
	//    })
	//}


	oTable = initTable(toCompany, action, feeType);

	$("#cancel_type").change(function () {
	    if (action == 'add') {
	        if ($("#cancel_type").val() == '1') {
	            location.href = "cancel_account_add.html?action=add&toCompanyId=" + toCompany + "&feeType=debit"
	        } else if ($("#cancel_type").val() == '2') {
	            location.href = "cancel_account_add.html?action=add&toCompanyId=" + toCompany + "&feeType=credit"
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

	

	//$("#checkAll").on("click", function () {
	//    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	//    var ck = $("input[name='checkList']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	//});
	$("#checkAll").on("click", function () {
	    $("#cancel_money").val('')
	    cancel_all_money = 0
	    if ($(this).prop('checked')) {
	        if ($("#unit").val() == '') {
	            comModel("请选择币种")
	            $(this).prop("checked", false)
	            return
	        } else {
	            var ck = $("input[name='checkList']").prop("checked", true);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	            $("input[name='checkList']:checked").each(function (i, o) {
	                var value_one = 0
	                var value = $(this).parents('tr').find("td:eq(5)").text();
	                var value_unit = $(this).parents('tr').find("td:eq(4)").text();
	                if (value_unit == $("#unit").val()) {
	                    value_one = value_one + value * 1
	                } else {
	                    value_one = value_one + value * exchangeRate
	                }
	                //console.log($(this).parent().parent().find("label:eq(8)").html())
	                $(this).parents('tr').find("td:eq(6)").text(value_one)
	                cancel_all_money = cancel_all_money + value_one
	            });
	            $("#cancel_money").val(cancel_all_money)
	        }
	    } else {
	        var ck = $("input[name='checkList']").prop("checked", false);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	        $("input[name='checkList']").each(function (i, o) {
	            $(this).parents('tr').find("td:eq(6)").text('')
	        });
	        $("#cancel_money").val('')
	    }
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
	        $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, companyId: companyID }, function (ret) {
	            if (ret.State == '100') {
	                //alert(ret.Picurl);
	                $('#showimg').attr('src', ret.Picurl);
	                $('#Nav').val(ret.Nav);
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

	    var state = 3
	    if (action == 'modify') {
	        state = 4
	    }
	    //if (action == 'apply') {
	    //    isapply = Id
	    //}

	    if ($("#unit").val() == '') {
	        comModel("币种不能为空！")
	        return
	    } else if ($("#bank").val() == '') {
	        comModel("银行不能为空！")
	        return
	    } else if ($("#cancel_money").val() == '') {
	        comModel("实际销账金额不能为空！")
	        return
	    } else if (str.length == 0) {
	        comModel("请选择销账明细！")
	        return
	    } else {
	        $("#btnAddSave").hide();
	        var jsonData = {
	            'state': state,
	            'companyId': companyID,
	            'toCompany': toCompany,
	            'userId': userID,
	            'code': $("#code").val(),
	            'bank': $("#bank").val(),
	            'money': $("#cancel_money").val(),
	            'currency': $("#unit").val(),
	            'typeId': $("#cancel_type").val(),
	            'beizhu': $("#beizhu").val(),
	            'file': $("#Nav").val() + $("#Pname").val(),
	            //'iscancel': iscancel,
	            //'isapply':isapply,
	            'feeItem': str
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
	                    $("#btnAddSave").show()
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

	$("#btnAddSave_apply").on("click", function () {
	    $("#btnAddSave_apply").hide();
	    var jsonData = {
	        'Id': Id,
	        'Ids': Ids,
	        'state': 3,
	        'code': $("#code").val(),
	        'bank': $("#bank").val(),
	        'opetionUser': userID
	    };
	    $.ajax({
	        url: dataUrl + 'ajax/cancelaccount.ashx?action=modify',
	        data: jsonData,
	        dataType: "json",
	        type: "post",
	        success: function (backdata) {
	            if (backdata.State == 1) {
	                comModel("提交成功！")
	                location.href = 'cancel_account.html';
	            } else {
	                comModel("提交失败！")
	                $("#btnAddSave_apply").show();
	                //location.href = 'emailpp_group.html';
	            }
	        },
	        error: function (error) {
	            console.log(error);
	        }
	    });
	});

	if (action == 'modify') {
	    $(".code").show()
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
	            $('#showimg').attr('src', dataUrl + data.Data.caac_file);
	        }
	        cancel_all_money = data.Data.caac_money
	        var maillist = data.Data.caac_feeItem.split(',')
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
	    $("#btnGetAllApply").show();
	    $("#btnAddSave").hide();
	    $("#btnAddSave_apply").show();
	    $('input,textarea').prop('disabled', true);
	    $('select').prop('disabled', true);
	    $('#bank').prop('disabled', false);
	    common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=readbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        $("#cancel_type").val(data.Data.caac_typeId).trigger("change");
	        //if (data.Data.caac_typeId == 1) { codeType = 'CR' }
	        //else if (data.Data.caac_typeId == 2) { codeType = 'CP'; }
	        //common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=getcancelcode", {
	        //    "companyId": companyID,
	        //    "type": codeType
	        //}, function (data) {
	        //    //console.log(data)
	        //    if (data.State == 1) {
	        //        $("#code").val(data.Data)
	        //    }
	        //})

	        $("#cancel_money").val(data.Data.caac_money)
	        $("#unit").val(data.Data.caac_currency).trigger("change")
	        $("#bank").val(data.Data.caac_bank).trigger("change")
	        $("#beizhu").val(data.Data.caac_beizhu)
	        if (data.Data.caac_file != "") {
	            $('#showimg').attr('src', dataUrl + _data.caac_file);
	        }
	        cancel_all_money = data.Data.caac_money
	        var maillist = data.Data.caac_feeItem.split(',')
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
	        }, 500)

	    }, function (err) {
	        console.log(err)
	    }, 5000)
	}


	$("#btnGetAllApply").on("click", function () {
	    $("#myModal5").modal("show");
	    $(".all_apply").empty()
	    $('.checkAll_apply').prop('checked', false);
	    var jsonData = {
	        'state': 2,
	        'preCode': 'has',
	        'typeId': $('#cancel_type').val(),
	        'companyId': companyID,
	        'toCompany': toCompany,
	        'currency': $('#unit').val(),
	    };
	    $.ajax({
	        url: dataUrl + '/ajax/cancelaccount.ashx?action=read',
	        data: jsonData,
	        dataType: "json",
	        type: "get",
	        success: function (backdata) {
	            var _data = backdata.data;
	            for (var i = 0; i < _data.length; i++) {
	                var _html = ""
	                if (_data[i].caac_id == Id) {
	                    _html = '<div class="margin-top-10" style="clear:both;"><label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="applyli" value="' + _data[i].caac_id + '" disabled checked></label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].caac_preCode + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].rema_type + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].caac_addTime.substring(0, 10) + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].caac_currency + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].caac_money + '</label></div>'
	                } else {
	                    _html = '<div class="margin-top-10" style="clear:both;"><label for="inputPassword3" class="margin-right-10" style="width:5%; float: left;"><input type="checkbox" style="margin:0px; padding:0px;" name="applyli" value="' + _data[i].caac_id + '"></label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].caac_preCode + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].rema_type + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].caac_addTime.substring(0, 10) + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:10%; float: left;">' + _data[i].caac_currency + '</label>'
                            + '<label for="inputPassword3" class="margin-right-10" style="width:20%; float: left;">' + _data[i].caac_money + '</label></div>'
	                }
	                $(".all_apply").prepend(_html)
	            }
	            if (Ids != "") {
	                var maillist = Ids.split(',')
	                for (var i = 0; i < maillist.length - 1; i++) {
	                    $("input[name='applyli'][value='" + maillist[i] + "']").attr("checked", true)
	                }
	            }

	        },
	        error: function (error) {
	            console.log(error);
	        }
	    });

	    $('#myModal5 input').prop('disabled', false);
	})

	$(".checkAll_apply").on("click", function () {
	    var xz = $(this).prop("checked");//判断全选按钮的选中状态
	    var ck = $("input[name='applyli']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	})


	$("#sureSave").on("click", function () {
	    $("input[name='checkList']").attr("checked", false)
	    var all_money = 0
	    Ids = "";
	    $("input[name='applyli']:checked").each(function (i, o) {
	        Ids += $(this).val();
	        Ids += ",";
	        common.ajax_req("get", false, dataUrl, "cancelaccount.ashx?action=readbyid", {
	            "Id": $(this).val()
	        }, function (data) {
	            var maillist = data.Data.caac_feeItem.split(',')
	            for (var i = 0; i < maillist.length; i++) {
	                $("input[name='checkList'][value='" + maillist[i] + "']").prop("checked", true)
	            }
	            all_money += data.Data.caac_money
	        })
	    });
	    $("#cancel_money").val(all_money)
	    $("#myModal5").modal("hide");


	})

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
		"iDisplayLength":20,
        "sAjaxSource": url,
	    'bPaginate': false,
	    "bInfo": false,
	    //		"bDestory": true,
	    //		"bRetrieve": true,
	    //"bFilter": false,
	    "bSort": false,
	    "aaSorting": [[0, "desc"]],
	    //		"bProcessing": true,
	    "aoColumns": [
            				{
            				    "mDataProp": "bofe_id",
            				    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				        $(nTd).html("<input type='checkbox' name='checkList' class='input_fee' onclick='_checkFun(this," + iRow + ")' getUnit='" + oData.bofe_feeUnit + "' getAllfee='" + oData.bofe_allFee + "' getCancelfee='0' value='" + sData + "'>");
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
        console.log(obj.closest("tr"))
        //console.log(exchangeRate)
        //console.log(obj.checked)
        //console.log(iRow)
        var tr = obj.closest("tr")
        //console.log($(tr).find('td:eq(5)').text())
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

        //var value = $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(5)").text()
        //var value_unit = $("#zhangdan>tbody>tr:eq(" + iRow + ")").find("td:eq(4)").text()
        var value = $(tr).find("td:eq(5)").text()
        var value_unit = $(tr).find("td:eq(4)").text()
        if (value_unit == $("#unit").val()) {
            value_one = value_one + value * 1
        } else {
            value_one = value_one + value * exchangeRate
        }
        
        if (obj.checked) {
            $(tr).find("td:eq(6)").text(value_one)
            cancel_all_money = cancel_all_money + value_one
            $("#cancel_money").val(cancel_all_money)
        } else {
            $(tr).find("td:eq(6)").text('')
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