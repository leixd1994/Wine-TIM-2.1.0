(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var report = require('../lib/report'),
    config = require('../lib/config'),
    util = require('../lib/util'),
    client = require('../module/member/client'),
    card = require('../module/member/card'),
    listData = require('../module/member/list-data'),
    listHtml = require('../module/member/list-html'),
    tmplMemberThead = require('../module/member/tmpl/member-thead'),
    tmplListBox = require('../module/member/tmpl/member-list-box'),
    tmplListOne = require('../module/member/tmpl/member-list-one'),
    tmplOfficeListOne = require('../module/member/tmpl/office-member-list-one');

var exitGroupVersion = 5449;//退出群功能显示的版本.

//全局变量
var G = {};
G.selfUin = client.getSelfUin(); //自己的qq
G.role = "" + (client.getSelfIdentity() || util.getParameter("role"));
G.selfIndentity = client.getSelfIdentity(); //自己在群中的身份权限
G.gc = util.getParameter("groupuin") || client.getGroupUin(); //群号
G.ver = util.getParameter("ver") || client.getMemberHtmlVer(); //1旧版本 2群通讯录版本
G.officemode = (G.ver == "2") && (util.getParameter("officemode") || client.getOfficeMode()); //群通讯录模式
G.version = client.getVersion().version; //客户端版本号
G.classHomeSchool = 32; //家校模式
//代码过滤
G.codeFilter = function(string) {
    return string.replace(new RegExp("<", "gm"), "[").replace(new RegExp(">", "gm"), "]");
};

G.memberData = {
    itemsload: false,
    labelload: false,
    labelflagload: false,
    groupload: false,
    face: {},
    status: {
        1: '老师',
        2: '家长',
        3: '学生'
    }
};
//labelChange:默认标签下拉列表生成时同步生成的，如果用户进行了标签管理让标签组发生变化，那么该变量置为true
//labelChange=true状态下，所有的修改标签下拉菜单将使用动态生成菜单，不再使用初始时生成的菜单。
G.memberData.labelChange = false;
G.memberData.isListViewLoad = false; //正在加载list数据，避免用户不断点击排序造成不断重复渲染
G.memberData.blackMod = false; //是否处在不良记录列表模式
window.G = G;


//数据上报
G.tdw = {
    'module': 'mber_list',
    'uin': G.selfUin
};
G.monitor = [470273];
//成员类所有操作事件监听
G.eventListener = function(tag, eventName) {
    //在线判断
    if (!client.online()) {
        client.alert(config.msg.tit.alert, config.msg.offline);
        return false;
    } else {
        //上报
        var temp = tag + "|" + eventName;
        var tdw = $.extend({}, G.tdw),
            tdw1 = false;
        var _monitor = 0;
        switch (temp) {
            case "editNick-toolbarBtn|click": //工具栏名片修改
                tdw.action = "Clk_modify";
                tdw.ver2 = 0;
                _monitor = 474437;
                //report.monitor([474437], true);
                break;
            case "editNick-listButton|click": //列表hover点击名片修改
                tdw.action = "Clk_modify";
                tdw.ver2 = 2;
                break;
            case "adminNumHelp-toolbarBtn|click": //点击查看管理员数量详情
                tdw.action = "Clk_seemana";
                break;
            case "setAdmin-listButton|click": //点击设置管理员
                tdw.action = "Clk_setmana";
                break;
            case "offSetAdmin-listButton|click": //点击取消设置管理员
                tdw.action = "Clk_unmana";
                break;
            case "listUserInfo-listButton|click": //点击查看资料
                tdw.action = "see_persondata";
                break;
            case "delUser-listbutton|click": //点击删除成员
                tdw.action = "Clk_delmber";
                break;
            case "contentMenuOne-send|select": //右键菜单发送消息
                tdw.action = "right_sendmsg";
                break;
            case "contentMenuOne-view|select": //右键菜单查看资料
                tdw.action = "right_seedata";
                break;
            case "contentMenuOne-add|select": //右键菜单加为好友
                tdw.action = "right_addfriend";
                break;
            case "contentMenuOne-modify|select": //右键菜单修改名片
                //右键上报有两个上报口，先提交一个

                // report.tdw($.extend({
                //     action: "Clk_modify",
                //     ver2: 1
                // }, G.tdw));
                tdw1 = $.extend({
                    action: "Clk_modify",
                    ver2: 1
                }, G.tdw);
                //再提交一个
                tdw.action = "right_modifyname";

                break;
            case "contentMenuOne-shield|select": //右键菜单屏蔽此人
                tdw.action = "right_screensb";
                break;
            case "contentMenuOne-jubao|select": //右键菜单举报此人
                tdw.action = "right_report";
                break;
            case "adminManageLog-toolbarBtn|click": //点击管理记录
                tdw.action = "Clk_manaplay";
                _monitor = 474427;
                //report.monitor([474427], true);
                break;
            case "advManage-toolbarBtn|click": //点击高级管理
                tdw.action = "Clk_highmana";
                report.monitor([474436], true);
                break;
            case "moreoptions-toolbarBtn|click": //点击高级管理
                break;
            case "levelHelp-theadList|click": //点击等级规则
                tdw.action = "Clk_rankrule";
                break;
            case "editLevel-theadList|click": //点击设置群成员等级
                tdw.action = "Clk_setrank";
                break;
            case "editLabel-theadList|click": //点击设置群成员标签
                tdw.action = "Clk_settag";
                break;
            case "urlSkipToEditNick-input|autoFocus": //url进来修改名片
                tdw.action = "Clk_modify";
                tdw.ver2 = 4;
                break;
            case "tabSkipToEditNick-input|autoFocus": //tab切换进来修改名片
                tdw.action = "Clk_modify";
                tdw.ver2 = 4;
                break;
            case "blackuser-toolbarBtn|click": //点击不良成员记录
                _monitor = 474426;
                //report.monitor([474426], true);
                break;
        }

        setTimeout(function() {
            report.tdw(tdw);
            report.monitor([_monitor], true);
            if (tdw1) {
                report.tdw(tdw1);
            }
        }, 3000);
        return true;
    }
};
//页面曝光上报
var tdw = {};
var memuin = util.getParameter("memuin"),
    enableedit = util.getParameter("enableedit");
if (memuin != "0" && enableedit == "1") { //编辑名片
    //成员页面曝光
    tdw = $.extend({
        action: "exp",
        ver2: 1
    }, G.tdw);
} else {
    //成员页面曝光
    tdw = $.extend({
        action: "exp",
        ver2: 2
    }, G.tdw);
}
window.addEventListener('load', function() {
    setTimeout(function() {
        report.monitor(G.monitor);
        report.tdw(tdw);
    }, 3000);
}, false);

//客户端数据
window.timeScope.clientMemberDataReadyStart = new Date().getTime() //准备拉取客户端成员数据;
G._memberData = {
    items: [],
    office_items: []
};
var changeMode = function() {
    $("#member-tbody").empty();
    $("#member-thead").empty();

    listData.init();
}
G.changeMode = changeMode;
var userlist = client.getAllMember(),
    memberBox = $("#member-tbody");
if (userlist) {
    var li = "",
        html = "",
        i = 0,
        len = userlist.length;
    memberBox.empty();
    for (; i < len; i++) {
        var qq = userlist[i];
        if (G.officemode == "0") {
            var d = client.getMemberInfo(qq);
            if (d) {
                var card = G.codeFilter(d["cardName"]) || "",
                    levelname = (d["levelLable"]) || "",
                    nick = G.codeFilter(d["nickName"]) || "",
                    point = (d["levelPoint"]) || ""
                G._memberData.items.push({
                    card: card,
                    levelname: levelname,
                    nick: nick,
                    point: point,
                    qq: qq,
                    times: "-"
                });;
            } else { //客户端获取失败
                G._memberData.items.push({
                    card: "",
                    levelname: "",
                    nick: "",
                    point: "",
                    qq: qq,
                    times: "-"
                });
            }
        } else {
            var d = client.getMemberOfficeInfo(qq);
            if (d) {
                var card = G.codeFilter(d["cardName"]) || "",
                    nick = G.codeFilter(d["nickName"]) || "",
                    tel = G.codeFilter(d["tel"]) || "",
                    position = G.codeFilter(d["position"]) || "",
                    gender = G.codeFilter(d["gender"]) || "";
                G._memberData.office_items.push({
                    nick: nick,
                    card: card,
                    tel: tel,
                    position: position,
                    gender: gender,
                    qq: qq,
                    times: "-"
                });
            } else { //客户端获取失败
                G._memberData.office_items.push({
                    card: "",
                    nick: "",
                    tel: "",
                    position: "",
                    gender: "",
                    qq: qq,
                    times: "-"
                });
            }
        }
        //数据组装
        if (i < 20) { //渲染前20条和自己
            if (G.officemode == "0") {
                li = tmplListBox({
                    qq: qq,
                    i: i,
                    cgiready: "ready",
                    listOne: tmplListOne({
                        i: i,
                        data: G._memberData,
                        version : exitGroupVersion,
                        util: util,
                        client: client
                    })
                });
            } else {

                li = tmplListBox({
                    qq: qq,
                    i: i,
                    cgiready: "ready",
                    listOne: tmplOfficeListOne({
                        i: i,
                        data: G._memberData,
                        util: util,
                        client: client
                    })
                });
            }
            memberBox.append(li);
        } else {
            html += tmplListBox({
                qq: qq,
                i: i,
                cgiready: "unready",
                listOne: ""
            });
        }
    }
    //数据填充
    memberBox.append(html);
    //列表更新
    listHtml.listUpdate();
    delete G._memberData;
} else {
    G.monitor.push(468408);
}
window.timeScope.clientMemberDataReadyEnd = new Date().getTime() //客户端成员数据加载完毕;

//数据加载
listData.init();
//html事件初始化
listHtml.init();

//删除成员
window.onCallback_MarkCreditAndDelUser = function(result, error, member) {
    if (result == 0) {
        var li = $("#list-" + member),
            i = li.data("i"),
            isAdmin = (li.data("indentity") == "admin") ? true : false;
        li.parent().remove();
        if (isAdmin) {
            var adminCount = $("#admin-count");
            //旧代码用途未知，暂时注释
            //window.postMessage( JSON.stringify({'event': 'OnAdminChange', 'from':'Home'}), '*');
            adminCount.html(parseInt(adminCount.html()) - 1);
        }
        G.memberData.items.splice(i, 1);
        //旧代码用途未知，暂时注释
        //window.postMessage(JSON.stringify({from: 'Member', event: 'OnMemberNumChange', curMemberNum: G.memberData.items.length}), "http://qinfo.clt.qq.com");
        //删除操作请重载tbody，否则滚动条下拉加载时计算加载条目会因为删除了的条目导致index下标不准确
        listHtml.loadTbody(true);
        //上报
        tdw = $.extend({
            action: "suc_delmber",
        }, G.tdw);
        report.tdw(tdw);
    } else if (result === 2) {
        client.alert(config.msg.tit.alert, error);
    } else {
        client.alert(config.msg.tit.alert, config.msg.delUser.error);
    }
}

//禁言通知事件(外部禁言客户端接口)
function shutHandler(d) {
    var obj = JSON.parse(d);
    //console.log(obj.d);
    if (parseInt(G.groupUin) === parseInt(obj.groupid)) {
        //被禁言
        var dom = $('#list-"' + obj.uin + '"] .time');
        if (parseInt(obj.timestamp)) {
            if (!G.memberData.shutup_list) {
                G.memberData.shutup_list = {};
            }
            G.memberData.shutup_list[obj.uin] = obj.timestamp;
            dom.text(config.msg.shut.howtimetocancelshut.replace("%s", util.getShutTime(obj.timestamp))); //多少时间后解禁
        } else { //被取消禁言
            var userObj = getUinTime(obj.uin);
            dom.text(userObj.times);
            delete G.memberData.shutup_list[obj.uin];
        }
    }
}
window.onMemberShut = shutHandler;
window.onGroupShut = shutHandler;

window["onTabChanged"] = function(json) {
    //console.log(json);
    var data = JSON.parse(json);
    if (data.enableedit == '1') {
        listHtml.isEditCard(data.memuin);
    } else {
        listHtml.lastTimeMsg(data.memuin);
    }
};

//storage事件通知
window.addEventListener('storage', function(storage) {
    //console.log(storage);
    //等级编辑
    if (storage.key == "gp-personal-level-list") {
        G.memberData.levelname = JSON.parse(storage.newValue);
        listHtml.loadTbody(true);
    }
    //编辑标签
    //console.log(storage.key==G.gc+"tags");
    if (storage.key == G.gc + "tags") {
        G.memberData.labelChange = true;
        var newValue = JSON.parse(storage.newValue);
        G.memberData.tag_info = newValue;
        for (var key in G.memberData.labelid) {
            if (G.memberData.label[key] != newValue[G.memberData.labelid[key]]) {
                G.memberData.label[key] = newValue[G.memberData.labelid[key]];
                if ($("#list-" + key).size() > 0) {
                    $("#list-" + key).find('[data-label-txt]').html(G.memberData.label[key]);
                }
            }
        }
    }
    //设置是否显示标签
    if (storage.key == G.gc + "_tag") {
        G.memberData.labelflag = storage.newValue;
        G.memberData.labelChange = true;
        //cgi拉取
        listData.label();
        //表头填充
        listHtml.loadThead();
        //列表填充
        listHtml.loadTbody(true);
    }
}, false);
},{"../lib/config":3,"../lib/report":4,"../lib/util":6,"../module/member/card":7,"../module/member/client":9,"../module/member/list-data":12,"../module/member/list-html":13,"../module/member/tmpl/member-list-box":19,"../module/member/tmpl/member-list-one":20,"../module/member/tmpl/member-thead":21,"../module/member/tmpl/office-member-list-one":22}],2:[function(require,module,exports){
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
},{"./callClient":2,"./util":6}],5:[function(require,module,exports){
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
},{"./report":4,"./util":6}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
'use strict';

var util = require('../../lib/util.js'),
    client = require('./client'),
    cgi = require('./cgi');


module.exports = (function() {

    //设置群名片
    var set = function(uin) {
        var nickInput = $("#nick-input-" + uin),
            nickTxt = $("#nick-txt-" + uin);
        nickTxt.hide();
        var i = $('#list-' + uin).data("i");
        try {
            //input为空事会引发select错误
            nickInput.show().focus()[0].select();
        } catch (e) {}
        nickInput.data("value", nickInput.val());
        nickInput.one("blur", function(e) {
            var _self = $(this);
            if (_self.val() == _self.data("value")) {
                _self.hide();
                nickTxt.show();
                return;
            }
            var val = _self.val();
            val = util.getSubstring(val, 60, 3);
            cgi.setCard({
                u: uin,
                name: val
            }, function(d) {
                cgi.cgiSuccess(d, "editCard");
                if (d.ec == 0) {
                    G.memberData.items[i].card = val;
                    nickTxt.html(G.codeFilter(val));
                    _self.hide();
                    nickTxt.show();
                } else {
                    cgi.postErr(d);
                    _self.hide();
                    nickTxt.show();
                }
            }, cgi.postErr);
        });
    };

    function decode(s) {
        return s
            .replace(/&amp;/g, '&')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, '\'')
            .replace(/&nbsp;/g, ' ')
            .replace(/<br>/g, '\n');
    };
    var setOffice = function(uin) {
        var i = $('#list-' + uin).data("i");

        //> 名片
        var cardInput = $("#office_card-input-" + uin),
            cardTxt = $("#office_card-txt-" + uin);
        cardTxt.hide();
        cardInput.val(G.codeFilter(decode(G.memberData.office_items[i].card)));
        try {
            //input为空时会引发select错误
            cardInput.show().focus()[0].select();
        } catch (e) {}

        //> 电话
        var telInput = $("#office_tel-input-" + uin),
            telTxt = $("#office_tel-txt-" + uin);
        telTxt.hide();
        telInput.val(G.codeFilter(decode(G.memberData.office_items[i].tel)));
        try {
            telInput.show();
        } catch (e) {}

        //> 职位
        var positionInput = $("#office_position-input-" + uin),
            positionTxt = $("#office_position-txt-" + uin);
        positionTxt.hide();
        positionInput.val(G.codeFilter(decode(G.memberData.office_items[i].position)));
        try {
            positionInput.show();
        } catch (e) {}

        //> 性别
        var genderInput = $("#office_gender-input-" + uin),
            genderTxt = $("#office_gender-txt-" + uin);
        genderTxt.hide();
        genderInput.val(G.codeFilter(decode(G.memberData.office_items[i].gender == 1 ? "女" : G.memberData.office_items[i].gender == 2 ? "男" : "-")));
        try {
            genderInput.show();
        } catch (e) {}

        var editfunc = function(e) {
            var clickid = e.target.id;
            var uin = e.data.edituin;
            var card = "office_card-input-" + uin,
                tel = "office_tel-input-" + uin,
                position = "office_position-input-" + uin,
                gender = "office_gender-input-" + uin;
            if (clickid == card || clickid == tel || clickid == position || clickid == gender) {
                $(document).one("mousedown", {
                    edituin: e.data.edituin,
                    editfunc: e.data.editfunc
                }, e.data.editfunc);
            } else {
                var cardTxt = $("#office_card-txt-" + uin),
                    telTxt = $("#office_tel-txt-" + uin),
                    positionTxt = $("#office_position-txt-" + uin),
                    genderTxt = $("#office_gender-txt-" + uin);

                var cardInput = $("#" + card),
                    telInput = $("#" + tel),
                    positionInput = $("#" + position),
                    genderInput = $("#" + gender);

                var item = {};
                item.u = uin;
                var i = $('#list-' + uin).data("i");

                var cardChanged = G.codeFilter(cardInput.val());
                var cardOlded = cardInput.data("value");
                if (cardChanged == cardOlded && cardChanged.length == cardOlded.length) {} else {
                    item.name = util.getSubstring(cardChanged, 60, 3);
                    cardTxt.html(G.codeFilter(item.name.length == 0 ? G.memberData.office_items[i].nick : item.name));
                }
                cardInput.val("");
                cardInput.hide();
                cardTxt.show();

                var telChanged = G.codeFilter(telInput.val());
                var telOlded = telInput.data("value");
                if (telChanged == telOlded && telChanged.length == telOlded.length) {} else {
                    item.phone = util.getSubstring(telChanged, 20, 3);
                    telTxt.html(G.codeFilter(item.phone));
                }
                telInput.val("");
                telInput.hide();
                telTxt.show();

                var positionChanged = G.codeFilter(positionInput.val());
                var positionOlded = positionInput.data("value");
                if (positionChanged == positionOlded && positionChanged.length == positionOlded.length) {} else {
                    item.job = util.getSubstring(positionChanged, 60, 3);
                    positionTxt.html(G.codeFilter(item.job));
                }
                positionInput.val("");
                positionInput.hide();
                positionTxt.show();

                var genderChanged = G.codeFilter(genderInput.val());
                var genderOlded = genderInput.data("value");
                if (genderChanged == genderOlded && genderChanged.length == genderOlded.length) {} else {
                    if (genderChanged == "男" || genderChanged == "女") {
                        var gender = util.getSubstring(genderChanged, 3, 3);
                        item.gender = gender == "女" ? 1 : gender == "男" ? 2 : 0;
                    } else {
                        item.gender = 0;
                    }
                    genderTxt.html(G.codeFilter(item.gender == 1 ? "女" : item.gender == 2 ? "男" : "-"));
                }
                genderInput.val("");
                genderInput.hide();
                genderTxt.show();

                cgi.setOfficeCard(item, function(d) {
                    if (d.ec == 0) {
                        //> 成功情况下记录数据
                        var divitem = $('#list-' + uin);
                        if (item.name === undefined) {} else {
                            G.memberData.office_items[i].card = item.name;
                            divitem.data("card", item.name);
                        }
                        if (item.phone === undefined) {} else {
                            G.memberData.office_items[i].tel = item.phone;
                        }
                        if (item.job === undefined) {} else {
                            G.memberData.office_items[i].position = item.job;
                        }
                        if (item.gender === undefined) {} else {
                            G.memberData.office_items[i].gender = item.gender;
                        }
                    } else {
                        cardTxt.html(G.codeFilter(G.memberData.office_items[i].card.length == 0 ? G.memberData.office_items[i].nick : G.memberData.office_items[i].card));
                        telTxt.html(G.codeFilter(G.memberData.office_items[i].tel));
                        positionTxt.html(G.codeFilter(G.memberData.office_items[i].position));
                        genderTxt.html(G.codeFilter(G.memberData.office_items[i].gender == 1 ? "女" : G.memberData.office_items[i].gender == 2 ? "男" : "-"));
                    }
                }, function(d) {
                    //> 失败情况下回退
                    cardTxt.html(G.codeFilter(G.memberData.office_items[i].card.length == 0 ? G.memberData.office_items[i].nick : G.memberData.office_items[i].card));
                    telTxt.html(G.codeFilter(G.memberData.office_items[i].tel));
                    positionTxt.html(G.codeFilter(G.memberData.office_items[i].position));
                    genderTxt.html(G.codeFilter(G.memberData.office_items[i].gender == 1 ? "女" : G.memberData.office_items[i].gender == 2 ? "男" : "-"));
                    cgi.postErr(d);
                });
            }
        };
        $(document).one("mousedown", {
            edituin: uin,
            editfunc: editfunc
        }, editfunc);
    };
    var toolbarEditBtn = function() {
        //修改群名片
        $("#edit-nick").on("click", function(e) {
            if (!G.eventListener("editNick-toolbarBtn", "click")) {
                return false;
            }
            if (G.officemode == "1") {
                setOffice(G.selfUin);
            } else {
                set(G.selfUin);
            }
            return false;
        });
    };

    //修改群名片
    var enterSubmit = function(e) {
        if (e.keyCode == 13) {
            if (!G.eventListener("editNick-listInput", "keydown[13]")) {
                return false;
            }
            $(this).blur();
        }
    };
    var keydownToSubimt = function() {
        $('[name="nick-input"]').off("keydown", enterSubmit).on("keydown", enterSubmit);
        $('[name="nick-input"]').each(function() {
            util.setMaxInput($(this));
        });
        //util.setMaxInput($('[name="nick-input"]'));
    };

    //修改群名片
    var listEditBtn = function() {
        $("#member-tbody").on("click", '[data-card="edit"]', function(e) {
            if (!G.eventListener("editNick-listButton", "click")) {
                return false;
            }
            if (G.officemode == "0")
                set($(this).data("qq"));
            else
                setOffice($(this).data("qq"));
            return false;
        });
    };

    return {
        set: set,
        setOffice: setOffice,
        toolbarEditBtn: toolbarEditBtn,
        keydownToSubimt: keydownToSubimt,
        listEditBtn: listEditBtn
    };

})();
},{"../../lib/util.js":6,"./cgi":8,"./client":9}],8:[function(require,module,exports){
'use strict';

var report = require("../../lib/report"),
    config = require('../../lib/config'),
    request = require('../../lib/request'),
    client = require('./client'),
    memberUtil = require('./util');

module.exports = (function() {

    //设置群名片
    function setCard(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.post('/cgi-bin/qun_info/set_group_card', param, cb, error);
    };

    function setOfficeCard(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.post('/cgi-bin/qun_office/set_group_contacts', param, cb, error);
    };

    //获取成员列表
    function getMembers(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
            // param.n = 20;
            // param.p = 1;
        }
        request.get('/cgi-bin/qun_info/get_group_members_new', param, cb, error);
    };

    function getOfficeMembers(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
            // param.n = 20;
            // param.p = 1;
        }
        request.get('/cgi-bin/qun_office/get_group_contacts', param, cb, error);
    };

    //cgi wiki:http://tapd.oa.com/im_application_3/markdown_wikis/view/#1010091981004953207
    function setStatus(param, cb, error) {
        if (!param.gid) {
            param.gid = G.gc;
        }
        request.get('http://s.p.qq.com/cgi-bin/homework/group/modify_group_card.fcg', param, cb, error);
    };

    //
    function setLabel(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.post('/cgi-bin/qun_info/set_group_mem_tag', param, cb, error);
    };

    //获取成员标签
    function getLabel(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.post('/cgi-bin/qun_info/get_group_mem_tag', param, cb, error);
    };

    //获取成员身份
    //cgi wiki:http://tapd.oa.com/im_application_3/markdown_wikis/view/#1010091981004953207
    function getStatus(param, cb, error) {
        if (!param.gid) {
            param.gid = G.gc;
        }
        request.get('http://s.p.qq.com/cgi-bin/homework/group/get_group_card.fcg', param, cb, error);
    };

    //获取是否显示标签权限
    function getLabelFlag(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.post('/cgi-bin/qun_info/get_member_tag_flag', param, cb, error);
    };

    //获取头像,seq:自定义传参，qqJoinString
    function getFace(seq, qqJoinString, cb) {
        var requestStartTime = + (new Date());

        memberUtil.jsonp("http://face.imweb.qq.com/cgi-bin/face?app=group_info&redir=0&seq=" + seq + "&qq=40|" + qqJoinString, function(res){
            reportCgi.report({
                url : 'http://face.imweb.qq.com/cgi-bin/face',
                type : res.ec===0?1:2,
                code : res.ec,
                time : +(new Date()) - requestStartTime,
                rete : 10,
                uin : G.selfUin
            });            
            cb(res);
        });
    };

    //获取群资料
    function getGroupInfo(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.get('/cgi-bin/qun_info/get_group_info_all', param, cb, error);
    };

    //postErr统一的post出错处理
    function postErr(d) {
            G.monitor = [];
            switch (d.ec) {
                case 1:
                    client.alert(config.msg.tit.alert, config.msg.offline);
                    G.monitor.push(468410);
                    break;
                case 2:
                    void 0;
                    G.monitor.push(468411);
                    break;
                case 3:
                    void 0;
                    G.monitor.push(470269);
                    break;
                case 4:
                    void 0;
                    G.monitor.push(470270);
                    break;
                case 7: //新版本
                case 11: //老版本
                    void 0;
                    break;
                case 999:
                    //client.alert('错误提示', 'CGI数据拉取失败! -------- 测试截断弹窗');
                    void 0;
                    G.monitor.push(470271);
                    break;
                default:
                    void 0;
                    G.monitor.push(470272);
            }
            setTimeout(function() {
                report.monitor(G.monitor, true);
            }, 1000);
        }
        //cgi成功
    function cgiSuccess(d, typename) {
        if (d.ec === 0) {
            //数据上报
            var tdw = $.extend({}, G.tdw);
            switch (typename) {
                case "setAdmin":
                    tdw.action = "suc_setmana";
                    break;
                case "offSetAdmin":
                    tdw.action = "suc_unmana";
                    break;
                case "editCard":
                    tdw.action = "suc_name_modify";
                    break;
            }
            report.tdw(tdw);
        }
    }

    //设置管理员
    function setAdmin(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        //opt.op  :  1:设置管理员，0：取消管理员
        request.post('/cgi-bin/qun_info/set_group_admin', param, cb, error);
    }


    //取禁言列表
    function getShut(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.get('/cgi-bin/qun_info/get_group_shutup', param, cb, error);
    }


    //设置禁言列表
    function setShut(param, cb, error) {
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.post('/cgi-bin/qun_info/set_group_shutup', param, cb, error);
    }

    //设置模式
    function openOfficeMode(param, cb, error) {
        param.mode = 1;
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.get('/cgi-bin/qun_office/set_group_officemode', param, cb, error);
    };

    function closeOfficeMode(param, cb, error) {
        param.mode = 0;
        if (!param.gc) {
            param.gc = G.gc;
        }
        request.get('/cgi-bin/qun_office/set_group_officemode', param, cb, error);
    };

    return {
        setCard: setCard,
        setOfficeCard: setOfficeCard,
        setLabel: setLabel,
        getStatus: getStatus,
        setStatus: setStatus,
        getMembers: getMembers,
        getOfficeMembers: getOfficeMembers,
        getLabel: getLabel,
        getFace: getFace,
        getGroupInfo: getGroupInfo,
        getShut: getShut,
        postErr: postErr,
        cgiSuccess: cgiSuccess,
        setAdmin: setAdmin,
        setShut: setShut,
        getLabelFlag: getLabelFlag,
        openOfficeMode: openOfficeMode,
        closeOfficeMode: closeOfficeMode
    }

})();
},{"../../lib/config":3,"../../lib/report":4,"../../lib/request":5,"./client":9,"./util":27}],9:[function(require,module,exports){
'use strict';
//一些工具方法
//设置页用到的客户端方法

var client = require('../../lib/callClient'),
    util = require('../../lib/util');

module.exports = (function() {

    //判断是否在线
    var online = function() {
            return client.callClient('IsSelfOnline');
        }
        //弹窗提醒
    function alert(tit, txt) {
        //external.CallHummerApi('Window.Alert','{"iconType":1,"title":"title","text":""}');
        if (txt) {
            client.alert(1, tit, txt);
        } else {
            client.alert(1, '提示', tit);
        }
    };
    //取自己在群里面的权限
    var getSelfIdentity = function() {
            var t = util.getParameter("role") || client.getSelfRole();
            switch (t) {
                case 1:
                case "1":
                    return "owner";
                    break;
                case 2:
                case "2":
                    return "admin";
                    break;
                case 3:
                case "3":
                    return "";
                    break;
            }
        }
        //取自己的qq
    var getSelfUin = function() {
            return client.getSelfUin() || util.getUin();
        }
        //取客户端版本
    var getVersion = function() {
            return (client.getVersion() || util.getParameter('clientversion'));
        }
        //取群号
    var getGroupUin = function() {
        return (client.getGroupUin() || util.getParameter('groupuin'));
    }

    //添加成员
    var openContactSelecter = function() {
            return client.callClient("OpenContactSelecter");
        }
        //给群成员发送消息
    var sendMsgToGroupMem = function(uin) {
            return client.callClient("SendMsgToGroupMem", [uin + ""]);
        }
        //客户端形式获取qq部分资料
    var getMemberInfo = function(uin) {
        var d = client.callClient("GetSomeMemberName", ['{\"uins\":[' + uin + ']}']);
        if (d) {
            if (d[uin + ""]) {
                return d[uin + ""];
            }
        } else {
            return false;
        }
    }
    var getMemberOfficeInfo = function(uin) {
            var d = client.callClient("GetSomeMemberNameOnOfficeMode", ['{\"uins\":[' + uin + ']}']);
            if (d) {
                if (d[uin + ""]) {
                    return d[uin + ""];
                }
            } else {
                return false;
            }
        }
        //删除用户确认弹窗
    var setAdminMsgBox = function(tit, txt) {
        return client.callClient("Hummer_Group_ShowMessageBox", [txt, tit, 1]);
    };
    //取禁言选项
    var getBenMenu = function() {
            var _return = client.callClient('GetBanSpeechMenuInfo');
            if (!_return) {
                _return = [{
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
            }
            return _return;
        }
        //是否被屏蔽
    var getIsShieldGroupMem = function(uin) {
        return client.callClient("GetIsShieldGroupMem", [uin + ""]);
    };
    //获取全部成员
    var getAllMember = function() {
        var list = client.callClient("GetAllMemberUin", [G.gc + ""]);
        if (util.type(list) != "Array") {
            return false;
        }
        if (list.length < 1) {
            return false;
        }
        return list;
    };
    //删除成员
    var delMember = function(uin) {
        //删除成功后客户端调用接口onCallback_MarkCreditAndDelUser
        return client.callClient("MarkCreditAndDelUser", [uin + ""]);
    };
    //加为好友
    var addFriend = function(uin) {
        return client.callClient("GroupMemAddFrined", [uin + ""]);
    };
    //查看资料
    var userInfo = function(uin) {
        return client.callClient("Hummer_Contact_OpenContactInfoCard", [uin + "", "1"]);
    };
    //查看群名片
    var cardInfo = function(uin) {
        return client.callClient("Hummer_Contact_OpenGroupContactInfoCard", [uin + "", G.gc + "", "0", "1"]);
    };
    //举报用户
    var jubaoUser = function(uin) {
        return client.callClient("ImpeachGroupMem", [uin + ""]);
    };
    //屏蔽用户
    var shieldUser = function(uin) {
        return client.callClient("ShieldGroupMem", [uin + ""]);
    };
    var getClientKey = function() {
        return client.callHummer('IM.GetClientKey');
    };
    //获取群成员是否允许加群
    var getGroupMemberInviteOption = function() {
        return client.callClient('GetGroupMemberInvateOption');
    };

    //设置禁言时间
    function editGroupShutTime(value) {
        return client.callClient('editGroupShutTime', [value]);
    }

    function ShowMoreMenu() {
        return client.callClient('ShowMoreMenu');
    }

    function NotifyOfficeModeChange() {
        return client.callClient('SwitchOfficeMode', [G.officemode + ""]);
    }

    function GetOfficeMode() {
        return client.callClient('GetOfficeMode');
    }

    function GetMemberHtmlVer() {
        return client.callClient('GetMemberHtmlVer');
    }

    function onUILoadDone() {
        return client.callClient('onUILoadDone');
    }

    function exitGroup(value){
        return client.callHummer('Group.ExitGroup','{"groupId":"'+value+'"}');
    }    

    return {
        //取配置类的
        alert: alert,
        getSelfIdentity: getSelfIdentity,
        getSelfUin: getSelfUin,
        getVersion: getVersion,
        getGroupUin: getGroupUin,
        getBenMenu: getBenMenu,
        getIsShieldGroupMem: getIsShieldGroupMem,
        getAllMember: getAllMember,
        editGroupShutTime: editGroupShutTime,

        //成员类的
        setAdminMsgBox: setAdminMsgBox,
        openContactSelecter: openContactSelecter,
        sendMsgToGroupMem: sendMsgToGroupMem,
        getMemberInfo: getMemberInfo,
        getMemberOfficeInfo: getMemberOfficeInfo,
        delMember: delMember,
        addFriend: addFriend,
        userInfo: userInfo,
        cardInfo: cardInfo,
        jubaoUser: jubaoUser,
        shieldUser: shieldUser,
        getClientKey: getClientKey,
        getGroupMemberInviteOption: getGroupMemberInviteOption,
        notifyOfficeModeChange: NotifyOfficeModeChange,
        showMoreMenu: ShowMoreMenu,
        getOfficeMode: GetOfficeMode,
        getMemberHtmlVer: GetMemberHtmlVer,
        onUILoadDone: onUILoadDone,

        exitGroup : exitGroup,

        //其他类型的
        online: online,
        common: client
    };
})();
},{"../../lib/callClient":2,"../../lib/util":6}],10:[function(require,module,exports){
'use strict';

var config = require('../../lib/config'),
    util = require('../../lib/util'),
    client = require('./client'),
    cgi = require('./cgi'),
    label = require('./label'),
    status = require('./status'),
    card = require('./card'),
    tmplContentMenu = require('./tmpl/content-menu');

module.exports = (function() {
    var init = function() {
        //右键 , 行焦点
        $(document).on("mousedown", "[data-member-list]", function(e) {
            //获得行焦点
            $("#member-list-focus").removeClass('hover').removeClass('focus').removeAttr("id");
            $(this).attr("id", "member-list-focus").addClass('focus');
            //右键菜单
            var barMenu = $("#barMenu"),
                qq = $("#member-list-focus").data("member-list"),
                nowList = $("#list-" + qq),
                i = nowList.data("i");
            if (e.button == 2) {
                if (!G.eventListener("contentMenu", "rightclick")) {
                    return false;
                }
                var beShut = false, //判断当前用户是否被禁言
                    isfriend = nowList.data("isfriends"),
                    shield = client.getIsShieldGroupMem(qq) ? "shield" : "";
                if (G.memberData.shutup_list && G.memberData.shutup_list[qq]) {
                    beShut = true;
                }
                //创建右键菜单
                barMenu.html(tmplContentMenu({
                    qq: qq,
                    i: i,
                    items: G.officemode == "0" ? G.memberData.items : G.memberData.office_items,
                    shut: beShut, //是否被禁言
                    menu: client.getBenMenu(), //禁言菜单
                    isfriend: isfriend, //是否朋友关系
                    version: G.version,
                    shield: shield //是否被屏蔽
                }));
                var panel = $("#member-box");
                var secMenu = $("#secMenu");
                //菜单定位
                var gap = 3,
                    left = e.pageX,
                    top = e.pageY,
                    menuH = barMenu.height(),
                    menuW = barMenu.width(),
                    secH = secMenu.height(),
                    secW = secMenu.width(),
                    panelH = panel.height(),
                    panelW = panel.width();
                if (left + menuW > panelW - gap) {
                    left = left - menuW;
                    if (!barMenu.hasClass('sec-left'))
                        barMenu.addClass('sec-left');
                } else {
                    if (left + menuW + secW > panelW - gap) {
                        if (!barMenu.hasClass('sec-left'))
                            barMenu.addClass('sec-left');
                    } else {
                        barMenu.removeClass('sec-left');
                    }
                }
                if (top + menuH > panelH - gap) {
                    top = top - menuH + 10;
                }
                if (top + 79 + secH > panelH - gap) {
                    if (!barMenu.hasClass('sec-top'))
                        barMenu.addClass('sec-top');
                } else {
                    barMenu.removeClass('sec-top');
                }
                barMenu.css("visibility", "visible").css({
                    left: left,
                    top: top
                });
                //隐藏标签菜单
                label.hideMenu();
                status.hideMenu();
            } else {
                barMenu.css("visibility", "hidden");
                $("#secMenu").css("visibility", "hidden");
            }
        });
        //点击其他地方隐藏右键菜单
        $(document).click(function() {
            $("#barMenu").css("visibility", "hidden");
            $("#secMenu").css("visibility", "hidden");
        });
        //禁用浏览器右键
        $(document).bind("contextmenu", function(e) {
            return false;
        });
        //禁言，解除禁言，通用函数
        var setShutHander = function(data, uin, time) {
            if (data.ec === 0) {
                //被禁言
                var dom = $('#list-' + uin + ' .time');
                if (time) {
                    if (!G.memberData.shutup_list) {
                        G.memberData.shutup_list = {};
                    }
                    G.memberData.shutup_list[uin] = time;
                    dom.text(config.msg.shut.howtimetocancelshut.replace("%s", util.getShutTime(time))); //多少时间后解禁
                } else { //被取消禁言
                    dom.text(dom.data("time"));
                    delete G.memberData.shutup_list[uin];
                }
                //客户端大T上报
                var obj = {
                    'bigT': '0X800402D',
                    'key': '{"groupuin":' + G.gc + ';"currenttime":' + new Date().getTime() + ';"banspeechtime";' + time + ';"useruin":' + uin + '}',
                    'param1': '1',
                    'param2': '2',
                    'param3': G.role + '',
                    'param4': 0,
                    'param5': 0,
                    'param6': 0,
                    'param7': 0
                };
                client.common.callHummer('Default.DataReportEx', JSON.stringify(obj));
            } else {
                cgi.postErr(data);
            }
        };
        //禁言设置
        var setShut = function(e, uin) {
            var time = $(this).data('time');
            var list = [];
            var handler = function(data) {
                setShutHander(data, uin, time);
            };
            if (time === 'auto' && G.version >= 5383) {
                var sparam = {
                    uin: [uin + ''],
                    setting: true
                }
                $("#barMenu").css("visibility", "hidden");
                var ret = client.editGroupShutTime(JSON.stringify(sparam));
                if (ret && ret.times) {
                    time = ret.times;
                    var dom = $('#list-' + uin + ' .time');
                    if (!G.memberData.shutup_list) {
                        G.memberData.shutup_list = {};
                    }
                    G.memberData.shutup_list[uin] = time;
                    dom.text(config.msg.shut.howtimetocancelshut.replace("%s", util.getShutTime(time))); //多少时间后解禁
                    // list.push({
                    //     uin : parseInt(uin),
                    //     t : time
                    // });
                    // var param = {
                    //     shutup_list : JSON.stringify(list)
                    // }

                    // cgi.setShut(param,handler,handler);
                }
            } else {

                list.push({
                    uin: parseInt(uin),
                    t: parseInt(time)
                });
                var param = {
                    shutup_list: JSON.stringify(list)
                }
                cgi.setShut(param, handler, handler);
            }
        };
        //解除禁言
        var unsetShut = function(e, uin) {
            var list = [];
            list.push({
                uin: parseInt(uin),
                t: 0
            });
            var param = {
                shutup_list: JSON.stringify(list)
            }
            var handler = function(data) {
                setShutHander(data, uin, 0);
            };
            cgi.setShut(param, handler, handler);
        };
        //查看资料
        var showInfo = function(e, uin) {
            if (G.officemode == '1')
                client.cardInfo(uin);
            else
                client.userInfo(uin);
        };
        //加为好友
        var addFriends = function(e, uin) {
            client.addFriend(uin);
        };
        //修改名片
        var editCard = function(e, uin) {
            if (G.officemode == "0")
                card.set(uin);
            else
                card.setOffice(uin);
        };

        //举报用户
        var jubaoUser = function(e, uin) {
            //客户端模态窗口，dom会暂停事件冒泡，所以这里手工关闭菜单
            $("#barMenu").css("visibility", "hidden");
            client.jubaoUser(uin);
        };
        //屏蔽用户
        var shieldUser = function(e, uin) {
            var res = client.shieldUser(uin);
            var img = $("#list-" + uin).find(".shielded");
            if (res) {
                img.addClass('show');
                $("#list-" + uin).data("shield", "true");
            } else {
                img.removeClass('show');
                $("#list-" + uin).data("shield", "false");
            }
        };
        //发生消息
        var sendMsg = function(e, uin) {
            client.sendMsgToGroupMem(uin);
        };

        //右键事件列表
        var task = {
            'gag': setShut,
            'ungag': unsetShut,
            'send': sendMsg,
            'view': showInfo,
            'modify': editCard,
            'jubao': jubaoUser,
            'shield': shieldUser,
            'add': addFriends
        };

        //事件绑定
        $('#barMenu').on('click', '[data-menuid]', function(e) {
            var self = $(this),
                menuid = self.data('menuid'),
                uin = $("#member-list-focus").data("member-list");
            if (menuid) {
                if (!G.eventListener("contentMenuOne-" + menuid, "select")) {
                    return false;
                }
                var fn = task[menuid];
                if (typeof fn === 'function') {
                    fn.call(this, e, uin);
                }
            }
        });
    };


    return {
        init: init
    };

})();
},{"../../lib/config":3,"../../lib/util":6,"./card":7,"./cgi":8,"./client":9,"./label":11,"./status":14,"./tmpl/content-menu":15}],11:[function(require,module,exports){
'use strict';

var cgi = require('./cgi'),
    tmplLabelMenu = require('./tmpl/label-menu');

module.exports = (function() {

    var memberBox = $("#member-box");
    var hideMenu = function() {
        $("#member-list-label-focus").removeClass('focus').removeAttr("id");
    };
    var eventBin = function() {
        var bodyHeight = $("#member-box").height();
        //标签下拉
        memberBox.on("click", "[data-label]", function(e) {
            if (!G.eventListener("labelDropdown", "click")) {
                return false;
            }
            var ul = $(this).find("ul");
            //标签是否被编辑过
            if (G.memberData.labelChange) {
                ul.replaceWith(tmplLabelMenu({
                    labelid: $(this).data("label")
                }));
            }
            //没有标签项
            ul = $(this).find("ul");
            if (ul.children("li").size() < 2) {
                $("#eiditLabel").click();
                hideMenu();
                return false;
            }
            //显示下拉
            if ($(this).hasClass('focus')) {
                hideMenu();
            } else {
                hideMenu();
                $(this).attr("id", "member-list-label-focus").addClass('focus');
            }
            //菜单翻转
            ul = $(this).find("ul");
            var top = ul.offset().top,
                height = ul.height();
            if (top + height > bodyHeight) {
                ul.css("top", -height);
            }
            return false;
        });
        //标签修改
        memberBox.on("click", "[data-label-id]", function(e) {
            if (!G.eventListener("labelDropdownOne", "select")) {
                return false;
            }
            var _this = $(this);
            var list = $("#member-list-focus");
            var labelid = _this.data("label-id");
            var qq = list.data("member-list");
            cgi.setLabel({
                uin_list: qq,
                tag_id: labelid
            }, function(d) {
                if (d.ec == 0) {
                    list.find("[data-label-txt]").html(_this.text());
                    _this.addClass('focus');
                    G.memberData.label[qq] = _this.text();
                    G.memberData.labelid[qq] = labelid;
                    G.memberData.items[parseInt(list.data("i"))].levelid = labelid;
                } else {
                    cgi.postErr(d);
                }
            }, cgi.postErr);
        });
        //隐藏菜单
        $(document).click(function() {
            hideMenu();
        });
    };


    return {
        eventBin: eventBin,
        hideMenu: hideMenu
    };

})();
},{"./cgi":8,"./tmpl/label-menu":18}],12:[function(require,module,exports){
'use strict';

var report = require('../../lib/report'),
    cgi = require('./cgi'),
    toolbar = require('./toolbar'),
    listHtml = require('./list-html'),
    util = require('../../lib/util'),
    memberUtil = require('./util');

module.exports = (function() {

    //组装成员列表
    var createMemberList = function() {

        //普通模式
        if (G.officemode == "0") {
            //家校群数据还未返回
            if (G.classHomeSchool === true && !G.memberData.statusload) {
                return;
            }
            if (G.memberData.itemsload && G.memberData.labelload && G.memberData.groupload && G.memberData.labelflagload) {
                mergeStatusData();
                window.timeScope.cgiDataReadyEnd = new Date().getTime() //cgi全部拉取成功;
                var i = 0,
                    len = 0,
                    indentity = "";
                //当前用户权限
                if (G.selfUin == G.memberData.group.gOwner) {
                    indentity = "owner";
                }
                if (G.memberData.group["gAdmins"]) {
                    for (i = 0, len = G.memberData.group.gAdmins.length; i < len; i++) {
                        if (G.selfUin == G.memberData.group.gAdmins[i]) {
                            indentity = "admin";
                        }
                    }
                }
                G.selfIndentity = indentity;
                //成员权限
                for (i = 0, len = G.memberData.items.length; i < len; i++) {
                    indentity = "";
                    var qq = G.memberData.items[i].qq;
                    if (qq == G.memberData.group.gOwner) {
                        indentity = "owner";
                    }
                    if (G.memberData.group["gAdmins"]) {
                        for (var i2 = 0, len2 = G.memberData.group.gAdmins.length; i2 < len2; i2++) {
                            if (qq == G.memberData.group.gAdmins[i2]) {
                                indentity = "admin";
                            }
                        }
                    }
                    G.memberData.items[i].indentity = indentity;
                }
                //成员标签，排序用，不用于真实数据输出
                G.memberData.blackusers = 0;
                G.memberData.blackitems = [];
                for (i = 0, len = G.memberData.items.length; i < len; i++) {
                    var qq = G.memberData.items[i].qq;
                    if (G.memberData.label[qq]) {
                        G.memberData.items[i].labelid = G.memberData.labelid[qq];
                    }
                    //不良成员数
                    if (G.memberData.items[i].blackuser === 1) {
                        G.memberData.blackusers++;
                        G.memberData.blackitems.push(G.memberData.items[i]);
                    }
                }


                //工具条
                toolbar.init();
                //表头填充
                listHtml.loadThead();
                //列表填充
                listHtml.loadTbody();
                //默认角色排序
                listHtml.sortByIndentity();
                //检查是否处于编辑名片状态
                listHtml.isEditCard();
                //检查是否处于查看最后发言状态
                listHtml.lastTimeMsg();

                if (!G.faceloaded) {
                    //头像拉取回调
                    var getFace = function(d) {
                        var key, url;
                        window.timeScope.userFaceLoadStart = window.timeScope.userFaceLoadStart || new Date().getTime() //头像拉取开始;
                        for (key in d.qq) {
                            url = d.qq[key].u.replace(/&amp;/g, '&');
                            listHtml.setFace(key, url);
                            G.memberData.face[key] = url;
                        }
                    };
                    //头像拉取
                    var i = 0,
                        len = G.memberData.items.length,
                        jsonpQQjoin = "";
                    for (i = 0; i < len; i++) {
                        var qq = G.memberData.items[i].qq; //qq号码
                        //qq头像获取
                        if (i % 19 == 0 && i != 0) {
                            jsonpQQjoin = jsonpQQjoin + qq;
                            cgi.getFace(i, jsonpQQjoin, getFace);
                            jsonpQQjoin = "";
                        } else {
                            jsonpQQjoin = jsonpQQjoin + qq + "_";
                        }
                    }
                    if (jsonpQQjoin != "") {
                        cgi.getFace(i, jsonpQQjoin, getFace);
                    }
                    G.faceloaded = 1;
                }
                //m.isd.com上报开始
                if (window.timeScope.pagestart) {
                    var isdTime = [
                        window.timeScope.pagestart.start,
                        0, //1
                        0, //2
                        window.timeScope.cssload.start, //3
                        window.timeScope.jsloadstartStart, //4
                        window.timeScope.jsloadstartEnd, //5
                        window.timeScope.domReady, //6
                        window.timeScope.clientMemberDataReadyStart, //7
                        window.timeScope.clientMemberDataReadyEnd, //8
                        window.timeScope.cgiDataReadyStart, //9
                        window.timeScope.cgiDataReadyEnd, //10
                        window.timeScope.memberListLoadStart, //11
                        window.timeScope.memberListLoadEnd //12
                    ];
                    setTimeout(function() {
                        //console.log(isdTime)
                        report.isd2(7832, 62, 1, isdTime);
                        //report.isd(7723, 4, 6, isdTime);
                    }, 1000);
                }
            }
        } else {
            if (G.memberData.labelload && G.memberData.office_itemsload && G.memberData.groupload && G.memberData.labelflagload) {
                window.timeScope.cgiDataReadyEnd = new Date().getTime() //cgi全部拉取成功;
                var i = 0,
                    len = 0,
                    indentity = "";
                //当前用户权限
                if (G.selfUin == G.memberData.group.gOwner) {
                    indentity = "owner";
                }
                if (G.memberData.group["gAdmins"]) {
                    for (i = 0, len = G.memberData.group.gAdmins.length; i < len; i++) {
                        if (G.selfUin == G.memberData.group.gAdmins[i]) {
                            indentity = "admin";
                        }
                    }
                }
                G.selfIndentity = indentity;
                //成员权限
                for (i = 0, len = G.memberData.office_items.length; i < len; i++) {
                    indentity = "";
                    var qq = G.memberData.office_items[i].qq;
                    if (qq == G.memberData.group.gOwner) {
                        indentity = "owner";
                    }
                    if (G.memberData.group["gAdmins"]) {
                        for (var i2 = 0, len2 = G.memberData.group.gAdmins.length; i2 < len2; i2++) {
                            if (qq == G.memberData.group.gAdmins[i2]) {
                                indentity = "admin";
                            }
                        }
                    }
                    G.memberData.office_items[i].indentity = indentity;
                }
                //成员标签，排序用，不用雨真实数据输出
                G.memberData.blackusers = 0;
                G.memberData.blackitems = [];
                for (i = 0, len = G.memberData.office_items.length; i < len; i++) {
                    var qq = G.memberData.office_items[i].qq;
                    if (G.memberData.label[qq]) {
                        G.memberData.office_items[i].labelid = G.memberData.labelid[qq];
                    }
                    //不良成员数
                    if (G.memberData.office_items[i].blackuser === 1) {
                        G.memberData.blackusers++;
                        G.memberData.blackitems.push(G.memberData.office_items[i]);
                    }
                }


                //工具条
                toolbar.init();
                //表头填充
                listHtml.loadThead();
                //列表填充
                listHtml.loadTbody();
                //默认角色排序
                listHtml.sortByIndentity();
                //检查是否处于编辑名片状态
                listHtml.isEditCard();
                //检查是否处于查看最后发言状态
                listHtml.lastTimeMsg();

                if (!G.faceloaded) {
                    //头像拉取回调
                    var getFace = function(d) {
                        var key, url;
                        window.timeScope.userFaceLoadStart = window.timeScope.userFaceLoadStart || new Date().getTime() //头像拉取开始;
                        for (key in d.qq) {
                            url = d.qq[key].u.replace(/&amp;/g, '&');
                            listHtml.setFace(key, url);
                            G.memberData.face[key] = url;
                        }
                    };
                    //头像拉取
                    var i = 0,
                        len = G.memberData.office_items.length,
                        jsonpQQjoin = "";
                    for (i = 0; i < len; i++) {
                        var qq = G.memberData.office_items[i].qq; //qq号码
                        //qq头像获取
                        if (i % 19 == 0 && i != 0) {
                            jsonpQQjoin = jsonpQQjoin + qq;
                            cgi.getFace(i, jsonpQQjoin, getFace);
                            jsonpQQjoin = "";
                        } else {
                            jsonpQQjoin = jsonpQQjoin + qq + "_";
                        }
                    }
                    if (jsonpQQjoin != "") {
                        cgi.getFace(i, jsonpQQjoin, getFace);
                    }
                    G.faceloaded = 1;
                }
                //m.isd.com上报开始
                if (window.timeScope.pagestart) {
                    var isdTime = [
                        window.timeScope.pagestart.start,
                        0, //1
                        0, //2
                        window.timeScope.cssload.tart, //3
                        window.timeScope.jsloadstartStart, //4
                        window.timeScope.jsloadstartEnd, //5
                        window.timeScope.domReady, //6
                        window.timeScope.clientMemberDataReadyStart, //7
                        window.timeScope.clientMemberDataReadyEnd, //8
                        window.timeScope.cgiDataReadyStart, //9
                        window.timeScope.cgiDataReadyEnd, //10
                        window.timeScope.memberListLoadStart, //11
                        window.timeScope.memberListLoadEnd //12
                    ];
                    setTimeout(function() {
                        report.isd(7832, 62, 2, isdTime);
                        //report.isd(7723, 4, 6, isdTime);
                    }, 1000);
                }
            }
        }
    };
    var mergeStatusData = function() {
        //如果是家校群，把statusid数据合并到items里面
        if (G.classHomeSchool === true) {
            var items = G.memberData.items;
            var statusId = G.memberData.statusid;
            var length = items.length;
            for (var index = 0; index < length; ++index) {
                //console.log(G.memberData);
                if (statusId[items[index].qq + ""]) {
                    items[index].statusid = statusId[items[index].qq];
                } else {
                    items[index].statusid = 0;
                }
            }
            delete G.memberData.statusid;
        }
    };
    var status = function() {
        cgi.getStatus({}, function(d) {
            G.memberData.statusload = true;
            G.memberData.statusid = {};
            if (d.retcode == 0) {
                if (!d.data || !d.data.card_hw_info) {
                    return;
                }
                var data = d.data.card_hw_info;
                var length = data.length;
                var statusKey = ['identity', 'uin'];
                for (var index = 0; index < length; ++index) {
                    var status = data[index];
                    G.memberData.statusid[status[statusKey[1]]] = status[statusKey[0]];
                }
                // var key;
                // //循环获取用户标签对应的序号
                // for (key in d.mem_tag) {
                //     var i = 0,
                //         len = d.mem_tag[key].length;
                //     for (; i < len; i++) {
                //         G.memberData.labelid[d.mem_tag[key][i]] = key;
                //     }
                // }
                // //替换序号为中文标签名
                // for (key in G.memberData.labelid) {
                //     G.memberData.label[key] = d.tag_info[G.memberData.labelid[key]];
                // }
                // //全部标签
                // G.memberData.tag_info = d.tag_info;
                // //数据生成
                createMemberList();
            } else {
                //错误信息跟旧版本的cgi规格好像不一致，这个通用错误处理估计用不上这条cgi
                cgi.postErr(d);
            }
        }, cgi.postErr);
    };
    var label = function() {
        cgi.getLabel({}, function(d) {
            G.memberData.labelload = true;
            G.memberData.labelid = {};
            G.memberData.label = {};
            if (d.ec == 0) {
                if (!d.tag_info) {
                    return;
                }
                var key;
                //循环获取用户标签对应的序号
                for (key in d.mem_tag) {
                    var i = 0,
                        len = d.mem_tag[key].length;
                    for (; i < len; i++) {
                        G.memberData.labelid[d.mem_tag[key][i]] = key;
                    }
                }
                //替换序号为中文标签名
                for (key in G.memberData.labelid) {
                    G.memberData.label[key] = d.tag_info[G.memberData.labelid[key]];
                }
                //全部标签
                G.memberData.tag_info = d.tag_info;
                //数据生成
                createMemberList();
            } else {
                cgi.postErr(d);
            }
        }, cgi.postErr);
    };
    var init = function() {
        window.timeScope.cgiDataReadyStart = new Date().getTime() //cgi开始准备拉取;
        createMemberList();
        //拉取群资料
        if (G.memberData.groupload) {} else {
            cgi.getGroupInfo({}, function(d) {
                G.memberData.group = {};
                if (d.ec == 0) {
                    /*add by horde */
                    /*把等级保存一下.在等级也就不用再另外拉了.*/
                    var level = d.levelname;
                    var gradeCache = util.getCache('gradeLevel');
                    if (!gradeCache) {
                        gradeCache = {};
                    }
                    gradeCache[G.gc] = level;
                    util.setCache('gradeLevel', gradeCache);

                    //驾校模式
                    if ((typeof G.classHomeSchool != 'boolean') && (d.classID == G.classHomeSchool)) {
                        G.classHomeSchool = true;
                    } else {
                        G.classHomeSchool = false;
                    }

                    if (G.classHomeSchool === true) {
                        status();
                    }

                    G.memberData.group.gOwner = d.gOwner;
                    G.memberData.group.gAdmins = d.gAdmins;
                    G.memberData.groupload = true;
                    //数据生成
                    createMemberList();
                } else {
                    cgi.postErr(d);
                }
            }, cgi.postErr);
        }

        //成员标签
        if (G.memberData.labelload) {} else {
            if (G.selfIndentity == "") {
                G.memberData.labelload = true;
                G.memberData.labelid = {};
                G.memberData.label = {};
            } else {
                label();
            }
        }


        //设置了是否显示标签
        if (G.memberData.labelflagload) {} else {
            cgi.getLabelFlag({}, function(d) {
                G.memberData.labelflagload = true;
                G.memberData.labelflag = d.flag;
                //数据生成
                createMemberList();
            }, cgi.postErr);
        }

        if (G.officemode == "0") {
            //群成员拉取
            if (G.memberData.itemsload) {} else {
                cgi.getMembers({}, function(d) {
                    setTimeout(function() {
                        var perf = util.getPerf('get_group_members_new');
                        report.isdPerf(7723, 4, 11, perf);
                    }, 500);

                    G.memberData.itemsload = true;
                    G.memberData.items = [];
                    if (d.ec == 0) {
                        G.memberData.level = d.level;
                        G.memberData.type = d.type;
                        G.memberData.ext_num = d.ext_num;
                        G.memberData.shutup_list = d.shutup_list;
                        G.memberData.levelname = d.levelname;
                        //好友状态
                        if (d.friends) {
                            var i = 0,
                                len = d.friends.length;
                            G.memberData.friends = {};
                            for (i = 0; i < len; i++) {
                                G.memberData.friends[d.friends[i]] = 1;
                            }
                        }
                        //items数据组装
                        i = 0, len = d.mems.length;
                        for (i = 0; i < len; i++) {
                            var qq = d.mems[i].u, //qq号码
                                nick = d.mems[i].n, //昵称
                                blackuser = d.mems[i].b, //1不良成员，0非不良成员
                                card = "", //群名片
                                labelid = "-1", //设置默认标签id,排序用，不用雨真实数据输出
                                levelid = d.lv[qq].l, //等级标识
                                point = d.lv[qq].p, //等级积分
                                times = memberUtil.dateFormat(new Date(parseInt(d.times[qq]) * 1000), "yyyy/MM/dd"); //最后发言
                            if (d.cards && d.cards[qq]) {
                                card = d.cards[qq];
                            }
                            if (times == "1970/01/01") {
                                times = "-";
                            }
                            //缓存数据填充
                            G.memberData.items.push({
                                qq: qq,
                                nick: nick,
                                card: card,
                                labelid: labelid,
                                levelid: levelid,
                                point: point,
                                times: times,
                                blackuser: blackuser
                            });
                        }
                        //数据生成
                        createMemberList();
                    } else {
                        cgi.postErr(d);
                    }
                }, cgi.postErr);
            }
        } else {
            //群成员拉取
            if (G.memberData.office_itemsload) {} else {
                cgi.getOfficeMembers({}, function(d) {
                    setTimeout(function() {
                        var perf = util.getPerf('get_group_contacts');
                        report.isdPerf(7723, 4, 11, perf);
                    }, 500);

                    G.memberData.office_itemsload = true;
                    G.memberData.office_items = [];
                    if (d.ec == 0) {
                        G.memberData.level = d.level;
                        G.memberData.type = d.type;
                        G.memberData.ext_num = d.ext_num;
                        G.memberData.shutup_list = d.shutup_list;
                        //好友状态
                        if (d.friends) {
                            var i = 0,
                                len = d.friends.length;
                            G.memberData.friends = {};
                            for (i = 0; i < len; i++) {
                                G.memberData.friends[d.friends[i]] = 1;
                            }
                        }
                        //items数据组装
                        var len = d.contacts.length;
                        var i = 0;
                        for (i = 0; i < len; i++) {
                            var qq = d.contacts[i].u, //qq号码
                                tel = d.contacts[i].p, //电话
                                position = d.contacts[i].j, //职位
                                gender = d.contacts[i].g, //性别
                                nick = d.contacts[i].n,
                                card = d.contacts[i].c,
                                blackuser = d.contacts[i].b;
                            //缓存数据填充
                            G.memberData.office_items.push({
                                tel: tel,
                                position: position,
                                gender: gender,
                                blackuser: blackuser,
                                qq: qq,
                                card: card,
                                nick: nick
                            });
                        }
                        //数据生成
                        createMemberList();
                    } else {
                        cgi.postErr(d);
                    }
                }, cgi.postErr);
            }
        }
    };

    return {
        init: init,
        label: label
    };

})();
},{"../../lib/report":4,"../../lib/util":6,"./cgi":8,"./list-html":13,"./toolbar":26,"./util":27}],13:[function(require,module,exports){
'use strict';

var report = require('../../lib/report'),
    util = require('../../lib/util'),
    config = require('../../lib/config'),
    client = require('./client'),
    cgi = require('./cgi'),
    card = require('./card'),
    label = require('./label'),
    status = require('./status'),
    contentMenu = require('./content-menu'),
    tmplMemberThead = require('./tmpl/member-thead'),
    tmplListBox = require('./tmpl/member-list-box'),
    tmplListOne = require('./tmpl/member-list-one'),
    tmplHomeschoolListOne = require('./tmpl/homeschool-member-list-one'),
    tmplOfficeMemberThead = require('./tmpl/office-member-thead'),
    tmplHomeschoolMemberThead = require('./tmpl/homeschool-member-thead'),
    tmplOfficeListOne = require('./tmpl/office-member-list-one');

var exitGroupVersion = 5449;//退出群功能显示的版本.

module.exports = (function() {

    //查看最后发言
    var lastTimeMsg = function(uin) {
        var memuin = util.getParameter("memuin"),
            enableedit = util.getParameter("enableedit");
        var toFocus = function(qq) {
            $("#member-list-focus").removeClass('focus').removeAttr("id");
            if ($("#hidefocus-" + qq).size() < 1) {
                $("#hidefocus2-" + qq).focus();
                $("#hidefocus2-" + qq).closest("[data-member-list]").attr("id", "member-list-focus").addClass('focus');
            } else {
                $("#hidefocus-" + qq).focus();
                $("#hidefocus-" + qq).closest("[data-member-list]").attr("id", "member-list-focus").addClass('focus');
            }
        };
        if (uin) {
            toFocus(uin);
        } else if (memuin != "0" && enableedit == "0") {
            toFocus(memuin);
        }
    };
    //列表每次更新时自动调用该函数
    var listUpdate = function() {
        //群名片编辑
        card.keydownToSubimt();
    };
    //检测当前是否外部直接跳转进来修改名片的，让修改名片input自动活动焦点
    var isEditCard = function(uin) {
        var memuin = util.getParameter("memuin"),
            enableedit = util.getParameter("enableedit"),
            isReload = util.getParameter("isReload");
        var toFocus = function(qq) {
            $("#member-list-focus").removeClass('focus').removeAttr("id");
            if ($("#hidefocus-" + qq).size() < 1) {
                $("#hidefocus2-" + qq).focus();
                $("#hidefocus2-" + qq).closest("[data-member-list]").attr("id", "member-list-focus").addClass('focus');
            } else {
                $("#hidefocus-" + qq).focus();
                $("#hidefocus-" + qq).closest("[data-member-list]").attr("id", "member-list-focus").addClass('focus');
            }
        };
        if (uin) {
            if (!G.eventListener("tabSkipToEditNick-input", "autoFocus")) {
                return false;
            }
            toFocus(uin);
            listPageView();
            setTimeout(function() {
                card.set(uin);
            }, 500);
        } else if (memuin != "0" && enableedit == "1" && isReload != "1") {
            if (!G.eventListener("urlSkipToEditNick-input", "autoFocus")) {
                return false;
            }
            toFocus(memuin);
            listPageView();
            setTimeout(function() {
                card.set(memuin);
            }, 500);
            //避免刷新重新定位焦点
            $(document).one("keydown", function(e) {
                if (e.keyCode == 116) {
                    location.href = location.href + "&isReload=1";
                    return false;
                }
            });
        }
    };
    //点击表头排序
    var resort = function() {
        if (!G.event_membertheadSortClick) {
            $("#member-thead").on("click", "li", function(e, inputsort) {
                var record = $(this).data("record"),
                    sort = !inputsort || (inputsort && inputsort.length == 0) ? $(this).data("sort") : inputsort;
                if (!G.eventListener("resort-theadList", "sortkey-is-" + sort)) {
                    return false;
                }
                //正在执行上次数据加载
                if (G.memberData.isListViewLoad && sort) {
                    return;
                }
                var items;
                if (G.officemode == "0")
                    items = G.memberData.items;
                else
                    items = G.memberData.office_items;
                switch (record) {
                    case "point":
                        if (sort == "desc") {
                            items.sort(function(a, b) {
                                return util.numSortUp(a[record], b[record]);
                            });
                        } else {
                            items.sort(function(a, b) {
                                return util.numSortDown(a[record], b[record]);
                            });
                        }
                        break;
                    default:
                        if (sort == "desc") {
                            items.sort(function(a, b) {
                                return util.nameSortUp(a[record], b[record]);
                            });
                        } else {
                            items.sort(function(a, b) {
                                return util.nameSortDown(a[record], b[record]);
                            });
                        }
                        break;
                }
                //计算新排序规则
                sort = (sort == "desc") ? "asc" : "desc";
                //清除旧排序规则
                $("#member-thead > li").data("sort", "");
                //修改为新排序规则
                $(this).data("sort", sort);
                //重置滚动条
                $("#member-tbody").scrollTop(0);
                //重载数据
                loadTbody(true);
            });
            G.event_membertheadSortClick = true;
        }
    };
    //默认管理员排序
    var sortByIndentity = function() {
        $("#member-thead [data-record='indentity']").trigger("click", ["asc"]);
    };
    //设置头像
    var setFace = function(qq, src) {
        //console.log(qq+","+src+","+$("#member-face-"+qq).size())
        $("#member-face-" + qq).attr("src", src);
    };
    //listPageView优化
    window.listPageViewTimeout;
    var listPageView = function() {
        clearTimeout(window.listPageViewTimeout);
        window.listPageViewTimeout = setTimeout(function() {
            var tbody = $("#member-tbody"),
                li = tbody.children('li');
            var top = tbody.scrollTop(),
                split = 38; //单行高度
            var grid = tbody.height();
            var listNum = Math.floor(grid / split) + 1;
            var start = Math.floor(top / split) - 1;
            start = start - 10; //避免ui上的bug增加向上10条
            if (start < 0) {
                start = 0;
            }
            var end = start + listNum;
            end = end + 20; //避免ui上的bug增加向下10条

            var items;
            if (G.officemode == "0")
                items = G.memberData.items;
            else
                items = G.memberData.office_items;
            if (end > items.length) {
                end = items.length;
            }
            //console.log("top:"+top+";start:"+start+";end:"+end)
            for (var i = start; i < end; i++) {
                var qq = li.eq(i).data("member-list");
                if (li.eq(i).data("cgi") == "unready") {
                    li.eq(i).data("cgi", "ready");
                    if (G.officemode == "0") {
                        if (G.classHomeSchool == true) {
                            li.eq(i).html(tmplHomeschoolListOne({
                                i: i,
                                data: G.memberData,
                                version : exitGroupVersion,
                                util: util,
                                client: client
                            }));
                        } else {
                            li.eq(i).html(tmplListOne({
                                i: i,
                                data: G.memberData,
                                version : exitGroupVersion,
                                util: util,
                                client: client
                            }));
                        }
                    } else {
                        li.eq(i).html(tmplOfficeListOne({
                            i: i,
                            data: G.memberData,
                            version : exitGroupVersion,
                            util: util,
                            client: client
                        }));
                    }
                }
            }
            //列表更新
            listUpdate();
        }, 200);
    };

    //初始化
    var init = function() {
        void 0;
        //初始化右键菜单
        contentMenu.init();
        //标签
        label.eventBin();
        //身份
        status.eventBin();
        //名片编辑
        card.listEditBtn();
        //双击聊天
        $(document).on("dblclick", "[data-member-list]", function(e) {
            //> 屏蔽输入框情况
            if ($(e.target).is('input'))
                return false;
            var uin = $(this).data("member-list");
            if (!G.eventListener("listSendMsg-listbar", "dblclick")) {
                return false;
            }
            client.sendMsgToGroupMem(uin);
        });
        //查看资料
        $(document).on("click", "[data-user-detail]", function(e) {
            var uin = $(this).data("user-detail");
            if (!G.eventListener("listUserInfo-listButton", "click")) {
                return false;
            }
            if (G.officemode == '1')
                client.cardInfo(uin);
            else
                client.userInfo(uin);
        });

        //退出群
        $(document).on("click", "[data-exit-group]", function(e) {
            if (!G.eventListener("delUser-listbutton", "click")) {
                void 0;
                return false;
            }
            var ret = client.exitGroup(G.gc);
        });         
        //设置管理员
        $(document).on("click", "[data-setadmin='owner'].setting", function(e) {
            var items;
            if (G.officemode == "0")
                items = G.memberData.items;
            else
                items = G.memberData.office_items;

            if (!G.eventListener("setAdmin-listButton", "click")) {
                return false;
            }
            var _this = $(this);
            var _list = _this.closest("[data-nick]");
            var _i = _list.data("i");
            if ($("#admin-count").html() == $("#total-admin").html()) {
                client.setAdminMsgBox("提示", "群管理员人数已达上限，您可以增加管理员人数后再进行设置");
                return;
            }
            var set = client.setAdminMsgBox("提示", "确定要设置 " + _list.data("nick") + " (" + _list.data("uin") + ") 为管理员吗？");
            if (set == 1) {
                cgi.setAdmin({
                    u: _list.data("uin"),
                    op: 1
                }, function(d) {
                    cgi.cgiSuccess(d, "setAdmin");
                    if (d.ec == 0) {
                        _this.removeClass('setting').addClass('admin').attr("title", "管理员");
                        $("#admin-count").html(parseInt($("#admin-count").html()) + 1);
                        //G.memberData.items[_i]["indentity"] = "admin";
                        items[_i]["indentity"] = "admin";
                    } else {
                        cgi.postErr(d);
                    }
                }, cgi.postErr);
            }
        });
        //取消管理员
        $(document).on("click", "[data-setadmin='owner'].admin", function(e) {
            var items;
            if (G.officemode == "0")
                items = G.memberData.items;
            else
                items = G.memberData.office_items;

            if (!G.eventListener("offSetAdmin-listButton", "click")) {
                return false;
            }
            var _this = $(this);
            var _list = _this.closest("[data-nick]");
            var _i = _list.data("i");
            var set = client.setAdminMsgBox("提示", "确定要取消 " + _list.data("nick") + " (" + _list.data("uin") + ") 的管理员资格吗？");
            if (set == 1) {
                cgi.setAdmin({
                    u: _list.data("uin"),
                    op: 0
                }, function(d) {
                    cgi.cgiSuccess(d, "offSetAdmin");
                    if (d.ec == 0) {
                        _this.removeClass('admin').addClass('setting').attr("title", "设置为管理员");
                        $("#admin-count").html(parseInt($("#admin-count").html()) - 1);
                        //G.memberData.items[_i]["indentity"] = "";
                        items[_i]["indentity"] = "";
                    }
                });
            }
        });
        //删除成员
        $(document).on("click", "[data-del-user]", function(e) {
            void 0;
            if (!G.eventListener("delUser-listbutton", "click")) {
                return false;
            }
            var uin = $(this).data("del-user");
            client.delMember(uin);
        });
       
        //无障碍,键盘上下键切换
        $(document).on("keydown", function(e) {
            var cur = $("#member-list-focus");
            if (e.keyCode == 38) { //键盘键上
                var _cur = $("#member-tbody [data-member-list]").last();
                if (cur.size() < 1) {
                    _cur.attr("id", "member-list-focus").addClass('hover').focus();
                } else {
                    cur.removeClass('hover').removeAttr("id");
                    var pre = cur.prev();
                    if (pre.size() > 0) {
                        pre.attr("id", "member-list-focus").addClass('hover').focus();
                    } else {
                        $("#member-tbody").focus();
                    }
                }
                report.monitor([470344], true);
            } else if (e.keyCode == 40) { //键盘键下
                var _cur = $("#member-tbody [data-member-list]").first();
                if (cur.size() < 1) {
                    _cur.attr("id", "member-list-focus").addClass('hover').focus();
                } else {
                    cur.removeClass('hover').removeAttr("id");
                    var next = cur.next();
                    if (next.size() > 0) {
                        next.attr("id", "member-list-focus").addClass('hover').focus();
                    } else {
                        $("#member-tbody").focus();
                    }
                }
                report.monitor([470344], true);
            } else if ($(e.target).is('input')) {
                //> 屏蔽焦点在AIO的情况
            } else if (e.keyCode == 36) { //home
                $("#adminnum-info").focus();
            } else if (e.keyCode == 35) { //end
                $("#member-tbody").focus();
            } else if (e.keyCode == 13) {
                var focus = $("#member-list-focus");
                if (focus.size() > 0) {
                    var uin = focus.data("member-list");
                    client.sendMsgToGroupMem(uin);
                }
            }
        });
        //移除滚动条
        client.common.removeLoad();
    };


    //表头填充
    var loadThead = function() {
        var noofficeMode = G.officemode == "0";
        if (noofficeMode) {
            if (G.classHomeSchool == true) {
                $("#member-thead").html(tmplHomeschoolMemberThead(G.memberData));
            } else {
                $("#member-thead").html(tmplMemberThead(G.memberData));
            }
        } else {
            $("#member-thead").html(tmplOfficeMemberThead(G.memberData));
        }
        //点击排序
        resort();
        //等级规则
        if (!G.event_gradeHelpClick && noofficeMode) {
            $("#gradeHelp").click(function(e) {
                if (!G.eventListener("levelHelp-theadList", "click")) {
                    return false;
                }
                window.open("http://kf.qq.com/menu/227_1.html");
                return false;
            });
            G.event_gradeHelpClick = true;
        }
        //编辑等级
        if (!G.event_editGradeClick && noofficeMode) {
            $("#editGrade").click(function(e) {
                if (!G.eventListener("editLevel-theadList", "click")) {
                    return false;
                }
                var url = 'http://qinfo.clt.qq.com/qinfo_v3/grade.html#groupuin=' + G.gc;
                var params = {
                    appId: 10001016,
                    width: 635,
                    height: 480,
                    title: config.msg.tag.leveltitle,
                    url: url,
                    singletonId: 'group_member_level_' + G.gc
                };
                client.common.popNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);
                return false;
            });
            G.event_editGradeClick = true;
        }
        //编辑标签
        if (!G.event_eiditLabelClick && noofficeMode) {
            $("#eiditLabel").click(function(e) {
                label.hideMenu();
                status.hideMenu();
                if (!G.eventListener("editLabel-theadList", "click")) {
                    return false;
                }
                var url = 'http://qinfo.clt.qq.com/group_member_tags/index.html?groupuin=' + G.gc;
                var params = {
                    appId: 10001016,
                    width: 310,
                    height: 340,
                    title: '群成员标签编辑',
                    url: url,
                    singletonId: 'group_member_tags_' + G.gc
                };
                client.common.popNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);
                return false;
            });
            G.event_eiditLabelClick = true;
        }
        //member-tbody权限填充
        var $memberTbody = $("#member-tbody");
        if (!$memberTbody.hasClass(G.selfIndentity)) {
            $memberTbody.addClass(G.selfIndentity);
        }
        //家校模式
        if (G.classHomeSchool == true) {
            $memberTbody.addClass('homeschool');
        }
        //是否显示标签
        var _isLabel = (G.selfIndentity == "owner" || G.selfIndentity == "admin") && G.memberData.labelflag == "1";
        if (!_isLabel) {
            if (!$("#member-box").hasClass('noLabel')) {
                $("#member-box").addClass('noLabel');
            }
        } else {
            $("#member-box").removeClass('noLabel');
        }
        //不良记录
        if ((G.selfIndentity == "owner" || G.selfIndentity == "admin") && G.memberData.blackusers > 0) {
            G.memberData.blackMod = true;
            var blackuser = $("#member-control").find('[data-blackuser="true"]');
            //工具条显示不良成员操作入口
            blackuser.show();
            //显示不良成员数量
            $("#blackuser-count").html(G.memberData.blackusers);
            //显示不良成员
            if (!G.event_blackuserClick) {
                blackuser.on("click", function() {
                    if (!G.eventListener("blackuser-toolbarBtn", "click")) {
                        return false;
                    }
                    $("#member-control").hide();
                    $("#member-control-blackuser").show();
                    G.memberData.backitems = G.memberData.items;
                    G.memberData.items = G.memberData.blackitems;
                    G.memberData.blackMod = false;
                    //重置滚动条
                    $("#member-tbody").scrollTop(0);
                    //重载数据
                    loadTbody(true);
                });
                G.event_blackuserClick = true;
            }
            //进入不良成员列表后返回
            if (!G.event_blackuserreturnClick) {
                $("#blackuser-return").on("click", function() {
                    $("#member-control").show();
                    $("#member-control-blackuser").hide();
                    G.memberData.items = G.memberData.backitems;
                    G.memberData.backitems = [];
                    G.memberData.blackMod = true;
                    //重置滚动条
                    $("#member-tbody").scrollTop(0);
                    //重载数据
                    loadTbody(true);
                });
                G.event_blackuserreturnClick = true;
            }
        }
    };

    //列表填充
    var loadTbody = function(ref) {
        var memberTbody = $("#member-tbody");
        var reload = function() {
            window.timeScope.memberListLoadStart = new Date().getTime() //准备拉取客户端成员数据;
            var items;
            if (G.officemode == "0")
                items = G.memberData.items;
            else
                items = G.memberData.office_items;
            var li = "",
                html = "",
                i = 0,
                len = items.length;
            memberTbody.empty();
            for (; i < len; i++) {
                var qq = items[i].qq;
                var listOne = "";
                if (G.officemode == "0") {
                    if (G.classHomeSchool == true) {
                        listOne = tmplHomeschoolListOne({
                            i: i,
                            data: G.memberData,
                            version : exitGroupVersion,
                            util: util,
                            client: client
                        });
                    } else {

                        listOne = tmplListOne({
                            i: i,
                            data: G.memberData,
                            version : exitGroupVersion,
                            util: util,
                            client: client
                        });
                    }
                } else {
                    listOne = tmplOfficeListOne({
                        i: i,
                        data: G.memberData,
                        version : exitGroupVersion,
                        util: util,
                        client: client
                    });
                }
                if (i < 20) {
                    li = tmplListBox({
                        qq: qq,
                        i: i,
                        cgiready: "ready",
                        listOne: listOne
                    });
                    memberTbody.append(li);
                } else if (i > 19 && qq == G.selfUin) {
                    //填充夹层数据
                    memberTbody.append(html);
                    //清空夹层数据
                    html = '';
                    //插入当前条
                    li = tmplListBox({
                        qq: qq,
                        i: i,
                        cgiready: "ready",
                        listOne: listOne
                    });
                    memberTbody.append(li);
                } else {
                    html += tmplListBox({
                        qq: qq,
                        i: i,
                        cgiready: "unready",
                        listOne: ""
                    });
                }
            }
            memberTbody.append(html);
            //列表更新
            listUpdate();
            window.timeScope.memberListLoadEnd = new Date().getTime();
        };
        //列表填充，满足2条件（客户端数据获取失败，手工重载）
        if (!(client.getAllMember()) || ref) {
            G.memberData.isListViewLoad = true;
            reload();
            G.memberData.isListViewLoad = false;
        }
        //绑定scroll事件
        if (!G.event_memberTbodyOff) {
            memberTbody.off("scroll").on("scroll", (function() {
                listPageView();
            }));
            G.event_memberTbodyOff = true;
        }
        //渲染当前视觉屏数据
        listPageView();
        //无障碍
        if (!G.event_memberTbodyFindFocus) {
            memberTbody.find("[data-member-list]").focus(function(e) {
                //获得行焦点
                $("#member-list-focus").removeClass('hover').removeAttr("id");
                $(this).attr("id", "member-list-focus").addClass('hover');
                //复制右键菜单
                //$(this).find(".menu").html($("#barMenu").html());
            });
            G.event_memberTbodyFindFocus = true;
        }
    };


    return {
        init: init,
        sortByIndentity: sortByIndentity,
        setFace: setFace,
        loadThead: loadThead,
        loadTbody: loadTbody,
        resort: resort,
        listPageView: listPageView,
        listUpdate: listUpdate,
        isEditCard: isEditCard,
        lastTimeMsg: lastTimeMsg
    };

})();
},{"../../lib/config":3,"../../lib/report":4,"../../lib/util":6,"./card":7,"./cgi":8,"./client":9,"./content-menu":10,"./label":11,"./status":14,"./tmpl/homeschool-member-list-one":16,"./tmpl/homeschool-member-thead":17,"./tmpl/member-list-box":19,"./tmpl/member-list-one":20,"./tmpl/member-thead":21,"./tmpl/office-member-list-one":22,"./tmpl/office-member-thead":23}],14:[function(require,module,exports){
'use strict';

var cgi = require('./cgi'),
    report = require('../profile/report');

module.exports = (function() {

    var memberBox = $("#member-box");
    var hideMenu = function() {
        $("#member-list-status-focus").removeClass('focus').removeAttr("id");
    };
    var eventBin = function() {
        var bodyHeight = $("#member-box").height();
        //下拉
        memberBox.on("click", "[data-status]", function(e) {
            var ul = $(this).find("ul");
            //没有标签项
            ul = $(this).find("ul");
            //显示下拉
            if ($(this).hasClass('focus')) {
                hideMenu();
            } else {
                hideMenu();
                $(this).attr("id", "member-list-status-focus").addClass('focus');
            }
            //菜单翻转
            ul = $(this).find("ul");
            var top = ul.offset().top,
                height = ul.height();
            if (top + height > bodyHeight) {
                ul.css("top", -height);
            }
            return false;
        });
        //标签修改
        memberBox.on("click", "[data-status-id]", function(e) {
            var _this = $(this);
            var list = $("#member-list-focus");
            var statusid = _this.data("status-id");
            var qq = list.data("member-list");
            _this.parent().children("li").removeClass("focus");
            cgi.setStatus({
                target_uin: qq,
                identity: statusid
            }, function(d) {
                if (d.retcode == 0) {
                    list.find("[data-status-txt]").html(_this.text());
                    _this.addClass('focus');
                    G.memberData.items[parseInt(list.data("i"))].statusid = statusid;
                    report.jx({
                        'module': 'capacity',
                        'action': 'other',
                        'obj3': statusid
                    });
                } else {
                    //错误信息跟旧版本的cgi规格好像不一致，这个通用错误处理估计用不上这条cgi
                    cgi.postErr(d);
                }
            }, cgi.postErr);
        });
        //隐藏菜单
        $(document).click(function() {
            hideMenu();
        });
    };


    return {
        eventBin: eventBin,
        hideMenu: hideMenu
    };

})();
},{"../profile/report":28,"./cgi":8}],15:[function(require,module,exports){
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
__p += '<ul class="context-list" tabindex="0" aria-label="功能菜单">\r\n    ';
if(G.selfUin!=qq){;
__p += '\r\n        <li data-menuid="send" role="option" tabindex="0" aria-label="发送消息"><span>发送消息</span></li>\r\n    ';
};
__p += '\r\n    <li data-menuid="view" role="option" tabindex="0" aria-label="' +
((__t = (G.officemode == '1' ? '打开群名片' : '查看资料')) == null ? '' : __t) +
'"><span>' +
((__t = (G.officemode == '1' ? '打开群名片' : '查看资料')) == null ? '' : __t) +
'</span></li>\r\n    ';
if(!isfriend){;
__p += '\r\n    <li data-menuid="add" role="option" tabindex="0" aria-label="加为好友"><span>加为好友</span></li>\r\n    ';
};
__p += '\r\n    ';
if(G.selfUin!=qq){;
__p += '\r\n        ';
if((G.selfIndentity=="owner") || (G.selfIndentity=="admin" && items[i].indentity=="")){;
__p += '\r\n            <li ';
if(shut){;
__p += 'class="hide"';
};
__p += ' role="option" tabindex="-1" class="gag" aria-label="禁言"><span>禁言</span>\r\n                <ul id="secMenu" class="context-menu context-sec-menu">\r\n                    ';

                        for(var i = 0,l=menu.length;i<l;i++){
                            var item = menu[i];
                    ;
__p += '\r\n                        <li data-menuid="gag" data-time="' +
__e(item.seconds) +
'" aria-label="禁言' +
__e(item.text) +
'" tabindex="0" role="option"><span data-time="' +
__e(item.seconds) +
'">' +
__e(item.text) +
'</span></li>\r\n                    ';
};
__p += '\r\n                    ';
if(version >= 5383){;
__p += '\r\n                        <li data-menuid="gag" data-time="auto" aria-label="自定义禁言时长" tabindex="0" role="option"><span data-time="auto">自定义时长</span></li>\r\n                    ';
};
__p += '\r\n                </ul>\r\n            </li>\r\n        \r\n            <li ';
if(!shut){;
__p += 'class="hide"';
};
__p += ' data-menuid="ungag" role="option" tabindex="0" class="gag" aria-label="解除禁言"><span>解除禁言</span>\r\n\r\n        ';
};
__p += '\r\n        <li data-menuid="shield" role="option" tabindex="0" class="' +
((__t = (shield)) == null ? '' : __t) +
'" aria-label="屏蔽此人发言"><span>屏蔽此人发言</span></li>\r\n        <li data-menuid="jubao" role="option" tabindex="0" aria-label="举报此用户"><span>举报此用户</span></li>\r\n    ';
};
__p += '\r\n</ul>';

}
return __p
}
},{}],16:[function(require,module,exports){
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
__p += '\r\n';

var items = data.items;
var qq=items[i].qq,
    face=data.face || {},
    label=data.label || {},
    labelid=data.labelid || {},
    tag_info=data.tag_info || {},
    shutup_list=data.shutup_list || {},
    friends=data.friends || {},
    status=data.status || {},
    levelname=data.levelname || {};
//
var _setting="";
//当前页面用户为超级管理员，并且当前记录是普通用户
if(G.selfIndentity=='owner' && items[i].indentity==''){
    _setting="setting";
}
//头像
var _face="http://3.url.cn/qun/clt/qinfo/member/img/auto.png";
if(face[qq]){
    _face=face[qq];
}
//管理员类型
var indentity="";
if(items[i].indentity=="owner"){
    indentity="群主";
    
}else if(items[i].indentity=="admin"){
    indentity="管理员";
}
if(G.selfIndentity=='owner' && items[i].indentity==''){
    indentity="设置为管理员";
}
//标签
var _labelid=labelid?labelid[qq]:"",
    _label=label[qq]?label[qq]:"";
//身份
var _stautsid = items[i].statusid?items[i].statusid:'0',
    _stauts = items[i].statusid?status[items[i].statusid]:'未选择';
//等级，注：只有客户端数据有items[i]["levelname"]
var _levelName=items[i]["levelname"] || levelname["lvln"+items[i].levelid];
//是否被屏蔽
var shielded="",dataShield="false";
if(client.getIsShieldGroupMem(qq)){
    shielded="show";
    dataShield="true";
}
//被禁言
var _time=items[i].times;
if(shutup_list[qq]){
    _time=util.getShutTime(shutup_list[qq])+"后解禁";
}
//是否是好友关系
var _isfriends=false;
if(friends[qq] || qq==G.selfUin){
    _isfriends=true;
}
;
__p += '\r\n<div id="list-' +
((__t = (qq)) == null ? '' : __t) +
'" data-isfriends="' +
((__t = (_isfriends)) == null ? '' : __t) +
'" data-i="' +
((__t = (i)) == null ? '' : __t) +
'" data-shield="' +
((__t = (dataShield)) == null ? '' : __t) +
'" data-nick="' +
((__t = (G.codeFilter(items[i].nick).replace('"','＂'))) == null ? '' : __t) +
'" data-uin="' +
((__t = (qq)) == null ? '' : __t) +
'" data-indentity="' +
((__t = (items[i].indentity)) == null ? '' : __t) +
'" data-blackuser="' +
((__t = (G.memberData.blackMod==true?items[i].blackuser:0)) == null ? '' : __t) +
'"><input class="hidefocus" size="1" type="text" id="hidefocus2-' +
((__t = (qq)) == null ? '' : __t) +
'" tabindex="-1"/>\r\n    <div class="ico"><button data-setadmin="' +
((__t = (G.selfIndentity)) == null ? '' : __t) +
'" class="' +
((__t = (items[i].indentity)) == null ? '' : __t) +
' ' +
((__t = (_setting)) == null ? '' : __t) +
'" title="' +
((__t = (indentity)) == null ? '' : __t) +
'" aria-label="' +
((__t = (indentity)) == null ? '' : __t) +
'"></button></div>\r\n    <div class="nick"><img id="member-face-' +
((__t = (qq)) == null ? '' : __t) +
'" src="' +
((__t = (_face)) == null ? '' : __t) +
'"/><img class="shielded ' +
((__t = (shielded)) == null ? '' : __t) +
'" src="http://3.url.cn/qun/clt/qinfo/member/img/shield.png" alt=""><span class="txt">' +
((__t = (G.codeFilter(items[i].nick))) == null ? '' : __t) +
'</span><span class="blackuser" title="不良记录成员">!</span></div>\r\n    <div class="status label">\r\n        <div data-status="' +
((__t = (_stautsid)) == null ? '' : __t) +
'">\r\n            <div data-status-txt="true">' +
((__t = (_stauts)) == null ? '' : __t) +
'</div>\r\n            <ul>\r\n                ';

                var key,focus="";
                for(key in status){
                    if(items[i].statusid==key){
                        focus="focus";
                    }else{
                        focus="";
                    }
                ;
__p += '\r\n                <li class="' +
((__t = (focus)) == null ? '' : __t) +
'" data-status-id="' +
((__t = (key)) == null ? '' : __t) +
'">' +
((__t = (status[key])) == null ? '' : __t) +
'</li>\r\n                ';
};
__p += '\r\n            </ul>\r\n            <i></i>\r\n        </div>\r\n    </div>\r\n    <div class="card"><span class="txt" id="nick-txt-' +
((__t = (qq)) == null ? '' : __t) +
'">' +
((__t = (G.codeFilter(items[i].card))) == null ? '' : __t) +
'</span><input name="nick-input" type="text" maxlength="60" id="nick-input-' +
((__t = (qq)) == null ? '' : __t) +
'" value="' +
((__t = (G.codeFilter(items[i].card))) == null ? '' : __t) +
'" aria-label="请输入要修改的群名片" tabindex="-1"/></div>\r\n    ';
if((G.selfIndentity=="owner" || G.selfIndentity=="admin") && G.memberData.labelflag=="1"){;
__p += '\r\n    <div class="label">\r\n        <div data-label="' +
((__t = (_labelid)) == null ? '' : __t) +
'">\r\n            <div data-label-txt="true">' +
((__t = (_label)) == null ? '' : __t) +
'</div>\r\n            <ul>\r\n                ';

                var key,focus="";
                for(key in tag_info){
                    if(items[i].labelid==key){
                        focus="focus";
                    }else{
                        focus="";
                    }
                ;
__p += '\r\n                <li class="' +
((__t = (focus)) == null ? '' : __t) +
'" data-label-id="' +
((__t = (key)) == null ? '' : __t) +
'">' +
((__t = (tag_info[key])) == null ? '' : __t) +
'</li>\r\n                ';
};
__p += '\r\n                <li class="" data-label-id="-1">&nbsp;</li>\r\n            </ul>\r\n            <i></i>\r\n        </div>\r\n    </div>\r\n    ';
};
__p += '\r\n    <div class="levelname" data-level="lvln' +
((__t = (items[i].levelid)) == null ? '' : __t) +
'">' +
((__t = (_levelName)) == null ? '' : __t) +
'（' +
((__t = (items[i].point)) == null ? '' : __t) +
'）</div>\r\n    <div class="time" data-time="' +
((__t = (items[i].times)) == null ? '' : __t) +
'">' +
((__t = (_time)) == null ? '' : __t) +
'</div>\r\n    <div class="tool">\r\n        ';

        if(G.selfUin==items[i].qq || G.selfIndentity=='owner' || (G.selfIndentity=='admin' && items[i].indentity!="owner")){
        ;
__p += '\r\n        <button data-card="edit" data-qq="' +
((__t = (qq)) == null ? '' : __t) +
'" class="edit-card" title="修改群名片" aria-label="修改群名片"></button>\r\n        ';
};
__p += '\r\n        <button data-user-detail="' +
((__t = (qq)) == null ? '' : __t) +
'" class="user-detail" href="#" title="' +
((__t = (G.officemode == '1' ? '打开群名片' : '查看资料')) == null ? '' : __t) +
'" aria-label="' +
((__t = (G.officemode == '1' ? '打开群名片' : '查看资料')) == null ? '' : __t) +
'"></button>\r\n        ';

        if(G.selfUin!=items[i].qq && (G.selfIndentity=='owner' || (G.selfIndentity=='admin' && items[i].indentity==''))){
        ;
__p += '\r\n        <button data-del-user="' +
((__t = (qq)) == null ? '' : __t) +
'" class="del-user" href="#" title="从本群中移除" aria-label="从本群中移除"></button>\r\n        ';
};
__p += '\r\n        ';

        if(G.selfUin==items[i].qq && G.version >= version){
        ;
__p += '        \r\n        <button data-exit-group="' +
((__t = (G.selfUin)) == null ? '' : __t) +
'" class="exit-group" title="';
if(G.selfIndentity=='owner'){;
__p += '解散该群';
}else{;
__p += '退出该群';
};
__p += '" aria-label="';
if(G.selfIndentity=='owner'){;
__p += '解散该群';
}else{;
__p += '退出该群';
};
__p += '"></button>\r\n        ';
};
__p += '        \r\n    </div>\r\n    <div class="menu"></div>\r\n</div>';

}
return __p
}
},{}],17:[function(require,module,exports){
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
__p += '<ul class="member-thead ' +
((__t = (G.selfIndentity)) == null ? '' : __t) +
' homeschool" id="member-thead">\r\n    <li class="role" data-record="indentity" data-sort=""><span>头像</span><i class="sort"></i></li>\r\n    <li class="nick" data-record="nick"><span>成员</span><i class="sort"></i></li>\r\n    <li class="status" data-record="status"><span>身份</span><i class="sort"></i></li>\r\n    <li class="card" data-record="card"><span>群名片</span><i class="sort"></i></li>\r\n    ';
if((G.selfIndentity=="owner" || G.selfIndentity=="admin") && G.memberData.labelflag=="1"){;
__p += '\r\n    <li class="label" data-record="labelid"><span>标签</span><i class="sort"></i><a id="eiditLabel" class="edit" href="javascript:void(0);" title="编辑标签" aria-label="编辑标签"></a></li>\r\n    ';
};
__p += '\r\n    <li class="levelname" data-record="levelid"><span>等级积分</span><i class="sort"></i>';
if(G.selfIndentity=="owner" || G.selfIndentity=="admin"){;
__p += '<a id="editGrade" class="edit" href="#" title="编辑等级" aria-label="编辑等级"></a>';
};
__p += '<a id="gradeHelp" class="help" href="javascript:void(0);" title="等级规则" aria-label="等级规则" tabindex="-1"></a></li>\r\n    <li class="time" data-record="times"><span>最后发言</span><i class="sort"></i></li>\r\n</ul>';

}
return __p
}
},{}],18:[function(require,module,exports){
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
__p += '<ul>\r\n    ';

    var key,focus="";
    for(key in G.memberData.tag_info){
        if(labelid==key){
            focus="focus";
        }else{
            focus="";
        }
    ;
__p += '\r\n    <li class="' +
((__t = (focus)) == null ? '' : __t) +
'" data-label-id="' +
((__t = (key)) == null ? '' : __t) +
'">' +
((__t = (G.memberData.tag_info[key])) == null ? '' : __t) +
'</li>\r\n    ';
};
__p += '\r\n    <li class="" data-label-id="-1">&nbsp;</li>\r\n</ul>';

}
return __p
}
},{}],19:[function(require,module,exports){
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
__p += '<li data-member-list="' +
((__t = (qq)) == null ? '' : __t) +
'" data-i="' +
((__t = (i)) == null ? '' : __t) +
'" data-cgi="' +
((__t = (cgiready)) == null ? '' : __t) +
'" tabindex="0"><input class="hidefocus" size="1" type="text" id="hidefocus-' +
((__t = (qq)) == null ? '' : __t) +
'" tabindex="-1"/>' +
((__t = (listOne)) == null ? '' : __t) +
'</li>';

}
return __p
}
},{}],20:[function(require,module,exports){
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
__p += '\r\n';

var items = data.items;
var qq=items[i].qq,
    face=data.face || {},
    label=data.label || {},
    labelid=data.labelid || {},
    tag_info=data.tag_info || {},
    shutup_list=data.shutup_list || {},
    friends=data.friends || {},
    levelname=data.levelname || {};
//
var _setting="";
//当前页面用户为超级管理员，并且当前记录是普通用户
if(G.selfIndentity=='owner' && items[i].indentity==''){
    _setting="setting";
}
//头像
var _face="http://3.url.cn/qun/clt/qinfo/member/img/auto.png";
if(face[qq]){
    _face=face[qq];
}
//管理员类型
var indentity="";
if(items[i].indentity=="owner"){
    indentity="群主";
    
}else if(items[i].indentity=="admin"){
    indentity="管理员";
}
if(G.selfIndentity=='owner' && items[i].indentity==''){
    indentity="设置为管理员";
}
//标签
var _labelid=labelid?labelid[qq]:"",
    _label=label[qq]?label[qq]:"";
//等级，注：只有客户端数据有items[i]["levelname"]
var _levelName=items[i]["levelname"] || levelname["lvln"+items[i].levelid];
//是否被屏蔽
var shielded="",dataShield="false";
if(client.getIsShieldGroupMem(qq)){
    shielded="show";
    dataShield="true";
}
//被禁言
var _time=items[i].times;
if(shutup_list[qq]){
    _time=util.getShutTime(shutup_list[qq])+"后解禁";
}
//是否是好友关系
var _isfriends=false;
if(friends[qq] || qq==G.selfUin){
    _isfriends=true;
}
;
__p += '\r\n<div id="list-' +
((__t = (qq)) == null ? '' : __t) +
'" data-isfriends="' +
((__t = (_isfriends)) == null ? '' : __t) +
'" data-i="' +
((__t = (i)) == null ? '' : __t) +
'" data-shield="' +
((__t = (dataShield)) == null ? '' : __t) +
'" data-nick="' +
((__t = (G.codeFilter(items[i].nick).replace('"','＂'))) == null ? '' : __t) +
'" data-uin="' +
((__t = (qq)) == null ? '' : __t) +
'" data-indentity="' +
((__t = (items[i].indentity)) == null ? '' : __t) +
'" data-blackuser="' +
((__t = (G.memberData.blackMod==true?items[i].blackuser:0)) == null ? '' : __t) +
'"><input class="hidefocus" size="1" type="text" id="hidefocus2-' +
((__t = (qq)) == null ? '' : __t) +
'" tabindex="-1"/>\r\n    <div class="ico"><button data-setadmin="' +
((__t = (G.selfIndentity)) == null ? '' : __t) +
'" class="' +
((__t = (items[i].indentity)) == null ? '' : __t) +
' ' +
((__t = (_setting)) == null ? '' : __t) +
'" title="' +
((__t = (indentity)) == null ? '' : __t) +
'" aria-label="' +
((__t = (indentity)) == null ? '' : __t) +
'"></button></div>\r\n    <div class="nick"><img id="member-face-' +
((__t = (qq)) == null ? '' : __t) +
'" src="' +
((__t = (_face)) == null ? '' : __t) +
'"/><img class="shielded ' +
((__t = (shielded)) == null ? '' : __t) +
'" src="http://3.url.cn/qun/clt/qinfo/member/img/shield.png" alt=""><span class="txt">' +
((__t = (G.codeFilter(items[i].nick))) == null ? '' : __t) +
'</span><span class="blackuser" title="不良记录成员">!</span></div>\r\n    <div class="card"><span class="txt" id="nick-txt-' +
((__t = (qq)) == null ? '' : __t) +
'">' +
((__t = (G.codeFilter(items[i].card))) == null ? '' : __t) +
'</span><input name="nick-input" type="text" maxlength="60" id="nick-input-' +
((__t = (qq)) == null ? '' : __t) +
'" value="' +
((__t = (G.codeFilter(items[i].card))) == null ? '' : __t) +
'" aria-label="请输入要修改的群名片" tabindex="-1"/></div>\r\n    ';
if((G.selfIndentity=="owner" || G.selfIndentity=="admin") && G.memberData.labelflag=="1"){;
__p += '\r\n    <div class="label">\r\n        <div data-label="' +
((__t = (_labelid)) == null ? '' : __t) +
'">\r\n            <div data-label-txt="true">' +
((__t = (_label)) == null ? '' : __t) +
'</div>\r\n            <ul>\r\n                ';

                var key,focus="";
                for(key in tag_info){
                    if(items[i].labelid==key){
                        focus="focus";
                    }else{
                        focus="";
                    }
                ;
__p += '\r\n                <li class="' +
((__t = (focus)) == null ? '' : __t) +
'" data-label-id="' +
((__t = (key)) == null ? '' : __t) +
'">' +
((__t = (tag_info[key])) == null ? '' : __t) +
'</li>\r\n                ';
};
__p += '\r\n                <li class="" data-label-id="-1">&nbsp;</li>\r\n            </ul>\r\n            <i></i>\r\n        </div>\r\n    </div>\r\n    ';
};
__p += '\r\n    <div class="levelname" data-level="lvln' +
((__t = (items[i].levelid)) == null ? '' : __t) +
'">' +
((__t = (_levelName)) == null ? '' : __t) +
'</div>\r\n    <div class="levelpoint">' +
((__t = (items[i].point)) == null ? '' : __t) +
'</div>\r\n    <div class="time" data-time="' +
((__t = (items[i].times)) == null ? '' : __t) +
'">' +
((__t = (_time)) == null ? '' : __t) +
'</div>\r\n    <div class="tool">\r\n        ';

        if(G.selfUin==items[i].qq || G.selfIndentity=='owner' || (G.selfIndentity=='admin' && items[i].indentity!="owner")){
        ;
__p += '\r\n        <button data-card="edit" data-qq="' +
((__t = (qq)) == null ? '' : __t) +
'" class="edit-card" title="修改群名片" aria-label="修改群名片"></button>\r\n        ';
};
__p += '\r\n        <button data-user-detail="' +
((__t = (qq)) == null ? '' : __t) +
'" class="user-detail" href="#" title="' +
((__t = (G.officemode == '1' ? '打开群名片' : '查看资料')) == null ? '' : __t) +
'" aria-label="' +
((__t = (G.officemode == '1' ? '打开群名片' : '查看资料')) == null ? '' : __t) +
'"></button>\r\n        ';

        if(G.selfUin!=items[i].qq && (G.selfIndentity=='owner' || (G.selfIndentity=='admin' && items[i].indentity==''))){
        ;
__p += '\r\n        <button data-del-user="' +
((__t = (qq)) == null ? '' : __t) +
'" class="del-user" href="#" title="从本群中移除" aria-label="从本群中移除"></button>\r\n        ';
};
__p += '\r\n        ';

        if(G.selfUin==items[i].qq && G.version >= version){
        ;
__p += '        \r\n        <button data-exit-group="' +
((__t = (G.selfUin)) == null ? '' : __t) +
'" class="exit-group" title="';
if(G.selfIndentity=='owner'){;
__p += '解散该群';
}else{;
__p += '退出该群';
};
__p += '" aria-label="';
if(G.selfIndentity=='owner'){;
__p += '解散该群';
}else{;
__p += '退出该群';
};
__p += '"></button>\r\n        ';
};
__p += '\r\n    </div>\r\n    <div class="menu"></div>\r\n</div>';

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
__p += '<ul class="member-thead ' +
((__t = (G.selfIndentity)) == null ? '' : __t) +
'" id="member-thead">\r\n    <li class="role" data-record="indentity" data-sort=""><span>头像</span><i class="sort"></i></li>\r\n    <li class="nick" data-record="nick"><span>成员</span><i class="sort"></i></li>\r\n    <li class="card" data-record="card"><span>群名片</span><i class="sort"></i></li>\r\n    ';
if((G.selfIndentity=="owner" || G.selfIndentity=="admin") && G.memberData.labelflag=="1"){;
__p += '\r\n    <li class="label" data-record="labelid"><span>标签</span><i class="sort"></i><a id="eiditLabel" class="edit" href="javascript:void(0);" title="编辑标签" aria-label="编辑标签"></a></li>\r\n    ';
};
__p += '\r\n    <li class="levelname" data-record="levelid"><span>等级</span><i class="sort"></i>';
if(G.selfIndentity=="owner" || G.selfIndentity=="admin"){;
__p += '<a id="editGrade" class="edit" href="#" title="编辑等级" aria-label="编辑等级"></a>';
};
__p += '<a id="gradeHelp" class="help" href="javascript:void(0);" title="等级规则" aria-label="等级规则" tabindex="-1"></a></li>\r\n    <li class="levelpoint" data-record="point"><span>等级积分</span><i class="sort"></i></li>\r\n    <li class="time" data-record="times"><span>最后发言</span><i class="sort"></i></li>\r\n</ul>';

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
__p += '\r\n';

var items = data.office_items;
var qq=items[i].qq,
    face=data.face || {},
    label=data.label || {},
    labelid=data.labelid || {},
    tag_info=data.tag_info || {},
    shutup_list=data.shutup_list || {},
    friends=data.friends || {};
//
var _setting="";
//当前页面用户为超级管理员，并且当前记录是普通用户
if(G.selfIndentity=='owner' && items[i].indentity==''){
    _setting="setting";
}
//头像
var _face="http://3.url.cn/qun/clt/qinfo/member/img/auto.png";
if(face[qq]){
    _face=face[qq];
}
//管理员类型
var indentity="";
if(items[i].indentity=="owner"){
    indentity="群主";
    
}else if(items[i].indentity=="admin"){
    indentity="管理员";
}
if(G.selfIndentity=='owner' && items[i].indentity==''){
    indentity="设置为管理员";
}
//是否被屏蔽
var shielded="",dataShield="false";
if(client.getIsShieldGroupMem(qq)){
    shielded="show";
    dataShield="true";
}
//是否是好友关系
var _isfriends=false;
if(friends[qq] || qq==G.selfUin){
    _isfriends=true;
}
;
__p += '\r\n<div id="list-' +
((__t = (qq)) == null ? '' : __t) +
'" data-isfriends="' +
((__t = (_isfriends)) == null ? '' : __t) +
'" data-i="' +
((__t = (i)) == null ? '' : __t) +
'" data-shield="' +
((__t = (dataShield)) == null ? '' : __t) +
'" data-nick="' +
((__t = (G.codeFilter(items[i].nick).replace('"','＂'))) == null ? '' : __t) +
'" data-card="' +
((__t = (G.codeFilter(items[i].card))) == null ? '' : __t) +
'" data-uin="' +
((__t = (qq)) == null ? '' : __t) +
'" data-indentity="' +
((__t = (items[i].indentity)) == null ? '' : __t) +
'" data-blackuser="' +
((__t = (G.memberData.blackMod==true?items[i].blackuser:0)) == null ? '' : __t) +
'">\r\n    <div class="ico"><button data-setadmin="' +
((__t = (G.selfIndentity)) == null ? '' : __t) +
'" class="' +
((__t = (items[i].indentity)) == null ? '' : __t) +
' ' +
((__t = (_setting)) == null ? '' : __t) +
'" title="' +
((__t = (indentity)) == null ? '' : __t) +
'" aria-label="' +
((__t = (indentity)) == null ? '' : __t) +
'"></button></div>\r\n    <div class="office_card">\r\n        <img id="member-face-' +
((__t = (qq)) == null ? '' : __t) +
'" src="' +
((__t = (_face)) == null ? '' : __t) +
'"/>\r\n        <img class="shielded ' +
((__t = (shielded)) == null ? '' : __t) +
'" src="http://3.url.cn/qun/clt/qinfo/member/img/shield.png" alt=""/>\r\n        <span class="txt" id="office_card-txt-' +
((__t = (qq)) == null ? '' : __t) +
'">' +
((__t = (items[i].card.length == 0 ? G.codeFilter(items[i].nick):G.codeFilter(items[i].card))) == null ? '' : __t) +
'</span>\r\n\t\t<input name="office_card-input" type="text" maxlength="60" id="office_card-input-' +
((__t = (qq)) == null ? '' : __t) +
'" value="' +
((__t = (G.codeFilter(items[i].card))) == null ? '' : __t) +
'" aria-label="请输入要修改的群名片" tabindex="-1"/>\r\n        <span class="blackuser" title="不良记录成员">!</span>\r\n    </div>\r\n    <div class="office_tel">\r\n\t\t<span class="txt" id="office_tel-txt-' +
((__t = (qq)) == null ? '' : __t) +
'">' +
((__t = (G.codeFilter(items[i].tel))) == null ? '' : __t) +
'</span>\r\n\t\t<input name="office_position-input" type="text" maxlength="60" id="office_tel-input-' +
((__t = (qq)) == null ? '' : __t) +
'" value="' +
((__t = (G.codeFilter(items[i].tel))) == null ? '' : __t) +
'" aria-label="请输入要修改的电话"/>\r\n\t</div>\r\n    <div class="office_position">\r\n\t\t<span class="txt" id="office_position-txt-' +
((__t = (qq)) == null ? '' : __t) +
'">' +
((__t = (G.codeFilter(items[i].position))) == null ? '' : __t) +
'</span>\r\n\t\t<input name="office_position-input" type="text" maxlength="60" id="office_position-input-' +
((__t = (qq)) == null ? '' : __t) +
'" value="' +
((__t = (G.codeFilter(items[i].position))) == null ? '' : __t) +
'" aria-label="请输入要修改的职位"/>\r\n\t</div>\r\n    <div class="office_gender">\r\n\t\t<span class="txt" id="office_gender-txt-' +
((__t = (qq)) == null ? '' : __t) +
'">' +
((__t = (items[i].gender == 1 ? "女" : items[i].gender == 2 ? "男" : "-")) == null ? '' : __t) +
'</span>\r\n\t\t<input name="office_gender-input" type="text" maxlength="60" id="office_gender-input-' +
((__t = (qq)) == null ? '' : __t) +
'" value="' +
((__t = (items[i].gender == 1 ? "女" : items[i].gender == 2 ? "男" : "-")) == null ? '' : __t) +
'" aria-label="请输入要修改的性别"/>\r\n\t</div>\r\n    <div class="office_tool">\r\n        ';

        if(G.selfUin==items[i].qq || G.selfIndentity=='owner' || (G.selfIndentity=='admin' && items[i].indentity!="owner")){
        ;
__p += '\r\n        <button data-card="edit" data-qq="' +
((__t = (qq)) == null ? '' : __t) +
'" class="edit-card" title="修改群名片" aria-label="修改群名片"></button>\r\n        ';
};
__p += '\r\n    </div>\r\n    <div class="menu"></div>\r\n</div>';

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
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="member-thead ' +
((__t = (G.selfIndentity)) == null ? '' : __t) +
'" id="member-thead">\r\n    <li class="role" data-record="indentity" data-sort=""><span>头像</span><i class="sort"></i></li>\r\n    <li class="office_card" data-record="card"><span>成员</span><i class="sort"></i></li>\r\n    <li class="office_tel" data-record="tel"><span>电话</span><i class="sort"></i></li>\r\n    <li class="office_position" data-record="position"><span>职务</span><i class="sort"></i></li>\r\n    <li class="office_gender" data-record="gender"><span>性别</span><i class="sort"></i></li>\r\n</ul>';

}
return __p
}
},{}],24:[function(require,module,exports){
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


var _flag=false;
if(G.selfUin==group.gOwner){
    _flag=true;
}
var _i=0,_len=group.gAdmins?group.gAdmins.length:0;
for(;_i<_len;_i++){
    if(G.selfUin==group.gAdmins[_i]){
        _flag=true;
    }
}
//管理员人数
var adminTotal = {
    "1": 10, //200人群
    "2": 15, //500
    "3": 15, //1000
    "4": 20  //2000
};
var _adminCount=0,_totalAdmin=0;
if(G.memberData.group["gAdmins"] && !!G.memberData.group["gAdmins"].length){
    _adminCount=G.memberData.group["gAdmins"].length;
}
var ext_num=G.memberData["ext_num"] || 0;
var levelcount=(parseInt(G.memberData.level) || 0) + 5;
_totalAdmin=adminTotal[G.memberData["type"]] > levelcount ? adminTotal[G.memberData["type"]] : levelcount;
_totalAdmin=_totalAdmin+ext_num;
//高级管理
var advManage = 'http://ptlogin2.qq.com/jump?clientuin=' + G.selfUin + '&clientkey='+clientkey.clientKey+'&u1='+encodeURIComponent('http://qun.qq.com/member.html#gid='+G.gc);
;
__p += '\r\n\r\n<li>\r\n    <span id="adminnum-info" tabindex="1" aria-label="管理员信息：已设置管理员人数' +
((__t = (_adminCount)) == null ? '' : __t) +
'；可设置管理员总人数：' +
((__t = (_totalAdmin)) == null ? '' : __t) +
'">管理员：</span><span id="admin-count">' +
((__t = (_adminCount)) == null ? '' : __t) +
'</span><span>/</span><span id="total-admin">' +
((__t = (_totalAdmin)) == null ? '' : __t) +
'</span><span>人</span>\r\n    <a id="adminNumHelp" class="help" href="http://kf.qq.com/faq/120322fu63YV130422yeIR7v.html" target="_blank" title="详情" aria-label="详情"></a>\r\n\t<a style="margin-left:3pt;" href="http://exp.qq.com/ur/?urid=23247" target="_blank" title="点击反馈" aria-label="点击反馈">反馈</a>\r\n    <a data-blackuser="true" href="javascript:void(0);" tabindex="0" title="不良成员" aria-label="不良成员" style="display:none;">不良成员(<span id="blackuser-count">-</span>)</a>\r\n</li>\r\n\r\n<li>\r\n\t<span id="officemode_switch"/>\r\n    <a id="edit-nick" href="javascript:void(0);" title="修改我的群名片" aria-label="修改我的群名片">修改我的群名片</a>\r\n    <a id="moreoptions" class="moreoptions" href="javascript:void(0);" title="更多选项" aria-label="更多选项"></a>\r\n</li>';

}
return __p
}
},{}],25:[function(require,module,exports){
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


var _flag=false;
if(G.selfUin==group.gOwner){
    _flag=true;
}
var _i=0,_len=group.gAdmins?group.gAdmins.length:0;
for(;_i<_len;_i++){
    if(G.selfUin==group.gAdmins[_i]){
        _flag=true;
    }
}
//管理员人数
var adminTotal = {
    "1": 10, //200人群
    "2": 15, //500
    "3": 15, //1000
    "4": 20  //2000
};
var _adminCount=0,_totalAdmin=0;
if(G.memberData.group["gAdmins"] && !!G.memberData.group["gAdmins"].length){
    _adminCount=G.memberData.group["gAdmins"].length;
}
var ext_num=G.memberData["ext_num"] || 0
var levelcount = (parseInt(G.memberData.level) || 0) + 5;
_totalAdmin=adminTotal[G.memberData["type"]] > levelcount ? adminTotal[G.memberData["type"]] : levelcount;
_totalAdmin=_totalAdmin+ext_num;
//高级管理
var advManage = 'http://ptlogin2.qq.com/jump?clientuin=' + G.selfUin + '&clientkey='+clientkey.clientKey+'&u1='+encodeURIComponent('http://qun.qq.com/member.html#gid='+G.gc);
;
__p += '\r\n\r\n<li>\r\n    <span id="adminnum-info" tabindex="1" aria-label="管理员信息：已设置管理员人数' +
((__t = (_adminCount)) == null ? '' : __t) +
'；可设置管理员总人数：' +
((__t = (_totalAdmin)) == null ? '' : __t) +
'">管理员：</span><span id="admin-count">' +
((__t = (_adminCount)) == null ? '' : __t) +
'</span><span>/</span><span id="total-admin">' +
((__t = (_totalAdmin)) == null ? '' : __t) +
'</span><span>人</span>\r\n    <a id="adminNumHelp" class="help" href="http://kf.qq.com/faq/120322fu63YV130422yeIR7v.html" target="_blank" title="详情" aria-label="详情"></a>\r\n    ';
if(_flag){;
__p += '\r\n    <a data-managelog="true" href="javascript:void(0);" tabindex="0" title="管理记录" aria-label="管理记录">管理记录</a>\r\n    ';
};
__p += '\r\n    <a data-blackuser="true" href="javascript:void(0);" tabindex="0" title="不良成员" aria-label="不良成员" style="display:none;">不良成员(<span id="blackuser-count">-</span>)</a>\r\n</li>\r\n\r\n<li>\r\n    ';
if(_flag){;
__p += '\r\n    <a id="advManage" href="' +
((__t = (advManage)) == null ? '' : __t) +
'" target="blank" title="高级管理" aria-label="高级管理">高级管理</a>\r\n    ';
};
__p += '\r\n    <a id="edit-nick" href="javascript:void(0);" title="修改我的群名片" aria-label="修改我的群名片">修改我的群名片</a>\r\n    ';
if(_flag || canAddMenber){;
__p += '\r\n    <a id="add-member" class="add-member" href="javascript:void(0);" title="添加成员" aria-label="添加成员"></a>\r\n    ';
};
__p += '\r\n</li>';

}
return __p
}
},{}],26:[function(require,module,exports){
'use strict';

var util = require('../../lib/util'),
    tmplToolbar = require('./tmpl/toolbar'),
    tmplOfficeToolbar = require('./tmpl/office-toolbar'),
    listHtml = require('./list-html'),
    card = require('./card'),
    client = require('./client'),
    cgi = require('./cgi'),
    config = require('../../lib/config');

module.exports = (function() {


    var init = function() {

        //修改昵称tip（家校群模式第一次进入弹层）
        if (G.classHomeSchool && !util.getCache('first' + G.selfUin)) {
            var ht = $('#homescroll-tip');
            ht.show();
            ht.find('button').on('click', function() {
                util.setCache('first' + G.selfUin, 'true');
                ht.hide();
            });
        } else {
            //util.setCache('first'+G.selfUin,'true');
        }
        //工具条
        G.memberData.clientkey = client.getClientKey();
        G.memberData.canAddMenber = client.getGroupMemberInviteOption();
        if (G.ver == "2" && G.classHomeSchool != true)
            $("#member-control").html(tmplOfficeToolbar(G.memberData));
        else
            $("#member-control").html(tmplToolbar(G.memberData));
        //修改群名片
        card.toolbarEditBtn();

        //添加新成员
        $('#add-member').click(function() {
            if (!G.eventListener("addMember-toolbarBtn", "click")) {
                return false;
            }
            client.openContactSelecter();
        });

        //管理员操作记录
        $("#member-control").on("click", "[data-managelog]", function(e) {
            if (!G.eventListener("adminManageLog-toolbarBtn", "click")) {
                return false;
            }
            var url = 'http://qinfo.clt.qq.com/qinfo_v3/member-log.html#groupuin=' + G.gc;
            var params = {
                appId: 10001016,
                width: 458,
                height: 330,
                title: config.msg.tag.managelog,
                url: url,
                singletonId: 'group_member_level_' + G.gc
            };
            client.common.popNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);
            return false;
        });

        //管理员数量帮助
        $("#adminNumHelp").click(function() {
            if (!G.eventListener("adminNumHelp-toolbarBtn", "click")) {
                return false;
            }
        });
        //高级管理
        $("#advManage").click(function() {
            if (!G.eventListener("advManage-toolbarBtn", "click")) {
                return false;
            }
        });
        //显示更多
        $("#moreoptions").click(function() {
            if (!G.eventListener("moreoptions-toolbarBtn", "click")) {
                return false;
            }
            client.showMoreMenu();
        });

        if (G.selfIndentity == "owner" || G.selfIndentity == "admin") {
            $("#officemode_switch").show();
            Select({
                elId: 'officemode_switch',
                data: [{
                    text: '通讯录模式',
                    value: 1
                }, {
                    text: '普通模式',
                    value: 0
                }],
                onChange: function(val) {
                    if (val.value == 0 && G.officemode == "1") {
                        cgi.closeOfficeMode({}, function(d) {
                            setTimeout(function() {
                                var perf = util.getPerf('set_group_officemode');
                                report.isdPerf(7723, 4, 11, perf);
                            }, 500);
                            // todo
                            G.officemode = "0";
                            client.notifyOfficeModeChange();
                            G.changeMode();
                        }, cgi.postErr);
                    } else if (val.value == 1 && G.officemode == "0") {
                        cgi.openOfficeMode({}, function(d) {
                            setTimeout(function() {
                                var perf = util.getPerf('set_group_officemode');
                                report.isdPerf(7723, 4, 11, perf);
                            }, 500);
                            // todo
                            G.officemode = "1";
                            client.notifyOfficeModeChange();
                            G.changeMode();
                        }, cgi.postErr);
                    }
                },
                initVal: G.officemode
            });
        } else {
            $("#officemode_switch").hide();
        }

        client.onUILoadDone();
    };

    var zIndex = 999;
    var $currSelect;
    var $doc = $(document);

    var Select = function(options) {
        if (!(this instanceof Select)) return new Select(options);

        var wid = options.elId;
        var html = '<span id="' + wid + '-select" class="select">\
                        <input class="select-value" readonly />\
                        <span class="options"></span>\
                    </span>';

        this.elId = options.elId;
        this.onChange = options.onChange || null;
        this.$wrapper = $('#' + options.elId).html(html);
        this.$selectBox = $('#' + options.elId + '-select').css('z-index', zIndex--);
        this.$valIpt = this.$selectBox.find('> input.select-value');
        this.$optionsBox = this.$selectBox.find('> span.options');

        this.curVal = null;
        this.curIndex = 0;
        this.selectedN = 0;
        this.curOpts = [];

        if (options.data) this.render(options.data, options.initVal);

        this.bind();
    };

    var proto = Select.prototype;

    proto.bind = function() {
        var self = this;
        var $box = this.$selectBox;
        var $oBox = this.$optionsBox;

        $box.on('mouseenter', this.focus.bind(this));
        $box.on('mouseleave', function(e) {
            if (!$box.hasClass('active')) $box.removeClass('focus');
        });

        $box.on('click', function(e) {
            e.stopPropagation();

            if (!$box.hasClass('active')) {
                $box.addClass('active');
                $currSelect = self;
            } else {
                $currSelect.blur();
            }
        });

        $box.on('click', '.options > input', function(e) {
            e.stopPropagation();
            self.setVal(this.id.replace(/\D+/, '') >> 0);
        });

        $box.on('mouseenter', '.options > input[readonly]', function(e) {
            e.target.classList.add('hover');
        });
        $box.on('mouseleave', '.options > input[readonly]', function(e) {
            e.target.classList.remove('hover');
        });
    };

    proto.render = function(data, initVal) {
        // [{text: text, value: value}]
        if (!Array.isArray(data)) data = [data];
        this.curOpts = data;

        var s = '';
        var wid = this.elId;
        var index = this.getIndexByVal(initVal);

        data.forEach(function(item, i) {
            s += '<input id="' + wid + '-option-' + i + '" data-val="' + item.value + '" \
                value="' + item.text + '" readonly />';
        });

        this.$optionsBox.html(s);
        this.setVal(index, true);
    };

    proto.focus = function() {
        var box = this.$selectBox;

        if (!box.hasClass('focus')) box.addClass('focus');
    };

    proto.blur = function() {
        var box = this.$selectBox;

        $currSelect = null;

        box.removeClass('active');

        if (box.hasClass('focus')) {
            box.removeClass('focus').removeClass('active');
        }

        // reset
        if (this.selectedN !== this.curIndex) this.select(this.selectedN);
    };

    // this way is bad
    proto.getIndexByVal = function(val) {
        var list = this.curOpts;
        var len = list.length;
        var target;
        var i = 0;

        if (val !== undefined) {
            for (i = 0; i < len; i++) {
                target = list[i];
                if (target.value == val /* || target.text === val*/ ) break;
                else target = null;
            }

            if (!target) i = 0;
        }

        return i;
    };

    proto.select = function(index) {
        var $box = this.$optionsBox;
        var $old = $box.find('> .selected');
        var $target = $('#' + this.elId + '-option-' + index);

        if ($old.length && $old[0].id === $target[0].id) return;

        if ($old.length) $old.removeClass('selected');

        $target.addClass('selected');
        this.$valIpt.val($target.val());

        this.selectedN = index;
    };

    proto.setVal = function(index, notExecChange) {
        var $box = this.$optionsBox;
        var $target = $box.find('#' + this.elId + '-option-' + index);
        var text;
        var val;

        this.select(index);

        this.curIndex = index;
        val = $target.data('val');
        text = $target.val();
        this.curVal = {
            text: text,
            value: val,
            index: index
        };

        // event support
        !notExecChange && this.onChange && this.onChange.call(this, this.curVal);

        this.blur();
    };

    $doc.ready(function() {
        // 全局绑定
        $doc.on('click', function onBodyClick(e) {
            if (!$currSelect) return;

            var box = $currSelect.$selectBox;
            var isActive = box.hasClass('active');

            if (isActive) $currSelect.blur();
            isActive = false;
        });

        // 节流一下
        var timer;
        $doc.on('keyup', function onBodyKeyup(e) {
            if (!$currSelect) return;

            if (timer) clearTimeout(timer);

            timer = setTimeout(function() {
                var code = e.keyCode;
                var idx = $currSelect.selectedN;

                if (!$currSelect.$selectBox.hasClass('active') || !code) return;

                // up
                if (code === 38 && idx) $currSelect.select(idx - 1);

                // down
                if (code === 40 && idx < $currSelect.curOpts.length - 1) $currSelect.select(idx + 1);

                // enter
                if (code === 13) $currSelect.setVal(idx);
            }, 100);
        });
    });
    window.onCallback_Managelog = function() {
        var url = 'http://qinfo.clt.qq.com/qinfo_v3/member-log.html#groupuin=' + G.gc;
        var params = {
            appId: 10001016,
            width: 458,
            height: 330,
            title: config.msg.tag.managelog,
            url: url,
            singletonId: 'group_member_level_' + G.gc
        };
        client.common.popNewWebPage(params.width, params.height, params.url, params.title, params.singletonId);
        return false;
    }

    return {
        init: init
    };

})();
},{"../../lib/config":3,"../../lib/util":6,"./card":7,"./cgi":8,"./client":9,"./list-html":13,"./tmpl/office-toolbar":24,"./tmpl/toolbar":25}],27:[function(require,module,exports){
'use strict';

module.exports = (function() {

    // fn:       对目标数字进行0补齐处理
    var numberPad = function(source, length) {
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));

        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }

        return (negative ? "-" : "") + pre + string;
    };

    // fn:       对目标日期对象进行格式化
    var dateFormat = function(source, pattern) {
        if ('string' != typeof pattern) {
            return source.toString();
        }

        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }

        var pad = numberPad,
            year = source.getFullYear(),
            month = source.getMonth() + 1,
            date2 = source.getDate(),
            hours = source.getHours(),
            minutes = source.getMinutes(),
            seconds = source.getSeconds();

        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);

        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);

        return pattern;
    };

    var jsonp = function(url, cb) {
        window.callback = function(d) {
            cb(d);
        };
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
            script = document.createElement("script");
        script.type = "text\/javascript";
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                //Handle memory leak in IE
                //setTimeout(function(){
                script.onload = script.onreadystatechange = null;
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
                //script=null;
                script = undefined;
                //},3000);
            }
        };
        head.insertBefore(script, head.firstChild);
    };


    return {
        jsonp: jsonp,
        numberPad: numberPad,
        dateFormat: dateFormat
    };

})();
},{}],28:[function(require,module,exports){
'use strict';

var util = require('../../lib/util');
var client = require('../../lib/callClient');
var report = require('../../lib/report');

var uin = client.getSelfUin() || util.getUin();
var version = client.getVersion().version;

var _gtype;

function tdw(action, ver3) {
    // 稍后做延迟上报
    var opt = {
        module: 'edit',
        action: action || ''
    };
    _gtype && (opt.ver2 = _gtype);
    ver3 && (opt.ver3 = ver3);

    report.tdw(opt);
}

tdw.setType = function(gtype) {
    _gtype = gtype;
};

tdw.jx = function(param) {
    param = param || {};

    var opt = {
        uin: uin,
        platform: 'PC',
        ver: version
    };

    Object.keys(param).forEach(function(key) {
        opt[key] = param[key];
    });

    report.tdw(opt, false, 'dc00593');
}

module.exports = tdw;
},{"../../lib/callClient":2,"../../lib/report":4,"../../lib/util":6}]},{},[1]);
