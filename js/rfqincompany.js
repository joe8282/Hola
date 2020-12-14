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
	    //"sAjaxSource": dataUrl + 'ajax/crmcompany.ashx?action=read&companyId=' + companyID + '&userId=' + userID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": true,
		"aaSorting": [[ 5, "desc" ]],
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

