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
// var imgSrc;
var itemType;
var itemTypeArr = new Array();
var itemId;
var itemIdArr = new Array();
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
// var logoSrc;
// var logoDetail;
// var logoDetailArr = new Array();


$(document).ready(function() {
	//imgSrc="upload/img/hblmould.png";
	//logoSrc="upload/img/logo-inverted.png";
	itemType="img;/img;/data;/data;/data;/data;/label;/data;/data";
	itemId="img1;/img2;/div1;/div2;/div3;/div4;/div5;/div6;/div7";
	itemName="hblmould;logo-img;/shipper;/cnee;/notify;/pol;/pod;/dest;/vslvoy";
	itemPosition="0px,0px;/656px,20px;/56px,140px;/56px,334px;/56px,500px;/340px,670px;/500px,700px;/700px,700px;/500px,800px";  //分别为left, top
	itemFontSize="16px;/16px;/16px;/16px;/16px;/16px;/16px;/16px;/16px";
	itemFontWeight="400;/400;/400;/400;/400;/400;/400;/700;/400";
	itemContent="upload/img/hblmould.png;/upload/img/logo-inverted.png;/THIS IS SHIPPER, CAN WRITE ANY THING;/THIS IS CNEE, CAN WRITE ONLY CNEE, MOST TIME WE ARE THE DESTINATION COMPANY, AND THE BUYER;/WE ARE NOTIFY PART, CAN WRITE THE DESITNATION COMPANY;/YANTIAN,GUANGDONG;/HAMBURG,GERMANY;/HAMBURG,GERMANY;/HONG XING 32W";
	itemDim="1240px,1754px;/200px,80px;/450px,150px;/450px,120px;/450px,120px;/180px,30px;/180px,30px;/180px,30px;/180px,30px"; //分别为width, height
	itemRemark="hblmould;/logo;/itisremark;/itisremark;/itisremark;/itisremark;/itisremark;/itisremark;/itisremark"
	//logoDetail="656px;/20px;/200px;/80px";  //分别为left, top, width, height

	//分离字段成数组
	itemTypeArr=itemType.split(";/");
	itemIdArr=itemId.split(";/");
	itemNameArr=itemName.split(";/");
	itemPositionArr=itemPosition.split(";/");
	itemFontSizeArr=itemFontSize.split(";/");
	itemFontWeightArr=itemFontWeight.split(";/");
	itemContentArr=itemContent.split(";/");
	itemDimArr=itemDim.split(";/");
	itemRemarkArr=itemRemark.split(";/");
	//logoDetailArr=logoDetail.split(";/");

	intData();
	//根据itemName来建立绝对位置的层
	function intData(){
		for (var i = 0; i < itemIdArr.length; i++) {
			if(itemTypeArr[i]=="label"){
				var contentHtml="<div id='"+itemIdArr[i]+"' name='"+itemNameArr[i]+"' itemtype='"+itemTypeArr[i]+"' style='position:absolute;' itemremark='"+itemRemarkArr[i]+"'>"+itemRemarkArr[i]+"</div>";
			}else if(itemTypeArr[i]=="img"){
				var contentHtml="<img id='"+itemIdArr[i]+"' name='"+itemNameArr[i]+"' itemtype='"+itemTypeArr[i]+"' style='position:absolute;' itemremark='"+HtmlEncode(itemRemarkArr[i])+"' src='"+itemContentArr[i]+"' />";
			}else{				
				var contentHtml="<div id='"+itemIdArr[i]+"' name='"+itemNameArr[i]+"' itemtype='"+itemTypeArr[i]+"' style='position:absolute;' itemremark='"+HtmlEncode(itemRemarkArr[i])+"'>"+HtmlEncode(itemContentArr[i])+"</div>";
			}
			itemPositionArrLeftTop=itemPositionArr[i].split(",");
			itemWidthHeightArr=itemDimArr[i].split(",");

			$("#printArea").append(contentHtml);
			$("#"+itemIdArr[i]+"").css({"left":itemPositionArrLeftTop[0],"top":itemPositionArrLeftTop[1],"width":itemWidthHeightArr[0],"height":itemWidthHeightArr[1]});
			$("#"+itemIdArr[i]+"").css("font-size",itemFontSizeArr[i]);
			$("#"+itemIdArr[i]+"").css("font-weight",itemFontWeightArr[i]);
			$("#"+itemIdArr[i]+"").css("word-break","break-all");
			//$("#"+itemIdArr[i]+"").css("overflow","hidden");
			
		}

		// $("#mouldLogo").attr('src',logoSrc);
		// $("#mouldLogo").css({"left":logoDetailArr[0],"top":logoDetailArr[1],"width":logoDetailArr[2],"height":logoDetailArr[3]});
		// $("#mouldBackgroud").attr('src',imgSrc);
		// $("#mouldBackgroud").css({"left":"0","top":"0","width":"1240px","height":"1754px"});
		// //$("#printArea").css({"background-image":"url(upload/img/hblmould.png)","font-size":"200%"});
		// $("#printArea").css("background-image",imgSrc);
		DraggableResizable();
	}

	// $("#mouldLogo").resizable({
	// 	containment: "#printArea",
	// 	stop: function( event, ui ) {
	// 		var _width=$(this).width();
	// 		var _height=$(this).height();
	// 		$("#itemDim").val(_width+"px,"+_height+"px");
	// 	}
	// });

	$("#addHLine").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var HLine='<div name="hline" id="hline'+_divLength+'" itemtype="hline" style="border-top:1px solid black; height:10px; width:100px; left:0px; top:0px; font-size:12px; font-weight:400; position:absolute;"></div>';
		$("#printArea").append(HLine);
		DraggableResizableToNominate("hline"+_divLength);
	})
	$("#addVLine").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var VLine='<div name="vline" id="vline'+_divLength+'" itemtype="vline" style="border-left:1px solid black; height:100px; width:10px; left:0px; top:0px; font-size:12px; font-weight:400; position:absolute;"></div>';
		$("#printArea").append(VLine);
		DraggableResizableToNominate("vline"+_divLength);
	})
	$("#addSquare").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var Square='<div name="square" id="square'+_divLength+'" itemtype="square" style="border:1px solid black; height:100px; width:100px; left:0px; top:0px; font-size:12px; font-weight:400; position:absolute;"></div>';
		$("#printArea").append(Square);
		DraggableResizableToNominate("square"+_divLength);
	})
	$("#addLabel").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var Label='<div name="label" id="label'+_divLength+'" itemtype="label" style="height:100px; width:100px; left:0px; top:0px; font-size:12px; font-weight:400; position:absolute;">Label and Text Area</div>';
		$("#printArea").append(Label);
		DraggableResizableToNominate("label"+_divLength);
	})
	$("#addData").click(function() {
 		$("#myModal").modal("show");
	})
	$("#addImg").click(function() {
 		$("#myModal_img").modal("show");
	})
	$('#printControl select').on('change',function(){
		var _changeCssName;
		if($(this).attr("id")=="itemSize"){
			_changeCssName="font-size";
		}else if($(this).attr("id")=="itemWeight"){
			_changeCssName="font-weight";
		}
		$("#"+$("#itemId").val()+"").css(_changeCssName,$(this).val());
	})

	$('#itemRemark').on('change',function(){
		var _changeLabelContent;
		_changeLabelContent=$("#"+$("#itemId").val()+"").attr("name");
		if(_changeLabelContent=="label"){
			$("#"+$("#itemId").val()+"").html(HtmlEncode($(this).val()));
			$("#"+$("#itemId").val()+"").attr("itemremark",$(this).val());
		}else{
			$("#"+$("#itemId").val()+"").attr("itemremark",$(this).val());
		}
	})

	//当按下层的时候，移动会有背景色
	$(document).on('mousedown','#printArea div',function (e) {
	//$('#printArea div,#printArea #mouldLogo').mousedown(function(){
		$(this).css("background-color","#FFFFCC");
		var x=$(this).position().top;
		var y=$(this).position().left; 
		var _width=$(this).width();
		var _height=$(this).height();
		$("#itemPosition").val(x+"px,"+y+"px");
		$("#itemId").val($(this).attr("id"));
		$("#itemName").val($(this).attr("name"));
		$("#itemType").val($(this).attr("itemtype"));
		$("#itemSize").val($(this).css("font-size")).trigger("change");
		$("#itemWeight").val($(this).css("font-weight")).trigger("change");
		$("#itemRemark").val($(this).attr("itemremark"));
		$("#itemDim").val(_width+"px,"+_height+"px");

	});	
	//当松开层移动的时候，背景色消失
	$(document).on('mouseup','#printArea div',function (e) {
		$(this).css("background-color","");
		var x=$(this).position().top;
		var y=$(this).position().left; 
		$("#itemPosition").val(x+"px,"+y+"px");
	});
	$(document).on('click','#printArea img',function (e) {
		var x=$(this).position().top;
		var y=$(this).position().left; 
		var _width=$(this).width();
		var _height=$(this).height();
		$("#itemPosition").val(x+"px,"+y+"px");
		$("#itemId").val($(this).attr("id"));
		$("#itemName").val($(this).attr("id"));
		$("#itemType").val($(this).attr("itemtype"));
		$("#itemSize").val($(this).css("font-size")).trigger("change");
		$("#itemWeight").val($(this).css("font-weight")).trigger("change");
		$("#itemRemark").val($(this).attr("itemremark"));
		$("#itemDim").val(_width+"px,"+_height+"px");

	});	
})

function DraggableResizable(){
	$("#printArea div,#printArea img").draggable({
		containment: "#printArea",
		cursor: "move"
	});
	$("#printArea div").resizable({
		containment: "#printArea",
		stop: function( event, ui ) {
			var _width=$(this).width();
			var _height=$(this).height();
			$("#itemDim").val(_width+"px,"+_height+"px");
		}
	});
}
function DraggableResizableToImg(o){
	$("#"+o+"").draggable({
		containment: "#printArea",
		cursor: "move"
	});
	// $("#"+o+"").resizable({
	// 	containment: "#printArea",
	// 	stop: function( event, ui ) {
	// 		var _width=$(this).width();
	// 		var _height=$(this).height();
	// 		$("#itemDim").val(_width+"px,"+_height+"px");
	// 	}
	// });
}
function DraggableResizableToNominate(o){
	$("#"+o+"").draggable({
		containment: "#printArea",
		cursor: "move"
	});
	$("#"+o+"").resizable({
		containment: "#printArea",
		stop: function( event, ui ) {
			var _width=$(this).width();
			var _height=$(this).height();
			$("#itemDim").val(_width+"px,"+_height+"px");
		}
	});
}


