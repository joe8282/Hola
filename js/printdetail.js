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
    this.title = get_lan('nav_3_7')
    $('.navli3').addClass("active open")
    $('.book6').addClass("active")
    $('#title1').text(get_lan('nav_3_7'))
    $('#title2').text(get_lan('nav_3_7'))

    var action = GetQueryString('action');
    var Id = GetQueryString('Id');
    var typeId = GetQueryString('typeId');
    var aboutId = GetQueryString('aboutId');
    var PrintTpId = 0;
    var bookingId = 0;

    //加载信息
    var mblData,hblData
    if (typeId == 1 || typeId == 2) {
        bookingId = aboutId
        common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
            "Id": bookingId
        }, function (data) {
            console.log(data.Data)
            //初始化信息
            mblData = data.Data

        }, function (err) {
            console.log(err)
        }, 1000)
    } else if (typeId == 3) {
        common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbillbyid", {
            "Id": aboutId
        }, function (data) {
            console.log(data.Data)
            //初始化信息
            hblData = data.Data
            bookingId = hblData["bobi_bookingId"]
            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readbyid", {
                "Id": bookingId
            }, function (data) {
                console.log(data.Data)
                //初始化信息
                mblData = data.Data

            }, function (err) {
                console.log(err)
            }, 1000)
        }, function (err) {
            console.log(err)
        }, 1000)

    }


    //加载所有模板列表
    common.ajax_req("get", true, dataUrl, "printtemplate.ashx?action=read", {
        "companyId": companyID,
        "typeId": typeId
    }, function (data) {
        var _data = data.data;
        for (var i = 0; i < _data.length; i++) {
            //var trailerlist = '<div style="margin: 5px 0px;">' + _data[i].comp_name + '&nbsp;&nbsp;&nbsp;&nbsp;地址：' + _data[i].botr_address + '&nbsp;&nbsp;&nbsp;&nbsp;联系人：' + _data[i].botr_contact + '&nbsp;&nbsp;&nbsp;&nbsp;联系方式：' + _data[i].botr_contactWay + '&nbsp;&nbsp;&nbsp;&nbsp;时间：' + _data[i].botr_time + '&nbsp;&nbsp;&nbsp;&nbsp;柜型：' + _data[i].botr_container + '&nbsp;&nbsp;&nbsp;&nbsp;<a class="deleteTrailer" artiid="' + _data[i].botr_id + '">删除</a></div>'
            var _html = '<li><a href="javascript:void(0);" class="printTp" printTpId="' + _data[i].prtp_id + '">' + _data[i].prtp_name + '</a></li>'
            $("#printTpList").append(_html)
        }

        $(".printTp").click(function () {
            PrintTpId = $(this).attr("printTpId")
            console.log(PrintTpId)
            common.ajax_req("get", false, dataUrl, "printtemplate.ashx?action=readbyid", {
                "Id": PrintTpId
            }, function (data) {
                //console.log(data.Data)
                //初始化信息
                var _data = data.Data
                $('#printArea').html(_data.prtp_content)
                DraggableResizable()
                var divArr = $('#printArea div');
                $.each(divArr, function (i, n) {
                    if ($(this).attr("itemtype") == "data")
                    {
                        var id = $(this).attr("id")
                        if ($(this).attr("itemrelation") == 'book_crmCompanyId' || $(this).attr("itemrelation") == 'book_warehouse' || $(this).attr("itemrelation") == 'book_forwarder') {
                            var value = mblData[$(this).attr("itemrelation")]
                            common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=readbyid", {
                                "Id": value
                            }, function (data) {
                                var _data = data.Data;
                                $("#" + id + "").find("p").html(_data.comp_name);
                            }, function (err) {
                                console.log(err)
                            }, 2000)
                        } else if ($(this).attr("itemrelation") == 'bookingTrailer') {  //拖车信息数据集
                            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readtrailer", {
                                "bookingId": bookingId
                            }, function (data) {
                                //console.log(data.Data)
                                if (data.State == 1) {
                                    var _html = '<table class="table table-striped table-hover table-bordered trailerAll" cellspacing="0" width="100%" id="exampleTrailer">' +
                                        '<tr><td>车行</td><td>装箱公司</td><td>地址</td><td>联系人</td><td>联系方式</td><td>时间</td><td>柜型</td><td>SO号码</td><td>备注</td></tr>'
                                    var _data = data.Data;
                                    for (var i = 0; i < _data.length; i++) {
                                        var trailerlist = '<tr><td> ' + _data[i].comp_name + '</td><td> ' + _data[i].packing_comp_name + '</td><td>' + _data[i].botr_address + '</td><td>' + _data[i].botr_contact + '</td><td>' + _data[i].botr_contactWay + '</td><td>' + _data[i].botr_time.substring(0, 10) + '</td><td>' + _data[i].botr_container + '</td><td> ' + _data[i].botr_so + '</td><td>' + _data[i].botr_remark + '</td></tr>'
                                        _html = _html + trailerlist
                                    }
                                    _html = _html + '</table>'
                                    $("#" + id + "").find("p").html(_html);
                                    console.log($(this).attr("itemrelation"))
                                }
                            }, function (err) {
                                console.log(err)
                            }, 2000)
                        } else if ($(this).attr("itemrelation") == 'bookingContainer') {  //集装箱信息数据集
                            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readcontainer", {
                                "whichId": 1,
                                "bookingId": bookingId
                            }, function (data) {
                                //console.log(data.Data)
                                if (data.State == 1) {
                                    var _html = ''
                                    var _data = data.Data;
                                    for (var i = 0; i < _data.length; i++) {
                                        var trailerlist = '<div>' + _data[i].boco_number + '/' + _data[i].boco_sealNumber + '/' + _data[i].boco_typeName + '/' + _data[i].boco_package + '/' + _data[i].boco_weight + '/' + _data[i].boco_volume + '</div>'
                                        _html = _html + trailerlist
                                    }
                                    $("#" + id + "").find("p").html(_html);
                                }
                            }, function (err) {
                                console.log(err)
                            }, 2000)
                        } else if ($(this).attr("itemrelation") == 'bookingVGM') {  //集装箱VGM信息
                            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readvgmbyid", {
                                "bookingId": bookingId
                            }, function (data) {
                                //console.log(data.Data)
                                if (data.State == 1) {
                                    var _data = data.Data;
                                    var _html = '<table class="table table-striped table-hover table-bordered trailerAll" cellspacing="0" width="100%" id="exampleTrailer">' +
                                        '<tr><td>VGM</td><td>VGM方式</td><td>称重日期</td><td>责任方</td><td>授权人</td><td>称重人</td><td>备注</td></tr>'
                                    var trailerlist = '<tr><td> ' + _data.vgm_num + _data.vgm_unit + '</td><td> ' + _data.vgm_way + '</td><td> ' + _data.vgm_weighingDate.substring(0, 10) + '</td><td>' + _data.vgm_responsibility + '</td><td>' + _data.vgm_authorize + '</td><td>' + _data.vgm_weighing + '</td><td>' + _data.vgm_beizhu + '</td></tr>'
                                    _html = _html + trailerlist
                                    _html = _html + '</table>'
                                    $("#" + id + "").find("p").html(_html);
                                }
                            }, function (err) {
                                console.log(err)
                            }, 2000)
                        } else if ($(this).attr("itemrelation") == 'bobi_containerType') {  //HBL柜号
                            var _html = ''
                            common.ajax_req("get", true, dataUrl, "booking.ashx?action=readcontainer", {
                                "whichId": 2,
                                "bookingId": bookingId
                            }, function (data) {
                                //console.log(data.Data)
                                if (data.State == 1) {
                                    var _html = ''
                                    var _data = data.Data;
                                    for (var i = 0; i < _data.length; i++) {
                                        var trailerlist = '<div>' + _data[i].boco_number + '/' + _data[i].boco_sealNumber + '/' + _data[i].boco_typeName + '/' + _data[i].boco_package + '/' + _data[i].boco_weight + '/' + _data[i].boco_volume + '</div>'
                                        _html = _html + trailerlist
                                    }
                                    $("#" + id + "").find("p").html(_html);
                                }
                            }, function (err) {
                                console.log(err)
                            }, 2000)
                        } else {
                            console.log($(this).attr("itemrelation"))
                            //console.log(mblData[$(this).attr("itemrelation")])
                            //if ($(this).attr("itemrelation").indexOf('Time') > 0 && (mblData[$(this).attr("itemrelation")] != null || mblData[$(this).attr("itemrelation")] != '')) {
                            //    var value = mblData[$(this).attr("itemrelation")].substring(0, 10)
                            //    $(this).find("p").html(value);
                            //} else {
                            //    var value = mblData[$(this).attr("itemrelation")]
                            //    $(this).find("p").html(value);
                            //}
                            var value = ''
                            if ($(this).attr("itemrelation").indexOf("Time") >= 0) {
                                if ($(this).attr("itemrelation").indexOf("book_") >= 0 && (mblData[$(this).attr("itemrelation")] != null || mblData[$(this).attr("itemrelation")] != '')) {
                                    value = mblData[$(this).attr("itemrelation")].substring(0, 10)
                                } else if ($(this).attr("itemrelation").indexOf("bobi_") >= 0 && (hblData[$(this).attr("itemrelation")] != null || hblData[$(this).attr("itemrelation")] != '')) {
                                    value = hblData[$(this).attr("itemrelation")].substring(0, 10)
                                }
                            } else {
                                if ($(this).attr("itemrelation").indexOf("book_") >= 0) {
                                    value = mblData[$(this).attr("itemrelation")]
                                } else if ($(this).attr("itemrelation").indexOf("bobi_") >= 0) {
                                    if (hblData.hasOwnProperty($(this).attr("itemrelation"))) {
                                        value = hblData[$(this).attr("itemrelation")]
                                    }   
                                }
                            }
                            $(this).find("p").html(value);

                        }
                    }
                    $(this).css("word-wrap","break-word"); //by daniel 2021-5-25
                    $(this).css("overflow","hidden"); //by daniel 2021-5-25
                });
            }, function (err) {
                console.log(err)
            }, 5000)


        })

    }, function (err) {
        console.log(err)
    }, 2000)





	$("#addHLine").click(function () {  
	    //var _divLength = $('#printArea').children('div').length; //统计#printArea下面的DIV个数
	    var _divLastId = $('#printArea').children('div').last().attr('id')
	    var _divLength = parseInt(_divLastId.substring(4)) + 1
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
	    //var _divLength = $('#printArea').children('div').length; //统计#printArea下面的DIV个数
	    var _divLastId = $('#printArea').children('div').last().attr('id')
	    var _divLength = parseInt(_divLastId.substring(4)) + 1
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
	    //var _divLength = $('#printArea').children('div').length; //统计#printArea下面的DIV个数
	    var _divLastId = $('#printArea').children('div').last().attr('id')
	    var _divLength = parseInt(_divLastId.substring(4)) + 1
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
	    //var _divLength = $('#printArea').children('div').length; //统计#printArea下面的DIV个数
	    var _divLastId = $('#printArea').children('div').last().attr('id')
	    var _divLength = parseInt(_divLastId.substring(4)) + 1
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
	    var Data = '<div name="data" id="data' + _divLength + '" itemrelation="" itemtype="data" style="height:100px; width:100px; left:10px; top:10px; font-size:12px; font-weight:400; z-index:99; position:absolute; word-wrap: break-all;"><p>Data Content</p></div>';
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

	$('#printControl select').on('change',function(){
		if($(this).attr("id")=="itemSize"){
		    $("#" + $("#itemId").val() + "").css("font-size", $(this).val());
		}else if($(this).attr("id")=="itemWeight"){
		    $("#" + $("#itemId").val() + "").css("font-weight", $(this).val());
		} else if ($(this).attr("id") == "itemRelation") {
		    $("#" + $("#itemId").val() + "").attr("itemrelation", $(this).val());
		    //console.log(value)
		    if ($(this).val() == 'book_crmCompanyId' || $(this).val() == 'book_warehouse' || $(this).val() == 'book_forwarder') {
		        var value = mblData[$(this).val()]
		        common.ajax_req("get", true, dataUrl, "crmcompany.ashx?action=readbyid", {
		            "Id": value
		        }, function (data) {
		            var _data = data.Data;
		            $("#" + $("#itemId").val() + " p").html(_data.comp_name);
		        }, function (err) {
		            console.log(err)
		        }, 2000)
		    } else if ($(this).val() == 'bookingTrailer') {  //拖车信息数据集
		        common.ajax_req("get", true, dataUrl, "booking.ashx?action=readtrailer", {
		            "bookingId": bookingId
		        }, function (data) {
		            //console.log(data.Data)
		            if (data.State == 1) {
		                var _html = '<table class="table table-striped table-hover table-bordered trailerAll" cellspacing="0" width="100%" id="exampleTrailer">' +
                            '<tr><td>车行</td><td>装箱公司</td><td>地址</td><td>联系人</td><td>联系方式</td><td>时间</td><td>柜型</td><td>SO号码</td><td>备注</td></tr>'
		                var _data = data.Data;
		                for (var i = 0; i < _data.length; i++) {
		                    var trailerlist = '<tr><td> ' + _data[i].comp_name + '</td><td> ' + _data[i].packing_comp_name + '</td><td>' + _data[i].botr_address + '</td><td>' + _data[i].botr_contact + '</td><td>' + _data[i].botr_contactWay + '</td><td>' + _data[i].botr_time.substring(0, 10) + '</td><td>' + _data[i].botr_container + '</td><td> ' + _data[i].botr_so + '</td><td>' + _data[i].botr_remark + '</td></tr>'
		                    _html = _html + trailerlist
		                }
		                _html = _html + '</table>'
		                $("#" + $("#itemId").val() + " p").html(_html);
		            }
		        }, function (err) {
		            console.log(err)
		        }, 2000)
		    } else if ($(this).val() == 'bookingContainer') {  //集装箱信息数据集
		        common.ajax_req("get", true, dataUrl, "booking.ashx?action=readcontainer", {
		            "whichId": 1,
		            "bookingId": bookingId
		        }, function (data) {
		            //console.log(data.Data)
		            if (data.State == 1) {
		                var _html = ''
		                var _data = data.Data;
		                for (var i = 0; i < _data.length; i++) {
		                    var trailerlist = '<div>' + _data[i].boco_number + '/' + _data[i].boco_sealNumber + '/' + _data[i].boco_typeName + '/' + _data[i].boco_package + '/' + _data[i].boco_weight + '/' + _data[i].boco_volume + '</div>'
		                    _html = _html + trailerlist
		                }
		                $("#" + $("#itemId").val() + " p").html(_html);
		            }
		        }, function (err) {
		            console.log(err)
		        }, 2000)
		    } else if ($(this).val() == 'bookingVGM') {  //集装箱VGM信息
		        common.ajax_req("get", true, dataUrl, "booking.ashx?action=readvgmbyid", {
		            "bookingId": bookingId
		        }, function (data) {
		            //console.log(data.Data)
		            if (data.State == 1) {
		                var _data = data.Data;
		                var _html = '<table class="table table-striped table-hover table-bordered trailerAll" cellspacing="0" width="100%" id="exampleTrailer">' +
                            '<tr><td>VGM</td><td>VGM方式</td><td>称重日期</td><td>责任方</td><td>授权人</td><td>称重人</td><td>备注</td></tr>'
		                var trailerlist = '<tr><td> ' + _data.vgm_num + _data.vgm_unit + '</td><td> ' + _data.vgm_way + '</td><td> ' + _data.vgm_weighingDate.substring(0, 10) + '</td><td>' + _data.vgm_responsibility + '</td><td>' + _data.vgm_authorize + '</td><td>' + _data.vgm_weighing + '</td><td>' + _data.vgm_beizhu + '</td></tr>'
		                _html = _html + trailerlist
		                _html = _html + '</table>'
		                $("#" + $("#itemId").val() + " p").html(_html);
		            }
		        }, function (err) {
		            console.log(err)
		        }, 2000)
		    } else {
		        //var value = mblData[$(this).val()]
		        //$("#" + $("#itemId").val() + " p").html(value);
		        var value = ''
		        if ($(this).val().indexOf("Time") >= 0) {
		            if ($(this).val().indexOf("book_") && (mblData[$(this).val()] != null || mblData[$(this).val()] != '')) {
		                value = mblData[$(this).val()].substring(0, 10)
		            } else if ($(this).val().indexOf("bobi_") && (hblData[$(this).val()] != null || hblData[$(this).val()] != '')) {
		                value = hblData[$(this).val()].substring(0, 10)
		            }
		        } else {
		            if ($(this).val().indexOf("book_") >= 0) {
		                value = mblData[$(this).val()]
		            } else if ($(this).val().indexOf("bobi_") >= 0) {
		                value = hblData[$(this).val()]
		            }
		        }
		        $("#" + $("#itemId").val() + " p").html(value);
		    }
		    
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
	    console.log($(this).attr("itemrelation"))
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
	    //$("#itemRelation").val($(this).attr("itemrelation")).trigger("change");
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
	    common.ajax_req("get", false, dataUrl, "printrecord.ashx?action=readbyid", {
	        "Id": Id
	    }, function (data) {    
	        //初始化信息
	        var _data = data.Data
            PrintTpId = _data.prre_templateId
            $('#printArea').html(_data.prre_content)
            //console.log(_data.prre_content)
	    }, function (err) {
	        console.log(err)
	    }, 5000)

	    DraggableResizable()

	} else {

	}


	$("#btnSave").click(function () {
	    //console.log($("#itemId").val())
	    //console.log($("#printArea").html())
	    console.log($("#printArea .ui-wrapper").length)
	    if ($("#printArea .ui-wrapper").length>0) {
	        $('#printArea .ui-resizable-handle').remove()
	        $('#printArea img').parent().remove()
	    }
	    //console.log($("#printArea").html())
	    //return false
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
	            //生成图片并保存文件记录，JOE新增
	            html2canvas(document.getElementById("printArea"), {
	                onrendered: function (canvas) {
	                    var url = canvas.toDataURL('image/jpeg', 1.0);
	                    //console.log(url)
	                    // ajax 上传图片  
	                    //$.post(dataUrl + "ajax/uploadPic.ashx", { image: url, action: 'print' }, function (ret) {
	                    //    if (ret.State == '100') {

	                    //    } else {
	                    //        alert('上传失败');
	                    //    }
	                    //}, 'json');
	                    var parm = {
	                        'companyId': companyID,
	                        'userId': userID,
	                        'aboutId': aboutId,
	                        'templateId': PrintTpId,
	                        'content': content,
	                        'typeId': typeId
	                    }

	                    common.ajax_req('POST', false, dataUrl, 'printrecord.ashx?action=new', parm, function (data) {
	                        if (data.State == 1) {
	                            comModel("已生成打印记录")
	                            //location.href = 'booking.html';
	                        } else {
	                            comModel("生成打印记录失败")
	                        }
	                    }, function (error) {
	                        console.log(parm)
	                    }, 10000)
	                },
	                //背景设为白色（默认为黑色）
	                background: "#FBFBFB"
	            })



	        }))
	    });
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
function DraggableResizableToImg(o) {
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
    $("#" + o + "").resizable({
        containment: "#printArea",
        stop: function (event, ui) {
            //var _width=$(this).width();
            //var _height=$(this).height();
            //$("#itemDim").val(_width+"px,"+_height+"px");
        }
    });
    $("#" + o + "").draggable();
}
