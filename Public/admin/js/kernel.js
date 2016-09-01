// jQuery.noConflict();
jQuery.extend({
	getCookie: function(sName) {
		var aCookie = document.cookie.split("; ");
		for (var i = 0; i < aCookie.length; i++) {
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
		}
		return '';
	},
	setCookie: function(sName, sValue, sExpires) {
		var sCookie = sName + "=" + encodeURIComponent(sValue);
		if (sExpires != null) sCookie += "; expires=" + sExpires;
		document.cookie = sCookie;
	},
	removeCookie: function(sName) {
		document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
	}
});

function drop_confirm(msg, url) {
	if (confirm(msg)) {
		window.location = url;
	}
}

/* 显示Ajax表单 */

function ajax_form(id, title, url, width) {
	if (!width) {
		width = 400;
	}
	// 引入对话框对象
	var d = DialogManager.create(id);
	d.setTitle(title);
	d.setContents('ajax', url);
	d.setWidth(width);
	d.show('center');

	return d;
}

function go(url) {
	window.location = url;
}

function change_captcha(jqObj) {
	jqObj.attr('src', SITE_URL + '/index.php?app=captcha&' + Math.round(Math.random() * 10000));
}

/* 格式化金额 */

function price_format(price) {
	if (typeof(PRICE_FORMAT) == 'undefined') {
		PRICE_FORMAT = '&yen;%s';
	}
	price = number_format(price, {
		pattern: '###,###.00'
	});

	return PRICE_FORMAT.replace('%s', price);
}

function _format(pattern, num, z) {
	var j = pattern.length >= num.length ? pattern.length : num.length;
	var p = pattern.split("");
	var n = num.split("");
	var bool = true,
		nn = "";
	for (var i = 0; i < j; i++) {
		var x = n[n.length - j + i];
		var y = p[p.length - j + i];
		if (z == 0) {
			if (bool) {
				if ((x && y && (x != "0" || y == "0")) || (x && x != "0" && !y) || (y && y == "0" && !x)) {
					nn += x ? x : "0";
					bool = false;
				}
			} else {
				nn += x ? x : "0";
			}
		} else {
			if (y && (y == "0" || (y == "#" && x))) nn += x ? x : "0";
		}
	}
	return nn;
}

function _number_format(numChar, pattern) {
	var patterns = pattern.split(".");
	var numChars = numChar.split(".");
	var z = patterns[0].indexOf(",") == -1 ? -1 : patterns[0].length - patterns[0].indexOf(",");
	var num1 = _format(patterns[0].replace(","), numChars[0], 0);
	var num2 = _format(patterns[1] ? patterns[1].split('').reverse().join('') : "", numChars[1] ? numChars[1].split('').reverse().join('') : "", 1);
	num1 = num1.split("").reverse().join('');
	var reCat = eval("/[0-9]{" + (z - 1) + "," + (z - 1) + "}/gi");
	var arrdata = z > -1 ? num1.match(reCat) : undefined;
	if (arrdata && arrdata.length > 0) {
		var w = num1.replace(arrdata.join(''), '');
		num1 = arrdata.join(',') + (w == "" ? "" : ",") + w;
	}
	num1 = num1.split("").reverse().join("");
	return (num1 == "" ? "0" : num1) + (num2 != "" ? "." + num2.split("").reverse().join('') : "");
}

function number_format(num, opt) {
	var reCat = /[0#,.]{1,}/gi;
	var zeroExc = opt.zeroExc == undefined ? true : opt.zeroExc;
	var pattern = opt.pattern.match(reCat)[0];
	var numChar = num.toString();
	return !(zeroExc && numChar == 0) ? opt.pattern.replace(pattern, _number_format(numChar, pattern)) : opt.pattern.replace(pattern, "0");
}

function number_format_price(num, ext) {
	if (ext < 0) {
		return num;
	}
	num = Number(num);
	if (isNaN(num)) {
		num = 0;
	}
	var _str = num.toString();
	var _arr = _str.split('.');
	var _int = _arr[0];
	var _flt = _arr[1];
	if (_str.indexOf('.') == -1) { /* 找不到小数点，则添加 */
		if (ext == 0) {
			return _str;
		}
		var _tmp = '';
		for (var i = 0; i < ext; i++) {
			_tmp += '0';
		}
		_str = _str + '.' + _tmp;
	} else {
		if (_flt.length == ext) {
			return _str;
		} /* 找得到小数点，则截取 */
		if (_flt.length > ext) {
			_str = _str.substr(0, _str.length - (_flt.length - ext));
			if (ext == 0) {
				_str = _int;
			}
		} else {
			for (var i = 0; i < ext - _flt.length; i++) {
				_str += '0';
			}
		}
	}

	return _str;
}

/* 收藏商品 */

function collect_goods(id) {
	var url = SITE_URL + '/index.php?app=my_favorite&act=add&type=goods&ajax=1';
	jQuery.getJSON(url, {
		'item_id': id
	}, function(data) {
		alert(data.msg);
	});
}

/* 收藏供应商 */

function collect_store(id) {
	var url = SITE_URL + '/index.php?app=my_favorite&act=add&type=store&jsoncallback=?&ajax=1';
	jQuery.getJSON(url, {
		'item_id': id
	}, function(data) {
		alert(data.msg);
	});
} /* 火狐下取本地全路径 */

function getFullPath(obj) {
	if (obj) {
		//ie
		if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
			obj.select();
			return document.selection.createRange().text;
		}
		//firefox
		else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
			if (obj.files) {
				//2012-03-12 tina 修正getAsDataURL火狐高版本不能用的问题 
				var objectURL = window.URL.createObjectURL(obj.files[0]);
				return objectURL;


			}
			return obj.value;
		}
		return obj.value;
	}
}

/**
 *    启动邮件队列
 *
 *    @author    Garbin
 *    @param     string req_url
 *    @return    void
 */

function sendmail(req_url) {
	jQuery(function() {
		var _script = document.createElement('script');
		_script.type = 'text/javascript';
		_script.src = req_url;
		document.getElementsByTagName('head')[0].appendChild(_script);
	});
} /* 转化JS跳转中的 ＆ */

function transform_char(str) {
	if (str.indexOf('&')) {
		str = str.replace(/&/g, "%26");
	}
	return str;
}

function ajax_refresh(){
	location.href=location.href;
}