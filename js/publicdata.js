//语言包

var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "基础数据管理",            
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Warehouse Management",        
        };

var oTable;
var typeId;
$(document).ready(function() {
//	initModal();
	$('.navli1').addClass("active open")
	
    var tableTitle
	typeId = GetQueryString('typeId')
	if(typeId==1){
		this.title = get_lan('nav_1_1')
		$('#title1').text(get_lan('nav_1_1'))
		$('#title2').text(get_lan('nav_1_1'))
		$('.typeId1').addClass("active")
		tableTitle='<th>Air Line Code</th><th>Air Line English</th><th>Air Line Chinese</th><th>Operation</th>'
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_1'))
        $('#countryEn').hide()
        $('#countryCn').hide()
        $('#inputCode').attr("placeholder","Air Line Code")
        $('#inputNameEn').attr("placeholder","Air Line English")
        $('#inputNameCn').attr("placeholder","Air Line Chinese")		
	}else if(typeId==11){
		this.title = get_lan('nav_1_11')
		$('#title1').text(get_lan('nav_1_11'))
		$('#title2').text(get_lan('nav_1_11'))
		$('.typeId11').addClass("active")
//		tableTitle='<th style="width:15px"><input type="checkbox" id="checkAll"></th><th>Carrier Code</th><th>Carrier English</th><th>Carrier Chinese</th><th>Operation</th>'
		tableTitle='<th>Carrier Code</th><th>Carrier English</th><th>Carrier Chinese</th><th>Operation</th>'
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_11'))
        $('#countryEn').hide()
        $('#countryCn').hide()
        $('#inputCode').attr("placeholder","Carrier Code")
        $('#inputNameEn').attr("placeholder","Carrier English")
        $('#inputNameCn').attr("placeholder","Carrier Chinese")		
	}else if(typeId==2){		
		this.title = get_lan('nav_1_2')
		$('#title1').text(get_lan('nav_1_2'))
		$('#title2').text(get_lan('nav_1_2'))
		$('.typeId2').addClass("active")
		tableTitle='<th>Port Chinese</th><th>Port English</th><th>Country Chinese</th><th>Country English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_2'))
        $('#code').hide()
        $('#inputNameEn').attr("placeholder","Port English")
        $('#inputNameCn').attr("placeholder","Port Chinese")
        $('#inputCountryEn').attr("placeholder","Country English")
        $('#inputCountryCn').attr("placeholder","Country Chinese")       
	}else if(typeId==3){
		this.title = get_lan('nav_1_3')
		$('#title1').text(get_lan('nav_1_3'))
		$('#title2').text(get_lan('nav_1_3'))
		$('.typeId3').addClass("active")
		tableTitle='<th>Incoterms Chinese</th><th>Incoterms English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_3'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Incoterms English")
        $('#inputNameCn').attr("placeholder","Incoterms Chinese")	
	}else if(typeId==4){
		this.title = get_lan('nav_1_4')
		$('#title1').text(get_lan('nav_1_4'))
		$('#title2').text(get_lan('nav_1_4'))
		$('.typeId4').addClass("active")
		tableTitle='<th>Container Type</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_4'))
		$('#code').hide()
		$('#nameCn').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Container Typ")	
	}else if(typeId==5){
		this.title = get_lan('nav_1_5')
		$('#title1').text(get_lan('nav_1_5'))
		$('#title2').text(get_lan('nav_1_5'))
		$('.typeId5').addClass("active")
		tableTitle='<th>Port Chinese</th><th>Port English</th><th>Country Chinese</th><th>Country English</th><th>Air Port Code</th><th>Operation</th>'		
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_5'))
        $('#inputCode').attr("placeholder","Air Port Code")
        $('#inputNameEn').attr("placeholder","Port English")
        $('#inputNameCn').attr("placeholder","Port Chinese")
        $('#inputCountryEn').attr("placeholder","Country English")
        $('#inputCountryCn').attr("placeholder","Country Chinese")  		
	}else if(typeId==6){
		this.title = get_lan('nav_1_6')
		$('#title1').text(get_lan('nav_1_6'))
		$('#title2').text(get_lan('nav_1_6'))
		$('.typeId6').addClass("active")
		tableTitle='<th>Charge Item Chinese</th><th>Charge Item English</th><th>Operation</th>'		
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_6'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Charge Item English")
        $('#inputNameCn').attr("placeholder","Charge Item Chinese")
	}else if(typeId==7){
		this.title = get_lan('nav_1_7')
		$('#title1').text(get_lan('nav_1_7'))
		$('#title2').text(get_lan('nav_1_7'))
		$('.typeId7').addClass("active")
		tableTitle='<th>Movement Type Chinese</th><th>Movement Type English</th><th>Operation</th>'		
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_7'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Movement Type English")
        $('#inputNameCn').attr("placeholder","Movement Type Chinese")		
	}else if(typeId==8){
		this.title = get_lan('nav_1_8')
		$('#title1').text(get_lan('nav_1_8'))
		$('#title2').text(get_lan('nav_1_8'))
		$('.typeId8').addClass("active")
		tableTitle='<th>Weight Unit Chinese</th><th>Weight Unit English</th><th>Operation</th>'		
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_8'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Weight Unit English")
        $('#inputNameCn').attr("placeholder","Weight Unit Chinese")		
	}else if(typeId==9){
		this.title = get_lan('nav_1_9')
		$('#title1').text(get_lan('nav_1_9'))
		$('#title2').text(get_lan('nav_1_9'))
		$('.typeId9').addClass("active")
		tableTitle='<th>Volume Unit Chinese</th><th>Volume Unit English</th><th>Operation</th>'		
		$('.tableTitle').html(tableTitle)

		$('#mySmallModalLabel').text(get_lan('nav_1_9'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Volume Unit English")
        $('#inputNameCn').attr("placeholder","Volume Unit Chinese")
	}else if(typeId==10){
		this.title = get_lan('nav_1_10')
		$('#title1').text(get_lan('nav_1_10'))
		$('#title2').text(get_lan('nav_1_10'))
		$('.typeId10').addClass("active")
		tableTitle='<th>Package Unit Chinese</th><th>Package Unit English</th><th>Operation</th>'		
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_10'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Package Unit English")
        $('#inputNameCn').attr("placeholder","Package Unit Chinese")
	}else if(typeId==12){
		this.title = get_lan('nav_1_12')
		$('#title1').text(get_lan('nav_1_12'))
		$('#title2').text(get_lan('nav_1_12'))
		$('.typeId12').addClass("active")
		tableTitle='<th>BL Type Chinese</th><th>BL Type English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_12'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","BL Type English")
        $('#inputNameCn').attr("placeholder","BL Type Chinese")
	}else if(typeId==13){
		this.title = get_lan('nav_1_13')
		$('#title1').text(get_lan('nav_1_13'))
		$('#title2').text(get_lan('nav_1_13'))
		$('.typeId13').addClass("active")
		tableTitle='<th>Currency Chinese</th><th>Currency English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_13'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Currency English")
        $('#inputNameCn').attr("placeholder","Currency Chinese")	 
	}else if(typeId==14){
		this.title = get_lan('nav_1_14')
		$('#title1').text(get_lan('nav_1_14'))
		$('#title2').text(get_lan('nav_1_14'))
		$('.typeId14').addClass("active")
		tableTitle='<th>Follow Way Chinese</th><th>Follow Way English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_14'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Follow Way English")
        $('#inputNameCn').attr("placeholder","Follow Way Chinese")
	}else if(typeId==15){
		this.title = get_lan('nav_1_15')
		$('#title1').text(get_lan('nav_1_15'))
		$('#title2').text(get_lan('nav_1_15'))
		$('.typeId15').addClass("active")
		tableTitle='<th>Email Type Chinese</th><th>Email Type English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_15'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Email Type English")
        $('#inputNameCn').attr("placeholder","Email Type Chinese")	        
	}else if(typeId==16){
		this.title = get_lan('nav_1_16')
		$('#title1').text(get_lan('nav_1_16'))
		$('#title2').text(get_lan('nav_1_16'))
		$('.typeId16').addClass("active")
		tableTitle='<th>Company Type Chinese</th><th>Company Type English</th><th>Operation</th>'	
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_16'))
		$('#code').hide()
        $('#countryEn').hide()
        $('#countryCn').hide()		
        $('#inputNameEn').attr("placeholder","Company Type English")
        $('#inputNameCn').attr("placeholder","Company Type Chinese")	        
	}else if(typeId==17){
		this.title = get_lan('nav_1_17')
		$('#title1').text(get_lan('nav_1_17'))
		$('#title2').text(get_lan('nav_1_17'))
		$('.typeId17').addClass("active")
		tableTitle='<th>Expense Item Code</th><th>Expense Item English</th><th>Expense Item Local Languges</th><th>Operation</th>'
		$('.tableTitle').html(tableTitle)
		
		$('#mySmallModalLabel').text(get_lan('nav_1_17'))
        $('#countryEn').hide()
        $('#countryCn').hide()
        $('#inputCode').attr("placeholder","Expense Item Code")
        $('#inputNameEn').attr("placeholder","Expense Item English")
        $('#inputNameCn').attr("placeholder","Expense Item Local Languges")		
	}

	oTable = initTable();
	$("#btnEdit").hide();
	$("#btnSave").click(_addFun);
	$("#btnEdit").click(_editFunAjax);
	$("#deleteFun").click(_deleteList);
	//checkbox全选
//	$("#checkAll").live("click", function () {
//	    if ($(this).attr("checked") === "checked") {
//	        $("input[name='checkList']").attr("checked", $(this).attr("checked"));
//	    } else {
//	        $("input[name='checkList']").attr("checked", false);
//	    }
//	});	
	$("#checkAll").on("click", function() {
      var xz = $(this).prop("checked");//判断全选按钮的选中状态
      var ck = $("input[name='checkList']").prop("checked",xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
	});
});

/**
 * 表格初始化
 * @returns {*|jQuery}
 */
function initTable() {
	var columns
	if(typeId == 1||typeId == 11||typeId == 17){
		columns = [
//				{
//					"mDataProp": "puda_id",
//					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
//						$(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
//					}
//				},
			    { "mDataProp": "puda_code" },
			    { "mDataProp": "puda_name_en" },
			    { "mDataProp": "puda_name_cn" }, 	
				{
					"mDataProp": "puda_id",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						if(oData.puda_companyId==companyID || companyID==0){
							if(isPermission('1102')==1){
								$(nTd).html("<a href='javascript:void(0);' " +
										"onclick='_editFun(\"" + oData.puda_id + "\",\"" + oData.puda_name_en + "\",\"" + oData.puda_name_cn + "\",\"" + oData.puda_country_en + "\",\"" + oData.puda_country_cn + "\",\"" + oData.puda_code + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
										
							}else{
								$(nTd).html('')
							}	
							if(isPermission('1103')==1 && isPermission('1102')==1){
								$(nTd).append("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}else if(isPermission('1103')==1 && isPermission('1102')!=1){
								$(nTd).html("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}						
						}
						else{
							$(nTd).html('')
						}

					}
				},
			]		
	}	
	if(typeId == 2){
		columns = [
//				{
//					"mDataProp": "puda_id",
//					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
//						$(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
//					}
//				},
		        { "mDataProp": "puda_name_cn" },
		        { "mDataProp": "puda_name_en" },
		        { "mDataProp": "puda_country_cn" },
		        { "mDataProp": "puda_country_en" },	
				{
					"mDataProp": "puda_id",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						if(oData.puda_companyId==companyID || companyID==0){
							if(isPermission('1102')==1){
								$(nTd).html("<a href='javascript:void(0);' " +
										"onclick='_editFun(\"" + oData.puda_id + "\",\"" + oData.puda_name_en + "\",\"" + oData.puda_name_cn + "\",\"" + oData.puda_country_en + "\",\"" + oData.puda_country_cn + "\",\"" + oData.puda_code + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
										
							}else{
								$(nTd).html('')
							}	
							if(isPermission('1103')==1 && isPermission('1102')==1){
								$(nTd).append("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}else if(isPermission('1103')==1 && isPermission('1102')!=1){
								$(nTd).html("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}					
						}
						else{
							$(nTd).html('')
						}						
					}
				},
			]		
	}
	if(typeId == 3||typeId == 6||typeId == 7||typeId == 8||typeId == 9||typeId == 10||typeId == 12||typeId == 13||typeId == 14||typeId == 15||typeId == 16){
		columns = [
//				{
//					"mDataProp": "puda_id",
//					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
//						$(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
//					}
//				},
		            { "mDataProp": "puda_name_cn" },
		            { "mDataProp": "puda_name_en" },	
				{
					"mDataProp": "puda_id",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						if(oData.puda_companyId==companyID || companyID==0){

							if(isPermission('1102')==1){
								$(nTd).html("<a href='javascript:void(0);' " +
										"onclick='_editFun(\"" + oData.puda_id + "\",\"" + oData.puda_name_en + "\",\"" + oData.puda_name_cn + "\",\"" + oData.puda_country_en + "\",\"" + oData.puda_country_cn + "\",\"" + oData.puda_code + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
										
							}else{
								$(nTd).html('')
							}	
							if(isPermission('1103')==1 && isPermission('1102')==1){
								$(nTd).append("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}else if(isPermission('1103')==1 && isPermission('1102')!=1){
								$(nTd).html("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}
						}
						else{
							$(nTd).html('')
						}							
					}
				},
			]		
	}
	if(typeId == 4){
		columns = [
//				{
//					"mDataProp": "puda_id",
//					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
//						$(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
//					}
//				},
				{ "mDataProp": "puda_name_en" },
				{
					"mDataProp": "puda_id",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						if(oData.puda_companyId==companyID || companyID==0){
							if(isPermission('1102')==1){
								$(nTd).html("<a href='javascript:void(0);' " +
										"onclick='_editFun(\"" + oData.puda_id + "\",\"" + oData.puda_name_en + "\",\"" + oData.puda_name_cn + "\",\"" + oData.puda_country_en + "\",\"" + oData.puda_country_cn + "\",\"" + oData.puda_code + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
										
							}else{
								$(nTd).html('')
							}	
							if(isPermission('1103')==1 && isPermission('1102')==1){
								$(nTd).append("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}else if(isPermission('1103')==1 && isPermission('1102')!=1){
								$(nTd).html("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}
						}
						else{
							$(nTd).html('')
						}						
					}
				},
			]		
	}
	if(typeId == 5){
		columns = [
//				{
//					"mDataProp": "puda_id",
//					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
//						$(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
//					}
//				},
		            { "mDataProp": "puda_name_cn" },
		            { "mDataProp": "puda_name_en" },
		            { "mDataProp": "puda_country_cn" },
		            { "mDataProp": "puda_country_en" }, 
		            { "mDataProp": "puda_code" }, 
				{
					"mDataProp": "puda_id",
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
						if(oData.puda_companyId == companyID || companyID == 0) {
							if(isPermission('1102')==1){
								$(nTd).html("<a href='javascript:void(0);' " +
										"onclick='_editFun(\"" + oData.puda_id + "\",\"" + oData.puda_name_en + "\",\"" + oData.puda_name_cn + "\",\"" + oData.puda_country_en + "\",\"" + oData.puda_country_cn + "\",\"" + oData.puda_code + "\")'>" + get_lan('edit') + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
										
							}else{
								$(nTd).html('')
							}	
							if(isPermission('1103')==1 && isPermission('1102')==1){
								$(nTd).append("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}else if(isPermission('1103')==1 && isPermission('1102')!=1){
								$(nTd).html("<a href='javascript:void(0);' onclick='_deleteFun(" + sData + ")'>" + get_lan('delete') + "</a>");
							}
						} else {
							$(nTd).html('')
						}
					}
				},
			]		
	}

	var table = $("#example").dataTable({
		//"iDisplayLength":10,
		"sAjaxSource": dataUrl+'ajax/publicdata.ashx?action=readbytypeid&typeid='+typeId+'&companyId='+companyID,
//		'bPaginate': true,
//		"bDestory": true,
//		"bRetrieve": true,
//		"bFilter": false,
		"bSort": false,
		"aaSorting": [[ 0, "desc" ]],
//		"bProcessing": true,
		"aoColumns": columns,
		"sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
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
		"fnCreatedRow": function(nRow, aData, iDataIndex) {
			//add selected class
			$(nRow).click(function() {
				if($(this).hasClass('row_selected')) {
					$(this).removeClass('row_selected');
				} else {
					oTable.$('tr.row_selected').removeClass('row_selected');
					$(this).addClass('row_selected');
				}
			});
		},
		"fnInitComplete": function (oSettings, json) {
		    if (isPermission('1101') == 1) {
		        $('<a href="#myModal" id="addFun" class="label label-primary tooltip-darkorange" data-toggle="modal"><i class="fa fa-plus-circle"></i></a>').appendTo($('.header-buttons'));
		    }
//				'<a href="#" class="btn btn-primary" id="editFun">修改</a> ' + '&nbsp;' +
//				'<a href="#" class="btn btn-danger" id="deleteFun">'+get_lan('delete')+'</a>' + '&nbsp;')

			$("#deleteFun").click(_deleteList);
//			$("#editFun").click(_value);
			$("#addFun").click(_init);
		}
	});
	return table;
}

/**
 * 删除
 * @param id
 * @private
 */
function _deleteFun(id) {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			$.ajax({
				url: dataUrl + 'ajax/publicdata.ashx?action=cancel',
				data: {
					"Id": id,
					"companyId": companyID,					
					"typeId": typeId
				},
				dataType: "json",
				type: "post",
				success: function(backdata) {
					if(backdata.State) {
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
 * 赋值
 * @private
 */
//function _value() {
//	if(oTable.$('tr.row_selected').get(0)) {
//		$("#btnEdit").show();
//		var selected = oTable.fnGetData(oTable.$('tr.row_selected').get(0));
//		$("#inputNameEn").val(selected.puda_name_en);
//		$("#inputNameCn").val(selected.puda_name_cn);
//		$("#inputCountryEn").val(selected.puda_country_en);
//		$("#inputCountryCn").val(selected.puda_country_cn);
//		$("#inputCode").val(selected.puda_code);
////		$("#inputDate").val(selected.date);
//		$("#objectId").val(selected.puda_id);
//
//		$("#myModal").modal("show");
//		$("#btnSave").hide();
//	} else {
//		alert('请点击选择一条记录后操作。');
//	}
//}

/**
 * 编辑数据带出值
 */
function _editFun(id, nameEn, nameCn, countryEn, countryCn, code) {
	$("#inputNameEn").val(nameEn);
	$("#inputNameCn").val(nameCn);
	$("#inputCountryEn").val(countryEn);
	$("#inputCountryCn").val(countryCn);
	$("#inputCode").val(code);
	$("#objectId").val(id);
	$("#myModal").modal("show");
	$("#btnSave").hide();
	$("#btnEdit").show();
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
 * 添加数据
 * @private
 */
function _addFun() {
	var jsonData = {
		'companyId': companyID,
		'typeId': typeId,
		'code': $("#inputCode").val().toUpperCase(),
		'nameEn': $("#inputNameEn").val().toUpperCase(),
		'nameCn': $("#inputNameCn").val().toUpperCase(),
		'countryEn': $("#inputCountryEn").val().toUpperCase(),
		'countryCn': $("#inputCountryCn").val().toUpperCase()
	};
	$.ajax({
		url: dataUrl+'ajax/publicdata.ashx?action=new',
		data: jsonData,
		dataType: "json",
		type: "post",
		success: function(backdata) {
			if(backdata.State == 1) {
				$("#myModal").modal("hide");
				resetFrom();
				oTable.fnReloadAjax(oTable.fnSettings());
			} else {
				alert("Add Fail!");
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

/**
 * 编辑数据
 * @private
 */
function _editFunAjax() {
	var Id = $("#objectId").val();
	var code = $("#inputCode").val().toUpperCase();
	var nameEn = $("#inputNameEn").val().toUpperCase();
	var nameCn = $("#inputNameCn").val().toUpperCase();
	var countryEn = $("#inputCountryEn").val().toUpperCase();
	var countryCn = $("#inputCountryCn").val().toUpperCase();
	var jsonData = {
		"Id": Id,
		'companyId': companyID,		
		"typeId": typeId,
		"code": code,		
		"nameEn": nameEn,
		"nameCn": nameCn,
		"countryEn": countryEn,
		"countryCn": countryCn		
	};
	$.ajax({
		type: 'POST',
		dataType: "json",
		url: dataUrl+'ajax/publicdata.ashx?action=modify',
		data: jsonData,
		success: function(json) {
			if(json.State) {
				$("#myModal").modal("hide");
				resetFrom();
				oTable.fnReloadAjax(oTable.fnSettings());
			} else {
				alert("Edit Fail!");
			}
		},
		error: function(error) {
			console.log(error);
		}
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

/**
 * 重置表单
 */
function resetFrom() {
	$('form').each(function(index) {
		$('form')[index].reset();
	});
}

/**
 * 批量删除
 * 未做
 * @private
 */
function _deleteList() {
	bootbox.confirm("Are you sure?", function(result) {
		if(result) {
			var str = '';
			$("input[name='checkList']:checked").each(function(i, o) {
				str += $(this).val();
				str += ",";
			});
			if(str.length > 0) {
				//var IDS = str.substr(0, str.length - 1);
				//alert("你要删除的数据集id为" + IDS);
				$.ajax({
					url: dataUrl + 'ajax/publicdata.ashx?action=allcancel',
					data: {
						"AllId": str,
						"typeId": typeId
					},
					dataType: "json",
					type: "post",
					success: function(backdata) {
						if(backdata.State) {
							oTable.fnReloadAjax(oTable.fnSettings());
						} else {
							alert("Delete Failed！");
						}
					},
					error: function(error) {
						console.log(error);
					}
				});
			} else {
				alert("Please choose to delete the data!");
			}
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