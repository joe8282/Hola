//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "财务管理中心",

};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Financial MANAGEMENTe",

};

var type = GetQueryString('type')
var sellIds = [], luruIds = [], kefuIds = [], caozuoIds = [], userIds, crmIds = []
var _feeItemArr = new Array();

$(document).ready(function () {
    
    //	initModal();
    if (type == 'debit') {
        hasPermission('1322'); //权限控制：查看应收报表
        console.log(isPermission('1323'))
        if (isPermission('1323') != 1) {
            $('#printDetail').hide()
        }
        this.title = get_lan('nav_5_8')
        $('.navli5').addClass("active open")
        $('.financial8').addClass("active")
        $('#title1').text(get_lan('nav_5_8'))
        $('#title2').text(get_lan('nav_5_8'))
        $('#typeTitle').text('客户应收统计表')
    } else {
        hasPermission('1324'); //权限控制：查看应付报表
        if (isPermission('1325') != 1) {
            $('#printDetail').hide()
        }
        this.title = get_lan('nav_5_9')
        $('.navli5').addClass("active open")
        $('.financial9').addClass("active")
        $('#title1').text(get_lan('nav_5_9'))
        $('#title2').text(get_lan('nav_5_9'))
        $('#typeTitle').text('客户应付统计表')
    }


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

        //var sellIds = [], luruIds = [], kefuIds = [], caozuoIds = [], userIds, crmIds = []

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
	    if ($("#crmuser").val() != null) {
	        crmIds = $("#crmuser").val()
	    }
	    function unique(arr) {
	        return Array.from(new Set(arr))
	    }
	    userIds = unique(sellIds.concat(luruIds).concat(kefuIds).concat(caozuoIds))
	    console.log(userIds.toString())
	    GetStatement($("input[name='radio2']:checked").val(), $("input[name='radio1']:checked").val(), sellIds.toString(), luruIds.toString(), kefuIds.toString(), caozuoIds.toString(), crmIds.toString())
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

	var OWNER_Unit = '', exchangeRate=1
	common.ajax_req("get", true, dataUrl, "weiinfo.ashx?action=read", {
	    "companyId": companyID
	}, function (data) {
	    //console.log(data)
	    if (data.State == 1) {
	        OWNER_Unit = data.Data.wein_currency
	        if (type == 'debit') {
	            $('.type_usd').text('应收USD')
	            $('.OWNER_Unit0').text('应收'+OWNER_Unit)
	        } else {
	            $('.type_usd').text('应付USD')
	            $('.OWNER_Unit0').text('应付' + OWNER_Unit)
	        }
	        $('.OWNER_Unit').text(OWNER_Unit)

	        if (OWNER_Unit != 'USD') {
	            common.ajax_req("get", true, dataUrl, "exchangerate.ashx?action=readbyowner", {
	                "owner": OWNER_Unit,
	                "other": 'USD'
	            }, function (data) {
	                if (data.State == 1) {
	                    exchangeRate = data.Data.rate_exchangeRate

	                    GetStatement(1, 1, null, null, null, null, null)
	                }
	            })
	        }
	        
	    }
	})

	$("#crmuser").select2({
	    ajax: {
	        url: dataUrl + "ajax/crmcompany.ashx?action=read&companyId=" + companyID,
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
	    placeholder: '请选择公司', //默认文字提示
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

    //费用类型
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

	function GetStatement(timeType, timeWhich, sellIds, luruIds, kefuIds, caozuoIds, crmIds)
	{
	    $('#timePrint').text(getDate())
	    if (timeType == 1) {
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

	    common.ajax_req('GET', false, dataUrl, 'booking.ashx?action=readfee', {
	        'companyId': companyID,
	        'feeType': type,
	        'timeType': timeType,
	        'timeWhich': timeWhich,
	        'time0': $('#month').val(),
	        'time1': $('#date1').val(),
	        'time2': $('#date2').val(),
	        'sellIds': sellIds,
	        'luruIds': luruIds,
	        'kefuIds': kefuIds,
	        'caozuoIds': caozuoIds,
	        'crmIds': crmIds,
	        //'state': 0,
	    }, function (data) {
	        //console.log(data)
	        if (data.State == 1) {
	            function trans(obj1, key1) {
	                var obj = {};
	                var arr = [];
	                for (i in obj1) {
	                    if (arr.indexOf(obj1[i][key1]) == "-1") {
	                        arr.push(obj1[i][key1]);
	                        //console.log(i);
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
	            function trans2(obj1, key1) {
	                var obj = {};
	                var arr = [];
	                for (i in obj1) {
	                    if (arr.indexOf(obj1[i][key1].replace(/-/g, '').substring(0, 6)) == "-1") {
	                        arr.push(obj1[i][key1].replace(/-/g, '').substring(0, 6));
	                        //console.log(i);
	                    }
	                }
	                for (j in arr) {
	                    for (k in obj1) {
	                        if (obj1[k][key1].replace(/-/g, '').substring(0, 6) == arr[j]) {
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
	            var obj2 = trans(data.Data, "comp_name");
	            for (i in obj2) {
	                if (timeType == 1) {
	                    obj2[i] = trans2(obj2[i], "book_truePortTime");
	                } else if (timeType == 2) {
	                    obj2[i] = trans2(obj2[i], "book_time");
	                } else {
	                    obj2[i] = trans2(obj2[i], "book_okTrailerTime");
	                }

	            }
	            console.log(obj2)

	            var all_USD = 0, all_OWNER = 0, all_STATE1 = 0, all_STATE2 = 0, all_OWNER_ALL = 0
	            for (i in data.Data) {
	                var feeUnit = data.Data[i]["bofe_feeUnit"]
	                if (feeUnit == 'USD') {
	                    all_USD = all_USD + data.Data[i]["bofe_allFee"]
	                    if (data.Data[i]["bofe_state"] != 3) { all_STATE1 = all_STATE1 + data.Data[i]["bofe_allFee"] }
	                } else if (feeUnit == OWNER_Unit && OWNER_Unit != 'USD') {
	                    all_OWNER = all_OWNER + data.Data[i]["bofe_allFee"]
	                    if (data.Data[i]["bofe_state"] != 3) { all_STATE2 = all_STATE2 + data.Data[i]["bofe_allFee"] }
	                }
	            }
	            all_OWNER_ALL = all_STATE1 * exchangeRate + all_STATE2
	            $('#allProfit').text(all_OWNER)
	            $('#allCount').text(all_USD)
	            $('#allState1').text(all_STATE1)
	            $('#allState2').text(all_STATE2)
	            $('#allBili').text(all_OWNER_ALL)

	            for (i in obj2) {  
	                var toCompany = 0
	                var _html = '<div class="item"></div><div style="width:100%;font-size:14px; font-weight:bold;" class="company"></div>';
	                $('#statement_data').append(_html)
	                var d_USD = 0, d_OWNER = 0, d_STATE1 = 0, d_STATE2 = 0, d_OWNER_ALL = 0
	                for (j in obj2[i]) {
	                    var USD = 0, OWNER = 0, STATE1 = 0, STATE2 = 0, OWNER_ALL = 0
	                    for (k in obj2[i][j]) {
	                        toCompany = obj2[i][j][k]["bofe_toCompany"]
	                        var feeUnit = obj2[i][j][k]["bofe_feeUnit"]
	                        if (feeUnit == 'USD') {
	                            USD = USD + obj2[i][j][k]["bofe_allFee"]
	                            if (obj2[i][j][k]["bofe_state"] != 3) { STATE1 = STATE1 + obj2[i][j][k]["bofe_allFee"] }
	                        } else if (feeUnit == OWNER_Unit && OWNER_Unit != 'USD') {
	                            OWNER = OWNER + obj2[i][j][k]["bofe_allFee"]
	                            if (obj2[i][j][k]["bofe_state"] != 3) { STATE2 = STATE2 + obj2[i][j][k]["bofe_allFee"] }
	                        }
	                    }
	                    //OWNER_ALL = USD * exchangeRate + OWNER
	                    OWNER_ALL = STATE1 * exchangeRate + STATE2
	                    $('.item:last').append('<div style="width:100%;"><div style="float:left;width:16%;" onclick="_detailFun(2,\'' + i + '\',' + toCompany + ',\'' + j + '\')"><a href="#">' + j + '</a></div><div style="float:left;width:16%;">' + USD + '</div><div style="float:left;width:16%;">' + OWNER + '</div><div style="float:left;width:16%;">' + STATE1 + '</div><div style="float:left;width:16%;">' + STATE2 + '</div><div style="float:left;width:16%;">' + OWNER_ALL + '</div></div>')
	                    d_USD = d_USD + USD
	                    d_OWNER = d_OWNER + OWNER
	                    d_STATE1 = d_STATE1 + STATE1
	                    d_STATE2 = d_STATE2 + STATE2
	                    d_OWNER_ALL = d_OWNER_ALL + OWNER_ALL
	                }
	                $('.company:last').append('<div style="float:left;width:16%;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"  onclick="_detailFun(1,\''+i+'\',' + toCompany + ')"><a href="#">' + i + '</a></div><div class="d_num" style="float:left;width:16%;"></div><div class="d_profit" style="float:left;width:16%;"></div><div class="d_state1" style="float:left;width:16%;"></div><div class="d_state2" style="float:left;width:16%;"></div><div class="d_bili" style="float:left;width:16%;"></div>')
	                $('.d_num:last').text(d_USD)
	                $('.d_profit:last').text(d_OWNER)
	                $('.d_state1:last').text(d_STATE1)
	                $('.d_state2:last').text(d_STATE2)
	                $('.d_bili:last').text(d_OWNER_ALL)
	                
	            }
	        }

	    }, function (error) {
	        //console.log(parm)
	    }, 1000)
	}

});

function _detailFun(typeId,text,value,time) {
    $("#myModal").modal("show");
    $("#mingxi").empty()
    $("#mySmallModalLabel").text("查看明细-" + text)
    var timeWhich = $("input[name='radio1']:checked").val()
    var time0 = $('#month').val()
    var time1 = $('#date1').val()
    var time2 = $('#date2').val()
    if (typeId == 2) {
        timeWhich = 1
        time0 = time.substr(0, 4) + '-' + time.substr(4, 2)
    }
    common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfee", {
        'companyId': companyID,
        'feeType': type,
        'timeType': $("input[name='radio2']:checked").val(),
        'timeWhich': timeWhich,
        'time0': time0,
        'time1': time1,
        'time2': time2,
        'sellIds': sellIds.toString(),
        'luruIds': luruIds.toString(),
        'kefuIds': kefuIds.toString(),
        'caozuoIds': caozuoIds.toString(),
        'crmIds': value,
        'state': 0,
    }, function (data) {
        console.log(data.Data)
        if (data.State == 1) {
            //初始化信息
            var _data = data.Data
            for (var i = 0; i < _data.length; i++) {
                var feelist = '<tr><td>' + (i + 1) + '</td><td>' + text + '</td><td>' + _data[i].book_orderCode + '</td><td>' + _getFeeItemFun(_data[i].bofe_feeItem) + '</td><td>' + _data[i].bofe_feeUnit + '</td><td>' + _data[i].bofe_fee + '</td><td>' + _data[i].bofe_num + '</td><td>' + _data[i].bofe_numUnit + '</td><td>' + _data[i].bofe_allFee + '</td></tr>'
                $("#mingxi").append(feelist)
            }
  
        }

    }, function (err) {
        console.log(err)
    }, 1000)
}

function _getFeeItemFun(o) {
    //console.log("111111111111111111111111111111111111")
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