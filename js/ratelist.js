//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "运价管理中心",   
            "con_top_3" : "运价列表", 
            "con_top_4" : "确认订舱", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Rates MANAGEMENT",   
            "con_top_3" : "Rate List",    
            "con_top_4" : "Confirm Booking", 
        };

var fromId = 'FCL';
if(GetQueryString('fromId')!=null){
	fromId=GetQueryString('fromId')
}

$('.rate1').addClass("active")

var oTable;

$(document).ready(function() {
    hasPermission('1401'); //权限控制：查看运价列表
	this.title = get_lan('con_top_3') 
	$('.navli4').addClass("active open")	
	$('#title1').text(get_lan('con_top_3'))
	
	$('#newRateButton').on('click', function() {
		location.href = 'rateadd.html';
	})
	$('#uploadRateButton').on('click', function () {
	    location.href = 'fileinput.html?action=rate';
	});
	
	// $('input.column_filter').on( 'keyup click', function () {
	// 	//alert($(this).attr('data-column'));
 //        filterColumn( $(this).attr('data-column') );
 //    });
    //复制费用，如果增加了币种的话，要重新调整 20190829, by daniel
	var clipboard = new ClipboardJS('.copyOcf',{ 
		text: function(e) {
			var _eId=$(e).attr("id");
				var _ports= $("#"+_eId).parents('tr').find("td:eq(0)").html().replace('<i class="fa fa-long-arrow-right"></i><br>', "TO")+": ";
			if(fromId=='FCL'){   
				var _20gpFee = $("#"+_eId).parents('tr').find("td:eq(2)").html()+"/20GP, ";
				var _40gpFee = $("#"+_eId).parents('tr').find("td:eq(3)").html()+"/40GP, ";
				var _40hqFee = $("#"+_eId).parents('tr').find("td:eq(4)").html()+"/40HQ, ";
				var _carrier = "by "+$("#"+_eId).parents('tr').find("td:eq(5)").text()+", ";
				var _remark = "\nRemark:"+$("#"+_eId).parents('tr').find("td:eq(10)").html().replace('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="" data-content="', "").replace('" data-original-title="Remark:"><i class="fa fa-comment"></i></a>', "");
				var _valid = "validity from "+$("#"+_eId).parents('tr').find("td:eq(9)").html().replace('<br>', " to ");
				var _copyAllfee= _ports 
								+ (($("#"+_eId).parents('tr').find("td:eq(2)").html())!=""?_20gpFee:"")
								+(($("#"+_eId).parents('tr').find("td:eq(3)").html())!=""?_40gpFee:"")
								+(($("#"+_eId).parents('tr').find("td:eq(4)").html())!=""?_40hqFee:"")
								+(($("#"+_eId).parents('tr').find("td:eq(5)").text())!=""?_carrier:"")
								+_valid
								+(($("#"+_eId).parents('tr').find("td:eq(10)").html())!=""?_remark:"");
			}else if(fromId=='LCL'){
				var _lclFee = $("#"+_eId).parents('tr').find("td:eq(2)").html()+"/RT, ";
				var _etd = "ETD is "+$("#"+_eId).parents('tr').find("td:eq(4)").text()+", ";
				var _remark = "\nRemark:"+$("#"+_eId).parents('tr').find("td:eq(8)").html().replace('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="" data-content="', "").replace('" data-original-title="Remark:"><i class="fa fa-comment"></i></a>', "");
				var _valid = "validity from "+$("#"+_eId).parents('tr').find("td:eq(7)").html().replace('<br>', " to ");
				var _copyAllfee= _ports 
								+ (($("#"+_eId).parents('tr').find("td:eq(2)").html())!=""?_lclFee:"")
								+(($("#"+_eId).parents('tr').find("td:eq(4)").text())!=""?_etd:"")
								+_valid
								+(($("#"+_eId).parents('tr').find("td:eq(8)").html())!=""?_remark:"");
			}else if(fromId=='AIR'){
				var _air45Fee = $("#"+_eId).parents('tr').find("td:eq(2)").html()+"/KGS, ";
				var _air100Fee = $("#"+_eId).parents('tr').find("td:eq(3)").html()+"/KGS, ";
				var _air500Fee = $("#"+_eId).parents('tr').find("td:eq(4)").html()+"/KGS, ";
				var _air1000Fee = $("#"+_eId).parents('tr').find("td:eq(5)").html()+"/KGS, ";
				var _carrier = "by "+$("#"+_eId).parents('tr').find("td:eq(6)").text()+", ";
				var _etd = "ETD is "+$("#"+_eId).parents('tr').find("td:eq(7)").text()+", ";
				var _direct = ($("#"+_eId).parents('tr').find("td:eq(8)").text()==""?"Direct, ":("Via "+$("#"+_eId).parents('tr').find("td:eq(9)").text()+", "));
				var _remark = "\nRemark:"+$("#"+_eId).parents('tr').find("td:eq(11)").html().replace('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="" data-content="', "").replace('" data-original-title="Remark:"><i class="fa fa-comment"></i></a>', "");
				var _valid = "validity from "+$("#"+_eId).parents('tr').find("td:eq(9)").html().replace('<br>', " to ");
				var _copyAllfee= _ports 
								+ (($("#"+_eId).parents('tr').find("td:eq(2)").html())!=""?_air45Fee:"") 
								+ (($("#"+_eId).parents('tr').find("td:eq(3)").html())!=""?_air100Fee:"") 
								+ (($("#"+_eId).parents('tr').find("td:eq(4)").html())!=""?_air500Fee:"") 
								+ (($("#"+_eId).parents('tr').find("td:eq(5)").html())!=""?_air1000Fee:"")
								+(($("#"+_eId).parents('tr').find("td:eq(6)").text())!=""?_carrier:"")
								+(($("#"+_eId).parents('tr').find("td:eq(7)").text())!=""?_etd:"")
								+_valid
								+(($("#"+_eId).parents('tr').find("td:eq(11)").html())!=""?_remark:"");
			}
			//alert(_copyTruckfeeAll);
			$("#copyFeeAll").text(_copyAllfee);
            return $("#copyFeeAll").text();
        }
	});

	clipboard.on('success', function(e) {
	    Notify('Freight have been copied.', 'bottom-right', '5000', 'success', 'fa-check', true);
	    e.clearSelection();
	});

	clipboard.on('error', function(e) {
	    Notify('Freight have not been copied.', 'bottom-right', '5000', 'warning', 'fa-check', true);
	});

//修改成点击搜索才出现的了，如果没有填，点击搜索也会出现的，就是搜索日期内没有完成，不晓得这样是否会对服务器造成一定的影响。 20190822 by daniel
	$('#submit_search').on('click', function () {
	    if ($('#example').hasClass('dataTable')) {
	    	var　dttable = $('#example').dataTable();
	    　　dttable.fnClearTable(); //清空一下table
	        dttable.fnDestroy(); //还原初始化了的datatable
	    }
	    var port1 = $('#pol_search').val();
	    var port2 = $('#pod_search').val();
	    var usertime = $('#valid_search').val();
	    oTable = initTable(fromId, port1, port2, usertime);
		//if ($('#example').hasClass('dataTable')) {
		//	var　dttable = $('#example').dataTable();
		//　　dttable.fnClearTable(); //清空一下table
		//dttable.fnDestroy(); //还原初始化了的datatable
		//}
		//oTable=initTable(fromId);
        //filterColumn( $(this).attr('data-column') );
        //// _arr=("2019-08-06<br>2019-08-31").split("<br>")
        //// alert(parseInt(_arr[1].replace(/\-/g,""))+1)
    });

	//运输方式
	common.ajax_req('GET', true, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 7,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		for(var i = 0; i < 3; i++) {
			var _html = '<option value="' + _data[i].puda_name_en + '">' + _data[i].puda_name_en + '</option>';
			$('#movementType').append(_html)
		}
		
		$("#movementType").val(fromId)
		
	}, function(error) {
		//console.log(parm)
	}, 1000)
	$("#movementType").change(function() {
		var opt = $("#movementType").val();
		location.href='ratelist.html?fromId='+opt
	})
	
	
});


/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable(fromId,port1,port2,usetime) {
    var ajaxUrl, tableTitle, columns
    if(fromId=='FCL'){   
        ajaxUrl = dataUrl + 'ajax/rate.ashx?action=read&companyId=' + companyID + '&port1=' + port1 + '&port2=' + port2 + '&usetime=' + usetime + '&movementType=FCL'
        console.log(ajaxUrl)
    	tableTitle = '<th>企业</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>20\'GP</th><th>40\'GP</th><th>40\'HQ</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
        columns = [
			{
			    "mDataProp": "comp_code",
			    "createdCell": function (td, cellData, rowData, row, col) {
			        if (cellData) {
			            $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
			        }
			    }
			},
			{ "mDataProp": "rate_port1",
				"mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   return (full.rate_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.rate_port2)
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
			{ "mDataProp": "rate_time2",
				"createdCell": function (td, cellData, rowData, row, col) {
					if(rowData.rate_time1!=null){
						$(td).html(rowData.rate_time1.substring(0, 10)+'<br/>'+rowData.rate_time2.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},		
			{ "mDataProp": "rate_beizhu",
				"createdCell": function (td, cellData, rowData, row, col) { //备注使用了图标的popover的功能，能节省空间。 by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
			},
			{
				"mDataProp": "rate_id",
				"createdCell": function (td, cellData, rowData, row, col) {
	    			$(td).html("<div class='btn-group' style='z-index:auto; width:70px;'><button class='btn btn-blue btn-sm copyOcf' id='Ocf_"+cellData +"' data-clipboard-target='#copyFeeAll'> " + get_lan('copyitem') + "</button>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a><li>"
	                    +"</ul></div>")		
					//$(td).html("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")										
				}
			},
		]
		,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
			//{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,8,5,6,7,10,11]}
        ]
        ,_aaSorting=[[9, 'desc']]

   }else if(fromId=='LCL'){
   		ajaxUrl = dataUrl + 'ajax/rate.ashx?action=read&companyId=' + companyID + '&movementType=LCL'
   		tableTitle = '<th>企业</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>价格(USD/RT)</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
       columns = [
                            			{
                            			    "mDataProp": "comp_code",
                            			    "createdCell": function (td, cellData, rowData, row, col) {
                            			        if (cellData) {
                            			            $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                            			        }
                            			    }
                            			},
			{ "mDataProp": "rate_port1",
				"mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   return (full.rate_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.rate_port2)
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
					if(rowData.rate_time1!=null){
						$(td).html(rowData.rate_time1.substring(0, 10)+'<br/>'+rowData.rate_time2.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},		
			{ "mDataProp": "rate_beizhu",
				"createdCell": function (td, cellData, rowData, row, col) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
			},
			{
				"mDataProp": "rate_id",
				"createdCell": function (td, cellData, rowData, row, col) {
	    			$(td).html("<div class='btn-group' style='z-index:auto; width:70px;'><button class='btn btn-blue btn-sm copyOcf' id='Ocf_"+cellData +"' data-clipboard-target='#copyFeeAll'> " + get_lan('copyitem') + "</button>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a><li>"
	                    +"</ul></div>")		
					//$(td).html("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")										
				}
			},  		
    	]
		,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
			//{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,3,4,5,6,8,9]}
        ]
        ,_aaSorting=[[7, 'desc']]
    	
   }else if(fromId=='AIR'){
   		ajaxUrl=dataUrl+'ajax/rate.ashx?action=read&companyId='+companyID+'&movementType=AIR'
   		tableTitle = '<th>企业</th><th>起运港 <i class="fa fa-long-arrow-right"></i> 目的港</th><th>45+(kgs)</th><th>100+(kgs)</th><th>500+(kgs)</th><th>1000+(kgs)</th><th>承运人</th><th>航期</th><th>航程</th><th>中转</th><th>有效期</th><th>备注</th><th>操作</th>'
    	$('.tableTitle').html(tableTitle)
       columns = [
                                       			{
                                       			    "mDataProp": "comp_code",
                                       			    "createdCell": function (td, cellData, rowData, row, col) {
                                       			        if (cellData) {
                                       			            $(td).html('<a href="javascript:void(0);" data-placement="top" data-toggle="popover" data-content="' + rowData.comp_name + '">' + cellData + '</a>');
                                       			        }
                                       			    }
                                       			},
			{ "mDataProp": "rate_port1",
				"mRender" : function(data, type, full) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   return (full.rate_port1 +" <i class='fa fa-long-arrow-right'></i></br> "+ full.rate_port2)
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
					if(rowData.rate_time1!=null){
						$(td).html(rowData.rate_time1.substring(0, 10)+'<br/>'+rowData.rate_time2.substring(0, 10));
					}else{
						$(td).html("NULL");
					}
				}			
			},		
			{ "mDataProp": "rate_beizhu",
				"createdCell": function (td, cellData, rowData, row, col) { //修改pol和pod在同一个表格的td里面，并且使用mRender可以实现表格里面搜索，by daniel 20190803
                   if(cellData){
                   	$(td).html('<a href="javascript:void(0);" class="btn btn-sm" data-placement="left" data-toggle="popover" title="Remark:" data-content="'+cellData+'"><i class="fa fa-comment"></i></a>');
                   }
                }
			},
			{
				"mDataProp": "rate_id",
				"createdCell": function (td, cellData, rowData, row, col) {
	    			$(td).html("<div class='btn-group' style='z-index:auto; width:70px;'><button class='btn btn-blue btn-sm copyOcf' id='Ocf_"+cellData +"' data-clipboard-target='#copyFeeAll'> " + get_lan('copyitem') + "</button>"
	    				+"<a class='btn btn-blue btn-sm dropdown-toggle' data-toggle='dropdown' href='javascript:void(0);'><i class='fa fa-angle-down'></i></a>"
	                    +"<ul class='dropdown-menu dropdown-azure'>"
	                    +"<li><a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a></li>"
	                    +"<li><a href='bookingadd.html?action=add&Id=" + cellData + "'>生成报价单</a><li>"
	                    +"</ul></div>")		
					//$(td).html("<a href='javascript:void(0);' onclick='_deleteFun(" + cellData + ")'>" + get_lan('delete') + "</a>")										
				}
			},
		]
		,aoColumnDefs=[//设置列的属性，此处设置第一列不排序
			//{"orderable": false, "targets":[0,1,6,7,8,10,11]},
            {"bSortable": false, "aTargets": [0,1,6,7,8,9,11,12]}
        ]
        ,_aaSorting=[[10, 'desc']]
    }
    
	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		//"searching": false, //去掉搜索框 
		"sAjaxSource": ajaxUrl,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bLengthChange":false,
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
		"drawCallback": function(){
			$('[data-toggle="popover"]').popover();
		}
	});

	return table;
}

//function filterColumn(i) {
//    console.log(i)
//	var _search_value=$('#pol_search').val()+" "+$('#pod_search').val();
//    $('#example').DataTable().column( i ).search(
//        _search_value,
//        $('#pod_search').val(),
//        alert($('#pol_search').val())
//    ).draw();
//}
 
 
/**
 * 删除
 * @param id
 * @private
 */
 function _deleteFun(id) {
 	bootbox.confirm("Are you sure?", function(result) {
 		if(result) {
 			$.ajax({
 				url: dataUrl + 'ajax/rate.ashx?action=cancel',
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
//搜索时间在时间input小的。
//$.fn.dataTableExt.afnFiltering.push(
//    function( settings, data, dataIndex ) {
//        var createdAt = $("#valid_search").val(); // Our date column in the table
        
//        if(fromId=='FCL'){  
//        	var dateRange = data[8] || 0; // Our date column in the table
//	    }else if(fromId=='LCL'){
//	    	var dateRange = data[6] || 0; // Our date column in the table
//	   	}else if(fromId=='AIR'){
//	   		var dateRange = data[9] || 0; // Our date column in the table
//	   	}
//        dateRange_val=dateRange.substring(0, 10);
//        var max  = parseInt(dateRange_val.replace(/\-/g,""))+1;
//        var _searchTime=parseInt(createdAt.replace(/\-/g,""));
//        if (max>_searchTime) {
//        	return true;
//        }else{
//        	return false;
//        }
//    }
//);

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