(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var client = require('../module/setting/client'),
    config = require('../lib/config'),
    shut = require('../module/setting/shut'),
    util = require('../lib/util'),
    cgi = require('../module/setting/cgi'),
    view = require('../module/setting/view'),
    tag = require('../module/setting/tag'),
    verify = require('../module/setting/verify'),
    request = require('../lib/request'),
    report = require('../lib/report');

/*
//设置页需要用到的api
var clientApi = {
    getGroupMemberOption: {name:'GetGroupMemberOptionEx', json:true},
    getGroupMemberInviteOption: 'GetGroupMemberInvateOption',
    getGroupMsgOption: 'GetGroupMsgOption',
    getGroupVideoOption: 'GetGroupVideoOption',
    isGroupManager: 'IsGroupManager',
    isSetGVideoSvrFlag: 'IsSetGVideoSvrFlag',
    setGroupMemberOption: 'SetGroupMemberOption',
    setGroupMemberOptionEx: 'SetGroupMemberOptionEx',
    setGroupMemberInviteOption: 'SetGroupMemberInvateOption',
    setGroupMsgOption: 'SetGroupMsgOption',
    setGroupVideoOption: 'SetGroupVideoOption',
    onShowTips: 'OnShowTips',
    ShowGroupInAllBanSpeechMsg : 'ShowGroupInAllBanSpeechMsg',//全员禁言通知
    ShowGroupInMemBanSpeechMsg : 'ShowGroupInMemBanSpeechMsg', //禁言通知
    CallHummer : 'CallHummerApi', //上报
    getBanMenu : 'GetBanSpeechMenuInfo' //读取配置
}

var cgiurl = [
	'qun_info/set_member_tag_flag', //设置成员标签
	'qun_info/get_member_tag_flag', //取成员标签
	'qun_info/set_admin_auth',   //设置管理员
	'qun_info/get_admin_auth',   //取管理员权限
	'qun_info/get_group_shutup', //禁言列表
	'qun_info/set_group_shutup'  //设置禁言
];
*/

//全局变量
var G = {};

G.role = "" + (client.getSelfIdentity() || util.getParameter("role"));
G.groupUin = util.getParameter("groupuin");
G.selfUin = client.getSelfUin();
G.version = client.getVersion().version;
G.gc = "" + (client.getGroupUin() || util.getParameter("groupuin"));
//monitor上报用的数组
G.monitor = [];
//tdw 上报数组
G.tdwList = [];
G.tdw = {
    'module': 'grp_set',
    'uin': G.selfUin
};
//事件处理
G.task = {};
window.G = G;

function setResultHander(data) {

    if (data.ec === 0) {
        G.setting = data;
        view.changeAccess(data);
        client.common.removeLoad();
    } else {

    }
    setTimeout(function() {
        var perf = util.getPerf('get_group_setting');
        //7832-62-2-1
        report.isdPerf(7832, 62, 2, perf);
    }, 500);
}

function bindEvent() {
    $('body').on('click', function(e) {

        $(".set-upload-file").val();
        // if(e.target.nodeName.toLowerCase() === 'label'){
        //     var prevDom = $(e.target).prev('input');
        //     //在线状态才触发下面的逻辑
        //     if(!prevDom.prop('disabled') && client.online()){
        //         //$(e.target).prev('input').click();
        //     }
        //     return;
        // }

        var target = $(e.target);
        var action = target.attr('data-action');
        var nologin = target.attr('data-nologin');


        //统一处理离线提示
        if (action) {
            //console.log(action);
            if (!nologin) {
                //验证登录状态 离线了..弹提示
                if (!client.online()) {
                    void 0;
                    client.common.alert(1, config.msg.tit.alert, config.msg.offline);
                    return;
                    if (e.target.type === 'checkbox') {
                        target.prop('checked', !target.prop('checked'));
                    }
                    if (e.target.type === 'radio') {
                        switch (e.target.name) {
                            ////消息设置
                            case 'msg-settings':
                                $('input[name=msg-setting][data-def]').prop('checked', true);
                                break;
                            case 'set-upload-file':
                                if (G.setting.file) {
                                    $("#canUploadMaster").prop('checked', true);
                                } else {
                                    $("#canUploadAll").prop('checked', true);
                                }
                                break;
                            case 'set-upload-photo':
                                if (G.setting.album) {
                                    $("#canPhotoMaster").prop('checked', true);
                                } else {
                                    $("#canPhotoAll").prop('checked', true);
                                }
                                break;
                                //加群验证
                            case 'identity-verify':
                                $('input[name=identity-verify][data-def]').prop('checked', true);
                                break;
                        }
                        e.preventDefault();
                        //msg-settings
                        //set-upload-file
                        //set-upload-photo
                        //identity-verify
                    }
                    return;
                }
            }
            var fn = G.task[action];
            if (typeof fn === 'function') {
                fn(e);
            }
        }
    });
    $('body').bind('blur', 'input', function(e) {
        var target = $(e.target);
        var type = e.target.type;
        var action = target.attr('data-action');
        var nologin = target.attr('data-nologin');
        if (action && type === 'text') {
            //console.log(action);
            if (!nologin) {
                //验证登录状态 离线了..弹提示
                if (!client.online()) {
                    client.common.alert(1, config.msg.tit.alert, config.msg.offline);
                    return;
                }
            }
            var fn = G.task[action];
            if (typeof fn === 'function') {
                fn(e);
            }
        }
    });
    $('select').on('change', function(e) {
        void 0;
    });
}

function init() {

    cgi.init(G.groupUin);

    view.init();
    //加群验证
    //view.joinGroup();

    if (G.role === '1') {
        //管理员加群消息验证
        verify.init();
    }

    if (G.role === '1' || G.role === '2') {
        tag.init();
    }

    //转换select到自定义下拉框
    view.resetUi(G.role);

    //绑定事件
    bindEvent();

    //取群设置
    cgi.getSetting(setResultHander, setResultHander);

    G.monitor.push(455057);

    var tdw = {};
    tdw = $.extend(tdw, G.tdw);
    tdw.action = 'exp';

    G.tdwList.push(tdw);
    //report.tdw(tdw);

    // window.addEventListener('message',function(e){
    //     console.log(e);
    // });
    /*
    window['onGroupShut'] = function(){
        $('body').triggerHandler('member:groupShut',arguments);
        $('body').triggerHandler('setting:groupShut',arguments);
    };

    window['onMemberShut'] = function(){
        console.log('abc',arguments);
        $('body').triggerHandler('member:memberShut',arguments);
        $('body').triggerHandler('setting:memberShut',arguments);
    };
    */

    //禁言初始化
    shut.init();

    client.common.webLoadComplete(2);
}

init();
},{"../lib/config":3,"../lib/report":5,"../lib/request":6,"../lib/util":9,"../module/setting/cgi":12,"../module/setting/client":13,"../module/setting/shut":18,"../module/setting/tag":19,"../module/setting/verify":24,"../module/setting/view":25}],2:[function(require,module,exports){
'use strict';
/*
分callclient和callhummer2个接口.....
*/
/*
GetShareData
SetShareData（string)
*/

module.exports = (function() {

	var online = false;

	//常用的接口
	var config = {

	};

	//关闭弹窗
	var closePop = function() {
		return callHummer('Window.Close');
	};

	// 关闭当前页面
	/**
	 * pageId: 1: 成员页, 2: 设置页, 3: 编辑资料页
	 */
	var destroyWebPage = function(pageId) {
		callClient('DestroyWebPage', [pageId]);
	};

	// 通知客户端修改数据
	// 坑。。。0表示成功
	var onSave = function(f /*0?1?*/ ) {
		callClient('OnSave', [f]);
	};

	// 通知客户端web加载成功，可以调web的js接口了
	/**
	 * pageId: 1: 成员页, 2: 设置页, 3: 编辑资料页
	 */
	var webLoadComplete = function(pageId) {
		callClient('WebLoadComplete', [pageId]);
	};

	var closeWindow = function() {
		callClient('CloseWindow');
	};

	//客户端弹窗
	/**
	 * type: 1: 蓝色的感叹号, 2: 红色的感叹号, 3: 红色的叉叉
	 */
	var alert = function(type, title, msg) {
		return callHummer('Window.Alert', '{ "iconType" : ' + type + ', "title" : "' + title + '", "text" : "' + msg + '" }');
	}

	var confirm = function(type, title, msg) {
		return callHummer('Window.Confirm', '{ "iconType" : ' + type + ', "title" : "' + title + '", "text" : "' + msg + '" }');
	}

	//客户端大T上报
	var bigT = function(param) {
		return callHummer('Default.DataReportEx', JSON.stringify(param));
	}

	//判断是否在线
	var online = function() {
		return callHummer('Contact.IsOnline').online;
	}

	//取自己在群中的权限
	var getSelfRole = function() {
		return callClient('GetSelfIdentity');
	}

	//取客户端版本号
	var getVersion = function() {
		return callHummer('IM.GetVersion') || '';
	}

	//取群号
	var getGroupUin = function() {
		return callHummer('GetGroupCode'); //跟lilin沟通过，客户端说没有这个接口
	}

	//取自己的qq
	var getSelfUin = function() {
		return callHummer('Contact.GetSelfUin').uin;
	}

	//打开一个新的web窗口
	function popNewWebPage(width, height, url, title, singletonId) {
		return callHummer('Group.PopNewWebPage', '{"width" : ' + width + ', "height" : ' + height + ', "title" : "' + title + '", "url" : "' + url + '", "singletonId":"' + singletonId + '" }');
	}

	//移除进度条
	function removeLoad() {
		return callHummer('Window.RemoveLoading');
	}

	//客户端关键性能点上报
	var getPerfTimeStamp = function() {
		var ret = {};
		try {
			ret = callHummer("Default.GetPerfTimeStamp");
		} catch (e) {
			ret = {};
		}
		return ret;
	}

	//调用hammer接口
	var callHummer = function(command, args, callback) {
		var fun = window.external && window.external.CallHummerApi;
		try {
			// two situations : has arguments or not
			var _data = fun.apply(this, arguments);
		} catch (e) {
			//_rflag && report('Incorrect Call by '+ command +'('+ args +') with Exception ' + e.message,331059);//function call with exception
			return false;
		}
		var data = JSON.parse(_data);
		return data;
	}

	//调用客户端方法
	var callClient = function(func, args, cb) {
		var loop = function() {};

		if (arguments.length == 2) {
			if (typeof args == 'function') {
				cb = args;
				args = [];
			} else {
				cb = loop;
			}
		} else if (arguments.length == 1) {
			args = [];
			cb = loop;
		}

		// args = args.map(function(item) {
		// 	if (typeof item === 'string') {
		// 		return item;
		// 	} else {
		// 		return JSON.stringify(item);
		// 	}
		// });
		//console.log(args);
		try {
			var res = window.external[func].apply(null, args);
			try {
				return JSON.parse(res);
			} catch (e) {
				return res;
			}
		} catch (e) {
			return cb(new Error('not support'));
		}
	};

	window.OnClientCall = function(data) {
		void 0;
	}

	return {
		alert: alert,
		confirm: confirm,
		callClient: callClient, //默认的方法
		callHummer: callHummer, //直接调用hummer.xxx的方法
		bigT: bigT, //大T上报
		getSelfRole: getSelfRole, //获取自己的权限
		online: online, //是否在线
		getVersion: getVersion, //取客户端版本
		getGroupUin: getGroupUin, //取群号
		getSelfUin: getSelfUin, //取自己的uin
		popNewWebPage: popNewWebPage,
		closePop: closePop,
		destroyWebPage: destroyWebPage,
		webLoadComplete: webLoadComplete,
		onSave: onSave,
		getPerfTimeStamp: getPerfTimeStamp,
		closeWindow: closeWindow,
		removeLoad: removeLoad
	}
})();
},{}],3:[function(require,module,exports){
var db = {
	//消息提示
	msg : {
		tit : {
			'alert' : '提示',
			'error' : '出错啦'
		},
		//敏感词
		sensitive : {
			'setting' : '填写的内容包含敏感词，保存失败'
		},
		//屏蔽消失时间
		intervals : {
                6 : '15分钟',
                7 : '30分钟',
                8 : '1小时',
                9 : '4小时'
		},
		//验证码
		vcode : {
			err : '验证码输入有误',
			more : '你的请求太过频繁。',
			fail :'获取验证码失败，请重试。',
			photo : '手机号码输入有误。',
			first : '请先获取验证码。',
			sys : '系统繁忙,请稍后重试'
		},
		//离线
		offline : '您已经处于离线状态，请上线后再次尝试',
		//禁言
		shut : {
			'openallshuttitle' : '开启全员禁言',
			'openallshutinfo' : '确定要开启全员禁言吗？',
			'closeallshuttitle' : '关闭全员禁言',
			'closeallshutinfo' : '确定要关闭全员禁言吗？',	
			'editshuttit' : '修改禁言时间',
			'editshuttimeinfo' : '修改已选择的%d名成员的禁言时间为',
			'cancelshuttit' : '解除禁言',
			'man' : '人',
			'cancelshutnum' : '等',
			'cancelshutinfo' : '确定解除 %s 的群内禁言吗？',
			'howtimetocancelshut' : '%s后解禁'
		},
		//加群
		view : {
			enter : '需要付费加群',
			notenter : '（本群暂不满足设置付费入群的条件 <a data-action="view.enterMore" href="http://kf.qq.com/faq/120511jiYzIJ151231veQJRv.html" target="_blank">了解详情</a>）',
			//notenter : '（仅对群信用星级为5星的群开放 <a data-action="view.enterMore" href="http://kf.qq.com/faq/160219jMnuUj160219vuuU3M.html" target="_blank">详细说明</a>）',
			nottenpay : '（<a  data-action="view.enterPay" href="https://www.tenpay.com/v2/register/reg_index.shtml" target="_blank">认证财付通账户</a> 后方可设置）',
			notjoin : '不允许群成员邀请好友加入群',
			visitoropen : '允许非群成员访问并发言',
			visitornotchat : '允许非群成员访问但不能发言',
			visitorclose : '不允许非群成员访问',
			notvideo : '不允许群通话',
			cansearch : '无需通过群号就可以找到这个群',
			canupload : '允许全体成员上传群文件',
			notupload : '仅允许群主和管理员上传群文件',
			canalbum : '允许全体成员上传群相册',
			notalbum : '仅允许群主和管理员上传群相册',
			notshare : '非群成员不可以预览资料卡相册和共享',
			notany : '不允许匿名聊天',
			level : '头衔重复'
		},
		//群成员标签
		tag : {
			tagtitle : '群成员标签编辑',
			leveltitle : '群成员等级编辑',
			managelog : '管理员操作记录'
		},
		grade : {
		    //网虫系列
		    "wangcong":{
		        name:"网虫",
		        list:["传说","唠叨","活跃","吐槽","冒泡","潜水"]
		    },
		    //学校系列
		    "school":{
		        name:"学校",
		        list:["博士","硕士","大学","高中","初中","小学"]
		    },
		    //武侠系列
		    "wuxia":{
		        name:"武侠",
		        list:["宗师","掌门","大侠","少侠","师兄","路人"]
		    },
		    //军衔系列
		    "junxian":{
		        name:"军衔",
		        list:["司令","军长","师长","营长","连长","小兵"]
		    },
		    //办公系列
		    "office":{
		        name:"办公",
		        list:["总裁","副总","总监","经理","助理","实习"]
		    },
		    //修仙系列
		    "xiuxian":{
		        name:"修仙",
		        list:["大乘","渡劫","分神","元婴","融合","筑基"]
		    },
		    //学霸系列
		    "xueba":{
		        name:"学霸",
		        list:["叫兽","学神","学霸","学酥","学弱","学渣"]
		    }			
		},
		delUser : {
			'error' : '删除失败，请稍后重试'
		},
		errorMsg : {
			12 : '内容包含敏感词，请重新输入',
			13 : '每个等级头衔每天最多可修改三次'
		},
		defError : '系统繁忙,请稍后再试'
	}
};
module.exports = db;
},{}],4:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

module.exports = {
  hex_md : hex_md5,
  b64_md5 : b64_md5,
  str_md5 : str_md5,
  hex_hmac_md5 : hex_hmac_md5,
  b64_hmac_md5 : b64_hmac_md5,
  str_hmac_md5 : str_hmac_md5
}
},{}],5:[function(require,module,exports){
//
/*
上报模块
*/
var $ = window.Zepto || window.$;

var util = require('./util'),
    client = require('./callClient');

module.exports = (function() {
    'use strict';

    // 上报参数的常量值
    var ISD_REPORT_URL = 'http://isdspeed.qq.com/cgi-bin/r.cgi?', // oz.isd.com
        MON_REPORT_URL = "http://cgi.connect.qq.com/report/report_vm?", // CGI接口人： ethanwei(魏伟强);
        BAD_REPORT_URL = 'http://badjs.qq.com/cgi-bin/js_report?bid=176&level=4&msg=', //badjs上报
        TDW_REPORT_URL = 'http://cgi.connect.qq.com/report/tdw/report?', //tdw 上报url
        tdwTable = 'dc00141', //tdw 上报的默认table
        isdTransport = new Image(),
        ozTransport = new Image(),
        rcTransport = new Image(),
        monitorTransport = new Image(),
        transport = new Image();

    var conf = {
        'zeptojs': 13,
        'settingcss': 12,
        'settingjs': 14,
        'membercss': 17,
        'membercjs': 18,
        'profilecss': 15,
        'profilejs': 16
    }

    var groupUin = util.getParameter("groupuin");
    var selfUin = client.getSelfUin() || util.getUin();
    // http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7832&flag2=9&flag3=3
    // 队列
    var transportList = [],
        $t = $(transport);

    $t.process = 0;
    $t.delay = 500; // 延迟上报时间，单位ms

    transport.onload = transport.onerror = function() {
        $t.trigger('transport:end');
    };

    $t.on('transport:start', function(e, url) {
        if (url) transportList.push(url);

        if (!$t.process) {
            $t.process++;
            if (transportList.length) {
                window.setTimeout(function() {
                    var surl = transportList.shift();
                    if (surl) {
                        transport.src = surl;
                    }
                }, $t.delay);
            }
        }
    });

    $t.on('transport:end', function() {
        $t.process--;
        if (transportList.length) $t.trigger('transport:start');
    });

    var addT = function(url) {
        return url + '&t=' + new Date().getTime();
    };

    /**
     * monitor 上报
     * @param id  monitor.server.com 申请到 id 值
     */
    function monitor(id, flag) {
        var url = MON_REPORT_URL + "monitors=" + "[" + id + "]";
        // 立即上报时全部走WEB通道上报

        // monitorTransport.src = url;
        //延时上报
        if (!flag) {
            url = addT(url);
            $t.trigger('transport:start', [url]);
            //立即上报
        } else {
            var img = new Image();
            img.src = url;
            img = null;
        }

    }

    /**
    * badjs上报
    *@param msg
    *@param url
    #@param line
    */
    function bad(msg, url, line) {
        var m = [
            msg,
            url,
            line
        ];

        var url = BAD_REPORT_URL + m.join('|_|');
        // 立即上报时全部走WEB通道上报
        url = addT(url);
        $t.trigger('transport:start', [url]);
    }

    /**
     * ISD 上报
     * @param f1
     * @param f2
     * @param f3
     * @param timing
     */
    function isd(f1, f2, f3, timing) {
        var reportData = [],
            point,
            startPoint = timing[0],
            i,
            k,
            l;

        i = 1;
        l = timing.length;

        for (; i < l; i++) {
            point = timing[i];
            point = (point ? (point - startPoint) : 0);

            // 如果某个时间点花费时间为0，则此时间点数据不上报
            if (point > 0) {

                // 标记位从1开始 为的是忽略掉 navigationStart的时间点
                reportData.push(i + '=' + point);
            }
        }

        var url = ISD_REPORT_URL + 'flag1=' + f1 + '&flag2=' + f2 + '&flag3=' + f3 + '&' + reportData.join('&');
        url = addT(url);

        // isdTransport.src = url;
        $t.trigger('transport:start', [url]);
    }

    /* timeing 是 obj形式的上报*/
    function isd2(f1, f2, f3, timing) {
        var reportData = [];
        for (var i in timing) {
            reportData.push(i + '=' + timing[i]);
        }

        var url = ISD_REPORT_URL + 'flag1=' + f1 + '&flag2=' + f2 + '&flag3=' + f3 + '&' + reportData.join('&');
        url = addT(url);

        $t.trigger('transport:start', [url]);
    };


    /**
     * 上报Performance timing数据
     *
     * @param f1 flag1简写，测速系统中的业务ID
     * @param f2 flag2简写，测速的站点ID
     * @param f3 flag3简写，测速的页面ID
     */
    function performance(f1, f2, f3) {
        // 此处代码不要直接copy & paste 因为没有兼容IE的情况 reportPoints的值决不能更改，因为跟上报系统是强绑定的
        var perf = (window.webkitPerformance ? window.webkitPerformance : window.performance),
            reportPoints = ['navigationStart', "unloadEventStart", "unloadEventEnd",
                "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart",
                "domainLookupEnd", "connectStart", "connectEnd", "requestStart",
                "responseStart", "responseEnd", "domLoading", "domInteractive",
                "domContentLoadedEventStart", "domContentLoadedEventEnd",
                "domComplete", "loadEventStart", "loadEventEnd"
            ],
            timing,
            l,
            i;


        if (perf && (timing = perf.timing)) {

            if (!timing.domContentLoadedEventStart) {

                // 早期的performance规范属性
                reportPoints.splice(15, 2, 'domContentLoadedStart',
                    'domContentLoadedEnd');
            }

            var timingArray = [];

            for (i = 0, l = reportPoints.length; i < l; i++) {
                timingArray[i] = timing[reportPoints[i]];
            }

            isd(f1, f2, f3, timingArray);
        }
    }

    function send(url) {
        var img = new Image();
        img.src = url;
    };

    /**
     * 货币化数据上报
     * @return {[type]} [description]
     * @example: report.mr('qq', appid, '11', '6', '2', '0', '0', '0', '2');
     */
    function bigT() {
        var qqBigT = '0x80032b3',
            openBigT = '0x80035aa',
            mobileBigT = '0x80038de',
            bigT = qqBigT;
        if (arguments[0] == 'qq') {
            bigT = qqBigT;
        } else if (arguments[0] == 'open') {
            bigT = openBigT;
        } else if (arguments[0] == 'mobile') {
            bigT = mobileBigT;
        };
        var data = {
            //大T，即通的选择'qq', 开平电脑应用选择'open'，开平手机应用选择'mobile'
            'bigT': bigT,
            'key': arguments[1] + '',
            'param1': arguments[2] + '',
            'param2': arguments[3] + '',
            'param3': arguments[4] + '',
            'param4': arguments[5] + '',
            'param5': arguments[6] + '',
            'param6': arguments[7] + '',
            'param7': arguments[8] + ''
        }
        $u.callClient('doDataReport', [data]);
    };

    var mmReportObj = {
            appid: 1000211,
            releaseversion: '@RELEASE_VERSION',
            frequency: 1
        },
        MM_REPORT_URL = 'http://wspeed.qq.com/w.cgi?';

    function mm(cgi, retcode, tmcost) {
        var url,
            paramArr = [];
        var uin = util.getCookie('uin');

        if (!mmReportObj.touin) {
            mmReportObj.touin = uin;
        }

        mmReportObj.commandid = cgi;
        mmReportObj.resultcode = retcode;
        mmReportObj.tmcost = tmcost;

        if (retcode == 0) {
            // 成功的上报采样为1/20
            // frequency为采样分母
            mmReportObj.frequency = 20;
            var ranNum = Math.floor(Math.random() * 100 + 1);
            if (ranNum > 5) {
                return;
            }
        } else {
            mmReportObj.frequency = 1;
        }

        for (var j in mmReportObj) {
            if (mmReportObj.hasOwnProperty(j)) {
                paramArr.push(j + "=" + encodeURIComponent(mmReportObj[j]));
            }
        }
        url = MM_REPORT_URL + paramArr.join("&");
        url = addT(url);
        //console.debug(url);

        setTimeout(function() {
            transport.src = url;
        }, 500);

    }

    //记录log
    function log(opt) {

        var log_on = true; // 确定是否上报到badjs中记录.

        var levelMap = {
            'debug': 1,
            'info': 2,
            'error': 4,
            'fail': 8
        }
        var level = 1,
            mid;

        if (typeof opt === 'object') {
            level = opt.type;
            mid = '195375';
        } else {

        }

        if (log_on) {
            var img = new Image();
            img.src = 'http://badjs.qq.com/cgi-bin/js_report?level=' + (level || 4) + '&bid=176' + (mid ? '&mid=' + mid : '') + '&msg=' + encodeURIComponent(opt.msg) + '|_|0|_|0' + +'&r=' + Math.random();
            img = null;
        } else {
            void 0;
        }
    }

    var groupRole = "" + (client.callClient('getSelfIdentity') || util.getParameter("role"));
    var groupUin = util.getParameter("groupuin");
    var selfUin = client.getSelfUin() || util.getUin();
    var clientVersion = client.getVersion().version;
    var _toString = Object.prototype.toString;
    var deftdw = {
        'uin': selfUin,
        'opername': 'PC_grpdata',
        'obj1': groupUin, //群号
        'obj2': clientVersion, //统一填版本号
        'ver1': groupRole //0是群众，1是普通群成员，2是群主，3是管理员
    }

    //tdw 上报
    function tdwreport(params, args, table) {
        if (!params) {
            return;
        }
        var _params;
        var reportTable = table || tdwTable;

        switch (_toString.call(params)) {
            case '[object Array]':
                //_params = params;//对数组上报
                break;
            case '[object Object]':
                params.ts = new Date().getTime();
                params = $.extend({}, deftdw, params);
                if (args) {
                    _params = [params]; //延迟上报
                } else {
                    var __fields = [];
                    var __datas = [];
                    for (var i in params) {
                        //if (i === 'obj3' || i === 'ts') continue;
                        __fields.push(i);
                        __datas.push(params[i]);
                    }
                    if (_toString.call(__datas[0]) !== '[object Array]') {
                        __datas = [__datas];
                    }
                    var url = TDW_REPORT_URL + 'table=' + reportTable + '&fields=' + JSON.stringify(__fields) + '&datas=' + encodeURIComponent(JSON.stringify(__datas)) + '&t=' + (+new Date());
                    var img = new Image();
                    img.src = url;
                    img = null;
                    return;
                    //return _tdw(reportTable , __fields , [__datas] , params['obj3'] , params['ts']);//obj3表示ip字段，ts表示时间戳字段，这两个字段默认不填写
                }
                break;
        }
        // if(_toString.call(__datas[0]) !== '[object Array]'){
        //   __datas = [__datas];
        // }

        //组装数据
        var datas = [],
            reportFields = {},
            fields = [],
            fieldids = [];
        for (var i = 0, l = params.length; i < l; i++) {
            var item = params[i],
                _datas = [];
            item.ts = new Date().getTime();
            item = $.extend(item, deftdw);
            //准备对齐数据
            for (var j in item) {
                var idx;
                if (j in reportFields) {
                    //字段的序号
                    idx = reportFields[j];
                    fields[idx] = j;
                } else {
                    fields.push(j);
                    idx = fields.length - 1;
                    reportFields[j] = idx;
                }
                if (typeof item[j] === 'number') {
                    _datas[idx] = item[j];
                } else {
                    _datas[idx] = item[j] || '';
                }
            }
            datas.push(_datas);
        }

        var url = TDW_REPORT_URL + 'table=' + reportTable + '&fields=' + JSON.stringify(fields) + '&datas=' + encodeURIComponent(JSON.stringify(datas)) + '&t=' + (+new Date());
        var img = new Image();
        img.src = url;
        img = null;
    }

    //资源上报
    var isdPerf = function(flag1, flag2, flag3, perf) {
        var reportPoints = ['startTime', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'duration'];
        var time = [0];
        for (var i = 0, l = reportPoints.length; i < l; i++) {
            time.push(perf[reportPoints[i]]);
        }
        isd(flag1, flag2, flag3, time);
        //console.log(perf);
    }

    /*
    成员页      flag1=7723&flag2=4&flag3=1
    设置页      flag1=7723&flag2=4&flag3=5
    编辑资料页  flag1=7723&flag2=4&flag3=2
    等级页      flag1=7723&flag2=4&flag3=4
    */
    var conf = {
            12: /setting-[^\.]{5}\.css/,
            13: /zepto-[^\.]{5}\.js/,
            14: /setting-[^\.]{5}\.js/,
            15: /profile-[^\.]{5}\.css/,
            16: /profile-[^\.]{5}\.js/,
            17: /member-[^\.]{5}\.css/,
            18: /member-[^\.]{5}\.js/,
            19: /grade-[^\.]{5}\.css/,
            20: /grade-[^\.]{5}\.js/
        }
        /* 本地测试用
        var conf = {
            12: /setting\.css/,
            13: /zepto\.js/,
            14: /setting\.js/,
            15: /profile\.css/,
            16: /profile\.js/,
            17: /member\.css/,
            18: /member\.js/,
            19: /grade\.css/,
            20: /grade\.js/
        }
        */

    //h5测速上报.这里统一处理了...
    var loadHandler = function() {
            //window.onload = function(){
            window.performance.mark('onload');

            var pageid = $('body').data('speed');
            performance(7723, 4, pageid);

            /*
            data-speed : 1  成员页 2 编辑页,5 设置页
            */
            var body = $('body'),
                type = body.attr('data-speed'),
                cssid = body.attr('data-css'),
                jsid = body.attr('data-js');

            setTimeout(function() {
                var pageid = $('body').data('speed');
                performance(7723, 4, pageid);

                var zep = util.getPerfMatch(conf[13]),
                    css = util.getPerfMatch(conf[cssid]),
                    js = util.getPerfMatch(conf[jsid]);
                /*上报zepto的资源加载耗时*/
                if (zep) {
                    isdPerf(7723, 4, 13, zep);
                }
                /*上报css的资源加载耗时*/
                if (css) {
                    isdPerf(7723, 4, cssid, css);
                }
                /*上报js的资源加载耗时*/
                if (js) {
                    isdPerf(7723, 4, jsid, js);
                }
                //console.log(conf[13],conf[cssid],conf[jsid],zep,css,js);


                var perf = (window.webkitPerformance ? window.webkitPerformance : window.performance);
                //客户端性能上报
                var obj = client.getPerfTimeStamp();
                // {ExternalReadyTS: "5130560", NavigateCompleteTS: "18298948", StartNavigateTS: "5130607", StartVisitTS: "5130529", errorCode: 0}
                /*
                ExternalReadyTS 客户端进程启动的时间点
                StartVisitTS  客户端入口点击时间
                NavigateCompleteTS  页面加载完成时间
                StartNavigateTS 开始加载页面的时间
                这里包dc和bigt的意义,
                测速上报不能区分单次访问的耗时情况..所以这里通过大T和dc上报把一次访问中各个步骤的耗时报上去.方便分析原因.
                */
                var clickTime = obj.ExternalReadyTS - obj.StartVisitTS, //客户端开始加载webkit的时间
                    startTime = obj.StartNavigateTS - obj.ExternalReadyTS, //客户端启动webkit的时间
                    loadTime = obj.NavigateCompleteTS - obj.StartNavigateTS; //客户端页面加载完成的时间

                var param = {
                    module: 'Performance',
                    action: 'start_time',
                    ver1: clickTime, //客户端开始加载webkit的时间
                    ver2: startTime, //客户端启动webkit的时间
                    ver3: loadTime, //客户端页面加载完成的时间
                    ver4: type
                }
                tdwreport(param);
                var bigT; //大T上报id
                //大T上报,方便客户端跟踪情况
                /*
                0X8004B0C  群资料卡设置页性能上报
                0X8004B0D  群资料卡成员页性能上报
                0X8004B0E  群资料卡编辑页面性能上报
                */
                switch (parseInt(type)) {
                    case 1:
                        bigT = '0X8004B0D';
                        break;
                    case 2:
                        bigT = '0X8004B0E';
                        break;
                    case 5:
                        bigT = '0X8004B0C';
                        break;
                    default:
                        bigT = '0X8004B25';
                        break;
                }
                var param = {
                    'bigT': bigT,
                    'key': '{gid:' + groupUin + ',uin:' + selfUin + '}',
                    'param1': clickTime + '',
                    'param2': startTime + '',
                    'param3': loadTime + '',
                    'param4': 0,
                    'param5': 0,
                    'param6': 0,
                    'param7': 0
                }
                client.bigT(param);

                var time = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                time.push(clickTime);
                time.push(startTime);
                time.push(loadTime);
                isd(7723, 4, type, time);
            }, 1000);
        }
        //设置页不触发onload.变动一下.
    document.onreadystatechange = function() {
        var status = document.readyState;
        window.performance.mark(status);
        if (document.readyState !== 'interactive') {
            return;
        }
        var type = $('body').attr('data-speed');
        if (type === '2') {
            loadHandler();
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        window.performance.mark('domcontentLoaded');
    }, false);
    document.addEventListener('LoadEnd', function() {
        window.performance.mark('LoadEnd');
    }, false);
    document.addEventListener('LoadError', function() {
        window.performance.mark('LoadError');
    }, false);
    //window.onload = loadHandler;
    window.addEventListener('load', loadHandler, false);

    // setInterval(function(){
    //   console.log(document.readyState);
    // },20);
    // $(document).ready(function(){
    //   window.onload = loadHandler;
    // });
    //window.addEventListener('load',loadHandler,false);
    //console.log(document.readyState);
    return {
        isd: isd,
        isd2: isd2,
        isdPerf: isdPerf,
        monitor: monitor,
        performance: performance,
        bad: bad,
        bigT: bigT,
        send: send,
        log: log,
        mm: mm,
        tdw: tdwreport
    };

})();


/**
 * @description 腾讯云诊断服务平台ilook.oa.com返回码上报组件
 * @author hobodong
 * @example
 * 1.直接引用方式:
 * reportCgi.report({
 *     'url' : 'http://gamecentertest.cs0309.3g.qq.com/cgi-bin/gc_chest_fcgi?tt=2',
 *     'type': 1,  // 1成功，2失败，3逻辑失败
 *     'code': 0,  // CGI返回码
 *     'time': 1000,
 *     'rate': 10,  // 只上报1/10的请求，防止其他请求被卡住
 *     'uin' : 2237545582
 * });
 * 2.作为seajs模块引用:
 * var reportCgi = require("reportCgi.js");
 * reportCgi.report({
 *     'url' : 'http://gamecentertest.cs0309.3g.qq.com/cgi-bin/gc_chest_fcgi?tt=2',
 *     'type': 2,
 *     'code': 502,
 *     'time': 1000,
 *     'rate': 1,  // 失败全部上报
 *     'uin' : 2237545582
 * });
 * @summary
 * 说明：
 * reportCgi.js   返回码上报组件,上报返回码到m.isd.com
 * 目前支持两种上报方式：
 * 1. 使用http方式上报
 * 2. 使用手Q sso上报
 * 默认走手Q  sso上报方式上报，如果手Q版本不支持，走http上报方式上报
 */
;
(function(root, factory) {
    //console.log(root,factory);
    void 0;
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define('reportCgi', function(require, exports, module) {
            return factory(root, exports);
        });
    } else {
        window.reportCgi = factory(window, {});
    }
})(this, function(root, reportCgi) {
    var _private = {};
    var _public = reportCgi || {};
    _private.keyList = ['domain', 'cgi', 'type', 'code', 'time', 'rate', 'uin', 'apn', 'device', 'signalStrength',
        'expansion1', 'expansion2', 'expansion3', 'data', 'platform'
    ];
    _private.apn = null;
    _private.device = '';
    _private.signalStrength = '';
    var mqq = window.mqq;
    _public.report = function(params) {
        if (!params || !params.url) {
            void 0;
            return;
        }
        params.rate = params.rate || 1;
        if (/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/.test(decodeURIComponent(params.url))) {
            if (Math.random() < 1 / (params.rate)) {
                var domain = RegExp.$4 || '';
                var path = RegExp.$5 || '';
                var search = RegExp.$6 || '';
                if (mqq && mqq.device && mqq.device.getNetworkType && mqq.support("mqq.device.getNetworkType") && !
                    _private.apn) {
                    mqq.device.getNetworkType(function(result) {
                        _private.apn = result || "unknown";
                        _private.send.call(this, {
                            domain: domain,
                            cgi: path || "",
                            type: params.type || 0,
                            code: params.code || 0,
                            time: params.time || 0,
                            apn: _private.apn || "",
                            device: params.device || _private.device || "",
                            signalStrength: _private.signalStrength || "",
                            expansion1: params.expansion1 || "",
                            expansion2: params.expansion2 || "",
                            expansion3: params.expansion3 || "",
                            data: params.data || "",
                            platform: params.platform || "",
                            rate: params.rate,
                            uin: params.uin || 0
                        });
                    });
                } else {
                    _private.send.call(this, {
                        domain: domain,
                        cgi: path || "",
                        type: params.type || 0,
                        code: params.code || 0,
                        time: params.time || 0,
                        apn: _private.apn || "",
                        device: params.device || _private.device || "",
                        signalStrength: _private.signalStrength || "",
                        expansion1: params.expansion1 || "",
                        expansion2: params.expansion2 || "",
                        expansion3: params.expansion3 || "",
                        data: params.data || "",
                        platform: params.platform || "",
                        rate: params.rate,
                        uin: params.uin || 0
                    });
                }
            }
            return true;
        } else {
            return false;
        }
    };
    _private.cache = {};
    _private.send = function(params) {
        var cache = _private.cache;
        var lazyTime = 2000;
        if (!cache.mapping) {
            cache.mapping = {};
        }
        if (params) {
            var key = JSON.stringify({
                domain: params.domain,
                uin: params.uin,
                rate: params.rate
            });
            if (!cache.mapping[key]) {
                cache.mapping[key] = [];
            }
            cache.mapping[key].push(params);
            if (cache.timer) {
                clearTimeout(cache.timer);
            }
            cache.timer = setTimeout(function() {
                // console.log("loop");
                _private.send.call(this);
            }, lazyTime);
            return false;
        } else {
            for (var key in cache.mapping) {
                if (cache.mapping.hasOwnProperty(key)) {
                    if (cache.mapping[key] && cache.mapping[key].length > 0) {
                        var request = {
                            "key": _private.keyList.join(',')
                        };
                        var paramsList = cache.mapping[key].splice(0, 10);
                        for (var i = 0, iMax = paramsList.length, params; params = paramsList[i], i < iMax; i++) {
                            for (var j = 0, jMax = _private.keyList.length, name; name = _private.keyList[j], j < jMax; j++) {
                                request[[i + 1, j + 1].join('_')] = params[name];
                            }
                        }
                        var arr = [];
                        for (var i in request) {
                            arr.push(i + '=' + encodeURIComponent(request[i]));
                        }
                        var info = arr.join("&");
                        if (mqq && mqq.data && mqq.data.pbReport && mqq.support && mqq.support("mqq.data.pbReport")) {
                            var ua = window.navigator.userAgent;
                            var host = window.location.host;
                            var data = {
                                "d": info,
                                "h": host,
                                "ua": ua
                            };
                            mqq.data.pbReport('104', JSON.stringify(data));
                        } else {
                            _private.httpSend(info);
                        }
                    } else {
                        delete cache.mapping[key];
                    }
                }
            }
        }
        return true;
    };
    _private.httpSend = function(info) {
        if (!window._cgiReportStack) {
            window._cgiReportStack = [];
        }
        var img = new Image();
        window._cgiReportStack.push(img);
        img.src = 'http://c.isdspeed.qq.com/code.cgi?' + info;
    };
    return _public;
}); /*  |xGv00|9278b4bd877970f0773d7e7116652209 */
},{"./callClient":2,"./util":9}],6:[function(require,module,exports){
'use strict';
//ajax请求
var util = require('./util');
var report = require('./report');

var db = {};

module.exports = db;

var skey = util.getCookie('skey');

function getToken() {
    skey = util.getCookie('skey');
    var hash = 5381;
    for (var i = 0, len = skey.length; i < len; ++i) {
        hash += (hash << 5) + skey.charCodeAt(i);
    }

    var _token = hash & 0x7fffffff;
    return _token;
}

var bkn = getToken();

function checkUrl(url){
    if(url.indexOf('http://')>=0){
        return url;
    }else{
        return 'http://qinfo.clt.qq.com'+url;
    }
}

var checkedUrl = [];
var perf = window.performance;

function checkAndReport(url,xhr){
    if(url.indexOf('http://') < 0){
        url = 'http://qinfo.clt.qq.com'+url;
    }
    if(!perf){
        return;
    }
    //var turl = url.substr(0,url.indexOf('?'));

    //if($.inArray(turl,checkArr)>=0){
    if($.inArray(url,checkedUrl)<0){
        var time = perf.getEntriesByName(url)[0];
        if(!time){
            return;
        }
        checkedUrl.push(url);
        var param = {
            1 : time.redirectEnd - time.redirectStart,   //重定向时间
            2 : time.domainLookupStart - time.fetchStart,//app cache时间
            3 : time.domainLookupEnd - time.domainLookupStart,//dns解析时间
            4 : time.connectEnd - time.connectStart,     //tcp连接时间
            5 : time.responseStart - time.requestStart,  //请求到收到响应的时间
            6 : time.responseEnd - time.responseStart,   //请求完成的时间
            7 : time.responseEnd - time.startTime,       //总耗时
            8 : time.fetchStart,
            9 : time.domainLookupStart
        }
        param.url = url;
        if(param[2] > 5000){
            BJ_REPORT.info(JSON.stringify({
                '重定向' : param[1],
                'appcache' : param[2],
                'dns' : param[3],
                'tcp' : param[4],
                '接收' : param[5],
                '完成' : param[6],
                '总时间' : param[7],
                'fetchStart' : time.fetchStart,
                'dnsstart' : time.domainLookupStart,
                //'header' : xhr.getAllResponseHeaders && xhr.getAllResponseHeaders() || false,
                // 'status' : xhr.status,
                // 'txt' : xhr.responseText,
                'url' : url
            }));
        }
    }
}

/*
url  请求url
param 参数
cb  回调
ecb 出错的回调
cacheTime 缓存时间
*/
function post(url, param, cb, ecb, cacheTime) {
    ajax(url, 'POST', param, cb, ecb);
}

function get(url, param, cb, ecb, cacheTime,check) {
    ajax(url, 'GET', param, cb, ecb,check);
}

/**
 * ajax请求
 * @Author   hordeliu
 * @DateTime 2015-12-30T10:44:37+0800
 * @param    {string}                 url   [请求url]
 * @param    {string}                 type  [请求类型: get post]
 * @param    {object}                 param [参数]
 * @param    {Function}               cb    [回调函数]
 * @param    {Function}                 ecb   [出错的回调]
 * @param    {boolean}                 check [是否添加默认参数]
 * @return   {[type]}                       [description]
 */
function ajax(url, type, param, cb, ecb, check) {
    var tryTime = 0, //重试次数
        maxTry = 1; //最多重试次数

    var overtime = 5000; //超时时间

    //没有传type
    if (typeof type === 'object') {
        ecb = cb;
        cb = param;
        param = type;
        type = 'GET';
    } else {
        type = type.toUpperCase();
    }
    //如果没有传ecb;
    if (typeof ecb !== 'function') {
        ecb = cb;
    }

    //超时逻辑
    var timer = setTimeout(function() {
        void 0;
        report.log({
            type: 'fail',
            msg: url + ' time out',
            url: url
        });
        if (typeof ecb === 'function') {
            ecb({
                ec: 999
            });
        }
        var endTime = new Date().getTime() - startTime;
        reportCgi.report({
            'url' : checkUrl(url),
            'type': 2,  // 1成功，2失败，3逻辑失败
            'code': 999,  // CGI返回码
            'time': endTime,
            'rate': 1  // 只上报1/10的请求，防止其他请求被卡住
        });

    }, overtime);

    if (!param.bkn && !check) {
        param.bkn = getToken();
    }
    if (!param.src && !check) {
        param.src = 'qinfo_v3';
    }

    if(type === 'GET'){
        if(url.indexOf('?') < 0){
            url += "?"+$.param(param);
        }else{
            url += "&"+$.param(param);
        }
        url += "&_ti="+new Date().getTime();    
        param = {};
    }

    var startTime = new Date().getTime();

    $.ajax({
        type: type,
        url: url,
        data: param,
        xhrFields: {
            withCredentials: true
        },
        //timeout: overtime,
        success: function(data) {
            clearTimeout(timer);
            try {
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
            } catch (e) {
                void 0;
            }
            //mm上报逻辑
            var endTime = new Date().getTime() - startTime;
            //var ec;
            if (typeof data.ec !== 'undefined') {
                var ec = data.ec;
            } else if (typeof data.retcode !== 'undefined') {
                var ec = data.retcode;
            }
            if (typeof ec === 'undefined') {
                ec = 999;
            }
            setTimeout(function(){
                checkAndReport(url);
            },100);
            
            //report.mm(url, ec, endTime);
            reportCgi.report({
                'url' : checkUrl(url),
                'type': 1,  // 1成功，2失败，3逻辑失败
                'code': data.ec || data.retcode,  // CGI返回码
                'time': endTime,
                'rate': 1  // 只上报1/10的请求，防止其他请求被卡住
            });
            if (typeof cb === 'function') {
                cb(data);
            }
        },
        error: function(data) {
            clearTimeout(timer);
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = {
                    ec: 999
                }
                //console.debug(e);
            }
            if (typeof ecb === 'function') {
                ecb(data);
            }
        }
    });
}

// 是否非幂等的url
function isNotIdempotent(url) {
    return false;
}

function _doSomething(xhr, url) {
    var __start = Date.now();

    url = url || xhr.responseURL;

    xhr.done(function(res) {
        // do something
        // eg. report
        // mm返回码和耗时上报
        //report.mm(url, res.ec, Date.now() - __start);
        reportCgi.report({
            'url' : checkUrl(url),
            'type': 1,  // 1成功，2失败，3逻辑失败
            'code': res.ec || res.retcode,  // CGI返回码
            'time': Date.now() - __start,
            'rate': 1  // 只上报1/10的请求，防止其他请求被卡住
        })        
        setTimeout(function(){
            checkAndReport(url,xhr);
        },100);
        
        if (res.ec == 1) void 0;
    }).fail(function(err, errMsg) {
        // do something
        // mm返回码上和耗时报，额外上报错误说明
        // 单独处理timeout，因为此时返回码是0
        // err is read only
        var mmErr = {
            status: err.status,
            statusText: err.statusText
        };
        if (errMsg == 'timeout') {
            mmErr.status = 504;
            mmErr.statusText = 'timeout';
        }
        // report.mm(url, mmErr.status, Date.now() - __start, {
        //     msg: mmErr.statusText
        // });

        reportCgi.report({
            'url' : checkUrl(url),
            'type': 2,  // 1成功，2失败，3逻辑失败
            'code': mmErr.status,  // CGI返回码
            'time': Date.now() - __start,
            'rate': 1  // 只上报1/10的请求，防止其他请求被卡住
        }) 
        checkAndReport(url,xhr);

        //console.log(url, arguments);
    });
}

db.ajax = function(opt) {
    var _opt = {
        type: 'GET',
        dataType: 'json',
        timeout: 10000,
        data: {
            src: 'qinfo_v3',
            gc: util.getParameter('groupuin')
        }
    };

    _opt.data = ~opt.url.indexOf('http://') ? {} : {
        src: 'qinfo_v3',
        gc: util.getParameter('groupuin')
    };

    // 没有sid则不传，以防cgi抽风
    bkn && (_opt.data.bkn = bkn);

    $.extend(true, _opt, opt);

    // /^http:\/\/qqweb.qq.com/.test(_opt.url) || (_opt.url = 'http://qqweb.qq.com' + _opt.url);

    var xhr = $.ajax(_opt);

    _doSomething(xhr, _opt.url);

    // 只有retcode == 0的时候才执行done
    // 其余情况都执行fail
    // 网络错误则重试一次
    var myXhr = {
        done: function done(fn) {
            var retry = 0;

            (function _done(xhr, fn) {
                xhr.done(function(res) {
                    if (res.ec === 0 || res.retcode === 0) fn(res);
                });
                xhr.fail(function() {
                    // 默认重试一次
                    // 为避免出现麻烦问题，非幂等url不重试
                    if (retry >= 1 || isNotIdempotent(_opt.url)) return;

                    retry++;
                    xhr = $.ajax(_opt);
                    _doSomething(xhr, _opt.url);
                    _done(xhr, fn);
                });
            })(xhr, fn);

            return this;
        },
        fail: function fail(fn) {
            var retry = 0;

            (function _fail(xhr, fn) {
                xhr.done(function(res) {
                    if (res.ec !== 0 && res.retcode !== 0) fn(res);
                });
                xhr.fail(function(err, errMsg) {
                    // 默认重试一次
                    // fail暂定不重试
                    if (retry >= 0) {
                        if (errMsg == 'timeout') return fn({
                            ec: 504,
                            msg: errMsg
                        });
                        return fn({
                            ec: err.status
                        });
                    }

                    retry++;
                    xhr = $.ajax(_opt);
                    _doSomething(xhr, _opt.url);
                    _fail(xhr, fn);
                });
            })(xhr, fn);

            return this;
        },
        timeout: function timeout(fn) {
            xhr.fail(function(err, errMsg) {
                if (errMsg == 'timeout') fn({
                    ec: 504,
                    msg: errMsg
                });
            });

            return this;
        },
        always: function(fn) {
            xhr.always(fn);

            return this;
        },
        then: function() {
            xhr.then.apply(xhr, arguments);

            return this;
        }
    };

    return myXhr;
};

db.get = get;
db.post = post;
db.bkn = bkn;
},{"./report":5,"./util":9}],7:[function(require,module,exports){
'use strict;'
var _ = {};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};
var escapeRegexp = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
_.escape = function(string) {
    if (!string) return '';
    return String(string).replace(escapeRegexp, function(match) {
        return escapeMap[match];
    });
};
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(typeof text === 'undefined') var text = ''; ;
__p += '\r\n';
if(!opt.refresh){;
__p += '\r\n<span class="select-span disabled" role="combobox" tabindex="0">\r\n    ';
if(opt.input){;
__p += '\r\n        <input type="text" class="select-span-text" value="';
if(!opt.empty){;
__p +=
((__t = (text)) == null ? '' : __t);
};
__p += '" ';
if(opt.inputmax){;
__p += 'maxlength="' +
__e(opt.inputmax) +
'"';
};
__p += ' placeholder="" />\r\n        <span class="select-span-icon"></span>\r\n    ';
}else{;
__p += '\r\n        <span class="select-span-text">\r\n            ';
if(!opt.empty){;
__p +=
__e(text);
};
__p += '\r\n        </span>\r\n        <span class="select-span-icon"></span>\r\n    ';
};
__p += '\r\n</span>\r\n<ul class="option-list">\r\n';
};
__p += '\r\n    ';
for(var i = 0,l=list.length;i<l;i++){
        var item = list[i];
    ;
__p += '\r\n        <li data-value="' +
((__t = (item.value)) == null ? '' : __t) +
'" role="option" tabindex="0">' +
((__t = (item.name)) == null ? '' : __t) +
'</li>\r\n    ';
};
__p += '\r\n';
if(!opt.refresh){;
__p += '\r\n</ul>\r\n';
};


}
return __p
}
},{}],8:[function(require,module,exports){
'use strict;'
var _ = {};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};
var escapeRegexp = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
_.escape = function(string) {
    if (!string) return '';
    return String(string).replace(escapeRegexp, function(match) {
        return escapeMap[match];
    });
};
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="g-dialog vcode-dialog" id="vcodeDialog">\r\n    <div class="dialog-main">\r\n    \t<div class="img-vcode">\r\n\t    \t<p>请输入下图中的字符，不区分大小写</p>\r\n\t        <ul class="vcode_ctn">\r\n\t            <li>\r\n\t            \t<i class="adjust"></i>\r\n\t            \t<img id="vcodeImg" class="vcode_img" title="验证码" />\r\n\t            \t<a id="vcodeChangeImg" class="change_img" href="javascript:void(0);" tabindex="10">看不清，换一张</a>\r\n\t            </li>\r\n\t            <li>\r\n\t            \t<label for="vcode_text">验证码：</label>\r\n\t            \t<input id="vcodeImgText" style="ime-mode: disabled;" type="text" maxlength="4" title="请输入验证码" tabindex="6" />\r\n\t            </li>\r\n\t        </ul>\r\n    \t</div>\r\n\r\n    \t<div class="photo-vcode">\r\n\t        <p>本次操作需要短信验证码，请完成以下操作</p>\r\n\t   \t    <ul class="vcode_ctn">\r\n\t            <li>\r\n\t            \t<i class="adjust"></i>\r\n\t            \t<input id="vcode_phone" type="text" maxlength="11" title="请输入手机号码"  tabindex="11" />\r\n\t            \t<a id="receive_vcode" href="javascript:void(0);" class="btn"  tabindex="12">获取验证码</a>\r\n\t           \t</li>\r\n\t            <li>\r\n\t            \t<i class="adjust"></i>\r\n\t            \t<input id="vcodePhoneText" type="text" maxlength="6" title="请输入手机验证码" tabindex="13" />\r\n\t            \t<span>验证码只能使用一次30分钟内有效</span>\r\n\t            </li>\r\n\t        </ul>\r\n    \t</div>\r\n    </div>\r\n    <div class="footer">\r\n    \t<span class="vcode_error"></span>\r\n        <div>\r\n            <button class="btn sub-btn">确定</button>\r\n            <button class="btn close-btn">取消</button>\r\n        </div>\r\n    </div>\r\n    <button class="close close-btn" data-nologin="1">×</button>\t\t\r\n</div>\r\n<div id="vcodeMasker" class="mask"></div>';

}
return __p
}
},{}],9:[function(require,module,exports){
'use strict';
//一些工具方法

module.exports = (function() {
	/**
	 * fn:       类型判断
     * param:    {any} o 判断对象
     * return:   {string} 返回判断字符串
     *           可选字符串有:"Boolean","Number","String","Function","Array","Date","RegExp","Object","undefined",等
     */
    function type(o) {
        var t = Object.prototype.toString.call(o),
            l = t.length;
        return o == null ? String(o) : t.slice(8, l - 1);
    };

	/**
	 * 获取对应key的cookies值
	 * 没有则返回空字符串
	 * @param  {String} key 要获取的key值
	 */
	var getCookie = function(key) {
		var r = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)'),
			m = document.cookie.match(r);
		return (!m ? '' : m[1]);
	};

	var getUin = function(){
		var uin = getCookie('uin');
		return uin.replace(/^[\D0]+/g,'');
	}

	var getParameter = function(name,str){
        str = str || location.href;
        var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)"), m = str.match(r);
        return decodeURIComponent(!m ? "" : m[2]);		
	}

	var getTextLength = function(str,len){
        //正则取到中文的个数，然后len*count+原来的长度。不用replace
        var factor = len || 2;
        str += '';
        var tmp = str.match(/[^\x00-\xff]/g) || [];

        var count = tmp.length;
        return str.length + (factor - 1) * count;
    }

    // 截取前len长度的子字符串，一个汉字相当于n个英文字符
    var getSubstring = function(str, len, n) {
        n = n || 3;

        if(str.length <= len / n) return str;

        var length = 0;
        var res = '';

        for(var i = 0; i < len; i++) {
            var c = str.charAt(i);
            if(/[^\x00-\xff]/.test(c)) length += n;
            else length++;
            res += c;

            if(length >= len) break;
        }

        if(length > len) res = res.substring(0, res.length - 1);

        return res;
    };

    // 为输入框设置可输入的最大字符数
    var setMaxInput = (function() {
        var val = ''; // getTextLength($input.val().trim());

        return function($input, max) {
            max = max || Number($input.attr('maxlength'));

            val = $input.val().trim();

            var eInput = function(e) {
                // debugger;
                // console.log('input', e.keyCode);
                // 左右键、回车键
                if(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 13) return;
                
                if(getTextLength($input.val().trim(), 3) > max) return $input.val(val);

                val = $input.val().trim();
                return;
                var v = subStr($input.val().trim(), max || Number($input.attr('maxlength')));
                $input.val(v);
            };
            var ePaste = function() {
                if(getTextLength($input.val().trim(), 3) > max) return $input.val(val);

                val = $input.val().trim();
                return;
                var v = subStr($input.val().trim(), max || Number($input.attr('maxlength')));
                $input.val(v);
            };
            $input.off('input', eInput).off('paste', ePaste).on('input', eInput).on('paste', ePaste);
        }
    })();

    //截字
    var subStr = function(str,maxlen){
        var sResult = '', L=0, i=0, stop = false, sChar;
        if(str.replace(/[^\x00-\xff]/g,'xxx').length <= maxlen){
            return str;
        }
        while(!stop){
            sChar = str.charAt(i);
            //sResult+=sChar;
            L+= sChar.match(/[^\x00-\xff]/) !== null ? 3 : 1;

            if(L > maxlen){
                stop = true;
            }else{
                sResult+=sChar;
                i++;
            }
        }
        return sResult;     
    }

    var decodeHtml = (function() {
        var htmlDecodeDict = { "quot": '"', "lt": "<", "gt": ">", "amp": "&", "nbsp": " " , "#34": '"', "#60": "<", "#62": ">", "#38": "&", "#160": " "};

        return function(s){
            s += '';
            return s.replace(/&(quot|lt|gt|amp|nbsp);/ig,
                function(all, key) {
                    return htmlDecodeDict[key];
                }).replace(/&#u([a-f\d]{4});/ig,
                    function(all, hex) {
                        return String.fromCharCode(parseInt("0x" + hex));
                    }).replace(/&#(\d+);/ig,
                        function(all, number) {
                            return String.fromCharCode(+number);
                        });
        }
    })();

    //排序
    var nameSortDown=function(a,b){
        if(a<b){
            return 1;
        }else if(a>b){
            return -1;
        }else{
            return 0;
        }
    };
    var nameSortUp=function(a,b){
        if(a<b){
            return -1;
        }else if(a>b){
            return 1;
        }else{
            return 0;
        }
    };
    var numSortDown=function(a,b){
        a=parseInt(a),
        b=parseInt(b);
        if(a<b){
            return 1;
        }else if(a>b){
            return -1;
        }else{
            return 0;
        }
    };
    var numSortUp=function(a,b){
        a=parseInt(a),
        b=parseInt(b);
        if(a<b){
            return -1;
        }else if(a>b){
            return 1;
        }else{
            return 0;
        }
    };
    
    //换算禁言时间
    function getShutTime(time){
        time -= 30;
        if(time<3540){
            return Math.ceil(time/60)+'分钟';
        }else if(time < 82800){
            return Math.ceil(time/3600)+'小时';
        }else{
            return Math.ceil(time/86400)+'天';
        }
    };

    var storage = localStorage;

    //
    function getCacheKey(uin,gid){

    }
    //设置cache
    function setCache(key,data){
        if(typeof data !== 'string'){
            data = JSON.stringify(data);
        }        
        try{
            storage.setItem(key,data);
        }catch(e){
        }
    }

    //读取cache
    function getCache(key,flag){
        if(flag){
            return storage.getItem(key);
        }else{
            var value = storage.getItem(key);
            try{
                var data = JSON.parse(value);
            }catch(e){
                var data = value;
            }
            return data;
        }
    }

    var gc;
    function init(gid){
        gc = gid;
    }

    //从performance 里面按name的正则取一个对象
    function getPerfMatch(name){
        var perf = window.performance;
        if(perf && perf.getEntriesByType){
            var list = window.performance.getEntriesByType('resource');
            for(var i =0,l=list.length;i<l;i++){
                var item = list[i];
                if(name.test(item.name)){
                    return item;
                }
            }
        }
        return false;        
    }

    //从performance 里面按name取一个对象
    function getPerf(name){
        var perf = window.performance;
        if(perf && perf.getEntriesByType){
            var list = window.performance.getEntriesByType('resource');
            for(var i =0,l=list.length;i<l;i++){
                var item = list[i];
                if(item.name.indexOf(name) >=0 ){
                    return item;
                }
            }
        }
        return false;
    }

    /*
    判断窗口高度等等
    */
    (function(){
        if(window.screen.availHeight <= 600){
            $('body').addClass('limit-height');
        }
    })();

	return {
        init : init,
		type : type,
		getCookie : getCookie,
		getUin : getUin,
		getParameter : getParameter,
		getTextLength: getTextLength,
        getSubstring: getSubstring,
        setMaxInput: setMaxInput,
        subStr : subStr,
        decodeHtml: decodeHtml,
        nameSortDown : nameSortDown,
        nameSortUp : nameSortUp,
        numSortDown : numSortDown,
        numSortUp : numSortUp,
        getShutTime : getShutTime,
        setCache : setCache,
        getCache : getCache,
        getPerfMatch : getPerfMatch,
        getPerf : getPerf
	}
})();
},{}],10:[function(require,module,exports){
//验证码

var tmpl = require('./tmpl/vcode');
var config = require('./config');

module.exports = (function(){
	var gc = 0;
	var lock = false;
	var IMG_VC_URL = 'http://captcha.qq.com/getimage?aid=715021421&';

	var imgFlag = false;

	var subFn,cancelFn;//提交和取消的函数

	var dialog = $("#vcodeDialog"),
		vcodeImg,
		errorDom,
		imgVcodeInput,
		photoVcodeInput,
		imgDom = dialog.find('.img-vcode'),
		photoDom = dialog.find('.photo-vcode');

	var rphone = /^1\d{10}$/, rphoneVCode = /^\d{6}$/, rimgCode = /^[a-z]{4}$/i;

	//显示验证码窗口
	/*
	flag 标记
	scb 提交事件
	ccb 取消事件
	*/
	function show(flag,scb,ccb){
		subFn = scb;
		cancelFn = ccb;

		imgFlag = true;
		if(flag){
			imgDom.show();
		}else{
			photoDom.show();
		}
		dialog.show();
		mask.show();

		refreshCodeImg();
	}

	//刷新验证码图片
	function refreshCodeImg(){
        vcodeImg.prop('src', IMG_VC_URL + (new Date().getTime()));
        return this;
	}

	function showError(msg){
		void 0;
		errorDom.text(msg);
	}


	//图片验证码提交
	function imgSub(){
        var code = $('#vcodeImgText').val();
        if (!rimgCode.test(code)) {
            showError(config.msg.vcode.err);
            $('#vcodeImgText').focus();
            return;
        }	
        if(typeof subFn === 'function'){
        	subFn(code);     	
        }
	}

	//事件绑定
	function bindEvent(){
		dialog.find('.close-btn').bind("click",function(){
			dialog.hide();
			mask.hide();			
		});

		//提交
		dialog.find('.sub-btn').bind('click',imgSub);

		$("#vcodeChangeImg").bind('click',function(){
			refreshCodeImg();
		});

		$("#vcodeImgText").bind('keyup',function(e){
			 e.keyCode == 13 && imgSub();
		});

	}


	function init(gid){
		gc = gid;
		if(dialog.length === 0){
			var html = tmpl();
		}
		$('body').append(html);

		dialog = $("#vcodeDialog");
		mask = $("#vcodeMasker");
		imgDom = dialog.find('.img-vcode');
		photoDom = dialog.find('.photo-vcode');
		vcodeImg = $("#vcodeImg");
		errorDom = dialog.find('.vcode_error');

		photoDom.hide();
		imgDom.hide();

		bindEvent();
	}

	function hideVcode(){
		dialog.hide();
		mask.hide();		
		dialog.find('input[type=text]').val('');
	}

	return {
		init : init,
		show : show,
		showError : showError,
		hide : hideVcode
	}
})();
},{"./config":3,"./tmpl/vcode":8}],11:[function(require,module,exports){
'use strict';
//一些UI方法
//下拉框转换
var selectTmpl = require('./tmpl/select');
var util = require('./util');

//弹框提示,这里应该尽量使用客户端的弹窗.不得已的情况下才使用这个
//var dialogTmpl = require('./tmpl/dialog');

module.exports = (function() {

	$('body').on('click', function(e) {
		var target = $(e.target);
		e.stopPropagation();
		if (!target.parents('.select-span').length && e.target.nodeName != 'SELECT') {
			$('.option-list').hide();
		}
	});

	function transSelect(srcObj, cb, opt) {

		if (typeof srcObj === 'string') {
			srcObj = $(srcObj);
		}

		srcObj.addClass('action');

		if (typeof cb === 'boolean') {
			isInput = cb;
		}

		if (!opt) {
			opt = {
				input: false,
				empty: false,
				inputmax: 45,
				default: false,
				refresh: false
			};
		}

		var optlist = srcObj.find('option');
		//var id = srcObj.attr('id');
		var nowVal = srcObj.val();
		var obj = {
			//id : id+'Span',
			opt: opt,
			list: []
		};

		srcObj.find('option').each(function(idx, dom) {
			var item = $(dom);
			if (nowVal === item.val()) {
				if (opt.default) obj.text = opt.default;
				else obj.text = item.text();
			}
			obj.list.push({
				name: item.text(),
				value: item.val()
			})
		});
		var html = selectTmpl(obj);
		var disabled = srcObj.prop('disabled');
		var htmlObj = $(html);

		srcObj.after(htmlObj);
		var targetObj = srcObj.next('.select-span'); //$('#'+obj.id);
		var targetText = targetObj.find('.select-span-text').val('');
		var ulObj = targetObj.next('.option-list');

		if (opt.input && opt.inputmax) {
			util.setMaxInput(targetText, opt.inputmax);
		}
		if (opt.input && typeof opt.checkfn === 'function') {
			targetText.bind('blur', opt.checkfn);
		}

		targetObj.bind('click', function(e) {
			if (srcObj.prop('disabled')) {
				return;
			}

			if (opt.stopDefault && opt.stopDefault()) return;

			$('.option-list').hide();
			if (ulObj.attr('data-show')) {
				ulObj.hide().removeAttr('data-show');
			} else {
				ulObj.show().attr('data-show', 1);
			}
		});

		ulObj.on('click', 'li', function() {
			var dom = $(this),
				val = dom.attr('data-value'),
				name = dom.text();
			srcObj.val(val);

			if (opt.input) {
				targetText.val(name);
				targetText.trigger('blur');
			} else {
				targetText.text(name);
			}
			if (val) {
				ulObj.hide().removeAttr('data-show');

				(typeof cb === 'function') && (name !== opt.default) && (opt.default = name) && cb(val, name);
			}
		});

		var refresh = function(list, text) {
			if (!list) {
				return;
			}
			opt.refresh = true;
			obj.list = list;
			var html = selectTmpl(obj);
			ulObj.html(html);
			if (opt.input) {
				targetText.val(text);
			} else {
				targetText.text(text);
			}
		}

		var refreshBySelect = function() {
			obj.list = [];
			obj.opt.refresh = true;
			nowVal = srcObj.val();
			srcObj.find('option').each(function(idx, dom) {
				var item = $(dom);
				if (nowVal === item.val()) {
					obj.text = item.text();
				}
				obj.list.push({
					name: item.text(),
					value: item.val()
				})
			});
			var html = selectTmpl(obj);
			ulObj.html(html);
		}

		return {
			refreshSelect: refreshBySelect,
			refresh: refresh
		}


	}

	//暂时好像没有别的地方要用到..先放这...没别的地方用的话就删了....
	function dialog(opt) {
		var id = opt.id || 'dialogBox';
		var cls = opt.cls || 'g-dialog';
		var msg = opt.msg;
		var type = opt.type;

		var dialogDom = $('#' + id);
		if (dialogDom.length === 0) {
			dialogDom = $('<div id="' + id + '" class="' + cls + '"></div>');
			$('body').append(dialogDom);
		}
		var html = dialogTmpl(opt);
		dialogDom.html(html).removeClass('hide');
	}

	return {
		transSelect: transSelect //,
			//dialog : dialog
	}
})();
},{"./tmpl/select":7,"./util":9}],12:[function(require,module,exports){
'use strict';

var request = require('../../lib/request');
//设置页用到的cgi
/*
这里还有几个地方是要直接走客户端接口的...
/cgi-bin/qun_info/get_group_setting
/cgi-bin/qun_info/get_aio_tab_info?gc=xxxx[&tab_id=xxx]&bkn=xxxx
/cgi-bin/qun_info/set_aio_tab?gc=xxx&tab_id=xxx&bkn=xxx

*/

module.exports = (function() {
    var gc = 0;

    function getTenpayinfo(param,cb,error){
        //http://mqq.tenpay.com/cgi-bin/miscv1.0/mqq_query_userinfo.cgi
        request.get('http://mqq.tenpay.com/cgi-bin/miscv1.0/mqq_query_userinfo.cgi',param,cb,error,0,true);
    }

    //设置群aio自定义窗口
    function setLabel(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/set_aio_tab', param, cb, error);
    }

    //取群设置
    function getSetting(cb, error) {
        request.get('/cgi-bin/qun_info/get_group_setting', {
            gc: gc
        }, cb, error);
    }

    //取用户tag
    function getTag(cb, error) {
        request.get('/cgi-bin/qun_info/get_member_tag_flag', {
            gc: gc
        }, cb, error);
    }

    //取管理员接收加群消息设置
    function getAdminAuth(param, cb, error) {
        if (param) {
            param.gc = gc;
        }
        request.get('/cgi-bin/qun_info/get_admin_auth', param, cb, error);
    }

    //取禁言列表
    function getShut(param, cb, error) {
        request.get('/cgi-bin/qun_info/get_group_shutup', {
            gc: gc
        }, cb, error);
    }

    //设置群设置
    function setGroup(param, cb, error) {
        //cgi-bin/qun_info/set_group_setting
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/set_group_setting', param, cb, error);
    }

    //设置禁言列表
    function setShut(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }

        request.post('/cgi-bin/qun_info/set_group_shutup', param, cb, error);
    }

    //设置是否只能通过群号搜索
    function setSearch(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/set_search_gc_only', param, cb, error);
    }

    //设置用户tag
    function setTag(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/set_member_tag_flag', param, cb, error);
    }

    //设置管理员接受验证消息权限
    function setAuth(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/set_admin_auth', param, cb, error);
    }

    //设置文件和相册权限
    function setUpload(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/set_file_album_right', param, cb, error);
    }

    //验证关键字是否涉黄
    function checkKey(param, cb, error) {
        if (!param.gc) {
            param.gc = gc;
        }
        request.post('/cgi-bin/qun_info/check_sensitive_word', param, cb, error);
    }

    //设置公开群项目
    function setOpen(param, cb, error) {
        ///cgi-bin/qun_info/set_open
        if (!param.gc) {
            param.gc = gc;
        }
        if (!param.vcode) {
            param.vcode = true;
        }
        request.post('/cgi-bin/qun_info/set_open', param, cb, error);
    }

    function getAnoy(cb, error) {
        request.get('http://qqweb.qq.com/c/anonymoustalk/get_anony_switch', {
            group_code: gc
        }, cb, error);
    }

    function setAnoy(param, cb, error) {
        //http://qqweb.qq.com/c/anonymoustalk/get_anony_switch
        if (!param.gc) {
            param.group_code = gc;
        }
        request.post('http://qqweb.qq.com/c/anonymoustalk/set_anony_switch', param, cb, error);

    }

    ///cgi-bin/qun_info/set_search_gc_only

    function setGroupEnter(param,cb,error){
        ///http://pay.qun.qq.com/cgi-bin/group_pay/group_enter_fee/get_group_enter_status
        if (!param.gc) {
            param.gc = gc;
        }
        request.get('http://pay.qun.qq.com/cgi-bin/group_pay/group_enter_fee/set_group_enter_fee', param, cb, error);
    }

    function getGroupEnter(cb,error){
        var param = {
            gc : gc
        };
        request.get('http://pay.qun.qq.com/cgi-bin/group_pay/group_enter_fee/get_group_enter_fee', param, cb, error);        
    }

    //设置禁止群成员发起讨论组和禁止群成员发起临时会话
    /*
    forbid_discuss  int false           0-取消禁止发起讨论组的标记 1-设置禁止发起讨论组的标记
    forbid_chat int false           0-取消禁止群内发起临时会话的标记 1-设置禁止群内发起临时会话的标记
    gc  int true            群号    
     */
    function setDiscuss(param,cb,error){
        //http://qinfo.clt.qq.com/cgi-bin/qun_info/set_forbid_discuss
        if (!param.gc) {
            param.gc = gc;
        }

        request.post('/cgi-bin/qun_info/set_forbid_discuss', param, cb, error);
    }

    //读取设置禁止群成员发起讨论组和禁止群成员发起临时会话
    /*
    forbid_discuss  int false           0-取消禁止发起讨论组的标记 1-设置禁止发起讨论组的标记
    forbid_chat int false           0-取消禁止群内发起临时会话的标记 1-设置禁止群内发起临时会话的标记
    gc  int true            群号    
     */
    function getDiscuss(param,cb,error){
        //http://qinfo.clt.qq.com/cgi-bin/qun_info/set_forbid_discuss
        if (!param.gc) {
            param.gc = gc;
        }

        request.post('/cgi-bin/qun_info/get_forbid_discuss', param, cb, error);
    }    

    function init(guin) {
        gc = guin;
    }
    
    return {
        getSetting: getSetting,
        getTag: getTag,
        setTag: setTag,
        getAdminAuth: getAdminAuth,
        setAuth: setAuth,
        getShut: getShut,
        setShut: setShut,
        setSearch: setSearch,
        setGroup: setGroup,
        setOpen: setOpen,
        setUpload: setUpload,
        setLabel: setLabel,
        checkKey: checkKey,
        getAnoy: getAnoy,
        setAnoy: setAnoy,
        setGroupEnter : setGroupEnter,
        getGroupEnter : getGroupEnter,
        getTenpayinfo : getTenpayinfo,
        setDiscuss : setDiscuss,
        getDiscuss : getDiscuss,
        init: init
    }

})();
},{"../../lib/request":6}],13:[function(require,module,exports){
'use strict';
//一些工具方法
//设置页用到的客户端方法

var client = require('../../lib/callClient'),
	util = require('../../lib/util')

module.exports = (function() {

	//调用客户端的设置禁言接口
	function editShut() {
		return client.callCLient('editGroupShutTime');
	}

	//判断是否在线
	function online() {
		return client.callClient('IsSelfOnline');
	}

	//取自己在群里面的权限
	function getSelfIdentity() {
			return client.callClient('getSelfIdentity');
		}
		//取自己的qq
	function getSelfUin() {
			return client.getSelfUin() || util.getUin();
		}
		//取客户端版本
	function getVersion() {
			return (client.getVersion() || util.getParameter('clientversion'));
		}
		//取群号
	function getGroupUin() {
		return (client.getGroupUin() || util.getParameter('groupuin'));
	}

	//取加群权限设置
	function getGroupMemberOption() {
		return client.callClient('GetGroupMemberOptionEx');
	}

	//获取群消息提示方式
	function getGroupMsgOption() {
		return client.callClient('GetGroupMsgOption');
	}

	//获取是否允许加群
	function getGroupMemberInviteOption() {
		return client.callClient('GetGroupMemberInvateOption');
	}

	//获取是否允许群视频
	function getGroupVideoOption() {
		return client.callClient('GetGroupVideoOption');
	}

	//设置群消息的提示方式
	function setGroupMsgOption(value) {
		return client.callClient('SetGroupMsgOption', [value]);
	}

	//设置是否允许加群
	function setGroupMemberInviteOption(value) {
		return client.callClient('SetGroupMemberInvateOption', [value]);
	}

	//设置加群方式 简单模式
	function setGroupMemberOption(value) {
		return client.callClient('SetGroupMemberOption', [value]);
	}

	//设置加群方式 有设置验证问题的时候调用
	function setGroupMemberOptionEx(value) {
		return client.callClient('SetGroupMemberOptionEx', [value]);
	}

	//设置是否允许群视频
	function setGroupVideoOption(value) {
		return client.callClient('SetGroupVideoOption', [value]);
	}

	//取禁言选项
	function getBenMenu() {
		return client.callClient('GetBanSpeechMenuInfo');
	}

	function ShowGroupInMemBanSpeechMsg() {
		return client.callClient('ShowGroupInMemBanSpeechMsg');
	}

	function ShowGroupInAllBanSpeechMsg() {
		return client.callClient('ShowGroupInAllBanSpeechMsg');
	}

	//修改禁言时间
	function editGroupShutTime(value) {
		return client.callClient('editGroupShutTime', [value]);
	}

	function GetGroupMsgForbidPic(value){
		return client.callClient('GetGroupMsgForbidPic');
	}

	function SetGroupMsgForbidPic(value){
		return client.callClient('SetGroupMsgForbidPic', [value]);
	}	

	function exitGroup(value){
		return client.callHummer('Group.ExitGroup','{"groupId":"'+value+'"}');
	}

	function setAio(value){
		return client.callClient('SetGroupAIODynamicTab',[value]);
	}

	//设置QQ电话
	function setPhone(value){
		return client.callClient('SetGroupConfOption',[value]);
	}

	//读取QQ电话
	function getPhone(){
		return client.callClient('GetGroupConfOption');
	}

	//读取禁止群成员发起讨论组和禁止群成员发起临时会话
	function getDiscuss(){
		return client.callClient('GetGroupForbidAloneChat');
	}

	// function popNewWebPage(width, height, url, title, singletonId){
	// 	return client.callHummer('Group.PopNewWebPage', '{"width" : ' + width + ', "height" : ' + height + ', "title" : "' + title + '", "url" : "' + url + '", "singletonId":"'+ singletonId  +'" }');
	// }

	return {
		//取配置类的
		getSelfIdentity: getSelfIdentity,
		getSelfUin: getSelfUin,
		getVersion: getVersion,
		getGroupUin: getGroupUin,
		getGroupMsgOption: getGroupMsgOption,
		getGroupMemberOption: getGroupMemberOption,
		getGroupMemberInviteOption: getGroupMemberInviteOption,
		getGroupVideoOption: getGroupVideoOption,
		getBenMenu: getBenMenu,

		//设置类的
		setGroupMemberInviteOption: setGroupMemberInviteOption,
		setGroupMemberOption: setGroupMemberOption,
		setGroupMemberOptionEx: setGroupMemberOptionEx,
		setGroupMsgOption: setGroupMsgOption,
		setGroupVideoOption: setGroupVideoOption,
		editGroupShutTime: editGroupShutTime,

		//通知
		showGroupInAllBanSpeechMsg: ShowGroupInAllBanSpeechMsg,
		showGroupInMemBanSpeechMsg: ShowGroupInMemBanSpeechMsg,

		//其他类型的
		online: online,
		common: client,

		//图片屏蔽：
		GetGroupMsgForbidPic : GetGroupMsgForbidPic,
		SetGroupMsgForbidPic : SetGroupMsgForbidPic,
			//popNewWebPage : popNewWebPage
		//设置tab	
		setAio : setAio,
		exitGroup : exitGroup,

		//设置QQ电话
		setPhone : setPhone,
		getPhone : getPhone,

		//讨论组和临时会话
		getDiscuss : getDiscuss,

		alert : client.alert
	};
})();
},{"../../lib/callClient":2,"../../lib/util":9}],14:[function(require,module,exports){
/**
 * 是否允许成员拉临时讨论组或者发起临时会话
 * 背景 外网一直有群主反馈有人在群里面通过临时会话或者临时讨论组拉人, 这个需求的目的是遏制这种情况
 * 对外暴露2个方法
 * init  这个模块的初始化
 * setDiscuss 设置是否可以拉临时讨论组或临时会话.
 */
var client = require('./client');
var report = require('../../lib/report');
var cgi = require('./cgi');
var config = require('../../lib/config');
var util = require('../../lib/util');

var disversion = 5479;

/*
你那边调用 GetGroupForbidAloneChat
然后我回调onCallback_ForbidAloneChat 给你 第一个参数表示是否成功，第二参数是禁止拉讨论组的，0表示不禁止，1表示禁止。第三个参数是禁止临时会话，0表示不禁止，1表示禁止
*/

// var time, //计时器
// 	canDiscuss = 10,
// 	canGroup = 10;

/**
 * 调用cgi设置数据
 * @Author   hordeliu
 * @DateTime 2016-03-10T14:56:00+0800
 */
function set(param){
	//var param = {};
	/*
	做一个请求合并避免发2个请求去设置
	改为一次设置一个.
	if(canDiscuss !== 10){
		param.forbid_discuss = canDiscuss;
	}
	if(canGroup !== 10){
		param.forbid_chat = canGroup;
	}
	*/
	var handler = function(res){
		if(res.ec === 0){
		    var tdw = {};
		    tdw = $.extend(tdw, G.tdw);
		    tdw.opername = 'PC_grpdata';
		    tdw.module = 'grp_set';

		    if(typeof param.forbid_discuss !== 'undefined'){
		    	tdw.action = !param.forbid_discuss?'open_discuss':'close_discuss';
		    }else{
		    	tdw.action = !param.forbid_chat?'open_temp':'close_temp';
		    }	    
		    tdw.ver1 = G.selfUin;

		    report.tdw(tdw);			
		}else{
			client.alert(1, '提示', '设置失败，请稍后重试！');
			if(typeof param.forbid_discuss !== 'undefined'){
				$("#allowtempGroup").prop('checked',param.forbid_discuss);
			}else{
				$("#allowtempDiscuss").prop('checked',param.forbid_chat)
			}
		}
	}
	cgi.setDiscuss(param,handler);

	// canDiscuss = 10;
	// canGroup = 10;
}

/**
 * 从客户端读取是否允许拉临时会话或者临时讨论组
 * @Author   hordeliu
 * @DateTime 2016-03-10T10:56:36+0800
 * @return   null
 */
function getDiscuss(){
	// var ret = client.getDiscuss();
	// {ec: 0, forbid_chat: 1, forbid_discuss: 0} 
	var handler = function(res){
		var disTxt = '禁止群内发起讨论组',
			groupTxt = '禁止群内发起临时会话';
		if(!parseInt(res.forbid_discuss)){
			disTxt = '允许群内发起讨论组';
		}
		if(!parseInt(res.forbid_chat)){
			groupTxt = '允许群内发起临时会话';
		}

		//讨论组替换成多人会话
		if(G.version >= disversion){
			disTxt = disTxt.replace('讨论组','多人聊天');
		}

		if(res.ec === 0){
			if(G.role === '1'){
                $("#allowtempDiscuss").prop('checked',res.forbid_discuss == 0?true:false);//.attr('aria-label',disTxt);
                $("#allowtempGroup").prop('checked',res.forbid_chat == 0?true:false);//attr('aria-label',groupTxt);
			}else{
				$("#discussSet input").remove();

				$("#allowtempDiscussLabel").text(disTxt);
				$("#allowtempGroupLabel").text(groupTxt);
				// $("#allowtempDiscuss").prop('checked',dis);
				// $("#allowtempGroup").prop('checked',tmp);				
			}
		}
	}

	cgi.getDiscuss({},handler,handler);

	return;
}

/**
 * 调用cgi设置临时会话
 * @Author   hordeliu
 * @DateTime 2016-03-10T11:01:22+0800
 * return null;
 */
function setDiscuss(e){
	var target = $(e.target),
		flag = target.prop('checked'),
		canDiscuss = flag?0:1;
	
	//clearTimeout(time);
	set({
		forbid_chat : canDiscuss	
	});

	// time = setTimeout(function(){
	// },800);
}

/**
 * 调用cgi设置讨论组的状态
 * @Author   hordeliu
 * @DateTime 2016-03-10T11:01:22+0800
 * return null;
 */
function setGroup(e){
	var target = $(e.target),
		flag = target.prop('checked'),
		canGroup = flag?0:1;
	void 0;
	set({
		forbid_discuss : canGroup	
	});

	//clearTimeout(time);
	//set();
	// time = setTimeout(function(){
	// },800);
}

/**
 * 绑定客户端回调函数
 * @Author   hordeliu
 * @DateTime 2016-03-15T14:00:25+0800
 * @return   null
 * 第一个参数表示是否成功，第二参数是禁止拉讨论组的，0表示不禁止，1表示禁止。第三个参数是禁止临时会话，0表示不禁止，1表示禁止
 * 非群主态		仅群主有权限发起临时会话
		仅群主有权限发起讨论组
		允许群成员发起临时会话
		允许群成员发起讨论组
 
function bindAction(){
	window.onCallback_ForbidAloneChat = function(ret,dis,tmp){
		// console.log('收到回调',ret,dis,tmp);
		// console.log(typeof G.role,typeof ret);
		// 
		var disTxt = '仅群主有权限发起临时会话',
			groupTxt = '仅群主有权限发起讨论组';
		if(!parseInt(tmp)){
			groupTxt = '允许群成员发起讨论组';
		}
		if(!parseInt(dis)){
			disTxt = '允许群成员发起临时会话';
		}
		if(ret === '0'){
			if(G.role === '1'){
                $("#allowtempDiscuss").prop('checked',dis == 0?true:false);//.attr('aria-label',disTxt);
                $("#allowtempGroup").prop('checked',tmp == 0?true:false);//attr('aria-label',groupTxt);
			}else{
				$("#discussSet input").remove();

				$("#allowtempDiscussLabel").text(disTxt);
				$("#allowtempGroupLabel").text(groupTxt);
				// $("#allowtempDiscuss").prop('checked',dis);
				// $("#allowtempGroup").prop('checked',tmp);				
			}
		}
	}
	return null;
}
*/

function init(){
	//讨论组修改为多人聊天
	if(G.version >= disversion){
		$("#allowtempGroup").attr('aria-label','允许群成员发起多人聊天');
		$("#allowtempGroupLabel").text('允许群成员发起多人聊天（关闭后，只允许群主发起多人聊天）');
	}

	//if(G.version >= disversion){
		//bindAction();
		getDiscuss();
	// }else{
	// 	$('#discussSet').remove();
	// }
}


module.exports = {
	init : init,
	setDiscuss : setDiscuss,
	setGroup : setGroup
}
},{"../../lib/config":3,"../../lib/report":5,"../../lib/util":9,"./cgi":12,"./client":13}],15:[function(require,module,exports){
var client = require('./client');
var report = require('../../lib/report');
var cgi = require('./cgi');
var config = require('../../lib/config');
var util = require('../../lib/util');
var md5 = require('../../lib/md5');
/**
 * appid=1002
   签名key=y7xxzskucu6veyfxww2deknx4okmr4vp
   http://mqq.tenpay.com/cgi-bin/misc/mqq_query_userinfo.cgi
 */

module.exports = (function() {
	var check = false;
	var handler = $({});
	var joinOpt = client.getGroupMemberOption();

	/**
	 * 计算财付通sign
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T10:11:44+0800
	 * @param    {object}                 param 需要计算的参数
	 * @return   {string}                       生成的前面字符串
	 */
	function getSign(param){
		var str = 'app_id='+param.app_id+'&skey='+param.skey+'&skey_type='+param.skey_type+'&timestamp='+param.timestamp+'&uin='+param.uin+'&key=y7xxzskucu6veyfxww2deknx4okmr4vp';
		return md5.hex_md(str);
	}

	/**
	 * 查询财富通认证情况
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T10:07:34+0800
	 * @return   {[type]}                 [description]
	 */
	function checkTenpayStatus(){
		var param = {
			app_id : 1002,
			uin : G.selfUin,
			skey_type : 2,
			skey : util.getCookie('skey'),
			timestamp : new Date().getTime(),
		}
		var sign = getSign(param);
		param.sign = sign;
		var fun = function(res){
			handler.trigger('getTenpay',res);
		}
		cgi.getTenpayinfo(param,fun,fun);
		return;
	}

	//true 未选中付费  false 已经选中付费
	function changeStatus(val,flag){
		if(parseInt(val) !== 6){
			$("#setAllowInvite").removeClass('disabled');
			$("#groupEnterCast").val('');
			$('#enterCastTips').text('');
			$(".group-enter-tips").hide();
			setStatus(0);
		}else{
			$("#setAllowInvite").addClass('disabled');
			$(".group-enter-tips").show();
			if(!flag){
				$("#groupEnterCast").focus();	
			}
			
			//$('#allowInvite').prop('disabled',true).prop('checked',false);
			check = false;
			//$("#groupEnterCast").focus();
			//$('#joinGroupDl input').prop('disabled', false);	
		}
	}

	//保存状态
	/**
	 * 保存状态
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T10:05:08+0800
	 * @param    {number}                 fee [description]
	 */
	function setStatus(fee){
		var value = this.value || fee;
		var param = {
			fee : parseInt(value*10)*10
		}
		if(G.role === "1"){
			cgi.setGroupEnter(param,function(data){
				void 0;
			});
		}
	}

	function checkInput(value){
		var value = this.value+'';
	    if('' != value.replace(/\d{1,}\.{0,1}\d{0,1}/,'')){
	        this.value = value.match(/\d{1,2}\.{0,1}\d{0,1}/) == null ? '' :this.value.match(/\d{1,2}\.{0,1}\d{0,1}/);
	    }
	}

	function checkCast(flag){
		var value = $.trim(this.value);
		var reg = /[^0-9.]/,
			ret = reg.test(value);

		if(flag && value == ""){
			$('#enterCastTips').text('金额不能为0');
			return;
		}

		//有非数字字符
		var v = parseFloat(value);
		if(v < 0.1 || v > 50){
			$('#enterCastTips').text('限额0.1-50元');	
			return;
		}
		//$("#groupEnterCast").val(checkLength(value));
		$('#enterCastTips').text('');
		return true
	}

	function bindAction(){
		$('#groupEnterCast').on('blur',function(){
			if(!check){
				return;
			}
			var ret = checkCast.call(this,true);
			if(ret){
				setStatus.call(this);
			}
		}).on('keyup',function(){
			check = true;
			checkInput.call(this);
		}).on('click',function(){
			$("#needEnter").click();
		}).on('focus',function(){
			check = true;
		});
	}

	function getStatus(){
		cgi.getGroupEnter(function(data){
			handler.trigger('getEnter',data);
		},function(data){
			handler.trigger('getEnter',data);
		})
	}


	function setShow(fee,flag,flag1){
		//填上加群的花费
		if(fee){
			$("#groupEnterCast").val(fee/100);
			changeStatus(6,flag);
			//勾选选项
			$("#needEnter").prop('checked',true);			
		}	
		bindAction();
        //群主把可以填的恢复        
        if(G.role === "1"){
        	
        }else if(G.role === "2" && fee){
	        $('#joinGroupDl dd').addClass('disabled');
	        $('#joinGroupDl input').prop('disabled', true).prop('checked',false);
	        $("#needEnter").prop('checked',true);			
	        $('.group-enter-tips').hide();

		}else if(G.role === "2"){
			$("#setGroupEnter").addClass('disabled');
			$("#needEnter").prop('disabled',true);
			$('#groupEnterCast').prop('disabled',true);
			$('#costEnterTips').remove();

			// if(flag1){
			// 	//$("#needEnter").prop('checked',true);
			// 	//$("#joinGroupDl input").prop('disabled',true);
				
			// }
			// $("#setAllowInvite").addClass('disabled');
			// $('#allowInvite').prop('disabled',true).prop('checked',false);			
		}else if(G.role === '3' && fee){
			/*我为啥把不要的选项都删掉了.....额.....*/
			$('#joinGroupDl dd.disabled').eq(0).find('label').html(config.msg.view.enter);
			$("#setGroupEnter").remove();
		}else{
			$("#setGroupEnter").remove();
		}
	}

	/**
	 * 修改付费入群的提示和状态
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T16:34:25+0800
	 * @param    {string}                 type [description]
	 * @return   {null}                      [description]
	 */
	function changeEnterTips(type){
		var dom = $("#costEnterTips");
		if(parseInt(G.role) === 1){
			if(type === 'notEnter'){
				dom.html(config.msg.view.notenter);
			}else if(type === 'notTenpay'){
				dom.html(config.msg.view.nottenpay);
			}
		}else if(parseInt(G.role) === 2){
			$('#costEnterTips').remove();
			//$("#joinGroupDl input").prop('disabled',true);
			$("#joinGroupDl .indent").addClass('disabled');
		}else{
			$("#setGroupEnter").remove();
		}

		return null;
	}

	/**
	 * 设置付费群选项不可点
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T17:36:48+0800
	 */
	function setDisabled(){
		$("#setGroupEnter").addClass('disabled-gray disabled');
		$("#needEnter").prop('disabled',true);
	}

	/**
	 * 统一处理财付通和付费入群的回调
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T16:05:32+0800
	 * @param    {number}                 num  回调次数
	 * @param    {object}                 data 最终的参数
	 * @return   {null}                      [description]
	 */
	function cgiCallback(num,data){
		if(num === 2){
			//优先处理有设置付费的情况.这种情况下如果没有绑定财富等等也正常显示付费入群.
			if(data.enterFee){
				setShow(data.enterFee,true,data.canEnter);
			//群等级不够等等情况.总之就是还没有权限设置付费入群
			}else if(!data.canEnter){
				changeEnterTips('notEnter');
				setDisabled();
			//可以设置付费入群,但是财付通没有做过实名认证
			}else if(!data.realTenpay){
				changeEnterTips('notTenpay');
				setDisabled();
			//所有的条件都满足了
			}else if(data.canEnter){
				setShow(data.enterFee,true,data.canEnter);
			}
		}
		return null;
	}

	/**
	 * 统一取财付通状态和付费入群状态.
	 * @Author   hordeliu
	 * @DateTime 2015-12-30T15:47:28+0800
	 * @return   {[type]}                 [description]
	 */
	function bindTrigger(){
		var obj = {
			bindCard : false, //默认为绑定
			realTenpay : false, //默认为实名认证
			canEnter : false,
			enterFee : false
		};
		var callNum = 0;

		handler.bind('getTenpay',function(e,res){
			callNum++;
			if(parseInt(res.retcode) === 0){
				obj.bindCard = parseInt(res.bind_num);
				obj.realTenpay = parseInt(res.real_state);
			//超时默认已认证
			}else if(parseInt(res.ec) === 999){
				obj.bindCard = true;
				obj.realTenpay = true;
			}else{
		        var tdw = {};
		        tdw = $.extend(tdw, G.tdw);
		        tdw.opername = 'Grp_payjoin';
		        tdw.module = 'set_page';
		        tdw.action = 'fail_tiecard';
		        tdw.ver1 = res.retcode;

		        report.tdw(tdw);				
			}
			//obj.realTenpay = true;
			cgiCallback(callNum,obj);
		});

		handler.bind('getEnter',function(e,res){
			callNum++;
			//262 可以设置付费群  257 没有付费群权限.即不能设置付费群
			if(res.ec === 0 || res.ec === 262){
				obj.canEnter = true;
				if(res.enterFee && res.ec === 0){
					obj.enterFee = res.enterFee;
				}
			}
			// obj.canEnter = true;
			// obj.enterFee = 10;
			cgiCallback(callNum,obj);
		});
	}

	function init(){
		bindTrigger();
		getStatus();
		checkTenpayStatus();
	}

	function reportMore(){
        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.opername = 'Grp_payjoin';
        tdw.module = 'set_page';
        tdw.action = 'clk_powerrule';

        report.tdw(tdw);
        //G.tdwList.push(tdw);
	}

	function reportPay(){
        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.opername = 'Grp_payjoin';
        tdw.module = 'set_page';
        tdw.action = 'clk_tiecard';

        report.tdw(tdw);
        //G.tdwList.push(tdw);
	}

	return {
		more : reportMore,
		pay : reportPay,
		init: init,
		getStatus : getStatus,
		setStatus : setStatus,
		changeStatus : changeStatus
	}
})();
},{"../../lib/config":3,"../../lib/md5":4,"../../lib/report":5,"../../lib/util":9,"./cgi":12,"./client":13}],16:[function(require,module,exports){
var client = require('./client');
var phoneVersion = 5473; //qq电话设置入口.

module.exports = (function(){
	var dom = $('#phoneShow');

	function set(e){
		var target = $(e.target);
		var flag = target.prop('checked') ? 1 : 0;
		client.setPhone(flag);
	}

	function init(){
		if(G.version < phoneVersion){
			$("#groupPhoneSet").remove();
		}else{
			var flag = client.getPhone();
			if(flag){
				dom.prop('checked',true);
			}else{
				dom.prop('checked',false);
			}
		}
	}

	return {
		set : set,
		init : init
	}
})();
},{"./client":13}],17:[function(require,module,exports){
var client = require('./client');
var config = require('../../lib/config');
var util = require('../../lib/util');

//SetGroupMsgForbidPic
//GetGroupMsgForbidPic

module.exports = (function() {
	
	var picVersion = 5449;//5443 改成7.8上线了

	function init(){
		if(G.version >= picVersion){
			$("#setShieldPic").removeClass('hide');
			$("#shieldPic").prop('checked',get());
		}
	}

	function get(){
		return client.GetGroupMsgForbidPic() || false;
	}

	function set(e){
        var target = $(e.target);
        var flag = target.prop('checked') ? 1 : 0;

		return client.SetGroupMsgForbidPic(flag);
	}

	return {
		init : init,
		get : get,
		set : set
	}

})()
},{"../../lib/config":3,"../../lib/util":9,"./client":13}],18:[function(require,module,exports){
'use strict';
//一些工具方法
//禁言设置
//cgi
var cgi = require('./cgi');
var client = require('./client');
var tmpl = require('./tmpl/shut');
var view = require('./view');
var config = require('../../lib/config');
var widget = require('../../lib/widget');
var dialogtmpl = require('./tmpl/dialog');

//editGroupShutTime
//onEditGroupShutTimeChange

module.exports = (function() {

    var change = false;
    var shutTarget;
    var dialogDom = $("#shutDialog"); //提示窗口
    var selectUser = []; //已经选择的的成员
    var shutMsg = config.msg.shut;
    var editBtn = $('#editShutTime');
    var resetBtn = $("#resetShutTime");
    var btnList = $('#shutBtnList button');
    var allShutBtn = $('#shutAllUser');
    var shutDom = $('#shutBlock');
    var nowShutTime = -1; //禁言时间
    var allShutDom = $("#allShutBlock");
    var isAlert = false;
    var allShut = false; //全员禁言

    var defMenu = [{
        text: '10分钟',
        seconds: '600'
    }, {
        text: '1小时',
        seconds: '3600'
    }, {
        text: '12小时',
        seconds: '43200'
    }, {
        text: '1天',
        seconds: '86400'
    }];



    //换算禁言时间
    function getShutTime(time) {
        time -= 30;
        if (time < 3540) {
            return Math.ceil(time / 60) + '分钟';
        } else if (time < 82800) {
            return Math.ceil(time / 3600) + '小时';
        } else {
            return Math.ceil(time / 86400) + '天';
        }
    };

    //显示禁言
    function renderShut(list) {
        var obj = {
            list: list,
            role: parseInt(G.role),
            time: getShutTime
        }
        var html = tmpl(obj);
        if (shutTarget.find('li').length > 0) {
            shutTarget.append(html);
        } else {
            shutTarget.html(html);
        }
    };

    //拉禁言列表成功
    function sucHandler(data) {
        if (data.ec == 0) {
            change = false;
            var allshut = data.all_shutup, //全员禁言时间
                myshut = data.me_shutup, //我被禁言的时间

                shutlist = data.shutup_list; //被禁言成员列表
            //有禁言的成员
            if (shutlist) {
                renderShut(shutlist);
                shutDom.removeClass('hide');
            } else {
                allShutDom.addClass('top');
            }
            if (allshut) {
                allShutBtn.prop('checked', true);
            }
        } else {

        }
    }

    //拉禁言列表失败
    function errHandler(data) {

    }

    //更改按钮状态
    var checkShutBtn = function() {
        //定位tab
        // /view.selectOneNav(4);
        var l = $('#shutList input:checked').length;
        var ml = $("#shutList .shut-user").length;
        if (l > 0) {
            btnList.prop('disabled', false);
        } else {
            if ($('#selectAlluser').prop('checked')) {
                $('#selectAlluser').prop({
                    'checked': false
                });
            }
            btnList.prop('disabled', true);
        };
        if (l != ml) {
            $('#selectAllShut').prop('checked', false);
        }
        //dialogDom.removeClass('hide');
    }

    //全部禁言
    function selectAllUser(e) {
        //view.selectOneNav(4);
        if ($(e.target).prop('checked')) {
            $('#shutList input.shut-user').prop('checked', true);
        } else {
            $('#shutList input.shut-user').prop('checked', false);
        }
        checkShutBtn();
    }

    //取选择的用户列表
    function getSelected() {
        var list = [];
        $('#shutList input:checked').each(function() {
            list.push($(this).val());
        });
        return list;
    }

    //显示弹出窗口
    function showAlert(obj, after) {
        var html = dialogtmpl(obj);
        dialogDom.html(html);
        dialogDom.find('button').attr("tabindex", 1);
        setTimeout(function() {
            dialogDom.find('button').eq(0).focus().attr();
        }, 200);
        dialogDom.removeClass('hide');
        if (typeof after === 'function') {
            after();
        }
    }

    //隐藏窗口
    function closeWin(e) {
        isAlert = false;
        var flag = $('#shutAllUser').prop('checked');
        $('#shutAllUser').prop('checked', allShut);
        if (e) {
            var target = $(e.target);
            target.parents('.g-dialog').addClass('hide');
            target.parents('.g-dialog').find('button').removeAttr('tabindex');
        }
    }

    //修改禁言时间按钮 5383以上版本 改成调用客户端接口 editGroupShutTime 回调 onEditGroupShutTimeChange
    function editShut(e) {
        nowShutTime = -1;
        //view.selectOneNav(4);
        selectUser = getSelected();
        if (G.version >= 5383) {
            var param = {
                uin: selectUser,
                setting: false
            }
            var ret = client.editGroupShutTime(JSON.stringify(param));
            //这里客户端调了...所以直接改结果..蛋痛.
            if (ret && ret.times) {
                nowShutTime = ret.times;
                for (var i = 0, l = selectUser.length; i < l; i++) {
                    $('.time' + selectUser[i]).text(getShutTime(nowShutTime));
                }

                //editShutStatus();
            }
        } else {
            var obj = {
                ico: false,
                tit: shutMsg.editshuttit
            }
            var msg = shutMsg.editshuttimeinfo+'';
            if (selectUser.length === 0) {
                return;
            } else {
                msg = msg.replace('%d', selectUser.length);
            }
            obj.msg = msg;
            obj.select = defMenu;
            showAlert(obj, function() {
                nowShutTime = defMenu[0].seconds;
                widget.transSelect($('#shutSelect'), function(val, name) {
                    nowShutTime = val;
                });
            });
        }
    }

    //取消禁言按钮
    function resetShut(e) {
        nowShutTime = -1;
        //view.selectOneNav(4);
        selectUser = getSelected();
        var obj = {
            ico: true,
            tit: shutMsg.editshuttit
        }
        var msg = shutMsg.cancelshutinfo;
        if (selectUser.length === 0) {
            return;
        }
        var nick = $('#shutList input:checked').eq(0).attr('data-nick'),
            uin = $('#shutList input:checked').eq(0).val();
        var str = nick + '（' + uin + '）'
        if (selectUser.length > 1) {
            str += shutMsg.cancelshutnum + selectUser.length + shutMsg.man;
        }
        msg += '';
        msg = msg.replace('%s', str);
        obj.msg = msg;
        nowShutTime = 0;
        if (G.version >= 5383) {
            var param = {
                uin: selectUser,
                cancel: true
            }
            var ret = client.editGroupShutTime(JSON.stringify(param));
            if (ret && ret.ret === 0) {
                // for(var i =0,l=selectUser.length;i<l;i++){
                //     $('#shuted'+selectUser[i]).remove();
                // }
                editShutStatus();
            }
        } else {
            showAlert(obj);
        }
    }

    //选择一个用户之后检查状态
    function clickUser(e) {
        var len = $("#shutList input:checked").length,
            len1 = $("#shutList ul").length;

        if (len) {
            btnList.prop('disabled', false);
        } else {
            btnList.prop('disabled', true);
        }
        if (len === len1) {
            $('#selectAllShut').prop('checked', true);
        } else {
            $('#selectAllShut').prop('checked', false);
        }
    }

    //开启或者关闭全员禁言按钮
    function shutAll(e) {
        //view.selectOneNav(4);
        var time = 0;
        if ($(e.target).prop('checked')) {
            time = 0xFFFFFFFF;
        }
        var obj = {
            ico: true,
            all: true,
        };
        if (time) {
            obj.tit = shutMsg.openallshuttitle;
            obj.msg = shutMsg.openallshutinfo;
        } else {
            obj.tit = shutMsg.closeallshuttitle;
            obj.msg = shutMsg.closeallshutinfo;
        }
        nowShutTime = time;
        if (!isAlert) {
            isAlert = true;
            if (time) {
                allShut = false;
            } else {
                allShut = true;
            }
        }

        if (G.version >= 5383) {
            //这里应该2个地方条件不一样..所以这里重新判断下.客户端参数是反的..囧....
            var flag = false;
            if (time) {
                flag = true;
            } else {
                flag = false;
            }
            var param = {
                setting: flag,
                allshut: true
            }
            var ret = client.editGroupShutTime(JSON.stringify(param));
            //换回来,去调cgi了.......这里客户端没调...所以又回来调cgi了...
            if (ret && ret.ret === 0) {
                editShutStatus();
            } else {
                closeWin();
            }
        } else {
            showAlert(obj);
        }
        return;
    }

    //提交禁言修改
    /*
ID: 455082    名称：设置页-设置全员禁言
ID: 455083    名称：设置页-取消全员禁言
ID: 455084    名称：设置页-取消禁言
ID: 455085    名称：设置页-修改禁言
*/
    function editShutStatus() {
        var param = {};
        if (!selectUser.length) {
            param.all_shutup = nowShutTime;

            var tdw = {};
            tdw = $.extend(tdw, G.tdw);
            tdw.action = 'set_allsilent';
            tdw.ver2 = parseInt(nowShutTime) ? 0 : 1;
            tdw.ver3 = G.role;
            G.tdwList.push(tdw);
            var mid = parseInt(nowShutTime) ? 455082 : 455083;
            G.monitor.push(mid);
        } else {
            var list = [];
            for (var i = 0, l = selectUser.length; i < l; i++) {
                list.push({
                    uin: parseInt(selectUser[i]),
                    t: parseInt(nowShutTime)
                });
            }
            var mid = parseInt(nowShutTime) ? 455085 : 455084;
            G.monitor.push(mid);
            param.shutup_list = JSON.stringify(list);
        }
        cgi.setShut(param, setShutHander, setShutHander);
        dialogDom.find('button.close').click();
    }

    //设置禁言成功的回调
    function setShutHander(data) {
        if (data.ec === 0) {
            var obj = {
                'groupid': G.groupUin,
                //'banspeechmem' : cl
            }
            var cl = [];
            var bigT = {
                'bigT': '0X800402D',
                'param1': '1',
                'param2': '2',
                'param3': G.role + '',
                'param4': 0,
                'param5': 0,
                'param6': 0,
                'param7': 0
            };
            //非全员
            if (selectUser.length) {
                if (nowShutTime) {
                    for (var i = 0, l = selectUser.length; i < l; i++) {
                        $('.time' + selectUser[i]).text(getShutTime(nowShutTime));
                        cl.push({
                            'uin': selectUser[i],
                            'timestamp': nowShutTime
                        });
                    }
                    //取消禁言了..
                } else {
                    for (var i = 0, l = selectUser.length; i < l; i++) {
                        $('#shuted' + selectUser[i]).remove();
                        cl.push({
                            'uin': selectUser[i],
                            'timestamp': nowShutTime
                        });
                    }
                    //shutDom.addClass('hide');
                }
                obj.shutup_list = cl;
                client.showGroupInMemBanSpeechMsg(JSON.stringify(obj));
                for (var i = 0, l = selectUser.length; i < l; i++) {
                    bigT.key = '{"groupuin":' + G.groupUin + ';"currenttime":' + new Date().getTime() + ';"banspeechtime";' + nowShutTime + ';"useruin":' + selectUser[i] + '}';
                    client.common.callHummer('Default.DataReportEx', JSON.stringify(bigT));
                }
            } else {
                obj.timestamp = nowShutTime;
                client.showGroupInAllBanSpeechMsg(JSON.stringify(obj));

                bigT.key = '{"groupuin":' + G.groupUin + ';"currenttime":' + new Date().getTime() + ';"banspeechtime";' + nowShutTime + ';"useruin":0}';
                client.common.callHummer('Default.DataReportEx', JSON.stringify(bigT));
            }
        } else {

            /*
            if(data.ec === 7){
                if(num){
                    Client.alert(1, '提示', '修改禁言时间失败，暂无此操作的权限');
                }else{
                    Client.alert(1, '提示', '解除禁言失败，暂无此操作的权限');
                }
            }else if(data.ec == 22){
                if(num){
                    Client.alert(1, '提示', '修改禁言时间失败，禁言人数已达最大上限');
                }else{
                    Client.alert(1, '提示', '解除禁言失败，禁言人数已达最大上限');
                }
            }else{
                if(num){
                    Client.alert(1, '提示', '修改禁言时间失败，请稍后再试');
                }else{
                    Client.alert(1, '提示', '解除禁言失败，请稍后再试');
                }
            }
            */

            //设置全员失败了...
            if (!selectUser.length) {
                var flag = nowShutTime ? true : false;
                allShutBtn.prop('checked', flag);
            }
        }
        selectUser = [];
        nowShutTime = -1;
    }


    //禁言事件绑定
    function bindEvent() {
        var task = {
            'shut.editTime': editShut, //修改禁言时间
            'shut.cancalShut': resetShut, //取消禁言
            'shut.shutAll': shutAll, //全部禁言
            'shut.editShut': editShutStatus, //修改禁言
            'shut.selectAllUser': selectAllUser, //选中所有用户
            'shut.clickUser': clickUser,
            'shut.closeWin': closeWin
        };

        //扩展全局的事件
        $.extend(G.task, task);
    }

    //成员禁言客户端通知
    var memberShutHandler = function(d) {
        var obj = JSON.parse(d);
        if (parseInt(G.groupUin) === parseInt(obj.groupid)) {
            if (parseInt(obj.timestamp)) {
                //修改已经存在的时间
                if (obj.uin) {
                    if ($('#shuted' + obj.uin).length) {
                        $('#shuted' + obj.uin + ' .time').html(getShutTime(obj.timestamp));
                    } else {
                        var list = [{
                            uin: obj.uin,
                            t: obj.timestamp,
                            nick: obj.nick
                        }];
                        var obj = {
                            list: list,
                            role: parseInt(G.role),
                            time: getShutTime
                        }
                        var html = tmpl(obj);
                        shutTarget.append(html);
                        $('#selectAllShut').prop('checked', false);
                    }
                    shutDom.removeClass('hide');
                    allShutDom.removeClass('top');
                } else {
                    allShutBtn.prop('checked', true);
                }
            } else {
                if (obj.uin) {
                    $("#shuted" + obj.uin).remove();
                    if ($('#shutList ul').length === 0) {
                        shutDom.addClass('hide');
                        allShutDom.addClass('top');
                    }
                } else {
                    allShutBtn.prop('checked', false);
                }
            }
        }
    }

    //事件通知
    var memberWebHandler = function(e, d) {
        //S.change = true;
    }

    //事件通知
    var groupWebHandler = function(e, d) {
        //S.change = true;
    }


    function init() {
        if (G.version < 5335 || !(G.role === '1' || G.role === '2')) {
            return;
        }

        var m = client.getBenMenu();
        if (m) {
            defMenu = m;
        }

        //显示禁言
        $('#shutSettingDl').removeClass('hide');

        shutTarget = $("#shutList");

        var param = {};
        if (change) {
            param.t = new Date().getTime();
        }
        //拉禁言列表
        cgi.getShut(param, sucHandler, errHandler);
        bindEvent();

        window.onMemberShut = memberShutHandler;
        window.onGroupShut = memberShutHandler;
    };

    return {
        init: init
    }
})();
},{"../../lib/config":3,"../../lib/widget":11,"./cgi":12,"./client":13,"./tmpl/dialog":21,"./tmpl/shut":23,"./view":25}],19:[function(require,module,exports){
var client = require('./client');
var cgi = require('./cgi');
var config = require('../../lib/config');
var util = require('../../lib/util');
/*
ID: 455078    名称：设置页-显示成员等级
ID: 455079    名称：设置页-点击编辑成员等级
ID: 455080    名称：设置页-显示成员标签
ID: 455081    名称：设置页-点击编辑成员标签
ID: 457142    名称：不显示成员等级
ID: 457143    名称：不显示成员标签

*/
module.exports = (function() {

    function bindEvent() {
        var task = {
            'tag.setGroupLevel': setGroup,
            'tag.setTag': setTag,
            'tag.editLevel': editLevel,
            'tag.editTag': editTag
        }
        $.extend(G.task, task);
    }

    //在聊天窗口中显示该群成员等级头衔
    function setGroup(e) {
        var target = $(e.target),
            flag = target.prop('checked') ? 1 : 0;
        var param = {
            levelflag: flag
        }
        var handler = function(data) {
            if (data.ec === 0) {
                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_rankname';
                tdw.ver2 = param.levelflag;

                var mid = param.levelflag ? 455078 : 457142;
                G.tdwList.push(tdw);
                G.monitor.push(mid);
            }
            //if(json.ec<201 || json.ec>204) MsgBox.showTips('系统繁忙,请稍后再试', {$focusElem:$share});
        }
        cgi.setGroup(param, handler, handler);
    }

    //是否显示标签
    function setTag(e) {
        var target = $(e.target),
            flag = target.prop('checked') ? 1 : 0;
        var param = {
            flag: flag
        }
        var handler = function(data) {
            if (data.ec === 0) {
                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_mbertag';
                tdw.ver2 = param.flag;


                var key = G.groupUin + '_tag';
                util.setCache(key, param.flag);

                G.tdwList.push(tdw);

                var mid = param.flag ? 455080 : 457143;
                G.monitor.push(mid);
            } else {

            }
        }
        cgi.setTag(param, handler, handler);
    }

    function editLevel(e) {
        var url = 'http://qinfo.clt.qq.com/qinfo_v3/grade.html?groupuin=' + G.groupUin;
        var params = {
            appId: 10001016,
            width: 635,
            height: 480,
            title: config.msg.tag.leveltitle,
            url: url,
            singletonId: 'group_member_level_' + G.groupUin
        };
        var obj = client.common.popNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);
        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.action = 'edit_rankname';
        G.monitor.push(455079);
        G.tdwList.push(tdw);
    }

    //打开编辑标签页.
    function editTag(e) {
        var url = 'http://qinfo.clt.qq.com/group_member_tags/index.html?groupuin=' + G.groupUin;
        var params = {
            appId: 10001016,
            width: 310,
            height: 340,
            title: config.msg.tag.tagtitle,
            url: url,
            singletonId: 'group_member_tags_' + G.groupUin
        };
        var obj = client.common.popNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);

        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.action = 'edit_mbertag';
        G.monitor.push(455081);
        G.tdwList.push(tdw);
    }

    function getTag() {
        var handler = function(data) {
            if (data.ec === 0) {
                $('#showMemberTag').prop('checked', data.flag);
            } else {

            }
        }
        cgi.getTag(handler, handler);
    }

    function init() {
        bindEvent();
        getTag();

        //小于5317版本不显示标签
        if (G.version < 5317) {
            $("#memberTagContent").hide();
        }
    };

    return {
        init: init
    }

})();

/*
module.exports  = {
        useVersionCtrl: true,
        openMemTagWin: function (groupuin) {
            var url = 'http://qinfo.clt.qq.com/group_member_tags/index.html?groupuin=' + groupuin;
            var params = {
                appId: 10001016,
                width: 310,
                height: 340,
                title: '群成员标签编辑',
                url: url,
                singletonId: 'group_member_tags_'+ groupuin
            };
            var obj = CommonApi.groupPopNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);
        },
        isVersionOk: function(){
            var curVersion = CommonApi.getVersion().version;   // 当前客户端版本
            var miniVersion = 5317;
            return !this.useVersionCtrl || curVersion>=miniVersion;
        }
    };
*/
},{"../../lib/config":3,"../../lib/util":9,"./cgi":12,"./client":13}],20:[function(require,module,exports){
'use strict;'
var _ = {};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};
var escapeRegexp = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
_.escape = function(string) {
    if (!string) return '';
    return String(string).replace(escapeRegexp, function(match) {
        return escapeMap[match];
    });
};
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

for(var i = 0,l=list.length;i<l;i++){
    var item = list[i];
;
__p += '\r\n\t<li class="manage-' +
((__t = (item.uin)) == null ? '' : __t) +
'">\r\n\t\t<input type="checkbox" class="manage-check manage' +
((__t = (item.uin)) == null ? '' : __t) +
'" value="' +
((__t = (item.uin)) == null ? '' : __t) +
'" ';
if(!item.oper){;
__p += 'checked';
};
__p += ' /> \r\n\t\t';
if((!show && !item.oper) || show){;
__p += '\r\n\t\t\t<i class="';
if(item.owner){;
__p += 'icon-master';
}else{;
__p += 'icon-manage';
};
__p += '"></i>\r\n\t\t\t<a class="manage-nick">' +
((__t = (item.nick)) == null ? '' : __t) +
'</a>\r\n\t\t\t';
if(item.owner){;
__p += '\r\n\t\t\t\t<span class="gray">（接收不提示消息）</span>\r\n\t\t\t';
}else{;
__p += '\r\n\t\t\t\t<span>（' +
((__t = (item.uin)) == null ? '' : __t) +
'）</span>\r\n\t\t\t';
};
__p += '\r\n\t\t';
};
__p += '\r\n\t</li>\r\n';
};


}
return __p
}
},{}],21:[function(require,module,exports){
'use strict;'
var _ = {};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};
var escapeRegexp = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
_.escape = function(string) {
    if (!string) return '';
    return String(string).replace(escapeRegexp, function(match) {
        return escapeMap[match];
    });
};
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '        <div class="hd" id="shutDialogTit">' +
__e(tit) +
'</div>\r\n        <div class="dialog-main">\r\n            <div class="alert-msg" id="shutDialogInfo">\r\n                ';
if(ico){;
__p += '\r\n                    <i class="alert"></i>\r\n                ';
};
__p += '\r\n                <span class="msg ';
if(!ico){;
__p += 'padding';
};
__p += '">\r\n                    ' +
((__t = (msg)) == null ? '' : __t) +
' \r\n                    ';
if(typeof select !== 'undefined'){;
__p += '\r\n                        <span class="select-wrapper">\r\n                            <select id="shutSelect" tabindex="0" data-action="shut.selectshuttime">\r\n                                ';

                                    for(var i=0,l=select.length;i<l;i++){
                                        var item = select[i];
                                ;
__p += '\r\n                                    <option value="' +
__e(item.seconds) +
'">' +
__e(item.text) +
'</option>\r\n                                ';
};
__p += '\r\n                            </select>                \r\n                        </span>    \r\n                    ';
};
__p += '\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class="footer">\r\n            <div>\r\n                <button class="btn" data-action="shut.editShut">确定</button>\r\n                <button class="btn" data-action="';
if(typeof all ==='undefined'){;
__p += 'view.closeWin';
}else{;
__p += 'shut.closeWin';
};
__p += '">取消</button>\r\n            </div>\r\n        </div> \r\n        <button class="close" data-action="';
if(typeof all ==='undefined'){;
__p += 'view.closeWin';
}else{;
__p += 'shut.closeWin';
};
__p += '" data-nologin="1">×</button> ';

}
return __p
}
},{}],22:[function(require,module,exports){
'use strict;'
var _ = {};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};
var escapeRegexp = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
_.escape = function(string) {
    if (!string) return '';
    return String(string).replace(escapeRegexp, function(match) {
        return escapeMap[match];
    });
};
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

for(var i = 0,l=tabs.length;i<l;i++){
    var item = tabs[i];
;
__p += '\r\n\t<li class="label">\r\n\t\t<input type="radio" value="' +
((__t = (item.id)) == null ? '' : __t) +
'" name="label" data-action="view.setLabel" id="cLabel';
+item.id;
__p += '" ';
if(item.id===sel_id){;
__p += 'checked';
};
__p += ' /><label for="cLabel' +
((__t = (item.id)) == null ? '' : __t) +
'">' +
__e(item.wording) +
'</label>\r\n\t\t';
if(item.is_new){;
__p += '\r\n\t\t\t<span class="is-new"></span>\r\n\t\t';
};
__p += '\r\n\t</li>\r\n';
};


}
return __p
}
},{}],23:[function(require,module,exports){
'use strict;'
var _ = {};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};
var escapeRegexp = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
_.escape = function(string) {
    if (!string) return '';
    return String(string).replace(escapeRegexp, function(match) {
        return escapeMap[match];
    });
};
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {


	for(var i = 0,l=list.length;i<l;i++){
		var item = list[i];
;
__p += '\r\n<ul id="shuted' +
((__t = (item.uin)) == null ? '' : __t) +
'">\r\n    <li class="input"><input ';
if(item.manager && role == '2'){;
__p += 'disabled';
}else{;
__p += 'class="shut-user"';
};
__p += ' type="checkbox" value="' +
((__t = (item.uin)) == null ? '' : __t) +
'" data-role="' +
((__t = (role)) == null ? '' : __t) +
'" data-action="shut.clickUser" data-nick="' +
((__t = (item.nick)) == null ? '' : __t) +
'" /></li>\r\n    <li class="name">' +
((__t = (item.nick)) == null ? '' : __t) +
'</li>\r\n    <li class="time time' +
((__t = (item.uin)) == null ? '' : __t) +
'">' +
((__t = (time(item.t))) == null ? '' : __t) +
'</li>\r\n</ul>\r\n';

	}
;


}
return __p
}
},{}],24:[function(require,module,exports){
'use strict';
//一些工具方法
//管理员接收加群验证消息
var cgi = require('./cgi');
var view = require('./view');
var tmpl = require('./tmpl/adminlist');

module.exports = (function() {

	var adminList = [],//管理员列表
		showOper = false,
		verifyBtn = $('#allowSettingVerifyMsg'),
		addBtn = $('#addAdminListBtn'),
		adminBlockDom = $('#adminListBlock'),
		manageDom = $('#manageList'),
		adminDom = $('#adminList');

	var adminStatus = {};

	//验证是否显示管理员列表
	function checkOper(){
		for(var i =0,l=adminList.length;i<l;i++){
			var item = adminList[i];
			if(!item.oper){
				showOper = true;
				return true;
			}
		}
		return false;
	}


	//生成请求参数 flag true 取消管理员接收加群验证 false 选择管理员
	/*
	ID: 455073    名称：设置页-设置管理员不接受加群消息
	ID: 455087    名称：设置页-取消设置管理员不接受加群消息
	*/
	function getAuthParam(flag){
		var admin = [],
			oper = [];

		var change = false;//是否有变化

		if(flag){
			for(var i =0,l=adminList.length;i<l;i++){
				var item = adminList[i];
				if(adminStatus[item.uin] !== 1){
					change = true;
					admin.push(item.uin);
					oper.push(1);					
				}
				//adminStatus[item.uin] = 1;
			}
		}else{
			var list = manageDom.find(".manage-check:checked");
			var ulist = [];
			list.each(function(e){
				ulist.push(parseInt($(this).val()));
			});
			for(var i =0,l=adminList.length;i<l;i++){
				var item = adminList[i];

				//选中的设置为0
				if($.inArray(item.uin,ulist)>=0){
					
					if(adminStatus[item.uin] !== 0){
						change = true;
						oper.push(0);
						admin.push(item.uin);
					}			
					//adminStatus[item.uin] = 0;
				}else{
					
					if(adminStatus[item.uin] !== 1){
						change = true;
						oper.push(1);
						admin.push(item.uin);
					}								
					//adminStatus[item.uin] = 1;
				}
				
			}			
		}
		//没有变化.不需要处理
		if(!change){
			return;
		}

		//console.log(admin,adminStatus);
		var param = {
			auth : G.role,
			admin : admin.join('|'),
			oper : oper.join('|')
		}		
		//设置管理员的回调
		var setAuthHander = function(data){
			if(data.ec === 0){
				for(var i= 0,l=admin.length;i<l;i++){
					adminStatus[admin[i]] = oper[i];
				}

				var tdw = {};
				tdw = $.extend(tdw,G.tdw);
				tdw.action = 'set_joinmsg';
				tdw.ver2 = 1
				//report.tdw(tdw);
				G.tdwList.push(tdw);
				G.monitor.push(455073);

				//成功了..更新列表
				var shownum = false;
				for(var i=0,l=adminList.length;i<l;i++){
					var item = adminList[i];
					item.oper = adminStatus[item.uin];
					//需要显示列表
					if(item.oper === 0){
						shownum = true;
					}else{
						$(".manage"+item.uin).prop('checked',false);
					}
				}
				if(shownum){
					var param = {
						show : false,
						list : adminList
					}
					var html = tmpl(param);
					adminDom.html(html);
					adminBlockDom.removeClass('hide');
					verifyBtn.prop('checked',true);
				}else{
					adminDom.html('');
					verifyBtn.prop('checked',false);
					adminBlockDom.addClass('hide');
				}
			}else{

				//失败了...重置adminStatus的状态
				for(var i=0,l=adminList.length;i<l;i++){
					var item = adminList[i];
					adminStatus[item.uin] = item.oper;
				}			
			}
		}
		cgi.setAuth(param,setAuthHander,setAuthHander);
	}

	function getAdminStatus(){
		for(var i=0,l=adminList.length;i<l;i++){
			var item = adminList[i];
			adminStatus[item.uin] = item.oper;
		}
	}

	//回调处理
	function sucHander(data){
		if(data.ec === 0){
			adminList = data.result;
			getAdminStatus();
			if(checkOper()){
				verifyBtn.prop('checked',true);
				adminBlockDom.removeClass('hide');
			}
			var param = {
				show : true,
				list : adminList
			}
			var param1 = {
				show : false,
				list : adminList
			}
			var html = tmpl(param);
			var html1 = tmpl(param1);
			manageDom.html(html);
			adminDom.html(html1);
		}
	}

	// 显示不接受加群tips的管理员列表
	function showAdmin(e){
		view.selectOneNav(1);
		var target = $(e.target);
		if(target.prop('checked')){
			adminBlockDom.removeClass('hide');
		}else{
			adminBlockDom.addClass('hide');
			getAuthParam(true);
		}
	}

	//勾选管理员不接收加群验证消息
	function addAdmin(e){
		var target = $(e.target);
		$('.master-select').removeClass('hide');
	}

	//确定选中管理员
	function selectMaster(){
		getAuthParam();
		$('.master-select').addClass('hide');
	}

	function bindEvent(){
		var task = {
			'verify.showAdmin' : showAdmin,
			'verify.addAdmin' : addAdmin,
			'verify.selectMaster' : selectMaster
		}
		$.extend(G.task,task);
	}

	function init(){
		var param = {
			auth : G.role
		}
		cgi.getAdminAuth(param,sucHander,sucHander);

		addBtn.prop('disabled',false);

		bindEvent();
	}

	return {
		init : init
	}
})();
},{"./cgi":12,"./tmpl/adminlist":20,"./view":25}],25:[function(require,module,exports){
'use strict';

var util = require('../../lib/util');
var widget = require('../../lib/widget');
var client = require('./client');
var cgi = require('./cgi');
var pic = require('./pic');
var phoneModule = require('./phone');
var groupEnter = require('./enter');
var tempDiscuss = require('./discuss');
var config = require('../../lib/config');
var vcode = require('../../lib/vcode');
var report = require('../../lib/report');
var labelTmpl = require('./tmpl/label');
var customLevelVersion = 5389; //什么版本可以显示自定义aio设置项目
var exitGroupVersion = 5449; //这个是5.8 显示退群
var qlVersion = 5445;
var msgVersion = 5461; //消息提示修改 这里临时改成个很大的值.

void 0;

module.exports = (function() {

    var navList = $("#navList a");
    var dList = $(".main dl");
    var bodyDom = $('body');
    var inputTime = 0;
    var alertTips = false; //提示消息
    var setJoinOpt = false; //设置项
    var beSetLabel = util.getCache('hadSetNewLabel') || {};
    var newLabelId; //当前群的被设置过的新设置项id


    //绑定事件
    function bindEvent() {
        var task = {
            'view.closeWin': closeWin,
            'view.navClick': navClick,
            'view.uploadFile': uploadFile,
            'view.setJoin': setJoin,
            'view.setMsgStatus': setMsgStatus,
            'view.setInvert': setInvert,
            'view.setQunVideo': setQunVideo,
            'view.setQunSearch': setQunSearch,
            'view.setAnswer': setAnswer,
            'view.setOpen': setOpen,
            'view.setGroup': setGroup,
            'view.setLabel': setLabel,
            'view.setAnonymous': setAnonymous, //匿名聊天
            'view.setFollow' : setFollow,
            'view.setPic' : pic.set,
            'view.exitGroup' : exitGroup,
            'view.enterMore' : groupEnter.more,
            'view.enterPay' : groupEnter.pay,
            'view.setQunPhone' : phoneModule.set,
            'view.setDiscuss' : tempDiscuss.setDiscuss,
            'view.setdisGroup' : tempDiscuss.setGroup
        }
        $.extend(G.task, task);
    }

    function exitGroup(){
        client.exitGroup(G.groupUin);
    }

    function checkAndSaveOption(param) {
        //{k: nowSaved.question,w: nowSaved.question+"|"+nowSaved.answer}
        var obj = {
            k: param.question,
            w: param.question + '|' + param.answer
        };
        var handler = function(data) {
            if (data.ec === 0) {
                var flag = false;
                for (var i = 0, l = data.sn.length; i < l; i++) {
                    if (data.sn[i] === 1) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    //client.common.alert(2,config.msg.tit.alert,config.msg.sensitive.setting);
                    alertTips = true;
                    return;
                }
                setJoinOpt = param;
                //var ret = client.setGroupMemberOptionEx(JSON.stringify(param));
            } else {

            }
        }
        cgi.checkKey(obj, handler, handler);
    }

    //回答问题输入框验证
    function checkSelectInput(e) {
        var target = $(e.target),
            val = target.val();
        if(!val){
            val += '';
        }
        if (val !== '') {
            $('#needQuestTips').addClass('hide');
        }
        var param = {
            option: 5,
            question: val.replace(/\\/g, "\\\\"),
            answer: ''
        }
        checkAndSaveOption(param);
    }

    //设置问题输入框验证
    function checkSelectInput2(e) {
        var target = $(e.target),
            val = target.val();

        if(!val){
            val += '';
        }
        if (val !== '') {
            $('#questionTips').addClass('hide');
        }
        var param = {
            option: 4,
            question: val.replace(/\\/g, "\\\\"),
            answer: $("#setAnswerInput").val().replace(/\\/g, "\\\\")
        }
        checkAndSaveOption(param);
    }

    //初始化Ui
    function resetUi(role) {
        //把下拉框替换成自定义的样式
        widget.transSelect($('#interval'), setMsgStatus);
        widget.transSelect($('#setQuestion'), function(value, name) {
            value += '';
            //{option: 5, question:$("#set-question").val().replace(/\\/g, "\\\\" ), answer:""};
            var param = {
                option: 5,
                question: value.replace(/\\/g, "\\\\"),
                answer: ''
            }
            checkAndSaveOption(param);
        }, {
            input: true,
            empty: true,
            checkfn: checkSelectInput,
            inputmax: 30
        });
        widget.transSelect($('#setQuestion2'), function(value, name) {
            value += '';
            setJoinOpt = {
                option: 4,
                question: value.replace(/\\/g, "\\\\"),
                answer: $("#setAnswerInput").val().replace(/\\/g, "\\\\")
            };
            checkAndSaveOption(setJoinOpt);
            $('#setAnswerInput').attr('data-value', value);
        }, {
            input: true,
            checkfn: checkSelectInput2,
            empty: true,
            inputmax: 30
        });

        $("#setAnswerInput").blur(function(e) {
            var target = $(e.target),
                val = target.val();
            if (val !== '') {
                $('#answerTips').addClass('hide');
            }
        });

        util.setMaxInput($('#setAnswerInput'), 30);

        //因为初始化需要时间.所以调整一下时序
        //群消息设置
        msgSetting();
        //群视频设置
        videoSetting();
        //加群设置
        joinGroup();
    }

    /*设置特别关注*/
    function setFollow(e){

    }

    //非群成员可以预览资料卡相册和共享
    /*
    ID: 455074    名称：设置页-访问权限-非群成员可以预览资料卡和相册
    */
    function setGroup(e) {
        var target = $(e.target),
            flag = target.prop('checked') ? 1 : 0;
        var param = {
            photoflag: flag
        }
        var handler = function(data) {
            if (data.ec === 0) {
                G.monitor.push(455074);

                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_nonmber_visit';
                tdw.ver2 = param.photoflag;

                G.tdwList.push(tdw);
            } else {

            }
        }
        cgi.setGroup(param, handler, handler);
    }

    //设置是否公开
    /*

    ID: 455075    名称：设置页-访问权限-非群成员不能进入
    ID: 455076    名称：设置页-访问权限-非群成员可以进入不能发言
    ID: 455077    名称：设置页-访问权限-非群成员可以进入能发言
    */
    function setOpen(e) {
        var target = $(e.target),
            val = target.val();
        var param = {};
        var mid;
        switch (val) {
            case '0': //不能进入
                param.open = 0;
                param.speak = 0;
                mid = 455075;
                break;
            case '1': //可以进入但不能发言
                param.open = 1;
                param.speak = 0;
                mid = 455076;
                break;
            case '2': //可以进入并可以发言
                param.open = 1;
                param.speak = 1;
                mid = 455077;
                break;
        }
        var handler = function(data) {
            if (data.ec === 0) {
                vcode.hide();

                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_nonmber_aio';
                tdw.ver2 = val;
                //report.tdw(tdw);

                G.monitor.push(mid);
                G.tdwList.push(tdw);

                //需要弹验证码
            } else if (data.ec === 201 || data.ec === 202) {
                var flag = data.ec === 201;
                vcode.show(flag, function(code, phone) {
                    if (flag) {
                        param.elevel = 2;
                        param.vc = code;
                    } else {
                        param.elevel = 4;
                        param.phone = phone;
                        param.smsvc = code;
                    }
                    cgi.setOpen(param, handler, handler);
                }, function() {
                    //console.log(2);
                });
            } else if (data.ec === 203) {
                vcode.showError(config.msg.vcode.err);
            } else if (data.ec === 204) {
                vcode.showError(config.msg.vcode.err);
            } else {
                vcode.showError(config.msg.vcode.sys);
            }
        }
        cgi.setOpen(param, handler, handler);
    }

    //设置问题答案
    function setAnswer(e) {
        //只处理blur
        if (e.type === 'click') {
            return;
        }
        clearTimeout(inputTime);
        var target = $(e.target),
            qustion = $("#setQuestionDd2 .select-span-text").val().replace(/\\/g, "\\\\"),
            val = target.val().replace(/\\/g, "\\\\");

        if ($.trim(val) === '') {
            return;
        }
        var param = {
            option: 4,
            question: qustion,
            answer: val
        }
        checkAndSaveOption(param);
        //延迟500ms提交设置
        //setTimeout(set,500);
    }

    function checkQuest() {
        //{k: nowSaved.question,w: nowSaved.question+"|"+nowSaved.answer}
    }

    //设置接收群消息的方式
    function setMsgStatus(e) {
        /*
        ID: 455060    名称：设置页-消息设置-自动弹消息
        ID: 455061    名称：设置页-消息设置-接收并提示消息
        ID: 455062    名称：设置页-消息设置-不提示消息只显示数目
        ID: 455063    名称：设置页-消息设置-临时屏蔽消息15分钟
        ID: 455064    名称：设置页-消息设置-临时屏蔽消息30分钟
        ID: 455065    名称：设置页-消息设置-临时屏蔽消息1小时
        ID: 455066    名称：设置页-消息设置-临时屏蔽消息4小时
        */
        var mcg = {
            1: 455061,
            2: 455060,
            3: 455062,
            6: 455063,
            7: 455064,
            8: 455065,
            9: 455066
        }
        if (typeof e === 'object') {
            var target = $(e.target),
                val = parseInt(target.val());
        } else {
            var val = parseInt(e);
        }
        if (val < 6) {
            $('#interval').prop('disabled', true);
            $('#intervalDD').addClass('disabled');
        }
        if (val === 10) {
            val = parseInt($("#interval").val());
            $('#intervalDD').removeClass('disabled').removeClass('disabled1');
            $('#interval').prop('disabled', false);
            //return;
        }
        //上报
        if (mcg[val]) {
            G.monitor.push(mcg[val]);
        }
        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.action = 'set_msgcue';
        tdw.ver2 = val;
        //report.tdw(tdw);
        G.tdwList.push(tdw);
        void 0;
        var ret = client.setGroupMsgOption(val);
    }


    function initLabel(obj) {
        //处理一下,如果这个newid已经选择过了.把is_new改成空0;
        for (var i = 0, l = obj.tabs.length; i < l; i++) {
            if (obj.tabs[i].is_new && obj.tabs[i].id === newLabelId) {
                obj.tabs[i].is_new = 0;
                //如果本地还没有记录带 new标签的id的话.这里记录一下.
            } else if (obj.tabs[i].is_new && obj.tabs[i].id !== newLabelId) {
                newLabelId = obj.tabs[i].id;
            }
        }
        var html = labelTmpl(obj);
        $("#costomLabelList").html(html);
    }

    //设置当前群aio
    function setLabel(e) {
        var target = $(e.target),
            id = target.val();

        var param = {
            tab_id: id
        }
        var handler = function(data) {
            if (data.ec === 0) {
                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.module = 'post';
                tdw.action = 'last_tab';
                tdw.ver1 = id;

                /*
                hadSetNewLabel = {
                    群号 : id
                }
                */
                if (parseInt(id) === newLabelId) {
                    beSetLabel[G.groupUin] = newLabelId;
                    util.setCache('hadSetNewLabel', beSetLabel);
                }
                //report.tdw(tdw);
                G.tdwList.push(tdw);
            } else {
                //系统繁忙,请稍后再试
                Client.alert(1, config.msg.tit.error, config.msg.defError);
            }
        }

        cgi.setLabel(param, handler)
        /*
        同时调下客户端接口.
        */
        client.setAio(parseInt(id));
    }

    //根据设置勾选显示项
    function changeAccess(obj) {
        if (obj.member == 0) return;
        //确定在拉到其他的配置之后再拉付费群相关的内容.
        groupEnter.init();
        tempDiscuss.init();

        /*把等级保存一下.在等级也就不用再另外拉了.*/
        var level = obj.levelname;
        var gradeCache = util.getCache('gradeLevel');
        if (!gradeCache) {
            gradeCache = {};
        }
        gradeCache[G.groupUin] = level;
        util.setCache('gradeLevel', gradeCache);

        var canAccess = $('#allowVisitorAccess'), //非群成员不能进入
            notAccess = $('#notAllowVisitorAccess'), //非群成员不能进入
            canChat = $("#allowVisitorChat"), //非群成员可以发言
            canSearch = $('#allowQunSearch'), //只能通过群号找到群
            canShare = $('#visitorShareAccess'), //非群成员可以预览资料卡相册和共享
            showLevel = $('#show-member-level'), //在聊天窗口中显示该群成员等级头衔
            visitorAuth = $('#visitor-info-access-title'), //访问权限
            shareBlock = $('#visitorInfoAccessContent'), //访问权限窗口
            canLevel = $('#showMemberLevel'), //允许成员等级
            levelBtn = $("#customLevelButton");

        $("#appAuthDl").removeClass('hide');

        if(G.version >= exitGroupVersion){
            $('#otherLabelDl').removeClass('hide');
        }

        if (G.role === "1") {
            $('section .disabled').removeClass('disabled');
            $('section input').prop('disabled', false);
            //$('section select').prop('disabled',false);
            //如果有自定义aio 并且客户端版本满足要求并且不是轻聊版本
            if(G.version %6 === 3 && G.version >= qlVersion){
                $('#costomLabelDl').remove();
            }else if (obj.aio_tabs && G.version >= customLevelVersion) {
                initLabel(obj.aio_tabs);
            }


            if(G.version >= exitGroupVersion){
                $('#exitThisGroup').text('解散该群');
            }
            // //显示应用权限
            // $("#appAuthDl").removeClass('hide');
            //允许所有人传文件
            if (!obj.file) {
                $("#canUploadAll").prop('checked', true);
            } else {
                $("#canUploadMaster").prop('checked', true);
            }
            //允许所有人传照片
            if (!obj.album) {
                $("#canPhotoAll").prop('checked', true);
            } else {
                $("#canPhotoMaster").prop('checked', true);
            }
        } else if (G.role === "2") {
            $('section .disabled').removeClass('disabled');
            $('section input').prop('disabled', false);
            $(".open-access-input").prop('disabled', true);
            //$('section select').prop('disabled',false);
            //管理员不能编辑群等级
            $('#member-level-content').remove();
            $("#memberTagContent span").addClass('no-padding');
            //管理员不能设置防骚扰选项
            //$('#qunHarassDl').hide();
            $("#appAuthDl input").prop('disabled', true);
            $('#qunHarassDl input').prop('disabled', true);

            //管理员不能设置加群消息
            $("#allowSettingVerifyMsg").prop('disabled', true);

            //允许所有人传文件
            $("#appAuthDl input").remove();
            $("#appAuthDl .can-hide").remove();
            var tips = $("#appAuthDl dd");
            if (!obj.file) {
                tips.eq(0).text(config.msg.view.canupload);
            } else {
                tips.eq(0).text(config.msg.view.notupload);
            }

            //允许所有人传照片
            if (!obj.album) {
                tips.eq(1).text(config.msg.view.canalbum);
            } else {
                tips.eq(1).text(config.msg.view.notalbum);
            }

        } else {
            //{"ec":0,"levelflag":1,"levelname":{"lvln1":"潜水","lvln2":"冒泡","lvln3":"吐槽","lvln4":"活跃","lvln5":"话唠","lvln6":"传说"},"member":1,"open":0,"owner":0,"search":0,"share":0,"speak":0,"sys_show":1}
            //$('section input').remove();

            $("#setShieldPic input").prop('disabled', false);

            $("#msgSettingDl .disabled").removeClass('.disabled');
            $('#msgSettingDl input').prop('disabled', false);

            $("#mobileMsgSettingDl .disabled").removeClass('.disabled');
            $('#mobileMsgSettingDl input').prop('disabled', false);            
            //$('#msgSettingDl select').prop('disabled',false);
            //删掉input和select等不需要显示给普通成员的内容
            //加群方式
            $("#joinGroupDl input").remove();
            $("#joinGroupDl select").remove();

            //加群验证
            $("#groupVerify").remove();

            //游客权限
            //$("#visitorDl input").remove();

            //不显示禁言
            $("#shutSettingDl").remove();

            //不显示成员设置
            $('#memberMsgDl').remove();
            //修改提示的文字

            //防骚扰
            $("#qunHarassDl input").remove();

            if (!obj.share) {
                $("#visitorShareAccessLabel").text(config.msg.view.notshare);
            }
            //允许非群成员访问并发言
            if (obj.open === 1 && obj.speak === 1) {
                $("#memberOpenShow").text(config.msg.view.visitoropen);
            } else if (obj.open === 1) {
                $("#memberOpenShow").text(config.msg.view.visitornotchat);
            } else {
                $("#memberOpenShow").text(config.msg.view.visitorclose);
            }

            $("#visitorInfoAccessContent").removeClass('disabled');
            $("#visitorDl dd.disabled").remove();
            $("#visitorDl input").remove();
            $("#visitorDl dd.visitor-tips").remove();
            $("#memberOpenShowBlock").removeClass('hide');

            $("#appAuthDl input").remove();
            $("#appAuthDl .can-hide").remove();
            var tips = $("#appAuthDl dd");

            //允许查找到群
            if (obj.search !== 1) {
                $('#allowQunSearchLabel').html(config.msg.view.cansearch);
            }

            //允许所有人传文件
            if (!obj.file) {
                tips.eq(0).text(config.msg.view.canupload);
            } else {
                tips.eq(0).text(config.msg.view.notupload);
            }

            //允许所有人传照片
            if (!obj.album) {
                tips.eq(1).text(config.msg.view.canalbum);
            } else {
                tips.eq(1).text(config.msg.view.notalbum);
            }

        }

        //公开并且游客能发言
        if (obj.open === 1 && obj.speak === 1) {
            canChat.prop('checked', true);
            //不能发言
        } else if (obj.open === 1) {
            canAccess.prop('checked', true);
            //不能访问
        } else {
            notAccess.prop('checked', true);
        }
        //只能通过群号查找
        if (obj.search === 1) {
            canSearch.prop('checked', true);
        }
        //游客可以查看共享和文件.
        if (obj.share === 1) {
            canShare.prop('checked', true);
        } else {
            canShare.prop('checked', false);
        }
        //显示成员等级
        if (obj.levelflag === 1) {
            canLevel.attr('checked', true);
        }

        var et = new Date().getTime();
        //7723,4,5
        var obj = {
            13: et - window.timeScope['pagestart'].start
        }

        report.isd2(7832, 62, 2, obj);
        //report.isd2(7723,4,10,obj);

        //report.isdPerf(7723,4,10,perf);
        // window.timeScope['pagestart'] = {
        //     'start' : new Date().getTime()
        // }
    }

    //和手机测保持消息一致
    function mobileMsg(opt){
        $("#msgSettingDl").addClass('hide');
        $("#mobileMsgSettingDl").removeClass('hide');
        
        switch (opt) {
            case 1:
                $('#mobileAuto').prop('checked', true).attr('data-def', 1);
                break;
            case 2:
                $('#groupNotips').prop('checked', true).attr('data-def', 1);
                break;
            case 3:
                $('#mobileShield').prop('checked', true).attr('data-def', 1);
                break;
            case 4:
                $('#receiveNotips').prop('checked', true).attr('data-def', 1);
                break;
        }
    }

    //消息设置的显示
    function msgSetting(option) {
        var opt = client.getGroupMsgOption(),
            intervals = {
                6: '15分钟',
                7: '30分钟',
                8: '1小时',
                9: '4小时'
            };
        var interval = $('#interval');

        //新版本和手Q保存统一
        if(G.version >= msgVersion){
            mobileMsg(opt);
        //老版本不变
        }else{
            switch (opt) {
                case 1:
                    $('#receiveShow').prop('checked', true).attr('data-def', 1);
                    $('#interval').prop('disabled', true);
                    break;
                case 2:
                    $('#autoPrompt').prop('checked', true).attr('data-def', 1);
                    $('#interval').prop('disabled', true);
                    break;
                case 3:
                    $('#receiveCount').prop('checked', true).attr('data-def', 1);
                    $('#interval').prop('disabled', true);
                    break;
                case 5:
                    $('#permShield').prop('checked', true).attr('data-def', 1);
                    $('#interval').prop('disabled', true);
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                    $('#tempShield').prop('checked', true).attr('data-def', 1);
                    $('#interval').prop('disabled', false);
                    $("#intervalDD").removeClass('disabled').removeClass('disabled1');
                    //因为时序的问题.稍微延迟一点点显示
                    setTimeout(function() {
                        $('#msgSettingDl .select-span-text').text(config.msg.intervals[opt]);
                    }, 50)
                    break;
            }            
        }
    }

    //视频的显示
    function videoSetting() {
        var flag = client.getGroupVideoOption();
        if (G.role === "1") {
            $('#videoShow').removeAttr('disabled');
        }
        if (G.role === '3' && !flag) {
            $("#allowVideoShowLabel").html(config.msg.view.notvideo);
        }

        $('#videoShow').prop('checked', flag);
    }

    //设置是否允许群视频
    /*
    ID: 455086    名称：设置页-允许群视频
    ID: 455088    名称：设置页-不允许群视频
    */
    function setQunVideo(e) {
        var target = $(e.target);
        if (e.target.nodeName.toLowerCase() !== 'input') {
            $(e.target).parent('input').click();
            return;
        };
        var flag = target.prop('checked') ? 1 : 0;
        var mid = flag ? 455086 : 455088;
        G.monitor.push(mid);
        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.action = 'set_grpvideo';
        tdw.ver2 = flag;
        //report.tdw(tdw);

        G.tdwList.push(tdw);
        client.setGroupVideoOption(flag);
    }


    //加群验证
    function joinGroup() {
        var joinOpt = client.getGroupMemberOption();
        void 0;
        //console.log(joinOpt,client.getGroupMemberInviteOption());
        if (G.role === '1' || G.role === '2') {
            $('.identity-verify-input').prop('disabled', false);
            //非管理 判断是否不允许加入
        } else if (!client.getGroupMemberInviteOption()) {
            $('#allowInviteLabel').html(config.msg.view.notjoin);
            //return;
        }

        //从客户端取设置失败了.
        if (joinOpt === null) {
            //上报
        }

        //校验是否运行加入
        var flag = client.getGroupMemberInviteOption() ? true : false;
        $('#allowInvite').prop('checked', flag);

        switch (joinOpt.option) {
            case 1: //允许任何人加入
                $('#allowAll').prop('checked', true).attr('data-def', 1).parents('.can-hide').removeClass('can-hide');
                break;
            case 2: //需要验证消息
                $('#needCheck').prop('checked', true).attr('data-def', 1).parents('.can-hide').removeClass('can-hide');
                break;
            case 3: // 不允许任何人加入
                $('#refuseAll').prop('checked', true).attr('data-def', 1).parents('.can-hide').removeClass('can-hide');
                break;
            case 4: //需要正确回答问题
                $('#needAnswer').prop('checked', true).attr('data-def', 1).parents('.can-hide').removeClass('can-hide');
                showQuestion(2, joinOpt);
                break;
            case 5: //需要回答问题并由管理员审核
                $('#needReply').prop('checked', true).attr('data-def', 1).parents('.can-hide').removeClass('can-hide');
                showQuestion(1, joinOpt);
                break;
            case 6:
                break;
        }
        if (G.role !== '1' && G.role !== '2') {
            $('#joinGroupDl dd.can-hide').remove();
            $('#joinGroupDl dd.indent').removeClass('indent');
        }
    }

    //设置是否允许成员邀请加入群
    /*
    ID: 455067    名称：设置页-允许成员邀请好友加群
    */
    function setInvert(e) {
        var target = $(e.target);
        var flag = target.prop('checked') ? 1 : 0;

        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.action = 'set_invite';
        tdw.ver2 = flag;
        //report.tdw(tdw);
        G.monitor.push(455067);
        G.tdwList.push(tdw);

        var ret = client.setGroupMemberInviteOption(flag);
    }

    //设置加群方式
    /*
    1 允许任何人
    2 需要验证
    5 需要回答问题并由管理员审核
    4 需要正确回答问题
    3 不允许加入
    ps : value要转成数字.

    ID: 455067    名称：设置页-允许成员邀请好友加群
    ID: 455068    名称：设置页-允许任何人加群
    ID: 455069    名称：设置页-需要验证
    ID: 455070    名称：设置页-需要回答问题
    ID: 455071    名称：设置页-需要正确回答问题
    ID: 455072    名称：设置页-不允许加入
    */
    function setJoin(e) {
        var target = $(e.target);
        var val = parseInt(target.val());
        var tdw = {};
        tdw = $.extend(tdw, G.tdw);
        tdw.action = 'set_joinmode';
        tdw.ver2 = val;
        //付费入群修改
        groupEnter.changeStatus(val);
        switch (val) {
            case 1:
                client.setGroupMemberOption(val);
                showQuestion(0);
                G.monitor.push(455068);
                //report.tdw(tdw);
                G.tdwList.push(tdw);
                break;
            case 2:
                client.setGroupMemberOption(val);
                showQuestion(0);
                //report.tdw(tdw);

                G.monitor.push(455069);
                G.tdwList.push(tdw);
                break;
            case 3:
                client.setGroupMemberOption(val);
                showQuestion(0);
                //report.tdw(tdw);

                G.monitor.push(455072);
                G.tdwList.push(tdw);
                break;
                //4,5需要调setGroupMemberOptionEx;
            case 4:
                showQuestion(2);
                var qv2 = $('#setQuestionDd2 .select-span-text').val(),
                    qa = $("#setAnswerInput").val();
                if(!qv2){
                    qv2 = '';
                }
                if(!qa){
                    qa = '';
                }
                setJoinOpt = {
                    option: 4,
                    question: qv2.replace(/\\/g, "\\\\"),
                    answer: qa.replace(/\\/g, "\\\\")
                }
                break;
            case 5:
                showQuestion(1);
                var qv = $('#setQuestionDd .select-span-text').val();
                if(!qv){
                    qv = '';
                }
                setJoinOpt = {
                    option: 5,
                    question: qv.replace(/\\/g, "\\\\"),
                    answer: ''
                }
                break;
        }
    }

    //显示问题设置
    function showQuestion(num, opt) {
        $('.set-question').addClass('hide');
        $('#setAnswer').addClass('hide');
        if (num) {
            $("#setQuestionDd" + num).removeClass('hide');
            if (opt) {
                $('#setQuestionDd' + num + ' .select-span-text').val(opt.question);
                if (opt.answer !== '') {
                    $("#setAnswerInput").val(opt.answer);
                }
            }
        } else {
            setJoinOpt = false;
            alertTips = false;
        }
        if (num === 2) {
            $('#setAnswer').removeClass('hide');
        }
    }

    //激活idx
    function selectOneNav(idx) {
        navList.removeClass('active').eq(idx).addClass('active');
    }

    //导航点击
    function navClick(e) {
            var t = $(e.target),
                idx = t.attr('idx');
            selectOneNav(idx);
            bodyDom.scrollTop(dList.eq(idx)[0].offsetTop);
        }
        //关闭浮动窗口
    function closeWin(e) {
        var target = $(e.target);
        target.parents('.g-dialog').addClass('hide');
    }

    //设置上传权限
    function uploadFile(e) {
        /*
        ID: 455091    名称：设置页-允许所有人上传
        ID: 455092    名称：设置页-只允许群主和管理员
        ID: 455093    名称：设置页-相册允许所有人上传
        ID: 455094    名称：设置页-相册只允许群主和管理员
        */
        var target = $(e.target),
            val = target.val() || target.attr('data-value'),
            name = target.attr('name') || target.prev('input').attr('name');
        var param = {};
        //设置文件
        if (name === 'set-upload-file') {
            param.file_r = val;
            //设置相册
        } else {
            param.album_r = val;
        }
        var handler = function(data) {
            if (data.ec === 0) {
                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                if (param.file_r) {
                    tdw.action = 'set_file';
                    tdw.ver2 = parseInt(val);
                    var mid = param.val ? 455092 : 455091;
                    G.monitor.push(mid);
                } else {
                    var mid = param.val ? 455094 : 455093;
                    tdw.action = 'set_album';
                    tdw.ver2 = parseInt(val);
                    G.monitor.push(mid);
                };
                G.tdwList.push(tdw);
                //report.tdw(tdw);
            } else {
                Client.alert(1, config.msg.tit.error, config.msg.defError);
            }
        }

        cgi.setUpload(param, handler, handler);
    }

    //设置是否只能通过群号查找
    /*
    monitor :
    ID: 455089    名称：设置页-只能通过群号查找
    ID: 455090    名称：设置页-不用通过群号查找
    */
    function setQunSearch(e) {
        var target = $(e.target);
        if (e.target.nodeName.toLowerCase() !== 'input') {
            $(e.target).parent('input').click();
            return;
        };
        var flag = target.prop('checked') ? 1 : 0;
        var handler = function(data) {
            if (data.ec === 0) {
                var mid = flag ? 455089 : 455090;
                G.monitor.push(mid);
                var tdw = {}
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_findnumber';
                tdw.ver2 = flag;
                G.tdwList.push(tdw);
            } else {
                Client.alert(1, config.msg.tit.error, config.msg.defError);
            }
        };
        cgi.setSearch({
            flag: flag
        }, handler, handler);
    }

    //匿名聊
    function anyinit() {
        var handler = function(data) {
            if (data.retcode === 0) {
                $('#allowAnonymousTalk').prop('checked', !!data.result.value);
                if (!(G.role === '1' || G.role === '2')) {
                    $('#anonymousTalkDl input').remove();
                    var lable = $('#anonymousTalkDl label');
                    //不允许

                    if (!data.result.value) {
                        lable.html(config.msg.view.notany);
                    }
                }
            }
        }
        cgi.getAnoy(handler, handler);
    }

    /*
    ID: 457144    名称：允许匿名聊天
    ID: 457145    名称：不允许匿名聊天
    */
    function setAnonymous() {
        var param = {
            value: $('#allowAnonymousTalk').prop('checked') ? 1 : 0
        }

        var handler = function(data) {
            if (data.retcode === 0) {
                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_anon';
                tdw.ver2 = param.value;
                var mid = param.value ? 457144 : 457145;
                G.monitor.push(mid);
                G.tdwList.push(tdw);
            } else {
                var flag = $('#allowAnonymousTalk').prop('checked');
                $('#allowAnonymousTalk').prop('checked', !flag);
            }
        }
        cgi.setAnoy(param, handler, handler);
    }

    //初始化
    function init() {
        pic.init();
        phoneModule.init();
        
        //给当前已经设置过的id赋值
        newLabelId = beSetLabel[G.groupUin]; // 当前的新设置项id

        if (G.version >= customLevelVersion && G.role === "1") {
            $('#costomLabelDl').removeClass('hide');
        }
        //事件绑定
        bindEvent();
        anyinit();
        //vcode初始化
        vcode.init({
            gc: G.groupUin
        });
    }

    function closeFn() {

        if (alertTips) {
            client.common.alert(2, config.msg.tit.alert, config.msg.sensitive.setting);
            alertTips = false;
            return 0;
        } else {

            if (setJoinOpt) {
                if (setJoinOpt.option === 4) {
                    if (!setJoinOpt.question || (setJoinOpt.question && setJoinOpt.question === '')) {
                        $("#questionTips").removeClass('hide');
                        return 0;
                    }
                    if ($.trim(setJoinOpt.answer).length == 0) {
                        $("#answerTips").removeClass('hide');
                        return 0;
                    }
                    G.monitor.push(455070);
                } else {
                    if (!setJoinOpt.question || (setJoinOpt.question && setJoinOpt.question === '')) {
                        $("#needQuestTips").removeClass('hide');
                        return 0
                    }
                    G.monitor.push(455071);
                }
                var tdw = {};
                tdw = $.extend(tdw, G.tdw);
                tdw.action = 'set_joinmode';
                tdw.ver2 = setJoinOpt.option;
                //report.tdw(tdw);
                G.tdwList.push(tdw);
                var ret = client.setGroupMemberOptionEx(JSON.stringify(setJoinOpt));
                void 0;
                setJoinOpt = false;

            }
            //5个一组上报
            if (G.tdwList.length && G.tdwList.length > 5) {
                var l = Math.ceil(G.tdwList.length / 5);
                for (var i = 0; i < l; i++) {
                    var list = G.tdwList.slice(i * 5, (i + 1) * 5);
                    report.tdw(list);
                }
            } else {
                report.tdw(G.tdwList);
            }
            G.tdwList = [];

            // if(G.tdwList.length){
            //     report.tdw(G.tdwList);
            //     G.tdwList = [];
            // }
            /*
            ID: 455070    名称：设置页-需要回答问题
            ID: 455071    名称：设置页-需要正确回答问题
            */
            if (G.monitor.length) {
                report.monitor(G.monitor, true);
                G.monitor = [];
            }

        }
        return 1;
    }

    //1切页卡 0 不切页卡
    window.onCancel = closeFn;
    window.onWindowClose = closeFn;

    return {
        resetUi: resetUi,
        changeAccess: changeAccess,
        msgSetting: msgSetting,
        //videoSetting : videoSetting,
        //joinGroup : joinGroup,
        selectOneNav: selectOneNav,
        init: init
    }

})();
},{"../../lib/config":3,"../../lib/report":5,"../../lib/util":9,"../../lib/vcode":10,"../../lib/widget":11,"./cgi":12,"./client":13,"./discuss":14,"./enter":15,"./phone":16,"./pic":17,"./tmpl/label":22}]},{},[1]);
