//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "货物管理中心",   
            "con_top_3" : "对单", 
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "SHIPMENTS MANAGEMENT",       
            "con_top_3" : "BILL OF LADING",  
        };
        
var typeId,oTable;
var bookingId = GetQueryString('Id');
//var bookingId;

var _containerType='', _packageSel='', _weightSel='', _measurementSel='',_movementType='', _content1Containers='';

$(document).ready(function() {
	this.title = get_lan('con_top_3')
	GetDetail();


	//货代公司
	common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=read", {
		"customerId": companyID
	}, function(data) {
		var _data = data.data;
		$("#billfromHeader").html(_data.book_userCompanyName+'<br>'+_data.book_userCompanyNameEn)
	}, function(err) {
		console.log(err)
	}, 2000)

});

function GetDetail() 
{
	common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
		"Id": bookingId
	}, function(data) {
		var _data = data.Data
	}, function(err) {
		console.log(err)
	}, 1000)
}

