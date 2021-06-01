//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Financial MANAGEMENT",        
        };

$(function(){
    hasPermission('1304'); //权限控制：查看费用详细清单	
	this.title = get_lan('nav_5_3') 	
	$('.navli5').addClass("active open")
	$('.financial3').addClass("active")	
	$('#title1').text(get_lan('nav_5_3'))
	$('#title2').text(get_lan('nav_5_3')) 
	
	var Id = GetQueryString('Id');

	common.ajax_req("get", false, dataUrl, "pricesheet.ashx?action=readbyid", {
	    "Id": Id
	}, function (data) {
	    console.log(data.Data)
	    console.log(data.Data2)
	    //初始化信息
	    var _data = data.Data
	    var _data2 = data.Data2
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


		if(feeItem0!=""){
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
	    if(feeItemAll!=""){
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

		if(feeItemAll2!=""){
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



