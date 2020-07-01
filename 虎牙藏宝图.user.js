// ==UserScript==
// @name         虎牙藏宝图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.huya.com/*
// @grant        none
// ==/UserScript==

//领在线宝箱
var maxTab = 30;//最多页面数
function getBox(){
	var btns = document.getElementsByClassName('player-box-stat3');
    for(var i=0;i<btns.length;i++){
        var btn = btns[i];
        if(btn.style.visibility=="visible"){
            btn.click();
            document.getElementById("player-box").style.display="none";
           }
    }
}
//写cookies
function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg)){
    	return unescape(arr[2]);
    }else{
    	return null;
    }
}
//数字正则
function checkRate(input) {
　　if(!isNaN(input) && input != 0){
        return 1;
    }else{
        return 0;
    }
}
function getFlageNum(flagNum){
    if(flagNum == null ){return 0;}
    var array = flagNum.split("A");
    var s = array.length;
    if(s == null || s <= 0){s = 0;}
    return s;
}
//检查是否有需要关闭的
function check(){

	var url = window.location.href;
    var roomNo = url.replace("https://www.huya.com/","");
	if(url.indexOf("a=1") != -1 || url =="https://www.huya.com"){//有或者首页 则不关闭
	}else{
		if (document.getElementsByClassName('btn-wrap') == null || document.getElementsByClassName('btn-wrap')[0] == null) {
            //清掉cookie
            if (checkRate(roomNo)) {
                roomNo = "A"+roomNo;
                var cookie = getCookie("flag");
                setCookie("flag",cookie.replace(roomNo,""));
                document.write("<script language=\"javascript\">window.opener=null;window.close();<\/script>");
            }
		}
	}

}
//刷新操作
function reload(){
    var url = window.location.href;
	if(url.indexOf("a=1") != -1){//有 则设置定时器 3分钟一刷
		window.setInterval(function() {
            window.location.reload();
        }, 180000);
	}
}
//根据参数判断哪个可以点击礼物
function clicks(obj){
	var url = window.location.href;
	if(url.indexOf("a=1") != -1){//有 则点击
		obj.click();
	}

}
//点击后要删除横幅
////不删了  改class名(不针对滚动的礼物横幅)
function del(className){
	var theClassName = document.getElementsByClassName(className);
	theClassName[0].remove(theClassName);
}
//发送弹幕
function outInput(){
	var usable = document.getElementsByClassName('usable');//可领
    var disable = document.getElementsByClassName('disable');//已领
    var pub_msg_input = document.getElementById('pub_msg_input');//输入框
    if (pub_msg_input == null) {return;}
	var url = window.location.href;
	if((usable == null || usable[0] ==null) && (disable == null || disable[0] == null) && url.indexOf("a=1") == -1){
		pub_msg_input.value="66666";
		document.getElementById('msg_send_bt').className = "enable";
		document.getElementById('msg_send_bt').click();
	}
}
function removeVideo(){
    var url = window.location.href;
    if(url.indexOf("a=1") == -1 && document.getElementById('player-wrap') != null){//没有 删掉视频
       document.getElementById('player-wrap').remove();

    }
}
//触发横幅的跳转方法(需要拿id点击id并删除横幅的)
function openNweTab(className){
	var theClassName = document.getElementsByClassName(className);
    if (theClassName != null && theClassName[0] != null) {
    	var content = theClassName[0].innerHTML;
	    if(content != null){
	        //是否有宝箱
	        if(content.indexOf("直播间") != -1){//有 则点击宝箱
	            var id = document.getElementsByClassName("player-banner-gift")[0].getAttribute("id");
	            document.getElementById(id).click();
	            del(className);

	        }
	    }
    }
}
function checkCookie(maxTab){
	var url = window.location.href;
	var flag = getCookie("flag");
	if (flag == null || flag == "") {
		flag = "xxx";
	}
    var roomNo = url.replace("https://www.huya.com/","");
	var isNum = checkRate(roomNo);
	if(url.indexOf("a=1") != -1 || 1!=isNum){//有 则不比较
		return;
	}else{

		//有这个cookie或者cookie数超了 关闭页面
		if(flag.indexOf("A"+roomNo) != -1 || getFlageNum(flag) > maxTab){
			document.write("<script language=\"javascript\">window.opener=null;window.close();<\/script>");
		}else{
			//更新cookie
			setCookie("flag",flag+"A"+roomNo);
		}
	}
}
function getNewRoomUrl (newRoom){
    var url = window.location.href;
    var roomNo = url.replace("https://www.huya.com/","");
    return url.replace(roomNo,newRoom);
}
//新页面 创建cookie
//reload();
//打开+cookie或者关闭
checkCookie(maxTab);

window.setInterval(function() {
	//outInput();//关闭页签
	check();//发送弹幕
    openNweTab("player-banner-text-12");//藏宝图
    //空投
    var huyayihao = document.getElementsByClassName("huyayihao");
    if (huyayihao != null && huyayihao[0] != null) {
    	for(var ki in huyayihao){
    		if (ki > 5) {break;}
	    	if (huyayihao[ki] != null) {
		    	clicks(huyayihao[ki]);
	    	}
    	}
    	del("huyayihao");
    }
    //自动领取任务奖励
    var task = document.getElementsByClassName("status-get J_get");
    for(var bi=0;bi<task.length;bi++){
    	task[bi].click();
    }

    //去掉已领取的弹框
    if(document.getElementById('player-panel-alert') != null){
        document.getElementById('player-panel-alert').getElementsByClassName('player-panel-close')[0].click();
    }
    //去掉视频
    removeVideo();
    //领取在线宝箱
    getBox();
    //下播之后打开新直播间
    var newRoomClass = document.getElementsByClassName(" player-recommend-list");
    if(newRoomClass != null && newRoomClass[0] != null){
        var newRoom = newRoomClass[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getAttribute("profileroom");
        var newRoomUrl = getNewRoomUrl(newRoom);
        if(newRoomUrl != null && newRoomUrl != ""){
            window.open(newRoomUrl+"?a=1");
        }
        //关闭当前
        document.write("<script language=\"javascript\">window.opener=null;window.close();<\/script>");
    }


}, 8000);
//领取
window.setInterval(function() {
    var usable = document.getElementsByClassName('usable');//可领
    var disable = document.getElementsByClassName('disable');//已领
    var pub_msg_input = document.getElementById('pub_msg_input');//输入框
    if (usable != null && usable[0] != null) {
		usable[0].click();
	}
}, 500);
//能量箱
window.setInterval(function() {
    openNweTab("player-banner-text-20291");//能量箱
    openNweTab("player-banner-text-20269");//空投
}, 3000);


/**
**打开一组标签页
**/
function openTypeTab(arrayTab){
    console.log(111111);
    for(var j = 0,len = arrayTab.length; j < len; j++){
    window.open(arrayTab[j]);
    }
}
//判断字符串是否在数组中
var inArray = function(arr, item) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == item) {
            return true;
        }
    }
    return false;
};
//跳转
var nowUrl = window.location.href;
var arrayTab=new Array(
    "https://www.huya.com/g/1663",//星秀
    "https://www.huya.com/g/2165",//户外
    "https://www.huya.com/g/2633",//二次元
    "https://www.huya.com/g/2752",//美食
    "https://www.huya.com/g/2168",//颜值
    "https://www.huya.com/g/4079",//交友
    "https://www.huya.com/g/3793",//音乐
    "https://www.huya.com/g/2336"//王者荣耀
)
if(nowUrl.indexOf("https://www.huya.com/?a=1") != -1){//有 则不比较
    setCookie("flag","xxx");
	//打开一组标签页
    openTypeTab(arrayTab);
}
/**
**每组标签页打开相应直播间
**/
function openInitTab(){
    var href = document.getElementsByClassName('video-info new-clickstat')[0].getAttribute("href");
     window.open(href+"?a=1");
}
if(inArray(arrayTab,nowUrl)){
    openInitTab();
    //关闭当前
    document.write("<script language=\"javascript\">window.opener=null;window.close();<\/script>");
}


