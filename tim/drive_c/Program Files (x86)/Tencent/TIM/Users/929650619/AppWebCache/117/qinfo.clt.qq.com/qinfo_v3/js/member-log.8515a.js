(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var tmplManage = require('../module/member-log/tmpl/manage-list'),
    util = require('../lib/util'),
    client = require('../lib/callClient'),
    cgi = require('../module/member-log/cgi');

//全局变量
window.G = {};
G.selfUin = client.getSelfUin(); //自己的qq
G.gc = "" + (util.getParameter("groupuin") || client.getGroupUin()); //群号

//数据加载
var manageLoad = function(d) {
    $("#dialog-manage-log").find("[data-list]").html(tmplManage(d));
};
//点击表头排序
var manageResort = function(d) {
    $("#dialog-manage-log").on("click", ".member-thead > li", function(e) {
        var record = $(this).data("record"),
            sort = $(this).data("sort");
        if (sort == "desc") {
            d.msg.sort(function(a, b) {
                return util.nameSortUp(a[record], b[record])
            });
        } else {
            d.msg.sort(function(a, b) {
                return util.nameSortDown(a[record], b[record])
            });
        }
        //计算新排序规则
        sort = (sort == "desc") ? "asc" : "desc";
        //清除旧排序规则
        $("#dialog-manage-log .member-thead > li").data("sort", "");
        //修改为新排序规则
        $(this).data("sort", sort);
        //重载数据
        manageLoad(d);
    });
};
//弹窗关闭
$("#dialog-manage-log").on("click", "[data-close]", function() {
    client.callHummer("Window.Close");
});

//导出操作记录
$("#exportXSL").click(function(e) {
    function downloadFile(url) {
        var frame = document.createElement('iframe');
        frame.src = url;
        document.getElementById("iframebox").appendChild(frame);
    }
    var url = cgi.exportXSL();
    downloadFile(url);
});

//
cgi.getManageLog(function(d) {
    if (d.ec == 0) {
        var dialog = $("#dialog-manage-log");
        dialog.show();
        if (d.msg) {
            manageLoad(d);
            dialog.find("[data-list]").show();
            dialog.find("[data-empty]").hide();
            //排序
            manageResort(d);
        } else {
            dialog.find("[data-list]").hide();
            dialog.find("[data-empty]").show();
        }
    } else {
        cgi.postErr();
    }
});
},{"../lib/callClient":2,"../lib/util":5,"../module/member-log/cgi":6,"../module/member-log/tmpl/manage-list":7}],2:[function(require,module,exports){
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
},{"./callClient":2,"./util":5}],4:[function(require,module,exports){
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
},{"./report":3,"./util":5}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
'use strict';

var request = require('../../lib/request');

module.exports = (function() {

    //获取管理员操作记录
    function getManageLog(cb) {
        request.get('/cgi-bin/qun_info/get_sys_msg', {
            gc: G.gc
        }, cb);
    };

    //导出管理员操作记录
    function exportXSL(cb) {
        return "/cgi-bin/qun_info/get_sys_msg_all?gc=" + G.gc + "&bkn=" + request.bkn + "&src=qinfo_v3"
    }

    return {
        exportXSL: exportXSL,
        getManageLog: getManageLog
    }

})();
},{"../../lib/request":4}],7:[function(require,module,exports){
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


var i=0,len=msg.length;
for(;i<len;i++){
;
__p += '\r\n<li><div>\r\n    <div class="nick">' +
((__t = (msg[i].nick)) == null ? '' : __t) +
'</div>\r\n    <div class="time">' +
((__t = (msg[i].time)) == null ? '' : __t) +
'</div>\r\n    <div class="content">' +
((__t = (msg[i].content)) == null ? '' : __t) +
'</div>\r\n</div></li>\r\n';
};


}
return __p
}
},{}]},{},[1]);
