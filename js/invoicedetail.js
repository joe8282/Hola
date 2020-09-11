//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Financial MANAGEMENT",        
        };

var _feeItemArr = new Array();

$(function(){
	$('.navli3').addClass("active open")
	$('.book3').addClass("active")

	this.title = get_lan('invoiceDetail')
	$('#title1').text(get_lan('invoiceDetail'))
	$('#title2').text(get_lan('invoiceDetail')) 
	
	
	$('.glyphicon-print').on('click', function() {
		printContent();
	})

	//$('.glyphicon-save').on('click', function() {
	//  alert("Please print out the PDF file.")
    //})
    //转化保存为PDF
	var downPdf = document.getElementById("glyphicon-save");
	downPdf.onclick = function () {
		$('#page-body').width("592.28pt");
	    html2canvas(
                document.getElementById("printContent"),
                {
                    dpi: 300,//导出pdf清晰度
                    onrendered: function (canvas) {
                        var contentWidth = canvas.width;
                        var contentHeight = canvas.height;

                        //一页pdf显示html页面生成的canvas高度;
                        var pageHeight = contentWidth / 592.28 * 841.89;
                        //未生成pdf的html页面高度
                        var leftHeight = contentHeight;
                        //pdf页面偏移
                        var position = 0;
                        //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
                        var imgWidth = 595.28;
                        var imgHeight = 592.28 / contentWidth * contentHeight;

                        var pageData = canvas.toDataURL('image/jpeg', 1.0);
                        var pdf = new jsPDF('', 'pt', 'a4');

                        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                        //当内容未超过pdf一页显示的范围，无需分页
                        if (leftHeight < pageHeight) {
                            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                        } else {
                            while (leftHeight > 0) {
                                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                                leftHeight -= pageHeight;
                                position -= 841.89;
                                //避免添加空白页
                                if (leftHeight > 0) {
                                    pdf.addPage();
                                }
                            }
                        }
                        pdf.save('content.pdf');
                    },
                    //背景设为白色（默认为黑色）
                    background: "#FBFBFB"
                })
		$('#page-body').width("auto");
	}

	var Id = GetQueryString('billId');


	common.ajax_req("get", false, dataUrl, "bill.ashx?action=readbyid", {
	    "Id": Id
	}, function (data) {
	    console.log(data.Data)
	    //初始化信息
	    var _data = data.Data

	    //var _data2 = data.Data2
	    //alert(_data.bill_companyId)
	    getUserCompany(_data.bill_companyId);
	    getToCompany(_data.bill_toCompany);
	    getShpmInfo(_data.bill_bookingId);
	    loadContainer(1,_data.bill_bookingId)
	    $('.addTime').text(_data.bill_addTime.substring(0, 10));
	    $('.totalFee').text(_data.bill_payPrice);
	    $('.InvNo').text(_data.bill_payNumber);
	    $('#remark').text(_data.bill_beizhu);
	    $('#bankInfo').text(_data.bill_bank);

        var arrItem = _data.bill_feeItem.split(',');

        for (var i = 0; i < arrItem.length; i++) {
            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readfeebyid", {
                "Id": arrItem[i]
            }, function (data) {
                console.log(data.Data)
                if (data.State == 1) {
                    //初始化信息
                    var _data2 = data.Data

                    var feelist = '<tr>' +
                            '<td>'+_getFeeItemFun(_data2.bofe_feeItem)+'</td>'+
                            '<td>'+ _data2.bofe_feeUnit +_data2.bofe_fee+'</td>'+
                            '<td>' + _data2.bofe_num + '</td>'+
                            '<td>' + _data2.bofe_numUnit + '</td>'+
                            '<td>' + _data2.bofe_feeUnit+_data2.bofe_allFee + '</td>'+
                    '</tr>'
                    $(".feeItem").append(feelist)
                }


            }, function (err) {
                console.log(err)
            }, 1000)
        }

	}, function (err) {
	    console.log(err)
	}, 5000)



})

function _getFeeItemFun(o) {
    var z = new Array();
    var x;
    //费用类型
	common.ajax_req('GET', false, dataUrl, 'publicdata.ashx?action=readbytypeid', {
		'typeId': 6,
		'companyId': companyID
	}, function(data) {
		var _data = data.data;
		console.log(_data)
		for(var i = 0; i < _data.length; i++) {
			//var _html = '<option value="' + _data[i].puda_id + '">' + _data[i].puda_name_cn + ' - '+_data[i].puda_name_en+'</option>';
			//$('#feeItem').append(_html)
			//_feeItem=_feeItem+_html
            _feeItemArr.push(_data[i].puda_id+';'+_data[i].puda_name_cn+' / '+_data[i].puda_name_en)
		}
	}, function(error) {
	}, 1000)
    for (var i = 0; i < _feeItemArr.length; i++) {
        if (_feeItemArr[i].indexOf(o) >= 0) {
            z = _feeItemArr[i].split(";");
            x = z[1];
        }
    }
    return x;
}

function getUserCompany(o){
	common.ajax_req("get", false, dataUrl, "usercompany.ashx?action=readbyid", {
	    "Id": o
	}, function (data) {
	    console.log(data.Data)
	    //初始化信息
	    var _data = data.Data
	    //var _data2 = data.Data2
	    $('.companyNameEn').text(_data.comp_name_en)
	    $('.companyName').text(_data.comp_name)
	    $('.companyTel').text(_data.comp_tel)
	    $('.companyFax').text(_data.comp_fax)
	    $('.companyEmail').text(_data.comp_email)
	    $('.companyAdd').text(_data.comp_address)
	    $('#signNature').text(_data.comp_name_en);
	    //alert(_data.comp_name)

	}, function (err) {
	    console.log(err)
	}, 5000)
}

function getToCompany(o){
	common.ajax_req("get", false, dataUrl, "crmcompany.ashx?action=readbyid", {
	    "Id": o
	}, function (data) {
	    console.log(data.Data)
	    //初始化信息
	    var _data = data.Data
	    //var _data2 = data.Data2
	    $('.toCompany').text(_data.comp_name)
	    $('.toCompanyContact').text(_data.comp_contactName+' / '+_data.comp_contactPhone+' / '+_data.comp_contactEmail)
	    //alert(_data.comp_name)

	}, function (err) {
	    console.log(err)
	}, 5000)
}


function getShpmInfo(o){	
    //加载基本信息
    common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
        "Id": o
    }, function(data) {
        console.log(data.Data)
        //初始化信息
        var _data = data.Data
		this.title = get_lan('invoiceDetail')+' '+_data.book_orderCode;
		$('#title1').text(get_lan('invoiceDetail')+' '+_data.book_orderCode)
		$('#title2').text(get_lan('invoiceDetail')+' '+_data.book_orderCode) 

        stateId = _data.book_orderState
        var stateList=$('#STATELIST li')
        $.each(stateList,function(i,item){
            if((i+12)<=stateId){
                //item.addClass('btn-blue')
                //$('#STATELIST span').eq(i).addClass('btn-blue')
                $('#STATELIST li').eq(i).addClass('active')
            }
        })
        $('.RefNo').text(_data.book_outCode)//参考号码
        $('.hblNo').text(_data.book_orderCode)//系统单号
        $('.mblNo').text(_data.book_billCode)
        $('.qty').text(_data.book_movementType=="FCL"?"FCL":"LCL")
        //$('.cntrNo').text(_data.book_outCode)

        $('.vesselvoy').text(_data.book_vessel+"/"+_data.book_voyage)
        $('.port1').text(_data.book_port1)
        $('.port2').text(_data.book_port2)
        $('.onBoardDate').text(_data.book_truePortTime.substring(0, 10))
    }, function(err) {
        console.log(err)
    }, 1000)
}

//加载集装箱
function loadContainer(whichId,Id){
	common.ajax_req("get", false, dataUrl, "booking.ashx?action=readcontainer", {
		"whichId": whichId,
		"bookingId": Id
	}, function(data) {
		console.log(data)
		if(data.State == 1) {
			var _data = data.Data;
			for(var i = 0; i < _data.length; i++) {
				var crmlist =_data[i].boco_number+"/"+_data[i].boco_typeName+", ";
					$(".cntrNo").prepend(crmlist)
			}
		}
	
	}, function(err) {
		console.log(err)
	}, 2000)
}	

function printContent(){
	$("#printContent").print({
	    globalStyles:true,//是否包含父文档的样式，默认为true
	    mediaPrint:false,//是否包含media='print'的链接标签。会被globalStyles选项覆盖，默认为false
	    stylesheet:null,//外部样式表的URL地址，默认为null
	    noPrintSelector:".no-print",//不想打印的元素的jQuery选择器，默认为".no-print"
	    iframe:false,//是否使用一个iframe来替代打印表单的弹出窗口，true为在本页面进行打印，false就是说新开一个页面打印，默认为true
	    append:null,//将内容添加到打印内容的后面
	    prepend:null,//将内容添加到打印内容的前面，可以用来作为要打印内容
	    deferred: $.Deferred()//回调函数
	});  
}