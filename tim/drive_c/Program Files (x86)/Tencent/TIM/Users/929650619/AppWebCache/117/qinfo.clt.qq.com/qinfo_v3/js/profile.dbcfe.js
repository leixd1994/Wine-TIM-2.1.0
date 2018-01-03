(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escapeHtmlChar = require('lodash._escapehtmlchar'),
    keys = require('lodash.keys'),
    reUnescapedHtml = require('lodash._reunescapedhtml');

/**
 * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
 * corresponding HTML entities.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('Fred, Wilma, & Pebbles');
 * // => 'Fred, Wilma, &amp; Pebbles'
 */
function escape(string) {
  return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
}

module.exports = escape;

},{"lodash._escapehtmlchar":2,"lodash._reunescapedhtml":4,"lodash.keys":6}],2:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = require('lodash._htmlescapes');

/**
 * Used by `escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(match) {
  return htmlEscapes[match];
}

module.exports = escapeHtmlChar;

},{"lodash._htmlescapes":3}],3:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used to convert characters to HTML entities:
 *
 * Though the `>` character is escaped for symmetry, characters like `>` and `/`
 * don't require escaping in HTML and have no special meaning unless they're part
 * of a tag or an unquoted attribute value.
 * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
 */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

module.exports = htmlEscapes;

},{}],4:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = require('lodash._htmlescapes'),
    keys = require('lodash.keys');

/** Used to match HTML entities and HTML characters */
var reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

module.exports = reUnescapedHtml;

},{"lodash._htmlescapes":5,"lodash.keys":6}],5:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],6:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative'),
    isObject = require('lodash.isobject'),
    shimKeys = require('lodash._shimkeys');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;

},{"lodash._isnative":7,"lodash._shimkeys":8,"lodash.isobject":10}],7:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],8:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('lodash._objecttypes');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;

},{"lodash._objecttypes":9}],9:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],10:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('lodash._objecttypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"lodash._objecttypes":11}],11:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],12:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Used to match HTML entities and HTML characters. */
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);

/** Used to map HTML entities to characters. */
var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`'
};

/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
function unescapeHtmlChar(chr) {
  return htmlUnescapes[chr];
}

/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
 * corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional HTML
 * entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */
function unescape(string) {
  string = baseToString(string);
  return (string && reHasEscapedHtml.test(string))
    ? string.replace(reEscapedHtml, unescapeHtmlChar)
    : string;
}

module.exports = unescape;

},{"lodash._basetostring":13}],13:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],14:[function(require,module,exports){
'use strict';

var tdw = require('../module/profile/report');

var cgi = require('../module/profile/cgi');
var util = require('../lib/util');
var client = require('../lib/callClient');
var catalog = require('../module/profile/catalog');

var renderName = require('../module/profile/name');
var renderTags = require('../module/profile/tag');
var renderIntro = require('../module/profile/intro');
var renderType = require('../module/profile/type');
var renderDetail = require('../module/profile/detail');
var renderWording = require('../module/profile/wording');

var getGinfo = require('../module/profile/ginfo');


client.webLoadComplete(3);

// ginfo.done(function(res) {
//     console.log(res);

//     renderName(res.gName);
//     renderIntro(res.gRIntro);
//     renderTags(res.tags);
//     renderType(res.classID);
//     renderDetail(res['class']);

// }).fail(function(err) {
//     console.error(err);
// });

var ginfo;

function error(ec) {
    var errMap = {
        11: '好友备注空间已满',
        12: '群名称审核不通过',
        13: '群公告不合规范',
        14: '群简介不合规范',
        15: '您没有权限',
        16: '群号非法',
        17: '群不存在',
        18: '群已被删除',
        19: '群分类信息含敏感词'
    };
    return errMap[ec] || '保存出错了';
}

function doSave(info, fn) {
    void 0;
    void 0;
    // return;
    // var param = {
    // };
    cgi.setQunInfo(info).done(function(res) {
        hasModify = false;
        // 通知客户端更新数据
        client.onSave(0);
        void 0;

        // 上报成功修改群名称
        info.gName && (ginfo.gName !== info.gName) && tdw('modify_name');
        renderType.isTypeModify() && tdw('modify_type');
        renderType.isSubTypeModify() && tdw('modify_subtype');
        info['class'] && tdw('modify_typedetail');
        renderIntro.isModify(ginfo.gIntro) && tdw('modify_intro');

        // 保存成功之后修改本地的ginfo，避免isModify return true
        for (var k in info) {
            ginfo[k] = info[k];
        }
        // client.alert(1, '群资料卡', '保存成功————测试阶段弹窗');
        // client.closePop(); // 还会触发onCancel，略坑，不过也能处理

        tdw('suc_save');

        // 家校群
        if (ginfo.classID === 32) {
            var detail = ginfo['class'];
            detail && (detail = detail.split('|'));

            var city = detail[0];
            var province = catalog.getProvinceByCity(detail[0]).text;
            city = catalog.getCityById(city).text;

            tdw.jx({
                module: 'information',
                action: 'other',
                obj1: util.getParameter('groupuin'),
                obj2: province,
                obj3: city,
                obj4: detail[1],
                obj5: detail[2],
                res1: detail[3],
                res2: detail[4],
                res3: detail[5]
            });
        }

        fn();

        tdw('suc_refresh');
    }).fail(function(err) {
        // abort会跑到这里来，实际上要根据ec判断是否成功
        if (err.ec === 0) return;

        var wording = '资料保存失败，请重试！';
        var wordingList = {
            12: '群名字不合法',
            13: '群公告不合法',
            14: '群介绍不合法',
            19: '修改群分类遇到无效的字符',
            20: 'url非法',
            21: '群备注不合法',
            23: '群名字不能为空'
        };
        wording = wordingList[err.ec] ? wordingList[err.ec] : wording;

        tdw('fail_edit', 3);

        client.alert(1, '群资料卡', wording);
        void 0;
    });
}

function isModify() {
    // 页面还没load
    if (!ginfo) return false;

    // debugger;
    var info = {};

    // if (renderType.isModify(ginfo.classID)) {
    //     info.classID = renderType.getType();
    //     info['class'] = renderType.getClassDetail();
    // }

    // if (renderDetail.isModify(ginfo['class'])) {
    //     info.classID = renderType.getType();
    //     // info['class'] = renderDetail.getDetail();
    //     info['class'] = renderType.getClassDetail();
    // }
    if (renderType.isModify(ginfo.classID) || renderType.isDetailModify(ginfo['class'])) {
        info.classID = renderType.getType();
        // info['class'] = renderDetail.getDetail();
        info['class'] = renderType.getClassDetail();
    }
    // 坑爹货。。。修改了群名称或者群介绍必须把群名称和群介绍都传上去，不然就没传那个就没了
    if (renderIntro.isModify(ginfo.gRIntro) || renderName.isModify(ginfo.gName)) {
        info.fOthers = 1;
        info.gName = renderName.getName();

        var intro = renderIntro.getIntro();
        info.gIntro = intro.text;
        info.gRIntro = intro.rich;

        // fix gIntro: '', gRIntro: '<br>'
        info.gIntro || (info.gRIntro = info.gIntro);

        info.gRemark = 0;
    }

    // info.fPos = 1;
    // info.pos = '10402|113.934443|22.540452|深圳市万利达大厦';
    return Object.keys(info).length ? info : false;
    // return renderName.isModify(ginfo.gName) || renderType.isModify(ginfo.classID) || renderDetail.isModify(ginfo['class']) || renderIntro.isModify(ginfo.gRIntro);
}

// 客户端通知只能放在window下
window.onSave = function(from) {
    renderType.isTypeModify();
    if (!window.DEBUG && !client.online()) return client.alert(1, '群资料卡', '您已处于离线状态，请上线后再次尝试');

    var hasSubClass = renderType.hasSubClass();
    if (!hasSubClass) {
        client.alert(1, '群资料卡', '请选择完整的群分类');
        renderType.showType();
        return;
    }

    function close() {
        // client.closePop();
        if (from === 'close') return client.closeWindow();
        else if (from === 'refresh') return;
        client.destroyWebPage(3);
    }

    // debugger;
    var info
    try {
        info = isModify();
    } catch (err) {
        void 0;
        var msg = err.message;
        // 确认是中文才弹窗
        msg && msg.charCodeAt(0) > 255 && client.alert(1, '群资料卡', msg);
        return;
    }

    if (!info) return close();

    // 群名称禁止为空
    if (info.gName === '') return client.alert(1, '群资料卡', '群名称不能为空');
    // 同城群名称至少两个字
    if (typeof info.gName !== 'undefined' && info.gName !== null) {
        if ((ginfo.gtype === 2 || ginfo.gtype === 3 || ginfo.gtype === 4) && util.getTextLength(info.gName, 3) < 6) {
            tdw('fail_edit', 1);

            client.alert(1, '群资料卡', '同城群群名称不能少于2个字');
            return;
        }
    }
    // 同城群介绍至少15个字
    if (typeof info.gRIntro !== 'undefined' && info.gRIntro !== null) {
        if ((ginfo.gtype === 2 || ginfo.gtype === 3 || ginfo.gtype === 4) && util.getTextLength(info.gRIntro, 3) < 45) {
            tdw('fail_edit', 2);
            client.alert(1, '群资料卡', '同城群群介绍不能少于15个字');
            return;
        }
    }

    if (info) return doSave(info, function() {
        if (ginfo.gtype === 2 || ginfo.gtype === 4) {
            client.alert(1, '群资料卡', '您已提交群资料修改申请，由于本群是同城群，资料需审核后才会更新外部显示。');
        }
        close();
    });

    close();

};
// 点取消之后onCancel会调两次，如果有修改，在第一次取消之后需将修改置为false
var hasModify = true;
window.onCancel = function(from) {
    // debugger;
    try {
        var res = hasModify && isModify();
        if (res) {
            res = confirm();
            if (res === 0) return 0;
        }
    } catch (err) {
        var res = confirm();
        if (res === 0) return 0;
    }

    function confirm() {
        var res = client.confirm(1, '群资料卡', '您已对资料做了修改，是否保存？');
        tdw('exp_tl');
        // 点了确定
        if (res && res.errorCode == 0 && res.ret) {
            window.onSave(from);
            tdw('Clk_tlyes');
            // 返回0，客户端才不会关闭窗口
            return 0;
        }
    }

    tdw('Clk_tlno');
    // 点了取消
    // 关闭客户端
    // 貌似都不用我来关了
    // client.closePop();
    if (from === 'refresh') return;

    (from !== 'close') && client.destroyWebPage(3);
    return 1;
};
// 点右上角关闭
window.onWindowClose = function() {
    return window.onCancel('close');
};
// debug开关
window.DEBUG = false;

window.onbeforeunload = function() {
    window.onCancel('refresh');
};

window.addEventListener('load', function() {
    void 0;

    getGinfo(function(err, res) {
        if (err) return void 0;
        ginfo = res;

        renderName(res.gName);
        // renderDetail(res['class']);
        renderType(res.classID, res['class']);
        renderIntro(res.gRIntro);

        renderTags(res.tags);
        renderWording(res.gtype);

        void 0;
        tdw.setType(ginfo.gtype);

        // pv
        tdw('exp');
    });
});
},{"../lib/callClient":15,"../lib/util":19,"../module/profile/catalog":21,"../module/profile/cgi":22,"../module/profile/detail":23,"../module/profile/ginfo":26,"../module/profile/intro":27,"../module/profile/name":30,"../module/profile/report":31,"../module/profile/tag":32,"../module/profile/type":35,"../module/profile/wording":36}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"./callClient":15,"./util":19}],17:[function(require,module,exports){
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
},{"./report":16,"./util":19}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{"./tmpl/select":18,"./util":19}],21:[function(require,module,exports){
'use strict';

var catalog = {
    0: {
        n: "TOP",
        p: -1,
        s: [23, 24, 25, 26, 27, 28, 29, 32, 30, 31]
    },
    23: {
        n: "同事朋友",
        p: 0,
        s: [10009,10010, 10011, 10012]
    },
    24: {
        n: "置业安家",
        p: 0,
        s: [10015, 10017]
    },
    25: {
        n: "游戏",
        p: 0
    },
    26: {
        n: "品牌产品",
        p: 0
    },
    27: {
        n: "粉丝",
        p: 0
    },
    28: {
        n: "兴趣爱好",
        p: 0,
        s: [10018, 10019, 10020, 10021, 10022, 10023, 10024, 10026]
    },
    29: {
        n: "生活休闲",
        p: 0,
        s: [10013, 10014, 10027, 10028, 10029, 10030, 10031, 10032, 10033, 10034]
    },
    // 中途插了个家校群
    32: {
        n: "家校·师生",
        p: 0
    },
    30: {
        n: "学习考试",
        p: 0,
        s: [10035, 10036, 10037, 10038, 10039, 10040, 10041, 10042, 10043, 10044, 10045, 10046]
    },
    31: {
        n: "行业交流",
        p: 0,
        s: [10047, 10048, 10049, 10050, 10051, 10052, 10053, 10054, 10055, 10056, 10057, 10058]
    },
    10009: {
        n: "同事",
        p: 23
    },    
    10010: {
        n: "亲友",
        p: 23
    },
    10011: {
        n: "同学",
        p: 23
    },
    10012: {
        n: "办公",
        p: 23
    },
    10013: {
        n: "同城",
        p: 29,
        s: [10059, 10079, 10099, 10120, 10162, 10175, 10188, 10204, 10215, 10231, 10244, 10263, 10274, 10287, 10306, 10326, 10340, 10355, 10374, 10390, 10413, 10430, 10451, 10474, 10499, 10510, 10528, 10540, 10549, 10567, 10577, 10583, 10598, 10618]
    },
    10014: {
        n: "同乡",
        p: 29,
        s: [11188, 11208, 11228, 11249, 11291, 11304, 11317, 11333, 11344, 11360, 11373, 11392, 11403, 11416, 11435, 11455, 11469, 11484, 11503, 11519, 11542, 11559, 11580, 11603, 11628, 11639, 11657, 11669, 11678, 11696, 11706, 11712, 11727, 11747]
    },
    10015: {
        n: "业主",
        p: 24,
        s: [12317, 12337, 12357, 12378, 12420, 12433, 12446, 12462, 12473, 12489, 12502, 12521, 12532, 12545, 12564, 12584, 12598, 12613, 12632, 12648, 12671, 12688, 12709, 12732, 12757, 12768, 12786, 12798, 12807, 12825, 12835, 12841, 12856, 12876]
    },
    10017: {
        n: "装修",
        p: 24,
        s: [15201, 15221, 15241, 15262, 15304, 15317, 15330, 15346, 15357, 15373, 15386, 15405, 15416, 15429, 15448, 15468, 15482, 15497, 15516, 15532, 15555, 15572, 15593, 15616, 15641, 15652, 15670, 15682, 15691, 15709, 15719, 15725, 15740, 15760]
    },
    10018: {
        n: "影视",
        p: 28
    },
    10019: {
        n: "音乐",
        p: 28
    },
    10020: {
        n: "星座",
        p: 28
    },
    10021: {
        n: "动漫",
        p: 28
    },
    10022: {
        n: "运动",
        p: 28
    },
    10023: {
        n: "读书",
        p: 28
    },
    10024: {
        n: "摄影",
        p: 28
    },
    10026: {
        n: "其他",
        p: 28
    },
    10027: {
        n: "购物",
        p: 29
    },
    10028: {
        n: "旅游",
        p: 29
    },
    10029: {
        n: "美食",
        p: 29
    },
    10030: {
        n: "美容",
        p: 29
    },
    10031: {
        n: "宠物",
        p: 29
    },
    10032: {
        n: "健康",
        p: 29
    },
    10033: {
        n: "母婴",
        p: 29
    },
    10034: {
        n: "其他",
        p: 29
    },
    10035: {
        n: "托福",
        p: 30
    },
    10036: {
        n: "雅思",
        p: 30
    },
    10037: {
        n: "CET 4/6",
        p: 30
    },
    10038: {
        n: "GRE",
        p: 30
    },
    10039: {
        n: "GMAT",
        p: 30
    },
    10040: {
        n: "MBA",
        p: 30
    },
    10041: {
        n: "考研",
        p: 30
    },
    10042: {
        n: "高考",
        p: 30
    },
    10043: {
        n: "中考",
        p: 30
    },
    10044: {
        n: "职业认证",
        p: 30
    },
    10045: {
        n: "公务员",
        p: 30
    },
    10046: {
        n: "其他",
        p: 30
    },
    10047: {
        n: "投资",
        p: 31
    },
    10048: {
        n: "IT/互联网",
        p: 31
    },
    10049: {
        n: "建筑工程",
        p: 31
    },
    10050: {
        n: "服务",
        p: 31
    },
    10051: {
        n: "传媒",
        p: 31
    },
    10052: {
        n: "营销与广告",
        p: 31
    },
    10053: {
        n: "教师",
        p: 31
    },
    10054: {
        n: "律师",
        p: 31
    },
    10055: {
        n: "公务员",
        p: 31
    },
    10056: {
        n: "银行",
        p: 31
    },
    10057: {
        n: "咨询",
        p: 31
    },
    10058: {
        n: "其他",
        p: 31
    },
    10059: {
        n: "北京市",
        p: 10013,
        s: [10060, 10061, 10062, 10063, 10064, 10065, 10066, 10067, 10068, 10069, 10070, 10071, 10072, 10073, 10074, 10075, 10076, 10077, 10078]
    },
    10060: {
        n: "东城区",
        p: 10059
    },
    10061: {
        n: "西城区",
        p: 10059
    },
    10062: {
        n: "崇文区",
        p: 10059
    },
    10063: {
        n: "宣武区",
        p: 10059
    },
    10064: {
        n: "朝阳区",
        p: 10059
    },
    10065: {
        n: "丰台区",
        p: 10059
    },
    10066: {
        n: "石景山区",
        p: 10059
    },
    10067: {
        n: "海淀区",
        p: 10059
    },
    10068: {
        n: "门头沟区",
        p: 10059
    },
    10069: {
        n: "房山区",
        p: 10059
    },
    10070: {
        n: "通州区",
        p: 10059
    },
    10071: {
        n: "顺义区",
        p: 10059
    },
    10072: {
        n: "延庆县",
        p: 10059
    },
    10073: {
        n: "昌平区",
        p: 10059
    },
    10074: {
        n: "怀柔区",
        p: 10059
    },
    10075: {
        n: "密云县",
        p: 10059
    },
    10076: {
        n: "平谷区",
        p: 10059
    },
    10077: {
        n: "大兴区",
        p: 10059
    },
    10078: {
        n: "其它地区",
        p: 10059
    },
    10079: {
        n: "天津市",
        p: 10013,
        s: [10080, 10081, 10082, 10083, 10084, 10085, 10086, 10087, 10088, 10089, 10090, 10091, 10092, 10093, 10094, 10095, 10096, 10097, 10098]
    },
    10080: {
        n: "和平区",
        p: 10079
    },
    10081: {
        n: "河东区",
        p: 10079
    },
    10082: {
        n: "河西区",
        p: 10079
    },
    10083: {
        n: "南开区",
        p: 10079
    },
    10084: {
        n: "河北区",
        p: 10079
    },
    10085: {
        n: "红桥区",
        p: 10079
    },
    10086: {
        n: "塘沽区",
        p: 10079
    },
    10087: {
        n: "大港区",
        p: 10079
    },
    10088: {
        n: "东丽区",
        p: 10079
    },
    10089: {
        n: "西青区",
        p: 10079
    },
    10090: {
        n: "津南区",
        p: 10079
    },
    10091: {
        n: "北辰区",
        p: 10079
    },
    10092: {
        n: "蓟县",
        p: 10079
    },
    10093: {
        n: "宝坻区",
        p: 10079
    },
    10094: {
        n: "武清区",
        p: 10079
    },
    10095: {
        n: "宁河县",
        p: 10079
    },
    10096: {
        n: "静海县",
        p: 10079
    },
    10097: {
        n: "汉沽区",
        p: 10079
    },
    10098: {
        n: "其它地区",
        p: 10079
    },
    10099: {
        n: "上海市",
        p: 10013,
        s: [10100, 10101, 10102, 10103, 10104, 10105, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 10116, 10117, 10118, 10119]
    },
    10100: {
        n: "黄浦区",
        p: 10099
    },
    10101: {
        n: "卢湾区",
        p: 10099
    },
    10102: {
        n: "徐汇区",
        p: 10099
    },
    10103: {
        n: "长宁区",
        p: 10099
    },
    10104: {
        n: "静安区",
        p: 10099
    },
    10105: {
        n: "普陀区",
        p: 10099
    },
    10106: {
        n: "闸北区",
        p: 10099
    },
    10107: {
        n: "虹口区",
        p: 10099
    },
    10108: {
        n: "杨浦区",
        p: 10099
    },
    10109: {
        n: "闵行区",
        p: 10099
    },
    10110: {
        n: "宝山区",
        p: 10099
    },
    10111: {
        n: "嘉定区",
        p: 10099
    },
    10112: {
        n: "浦东新区",
        p: 10099
    },
    10113: {
        n: "金山区",
        p: 10099
    },
    10114: {
        n: "松江区",
        p: 10099
    },
    10115: {
        n: "崇明县",
        p: 10099
    },
    10116: {
        n: "青浦区",
        p: 10099
    },
    10117: {
        n: "南汇区",
        p: 10099
    },
    10118: {
        n: "奉贤区",
        p: 10099
    },
    10119: {
        n: "其它地区",
        p: 10099
    },
    10120: {
        n: "重庆市",
        p: 10013,
        s: [10121, 10122, 10123, 10124, 10125, 10126, 10127, 10128, 10129, 10130, 10131, 10132, 10133, 10134, 10135, 10136, 10137, 10138, 10139, 10140, 10141, 10142, 10143, 10144, 10145, 10146, 10147, 10148, 10149, 10150, 10151, 10152, 10153, 10154, 10155, 10156, 10157, 10158, 10159, 10160, 10161]
    },
    10121: {
        n: "渝中区",
        p: 10120
    },
    10122: {
        n: "大渡口区",
        p: 10120
    },
    10123: {
        n: "江北区",
        p: 10120
    },
    10124: {
        n: "沙坪坝区",
        p: 10120
    },
    10125: {
        n: "九龙坡区",
        p: 10120
    },
    10126: {
        n: "南岸区",
        p: 10120
    },
    10127: {
        n: "北碚区",
        p: 10120
    },
    10128: {
        n: "万盛区",
        p: 10120
    },
    10129: {
        n: "双桥区",
        p: 10120
    },
    10130: {
        n: "渝北区",
        p: 10120
    },
    10131: {
        n: "巴南区",
        p: 10120
    },
    10132: {
        n: "万州区",
        p: 10120
    },
    10133: {
        n: "涪陵区",
        p: 10120
    },
    10134: {
        n: "合川市",
        p: 10120
    },
    10135: {
        n: "永川市",
        p: 10120
    },
    10136: {
        n: "江津市",
        p: 10120
    },
    10137: {
        n: "南川市",
        p: 10120
    },
    10138: {
        n: "长寿区",
        p: 10120
    },
    10139: {
        n: "綦江县",
        p: 10120
    },
    10140: {
        n: "潼南县",
        p: 10120
    },
    10141: {
        n: "铜梁县",
        p: 10120
    },
    10142: {
        n: "大足县",
        p: 10120
    },
    10143: {
        n: "荣昌县",
        p: 10120
    },
    10144: {
        n: "璧山县",
        p: 10120
    },
    10145: {
        n: "垫江县",
        p: 10120
    },
    10146: {
        n: "武隆县",
        p: 10120
    },
    10147: {
        n: "丰都县",
        p: 10120
    },
    10148: {
        n: "城口县",
        p: 10120
    },
    10149: {
        n: "梁平县",
        p: 10120
    },
    10150: {
        n: "黔江区",
        p: 10120
    },
    10151: {
        n: "奉节县",
        p: 10120
    },
    10152: {
        n: "开县",
        p: 10120
    },
    10153: {
        n: "云阳县",
        p: 10120
    },
    10154: {
        n: "忠县",
        p: 10120
    },
    10155: {
        n: "巫溪县",
        p: 10120
    },
    10156: {
        n: "巫山县",
        p: 10120
    },
    10157: {
        n: "石柱土家族自治县",
        p: 10120
    },
    10158: {
        n: "秀山土家族苗族自治县",
        p: 10120
    },
    10159: {
        n: "酉阳土家族苗族自治县",
        p: 10120
    },
    10160: {
        n: "彭水苗族土家族自治县",
        p: 10120
    },
    10161: {
        n: "其它地区",
        p: 10120
    },
    10162: {
        n: "河北",
        p: 10013,
        s: [10163, 10164, 10165, 10166, 10167, 10168, 10169, 10170, 10171, 10172, 10173, 10174]
    },
    10163: {
        n: "石家庄市",
        p: 10162
    },
    10164: {
        n: "张家口市",
        p: 10162
    },
    10165: {
        n: "承德市",
        p: 10162
    },
    10166: {
        n: "秦皇岛市",
        p: 10162
    },
    10167: {
        n: "唐山市",
        p: 10162
    },
    10168: {
        n: "廊坊市",
        p: 10162
    },
    10169: {
        n: "保定市",
        p: 10162
    },
    10170: {
        n: "沧州市",
        p: 10162
    },
    10171: {
        n: "衡水市",
        p: 10162
    },
    10172: {
        n: "邢台市",
        p: 10162
    },
    10173: {
        n: "邯郸市",
        p: 10162
    },
    10174: {
        n: "其它地区",
        p: 10162
    },
    10175: {
        n: "山西",
        p: 10013,
        s: [10176, 10177, 10178, 10179, 10180, 10181, 10182, 10183, 10184, 10185, 10186, 10187]
    },
    10176: {
        n: "太原市",
        p: 10175
    },
    10177: {
        n: "大同市",
        p: 10175
    },
    10178: {
        n: "朔州市",
        p: 10175
    },
    10179: {
        n: "阳泉市",
        p: 10175
    },
    10180: {
        n: "长治市",
        p: 10175
    },
    10181: {
        n: "晋城市",
        p: 10175
    },
    10182: {
        n: "忻州市",
        p: 10175
    },
    10183: {
        n: "吕梁市",
        p: 10175
    },
    10184: {
        n: "晋中市",
        p: 10175
    },
    10185: {
        n: "临汾市",
        p: 10175
    },
    10186: {
        n: "运城市",
        p: 10175
    },
    10187: {
        n: "其它地区",
        p: 10175
    },
    10188: {
        n: "辽宁",
        p: 10013,
        s: [10189, 10190, 10191, 10192, 10193, 10194, 10195, 10196, 10197, 10198, 10199, 10200, 10201, 10202, 10203]
    },
    10189: {
        n: "沈阳市",
        p: 10188
    },
    10190: {
        n: "朝阳市",
        p: 10188
    },
    10191: {
        n: "阜新市",
        p: 10188
    },
    10192: {
        n: "铁岭市",
        p: 10188
    },
    10193: {
        n: "抚顺市",
        p: 10188
    },
    10194: {
        n: "本溪市",
        p: 10188
    },
    10195: {
        n: "辽阳市",
        p: 10188
    },
    10196: {
        n: "鞍山市",
        p: 10188
    },
    10197: {
        n: "丹东市",
        p: 10188
    },
    10198: {
        n: "大连市",
        p: 10188
    },
    10199: {
        n: "营口市",
        p: 10188
    },
    10200: {
        n: "盘锦市",
        p: 10188
    },
    10201: {
        n: "锦州市",
        p: 10188
    },
    10202: {
        n: "葫芦岛市",
        p: 10188
    },
    10203: {
        n: "其它地区",
        p: 10188
    },
    10204: {
        n: "吉林",
        p: 10013,
        s: [10205, 10206, 10207, 10208, 10209, 10210, 10211, 10212, 10213, 10214]
    },
    10205: {
        n: "长春市",
        p: 10204
    },
    10206: {
        n: "白城市",
        p: 10204
    },
    10207: {
        n: "松原市",
        p: 10204
    },
    10208: {
        n: "吉林市",
        p: 10204
    },
    10209: {
        n: "四平市",
        p: 10204
    },
    10210: {
        n: "辽源市",
        p: 10204
    },
    10211: {
        n: "通化市",
        p: 10204
    },
    10212: {
        n: "白山市",
        p: 10204
    },
    10213: {
        n: "延边朝鲜族自治州",
        p: 10204
    },
    10214: {
        n: "其它地区",
        p: 10204
    },
    10215: {
        n: "江苏",
        p: 10013,
        s: [10216, 10217, 10218, 10219, 10220, 10221, 10222, 10223, 10224, 10225, 10226, 10227, 10228, 10229, 10230]
    },
    10216: {
        n: "南京市",
        p: 10215
    },
    10217: {
        n: "徐州市",
        p: 10215
    },
    10218: {
        n: "连云港市",
        p: 10215
    },
    10219: {
        n: "宿迁市",
        p: 10215
    },
    10220: {
        n: "淮阴市",
        p: 10215
    },
    10221: {
        n: "盐城市",
        p: 10215
    },
    10222: {
        n: "扬州市",
        p: 10215
    },
    10223: {
        n: "泰州市",
        p: 10215
    },
    10224: {
        n: "南通市",
        p: 10215
    },
    10225: {
        n: "镇江市",
        p: 10215
    },
    10226: {
        n: "常州市",
        p: 10215
    },
    10227: {
        n: "无锡市",
        p: 10215
    },
    10228: {
        n: "苏州市",
        p: 10215
    },
    10229: {
        n: "淮安市",
        p: 10215
    },
    10230: {
        n: "其它地区",
        p: 10215
    },
    10231: {
        n: "浙江",
        p: 10013,
        s: [10232, 10233, 10234, 10235, 10236, 10237, 10238, 10239, 10240, 10241, 10242, 10243]
    },
    10232: {
        n: "杭州市",
        p: 10231
    },
    10233: {
        n: "湖州市",
        p: 10231
    },
    10234: {
        n: "嘉兴市",
        p: 10231
    },
    10235: {
        n: "舟山市",
        p: 10231
    },
    10236: {
        n: "宁波市",
        p: 10231
    },
    10237: {
        n: "绍兴市",
        p: 10231
    },
    10238: {
        n: "金华市",
        p: 10231
    },
    10239: {
        n: "台州市",
        p: 10231
    },
    10240: {
        n: "温州市",
        p: 10231
    },
    10241: {
        n: "丽水市",
        p: 10231
    },
    10242: {
        n: "衢州市",
        p: 10231
    },
    10243: {
        n: "其它地区",
        p: 10231
    },
    10244: {
        n: "安徽",
        p: 10013,
        s: [10245, 10246, 10247, 10248, 10249, 10250, 10251, 10252, 10253, 10254, 10255, 10256, 10257, 10258, 10259, 10260, 10261, 10262]
    },
    10245: {
        n: "合肥市",
        p: 10244
    },
    10246: {
        n: "宿州市",
        p: 10244
    },
    10247: {
        n: "淮北市",
        p: 10244
    },
    10248: {
        n: "阜阳市",
        p: 10244
    },
    10249: {
        n: "蚌埠市",
        p: 10244
    },
    10250: {
        n: "淮南市",
        p: 10244
    },
    10251: {
        n: "滁州市",
        p: 10244
    },
    10252: {
        n: "马鞍山市",
        p: 10244
    },
    10253: {
        n: "芜湖市",
        p: 10244
    },
    10254: {
        n: "铜陵市",
        p: 10244
    },
    10255: {
        n: "安庆市",
        p: 10244
    },
    10256: {
        n: "黄山市",
        p: 10244
    },
    10257: {
        n: "六安市",
        p: 10244
    },
    10258: {
        n: "巢湖市",
        p: 10244
    },
    10259: {
        n: "池州市",
        p: 10244
    },
    10260: {
        n: "宣城市",
        p: 10244
    },
    10261: {
        n: "亳州市",
        p: 10244
    },
    10262: {
        n: "其它地区",
        p: 10244
    },
    10263: {
        n: "福建",
        p: 10013,
        s: [10264, 10265, 10266, 10267, 10268, 10269, 10270, 10271, 10272, 10273]
    },
    10264: {
        n: "福州市",
        p: 10263
    },
    10265: {
        n: "南平市",
        p: 10263
    },
    10266: {
        n: "三明市",
        p: 10263
    },
    10267: {
        n: "莆田市",
        p: 10263
    },
    10268: {
        n: "泉州市",
        p: 10263
    },
    10269: {
        n: "厦门市",
        p: 10263
    },
    10270: {
        n: "漳州市",
        p: 10263
    },
    10271: {
        n: "龙岩市",
        p: 10263
    },
    10272: {
        n: "宁德市",
        p: 10263
    },
    10273: {
        n: "其它地区",
        p: 10263
    },
    10274: {
        n: "江西",
        p: 10013,
        s: [10275, 10276, 10277, 10278, 10279, 10280, 10281, 10282, 10283, 10284, 10285, 10286]
    },
    10275: {
        n: "南昌市",
        p: 10274
    },
    10276: {
        n: "九江市",
        p: 10274
    },
    10277: {
        n: "景德镇市",
        p: 10274
    },
    10278: {
        n: "鹰潭市",
        p: 10274
    },
    10279: {
        n: "新余市",
        p: 10274
    },
    10280: {
        n: "萍乡市",
        p: 10274
    },
    10281: {
        n: "赣州市",
        p: 10274
    },
    10282: {
        n: "上饶市",
        p: 10274
    },
    10283: {
        n: "抚州市",
        p: 10274
    },
    10284: {
        n: "宜春市",
        p: 10274
    },
    10285: {
        n: "吉安市",
        p: 10274
    },
    10286: {
        n: "其它地区",
        p: 10274
    },
    10287: {
        n: "山东",
        p: 10013,
        s: [10288, 10289, 10290, 10291, 10292, 10293, 10294, 10295, 10296, 10297, 10298, 10299, 10300, 10301, 10302, 10303, 10304, 10305]
    },
    10288: {
        n: "济南市",
        p: 10287
    },
    10289: {
        n: "聊城市",
        p: 10287
    },
    10290: {
        n: "德州市",
        p: 10287
    },
    10291: {
        n: "东营市",
        p: 10287
    },
    10292: {
        n: "淄博市",
        p: 10287
    },
    10293: {
        n: "潍坊市",
        p: 10287
    },
    10294: {
        n: "烟台市",
        p: 10287
    },
    10295: {
        n: "威海市",
        p: 10287
    },
    10296: {
        n: "青岛市",
        p: 10287
    },
    10297: {
        n: "日照市",
        p: 10287
    },
    10298: {
        n: "临沂市",
        p: 10287
    },
    10299: {
        n: "枣庄市",
        p: 10287
    },
    10300: {
        n: "济宁市",
        p: 10287
    },
    10301: {
        n: "泰安市",
        p: 10287
    },
    10302: {
        n: "莱芜市",
        p: 10287
    },
    10303: {
        n: "滨州市",
        p: 10287
    },
    10304: {
        n: "菏泽市",
        p: 10287
    },
    10305: {
        n: "其它地区",
        p: 10287
    },
    10306: {
        n: "河南",
        p: 10013,
        s: [10307, 10308, 10309, 10310, 10311, 10312, 10313, 10314, 10315, 10316, 10317, 10318, 10319, 10320, 10321, 10322, 10323, 10324, 10325]
    },
    10307: {
        n: "郑州市",
        p: 10306
    },
    10308: {
        n: "三门峡市",
        p: 10306
    },
    10309: {
        n: "洛阳市",
        p: 10306
    },
    10310: {
        n: "焦作市",
        p: 10306
    },
    10311: {
        n: "新乡市",
        p: 10306
    },
    10312: {
        n: "鹤壁市",
        p: 10306
    },
    10313: {
        n: "安阳市",
        p: 10306
    },
    10314: {
        n: "濮阳市",
        p: 10306
    },
    10315: {
        n: "开封市",
        p: 10306
    },
    10316: {
        n: "商丘市",
        p: 10306
    },
    10317: {
        n: "许昌市",
        p: 10306
    },
    10318: {
        n: "漯河市",
        p: 10306
    },
    10319: {
        n: "平顶山市",
        p: 10306
    },
    10320: {
        n: "南阳市",
        p: 10306
    },
    10321: {
        n: "信阳市",
        p: 10306
    },
    10322: {
        n: "济源市",
        p: 10306
    },
    10323: {
        n: "周口市",
        p: 10306
    },
    10324: {
        n: "驻马店市",
        p: 10306
    },
    10325: {
        n: "其它地区",
        p: 10306
    },
    10326: {
        n: "内蒙古自治区",
        p: 10013,
        s: [10327, 10328, 10329, 10330, 10331, 10332, 10333, 10334, 10335, 10336, 10337, 10338, 10339]
    },
    10327: {
        n: "呼和浩特市",
        p: 10326
    },
    10328: {
        n: "包头市",
        p: 10326
    },
    10329: {
        n: "乌海市",
        p: 10326
    },
    10330: {
        n: "赤峰市",
        p: 10326
    },
    10331: {
        n: "呼伦贝尔",
        p: 10326
    },
    10332: {
        n: "兴安盟",
        p: 10326
    },
    10333: {
        n: "锡林郭勒盟",
        p: 10326
    },
    10334: {
        n: "乌兰察布市",
        p: 10326
    },
    10335: {
        n: "巴彦淖尔市",
        p: 10326
    },
    10336: {
        n: "阿拉善盟",
        p: 10326
    },
    10337: {
        n: "鄂尔多斯市",
        p: 10326
    },
    10338: {
        n: "通辽市",
        p: 10326
    },
    10339: {
        n: "其它地区",
        p: 10326
    },
    10340: {
        n: "黑龙江",
        p: 10013,
        s: [10341, 10342, 10343, 10344, 10345, 10346, 10347, 10348, 10349, 10350, 10351, 10352, 10353, 10354]
    },
    10341: {
        n: "哈尔滨市",
        p: 10340
    },
    10342: {
        n: "齐齐哈尔市",
        p: 10340
    },
    10343: {
        n: "黑河市",
        p: 10340
    },
    10344: {
        n: "大庆市",
        p: 10340
    },
    10345: {
        n: "伊春市",
        p: 10340
    },
    10346: {
        n: "鹤岗市",
        p: 10340
    },
    10347: {
        n: "佳木斯市",
        p: 10340
    },
    10348: {
        n: "双鸭山市",
        p: 10340
    },
    10349: {
        n: "七台河市",
        p: 10340
    },
    10350: {
        n: "鸡西市",
        p: 10340
    },
    10351: {
        n: "牡丹江市",
        p: 10340
    },
    10352: {
        n: "绥化地区",
        p: 10340
    },
    10353: {
        n: "大兴安岭地区",
        p: 10340
    },
    10354: {
        n: "其它地区",
        p: 10340
    },
    10355: {
        n: "湖北",
        p: 10013,
        s: [10356, 10357, 10358, 10359, 10360, 10361, 10362, 10363, 10364, 10365, 10366, 10367, 10368, 10369, 10370, 10371, 10372, 10373]
    },
    10356: {
        n: "武汉市",
        p: 10355
    },
    10357: {
        n: "十堰市",
        p: 10355
    },
    10358: {
        n: "襄樊市",
        p: 10355
    },
    10359: {
        n: "荆门市",
        p: 10355
    },
    10360: {
        n: "孝感市",
        p: 10355
    },
    10361: {
        n: "黄冈市",
        p: 10355
    },
    10362: {
        n: "鄂州市",
        p: 10355
    },
    10363: {
        n: "黄石市",
        p: 10355
    },
    10364: {
        n: "咸宁市",
        p: 10355
    },
    10365: {
        n: "荆州市",
        p: 10355
    },
    10366: {
        n: "宜昌市",
        p: 10355
    },
    10367: {
        n: "随州市",
        p: 10355
    },
    10368: {
        n: "仙桃市",
        p: 10355
    },
    10369: {
        n: "天门市",
        p: 10355
    },
    10370: {
        n: "潜江市",
        p: 10355
    },
    10371: {
        n: "神农架林区",
        p: 10355
    },
    10372: {
        n: "恩施土家族苗族自治州",
        p: 10355
    },
    10373: {
        n: "其它地区",
        p: 10355
    },
    10374: {
        n: "湖南",
        p: 10013,
        s: [10375, 10376, 10377, 10378, 10379, 10380, 10381, 10382, 10383, 10384, 10385, 10386, 10387, 10388, 10389]
    },
    10375: {
        n: "长沙市",
        p: 10374
    },
    10376: {
        n: "张家界市",
        p: 10374
    },
    10377: {
        n: "常德市",
        p: 10374
    },
    10378: {
        n: "益阳市",
        p: 10374
    },
    10379: {
        n: "岳阳市",
        p: 10374
    },
    10380: {
        n: "株洲市",
        p: 10374
    },
    10381: {
        n: "湘潭市",
        p: 10374
    },
    10382: {
        n: "衡阳市",
        p: 10374
    },
    10383: {
        n: "郴州市",
        p: 10374
    },
    10384: {
        n: "永州市",
        p: 10374
    },
    10385: {
        n: "邵阳市",
        p: 10374
    },
    10386: {
        n: "怀化市",
        p: 10374
    },
    10387: {
        n: "娄底市",
        p: 10374
    },
    10388: {
        n: "湘西土家族苗族自治州",
        p: 10374
    },
    10389: {
        n: "其它地区",
        p: 10374
    },
    10390: {
        n: "广东",
        p: 10013,
        s: [10391, 10392, 10393, 10394, 10395, 10396, 10397, 10398, 10399, 10400, 10401, 10402, 10403, 10404, 10405, 10406, 10407, 10408, 10409, 10410, 10411, 10412]
    },
    10391: {
        n: "广州市",
        p: 10390
    },
    10392: {
        n: "清远市",
        p: 10390
    },
    10393: {
        n: "韶关市",
        p: 10390
    },
    10394: {
        n: "河源市",
        p: 10390
    },
    10395: {
        n: "梅州市",
        p: 10390
    },
    10396: {
        n: "潮州市",
        p: 10390
    },
    10397: {
        n: "汕头市",
        p: 10390
    },
    10398: {
        n: "揭阳市",
        p: 10390
    },
    10399: {
        n: "汕尾市",
        p: 10390
    },
    10400: {
        n: "惠州市",
        p: 10390
    },
    10401: {
        n: "东莞市",
        p: 10390
    },
    10402: {
        n: "深圳市",
        p: 10390
    },
    10403: {
        n: "珠海市",
        p: 10390
    },
    10404: {
        n: "中山市",
        p: 10390
    },
    10405: {
        n: "江门市",
        p: 10390
    },
    10406: {
        n: "佛山市",
        p: 10390
    },
    10407: {
        n: "肇庆市",
        p: 10390
    },
    10408: {
        n: "云浮市",
        p: 10390
    },
    10409: {
        n: "阳江市",
        p: 10390
    },
    10410: {
        n: "茂名市",
        p: 10390
    },
    10411: {
        n: "湛江市",
        p: 10390
    },
    10412: {
        n: "其它地区",
        p: 10390
    },
    10413: {
        n: "广西壮族自治区",
        p: 10013,
        s: [10414, 10415, 10416, 10417, 10418, 10419, 10420, 10421, 10422, 10423, 10424, 10425, 10426, 10427, 10428, 10429]
    },
    10414: {
        n: "南宁市",
        p: 10413
    },
    10415: {
        n: "桂林市",
        p: 10413
    },
    10416: {
        n: "柳州市",
        p: 10413
    },
    10417: {
        n: "梧州市",
        p: 10413
    },
    10418: {
        n: "贵港市",
        p: 10413
    },
    10419: {
        n: "玉林市",
        p: 10413
    },
    10420: {
        n: "钦州市",
        p: 10413
    },
    10421: {
        n: "北海市",
        p: 10413
    },
    10422: {
        n: "防城港市",
        p: 10413
    },
    10423: {
        n: "百色市",
        p: 10413
    },
    10424: {
        n: "河池地区",
        p: 10413
    },
    10425: {
        n: "贺州地区",
        p: 10413
    },
    10426: {
        n: "崇左市",
        p: 10413
    },
    10427: {
        n: "凭祥市",
        p: 10413
    },
    10428: {
        n: "来宾市",
        p: 10413
    },
    10429: {
        n: "其它地区",
        p: 10413
    },
    10430: {
        n: "海南",
        p: 10013,
        s: [10431, 10432, 10433, 10434, 10435, 10436, 10437, 10438, 10439, 10440, 10441, 10442, 10443, 10444, 10445, 10446, 10447, 10448, 10449, 10450]
    },
    10431: {
        n: "海口市",
        p: 10430
    },
    10432: {
        n: "三亚市",
        p: 10430
    },
    10433: {
        n: "琼山市",
        p: 10430
    },
    10434: {
        n: "文昌市",
        p: 10430
    },
    10435: {
        n: "琼海市",
        p: 10430
    },
    10436: {
        n: "万宁市",
        p: 10430
    },
    10437: {
        n: "东方市",
        p: 10430
    },
    10438: {
        n: "儋州市",
        p: 10430
    },
    10439: {
        n: "临高县",
        p: 10430
    },
    10440: {
        n: "澄迈县",
        p: 10430
    },
    10441: {
        n: "定安县",
        p: 10430
    },
    10442: {
        n: "屯昌县",
        p: 10430
    },
    10443: {
        n: "昌江黎族自治县",
        p: 10430
    },
    10444: {
        n: "白沙黎族自治县",
        p: 10430
    },
    10445: {
        n: "琼中黎族苗族自治县",
        p: 10430
    },
    10446: {
        n: "陵水黎族自治县",
        p: 10430
    },
    10447: {
        n: "保亭黎族苗族自治县",
        p: 10430
    },
    10448: {
        n: "乐东黎族自治县",
        p: 10430
    },
    10449: {
        n: "五指山市",
        p: 10430
    },
    10450: {
        n: "其它地区",
        p: 10430
    },
    10451: {
        n: "四川",
        p: 10013,
        s: [10452, 10453, 10454, 10455, 10456, 10457, 10458, 10459, 10460, 10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 10469, 10470, 10471, 10472, 10473]
    },
    10452: {
        n: "成都市",
        p: 10451
    },
    10453: {
        n: "广元市",
        p: 10451
    },
    10454: {
        n: "绵阳市",
        p: 10451
    },
    10455: {
        n: "德阳市",
        p: 10451
    },
    10456: {
        n: "南充市",
        p: 10451
    },
    10457: {
        n: "广安市",
        p: 10451
    },
    10458: {
        n: "遂宁市",
        p: 10451
    },
    10459: {
        n: "内江市",
        p: 10451
    },
    10460: {
        n: "乐山市",
        p: 10451
    },
    10461: {
        n: "自贡市",
        p: 10451
    },
    10462: {
        n: "泸州市",
        p: 10451
    },
    10463: {
        n: "宜宾市",
        p: 10451
    },
    10464: {
        n: "攀枝花市",
        p: 10451
    },
    10465: {
        n: "巴中市",
        p: 10451
    },
    10466: {
        n: "达州市",
        p: 10451
    },
    10467: {
        n: "资阳市",
        p: 10451
    },
    10468: {
        n: "眉山市",
        p: 10451
    },
    10469: {
        n: "雅安市",
        p: 10451
    },
    10470: {
        n: "阿坝藏族羌族自治州",
        p: 10451
    },
    10471: {
        n: "甘孜藏族自治州",
        p: 10451
    },
    10472: {
        n: "凉山彝族自治州",
        p: 10451
    },
    10473: {
        n: "其它地区",
        p: 10451
    },
    10474: {
        n: "台湾",
        p: 10013,
        s: [10475, 10476, 10477, 10478, 10479, 10480, 10481, 10482, 10483, 10484, 10485, 10486, 10487, 10488, 10489, 10490, 10491, 10492, 10493, 10494, 10495, 10496, 10497, 10498]
    },
    10475: {
        n: "台北市",
        p: 10474
    },
    10476: {
        n: "高雄市",
        p: 10474
    },
    10477: {
        n: "台南市",
        p: 10474
    },
    10478: {
        n: "台中市",
        p: 10474
    },
    10479: {
        n: "基隆市",
        p: 10474
    },
    10480: {
        n: "新竹市",
        p: 10474
    },
    10481: {
        n: "嘉义市",
        p: 10474
    },
    10482: {
        n: "台北县",
        p: 10474
    },
    10483: {
        n: "宜兰县",
        p: 10474
    },
    10484: {
        n: "新竹县",
        p: 10474
    },
    10485: {
        n: "桃园县",
        p: 10474
    },
    10486: {
        n: "苗栗县",
        p: 10474
    },
    10487: {
        n: "台中县",
        p: 10474
    },
    10488: {
        n: "彰化县",
        p: 10474
    },
    10489: {
        n: "南投县",
        p: 10474
    },
    10490: {
        n: "嘉义县",
        p: 10474
    },
    10491: {
        n: "云林县",
        p: 10474
    },
    10492: {
        n: "台南县",
        p: 10474
    },
    10493: {
        n: "高雄县",
        p: 10474
    },
    10494: {
        n: "屏东县",
        p: 10474
    },
    10495: {
        n: "台东县",
        p: 10474
    },
    10496: {
        n: "花莲县",
        p: 10474
    },
    10497: {
        n: "澎湖县",
        p: 10474
    },
    10498: {
        n: "其它地区",
        p: 10474
    },
    10499: {
        n: "贵州",
        p: 10013,
        s: [10500, 10501, 10502, 10503, 10504, 10505, 10506, 10507, 10508, 10509]
    },
    10500: {
        n: "贵阳市",
        p: 10499
    },
    10501: {
        n: "六盘水市",
        p: 10499
    },
    10502: {
        n: "遵义市",
        p: 10499
    },
    10503: {
        n: "毕节地区",
        p: 10499
    },
    10504: {
        n: "铜仁地区",
        p: 10499
    },
    10505: {
        n: "安顺市",
        p: 10499
    },
    10506: {
        n: "黔东南苗族侗族自治州",
        p: 10499
    },
    10507: {
        n: "黔南布依族苗族自治州",
        p: 10499
    },
    10508: {
        n: "黔西南布依族苗族自治州",
        p: 10499
    },
    10509: {
        n: "其它地区",
        p: 10499
    },
    10510: {
        n: "云南",
        p: 10013,
        s: [10511, 10512, 10513, 10514, 10515, 10516, 10517, 10518, 10519, 10520, 10521, 10522, 10523, 10524, 10525, 10526, 10527]
    },
    10511: {
        n: "昆明市",
        p: 10510
    },
    10512: {
        n: "曲靖市",
        p: 10510
    },
    10513: {
        n: "玉溪市",
        p: 10510
    },
    10514: {
        n: "丽江市",
        p: 10510
    },
    10515: {
        n: "昭通市",
        p: 10510
    },
    10516: {
        n: "思茅市",
        p: 10510
    },
    10517: {
        n: "临沧地区",
        p: 10510
    },
    10518: {
        n: "保山市",
        p: 10510
    },
    10519: {
        n: "德宏傣族景颇族自治州",
        p: 10510
    },
    10520: {
        n: "怒江傈傈族自治州",
        p: 10510
    },
    10521: {
        n: "迪庆藏族自治州",
        p: 10510
    },
    10522: {
        n: "大理白族自治州",
        p: 10510
    },
    10523: {
        n: "楚雄彝族自治州",
        p: 10510
    },
    10524: {
        n: "红河哈尼族彝族自治州",
        p: 10510
    },
    10525: {
        n: "文山壮族苗族自治州",
        p: 10510
    },
    10526: {
        n: "西双版纳傣族自治州",
        p: 10510
    },
    10527: {
        n: "其它地区",
        p: 10510
    },
    10528: {
        n: "陕西",
        p: 10013,
        s: [10529, 10530, 10531, 10532, 10533, 10534, 10535, 10536, 10537, 10538, 10539]
    },
    10529: {
        n: "西安市",
        p: 10528
    },
    10530: {
        n: "延安市",
        p: 10528
    },
    10531: {
        n: "铜川市",
        p: 10528
    },
    10532: {
        n: "渭南市",
        p: 10528
    },
    10533: {
        n: "咸阳市",
        p: 10528
    },
    10534: {
        n: "宝鸡市",
        p: 10528
    },
    10535: {
        n: "汉中市",
        p: 10528
    },
    10536: {
        n: "榆林市",
        p: 10528
    },
    10537: {
        n: "商洛市",
        p: 10528
    },
    10538: {
        n: "安康市",
        p: 10528
    },
    10539: {
        n: "其它地区",
        p: 10528
    },
    10540: {
        n: "西藏自治区",
        p: 10013,
        s: [10541, 10542, 10543, 10544, 10545, 10546, 10547, 10548]
    },
    10541: {
        n: "拉萨市",
        p: 10540
    },
    10542: {
        n: "那曲地区",
        p: 10540
    },
    10543: {
        n: "昌都地区",
        p: 10540
    },
    10544: {
        n: "林芝地区",
        p: 10540
    },
    10545: {
        n: "山南地区",
        p: 10540
    },
    10546: {
        n: "日喀则地区",
        p: 10540
    },
    10547: {
        n: "阿里地区",
        p: 10540
    },
    10548: {
        n: "其它地区",
        p: 10540
    },
    10549: {
        n: "甘肃",
        p: 10013,
        s: [10550, 10551, 10552, 10553, 10554, 10555, 10556, 10557, 10558, 10559, 10560, 10561, 10562, 10563, 10564, 10565, 10566]
    },
    10550: {
        n: "兰州市",
        p: 10549
    },
    10551: {
        n: "嘉峪关市",
        p: 10549
    },
    10552: {
        n: "金昌市",
        p: 10549
    },
    10553: {
        n: "白银市",
        p: 10549
    },
    10554: {
        n: "天水市",
        p: 10549
    },
    10555: {
        n: "酒泉市",
        p: 10549
    },
    10556: {
        n: "张掖市",
        p: 10549
    },
    10557: {
        n: "武威市",
        p: 10549
    },
    10558: {
        n: "庆阳市",
        p: 10549
    },
    10559: {
        n: "平凉市",
        p: 10549
    },
    10560: {
        n: "定西市",
        p: 10549
    },
    10561: {
        n: "陇南地区",
        p: 10549
    },
    10562: {
        n: "临夏回族自治州",
        p: 10549
    },
    10563: {
        n: "甘南藏族自治州",
        p: 10549
    },
    10564: {
        n: "玉门市",
        p: 10549
    },
    10565: {
        n: "敦煌市",
        p: 10549
    },
    10566: {
        n: "其它地区",
        p: 10549
    },
    10567: {
        n: "青海",
        p: 10013,
        s: [10568, 10569, 10570, 10571, 10572, 10573, 10574, 10575, 10576]
    },
    10568: {
        n: "西宁市",
        p: 10567
    },
    10569: {
        n: "海东地区",
        p: 10567
    },
    10570: {
        n: "海北藏族自治州",
        p: 10567
    },
    10571: {
        n: "海南藏族自治州",
        p: 10567
    },
    10572: {
        n: "黄南藏族自治州",
        p: 10567
    },
    10573: {
        n: "果洛藏族自治州",
        p: 10567
    },
    10574: {
        n: "玉树藏族自治州",
        p: 10567
    },
    10575: {
        n: "海西蒙古族藏族自治州",
        p: 10567
    },
    10576: {
        n: "其它地区",
        p: 10567
    },
    10577: {
        n: "宁夏回族自治区",
        p: 10013,
        s: [10578, 10579, 10580, 10581, 10582]
    },
    10578: {
        n: "银川市",
        p: 10577
    },
    10579: {
        n: "石嘴山市",
        p: 10577
    },
    10580: {
        n: "吴忠市",
        p: 10577
    },
    10581: {
        n: "固原市",
        p: 10577
    },
    10582: {
        n: "其它地区",
        p: 10577
    },
    10583: {
        n: "新疆维吾尔自治区",
        p: 10013,
        s: [10584, 10585, 10586, 10587, 10588, 10589, 10590, 10591, 10592, 10593, 10594, 10595, 10596, 10597]
    },
    10584: {
        n: "乌鲁木齐市",
        p: 10583
    },
    10585: {
        n: "克拉玛依市",
        p: 10583
    },
    10586: {
        n: "石河子市",
        p: 10583
    },
    10587: {
        n: "喀什地区",
        p: 10583
    },
    10588: {
        n: "阿克苏地区",
        p: 10583
    },
    10589: {
        n: "和田地区",
        p: 10583
    },
    10590: {
        n: "吐鲁番地区",
        p: 10583
    },
    10591: {
        n: "哈密地区",
        p: 10583
    },
    10592: {
        n: "克孜勒苏柯尔克孜自治州",
        p: 10583
    },
    10593: {
        n: "博尔塔拉蒙古自治州",
        p: 10583
    },
    10594: {
        n: "昌吉回族自治州",
        p: 10583
    },
    10595: {
        n: "巴音郭楞蒙古自治州",
        p: 10583
    },
    10596: {
        n: "伊犁哈萨克自治州",
        p: 10583
    },
    10597: {
        n: "其它地区",
        p: 10583
    },
    10598: {
        n: "香港特别行政区",
        p: 10013,
        s: [10599, 10600, 10601, 10602, 10603, 10604, 10605, 10606, 10607, 10608, 10609, 10610, 10611, 10612, 10613, 10614, 10615, 10616, 10617]
    },
    10599: {
        n: "九龙城区",
        p: 10598
    },
    10600: {
        n: "中西区",
        p: 10598
    },
    10601: {
        n: "东区",
        p: 10598
    },
    10602: {
        n: "观塘区",
        p: 10598
    },
    10603: {
        n: "南区",
        p: 10598
    },
    10604: {
        n: "深水埗区",
        p: 10598
    },
    10605: {
        n: "黄大仙区",
        p: 10598
    },
    10606: {
        n: "湾仔区",
        p: 10598
    },
    10607: {
        n: "油尖旺区",
        p: 10598
    },
    10608: {
        n: "离岛区",
        p: 10598
    },
    10609: {
        n: "葵青区",
        p: 10598
    },
    10610: {
        n: "北区",
        p: 10598
    },
    10611: {
        n: "西贡区",
        p: 10598
    },
    10612: {
        n: "沙田区",
        p: 10598
    },
    10613: {
        n: "屯门区",
        p: 10598
    },
    10614: {
        n: "大埔区",
        p: 10598
    },
    10615: {
        n: "荃湾区",
        p: 10598
    },
    10616: {
        n: "元朗区",
        p: 10598
    },
    10617: {
        n: "其它地区",
        p: 10598
    },
    10618: {
        n: "澳门特别行政区",
        p: 10013,
        s: [10619, 10620, 10621, 10622]
    },
    10619: {
        n: "澳门半岛",
        p: 10618
    },
    10620: {
        n: "凼仔岛",
        p: 10618
    },
    10621: {
        n: "路环岛",
        p: 10618
    },
    10622: {
        n: "其它地区",
        p: 10618
    },
    11188: {
        v: 10059,
        p: 10014,
        s: [11189, 11190, 11191, 11192, 11193, 11194, 11195, 11196, 11197, 11198, 11199, 11200, 11201, 11202, 11203, 11204, 11205, 11206, 11207]
    },
    11189: {
        v: 10060,
        p: 11188
    },
    11190: {
        v: 10061,
        p: 11188
    },
    11191: {
        v: 10062,
        p: 11188
    },
    11192: {
        v: 10063,
        p: 11188
    },
    11193: {
        v: 10064,
        p: 11188
    },
    11194: {
        v: 10065,
        p: 11188
    },
    11195: {
        v: 10066,
        p: 11188
    },
    11196: {
        v: 10067,
        p: 11188
    },
    11197: {
        v: 10068,
        p: 11188
    },
    11198: {
        v: 10069,
        p: 11188
    },
    11199: {
        v: 10070,
        p: 11188
    },
    11200: {
        v: 10071,
        p: 11188
    },
    11201: {
        v: 10072,
        p: 11188
    },
    11202: {
        v: 10073,
        p: 11188
    },
    11203: {
        v: 10074,
        p: 11188
    },
    11204: {
        v: 10075,
        p: 11188
    },
    11205: {
        v: 10076,
        p: 11188
    },
    11206: {
        v: 10077,
        p: 11188
    },
    11207: {
        v: 10078,
        p: 11188
    },
    11208: {
        v: 10079,
        p: 10014,
        s: [11209, 11210, 11211, 11212, 11213, 11214, 11215, 11216, 11217, 11218, 11219, 11220, 11221, 11222, 11223, 11224, 11225, 11226, 11227]
    },
    11209: {
        v: 10080,
        p: 11208
    },
    11210: {
        v: 10081,
        p: 11208
    },
    11211: {
        v: 10082,
        p: 11208
    },
    11212: {
        v: 10083,
        p: 11208
    },
    11213: {
        v: 10084,
        p: 11208
    },
    11214: {
        v: 10085,
        p: 11208
    },
    11215: {
        v: 10086,
        p: 11208
    },
    11216: {
        v: 10087,
        p: 11208
    },
    11217: {
        v: 10088,
        p: 11208
    },
    11218: {
        v: 10089,
        p: 11208
    },
    11219: {
        v: 10090,
        p: 11208
    },
    11220: {
        v: 10091,
        p: 11208
    },
    11221: {
        v: 10092,
        p: 11208
    },
    11222: {
        v: 10093,
        p: 11208
    },
    11223: {
        v: 10094,
        p: 11208
    },
    11224: {
        v: 10095,
        p: 11208
    },
    11225: {
        v: 10096,
        p: 11208
    },
    11226: {
        v: 10097,
        p: 11208
    },
    11227: {
        v: 10098,
        p: 11208
    },
    11228: {
        v: 10099,
        p: 10014,
        s: [11229, 11230, 11231, 11232, 11233, 11234, 11235, 11236, 11237, 11238, 11239, 11240, 11241, 11242, 11243, 11244, 11245, 11246, 11247, 11248]
    },
    11229: {
        v: 10100,
        p: 11228
    },
    11230: {
        v: 10101,
        p: 11228
    },
    11231: {
        v: 10102,
        p: 11228
    },
    11232: {
        v: 10103,
        p: 11228
    },
    11233: {
        v: 10104,
        p: 11228
    },
    11234: {
        v: 10105,
        p: 11228
    },
    11235: {
        v: 10106,
        p: 11228
    },
    11236: {
        v: 10107,
        p: 11228
    },
    11237: {
        v: 10108,
        p: 11228
    },
    11238: {
        v: 10109,
        p: 11228
    },
    11239: {
        v: 10110,
        p: 11228
    },
    11240: {
        v: 10111,
        p: 11228
    },
    11241: {
        v: 10112,
        p: 11228
    },
    11242: {
        v: 10113,
        p: 11228
    },
    11243: {
        v: 10114,
        p: 11228
    },
    11244: {
        v: 10115,
        p: 11228
    },
    11245: {
        v: 10116,
        p: 11228
    },
    11246: {
        v: 10117,
        p: 11228
    },
    11247: {
        v: 10118,
        p: 11228
    },
    11248: {
        v: 10119,
        p: 11228
    },
    11249: {
        v: 10120,
        p: 10014,
        s: [11250, 11251, 11252, 11253, 11254, 11255, 11256, 11257, 11258, 11259, 11260, 11261, 11262, 11263, 11264, 11265, 11266, 11267, 11268, 11269, 11270, 11271, 11272, 11273, 11274, 11275, 11276, 11277, 11278, 11279, 11280, 11281, 11282, 11283, 11284, 11285, 11286, 11287, 11288, 11289, 11290]
    },
    11250: {
        v: 10121,
        p: 11249
    },
    11251: {
        v: 10122,
        p: 11249
    },
    11252: {
        v: 10123,
        p: 11249
    },
    11253: {
        v: 10124,
        p: 11249
    },
    11254: {
        v: 10125,
        p: 11249
    },
    11255: {
        v: 10126,
        p: 11249
    },
    11256: {
        v: 10127,
        p: 11249
    },
    11257: {
        v: 10128,
        p: 11249
    },
    11258: {
        v: 10129,
        p: 11249
    },
    11259: {
        v: 10130,
        p: 11249
    },
    11260: {
        v: 10131,
        p: 11249
    },
    11261: {
        v: 10132,
        p: 11249
    },
    11262: {
        v: 10133,
        p: 11249
    },
    11263: {
        v: 10134,
        p: 11249
    },
    11264: {
        v: 10135,
        p: 11249
    },
    11265: {
        v: 10136,
        p: 11249
    },
    11266: {
        v: 10137,
        p: 11249
    },
    11267: {
        v: 10138,
        p: 11249
    },
    11268: {
        v: 10139,
        p: 11249
    },
    11269: {
        v: 10140,
        p: 11249
    },
    11270: {
        v: 10141,
        p: 11249
    },
    11271: {
        v: 10142,
        p: 11249
    },
    11272: {
        v: 10143,
        p: 11249
    },
    11273: {
        v: 10144,
        p: 11249
    },
    11274: {
        v: 10145,
        p: 11249
    },
    11275: {
        v: 10146,
        p: 11249
    },
    11276: {
        v: 10147,
        p: 11249
    },
    11277: {
        v: 10148,
        p: 11249
    },
    11278: {
        v: 10149,
        p: 11249
    },
    11279: {
        v: 10150,
        p: 11249
    },
    11280: {
        v: 10151,
        p: 11249
    },
    11281: {
        v: 10152,
        p: 11249
    },
    11282: {
        v: 10153,
        p: 11249
    },
    11283: {
        v: 10154,
        p: 11249
    },
    11284: {
        v: 10155,
        p: 11249
    },
    11285: {
        v: 10156,
        p: 11249
    },
    11286: {
        v: 10157,
        p: 11249
    },
    11287: {
        v: 10158,
        p: 11249
    },
    11288: {
        v: 10159,
        p: 11249
    },
    11289: {
        v: 10160,
        p: 11249
    },
    11290: {
        v: 10161,
        p: 11249
    },
    11291: {
        v: 10162,
        p: 10014,
        s: [11292, 11293, 11294, 11295, 11296, 11297, 11298, 11299, 11300, 11301, 11302, 11303]
    },
    11292: {
        v: 10163,
        p: 11291
    },
    11293: {
        v: 10164,
        p: 11291
    },
    11294: {
        v: 10165,
        p: 11291
    },
    11295: {
        v: 10166,
        p: 11291
    },
    11296: {
        v: 10167,
        p: 11291
    },
    11297: {
        v: 10168,
        p: 11291
    },
    11298: {
        v: 10169,
        p: 11291
    },
    11299: {
        v: 10170,
        p: 11291
    },
    11300: {
        v: 10171,
        p: 11291
    },
    11301: {
        v: 10172,
        p: 11291
    },
    11302: {
        v: 10173,
        p: 11291
    },
    11303: {
        v: 10174,
        p: 11291
    },
    11304: {
        v: 10175,
        p: 10014,
        s: [11305, 11306, 11307, 11308, 11309, 11310, 11311, 11312, 11313, 11314, 11315, 11316]
    },
    11305: {
        v: 10176,
        p: 11304
    },
    11306: {
        v: 10177,
        p: 11304
    },
    11307: {
        v: 10178,
        p: 11304
    },
    11308: {
        v: 10179,
        p: 11304
    },
    11309: {
        v: 10180,
        p: 11304
    },
    11310: {
        v: 10181,
        p: 11304
    },
    11311: {
        v: 10182,
        p: 11304
    },
    11312: {
        v: 10183,
        p: 11304
    },
    11313: {
        v: 10184,
        p: 11304
    },
    11314: {
        v: 10185,
        p: 11304
    },
    11315: {
        v: 10186,
        p: 11304
    },
    11316: {
        v: 10187,
        p: 11304
    },
    11317: {
        v: 10188,
        p: 10014,
        s: [11318, 11319, 11320, 11321, 11322, 11323, 11324, 11325, 11326, 11327, 11328, 11329, 11330, 11331, 11332]
    },
    11318: {
        v: 10189,
        p: 11317
    },
    11319: {
        v: 10190,
        p: 11317
    },
    11320: {
        v: 10191,
        p: 11317
    },
    11321: {
        v: 10192,
        p: 11317
    },
    11322: {
        v: 10193,
        p: 11317
    },
    11323: {
        v: 10194,
        p: 11317
    },
    11324: {
        v: 10195,
        p: 11317
    },
    11325: {
        v: 10196,
        p: 11317
    },
    11326: {
        v: 10197,
        p: 11317
    },
    11327: {
        v: 10198,
        p: 11317
    },
    11328: {
        v: 10199,
        p: 11317
    },
    11329: {
        v: 10200,
        p: 11317
    },
    11330: {
        v: 10201,
        p: 11317
    },
    11331: {
        v: 10202,
        p: 11317
    },
    11332: {
        v: 10203,
        p: 11317
    },
    11333: {
        v: 10204,
        p: 10014,
        s: [11334, 11335, 11336, 11337, 11338, 11339, 11340, 11341, 11342, 11343]
    },
    11334: {
        v: 10205,
        p: 11333
    },
    11335: {
        v: 10206,
        p: 11333
    },
    11336: {
        v: 10207,
        p: 11333
    },
    11337: {
        v: 10208,
        p: 11333
    },
    11338: {
        v: 10209,
        p: 11333
    },
    11339: {
        v: 10210,
        p: 11333
    },
    11340: {
        v: 10211,
        p: 11333
    },
    11341: {
        v: 10212,
        p: 11333
    },
    11342: {
        v: 10213,
        p: 11333
    },
    11343: {
        v: 10214,
        p: 11333
    },
    11344: {
        v: 10215,
        p: 10014,
        s: [11345, 11346, 11347, 11348, 11349, 11350, 11351, 11352, 11353, 11354, 11355, 11356, 11357, 11358, 11359]
    },
    11345: {
        v: 10216,
        p: 11344
    },
    11346: {
        v: 10217,
        p: 11344
    },
    11347: {
        v: 10218,
        p: 11344
    },
    11348: {
        v: 10219,
        p: 11344
    },
    11349: {
        v: 10220,
        p: 11344
    },
    11350: {
        v: 10221,
        p: 11344
    },
    11351: {
        v: 10222,
        p: 11344
    },
    11352: {
        v: 10223,
        p: 11344
    },
    11353: {
        v: 10224,
        p: 11344
    },
    11354: {
        v: 10225,
        p: 11344
    },
    11355: {
        v: 10226,
        p: 11344
    },
    11356: {
        v: 10227,
        p: 11344
    },
    11357: {
        v: 10228,
        p: 11344
    },
    11358: {
        v: 10229,
        p: 11344
    },
    11359: {
        v: 10230,
        p: 11344
    },
    11360: {
        v: 10231,
        p: 10014,
        s: [11361, 11362, 11363, 11364, 11365, 11366, 11367, 11368, 11369, 11370, 11371, 11372]
    },
    11361: {
        v: 10232,
        p: 11360
    },
    11362: {
        v: 10233,
        p: 11360
    },
    11363: {
        v: 10234,
        p: 11360
    },
    11364: {
        v: 10235,
        p: 11360
    },
    11365: {
        v: 10236,
        p: 11360
    },
    11366: {
        v: 10237,
        p: 11360
    },
    11367: {
        v: 10238,
        p: 11360
    },
    11368: {
        v: 10239,
        p: 11360
    },
    11369: {
        v: 10240,
        p: 11360
    },
    11370: {
        v: 10241,
        p: 11360
    },
    11371: {
        v: 10242,
        p: 11360
    },
    11372: {
        v: 10243,
        p: 11360
    },
    11373: {
        v: 10244,
        p: 10014,
        s: [11374, 11375, 11376, 11377, 11378, 11379, 11380, 11381, 11382, 11383, 11384, 11385, 11386, 11387, 11388, 11389, 11390, 11391]
    },
    11374: {
        v: 10245,
        p: 11373
    },
    11375: {
        v: 10246,
        p: 11373
    },
    11376: {
        v: 10247,
        p: 11373
    },
    11377: {
        v: 10248,
        p: 11373
    },
    11378: {
        v: 10249,
        p: 11373
    },
    11379: {
        v: 10250,
        p: 11373
    },
    11380: {
        v: 10251,
        p: 11373
    },
    11381: {
        v: 10252,
        p: 11373
    },
    11382: {
        v: 10253,
        p: 11373
    },
    11383: {
        v: 10254,
        p: 11373
    },
    11384: {
        v: 10255,
        p: 11373
    },
    11385: {
        v: 10256,
        p: 11373
    },
    11386: {
        v: 10257,
        p: 11373
    },
    11387: {
        v: 10258,
        p: 11373
    },
    11388: {
        v: 10259,
        p: 11373
    },
    11389: {
        v: 10260,
        p: 11373
    },
    11390: {
        v: 10261,
        p: 11373
    },
    11391: {
        v: 10262,
        p: 11373
    },
    11392: {
        v: 10263,
        p: 10014,
        s: [11393, 11394, 11395, 11396, 11397, 11398, 11399, 11400, 11401, 11402]
    },
    11393: {
        v: 10264,
        p: 11392
    },
    11394: {
        v: 10265,
        p: 11392
    },
    11395: {
        v: 10266,
        p: 11392
    },
    11396: {
        v: 10267,
        p: 11392
    },
    11397: {
        v: 10268,
        p: 11392
    },
    11398: {
        v: 10269,
        p: 11392
    },
    11399: {
        v: 10270,
        p: 11392
    },
    11400: {
        v: 10271,
        p: 11392
    },
    11401: {
        v: 10272,
        p: 11392
    },
    11402: {
        v: 10273,
        p: 11392
    },
    11403: {
        v: 10274,
        p: 10014,
        s: [11404, 11405, 11406, 11407, 11408, 11409, 11410, 11411, 11412, 11413, 11414, 11415]
    },
    11404: {
        v: 10275,
        p: 11403
    },
    11405: {
        v: 10276,
        p: 11403
    },
    11406: {
        v: 10277,
        p: 11403
    },
    11407: {
        v: 10278,
        p: 11403
    },
    11408: {
        v: 10279,
        p: 11403
    },
    11409: {
        v: 10280,
        p: 11403
    },
    11410: {
        v: 10281,
        p: 11403
    },
    11411: {
        v: 10282,
        p: 11403
    },
    11412: {
        v: 10283,
        p: 11403
    },
    11413: {
        v: 10284,
        p: 11403
    },
    11414: {
        v: 10285,
        p: 11403
    },
    11415: {
        v: 10286,
        p: 11403
    },
    11416: {
        v: 10287,
        p: 10014,
        s: [11417, 11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 11428, 11429, 11430, 11431, 11432, 11433, 11434]
    },
    11417: {
        v: 10288,
        p: 11416
    },
    11418: {
        v: 10289,
        p: 11416
    },
    11419: {
        v: 10290,
        p: 11416
    },
    11420: {
        v: 10291,
        p: 11416
    },
    11421: {
        v: 10292,
        p: 11416
    },
    11422: {
        v: 10293,
        p: 11416
    },
    11423: {
        v: 10294,
        p: 11416
    },
    11424: {
        v: 10295,
        p: 11416
    },
    11425: {
        v: 10296,
        p: 11416
    },
    11426: {
        v: 10297,
        p: 11416
    },
    11427: {
        v: 10298,
        p: 11416
    },
    11428: {
        v: 10299,
        p: 11416
    },
    11429: {
        v: 10300,
        p: 11416
    },
    11430: {
        v: 10301,
        p: 11416
    },
    11431: {
        v: 10302,
        p: 11416
    },
    11432: {
        v: 10303,
        p: 11416
    },
    11433: {
        v: 10304,
        p: 11416
    },
    11434: {
        v: 10305,
        p: 11416
    },
    11435: {
        v: 10306,
        p: 10014,
        s: [11436, 11437, 11438, 11439, 11440, 11441, 11442, 11443, 11444, 11445, 11446, 11447, 11448, 11449, 11450, 11451, 11452, 11453, 11454]
    },
    11436: {
        v: 10307,
        p: 11435
    },
    11437: {
        v: 10308,
        p: 11435
    },
    11438: {
        v: 10309,
        p: 11435
    },
    11439: {
        v: 10310,
        p: 11435
    },
    11440: {
        v: 10311,
        p: 11435
    },
    11441: {
        v: 10312,
        p: 11435
    },
    11442: {
        v: 10313,
        p: 11435
    },
    11443: {
        v: 10314,
        p: 11435
    },
    11444: {
        v: 10315,
        p: 11435
    },
    11445: {
        v: 10316,
        p: 11435
    },
    11446: {
        v: 10317,
        p: 11435
    },
    11447: {
        v: 10318,
        p: 11435
    },
    11448: {
        v: 10319,
        p: 11435
    },
    11449: {
        v: 10320,
        p: 11435
    },
    11450: {
        v: 10321,
        p: 11435
    },
    11451: {
        v: 10322,
        p: 11435
    },
    11452: {
        v: 10323,
        p: 11435
    },
    11453: {
        v: 10324,
        p: 11435
    },
    11454: {
        v: 10325,
        p: 11435
    },
    11455: {
        v: 10326,
        p: 10014,
        s: [11456, 11457, 11458, 11459, 11460, 11461, 11462, 11463, 11464, 11465, 11466, 11467, 11468]
    },
    11456: {
        v: 10327,
        p: 11455
    },
    11457: {
        v: 10328,
        p: 11455
    },
    11458: {
        v: 10329,
        p: 11455
    },
    11459: {
        v: 10330,
        p: 11455
    },
    11460: {
        v: 10331,
        p: 11455
    },
    11461: {
        v: 10332,
        p: 11455
    },
    11462: {
        v: 10333,
        p: 11455
    },
    11463: {
        v: 10334,
        p: 11455
    },
    11464: {
        v: 10335,
        p: 11455
    },
    11465: {
        v: 10336,
        p: 11455
    },
    11466: {
        v: 10337,
        p: 11455
    },
    11467: {
        v: 10338,
        p: 11455
    },
    11468: {
        v: 10339,
        p: 11455
    },
    11469: {
        v: 10340,
        p: 10014,
        s: [11470, 11471, 11472, 11473, 11474, 11475, 11476, 11477, 11478, 11479, 11480, 11481, 11482, 11483]
    },
    11470: {
        v: 10341,
        p: 11469
    },
    11471: {
        v: 10342,
        p: 11469
    },
    11472: {
        v: 10343,
        p: 11469
    },
    11473: {
        v: 10344,
        p: 11469
    },
    11474: {
        v: 10345,
        p: 11469
    },
    11475: {
        v: 10346,
        p: 11469
    },
    11476: {
        v: 10347,
        p: 11469
    },
    11477: {
        v: 10348,
        p: 11469
    },
    11478: {
        v: 10349,
        p: 11469
    },
    11479: {
        v: 10350,
        p: 11469
    },
    11480: {
        v: 10351,
        p: 11469
    },
    11481: {
        v: 10352,
        p: 11469
    },
    11482: {
        v: 10353,
        p: 11469
    },
    11483: {
        v: 10354,
        p: 11469
    },
    11484: {
        v: 10355,
        p: 10014,
        s: [11485, 11486, 11487, 11488, 11489, 11490, 11491, 11492, 11493, 11494, 11495, 11496, 11497, 11498, 11499, 11500, 11501, 11502]
    },
    11485: {
        v: 10356,
        p: 11484
    },
    11486: {
        v: 10357,
        p: 11484
    },
    11487: {
        v: 10358,
        p: 11484
    },
    11488: {
        v: 10359,
        p: 11484
    },
    11489: {
        v: 10360,
        p: 11484
    },
    11490: {
        v: 10361,
        p: 11484
    },
    11491: {
        v: 10362,
        p: 11484
    },
    11492: {
        v: 10363,
        p: 11484
    },
    11493: {
        v: 10364,
        p: 11484
    },
    11494: {
        v: 10365,
        p: 11484
    },
    11495: {
        v: 10366,
        p: 11484
    },
    11496: {
        v: 10367,
        p: 11484
    },
    11497: {
        v: 10368,
        p: 11484
    },
    11498: {
        v: 10369,
        p: 11484
    },
    11499: {
        v: 10370,
        p: 11484
    },
    11500: {
        v: 10371,
        p: 11484
    },
    11501: {
        v: 10372,
        p: 11484
    },
    11502: {
        v: 10373,
        p: 11484
    },
    11503: {
        v: 10374,
        p: 10014,
        s: [11504, 11505, 11506, 11507, 11508, 11509, 11510, 11511, 11512, 11513, 11514, 11515, 11516, 11517, 11518]
    },
    11504: {
        v: 10375,
        p: 11503
    },
    11505: {
        v: 10376,
        p: 11503
    },
    11506: {
        v: 10377,
        p: 11503
    },
    11507: {
        v: 10378,
        p: 11503
    },
    11508: {
        v: 10379,
        p: 11503
    },
    11509: {
        v: 10380,
        p: 11503
    },
    11510: {
        v: 10381,
        p: 11503
    },
    11511: {
        v: 10382,
        p: 11503
    },
    11512: {
        v: 10383,
        p: 11503
    },
    11513: {
        v: 10384,
        p: 11503
    },
    11514: {
        v: 10385,
        p: 11503
    },
    11515: {
        v: 10386,
        p: 11503
    },
    11516: {
        v: 10387,
        p: 11503
    },
    11517: {
        v: 10388,
        p: 11503
    },
    11518: {
        v: 10389,
        p: 11503
    },
    11519: {
        v: 10390,
        p: 10014,
        s: [11520, 11521, 11522, 11523, 11524, 11525, 11526, 11527, 11528, 11529, 11530, 11531, 11532, 11533, 11534, 11535, 11536, 11537, 11538, 11539, 11540, 11541]
    },
    11520: {
        v: 10391,
        p: 11519
    },
    11521: {
        v: 10392,
        p: 11519
    },
    11522: {
        v: 10393,
        p: 11519
    },
    11523: {
        v: 10394,
        p: 11519
    },
    11524: {
        v: 10395,
        p: 11519
    },
    11525: {
        v: 10396,
        p: 11519
    },
    11526: {
        v: 10397,
        p: 11519
    },
    11527: {
        v: 10398,
        p: 11519
    },
    11528: {
        v: 10399,
        p: 11519
    },
    11529: {
        v: 10400,
        p: 11519
    },
    11530: {
        v: 10401,
        p: 11519
    },
    11531: {
        v: 10402,
        p: 11519
    },
    11532: {
        v: 10403,
        p: 11519
    },
    11533: {
        v: 10404,
        p: 11519
    },
    11534: {
        v: 10405,
        p: 11519
    },
    11535: {
        v: 10406,
        p: 11519
    },
    11536: {
        v: 10407,
        p: 11519
    },
    11537: {
        v: 10408,
        p: 11519
    },
    11538: {
        v: 10409,
        p: 11519
    },
    11539: {
        v: 10410,
        p: 11519
    },
    11540: {
        v: 10411,
        p: 11519
    },
    11541: {
        v: 10412,
        p: 11519
    },
    11542: {
        v: 10413,
        p: 10014,
        s: [11543, 11544, 11545, 11546, 11547, 11548, 11549, 11550, 11551, 11552, 11553, 11554, 11555, 11556, 11557, 11558]
    },
    11543: {
        v: 10414,
        p: 11542
    },
    11544: {
        v: 10415,
        p: 11542
    },
    11545: {
        v: 10416,
        p: 11542
    },
    11546: {
        v: 10417,
        p: 11542
    },
    11547: {
        v: 10418,
        p: 11542
    },
    11548: {
        v: 10419,
        p: 11542
    },
    11549: {
        v: 10420,
        p: 11542
    },
    11550: {
        v: 10421,
        p: 11542
    },
    11551: {
        v: 10422,
        p: 11542
    },
    11552: {
        v: 10423,
        p: 11542
    },
    11553: {
        v: 10424,
        p: 11542
    },
    11554: {
        v: 10425,
        p: 11542
    },
    11555: {
        v: 10426,
        p: 11542
    },
    11556: {
        v: 10427,
        p: 11542
    },
    11557: {
        v: 10428,
        p: 11542
    },
    11558: {
        v: 10429,
        p: 11542
    },
    11559: {
        v: 10430,
        p: 10014,
        s: [11560, 11561, 11562, 11563, 11564, 11565, 11566, 11567, 11568, 11569, 11570, 11571, 11572, 11573, 11574, 11575, 11576, 11577, 11578, 11579]
    },
    11560: {
        v: 10431,
        p: 11559
    },
    11561: {
        v: 10432,
        p: 11559
    },
    11562: {
        v: 10433,
        p: 11559
    },
    11563: {
        v: 10434,
        p: 11559
    },
    11564: {
        v: 10435,
        p: 11559
    },
    11565: {
        v: 10436,
        p: 11559
    },
    11566: {
        v: 10437,
        p: 11559
    },
    11567: {
        v: 10438,
        p: 11559
    },
    11568: {
        v: 10439,
        p: 11559
    },
    11569: {
        v: 10440,
        p: 11559
    },
    11570: {
        v: 10441,
        p: 11559
    },
    11571: {
        v: 10442,
        p: 11559
    },
    11572: {
        v: 10443,
        p: 11559
    },
    11573: {
        v: 10444,
        p: 11559
    },
    11574: {
        v: 10445,
        p: 11559
    },
    11575: {
        v: 10446,
        p: 11559
    },
    11576: {
        v: 10447,
        p: 11559
    },
    11577: {
        v: 10448,
        p: 11559
    },
    11578: {
        v: 10449,
        p: 11559
    },
    11579: {
        v: 10450,
        p: 11559
    },
    11580: {
        v: 10451,
        p: 10014,
        s: [11581, 11582, 11583, 11584, 11585, 11586, 11587, 11588, 11589, 11590, 11591, 11592, 11593, 11594, 11595, 11596, 11597, 11598, 11599, 11600, 11601, 11602]
    },
    11581: {
        v: 10452,
        p: 11580
    },
    11582: {
        v: 10453,
        p: 11580
    },
    11583: {
        v: 10454,
        p: 11580
    },
    11584: {
        v: 10455,
        p: 11580
    },
    11585: {
        v: 10456,
        p: 11580
    },
    11586: {
        v: 10457,
        p: 11580
    },
    11587: {
        v: 10458,
        p: 11580
    },
    11588: {
        v: 10459,
        p: 11580
    },
    11589: {
        v: 10460,
        p: 11580
    },
    11590: {
        v: 10461,
        p: 11580
    },
    11591: {
        v: 10462,
        p: 11580
    },
    11592: {
        v: 10463,
        p: 11580
    },
    11593: {
        v: 10464,
        p: 11580
    },
    11594: {
        v: 10465,
        p: 11580
    },
    11595: {
        v: 10466,
        p: 11580
    },
    11596: {
        v: 10467,
        p: 11580
    },
    11597: {
        v: 10468,
        p: 11580
    },
    11598: {
        v: 10469,
        p: 11580
    },
    11599: {
        v: 10470,
        p: 11580
    },
    11600: {
        v: 10471,
        p: 11580
    },
    11601: {
        v: 10472,
        p: 11580
    },
    11602: {
        v: 10473,
        p: 11580
    },
    11603: {
        v: 10474,
        p: 10014,
        s: [11604, 11605, 11606, 11607, 11608, 11609, 11610, 11611, 11612, 11613, 11614, 11615, 11616, 11617, 11618, 11619, 11620, 11621, 11622, 11623, 11624, 11625, 11626, 11627]
    },
    11604: {
        v: 10475,
        p: 11603
    },
    11605: {
        v: 10476,
        p: 11603
    },
    11606: {
        v: 10477,
        p: 11603
    },
    11607: {
        v: 10478,
        p: 11603
    },
    11608: {
        v: 10479,
        p: 11603
    },
    11609: {
        v: 10480,
        p: 11603
    },
    11610: {
        v: 10481,
        p: 11603
    },
    11611: {
        v: 10482,
        p: 11603
    },
    11612: {
        v: 10483,
        p: 11603
    },
    11613: {
        v: 10484,
        p: 11603
    },
    11614: {
        v: 10485,
        p: 11603
    },
    11615: {
        v: 10486,
        p: 11603
    },
    11616: {
        v: 10487,
        p: 11603
    },
    11617: {
        v: 10488,
        p: 11603
    },
    11618: {
        v: 10489,
        p: 11603
    },
    11619: {
        v: 10490,
        p: 11603
    },
    11620: {
        v: 10491,
        p: 11603
    },
    11621: {
        v: 10492,
        p: 11603
    },
    11622: {
        v: 10493,
        p: 11603
    },
    11623: {
        v: 10494,
        p: 11603
    },
    11624: {
        v: 10495,
        p: 11603
    },
    11625: {
        v: 10496,
        p: 11603
    },
    11626: {
        v: 10497,
        p: 11603
    },
    11627: {
        v: 10498,
        p: 11603
    },
    11628: {
        v: 10499,
        p: 10014,
        s: [11629, 11630, 11631, 11632, 11633, 11634, 11635, 11636, 11637, 11638]
    },
    11629: {
        v: 10500,
        p: 11628
    },
    11630: {
        v: 10501,
        p: 11628
    },
    11631: {
        v: 10502,
        p: 11628
    },
    11632: {
        v: 10503,
        p: 11628
    },
    11633: {
        v: 10504,
        p: 11628
    },
    11634: {
        v: 10505,
        p: 11628
    },
    11635: {
        v: 10506,
        p: 11628
    },
    11636: {
        v: 10507,
        p: 11628
    },
    11637: {
        v: 10508,
        p: 11628
    },
    11638: {
        v: 10509,
        p: 11628
    },
    11639: {
        v: 10510,
        p: 10014,
        s: [11640, 11641, 11642, 11643, 11644, 11645, 11646, 11647, 11648, 11649, 11650, 11651, 11652, 11653, 11654, 11655, 11656]
    },
    11640: {
        v: 10511,
        p: 11639
    },
    11641: {
        v: 10512,
        p: 11639
    },
    11642: {
        v: 10513,
        p: 11639
    },
    11643: {
        v: 10514,
        p: 11639
    },
    11644: {
        v: 10515,
        p: 11639
    },
    11645: {
        v: 10516,
        p: 11639
    },
    11646: {
        v: 10517,
        p: 11639
    },
    11647: {
        v: 10518,
        p: 11639
    },
    11648: {
        v: 10519,
        p: 11639
    },
    11649: {
        v: 10520,
        p: 11639
    },
    11650: {
        v: 10521,
        p: 11639
    },
    11651: {
        v: 10522,
        p: 11639
    },
    11652: {
        v: 10523,
        p: 11639
    },
    11653: {
        v: 10524,
        p: 11639
    },
    11654: {
        v: 10525,
        p: 11639
    },
    11655: {
        v: 10526,
        p: 11639
    },
    11656: {
        v: 10527,
        p: 11639
    },
    11657: {
        v: 10528,
        p: 10014,
        s: [11658, 11659, 11660, 11661, 11662, 11663, 11664, 11665, 11666, 11667, 11668]
    },
    11658: {
        v: 10529,
        p: 11657
    },
    11659: {
        v: 10530,
        p: 11657
    },
    11660: {
        v: 10531,
        p: 11657
    },
    11661: {
        v: 10532,
        p: 11657
    },
    11662: {
        v: 10533,
        p: 11657
    },
    11663: {
        v: 10534,
        p: 11657
    },
    11664: {
        v: 10535,
        p: 11657
    },
    11665: {
        v: 10536,
        p: 11657
    },
    11666: {
        v: 10537,
        p: 11657
    },
    11667: {
        v: 10538,
        p: 11657
    },
    11668: {
        v: 10539,
        p: 11657
    },
    11669: {
        v: 10540,
        p: 10014,
        s: [11670, 11671, 11672, 11673, 11674, 11675, 11676, 11677]
    },
    11670: {
        v: 10541,
        p: 11669
    },
    11671: {
        v: 10542,
        p: 11669
    },
    11672: {
        v: 10543,
        p: 11669
    },
    11673: {
        v: 10544,
        p: 11669
    },
    11674: {
        v: 10545,
        p: 11669
    },
    11675: {
        v: 10546,
        p: 11669
    },
    11676: {
        v: 10547,
        p: 11669
    },
    11677: {
        v: 10548,
        p: 11669
    },
    11678: {
        v: 10549,
        p: 10014,
        s: [11679, 11680, 11681, 11682, 11683, 11684, 11685, 11686, 11687, 11688, 11689, 11690, 11691, 11692, 11693, 11694, 11695]
    },
    11679: {
        v: 10550,
        p: 11678
    },
    11680: {
        v: 10551,
        p: 11678
    },
    11681: {
        v: 10552,
        p: 11678
    },
    11682: {
        v: 10553,
        p: 11678
    },
    11683: {
        v: 10554,
        p: 11678
    },
    11684: {
        v: 10555,
        p: 11678
    },
    11685: {
        v: 10556,
        p: 11678
    },
    11686: {
        v: 10557,
        p: 11678
    },
    11687: {
        v: 10558,
        p: 11678
    },
    11688: {
        v: 10559,
        p: 11678
    },
    11689: {
        v: 10560,
        p: 11678
    },
    11690: {
        v: 10561,
        p: 11678
    },
    11691: {
        v: 10562,
        p: 11678
    },
    11692: {
        v: 10563,
        p: 11678
    },
    11693: {
        v: 10564,
        p: 11678
    },
    11694: {
        v: 10565,
        p: 11678
    },
    11695: {
        v: 10566,
        p: 11678
    },
    11696: {
        v: 10567,
        p: 10014,
        s: [11697, 11698, 11699, 11700, 11701, 11702, 11703, 11704, 11705]
    },
    11697: {
        v: 10568,
        p: 11696
    },
    11698: {
        v: 10569,
        p: 11696
    },
    11699: {
        v: 10570,
        p: 11696
    },
    11700: {
        v: 10571,
        p: 11696
    },
    11701: {
        v: 10572,
        p: 11696
    },
    11702: {
        v: 10573,
        p: 11696
    },
    11703: {
        v: 10574,
        p: 11696
    },
    11704: {
        v: 10575,
        p: 11696
    },
    11705: {
        v: 10576,
        p: 11696
    },
    11706: {
        v: 10577,
        p: 10014,
        s: [11707, 11708, 11709, 11710, 11711]
    },
    11707: {
        v: 10578,
        p: 11706
    },
    11708: {
        v: 10579,
        p: 11706
    },
    11709: {
        v: 10580,
        p: 11706
    },
    11710: {
        v: 10581,
        p: 11706
    },
    11711: {
        v: 10582,
        p: 11706
    },
    11712: {
        v: 10583,
        p: 10014,
        s: [11713, 11714, 11715, 11716, 11717, 11718, 11719, 11720, 11721, 11722, 11723, 11724, 11725, 11726]
    },
    11713: {
        v: 10584,
        p: 11712
    },
    11714: {
        v: 10585,
        p: 11712
    },
    11715: {
        v: 10586,
        p: 11712
    },
    11716: {
        v: 10587,
        p: 11712
    },
    11717: {
        v: 10588,
        p: 11712
    },
    11718: {
        v: 10589,
        p: 11712
    },
    11719: {
        v: 10590,
        p: 11712
    },
    11720: {
        v: 10591,
        p: 11712
    },
    11721: {
        v: 10592,
        p: 11712
    },
    11722: {
        v: 10593,
        p: 11712
    },
    11723: {
        v: 10594,
        p: 11712
    },
    11724: {
        v: 10595,
        p: 11712
    },
    11725: {
        v: 10596,
        p: 11712
    },
    11726: {
        v: 10597,
        p: 11712
    },
    11727: {
        v: 10598,
        p: 10014,
        s: [11728, 11729, 11730, 11731, 11732, 11733, 11734, 11735, 11736, 11737, 11738, 11739, 11740, 11741, 11742, 11743, 11744, 11745, 11746]
    },
    11728: {
        v: 10599,
        p: 11727
    },
    11729: {
        v: 10600,
        p: 11727
    },
    11730: {
        v: 10601,
        p: 11727
    },
    11731: {
        v: 10602,
        p: 11727
    },
    11732: {
        v: 10603,
        p: 11727
    },
    11733: {
        v: 10604,
        p: 11727
    },
    11734: {
        v: 10605,
        p: 11727
    },
    11735: {
        v: 10606,
        p: 11727
    },
    11736: {
        v: 10607,
        p: 11727
    },
    11737: {
        v: 10608,
        p: 11727
    },
    11738: {
        v: 10609,
        p: 11727
    },
    11739: {
        v: 10610,
        p: 11727
    },
    11740: {
        v: 10611,
        p: 11727
    },
    11741: {
        v: 10612,
        p: 11727
    },
    11742: {
        v: 10613,
        p: 11727
    },
    11743: {
        v: 10614,
        p: 11727
    },
    11744: {
        v: 10615,
        p: 11727
    },
    11745: {
        v: 10616,
        p: 11727
    },
    11746: {
        v: 10617,
        p: 11727
    },
    11747: {
        v: 10618,
        p: 10014,
        s: [11748, 11749, 11750, 11751]
    },
    11748: {
        v: 10619,
        p: 11747
    },
    11749: {
        v: 10620,
        p: 11747
    },
    11750: {
        v: 10621,
        p: 11747
    },
    11751: {
        v: 10622,
        p: 11747
    },
    12317: {
        v: 10059,
        p: 10015,
        s: [12318, 12319, 12320, 12321, 12322, 12323, 12324, 12325, 12326, 12327, 12328, 12329, 12330, 12331, 12332, 12333, 12334, 12335, 12336]
    },
    12318: {
        v: 10060,
        p: 12317
    },
    12319: {
        v: 10061,
        p: 12317
    },
    12320: {
        v: 10062,
        p: 12317
    },
    12321: {
        v: 10063,
        p: 12317
    },
    12322: {
        v: 10064,
        p: 12317
    },
    12323: {
        v: 10065,
        p: 12317
    },
    12324: {
        v: 10066,
        p: 12317
    },
    12325: {
        v: 10067,
        p: 12317
    },
    12326: {
        v: 10068,
        p: 12317
    },
    12327: {
        v: 10069,
        p: 12317
    },
    12328: {
        v: 10070,
        p: 12317
    },
    12329: {
        v: 10071,
        p: 12317
    },
    12330: {
        v: 10072,
        p: 12317
    },
    12331: {
        v: 10073,
        p: 12317
    },
    12332: {
        v: 10074,
        p: 12317
    },
    12333: {
        v: 10075,
        p: 12317
    },
    12334: {
        v: 10076,
        p: 12317
    },
    12335: {
        v: 10077,
        p: 12317
    },
    12336: {
        v: 10078,
        p: 12317
    },
    12337: {
        v: 10079,
        p: 10015,
        s: [12338, 12339, 12340, 12341, 12342, 12343, 12344, 12345, 12346, 12347, 12348, 12349, 12350, 12351, 12352, 12353, 12354, 12355, 12356]
    },
    12338: {
        v: 10080,
        p: 12337
    },
    12339: {
        v: 10081,
        p: 12337
    },
    12340: {
        v: 10082,
        p: 12337
    },
    12341: {
        v: 10083,
        p: 12337
    },
    12342: {
        v: 10084,
        p: 12337
    },
    12343: {
        v: 10085,
        p: 12337
    },
    12344: {
        v: 10086,
        p: 12337
    },
    12345: {
        v: 10087,
        p: 12337
    },
    12346: {
        v: 10088,
        p: 12337
    },
    12347: {
        v: 10089,
        p: 12337
    },
    12348: {
        v: 10090,
        p: 12337
    },
    12349: {
        v: 10091,
        p: 12337
    },
    12350: {
        v: 10092,
        p: 12337
    },
    12351: {
        v: 10093,
        p: 12337
    },
    12352: {
        v: 10094,
        p: 12337
    },
    12353: {
        v: 10095,
        p: 12337
    },
    12354: {
        v: 10096,
        p: 12337
    },
    12355: {
        v: 10097,
        p: 12337
    },
    12356: {
        v: 10098,
        p: 12337
    },
    12357: {
        v: 10099,
        p: 10015,
        s: [12358, 12359, 12360, 12361, 12362, 12363, 12364, 12365, 12366, 12367, 12368, 12369, 12370, 12371, 12372, 12373, 12374, 12375, 12376, 12377]
    },
    12358: {
        v: 10100,
        p: 12357
    },
    12359: {
        v: 10101,
        p: 12357
    },
    12360: {
        v: 10102,
        p: 12357
    },
    12361: {
        v: 10103,
        p: 12357
    },
    12362: {
        v: 10104,
        p: 12357
    },
    12363: {
        v: 10105,
        p: 12357
    },
    12364: {
        v: 10106,
        p: 12357
    },
    12365: {
        v: 10107,
        p: 12357
    },
    12366: {
        v: 10108,
        p: 12357
    },
    12367: {
        v: 10109,
        p: 12357
    },
    12368: {
        v: 10110,
        p: 12357
    },
    12369: {
        v: 10111,
        p: 12357
    },
    12370: {
        v: 10112,
        p: 12357
    },
    12371: {
        v: 10113,
        p: 12357
    },
    12372: {
        v: 10114,
        p: 12357
    },
    12373: {
        v: 10115,
        p: 12357
    },
    12374: {
        v: 10116,
        p: 12357
    },
    12375: {
        v: 10117,
        p: 12357
    },
    12376: {
        v: 10118,
        p: 12357
    },
    12377: {
        v: 10119,
        p: 12357
    },
    12378: {
        v: 10120,
        p: 10015,
        s: [12379, 12380, 12381, 12382, 12383, 12384, 12385, 12386, 12387, 12388, 12389, 12390, 12391, 12392, 12393, 12394, 12395, 12396, 12397, 12398, 12399, 12400, 12401, 12402, 12403, 12404, 12405, 12406, 12407, 12408, 12409, 12410, 12411, 12412, 12413, 12414, 12415, 12416, 12417, 12418, 12419]
    },
    12379: {
        v: 10121,
        p: 12378
    },
    12380: {
        v: 10122,
        p: 12378
    },
    12381: {
        v: 10123,
        p: 12378
    },
    12382: {
        v: 10124,
        p: 12378
    },
    12383: {
        v: 10125,
        p: 12378
    },
    12384: {
        v: 10126,
        p: 12378
    },
    12385: {
        v: 10127,
        p: 12378
    },
    12386: {
        v: 10128,
        p: 12378
    },
    12387: {
        v: 10129,
        p: 12378
    },
    12388: {
        v: 10130,
        p: 12378
    },
    12389: {
        v: 10131,
        p: 12378
    },
    12390: {
        v: 10132,
        p: 12378
    },
    12391: {
        v: 10133,
        p: 12378
    },
    12392: {
        v: 10134,
        p: 12378
    },
    12393: {
        v: 10135,
        p: 12378
    },
    12394: {
        v: 10136,
        p: 12378
    },
    12395: {
        v: 10137,
        p: 12378
    },
    12396: {
        v: 10138,
        p: 12378
    },
    12397: {
        v: 10139,
        p: 12378
    },
    12398: {
        v: 10140,
        p: 12378
    },
    12399: {
        v: 10141,
        p: 12378
    },
    12400: {
        v: 10142,
        p: 12378
    },
    12401: {
        v: 10143,
        p: 12378
    },
    12402: {
        v: 10144,
        p: 12378
    },
    12403: {
        v: 10145,
        p: 12378
    },
    12404: {
        v: 10146,
        p: 12378
    },
    12405: {
        v: 10147,
        p: 12378
    },
    12406: {
        v: 10148,
        p: 12378
    },
    12407: {
        v: 10149,
        p: 12378
    },
    12408: {
        v: 10150,
        p: 12378
    },
    12409: {
        v: 10151,
        p: 12378
    },
    12410: {
        v: 10152,
        p: 12378
    },
    12411: {
        v: 10153,
        p: 12378
    },
    12412: {
        v: 10154,
        p: 12378
    },
    12413: {
        v: 10155,
        p: 12378
    },
    12414: {
        v: 10156,
        p: 12378
    },
    12415: {
        v: 10157,
        p: 12378
    },
    12416: {
        v: 10158,
        p: 12378
    },
    12417: {
        v: 10159,
        p: 12378
    },
    12418: {
        v: 10160,
        p: 12378
    },
    12419: {
        v: 10161,
        p: 12378
    },
    12420: {
        v: 10162,
        p: 10015,
        s: [12421, 12422, 12423, 12424, 12425, 12426, 12427, 12428, 12429, 12430, 12431, 12432]
    },
    12421: {
        v: 10163,
        p: 12420
    },
    12422: {
        v: 10164,
        p: 12420
    },
    12423: {
        v: 10165,
        p: 12420
    },
    12424: {
        v: 10166,
        p: 12420
    },
    12425: {
        v: 10167,
        p: 12420
    },
    12426: {
        v: 10168,
        p: 12420
    },
    12427: {
        v: 10169,
        p: 12420
    },
    12428: {
        v: 10170,
        p: 12420
    },
    12429: {
        v: 10171,
        p: 12420
    },
    12430: {
        v: 10172,
        p: 12420
    },
    12431: {
        v: 10173,
        p: 12420
    },
    12432: {
        v: 10174,
        p: 12420
    },
    12433: {
        v: 10175,
        p: 10015,
        s: [12434, 12435, 12436, 12437, 12438, 12439, 12440, 12441, 12442, 12443, 12444, 12445]
    },
    12434: {
        v: 10176,
        p: 12433
    },
    12435: {
        v: 10177,
        p: 12433
    },
    12436: {
        v: 10178,
        p: 12433
    },
    12437: {
        v: 10179,
        p: 12433
    },
    12438: {
        v: 10180,
        p: 12433
    },
    12439: {
        v: 10181,
        p: 12433
    },
    12440: {
        v: 10182,
        p: 12433
    },
    12441: {
        v: 10183,
        p: 12433
    },
    12442: {
        v: 10184,
        p: 12433
    },
    12443: {
        v: 10185,
        p: 12433
    },
    12444: {
        v: 10186,
        p: 12433
    },
    12445: {
        v: 10187,
        p: 12433
    },
    12446: {
        v: 10188,
        p: 10015,
        s: [12447, 12448, 12449, 12450, 12451, 12452, 12453, 12454, 12455, 12456, 12457, 12458, 12459, 12460, 12461]
    },
    12447: {
        v: 10189,
        p: 12446
    },
    12448: {
        v: 10190,
        p: 12446
    },
    12449: {
        v: 10191,
        p: 12446
    },
    12450: {
        v: 10192,
        p: 12446
    },
    12451: {
        v: 10193,
        p: 12446
    },
    12452: {
        v: 10194,
        p: 12446
    },
    12453: {
        v: 10195,
        p: 12446
    },
    12454: {
        v: 10196,
        p: 12446
    },
    12455: {
        v: 10197,
        p: 12446
    },
    12456: {
        v: 10198,
        p: 12446
    },
    12457: {
        v: 10199,
        p: 12446
    },
    12458: {
        v: 10200,
        p: 12446
    },
    12459: {
        v: 10201,
        p: 12446
    },
    12460: {
        v: 10202,
        p: 12446
    },
    12461: {
        v: 10203,
        p: 12446
    },
    12462: {
        v: 10204,
        p: 10015,
        s: [12463, 12464, 12465, 12466, 12467, 12468, 12469, 12470, 12471, 12472]
    },
    12463: {
        v: 10205,
        p: 12462
    },
    12464: {
        v: 10206,
        p: 12462
    },
    12465: {
        v: 10207,
        p: 12462
    },
    12466: {
        v: 10208,
        p: 12462
    },
    12467: {
        v: 10209,
        p: 12462
    },
    12468: {
        v: 10210,
        p: 12462
    },
    12469: {
        v: 10211,
        p: 12462
    },
    12470: {
        v: 10212,
        p: 12462
    },
    12471: {
        v: 10213,
        p: 12462
    },
    12472: {
        v: 10214,
        p: 12462
    },
    12473: {
        v: 10215,
        p: 10015,
        s: [12474, 12475, 12476, 12477, 12478, 12479, 12480, 12481, 12482, 12483, 12484, 12485, 12486, 12487, 12488]
    },
    12474: {
        v: 10216,
        p: 12473
    },
    12475: {
        v: 10217,
        p: 12473
    },
    12476: {
        v: 10218,
        p: 12473
    },
    12477: {
        v: 10219,
        p: 12473
    },
    12478: {
        v: 10220,
        p: 12473
    },
    12479: {
        v: 10221,
        p: 12473
    },
    12480: {
        v: 10222,
        p: 12473
    },
    12481: {
        v: 10223,
        p: 12473
    },
    12482: {
        v: 10224,
        p: 12473
    },
    12483: {
        v: 10225,
        p: 12473
    },
    12484: {
        v: 10226,
        p: 12473
    },
    12485: {
        v: 10227,
        p: 12473
    },
    12486: {
        v: 10228,
        p: 12473
    },
    12487: {
        v: 10229,
        p: 12473
    },
    12488: {
        v: 10230,
        p: 12473
    },
    12489: {
        v: 10231,
        p: 10015,
        s: [12490, 12491, 12492, 12493, 12494, 12495, 12496, 12497, 12498, 12499, 12500, 12501]
    },
    12490: {
        v: 10232,
        p: 12489
    },
    12491: {
        v: 10233,
        p: 12489
    },
    12492: {
        v: 10234,
        p: 12489
    },
    12493: {
        v: 10235,
        p: 12489
    },
    12494: {
        v: 10236,
        p: 12489
    },
    12495: {
        v: 10237,
        p: 12489
    },
    12496: {
        v: 10238,
        p: 12489
    },
    12497: {
        v: 10239,
        p: 12489
    },
    12498: {
        v: 10240,
        p: 12489
    },
    12499: {
        v: 10241,
        p: 12489
    },
    12500: {
        v: 10242,
        p: 12489
    },
    12501: {
        v: 10243,
        p: 12489
    },
    12502: {
        v: 10244,
        p: 10015,
        s: [12503, 12504, 12505, 12506, 12507, 12508, 12509, 12510, 12511, 12512, 12513, 12514, 12515, 12516, 12517, 12518, 12519, 12520]
    },
    12503: {
        v: 10245,
        p: 12502
    },
    12504: {
        v: 10246,
        p: 12502
    },
    12505: {
        v: 10247,
        p: 12502
    },
    12506: {
        v: 10248,
        p: 12502
    },
    12507: {
        v: 10249,
        p: 12502
    },
    12508: {
        v: 10250,
        p: 12502
    },
    12509: {
        v: 10251,
        p: 12502
    },
    12510: {
        v: 10252,
        p: 12502
    },
    12511: {
        v: 10253,
        p: 12502
    },
    12512: {
        v: 10254,
        p: 12502
    },
    12513: {
        v: 10255,
        p: 12502
    },
    12514: {
        v: 10256,
        p: 12502
    },
    12515: {
        v: 10257,
        p: 12502
    },
    12516: {
        v: 10258,
        p: 12502
    },
    12517: {
        v: 10259,
        p: 12502
    },
    12518: {
        v: 10260,
        p: 12502
    },
    12519: {
        v: 10261,
        p: 12502
    },
    12520: {
        v: 10262,
        p: 12502
    },
    12521: {
        v: 10263,
        p: 10015,
        s: [12522, 12523, 12524, 12525, 12526, 12527, 12528, 12529, 12530, 12531]
    },
    12522: {
        v: 10264,
        p: 12521
    },
    12523: {
        v: 10265,
        p: 12521
    },
    12524: {
        v: 10266,
        p: 12521
    },
    12525: {
        v: 10267,
        p: 12521
    },
    12526: {
        v: 10268,
        p: 12521
    },
    12527: {
        v: 10269,
        p: 12521
    },
    12528: {
        v: 10270,
        p: 12521
    },
    12529: {
        v: 10271,
        p: 12521
    },
    12530: {
        v: 10272,
        p: 12521
    },
    12531: {
        v: 10273,
        p: 12521
    },
    12532: {
        v: 10274,
        p: 10015,
        s: [12533, 12534, 12535, 12536, 12537, 12538, 12539, 12540, 12541, 12542, 12543, 12544]
    },
    12533: {
        v: 10275,
        p: 12532
    },
    12534: {
        v: 10276,
        p: 12532
    },
    12535: {
        v: 10277,
        p: 12532
    },
    12536: {
        v: 10278,
        p: 12532
    },
    12537: {
        v: 10279,
        p: 12532
    },
    12538: {
        v: 10280,
        p: 12532
    },
    12539: {
        v: 10281,
        p: 12532
    },
    12540: {
        v: 10282,
        p: 12532
    },
    12541: {
        v: 10283,
        p: 12532
    },
    12542: {
        v: 10284,
        p: 12532
    },
    12543: {
        v: 10285,
        p: 12532
    },
    12544: {
        v: 10286,
        p: 12532
    },
    12545: {
        v: 10287,
        p: 10015,
        s: [12546, 12547, 12548, 12549, 12550, 12551, 12552, 12553, 12554, 12555, 12556, 12557, 12558, 12559, 12560, 12561, 12562, 12563]
    },
    12546: {
        v: 10288,
        p: 12545
    },
    12547: {
        v: 10289,
        p: 12545
    },
    12548: {
        v: 10290,
        p: 12545
    },
    12549: {
        v: 10291,
        p: 12545
    },
    12550: {
        v: 10292,
        p: 12545
    },
    12551: {
        v: 10293,
        p: 12545
    },
    12552: {
        v: 10294,
        p: 12545
    },
    12553: {
        v: 10295,
        p: 12545
    },
    12554: {
        v: 10296,
        p: 12545
    },
    12555: {
        v: 10297,
        p: 12545
    },
    12556: {
        v: 10298,
        p: 12545
    },
    12557: {
        v: 10299,
        p: 12545
    },
    12558: {
        v: 10300,
        p: 12545
    },
    12559: {
        v: 10301,
        p: 12545
    },
    12560: {
        v: 10302,
        p: 12545
    },
    12561: {
        v: 10303,
        p: 12545
    },
    12562: {
        v: 10304,
        p: 12545
    },
    12563: {
        v: 10305,
        p: 12545
    },
    12564: {
        v: 10306,
        p: 10015,
        s: [12565, 12566, 12567, 12568, 12569, 12570, 12571, 12572, 12573, 12574, 12575, 12576, 12577, 12578, 12579, 12580, 12581, 12582, 12583]
    },
    12565: {
        v: 10307,
        p: 12564
    },
    12566: {
        v: 10308,
        p: 12564
    },
    12567: {
        v: 10309,
        p: 12564
    },
    12568: {
        v: 10310,
        p: 12564
    },
    12569: {
        v: 10311,
        p: 12564
    },
    12570: {
        v: 10312,
        p: 12564
    },
    12571: {
        v: 10313,
        p: 12564
    },
    12572: {
        v: 10314,
        p: 12564
    },
    12573: {
        v: 10315,
        p: 12564
    },
    12574: {
        v: 10316,
        p: 12564
    },
    12575: {
        v: 10317,
        p: 12564
    },
    12576: {
        v: 10318,
        p: 12564
    },
    12577: {
        v: 10319,
        p: 12564
    },
    12578: {
        v: 10320,
        p: 12564
    },
    12579: {
        v: 10321,
        p: 12564
    },
    12580: {
        v: 10322,
        p: 12564
    },
    12581: {
        v: 10323,
        p: 12564
    },
    12582: {
        v: 10324,
        p: 12564
    },
    12583: {
        v: 10325,
        p: 12564
    },
    12584: {
        v: 10326,
        p: 10015,
        s: [12585, 12586, 12587, 12588, 12589, 12590, 12591, 12592, 12593, 12594, 12595, 12596, 12597]
    },
    12585: {
        v: 10327,
        p: 12584
    },
    12586: {
        v: 10328,
        p: 12584
    },
    12587: {
        v: 10329,
        p: 12584
    },
    12588: {
        v: 10330,
        p: 12584
    },
    12589: {
        v: 10331,
        p: 12584
    },
    12590: {
        v: 10332,
        p: 12584
    },
    12591: {
        v: 10333,
        p: 12584
    },
    12592: {
        v: 10334,
        p: 12584
    },
    12593: {
        v: 10335,
        p: 12584
    },
    12594: {
        v: 10336,
        p: 12584
    },
    12595: {
        v: 10337,
        p: 12584
    },
    12596: {
        v: 10338,
        p: 12584
    },
    12597: {
        v: 10339,
        p: 12584
    },
    12598: {
        v: 10340,
        p: 10015,
        s: [12599, 12600, 12601, 12602, 12603, 12604, 12605, 12606, 12607, 12608, 12609, 12610, 12611, 12612]
    },
    12599: {
        v: 10341,
        p: 12598
    },
    12600: {
        v: 10342,
        p: 12598
    },
    12601: {
        v: 10343,
        p: 12598
    },
    12602: {
        v: 10344,
        p: 12598
    },
    12603: {
        v: 10345,
        p: 12598
    },
    12604: {
        v: 10346,
        p: 12598
    },
    12605: {
        v: 10347,
        p: 12598
    },
    12606: {
        v: 10348,
        p: 12598
    },
    12607: {
        v: 10349,
        p: 12598
    },
    12608: {
        v: 10350,
        p: 12598
    },
    12609: {
        v: 10351,
        p: 12598
    },
    12610: {
        v: 10352,
        p: 12598
    },
    12611: {
        v: 10353,
        p: 12598
    },
    12612: {
        v: 10354,
        p: 12598
    },
    12613: {
        v: 10355,
        p: 10015,
        s: [12614, 12615, 12616, 12617, 12618, 12619, 12620, 12621, 12622, 12623, 12624, 12625, 12626, 12627, 12628, 12629, 12630, 12631]
    },
    12614: {
        v: 10356,
        p: 12613
    },
    12615: {
        v: 10357,
        p: 12613
    },
    12616: {
        v: 10358,
        p: 12613
    },
    12617: {
        v: 10359,
        p: 12613
    },
    12618: {
        v: 10360,
        p: 12613
    },
    12619: {
        v: 10361,
        p: 12613
    },
    12620: {
        v: 10362,
        p: 12613
    },
    12621: {
        v: 10363,
        p: 12613
    },
    12622: {
        v: 10364,
        p: 12613
    },
    12623: {
        v: 10365,
        p: 12613
    },
    12624: {
        v: 10366,
        p: 12613
    },
    12625: {
        v: 10367,
        p: 12613
    },
    12626: {
        v: 10368,
        p: 12613
    },
    12627: {
        v: 10369,
        p: 12613
    },
    12628: {
        v: 10370,
        p: 12613
    },
    12629: {
        v: 10371,
        p: 12613
    },
    12630: {
        v: 10372,
        p: 12613
    },
    12631: {
        v: 10373,
        p: 12613
    },
    12632: {
        v: 10374,
        p: 10015,
        s: [12633, 12634, 12635, 12636, 12637, 12638, 12639, 12640, 12641, 12642, 12643, 12644, 12645, 12646, 12647]
    },
    12633: {
        v: 10375,
        p: 12632
    },
    12634: {
        v: 10376,
        p: 12632
    },
    12635: {
        v: 10377,
        p: 12632
    },
    12636: {
        v: 10378,
        p: 12632
    },
    12637: {
        v: 10379,
        p: 12632
    },
    12638: {
        v: 10380,
        p: 12632
    },
    12639: {
        v: 10381,
        p: 12632
    },
    12640: {
        v: 10382,
        p: 12632
    },
    12641: {
        v: 10383,
        p: 12632
    },
    12642: {
        v: 10384,
        p: 12632
    },
    12643: {
        v: 10385,
        p: 12632
    },
    12644: {
        v: 10386,
        p: 12632
    },
    12645: {
        v: 10387,
        p: 12632
    },
    12646: {
        v: 10388,
        p: 12632
    },
    12647: {
        v: 10389,
        p: 12632
    },
    12648: {
        v: 10390,
        p: 10015,
        s: [12649, 12650, 12651, 12652, 12653, 12654, 12655, 12656, 12657, 12658, 12659, 12660, 12661, 12662, 12663, 12664, 12665, 12666, 12667, 12668, 12669, 12670]
    },
    12649: {
        v: 10391,
        p: 12648
    },
    12650: {
        v: 10392,
        p: 12648
    },
    12651: {
        v: 10393,
        p: 12648
    },
    12652: {
        v: 10394,
        p: 12648
    },
    12653: {
        v: 10395,
        p: 12648
    },
    12654: {
        v: 10396,
        p: 12648
    },
    12655: {
        v: 10397,
        p: 12648
    },
    12656: {
        v: 10398,
        p: 12648
    },
    12657: {
        v: 10399,
        p: 12648
    },
    12658: {
        v: 10400,
        p: 12648
    },
    12659: {
        v: 10401,
        p: 12648
    },
    12660: {
        v: 10402,
        p: 12648
    },
    12661: {
        v: 10403,
        p: 12648
    },
    12662: {
        v: 10404,
        p: 12648
    },
    12663: {
        v: 10405,
        p: 12648
    },
    12664: {
        v: 10406,
        p: 12648
    },
    12665: {
        v: 10407,
        p: 12648
    },
    12666: {
        v: 10408,
        p: 12648
    },
    12667: {
        v: 10409,
        p: 12648
    },
    12668: {
        v: 10410,
        p: 12648
    },
    12669: {
        v: 10411,
        p: 12648
    },
    12670: {
        v: 10412,
        p: 12648
    },
    12671: {
        v: 10413,
        p: 10015,
        s: [12672, 12673, 12674, 12675, 12676, 12677, 12678, 12679, 12680, 12681, 12682, 12683, 12684, 12685, 12686, 12687]
    },
    12672: {
        v: 10414,
        p: 12671
    },
    12673: {
        v: 10415,
        p: 12671
    },
    12674: {
        v: 10416,
        p: 12671
    },
    12675: {
        v: 10417,
        p: 12671
    },
    12676: {
        v: 10418,
        p: 12671
    },
    12677: {
        v: 10419,
        p: 12671
    },
    12678: {
        v: 10420,
        p: 12671
    },
    12679: {
        v: 10421,
        p: 12671
    },
    12680: {
        v: 10422,
        p: 12671
    },
    12681: {
        v: 10423,
        p: 12671
    },
    12682: {
        v: 10424,
        p: 12671
    },
    12683: {
        v: 10425,
        p: 12671
    },
    12684: {
        v: 10426,
        p: 12671
    },
    12685: {
        v: 10427,
        p: 12671
    },
    12686: {
        v: 10428,
        p: 12671
    },
    12687: {
        v: 10429,
        p: 12671
    },
    12688: {
        v: 10430,
        p: 10015,
        s: [12689, 12690, 12691, 12692, 12693, 12694, 12695, 12696, 12697, 12698, 12699, 12700, 12701, 12702, 12703, 12704, 12705, 12706, 12707, 12708]
    },
    12689: {
        v: 10431,
        p: 12688
    },
    12690: {
        v: 10432,
        p: 12688
    },
    12691: {
        v: 10433,
        p: 12688
    },
    12692: {
        v: 10434,
        p: 12688
    },
    12693: {
        v: 10435,
        p: 12688
    },
    12694: {
        v: 10436,
        p: 12688
    },
    12695: {
        v: 10437,
        p: 12688
    },
    12696: {
        v: 10438,
        p: 12688
    },
    12697: {
        v: 10439,
        p: 12688
    },
    12698: {
        v: 10440,
        p: 12688
    },
    12699: {
        v: 10441,
        p: 12688
    },
    12700: {
        v: 10442,
        p: 12688
    },
    12701: {
        v: 10443,
        p: 12688
    },
    12702: {
        v: 10444,
        p: 12688
    },
    12703: {
        v: 10445,
        p: 12688
    },
    12704: {
        v: 10446,
        p: 12688
    },
    12705: {
        v: 10447,
        p: 12688
    },
    12706: {
        v: 10448,
        p: 12688
    },
    12707: {
        v: 10449,
        p: 12688
    },
    12708: {
        v: 10450,
        p: 12688
    },
    12709: {
        v: 10451,
        p: 10015,
        s: [12710, 12711, 12712, 12713, 12714, 12715, 12716, 12717, 12718, 12719, 12720, 12721, 12722, 12723, 12724, 12725, 12726, 12727, 12728, 12729, 12730, 12731]
    },
    12710: {
        v: 10452,
        p: 12709
    },
    12711: {
        v: 10453,
        p: 12709
    },
    12712: {
        v: 10454,
        p: 12709
    },
    12713: {
        v: 10455,
        p: 12709
    },
    12714: {
        v: 10456,
        p: 12709
    },
    12715: {
        v: 10457,
        p: 12709
    },
    12716: {
        v: 10458,
        p: 12709
    },
    12717: {
        v: 10459,
        p: 12709
    },
    12718: {
        v: 10460,
        p: 12709
    },
    12719: {
        v: 10461,
        p: 12709
    },
    12720: {
        v: 10462,
        p: 12709
    },
    12721: {
        v: 10463,
        p: 12709
    },
    12722: {
        v: 10464,
        p: 12709
    },
    12723: {
        v: 10465,
        p: 12709
    },
    12724: {
        v: 10466,
        p: 12709
    },
    12725: {
        v: 10467,
        p: 12709
    },
    12726: {
        v: 10468,
        p: 12709
    },
    12727: {
        v: 10469,
        p: 12709
    },
    12728: {
        v: 10470,
        p: 12709
    },
    12729: {
        v: 10471,
        p: 12709
    },
    12730: {
        v: 10472,
        p: 12709
    },
    12731: {
        v: 10473,
        p: 12709
    },
    12732: {
        v: 10474,
        p: 10015,
        s: [12733, 12734, 12735, 12736, 12737, 12738, 12739, 12740, 12741, 12742, 12743, 12744, 12745, 12746, 12747, 12748, 12749, 12750, 12751, 12752, 12753, 12754, 12755, 12756]
    },
    12733: {
        v: 10475,
        p: 12732
    },
    12734: {
        v: 10476,
        p: 12732
    },
    12735: {
        v: 10477,
        p: 12732
    },
    12736: {
        v: 10478,
        p: 12732
    },
    12737: {
        v: 10479,
        p: 12732
    },
    12738: {
        v: 10480,
        p: 12732
    },
    12739: {
        v: 10481,
        p: 12732
    },
    12740: {
        v: 10482,
        p: 12732
    },
    12741: {
        v: 10483,
        p: 12732
    },
    12742: {
        v: 10484,
        p: 12732
    },
    12743: {
        v: 10485,
        p: 12732
    },
    12744: {
        v: 10486,
        p: 12732
    },
    12745: {
        v: 10487,
        p: 12732
    },
    12746: {
        v: 10488,
        p: 12732
    },
    12747: {
        v: 10489,
        p: 12732
    },
    12748: {
        v: 10490,
        p: 12732
    },
    12749: {
        v: 10491,
        p: 12732
    },
    12750: {
        v: 10492,
        p: 12732
    },
    12751: {
        v: 10493,
        p: 12732
    },
    12752: {
        v: 10494,
        p: 12732
    },
    12753: {
        v: 10495,
        p: 12732
    },
    12754: {
        v: 10496,
        p: 12732
    },
    12755: {
        v: 10497,
        p: 12732
    },
    12756: {
        v: 10498,
        p: 12732
    },
    12757: {
        v: 10499,
        p: 10015,
        s: [12758, 12759, 12760, 12761, 12762, 12763, 12764, 12765, 12766, 12767]
    },
    12758: {
        v: 10500,
        p: 12757
    },
    12759: {
        v: 10501,
        p: 12757
    },
    12760: {
        v: 10502,
        p: 12757
    },
    12761: {
        v: 10503,
        p: 12757
    },
    12762: {
        v: 10504,
        p: 12757
    },
    12763: {
        v: 10505,
        p: 12757
    },
    12764: {
        v: 10506,
        p: 12757
    },
    12765: {
        v: 10507,
        p: 12757
    },
    12766: {
        v: 10508,
        p: 12757
    },
    12767: {
        v: 10509,
        p: 12757
    },
    12768: {
        v: 10510,
        p: 10015,
        s: [12769, 12770, 12771, 12772, 12773, 12774, 12775, 12776, 12777, 12778, 12779, 12780, 12781, 12782, 12783, 12784, 12785]
    },
    12769: {
        v: 10511,
        p: 12768
    },
    12770: {
        v: 10512,
        p: 12768
    },
    12771: {
        v: 10513,
        p: 12768
    },
    12772: {
        v: 10514,
        p: 12768
    },
    12773: {
        v: 10515,
        p: 12768
    },
    12774: {
        v: 10516,
        p: 12768
    },
    12775: {
        v: 10517,
        p: 12768
    },
    12776: {
        v: 10518,
        p: 12768
    },
    12777: {
        v: 10519,
        p: 12768
    },
    12778: {
        v: 10520,
        p: 12768
    },
    12779: {
        v: 10521,
        p: 12768
    },
    12780: {
        v: 10522,
        p: 12768
    },
    12781: {
        v: 10523,
        p: 12768
    },
    12782: {
        v: 10524,
        p: 12768
    },
    12783: {
        v: 10525,
        p: 12768
    },
    12784: {
        v: 10526,
        p: 12768
    },
    12785: {
        v: 10527,
        p: 12768
    },
    12786: {
        v: 10528,
        p: 10015,
        s: [12787, 12788, 12789, 12790, 12791, 12792, 12793, 12794, 12795, 12796, 12797]
    },
    12787: {
        v: 10529,
        p: 12786
    },
    12788: {
        v: 10530,
        p: 12786
    },
    12789: {
        v: 10531,
        p: 12786
    },
    12790: {
        v: 10532,
        p: 12786
    },
    12791: {
        v: 10533,
        p: 12786
    },
    12792: {
        v: 10534,
        p: 12786
    },
    12793: {
        v: 10535,
        p: 12786
    },
    12794: {
        v: 10536,
        p: 12786
    },
    12795: {
        v: 10537,
        p: 12786
    },
    12796: {
        v: 10538,
        p: 12786
    },
    12797: {
        v: 10539,
        p: 12786
    },
    12798: {
        v: 10540,
        p: 10015,
        s: [12799, 12800, 12801, 12802, 12803, 12804, 12805, 12806]
    },
    12799: {
        v: 10541,
        p: 12798
    },
    12800: {
        v: 10542,
        p: 12798
    },
    12801: {
        v: 10543,
        p: 12798
    },
    12802: {
        v: 10544,
        p: 12798
    },
    12803: {
        v: 10545,
        p: 12798
    },
    12804: {
        v: 10546,
        p: 12798
    },
    12805: {
        v: 10547,
        p: 12798
    },
    12806: {
        v: 10548,
        p: 12798
    },
    12807: {
        v: 10549,
        p: 10015,
        s: [12808, 12809, 12810, 12811, 12812, 12813, 12814, 12815, 12816, 12817, 12818, 12819, 12820, 12821, 12822, 12823, 12824]
    },
    12808: {
        v: 10550,
        p: 12807
    },
    12809: {
        v: 10551,
        p: 12807
    },
    12810: {
        v: 10552,
        p: 12807
    },
    12811: {
        v: 10553,
        p: 12807
    },
    12812: {
        v: 10554,
        p: 12807
    },
    12813: {
        v: 10555,
        p: 12807
    },
    12814: {
        v: 10556,
        p: 12807
    },
    12815: {
        v: 10557,
        p: 12807
    },
    12816: {
        v: 10558,
        p: 12807
    },
    12817: {
        v: 10559,
        p: 12807
    },
    12818: {
        v: 10560,
        p: 12807
    },
    12819: {
        v: 10561,
        p: 12807
    },
    12820: {
        v: 10562,
        p: 12807
    },
    12821: {
        v: 10563,
        p: 12807
    },
    12822: {
        v: 10564,
        p: 12807
    },
    12823: {
        v: 10565,
        p: 12807
    },
    12824: {
        v: 10566,
        p: 12807
    },
    12825: {
        v: 10567,
        p: 10015,
        s: [12826, 12827, 12828, 12829, 12830, 12831, 12832, 12833, 12834]
    },
    12826: {
        v: 10568,
        p: 12825
    },
    12827: {
        v: 10569,
        p: 12825
    },
    12828: {
        v: 10570,
        p: 12825
    },
    12829: {
        v: 10571,
        p: 12825
    },
    12830: {
        v: 10572,
        p: 12825
    },
    12831: {
        v: 10573,
        p: 12825
    },
    12832: {
        v: 10574,
        p: 12825
    },
    12833: {
        v: 10575,
        p: 12825
    },
    12834: {
        v: 10576,
        p: 12825
    },
    12835: {
        v: 10577,
        p: 10015,
        s: [12836, 12837, 12838, 12839, 12840]
    },
    12836: {
        v: 10578,
        p: 12835
    },
    12837: {
        v: 10579,
        p: 12835
    },
    12838: {
        v: 10580,
        p: 12835
    },
    12839: {
        v: 10581,
        p: 12835
    },
    12840: {
        v: 10582,
        p: 12835
    },
    12841: {
        v: 10583,
        p: 10015,
        s: [12842, 12843, 12844, 12845, 12846, 12847, 12848, 12849, 12850, 12851, 12852, 12853, 12854, 12855]
    },
    12842: {
        v: 10584,
        p: 12841
    },
    12843: {
        v: 10585,
        p: 12841
    },
    12844: {
        v: 10586,
        p: 12841
    },
    12845: {
        v: 10587,
        p: 12841
    },
    12846: {
        v: 10588,
        p: 12841
    },
    12847: {
        v: 10589,
        p: 12841
    },
    12848: {
        v: 10590,
        p: 12841
    },
    12849: {
        v: 10591,
        p: 12841
    },
    12850: {
        v: 10592,
        p: 12841
    },
    12851: {
        v: 10593,
        p: 12841
    },
    12852: {
        v: 10594,
        p: 12841
    },
    12853: {
        v: 10595,
        p: 12841
    },
    12854: {
        v: 10596,
        p: 12841
    },
    12855: {
        v: 10597,
        p: 12841
    },
    12856: {
        v: 10598,
        p: 10015,
        s: [12857, 12858, 12859, 12860, 12861, 12862, 12863, 12864, 12865, 12866, 12867, 12868, 12869, 12870, 12871, 12872, 12873, 12874, 12875]
    },
    12857: {
        v: 10599,
        p: 12856
    },
    12858: {
        v: 10600,
        p: 12856
    },
    12859: {
        v: 10601,
        p: 12856
    },
    12860: {
        v: 10602,
        p: 12856
    },
    12861: {
        v: 10603,
        p: 12856
    },
    12862: {
        v: 10604,
        p: 12856
    },
    12863: {
        v: 10605,
        p: 12856
    },
    12864: {
        v: 10606,
        p: 12856
    },
    12865: {
        v: 10607,
        p: 12856
    },
    12866: {
        v: 10608,
        p: 12856
    },
    12867: {
        v: 10609,
        p: 12856
    },
    12868: {
        v: 10610,
        p: 12856
    },
    12869: {
        v: 10611,
        p: 12856
    },
    12870: {
        v: 10612,
        p: 12856
    },
    12871: {
        v: 10613,
        p: 12856
    },
    12872: {
        v: 10614,
        p: 12856
    },
    12873: {
        v: 10615,
        p: 12856
    },
    12874: {
        v: 10616,
        p: 12856
    },
    12875: {
        v: 10617,
        p: 12856
    },
    12876: {
        v: 10618,
        p: 10015,
        s: [12877, 12878, 12879, 12880]
    },
    12877: {
        v: 10619,
        p: 12876
    },
    12878: {
        v: 10620,
        p: 12876
    },
    12879: {
        v: 10621,
        p: 12876
    },
    12880: {
        v: 10622,
        p: 12876
    },
    15201: {
        v: 10059,
        p: 10017,
        s: [15202, 15203, 15204, 15205, 15206, 15207, 15208, 15209, 15210, 15211, 15212, 15213, 15214, 15215, 15216, 15217, 15218, 15219, 15220]
    },
    15202: {
        v: 10060,
        p: 15201
    },
    15203: {
        v: 10061,
        p: 15201
    },
    15204: {
        v: 10062,
        p: 15201
    },
    15205: {
        v: 10063,
        p: 15201
    },
    15206: {
        v: 10064,
        p: 15201
    },
    15207: {
        v: 10065,
        p: 15201
    },
    15208: {
        v: 10066,
        p: 15201
    },
    15209: {
        v: 10067,
        p: 15201
    },
    15210: {
        v: 10068,
        p: 15201
    },
    15211: {
        v: 10069,
        p: 15201
    },
    15212: {
        v: 10070,
        p: 15201
    },
    15213: {
        v: 10071,
        p: 15201
    },
    15214: {
        v: 10072,
        p: 15201
    },
    15215: {
        v: 10073,
        p: 15201
    },
    15216: {
        v: 10074,
        p: 15201
    },
    15217: {
        v: 10075,
        p: 15201
    },
    15218: {
        v: 10076,
        p: 15201
    },
    15219: {
        v: 10077,
        p: 15201
    },
    15220: {
        v: 10078,
        p: 15201
    },
    15221: {
        v: 10079,
        p: 10017,
        s: [15222, 15223, 15224, 15225, 15226, 15227, 15228, 15229, 15230, 15231, 15232, 15233, 15234, 15235, 15236, 15237, 15238, 15239, 15240]
    },
    15222: {
        v: 10080,
        p: 15221
    },
    15223: {
        v: 10081,
        p: 15221
    },
    15224: {
        v: 10082,
        p: 15221
    },
    15225: {
        v: 10083,
        p: 15221
    },
    15226: {
        v: 10084,
        p: 15221
    },
    15227: {
        v: 10085,
        p: 15221
    },
    15228: {
        v: 10086,
        p: 15221
    },
    15229: {
        v: 10087,
        p: 15221
    },
    15230: {
        v: 10088,
        p: 15221
    },
    15231: {
        v: 10089,
        p: 15221
    },
    15232: {
        v: 10090,
        p: 15221
    },
    15233: {
        v: 10091,
        p: 15221
    },
    15234: {
        v: 10092,
        p: 15221
    },
    15235: {
        v: 10093,
        p: 15221
    },
    15236: {
        v: 10094,
        p: 15221
    },
    15237: {
        v: 10095,
        p: 15221
    },
    15238: {
        v: 10096,
        p: 15221
    },
    15239: {
        v: 10097,
        p: 15221
    },
    15240: {
        v: 10098,
        p: 15221
    },
    15241: {
        v: 10099,
        p: 10017,
        s: [15242, 15243, 15244, 15245, 15246, 15247, 15248, 15249, 15250, 15251, 15252, 15253, 15254, 15255, 15256, 15257, 15258, 15259, 15260, 15261]
    },
    15242: {
        v: 10100,
        p: 15241
    },
    15243: {
        v: 10101,
        p: 15241
    },
    15244: {
        v: 10102,
        p: 15241
    },
    15245: {
        v: 10103,
        p: 15241
    },
    15246: {
        v: 10104,
        p: 15241
    },
    15247: {
        v: 10105,
        p: 15241
    },
    15248: {
        v: 10106,
        p: 15241
    },
    15249: {
        v: 10107,
        p: 15241
    },
    15250: {
        v: 10108,
        p: 15241
    },
    15251: {
        v: 10109,
        p: 15241
    },
    15252: {
        v: 10110,
        p: 15241
    },
    15253: {
        v: 10111,
        p: 15241
    },
    15254: {
        v: 10112,
        p: 15241
    },
    15255: {
        v: 10113,
        p: 15241
    },
    15256: {
        v: 10114,
        p: 15241
    },
    15257: {
        v: 10115,
        p: 15241
    },
    15258: {
        v: 10116,
        p: 15241
    },
    15259: {
        v: 10117,
        p: 15241
    },
    15260: {
        v: 10118,
        p: 15241
    },
    15261: {
        v: 10119,
        p: 15241
    },
    15262: {
        v: 10120,
        p: 10017,
        s: [15263, 15264, 15265, 15266, 15267, 15268, 15269, 15270, 15271, 15272, 15273, 15274, 15275, 15276, 15277, 15278, 15279, 15280, 15281, 15282, 15283, 15284, 15285, 15286, 15287, 15288, 15289, 15290, 15291, 15292, 15293, 15294, 15295, 15296, 15297, 15298, 15299, 15300, 15301, 15302, 15303]
    },
    15263: {
        v: 10121,
        p: 15262
    },
    15264: {
        v: 10122,
        p: 15262
    },
    15265: {
        v: 10123,
        p: 15262
    },
    15266: {
        v: 10124,
        p: 15262
    },
    15267: {
        v: 10125,
        p: 15262
    },
    15268: {
        v: 10126,
        p: 15262
    },
    15269: {
        v: 10127,
        p: 15262
    },
    15270: {
        v: 10128,
        p: 15262
    },
    15271: {
        v: 10129,
        p: 15262
    },
    15272: {
        v: 10130,
        p: 15262
    },
    15273: {
        v: 10131,
        p: 15262
    },
    15274: {
        v: 10132,
        p: 15262
    },
    15275: {
        v: 10133,
        p: 15262
    },
    15276: {
        v: 10134,
        p: 15262
    },
    15277: {
        v: 10135,
        p: 15262
    },
    15278: {
        v: 10136,
        p: 15262
    },
    15279: {
        v: 10137,
        p: 15262
    },
    15280: {
        v: 10138,
        p: 15262
    },
    15281: {
        v: 10139,
        p: 15262
    },
    15282: {
        v: 10140,
        p: 15262
    },
    15283: {
        v: 10141,
        p: 15262
    },
    15284: {
        v: 10142,
        p: 15262
    },
    15285: {
        v: 10143,
        p: 15262
    },
    15286: {
        v: 10144,
        p: 15262
    },
    15287: {
        v: 10145,
        p: 15262
    },
    15288: {
        v: 10146,
        p: 15262
    },
    15289: {
        v: 10147,
        p: 15262
    },
    15290: {
        v: 10148,
        p: 15262
    },
    15291: {
        v: 10149,
        p: 15262
    },
    15292: {
        v: 10150,
        p: 15262
    },
    15293: {
        v: 10151,
        p: 15262
    },
    15294: {
        v: 10152,
        p: 15262
    },
    15295: {
        v: 10153,
        p: 15262
    },
    15296: {
        v: 10154,
        p: 15262
    },
    15297: {
        v: 10155,
        p: 15262
    },
    15298: {
        v: 10156,
        p: 15262
    },
    15299: {
        v: 10157,
        p: 15262
    },
    15300: {
        v: 10158,
        p: 15262
    },
    15301: {
        v: 10159,
        p: 15262
    },
    15302: {
        v: 10160,
        p: 15262
    },
    15303: {
        v: 10161,
        p: 15262
    },
    15304: {
        v: 10162,
        p: 10017,
        s: [15305, 15306, 15307, 15308, 15309, 15310, 15311, 15312, 15313, 15314, 15315, 15316]
    },
    15305: {
        v: 10163,
        p: 15304
    },
    15306: {
        v: 10164,
        p: 15304
    },
    15307: {
        v: 10165,
        p: 15304
    },
    15308: {
        v: 10166,
        p: 15304
    },
    15309: {
        v: 10167,
        p: 15304
    },
    15310: {
        v: 10168,
        p: 15304
    },
    15311: {
        v: 10169,
        p: 15304
    },
    15312: {
        v: 10170,
        p: 15304
    },
    15313: {
        v: 10171,
        p: 15304
    },
    15314: {
        v: 10172,
        p: 15304
    },
    15315: {
        v: 10173,
        p: 15304
    },
    15316: {
        v: 10174,
        p: 15304
    },
    15317: {
        v: 10175,
        p: 10017,
        s: [15318, 15319, 15320, 15321, 15322, 15323, 15324, 15325, 15326, 15327, 15328, 15329]
    },
    15318: {
        v: 10176,
        p: 15317
    },
    15319: {
        v: 10177,
        p: 15317
    },
    15320: {
        v: 10178,
        p: 15317
    },
    15321: {
        v: 10179,
        p: 15317
    },
    15322: {
        v: 10180,
        p: 15317
    },
    15323: {
        v: 10181,
        p: 15317
    },
    15324: {
        v: 10182,
        p: 15317
    },
    15325: {
        v: 10183,
        p: 15317
    },
    15326: {
        v: 10184,
        p: 15317
    },
    15327: {
        v: 10185,
        p: 15317
    },
    15328: {
        v: 10186,
        p: 15317
    },
    15329: {
        v: 10187,
        p: 15317
    },
    15330: {
        v: 10188,
        p: 10017,
        s: [15331, 15332, 15333, 15334, 15335, 15336, 15337, 15338, 15339, 15340, 15341, 15342, 15343, 15344, 15345]
    },
    15331: {
        v: 10189,
        p: 15330
    },
    15332: {
        v: 10190,
        p: 15330
    },
    15333: {
        v: 10191,
        p: 15330
    },
    15334: {
        v: 10192,
        p: 15330
    },
    15335: {
        v: 10193,
        p: 15330
    },
    15336: {
        v: 10194,
        p: 15330
    },
    15337: {
        v: 10195,
        p: 15330
    },
    15338: {
        v: 10196,
        p: 15330
    },
    15339: {
        v: 10197,
        p: 15330
    },
    15340: {
        v: 10198,
        p: 15330
    },
    15341: {
        v: 10199,
        p: 15330
    },
    15342: {
        v: 10200,
        p: 15330
    },
    15343: {
        v: 10201,
        p: 15330
    },
    15344: {
        v: 10202,
        p: 15330
    },
    15345: {
        v: 10203,
        p: 15330
    },
    15346: {
        v: 10204,
        p: 10017,
        s: [15347, 15348, 15349, 15350, 15351, 15352, 15353, 15354, 15355, 15356]
    },
    15347: {
        v: 10205,
        p: 15346
    },
    15348: {
        v: 10206,
        p: 15346
    },
    15349: {
        v: 10207,
        p: 15346
    },
    15350: {
        v: 10208,
        p: 15346
    },
    15351: {
        v: 10209,
        p: 15346
    },
    15352: {
        v: 10210,
        p: 15346
    },
    15353: {
        v: 10211,
        p: 15346
    },
    15354: {
        v: 10212,
        p: 15346
    },
    15355: {
        v: 10213,
        p: 15346
    },
    15356: {
        v: 10214,
        p: 15346
    },
    15357: {
        v: 10215,
        p: 10017,
        s: [15358, 15359, 15360, 15361, 15362, 15363, 15364, 15365, 15366, 15367, 15368, 15369, 15370, 15371, 15372]
    },
    15358: {
        v: 10216,
        p: 15357
    },
    15359: {
        v: 10217,
        p: 15357
    },
    15360: {
        v: 10218,
        p: 15357
    },
    15361: {
        v: 10219,
        p: 15357
    },
    15362: {
        v: 10220,
        p: 15357
    },
    15363: {
        v: 10221,
        p: 15357
    },
    15364: {
        v: 10222,
        p: 15357
    },
    15365: {
        v: 10223,
        p: 15357
    },
    15366: {
        v: 10224,
        p: 15357
    },
    15367: {
        v: 10225,
        p: 15357
    },
    15368: {
        v: 10226,
        p: 15357
    },
    15369: {
        v: 10227,
        p: 15357
    },
    15370: {
        v: 10228,
        p: 15357
    },
    15371: {
        v: 10229,
        p: 15357
    },
    15372: {
        v: 10230,
        p: 15357
    },
    15373: {
        v: 10231,
        p: 10017,
        s: [15374, 15375, 15376, 15377, 15378, 15379, 15380, 15381, 15382, 15383, 15384, 15385]
    },
    15374: {
        v: 10232,
        p: 15373
    },
    15375: {
        v: 10233,
        p: 15373
    },
    15376: {
        v: 10234,
        p: 15373
    },
    15377: {
        v: 10235,
        p: 15373
    },
    15378: {
        v: 10236,
        p: 15373
    },
    15379: {
        v: 10237,
        p: 15373
    },
    15380: {
        v: 10238,
        p: 15373
    },
    15381: {
        v: 10239,
        p: 15373
    },
    15382: {
        v: 10240,
        p: 15373
    },
    15383: {
        v: 10241,
        p: 15373
    },
    15384: {
        v: 10242,
        p: 15373
    },
    15385: {
        v: 10243,
        p: 15373
    },
    15386: {
        v: 10244,
        p: 10017,
        s: [15387, 15388, 15389, 15390, 15391, 15392, 15393, 15394, 15395, 15396, 15397, 15398, 15399, 15400, 15401, 15402, 15403, 15404]
    },
    15387: {
        v: 10245,
        p: 15386
    },
    15388: {
        v: 10246,
        p: 15386
    },
    15389: {
        v: 10247,
        p: 15386
    },
    15390: {
        v: 10248,
        p: 15386
    },
    15391: {
        v: 10249,
        p: 15386
    },
    15392: {
        v: 10250,
        p: 15386
    },
    15393: {
        v: 10251,
        p: 15386
    },
    15394: {
        v: 10252,
        p: 15386
    },
    15395: {
        v: 10253,
        p: 15386
    },
    15396: {
        v: 10254,
        p: 15386
    },
    15397: {
        v: 10255,
        p: 15386
    },
    15398: {
        v: 10256,
        p: 15386
    },
    15399: {
        v: 10257,
        p: 15386
    },
    15400: {
        v: 10258,
        p: 15386
    },
    15401: {
        v: 10259,
        p: 15386
    },
    15402: {
        v: 10260,
        p: 15386
    },
    15403: {
        v: 10261,
        p: 15386
    },
    15404: {
        v: 10262,
        p: 15386
    },
    15405: {
        v: 10263,
        p: 10017,
        s: [15406, 15407, 15408, 15409, 15410, 15411, 15412, 15413, 15414, 15415]
    },
    15406: {
        v: 10264,
        p: 15405
    },
    15407: {
        v: 10265,
        p: 15405
    },
    15408: {
        v: 10266,
        p: 15405
    },
    15409: {
        v: 10267,
        p: 15405
    },
    15410: {
        v: 10268,
        p: 15405
    },
    15411: {
        v: 10269,
        p: 15405
    },
    15412: {
        v: 10270,
        p: 15405
    },
    15413: {
        v: 10271,
        p: 15405
    },
    15414: {
        v: 10272,
        p: 15405
    },
    15415: {
        v: 10273,
        p: 15405
    },
    15416: {
        v: 10274,
        p: 10017,
        s: [15417, 15418, 15419, 15420, 15421, 15422, 15423, 15424, 15425, 15426, 15427, 15428]
    },
    15417: {
        v: 10275,
        p: 15416
    },
    15418: {
        v: 10276,
        p: 15416
    },
    15419: {
        v: 10277,
        p: 15416
    },
    15420: {
        v: 10278,
        p: 15416
    },
    15421: {
        v: 10279,
        p: 15416
    },
    15422: {
        v: 10280,
        p: 15416
    },
    15423: {
        v: 10281,
        p: 15416
    },
    15424: {
        v: 10282,
        p: 15416
    },
    15425: {
        v: 10283,
        p: 15416
    },
    15426: {
        v: 10284,
        p: 15416
    },
    15427: {
        v: 10285,
        p: 15416
    },
    15428: {
        v: 10286,
        p: 15416
    },
    15429: {
        v: 10287,
        p: 10017,
        s: [15430, 15431, 15432, 15433, 15434, 15435, 15436, 15437, 15438, 15439, 15440, 15441, 15442, 15443, 15444, 15445, 15446, 15447]
    },
    15430: {
        v: 10288,
        p: 15429
    },
    15431: {
        v: 10289,
        p: 15429
    },
    15432: {
        v: 10290,
        p: 15429
    },
    15433: {
        v: 10291,
        p: 15429
    },
    15434: {
        v: 10292,
        p: 15429
    },
    15435: {
        v: 10293,
        p: 15429
    },
    15436: {
        v: 10294,
        p: 15429
    },
    15437: {
        v: 10295,
        p: 15429
    },
    15438: {
        v: 10296,
        p: 15429
    },
    15439: {
        v: 10297,
        p: 15429
    },
    15440: {
        v: 10298,
        p: 15429
    },
    15441: {
        v: 10299,
        p: 15429
    },
    15442: {
        v: 10300,
        p: 15429
    },
    15443: {
        v: 10301,
        p: 15429
    },
    15444: {
        v: 10302,
        p: 15429
    },
    15445: {
        v: 10303,
        p: 15429
    },
    15446: {
        v: 10304,
        p: 15429
    },
    15447: {
        v: 10305,
        p: 15429
    },
    15448: {
        v: 10306,
        p: 10017,
        s: [15449, 15450, 15451, 15452, 15453, 15454, 15455, 15456, 15457, 15458, 15459, 15460, 15461, 15462, 15463, 15464, 15465, 15466, 15467]
    },
    15449: {
        v: 10307,
        p: 15448
    },
    15450: {
        v: 10308,
        p: 15448
    },
    15451: {
        v: 10309,
        p: 15448
    },
    15452: {
        v: 10310,
        p: 15448
    },
    15453: {
        v: 10311,
        p: 15448
    },
    15454: {
        v: 10312,
        p: 15448
    },
    15455: {
        v: 10313,
        p: 15448
    },
    15456: {
        v: 10314,
        p: 15448
    },
    15457: {
        v: 10315,
        p: 15448
    },
    15458: {
        v: 10316,
        p: 15448
    },
    15459: {
        v: 10317,
        p: 15448
    },
    15460: {
        v: 10318,
        p: 15448
    },
    15461: {
        v: 10319,
        p: 15448
    },
    15462: {
        v: 10320,
        p: 15448
    },
    15463: {
        v: 10321,
        p: 15448
    },
    15464: {
        v: 10322,
        p: 15448
    },
    15465: {
        v: 10323,
        p: 15448
    },
    15466: {
        v: 10324,
        p: 15448
    },
    15467: {
        v: 10325,
        p: 15448
    },
    15468: {
        v: 10326,
        p: 10017,
        s: [15469, 15470, 15471, 15472, 15473, 15474, 15475, 15476, 15477, 15478, 15479, 15480, 15481]
    },
    15469: {
        v: 10327,
        p: 15468
    },
    15470: {
        v: 10328,
        p: 15468
    },
    15471: {
        v: 10329,
        p: 15468
    },
    15472: {
        v: 10330,
        p: 15468
    },
    15473: {
        v: 10331,
        p: 15468
    },
    15474: {
        v: 10332,
        p: 15468
    },
    15475: {
        v: 10333,
        p: 15468
    },
    15476: {
        v: 10334,
        p: 15468
    },
    15477: {
        v: 10335,
        p: 15468
    },
    15478: {
        v: 10336,
        p: 15468
    },
    15479: {
        v: 10337,
        p: 15468
    },
    15480: {
        v: 10338,
        p: 15468
    },
    15481: {
        v: 10339,
        p: 15468
    },
    15482: {
        v: 10340,
        p: 10017,
        s: [15483, 15484, 15485, 15486, 15487, 15488, 15489, 15490, 15491, 15492, 15493, 15494, 15495, 15496]
    },
    15483: {
        v: 10341,
        p: 15482
    },
    15484: {
        v: 10342,
        p: 15482
    },
    15485: {
        v: 10343,
        p: 15482
    },
    15486: {
        v: 10344,
        p: 15482
    },
    15487: {
        v: 10345,
        p: 15482
    },
    15488: {
        v: 10346,
        p: 15482
    },
    15489: {
        v: 10347,
        p: 15482
    },
    15490: {
        v: 10348,
        p: 15482
    },
    15491: {
        v: 10349,
        p: 15482
    },
    15492: {
        v: 10350,
        p: 15482
    },
    15493: {
        v: 10351,
        p: 15482
    },
    15494: {
        v: 10352,
        p: 15482
    },
    15495: {
        v: 10353,
        p: 15482
    },
    15496: {
        v: 10354,
        p: 15482
    },
    15497: {
        v: 10355,
        p: 10017,
        s: [15498, 15499, 15500, 15501, 15502, 15503, 15504, 15505, 15506, 15507, 15508, 15509, 15510, 15511, 15512, 15513, 15514, 15515]
    },
    15498: {
        v: 10356,
        p: 15497
    },
    15499: {
        v: 10357,
        p: 15497
    },
    15500: {
        v: 10358,
        p: 15497
    },
    15501: {
        v: 10359,
        p: 15497
    },
    15502: {
        v: 10360,
        p: 15497
    },
    15503: {
        v: 10361,
        p: 15497
    },
    15504: {
        v: 10362,
        p: 15497
    },
    15505: {
        v: 10363,
        p: 15497
    },
    15506: {
        v: 10364,
        p: 15497
    },
    15507: {
        v: 10365,
        p: 15497
    },
    15508: {
        v: 10366,
        p: 15497
    },
    15509: {
        v: 10367,
        p: 15497
    },
    15510: {
        v: 10368,
        p: 15497
    },
    15511: {
        v: 10369,
        p: 15497
    },
    15512: {
        v: 10370,
        p: 15497
    },
    15513: {
        v: 10371,
        p: 15497
    },
    15514: {
        v: 10372,
        p: 15497
    },
    15515: {
        v: 10373,
        p: 15497
    },
    15516: {
        v: 10374,
        p: 10017,
        s: [15517, 15518, 15519, 15520, 15521, 15522, 15523, 15524, 15525, 15526, 15527, 15528, 15529, 15530, 15531]
    },
    15517: {
        v: 10375,
        p: 15516
    },
    15518: {
        v: 10376,
        p: 15516
    },
    15519: {
        v: 10377,
        p: 15516
    },
    15520: {
        v: 10378,
        p: 15516
    },
    15521: {
        v: 10379,
        p: 15516
    },
    15522: {
        v: 10380,
        p: 15516
    },
    15523: {
        v: 10381,
        p: 15516
    },
    15524: {
        v: 10382,
        p: 15516
    },
    15525: {
        v: 10383,
        p: 15516
    },
    15526: {
        v: 10384,
        p: 15516
    },
    15527: {
        v: 10385,
        p: 15516
    },
    15528: {
        v: 10386,
        p: 15516
    },
    15529: {
        v: 10387,
        p: 15516
    },
    15530: {
        v: 10388,
        p: 15516
    },
    15531: {
        v: 10389,
        p: 15516
    },
    15532: {
        v: 10390,
        p: 10017,
        s: [15533, 15534, 15535, 15536, 15537, 15538, 15539, 15540, 15541, 15542, 15543, 15544, 15545, 15546, 15547, 15548, 15549, 15550, 15551, 15552, 15553, 15554]
    },
    15533: {
        v: 10391,
        p: 15532
    },
    15534: {
        v: 10392,
        p: 15532
    },
    15535: {
        v: 10393,
        p: 15532
    },
    15536: {
        v: 10394,
        p: 15532
    },
    15537: {
        v: 10395,
        p: 15532
    },
    15538: {
        v: 10396,
        p: 15532
    },
    15539: {
        v: 10397,
        p: 15532
    },
    15540: {
        v: 10398,
        p: 15532
    },
    15541: {
        v: 10399,
        p: 15532
    },
    15542: {
        v: 10400,
        p: 15532
    },
    15543: {
        v: 10401,
        p: 15532
    },
    15544: {
        v: 10402,
        p: 15532
    },
    15545: {
        v: 10403,
        p: 15532
    },
    15546: {
        v: 10404,
        p: 15532
    },
    15547: {
        v: 10405,
        p: 15532
    },
    15548: {
        v: 10406,
        p: 15532
    },
    15549: {
        v: 10407,
        p: 15532
    },
    15550: {
        v: 10408,
        p: 15532
    },
    15551: {
        v: 10409,
        p: 15532
    },
    15552: {
        v: 10410,
        p: 15532
    },
    15553: {
        v: 10411,
        p: 15532
    },
    15554: {
        v: 10412,
        p: 15532
    },
    15555: {
        v: 10413,
        p: 10017,
        s: [15556, 15557, 15558, 15559, 15560, 15561, 15562, 15563, 15564, 15565, 15566, 15567, 15568, 15569, 15570, 15571]
    },
    15556: {
        v: 10414,
        p: 15555
    },
    15557: {
        v: 10415,
        p: 15555
    },
    15558: {
        v: 10416,
        p: 15555
    },
    15559: {
        v: 10417,
        p: 15555
    },
    15560: {
        v: 10418,
        p: 15555
    },
    15561: {
        v: 10419,
        p: 15555
    },
    15562: {
        v: 10420,
        p: 15555
    },
    15563: {
        v: 10421,
        p: 15555
    },
    15564: {
        v: 10422,
        p: 15555
    },
    15565: {
        v: 10423,
        p: 15555
    },
    15566: {
        v: 10424,
        p: 15555
    },
    15567: {
        v: 10425,
        p: 15555
    },
    15568: {
        v: 10426,
        p: 15555
    },
    15569: {
        v: 10427,
        p: 15555
    },
    15570: {
        v: 10428,
        p: 15555
    },
    15571: {
        v: 10429,
        p: 15555
    },
    15572: {
        v: 10430,
        p: 10017,
        s: [15573, 15574, 15575, 15576, 15577, 15578, 15579, 15580, 15581, 15582, 15583, 15584, 15585, 15586, 15587, 15588, 15589, 15590, 15591, 15592]
    },
    15573: {
        v: 10431,
        p: 15572
    },
    15574: {
        v: 10432,
        p: 15572
    },
    15575: {
        v: 10433,
        p: 15572
    },
    15576: {
        v: 10434,
        p: 15572
    },
    15577: {
        v: 10435,
        p: 15572
    },
    15578: {
        v: 10436,
        p: 15572
    },
    15579: {
        v: 10437,
        p: 15572
    },
    15580: {
        v: 10438,
        p: 15572
    },
    15581: {
        v: 10439,
        p: 15572
    },
    15582: {
        v: 10440,
        p: 15572
    },
    15583: {
        v: 10441,
        p: 15572
    },
    15584: {
        v: 10442,
        p: 15572
    },
    15585: {
        v: 10443,
        p: 15572
    },
    15586: {
        v: 10444,
        p: 15572
    },
    15587: {
        v: 10445,
        p: 15572
    },
    15588: {
        v: 10446,
        p: 15572
    },
    15589: {
        v: 10447,
        p: 15572
    },
    15590: {
        v: 10448,
        p: 15572
    },
    15591: {
        v: 10449,
        p: 15572
    },
    15592: {
        v: 10450,
        p: 15572
    },
    15593: {
        v: 10451,
        p: 10017,
        s: [15594, 15595, 15596, 15597, 15598, 15599, 15600, 15601, 15602, 15603, 15604, 15605, 15606, 15607, 15608, 15609, 15610, 15611, 15612, 15613, 15614, 15615]
    },
    15594: {
        v: 10452,
        p: 15593
    },
    15595: {
        v: 10453,
        p: 15593
    },
    15596: {
        v: 10454,
        p: 15593
    },
    15597: {
        v: 10455,
        p: 15593
    },
    15598: {
        v: 10456,
        p: 15593
    },
    15599: {
        v: 10457,
        p: 15593
    },
    15600: {
        v: 10458,
        p: 15593
    },
    15601: {
        v: 10459,
        p: 15593
    },
    15602: {
        v: 10460,
        p: 15593
    },
    15603: {
        v: 10461,
        p: 15593
    },
    15604: {
        v: 10462,
        p: 15593
    },
    15605: {
        v: 10463,
        p: 15593
    },
    15606: {
        v: 10464,
        p: 15593
    },
    15607: {
        v: 10465,
        p: 15593
    },
    15608: {
        v: 10466,
        p: 15593
    },
    15609: {
        v: 10467,
        p: 15593
    },
    15610: {
        v: 10468,
        p: 15593
    },
    15611: {
        v: 10469,
        p: 15593
    },
    15612: {
        v: 10470,
        p: 15593
    },
    15613: {
        v: 10471,
        p: 15593
    },
    15614: {
        v: 10472,
        p: 15593
    },
    15615: {
        v: 10473,
        p: 15593
    },
    15616: {
        v: 10474,
        p: 10017,
        s: [15617, 15618, 15619, 15620, 15621, 15622, 15623, 15624, 15625, 15626, 15627, 15628, 15629, 15630, 15631, 15632, 15633, 15634, 15635, 15636, 15637, 15638, 15639, 15640]
    },
    15617: {
        v: 10475,
        p: 15616
    },
    15618: {
        v: 10476,
        p: 15616
    },
    15619: {
        v: 10477,
        p: 15616
    },
    15620: {
        v: 10478,
        p: 15616
    },
    15621: {
        v: 10479,
        p: 15616
    },
    15622: {
        v: 10480,
        p: 15616
    },
    15623: {
        v: 10481,
        p: 15616
    },
    15624: {
        v: 10482,
        p: 15616
    },
    15625: {
        v: 10483,
        p: 15616
    },
    15626: {
        v: 10484,
        p: 15616
    },
    15627: {
        v: 10485,
        p: 15616
    },
    15628: {
        v: 10486,
        p: 15616
    },
    15629: {
        v: 10487,
        p: 15616
    },
    15630: {
        v: 10488,
        p: 15616
    },
    15631: {
        v: 10489,
        p: 15616
    },
    15632: {
        v: 10490,
        p: 15616
    },
    15633: {
        v: 10491,
        p: 15616
    },
    15634: {
        v: 10492,
        p: 15616
    },
    15635: {
        v: 10493,
        p: 15616
    },
    15636: {
        v: 10494,
        p: 15616
    },
    15637: {
        v: 10495,
        p: 15616
    },
    15638: {
        v: 10496,
        p: 15616
    },
    15639: {
        v: 10497,
        p: 15616
    },
    15640: {
        v: 10498,
        p: 15616
    },
    15641: {
        v: 10499,
        p: 10017,
        s: [15642, 15643, 15644, 15645, 15646, 15647, 15648, 15649, 15650, 15651]
    },
    15642: {
        v: 10500,
        p: 15641
    },
    15643: {
        v: 10501,
        p: 15641
    },
    15644: {
        v: 10502,
        p: 15641
    },
    15645: {
        v: 10503,
        p: 15641
    },
    15646: {
        v: 10504,
        p: 15641
    },
    15647: {
        v: 10505,
        p: 15641
    },
    15648: {
        v: 10506,
        p: 15641
    },
    15649: {
        v: 10507,
        p: 15641
    },
    15650: {
        v: 10508,
        p: 15641
    },
    15651: {
        v: 10509,
        p: 15641
    },
    15652: {
        v: 10510,
        p: 10017,
        s: [15653, 15654, 15655, 15656, 15657, 15658, 15659, 15660, 15661, 15662, 15663, 15664, 15665, 15666, 15667, 15668, 15669]
    },
    15653: {
        v: 10511,
        p: 15652
    },
    15654: {
        v: 10512,
        p: 15652
    },
    15655: {
        v: 10513,
        p: 15652
    },
    15656: {
        v: 10514,
        p: 15652
    },
    15657: {
        v: 10515,
        p: 15652
    },
    15658: {
        v: 10516,
        p: 15652
    },
    15659: {
        v: 10517,
        p: 15652
    },
    15660: {
        v: 10518,
        p: 15652
    },
    15661: {
        v: 10519,
        p: 15652
    },
    15662: {
        v: 10520,
        p: 15652
    },
    15663: {
        v: 10521,
        p: 15652
    },
    15664: {
        v: 10522,
        p: 15652
    },
    15665: {
        v: 10523,
        p: 15652
    },
    15666: {
        v: 10524,
        p: 15652
    },
    15667: {
        v: 10525,
        p: 15652
    },
    15668: {
        v: 10526,
        p: 15652
    },
    15669: {
        v: 10527,
        p: 15652
    },
    15670: {
        v: 10528,
        p: 10017,
        s: [15671, 15672, 15673, 15674, 15675, 15676, 15677, 15678, 15679, 15680, 15681]
    },
    15671: {
        v: 10529,
        p: 15670
    },
    15672: {
        v: 10530,
        p: 15670
    },
    15673: {
        v: 10531,
        p: 15670
    },
    15674: {
        v: 10532,
        p: 15670
    },
    15675: {
        v: 10533,
        p: 15670
    },
    15676: {
        v: 10534,
        p: 15670
    },
    15677: {
        v: 10535,
        p: 15670
    },
    15678: {
        v: 10536,
        p: 15670
    },
    15679: {
        v: 10537,
        p: 15670
    },
    15680: {
        v: 10538,
        p: 15670
    },
    15681: {
        v: 10539,
        p: 15670
    },
    15682: {
        v: 10540,
        p: 10017,
        s: [15683, 15684, 15685, 15686, 15687, 15688, 15689, 15690]
    },
    15683: {
        v: 10541,
        p: 15682
    },
    15684: {
        v: 10542,
        p: 15682
    },
    15685: {
        v: 10543,
        p: 15682
    },
    15686: {
        v: 10544,
        p: 15682
    },
    15687: {
        v: 10545,
        p: 15682
    },
    15688: {
        v: 10546,
        p: 15682
    },
    15689: {
        v: 10547,
        p: 15682
    },
    15690: {
        v: 10548,
        p: 15682
    },
    15691: {
        v: 10549,
        p: 10017,
        s: [15692, 15693, 15694, 15695, 15696, 15697, 15698, 15699, 15700, 15701, 15702, 15703, 15704, 15705, 15706, 15707, 15708]
    },
    15692: {
        v: 10550,
        p: 15691
    },
    15693: {
        v: 10551,
        p: 15691
    },
    15694: {
        v: 10552,
        p: 15691
    },
    15695: {
        v: 10553,
        p: 15691
    },
    15696: {
        v: 10554,
        p: 15691
    },
    15697: {
        v: 10555,
        p: 15691
    },
    15698: {
        v: 10556,
        p: 15691
    },
    15699: {
        v: 10557,
        p: 15691
    },
    15700: {
        v: 10558,
        p: 15691
    },
    15701: {
        v: 10559,
        p: 15691
    },
    15702: {
        v: 10560,
        p: 15691
    },
    15703: {
        v: 10561,
        p: 15691
    },
    15704: {
        v: 10562,
        p: 15691
    },
    15705: {
        v: 10563,
        p: 15691
    },
    15706: {
        v: 10564,
        p: 15691
    },
    15707: {
        v: 10565,
        p: 15691
    },
    15708: {
        v: 10566,
        p: 15691
    },
    15709: {
        v: 10567,
        p: 10017,
        s: [15710, 15711, 15712, 15713, 15714, 15715, 15716, 15717, 15718]
    },
    15710: {
        v: 10568,
        p: 15709
    },
    15711: {
        v: 10569,
        p: 15709
    },
    15712: {
        v: 10570,
        p: 15709
    },
    15713: {
        v: 10571,
        p: 15709
    },
    15714: {
        v: 10572,
        p: 15709
    },
    15715: {
        v: 10573,
        p: 15709
    },
    15716: {
        v: 10574,
        p: 15709
    },
    15717: {
        v: 10575,
        p: 15709
    },
    15718: {
        v: 10576,
        p: 15709
    },
    15719: {
        v: 10577,
        p: 10017,
        s: [15720, 15721, 15722, 15723, 15724]
    },
    15720: {
        v: 10578,
        p: 15719
    },
    15721: {
        v: 10579,
        p: 15719
    },
    15722: {
        v: 10580,
        p: 15719
    },
    15723: {
        v: 10581,
        p: 15719
    },
    15724: {
        v: 10582,
        p: 15719
    },
    15725: {
        v: 10583,
        p: 10017,
        s: [15726, 15727, 15728, 15729, 15730, 15731, 15732, 15733, 15734, 15735, 15736, 15737, 15738, 15739]
    },
    15726: {
        v: 10584,
        p: 15725
    },
    15727: {
        v: 10585,
        p: 15725
    },
    15728: {
        v: 10586,
        p: 15725
    },
    15729: {
        v: 10587,
        p: 15725
    },
    15730: {
        v: 10588,
        p: 15725
    },
    15731: {
        v: 10589,
        p: 15725
    },
    15732: {
        v: 10590,
        p: 15725
    },
    15733: {
        v: 10591,
        p: 15725
    },
    15734: {
        v: 10592,
        p: 15725
    },
    15735: {
        v: 10593,
        p: 15725
    },
    15736: {
        v: 10594,
        p: 15725
    },
    15737: {
        v: 10595,
        p: 15725
    },
    15738: {
        v: 10596,
        p: 15725
    },
    15739: {
        v: 10597,
        p: 15725
    },
    15740: {
        v: 10598,
        p: 10017,
        s: [15741, 15742, 15743, 15744, 15745, 15746, 15747, 15748, 15749, 15750, 15751, 15752, 15753, 15754, 15755, 15756, 15757, 15758, 15759]
    },
    15741: {
        v: 10599,
        p: 15740
    },
    15742: {
        v: 10600,
        p: 15740
    },
    15743: {
        v: 10601,
        p: 15740
    },
    15744: {
        v: 10602,
        p: 15740
    },
    15745: {
        v: 10603,
        p: 15740
    },
    15746: {
        v: 10604,
        p: 15740
    },
    15747: {
        v: 10605,
        p: 15740
    },
    15748: {
        v: 10606,
        p: 15740
    },
    15749: {
        v: 10607,
        p: 15740
    },
    15750: {
        v: 10608,
        p: 15740
    },
    15751: {
        v: 10609,
        p: 15740
    },
    15752: {
        v: 10610,
        p: 15740
    },
    15753: {
        v: 10611,
        p: 15740
    },
    15754: {
        v: 10612,
        p: 15740
    },
    15755: {
        v: 10613,
        p: 15740
    },
    15756: {
        v: 10614,
        p: 15740
    },
    15757: {
        v: 10615,
        p: 15740
    },
    15758: {
        v: 10616,
        p: 15740
    },
    15759: {
        v: 10617,
        p: 15740
    },
    15760: {
        v: 10618,
        p: 10017,
        s: [15761, 15762, 15763, 15764]
    },
    15761: {
        v: 10619,
        p: 15760
    },
    15762: {
        v: 10620,
        p: 15760
    },
    15763: {
        v: 10621,
        p: 15760
    },
    15764: {
        v: 10622,
        p: 15760
    }
};

module.exports = catalog;

/**
 * 根据id获取分类
 */
catalog.getItemById = function(id) {
    return this[id] || {};
};
/**
 * 从分类ID回溯得到CatNamePath
 */
catalog.getCatNamePath = function(id) {
    var catPath = [];
    var cItem = this.getItemById(id);
    var cname;
    if (cItem) {
        while (typeof cItem.p !== 'undefined' && cItem.p !== -1) {
            cname = cItem.n;
            if (cItem.v !== undefined) {
                cname = this.getItemById(cItem.v).n;
            }
            catPath.unshift(cname);
            cItem = this.getItemById(cItem.p);
        }
    }
    return catPath;
};
/**
 * 查找分类id的子分类
 */
catalog.getCatLeaf = function(id) {
    var arr = [];
    var catArr = this.getSubIdArr(id);
    var subId;
    for (var i = 0, len = catArr.length; i < len; i++) {
        subId = catArr[i];
        arr.push([subId, (this.getItemById(subId) || {}).n]);
    }
    return arr;
};
/**
 * 根据id获取分类
 */
catalog.getSubIdArr = function(id) {
    return ((this.getItemById(id) || {}).s || []);
};

var _cacheList = [];
catalog.getSubNameArr = function(id) {
    if (!_cacheList[id]) {
        var arr = [];
        var subIdArr = this.getSubIdArr(id);
        var subId;
        for (var i = 0, len = subIdArr.length; i < len; i++) {
            subId = subIdArr[i];
            arr.push((this.getItemById(subId) || {}).n);
        }
        _cacheList[id] = arr;
    }

    return _cacheList[id];
};

catalog.findSubIdByName = function(root_id, name) {
    var id;
    var subs = this.getSubIdArr(root_id);
    for (var i = 0, len = subs.length; i < len; i++) {
        var sub_id = subs[i];
        if (this.getItemById(sub_id).n === name) {
            id = sub_id;
            break;
        }
    }
    return id;
};

catalog.findIdByName = function(name) {
    var id;
    this.getCatLeaf(0).some(function(item) {
        id = item[0];
        return item[1] == name;
    });
    return id;
};

catalog.getCatPath = function(id) {
    var catPath = [];
    var cItem = this.getItemById(id);
    if (cItem) {
        catPath.unshift(id);
        while (cItem.p !== -1) {
            catPath.unshift(cItem.p);
            cItem = this.getItemById(cItem.p);
        }
    }
    return catPath;
};

catalog.getSublings = function(id) {
    var cItem = this.getItemById(id);
    return this.getCatLeaf(cItem.p);
};

catalog.getPID = function(id) {
    var cItem = this.getItemById(id);
    return cItem.p;
};

/**
 * 根据某级分类id和子分类名在查找分类id
 */
catalog.getItemIdByPathStr = function(root_id, catPathStr) {
    var arr = catPathStr.split('-');
    var totalLevels = arr.length;
    var crtLevel = 0;

    var traverse = function(from_id) {
        var subs = this.getSubIdArr(from_id),
            len = subs.length,
            cname = '';
        for (var i = 0; i < len; i++) {
            var subItem = this.getItemById(subs[i]) || {};

            var v = subItem.v;
            if (v !== undefined) {
                cname = this.getItemById(v).n;
            } else {
                cname = subItem.n;
            }
            if (cname === arr[crtLevel]) {
                //已是倒数第二级分类
                if (crtLevel + 1 === totalLevels) {
                    return subs[i];
                } else {
                    crtLevel++;
                    return traverse(subs[i]);
                }
            }
        }
        return from_id;
    }.bind(this);

    return traverse(root_id);
};

/*
获取省份列表: {id, text}
*/
catalog.getProvinceList = function() {
    var id = 10013;
    var subIdArr = this.getSubIdArr(id);

    return subIdArr.map(function(item) {
        return {
            value: item,
            text: catalog.getItemById(item).n
        };
    });
};

/*
根据省份id获取下辖市列表
*/
catalog.getCityList = function(province) {
    var id = province;
    var subIdArr = this.getSubIdArr(id);

    return subIdArr.map(function(item) {
        return {
            value: item,
            text: catalog.getItemById(item).n
        };
    });
};

/*
根据城市id反向获取省份信息
*/
catalog.getProvinceByCity = function(city) {
    if (!city) return {};

    city = this.getItemById(city);

    var province = city.p;
    province = this.getItemById(province);

    return {
        value: city.p,
        text: province.n
    };
};

/*
根据城市id获取城市信息
*/
catalog.getCityById = function(city) {
    if (!city) return {};

    var cityItem = this.getItemById(city);

    return {
        value: city,
        text: cityItem.n
    };
};

/*
根据省/市id判断是不是直辖市
*/
catalog.isMunicipality = function(city) {
    var municipality = ['10059', '10079', '10099', '10120'];
    return ~municipality.indexOf(city);
};

/*
根据省和市名字获取城市id
*/
catalog.getCityIdByProvinceAndCity = function(province, city) {
    if (!province || !city) return;

    var pid;
    this.getProvinceList().some(function(item) {
        if (item.text !== province) return false;

        pid = item.value;
    });

    if (!pid) return;

    var cid;
    this.getCityList(pid).some(function(item) {
        if (item.text !== city) return false;

        cid = item.value;
    });

    return cid;
};
},{}],22:[function(require,module,exports){
'use strict';

var request = require('../../lib/request');

module.exports = {
    //取群信息
    getQunInfo: function() {
        return request.ajax({
            url: '/cgi-bin/qun_info/get_group_info_all',
            data: {
                t: 'basic',
                from: 1 /*标志从编辑资料拉的cgi*/
            }
        });
    },
    // 搜索建议
    // s: 关键词，sid: 貌似是类别
    searchString: function(s, sid) {
        var data = {
            n: 10,
            s: s
        };
        (typeof sid === 'undefined') || (data.sid = sid);
        return request.ajax({
            url: '/cgi-bin/qun_info/search_string',
            data: data
        });
    },
    // 添加标签
    addTag: function(tag) {
        return request.ajax({
            url: '/cgi-bin/qun_info/set_group_more_cache',
            type: 'POST',
            data: {
                tag: tag,
                op: 1
            }
        });
    },
    // 删除标签，跟添加标签公用cgi，根据参数区分
    removeTag: function(tag, md) {
        return request.ajax({
            url: '/cgi-bin/qun_info/set_group_more_cache',
            type: 'POST',
            data: {
                tag: tag,
                op: 2,
                md: md
            }
        });
    },
    // 保存群信息，坑爹货。。。不要用set_group_info
    setQunInfo: function(param) {
        param = param || {};
        param.nWeb = 1;

        return request.ajax({
            url: '/cgi-bin/qun_info/set_group_info_new',
            type: 'POST',
            data: param
        });
    },

    // 及时搜索学校
    querySchool: function(param) {
        param = param || {};
        param.source = 'PC';
        param.cmd = 'get_schools';

        return request.ajax({
            url: 'http://s.p.qq.com/cgi-bin/homework/group/get_schools.fcg',
            type: 'GET',
            data: param,
            xhrFields: {
                withCredentials: true
            }
        });
    }
};
},{"../../lib/request":17}],23:[function(require,module,exports){
// 'use strict';

var $ = window.Zepto || window.$;

var util = require('../../lib/util');
var cgi = require('./cgi');
var widget = require('../../lib/widget');
var catalog = require('./catalog');

var tmpl = {
    select: require('./tmpl/select')
};

var $tagSection = $('#tagSection');

var $detail = $('#detail');
var $detailInput = $('#detailInput');

var $nameSelectOuter = $('#nameSection .select-outer');
var $selectOuter = $('#detailSection .select-outer');

function hideType() {
    $(this).siblings('.select-outer').toggleClass('hide');
    $$nameSelectOuter.addClass('hide');
}
$detail.on('click', function() {
    if (!$detail.hasClass('disabled')) $(this).siblings('.select-outer').toggleClass('hide');

    $nameSelectOuter.addClass('hide');
});
$detailInput.on('click', function() {
    $nameSelectOuter.addClass('hide');
});

function disable() {
        $detailInput.addClass('hide').attr('placeholder', '').val('');
        $detail.addClass('disabled').removeClass('hide').text('');
    }
    // function able() {
    //     $detailInput.addClass('hide').attr('placeholder', '').val('');
    //     $detail.addClass('disabled').removeClass('hide').text('');
    // }

function createSuggestion($input, $container, sid) {
    var done;

    function onKeyup() {
        var s = this.value.trim();
        if (!s) return $container.html('').addClass('hide');

        cgi.searchString(s, sid).done(function(res) {
            void 0;

            if (!res.s || !res.s.length) return $container.html('').addClass('hide');

            var list = res.s.map(function(item) {
                return {
                    value: item,
                    text: item
                };
            });
            var select = tmpl.select({
                list: list
            });

            var $select = $container.html('<div class="suggestion">' + select + '</div>').removeClass('hide').find('select');
            widget.transSelect($select, function(text) {
                $input.val(text);
                $container.addClass('hide');

                done && done(text);
            });
        });
    }

    $input.off('keyup', onKeyup);
    $input.on('keyup', onKeyup);

    return function(fn) {
        done = fn;
    }
}

function changeOther() {
    $detail.addClass('hide').html('');
    $detailInput.removeClass('hide').val('').focus().off('keyup');
    $selectOuter.addClass('big').html('');
}

function changeDetailState(id, subId, init) {
    // 只处理家校群 id === '32'
    if (id == 32) {
        // 隐藏群标签
        $tagSection.hide();

        // 展示家校群独有ui
    }

    return;

    id = ~~id;
    subId = ~~subId;

    void 0;

    var placeholder;
    var sid;

    $detail.removeClass('hide disabled');
    $detailInput.addClass('hide');
    $selectOuter.removeClass('big').html('');

    init || $detail.text('');
    init || $detailInput.val('');

    if (subId === -2) {
        if (id === 25) {
            placeholder = 'LOL、魔兽、QQ游戏？你们一起玩的游戏是？';
            sid = 1;
        } else if (id === 26) {
            placeholder = '苹果、尼康、宝马、香奈尔？你们热衷的品牌是？';
            sid = 8;
        } else if (id === 27) {
            placeholder = '陈奕迅、韩寒、李开复、林书豪？你们是谁的粉丝？';
            sid = 6;
        }

        createSuggestion($detailInput, $selectOuter, sid);
    } else {
        var subs = catalog.getSubIdArr(subId);
        void 0;

        function onKeyup(e) {
            var val = this.value.trim();
            if (!val) return;

            renderDetail.detail.extra.item3 = val;

            renderDetail.setDetail();

            // 回车
            (e.keyCode == 13) && $selectOuter.addClass('hide');
        }

        if (subs.length === 0) {
            //同学·朋友-同事
            if (subId === 10012) {
                placeholder = '你们同在哪家公司工作？';
                createSuggestion($detailInput, $selectOuter);
            }
            //同学·朋友-同学
            else if (subId === 10011) {
                // var list = [{value: 0, text: '博士'}, {value: 1, text: '硕士'}, {value: 2, text: '本科'}, {value: 3, text: '大专'}, {value: 4, text: '高中'}, {value: 5, text: '中专'}, {value: 6, text: '初中'}, {value: 7, text: '小学'}];
                var list = ['博士', '硕士', '本科', '大专', '高中', '中专', '初中'];

                function needAcademy(degree) {
                    var i = list.indexOf(degree);
                    return i >= 0 && i <= 3;
                }
                var select = tmpl.select({
                    list: list
                });

                $selectOuter.html('<div class="degree border">' + select + '</div>');
                init || $selectOuter.removeClass('hide');

                widget.transSelect($selectOuter.find('select'), function(degree) {
                    renderDetail.detail.extra.item1 = degree;

                    if (needAcademy(degree)) $selectOuter.find('.long').removeAttr('disabled');
                    else {
                        $selectOuter.find('.long').attr('disabled', 'disabled').val('')
                        renderDetail.detail.extra.item3 = '';
                    }

                    renderDetail.setDetail();

                    $selectOuter.find('.short').focus();
                }, {
                    default: renderDetail.detail.extra.item1 || '在读类型'
                });

                $selectOuter.append('<input type="text" class="border short" placeholder="你们同在哪所学校？" maxlength="40" value="' + (renderDetail.detail.extra.item2 || '') + '"/>');

                $selectOuter.append('<input type="text" class="border long"' + (!needAcademy(renderDetail.detail.extra.item1) ? 'disabled="disabled"' : '') + ' placeholder="你们所在的学院是？" maxlength="40" value="' + (renderDetail.detail.extra.item3 || '') + '"/>');

                $selectOuter.append('<div class="suggestion-outer hide"></div>');

                $selectOuter.find('.short').on('keyup', function() {
                    var val = this.value.trim();
                    if (!val) return;

                    renderDetail.detail.extra.item2 = val;
                    renderDetail.setDetail();

                    var $this = $(this);

                    createSuggestion($this, $this.siblings('.suggestion-outer'), 2)(function(text) {
                        renderDetail.detail.extra.item2 = text;
                        renderDetail.setDetail();
                    });
                });
                $selectOuter.find('.long').on('keyup', onKeyup);
                return;
            } else if (catalog.getItemById(subId).n == '其他') {
                placeholder = '';
            }
        } else if (subs.length > 1) {
            var list = catalog.getSubNameArr('10013');

            list = list.map(function(item) {
                return {
                    value: item,
                    text: item
                };
            });
            var select = tmpl.select({
                list: list
            });

            select = '<div class="location">' + select + '</div><div class="location"></div>';

            if (subId == 10015) {
                $selectOuter.addClass('big');
                select += '<input type="text" class="community" placeholder="远亲不如近邻，你们住在哪个小区？" maxlength="40" value="' + (renderDetail.detail.extra.item1 || '') + '"/>';

                renderDetail.setDetail();

            } else $selectOuter.removeClass('big');

            $selectOuter.html(select);
            init || $selectOuter.removeClass('hide');

            function selectCity(province, city) {
                var $s = $selectOuter.find('.location:nth-child(2)');
                var list = ['市/区'];

                if (province) {
                    var findSubId = catalog.findSubIdByName('10013', province);
                    list = catalog.getSubNameArr(findSubId);
                    list = list.map(function(item) {
                        return {
                            value: item,
                            text: item
                        };
                    });
                }

                var select = tmpl.select({
                    list: list
                });

                $s.html(select);

                widget.transSelect($s.find('select'), function(city) {
                    void 0;

                    renderDetail.detail.city = city;
                    renderDetail.setDetail();

                    (subId == 10015) || $selectOuter.addClass('hide');
                }, {
                    default: city || '市/区'
                });
            }

            widget.transSelect($selectOuter.find('.location:first-child select'), function(province) {
                renderDetail.detail.province = province;
                renderDetail.detail.city = '';
                renderDetail.setDetail();

                selectCity(province);
            }, {
                default: renderDetail.detail.province || '省/直辖市'
            });

            selectCity(renderDetail.detail.province, renderDetail.detail.city);

            $selectOuter.find('.community').on('keyup', onKeyup);

            return;
        }
    }

    $detail.addClass('hide');
    $detailInput.removeClass('hide');

    init || $selectOuter.addClass('hide');

    if (typeof placeholder === 'undefined') return disable();

    $detailInput.removeClass('hide').attr('placeholder', placeholder);
    init || $detailInput.focus();

}

function renderDetail(detail) {
    // detail = util.decodeHtml(detail);
    $detailInput.val(detail);

    detail = detail.split('|');
    // debugger;
    detail.forEach(function(item, i) {
        item && (renderDetail.detail.extra['item' + ++i] = item);
    });

    renderDetail.setDetail();
}

renderDetail.changeOther = changeOther;
renderDetail.changeDetailState = changeDetailState;

renderDetail.setDetail = function() {
    return;
    var s = '';

    var detail = renderDetail.detail;
    void 0;

    for (var k in renderDetail.detail) {
        var item = renderDetail.detail[k];
        if (k == 'province') item && (s += item);

        else if (typeof item === 'object') {
            for (var j in item) {
                var subItem = item[j];
                subItem && (s += (s ? '-' : '') + subItem);
            }
        } else item && (s += (s ? '-' : '') + item);
    }

    // s = detail.province;
    // detail.city && (s += '-' + detail.city);
    // detail.extra.item1 && (s += detail.extra);
    // detail.extra && (s += detail.extra);
    // detail.extra && (s += detail.extra);
    // if(detail.province) {
    //     s += detail.province;
    //     detail.city && (s += '-' + detail.city);
    //     detail.extra.item1 && (s += '-' + detail.extra.item1);
    // } else {
    //     // 没有province肯定没有city
    //     s = detail.extra.split('|').join('-');
    // }

    $detail.html(s);
};
renderDetail.upDetail = function(detail) {
    renderDetail.detail.province = detail && detail[0] || '';
    renderDetail.detail.city = detail && detail[1] || '';

    renderDetail.setDetail();
};

(renderDetail.reset = function() {
    renderDetail.detail = {
        province: '',
        city: '',
        extra: {
            item1: '',
            item2: '',
            item3: ''
        }
    };
    // renderDetail.type = type.getType();
    renderDetail.type = 0;
    disable();
    $selectOuter.addClass('hide');
})();

renderDetail.isModify = function(detail) {
    return this.getDetail() != detail;
};
renderDetail.getDetail = function() {
    if (!$detailInput.hasClass('hide')) return $detailInput.val().trim();

    var s = '';
    for (var k in renderDetail.detail.extra) {
        var item = renderDetail.detail.extra[k];
        item && (s += (s ? '|' : '') + item);
    }
    return s;
};
renderDetail.getType = function() {
    void 0;
    return renderDetail.detail.province ? renderDetail.detail.province + '-' + renderDetail.detail.city : '';
};

module.exports = renderDetail;
},{"../../lib/util":19,"../../lib/widget":20,"./catalog":21,"./cgi":22,"./tmpl/select":34}],24:[function(require,module,exports){
'use strict';

function isOrContainsNode(ancestor, descendant) {
    var node = descendant;
    while (node) {
        if (node === ancestor) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function insertNodeOverSelection(node, containerNode) {
    var sel, range, html, str;

    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (isOrContainsNode(containerNode, range.commonAncestorContainer)) {
            range.deleteContents();
            range.insertNode(node);
        } else {
            containerNode.appendChild(node);
        }

        void 0;
        range.collapse(sel.focusNode, sel.focusOffset + 1);
    }
}
insertNodeOverSelection = function(node, doc) {
    doc = doc || document;

    var selection = doc.getSelection();
    var range = selection.getRangeAt(0);

    if (!range) return;
    // debugger;
    var textNode = doc.createTextNode('');
    range.insertNode(textNode);
    range.insertNode(node);
    range.selectNode(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
};

function pasteHtmlAtCaret(html, doc) {
    doc = doc || document;
    var sel, range;

    sel = doc.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        var el = document.createElement("div");
        // debugger;
        el.innerHTML = html;
        var frag = document.createDocumentFragment(), node, lastNode;
        while ( (node = el.firstChild) ) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

insertNodeOverSelection.pasteHtmlAtCaret = pasteHtmlAtCaret;

module.exports = insertNodeOverSelection;
},{}],25:[function(require,module,exports){
'use strict';

var face = {};

module.exports = face;

var MOBLIE_FACE_ARRAY = null; //mobile表情为索引，为提高查找效率
var faceWordingMap = null; //表情索引，为提高查找效率
var lnWordingMap = null; //个签表情为索引，为提高查找效率

/* 手Q 表情协议*/
var EMPTY_SPACE_CODE = 0x14,
    EMPTY_SPACE_UNICODE = '\u0014',
    MOBLIE_FACE = {
        "呲牙": {
            "text": "呲牙",
            "code": 0
        },
        "调皮": {
            "text": "调皮",
            "code": 1
        },
        "流汗": {
            "text": "流汗",
            "code": 2
        },
        "偷笑": {
            "text": "偷笑",
            "code": 3
        },
        "再见": {
            "text": "再见",
            "code": 4
        },
        "敲打": {
            "text": "敲打",
            "code": 5
        },
        "擦汗": {
            "text": "擦汗",
            "code": 6
        },
        "猪头": {
            "text": "猪头",
            "code": 7
        },
        "玫瑰": {
            "text": "玫瑰",
            "code": 8
        },
        "流泪": {
            "text": "流泪",
            "code": 9
        },
        "大哭": {
            "text": "大哭",
            "code": 1000
        },
        "嘘": {
            "text": "嘘",
            "code": 11
        },
        "酷": {
            "text": "酷",
            "code": 12
        },
        "抓狂": {
            "text": "抓狂",
            "code": 1300
        },
        "委屈": {
            "text": "委屈",
            "code": 14
        },
        "便便": {
            "text": "便便",
            "code": 15
        },
        "炸弹": {
            "text": "炸弹",
            "code": 16
        },
        "菜刀": {
            "text": "菜刀",
            "code": 17
        },
        "可爱": {
            "text": "可爱",
            "code": 18
        },
        "色": {
            "text": "色",
            "code": 19
        },
        "害羞": {
            "text": "害羞",
            "code": 20
        },
        "得意": {
            "text": "得意",
            "code": 21
        },
        "吐": {
            "text": "吐",
            "code": 22
        },
        "微笑": {
            "text": "微笑",
            "code": 23
        },
        "发怒": {
            "text": "发怒",
            "code": 24
        },
        "尴尬": {
            "text": "尴尬",
            "code": 25
        },
        "惊恐": {
            "text": "惊恐",
            "code": 26
        },
        "冷汗": {
            "text": "冷汗",
            "code": 27
        },
        "爱心": {
            "text": "爱心",
            "code": 28
        },
        "示爱": {
            "text": "示爱",
            "code": 29
        },
        "白眼": {
            "text": "白眼",
            "code": 30
        },
        "傲慢": {
            "text": "傲慢",
            "code": 31
        },
        "难过": {
            "text": "难过",
            "code": 32
        },
        "惊讶": {
            "text": "惊讶",
            "code": 33
        },
        "疑问": {
            "text": "疑问",
            "code": 34
        },
        "睡": {
            "text": "睡",
            "code": 35
        },
        "亲亲": {
            "text": "亲亲",
            "code": 36
        },
        "憨笑": {
            "text": "憨笑",
            "code": 37
        },
        "爱情": {
            "text": "爱情",
            "code": 38
        },
        "衰": {
            "text": "衰",
            "code": 39
        },
        "撇嘴": {
            "text": "撇嘴",
            "code": 40
        },
        "阴险": {
            "text": "阴险",
            "code": 41
        },
        "奋斗": {
            "text": "奋斗",
            "code": 42
        },
        "发呆": {
            "text": "发呆",
            "code": 43
        },
        "右哼哼": {
            "text": "右哼哼",
            "code": 44
        },
        "拥抱": {
            "text": "拥抱",
            "code": 45
        },
        "坏笑": {
            "text": "坏笑",
            "code": 46
        },
        "飞吻": {
            "text": "飞吻",
            "code": 47
        },
        "鄙视": {
            "text": "鄙视",
            "code": 48
        },
        "晕": {
            "text": "晕",
            "code": 49
        },
        "大兵": {
            "text": "大兵",
            "code": 50
        },
        "可怜": {
            "text": "可怜",
            "code": 51
        },
        "强": {
            "text": "强",
            "code": 52
        },
        "弱": {
            "text": "弱",
            "code": 53
        },
        "握手": {
            "text": "握手",
            "code": 54
        },
        "胜利": {
            "text": "胜利",
            "code": 55
        },
        "抱拳": {
            "text": "抱拳",
            "code": 56
        },
        "凋谢": {
            "text": "凋谢",
            "code": 57
        },
        "饭": {
            "text": "饭",
            "code": 58
        },
        "蛋糕": {
            "text": "蛋糕",
            "code": 59
        },
        "西瓜": {
            "text": "西瓜",
            "code": 60
        },
        "啤酒": {
            "text": "啤酒",
            "code": 61
        },
        "瓢虫": {
            "text": "瓢虫",
            "code": 62
        },
        "勾引": {
            "text": "勾引",
            "code": 63
        },
        "OK": {
            "text": "OK",
            "code": 64
        },
        "爱你": {
            "text": "爱你",
            "code": 65
        },
        "咖啡": {
            "text": "咖啡",
            "code": 66
        },
        "钱": {
            "text": "钱",
            "code": 67
        },
        "月亮": {
            "text": "月亮",
            "code": 68
        },
        "美女": {
            "text": "美女",
            "code": 69
        },
        "刀": {
            "text": "刀",
            "code": 70
        },
        "发抖": {
            "text": "发抖",
            "code": 71
        },
        "差劲": {
            "text": "差劲",
            "code": 72
        },
        "拳头": {
            "text": "拳头",
            "code": 73
        },
        "心碎": {
            "text": "心碎",
            "code": 74
        },
        "太阳": {
            "text": "太阳",
            "code": 75
        },
        "礼物": {
            "text": "礼物",
            "code": 76
        },
        "足球": {
            "text": "足球",
            "code": 77
        },
        "骷髅": {
            "text": "骷髅",
            "code": 78
        },
        "挥手": {
            "text": "挥手",
            "code": 79
        },
        "闪电": {
            "text": "闪电",
            "code": 80
        },
        "饥饿": {
            "text": "饥饿",
            "code": 81
        },
        "困": {
            "text": "困",
            "code": 82
        },
        "咒骂": {
            "text": "咒骂",
            "code": 83
        },
        "折磨": {
            "text": "折磨",
            "code": 84
        },
        "抠鼻": {
            "text": "抠鼻",
            "code": 85
        },
        "鼓掌": {
            "text": "鼓掌",
            "code": 86
        },
        "糗大了": {
            "text": "糗大了",
            "code": 87
        },
        "左哼哼": {
            "text": "左哼哼",
            "code": 88
        },
        "哈欠": {
            "text": "哈欠",
            "code": 89
        },
        "快哭了": {
            "text": "快哭了",
            "code": 90
        },
        "吓": {
            "text": "吓",
            "code": 91
        },
        "篮球": {
            "text": "篮球",
            "code": 92
        },
        "乒乓": {
            "text": "乒乓",
            "code": 93
        },
        "NO": {
            "text": "NO",
            "code": 94
        },
        "跳跳": {
            "text": "跳跳",
            "code": 95
        },
        "怄火": {
            "text": "怄火",
            "code": 96
        },
        "转圈": {
            "text": "转圈",
            "code": 97
        },
        "磕头": {
            "text": "磕头",
            "code": 98
        },
        "回头": {
            "text": "回头",
            "code": 99
        },
        "跳绳": {
            "text": "跳绳",
            "code": 100
        },
        "激动": {
            "text": "激动",
            "code": 101
        },
        "街舞": {
            "text": "街舞",
            "code": 102
        },
        "献吻": {
            "text": "献吻",
            "code": 103
        },
        "左太极": {
            "text": "左太极",
            "code": 104
        },
        "右太极": {
            "text": "右太极",
            "code": 105
        },
        "闭嘴": {
            "text": "闭嘴",
            "code": 106
        },
        "招财进宝": {
            "text": "招财进宝",
            "code": 107
        },
        "双喜": {
            "text": "双喜",
            "code": 108
        },
        "鞭炮": {
            "text": "鞭炮",
            "code": 109
        },
        "灯笼": {
            "text": "灯笼",
            "code": 110
        },
        "发财": {
            "text": "发财",
            "code": 111
        },
        "K歌": {
            "text": "K歌",
            "code": 112
        },
        "购物": {
            "text": "购物",
            "code": 113
        },
        "邮件": {
            "text": "邮件",
            "code": 114
        },
        "帅": {
            "text": "帅",
            "code": 115
        },
        /*"喝彩":{"text":"喝彩","code":116},*/
        "嘴唇": {
            "text": "嘴唇",
            "code": 116
        },
        "祈祷": {
            "text": "祈祷",
            "code": 117
        },
        "爆筋": {
            "text": "爆筋",
            "code": 118
        },
        "棒棒糖": {
            "text": "棒棒糖",
            "code": 119
        },
        "喝奶": {
            "text": "喝奶",
            "code": 120
        },
        "下面": {
            "text": "下面",
            "code": 121
        },
        "香蕉": {
            "text": "香蕉",
            "code": 122
        },
        "飞机": {
            "text": "飞机",
            "code": 123
        },
        "开车": {
            "text": "开车",
            "code": 124
        },
        "高铁左车头": {
            "text": "高铁左车头",
            "code": 125
        },
        "车厢": {
            "text": "车厢",
            "code": 126
        },
        "高铁右车头": {
            "text": "高铁右车头",
            "code": 127
        },
        "多云": {
            "text": "多云",
            "code": 128
        },
        "下雨": {
            "text": "下雨",
            "code": 129
        },
        "钞票": {
            "text": "钞票",
            "code": 130
        },
        "熊猫": {
            "text": "熊猫",
            "code": 131
        },
        "灯泡": {
            "text": "灯泡",
            "code": 132
        },
        "风车": {
            "text": "风车",
            "code": 133
        },
        "闹钟": {
            "text": "闹钟",
            "code": 134
        },
        "打伞": {
            "text": "打伞",
            "code": 135
        },
        "彩球": {
            "text": "彩球",
            "code": 136
        },
        "钻戒": {
            "text": "钻戒",
            "code": 137
        },
        "沙发": {
            "text": "沙发",
            "code": 138
        },
        "纸巾": {
            "text": "纸巾",
            "code": 139
        },
        "药": {
            "text": "药",
            "code": 140
        },
        "手枪": {
            "text": "手枪",
            "code": 141
        },
        "青蛙": {
            "text": "青蛙",
            "code": 142
        }
    };

// 炸弹表情会被当作敏感词处理
// 大哭、抓狂表情会被cgi替换成<br>
// 大哭的code 10 -> 1000 抓狂的code 13 -> 1300
// 即.不能匹配的unidoce码

var lnWording = ["口红", "钻戒", "靴子", "灯笼", "灯泡", "点滴", "电视机", "照相机", "风车", "公文包",
    "购物袋", "海魂衫", "红领巾", "蝴蝶结", "皇冠", "火车头", "火箭", "酒杯", "蜡烛", "八爪鱼",
    "燕子", "小猫", "猫头鹰", "毛毛虫", "麋鹿", "鸭子", "小鸡", "青蛙", "乌龟", "熊猫", "棕熊",
    "牛奶", "苹果", "樱桃", "桃子", "橘子", "西瓜", "草莓", "巧克力冰棒", "鸡腿", "太阳",
    "彩虹", "浮云", "多云", "小雨", "中雨", "大雨", "雪花", "月圆", "汽车", "木马",
    "闹钟", "铅笔", "雨伞", "沙发", "手柄", "UFO", "醋坛", "孙悟空", "唐僧", "天使",
    "恶魔", "招财猫", "娃娃头", "卫生纸", "仙人球", "香烟", "烟斗", "板砖", "蝙蝠", "幽灵",
    "南瓜灯"
];

var faceWording = face.wording = ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭",
    "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐",
    "偷笑", "可爱", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "大兵",
    "奋斗", "咒骂", "疑问", "嘘", "晕", "折磨", "衰", "骷髅", "敲打", "再见",
    "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈",
    "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓",
    "咖啡", "饭", "猪头", "玫瑰", "凋谢", "", "爱心", "心碎", "蛋糕", "闪电",
    "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "强",
    "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK",
    "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "挥手",
    "激动", "街舞", "献吻", "左太极", "右太极"
];
// face.wording[116] = "吻";
face.wording[116] = "示爱";

var emojiUTF16 = ["0x00A9", "0x00AE", "0x203C", "0x2049", "0x2122", "0x2139", "0x2194", "0x2195", "0x2196", "0x2197", "0x2198", "0x2199", "0x21A9", "0x21AA", "0x231A", "0x231B", "0x23E9", "0x23EA", "0x23EB", "0x23EC", "0x23F0", "0x23F3", "0x24C2", "0x25AA", "0x25AB", "0x25B6", "0x25C0", "0x25FB", "0x25FC", "0x25FD", "0x25FE", "0x2600", "0x2601", "0x260E", "0x2611", "0x2614", "0x2615", "0x261D", "0x263A", "0x2648", "0x2649", "0x264A", "0x264B", "0x264C", "0x264D", "0x264E", "0x264F", "0x2650", "0x2651", "0x2652", "0x2653", "0x2660", "0x2663", "0x2665", "0x2666", "0x2668", "0x267B", "0x267F", "0x2693", "0x26A0", "0x26A1", "0x26AA", "0x26AB", "0x26BD", "0x26BE", "0x26C4", "0x26C5", "0x26CE", "0x26D4", "0x26EA", "0x26F2", "0x26F3", "0x26F5", "0x26FA", "0x26FD", "0x2702", "0x2705", "0x2708", "0x2709", "0x270A", "0x270B", "0x270C", "0x270F", "0x2712", "0x2714", "0x2716", "0x2728", "0x2733", "0x2734", "0x2744", "0x2747", "0x274C", "0x274E", "0x2753", "0x2754", "0x2755", "0x2757", "0x2764", "0x2795", "0x2796", "0x2797", "0x27A1", "0x27B0", "0x27BF", "0x2934", "0x2935", "0x2B05", "0x2B06", "0x2B07", "0x2B1B", "0x2B1C", "0x2B50", "0x2B55", "0x3030", "0x303D", "0x3297", "0x3299", "0xD83C0xDC04", "0xD83C0xDCCF", "0xD83C0xDD70", "0xD83C0xDD71", "0xD83C0xDD7E", "0xD83C0xDD7F", "0xD83C0xDD8E", "0xD83C0xDD91", "0xD83C0xDD92", "0xD83C0xDD93", "0xD83C0xDD94", "0xD83C0xDD95", "0xD83C0xDD96", "0xD83C0xDD97", "0xD83C0xDD98", "0xD83C0xDD99", "0xD83C0xDD9A", "0xD83C0xDE01", "0xD83C0xDE02", "0xD83C0xDE1A", "0xD83C0xDE2F", "0xD83C0xDE32", "0xD83C0xDE33", "0xD83C0xDE34", "0xD83C0xDE35", "0xD83C0xDE36", "0xD83C0xDE37", "0xD83C0xDE38", "0xD83C0xDE39", "0xD83C0xDE3A", "0xD83C0xDE50", "0xD83C0xDE51", "0xD83C0xDF00", "0xD83C0xDF01", "0xD83C0xDF02", "0xD83C0xDF03", "0xD83C0xDF04", "0xD83C0xDF05", "0xD83C0xDF06", "0xD83C0xDF07", "0xD83C0xDF08", "0xD83C0xDF09", "0xD83C0xDF0A", "0xD83C0xDF0B", "0xD83C0xDF0C", "0xD83C0xDF0D", "0xD83C0xDF0E", "0xD83C0xDF0F", "0xD83C0xDF10", "0xD83C0xDF11", "0xD83C0xDF12", "0xD83C0xDF13", "0xD83C0xDF14", "0xD83C0xDF15", "0xD83C0xDF16", "0xD83C0xDF17", "0xD83C0xDF18", "0xD83C0xDF19", "0xD83C0xDF1A", "0xD83C0xDF1B", "0xD83C0xDF1C", "0xD83C0xDF1D", "0xD83C0xDF1E", "0xD83C0xDF1F", "0xD83C0xDF30", "0xD83C0xDF31", "0xD83C0xDF32", "0xD83C0xDF33", "0xD83C0xDF34", "0xD83C0xDF35", "0xD83C0xDF37", "0xD83C0xDF38", "0xD83C0xDF39", "0xD83C0xDF3A", "0xD83C0xDF3B", "0xD83C0xDF3C", "0xD83C0xDF3D", "0xD83C0xDF3E", "0xD83C0xDF3F", "0xD83C0xDF40", "0xD83C0xDF41", "0xD83C0xDF42", "0xD83C0xDF43", "0xD83C0xDF44", "0xD83C0xDF45", "0xD83C0xDF46", "0xD83C0xDF47", "0xD83C0xDF48", "0xD83C0xDF49", "0xD83C0xDF4A", "0xD83C0xDF4B", "0xD83C0xDF4C", "0xD83C0xDF4D", "0xD83C0xDF4E", "0xD83C0xDF4F", "0xD83C0xDF50", "0xD83C0xDF51", "0xD83C0xDF52", "0xD83C0xDF53", "0xD83C0xDF54", "0xD83C0xDF55", "0xD83C0xDF56", "0xD83C0xDF57", "0xD83C0xDF58", "0xD83C0xDF59", "0xD83C0xDF5A", "0xD83C0xDF5B", "0xD83C0xDF5C", "0xD83C0xDF5D", "0xD83C0xDF5E", "0xD83C0xDF5F", "0xD83C0xDF60", "0xD83C0xDF61", "0xD83C0xDF62", "0xD83C0xDF63", "0xD83C0xDF64", "0xD83C0xDF65", "0xD83C0xDF66", "0xD83C0xDF67", "0xD83C0xDF68", "0xD83C0xDF69", "0xD83C0xDF6A", "0xD83C0xDF6B", "0xD83C0xDF6C", "0xD83C0xDF6D", "0xD83C0xDF6E", "0xD83C0xDF6F", "0xD83C0xDF70", "0xD83C0xDF71", "0xD83C0xDF72", "0xD83C0xDF73", "0xD83C0xDF74", "0xD83C0xDF75", "0xD83C0xDF76", "0xD83C0xDF77", "0xD83C0xDF78", "0xD83C0xDF79", "0xD83C0xDF7A", "0xD83C0xDF7B", "0xD83C0xDF7C", "0xD83C0xDF80", "0xD83C0xDF81", "0xD83C0xDF82", "0xD83C0xDF83", "0xD83C0xDF84", "0xD83C0xDF85", "0xD83C0xDF86", "0xD83C0xDF87", "0xD83C0xDF88", "0xD83C0xDF89", "0xD83C0xDF8A", "0xD83C0xDF8B", "0xD83C0xDF8C", "0xD83C0xDF8D", "0xD83C0xDF8E", "0xD83C0xDF8F", "0xD83C0xDF90", "0xD83C0xDF91", "0xD83C0xDF92", "0xD83C0xDF93", "0xD83C0xDFA0", "0xD83C0xDFA1", "0xD83C0xDFA2", "0xD83C0xDFA3", "0xD83C0xDFA4", "0xD83C0xDFA5", "0xD83C0xDFA6", "0xD83C0xDFA7", "0xD83C0xDFA8", "0xD83C0xDFA9", "0xD83C0xDFAA", "0xD83C0xDFAB", "0xD83C0xDFAC", "0xD83C0xDFAD", "0xD83C0xDFAE", "0xD83C0xDFAF", "0xD83C0xDFB0", "0xD83C0xDFB1", "0xD83C0xDFB2", "0xD83C0xDFB3", "0xD83C0xDFB4", "0xD83C0xDFB5", "0xD83C0xDFB6", "0xD83C0xDFB7", "0xD83C0xDFB8", "0xD83C0xDFB9", "0xD83C0xDFBA", "0xD83C0xDFBB", "0xD83C0xDFBC", "0xD83C0xDFBD", "0xD83C0xDFBE", "0xD83C0xDFBF", "0xD83C0xDFC0", "0xD83C0xDFC1", "0xD83C0xDFC2", "0xD83C0xDFC3", "0xD83C0xDFC4", "0xD83C0xDFC6", "0xD83C0xDFC7", "0xD83C0xDFC8", "0xD83C0xDFC9", "0xD83C0xDFCA", "0xD83C0xDFE0", "0xD83C0xDFE1", "0xD83C0xDFE2", "0xD83C0xDFE3", "0xD83C0xDFE4", "0xD83C0xDFE5", "0xD83C0xDFE6", "0xD83C0xDFE7", "0xD83C0xDFE8", "0xD83C0xDFE9", "0xD83C0xDFEA", "0xD83C0xDFEB", "0xD83C0xDFEC", "0xD83C0xDFED", "0xD83C0xDFEE", "0xD83C0xDFEF", "0xD83C0xDFF0", "0xD83D0xDC00", "0xD83D0xDC01", "0xD83D0xDC02", "0xD83D0xDC03", "0xD83D0xDC04", "0xD83D0xDC05", "0xD83D0xDC06", "0xD83D0xDC07", "0xD83D0xDC08", "0xD83D0xDC09", "0xD83D0xDC0A", "0xD83D0xDC0B", "0xD83D0xDC0C", "0xD83D0xDC0D", "0xD83D0xDC0E", "0xD83D0xDC0F", "0xD83D0xDC10", "0xD83D0xDC11", "0xD83D0xDC12", "0xD83D0xDC13", "0xD83D0xDC14", "0xD83D0xDC15", "0xD83D0xDC16", "0xD83D0xDC17", "0xD83D0xDC18", "0xD83D0xDC19", "0xD83D0xDC1A", "0xD83D0xDC1B", "0xD83D0xDC1C", "0xD83D0xDC1D", "0xD83D0xDC1E", "0xD83D0xDC1F", "0xD83D0xDC20", "0xD83D0xDC21", "0xD83D0xDC22", "0xD83D0xDC23", "0xD83D0xDC24", "0xD83D0xDC25", "0xD83D0xDC26", "0xD83D0xDC27", "0xD83D0xDC28", "0xD83D0xDC29", "0xD83D0xDC2A", "0xD83D0xDC2B", "0xD83D0xDC2C", "0xD83D0xDC2D", "0xD83D0xDC2E", "0xD83D0xDC2F", "0xD83D0xDC30", "0xD83D0xDC31", "0xD83D0xDC32", "0xD83D0xDC33", "0xD83D0xDC34", "0xD83D0xDC35", "0xD83D0xDC36", "0xD83D0xDC37", "0xD83D0xDC38", "0xD83D0xDC39", "0xD83D0xDC3A", "0xD83D0xDC3B", "0xD83D0xDC3C", "0xD83D0xDC3D", "0xD83D0xDC3E", "0xD83D0xDC40", "0xD83D0xDC42", "0xD83D0xDC43", "0xD83D0xDC44", "0xD83D0xDC45", "0xD83D0xDC46", "0xD83D0xDC47", "0xD83D0xDC48", "0xD83D0xDC49", "0xD83D0xDC4A", "0xD83D0xDC4B", "0xD83D0xDC4C", "0xD83D0xDC4D", "0xD83D0xDC4E", "0xD83D0xDC4F", "0xD83D0xDC50", "0xD83D0xDC51", "0xD83D0xDC52", "0xD83D0xDC53", "0xD83D0xDC54", "0xD83D0xDC55", "0xD83D0xDC56", "0xD83D0xDC57", "0xD83D0xDC58", "0xD83D0xDC59", "0xD83D0xDC5A", "0xD83D0xDC5B", "0xD83D0xDC5C", "0xD83D0xDC5D", "0xD83D0xDC5E", "0xD83D0xDC5F", "0xD83D0xDC60", "0xD83D0xDC61", "0xD83D0xDC62", "0xD83D0xDC63", "0xD83D0xDC64", "0xD83D0xDC65", "0xD83D0xDC66", "0xD83D0xDC67", "0xD83D0xDC68", "0xD83D0xDC69", "0xD83D0xDC6A", "0xD83D0xDC6B", "0xD83D0xDC6C", "0xD83D0xDC6D", "0xD83D0xDC6E", "0xD83D0xDC6F", "0xD83D0xDC70", "0xD83D0xDC71", "0xD83D0xDC72", "0xD83D0xDC73", "0xD83D0xDC74", "0xD83D0xDC75", "0xD83D0xDC76", "0xD83D0xDC77", "0xD83D0xDC78", "0xD83D0xDC79", "0xD83D0xDC7A", "0xD83D0xDC7B", "0xD83D0xDC7C", "0xD83D0xDC7D", "0xD83D0xDC7E", "0xD83D0xDC7F", "0xD83D0xDC80", "0xD83D0xDC81", "0xD83D0xDC82", "0xD83D0xDC83", "0xD83D0xDC84", "0xD83D0xDC85", "0xD83D0xDC86", "0xD83D0xDC87", "0xD83D0xDC88", "0xD83D0xDC89", "0xD83D0xDC8A", "0xD83D0xDC8B", "0xD83D0xDC8C", "0xD83D0xDC8D", "0xD83D0xDC8E", "0xD83D0xDC8F", "0xD83D0xDC90", "0xD83D0xDC91", "0xD83D0xDC92", "0xD83D0xDC93", "0xD83D0xDC94", "0xD83D0xDC95", "0xD83D0xDC96", "0xD83D0xDC97", "0xD83D0xDC98", "0xD83D0xDC99", "0xD83D0xDC9A", "0xD83D0xDC9B", "0xD83D0xDC9C", "0xD83D0xDC9D", "0xD83D0xDC9E", "0xD83D0xDC9F", "0xD83D0xDCA0", "0xD83D0xDCA1", "0xD83D0xDCA2", "0xD83D0xDCA3", "0xD83D0xDCA4", "0xD83D0xDCA5", "0xD83D0xDCA6", "0xD83D0xDCA7", "0xD83D0xDCA8", "0xD83D0xDCA9", "0xD83D0xDCAA", "0xD83D0xDCAB", "0xD83D0xDCAC", "0xD83D0xDCAD", "0xD83D0xDCAE", "0xD83D0xDCAF", "0xD83D0xDCB0", "0xD83D0xDCB1", "0xD83D0xDCB2", "0xD83D0xDCB3", "0xD83D0xDCB4", "0xD83D0xDCB5", "0xD83D0xDCB6", "0xD83D0xDCB7", "0xD83D0xDCB8", "0xD83D0xDCB9", "0xD83D0xDCBA", "0xD83D0xDCBB", "0xD83D0xDCBC", "0xD83D0xDCBD", "0xD83D0xDCBE", "0xD83D0xDCBF", "0xD83D0xDCC0", "0xD83D0xDCC1", "0xD83D0xDCC2", "0xD83D0xDCC3", "0xD83D0xDCC4", "0xD83D0xDCC5", "0xD83D0xDCC6", "0xD83D0xDCC7", "0xD83D0xDCC8", "0xD83D0xDCC9", "0xD83D0xDCCA", "0xD83D0xDCCB", "0xD83D0xDCCC", "0xD83D0xDCCD", "0xD83D0xDCCE", "0xD83D0xDCCF", "0xD83D0xDCD0", "0xD83D0xDCD1", "0xD83D0xDCD2", "0xD83D0xDCD3", "0xD83D0xDCD4", "0xD83D0xDCD5", "0xD83D0xDCD6", "0xD83D0xDCD7", "0xD83D0xDCD8", "0xD83D0xDCD9", "0xD83D0xDCDA", "0xD83D0xDCDB", "0xD83D0xDCDC", "0xD83D0xDCDD", "0xD83D0xDCDE", "0xD83D0xDCDF", "0xD83D0xDCE0", "0xD83D0xDCE1", "0xD83D0xDCE2", "0xD83D0xDCE3", "0xD83D0xDCE4", "0xD83D0xDCE5", "0xD83D0xDCE6", "0xD83D0xDCE7", "0xD83D0xDCE8", "0xD83D0xDCE9", "0xD83D0xDCEA", "0xD83D0xDCEB", "0xD83D0xDCEC", "0xD83D0xDCED", "0xD83D0xDCEE", "0xD83D0xDCEF", "0xD83D0xDCF0", "0xD83D0xDCF1", "0xD83D0xDCF2", "0xD83D0xDCF3", "0xD83D0xDCF4", "0xD83D0xDCF5", "0xD83D0xDCF6", "0xD83D0xDCF7", "0xD83D0xDCF9", "0xD83D0xDCFA", "0xD83D0xDCFB", "0xD83D0xDCFC", "0xD83D0xDD00", "0xD83D0xDD01", "0xD83D0xDD02", "0xD83D0xDD03", "0xD83D0xDD04", "0xD83D0xDD05", "0xD83D0xDD06", "0xD83D0xDD07", "0xD83D0xDD09", "0xD83D0xDD0A", "0xD83D0xDD0B", "0xD83D0xDD0C", "0xD83D0xDD0D", "0xD83D0xDD0E", "0xD83D0xDD0F", "0xD83D0xDD10", "0xD83D0xDD11", "0xD83D0xDD12", "0xD83D0xDD13", "0xD83D0xDD14", "0xD83D0xDD15", "0xD83D0xDD16", "0xD83D0xDD17", "0xD83D0xDD18", "0xD83D0xDD19", "0xD83D0xDD1A", "0xD83D0xDD1B", "0xD83D0xDD1C", "0xD83D0xDD1D", "0xD83D0xDD1E", "0xD83D0xDD1F", "0xD83D0xDD20", "0xD83D0xDD21", "0xD83D0xDD22", "0xD83D0xDD23", "0xD83D0xDD24", "0xD83D0xDD25", "0xD83D0xDD26", "0xD83D0xDD27", "0xD83D0xDD28", "0xD83D0xDD29", "0xD83D0xDD2A", "0xD83D0xDD2B", "0xD83D0xDD2C", "0xD83D0xDD2D", "0xD83D0xDD2E", "0xD83D0xDD2F", "0xD83D0xDD30", "0xD83D0xDD31", "0xD83D0xDD32", "0xD83D0xDD33", "0xD83D0xDD34", "0xD83D0xDD35", "0xD83D0xDD36", "0xD83D0xDD37", "0xD83D0xDD38", "0xD83D0xDD39", "0xD83D0xDD3A", "0xD83D0xDD3B", "0xD83D0xDD3C", "0xD83D0xDD3D", "0xD83D0xDD50", "0xD83D0xDD51", "0xD83D0xDD52", "0xD83D0xDD53", "0xD83D0xDD54", "0xD83D0xDD55", "0xD83D0xDD56", "0xD83D0xDD57", "0xD83D0xDD58", "0xD83D0xDD59", "0xD83D0xDD5A", "0xD83D0xDD5B", "0xD83D0xDD5C", "0xD83D0xDD5D", "0xD83D0xDD5E", "0xD83D0xDD5F", "0xD83D0xDD60", "0xD83D0xDD61", "0xD83D0xDD62", "0xD83D0xDD63", "0xD83D0xDD64", "0xD83D0xDD65", "0xD83D0xDD66", "0xD83D0xDD67", "0xD83D0xDDFB", "0xD83D0xDDFC", "0xD83D0xDDFD", "0xD83D0xDDFE", "0xD83D0xDDFF", "0xD83D0xDE00", "0xD83D0xDE01", "0xD83D0xDE02", "0xD83D0xDE03", "0xD83D0xDE04", "0xD83D0xDE05", "0xD83D0xDE06", "0xD83D0xDE07", "0xD83D0xDE08", "0xD83D0xDE09", "0xD83D0xDE0A", "0xD83D0xDE0B", "0xD83D0xDE0C", "0xD83D0xDE0D", "0xD83D0xDE0E", "0xD83D0xDE0F", "0xD83D0xDE10", "0xD83D0xDE11", "0xD83D0xDE12", "0xD83D0xDE13", "0xD83D0xDE14", "0xD83D0xDE15", "0xD83D0xDE16", "0xD83D0xDE17", "0xD83D0xDE18", "0xD83D0xDE19", "0xD83D0xDE1A", "0xD83D0xDE1B", "0xD83D0xDE1C", "0xD83D0xDE1D", "0xD83D0xDE1E", "0xD83D0xDE1F", "0xD83D0xDE20", "0xD83D0xDE21", "0xD83D0xDE22", "0xD83D0xDE23", "0xD83D0xDE24", "0xD83D0xDE25", "0xD83D0xDE26", "0xD83D0xDE27", "0xD83D0xDE28", "0xD83D0xDE29", "0xD83D0xDE2A", "0xD83D0xDE2B", "0xD83D0xDE2C", "0xD83D0xDE2D", "0xD83D0xDE2E", "0xD83D0xDE2F", "0xD83D0xDE30", "0xD83D0xDE31", "0xD83D0xDE32", "0xD83D0xDE33", "0xD83D0xDE34", "0xD83D0xDE35", "0xD83D0xDE36", "0xD83D0xDE37", "0xD83D0xDE38", "0xD83D0xDE39", "0xD83D0xDE3A", "0xD83D0xDE3B", "0xD83D0xDE3C", "0xD83D0xDE3D", "0xD83D0xDE3E", "0xD83D0xDE3F", "0xD83D0xDE40", "0xD83D0xDE45", "0xD83D0xDE46", "0xD83D0xDE47", "0xD83D0xDE48", "0xD83D0xDE49", "0xD83D0xDE4A", "0xD83D0xDE4B", "0xD83D0xDE4C", "0xD83D0xDE4D", "0xD83D0xDE4E", "0xD83D0xDE4F", "0xD83D0xDE80", "0xD83D0xDE81", "0xD83D0xDE82", "0xD83D0xDE83", "0xD83D0xDE84", "0xD83D0xDE85", "0xD83D0xDE86", "0xD83D0xDE87", "0xD83D0xDE88", "0xD83D0xDE89", "0xD83D0xDE8A", "0xD83D0xDE8C", "0xD83D0xDE8D", "0xD83D0xDE8E", "0xD83D0xDE8F", "0xD83D0xDE90", "0xD83D0xDE91", "0xD83D0xDE92", "0xD83D0xDE93", "0xD83D0xDE94", "0xD83D0xDE95", "0xD83D0xDE96", "0xD83D0xDE97", "0xD83D0xDE98", "0xD83D0xDE99", "0xD83D0xDE9A", "0xD83D0xDE9B", "0xD83D0xDE9C", "0xD83D0xDE9D", "0xD83D0xDE9E", "0xD83D0xDE9F", "0xD83D0xDEA0", "0xD83D0xDEA1", "0xD83D0xDEA2", "0xD83D0xDEA3", "0xD83D0xDEA4", "0xD83D0xDEA5", "0xD83D0xDEA6", "0xD83D0xDEA7", "0xD83D0xDEA8", "0xD83D0xDEA9", "0xD83D0xDEAA", "0xD83D0xDEAB", "0xD83D0xDEAC", "0xD83D0xDEAD", "0xD83D0xDEAE", "0xD83D0xDEAF", "0xD83D0xDEB0", "0xD83D0xDEB1", "0xD83D0xDEB2", "0xD83D0xDEB3", "0xD83D0xDEB4", "0xD83D0xDEB5", "0xD83D0xDEB6", "0xD83D0xDEB7", "0xD83D0xDEB8", "0xD83D0xDEB9", "0xD83D0xDEBA", "0xD83D0xDEBB", "0xD83D0xDEBC", "0xD83D0xDEBD", "0xD83D0xDEBE", "0xD83D0xDEBF", "0xD83D0xDEC0", "0xD83D0xDEC1", "0xD83D0xDEC2", "0xD83D0xDEC3", "0xD83D0xDEC4", "0xD83D0xDEC5", "0x00230x20E3", "0x00300x20E3", "0x00310x20E3", "0x00320x20E3", "0x00330x20E3", "0x00340x20E3", "0x00350x20E3", "0x00360x20E3", "0x00370x20E3", "0x00380x20E3", "0x00390x20E3", "0xD83C0xDDE80xD83C0xDDF3", "0xD83C0xDDE90xD83C0xDDEA", "0xD83C0xDDEA0xD83C0xDDF8", "0xD83C0xDDEB0xD83C0xDDF7", "0xD83C0xDDEC0xD83C0xDDE7", "0xD83C0xDDEE0xD83C0xDDF9", "0xD83C0xDDEF0xD83C0xDDF5", "0xD83C0xDDF00xD83C0xDDF7", "0xD83C0xDDF70xD83C0xDDFA", "0xD83C0xDDFA0xD83C0xDDF8"],
    emojiUTF16Reg = [],
    imgReg = /<img.+?rel="emoji".+?name="([\w]+?)".+?\/?>/gi;

for (var i = 0; i < emojiUTF16.length; i++) {
    emojiUTF16Reg.push(new RegExp(emojiUTF16[i].replace(/0x/g, '\\u'), 'g'));
}

(function faceToIndex() {
    if (!faceWordingMap) {
        faceWordingMap = {};
        faceWording.forEach(function(word, index) {
            faceWordingMap[word] = index;
        });
    }
    if (!lnWordingMap) {
        lnWordingMap = {};
        lnWording.forEach(function(word, index) {
            lnWordingMap[word] = index + 1;
        });
    }

    if (!MOBLIE_FACE_ARRAY) {
        MOBLIE_FACE_ARRAY = [];
        for (var key in MOBLIE_FACE) {
            var index = MOBLIE_FACE[key].code - 0;
            MOBLIE_FACE_ARRAY[index] = key;
        }
    }
    window.MOBLIE_FACE_ARRAY = MOBLIE_FACE_ARRAY;
    window.faceWordingMap = faceWordingMap;
    window.lnWordingMap = lnWordingMap;
})();

var faceReg = /\[\/([\u4e00-\u9fa5OKN]{1,3})\]/g;
/**
 * [code2Img 文本转换为表情文本]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
face.code2Img = function(msg) {
    // debugger;
    //var faceReg=/\[\/([\u4e00-\u9fa5OKN]{1,3})\]/g;
    if (msg) {
        // msg：[/猪头]something[/差劲]....
        return msg.replace(faceReg, function($0, $1) {
            // 匹配出汉字，表情词语
            // 在表情数组里面找到当前匹配的表情的位置
            var index = faceWording.indexOf($1);
            if (index > -1) {
                // 生成表情图片标签，这里用到了刚才找的位置数字
                return '<img class="face" title="' + $1 + '" src="http://0.web.qstatic.com/webqqpic/style/face/' + index + '.gif" alt="' + getFaceCode($1) + '" rel="face">';
            } else {
                return $0;
            }
        });
    } else {
        return msg;
    }
};

face.decodeRichText = function(richText) {
    return code2Img(moblieCode2Img(face.code2Img(decode(richText))));
};
face.decodePasteText = function(richText) {
    return code2Img(moblieCode2Img(face.code2Img(richText)));
};

var decode = face.decode = function(text) {
    var rdecodeEntity = /&quot;|&lt;|&gt;|&amp;|&nbsp;|&apos;|&#(\d+);|&#(\d+)/g;
    var rhtmlSpace = /\u00a0/g;
    var rbr = /<br\s*\/?>/ig;
    var decodeEntities = {
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&nbsp;': ' '
    };

    function fdecodeEntity(matched, charCode, lastCharCode) {
            if (!charCode && !lastCharCode) {
                return decodeEntities[matched] || matched;
            }
            return String.fromCharCode(charCode || lastCharCode);
        }
        // 1. 将所有<br>全部替换成\n
        // 2. 将`&quot;|&lt;|&gt;|&amp;|&nbsp;|&apos;`按照映射`{
        //         '&quot;': '"',
        //         '&lt;': '<',
        //         '&gt;': '>',
        //         '&amp;': '&',
        //         '&nbsp;': ' '
        //     }`全部替换
        // 3. 将`\u00a0`全部已换成空格
    return text ? ('' + text).replace(rbr, '\n').replace(rdecodeEntity, fdecodeEntity).replace(rhtmlSpace, ' ') : '';
};

function moblieCode2Img(text) {
    // debugger;
    return text.replace(/\u0014([\s\S])/gi, function(matchText, $1, index, orgText) {
        // 匹配那个神秘的unicode字符
        // 拿到字符之后的事就好办了
        var text = MOBLIE_FACE_ARRAY[parseInt(getMoblieCode2Decimal($1))];
        // 这时候text就是表情词语了
        if (text) {
            return face.code2Img(getFaceCode(text));
        }
        return matchText;
    })
}

function getMoblieCode2Decimal(text) {
    if (text) {
        return text.charCodeAt(0);
    }
    return text;
}

function code2Img(text) {
    // 前面处理完了pc表情，这里再处理手机端的表情，逻辑比pc端简单很多
    for (var i = 0; i < emojiUTF16Reg.length; i++) {
        text = text.replace(emojiUTF16Reg[i], '<img alt="@" height="24" width="24" src="http://qplus3.idqqimg.com/qun/jslib/res/ios_emoji/' + emojiUTF16[i] + '.png" rel="emoji" name="' + emojiUTF16[i] + '" />');
    }
    return text;
}

function getFaceCode(text) {
    return '[\/' + text + ']';
}

face.getText = function(text) {
    return strip(imgs2Code(text).replace(/(\r\n|\n|\r)/gm, " "));
};

face.getTextLength = function(text) {
    var wordCount = 0;

    if (text) {
        // 将编码后的的 face 再换算成一个字符
        text = text.replace(/\[\/([\u4e00-\u9fa5OKN]{1,3})\]/g, '吃');

        var zhChar = text.match(/[^\x00-\xff]/g) || [];
        var letter = text.replace(/[^\x00-\xff]/g, '');
        return (zhChar.length + (letter.length / 3)) + 0.9; // 3非汉字字符算一个 字
    }

    return wordCount;
};

function strip(html) {
    var singleNewlineTags = 'p';

    var r = RegExp('<(/?\\s*' + singleNewlineTags + ')[^>]*>', 'ig');
    html = html.replace(r, function(match, $1, index, text) {
        if ($1.match(/^\//)) { // end tag
            return '\n';
        }
        return '';
    });

    return html
        .replace(/<\/?[^>]*>/gi, '')
        .replace(new RegExp("&nbsp;", 'gi'), " ")
        .replace(/\u200B/g, "")
        .replace(/(\r\n|\n|\r)$/g, '');
}

function imgs2Code(text) {
    return text.replace(/<img.+?\/?>/gi, function(matchText, index, orgText) {
        var code = matchText.match(/alt="(\[\/[\u4e00-\u9fa5OKN]{1,3}\])"/);
        if (code) {
            return code[1];
        }
        return matchText;
    });
}

function getMobileCode(code) {
    return String.fromCharCode(EMPTY_SPACE_CODE) + String.fromCharCode(code);
}

face.faceCode2MoblieCode = function(text) {
    return text.replace(/\[\/([\u4e00-\u9fa5OKN]{1,3})\]/gi, function(matchText, $1, index, orgText) {
        var moblieFace = MOBLIE_FACE[$1];
        if (moblieFace) {
            return getMobileCode(moblieFace.code);
        }
        return matchText;
    })
};

face.moblieCode2Text = function(text) {
    return text.replace(/\u0014([\s\S])/gi, function(matchText, $1, index, orgText) {
        var text = MOBLIE_FACE_ARRAY[parseInt(getMoblieCode2Decimal($1))];
        if (text) {
            return "/" + text;
        }
        return matchText;
    })
};

face.imgs2MoblieCode = function(text) {
    return text.replace(/<img.+?\/?>/gi, function(matchText, index, orgText) {
        var code = matchText.match(/alt="(\[\/[\u4e00-\u9fa5OKN]{1,3}\])"/);
        if (code) {
            return face.faceCode2MoblieCode(code[1]);
        }
        return matchText;
    });
};

face.imgs2Code = function(text) {

    return text.replace(imgReg, function($1, $2, index, originalText) {
        var hexArray = $2.split('0x'),
            newHexArray = [];
        for (var i = 1; i < hexArray.length; i++) {
            newHexArray.push(parseInt(hexArray[i], 16));
        }
        return String.fromCharCode.apply(undefined, newHexArray);
    });
};
},{}],26:[function(require,module,exports){
'use strict';

var cgi = require('./cgi');

var ginfo;

module.exports = function(fn) {
    if(ginfo) fn(null, ginfo);

    else cgi.getQunInfo().done(function(res) {
        void 0;

        ginfo = res;

        fn(null, ginfo);
    }).fail(function(err) {
        fn(err);
    });
};
},{"./cgi":22}],27:[function(require,module,exports){
'use strict';

var $ = window.Zepto || window.$;

var escape = require('lodash.escape');
var unescape = require('lodash.unescape');

var tdw = require('./report');

var util = require('../../lib/util');
var face = require('./face');
var xss = require('./xss');
var editor = require('./editor');

var tagReg = /(<\/?[^(div)<>]+>?)/gim;

var faceReg = /\[\/[\u4e00-\u9fa5OKN]{1,3}\]/g;

var $intro, $num, oldHtml;
// 解决iframe引起的无法触发window.load问题
window.addEventListener('load', function() {
    // debugger;
    // 引入iframe，解决插入表情光标乱跑的问题
    // $('#iframe').replaceWith('<iframe id="newIframe" class="border f-left" src=""></iframe>');
    var $iframe = $('#iframe');
    // $iframe.attr('src', 'http://qinfo.clt.qq.com/qinfo_v3/profile.html');

    // try {
    //     $iframe.load(function() {
    //         debugger;
    //         console.log(arguments);
    //     });
    // } catch(e) {
    //     debugger;
    //     console.log(e);
    // }
    // $iframe.on('load', function() {
    //     debugger;
    //     console.log(arguments);
    // });
    // $iframe.on('error', function() {
    //     debugger;
    //     console.log(arguments);
    // });

    var win = $iframe[0].contentWindow;

    var doc = win.document;

    // win.onload = function() {
    //     debugger;
    //     console.log(arguments);
    // };
    // win.onerror = function() {
    //     debugger;
    //     console.log(arguments);
    // };
    // doc.onreadystatechange = function() {
    //     debugger;
    //     console.log(arguments);
    // };

    // $(doc).ready(function() {
    //     debugger;
    //     console.log(arguments);
    // });

    doc.write('<head><link rel="stylesheet" href="' + document.head.querySelector('link').href + '"></head><body class="editor"><div id="intro" class="border f-left" contenteditable="true"></div></body>');
    window.$intro = $intro = $('#intro', doc);
    var $face = $('.icon-face');

    // var $intro = $('#intro');
    $num = $('#num');

    oldHtml = '';

    var $faceSelector = $('.face-selector');
    var $faceHover = $faceSelector.find('.face-hover');
    $faceSelector.find('.inner').on('mouseenter, mousemove', function(e) {
            if (e.layerX <= 60 && e.layerY <= 60) {
                $faceHover.addClass('right');
            } else {
                $faceHover.removeClass('right');
            }
            $faceHover.show();
        }).on('mouseout', function() {
            $faceHover.hide();
        })
        .find('a').on('mouseenter, mousemove', function() {
            var i = parseInt(this.getAttribute('i'));


            if (i === 65) {
                // debugger;
                i = 116;
                // wording = '示爱';
            }

            var wording = face.wording[i];

            $faceHover.find('img')
                .attr({
                    src: 'http://0.web.qstatic.com/webqqpic/style/face/' + i + '.gif',
                    title: wording,
                    alt: '[/' + wording + ']'
                });
            $faceHover.find('.name').html(wording);
        }).on('click', function() {
            tdw('choose_face');

            if (getWordCount() >= 300) return;

            $intro.focus();

            editor($faceHover.find('img').clone()[0], doc);
            $intro.focus();

            $num.html(parseInt($num.html()) - 1);

            $faceSelector.toggleClass('hide');
            // $('#intro').append($faceHover.find('img').clone());
        });

    // $face.on('click', function() {
    //     $face.addClass('active');
    //     $('.item .select-outer').addClass('hide');
    // });

    $intro.on('input', updateCount).on('focus', function() {
        // $(this).addClass('active');
        $('.item .option-list').addClass('hide');
    }).on('paste', function(e) {
        // debugger;
        e.preventDefault();

        var intro = e.clipboardData.getData('Text');
        void 0;

        if (!intro) return;

        // 将粘贴过来的style删掉
        // var text = $intro.html();
        // text = text.replace(/<[^img|a][^>]+>/g, '');
        // $intro.html(text);

        // $intro.html(intro);

        // 过滤除div以外的标签
        // intro = intro.replace(tagReg, '');
        // try {
        //     intro = $(intro);
        //     if(intro.length) intro = Array.prototype.reduce.call(intro, function(prev, item) {
        //         // 粘贴表情
        //         // if(item.nodeName === 'IMG' && item.src && item.src.indexOf('http://0.web.qstatic.com') === 0) return prev + item.outerHTML;

        //         if(item.nodeName === 'DIV') return prev + item.innerHTML;

        //         return prev + $(item).text();
        //     }, '');
        //     else intro = intro.selector;
        // } catch(e) {
        //     console.log(e.message);
        // }

        void 0;

        intro = escape(intro);
        void 0;

        intro = xss.filter(intro);
        void 0;

        var faces = intro.match(faceReg);
        if (faces && faces.length) {
            intro = intro.split(faceReg);

            intro = intro.reduce(function(prev, item, i) {
                return prev + item + (faces[i] ? face.decodePasteText(faces[i]) : '');
            }, '');
        }

        // intro = face.decodePasteText(intro);
        // console.log('after decodePasteText', intro);

        editor.pasteHtmlAtCaret(intro, doc);

        // return intro;

        // console.log($intro.text());

        updateCount();
    });

    $(document.body).on('click', function(e) {
        // 客户端不支持dom.matches
        // if(e.target.matches('.icon-face')) {
        if ($(e.target).is('.icon-face')) {
            $face.toggleClass('active');
            $faceSelector.toggleClass('hide');
            e.preventDefault();
            e.stopPropagation();

            tdw('Clk_face');
        } else {
            $face.removeClass('active');
            $faceSelector.addClass('hide');
        }
    });
});

function updateCount() {
    var n = getWordCount();
    if (n > 300) return $intro.html(oldHtml);

    n = 300 - n;
    $num.html(n);
    oldHtml = $intro.html();
}

function getWordCount(html) {
    html || (html = $intro.html());

    var text = face.getText(html);

    return parseInt(face.getTextLength(text));
}

function renderIntro(intro) {
    // var intro2 = intro;

    // intro = util.decodeHtml(intro);

    // // intro.match()

    // $intro.html(intro);

    // // alert(intro2);
    // console.log(intro2);
    // debugger;
    intro = face.decodeRichText(intro);
    intro = xss.filter(intro);
    void 0;
    $intro.html(intro);

    updateCount();
}

renderIntro.getIntro = function() {
    var html = $intro.html();

    var text = face.getText(html);

    text = face.decode(text);
    text = face.faceCode2MoblieCode(text);
    text = face.moblieCode2Text(text);


    // html = face.decodeRichText(html);
    html = html.replace(/(<a.+?>)|<\/a>/gi, '').replace(/(\r\n|\n|\r)/gm, '');
    html = html.replace(/<br\/?>/gim, '');

    html = html.replace(/(<div>){2,}/gim, '<div>');
    html = html.replace(/(<\/div>){2,}/gim, '</div>');

    html = html.replace(/(<span[^>]*>)/gim, '');
    html = html.replace(/(<\/span>)/gim, '');

    html = html.replace(/<div><\/div>/gim, '');

    // 过滤除div以外的标签
    // html = html.replace(tagReg, '');

    // html = html.replace(/<span[^>]?>([^<]?)<\/span>/gim, function() {
    //     debugger;
    //     console.log(arguments);
    // });

    html = face.imgs2MoblieCode(html);
    html = face.imgs2Code(html);

    return {
        text: text,
        rich: html
    };
};

renderIntro.isModify = function(intro) {
    // debugger;
    return this.getIntro().rich !== unescape(intro).replace(/&nbsp;/g, ' '); // face.decode(intro);
};

module.exports = renderIntro;
},{"../../lib/util":19,"./editor":24,"./face":25,"./report":31,"./xss":37,"lodash.escape":1,"lodash.unescape":12}],28:[function(require,module,exports){
'use strict';

var $ = window.Zepto || window.$;

var cgi = require('./cgi');
var widget = require('../../lib/widget');
var catalog = require('./catalog');
var client = require('../../lib/callClient');
var tmpl = {
    select: require('./tmpl/select')
};
// 配置项
var schoolConfig = require('./jxconfig');

var $selectOuter = $('#jxCity .select-outer');
var $selectOuter2 = $('#jxSchool .select-outer');
var $selectOuter3 = $('#jxClass .select-outer');

// var gradeInput = '<input id="jxGradeInput" type="text" placeholder="填写年级">';

function gradeInput(value) {
    return '<input id="jxGradeInput" type="text" value="' + (value || '') + '" placeholder="填写年级">';
}

// var $jxSchoolInput = $('#jxSchoolInput');
// var $jxClassInput = $('#jxClassInput');

// 临时变量
var newClassDetail = [undefined, undefined, undefined, undefined, undefined, undefined];
var newProvince;
var category;

// 获取前6年
function getYears() {
    var d = new Date();
    var year = d.getFullYear();
    var list = [];

    for (var i = year; i > year - 7; i--) {
        list.push({
            value: i,
            text: i + '级'
        });
    }
    return list;
}

function isOtherGrade(schoolType) {
    return schoolType === '培训机构' || schoolType === '其他';
}

// 设置学校信息
function setSchoolType(schoolType, schoolName) {
    category = schoolType || '';
    schoolType = schoolType || '在读类型';
    schoolName = schoolName || '';

    var select = tmpl.select({
        list: schoolConfig.schoolType
    });

    select = '<div class="select-wrap border">' + select + '</div><input id="jxSchoolInput" type="text" value="' + schoolName + '" class="border short" placeholder="学校名称" maxlength="16" /><div id="jxSchoolList" class="suggestion-outer"></div>';

    $selectOuter2.html(select);

    widget.transSelect($selectOuter2.find('select'), function(id, text) {
        void 0;
        var list = schoolConfig.getGradeById(id);
        setClassSelect(list);

        newClassDetail[1] = text;
        newClassDetail[4] = undefined;
        category = text;
    }, {
        default: schoolType
    });

    createSuggestion($('#jxSchoolInput'), $('#jxSchoolList'));
}

// 设置班级信息
function setClass(schoolType, year, grade, className) {
    // debugger;
    if (year) ~year.indexOf('级') || (year += '级');
    else year = '入学年份';

    className = className || '';

    var list = getYears();

    var select = tmpl.select({
        list: list
    });

    var html = '<div class="select-wrap border">' + select + '</div><div class="select-wrap border">' + (isOtherGrade(schoolType) ? gradeInput(grade) : '') + '</div><input id="jxClassInput" type="text" value="' + className + '" class="border short" placeholder="班级，如：1班" maxlength="6" />';

    $selectOuter3.html(html);

    widget.transSelect($selectOuter3.find('.select-wrap:first-child select'), function(id, text) {
        void 0;

        newClassDetail[3] = id;
    }, {
        default: year
    });

    list = schoolConfig.getGradeByName(schoolType);
    setClassSelect(list, grade);
}

function setClassSelect(list, defaultGrade) {
    list || (list = ['选择年级']);
    defaultGrade = defaultGrade || '选择年级';

    var $select = $selectOuter3.find('.select-wrap:nth-child(2)');

    // 常规类型
    if (list.length) {
        var select = tmpl.select({
            list: list
        });
        $select.html(select);
        widget.transSelect($select.find('select'), function(id, text) {
            newClassDetail[4] = text;
        }, {
            default: defaultGrade,
            stopDefault: function() {
                if (typeof newClassDetail[1] === 'undefined') {
                    client.alert(1, '群资料卡', '请先选择在读类型');
                    return true;
                }

                return false;
            }
        });
    } else {
        // 培训和其他
        $select.html(gradeInput(defaultGrade));
    }
}

function setCity(cityId) {
    // debugger;
    var defaultProvince = {
        text: '省/直辖市'
    };
    cityId && (defaultProvince = catalog.getProvinceByCity(cityId));

    // 取同城的城市数据
    var list = catalog.getProvinceList();

    var select = tmpl.select({
        list: list
    });

    select = '<div class="location border">' + select + '</div><div class="location border"></div>';

    $selectOuter.html(select);

    function selectCity(province, city) {
        var defaultCity = {
            text: '市/区'
        };
        city && (defaultCity = catalog.getCityById(city));

        var $s = $selectOuter.find('.location:nth-child(2)');
        var list = ['市/区'];

        province && (list = catalog.getCityList(province));

        var select = tmpl.select({
            list: list
        });

        $s.html(select);

        newClassDetail[0] = defaultCity.value;
        widget.transSelect($s.find('select'), function(city, name) {
            void 0;
            newClassDetail[0] = city;
        }, {
            default: defaultCity.text
        });
    }

    widget.transSelect($selectOuter.find('.location:first-child select'), function(province, name) {
        void 0;
        newProvince = province;
        newClassDetail[0] = undefined;
        selectCity(province);
    }, {
        default: defaultProvince.text
    });

    newProvince = defaultProvince.value;
    selectCity(defaultProvince.value, cityId);
}

function createSuggestion($input, $container) {
    var done;

    var querying = false;

    function onKeyup() {
        void 0;

        if (querying) return;

        if (category === '其他') return hideContainer();

        var s = this.value.trim();
        // 中文输入法正在输入，可能会误杀带'名字的学校，不过肯定不多
        if (!s || ~s.indexOf("'")) return hideContainer();

        var city = catalog.getCityById(newClassDetail[0]).text;
        var param = {
            keyword: s
        };
        // 直辖市
        if (catalog.isMunicipality(newProvince)) {
            newProvince && (param.city = catalog.getCityById(newProvince).text);
            city && (param.district = city);
        } else {
            city && (param.city = city);
        }

        // cgi数据需要整理
        if (category === '初中' || category === '高中') category = '中学';
        else if (category === '中专') category = '职业技术学校';
        else if (category === '培训机构') category = '培训';

        category && (param.category = category);

        querying = true;
        cgi.querySchool(param).done(function(res) {
            querying = false;

            void 0;

            var result = res.sch_all;
            if (!result || !result.data || !result.data.length) return hideContainer();

            result = result.data;
            var list = result.map(function(item) {
                return {
                    value: item.name,
                    text: item.name
                };
            });
            var select = tmpl.select({
                list: list
            });

            var $select = $container.html('<div class="suggestion">' + select + '</div>').show().find('select');
            widget.transSelect($select, function(text) {
                $input.val(text);
                hideContainer();

                done && done(text);
            });
        }).fail(function() {
            querying = false;
        });

        // 5s后重置，避免引起麻烦
        setTimeout(function() {
            querying = false;
        }, 5000);

        function hideContainer() {
            $container.html('').hide();
        }
    }

    $input.off('input', onKeyup);
    $input.on('input', onKeyup);

    return function(fn) {
        done = fn;
    }
}

// 根据cgi数据展示家校群额外信息
exports.renderSchool = function(classDetail) {
    // debugger;
    var items = classDetail.split('|');

    // items = items.map(function(item) {
    //     return decodeURIComponent(item);
    // });

    // 将省市名称换算成城市id
    var province = items[0];
    var city = items[1];
    city = catalog.getCityIdByProvinceAndCity(province, city);

    if (items.length > 6) {
        items.splice(0, 1);
        items[0] = city;
    }

    newClassDetail = items;

    setCity(items[0]);

    setSchoolType(items[1], items[2]);

    setClass(items[1], items[3], items[4], items[5]);
};

/*
家校群字段校验
*/
function validateDetail() {
    void 0;

    var msg;

    if (typeof newProvince === 'undefined') msg = '请选择省/直辖市';
    else if (typeof newClassDetail[0] === 'undefined') msg = '请选择市/区';
    else if (typeof newClassDetail[1] === 'undefined') msg = '请选择在读类型';
    else if (!newClassDetail[2]) msg = '请填写学校名称';
    else if (~newClassDetail[2].indexOf('|')) msg = '学校名称不能包含特殊字符 |';
    else if (typeof newClassDetail[3] === 'undefined') msg = '请选择入学年份';
    else if (!newClassDetail[4]) msg = '请选择年级';
    else if (!newClassDetail[5]) msg = '请填写班级';
    else if (~newClassDetail[5].indexOf('|')) msg = '班级不能包含特殊字符 |';

    if (msg) throw new Error(msg);
}

// 保存的时候获取额外信息
exports.getClassDetail = function() {
    // debugger;
    newClassDetail[2] = $('#jxSchoolInput').val().trim();
    newClassDetail[5] = $('#jxClassInput').val().trim();

    isOtherGrade(newClassDetail[1]) && (newClassDetail[4] = $('#jxGradeInput').val().trim());

    validateDetail();

    // debugger;
    // 将城市id换算成省市名称
    var city = newClassDetail[0];

    if (typeof city === 'number') {
        var province = catalog.getProvinceByCity(city).text;
        city = catalog.getCityById(city).text;
        if (!province || !city) throw new Error('请选择地区');
        newClassDetail[0] = province + '|' + city;
    }

    return newClassDetail.join('|');
};
},{"../../lib/callClient":15,"../../lib/widget":20,"./catalog":21,"./cgi":22,"./jxconfig":29,"./tmpl/select":34}],29:[function(require,module,exports){
'use strict';

// 配置项
var schoolType = exports.schoolType = [{
    value: 1,
    text: '幼儿园',
    grade: [{
        value: 1,
        text: '小小班'
    }, {
        value: 2,
        text: '小班'
    }, {
        value: 3,
        text: '中班'
    }, {
        value: 4,
        text: '大班'
    }]
}, {
    value: 2,
    text: '小学',
    grade: [{
        value: 1,
        text: '一年级'
    }, {
        value: 2,
        text: '二年级'
    }, {
        value: 3,
        text: '三年级'
    }, {
        value: 4,
        text: '四年级'
    }, {
        value: 5,
        text: '五年级'
    }, {
        value: 6,
        text: '六年级'
    }]
}, {
    value: 3,
    text: '初中',
    grade: [{
        value: 1,
        text: '初一'
    }, {
        value: 2,
        text: '初二'
    }, {
        value: 3,
        text: '初三'
    }, {
        value: 4,
        text: '初四'
    }]
}, {
    value: 4,
    text: '高中',
    grade: [{
        value: 1,
        text: '高一'
    }, {
        value: 2,
        text: '高二'
    }, {
        value: 3,
        text: '高三'
    }]
}, {
    value: 5,
    text: '中专',
    grade: [{
        value: 1,
        text: '专一'
    }, {
        value: 2,
        text: '专二'
    }, {
        value: 3,
        text: '专三'
    }, {
        value: 4,
        text: '专四'
    }, {
        value: 0,
        text: '其他'
    }]
}, {
    value: 6,
    text: '培训机构',
    // grade: [{
    //     value: 0,
    //     text: '其他'
    // }]
    grade: []
}, {
    value: 0,
    text: '其他',
    // grade: [{
    //     value: 0,
    //     text: '其他'
    // }]
    grade: []
}];

exports.getGradeById = function(id) {
    var list = [];

    schoolType.some(function(item) {
        if (item.value != id) return false;

        list = item.grade;

        return true;
    });

    return list;
};

exports.getGradeByName = function(name) {
    if (!name) return;

    var list = [];

    schoolType.some(function(item) {
        if (item.text !== name) return false;

        list = item.grade;
        return true;
    });

    return list;
};
},{}],30:[function(require,module,exports){
'use strict';

var $ = window.Zepto || window.$;

var util = require('../../lib/util');

var $name = $('#name');

// $name.on('keydown', function(e) {
//     var n = util.getTextLength(this.value.trim(), 3);
//     console.log(n);
//     if(n > 30) {
//         e.preventDefault();
//         e.stopPropagation();
//         e.returnValue = false;
//         e.cancelBubble = true;
//         return false;
//     }
// });

// $name.on('keyup', function(e) {
//     // debugger;
//     console.log('input', e.keyCode);
//     // 左右键
//     if(e.keyCode == 37 || e.keyCode == 39) return;

//     var v = util.subStr($name.val().trim(), 30);
//     console.log(v);
//     $name.val(v);
// });
util.setMaxInput($name);

$name.on('click', function() {
    $('.item .option-list').addClass('hide');
});

function renderName(name) {
    $name.val(util.decodeHtml(name));

    // 默认群名称输入框全选状态
    $name[0].focus();
    $name[0].select();
};

renderName.isModify = function(name) {
    return $name.val().trim() !== util.decodeHtml(name);
};
renderName.getName = function() {
    return $name.val().trim();
};

module.exports = renderName;
},{"../../lib/util":19}],31:[function(require,module,exports){
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
},{"../../lib/callClient":15,"../../lib/report":16,"../../lib/util":19}],32:[function(require,module,exports){
'use strict';

var $ = window.Zepto || window.$;

var tdw = require('./report');

var util = require('../../lib/util');
var client = require('../../lib/callClient');
var cgi = require('./cgi');
var getGinfo = require('./ginfo');

var tmpl = {
    label: require('./tmpl/label')
};

var $label = $('#label');
var $keyword = $('#keyword');

var oriTags = [];
var lock = false; // 提交锁

function addTag() {
    var label = $keyword.val().trim();

    if (!label) return;

    var escapedLabel = require('lodash.escape')(label);

    if (~oriTags.indexOf(escapedLabel)) return client.alert(1, '温馨提示', '该标签已存在');

    // 最多允许输入20个标签
    if (oriTags.length >= 20) {
        client.alert(1, '温馨提示', '群标签数目已达上限');
        tdw('cue_wordtl');
        return;
    }

    if (!window.DEBUG && !client.online()) return client.alert(1, '群资料卡', '您已处于离线状态，请上线后再次尝试');

    if (lock) return;
    lock = true;

    cgi.addTag(label).done(function(res) {
        // 先添加标签
        oriTags.push(escapedLabel);

        void 0;
        var html = tmpl.label({
            tag: escapedLabel,
            md: res.md,
            n: '自己',
            u: res.u || util.getUin()
        });
        $label.append(html);
        $keyword.val('');

        // 通知客户端更新数据
        client.onSave(0);

        tdw('write_newword');
    }).fail(function(err) {
        // oriTags.pop(); // 坑了自己

        var aTips = ['群不存在', '群已被删除', '没有权限', '标签内容不合法', '24小时内只能贴一次', '标签数目超过上限', '没有权限删除群标签', '群分类信息包含敏感词', '标签不存在', '标签含有敏感词'];
        var tips = aTips[err.ec - 11];

        (err.ec == 16) && tdw('cue_wordtl');
        (err.ec == 504) && (tips = '操作超时了');

        tips || (tips = '贴群标签出错了');

        client.alert(1, '温馨提示', tips);
    }).always(function() {
        lock = false;
    });
}
$('#labelUp').on('click', addTag);
$keyword.on('keyup', function(e) {
    (e.keyCode == 13) && addTag();
});
util.setMaxInput($keyword);

$label.on('click', '.icon-del', function() {
    if (!window.DEBUG && !client.online()) return client.alert(1, '群资料卡', '您已处于离线状态，请上线后再次尝试');

    var tagID = this.dataset.id;

    var label = $(this).prev('span').html();

    cgi.removeTag(label, tagID).done(function(res) {
        oriTags.splice(oriTags.indexOf(label), 1);
        void 0;
        $(this).parent().remove();

        // 通知客户端更新数据
        client.onSave(0);

        tdw('del_oldword');
    }.bind(this)).fail(function() {
        client.alert(1, '温馨提示', '删除群标签出错了');
    });
});

module.exports = function renderTags(tags) {
    if (!tags || !tags.length) return;

    getGinfo(function(err, res) {
        if (err || !res) res = {
            ns: {}
        };

        var html = tags.reduce(function(prev, item) {
            oriTags.push(item.tag);

            item.n = res.ns[item.u] || '';
            return prev + tmpl.label(item);
        }, '');

        $label.html(html);
    });
};
},{"../../lib/callClient":15,"../../lib/util":19,"./cgi":22,"./ginfo":26,"./report":31,"./tmpl/label":33,"lodash.escape":1}],33:[function(require,module,exports){
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
__p += '<div class="label" title="' +
((__t = (n + '（' + u + '）张贴')) == null ? '' : __t) +
'">\r\n    <span>' +
((__t = (tag)) == null ? '' : __t) +
'</span>\r\n    <span class="icon-del" data-id="' +
((__t = (md)) == null ? '' : __t) +
'" title="删除">\r\n        <svg>\r\n            <path d="M2 0 L 6 4 L 10 0 Q 12 0, 12 2 L 8 6 L 12 10 Q 12 12, 10 12 L 6 8 L 2 12 Q 0 12, 0 10 L 4 6 L 0 2 Q 0 0, 2 0Z"/>\r\n        </svg>\r\n    </span>\r\n</div>';

}
return __p
}
},{}],34:[function(require,module,exports){
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
__p += '<select>\r\n    ';
 typeof list !== 'undefined' && list.length &&  list.forEach(function(item) { ;
__p += '\r\n    <option value="' +
((__t = (typeof item.value !== 'undefined' ? item.value : (item.text || item))) == null ? '' : __t) +
'">' +
((__t = (item.text || item)) == null ? '' : __t) +
'</option>\r\n    ';
 }); ;
__p += '\r\n</select>';

}
return __p
}
},{}],35:[function(require,module,exports){
'use strict';

var $ = window.Zepto || window.$;
var unescape = require('lodash.unescape');

var util = require('../../lib/util');
var widget = require('../../lib/widget');
var catalog = require('./catalog');
var detail = require('./detail');
var jiaxiao = require('./jiaxiao');

var tdw = require('./report');

var tmpl = {
    select: require('./tmpl/select')
};

var $type = $('#type');
var $tagSection = $('#tagSection');
var $jxSection = $('#jxSection');
var $selectOuter = $('#nameSection .select-outer');
var $selectOuter2 = $('#detailSection .select-outer');

function bindDropdown() {
    $type.on('click', function() {
        $selectOuter.toggleClass('hide');
        $selectOuter2.addClass('hide');
    });
}

$(document.body).on('click', function(e) {
    if (!$(e.target).is('#type, #detailInput, #detail') && !$.contains($selectOuter[0], e.target) && !$.contains($selectOuter2[0], e.target)) {
        $selectOuter.addClass('hide');
        $selectOuter2.addClass('hide');
    }
});

var newType;
var newDetail;
var hasSubClass = true;
var hasRenderedSchool = false;

// 数据上报
var oriPid;
var oriId;

// 在家校群和普通群之间切换，对应ui需要切换
function toggleType(classID, classDetail) {
    // 家校群
    // '32' == 32
    if (classID == 32) {
        void 0;
        if (!hasRenderedSchool) {
            hasRenderedSchool = true;
            jiaxiao.renderSchool(classDetail);
        }
        $tagSection.hide();
        $jxSection.show();

        // 切换到家校群
        // 上报 PV
        tdw.jx({
            module: 'createedit',
            action: 'view',
            obj2: ''
        });
    } else {
        $jxSection.hide();
        $tagSection.show();
    }
}

function renderType(classID, classDetail) {
    newType = classID;

    // toggleType(classID);

    // var pid = catalog.getPID(classID);
    // (pid == 0) && (pid = classID);
    var cat = catalog.getCatNamePath(classID);
    detail.upDetail(cat.splice(2));

    var pid = oriPid = catalog.findIdByName(cat[0]);
    classID = oriId = catalog.findSubIdByName(pid, cat[1]);
    classID && (newType = classID);

    void 0;
    $type.html(cat.join('-'));

    var list = catalog.getCatLeaf(0);
    void 0;
    list = list.map(function(item) {
        return {
            value: item[0],
            text: item[1]
        };
    });
    var select = tmpl.select({
        list: list
    });

    var $select = $('#typeSelect1');
    var $select2 = $('#typeSelect2');

    $select.html(select);

    widget.transSelect($select.find('select'), function(id, text) {
        newType = id;
        $type.text(text);

        renderSubType(id, text);
    }, {
        'default': cat[0]
    });

    renderSubType(pid, cat[0], cat[1], 1);

    bindDropdown();

    function renderSubType(id, text, defaultV, init) {
        // debugger;
        if (init) hasSubClass = true;
        else if (id == 0) hasSubClass = true;
        else hasSubClass = false;

        if (id == 0) return;

        // if (init) toggleType(id, classDetail);
        // else toggleType(id);
        toggleType(id, classDetail);

        var done;

        var list = catalog.getCatLeaf(id);
        void 0;

        if (!list || !list.length) {
            hasSubClass = true;

            $select2.html('');
            $selectOuter.addClass('hide');
            // $('#type').removeClass('active');
            detail.changeDetailState(id, -2, init);
        } else {
            init || detail.reset();

            list = list.map(function(item) {
                return {
                    value: item[0],
                    text: item[1]
                };
            });
            var select = tmpl.select({
                list: list
            });

            $select2.html(select);
            widget.transSelect($select2.find('select'), function(subId, subText) {
                newType = subId;
                hasSubClass = true;

                if (done) return done(subId, subText);

                $selectOuter2.html('');

                void 0;
                if (subText == '其他') detail.changeOther();
                else detail.changeDetailState(id, subId);

                $type.html(text + '-' + subText);
                $selectOuter.addClass('hide');
                // $('#type').removeClass('active');

            }, {
                'default': defaultV || '-'
            });

            if (!init) return;

            detail.changeDetailState(id, classID, init);
        }

        return function(fn) {
            done = fn;
        }
    }
}

// 检查分类是否有修改
renderType.isModify = function(classID) {
    // return this.getType() !== classID;
    return newType != classID;
};
// 获取分类id
renderType.getType = function() {
    return catalog.getItemIdByPathStr(newType, detail.getType());
};
// 检查是否有选择子分类
renderType.hasSubClass = function() {
    return hasSubClass;
};
// 展开分类选择框
renderType.showType = function() {
    $selectOuter.removeClass('hide');
};
// 检查一级分类是否被修改，用于上报
renderType.isTypeModify = function() {
    var pid = catalog.getPID(newType);
    if (pid === 0) return oriPid === parseInt(newType);

    return oriPid === pid;
    void 0;
};
// 检查二级分类是否被修改，用户上报
renderType.isSubTypeModify = function() {
    var pid = catalog.getPID(newType);
    if (pid === 0) return Boolean(oriId);

    return oriId == newType;
};

renderType.isDetailModify = function(detail) {
    var oldDetail = unescape(detail).replace(/&nbsp;/g, ' ');
    var newDetail = this.getClassDetail();

    void 0;

    return oldDetail !== newDetail;
};

renderType.getClassDetail = function() {
    if (newType == 32) return jiaxiao.getClassDetail();

    return '';
};

module.exports = renderType;
},{"../../lib/util":19,"../../lib/widget":20,"./catalog":21,"./detail":23,"./jiaxiao":28,"./report":31,"./tmpl/select":34,"lodash.unescape":12}],36:[function(require,module,exports){
'use strict';

var $ = window.Zepto || window.$;

var $wrap = $('#wrap');
var $wording = $('#topWording');

var texts = ['本群是同城群，资料修改需要人工审核，请认真填写。', '群资料已提交同城群审核，通过后才会更新外部显示。'];

$wording.find('.icon-close').on('click', function() {
    $wording.remove();
    $wrap.removeClass('mt26');
});

module.exports = function(gtype) {
    var $text = $wording.find('.text');

    if(gtype === 2) {
        $wording.removeClass('hide');
        $wrap.addClass('mt26');
        $text.text(texts[0]);
    } else if(gtype === 4) {
        $wording.removeClass('hide');
        $wrap.addClass('mt26');
        $text.text(texts[1]);
    }
};
},{}],37:[function(require,module,exports){
'use strict';

// 正则表达式
var REGEXP_LT = /</g;
var REGEXP_GT = />/g;
var REGEXP_QUOTE = /"/g;
var REGEXP_ATTR_TAG = /<(\/)*([a-zA-Z0-9_:\.\-]+)([^>a-zA-Z0-9_:\.\-]+[^>]*)*(>|$)/ig;
var REGEXP_ATTR_NAME = /[^>a-zA-Z0-9_:\.\-]*([a-zA-Z0-9_:\.\-]+)=[\"\']?([^\"\'\s>]*)[\"\']?/ig;
var REGEXP_ATTR_VALUE = /&#([a-zA-Z0-9]*);?/img;
var REGEXP_ATTR_NO_NAME = /[^>a-zA-Z0-9_:\.\-]/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_1 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_2 = /^[\s"'`]*((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_3 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_4 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_5 = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n/ig;
var REGEXP_URL = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*", "gi");

//var IMG_EXP = /([^'"]+)[^>]*/ig
var REGEXP_NONE_URL = new RegExp("(?:[^\\\'\\\"]|^|\s+)((((news|telnet|nttp|file|http|ftp|https)://)|(www\\.))(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*)(?![^<]*</a>)", "gi");

var REGEXP_SPACE = /^\s|\s$/ig;

/*
 * 默认HTML标签白名单
 * 标签名=>属性列表
 */
var defaultWhiteList = {
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  hr: {},
  span: {},
  strong: {},
  b: {},
  i: {},
  br: {},
  p: {},
  pre: {},
  code: {},
  a: {
    'target': {
      'default': '_blank'
    },
    'href': true,
    'title': true
  },
  img: {
    'src': true,
    'alt': true,
    'title': true,
    'rel': true
  },
  div: {},
  table: {
    'border': true
  },
  tr: {
    'rowspan': true
  },
  td: {
    'colspan': true
  },
  th: {
    'colspan': true
  },
  tbody: {},
  thead: {},
  ul: {},
  li: {},
  ol: {},
  dl: {},
  dt: {},
  em: {},
  cite: {},
  section: {},
  header: {},
  footer: {},
  blockquote: {},
  audio: {
    'autoplay': true,
    'controls': true,
    'loop': true,
    'preload': true,
    'src': true
  },
  video: {
    'autoplay': true,
    'controls': true,
    'loop': true,
    'preload': true,
    'src': true
  }
};

var defaultWhiteAttrList = {
  'width': true,
  'height': true,
  'style': true
}

/**
 * 判断对象是否为空
 *
 * @param {String} obj 对象
 * @return {String}返回true or false
 */
var isNUll = function(obj) {
  if (!obj) return true;
  for (var i in obj) {
    return false;
  }
  return true;
}

/**
 * 过滤属性值
 *
 * @param {String} tag 标签名
 * @param {String} attr 属性名
 * @param {String} value 属性值
 * @return {String} 若不需要修改属性值，不返回任何值
 */
function defaultOnTagAttr(tag, attr, value) {
    if (REGEXP_ATTR_NO_NAME.test(attr)) {
      return '';
    }
    var _default = defaultWhiteList[tag][attr];
    var regexp = _default && _default['regexp'];
    var _dfvalue = _default && _default['default'];
    if (attr === 'href' || attr === 'src') {
      REGEXP_DEFAULT_ON_TAG_ATTR_1.lastIndex = 0;
      if (REGEXP_DEFAULT_ON_TAG_ATTR_1.test(value)) {
        return _dfvalue || '#';
      }
      REGEXP_DEFAULT_ON_TAG_ATTR_2.lastIndex = 0;
      if (REGEXP_DEFAULT_ON_TAG_ATTR_2.test(value)) {
        return _dfvalue || '#';
      }
      REGEXP_URL.lastIndex = 0;
      if (!REGEXP_URL.test(value)) { //合格URL
        return _dfvalue || '#';
      }
      if (regexp) {
        regexp.lastIndex = 0;
        if (!regexp.test(value)) { //合格URL
          return _dfvalue || '#';
        }
      }
      return value;
    } else if (_default || defaultWhiteAttrList[attr]) { //白名单属性
      REGEXP_DEFAULT_ON_TAG_ATTR_3.lastIndex = 0;
      if (REGEXP_DEFAULT_ON_TAG_ATTR_3.test(value)) {
        return _dfvalue || '';
      }
      REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0;
      if (REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value)) {
        return _dfvalue || '';
      }
      if (attr === 'style') {
        REGEXP_DEFAULT_ON_TAG_ATTR_5.lastIndex = 0;
        if (REGEXP_DEFAULT_ON_TAG_ATTR_5.test(value)) {
          return _dfvalue || '';
        }
      }
      return value;
    }
    return '';
  }
  /**
   * 过滤unicode字符（与REGEXP_ATTR_VALUE配合使用）
   *
   */
function replaceUnicode(str, code) {
  return String.fromCharCode(parseInt(code, 10));
}


/**
 * @param {String} html 需要过滤的字符串
 * @param {String} args 保留原始字符串，不进行强制转义，在发表的时候需
 *
 */
var filter = function(html, args) {
  var DataObj = {},
    DataIndex = 0,
    currReplace = {};

  REGEXP_ATTR_TAG.lastIndex = 0;
  html = html.replace(REGEXP_ATTR_TAG, function() {
    var _targName = arguments[2] || '';
    _targName = _targName.toLowerCase();
    var _defaultWhiteList = defaultWhiteList[_targName];
    if (!_targName || !_defaultWhiteList) return arguments[0] || ''; //没有标签名，过滤标签
    if (arguments[1]) { //结束标记
      if (currReplace[_targName] && currReplace[_targName].length) {
        currReplace[_targName].pop();
        if (!currReplace[_targName].length) delete currReplace[_targName];
        DataObj[DataIndex] = '</' + arguments[2] + '>';
        return '{%DataIndex_' + (DataIndex++) + '%}';
      } else {
        return '</' + arguments[2] + '>';
      }
    } else {
      var _classStr = (arguments[3] || '').replace(REGEXP_SPACE, ''); //获取属性值
      if ((_classStr === '/' || !_classStr) && !isNUll(_defaultWhiteList)) arguments[0] || ''; //需要有属性值
      if (_classStr) {
        REGEXP_ATTR_NAME.lastIndex = 0;
        //console.log(_classStr , REGEXP_ATTR_NAME.test(_classStr), '++++++++++++++++++');
        if (REGEXP_ATTR_NAME.test(_classStr)) {
          REGEXP_ATTR_NAME.lastIndex = 0;
          var _lastClassStr = [];
          _classStr.replace(REGEXP_ATTR_NAME, function() { //依次判断属性类型
            var _attrName = arguments[1].toLowerCase();
            var _attrValue = arguments[2];
            var value = defaultOnTagAttr(_targName, _attrName, _attrValue);
            _lastClassStr.push(value ? ' ' + _attrName + '="' + value + '"' : '');
          });
          _classStr = _lastClassStr.join('');
        } else {
          _classStr = '';
        }
        //console.log(_classStr , '=============');
      }
      if ((_classStr === '/' || !_classStr) && !isNUll(_defaultWhiteList)) return arguments[0] || ''; //需要有属性值
      if (!currReplace[_targName]) currReplace[_targName] = [];
      currReplace[_targName].push(_targName);
      DataObj[DataIndex] = '<' + _targName + (_classStr ? (' ' + _classStr) : '') + '>';
      return '{%DataIndex_' + (DataIndex++) + '%}';
    }
  });
  if (!args) {
    html = html.replace(REGEXP_LT, '&lt;')
      .replace(REGEXP_GT, '&gt;');
  }
  html = html.replace(/\{\%DataIndex_(\d+)\%\}/ig, function() {
      return DataObj[arguments[1]] || '';
    })
    .replace(REGEXP_NONE_URL, function($1, $2, match, text) {
      var start = '';
      $1 += '';

      if ($1.length == $2.length + 1) {
        start = $1[0];
        $1 = $2;
      }
      var href = '';
      if ($1.indexOf('://') == -1) {
        href = 'http://' + $1;
      } else {
        href = $1;
      }
      return start + '<a href="' + href + '" target="_blank">' + $1 + '</a>';
    });
  var _tags = [];
  for (var i in currReplace) {
    if (i === 'img' || i === 'br' || i === 'p' || i === 'hr') continue;
    var _len;
    if (_len = currReplace[i].length) {
      for (var j = 0; j < _len; j++) {
        _tags.push('</' + i + '>');
      }
    }
  }
  if (_tags.length) {
    html += _tags.join('');
  }
  return html;
};

exports.filter = filter;
},{}]},{},[14]);
