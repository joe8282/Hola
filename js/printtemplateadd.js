//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "货物管理中心",
};

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "SHIPMENTS MANAGEMENT",
};


$(document).ready(function () {
    this.title = get_lan('nav_3_6')
    $('.navli3').addClass("active open")
    $('.book6').addClass("active")
    $('#title1').text(get_lan('nav_3_6'))
    $('#title2').text(get_lan('nav_3_6'))

    var action = GetQueryString('action');
    var Id = GetQueryString('Id');

	$("#addHLine").click(function () {  
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var HLine = '<div name="hline" id="hline' + _divLength + '" itemrelation="" itemtype="hline" style="border-top:1px solid black; height:10px; width:100px; left:10px; top:10px; font-size:12px; font-weight:400; position:absolute;"></div>';
		$("#printArea").append(HLine);
		$("#relation").hide();
		$("#name").hide();
		$("#size").hide();
		$("#weight").hide();
		$('#setForm').each(function (index) {
		    $('#setForm')[index].reset();
		});
		$("#item-Id").text("hline" + _divLength);
		$("#itemId").val("hline" + _divLength);
		$("#itemType").val("hline");
		DraggableResizableToNominate("hline"+_divLength);
	})
	$("#addVLine").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var VLine = '<div name="vline" id="vline' + _divLength + '" itemrelation="" itemtype="vline" style="border-left:1px solid black; height:100px; width:10px; left:10px; top:10px; font-size:12px; font-weight:400; position:absolute;"></div>';
		$("#printArea").append(VLine);
		$("#relation").hide();
		$("#name").hide();
		$("#size").hide();
		$("#weight").hide();
        $('#setForm').each(function (index) {
		    $('#setForm')[index].reset();
        });
        $("#item-Id").text("vline" + _divLength);
        $("#itemId").val("vline" + _divLength);
        $("#itemType").val("vline");
		DraggableResizableToNominate("vline"+_divLength);
	})
	$("#addSquare").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var Square = '<div name="square" id="square' + _divLength + '" itemrelation="" itemtype="square" style="border:1px solid black; height:100px; width:100px; left:10px; top:10px; font-size:12px; font-weight:400; position:absolute;"></div>';
		$("#printArea").append(Square);
		$("#relation").hide();
		$("#name").hide();
		$("#size").hide();
		$("#weight").hide();
		$('#setForm').each(function (index) {
		    $('#setForm')[index].reset();
		});
		$("#item-Id").text("square" + _divLength);
		$("#itemId").val("square" + _divLength);
		$("#itemType").val("square");
		DraggableResizableToNominate("square"+_divLength);
	})
	$("#addLabel").click(function() {
		var _divLength=$('#printArea').children('div').length; //统计#printArea下面的DIV个数
		var Label = '<div name="label" id="label' + _divLength + '" itemrelation="" itemtype="label" style="height:50px; width:120px; left:10px; top:10px; font-size:12px; font-weight:400; z-index:99; position:absolute;"><p>Label and Text Area</p></div>';
		$("#printArea").append(Label);
		$("#relation").hide();
		$("#name").show();
		$("#size").show();
		$("#weight").show();
		$('#setForm').each(function (index) {
		    $('#setForm')[index].reset();
		});
		$("#itemName").val('Label and Text Area');
		$("#item-Id").text("label" + _divLength);
		$("#itemId").val("label" + _divLength);
		$("#itemType").val("label");
		DraggableResizableToNominate("label"+_divLength);
	})
	$("#addData").click(function () {
	    //var _divLength = $('#printArea').children('div').length; //统计#printArea下面的DIV个数
	    var _divLastId = $('#printArea').children('div').last().attr('id')
	    var _divLength = parseInt(_divLastId.substring(4)) + 1
	    var Data = '<div name="data" id="data' + _divLength + '" itemrelation="" itemtype="data" style="height:100px; width:100px; left:10px; top:10px; font-size:12px; font-weight:400; z-index:99; position:absolute;"><p></p></div>';
	    $("#printArea").append(Data);
	    $("#relation").show();
	    $("#name").hide();
	    $("#size").show();
	    $("#weight").show();
	    $('#setForm').each(function (index) {
	        $('#setForm')[index].reset();
	    });
	    $("#item-Id").text("data" + _divLength);
	    $("#itemId").val("data" + _divLength);
	    $("#itemType").val("data");
	    DraggableResizableToNominate("data" + _divLength);
	})

	$("#addImg").click(function () {
	    $("#myModal_img").modal("show");
	    //console.log($(this).attr('id'))
	    $('#setForm').each(function (index) {
	        $('#setForm')[index].reset();
	    });
	    $("#name").hide();
	    $("#relation").hide();
	    $("#size").hide();
	    $("#weight").hide();
	})
	$("#btnImgSave").click(function () {
	    var img = $("#imgfile")[0].files[0];
	    // 判断是否图片  
	    if (!img) {
	        return;
	    }

	    // 判断图片格式  
	    if (!(img.type.indexOf('image') == 0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name))) {
	        alert('图片只能是jpg,gif,png');
	        return;
	    }

	    var reader = new FileReader();
	    reader.readAsDataURL(img);

	    reader.onload = function (e) { // reader onload start  
	        // ajax 上传图片  
	        $.post(dataUrl + "ajax/uploadPic.ashx", { image: e.target.result, action: 'print' }, function (ret) {
	            if (ret.State == '100') {
	                //alert(ret.Picurl);
	                var _divLength = $('#printArea').children('div').length; //统计#printArea下面的DIV个数
	                console.log(_divLength)
	                //var Label = '<div name="img" id="img' + _divLength + '" itemrelation="" itemtype="img" style="left:0px; top:0px; position:absolute;"><img src="' + ret.Picurl + '" width="100%"></div>';
	                if (ret.PicWidth > 1200) {
	                    var bili = 1200 / ret.PicWidth
	                    ret.PicWidth = 1200;
	                    ret.PicHeight = ret.PicHeight * bili
	                }
	                var Image = '<img src="' + ret.Picurl + '" name="img" id="img' + _divLength + '" itemrelation="" itemtype="img" style="height:' + ret.PicHeight + 'px; width:' + ret.PicWidth + 'px; left:0px; top:0px; position:absolute;">';
	                $("#printArea").append(Image);
	                $("#item-Id").text("img" + _divLength);
	                $("#itemId").val("img" + _divLength);
	                $("#itemType").val("img");
	                DraggableResizableToImg("img" + _divLength);
	                $("#imgfile").val('')
	                $("#myModal_img").modal("hide");

	            } else {
	                alert('上传失败');
	            }
	        }, 'json');
	    } // reader onload end  
	})

	$('#printControl select').on('change', function () {
		if($(this).attr("id")=="itemSize"){
		    $("#" + $("#itemId").val() + "").css("font-size", $(this).val());
		}else if($(this).attr("id")=="itemWeight"){
		    $("#" + $("#itemId").val() + "").css("font-weight", $(this).val());
		} else if ($(this).attr("id") == "itemRelation") {
		    $("#" + $("#itemId").val() + "").attr("itemrelation", $(this).val());
		}
	})
	$('#printControl textarea').keyup(function () {
	    if ($(this).attr("id") == "itemName") {    
	        $("#" + $("#itemId").val() + " p").text($(this).val());
	    }
	})


	$("#btnSubmit").click(function () {
	    //console.log($("#itemId").val())
	    //$("#" + $("#itemId").val() + "").attr("itemrelation", $("itemRelation").val());
	    //$("#" + $("#itemId").val() + "").css("font-size", $("itemSize").val());
	    //$("#" + $("#itemId").val() + "").css("font-weight", $("itemWeight").val());
	    $('#printArea .ui-resizable-handle').remove()
	    $('#printArea img').parent().remove()
	    console.log($("#printArea").html())
	})

	$('#btnDelete').on('click', function () {
	    console.log($("#itemId").val())
	    console.log($("#itemType").val())
	    if ($("#itemType").val() == 'img') {
	        $("#" + $("#itemId").val() + "").parent().remove();
	        $("#" + $("#itemId").val() + "").remove();
	    } else {
	        $("#" + $("#itemId").val() + "").remove();
	    }
	    $('#setForm').each(function (index) {
	        $('#setForm')[index].reset();
	    });
	})

	//$('#itemRemark').on('change',function(){
	//	var _changeLabelContent;
	//	_changeLabelContent=$("#"+$("#itemId").val()+"").attr("name");
	//	if(_changeLabelContent=="label"){
	//		$("#"+$("#itemId").val()+"").html(HtmlEncode($(this).val()));
	//		$("#"+$("#itemId").val()+"").attr("itemremark",$(this).val());
	//	}else{
	//		$("#"+$("#itemId").val()+"").attr("itemremark",$(this).val());
	//	}
	//})

	//当按下层的时候，移动会有背景色
	$(document).on('mousedown', '#printArea div,#printArea img', function (e) {
	    //$('#printArea div,#printArea #mouldLogo').mousedown(function(){
		$(this).css("background-color","#FFFFCC");
		var x=$(this).position().top;
		var y=$(this).position().left; 
		var _width=$(this).width();
		var _height = $(this).height();
		if ($(this).attr("id") != null) {
		    $("#item-Id").text($(this).attr("id"));
		    $("#itemId").val($(this).attr("id"));
		    $("#itemType").val($(this).attr("itemtype"));
		}
		$("#itemName").val($(this).text());
		//$("#itemPosition").val(x+"px,"+y+"px");
		$("#itemRelation").val($(this).attr("itemrelation"));
		$("#itemSize").val($(this).css("font-size"));
		$("#itemWeight").val($(this).css("font-weight"));
		//$("#itemRemark").val($(this).attr("itemremark"));
	    //$("#itemDim").val(_width+"px,"+_height+"px");
		var itemtype = $(this).attr("itemtype")
		if (itemtype == 'hline' || itemtype == 'vline' || itemtype == 'square' || itemtype == 'img') { $("#name").hide(); $("#relation").hide(); $("#size").hide(); $("#weight").hide(); }
		if (itemtype == 'label') { $("#name").show(); $("#relation").hide(); $("#size").show(); $("#weight").show(); }
		if (itemtype == 'data') { $("#name").hide(); $("#relation").show(); $("#size").show(); $("#weight").show(); }
		
	});	
	//当松开层移动的时候，背景色消失
	$(document).on('mouseup', '#printArea div,#printArea img', function (e) {
		$(this).css("background-color","");
		var x=$(this).position().top;
		var y=$(this).position().left; 
	    //$("#itemPosition").val(x+"px,"+y+"px");
		//$("#" + $("#itemId").val() + "").css("top", x + "px");
		//$("#" + $("#itemId").val() + "").css("left", y + "px");
	});
	//$(document).on('click','#printArea img',function (e) {
	//	var x=$(this).position().top;
	//	var y=$(this).position().left; 
	//	var _width=$(this).width();
	//	var _height=$(this).height();
	//	$("#itemId").val($(this).attr("id"));
	//	$("#itemType").val($(this).attr("itemtype"));
	//    //$("#itemPosition").val(x+"px,"+y+"px");
	//	$("#itemRelation").val($(this).attr("itemrelation")).trigger("change");
	//	$("#itemSize").val($(this).css("font-size")).trigger("change");
	//	$("#itemWeight").val($(this).css("font-weight")).trigger("change");
	//	//$("#itemRemark").val($(this).attr("itemremark"));
	//    //$("#itemDim").val(_width+"px,"+_height+"px");

	//	$("#name").hide(); $("#relation").hide(); $("#size").hide(); $("#weight").hide();

    //});	

	if (action == 'modify') {
    	hasPermission('1719'); //权限控制
	    common.ajax_req("get", false, dataUrl, "printtemplate.ashx?action=readbyid", {
	        "Id": Id
	    }, function (data) {
	        //console.log(data.Data)
	        //初始化信息
	        var _data = data.Data
	        $('#tpName').val(_data.prtp_name)
	        $('#tpType').val(_data.prtp_typeId).trigger("change"),
			$('#printArea').html(_data.prtp_content)
	    }, function (err) {
	        console.log(err)
	    }, 5000)

	    DraggableResizable()

	} else {
    	hasPermission('1718'); //权限控制
	}


	$("#btnSave").click(function () {
	    //console.log($("#itemId").val())
	    $('#printArea .ui-resizable-handle').remove()
	    $('#printArea img').parent().remove()
	    console.log($("#printArea").html())
	    var tpName = $("#tpName").val(), tpContent = $("#printArea").html(), tpType = $("#tpType").val()
	    if (tpName == '') {
	        comModel("请输入模板名称")
	    } else if (tpContent == '') {
	        comModel("请在画布中做出模板")
	    } else {
	        if (action == 'add') {
	            var parm = {
	                'companyId': companyID,
	                'userId': userID,
	                'name': tpName,
	                'content': tpContent,
	                'typeId': tpType,
	            }

	            common.ajax_req('POST', false, dataUrl, 'printtemplate.ashx?action=new', parm, function (data) {
	                if (data.State == 1) {
	                    comModel("新增模板成功")
	                    location.href = 'printtemplatelist.html';
	                }else {
	                    comModel("新增模板失败")
	                }
	            }, function (error) {
	                console.log(parm)
	            }, 10000)
	        }
	        if (action == 'modify') {
	            var parm = {
	                'Id': Id,
	                //'companyId': companyID,
	                'userId': userID,
	                'name': tpName,
	                'content': tpContent,
	                'typeId': tpType,
	            }

	            common.ajax_req('POST', false, dataUrl, 'printtemplate.ashx?action=modify', parm, function (data) {
	                if (data.State == 1) {
	                    comModel("修改模板成功")
	                    location.href = 'printtemplatelist.html';
	                } else {
	                    comModel("修改模板失败")
	                }
	            }, function (error) {
	                console.log(parm)
	            }, 10000)
	        }

	    }
	})
})

function DraggableResizable() {
    $("#printArea div").resizable({
        containment: "#printArea",
        stop: function (event, ui) {
            //var _width = $(this).width();
            //var _height = $(this).height();
            //$("#itemDim").val(_width + "px," + _height + "px");
        }
    });
    $("#printArea div").draggable();

    $("#printArea img").resizable({
        containment: "#printArea",
        stop: function (event, ui) {
            //var _width = $(this).width();
            //var _height = $(this).height();
            //$("#itemDim").val(_width + "px," + _height + "px");
        }
    });
    $("#printArea img").parent().draggable();
}
function DraggableResizableToImg(o){
    $("#" + o + "").resizable({
        containment: "#printArea",
        stop: function (event, ui) {
            //var _width=$(this).width();
            //var _height=$(this).height();
            //$("#itemDim").val(_width+"px,"+_height+"px");
        }
    });
    $("#" + o + "").parent().draggable();
}
function DraggableResizableToNominate(o) {
	$("#"+o+"").resizable({
	    containment: "#printArea",
	    //start: function (event, ui) {
	    //    //$(this).css("font-size","")
	    //},
		stop: function( event, ui ) {
			//var _width=$(this).width();
			//var _height=$(this).height();
		    //$("#itemDim").val(_width+"px,"+_height+"px");
		}
	});
	$("#" + o + "").draggable();
}

