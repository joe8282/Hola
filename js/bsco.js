//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2": "货物管理中心",
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2": "SHIPMENTS MANAGEMENTe",
        };


var oTable;

$(document).ready(function() {
    //hasPermission('1723'); //权限控制：
    //if (isPermission('1307') != 1) {
    //    $('#addFun').hide()
    //}
	this.title = "BS/CO管理"
	$('.navli3').addClass("active open")
	$('.book9').addClass("active")
	$('#title1').text("BS/CO管理")
	$('.widget-caption').text("BS/CO管理")
	$('#title2').text("BS/CO管理")

	oTable = GetOpenGoods();


    // 选择图片  
	$("#img").on("change", function () {
	    var fileUpload = $("#img").get(0);
	    var files = fileUpload.files;

	    var data = new FormData();
	    for (var i = 0; i < files.length; i++) {
	        data.append(files[i].name, files[i]);
	        data.append("companyId", companyID);
	        data.append("type", bcso);
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
	                $('#toShow').attr("href", res.Picurl);
	                $('#Pname').val(res.Pname);
	                $('#Nav').val(res.Nav);
	            } else if (res.State == '101') {
	                $('#showimg').text("上传文件格式不对");
	            } else {
	                $('#showimg').text("上传失败");
	            }

	        },
	        error: function (err) {
	            alert(err.statusText)
	        }
	    });

	})

    /*新增文件*/
	$('#btnSave').on('click', function () {
	    if ($("#Pname").val() == "") {
	        comModel("请选择上传的文件！")
	    } else {
	        var parm = {
	            'companyId': companyID,
	            'userId': userID,
	            'nav': $('#Nav').val(),
	            "url": $("#Pname").val()
	        }
	        console.log(parm)
	        common.ajax_req('POST', false, dataUrl, 'bcso.ashx?action=new', parm, function (data) {
	            if (data.State == 1) {
	                comModel("新增成功")
	                $('#Nav').val(""),
                    $("#Pname").val("")
	                oTable.fnReloadAjax(oTable.fnSettings());
	            } else {
	                comModel("新增失败")
	            }
	        }, function (error) {
	        }, 2000)
	    }
	});

});

//BS/CO管理列表
function GetOpenGoods() {
    var table = $("#openGoodsList").dataTable({
        //"iDisplayLength":10,
        "sAjaxSource": dataUrl + 'ajax/bsco.ashx?action=read&companyId=' + companyID,
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
                            "mDataProp": "bcso_file",
                            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                $(nTd).html("<a href='uppic/bsco/" + oData.bcso_companyId + "/"+oData.bcso_file+"' target='_blank'>" + oData.bcso_file + "</a>");
                            }
                        },
            { "mDataProp": "usin_name" },
                                    {
                                        "mDataProp": "bcso_addTime",
                                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                            $(nTd).html(oData.bcso_addTime.substring(0, 10));
                                            
                                        }
                                    },
            { "mDataProp": "bcso_downNum" },
            { "mDataProp": "downUser" },
                                    {
                                        "mDataProp": "bsco_downTime",
                                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                            $(nTd).html(oData.bsco_downTime.substring(0, 10));

                                        }
                                    },
            {
                "mDataProp": "bsco_id",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='javascript:void(0);' onclick='_deleteOpenGoodsFun(" + sData + ")'>" + get_lan('delete') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")

                }
            },
        ]
    });
    return table;
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
                oTable.fnReloadAjax(oTable.fnSettings());
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
                oTable.fnReloadAjax(oTable.fnSettings());
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