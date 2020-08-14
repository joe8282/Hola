//语言包
var cn2 = {
            "con_top_1" : "首页",
            "con_top_2" : "财务管理中心",   
        };

var en2 = {
            "con_top_1" : "Home",
            "con_top_2" : "Invoice",        
        };

$(function(){
	this.title = get_lan('nav_5_3') 	
	$('.navli5').addClass("active open")
	$('.financial3').addClass("active")	
	$('#title1').text(get_lan('nav_5_3'))
	$('#title2').text(get_lan('nav_5_3')) 
	
	var Id = GetQueryString('Id');

	// var c=document.getElementById("myCanvas");
	// var ctx=c.getContext("2d");
	// var img=new Image()
	// img.src="http://localhost/upload/img/tidan.jpg"
	// ctx.drawImage(img,100,100);

	//  ctx.fillStyle = "rgb(200,0,0)";  // 把「填滿樣式」設為紅 200 綠 0 藍 0
 // ctx.fillRect (10, 10, 30, 30);   // 畫一個填充的長方形

 // ctx.fillStyle = "rgba(0, 0, 200, 0.5)"; // 把「填滿樣式」設為紅 0 綠 0 藍 200 透度 0.5
 // ctx.fillRect (20, 20, 30, 30);          // 畫一個填充的長方形


 // ctx.fillStyle = "rgba(0, 200, 0, 0.5)"; // 把「填滿樣式」設為紅 0 綠 200 藍 0 透度 0.5
 // ctx.fillRect (30, 30, 30, 30);          // 畫一個填充的長方形


    var $my_canvas=$("#myCanvas");  
    var my_canvas=$my_canvas[0];  
    var context=my_canvas.getContext("2d");  
    // var footprint_img=document.getElementById("footprint");  
    // var footprint_img=new Image();  
    // footprint_img.src="footprint.jpg";  
    preImage("upload/img/newholahbl.bmp",function(){  
        context.drawImage(this,0,0,766,1100);  
    });  


})



function preImage(url,callback){  
     var img = new Image(); //创建一个Image对象，实现图片的预下载  
     img.src = url;  
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
         callback.call(img);  
        return; // 直接返回，不用再处理onload事件  
     }  
     img.onload = function () { //图片下载完毕时异步调用callback函数。  
         callback.call(img);//将回调函数的this替换为Image对象  
     };  
}  



