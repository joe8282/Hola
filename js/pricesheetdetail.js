//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "运价管理中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Rates MANAGEMENT",
};
var Id = GetQueryString('Id');

$(function(){
    hasPermission('1304'); //权限控制：查看费用详细清单	
    this.title = get_lan('nav_4_5')
	$('.navli4').addClass("active open")
	$('.financial3').addClass("active")	
	$('#title1').text(get_lan('nav_4_5'))
	$('#title2').text(get_lan('nav_4_5'))

	$('.glyphicon-print').on('click', function () {
	    printContent();
	})

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
                        var pdfData = pdf.output('datauristring')
                        // ajax 上传文件 
                        $.post(dataUrl + "ajax/uploadFile2.ashx", { filename: pdfData, companyId: companyID }, function (ret) {
                            if (ret.State == '100') {
                                var parm = {
                                    'bookingId': Id, //按实际修改
                                    'companyId': companyID, //按实际修改
                                    'userId': userID,
                                    'typeId': 3,
                                    'name': '报价单导出详细文件', //按实际修改
                                    'nav': ret.Nav,
                                    "url": ret.Pname,

                                }
                                console.log(parm)
                                common.ajax_req('POST', false, dataUrl, 'files.ashx?action=new', parm, function (data) {
                                    if (data.State == 1) {
                                        comModel("成功")
                                        pdf.save(ret.Pname);
                                    } else {
                                        comModel("失败")
                                    }
                                }, function (error) {
                                }, 2000)
                            } else {
                                alert('上传失败');
                            }
                        }, 'json');
                    },
                    //背景设为白色（默认为黑色）
                    background: "#FBFBFB"
                })
	    $('#page-body').width("auto");
	}

	common.ajax_req("get", false, dataUrl, "pricesheet.ashx?action=readbyid", {
	    "Id": Id
	}, function (data) {
	    console.log(data.Data)
	    console.log(data.Data2)
	    //初始化信息
	    var _data = data.Data
	    var _data2 = data.Data2
	    $('.code').text(_data.prsh_code)
	    $('.companyName').text(_data2.comp_name)
	    $('.companyNameEn').text(_data2.comp_name_en)
	    $('.companyTel').text(_data2.comp_tel)
	    $('.companyFax').text(_data2.comp_fax)
	    $('.companyEmail').text(_data2.comp_email)
	    $('.toCompany').text(_data.comp_name)
	    $('.toCompanyContact').text(_data.comp_contactName)
	    $('.addTime').text(_data.prsh_time.substring(0, 10))
	    $('.port1').text(_data.prsh_port1)
	    $('.port2').text(_data.prsh_port2)
	    $('#remark').html(HtmlEncode(_data.prsh_remark))
	    $('.contTypeOne').html(_data.prsh_20GP.split("*")[1])
	    $('.contTypeTwo').html(_data.prsh_40GP.split("*")[1])
	    $('.contTypeThree').html(_data.prsh_40HQ.split("*")[1])

		var p20gp="", p40gp="", p40hq="", pCbm="", pKgs="", pCtns="";
		(_data.prsh_20GP.split("*")[0])?(p20gp=_data.prsh_20GP+", "):(p20gp="");
		(_data.prsh_40GP.split("*")[0])?(p40gp=_data.prsh_40GP+", "):(p40gp="");
		(_data.prsh_40HQ.split("*")[0])?(p40hq=_data.prsh_40HQ+", "):(p40hq="");
		(_data.prsh_CBM=="")?(pCbm=""):(pCbm=_data.prsh_CBM+" CBM, ");
		(_data.prsh_KGS=="")?(pKgs=""):(pKgs=_data.prsh_KGS+" KGS, ");
		(_data.prsh_CTNS=="")?(pCtns=""):(pCtns=_data.prsh_CTNS+" CTNS, ");
		$('.shipments_containers').text(p20gp+p40gp+p40hq);
		$('.shipments_datas').text(pCbm+pKgs+pCtns);

		
		if (_data.prsh_feeItem != "") {
		    var feeItemAll0 = _data.prsh_feeItem.split('||')
		    for (var i = 0; i < feeItemAll0.length - 1; i++) {
		        var feeItem0 = feeItemAll0[i].split(';')
		        var _html = '<tr><td class="labelKgs">' + (feeItem0[1]==0?"NIN":(feeItem0[1]?(feeItem0[0] + feeItem0[1]):"NIN")) + 
		        			'</td><td class="labelRt">' + (feeItem0[2]==0?"NIN":(feeItem0[2]?(feeItem0[0] + feeItem0[2]):"NIN")) + 
		        			'</td><td class="contTypeOne">' + (feeItem0[3]==0?"NIN":(feeItem0[3]?(feeItem0[0] + feeItem0[3]):"NIN")) + 
		        			'</td><td class="contTypeTwo">' + (feeItem0[4]==0?"NIN":(feeItem0[4]?(feeItem0[0] + feeItem0[4]):"NIN")) + 
		        			'</td><td class="contTypeThree">' + (feeItem0[5]==0?"NIN":(feeItem0[5]?(feeItem0[0] + feeItem0[5]):"NIN")) + 
		        			'</td><td>' + feeItem0[6] + 
		        			'</td><td>' + feeItem0[7] + 
		        			'</td><td>' + feeItem0[8] + 
		        			'</td><td>' + feeItem0[9] + 
		        			'</td><td>' + feeItem0[10] + ' <i class="fa fa-long-arrow-right"></i> ' + feeItem0[11] + 
		        			'</td><td>' + feeItem0[12] + 
		        			'</td></tr>'
		        $('.feeItem').append(_html)
		    }
		}else{
			$("#freight_div").hide();
		}

		if (_data.prsh_localChargeItem != "") {
		    var feeItemAll = _data.prsh_localChargeItem.split('||')
		    for (var i = 0; i < feeItemAll.length - 1; i++) {
		        var feeItem = feeItemAll[i].split(';')
		        var _html = '<tr><td>' + feeItem[0] + 
		        			'</td><td>' + (feeItem[2]==0?"NIN":(feeItem[2]?(feeItem[1] + feeItem[2]):"NIN")) + 
		        			'</td><td class="labelKgs">' + (feeItem[3]==0?"NIN":(feeItem[3]?(feeItem[1] + feeItem[3]):"NIN")) + 
		        			'</td><td class="labelRt">' + (feeItem[4]==0?"NIN":(feeItem[4]?(feeItem[1] + feeItem[4]):"NIN")) + 
		        			'</td><td class="contTypeOne">' + (feeItem[5]==0?"NIN":(feeItem[5]?(feeItem[1] + feeItem[5]):"NIN")) + 
		        			'</td><td class="contTypeTwo">' + (feeItem[6]==0?"NIN":(feeItem[6]?(feeItem[1] + feeItem[6]):"NIN")) + 
		        			'</td><td class="contTypeThree">' + (feeItem[7]==0?"NIN":(feeItem[7]?(feeItem[1] + feeItem[7]):"NIN")) + 
		        			'</td><td>' + feeItem[8] + ' <i class="fa fa-long-arrow-right"></i> ' + feeItem[9] + 
		        			'</td><td>' + feeItem[10] + 
		        			'</td></tr>'
		        $('.localChargeItem').append(_html)

		    }
		}else{
			$("#localcharge_div").hide();
		}

		if (_data.prsh_truckingChargeItem != "") {
		    var feeItemAll2 = _data.prsh_truckingChargeItem.split('||')
		    for (var i = 0; i < feeItemAll2.length - 1; i++) {
		        var feeItem2 = feeItemAll2[i].split(';')
		        var _html = '<tr><td>' + feeItem2[0] + 
		        			'</td><td class="labelKgs">' + (feeItem2[2]==0?"NIN":(feeItem2[2]?(feeItem2[1] + feeItem2[2]):"NIN")) + 
		        			'</td><td class="labelRt">' + (feeItem2[3]==0?"NIN":(feeItem2[3]?(feeItem2[1] + feeItem2[3]):"NIN")) + 
		        			'</td><td class="contTypeOne">' + (feeItem2[4]==0?"NIN":(feeItem2[4]?(feeItem2[1] + feeItem2[4]):"NIN")) + 
		        			'</td><td class="contTypeTwo">' + (feeItem2[5]==0?"NIN":(feeItem2[5]?(feeItem2[1] + feeItem2[5]):"NIN")) + 
		        			'</td><td class="contTypeThree">' + (feeItem2[6]==0?"NIN":(feeItem2[6]?(feeItem2[1] + feeItem2[6]):"NIN")) + 
		        			'</td><td>' + feeItem2[7] + ' <i class="fa fa-long-arrow-right"></i> ' + feeItem2[8] + 
		        			'</td><td>' + feeItem2[9] + 
		        			'</td></tr>'
		        $('.truckingChargeItem').append(_html)

		    }
	    }else{
			$("#truckingcharge_div").hide();
	    }

		if(_data.prsh_movetype=="FCL"){         //by daniel 20191015
			console.log("test")
			$('.labelKgs').hide();
			$('.labelRt').hide();
		}else if(_data.prsh_movetype=="AIR"){			
			console.log("test2")
			$('.labelRt').hide();
			$('.contTypeOne').hide();
			$('.contTypeTwo').hide();
			$('.contTypeThree').hide();
		}else{
			console.log("test3")
			$('.labelKgs').hide();
			$('.contTypeOne').hide();
			$('.contTypeTwo').hide();
			$('.contTypeThree').hide();
		}

	}, function (err) {
	    console.log(err)
	}, 5000)

})


function printContent() {
    $("#printContent").print({
        globalStyles: true,//是否包含父文档的样式，默认为true
        mediaPrint: false,//是否包含media='print'的链接标签。会被globalStyles选项覆盖，默认为false
        stylesheet: null,//外部样式表的URL地址，默认为null
        noPrintSelector: ".no-print",//不想打印的元素的jQuery选择器，默认为".no-print"
        iframe: false,//是否使用一个iframe来替代打印表单的弹出窗口，true为在本页面进行打印，false就是说新开一个页面打印，默认为true
        append: null,//将内容添加到打印内容的后面
        prepend: null,//将内容添加到打印内容的前面，可以用来作为要打印内容
        deferred: $.Deferred((function () { //回调函数
            console.log('Printing done');
            //生成图片并保存文件记录，JOE新增
            html2canvas(document.getElementById("printContent"), {
                onrendered: function (canvas) {
                    var url = canvas.toDataURL('image/jpeg', 1.0);
                    //console.log(url)
                    // ajax 上传图片  
                    $.post(dataUrl + "ajax/uploadPic.ashx", { image: url, companyId: companyID }, function (ret) {
                        if (ret.State == '100') {
                            //$('#Nav').val(ret.Nav);
                            $('#Pname').val(ret.Pname);
                            var parm = {
                                'bookingId': Id, //按实际修改
                                'companyId': companyID, //按实际修改
                                'userId': userID,
                                'typeId': 3,
                                'name': '报价单导出详细文件', //按实际修改
                                'nav': ret.Nav,
                                "url": ret.Pname,

                            }
                            console.log(parm)
                            common.ajax_req('POST', false, dataUrl, 'files.ashx?action=new', parm, function (data) {
                                if (data.State == 1) {
                                    comModel("成功")
                                } else {
                                    comModel("失败")
                                }
                            }, function (error) {
                            }, 2000)
                        } else {
                            alert('上传失败');
                        }
                    }, 'json');
                },
                //背景设为白色（默认为黑色）
                background: "#FBFBFB"
            })
        }))
    });
}



