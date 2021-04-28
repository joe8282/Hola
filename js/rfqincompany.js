//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "询盘管理中心",   
            "con_top_3" : "询盘管理", 
            "con_top_4" : "内部询盘管理", 
            "con_top_5" : "内部询盘管理", 
            "con_top_6" : "费用管理", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "RFQ Management",   
            "con_top_3" : "RFQ Management",    
            "con_top_4" : "RFQ Mnagement In Company",  
            "con_top_6" : "FEE MANAGEMENT", 
        };

var type = GetQueryString('type');
var sellId,luruId,kefuId,caozuoId;
var _getSellNameArr = new Array();


var oTable; var rfqId;
$(document).ready(function () {
    $('.navli7').addClass("active open")
    if (type == 'my') {
        $('.rfq1').addClass("active")
        this.title = get_lan('nav_7_2')
        $('#title1').text(get_lan('nav_7_2'))
        $('#title2').text(get_lan('nav_7_2'))
    } else if (type == 'company') {
        $('.rfq2').addClass("active")
        this.title = get_lan('nav_7_3')
        $('#title1').text(get_lan('nav_7_3'))
        $('#title2').text(get_lan('nav_7_3'))
    }


	oTable = initTable();
	$('#summernote').summernote({ 
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

	/*下一步*/
	$('.getStatuName').on('click', function() {
		$("#example_filter input").val($(this).html());
		//模拟按下回车键
		var e = jQuery.Event("keyup");//模拟一个键盘事件
			e.keyCode = 13;//keyCode=13是回车
		$("#example_filter input").focus();
		$("#example_filter input").trigger(e);//模拟页码框按下回车
	});
});



function initTable() {
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
	    "sAjaxSource": dataUrl + 'ajax/rfqinfo.ashx?action=read&companyId=' + companyID + '&userId=' + userID + '&typeId=1'+"&type="+type,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[5, "desc"]],
		"aoColumns": [{
		        "mDataProp": "rfq_state",
		        "mRender": function (data, type, full) {
		            var stateText = '未分配',actionUser='',actionTime=''
		            if (full.rfq_state == 1) { $("td:first").css("background-color", "yellow"); stateText = '未分配', actionUser = '（添加人）', actionTime = '（添加时间）' }
		            else if (full.rfq_state == 2) { stateText = '已分配', actionUser = '（分配人）', actionTime = '（分配时间）' }
		            else if (full.rfq_state == 3) { $("td:first").css("background-color", "#CC66CC"); stateText = '已关闭', actionUser = '（关闭人）', actionTime = '（关闭时间）' }
		            else if (full.rfq_state == 4) { stateText = '已转换', actionUser = '（转换人）', actionTime = '（转换时间）' }
		            var _html = '<strong><a class="getStatuName" href="#">' + stateText + "</a></strong></br> " + full.actionUser + actionUser + "</br> " + full.rfq_actionTime.substring(0, 10) + actionTime
		            if (full.rfq_state == 2) { _html = _html + '<br/>' + full.distribute_name + '（被分配人）' }
		            return (_html);
		         }
		    },
            {
                "mDataProp": "rfq_id",
                "mRender": function (data, type, full) {
                    return ('<strong>' + full.rfq_contactCountry + " / " + full.rfq_contactCompany + "</strong></br> " + full.rfq_contact + "</br> " + full.rfq_contactPhone + "</br> " + full.rfq_contactEmail);
                }
            },
    	    {
    	        "mDataProp": "rfq_id",
    	        "mRender": function (data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
    	            return (full.rfq_port1 + " <i class='fa fa-long-arrow-right'></i> " + full.rfq_port2 + "</br> <strong>" + full.rfq_incoterm + "</strong>")
    	        }
    	    },
    	    {
    	        "mDataProp": "rfq_id",
    	        "mRender": function (data, type, full) {
    	            return (full.rfq_movementType + " / " + full.rfq_goodsNum.replace(/ /, 'X') + "</br>" + full.rfq_weight.replace(/ /, '') + ", " + full.rfq_volume.replace(/ /, '') + ", " + full.rfq_package.replace(/ /, ''))
    	        }			    
    	    },
            {
                "mDataProp": "rfq_id",
            	"mRender": function (data, type, full) { 
            	    return (full.rfq_goods + "<br>HSCODE: " + full.rfq_customsCode + "<br><a href='javascript:void(0);'  onclick='_remarkFun(\"" + full.rfq_remark + "\")'>备注</a>")
            	}
            },
    	    {
    	        "mDataProp": "rfq_okTime",
    	        "mRender": function (data, type, full) {
    	            if (full.rfq_okTime != null) {
    	                return  full.rfq_okTime.substring(0, 10);
    	            } else {
    	                return "";
    	            }
    	        }
    	    },
    	    {
    	        "mDataProp": "rfq_id",
    	        "createdCell": function (td, cellData, rowData, row, col) {
    	            // $(td).html("<a href='localchargeadd.html?action=modify&Id="+cellData +"'> " + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
    	            //  .append("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a><br/>");
    	            // $(td).html("<div class='btn-group'><a class='btn btn-blue btn-sm' href='bookingadd.html?action=modify&Id=" + cellData + "'> " + ((rowData.book_state==1)?get_lan('edit'):(get_lan('review'))) + "</a>"
    	            //     +"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
    	            //     +"<ul class='dropdown-menu dropdown-azure'>"
    	            //     +"<li><a href='billoflading.html?code="+rowData.book_code+"'>" + get_lan('con_top_4') + "</a></li>"
    	            //     +"<li class='divider'></li>"
    	            //     +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + ((rowData.book_state==1)?get_lan('delete'):"") + "</a></li>"
    	            //     +"</ul></div>")
    	            $(td).html(function (n) {  //让.HTML使用函数 20190831 by daniel
    	                var _thisHtml_head = '', _thisHtml_middle = '';
    	                if (rowData.rfq_state == 1) {
    	                    if (type == 'my') {
    	                        _thisHtml_head = '<div class="btn-group" style="z-index:auto; width:90px;"><a class="btn btn-blue btn-sm" href="javascript:void(0);" onclick="_sureFun(' + rowData.rfq_id + ')">分配询盘</a>';
    	                        _thisHtml_middle = "<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                                + "<ul class='dropdown-menu dropdown-azure' style='right: 0; left: auto; text-align: right; min-width: 120px;'>"
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',1)">回收询盘</a></li>'
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',3)">关闭询盘</a></li>'
    	                    } else if (type == 'company') {
    	                        _thisHtml_head = '<div class="btn-group" style="z-index:auto; width:90px;"><a class="btn btn-blue btn-sm" href="javascript:void(0);" onclick="_applyFun(' + rowData.rfq_id + ')">申请询盘</a>';
    	                        _thisHtml_middle = "<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                                + "<ul>"
    	                    }

    	                } else if (rowData.rfq_state == 2) {
    	                    if (type == 'my') {
    	                        _thisHtml_head = '<div class="btn-group" style="z-index:auto; width:90px;"><a class="btn btn-blue btn-sm" href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',1)">回收询盘</a>';
    	                        _thisHtml_middle = "<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                                + "<ul class='dropdown-menu dropdown-azure' style='right: 0; left: auto; text-align: right; min-width: 120px;'>"
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',3)">关闭询盘</a></li>'
    	                    } else if (type == 'company') {
    	                        _thisHtml_head = '<div class="btn-group" style="z-index:auto; width:90px;"><a class="btn btn-blue btn-sm" href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',4)">转化客户</a>';
    	                        _thisHtml_middle = "<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                                + "<ul class='dropdown-menu dropdown-azure' style='right: 0; left: auto; text-align: right; min-width: 120px;'>"
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',1)">回收询盘</a></li>'
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',3)">关闭询盘</a></li>'
    	                    }
    	                } else if (rowData.rfq_state == 3) {
    	                    if (type == 'my') {
    	                        _thisHtml_head = '<div class="btn-group" style="z-index:auto; width:90px;"><a class="btn btn-blue btn-sm" href="javascript:void(0);" onclick="_sureFun(' + rowData.rfq_id + ')">分配询盘</a>';
    	                        _thisHtml_middle = "<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
                                + "<ul class='dropdown-menu dropdown-azure' style='right: 0; left: auto; text-align: right; min-width: 120px;'>"
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',1)">回收询盘</a></li>'
                                + '<li><a href="javascript:void(0);" onclick="_changeFun(' + rowData.rfq_id + ',3)">关闭询盘</a></li>'
    	                    }
    	                }

    	                var _thisHtml_end = "</ul></div>";

    	                return (_thisHtml_head + _thisHtml_middle + _thisHtml_end);

    	            })
    	            // $(td).html("<div class='btn-group'><a class='btn btn-sm dropdown-toggle' data-toggle='dropdown'>Action <i class='fa fa-angle-down'></i></a>"
    	            //              +"<ul class='dropdown-menu dropdown-azure'>"
    	            //              +"<li><a href='bookingadd.html?action=modify&Id=" + cellData + "'> " + ((rowData.book_state==1)?get_lan('edit'):(get_lan('review'))) + "</a></li>"
    	            //              +"<li><a href='billoflading.html?code="+rowData.book_code+"'>" + get_lan('con_top_4') + "</a></li>"
    	            //              +"<li class='divider'></li>"
    	            //              +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + ((rowData.book_state==1)?get_lan('delete'):"") + "</a></li>"
    	            //              +"</ul></div>")
    	            // 这里修改了列表的操作样式 by daniel 20190803


    	        }
    	    },
		],
		"aoColumnDefs":[//设置列的属性，此处设置第一列不排序
            {"bSortable": false, "aTargets": [0,1,2,3,4]}
        ],
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
		"drawCallback": function(){
			$('[data-toggle="tooltip"]').tooltip();
		}
	})

	return table;
}

function _sureFun(id) {
    rfqId = id
    $("#myModalAssignRfq").modal("show");
    $("#AssignList").empty()
    common.ajax_req("get", true, dataUrl, "rfqinfo.ashx?action=readDistribute", {
        "rfqInfoId": id
    }, function (data) {
        //console.log(data.Data)
        if (data.State == 1) {
            var _data = data.Data;
            for (var i = 0; i < _data.length; i++) {
                //var trailerlist = '<div style="margin: 5px 0px;">' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;地址：' + _data[i].botr_address + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].botr_contact + '&nbsp;&nbsp;&nbsp;&nbsp;联系方式：' + _data[i].botr_contactWay + '&nbsp;&nbsp;&nbsp;&nbsp;时间：' + _data[i].botr_time + '&nbsp;&nbsp;&nbsp;&nbsp;柜型：' + _data[i].botr_container + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteTrailer" artiid="' + _data[i].botr_id + '">删除</a></div>'
                var trailerlist = '<tr><td> ' + _data[i].usin_name + '</td><td> ' + _data[i].rfqdis_time.substring(0, 10) + '</td><td><a href="javascript:void(0);" class="selectTrailer" artiid="' + _data[i].rfqdis_id + '">确认</a></td></tr>'
                $("#AssignList").append(trailerlist)
            }
        }

        /*选择*/
        $('.selectTrailer').on('click', function () {
            console.log($(this).attr('artiid'))
            var parm = {
                'Id': $(this).attr('artiid'),
                'userId': userID
            }
            common.ajax_req('POST', false, dataUrl, 'rfqinfo.ashx?action=modifyDistribute', parm, function (data) {
                if (data.State == 1) {
                    $("#myModalAssignRfq").modal("hide");
                    comModel("确认分配成功")
                    //location.reload();
                    oTable.fnReloadAjax(oTable.fnSettings());
                } else {
                    $("#myModalAssignRfq").modal("hide");
                    comModel("确认分配失败")
                    //oTable.fnReloadAjax(oTable.fnSettings());
                }
            }, function (error) {
                console.log(parm)
            }, 1000)
        })

    }, function (err) {
        console.log(err)
    }, 2000)

    $('#btnSave').on('click', function () {
        var parm = {
            'rfqInfoId': rfqId,
            'distributeId': $('#sellId').val(),
            'userId': userID,
            'remark': $('#beizhu').val(),
            'state': 2,
        }
        //console.log(parm)
        common.ajax_req('POST', false, dataUrl, 'rfqinfo.ashx?action=newDistribute', parm, function (data) {
            if (data.State == 1) {
                $("#myModalAssignRfq").modal("hide");
                comModel("确认分配成功")
                oTable.fnReloadAjax(oTable.fnSettings());
            } else {
                $("#myModalAssignRfq").modal("hide");
                comModel("确认分配失败")
                //oTable.fnReloadAjax(oTable.fnSettings());
            }
        }, function (error) {
            console.log(parm)
        }, 1000)
    });

};

function _changeFun(id, state) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/rfqinfo.ashx?action=modify',
                data: {
                    'Id': id,
                    'userId': userID,
                    'state': state,
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        oTable.fnReloadAjax(oTable.fnSettings());
                        if (state == 4) {
                            $("#myModalTurnToClient").modal("show");
                        } else {
                            comModel("处理成功")
                        }
                        
                    } else {
                        comModel("处理失败")
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
    //$("#myModalWraningApply").modal("show");
    //$('#btnSave0').on('click', function () {
    //    var parm = {
    //        'Id': id,
    //        'userId': userID,
    //        'state': state,
    //    }
    //    //console.log(parm)
    //    common.ajax_req('POST', false, dataUrl, 'rfqinfo.ashx?action=modify', parm, function (data) {
    //        if (data.State == 1) {
    //            $("#myModalWraningApply").modal("hide");
    //            comModel("处理成功")
    //            oTable.fnReloadAjax(oTable.fnSettings());
    //            //location.reload();
    //        } else {
    //            $("#myModalWraningApply").modal("hide");
    //            comModel("处理失败")
    //            //oTable.fnReloadAjax(oTable.fnSettings());
    //        }
    //    }, function (error) {
    //        console.log(parm)
    //    }, 1000)
    //});

};

function _applyFun(id) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            $.ajax({
                url: dataUrl + 'ajax/rfqinfo.ashx?action=newDistribute',
                data: {
                    'rfqInfoId': id,
                    'distributeId': userID,
                    'userId': userID,
                    'state': 1,
                },
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        //comModel("申请成功")
                        $("#myModalSuccessApply").modal("show");
                        oTable.fnReloadAjax(oTable.fnSettings());
                    } else {
                        comModel("申请失败")
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

};

function _remarkFun(remark) {
    $("#myModalRemark").modal("show");
    $("#remark").html(remark);
};


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

