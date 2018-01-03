var $extend = function(){
	var args = arguments;
	if (!args[1]) args = [this, args[0]];
	for (var property in args[1]){
		var old = args[0][property];
		args[0][property] = args[1][property];
		if(typeof old == "function"){
			args[0][property].parent = old;
		}
	}
	return args[0];
};
Function.prototype.bind = function(obj){
	var _method = this;
	return function(){
		return _method.apply(obj,arguments);
	}
}
Function.prototype.pass = function(){
	var args = arguments;
	var _method=this;
	return function(){
		return _method.apply(null,args);
	}
}
/**
 * 相册用户模块
 */
var QPHOTO = QPHOTO || {};
QPHOTO.setDef = function(map,key,value){
	if(map && map[key] == null){
		map[key] = value;
	}
};
(function(){
	var _t = top;
	QZFL = QZONE;
	if(QZONE && QZONE.FP){
		_t = QZONE.FP._t;
	}
	//设置data缓存数据
	if(_t.QZFL && _t.QZFL.dataCenter){
		QPHOTO.data = _t.QZFL.dataCenter;
	}else{
		top.g_JData = top.g_JData || {};
		var _d = top.g_JData;
		QPHOTO.data = {
			"save" : function(key,value){
				_d[key] = value;
			},
			"get" : function(key){
				return _d[key]
			},
			"del" : function(key){
				delete _d[key]
			}
		}
	}

	var _getter = QZFL.JSONGetter;
	if(!ua.ie && _t.QZFL){//非ie下使用本地的会出现莫名奇妙的问题
		_getter = _t.QZFL.JSONGetter;
	}
	QPHOTO.util = QPHOTO.util || {};
	QPHOTO.util.loadJsonData = function(xId, url, callback, errcallback, refresh, charset, callbackFunctionName){
		var _d = QPHOTO.data.get(xId);
		if(_d && !refresh && !_d.error){
			callback(_d);
			return;
		}
		charset = charset || "GB2312";
		var cFN = callbackFunctionName || "JsonCallback";
		var	snd = new _getter(url, void(0), null, charset);
		snd.onSuccess = function(o){
			try{
				QPHOTO.data.save(xId,o)
				callback(QPHOTO.data.get(xId));
			}catch(err){
				if(err.number && err.number==-2146823281){
					//ignore
				}
			}
		};
		if (typeof errcallback == 'function') {
			snd.onError = errcallback;
		}
		snd.send(cFN);
	}
	QPHOTO.util.getIdx = function(array,key,value){
		for(var i=array.length-1; i >= 0; --i){
			if(array[i][key] == value){
				return i;
			}
		}
		return null;
	}
})()

/**
* 封装loadJsonData方法,支持回调备用数据url
* @param parameter={
	xId:缓存ID,
	url:数据来源URL,
	url2:备用数据来源URL,
	cDFn:检查数据函数(checkDataFunction),
	sucCb:正确回调,
	errCb:错误,
	refresh:是否总是获取服务器数据,
	charset:数据源charset,
	cFn:数据源回调接口(callbackFunction)
}
* @version 1.0
* @author camdyzeng
*/
QPHOTO.loadJSON = (function(){
	var _setDef = QPHOTO.setDef;
	var _param;
	var _callback = function(){
		var args = arguments;
		//cDFn 返回 0：成功，1：失败可以重试，-1：失败不需要重试
		var ret = _param.cDFn(args[0]);
		if(ret == 0){//成功
			_param.sucCb.apply(null,args);
		}else if(ret == -1){//失败不需要重试
			_param.errCb = _param.errCb.parent || _param.errCb;
			_param.errCb.apply(null,args);
		}else{//失败可以重试
			_param.errCb.apply(null,args);
		}
	}
	var _send2 = function(){
		_param.errCb = _param.errCb.parent || _param.errCb;
		var p = _param;
		QPHOTO.util.loadJsonData(p.xId,p.url2,_callback,p.errCb,true,p.charset,p.cFn);
	}
	var _send = function(){
		var p = _param;
		QPHOTO.util.loadJsonData(p.xId,p.url,_callback,p.errCb,p.refresh,p.charset,p.cFn);
	}
	return function(parameter){
		_param = parameter || {};
		_setDef(_param,"url2",null);
		_setDef(_param,"cDFn",QZFL.emptyFn);
		_setDef(_param,"errCb",QZFL.emptyFn);
		if(_param.url2){
			$extend(_param,{errCb : _send2})
		}
		_send();
	} 
})();
/**
 * 用户域名
 */
QPHOTO.domain = (function(){
	var _setDef = QPHOTO.setDef;
	var _data;
	var _getDomain = function(param){
		QPHOTO.loadJSON({
			xId : param.key,
			url : "http://route.store.qq.com/GetRoute?UIN="+param.uin+"&type=json&version=2",
			url2 : "http://rb.store.qq.com/GetRoute?UIN="+param.uin+"&type=json&version=2",
			cDFn : _check.bind(param),
			sucCb : param.sucCb,
			errCb : param.errCb,
			charset : "gb2312",
			cFn : "photoDomainNameCallback"
		});
	}
	var _check = function(data,param){
		try{
			param = param || this;
			if(data && (!data.error) &&	data.uin == param.uin ){
				var _k;
				if(data.domain){
					_k = data.domain["default"];
					_data = data[_k];
				}else{
					_data = data;
				}
				if(_data.r.match(/qq\.com/) &&
					_data.u.match(/qq\.com/) &&
					_data.nu.match(/qq\.com/) &&
					_data.p.match(/qq\.com/) &&
					_data.s.match(/qq\.com/)){
					return 0;
				}else{
					return 1;
				}
			}else{
				return 1;
			}
		}catch(e){
			return 1;
		}
	}
	var inner;
	return inner = {
		//parameter:{uin:,sucCb:,errCb:}
		get : function(parameter){
			var param = parameter || {};
			_setDef(param,"key","user_domain_"+param.uin);
			_setDef(param,"sucCb",QZFL.emptyFn);
			_setDef(param,"errCb",QZFL.emptyFn);
			_getDomain(param);
		},
		//parameter:{uin:}
		getData : function(parameter){
			var param = parameter || {};
			_setDef(param,"key","user_domain_"+param.uin);
			//var data = _dataCenter[param.key];
			var data = QPHOTO.data.get(param.key);
			var d = null;
			if(_check(data,param) == 0){
				d = {};
				$extend(d,_data);
			}
			return d;
		}
	}
})();
/**
 * 用户url
 */
QPHOTO.url = (function(){
	var _setDef = QPHOTO.setDef;
	var _gu = function(param){
		var domain = QPHOTO.domain.getData({uin:param.uin});
		if(!domain){
			return null;
		}
		var common_url_nu = "http://" + domain.nu + "/cgi-bin/common/";
		var common_url_r = "http://" + domain.r + "/cgi-bin/common/";
		var common_url_u = "http://" + domain.u + "/cgi-bin/upload/";
		var url;
		var suffix = "uin="+param.uin;
		switch(param.name) {	//URL
			case "album_list": url = "http://"+domain.p.replace("sznewp","alist").replace("xanewp","xalist")+"/fcgi-bin/fcg_list_album?"+suffix;break;
			case "album_list_bak": url = common_url_nu +  "cgi_list_album?"+suffix; break;
			case "album_add": url = common_url_nu +  "cgi_add_album?"+suffix; break;//创建相册
			case "album_del": url = common_url_nu +  "cgi_del_album?"+suffix; break;//删除相册
			case "album_mod": url = common_url_nu +  "cgi_modify_album?"+suffix; break;//修改相册

			case "pic_list": url = "http://" + domain.s.replace("static","plist") + "/fcgi-bin/fcg_list_photo";break;
			case "pic_list_private": url = common_url_nu +  "cgi_view_album?"+suffix; break;//浏览加密相册
			case "pic_mod": url = common_url_nu +  "cgi_modify_pic?"+suffix; break;
			case "pic_del": url = common_url_nu +  "cgi_del_pic?"+suffix; break;
			case "pic_mul_del":	url = common_url_nu + "cgi_delpic_multi?"+suffix;	break;	//批量删除
			case "pic_move": url = common_url_nu+ "cgi_move_pic?"+suffix; break;	//移动(批量)
			case "pic_upload": url = common_url_u + "cgi_upload_pic"; break; //上传
			case "pic_up_diary": url = common_url_u + "cgi_upload_illustrated"; break; //日志上传
			case "pic_up_activex": url = common_url_u + "cgi_upload_activex"; break; //控件上传
			case "pic_up_famous": url = common_url_u.replace(/up\.photo\.qq\.com/,"famousup.photo.qq.com") + "cgi_upload_pic"; break; //名博普通上传
			case "pic_up_diary_famous": url = common_url_u.replace(/up\.photo\.qq\.com/,"famousup.photo.qq.com") + "cgi_upload_illustrated"; break; //名博日志上传
			case "pic_up_activex_famous": url = common_url_u.replace(/up\.photo\.qq\.com/,"famousup.photo.qq.com") + "cgi_upload_activex"; break; //名博控件上传

			//评论相关
			case "add_cmt": url = common_url_nu +  "cgi_add_piccomment?"+suffix; break;
			case "new_photo" : url = "http://" + domain.s.replace('static','plist')+"/fcgi-bin/fcg_recent_picture?uin="+param.uin;break;
			case "album_add": url = common_url_nu +  "cgi_add_album?"+suffix; break;
			case "set_indivalbum" : url = common_url_nu + "cgi_set_indivalbum";break;
			case "upload_post" : url = common_url_u + "cgi_upload_post";break;
		}
		return url;
	}
	var inner;
	return inner = {
		//parameter:{uin:,name:,refer:,aid:}
		get : function(parameter){
			var param = parameter || {};
			_setDef(param,"key",param.name+"_"+param.uin);
			_setDef(param,"refer","qzone");
			return _gu(param);
		}
	}
})();

var PhotoLogic = (function(){
	var upCounter = 0;
	function getUserDomain(cfg){
		QPHOTO.domain.get({uin:cfg.uin,sucCb:cfg.callBack,errCb:cfg.errBack});
	}
	function getUrl(cfg){
		return QPHOTO.url.get({uin:cfg.uin,name:cfg.type,refer:cfg.refer});
	}
	function checkRet(d){
		d = d || {};
		if(d.ret == 0){
			return 0;
		}else if(d.ret == -961 || d.ret == -963){//不用重试
			return -1;
		}else{
			return 1;
		}
	}
	function _albumFilter(data,type){
		if(type == 16){ //自定义表情
			return data.album;
		}
		var ret = [];
		var priv, handset, name, d = data.album, tm;
		for(var i=0,len=d.length; i<len; ++i){
			tm = d[i];
			priv = tm.priv;
			handset = tm.handset;
			//QQ秀相册过滤
			if(handset == 4){
				name = trim(tm.name);
				if(name == "QQ秀形象_无背景"){
					continue;
				}
				if(name == "QQ秀相册" || name == "QQ秀合影" || name ==  "QQ秀形象" || name == "QQ秀泡泡"){
					if(type & 8){
						ret.push(tm);
					}
					continue;
				}
			}
			//私密相册过滤
			if((priv == 1 || priv == 4) && (type & 1)){
				ret.push(tm);
			}else if((priv == 2 || priv == 5) && (type & 2)){
				ret.push(tm);
			}else if(priv == 3 && (type & 4)){
				ret.push(tm);
			}
		}
		return ret;
	}
	function _getAlbumList(cfg){
		var data = {
			xId : cfg.uin+"_alist",
			url : getUrl({type:"album_list",uin:cfg.uin}) + '&refer=miniportal&self=0&outstyle=2&t=' + Math.random()+"&qzoneckey="+external.QQGetQzoneKey()+"&qzonecid="+66,
			url2 : getUrl({type:"album_list_bak",uin:cfg.uin}) + '&refer=miniportal&self=0&output_type=json&t=' + Math.random()+"&qzoneckey="+external.QQGetQzoneKey()+"&qzonecid="+66,
			cDFn : checkRet,
			sucCb : function(d){
				d.album = d.album || [];
				cfg.callBack({albums:_albumFilter(d,cfg.type),info:d.left.album});
			},
			errCb : function(d){
				d = d || {ret:-1,msg:"对不起，网络繁忙，请稍后再试！"};
				cfg.errBack(d);			
			},
			cFn : "_Callback",
			refresh : cfg.refresh
		};
		/*type : 位标志
			00001 : 公开相册[默认]
			00010 : 加密相册
			00100 : 私密相册
			01000 : QQ秀相册
			10000 : 自定义表情
		*/
		if(cfg.type == 16){//自定义表情
			data.xId = cfg.uin+"_alist_"+cfg.type;
			data.url += "&filter=2&handset=9";
			data.url2 += "&filter=2&handset=9";
		}
		QPHOTO.loadJSON(data);
	}
	function _photoFilter(data,type){
		if(!type){
			return data.pic;
		}
		var _typeMap = {
			"1" : "jpg",
			"2" : "gif",
			"3" : "png"
		}
		type = type.toLowerCase().replace("jpeg","jpg");
		var ret = [],d;
		for(var i = 0,len = data.pic.length; i<len; ++i){
			d = data.pic[i];
			if(type.match(_typeMap[d.phototype])){
				ret.push(d);
			}
		}
		return ret;
	}
	function _getPhotoList(cfg){
		var data = {
			xId : cfg.uin+"_plist_"+cfg.id,
			url : getUrl({type:"pic_list",uin:cfg.uin}) + "?uin=" + cfg.uin + "&refer=miniportal&albumid=" + cfg.aid + "&outstyle=json&t=" + Math.random()+"&qzoneckey="+external.QQGetQzoneKey()+"&qzonecid="+66,
			url2 : getUrl({type:"pic_list_private",uin:cfg.uin}) + "&refer=miniportal&albumid="+ cfg.aid + '&output_type=json&t=' + Math.random()+"&qzoneckey="+external.QQGetQzoneKey()+"&qzonecid="+66,
			cDFn : checkRet,
			sucCb : function(d){
				d.pic = d.pic || [];
				cfg.callBack({photos:_photoFilter(d,cfg.imageType),info:d});
			},
			errCb : function(d){
				d = d || {ret:-1,msg:"对不起，网络繁忙，请稍后再试！"};
				cfg.errBack(d);			
			},
			cFn : "_Callback",
			refresh : cfg.refresh
		};
		QPHOTO.loadJSON(data);
	}
	function _getNewPhoto(cfg){
		function callBack(d){
			if(d.ret == 0){
				cfg.callBack({"data":d,"photos":d.photos,"total":d.total});
			}else{
				cfg.errBack(d);
			}
		}
		function errBack(){
			cfg.errBack({ret:-1,msg:"对不起，网络繁忙，请稍后再试！"})
		}
		var url = getUrl({
			type : "new_photo",
			uin : cfg.uin
		})+"&t="+Math.random();
		QPHOTO.util.loadJsonData("new_photo_100",url,callBack,errBack,true,"gb2312","_Callback");
	}
	function _uploadWeb(cfg){
		if(QZONE && QZONE.FP && QZONE.FP._t && QZONE.FP._t.photoconf && QZONE.FP._t.photoconf.u == 0){
			//尊敬的QQ空间用户，相册正在进行临时维护，维护过程中，将不支持上传图片，建议您稍候再试！
			var _c=new top.QZONE.widget.Confirm("提示","尊敬的QQ空间用户:<br/>相册正在进行临时维护，维护过程中，将不支持上传图片，建议您稍候再试！",QZONE.widget.Confirm.TYPE.OK); 
			_c.tips[0]='确定'; 
			_c.show(); 
			return;
		}
		var _c = QZONE.dom.get(cfg.container);
		var _id = "_up_"+upCounter;
		var formId = this.formId = "_form"+_id;
		var inputFileId = this.inputFileId = cfg.inputId || "_form_file"+_id;
		var realInputFileId = "_form_file"+_id;
		var ifmId = this.ifmId = "_iframe"+_id;
		var ifmName = this.ifmName = "_ifram_name"+_id;

		_c.innerHTML = [
			'选择照片：<form id="'+formId+'" method="post" enctype="multipart/form-data" style="display:inline">',
				//'<input id="'+inputFileId+'" type="file" name="filename" style="height:20px">',
				(cfg.inputStr || '<input id="'+inputFileId+'" type="file" name="filename" style="height:20px">'),
			'</form>'
		].join("");

		var _destroy = QZFL.emptyFn;
		function errFn(d){
			if(typeof cfg.errBack == "function"){
				cfg.errBack(d);
			};
			_destroy();
		}

		function createIframe(){
			var ifm = QZONE.dom.createNamedElement("iframe",ifmName,document);
			ifm.id = ifmId;
			ifm.style.cssText = "height:0px;width:0px;border-width:0px;display:none;";
			_destroy = function(){
				setTimeout(function(){
					ifm.src="about:blank";
					QZONE.dom.removeElement(ifm);
					ifm = null;
					clearTimeout(timer);
				},1000);
				_destroy = QZFL.emptyFn;
			}
			var timer = null;
			ifm._Callback = function(data){
				clearTimeout(timer);
				ifm._Callback = null;
				ifm.onreadystatechange = null;
				cfg.errBack = cfg.errBack || cfg.callBack;
				var d = data.data;
				d.data = data.data;
				d.ret = d.error;
				if(data.data.error == null || data.data.error == -301){
					cfg.callBack(d);
				}else{
					cfg.errBack(d);
				}
				_destroy();
				QZFL.cookie.del("albumname");
				QZFL.cookie.del("albumpriv");
				QZFL.cookie.del("albumhandset");
			}

			if (typeof ifm.onreadystatechange != 'undefined') {
				ifm.onreadystatechange = function(){
					if(ifm.readyState == "complete"){
						ifm.onreadystatechange = null;	
						timer = setTimeout(function(){
							errFn({msg:"网络繁忙,请稍候再试"})
							_destroy();
					},5000);
					}
				};
			}
			else {// if (ua.firefox() || ua.opera()) {
				var interval = setInterval(function() {
							try {
								var _t = ifm.contentWindow.location.href;
								if (_t.indexOf(getUpUrl()) == 0) {
									timer = setTimeout(errFn.pass({msg:"网络繁忙,请稍候再试"}),5000);
									clearInterval(interval);
								}
							} catch (err) {
								timer = setTimeout(errFn.pass({msg:"网络繁忙,请稍候再试"}),5000);
								clearInterval(interval);
							}
						}, 100);
			}
			document.body.appendChild(ifm);
		}
		var getUpUrl = function(){
			if(cfg.isFamous){
				if(cfg.aid){
					return getUrl({uin:cfg.uin,type:"pic_up_famous",aid:cfg.aid,refer:cfg.refer});
				}else{
					return getUrl({uin:cfg.uin,type:"pic_up_diary_famous",aid:cfg.aid,refer:cfg.refer});
				}
			}else{
				if(cfg.aid){
					return getUrl({uin:cfg.uin,type:"pic_upload",aid:cfg.aid,refer:cfg.refer});
				}else{
					return getUrl({uin:cfg.uin,type:"pic_up_diary",aid:cfg.aid,refer:cfg.refer});
				}
			}
		}
		//{uin:,aid:,container:,isFamous:,extData,callBack:,errBack:,projectId:,pageId:}
		this.send = function(cfg2){
			$extend(cfg,cfg2);
			var src = document.getElementById(inputFileId).value;
			if(!src || src==""){
				errFn({msg:"请选择图片上传！"});
				return false;
			}
			var type = (src.substr(src.lastIndexOf("."))).toLowerCase();
			if(type != ".jpg" && type != ".gif" && type != ".jpeg" && type != ".png"){
				errFn({msg:"您上传图片的类型不符合(.jpg|.jpeg|.gif|.png)！"});
				return false;
			}
			$extend(cfg,{
				callBack :  function(ret){
					createIframe();
					var f = document.getElementById(formId);
					for(var i=f.childNodes.length-1; i > 0; i--){
						if(f.childNodes[i].type != "file"){
							QZONE.dom.removeElement(f.childNodes[i]);
						}
					}
					var _c = document.charset || document.characterSet;
					var data = cfg.extData || {};

					if(cfg.aid){
						var albums = ret.albums;
						var idx = QPHOTO.util.getIdx(albums, "id",cfg.aid);
						if(idx == null){
							errFn({msg:"非法相册ID"});
							return;
						}
						document.getElementById(inputFileId).name = "filename";
						var d = albums[idx];
						$extend(data, {
							"albumname" : d.name,
							"albumpriv" : d.priv,
							"albumhandset" : d.handset,
							"albumid" : d.id,
							"total" : d.total,
							"refer" : cfg.refer,
							"uin" : cfg.uin,
							"output_type" : "jsonhtml",
							"charset" : _c.toLowerCase()
						});
						QZFL.cookie.set("albumname",albums[idx].name,"qq.com",null,0.2);
						QZFL.cookie.set("albumpriv",albums[idx].priv,"qq.com",null,0.2);
						QZFL.cookie.set("albumhandset",albums[idx].handset,"qq.com",null,0.2);
					}else{
						document.getElementById(inputFileId).name = "picname2";
						$extend(data, {
							"refer" : cfg.refer,
							"uin" : cfg.uin,
							"output_type" : "jsonhtml",
							"charset" : _c.toLowerCase()
						});
					}
					for(var k in data){
						QZONE.dom.createElementIn("input",f,false,{"type":"hidden","name":k,"value":data[k]});
					}
					cfg.callBack = cfg.callBack.parent || cfg.callBack;
					f.action = getUpUrl();
					f.target = ifmName;
					try{
						f.submit();
					}catch(e){
						if(e.number == -2147024891){
							var ifm = document.getElementById(ifmId);
							var fn = ifm.onreadystatechange;
							ifm.proxyReady = function(){
								ifm.proxyReady == null;
								if(fn){
									ifm.onreadystatechange = fn;
								}
								try{
									f.submit();
								}catch(err){
									errFn({msg:"请输入正确的文件路径"});
								}
							}
							ifm.src = "http://imgcache.qq.com/qzone/client/photo/pages/qzone_v4/proxy.html";
						}else{
							errFn({msg:"请输入正确的文件路径"});
						}
					}
				}
			});
			cfg.type = cfg.type || 7;
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					if(cfg.aid){
						_getAlbumList(cfg);
					}else{
						cfg.callBack();
					}
				}
			})
		}
		upCounter++;
	}
	var inner;
	return inner = {
		/**
		 * 获取相册列表
		 * @param {Object} cfg 参数对象{
		 *	 uin:,//QQ号码
		 *	 type:,//获取的相册类型，位标志	00001:公开相册[默认]； 00010:加密相册； 00100:私密相册； 01000:QQ秀相册； 10000:自定义表情
		 *	 refresh:,//是否刷新数据，默认false(优先从内存中取数据)，
		 *	 refer:,//业务的refer，
		 *	 callBack:,//成功回调函数，第一个参数数据{info:{相册用户信息对象},albums:[相册列表数组]}
		 *	 errBack:,//错误回调函数，第一个参数数据{ret:-1,msg:"err msg"},ret为非0整型
		 *	 projectId:,//使用相册统一接口的业务ID，业务需要到相册申请ID
		 *	 pageId://业务个使用的页面id
		 *	}
		 */
		getAlbumList : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					cfg.type = cfg.type || 1;
					_getAlbumList(cfg);
				}
			})
		},
		/**
		 * 获取照片列表
		 * @param {Object} cfg 参数对象{
		 *	 uin:,//QQ号码
		 *	 aid:,//相册ID
		 *   imageType:,//获取的照片类型，默认"jpg|jpeg|gif|png"
		 *	 refresh:,//是否刷新数据，默认false(优先从内存中取数据)，
		 *	 refer:,//业务的refer，
		 *	 callBack:,//成功回调函数，第一个参数数据{info:{相册信息},photos:[照片列表数组]}
		 *	 errBack:,//错误回调函数，错误回调函数，第一个参数数据{ret:-1,msg:"err msg"},ret为非0整型
		 *	 projectId:,//使用相册统一接口的业务ID，业务需要到相册申请ID
		 *	 pageId://业务个使用的页面id
		 *	}
		 */
		getPhotoList : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			cfg.aid = cfg.id = cfg.aid || cfg.id;//aid和id都是相册id
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					_getPhotoList(cfg);
				}
			})
		},
		/**
		 * 获取最新照片列表
		 * @param {Object} cfg 参数对象{
		 *	 uin:,//QQ号码
		 *	 refresh:,//是否刷新数据，默认false(优先从内存中取数据)，
		 *	 refer:,//业务的refer，
		 *	 callBack:,//成功回调函数，第一个参数数据{info:{相册用户信息对象},photos:[相册列表数组]}
		 *	 errBack:,//错误回调函数，错误回调函数，第一个参数数据{ret:-1,msg:"err msg"},ret为非0整型
		 *	 projectId:,//使用相册统一接口的业务ID，业务需要到相册申请ID
		 *	 pageId://业务个使用的页面id
		 *	}
		 */
		getNewPhoto : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					_getNewPhoto(cfg);
				}
			})
		},
		/**
		 * 照片上传接口
		 * @param {Object} cfg 参数对象{
		 *   uin:,//QQ号码
		 *   aid:,//需要上传的相册ID，默认上传到贴图相册
		 *   container:,//上传form父节点id
		 *   isFamous:,//名博标志位，默认非名博
		 *   refer:,//业务的refer，
		 *   extData:,//是hash对象，扩展是向后台提交数据
		 *   type:,//获取的相册类型，位标志	00001:公开相册[默认]； 00010:加密相册； 00100:私密相册； 01000:QQ秀相册； 10000:自定义表情
		 *   callBack:,//成功回调函数
		 *   errBack:,//错误回调函数，错误回调函数，第一个参数数据{ret:-1,msg:"err msg"},ret为非0整型
		 *   projectId:,//使用相册统一接口的业务ID，业务需要到相册申请ID
		 *   pageId://业务个使用的页面id
		 *	}
		 */
		uploadWeb : _uploadWeb,
		/**
		 * 获取日志上传URL
		 * @param {Object} cfg 参数对象{
		 *	 uin:,//QQ号码
		 *	 refresh:,//是否刷新数据，默认false(优先从内存中取数据)，
		 *	 refer:,//业务的refer，
		 *	 callBack:,//成功回调函数
		 *	 errBack:,//错误回调函数，错误回调函数，第一个参数数据{ret:-1,msg:"err msg"},ret为非0整型
		 *	 projectId:,//使用相册统一接口的业务ID，业务需要到相册申请ID
		 *	 pageId://业务个使用的页面id
		 *	}
		 */
		getUploadUrl : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					cfg.callBack(getUrl({uin:cfg.uin,type:"pic_up_diary",aid:cfg.aid,refer:cfg.refer}))
				}
			})
		},
		/**
		 * 获取上传URL
		 * @param {Object} cfg 参数对象{
		 *	 uin:,//QQ号码
		 *	 refresh:,//是否刷新数据，默认false(优先从内存中取数据)，
		 *	 refer:,//业务的refer，
		 *	 callBack:,//成功回调函数
		 *	 errBack:,//错误回调函数，错误回调函数，第一个参数数据{ret:-1,msg:"err msg"},ret为非0整型
		 *	 projectId:,//使用相册统一接口的业务ID，业务需要到相册申请ID
		 *	 pageId://业务个使用的页面id
		 *	}
		 */
		getExternalUploadUrl : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					cfg.callBack(getUrl({uin:cfg.uin,type:"upload_post",aid:cfg.aid,refer:cfg.refer}))
				}
			})
		},
		getMiniUploadUrl : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					cfg.callBack(getUrl({uin:cfg.uin,type:"pic_up_diary",aid:cfg.aid,refer:cfg.refer}))
				}
			})
		},
		getCommentUrl : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			getUserDomain({
				uin : cfg.uin,
				errBack : cfg.errBack,
				callBack : function(){
					cfg.callBack(getUrl({uin:cfg.uin,type:"add_cmt",refer:cfg.refer}))
				}
			})
		}
	}
})();
/**
* 扩展接口
*/
(function(){
	var Q = QPHOTO;
	/**
	 * post提交数据
	 * @param {String} url 提交数据的url
	 * @param {object} data 提交的数据 hash
	 * @param {function} sucCb 成功时回调
	 * @param {function} errCb 失败时回调
	 */
	QPHOTO.util.dataSender = function(url,data,sucCb,errCb){
		sucCb = sucCb || QZFL.emptyFn;
		errCb = errCb || QZFL.emptyFn;

		data.output_type = "jsonhtml";
		data.refer = data.refer || "jsapi";

		var post = new QZFL.FormSender(url,"post",data,"gb2312");
		post.onSuccess = function(d){
			if( d.ret == 0 ) {
				sucCb(d);
			}else{
				errCb(d);
			}
		}
		post.onError = function(d){
			errCb({
				"ret" : "-1",
				"msg" : "对不起，网络繁忙，请稍后再试！"
			});
		}
		post.send();
	};
	//"2008-09-23 15:33:33"这种格式的时间转成整形/秒
	function _parseTime(t){
		var ts = t.split(/\-|\s|\:/);
		for(var i=0; i<6; i++){
			if(typeof( ts[i] = parseInt(ts[i],10) ) != "number"){
				ts[i] = 1;
			}
		}
		var time = new Date(ts[0],ts[1]-1,ts[2],ts[3],ts[4],ts[5]);
		return Math.round(time.getTime()/1000);
	}
	function _getCodelist(d){
		var list = [];
		for(var i=d.length-1; i>=0; --i){
			list.push([
				d[i].lloc,
				_parseTime(d[i].uploadtime),
				d[i].forum
			].join("|"));
		}
		return list.join("_");
	}
	//获得新的封面，如果不需要设置封面，则返回空，需要设置新的封面，则返回新封面的sloc
	function _getNewCover(coverLloc,allList,checkList){
		if(Q.util.getIdx(checkList,"lloc",coverLloc) != null || Q.util.getIdx(allList,"lloc",coverLloc) == null){
			for(var i=0; i < allList.length; i++){
				if(Q.util.getIdx(checkList,"lloc",allList[i].lloc) == null){
					return allList[i].sloc
				}
			}
		}
		return "";
	}
	function _getList(photos,llocList){
		var _m = {};
		for(var i=0,len=llocList.length; i<len; ++i){
			_m[llocList[i]] = true;
		}
		var ret = [];
		for(var i=0,len=photos.length; i<len; ++i){
			if(_m[photos[i].lloc]){
				ret.push(photos[i]);
			}
		}
		return ret;
	}

	$extend(PhotoLogic,{
		/**
		 * 创建相册
		 * @param {Object} cfg 参数对象{uin,name,desc,class,priv,refer,extData,callBack:,errBack:,projectId:,pageId:}，
		 * extData是hash对象，扩展是向后台提交数据
		 */
		addAlbum : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			QPHOTO.domain.get({uin:cfg.uin,sucCb:function(){
				cfg['class'] = cfg['class']|| 101; //相册类型，默认是人物(101)
				cfg.priv = cfg.priv || 1; //相册权限，默认是公开
				cfg.desc = cfg.desc || "";
				var data = cfg.extData || {};
				$extend(data, {
					"uin" : cfg.uin,
					"albumname" : cfg.name,
					"albumdesc" : cfg.desc,
					"albumclass" : cfg['class'],
					"priv" : cfg.priv,
					"refer" : cfg.refer,
					"bitmap" : cfg.priv==1?"10000000":"10000001"
				});
				var url = QPHOTO.url.get({uin:cfg.uin,name:"album_add",refer:cfg.refer});
				QPHOTO.util.dataSender(url,data,cfg.callBack,cfg.errBack);
			},errCb:cfg.errBack});
		},
		/**
		 * 删除相册
		 * @param {Object} cfg 参数对象{uin,aid,refer,extData,type,callBack:,errBack:,projectId:,pageId:}
		 * type : 相册类型，位标志	00001:公开相册[默认]； 00010:加密相册； 00100:私密相册； 01000:QQ秀相册； 10000:自定义表情
		 * extData是hash对象，扩展是向后台提交数据
		 */
		delAlbum : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			$extend(cfg,{
				callBack : function(d){
					var idx = QPHOTO.util.getIdx(d.albums,"id",cfg.aid);
					var abm = d.albums[idx];
					var data = cfg.extData || {};
					$extend(data, {
						"uin" : cfg.uin,
						"albumid" : abm.id,
						"albumname" : abm.name,
						"modifytime" : abm.modifytime,
						"refer" : cfg.refer
					});
					var url = QPHOTO.url.get({uin:cfg.uin,name:"album_del",refer:cfg.refer});
					QPHOTO.util.dataSender(url,data,function(ret){
						Array.prototype.splice.call(d.albums,idx,1);
						cfg.callBack.parent(ret);
					},cfg.errBack);
				}
			});
			cfg.type = cfg.type || 7;
			PhotoLogic.getAlbumList(cfg);
		},
		/**
		 * 修改相册 名字，说明，分类，权限
		 * @param {Object} cfg 参数对象{uin,aid,refer,extData,type,callBack:,errBack:,projectId:,pageId:}，
		 * type : 相册类型，位标志	00001:公开相册[默认]； 00010:加密相册； 00100:私密相册； 01000:QQ秀相册； 10000:自定义表情
		 *	extData = 名字{type:1,name:"new name"}，说明{type:2,desc:"new desc"}，分类{type:3,priv:101}，权限{type:3,priv:1}，
		 *	分类classMap = {
		 *		101 : "人物",
		 *		102 : "风景",
		 *		103 : "动物",
		 *		104 : "游记",
		 *		105 : "卡通",
		 *		106 : "生活",
		 *		107 : "其他"
		 *	}，权限1：公开，2：加密，3：私密
		 *  
		 */
		modAlbum : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			$extend(cfg,{
				callBack : function(d){
					var idx = QPHOTO.util.getIdx(d.albums,"id",cfg.aid);
					var abm = d.albums[idx];
					var data = cfg.extData || {};
					$extend(data, {
						"uin" : cfg.uin,
						"albumid" : abm.id,
						"refer" : cfg.refer
					});
					var url = QPHOTO.url.get({uin:cfg.uin,name:"album_mod",refer:cfg.refer});
					QPHOTO.util.dataSender(url,data,cfg.callBack.parent,cfg.errBack);
				}
			});
			cfg.type = cfg.type || 7;
			PhotoLogic.getAlbumList(cfg);
		},
		/**
		 * 删除照片
		 * @param {Object} cfg 参数对象{uin,aid,llocList,refer,extData,callBack:,errBack:,projectId:,pageId:}
		 * llocList需要删除的照片数组
		 * extData是hash对象，扩展是向后台提交数据
		 */
		delPhoto : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			$extend(cfg,{
				callBack : function(d){
					var list = _getList(d.photos,cfg.llocList);
					if(list.length < 1){
						cfg.errBack({ret:-1,msg:"请先选择需要删除的照片。"});
						return;
					}
					var resetcover = 1, newcover = "";
					if(d.photos.length > list.length){
						resetcover = 0;
						newcover = _getNewCover(d.info.cover_id, d.photos, list);
					}

					var data = cfg.extData || {};
					$extend(data, {
						"uin" : cfg.uin,
						"albumid" : cfg.aid,
						"albumname" : d.info.name,
						"bgid" : (d.info.bgid||""),
						"tpid" : (d.info.tplid||""),
						"priv" : d.info.priv,
						"codelist" : _getCodelist(list),
						"resetcover" : resetcover, //是否设置默认封面
						"newcover" : newcover, //新封面的sloc,如果是空这保持原来的封面
						"refer" : cfg.refer
					});
					var url = QPHOTO.url.get({uin:cfg.uin,name:"pic_mul_del",refer:cfg.refer});
					QPHOTO.util.dataSender(url,data,function(ret){
						for(var i=ret.succ.length-1; i >=0; --i){
							var idx = Q.util.getIdx(d.photos,"lloc",ret.succ[i].id);
							Array.prototype.splice.call(d.photos,idx,1);
						}
						d.info.total = d.photos.length;
						cfg.callBack.parent(ret)
					},cfg.errBack);
				}
			});
			PhotoLogic.getPhotoList(cfg);
		},
		/**
		 * 移动照片
		 * @param {Object} cfg 参数对象{uin,fromAid,toAid,llocList,refer,extData,callBack:,errBack:,projectId:,pageId:}
		 * llocList需要一移动的照片数组
		 * extData是hash对象，扩展是向后台提交数据
		 */
		movePhoto : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			$extend(cfg,{
				callBack : function(d){
					var list = _getList(d.photos, cfg.llocList);
					if(list.length < 1){
						cfg.errBack({ret:-1,msg:"请先选择需要删除的照片。"});
						return;
					}
					var resetcover = 1, newcover = "";
					if(d.photos.length > list.length){
						resetcover = 0;
						newcover = _getNewCover(d.info.cover_id, d.photos, list);
					}

					var data = cfg.extData || {};
					$extend(data, {
						"uin" : cfg.uin,
						"old_albumid" : cfg.fromAid,
						"old_albumname" : d.info.name,
						"new_albumid" : cfg.toAid,
						"bgid" : (d.info.bgid||""),
						"tpid" : (d.info.tplid||""),
						"priv" : d.info.priv,
						"codelist" : _getCodelist(list),
						"resetcover" : resetcover, //是否设置默认封面
						"newcover" : newcover, //新封面的sloc,如果是空这保持原来的封面
						"refer" : cfg.refer
					});
					var url = QPHOTO.url.get({uin:cfg.uin,name:"pic_move",refer:cfg.refer});
					QPHOTO.util.dataSender(url,data,function(ret){
						for(var i=ret.succ.length-1; i >=0; --i){
							var idx = Q.util.getIdx(d.photos,"lloc",ret.succ[i].id);
							Array.prototype.splice.call(d.photos,idx,1);
						}
						d.info.total = d.photos.length;
						cfg.callBack.parent(ret)
					},cfg.errBack);
				}
			});
			cfg.aid = cfg.fromAid;
			PhotoLogic.getPhotoList(cfg);
		},
		/**
		 * 修改照片
		 * @param {Object} cfg 参数对象{uin,aid,lloc,refer,extData,callBack:,errBack:,projectId:,pageId:}
		 * extData是hash对象，扩展是向后台提交数据
		 */
		modPhoto : function(cfg){
			QPHOTO.setDef(cfg,"callBack",QZFL.emptyFn);
			QPHOTO.setDef(cfg,"errBack",QZFL.emptyFn);
			$extend(cfg,{
				callBack : function(d){
					var idx = QPHOTO.util.getIdx(d.photos,"lloc",cfg.lloc);
					var photo = d.photos[idx];
					var data = cfg.extData || {};
					$extend(data, {
						"uin" : cfg.uin,
						"albumid" : cfg.aid,
						"albumtitle" : d.info.name,
						"albumdesc" : d.info.desc,
						"piccount" : d.info.total,
						"lloc" : photo.lloc,
						//"name" : photo.name,
						"refer" : cfg.refer
					});
					var url = QPHOTO.url.get({uin:cfg.uin,name:"pic_mod",refer:cfg.refer});
					QPHOTO.util.dataSender(url,data,cfg.callBack.parent,cfg.errBack);
				}
			});
			PhotoLogic.getPhotoList(cfg);
		}
	});
})()
