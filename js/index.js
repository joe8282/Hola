//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "CRM Home",           
        };

var _url = document.referrer;

$(function () {
    //订单统计
    common.ajax_req("get", true, dataUrl, "booking.ashx?action=read", {
        "companyId": companyID,
        "orderState":12
    }, function (data) {
        $('#orderCount').text(data.data.length)
    }, function (err) {
        console.log(err)
    }, 2000)

    //舱单统计
    common.ajax_req("get", true, dataUrl, "booking.ashx?action=read", {
        "crmId": companyID,
        "state": 1,
        "fromId": 1
    }, function (data) {
        $('#bookingCount').text(data.data.length)
    }, function (err) {
        console.log(err)
    }, 2000)

    //客户统计
    common.ajax_req("get", true, dataUrl, "crmcompanyfollow.ashx?action=read", {
        "companyId": companyID,
        "state": 1
    }, function (data) {
        $('#crmCount').text(data.data.length)
    }, function (err) {
        console.log(err)
    }, 2000)

})

