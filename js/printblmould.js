//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "客户管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "CRM Home",        
        };


var id;
var name;
var newDate;
var usid;
var imgSrc;
var itemName;
var itemNameArr = new Array();
var itemPosition;
var itemPositionArr = new Array();
var itemPositionArrLeftTop = new Array();
var itemContent;
var itemContentArr = new Array();
var itemRemark;
var itemRemarkArr = new Array();
var itemFontWeight;
var itemFontWeightArr = new Array();
var itemDim;
var itemDimArr = new Array();
var itemWidthHeightArr = new Array();
var logoSrc;
var logoDetail;
var logoDetailArr = new Array();


$(document).ready(function() {
	imgSrc="upload/img/hblmould.png";
	logoSrc="upload/img/logo-inverted.png";
	itemName="shipper;/cnee;/notify;/pol;/pod;/dest;/vslvoy";
	itemPosition="56px,140px;/56px,334px;/56px,500px;/340px,670px;/500px,700px;/700px,700px;/500px,800px";  //分别为left, top
	itemFontWeight="16px;/16px;/16px;/16px;/16px;/16px;/16px";
	itemContent="THIS IS SHIPPER, CAN WRITE ANY THING;/THIS IS CNEE, CAN WRITE ONLY CNEE, MOST TIME WE ARE THE DESTINATION COMPANY, AND THE BUYER;/WE ARE NOTIFY PART, CAN WRITE THE DESITNATION COMPANY;/YANTIAN,GUANGDONG;/HAMBURG,GERMANY;/HAMBURG,GERMANY;/HONG XING 32W";
	itemDim="450px,150px;/450px,120px;/450px,120px;/180px,30px;/180px,30px;/180px,30px;/180px,30px"; //分别为width, height
	logoDetail="656px;/20px;/200px;/80px";  //分别为left, top, width, height

	//分离字段成数组
	itemNameArr=itemName.split(";/");
	itemPositionArr=itemPosition.split(";/");
	itemFontWeightArr=itemFontWeight.split(";/");
	itemContentArr=itemContent.split(";/");
	itemDimArr=itemDim.split(";/");
	logoDetailArr=logoDetail.split(";/");

	//根据itemName来建立绝对位置的层
	for (var i = 0; i < itemNameArr.length; i++) {
		var contentHtml="<div id='"+itemNameArr[i]+"' style='position:absolute;'>"+itemContentArr[i]+"</div>";
		itemPositionArrLeftTop=itemPositionArr[i].split(",");
		itemWidthHeightArr=itemDimArr[i].split(",");

		$("#printArea").append(contentHtml);
		$("#"+itemNameArr[i]+"").css({"left":itemPositionArrLeftTop[0],"top":itemPositionArrLeftTop[1],"width":itemWidthHeightArr[0],"height":itemWidthHeightArr[1]});
		$("#"+itemNameArr[i]+"").css("font-size",itemFontWeightArr[i]);
		$("#"+itemNameArr[i]+"").css("word-break","break-all");
		
	}

	$("#mouldLogo").attr('src',logoSrc);
	$("#mouldLogo").css({"left":logoDetailArr[0],"top":logoDetailArr[1],"width":logoDetailArr[2],"height":logoDetailArr[3]});
	$("#mouldBackgroud").attr('src',imgSrc);
	$("#mouldBackgroud").css({"left":"0","top":"0","width":"1240px","height":"1754px"});
	//$("#printArea").css({"background-image":"url(upload/img/hblmould.png)","font-size":"200%"});
	$("#printArea").css("background-image",imgSrc);
	$("#printArea div,#printArea #mouldLogo").draggable({
		containment: "#printArea",
		cursor: "move"
	});
	$("#printArea div,#printArea #mouldLogo").resizable({
		containment: "#printArea",
		stop: function( event, ui ) {
			var _width=$(this).width();
			var _height=$(this).height();
			$("#itemDim").val(_width+"px,"+_height+"px");
		}
	});

	//当按下层的时候，移动会有背景色
	$('#printArea div,#printArea #mouldLogo').mousedown(function(){
		$(this).css("background-color","#FFFFCC");
		var x=$(this).position().top;
		var y=$(this).position().left; 
		var _width=$(this).width();
		var _height=$(this).height();
		$("#itemPosition").val(x+"px,"+y+"px");
		$("#itemName").val($(this).attr("id"));
		$("#itemWeight").val($(this).css("font-size"));
		$("#itemDim").val(_width+"px,"+_height+"px");

	});	
	//当松开层移动的时候，背景色消失
	$('#printArea div,#printArea #mouldLogo').mouseup(function(){
		$(this).css("background-color","");
		var x=$(this).position().top;
		var y=$(this).position().left; 
		$("#itemPosition").val(x+"px,"+y+"px");
	});
})



