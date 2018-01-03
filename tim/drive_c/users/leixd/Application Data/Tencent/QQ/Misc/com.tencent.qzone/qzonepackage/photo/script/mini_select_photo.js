/**
 * @author jackyliu
 */
function $hide(id){
	try{
		$(id).style.display = "none";
	}catch(e){}
}
function $show(id){
	try{
		$(id).style.display = "";
	}catch(e){}
}
function $html(id,tpl){
	$(id).innerHTML = tpl;
}
var mini_portal = (function(){
	var inner;
	return inner = {
		
	};
})();
String.prototype.unHtmlReplace = function () {
	var s = (this).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ").replace(/&quot;/g,"\"");
	return s.replace(/&#(\d{2});/g,function($0,$1) {return unescape("%"+parseInt($1).toString(16));});
}
function getParameter(name,cancelBubble){
    var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");
    var m = location.href.match(r);
    return (!m?"":m[2]);
};
var GlobalCfg = {
	"uin" : (function(){
		return external.QQGetSelfUin();
	})(),
	"maxFileSize" : 3*1024*1024,
	"aid" : (function(){
		return getParameter("aid") || null;
	})(),
	"refreshAlbumList" : false,
	"refreshAlbumId" : null,
	"topPosition" : (function(){
		return getParameter("lastPosition") || null;
	})(),
	"allowNewOpt" : (function(){
		try{
			new Option(1,1);
			return true;
		}catch(e){
			return false;
		}
	})()
};

/**
 * @author jackyliu
 */
var AlbumLogic = (function(){
	frameElement.height ="308";
	var _currentAlbum = null;
	var _photos = null;
	var numPerLine = 4;
	var _topGap = 10;
	var _gapBetweenLine = 100;
	var _loadReady = {1:true,2:true,3:true};
	var _eventBinded = false;
	var _linesPreLoad = 3;
	var retPhotos = [];
	var retPhotoHash = {};
	function _getAlbumList(){
		PhotoLogic.getAlbumList({uin:GlobalCfg.uin,callBack:_albumListBack,refresh:(GlobalCfg.aid?true:false),errBack:_albumListErr,type:7,projectId:112,pageId:3});
	}
	function _albumListBack(data){
		GlobalCfg.refreshAlbumList = false;;
		_albums = data.albums;
		var _aid;
		var _s = $("selectPhoto");
		if(_albums.length == 0){
			$show("album_empty");
			$hide("photo_list");
			return;
		}
		if(GlobalCfg.allowNewOpt){
			for(var i=0,l = _albums.length;i<l;i++){
				var _o = new Option(_albums[i].name.unHtmlReplace() + "(" + _albums[i].total + ")",_albums[i].id);
				with(_s){
					options[length] = _o;
				}
			}
		}else{
			var _a = [];
			for(var i=0,l = _albums.length;i<l;i++){
				_a.push('<option value="'+_albums[i].id +'">'+_albums[i].name.unHtmlReplace() + '(' + _albums[i].total + ')'+'</option>');
			}
			_s.parentNode.innerHTML = '<select id="selectPhoto" name="selectPhoto"><option value="0" selected="selected">请选择相册</option>'+_a.join("")+'</select>';
		}
		if(GlobalCfg.aid){
			$("selectPhoto").value = GlobalCfg.aid;
			_getPhotoList(GlobalCfg.aid,true);
			_currentAlbum = {
					"aid" : GlobalCfg.aid,
					"aname" : $("selectPhoto").options[$("selectPhoto").selectedIndex].text
				}
		}else{
			$("photo_list").innerHTML = "";
		}
	}
	function _albumListErr(){
		
	}
	function _getPhotoList(id,needRefresh){
		GlobalCfg.aid = id;
		//$("photo_list").innerHTML = "正在获取图片，请稍候。。。";
		$show("loading_tips");
		$("photo_list").innerHTML = "";
		var refresh = false;
		if(id == GlobalCfg.refreshAlbumId || needRefresh){
			refresh = true;
		}
		PhotoLogic.getPhotoList({uin:GlobalCfg.uin,id:id,refresh:refresh,callBack:_photoListBack,errBack:_photoListErr,projectId:112,pageId:3});
	}
	function _addPic(photo){
		var _ul = $("photo_list");
		var _li = QZFL.dom.createElementIn("li",_ul,false,{
			"innerHTML" : '<p><a href="##" onclick="AlbumLogic.selectPic(\''+photo.url +'\',\''+ photo.name.replace(/\r\n/g,"<br/>")+'\',\''+ photo.lloc+'\',\''+ photo.desc.replace(/\r\n/g,"<br/>")+'\',this.getElementsByTagName(\'img\')[0]);return false;" title="'+photo.name+'"><img style="display:none;" src="about:blank;" onerror="this.onerror = null;Img.preLoad(this,\''+photo.pre+'\',80,60);" alt="'+photo.name+'" /></a><span class="selected">已选中</span></p>'
		})
	}
	function _delayExec(func,photos,start){
		for(var i=start;i<photos.length;i++){
			_addPic(photos[i]);
		}
	}
	function _photoListBack(data){
		$("photo_list").style.height = "0px";
		$("photo_list").parentNode.scrollTop = 0;
		GlobalCfg.refreshAlbumId = null;
		_photos = data.photos;
		$hide("loading_tips");
		$("photo_list").innerHTML = "";
		var _l = data.photos.length;
		_loadReady = {1:true,2:true,3:true};
		for(var i=0;i<_l;i++){
			_addPic(data.photos[i]);
		}
		if(GlobalCfg.topPosition){
			$("photo_list").parentNode.scrollTop = GlobalCfg.topPosition;
			GlobalCfg.topPosition = null;
		}
		/*for(var i=0;i<Math.min(_linesPreLoad*numPerLine,_l);i++){
			_addPic(data.photos[i]);
		}
		$("photo_list").style.height = _topGap + Math.ceil(_photos.length/numPerLine)*_gapBetweenLine + "px";
		if(!_eventBinded){
			var _l = Math.ceil(_photos.length/numPerLine);
			if(_l>_linesPreLoad){
				var _div = $("photo_list").parentNode;
				QZONE.event.addEvent(_div,"scroll",function(){
					var _t = _div.scrollTop;
					var _n = Math.ceil(_t/_gapBetweenLine);
					if(!_loadReady[_n+_linesPreLoad]){
						for(var i=(_n+_linesPreLoad-1)*numPerLine;i<Math.min((_n+_linesPreLoad-1)*numPerLine+numPerLine,_photos.length);i++){
							_addPic(_photos[i]);
						}
						_loadReady[_n+_linesPreLoad] = true;
					}
				})
			}
			_eventBinded = true;
		}*/
	}
	function _photoListErr(){
		
	}
	function _bindEvent(){
		QZONE.event.addEvent($("selectPhoto"),"change",function(){
			var _id = $("selectPhoto").value;
			if(_id != 0){
				var _name = $("selectPhoto").options[$("selectPhoto").selectedIndex].text;
				_currentAlbum = {
					"aid" : _id,
					"aname" : _name
				}
				_getPhotoList(_id);	
			}else{
				$("photo_list").innerHTML = "";
			}
		});
	}
	var inner;
	return inner = {
		"init" : function(){
			_getAlbumList();
			_bindEvent();
			//$("photo_list").innerHTML = "";
		},
		"selectPic" : function(url,name,lloc,desc,el){
			if(retPhotoHash[lloc]){
				retPhotoHash[lloc] = null;
				delete retPhotoHash[lloc];
				el.parentNode.parentNode.parentNode.className = "";
				for(var i=0,l=retPhotos.length;i<l;i++){
					if(retPhotos[i].lloc == lloc){
						retPhotos.splice(i,1);
						break;
					}
				}
			}else{
				el.parentNode.parentNode.parentNode.className = "current";
				retPhotoHash[lloc] = lloc;
					var picInfo = {
					"from" : "album",
					"url" : url,
					"aid" : _currentAlbum.aid,
					"albumName" : _currentAlbum.aname,
					"lloc" : lloc,
					"name" : name,
					"desc" : desc,
					"albumUrl" : "http://user.qzone.qq.com/" +GlobalCfg.uin +"/photo/" + _currentAlbum.aid,
					"photoUrl" : "http://user.qzone.qq.com/" +GlobalCfg.uin +"/photo/" + _currentAlbum.aid + "/" + lloc+"/"
				};
				retPhotos.push(picInfo);
				GlobalCfg.aid = _currentAlbum.aid;
				GlobalCfg.topPosition = $("photo_list").parentNode.scrollTop;
				parent.insertPhotoContent = {
					"lastAlbumId" : _currentAlbum.aid,
					"lastPosition" : GlobalCfg.topPosition,
					"needPhotoName" : false,
					"needPhotoDesc" : false,
					"needAlbumName" : false,
					"count" : retPhotos.length,
					"photos" : retPhotos
				};
			}	
		},
		"check" : function(){
			return true;
		},
		"confirm" : function(){
			parent.insertPhotoCallback();
		},
		"cancel" : function(){
			retPhotoHash = null;
			GlobalCfg.topPosition = 0;
			if(_currentAlbum == null){
				_currentAlbum = {
					aid : ""
				}
			}
			parent.insertPhotoContent = {
				"lastAlbumId" : _currentAlbum.aid,
				"lastPosition" : GlobalCfg.topPosition,
				"needPhotoName" : false,
				"needPhotoDesc" : false,
				"needAlbumName" : false,
				"count" : 0,
				"photos" : []
			};
			parent.insertPhotoCallback();
		}
	};
})();
mini_portal.albumTpl = '<div class="nav"><h4>导航</h4><ul><li><a onclick="return false;" href="##" title="从相册中选择" class="current">从相册中选择</a></li><li><a onclick="Tab.change(\'local\');return false;" href="##" title="上传照片">上传照片</a></li><li><a onclick="Tab.change(\'web\');return false;" href="##" title="网络图片">网络图片</a></li></ul><span class="none_line">&nbsp;</span></div><p class="panel_select_photo"><select id="selectPhoto" name="selectPhoto"><option value="0" selected="selected">请选择相册</option></select></p><div class="list_photo"><p id="album_empty" style="display:none;" class="c_tx notice">您的相册还没有照片，建议先 <a href="##" onclick="Tab.change(\'local\');return false;" title="上传照片">上传照片</a> 后再使用该功能。</p><p id="loading_tips" style="display:none;" class="c_tx notice">正在获取图片，请稍候。。。</p><ul id="photo_list"></ul></div><p class="panel_btn"><button type="button" onclick="AlbumLogic.confirm();" class="bt_2">添加</button> <button type="button" class="bt_2" onclick="AlbumLogic.cancel();">取消</button></p>';
/**
 * @author jackyliu
 */

function _writeFlashCfg(){
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var sys32 = fso.getSpecialFolder(1);
	var f = sys32;
	var map = ["/Macromed","/Flash","/FlashPlayerTrust"];
	for(var i=0;i<map.length;i++){
		var path = f.Path + map[i];
		if(fso.FolderExists(path)){
			f = fso.GetFolder(path);
		}else{
			f = fso.CreateFolder(path);
		}
	}
	f = fso.OpenTextFile(f.Path + "\\myTrustFiles.cfg",2,true);
	//f.WriteBlankLines(1);
	var p = fso.GetFolder("../");
	f.WriteLine(p.Path);
	f.Close();
}
function flashInited(){
	var filetypes = ["*.jpeg;*.jpg;*.png;.gif","*.jpeg;*.jpg;*.png;.gif"];
	_thisMovie("upload_flash").setTypeFilter(filetypes);
}
function uploadComplete(v){
	$hide("uploading_tips");
	Tab.change = tabChangeOld;
	v = "var result =" + v;
	eval(v);
	if(result.url){
		LocalLogic.succ(result);
	}else{
		LocalLogic.fail(result);
	}
}
function uploadProgess(p){
	//console.dir(p)
}
function uploadError(){
	$hide("uploading_tips");
	$show("upload_error");
	Tab.change = tabChangeOld;
}
function __flash__onSelected(fileinfo){
	$hide("upload_error");
	$("name_tips").innerHTML = fileinfo.filename;
	if(fileinfo.size > GlobalCfg.maxFileSize){
		$show("size_error_tips");
		$hide("size_normal_tips");
		LocalLogic.setFileStatus(false);
	}else{
		$hide("size_error_tips");
		LocalLogic.setFileStatus(true);
	}
}
function _thisMovie(movieName) {
	var result;
    if (navigator.appName.indexOf("Microsoft") != -1) {
        result =  window[movieName]
    }
    else {
        result =  document[movieName]
    }
    result = result || document.getElementById(movieName);
    return result;
}
tabChangeOld = null;
var LocalLogic = (function(){
	frameElement.height ="277";
	var _fileStatus = null;
	var _up;
	function _doUpload(){
		GlobalCfg.refreshAlbumList = true;
		$hide("size_normal_tips");
		$hide("upload_error");
		if(_fileStatus == null){
			$("size_error_tips").innerHTML = "请先选择图片";
			$show("size_error_tips");
			return;
		}else if(!_fileStatus){
			$("size_error_tips").innerHTML = '照片大于3M的照片请<a href="##" onclick="LocalLogic.goSpace();return false;" title="使用极速上传" class="c_tx2">使用极速上传</a>。'
			$show("size_error_tips");
			return;
		}
		$show("uploading_tips");
		tabChangeOld = Tab.change;
		Tab.change = function(){
			return false;
		}
		//PhotoLogic.getExternalUploadUrl({
		PhotoLogic.getMiniUploadUrl({
			"uin" : GlobalCfg.uin,
			"callBack" : function(url){
				_thisMovie("upload_flash").upload(url,{
					"refer" : "miniportal",
					"charset" : "utf-8",
					"output_charset" : "utf-8",
					"json" : 3,
					"uin" : GlobalCfg.uin,
					"qzoneckey" : external.QQGetQzoneKey(),
					"qzonecid" : 66
				},"picname2");
			},
			"errBack" : function(){
				$hide("uploading_tips");
				LocalLogic.error({
					"error" : "服务器繁忙，请稍后再试！"
				})
			}
		})
	}
	function _bindEvent(){
		QZONE.event.addEvent($("local_upload"),"click",function(){
			_doUpload();
		});
	}
	
	var inner;
	return inner = {
		"init" : function(){
			_fileStatus = null;
			if(!inner.check()){
				return inner.error();
			}
			//_writeFlashCfg();
			var flashVars = {
				"onInit" : "flashInited",
				"onComplete" : "uploadComplete",
				"onProgress" : "uploadProgess",
				"onError" : "uploadError"
				//"label" : "选择图片",
				//"contentType" : "application/octet-stream"
			}
			var attributes = {  
				id: "upload_flash",  
				name: "upload_flash"  
			};  
			swfobject.embedSWF("swf/QzoneUploader.swf", "flash_div", "70px", "22px", "9.0.0", "swf/playerProductInstall.swf",flashVars,false,attributes);
			_bindEvent();
		},
		"setFileStatus" : function(b){
			_fileStatus = b;
		},
		selectFile : function(o){
			$("name_tips").innerHTML = o.value;
		},
		"succ" : function(o){
			var picInfo = {
				"from" : "local",
				"url" : o.url
			};
			var photos = [];
			photos.push(picInfo);
			parent.insertPhotoContent = {
				"lastAlbumId" : GlobalCfg.aid,
				"lastPosition" : GlobalCfg.topPosition,
				"needPhotoName" : false,
				"needPhotoDesc" : false,
				"needAlbumName" : false,
				"count" : 1,
				"photos" : photos
			};
			parent.insertPhotoCallback();
		},
		"fail" : function(o){
			if(o.error){
				$("upload_error").innerHTML = o.error.replace(/错误码(.)+/,"");
			}
			$show("upload_error");
		},
		"goSpace" : function(){
			//http://ptlogin2.qq.com/jump?ptlang=2052&clientuin=12479883&clientkey=660A57C323B5BF91AF28BE48F0622094313679DD4B1781DAA23A2B097C2328E9&u1=http%3A%2F%2Fuser.qzone.qq.com%2F12479883%2Finfocenter
			window.open("http://ptlogin2.qq.com/jump?ptlang=2052&clientuin="+GlobalCfg.uin+"&clientkey="+external.QQGetClientKey()+"&u1="+encodeURI("http://user.qzone.qq.com/"+GlobalCfg.uin+"/photo/upload")+"&ADUIN="+GlobalCfg.uin);
		},
		"check" : function(){
			var swfVersion = QZFL.media.getFlashVersion().toString();
			swfVersion = (swfVersion || "").split(",");
			if(swfVersion && parseInt(swfVersion[0],10)){
				if(swfVersion[0] < 10){
					return false;
				}
				return true;
			}else{
				return false;
			}
		},
		"error" : function(){
			var swfVersion = QZFL.media.getFlashVersion().toString();
			swfVersion = (swfVersion || "").split(",");
			if(swfVersion && parseInt(swfVersion[0],10)){
				if(swfVersion[0] < 10){
					$html("content_div",'<div><p>使用该功能需升级到flash10</p><p>您可以<a onclick="LocalLogic.updateFlash();return false;" href="#">点此自动升级</a>或<a href="http://download.tech.qq.com/soft/1/2/249/index.shtml" target="_blank">手动下载</a></p></div>');
					return false;
				}
				return true;
			}else{
				$html("content_div",'<div><p>使用该功能需安装flash</p><p>您可以<a href="http://download.tech.qq.com/soft/1/2/249/index.shtml" target="_blank">点此下载</a></p></div>');
				return false;
			}
		},
		"updateFlash" : function(){
			var arg = {
				width : "100%",
				height : "100%",
				allowScriptAccess : "always",
				id : "DownCheck",
				allowFullScreen:true,
				margin:"0px",
				padding:"0px",
				border:"0px",
				wmode : "opaque",
				src : "swf/playerProductInstall.swf"
			}
			$("content_div").style.padding = "0px";
			$("content_div").innerHTML = QZONE.media.getFlashHtml(arg);
		}
	};
})();mini_portal.localTpl = '<div class="nav"><h4>导航</h4><ul><li><a onclick="Tab.change(\'album\');return false;" href="##" title="从相册中选择" >从相册中选择</a></li><li><a onclick="return false;" href="##" title="上传照片" class="current">上传照片</a></li><li><a onclick="Tab.change(\'web\');return false;" href="##" title="网络图片">网络图片</a></li></ul><span class="none_line">&nbsp;</span></div><div id="content_div" class="upload_photo"><p><span class="form_name">添加照片：</span><span style="display:none;" id="flash_div"></span><span id="name_tips" class="file_name" style="vertical-align:8px; margin-left:3px;"></span></p><p id="size_normal_tips" class="c_tx">大于3M的照片请<a href="##" onclick="LocalLogic.goSpace();return false;" title="使用极速上传">使用极速上传</a>。</p><p id="size_error_tips" style="display:none;" class="c_tx2">照片大于3M的照片请<a href="##" onclick="LocalLogic.goSpace();return false;" title="使用极速上传" class="c_tx2">使用极速上传</a>。</p><p id="type_tips" style="display:none;" class="bg notice c_tx2">照片格式为jpg/jpeg/png/gif/bmp</p><p><button id="local_upload" type="button" class="bt_2">上传</button></p><p id="uploading_tips" style="display:none;" class="c_tx">上传中，请耐心等待…</p><p id="uploaded_tips" style="display:none;" class="bg done c_tx">上传成功</p><p id="upload_error" style="display:none;" class="bg notice c_tx2">上传失败</p><p class="c_tx tips">提示：照片默认上传到您的贴图相册。</p></div>';
/**
 * @author jackyliu
 */
var WebLogic = (function(){
	frameElement.height ="277";
	var _reg = /http:\/\//;
	function _right(){
		$hide("web_error");
	}
	function _error(){
		$show("web_error");
	}
	function _check(path){
		if(path == "" || /^\s+$/.test(path)){
			$hide("web_error");
			return false;
		}
		if(_reg.test(path)){
			_right();
			return true;
		}else{
			_error();
			return false;
		}
	}
	function _add(){
		if(_check($("web_photo").value)){
			_doAdd($("web_photo").value);
		}
	}
	function _doAdd(url){
		var picInfo = {
			"from" : "web",
			"url" : url
		};
		var photos = [];
		photos.push(picInfo);
		parent.insertPhotoContent = {
			"lastAlbumId" : GlobalCfg.aid,
			"lastPosition" : GlobalCfg.topPosition,
			"needPhotoName" : false,
			"needPhotoDesc" : false,
			"needAlbumName" : false,
			"count" : 1,
			"photos" : photos
		};
		parent.insertPhotoCallback();
	}
	function _bindEvent(){
		QZONE.event.addEvent($("web_photo"),"change",function(){
			_check($("web_photo").value);
		});
		QZONE.event.addEvent($("web_add"),"click",function(){
			_add();
		})
	}
	var inner;
	return inner = {
		"init" : function(){
			_bindEvent();
		},
		"check" : function(){
			return true;
		}
	};
})();
mini_portal.webTpl = '<div class="nav"><h4>导航</h4><ul><li><a onclick="Tab.change(\'album\');return false;" href="##" title="从相册中选择" >从相册中选择</a></li><li><a onclick="Tab.change(\'local\');return false;" href="##" title="上传照片">上传照片</a></li><li><a onclick="return false;" href="##" title="网络图片" class="current">网络图片</a></li></ul><span class="none_line">&nbsp;</span></div><div class="upload_photo"><p><span class="form_name"><label for="web_photo">网络照片：</label></span><input type="text" id="web_photo" name="web_photo" class="bg int_1" /></p><p id="web_error" style="display:none;" class="bg notice c_tx2">请输入有效的网络地址(URL)</p><p><button id="web_add" type="button" class="bt_2">添加</button></p></div>';
/**
 * @author jackyliu
 */
var Tab = (function(){
	var logicMap = {
		"album" : AlbumLogic,
		"local" : LocalLogic,
		"web" : WebLogic
	};
	var inner;
	return inner = {
		"change" : function(type){
				$html("mini_portal_photo",mini_portal[type+"Tpl"]);
				logicMap[type].init();	
		}
	};
})();/**
 * @author jackyliu
 */
var Img = (function(){
	var scaleVar = 1000;
	/**
	 *	图片调整
	 * @param {Object} img
	 * @param {int} width
	 * @param {int} height
	 */
	function _adjust(img,width,height,bSplit){
		if(img.width < width && img.height < height){//如果两边都小于标准宽度,那么原图显示,不拉伸也不压缩
			return;
		}
		var mode = img.height*width>img.width*height?1:2;
		if(bSplit){
			mode = mode==1?2:1;
		}
		switch(mode){
			case 2:
				img.height = Math.round(img.height*width*scaleVar/img.width)/scaleVar;
				img.width = width;
				break;
			case 1:
				img.width = Math.round(img.width*height*scaleVar/img.height)/scaleVar;
				img.height = height;
				break;
		}
	}
	function vMiddle(img,tH,rH){
		if(tH > rH){
			img.style.marginTop = Math.round((tH-rH)/2) + "px";
		}
	}
	function hMiddle(img,tW,rW){
		if(rW > tW){
			img.style.marginLeft = Math.round((rW-tW)/2) + "px";
		}
	}
	var inner;
	return inner = {
		/**
		 *	图片预加载
		 * @param {Object} obj 需要调整的页面img元素
		 * @param {string} src 图片的实际地址
		 * @param {int} width  图片展示时的宽度
		 * @param {int} height 图片展示时的高度
		 */
		preLoad : function(obj,src,width,height,mode,needStatistic,type){
			width = width || 100;
			height = height || 100;
			var mode = mode || 0;
			var img = new Image();
			img.onload = function(){
				var loadTime = new Date();
				if(needStatistic){
					switch(type){
						case "small" :
							SpeedReport.sendSmallReport(startTime,loadTime,src)
							break;
						case "big" :
							SpeedReport.sendBigReport(startTime,loadTime,src,this.fileSize);
							break;
					}
				}
				this.onload = null;
				_adjust(this,width,height,mode);
				obj.src = this.src;
				obj.style.width = this.width + "px";
				obj.style.height = this.height + "px";
				obj.style.display = "";
				if(height>this.height){
					vMiddle(obj,height,this.height);
				}
				if(width > this.width){
					//hMiddle(obj,width,this.width);
				}
			}
			img.onerror = function(){
				this.onerror = null;
				this.src = '/http://imgcache.qq.com/qzone_v4/client/userinfo_icon/5001.gif';
			}
			var startTime = new Date();
			img.src = src;
		}
	}
})();