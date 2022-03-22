//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "货物管理中心",

};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "SHIPMENTS MANAGEMENT",

};

$(document).ready(function() {
    hasPermission('1721'); //权限控制
    if (isPermission('1722') != 1) {
        $('#printDetail').hide()
    }
//	initModal();
    this.title = get_lan('nav_3_8')
	$('.navli3').addClass("active open")
	$('.book7').addClass("active")
	$('#title1').text(get_lan('nav_3_8'))
	$('#title2').text(get_lan('nav_3_8'))

	$("#printDetail").click(function () {
	    var content = $("#printArea").html()
	    $("#printArea").print({
	        globalStyles: true,//是否包含父文档的样式，默认为true
	        mediaPrint: false,//是否包含media='print'的链接标签。会被globalStyles选项覆盖，默认为false
	        stylesheet: null,//外部样式表的URL地址，默认为null
	        noPrintSelector: ".no-print",//不想打印的元素的jQuery选择器，默认为".no-print"
	        iframe: false,//是否使用一个iframe来替代打印表单的弹出窗口，true为在本页面进行打印，false就是说新开一个页面打印，默认为true
	        append: null,//将内容添加到打印内容的后面
	        prepend: null,//将内容添加到打印内容的前面，可以用来作为要打印内容
	        deferred: $.Deferred((function () { //回调函数
	            console.log('Printing done');

	        }))
	    });
	})

	$('#send').on('click', function () {

	    var sellIds = [], luruIds = [], kefuIds = [], caozuoIds = [], userIds

	    if ($("#sellId").val() != null) {
	        sellIds = $("#sellId").val()
	    }
	    if ($("#luruId").val() != null) {
	        luruIds = $("#luruId").val()
	    }
	    if ($("#kefuId").val() != null) {
	        kefuIds = $("#kefuId").val()
	    }
	    if ($("#caozuoId").val() != null) {
	        caozuoIds = $("#caozuoId").val()
	    }
	    function unique(arr) {
	        return Array.from(new Set(arr))
	    }
	    userIds = unique(sellIds.concat(luruIds).concat(kefuIds).concat(caozuoIds))
	    console.log(userIds.toString())
	    GetStatement($("input[name='radio2']:checked").val(), $("input[name='radio1']:checked").val(), sellIds.toString(), luruIds.toString(), kefuIds.toString(), caozuoIds.toString())
	})

	common.ajax_req("get", true, dataUrl, "usercompany.ashx?action=readbyid", {
	    "Id": companyID
	}, function (data) {
	    //初始化信息;
	    var _data = data.Data;
	    $('.companyName').text(_data.comp_name)
	    $('.companyAddress').text(_data.comp_address)
	    $('.companyTel').text(_data.comp_tel)
	    $('.companyFax').text(_data.comp_fax)
	    $('.companyEmail').text(_data.comp_email)
	}, function (err) {
	    console.log(err)
	}, 2000)

	GetStatement(1, 1, null, null, null, null)

	$("#sellId").select2({
	    ajax: {
	        url: dataUrl + "ajax/userinfo.ashx?action=read&companyId=" + companyID + "&rolename=销售",
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
	                    "id": users[i]["usin_id"],
	                    "text": users[i]["usin_name"]
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
	    placeholder: '请选择销售人员', //默认文字提示
	    language: "zh-CN",
	    tags: false, //允许手动添加
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

	$("#luruId").select2({
	    ajax: {
	        url: dataUrl + "ajax/userinfo.ashx?action=read&companyId=" + companyID + "&rolename=录单",
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
	                    "id": users[i]["usin_id"],
	                    "text": users[i]["usin_name"]
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
	    placeholder: '请选择录单人员', //默认文字提示
	    language: "zh-CN",
	    tags: false, //允许手动添加
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

	$("#kefuId").select2({
	    ajax: {
	        url: dataUrl + "ajax/userinfo.ashx?action=read&companyId=" + companyID + "&rolename=客服",
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
	                    "id": users[i]["usin_id"],
	                    "text": users[i]["usin_name"]
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
	    placeholder: '请选择客服人员', //默认文字提示
	    language: "zh-CN",
	    tags: false, //允许手动添加
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

	$("#caozuoId").select2({
	    ajax: {
	        url: dataUrl + "ajax/userinfo.ashx?action=read&companyId=" + companyID + "&rolename=操作",
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
	                    "id": users[i]["usin_id"],
	                    "text": users[i]["usin_name"]
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
	    placeholder: '请选择操作人员', //默认文字提示
	    language: "zh-CN",
	    tags: false, //允许手动添加
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

	function GetStatement(timeType,timeWhich,sellIds, luruIds, kefuIds, caozuoIds)
	{
	    $('#timePrint').text(getDate())
	    if (timeType==1) {
	        $('#timeType').text('离港日期')
	    } else if (timeType == 2) {
	        $('#timeType').text('工作单日期')
	    } else {
	        $('#timeType').text('截关日期')
	    }
	    if (timeWhich == 1) {
	        $('#timeFromTo').text($('#month').val())
	    } else {
	        $('#timeFromTo').text('从' + $('#date1').val() + '到' + $('#date2').val())
	    }

	    $('#statement_data').empty()
	    $('#allProfit').empty()
	    $('#allCount').empty()
	    $('#allBili').empty()

	    common.ajax_req('GET', false, dataUrl, 'booking.ashx?action=read', {
	        'fromId': 2,
	        'companyId': companyID,
	        'timeType': timeType,
	        'timeWhich': timeWhich,
	        'time0': $('#month').val(),
	        'time1': $('#date1').val(),
	        'time2': $('#date2').val(),
	        'sellIds': sellIds,
	        'luruIds': luruIds,
	        'kefuIds': kefuIds,
	        'caozuoIds': caozuoIds,
	    }, function (data) {

	        if (data.data != null) {
	            function trans(obj1, key1) {
	                var obj = {};
	                var arr = [];
	                for (i in obj1) {
	                    if (arr.indexOf(obj1[i][key1]) == "-1") {
	                        arr.push(obj1[i][key1]);
	                        console.log(i);
	                    }
	                }
	                for (j in arr) {
	                    for (k in obj1) {
	                        if (obj1[k][key1] == arr[j]) {
	                            if (obj[arr[j]]) {
	                                obj[arr[j]].push(obj1[k]);
	                            } else {
	                                obj[arr[j]] = [obj1[k]];
	                            }

	                        }
	                    }
	                }
	                return obj;
	            }
	            var obj2 = trans(data.data, "code_name");
	            for (i in obj2) {
	                obj2[i] = trans(obj2[i], "usin_name");
	            }
	            console.log(obj2)

	            var all_profit = 0
	            for (i in data.data) {
	                all_profit = all_profit + data.data[i]["book_profit"]
	            }
	            $('#allProfit').text(all_profit)
	            $('#allCount').text(data.data.length)

	            for (i in obj2) {
	                var _html = '<div class="item"></div><div style="width:100%;font-size:14px; font-weight:bold; "><div style="float:left;width:25%;">' + i + '</div><div class="d_num" style="float:left;width:25%;">' + i + '</div><div class="d_profit" style="float:left;width:25%;"></div><div class="d_bili" style="float:left;width:25%;"></div></div>';
	                $('#statement_data').append(_html)
	                var d_profit = 0, d_num = 0, d_bili = 0
	                for (j in obj2[i]) {
	                    var profit = 0, bili = 0
	                    var _mingxi = '<tr><td width="20%">单号</td><td width="40%">客户</td><td width="20%">离港日期</td><td width="10%">利润</td><td width="10%">占总利润</td></tr>'
	                    for (k in obj2[i][j]) {
	                        profit = profit + obj2[i][j][k]["book_profit"]
	                        var book_okTrailerTime = ""
	                        if (obj2[i][j][k]["book_truePortTime"] != null) { book_okTrailerTime = obj2[i][j][k]["book_truePortTime"].substring(0, 10) }
	                        _mingxi += '<tr><td>' + obj2[i][j][k]["book_orderCode"] + '</td><td>' + obj2[i][j][k]["crm_name"] + '</td><td>' + book_okTrailerTime + '</td><td>' + obj2[i][j][k]["book_profit"] + '</td><td>' + (obj2[i][j][k]["book_profit"] / all_profit * 100).toFixed(2) + '%</td></tr>'
	                    }
	                    bili = (profit / all_profit * 100).toFixed(2) + '%'
	                    $('.item:last').append('<div style="width:100%;"><div style="float:left;width:25%;">' + j + '</div><div style="float:left;width:25%;">' + obj2[i][j].length + '</div><div style="float:left;width:25%;">' + profit + '</div><div style="float:left;width:25%;">' + bili + '</div></div><div class="mingxi" style="padding:0 50px; width:100%; line-height:20px;"><table border="1px" style="width:100%;">' + _mingxi + '</table></div>')
	                    d_profit = d_profit + profit
	                    d_num = d_num + obj2[i][j].length
	                }
	                d_bili = (d_profit / all_profit * 100).toFixed(2) + '%'
	                $('.d_profit:last').text(d_profit)
	                $('.d_bili:last').text(d_bili)
	                $('.d_num:last').text(d_num)
	            }
	        }

	    }, function (error) {
	        //console.log(parm)
	    }, 1000)
	}

	$('#ordermore').on('click', function () {
	    if ($("#ordermore").is(":checked")) {
	        $(".mingxi").show()
	    }
	    else { $(".mingxi").hide() }
	})

});
