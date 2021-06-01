//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "邮件推广中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Email Prompt Plan",
};

var oTable;
var typeId;
$(document).ready(function() {
    hasPermission('1216'); //权限控制：新增群组邮件列表
//	initModal();
	this.title = get_lan('nav_6_5')
	$('.navli6').addClass("active open")
	$('.emailprompt5').addClass("active")	
	$('#title1').text(get_lan('nav_6_5'))
	$('#title2').text(get_lan('nav_6_5'))

	initTable()
	initTable2()

    //邮件群组
	common.ajax_req("get", true, dataUrl, "mail.ashx?action=readmailgroup", {
	    "companyId": companyID
	}, function (data) {
	    var _data = data.data;
	    console.log(_data)
	    if (_data != null) {
	        for (var i = 0; i < _data.length; i++) {
	            var _html = '<option value="' + _data[i].mgid + '">' + _data[i].mg_name + '</option>';
	            $('#mgid').append(_html)
	        }
	    }
	}, function (err) {
	    console.log(err)
	}, 2000)


    /**
     * 表格初始化
     * @returns {*|jQuery}
     */
    function initTable() {

        var table = $("#senderTable").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/mail.ashx?action=readmailuser&companyId=' + companyID,
            "bLengthChange": false,
            'bPaginate': false,
            //"bSearching": false,
            //		"bDestory": true,
            //		"bRetrieve": true,
        		    "bFilter": false,
                    "ordering":false,
                    "info": false,
            //"bSort": false,
            //"aaSorting": [[ 0, "desc" ]],
            //"stateSave": false,  //保存表格动态
            //"columnDefs":[{
            //    "targets": [ 0 ], //隐藏第0列，从第0列开始   
            //    "visible": false
            //}],
            "aoColumns": [
            				    {
            				        "mDataProp": "us_id",
            				        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				            $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'> " + oData.us_mail);
            				        }
            				    },
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
            },
            "fnInitComplete": function (oSettings, json) {
                $("input[name='checkList']").change(function () {
                    var result = "";
                    $("input[name='checkList']:checked").each(function () {
                        result += $(this).val() + ',';
                    });
                    if (result != "") {
                        result = result.substring(0, result.lastIndexOf(','));
                    }
                    $("#senderTables").val(result);
                });
            }
        });

        return table;
    }

    /**
     * 表格初始化
     * @returns {*|jQuery}
     */
    function initTable2() {

        var table = $("#templateTable").dataTable({
            //"iDisplayLength":10,
            "sAjaxSource": dataUrl + 'ajax/mail.ashx?action=readmailtemplate&companyId=' + companyID,
            "bLengthChange": false,
            'bPaginate': true,
            //		"bDestory": true,
            //		"bRetrieve": true,
        		    "bFilter": false,
            "ordering":false,
            "info": false,
            //"bSort": false,
            //"aaSorting": [[ 0, "desc" ]],
            //"stateSave": false,  //保存表格动态
            //"columnDefs":[{
            //    "targets": [ 0 ], //隐藏第0列，从第0列开始   
            //    "visible": false
            //}],
            "aoColumns": [
            				    {
            				        "mDataProp": "mt_id",
            				        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            				            $(nTd).html("<input type='checkbox' name='checkList2' value='" + sData + "'> " + oData.mt_mailtitle);
            				        }
            				    },
                                {
                                    "mDataProp": "change_time",
                                    "createdCell": function (td, cellData, rowData, row, col) {
                                        $(td).html(rowData.change_time.substring(0, 10));
                                    }
                                },
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
            },
            "fnInitComplete": function (oSettings, json) {
                $("input[name='checkList2']").change(function () {
                    var result = "";
                    $("input[name='checkList2']:checked").each(function () {
                        result += $(this).val() + ',';
                    });
                    if (result != "") {
                        result = result.substring(0, result.lastIndexOf(','));
                    }
                    $("#templateTables").val(result);
                });
            }
        });

        return table;
    }

    $("#btnSave").on("click", function () {
        var str = '';
        $("input[name='checkList']:checked").each(function (i, o) {
            str += $(this).val();
            str += ",";
        });

        var str2 = '';
        $("input[name='checkList2']:checked").each(function (i, o) {
            str2 += $(this).val();
            str2 += ",";
        });

        // if ($("#inputEmailppcopymail").val() == '') {
        //     comModel("抄送邮件地址不能为空！")
        // } else 
        if ($("#mgid").val() == '0') {
            comModel("请选择发送邮件群组！")
        } else if (str.length == 0) {
            comModel("请选择发送人邮箱！")
        } else if (str2.length == 0) {
            comModel("请选择邮件内容模板！")
        } else {
            var jsonData = {
                'companyId': companyID,
                'userId': userID,
                'mailreplyto': $("#inputEmailppcopymail").val(),
                'mgid': $("#mgid").val(),
                'mailsends': str,
                'mailtemplates': str2
            };
            $.ajax({
                url: dataUrl + 'ajax/mail.ashx?action=newmailsend',
                data: jsonData,
                dataType: "json",
                type: "post",
                success: function (backdata) {
                    if (backdata.State == 1) {
                        comModel("新增成功！")
                        location.href = 'emailpp_sendplan.html';
                    } else {
                        comModel("新增失败！")
                        location.href = 'emailpp_gsendplan.html';
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
});
