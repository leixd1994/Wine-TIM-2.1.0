
var EditorManager={_getNewBlogParam:function(){var title=$("titleInput").value.trim("R");if(title.trim("L").length==0){QZBlog.Util.showAlertDlg("您还没有书写日志标题",300,function(){$("titleInput").focus();});return null;}
if(title.getRealLength()>MAX_BLOG_TITLE_LEN){QZBlog.Util.showAlertDlg("您输入的标题长度超出限制",300,function(){$("titleInput").focus();});return null;}
var ubbContent=g_oBlogEditor.getContent();if(ubbContent.ltrim().length==0){QZBlog.Util.showAlertDlg("您还没有书写任何日志正文内容",300,function(){g_oBlogEditor.focus();});return null;}
if(ubbContent.getRealLength()>MAX_BLOG_LEN){QZBlog.Util.showAlertDlg("您输入的日志正文长度超出"+(ubbContent.getRealLength()-MAX_BLOG_LEN)+"字节",300,function(){g_oBlogEditor.focus();});return null;}
var htmlContent=g_oBlogEditor.getConvertedHTMLContent();var nLen=htmlContent.getRealLength();if(nLen>MAX_BLOG_HTML_LEN){QZBlog.Util.showAlertDlg("您输入的日志正文长度超出"+(nLen-MAX_BLOG_HTML_LEN)+"字节",300,function(){g_oBlogEditor.focus();});return null;}
var param=[];param.push("title="+encodeURIComponent(title));param.push("content="+encodeURIComponent(ubbContent));param.push("html="+encodeURIComponent(htmlContent));param.push("category="+encodeURIComponent($("blogCateSelect").value.trim()));param.push("uin="+QZBlog.Util.getUin());param.push("ref=miniportal");param.push("qzoneckey="+QZBlog.Util.getKey());param.push("qzonecid="+QZBlog.Util.getClientID());return param;},submit:function(){this._doSubmit();},_doSubmit:function(verifycode){var param=this._getNewBlogParam();if(!param){return;}
var url="http://"+CGI_BLOG_DOMAIN+CGI_BLOG_PATH+"/blog_add?"+param.join("&")+(!!verifycode?("&verifycode="+verifycode+"&verifysession="+QZBlog.Util.getQQCookieValue("verifysession")):"");var netProcessor=QZBlog.Util.NetProcessor.create(url,"post",function(data){var msg=(!!data.tip?data.tip:"成功发表日志");if(!!msg){QZBlog.Util.showMsgbox(msg,0,QZBlog.Util.MSG_LIFTTIME.HIGH);}
$("titleInput").value="";g_oBlogEditor.hideTips();g_oBlogEditor.clearContent();DraftLogicManager.setState(false);QZBlog.Util.popupDialog("温馨提示",'<div><div style="margin:25px 0 0 25px;text-align:center;">您的日志已经发表成功！是否现在去查看详情？</div><div class="mode_pop_bottom mode_pop_bg"><p><button class="spr bt_2" id="viewBlogBtn" onclick="QZBlog.Util.openPage(\'http://user.qzone.qq.com/'+QZBlog.Util.getUin()+'/blog/'+data.blogid+'\');QZBlog.Util.closePopup();return false;">查看</button><button class="bt_2" onclick="QZBlog.Util.closePopup();return false;">取消</button></p></div></div>',380,110);$("viewBlogBtn").focus();},function(data){QZBlog.Util.showMsgbox(data.error.msg,1,QZBlog.Util.MSG_LIFTTIME.MIDDLE);},"GBK",false);if(!netProcessor){return;}
netProcessor.setPostType("externalHTML");netProcessor.loginHandler=function(){QZBlog.Util.hideMsgbox();QZBlog.Util.showAlertDlg("很抱歉，因为网络原因无法发表。请备份好当前的内容，再重新打开QQ空间编辑器尝试。",520);};netProcessor.verifyHandler=QZONE.event.bind(this,this._doSubmit);netProcessor.execute();},quit:function(bNotCloseFlag){if(DraftLogicManager.getState()){external.QQChangeTab("blog");QZBlog.Util.popupDialog("温馨提示",'<div><div style="margin:25px 0 0 25px;text-align:center;">日志尚未保存，关闭会使内容丢失，确定离开吗？</div><div class="mode_pop_bottom mode_pop_bg"><p><button class="spr bt_2" id="quitConfirmBtn" onclick="EditorManager.closeWindow();QZBlog.Util.closePopup();return false;">确定</button><button class="bt_2" onclick="QZBlog.Util.closePopup();return false;">取消</button></p></div></div>',380,110);window.focus();$("quitConfirmBtn").focus();return false;}
if(!bNotCloseFlag){this.closeWindow();}
return true;},closeWindow:function(){DraftLogicManager.setState(false);external.QQCloseWindow();},_doAddCategory:function(cateName,verifycode){var url="http://"+CGI_BLOG_DOMAIN+CGI_BLOG_PATH+"/blog_add_category?uin="+QZBlog.Util.getUin()+"&category="+encodeURIComponent(cateName)+(!!verifycode?("&verifycode="+verifycode+"&verifysession="+QZBlog.Util.getQQCookieValue("verifysession")):"")+"&qzoneckey="+QZBlog.Util.getKey()+"&ref=miniportal"+"&qzonecid="+QZBlog.Util.getClientID();var netProcessor=QZBlog.Util.NetProcessor.create(url,"post",QZONE.event.bind(this,function(){QZBlog.Util.showMsgbox("添加分类成功",0,QZBlog.Util.MSG_LIFTTIME.MIDDLE);parent.addBlogCategoryCallback(cateName);this.hideAddCategoryDlg();}),function(data){QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data,"/error")),1,QZBlog.Util.MSG_LIFTTIME.MIDDLE);},"GBK",false);if(!netProcessor){return;}
netProcessor.setPostType("externalXML");netProcessor.loginHandler=function(){QZBlog.Util.hideMsgbox();window.bAddCateDlgShowFlag=false;QZBlog.Util.showAlertDlg("很抱歉，因为网络原因无法发表。请备份好当前的内容，再重新打开QQ空间编辑器尝试。",520);};netProcessor.verifyHandler=QZONE.event.bind(this,function(verifycode){this._doAddCategory(cateName,verifycode);});netProcessor.execute();},confirmAddCate:function(){var cateName=$('cateNameInput').value.trim();if(cateName.replace(/[^\x00-\xff]/g,"hh").length==0){QZBlog.Util.showAlertDlg("请您输入分类名",200,function(){EditorManager.showAddCategoryDlg();});return false;}
if(cateName.replace(/[^\x00-\xff]/g,"hh").length>12){QZBlog.Util.showAlertDlg("对不起,分类名称长度不能超过12个字母/6个汉字",300,function(){EditorManager.showAddCategoryDlg();});return false;}
if((/[\"\'\\&]/).test(cateName)){QZBlog.Util.showAlertDlg("对不起,分类名称中不可以使用\"，'，\\，&字符",300,function(){EditorManager.showAddCategoryDlg();});return false;}
if(cateName=="近期日志"||cateName=="往期日志"||cateName=="个人日记"){QZBlog.Util.showAlertDlg("对不起，不能使用“"+cateName+"”作为分类名称",300,function(){EditorManager.showAddCategoryDlg();});return false;}
if(window.categoryList){for(var index=0;index<window.categoryList.length;++index){if(window.categoryList[index].category==cateName.toInnerHTML()){this.hideAddCategoryDlg();parent.addBlogCategoryCallback(cateName);return;}}}
this._doAddCategory(cateName);return true;},hideAddCategoryDlg:function(){window.bAddCateDlgShowFlag=false;QZBlog.Util.closePopup();},showAddCategoryDlg:function(){$("addCateBtn").focus();parent.addBlogCategoryCallback=function(cateName){var optionsEle=$("blogCateSelect").options;for(var index=0;index<optionsEle.length;++index){if(cateName==optionsEle[index].value){optionsEle.selectedIndex=index;return;}}
optionsEle[optionsEle.length]=new Option(cateName,cateName,true,true);};window.bAddCateDlgShowFlag=true;QZBlog.Util.popupDialog("添加日志分类",'<div><div style="margin:25px 0 0 25px;text-align:center;"><label>分类名称：<input id="cateNameInput" maxlength="12" oncontextmenu="event.cancelBubble=true;return true;" onselectstart="event.cancelBubble=true;return true;" style="line-height:1.3em;" type="text" /></label> (最多12个字母或6个汉字)</div><div class="mode_pop_bottom mode_pop_bg"><p><button class="spr bt_2" onclick="EditorManager.confirmAddCate();return false;">确定</button><button class="bt_2" onclick="EditorManager.hideAddCategoryDlg();return false;">取消</button></p></div></div>',380,117);$("cateNameInput").focus();QZONE.event.preventDefault();},bindHTMLEvents:function(){QZONE.event.addEvent($("addCateBtn"),"click",QZONE.event.bind(this,this.showAddCategoryDlg));QZONE.event.addEvent($("quitBtn"),"click",QZONE.event.bind(this,function(){this.quit();}));QZONE.event.addEvent($("submitBtn"),"click",QZONE.event.bind(this,this.submit));QZONE.event.addEvent(window,"resize",QZONE.event.bind(this,this.resizeEditor));this.registerSCKey(document);},loadCategoryInfo:function(){var url="http://"+CGI_BLOG_DOMAIN+CGI_BLOG_PATH+"/blog_get_category?uin="+QZBlog.Util.getUin()+"&qzoneckey="+QZBlog.Util.getKey()+"&ref=miniportal"+"&qzonecid="+QZBlog.Util.getClientID()+"&hh="+Math.random();var portraitReq=new QZBlog.Util.BlogNetProcessor();portraitReq.create(url,"get",QZONE.event.bind(this,function(rawData){data=rawData.data;if(data&&data.categorylist){window.categoryList=data.categorylist;this._fillCategorySelector();}}),QZONE.emptyFn,"GB2312",true,"_Callback");if(!portraitReq){return;}
portraitReq.execute();},_fillCategorySelector:function(){var data=window.categoryList;var optionsEle=$("blogCateSelect").options;for(var index=0;index<data.length;++index){if(data[index].category=="个人日记"||data[index].category=="投票"){continue;}
optionsEle[optionsEle.length]=new Option(data[index].category.toRealStr(),data[index].category.toRealStr(),false,false);}
if($("blogCateSelect").value.length==0){$("blogCateSelect").value="个人日记";}},resizeEditor:function(){if(!g_oBlogEditor||!g_oBlogEditor.bReadyState){return;}
try{var tarHeight=QZONE.dom.getClientHeight()-98;if(g_oBlogEditor._tipsOpened){var pos=QZONE.dom.getPosition(g_oBlogEditor._dom_tips);tarHeight-=pos["height"]+2;}
if(tarHeight<200){return;}
g_oBlogEditor._dom_area.style.height=tarHeight+"px";g_oBlogEditor.resizeArea();}
catch(err){}},buildEditor:function(){$("fakeEditorAnchor").style.display="none";var tarHeight=QZONE.dom.getClientHeight()-100;if(tarHeight<340){tarHeight=340;}
g_oBlogEditor=QZONE.editor.create("blogEditorAnchor",{height:tarHeight+"px"});g_oBlogEditor.onEditorReady=QZONE.event.bind(this,function(){$("titleInput").focus();g_oBlogEditor.bReadyState=true;g_oBlogEditor.setupHTMLEvent();g_oBlogEditor.setHTMLFontSize("16px");g_oBlogEditor.setMaxContentLength(MAX_BLOG_HTML_LEN);this.resizeEditor();this.registerSCKey(g_oBlogEditor.getCurrentEditor().getDocument());DraftLogicManager.registerDraftTrigger(g_oBlogEditor.getCurrentEditor().getDocument(),"keydown");QZFL.event.addEvent(window,"unload",function(){QZFL.event.purgeEvent(g_oBlogEditor.getCurrentEditor().getDocument(),'keydown');QZFL.event.purgeEvent(g_oBlogEditor.getCurrentEditor().getDocument(),'keypress');});QZFL.event.addEvent(g_oBlogEditor.getCurrentEditor().getDocument(),"keydown",function(evt){evt=QZONE.event.getEvent(evt);if(evt.ctrlKey&&evt.keyCode==78){QZONE.event.preventDefault(evt);}});});g_oBlogEditor.build();},registerSCKey:function(doc){if(!doc){return;}
QZONE.event.addEvent(doc,"keypress",QZFL.event.bind(this,function(evt){evt=QZONE.event.getEvent(evt);if(!!window.bAlertDlgShowFlag){if(evt.keyCode==13){QZBlog.Util.hideAlertDlg();QZONE.event.preventDefault(evt);}
return;}
if(!!window.bAddCateDlgShowFlag){if(evt.keyCode==13){EditorManager.confirmAddCate();QZONE.event.preventDefault(evt);}
return;}
if(!!window.bPopupDialogFlag){return;}
evt=QZONE.event.getEvent(evt);if(evt.ctrlKey&&evt.keyCode==10){EditorManager.submit();QZONE.event.preventDefault(evt);}}));},start:function(){this.loadCategoryInfo();this.buildEditor();this.bindHTMLEvents();DraftLogicManager.initDraftTrigger();}};window.resizeEditor=EditorManager.resizeEditor;var DraftLogicManager={_bState:false,getState:function(){return this._bState;},setState:function(flag){this._bState=!!flag;},initDraftTrigger:function(){var ctrlList=[["titleInput","keydown"],["blogCateSelect","change"]];for(var index=0;index<ctrlList.length;++index){this.registerDraftTrigger($(ctrlList[index][0]),ctrlList[index][1]);}},registerDraftTrigger:function(ele,evtName){if(!ele||!evtName){return false;}
return QZONE.event.addEvent(ele,evtName,QZONE.event.bind(this,this.draftStateTrigger));},_beforePageUnloadProc:function(){if(this._bState){return"日志尚未发表，关闭会使内容丢失，确定离开吗？";}},draftStateTrigger:function(){if(QZONE.userAgent.ie){document.body.onbeforeunload=QZONE.event.bind(this,this._beforePageUnloadProc);}
else{window.onbeforeunload=QZONE.event.bind(this,this._beforePageUnloadProc);}
this._bState=true;}};var g_oBlogEditor=null;function QQConfirmClose(){return EditorManager.quit(true);}
window.g_strVerifycodeType="blog";