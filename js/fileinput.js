//语言包
var cn2 = {
    "con_top_1": "首页",
    "con_top_2": "导入数据",
        };

var en2 = {
    "con_top_1": "Home",
    "con_top_2": "Upload Data",
        };

$(function () {
    var action = GetQueryString('action');
    if (action == 'truckcharge') {
        hasPermission('1416'); //权限控制：上传拖箱列表
        this.title = get_lan('con_top_2')
        $('#title0').text(get_lan('nav_4'))
        $('#title1').text(get_lan('con_top_2'))
        $('.navli4').addClass("active open")
        $('.rate3').addClass("active")
    } else if (action == 'localcharge') {
        hasPermission('1409'); //权限控制：上传本地费用列表
        this.title = get_lan('con_top_2')
        $('#title0').text(get_lan('nav_4'))
        $('#title1').text(get_lan('con_top_2'))
        $('.navli4').addClass("active open")
        $('.rate2').addClass("active")
    } else if (action == 'mail') {
        hasPermission('1202'); //权限控制：上传邮件列表
        this.title = get_lan('nav_6_1')
        $('#title0').text(get_lan('nav_6_1'))
        $('#title1').text(get_lan('con_top_2'))
        $('.navli6').addClass("active open")
        $('.emailprompt1').addClass("active")
    } else if (action == 'rate') {
        hasPermission('1403'); //权限控制：上传运价列表
        this.title = get_lan('con_top_2')
        $('#title0').text(get_lan('nav_4'))
        $('#title1').text(get_lan('con_top_2'))
        $('.navli4').addClass("active open")
        $('.rate1').addClass("active")
    }

	InitExcelFile()

    //初始化Excel导入的文件
	function InitExcelFile() {
	    $("#excelFile").fileinput({
	        uploadUrl: dataUrl + 'ajax/' + action + '.ashx?action=upload&companyId=' + companyID + '&userId=' + userID, //上传的地址
	        uploadAsync: true,              //异步上传
	        language: "zh",                 //设置语言
	        showCaption: false,              //是否显示标题
	        showUpload: true,               //是否显示上传按钮
	        showRemove: true,               //是否显示移除按钮
	        showPreview: true,             //是否显示预览按钮
	        browseClass: "btn btn-primary", //按钮样式 
	        dropZoneEnabled: true,         //是否显示拖拽区域
	        allowedFileExtensions: ["xls", "xlsx"], //接收的文件后缀
	        maxFileCount: 2,                        //最大上传文件数限制
	        previewFileIcon: '<i class="glyphicon glyphicon-file"></i>',
	        allowedPreviewTypes: null,
	        previewFileIconSettings: {
	            'docx': '<i class="glyphicon glyphicon-file"></i>',
	            'xlsx': '<i class="glyphicon glyphicon-file"></i>',
	            'pptx': '<i class="glyphicon glyphicon-file"></i>',
	            'jpg': '<i class="glyphicon glyphicon-picture"></i>',
	            'pdf': '<i class="glyphicon glyphicon-file"></i>',
	            'zip': '<i class="glyphicon glyphicon-file"></i>',
	        },
	        uploadExtraData: {  //上传的时候，增加的附加参数
	            folder: 'localcharge'
	        }
	    })  //文件上传完成后的事件
       .on('fileuploaded', function (event, data, previewId, index) {
           //var form = data.form, files = data.files, extra = data.extra,
           //    response = data.response, reader = data.reader;
           console.log(data)

           var res = data.response; //返回结果
           if (res.State == 1) {
               comModel("上传成功！")
               if (res.Fail != 0) {
                   var errortext = res.FailMes
                   errortext = errortext.substring(0, errortext.lastIndexOf(','));
                   $("#info").text('成功导入' + res.Data + '条数据，失败' + res.Fail + '条，失败的是第 ' + errortext + " 行数据")
               } else {
                   $("#info").text('成功导入' + res.Data + '条数据')
               }
               //提示用户Excel格式是否正常，如果正常加载数据
               //$.ajax({
               //    url: '/TestUser/CheckExcelColumns?guid=' + guid,
               //    type: 'get',
               //    dataType: 'json',
               //    success: function (data) {
               //        if (data.Success) {
               //            InitImport(guid); //重新刷新表格数据
               //            showToast("文件已上传，数据加载完毕！");

               //            //重新刷新GUID，以及清空文件，方便下一次处理
               //            RefreshExcel();
               //        }
               //        else {
               //            showToast("上传的Excel文件检查不通过。请根据页面右上角的Excel模板格式进行数据录入。", "error");
               //        }
               //    }
               //});
           }
           else {
               comModel("上传失败！")
           }
       });
	}
	
})



