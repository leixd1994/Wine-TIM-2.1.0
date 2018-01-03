
var BASE_DIR="./";var IMGCACHE_DOMAIN="imgcache.qq.com";var CGI_BLOG_DOMAIN="b.qzone.qq.com";var CGI_BLOG_PATH="/cgi-bin/blognew";var MAX_BLOG_LEN=50*1024;var MAX_BLOG_HTML_LEN=100*1024;var MAX_BLOG_TITLE_LEN=128;var BLOG_VERIFY_CODE=8000103;var VERIFY_DOMAIN="ptlogin2.qq.com";var LOADING_GIF="/qzone/newblog/v5/editor/css/loading.gif";parent.g_XDoc={};if(typeof(QZBlog)=="undefined"||!QZBlog){var QZBlog={};}
QZBlog.Util={};QZBlog.Util.formatMsg=(function(msg,values,filter){var pattern=/\{([\w-]+)?\}/g;return function(msg,values,filter){return msg.replace(pattern,function(match,key){return filter?filter(values[key],key):values[key];});}}());QZBlog.Util.getSpaceUrl=function(uin){return"http://user.qzone.qq.com/"+uin;};QZBlog.Util.getUin=function(){if(typeof(external)!="undefined"&&external.QQGetSelfUin){return external.QQGetSelfUin();}
return"900000335";};QZBlog.Util.getKey=function(){if(typeof(external)!="undefined"&&external.QQGetQzoneKey){return external.QQGetQzoneKey();}
return"";};QZBlog.Util.getClientID=function(){return 66;};QZBlog.Util.openPage=function(url){window.open("http://ptlogin2.qq.com/jump?clientuin="+QZBlog.Util.getUin()+"&clientkey="+external.QQGetClientKey()+"&u1="+encodeURIComponent(url),"_blank");};QZBlog.Util.convertLocalFilePath=function(src){if(/^file:\/\/\//i.test(src)){src=src.replace(/^file:\/\/\//,"");src=src.replace(/\//g,"\\");src=decodeURIComponent(src);}
return src;};QZBlog.Util.parseXML=function(st){function getXMLDOM(){var xmldomversions=['MSXML2.DOMDocument.5.0','MSXML2.DOMDocument.4.0','MSXML2.DOMDocument.3.0','MSXML2.DOMDocument','Microsoft.XMLDOM'];for(var i=xmldomversions.length-1;i>=0;i--){try{return new ActiveXObject(xmldomversions[i]);}
catch(e){}}
return null;}
var result=getXMLDOM();if(!result){return null;}
result.loadXML(st);return result;};QZBlog.Util.long2DateTime=function(aTime){if(!aTime){return"";}
var d=new Date(aTime*1000);return d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日 "+(d.getHours()<10?" 0":" ")+d.getHours()+":"+(d.getMinutes()<10?"0":"")+d.getMinutes();};QZBlog.Util.VerifycodeType={"NEEDCODE":0,"ERRCODE":1,"IPC_CHECK":2,"NORMALCODE":3};QZBlog.Util.MSG_LIFTTIME={"HIGH":3000,"MIDDLE":2000,"LOW":1000,"INFINITE":0};QZBlog.Util.DumpMsgFunc=function(){QZBlog.Util.showMsgbox("服务器繁忙，请稍候重试",1,QZBlog.Util.MSG_LIFTTIME.MIDDLE);};QZBlog.Util.VerifycodeType={"NEEDCODE":0,"ERRCODE":1,"IPC_CHECK":2,"NORMALCODE":3};QZBlog.Util.getQQCookieValue=function(cookiename){var value=external.QQGetCookie("http://qq.com",cookiename);if(!value){return"";}
var r=new RegExp("(?:^|;+|\\s+)"+cookiename+"=([^;]*)");var m=value.match(r);delete r;return(!m?"":m[1]);};window.g_strVerifycodeType="blog";QZBlog.Util.showVerifycodeDlg=function(nType,procFunc){try{if(QZBlog.Util.popupDialog._cpp){QZBlog.Util.closePopup();}}catch(err){}
external.QQSetCookie("http://qq.com","miniportal_verifycode"+window.g_strVerifycodeType,"0");window.clearInterval(window.g_nVerifyDlgInterval);window.g_nVerifyDlgInterval=window.setInterval(function(){var value=QZBlog.Util.getQQCookieValue("miniportal_verifycode"+window.g_strVerifycodeType);if(value==1){external.QQSetCookie("http://qq.com","miniportal_verifycode"+window.g_strVerifycodeType,"0");QZBlog.Util.closePopup();return;}
if(!!value&&value.length==4){external.QQSetCookie("http://qq.com","miniportal_verifycode"+window.g_strVerifycodeType,"0");QZBlog.Util.closePopup();procFunc(value);}},50);window.popupCallback=function(){external.QQSetCookie("http://qq.com","miniportal_verifycode"+window.g_strVerifycodeType,"0");};QZBlog.Util.popupDialog('请输入验证码','<iframe frameborder="no" id="verifycodeFrame" style="width:100%;height:100%;" src="http://'+IMGCACHE_DOMAIN+'/qzone/newblog/v5/portal/common/verifycode.html?imgcode='+BLOG_VERIFY_CODE+'&type='+nType+'&cookietype='+window.g_strVerifycodeType+'"></iframe>',270,198);};QZBlog.Util.hideAlertDlg=function(){QZBlog.Util.closePopup();setTimeout(function(){window.funcAlertCallback();},0);window.bAlertDlgShowFlag=false;};QZBlog.Util.showAlertDlg=function(msg,width,callback){try{if(QZBlog.Util.popupDialog._cpp){QZBlog.Util.closePopup();}}catch(err){}
window.funcAlertCallback=(typeof(callback)=="function"?callback:QZONE.emptyFn);window.bAlertDlgShowFlag=true;QZBlog.Util.popupDialog("提示",'<div><div style="margin:25px 0 0 20px;text-align:center;">'+msg+'</div><div class="mode_pop_bottom mode_pop_bg"><p style="padding:3px 2px 2px 0;width:100%;text-align:center;"><button class="spr bt_2" onclick="QZBlog.Util.hideAlertDlg();return false;" id="btnAlertConfirmBtn">确定</button></p></div></div>',width,117);$("btnAlertConfirmBtn").focus();};QZBlog.Util.showLoginBox=function(callback){var src=QZBlog.Util.formatMsg("http://ui.ptlogin2.qq.com/cgi-bin/login?appid={0}&hide_title_bar=1&target=self&link_target=blank"+"&f_url=http%3A%2F%2F{1}%2Fqzone%2Fv5%2Floginerr.html&s_url=http%3A%2F%2F{2}%2Fqzone%2Fv5%2Floginsucc.html%3fpara%3dreload",[BLOG_VERIFY_CODE,IMGCACHE_DOMAIN,IMGCACHE_DOMAIN]);QZBlog.Util.popupDialog("登录",{"src":src},378,280,false);if(typeof(callback)=='function'){QZBlog.Util.appendPopupFn(callback);}};QZBlog.Util.popupDialog=function(title,html,width,height,useTween){var _self=QZBlog.Util.popupDialog;if(typeof(width)=='undefined'){width=430;}
if(typeof(height)=='undefined'){height=300;}
if(typeof(html)=='object'){html=_self._ifrmTmp.replace(/__p__/g,' src="'+html.src
+'" height="'+(height)+'" width="'+(width-2)
+'"');}else{html=html+"";}
var _dh,b;if(!_self._cpp){_dh=_self._cpp=QZONE.dialog.create(title+"",html,width,height,useTween);b=$("dialog_button_"+_dh._id);QZONE.event.addEvent(b,"click",QZBlog.Util.closePopup);try{if($(_self._cpp.frameId)){$(_self._cpp.frameId).style.height=height+"px";}}
catch(err){}
if(!_self._ppml){_self._ppml=QZONE.maskLayout.create();}}
_self._fnl=null;_self._fnl=[];window.bPopupDialogFlag=true;};QZBlog.Util.popupDialog._ifrmTmp='<iframe frameborder="no" allowtransparency="yes"__p__></iframe>';QZBlog.Util.closePopup=function(){var _self=QZBlog.Util.popupDialog,tmp,tf;if(typeof(window.popupCallback)=='function'){QZBlog.Util.appendPopupFn(window.popupCallback);}
tmp=_self._fnl;if(tmp&&tmp.length>0){_self._cpp.onUnload=function(){for(;tmp.length>0;){tf=tmp.pop();if(typeof(tf)=='function'){tf();}}
window.popupCallback=null;}}
if(_self._cpp){_self._cpp.unload();_self._cpp=null;}
if(_self._ppml){QZONE.maskLayout.remove(_self._ppml);_self._ppml=null;}
window.bPopupDialogFlag=false;};QZBlog.Util.appendPopupFn=function(fn){if(typeof(fn)=='function'){var _self=QZBlog.Util.popupDialog;if(!(_self._fnl instanceof Array)){_self._fnl=[];}
_self._fnl.push(fn);}};QZBlog.Util.clearPopupFn=function(){var _self=QZBlog.Util.popupDialog;if((_self._fnl instanceof Array)&&(_self._fnl.length>0)){_self._fnl=null;delete _self._fnl;}
_self._fnl=[];};QZBlog.Util.hideMsgbox=function(){QZONE.widget.msgbox.hide();};QZBlog.Util.showMsgbox=function(msg,type,timer){QZONE.widget.msgbox.show(msg,type,timer);};QZBlog.Util.BlogNetProcessor=function(){this._DEFAULT_TYPE="get";this._DEFAULT_CHARSET="GB2312";this._DEFAULT_CALLBACK_NAME="_Callback";this._DEFAULT_POSTTYPE="XML";this.verifyHandler=null;this.loginHandler=null;this.rightHandler=null;this.forbiddenHandler=null;this.alertHandler=null;this.confirmHandler=null;this._bProcessing=false;this._type=this._DEFAULT_TYPE;this._url="";this._charset=this._DEFAULT_CHARSET;this._silentMode=false;this._succHandler=QZONE.emptyFn;this._errHandler=QZONE.emptyFn;this._callbackName=this._DEFAULT_CALLBACK_NAME;this._postType=this._DEFAULT_POSTTYPE;this._defaultErrHandler=function(){if(!this._silentMode){QZBlog.Util.DumpMsgFunc();}
this.close();};this._commonErrTypeHandler=function(type,msg){switch(type){case"login":if(this.loginHandler){this.loginHandler();break;}
case"ipc_check":if(this.verifyHandler){QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.IPC_CHECK,QZONE.event.bind(this,this.verifyHandler));break;}
case"verify code":if(this.verifyHandler){QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.ERRCODE,QZONE.event.bind(this,this.verifyHandler));break;}
case"verify":case"need_verify":if(this.verifyHandler){QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.NEEDCODE,QZONE.event.bind(this,this.verifyHandler));break;}
case"alert":if(this.alertHandler){this.alertHandler(msg);break;}
case"confirm":if(this.confirmHandler){this.confirmHandler(msg);break;}
case"forbidden":if(this.forbiddenHandler){this.forbiddenHandler();break;}
default:{if(!this._silentMode){if(!msg){QZBlog.Util.DumpMsgFunc();}
else{QZBlog.Util.showMsgbox(msg,1,QZBlog.Util.MSG_LIFTTIME.MIDDLE);}}}}};this._simpleXMLErrHandler=function(data){var errEle=XMLselectSingleNode(data,"/error");if(!errEle){return;}
this._commonErrTypeHandler(errEle.getAttribute("type"),getXMLNodeText(errEle));};this._simpleJsonErrHandler=function(data){if(!data.error){return;}
this._commonErrTypeHandler(data.error.type,data.error.msg);};this._callback=function(data){if(!this.silentMode){QZBlog.Util.hideMsgbox();}
if(!data){QZBlog.Util.showMsgbox("暂时无法获取服务器数据",1,QZBlog.Util.MSG_LIFTTIME.MIDDLE);return;}
if(isXMLDoc(data)&&XMLselectSingleNode(data,"/error")){this._simpleXMLErrHandler(data);if(this._errHandler){this._errHandler.apply(null,arguments);}
return;}
else if(data.error){this._simpleJsonErrHandler(data);if(this._errHandler){this._errHandler.apply(null,arguments);}
return;}
if(this._succHandler){if(QZONE.userAgent.ie==8){this._tmpHandler=this._succHandler;setTimeout(QZONE.event.bind(window,function(ele,args){ele._tmpHandler.apply(null,args);ele._tmpHandler=QZONE.emptyFn;},this,arguments),0);}
else{this._succHandler.apply(null,arguments);}}};this.create=function(url,type,succFunc,errFunc,charset,silentMode,callbackName){if(this._bProcessing){if(!this._silentMode){QZBlog.Util.showMsgbox("正在响应您的操作,请稍候...",0,QZBlog.Util.MSG_LIFTTIME.MIDDLE);}
return null;}
this._url=url;this._type=(type=="post"?type:this._DEFAULT_TYPE);this._charset=(!!charset?charset:this._DEFAULT_CHARSET);this._silentMode=!!silentMode;this._callbackName=(callbackName?callbackName:this._DEFAULT_CALLBACK_NAME);this._postType=this._DEFAULT_POSTTYPE;if(succFunc){this._succHandler=succFunc;}
if(errFunc){this._errHandler=errFunc;}
this._bProcessing=true;this.verifyHandler=null;this.loginHandler=null;this.forbiddenHandler=null;this.rightHandler=null;this.alertHandler=null;this.confirmHandler=null;return this;};this.setPostType=function(strType){this._postType=strType;};this._transformIntoRealData=function(str){var data=null;if(this._postType=="externalXML"){var res=/(\<\?xml((\n|.)*?))$/ig.exec(str);if(res&&res[1]){data=QZBlog.Util.parseXML(res[1]);}}
else if(this._postType=="externalHTML"){var keyWord="frameElement.callback(";if(str.indexOf(keyWord)!=-1){str=str.substr(str.indexOf(keyWord)+keyWord.length);if(str.lastIndexOf(")")!=-1){str=str.substr(0,str.lastIndexOf(")"));eval("data="+str);}}}
return data;};this.execute=function(){if(!this._silentMode){QZBlog.Util.showMsgbox("正在提交请求，请稍候...",0);}
if(this._type=="get"){var snd=new QZONE.JSONGetter(this._url,void(0),null,this._charset);snd.onSuccess=QZONE.lang.chain(QZONE.event.bind(this,this._callback),QZONE.event.bind(this,this.close));snd.onError=QZONE.event.bind(this,this._defaultErrHandler);snd.send(this._callbackName);}
else if(this._type=="post"){var uriInfo=URI(this._url);var url=this._url.replace(uriInfo.search,"")
if(this._postType==this._DEFAULT_POSTTYPE){loadXMLAsync("tmpBlogXMLRequest",url,QZONE.event.bind(this,function(){try{this._callback(parent.g_XDoc["tmpBlogXMLRequest"]);delete parent.g_XDoc["tmpBlogXMLRequest"];parent.g_XDoc["tmpBlogXMLRequest"]=null;}catch(err){}
this.close();}),QZONE.event.bind(this,this._defaultErrHandler),true,uriInfo.search.substring(1));}
else if(this._postType=="externalXML"||this._postType=="externalHTML"){window.external_Callback=QZONE.event.bind(this,function(data){if(!data||data.length==0){alert("网络组件故障，请稍候重试。");if(this._errHandler){if(this._postType=="externalHTML"){this._errHandler({"error":{"type":"neterror","msg":"网络组件故障，请稍候重试。"}});}
else if(this._postType=="externalXML"){this._errHandler(this._transformIntoRealData('<?xml version="1.0" encoding="gb2312" ?><error type="neterror">网络组件故障，请稍候重试。</error>'));}}
this.close();return;}
try{this._callback(this._transformIntoRealData(data));}catch(err){}
this.close();});external.QQPostData(url,this._charset,uriInfo.search.substring(1),"external_Callback");}
else{var fs=new QZONE.FormSender(url,"post",uriInfo.search.substring(1),this._charset);fs.onSuccess=QZONE.event.bind(this,function(data){try{this._callback(data);}catch(err){}
this.close();});fs.onError=QZONE.event.bind(this,this._defaultErrHandler);fs.send();}}
else{return false;}
return true;};this.close=function(){this._bProcessing=false;this._type=this._DEFAULT_TYPE;this._url="";this._charset=this._DEFAULT_CHARSET;this._silentMode=false;this._succHandler=QZONE.emptyFn;this._errHandler=QZONE.emptyFn;this._callbackName=this._DEFAULT_CALLBACK_NAME;this.verifyHandler=null;this.loginHandler=null;this.forbiddenHandler=null;this.rightHandler=null;this.alertHandler=null;this.confirmHandler=null;};return this;};QZBlog.Util.NetProcessor=new QZBlog.Util.BlogNetProcessor();String.prototype.trim=function(){return trim(this);};String.prototype.ltrim=function(){return ltrim(this);};String.prototype.rtrim=function(){return rtrim(this);};String.prototype.toInnerHTML=function(){var s=this.replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/\'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return QZONE.userAgent.ie?s.replace(/&apos;/g,"&#39;"):s;};String.prototype.toRealStr=function(){return this.replace(/&quot;/g,"\"").replace(/(?:&#39;)|(?:&apos;)/g,"\'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&#92;/g,"\\");};String.prototype.convCR=function(r){return(!!r)?this.replace(/<br \/>/g,"\n"):this.replace(/\n/g,"<br />");};String.prototype.convSP=function(r){return(!!r)?this.replace(/&nbsp;/g," "):this.replace(/\x20\x20/g,"&nbsp;&nbsp;");};String.prototype.convHeaderSP=function(){return this.replace(/\n\x20(^\x20)*/ig,"\n&nbsp;$1");};String.prototype.getRealLength=function(){return this.replace(/[^\x00-\xff]/g,"hh").length;};String.prototype.URLencode=function(){return URIencode(this);};String.prototype.convertRegexChar=function(){return this.replace(/\^/g,"\\^").replace(/\$/g,"\\$").replace(/\*/g,"\\*").replace(/\+/g,"\\+").replace(/\?/g,"\\?").replace(/\=/g,"\\=").replace(/\!/g,"\\!").replace(/\|/g,"\\|").replace(/\\/g,"\\\\").replace(/\//g,"\\/").replace(/\{/g,"\\{").replace(/\}/g,"\\}").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\(/g,"\\(").replace(/\)/g,"\\)");};QZBlog.Util.isMultipleByte=function(ch){var value=parseInt(ch.toString(16),16);if(value<0x00||value>0xff)
return true;return false;};String.prototype.cutWord=function(nRealLength){var oThis=this.toRealStr();if(oThis.getRealLength()<=nRealLength||nRealLength<=0)
return oThis.toInnerHTML();var str="";var nEndIndex=Math.floor(nRealLength/2);while(1){str=oThis.substr(0,nEndIndex);if(str.getRealLength()<nRealLength-1){nEndIndex=nEndIndex+Math.floor((nRealLength-str.getRealLength())/2);}
else if(str.getRealLength()>nRealLength){nEndIndex=nEndIndex-Math.floor((str.getRealLength()-nRealLength)/2);}
else if(str.getRealLength()==nRealLength){break;}
else{if(nEndIndex<oThis.length&&!QZBlog.Util.isMultipleByte(oThis.charCodeAt(nEndIndex))){str=oThis.substr(0,nEndIndex+1);}
break;}}
return str.toInnerHTML();};function getParameter(name){var r=new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");var m=location.href.match(r);return(!m?"":m[2]);}
function $(id){return document.getElementById(id);}
function BlogXMLselectSingleNode(data,xpath){var x=BlogXMLselectNodes(data,xpath);if(!x||x.length<1){return null;}
return x[0];}
function BlogXMLselectNodes(data,xpath){var xpe=new XPathEvaluator();var nsResolver=xpe.createNSResolver(data.ownerDocument==null?data.documentElement:data.ownerDocument.documentElement);var result=xpe.evaluate(xpath,data,nsResolver,0,null);var found=[];var res;while(res=result.iterateNext()){found.push(res);}
return found;}
function XMLSelectNodes(data,path){if(QZONE.userAgent.ie){return data.selectNodes(path);}
else{return BlogXMLselectNodes(data,path);}}
function XMLselectSingleNode(data,path){if(QZONE.userAgent.ie){return data.selectSingleNode(path);}
else{return BlogXMLselectSingleNode(data,path);}}
function isXMLDoc(data){try{XMLselectSingleNode(data,"/");return true;}
catch(err){return false;}}
function getXMLNodeText(node){if(!node){return null;}
if(typeof(node.innerText)!="undefined"){return node.innerText;}
else if(typeof(node.textContent)!="undefined"){return node.textContent;}
return node.text;}
function loadXMLAsync(xID,xUrl,callback,err_callback,nocache,data,returnType){var m=xUrl.match(/(^http:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.qq\.com)\/)/);if(!m){alert("不能访问非qq.com域的资源");return;}
var domain=m[0];var host=m[2];var proxyPageURL=domain+"proxy.html";if(domain==("http://"+IMGCACHE_DOMAIN+"/")){proxyPageURL="http://"+IMGCACHE_DOMAIN+"/ac/qzone/proxy.html";}
var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){var isRightProxy=false;try{isRightProxy=f[i].src.indexOf(proxyPageURL)==0}catch(e){}
if(isRightProxy){if(!callBackHsmp[host]&&typeof callBackHsmp[host]!="undefined"){f[i].contentWindow.loadXMLAsync(xID,xUrl,callback,err_callback,nocache,data,returnType);}else{if(typeof callBackHsmp[host]=="undefined")callBackHsmp[host]=[];callBackHsmp[host][callBackHsmp[host].length]={"callback":callback,"xID":xID,"xUrl":xUrl,"err_callback":err_callback,"nocache":nocache,"data":data,"returnType":returnType};}
return;}}
if(!callBackHsmp[host]){callBackHsmp[host]=[{"callback":callback,"xID":xID,"xUrl":xUrl,"err_callback":err_callback,"nocache":nocache,"data":data,"returnType":returnType}];createProxy(proxyPageURL);}}
if(typeof(callBackHsmp)=="undefined"){window.callBackHsmp=[];}
function createProxy(src){var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++)
if(f[i].src.indexOf(src)!=-1)return;var i=document.createElement("iframe");var proxyDiv=$("proxy");if(!proxyDiv){document.body.insertBefore(i,null);}
else{$("proxy").appendChild(i);}
i.width=0;i.height=0;i.src=src;i=null;}