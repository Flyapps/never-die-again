var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.BaseAssets = $hxClasses["co.doubleduck.BaseAssets"] = function() {
};
co.doubleduck.BaseAssets.__name__ = ["co","doubleduck","BaseAssets"];
co.doubleduck.BaseAssets.loader = function() {
	if(co.doubleduck.BaseAssets._loader == null) {
		co.doubleduck.BaseAssets._loader = new createjs.PreloadJS();
		co.doubleduck.BaseAssets._loader.initialize(true);
		co.doubleduck.BaseAssets._loader.onFileLoad = co.doubleduck.BaseAssets.handleFileLoaded;
		co.doubleduck.BaseAssets._loader.onFileError = co.doubleduck.BaseAssets.handleLoadError;
		co.doubleduck.BaseAssets._loader.setMaxConnections(10);
	}
	return co.doubleduck.BaseAssets._loader;
}
co.doubleduck.BaseAssets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.BaseAssets.loader().loadFile(uri);
	co.doubleduck.BaseAssets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.BaseAssets.addSounds = function(sounds) {
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var mySound = _g1++;
			co.doubleduck.SoundManager.initSound(sounds[mySound]);
		}
	}
}
co.doubleduck.BaseAssets.finishLoading = function(manifest,sounds) {
	co.doubleduck.BaseAssets.addSounds(sounds);
	if(co.doubleduck.BaseAssets._useLocalStorage) co.doubleduck.BaseAssets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.BaseAssets.onLoadAll != null) co.doubleduck.BaseAssets.onLoadAll();
	}
	co.doubleduck.BaseAssets.loader().onProgress = co.doubleduck.BaseAssets.handleProgress;
	co.doubleduck.BaseAssets.loader().onFileLoad = co.doubleduck.BaseAssets.manifestFileLoad;
	co.doubleduck.BaseAssets.loader().loadManifest(manifest);
	co.doubleduck.BaseAssets.loader().load();
}
co.doubleduck.BaseAssets.loadAll = function(manifest,sounds) {
	manifest[manifest.length] = "images/duckling/orientation_error_port.png";
	manifest[manifest.length] = "images/duckling/orientation_error_land.png";
	manifest[manifest.length] = "images/duckling/page_marker.png";
}
co.doubleduck.BaseAssets.audioLoaded = function(event) {
	co.doubleduck.BaseAssets._cacheData[event.src] = event;
}
co.doubleduck.BaseAssets.manifestFileLoad = function(event) {
	if(co.doubleduck.BaseAssets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.BasePersistence.setValue(event.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.BaseAssets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.BasePersistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.BaseAssets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.BaseAssets.handleProgress = function(event) {
	co.doubleduck.BaseAssets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.BaseAssets.loader().onProgress = null;
		co.doubleduck.BaseAssets.onLoadAll();
	}
}
co.doubleduck.BaseAssets.handleLoadError = function(event) {
}
co.doubleduck.BaseAssets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.BaseAssets._cacheData[event.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.BaseAssets._loadCallbacks,event.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.BaseAssets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.BaseAssets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.BaseAssets.loader().getResult(uri) != null) {
			cache = co.doubleduck.BaseAssets.loader().getResult(uri).result;
			co.doubleduck.BaseAssets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.BaseAssets.getRawImage = function(uri) {
	var cache = co.doubleduck.BaseAssets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.BaseAssets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		haxe.Log.trace("Requsted image that wasn't preloaded, consider preloading - \"" + uri + "\"",{ fileName : "BaseAssets.hx", lineNumber : 180, className : "co.doubleduck.BaseAssets", methodName : "getRawImage"});
	}
	return cache;
}
co.doubleduck.BaseAssets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.BaseAssets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.BaseAssets.prototype = {
	__class__: co.doubleduck.BaseAssets
}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
	co.doubleduck.BaseAssets.call(this);
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loadAll = function() {
	var sounds = new Array();
	var manifest = new Array();
	co.doubleduck.BaseAssets.loadAll(manifest,sounds);
	sounds.push("sound/general/button_click");
	sounds.push("sound/general/intro");
	sounds.push("sound/general/Lose");
	sounds.push("sound/general/Win");
	sounds.push("sound/player/reload");
	sounds.push("sound/player/powerup_adrenaline");
	sounds.push("sound/player/powerup_frag");
	sounds.push("sound/player/powerup_stun");
	sounds.push("sound/weapons/ak47");
	sounds.push("sound/weapons/magnum");
	sounds.push("sound/weapons/pistol");
	sounds.push("sound/weapons/shotgun");
	sounds.push("sound/weapons/sniper");
	sounds.push("sound/weapons/tavor");
	manifest.push("images/help/help_screen_sd.png");
	manifest.push("images/help/got_it_button_sd.png");
	manifest.push("images/splash/splash_bg.jpg");
	manifest.push("images/splash/logo.png");
	manifest.push("images/splash/agent.png");
	manifest.push("images/splash/tap_to_play.png");
	manifest.push("images/menu/bg.png");
	manifest.push("images/menu/button_help.png");
	manifest.push("images/menu/sound.png");
	manifest.push("images/menu/level_block.png");
	manifest.push("images/menu/lock.png");
	manifest.push("images/menu/bronze.png");
	manifest.push("images/menu/silver.png");
	manifest.push("images/menu/gold.png");
	manifest.push("images/menu/point.png");
	manifest.push("images/menu/point_off.png");
	manifest.push("images/menu/window.png");
	manifest.push("images/menu/close_window_button.png");
	manifest.push("images/session/fire.png");
	manifest.push("images/session/UI/hud/bar.png");
	manifest.push("images/session/UI/hud/bar_blue.png");
	manifest.push("images/session/UI/hud/button_adrenalin.png");
	manifest.push("images/session/UI/hud/button_frag_granade.png");
	manifest.push("images/session/UI/hud/button_hide.png");
	manifest.push("images/session/UI/hud/button_pause.png");
	manifest.push("images/session/UI/hud/button_stun_granade.png");
	manifest.push("images/session/UI/hud/skull.png");
	manifest.push("images/session/UI/hud/small_block.png");
	manifest.push("images/session/UI/hud/kills.png");
	manifest.push("images/session/UI/gun_icons/sniper.png");
	manifest.push("images/session/UI/gun_icons/tavor.png");
	manifest.push("images/session/UI/gun_icons/ak47.png");
	manifest.push("images/session/UI/gun_icons/magnum.png");
	manifest.push("images/session/UI/gun_icons/pistol.png");
	manifest.push("images/session/UI/gun_icons/shotgun.png");
	manifest.push("images/session/UI/hud/boss_HP.png");
	manifest.push("images/session/UI/hud/boos_hp_red.png");
	manifest.push("images/session/UI/pause_window.png");
	manifest.push("images/session/UI/end_level/bronze_medal.png");
	manifest.push("images/session/UI/end_level/silver_medal.png");
	manifest.push("images/session/UI/end_level/gold_medal.png");
	manifest.push("images/session/UI/power_up_icons/frag_icon.png");
	manifest.push("images/session/UI/power_up_icons/stun_icon.png");
	manifest.push("images/session/UI/power_up_icons/adrenaline_icon.png");
	manifest.push("images/session/UI/font_white/0.png");
	manifest.push("images/session/UI/font_white/1.png");
	manifest.push("images/session/UI/font_white/2.png");
	manifest.push("images/session/UI/font_white/3.png");
	manifest.push("images/session/UI/font_white/4.png");
	manifest.push("images/session/UI/font_white/5.png");
	manifest.push("images/session/UI/font_white/6.png");
	manifest.push("images/session/UI/font_white/7.png");
	manifest.push("images/session/UI/font_white/8.png");
	manifest.push("images/session/UI/font_white/9.png");
	manifest.push("images/menu/font/0.png");
	manifest.push("images/menu/font/1.png");
	manifest.push("images/menu/font/2.png");
	manifest.push("images/menu/font/3.png");
	manifest.push("images/menu/font/4.png");
	manifest.push("images/menu/font/5.png");
	manifest.push("images/menu/font/6.png");
	manifest.push("images/menu/font/7.png");
	manifest.push("images/menu/font/8.png");
	manifest.push("images/menu/font/9.png");
	manifest.push("images/session/1st_world_plant/plant_bg.jpg");
	manifest.push("images/session/1st_world_plant/layout1/layer_a_layout1.png");
	manifest.push("images/session/1st_world_plant/layout1/layer_b_layout1.png");
	manifest.push("images/session/1st_world_plant/layout1/layer_c_layout1.png");
	manifest.push("images/session/1st_world_plant/layout2/layer_a_layout2.png");
	manifest.push("images/session/1st_world_plant/layout2/layer_b_layout2.png");
	manifest.push("images/session/1st_world_plant/layout2/layer_c_layout2.png");
	manifest.push("images/session/1st_world_plant/layout3/layer_a_layout3.png");
	manifest.push("images/session/1st_world_plant/layout3/layer_b_layout3.png");
	manifest.push("images/session/1st_world_plant/layout3/layer_c_layout3.png");
	manifest.push("images/session/1st_world_plant/layout4/layer_a_layout4.png");
	manifest.push("images/session/1st_world_plant/layout4/layer_b_layout4.png");
	manifest.push("images/session/1st_world_plant/layout4/layer_c_layout4.png");
	manifest.push("images/session/1st_world_plant/cover.png");
	manifest.push("images/session/2nd_world_roof/cover.png");
	manifest.push("images/session/2nd_world_roof/roof_bg.jpg");
	manifest.push("images/session/2nd_world_roof/layout1/layer_a_layout1.png");
	manifest.push("images/session/2nd_world_roof/layout1/layer_b_layout1.png");
	manifest.push("images/session/2nd_world_roof/layout1/layer_c_layout1.png");
	manifest.push("images/session/2nd_world_roof/layout2/layer_a_layout2.png");
	manifest.push("images/session/2nd_world_roof/layout2/layer_b_layout2.png");
	manifest.push("images/session/2nd_world_roof/layout2/layer_c_layout2.png");
	manifest.push("images/session/2nd_world_roof/layout3/layer_a_layout3.png");
	manifest.push("images/session/2nd_world_roof/layout3/layer_b_layout3.png");
	manifest.push("images/session/2nd_world_roof/layout3/layer_c_layout3.png");
	manifest.push("images/session/2nd_world_roof/layout4/layer_a_layout4.png");
	manifest.push("images/session/2nd_world_roof/layout4/layer_b_layout4.png");
	manifest.push("images/session/2nd_world_roof/layout4/layer_c_layout4.png");
	manifest.push("images/session/3rd_world_jungle/cover.png");
	manifest.push("images/session/3rd_world_jungle/jungle_bg.jpg");
	manifest.push("images/session/3rd_world_jungle/layout1/layer_a_layout1.png");
	manifest.push("images/session/3rd_world_jungle/layout1/layer_b_layout1.png");
	manifest.push("images/session/3rd_world_jungle/layout1/layer_c_layout1.png");
	manifest.push("images/session/3rd_world_jungle/layout2/layer_a_layout2.png");
	manifest.push("images/session/3rd_world_jungle/layout2/layer_b_layout2.png");
	manifest.push("images/session/3rd_world_jungle/layout2/layer_c_layout2.png");
	manifest.push("images/session/3rd_world_jungle/layout3/layer_a_layout3.png");
	manifest.push("images/session/3rd_world_jungle/layout3/layer_b_layout3.png");
	manifest.push("images/session/3rd_world_jungle/layout3/layer_c_layout3.png");
	manifest.push("images/session/3rd_world_jungle/layout4/layer_a_layout4.png");
	manifest.push("images/session/3rd_world_jungle/layout4/layer_b_layout4.png");
	manifest.push("images/session/3rd_world_jungle/layout4/layer_c_layout4.png");
	manifest.push("images/session/4th_world_palace/cover.png");
	manifest.push("images/session/4th_world_palace/palace_bg.jpg");
	manifest.push("images/session/4th_world_palace/layout1/layer_a_layout1.png");
	manifest.push("images/session/4th_world_palace/layout1/layer_b_layout1.png");
	manifest.push("images/session/4th_world_palace/layout1/layer_c_layout1.png");
	manifest.push("images/session/4th_world_palace/layout2/layer_a_layout2.png");
	manifest.push("images/session/4th_world_palace/layout2/layer_b_layout2.png");
	manifest.push("images/session/4th_world_palace/layout2/layer_c_layout2.png");
	manifest.push("images/session/4th_world_palace/layout3/layer_a_layout3.png");
	manifest.push("images/session/4th_world_palace/layout3/layer_b_layout3.png");
	manifest.push("images/session/4th_world_palace/layout3/layer_c_layout3.png");
	manifest.push("images/session/4th_world_palace/layout4/layer_a_layout4.png");
	manifest.push("images/session/4th_world_palace/layout4/layer_b_layout4.png");
	manifest.push("images/session/4th_world_palace/layout4/layer_c_layout4.png");
	manifest.push("images/enemies/enemies.png");
	manifest.push("images/enemies/bosses.png");
	manifest.push("images/session/blood_sd.png");
	manifest.push("images/session/hit_gradient2_sd.png");
	manifest.push("images/session/hit_gradient_sd.png");
	manifest.push("images/session/reload_sd.png");
	manifest.push("images/session/UI/end_level/lose_pop_up.png");
	manifest.push("images/session/UI/end_level/win_pop_up.png");
	manifest.push("images/session/UI/end_level/upgrade_stamp.png");
	manifest.push("images/session/UI/end_level/menu_button_sd.png");
	manifest.push("images/session/UI/end_level/next_button_sd.png");
	manifest.push("images/session/UI/end_level/restart_button_sd.png");
	manifest.push("images/session/UI/end_game/game_end_pop_up.png");
	manifest.push("images/session/UI/end_game/back_to_menu_button.png");
	manifest.push("images/session/power_ups/adrenalin2_sd.png");
	manifest.push("images/session/power_ups/adrenalin_sd.png");
	manifest.push("images/session/power_ups/fire_sd.jpg");
	co.doubleduck.BaseAssets.finishLoading(manifest,sounds);
}
co.doubleduck.Assets.__super__ = co.doubleduck.BaseAssets;
co.doubleduck.Assets.prototype = $extend(co.doubleduck.BaseAssets.prototype,{
	__class__: co.doubleduck.Assets
});
co.doubleduck.Bar = $hxClasses["co.doubleduck.Bar"] = function(container,player) {
	if(player == null) player = true;
	this._scale = 1.0;
	if(player) {
		var uiPadding = co.doubleduck.BaseAssets.getImage("images/session/UI/hud/button_hide.png").image.width * co.doubleduck.BaseGame.getScale() / 10;
		this._barBackground = co.doubleduck.BaseAssets.getImage("images/session/UI/hud/bar.png");
		this._barBackground.x = -co.doubleduck.BaseGame.getViewport().width / 2 + uiPadding * 1.5;
		this._barBackground.y = -co.doubleduck.BaseGame.getViewport().height / 2 + uiPadding * 1.5;
		this._barFill = co.doubleduck.BaseAssets.getImage("images/session/UI/hud/bar_blue.png");
		this._scale = co.doubleduck.BaseGame.getScale();
	} else {
		var boss = (js.Boot.__cast(container.getChildAt(0) , co.doubleduck.EnemyBitmapAnimation)).enemy;
		this._barBackground = co.doubleduck.BaseAssets.getImage("images/session/UI/hud/boss_HP.png");
		this._barBackground.x = -this._barBackground.image.width / 2;
		this._barBackground.y = -boss.spriteHeight / 2 - this._barBackground.image.height;
		this._barFill = co.doubleduck.BaseAssets.getImage("images/session/UI/hud/boos_hp_red.png");
	}
	container.addChild(this._barBackground);
	container.addChild(this._barFill);
	this._barBackground.scaleX = this._barBackground.scaleY = this._scale;
	this._barFill.x = this._barBackground.x + this._scale * (this._barBackground.image.width - this._barFill.image.width) / 2;
	this._barFill.y = this._barBackground.y + this._scale * (this._barBackground.image.height - this._barFill.image.height) / 2;
	this._barFill.scaleX = this._barFill.scaleY = this._scale;
	this._barMask = new createjs.Shape();
	this._barMask.graphics.beginFill("#000000");
	this._barMask.graphics.drawRect(this._barFill.x,this._barFill.y,this._barFill.image.width * this._scale,this._barFill.image.height * this._scale);
	this._barMask.graphics.endFill();
	this._barMask.regX = this._barFill.image.width * this._scale;
	this._barFill.mask = this._barMask;
};
co.doubleduck.Bar.__name__ = ["co","doubleduck","Bar"];
co.doubleduck.Bar.prototype = {
	set: function(fill) {
		this._barMask.x = this._barFill.image.width * this._scale * fill;
	}
	,getY: function() {
		return this._barBackground.y;
	}
	,getX: function() {
		return this._barBackground.x;
	}
	,getHeight: function() {
		return this._barBackground.image.height;
	}
	,getWidth: function() {
		return this._barBackground.image.width;
	}
	,setVisible: function(v) {
		this._barBackground.visible = v;
		this._barFill.visible = v;
		return v;
	}
	,getVisible: function() {
		return this._barBackground.visible;
	}
	,visible: null
	,_scale: null
	,_barMask: null
	,_barFill: null
	,_barBackground: null
	,__class__: co.doubleduck.Bar
	,__properties__: {set_visible:"setVisible",get_visible:"getVisible"}
}
co.doubleduck.BaseGame = $hxClasses["co.doubleduck.BaseGame"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this._prevWinSize = new createjs.Rectangle(0,0,1,1);
	if(this._wantLandscape) {
		co.doubleduck.BaseGame.MAX_HEIGHT = 427;
		co.doubleduck.BaseGame.MAX_WIDTH = 915;
	} else {
		co.doubleduck.BaseGame.MAX_HEIGHT = 760;
		co.doubleduck.BaseGame.MAX_WIDTH = 427;
	}
	if(co.doubleduck.BaseGame.DEBUG) co.doubleduck.BasePersistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		js.Lib.alert("This phone's version is not supported. please update your phone's software.");
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.BaseGame._stage = stage;
	co.doubleduck.BaseGame._stage.onTick = $bind(this,this.handleStageTick);
	co.doubleduck.BaseGame._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.BaseGame.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._wantLandscape) co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_LAND_URI,$bind(this,this.waitForOrientation)); else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_PORT_URI,$bind(this,this.waitForOrientation));
		} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
	} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
};
co.doubleduck.BaseGame.__name__ = ["co","doubleduck","BaseGame"];
co.doubleduck.BaseGame._stage = null;
co.doubleduck.BaseGame.MAX_HEIGHT = null;
co.doubleduck.BaseGame.MAX_WIDTH = null;
co.doubleduck.BaseGame.hammer = null;
co.doubleduck.BaseGame.getViewport = function() {
	return co.doubleduck.BaseGame._viewport;
}
co.doubleduck.BaseGame.getScale = function() {
	return co.doubleduck.BaseGame._scale;
}
co.doubleduck.BaseGame.getStage = function() {
	return co.doubleduck.BaseGame._stage;
}
co.doubleduck.BaseGame.prototype = {
	setScale: function() {
		var fixedVal = co.doubleduck.BaseGame._viewport.width;
		var varVal = co.doubleduck.BaseGame._viewport.height;
		var idealFixed = co.doubleduck.BaseGame.MAX_WIDTH;
		var idealVar = co.doubleduck.BaseGame.MAX_HEIGHT;
		if(this._wantLandscape) {
			fixedVal = co.doubleduck.BaseGame._viewport.height;
			varVal = co.doubleduck.BaseGame._viewport.width;
			idealFixed = co.doubleduck.BaseGame.MAX_HEIGHT;
			idealVar = co.doubleduck.BaseGame.MAX_WIDTH;
		}
		var regScale = varVal / idealVar;
		if(fixedVal >= varVal) co.doubleduck.BaseGame._scale = regScale; else if(idealFixed * regScale < fixedVal) co.doubleduck.BaseGame._scale = fixedVal / idealFixed; else co.doubleduck.BaseGame._scale = regScale;
	}
	,handleViewportChanged: function() {
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._orientError == null) {
				var err = co.doubleduck.BaseGame.ORIENT_PORT_URI;
				if(this._wantLandscape) err = co.doubleduck.BaseGame.ORIENT_LAND_URI;
				this._orientError = co.doubleduck.BaseAssets.getImage(err);
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.BaseGame._viewport.height / 2;
				this._orientError.y = co.doubleduck.BaseGame._viewport.width / 2;
				co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
				co.doubleduck.BaseGame._stage.update();
			}
		} else if(this._orientError != null) {
			co.doubleduck.BaseGame._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.BaseGame._stage.canvas.width = screenW;
		co.doubleduck.BaseGame._stage.canvas.height = screenH;
		var shouldResize = this._wantLandscape == viewporter.isLandscape() || !viewporter.ACTIVE;
		if(shouldResize) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			var wrongSize = screenH < screenW;
			if(this._wantLandscape) wrongSize = screenH > screenW;
			if(!viewporter.ACTIVE || !wrongSize) {
				co.doubleduck.BaseGame._viewport.width = screenW;
				co.doubleduck.BaseGame._viewport.height = screenH;
				this.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,handleSessionEnd: function() {
	}
	,handlePlayClick: function(properties) {
		co.doubleduck.BaseGame._stage.removeChild(this._menu);
		this.startSession(properties);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(properties) {
		this._session = new co.doubleduck.Session(properties);
		this._session.onBackToMenu = $bind(this,this.handleBackToMenu);
		this._session.onRestart = $bind(this,this.handleRestart);
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.BaseGame._stage.addChild(this._session);
	}
	,showMenu: function() {
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,alphaFade: function(fadeElement) {
		if(fadeElement != null && js.Boot.__instanceof(fadeElement,createjs.Bitmap)) this._fadedText = fadeElement; else if(this._fadedText == null) return;
		if(this._fadedText.alpha == 0) createjs.Tween.get(this._fadedText).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._fadedText.alpha == 1) createjs.Tween.get(this._fadedText).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showGameSplash: function() {
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.BaseGame._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this.showGameSplash();
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.BaseGame._stage.removeChild(this._loadingBar);
		co.doubleduck.BaseGame._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.BaseAssets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.BaseAssets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute();
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else {
			haxe.Log.trace(">>> viewporter is NOT active",{ fileName : "BaseGame.hx", lineNumber : 158, className : "co.doubleduck.BaseGame", methodName : "showSplash"});
			js.Lib.document.body.bgColor = "#D94D00";
		}
		this._splash = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOGO_URI);
		this._splash.regX = this._splash.image.width / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		if(this._wantLandscape) this._splash.y = 20; else this._splash.y = 90;
		co.doubleduck.BaseGame._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_STROKE_URI);
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_FILL_URI);
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 192;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.BaseGame._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.BaseGame._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.BaseAssets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForOrientation: function() {
		this._waitingToStart = true;
		if(this._orientError == null) {
			this._orientError = this.getErrorImage();
			this._orientError.regX = this._orientError.image.width / 2;
			this._orientError.regY = this._orientError.image.height / 2;
			this._orientError.x = js.Lib.window.innerWidth / 2;
			this._orientError.y = js.Lib.window.innerHeight / 2;
			co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
		}
	}
	,getErrorImage: function() {
		if(this._wantLandscape) return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_LAND_URI); else return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_PORT_URI);
	}
	,loadBarStroke: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_STROKE_URI,$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_FILL_URI,$bind(this,this.loadBarStroke));
	}
	,handleStageTick: function() {
		if(js.Lib.window.innerWidth != this._prevWinSize.width || js.Lib.window.innerHeight != this._prevWinSize.height) {
			this._prevWinSize.width = js.Lib.window.innerWidth;
			this._prevWinSize.height = js.Lib.window.innerHeight;
			this.handleResize(null);
		}
	}
	,_prevWinSize: null
	,_fadedText: null
	,_loadingStroke: null
	,_loadingBar: null
	,_waitingToStart: null
	,_orientError: null
	,_wantLandscape: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.BaseGame
}
co.doubleduck.BaseMenu = $hxClasses["co.doubleduck.BaseMenu"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseMenu.__name__ = ["co","doubleduck","BaseMenu"];
co.doubleduck.BaseMenu.__super__ = createjs.Container;
co.doubleduck.BaseMenu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.onPlayClick = null;
	}
	,onPlayClick: null
	,__class__: co.doubleduck.BaseMenu
});
co.doubleduck.BasePersistence = $hxClasses["co.doubleduck.BasePersistence"] = function() { }
co.doubleduck.BasePersistence.__name__ = ["co","doubleduck","BasePersistence"];
co.doubleduck.BasePersistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.BasePersistence.getValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return "0";
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.clearAll = function() {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage.clear();
}
co.doubleduck.BasePersistence.initVar = function(initedVar,defaultVal) {
	if(defaultVal == null) defaultVal = "0";
	var value = co.doubleduck.BasePersistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BaseSession = $hxClasses["co.doubleduck.BaseSession"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseSession.__name__ = ["co","doubleduck","BaseSession"];
co.doubleduck.BaseSession.__super__ = createjs.Container;
co.doubleduck.BaseSession.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		this.onNextLevel = null;
	}
	,sessionEnded: function() {
		if(this.onSessionEnd != null) {
			createjs.Ticker.setPaused(false);
			this.onSessionEnd();
		}
	}
	,handleReplayClick: function() {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart();
		}
	}
	,handleMenuClick: function() {
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,_replayBtn: null
	,_menuBtn: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.BaseSession
});
co.doubleduck.Enemy = $hxClasses["co.doubleduck.Enemy"] = function(session,id,startX,startY,endX,endY,scale,rotation,location) {
	var enemyData = co.doubleduck.DataLoader.getEnemy(id);
	this.graphicsId = Std.parseInt(enemyData.graphicsId);
	this._session = session;
	if(this.isBoss) this._baseIndex = (this.graphicsId - co.doubleduck.Enemy.ENEMY_NUM / 3 | 0) * 3; else this._baseIndex = this.graphicsId * 3;
	this.initSpriteSheet();
	this.sprite.visible = false;
	this.setLocation(startX,startY,endX,endY,scale,rotation,location);
	this.waitToShoot = Std.parseInt(enemyData.waitToShoot);
	this.duration = Std.parseInt(enemyData.duration);
	this.maxHp = this.hp = Std.parseInt(enemyData.hp);
	this.damage = Std.parseInt(enemyData.damage);
	this.shots = Std.parseInt(enemyData.shots);
	this.chanceToHit = Std.parseFloat(enemyData.chanceToHit);
	if(startX < 0 || endX < 0) {
		if(this.isBoss) (js.Boot.__cast(this.sprite , createjs.Container)).getChildAt(0).scaleX *= -1; else this.sprite.scaleX = -1 * this.sprite.scaleX;
	}
};
co.doubleduck.Enemy.__name__ = ["co","doubleduck","Enemy"];
co.doubleduck.Enemy.prototype = {
	resume: function(duration) {
		createjs.Tween.get(this.sprite).play(this._movementTween);
	}
	,pause: function(duration) {
		createjs.Tween.get(this.sprite).pause(this._movementTween);
	}
	,finished: function() {
		this._movementTween = null;
		this.sprite.visible = false;
		this.sprite.x = this._startX;
		this.sprite.y = this._startY;
		this.isMoving = false;
		createjs.Tween.removeTweens(this.sprite);
		if(this.isDead) this._session.kill(this);
		if(!this._session.isHiding && !this.isDead) this._session.popOutExistingActiveEnemy(this);
	}
	,disable: function() {
		createjs.Tween.removeTweens(this.sprite);
		this._movementTween = null;
		this.sprite.visible = false;
		this._session.kill(this,false);
	}
	,kill: function() {
		this.hp = 0;
		createjs.Tween.removeTweens(this._movementTween);
		this.setDead();
		this._session.kills++;
		this._session.setKills(this._session.kills);
		createjs.Tween.get(this.sprite).to({ alpha : 0},500).call($bind(this,this.finished));
	}
	,popIn: function() {
		this.setNormal();
		var tx = this._startX;
		var ty = this._startY;
		this._movementTween = createjs.Tween.get(this.sprite).to({ x : tx, y : ty},400,createjs.Ease.sineInOut).call($bind(this,this.finished));
	}
	,shoot: function() {
		if(this.isDead) return;
		if(!this._session.isActive) {
			this.disable();
			return;
		}
		var preShotWait = 10;
		if(this._shotsFired == 0) preShotWait = this.waitToShoot;
		this._movementTween = createjs.Tween.get(this.sprite);
		if(this._shotsFired < this.shots) this._movementTween.wait(preShotWait).call($bind(this,this.setShooting)).wait(160).call($bind(this,this.setNormal)).wait(Math.round(this.duration / this.shots)).call($bind(this,this.shoot)); else this._movementTween.wait(preShotWait).call($bind(this,this.setShooting)).wait(160).call($bind(this,this.setNormal)).wait(Math.round(this.duration)).call($bind(this,this.popIn));
	}
	,popOut: function() {
		this._shotsFired = 0;
		this.setNormal();
		var tx = this._endX;
		var ty = this._endY;
		this._movementTween = createjs.Tween.get(this.sprite).to({ x : tx, y : ty},400,createjs.Ease.sineInOut).call($bind(this,this.shoot));
		this.isMoving = true;
	}
	,setDead: function() {
		this.isDead = true;
		this.sprite.visible = true;
		if(this.isBoss) (js.Boot.__cast((js.Boot.__cast(this.sprite , createjs.Container)).getChildAt(0) , createjs.BitmapAnimation)).gotoAndStop(this._baseIndex + 2); else (js.Boot.__cast(this.sprite , createjs.BitmapAnimation)).gotoAndStop(this._baseIndex + 2);
	}
	,setShooting: function() {
		if(this.isDead) return;
		this._shotsFired++;
		if(Math.random() < this.chanceToHit) this._session.hitPlayer(this.damage);
		this.sprite.visible = true;
		if(this.isBoss) (js.Boot.__cast((js.Boot.__cast(this.sprite , createjs.Container)).getChildAt(0) , createjs.BitmapAnimation)).gotoAndStop(this._baseIndex + 1); else (js.Boot.__cast(this.sprite , createjs.BitmapAnimation)).gotoAndStop(this._baseIndex + 1);
	}
	,setNormal: function() {
		if(this.isDead) return;
		this.sprite.visible = true;
		if(this.isBoss) (js.Boot.__cast((js.Boot.__cast(this.sprite , createjs.Container)).getChildAt(0) , createjs.BitmapAnimation)).gotoAndStop(this._baseIndex); else (js.Boot.__cast(this.sprite , createjs.BitmapAnimation)).gotoAndStop(this._baseIndex);
	}
	,handleHit: function(damage) {
		if(damage == null) damage = 1;
		if(this.isDead || !this._session.isActive) return;
		this.hp -= damage;
		this.hp = Math.max(0,this.hp) | 0;
		this._blinkTween = createjs.Tween.get(this.sprite).to({ alpha : 0},15);
		this._blinkTween.to({ alpha : 1},15);
		if(this.hp > 0) {
		} else this.kill();
	}
	,setLocation: function(startX,startY,endX,endY,scale,rotation,location) {
		this.location = location;
		this.sprite.scaleX = this.sprite.scaleY = scale;
		this.sprite.x = this._startX = startX;
		this.sprite.y = this._startY = startY;
		this.sprite.rotation = rotation;
		this._endX = endX;
		this._endY = endY;
	}
	,initSpriteSheet: function() {
		if(this.isBoss) {
			this._sheet = co.doubleduck.BaseAssets.getImage(co.doubleduck.Enemy.BOSSES);
			this.spriteWidth = this._sheet.image.width / co.doubleduck.Enemy.BOSS_COLS | 0;
			this.spriteHeight = this._sheet.image.height / co.doubleduck.Enemy.BOSS_ROWS | 0;
		} else {
			this._sheet = co.doubleduck.BaseAssets.getImage(co.doubleduck.Enemy.ENEMIES);
			this.spriteWidth = this._sheet.image.width / co.doubleduck.Enemy.ENEMY_COLS | 0;
			this.spriteHeight = this._sheet.image.height / co.doubleduck.Enemy.ENEMY_ROWS | 0;
		}
		var initObject = { };
		initObject.images = [this._sheet.image];
		initObject.frames = { width : this.spriteWidth, height : this.spriteHeight, regX : this.spriteWidth / 2, regY : this.spriteHeight / 2};
		if(this.isBoss) {
			var animation = new co.doubleduck.EnemyBitmapAnimation(new createjs.SpriteSheet(initObject),this);
			this.sprite = new createjs.Container();
			animation.gotoAndStop(0);
			(js.Boot.__cast(this.sprite , createjs.Container)).addChild(animation);
		} else {
			this.sprite = new co.doubleduck.EnemyBitmapAnimation(new createjs.SpriteSheet(initObject),this);
			(js.Boot.__cast(this.sprite , createjs.BitmapAnimation)).gotoAndStop(0);
		}
	}
	,spriteHeight: null
	,spriteWidth: null
	,isDead: null
	,isMoving: null
	,_movementTween: null
	,_blinkTween: null
	,_shotsFired: null
	,hp: null
	,maxHp: null
	,chanceToHit: null
	,damage: null
	,duration: null
	,graphicsId: null
	,waitToShoot: null
	,shots: null
	,_endY: null
	,_endX: null
	,_startY: null
	,_startX: null
	,location: null
	,_session: null
	,_baseIndex: null
	,_sheet: null
	,sprite: null
	,isBoss: null
	,__class__: co.doubleduck.Enemy
}
co.doubleduck.Boss = $hxClasses["co.doubleduck.Boss"] = function(session,id,startX,startY,endX,endY,scale,rotation,location) {
	this.isBoss = true;
	co.doubleduck.Enemy.call(this,session,id,startX,startY,endX,endY,scale,rotation,location);
	if(co.doubleduck.Enemy.ENEMY_NUM / 3 > this.graphicsId + 1) throw "Error - boss has to have graphics id > " + (co.doubleduck.Enemy.ENEMY_NUM / 3 | 0);
	this.hpBar = new co.doubleduck.Bar(js.Boot.__cast(this.sprite , createjs.Container),false);
	this.hpBar.set(1.0);
};
co.doubleduck.Boss.__name__ = ["co","doubleduck","Boss"];
co.doubleduck.Boss.__super__ = co.doubleduck.Enemy;
co.doubleduck.Boss.prototype = $extend(co.doubleduck.Enemy.prototype,{
	handleHit: function(damage) {
		if(damage == null) damage = 1;
		co.doubleduck.Enemy.prototype.handleHit.call(this,damage);
		this.hpBar.set(this.hp / this.maxHp);
	}
	,hpBar: null
	,__class__: co.doubleduck.Boss
});
co.doubleduck.LabeledContainer = $hxClasses["co.doubleduck.LabeledContainer"] = function(bmp) {
	createjs.Container.call(this);
	this._bitmap = bmp;
	if(this._bitmap != null) {
		if(js.Boot.__instanceof(this._bitmap,createjs.Bitmap)) {
			this._bmp = this._bitmap;
			this.image = this._bmp.image;
		} else if(js.Boot.__instanceof(this._bitmap,createjs.BitmapAnimation)) {
			this.anim = this._bitmap;
			this.image = { width : this.anim.spriteSheet._frameWidth, height : this.anim.spriteSheet._frameHeight};
		}
	}
};
co.doubleduck.LabeledContainer.__name__ = ["co","doubleduck","LabeledContainer"];
co.doubleduck.LabeledContainer.__super__ = createjs.Container;
co.doubleduck.LabeledContainer.prototype = $extend(createjs.Container.prototype,{
	getLabel: function() {
		return this._label;
	}
	,addBitmap: function() {
		this.addChild(this._bitmap);
	}
	,addCenteredBitmap: function() {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	,addBitmapLabel: function(label,fontType,padding) {
		if(padding == null) padding = 0;
		if(fontType == null) fontType = "";
		if(this._bitmapText != null) this.removeChild(this._bitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
		if(this.image != null) {
			this._bitmapText.x = this.image.width / 2;
			this._bitmapText.y = this.image.height / 2;
		}
		this._label = label;
		this.addChild(this._bitmapText);
	}
	,scaleBitmapFont: function(scale) {
		this._bitmapText.scaleX = this._bitmapText.scaleY = scale;
	}
	,shiftLabel: function(shiftX,shiftY) {
		this._bitmapText.x *= shiftX;
		this._bitmapText.y *= shiftY;
	}
	,setBitmapLabelY: function(ly) {
		this._bitmapText.y = ly;
	}
	,setBitmapLabelX: function(lx) {
		this._bitmapText.x = lx;
	}
	,setLabelY: function(ly) {
		this._text.y = ly;
	}
	,setLabelX: function(lx) {
		this._text.x = lx;
	}
	,addLabel: function(label,color) {
		if(color == null) color = "#000000";
		if(this._text != null) this.removeChild(this._text);
		this._label = label;
		this._text = new createjs.Text(label,"bold 22px Arial",color);
		this._text.regY = this._text.getMeasuredHeight() / 2;
		this._text.textAlign = "center";
		if(this._bitmap != null) {
			this._text.x = this._bitmap.x;
			this._text.y = this._bitmap.y;
		}
		this.addChild(this._text);
	}
	,changeText: function(txt) {
	}
	,_bitmapText: null
	,_text: null
	,_bmp: null
	,_bitmap: null
	,_label: null
	,anim: null
	,image: null
	,__class__: co.doubleduck.LabeledContainer
});
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	co.doubleduck.LabeledContainer.call(this,bmp);
	if(clickSound == null && co.doubleduck.Button._defaultSound != null) this._clickSound = co.doubleduck.Button._defaultSound; else this._clickSound = clickSound;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else this.addCenteredBitmap();
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.setDefaultSound = function(sound) {
	co.doubleduck.Button._defaultSound = sound;
}
co.doubleduck.Button.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.Button.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	handleEndPressTint: function() {
		co.doubleduck.Utils.tintBitmap(this._bmp,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function() {
		if(this.onToggle == null) return;
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function(event) {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this._clickType == co.doubleduck.Button.CLICK_TYPE_HOLD) {
			if(this.onHoldStart != null) {
				this.onHoldStart();
				event.onMouseUp = this.onHoldFinish;
			}
		}
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				if(this._bmp != null) {
					co.doubleduck.Utils.tintBitmap(this._bmp,0.55,0.55,0.55,1);
					var tween = createjs.Tween.get(this._bmp);
					tween.ignoreGlobalPause = true;
					tween.wait(200).call($bind(this,this.handleEndPressTint));
					if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
				}
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_HOLD:
				throw "Use onHoldStart with CLICK_TYPE_HOLD, not onClick";
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,onHoldFinish: null
	,onHoldStart: null
	,onToggle: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() { }
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.getAllPowerUps = function() {
	return new GameplayDB().getAllPowerUps();
}
co.doubleduck.DataLoader.getAllEnemies = function() {
	return new GameplayDB().getAllEnemies();
}
co.doubleduck.DataLoader.getEnemy = function(id) {
	var enemies = new GameplayDB().getAllEnemies();
	var _g = 0;
	while(_g < enemies.length) {
		var e = enemies[_g];
		++_g;
		if(id == Std.parseInt(e.id)) return e;
	}
	throw "Error - no such enemy with id " + id;
}
co.doubleduck.DataLoader.getLevel = function(world,number) {
	var levels = co.doubleduck.DataLoader.getAllLevels();
	var _g = 0;
	while(_g < levels.length) {
		var level = levels[_g];
		++_g;
		if((level.number | 0) == number && (level.world | 0) == world) return level;
	}
	throw "Error: no such level!";
}
co.doubleduck.DataLoader.getCoverSetIdOfLevel = function(world,levelNumber) {
	return Std.parseInt(co.doubleduck.DataLoader.getLevel(world,levelNumber).coverSet);
}
co.doubleduck.DataLoader.getCoverInLevel = function(world,levelNumber,cover) {
	var level = co.doubleduck.DataLoader.getLevel(world,levelNumber);
	var coverSet = co.doubleduck.DataLoader.getCoverSet(world,Std.parseInt(level.coverSet));
	var fieldName = "layer" + cover[0];
	return Reflect.field(coverSet,fieldName);
}
co.doubleduck.DataLoader.getLocations = function(world,levelNumber,cover) {
	var cover1 = co.doubleduck.DataLoader.getCoverInLevel(world,levelNumber,cover);
	if(!Reflect.hasField(cover1,"locations")) return null;
	return cover1.locations;
}
co.doubleduck.DataLoader.getCoverSet = function(world,coverSetId) {
	var _g = 0, _g1 = co.doubleduck.DataLoader.getAllCoverSets();
	while(_g < _g1.length) {
		var cover = _g1[_g];
		++_g;
		if((cover.world | 0) == world && (cover.level | 0) == coverSetId) return cover;
	}
	throw "Error: no such cover set!";
}
co.doubleduck.DataLoader.getAllLevels = function() {
	return new LevelDB().getAllLevels();
}
co.doubleduck.DataLoader._locations = null;
co.doubleduck.DataLoader._coverSets = null;
co.doubleduck.DataLoader.getAllCoverSets = function() {
	if(co.doubleduck.DataLoader._locations == null) {
		co.doubleduck.DataLoader._locations = new LocationDB().getAllLocations();
		co.doubleduck.DataLoader._coverSets = new Array();
		var currWorld = "0";
		var currLevel = "0";
		var currCover = null;
		var _g = 0, _g1 = co.doubleduck.DataLoader._locations;
		while(_g < _g1.length) {
			var loc = _g1[_g];
			++_g;
			var world = loc.world;
			var level = loc.level;
			if(world != currWorld || currLevel != level) {
				currWorld = world;
				currLevel = level;
				currCover = { };
				co.doubleduck.DataLoader._coverSets.push(currCover);
				currCover.world = world;
				currCover.level = level;
				currCover.layerA = { locations : []};
				currCover.layerB = { locations : []};
				currCover.layerC = { locations : []};
			}
			var locations = null;
			switch(loc.layer) {
			case "A":
				locations = currCover.layerA.locations;
				break;
			case "B":
				locations = currCover.layerB.locations;
				break;
			case "C":
				locations = currCover.layerC.locations;
				break;
			}
			if(locations.length == 0) locations.push({ });
			var x = loc.x;
			var y = loc.y;
			var lastLocation = locations[locations.length - 1];
			var type = Std.string(loc.type);
			if(lastLocation[type] != null) {
				lastLocation = { };
				locations.push(lastLocation);
			}
			lastLocation[type] = new Array();
			lastLocation[type].push(x);
			lastLocation[type].push(y);
			lastLocation.scale = loc.scale;
			lastLocation.rotation = loc.rotation;
			lastLocation.width = loc.width;
			lastLocation.height = loc.height;
		}
	}
	return co.doubleduck.DataLoader._coverSets;
}
co.doubleduck.DataLoader.getGun = function(type) {
	var guns = new GameplayDB().getAllGuns();
	var name = type[0].toLowerCase();
	var _g = 0;
	while(_g < guns.length) {
		var gun = guns[_g];
		++_g;
		if(gun.name == name) return gun;
	}
	throw "Error: no gun of type " + Std.string(type);
}
co.doubleduck.DataLoader.getMaxUnlockedGun = function() {
	var world = 5;
	var maxLevel = co.doubleduck.Persistence.getUnlockedLevel();
	var maxGun = "";
	var _g = 0, _g1 = new GameplayDB().getAllGuns();
	while(_g < _g1.length) {
		var gunData = _g1[_g];
		++_g;
		var unlock = Std.parseInt(gunData.unlocks);
		if(maxLevel < unlock) return Type.createEnum(co.doubleduck.GunType,maxGun.toUpperCase());
		maxGun = gunData.name;
	}
	return Type.createEnum(co.doubleduck.GunType,maxGun.toUpperCase());
}
co.doubleduck.Layer = $hxClasses["co.doubleduck.Layer"] = { __ename__ : ["co","doubleduck","Layer"], __constructs__ : ["A","B","C"] }
co.doubleduck.Layer.A = ["A",0];
co.doubleduck.Layer.A.toString = $estr;
co.doubleduck.Layer.A.__enum__ = co.doubleduck.Layer;
co.doubleduck.Layer.B = ["B",1];
co.doubleduck.Layer.B.toString = $estr;
co.doubleduck.Layer.B.__enum__ = co.doubleduck.Layer;
co.doubleduck.Layer.C = ["C",2];
co.doubleduck.Layer.C.toString = $estr;
co.doubleduck.Layer.C.__enum__ = co.doubleduck.Layer;
co.doubleduck.DoubleLabelContainer = $hxClasses["co.doubleduck.DoubleLabelContainer"] = function(bmp) {
	co.doubleduck.LabeledContainer.call(this,bmp);
};
co.doubleduck.DoubleLabelContainer.__name__ = ["co","doubleduck","DoubleLabelContainer"];
co.doubleduck.DoubleLabelContainer.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.DoubleLabelContainer.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	shiftSecondLabel: function(shiftX,shiftY) {
		this._secondBitmapText.x *= shiftX;
		this._secondBitmapText.y *= shiftY;
	}
	,addSecondBitmapLabel: function(label,fontType) {
		if(fontType == null) fontType = "";
		if(this._secondBitmapText != null) this.removeChild(this._secondBitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._secondBitmapText = fontHelper.getNumber(Std.parseInt(label),1,true);
		this._secondBitmapText.x = this._bitmapText.x;
		this._secondBitmapText.y = this._bitmapText.y;
		this._label = label;
		this.addChild(this._secondBitmapText);
	}
	,_secondBitmapText: null
	,__class__: co.doubleduck.DoubleLabelContainer
});
co.doubleduck.EnemyBitmapAnimation = $hxClasses["co.doubleduck.EnemyBitmapAnimation"] = function(spriteSheet,enemy) {
	createjs.BitmapAnimation.call(this,spriteSheet);
	this.enemy = enemy;
};
co.doubleduck.EnemyBitmapAnimation.__name__ = ["co","doubleduck","EnemyBitmapAnimation"];
co.doubleduck.EnemyBitmapAnimation.__super__ = createjs.BitmapAnimation;
co.doubleduck.EnemyBitmapAnimation.prototype = $extend(createjs.BitmapAnimation.prototype,{
	enemy: null
	,__class__: co.doubleduck.EnemyBitmapAnimation
});
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims,padding) {
		if(padding == null) padding = 0;
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			result.regX = bmp.image.width / 2;
			result.regY = bmp.image.height / 2;
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width + padding;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width + padding; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width + padding;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale + padding;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width + padding;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale + padding;
				}
			}
			result.regX = totalWidth / 2;
			result.regY = digits[0].image.height / 2;
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.BaseAssets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.BaseAssets.getImage(this._fontType + ",.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._wantLandscape = true;
	co.doubleduck.BaseGame.call(this,stage);
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game.__super__ = co.doubleduck.BaseGame;
co.doubleduck.Game.prototype = $extend(co.doubleduck.BaseGame.prototype,{
	removeSplash: function() {
		co.doubleduck.BaseGame._stage.removeChild(this._back);
		this._back = null;
		co.doubleduck.BaseGame._stage.removeChild(this._agent);
		this._agent = null;
		co.doubleduck.BaseGame._stage.removeChild(this._logo);
		this._logo = null;
	}
	,closeSplash: function() {
		createjs.Tween.get(this._back).to({ alpha : 0},550).call($bind(this,this.removeSplash));
		createjs.Tween.get(this._agent).to({ alpha : 0},400);
		createjs.Tween.get(this._logo).to({ alpha : 0},400);
		this._back.onClick = null;
		co.doubleduck.BaseGame._stage.removeChild(this._tapToPlay);
		this._tapToPlay = null;
		this.showMenu();
	}
	,showGameSplash: function() {
		this._back = co.doubleduck.BaseAssets.getImage("images/splash/splash_bg.jpg",true);
		this._back.scaleX = this._back.scaleY = co.doubleduck.BaseGame.getScale();
		this._back.regX = 0;
		this._back.regY = this._back.image.height / 2;
		this._back.x = 0;
		this._back.y = co.doubleduck.BaseGame.getViewport().height / 2;
		co.doubleduck.BaseGame._stage.addChild(this._back);
		createjs.Tween.get(this._back).to({ scaleX : co.doubleduck.BaseGame.getScale() * 1.07, scaleY : co.doubleduck.BaseGame.getScale() * 1.07},4500,createjs.Ease.sineInOut);
		this._agent = co.doubleduck.BaseAssets.getImage("images/splash/agent.png");
		this._agent.scaleX = this._agent.scaleY = co.doubleduck.BaseGame.getScale();
		this._agent.regX = this._agent.image.width;
		this._agent.regY = this._agent.image.height;
		this._agent.x = co.doubleduck.BaseGame.getViewport().width - 40 * co.doubleduck.BaseGame.getScale();
		this._agent.y = co.doubleduck.BaseGame.getViewport().height;
		co.doubleduck.BaseGame._stage.addChild(this._agent);
		this._logo = co.doubleduck.BaseAssets.getImage("images/splash/logo.png");
		this._logo.scaleX = this._logo.scaleY = co.doubleduck.BaseGame.getScale() * 0.9;
		this._logo.regX = this._logo.image.width / 2;
		this._logo.regY = this._logo.image.height;
		this._logo.x = co.doubleduck.BaseGame.getViewport().width * 0.35;
		this._logo.y = co.doubleduck.BaseGame.getViewport().height * 0.5;
		co.doubleduck.BaseGame._stage.addChild(this._logo);
		createjs.Tween.get(this._logo).to({ scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},4500,createjs.Ease.sineInOut);
		this._tapToPlay = co.doubleduck.BaseAssets.getImage("images/splash/tap_to_play.png");
		this._tapToPlay.regX = this._tapToPlay.image.width / 2;
		this._tapToPlay.x = this._logo.x;
		this._tapToPlay.y = this._logo.y + co.doubleduck.BaseGame.getScale() * 5;
		this._tapToPlay.scaleX = this._tapToPlay.scaleY = co.doubleduck.BaseGame.getScale();
		this._tapToPlay.alpha = 0;
		this.alphaFade(this._tapToPlay);
		co.doubleduck.BaseGame._stage.addChild(this._tapToPlay);
		this._back.onClick = $bind(this,this.closeSplash);
		co.doubleduck.Button.setDefaultSound("sound/general/button_click");
	}
	,_tapToPlay: null
	,_logo: null
	,_agent: null
	,_back: null
	,__class__: co.doubleduck.Game
});
co.doubleduck.Popup = $hxClasses["co.doubleduck.Popup"] = function(bgBitmap,closeBitmap) {
	if(closeBitmap == null) closeBitmap = "images/menu/close_window_button.png";
	if(bgBitmap == null) bgBitmap = "images/menu/window.png";
	createjs.Container.call(this);
	this.mouseEnabled = false;
	this.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.scaleX = this.scaleY = co.doubleduck.BaseGame.getScale();
	this._background = co.doubleduck.BaseAssets.getImage(bgBitmap);
	this.addChild(this._background);
	this._background.regX = this._background.image.width / 2;
	this._background.regY = this._background.image.height / 2;
	this._closeBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(closeBitmap));
	this._closeBtn.regX = this._closeBtn.image.width;
	this._closeBtn.x = this._background.image.width * 0.46;
	this._closeBtn.y = -this._background.image.height * 0.43;
	this.addChild(this._closeBtn);
	this._closeBtn.onClick = $bind(this,this.hide);
};
co.doubleduck.Popup.__name__ = ["co","doubleduck","Popup"];
co.doubleduck.Popup.overworld = null;
co.doubleduck.Popup.menu = null;
co.doubleduck.Popup.__super__ = createjs.Container;
co.doubleduck.Popup.prototype = $extend(createjs.Container.prototype,{
	hide: function(tween) {
		if(tween == null) tween = true;
		if(this.onClose != null) this.onClose();
		co.doubleduck.Popup.overworld.mouseEnabled = true;
		this._closeBtn.mouseEnabled = this.mouseEnabled = false;
		if(tween) createjs.Tween.get(this).to({ alpha : 0},300,createjs.Ease.sineOut); else this.alpha = 0;
	}
	,show: function(duration) {
		if(duration == null) duration = 300;
		co.doubleduck.Popup.overworld.mouseEnabled = false;
		this.alpha = 0;
		createjs.Tween.get(this).to({ alpha : 1},duration,createjs.Ease.sineOut);
		this._closeBtn.mouseEnabled = this.mouseEnabled = this.visible = true;
	}
	,_background: null
	,_closeBtn: null
	,onClose: null
	,__class__: co.doubleduck.Popup
});
co.doubleduck.GameOverPopup = $hxClasses["co.doubleduck.GameOverPopup"] = function() {
	this.visible = false;
	co.doubleduck.Popup.call(this,co.doubleduck.GameOverPopup.BACKGROUND);
	this.x = 0;
	this.y = 0;
};
co.doubleduck.GameOverPopup.__name__ = ["co","doubleduck","GameOverPopup"];
co.doubleduck.GameOverPopup.__super__ = co.doubleduck.Popup;
co.doubleduck.GameOverPopup.prototype = $extend(co.doubleduck.Popup.prototype,{
	handleMenu: function() {
		this.onMenu();
	}
	,init: function() {
		var menuBtn = null;
		menuBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.GameOverPopup.BACK_TO_MENU));
		menuBtn.x = this._background.image.width / 2 - menuBtn.image.width * 1.5;
		menuBtn.regY = menuBtn.image.height;
		menuBtn.y = this._background.image.height / 2 - menuBtn.image.height * 0.4;
		menuBtn.mouseEnabled = true;
		menuBtn.onClick = $bind(this,this.handleMenu);
		this.addChild(menuBtn);
	}
	,show: function(duration) {
		if(duration == null) duration = 750;
		co.doubleduck.Popup.prototype.show.call(this,duration);
		this._closeBtn.visible = false;
	}
	,onMenu: null
	,__class__: co.doubleduck.GameOverPopup
});
co.doubleduck.Gun = $hxClasses["co.doubleduck.Gun"] = function(type) {
	this.type = type;
	var gunData = co.doubleduck.DataLoader.getGun(type);
	this.ammo = this.maxAmmo = Std.parseInt(gunData.maxAmmo);
	this.isAutomatic = gunData.isAutomatic.toLowerCase() == "true"?true:false;
	if(this.isAutomatic) this.rateOfFire = Std.parseInt(gunData.rateOfFire);
};
co.doubleduck.Gun.__name__ = ["co","doubleduck","Gun"];
co.doubleduck.Gun.prototype = {
	rateOfFire: null
	,isAutomatic: null
	,ammo: null
	,maxAmmo: null
	,type: null
	,__class__: co.doubleduck.Gun
}
co.doubleduck.GunType = $hxClasses["co.doubleduck.GunType"] = { __ename__ : ["co","doubleduck","GunType"], __constructs__ : ["AK47","MAGNUM","PISTOL","SHOTGUN","SNIPER","TAVOR"] }
co.doubleduck.GunType.AK47 = ["AK47",0];
co.doubleduck.GunType.AK47.toString = $estr;
co.doubleduck.GunType.AK47.__enum__ = co.doubleduck.GunType;
co.doubleduck.GunType.MAGNUM = ["MAGNUM",1];
co.doubleduck.GunType.MAGNUM.toString = $estr;
co.doubleduck.GunType.MAGNUM.__enum__ = co.doubleduck.GunType;
co.doubleduck.GunType.PISTOL = ["PISTOL",2];
co.doubleduck.GunType.PISTOL.toString = $estr;
co.doubleduck.GunType.PISTOL.__enum__ = co.doubleduck.GunType;
co.doubleduck.GunType.SHOTGUN = ["SHOTGUN",3];
co.doubleduck.GunType.SHOTGUN.toString = $estr;
co.doubleduck.GunType.SHOTGUN.__enum__ = co.doubleduck.GunType;
co.doubleduck.GunType.SNIPER = ["SNIPER",4];
co.doubleduck.GunType.SNIPER.toString = $estr;
co.doubleduck.GunType.SNIPER.__enum__ = co.doubleduck.GunType;
co.doubleduck.GunType.TAVOR = ["TAVOR",5];
co.doubleduck.GunType.TAVOR.toString = $estr;
co.doubleduck.GunType.TAVOR.__enum__ = co.doubleduck.GunType;
co.doubleduck.HelpPopup = $hxClasses["co.doubleduck.HelpPopup"] = function() {
	co.doubleduck.Popup.call(this,"images/help/help_screen_sd.png","images/help/got_it_button_sd.png");
	this._closeBtn.regX = this._closeBtn.image.width / 2;
	this._closeBtn.x = 0;
	this._closeBtn.y = this._background.image.height * 0.2;
};
co.doubleduck.HelpPopup.__name__ = ["co","doubleduck","HelpPopup"];
co.doubleduck.HelpPopup.__super__ = co.doubleduck.Popup;
co.doubleduck.HelpPopup.prototype = $extend(co.doubleduck.Popup.prototype,{
	__class__: co.doubleduck.HelpPopup
});
co.doubleduck.Hud = $hxClasses["co.doubleduck.Hud"] = function(session,bg) {
	createjs.Container.call(this);
	this._sessionBackground = bg;
	this._session = session;
	this._hide = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/UI/hud/button_hide.png"),true,co.doubleduck.Button.CLICK_TYPE_HOLD);
	this._uiPadding = this._hide.image.width * co.doubleduck.BaseGame.getScale() / 10;
	this._hide.scaleX = this._hide.scaleY = co.doubleduck.BaseGame.getScale();
	this._hide.y = co.doubleduck.BaseGame.getViewport().height / 2 - this._hide.image.height * co.doubleduck.BaseGame.getScale() - this._uiPadding;
	this._hide.x = -co.doubleduck.BaseGame.getViewport().width / 2 + this._uiPadding;
	this._hide.onHoldStart = $bind(this,this.handleHideStart);
	this._hide.onHoldFinish = $bind(this,this.handleHideEnd);
	this.addChild(this._hide);
	this._powerUps = new Array();
	var currPowerup;
	var powerupNum = 0;
	var maxLevel = co.doubleduck.Persistence.getUnlockedLevel();
	var _g = 0, _g1 = session.powerUps;
	while(_g < _g1.length) {
		var pu = _g1[_g];
		++_g;
		if(pu.unlocks <= maxLevel) {
			this._powerUps.push(currPowerup = new co.doubleduck.PowerUpButton(pu));
			currPowerup.y = co.doubleduck.BaseGame.getViewport().height / 2 - currPowerup.image.height * co.doubleduck.BaseGame.getScale() - this._uiPadding;
			powerupNum++;
			currPowerup.x = co.doubleduck.BaseGame.getViewport().width / 2 - currPowerup.image.width * co.doubleduck.BaseGame.getScale() * powerupNum - this._uiPadding;
			this.addChild(currPowerup);
		}
	}
	this._pause = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/UI/hud/button_pause.png"),false);
	this._pause.scaleX = this._pause.scaleY = co.doubleduck.BaseGame.getScale();
	this._pause.x = co.doubleduck.BaseGame.getViewport().width / 2 - this._pause.image.width * co.doubleduck.BaseGame.getScale() - this._uiPadding;
	this._pause.y = -co.doubleduck.BaseGame.getViewport().height / 2 + this._uiPadding;
	this._pause.onClick = $bind(this,this.pauseGame);
	this._bar = new co.doubleduck.Bar(this);
	this.setHpBar(1.0);
	this._killIcon = co.doubleduck.BaseAssets.getImage("images/session/UI/hud/skull.png");
	this._killIcon.scaleX = this._killIcon.scaleY = co.doubleduck.BaseGame.getScale();
	this._killIcon.x = this._bar.getWidth() * co.doubleduck.BaseGame.getScale() - co.doubleduck.BaseGame.getViewport().width / 2 + this._uiPadding * 4;
	this._killIcon.y = -co.doubleduck.BaseGame.getViewport().height / 2 + this._uiPadding;
	this.addChild(this._killIcon);
	this._kills = new co.doubleduck.DoubleLabelContainer(co.doubleduck.BaseAssets.getImage("images/session/UI/hud/kills.png"));
	this._kills.scaleX = this._kills.scaleY = co.doubleduck.BaseGame.getScale();
	this._kills.x = this._killIcon.x + this._killIcon.image.width * co.doubleduck.BaseGame.getScale();
	this._kills.y = this._bar.getY();
	this._kills.addBitmap();
	this.addChild(this._kills);
	this.setKills(0);
	this._kills.addSecondBitmapLabel("" + this._session.getEnemyNumber(),"images/session/UI/font_white/");
	this._kills.shiftSecondLabel(2.4,1);
	this._gunIcon = co.doubleduck.BaseAssets.getImage("images/session/UI/gun_icons/" + this._session.getGunType()[0].toLowerCase() + ".png");
	this._gunIcon.scaleX = this._gunIcon.scaleY = co.doubleduck.BaseGame.getScale();
	this._gunIcon.x = this._bar.getX();
	this._gunIcon.y = this._bar.getY() + this._bar.getHeight() + this._uiPadding * 2;
	this.addChild(this._gunIcon);
	this._ammo = new co.doubleduck.LabeledContainer(co.doubleduck.BaseAssets.getImage("images/session/UI/hud/small_block.png"));
	this._ammo.scaleX = this._ammo.scaleY = co.doubleduck.BaseGame.getScale();
	this._ammo.x = this._gunIcon.x + this._gunIcon.image.width * co.doubleduck.BaseGame.getScale();
	this._ammo.y = this._gunIcon.y;
	this._ammo.addBitmap();
	this.addChild(this._ammo);
	this.setAmmo(this._session.getAmmo());
	this._reloadOverlay = co.doubleduck.Utils.getCenteredImage("images/session/reload_sd.png");
	this._reloadOverlay.visible = false;
	this.addChild(this._reloadOverlay);
	this._hurtOverlay = new createjs.Container();
	this._hurtOverlay.visible = false;
	var hurt_left = co.doubleduck.Utils.getCenteredImage("images/session/hit_gradient_sd.png");
	var hurt_right = co.doubleduck.Utils.getCenteredImage("images/session/hit_gradient2_sd.png");
	hurt_left.scaleX = hurt_left.scaleY = hurt_right.scaleX = hurt_right.scaleY = co.doubleduck.BaseGame.getScale();
	hurt_left.x = co.doubleduck.BaseGame.getScale() * hurt_left.image.width / 2 - co.doubleduck.BaseGame.getViewport().width / 2;
	hurt_right.x = co.doubleduck.BaseGame.getViewport().width / 2 - co.doubleduck.BaseGame.getScale() * hurt_left.image.width / 2;
	this._hurtOverlay.addChild(hurt_left);
	this._hurtOverlay.addChild(hurt_right);
	this.addChild(this._hurtOverlay);
	this._deathOverlay = new createjs.Container();
	this._deathOverlay.visible = false;
	var bloodBmp = co.doubleduck.Utils.getCenteredImage("images/session/blood_sd.png");
	bloodBmp.regY = 0;
	bloodBmp.scaleX = bloodBmp.scaleY = co.doubleduck.BaseGame.getScale();
	bloodBmp.y = -co.doubleduck.BaseGame.getViewport().height / 2;
	var bloodRect = new createjs.Shape();
	bloodRect.graphics.beginFill(createjs.Graphics.getRGB(204,0,0));
	bloodRect.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	bloodRect.graphics.endFill();
	bloodRect.x = -co.doubleduck.BaseGame.getViewport().width / 2;
	bloodRect.y = -co.doubleduck.BaseGame.getViewport().height * 1.5;
	this._deathOverlay.addChild(bloodRect);
	this._deathOverlay.addChild(bloodBmp);
	this.addChild(this._deathOverlay);
	this._pauseContainer = new createjs.Container();
	this._pauseContainer.scaleX = this._pauseContainer.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseContainer.visible = false;
	this._pauseBg = co.doubleduck.Utils.getCenteredImage("images/session/UI/pause_window.png");
	this._pauseContainer.addChild(this._pauseBg);
	this._pauseMenu = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.MENU),true);
	this._pauseMenu.x = -this._pauseMenu.image.width * 1.75;
	this._pauseMenu.regY = this._pauseMenu.image.height;
	this._pauseMenu.y = this._pauseBg.image.height / 2 - this._pauseMenu.image.height * 0.4;
	this._pauseContainer.addChild(this._pauseMenu);
	this._pauseMenu.mouseEnabled = true;
	this._pauseMenu.onClick = $bind(this,this.handleMenu);
	this._pauseReplay = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.RESTART),true);
	this._pauseReplay.x = this._pauseMenu.x + this._pauseMenu.image.width * 1.25;
	this._pauseReplay.regY = this._pauseReplay.image.height;
	this._pauseReplay.y = this._pauseMenu.y;
	this._pauseContainer.addChild(this._pauseReplay);
	this._pauseReplay.mouseEnabled = true;
	this._pauseReplay.onClick = $bind(this,this.handleRestart);
	this._pauseContinue = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.NEXT),true);
	this._pauseContinue.x = this._pauseReplay.x + this._pauseReplay.image.width * 1.25;
	this._pauseContinue.regY = this._pauseContinue.image.height;
	this._pauseContinue.y = this._pauseMenu.y;
	this._pauseContainer.addChild(this._pauseContinue);
	this._pauseContinue.mouseEnabled = true;
	this._pauseContinue.onClick = $bind(this,this.handleContinue);
	this.addChild(this._pauseContainer);
	this.addChild(this._pause);
	this._fire = co.doubleduck.Utils.getCenteredImage("images/session/fire.png",true);
	this._fire.regY = this._fire.image.height;
	this._fire.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this._fire.visible = false;
	this.addChild(this._fire);
	this.onTick = $bind(this,this.handleTick);
};
co.doubleduck.Hud.__name__ = ["co","doubleduck","Hud"];
co.doubleduck.Hud.__super__ = createjs.Container;
co.doubleduck.Hud.prototype = $extend(createjs.Container.prototype,{
	setHpBar: function(fill) {
		this._bar.set(fill);
	}
	,disableButtons: function() {
		this._pause.visible = false;
		var _g = 0, _g1 = this._powerUps;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.visible = false;
		}
		this._ammo.visible = false;
		this._bar.setVisible(false);
		this._hide.visible = false;
		this._kills.visible = false;
		this._killIcon.visible = false;
		this._ammo.visible = false;
		this._gunIcon.visible = false;
	}
	,isActive: function() {
		return this._session.isActive;
	}
	,setAmmo: function(ammo) {
		this._ammo.addBitmapLabel("" + ammo,"images/session/UI/font_white/");
	}
	,setKills: function(kills) {
		this._kills.addBitmapLabel("" + kills,"images/session/UI/font_white/");
		this._kills.shiftLabel(0.6,1);
	}
	,handleHideEnd: function(e) {
		if(($_=this._session,$bind($_,$_.onUnHide)) != null) this._session.onUnHide(e);
	}
	,hideReloadOverlay: function() {
		this._reloadOverlay.visible = false;
	}
	,handleHideStart: function() {
		if(createjs.Ticker.getPaused() || !this._session.isActive) return;
		if(($_=this._session,$bind($_,$_.onHide)) != null) this._session.onHide();
	}
	,fadeReloadToAlpha: function(a) {
		if(!this._session.isActive) {
			this.alpha = 0;
			return;
		}
		if(this._session.getAmmo() > 0) createjs.Tween.removeTweens(this._reloadOverlay); else createjs.Tween.get(this._reloadOverlay).to({ alpha : a},400).call($bind(this,this.fadeReloadToAlpha),[1 - a]);
	}
	,showReload: function() {
		this._reloadOverlay.visible = true;
		this._reloadOverlay.alpha = 1;
		this.fadeReloadToAlpha(0.25);
	}
	,showPauseBtn: function() {
		this._pause.visible = true;
	}
	,hidePauseBtn: function() {
		this._pause.visible = false;
	}
	,showHurt: function() {
		this._hurtOverlay.visible = true;
		this._hurtOverlay.alpha = 1;
		createjs.Tween.get(this._hurtOverlay).to({ alpha : 0},500);
	}
	,showDead: function() {
		this._deathOverlay.visible = true;
		this._deathOverlay.alpha = 0.2;
		createjs.Tween.get(this._deathOverlay).to({ alpha : 0.8},750);
		createjs.Tween.get(this._deathOverlay).to({ y : co.doubleduck.BaseGame.getViewport().height},1600,createjs.Ease.sineIn).call(($_=this._session,$bind($_,$_.showLevelOverPopup)),[false]);
	}
	,pauseGame: function() {
		if(!this._session.isActive) return;
		this._pauseContainer.visible = !this._pauseContainer.visible;
		if(this._pauseContainer.visible) {
			createjs.Tween.get(this._pause).wait(100).call(function() {
				createjs.Ticker.setPaused(true);
			});
			this.hidePauseBtn();
		} else {
			createjs.Ticker.setPaused(false);
			this.showPauseBtn();
		}
	}
	,muzzleFlash: function() {
		this._fire.visible = true;
		this._muzzleTick = 5;
	}
	,handleTick: function() {
		if(this._muzzleTick > 0) this._muzzleTick--; else this._fire.visible = false;
	}
	,_muzzleTick: null
	,handleContinue: function() {
		createjs.Ticker.setPaused(false);
		this._pauseContainer.visible = false;
		this.onContinue();
	}
	,handleRestart: function() {
		createjs.Ticker.setPaused(false);
		this._pauseContainer.visible = false;
		this.onRestart();
	}
	,handleMenu: function() {
		createjs.Ticker.setPaused(false);
		this._pauseContainer.visible = false;
		this.onMenu();
	}
	,_fire: null
	,_hideCover: null
	,_gunIcon: null
	,_ammo: null
	,_killIcon: null
	,_kills: null
	,_deathOverlay: null
	,_hurtOverlay: null
	,_reloadOverlay: null
	,_pauseContinue: null
	,_pauseReplay: null
	,_pauseMenu: null
	,_pauseBg: null
	,_pauseContainer: null
	,_pause: null
	,_hide: null
	,_powerUps: null
	,_bar: null
	,_session: null
	,_sessionBackground: null
	,_uiPadding: null
	,onMenu: null
	,onContinue: null
	,onRestart: null
	,__class__: co.doubleduck.Hud
});
co.doubleduck.LevelOverPopup = $hxClasses["co.doubleduck.LevelOverPopup"] = function(won,newGun,currMedal,newPower) {
	this.visible = false;
	var bg = "images/session/UI/end_level/lose_pop_up.png";
	if(won) bg = "images/session/UI/end_level/win_pop_up.png";
	co.doubleduck.Popup.call(this,bg);
	this.x = 0;
	this.y = 0;
	if(newGun || newPower != null) {
		var patchCont = new createjs.Container();
		var upgradePatch = co.doubleduck.Utils.getCenteredImage(co.doubleduck.LevelOverPopup.UPGRADE);
		patchCont.addChild(upgradePatch);
		var label = "";
		var upgradeIcon = null;
		if(newGun) {
			var gun = co.doubleduck.DataLoader.getMaxUnlockedGun();
			label = this.enumToName(gun);
			upgradeIcon = co.doubleduck.Utils.getCenteredImage("images/session/UI/gun_icons/" + gun[0].toLowerCase() + ".png");
		} else {
			label = newPower.type;
			upgradeIcon = co.doubleduck.Utils.getCenteredImage("images/session/UI/power_up_icons/" + label.toLowerCase() + "_icon.png");
		}
		var _text = new createjs.Text(label,"bold 22px Arial","#ffffff");
		_text.textAlign = "center";
		_text.x = upgradePatch.image.width * 0.25;
		_text.y = upgradePatch.image.height * 0.25;
		_text.regY = _text.getMeasuredHeight() / 2;
		patchCont.addChild(_text);
		upgradeIcon.x = -upgradePatch.image.width * 0.26;
		upgradeIcon.y = 0;
		patchCont.addChild(upgradeIcon);
		patchCont.x = -this._background.image.width * 0.25;
		patchCont.y = this._background.image.height * 0.3;
		patchCont.rotation = 12.5;
		this.addChild(patchCont);
	}
	var medal = null;
	switch(currMedal) {
	case 1:
		medal = co.doubleduck.BaseAssets.getImage("images/session/UI/end_level/bronze_medal.png");
		break;
	case 2:
		medal = co.doubleduck.BaseAssets.getImage("images/session/UI/end_level/silver_medal.png");
		break;
	case 3:
		medal = co.doubleduck.BaseAssets.getImage("images/session/UI/end_level/gold_medal.png");
		break;
	}
	if(medal != null) {
		medal.regX = medal.image.width;
		medal.regY = 0;
		medal.x = this._background.image.height * 0.2;
		medal.y = -this._background.image.height * 0.6;
		this.addChild(medal);
	}
};
co.doubleduck.LevelOverPopup.__name__ = ["co","doubleduck","LevelOverPopup"];
co.doubleduck.LevelOverPopup.__super__ = co.doubleduck.Popup;
co.doubleduck.LevelOverPopup.prototype = $extend(co.doubleduck.Popup.prototype,{
	handleNext: function() {
		this.onNext();
	}
	,handleRestart: function() {
		this.onRestart();
	}
	,handleMenu: function() {
		this.onMenu();
	}
	,init: function(won) {
		var menuBtn = null;
		if(won) {
			var nextBtn = null;
			menuBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.MENU));
			menuBtn.x = this._background.image.width / 2 - menuBtn.image.width * 1.5;
			menuBtn.regY = menuBtn.image.height;
			menuBtn.y = this._background.image.height / 2 - menuBtn.image.height * 0.4;
			this.addChild(menuBtn);
			nextBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.NEXT));
			nextBtn.x = menuBtn.x - menuBtn.image.width * 1.25;
			nextBtn.regY = nextBtn.image.height;
			nextBtn.y = menuBtn.y;
			this.addChild(nextBtn);
			nextBtn.mouseEnabled = true;
			nextBtn.onClick = $bind(this,this.handleNext);
		} else {
			var retryBtn;
			menuBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.MENU));
			menuBtn.x = -this._background.image.width / 2 + menuBtn.image.width / 2;
			menuBtn.regY = menuBtn.image.height;
			menuBtn.y = this._background.image.height / 2 - menuBtn.image.height * 0.4;
			this.addChild(menuBtn);
			retryBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.LevelOverPopup.RESTART));
			retryBtn.x = menuBtn.x + menuBtn.image.width * 1.25;
			retryBtn.regY = retryBtn.image.height;
			retryBtn.y = menuBtn.y;
			this.addChild(retryBtn);
			retryBtn.mouseEnabled = true;
			retryBtn.onClick = $bind(this,this.handleRestart);
		}
		menuBtn.mouseEnabled = true;
		menuBtn.onClick = $bind(this,this.handleMenu);
	}
	,show: function(duration) {
		if(duration == null) duration = 750;
		co.doubleduck.Popup.prototype.show.call(this,duration);
		this._closeBtn.visible = false;
	}
	,enumToName: function(gun) {
		var str = gun[0];
		str = str.toLowerCase();
		StringTools.replace(str,"_"," ");
		return str.charAt(0).toUpperCase() + HxOverrides.substr(str,1,null);
	}
	,onNext: null
	,onRestart: null
	,onMenu: null
	,__class__: co.doubleduck.LevelOverPopup
});
co.doubleduck.Location = $hxClasses["co.doubleduck.Location"] = function(startX,startY,endX,endY,scale,rotation,layerContainer) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.scale = scale;
	this.rotation = rotation;
	this.layerContainer = layerContainer;
};
co.doubleduck.Location.__name__ = ["co","doubleduck","Location"];
co.doubleduck.Location.prototype = {
	currentEnemy: null
	,layerContainer: null
	,rotation: null
	,scale: null
	,endY: null
	,endX: null
	,startY: null
	,startX: null
	,__class__: co.doubleduck.Location
}
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isAplicable = /Firefox/.test(navigator.userAgent);
	if(isAplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function() {
	co.doubleduck.BaseMenu.call(this);
	this._overWorld = new createjs.Container();
	this._overWorld.scaleX = this._overWorld.scaleY = co.doubleduck.BaseGame.getScale();
	this._overWorld.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._overWorld.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._overWorld);
	this._back = co.doubleduck.BaseAssets.getImage("images/menu/bg.png");
	this._back.regX = this._back.image.width / 2;
	this._back.regY = this._back.image.height / 2;
	this._overWorld.addChild(this._back);
	this._scrollTween = null;
	this._btnPositions = new Array();
	this._btnPositions.push(new createjs.Point(-130,-35));
	this._btnPositions.push(new createjs.Point(120,-60));
	this._btnPositions.push(new createjs.Point(-130,70));
	this._btnPositions.push(new createjs.Point(230,60));
	this._activeRipple = new createjs.Bitmap("images/menu/point_off.png");
	this._activeRipple.regX = this._activeRipple.image.width / 2;
	this._activeRipple.regY = this._activeRipple.image.height / 2;
	this._WorldButtons = new Array();
	this._currActive = co.doubleduck.Persistence.getActiveWorld();
	var _g1 = 0, _g = this._currActive + 1;
	while(_g1 < _g) {
		var i = _g1++;
		this.addPoint(this._btnPositions[i],i + 1);
	}
	this.addPoint(this._btnPositions[this._currActive],this._currActive + 1,true);
	this.activeBtnAnim();
	co.doubleduck.Popup.overworld = this._overWorld;
	co.doubleduck.Popup.menu = this;
	this._worldPopups = new Array();
	var _g1 = 0, _g = co.doubleduck.Persistence.WORLDS_COUNT;
	while(_g1 < _g) {
		var popup = _g1++;
		var p = new co.doubleduck.WorldPopup(popup + 1);
		this._worldPopups.push(p);
		this.addChild(p);
		p.hide(false);
	}
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/button_help.png"));
	this.addChild(this._helpBtn);
	this._helpBtn.regX = this._helpBtn.image.width / 2;
	this._helpBtn.regY = this._helpBtn.image.height / 2;
	this._helpBtn.scaleX = this._helpBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._helpBtn.x = co.doubleduck.BaseGame.getViewport().width * 0.075;
	this._helpBtn.y = co.doubleduck.BaseGame.getViewport().height * 0.89;
	this._helpBtn.onClick = $bind(this,this.showMenu);
	this._muteBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/sound.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
	this.addChild(this._muteBtn);
	this._muteBtn.regX = this._muteBtn.image.width / 2;
	this._muteBtn.regY = this._muteBtn.image.height / 2;
	this._muteBtn.scaleX = this._muteBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._muteBtn.x = this._helpBtn.x + 2 * (this._helpBtn.image.width * co.doubleduck.BaseGame.getScale());
	this._muteBtn.y = this._helpBtn.y + this._helpBtn.image.height * co.doubleduck.BaseGame.getScale() * 0.5;
	this._muteBtn.visible = false;
	if(co.doubleduck.SoundManager.available) {
		this._muteBtn.onToggle = co.doubleduck.SoundManager.toggleMute;
		this._muteBtn.visible = true;
	}
	this.addChild(this._muteBtn);
	this._helpScreen = new co.doubleduck.HelpPopup();
	this.addChild(this._helpScreen);
	this._helpScreen.alpha = 0;
	this._introSound = co.doubleduck.SoundManager.playMusic("sound/general/intro");
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.__super__ = co.doubleduck.BaseMenu;
co.doubleduck.Menu.prototype = $extend(co.doubleduck.BaseMenu.prototype,{
	destroy: function() {
		co.doubleduck.BaseMenu.prototype.destroy.call(this);
		this._activeRipple = null;
		if(this._introSound != null) this._introSound.stop();
	}
	,closeHelp: function() {
		this._helpBtn.alpha = 1;
		this._helpBtn.onClick = $bind(this,this.showMenu);
		this._overWorld.mouseEnabled = true;
	}
	,showMenu: function() {
		createjs.Tween.get(this._helpBtn).to({ alpha : 0},300,createjs.Ease.sineOut);
		this._helpBtn.onClick = null;
		(js.Boot.__cast(this._helpScreen , co.doubleduck.Popup)).onClose = $bind(this,this.closeHelp);
		(js.Boot.__cast(this._helpScreen , co.doubleduck.Popup)).show();
	}
	,showPopup: function(worldId) {
		this._worldPopups[worldId - 1].show();
	}
	,activeBtnAnim: function() {
		if(this._activeRipple == null) return;
		this._WorldButtons[this._currActive].rotation = 360;
		createjs.Tween.get(this._WorldButtons[this._currActive]).to({ rotation : 0},2000).call($bind(this,this.activeBtnAnim));
		this._activeRipple.alpha = 1;
		this._activeRipple.regX = this._activeRipple.image.width / 2;
		this._activeRipple.regY = this._activeRipple.image.height / 2;
		this._activeRipple.scaleX = this._activeRipple.scaleY = 1;
		createjs.Tween.get(this._activeRipple).to({ alpha : 0, scaleX : 4, scaleY : 4},1200);
	}
	,handleWorldBtnClick: function(e) {
		var id = Std.parseInt(e.target.name);
		this.showPopup(id);
	}
	,addPoint: function(pos,worldId,isActive) {
		if(isActive == null) isActive = false;
		var btn;
		if(isActive) {
			this._activeRipple.x = pos.x;
			this._activeRipple.y = pos.y;
			this._overWorld.addChild(this._activeRipple);
			btn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/point.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		} else btn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/point_off.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._overWorld.addChild(btn);
		btn.regX = btn.image.width / 2;
		btn.regY = btn.image.height / 2;
		btn.x = pos.x;
		btn.y = pos.y;
		btn.name = "" + worldId;
		btn.onClick = $bind(this,this.handleWorldBtnClick);
		this._WorldButtons[worldId - 1] = btn;
	}
	,_WorldButtons: null
	,_activeRipple: null
	,_currActive: null
	,_back: null
	,_helpScreen: null
	,_helpBtn: null
	,_muteBtn: null
	,_worldPopups: null
	,_introSound: null
	,_btnPositions: null
	,_scrollTween: null
	,_overWorld: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() { }
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.initGameData = function() {
	co.doubleduck.BasePersistence.GAME_PREFIX = "OGC_";
	if(!co.doubleduck.BasePersistence.available) return;
	co.doubleduck.BasePersistence.initVar("unlocked_level","1");
	var _g1 = 0, _g = co.doubleduck.Persistence.LEVELS_IN_WORLD * co.doubleduck.Persistence.WORLDS_COUNT;
	while(_g1 < _g) {
		var level = _g1++;
		co.doubleduck.BasePersistence.initVar("medal_" + level);
	}
}
co.doubleduck.Persistence.getUnlockedLevelInWorld = function(world) {
	var value = co.doubleduck.Persistence.getUnlockedLevel();
	value -= co.doubleduck.Persistence.LEVELS_IN_WORLD * world;
	if(value > co.doubleduck.Persistence.LEVELS_IN_WORLD) value = co.doubleduck.Persistence.LEVELS_IN_WORLD; else if(value < 1) value = 0;
	return value;
}
co.doubleduck.Persistence.getActiveWorld = function() {
	var currWorld = Math.floor((co.doubleduck.Persistence.getUnlockedLevel() - 1) / co.doubleduck.Persistence.LEVELS_IN_WORLD);
	return Math.min(co.doubleduck.Persistence.WORLDS_COUNT - 1,currWorld) | 0;
}
co.doubleduck.Persistence.getUnlockedLevel = function() {
	var value = co.doubleduck.BasePersistence.getValue("unlocked_level");
	return Std.parseInt(value);
}
co.doubleduck.Persistence.setUnlockedLevel = function(level) {
	co.doubleduck.BasePersistence.setValue("unlocked_level","" + level);
}
co.doubleduck.Persistence.getMedal = function(level) {
	var value = co.doubleduck.BasePersistence.getValue("medal_" + level);
	return Std.parseInt(value);
}
co.doubleduck.Persistence.setMedal = function(level,medal) {
	co.doubleduck.BasePersistence.setValue("medal_" + level,"" + medal);
}
co.doubleduck.Persistence.__super__ = co.doubleduck.BasePersistence;
co.doubleduck.Persistence.prototype = $extend(co.doubleduck.BasePersistence.prototype,{
	__class__: co.doubleduck.Persistence
});
co.doubleduck.PowerUp = $hxClasses["co.doubleduck.PowerUp"] = function(session,type,duration,unlocks,damage) {
	this._session = session;
	this.type = type;
	this.duration = duration;
	this.unlocks = unlocks;
	this.damage = damage;
	co.doubleduck.PowerUp._stunEffect = new createjs.Shape();
	co.doubleduck.PowerUp._stunEffect.graphics.beginFill(createjs.Graphics.getRGB(255,255,255));
	co.doubleduck.PowerUp._stunEffect.x = -co.doubleduck.BaseGame.getViewport().width / 2;
	co.doubleduck.PowerUp._stunEffect.y = -co.doubleduck.BaseGame.getViewport().height / 2;
	co.doubleduck.PowerUp._stunEffect.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	co.doubleduck.PowerUp._stunEffect.graphics.endFill();
	co.doubleduck.PowerUp._fragEffect = new createjs.Container();
	co.doubleduck.PowerUp._fragEffect.x = -co.doubleduck.BaseGame.getViewport().width / 2;
	co.doubleduck.PowerUp._fragEffect.y = -co.doubleduck.BaseGame.getViewport().height / 2;
	co.doubleduck.PowerUp._fragEffect.scaleX = co.doubleduck.PowerUp._fragEffect.scaleY = co.doubleduck.BaseGame.getScale() * 2;
	co.doubleduck.PowerUp._fragBmp0 = co.doubleduck.Utils.getCenteredImage("images/session/power_ups/fire_sd.jpg");
	co.doubleduck.PowerUp._fragBmp1 = co.doubleduck.Utils.getCenteredImage("images/session/power_ups/fire_sd.jpg");
	co.doubleduck.PowerUp._fragBmp2 = co.doubleduck.Utils.getCenteredImage("images/session/power_ups/fire_sd.jpg");
	co.doubleduck.PowerUp._fragEffect.addChild(co.doubleduck.PowerUp._fragBmp2);
	co.doubleduck.PowerUp._fragEffect.addChild(co.doubleduck.PowerUp._fragBmp1);
	co.doubleduck.PowerUp._fragEffect.addChild(co.doubleduck.PowerUp._fragBmp0);
	co.doubleduck.PowerUp._fragBmp0.scaleY = -1;
	co.doubleduck.PowerUp._fragBmp1.scaleX = -1;
	co.doubleduck.PowerUp._adrenalineEffect = new createjs.Container();
	var adrLeft = co.doubleduck.Utils.getCenteredImage("images/session/power_ups/adrenalin_sd.png");
	var adrRight = co.doubleduck.Utils.getCenteredImage("images/session/power_ups/adrenalin2_sd.png");
	adrLeft.regX = 0;
	adrRight.regX = adrRight.image.width;
	adrLeft.scaleX = adrRight.scaleX = adrLeft.scaleY = adrRight.scaleY = co.doubleduck.BaseGame.getScale();
	adrLeft.x = -co.doubleduck.BaseGame.getViewport().width / 2;
	adrRight.x = co.doubleduck.BaseGame.getViewport().width / 2;
	co.doubleduck.PowerUp._adrenalineEffect.addChild(adrLeft);
	co.doubleduck.PowerUp._adrenalineEffect.addChild(adrRight);
};
co.doubleduck.PowerUp.__name__ = ["co","doubleduck","PowerUp"];
co.doubleduck.PowerUp._stunEffect = null;
co.doubleduck.PowerUp._fragEffect = null;
co.doubleduck.PowerUp._fragBmp0 = null;
co.doubleduck.PowerUp._fragBmp1 = null;
co.doubleduck.PowerUp._fragBmp2 = null;
co.doubleduck.PowerUp._adrenalineEffect = null;
co.doubleduck.PowerUp.newPowerUp = function(session,powerUpData) {
	var duration = [Std.parseInt(powerUpData.duration[0]),Std.parseInt(powerUpData.duration[1])];
	var unlocks = Std.parseInt(powerUpData.unlocks);
	var type = Type.createEnum(co.doubleduck.PowerUpType,(js.Boot.__cast(powerUpData.type , String)).toUpperCase());
	var damage = 0;
	if(powerUpData.damage != null) damage = Std.parseInt(powerUpData.damage);
	return new co.doubleduck.PowerUp(session,type,duration,unlocks,damage);
}
co.doubleduck.PowerUp.prototype = {
	disableAdrenaline: function() {
		var _g = this;
		createjs.Tween.get(co.doubleduck.PowerUp._adrenalineEffect).to({ alpha : 0},500).call(function() {
			_g._session.removeChild(co.doubleduck.PowerUp._adrenalineEffect);
			_g._session.isAdrenaline = false;
		});
	}
	,removeEffect: function(obj) {
		this._session.removeChild(obj);
	}
	,'use': function() {
		switch( (this.type)[1] ) {
		case 0:
			co.doubleduck.SoundManager.playEffect("sound/player/powerup_frag");
			var _g = 0, _g1 = this._session.activeEnemies.slice();
			while(_g < _g1.length) {
				var e = _g1[_g];
				++_g;
				e.handleHit(this.damage);
			}
			var d = 500;
			this._session.addChild(co.doubleduck.PowerUp._fragEffect);
			co.doubleduck.PowerUp._fragBmp0.alpha = 1;
			co.doubleduck.PowerUp._fragBmp1.alpha = 1;
			co.doubleduck.PowerUp._fragBmp2.alpha = 1;
			createjs.Tween.get(co.doubleduck.PowerUp._fragBmp0).to({ alpha : 0},d / 3).call($bind(this,this.fadeFrag1),[d]);
			createjs.Tween.get(co.doubleduck.PowerUp._fragEffect).to({ alpha : 0},d);
			new createjs.Tween().wait(d).call($bind(this,this.removeEffect),[co.doubleduck.PowerUp._fragEffect]);
			break;
		case 1:
			co.doubleduck.SoundManager.playEffect("sound/player/powerup_stun");
			var d = this.duration[0] + Std.random(this.duration[1] - this.duration[0]);
			var _g = 0, _g1 = this._session.activeEnemies.slice();
			while(_g < _g1.length) {
				var e = _g1[_g];
				++_g;
				e.pause(d);
				new createjs.Tween().wait(d).call($bind(e,e.resume));
			}
			co.doubleduck.PowerUp._stunEffect.alpha = 1;
			this._session.addChild(co.doubleduck.PowerUp._stunEffect);
			new createjs.Tween().wait(d).call($bind(this,this.removeEffect),[co.doubleduck.PowerUp._stunEffect]);
			createjs.Tween.get(co.doubleduck.PowerUp._stunEffect).to({ alpha : 0},d);
			break;
		case 2:
			co.doubleduck.SoundManager.playEffect("sound/player/powerup_adrenaline");
			this._session.isAdrenaline = true;
			var d = this.duration[0] + Std.random(this.duration[1] - this.duration[0]);
			this._session.addChild(co.doubleduck.PowerUp._adrenalineEffect);
			co.doubleduck.PowerUp._adrenalineEffect.alpha = 0;
			createjs.Tween.get(co.doubleduck.PowerUp._adrenalineEffect).to({ alpha : 1},d / 5).to({ alpha : 0.75},d / 5).to({ alpha : 1},d / 5).to({ alpha : 0.75},d / 5).to({ alpha : 1},d / 5).call($bind(this,this.disableAdrenaline));
			break;
		}
	}
	,fadeFrag2: function(duration) {
		createjs.Tween.get(co.doubleduck.PowerUp._fragBmp2).to({ alpha : 0},duration / 3);
	}
	,fadeFrag1: function(duration) {
		createjs.Tween.get(co.doubleduck.PowerUp._fragBmp1).to({ alpha : 0},duration / 3).call($bind(this,this.fadeFrag2),[duration]);
	}
	,damage: null
	,unlocks: null
	,duration: null
	,type: null
	,_session: null
	,__class__: co.doubleduck.PowerUp
}
co.doubleduck.PowerUpType = $hxClasses["co.doubleduck.PowerUpType"] = { __ename__ : ["co","doubleduck","PowerUpType"], __constructs__ : ["FRAG","STUN","ADRENALINE"] }
co.doubleduck.PowerUpType.FRAG = ["FRAG",0];
co.doubleduck.PowerUpType.FRAG.toString = $estr;
co.doubleduck.PowerUpType.FRAG.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpType.STUN = ["STUN",1];
co.doubleduck.PowerUpType.STUN.toString = $estr;
co.doubleduck.PowerUpType.STUN.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpType.ADRENALINE = ["ADRENALINE",2];
co.doubleduck.PowerUpType.ADRENALINE.toString = $estr;
co.doubleduck.PowerUpType.ADRENALINE.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpButton = $hxClasses["co.doubleduck.PowerUpButton"] = function(pu) {
	this.scaleX = this.scaleY = co.doubleduck.BaseGame.getScale();
	var bmp = "images/session/UI/hud/";
	switch( (pu.type)[1] ) {
	case 0:
		bmp += "button_frag_granade.png";
		break;
	case 1:
		bmp += "button_stun_granade.png";
		break;
	case 2:
		bmp += "button_adrenalin.png";
		break;
	}
	co.doubleduck.Button.call(this,co.doubleduck.BaseAssets.getImage(bmp));
	this.powerUp = pu;
	this.onClick = $bind(this,this.use);
};
co.doubleduck.PowerUpButton.__name__ = ["co","doubleduck","PowerUpButton"];
co.doubleduck.PowerUpButton.__super__ = co.doubleduck.Button;
co.doubleduck.PowerUpButton.prototype = $extend(co.doubleduck.Button.prototype,{
	'use': function() {
		if(createjs.Ticker.getPaused() || !(js.Boot.__cast(this.parent , co.doubleduck.Hud)).isActive()) return;
		this.visible = false;
		this.powerUp["use"]();
	}
	,powerUp: null
	,__class__: co.doubleduck.PowerUpButton
});
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(properties) {
	this._coverPictureBaseFactor = 0.88;
	this._isGameOver = false;
	co.doubleduck.BaseSession.call(this);
	this.isActive = true;
	this._lastMousePos = new createjs.Point(0,0);
	co.doubleduck.BaseGame.hammer.ondrag = $bind(this,this.updateMouse);
	this._locations = new Array();
	this._levelData = co.doubleduck.DataLoader.getLevel(co.doubleduck.Session.currWorld,co.doubleduck.Session.currLevel);
	this.maxPlayerHp = this.playerHp = this._levelData.playerHp | 0;
	this._enemyIdInLevel = new Array();
	this._spawnInterval = this._levelData.spawnInterval | 0;
	var e = 0;
	var hasBossAlready = false;
	while(e < this.getEnemyNumber()) {
		var enemyId = this._levelData.enemies[Std.random(this._levelData.enemies.length)] | 0;
		var enemGraphicsId = Std.parseInt(co.doubleduck.DataLoader.getEnemy(enemyId).graphicsId);
		if(enemGraphicsId >= co.doubleduck.Enemy.ENEMY_NUM / 3) {
			if(hasBossAlready) continue; else hasBossAlready = true;
		}
		this._enemyIdInLevel.push(enemyId);
		e++;
	}
	if(!hasBossAlready) {
		var bossForLevel = -1;
		var _g1 = 0, _g = this._levelData.enemies.length;
		while(_g1 < _g) {
			var i = _g1++;
			var enemGraphicsId = Std.parseInt(co.doubleduck.DataLoader.getEnemy(this._levelData.enemies[i] | 0).graphicsId);
			if(enemGraphicsId >= co.doubleduck.Enemy.ENEMY_NUM / 3) bossForLevel = this._levelData.enemies[i] | 0;
		}
		if(bossForLevel != -1) {
			this._enemyIdInLevel.pop();
			this._enemyIdInLevel.push(bossForLevel);
		}
	}
	this.powerUps = new Array();
	var _g = 0, _g1 = co.doubleduck.DataLoader.getAllPowerUps();
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		this.powerUps.push(co.doubleduck.PowerUp.newPowerUp(this,p));
	}
	this.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this._level = new createjs.Container();
	this.addChild(this._level);
	this._hitRect = new createjs.Shape();
	this._hitRect.graphics.beginFill(createjs.Graphics.getRGB(255,255,255));
	this._hitRect.x -= co.doubleduck.BaseGame.getViewport().width / 2;
	this._hitRect.y -= co.doubleduck.BaseGame.getViewport().height / 2;
	this._hitRect.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._hitRect.alpha = 0.01;
	this.addBackground();
	this.activeEnemies = new Array();
	this._enemyContainers = new Array();
	this._covers = new Array();
	var _g = 0, _g1 = Type.allEnums(co.doubleduck.Layer);
	while(_g < _g1.length) {
		var layer = _g1[_g];
		++_g;
		this.addEnemyLayer(layer);
		this.addCoverLayer(layer);
	}
	this._gun = new co.doubleduck.Gun(co.doubleduck.DataLoader.getMaxUnlockedGun());
	this._isShootingAutomatic = false;
	if(this._gun.isAutomatic) this._hitRect.onPress = $bind(this,this.playerStartedShooting); else this._hitRect.onPress = $bind(this,this.playerSingleShot);
	this.addChild(this._hitRect);
	this.addHud();
	createjs.Tween.get(this).wait(1000).call($bind(this,this.popOutRandomEnemy));
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.currWorld = null;
co.doubleduck.Session.currLevel = null;
co.doubleduck.Session._levelOver = null;
co.doubleduck.Session.__super__ = co.doubleduck.BaseSession;
co.doubleduck.Session.prototype = $extend(co.doubleduck.BaseSession.prototype,{
	handleMenuClick: function() {
		if(this._levelOverSound != null) this._levelOverSound.stop();
		co.doubleduck.BaseSession.prototype.handleMenuClick.call(this);
	}
	,showEndGame: function() {
		this.removeChild(co.doubleduck.Session._levelOver);
		co.doubleduck.Session._levelOver.onMenu = null;
		co.doubleduck.Session._levelOver.onRestart = null;
		co.doubleduck.Session._levelOver.onNext = null;
		this._gameOver = new co.doubleduck.GameOverPopup();
		this._gameOver.onMenu = $bind(this,this.handleMenuClick);
		this._gameOver.init();
		this.addChild(this._gameOver);
		this._gameOver.show();
	}
	,nextLevel: function() {
		co.doubleduck.Session.currLevel++;
		if(co.doubleduck.Session.currLevel > 10) {
			co.doubleduck.Session.currLevel = 1;
			co.doubleduck.Session.currWorld++;
		}
		if(co.doubleduck.Session.currWorld > 4) {
			co.doubleduck.Session.currWorld = 4;
			co.doubleduck.Session.currLevel = 10;
			this._isGameOver = true;
			return;
		}
		var lvl = (co.doubleduck.Session.currWorld - 1) * co.doubleduck.Persistence.LEVELS_IN_WORLD + co.doubleduck.Session.currLevel;
		if(lvl > co.doubleduck.Persistence.getUnlockedLevel()) co.doubleduck.Persistence.setUnlockedLevel(lvl);
	}
	,destroy: function() {
		co.doubleduck.BaseSession.prototype.destroy.call(this);
		if(this.activeEnemies != null && this.activeEnemies.length > 0) {
			var _g = 0, _g1 = this.activeEnemies;
			while(_g < _g1.length) {
				var e = _g1[_g];
				++_g;
				e.disable();
			}
			this.activeEnemies = null;
			createjs.Tween.removeTweens(this);
			this.isActive = false;
		}
	}
	,showLevelOverPopup: function(won) {
		if(!this.isActive) return;
		this.isActive = false;
		var oldGun = co.doubleduck.DataLoader.getMaxUnlockedGun();
		this._hud.disableButtons();
		var totalLevel = (co.doubleduck.Session.currWorld - 1) * co.doubleduck.Persistence.LEVELS_IN_WORLD + co.doubleduck.Session.currLevel;
		var currMedal = co.doubleduck.Persistence.getMedal(totalLevel);
		var newMedal = 0;
		if(won) {
			this.nextLevel();
			newMedal++;
			this._levelOverSound = co.doubleduck.SoundManager.playEffect("sound/general/Win");
			if(this.playerHp >= this.maxPlayerHp * 0.4) newMedal++;
			if(this._shotsHit / this._shotsShot >= 0.85) newMedal++;
		} else this._levelOverSound = co.doubleduck.SoundManager.playEffect("sound/general/Lose");
		if(newMedal > currMedal) co.doubleduck.Persistence.setMedal(totalLevel,newMedal);
		var newGun = co.doubleduck.DataLoader.getMaxUnlockedGun();
		var newPower = null;
		var powers = co.doubleduck.DataLoader.getAllPowerUps();
		var actualLevel = (co.doubleduck.Session.currWorld - 1) * 10 + co.doubleduck.Session.currLevel;
		var _g1 = 0, _g = powers.length;
		while(_g1 < _g) {
			var i = _g1++;
			if((powers[i].unlocks | 0) == actualLevel) newPower = powers[i];
		}
		this._hud.hidePauseBtn();
		co.doubleduck.Session._levelOver = new co.doubleduck.LevelOverPopup(won,newGun != oldGun,newMedal,newPower);
		if(this._isGameOver) {
			co.doubleduck.Session._levelOver.onMenu = $bind(this,this.showEndGame);
			co.doubleduck.Session._levelOver.onRestart = $bind(this,this.showEndGame);
			co.doubleduck.Session._levelOver.onNext = $bind(this,this.showEndGame);
		} else {
			co.doubleduck.Session._levelOver.onMenu = $bind(this,this.handleMenuClick);
			co.doubleduck.Session._levelOver.onRestart = $bind(this,this.handleRestart);
			co.doubleduck.Session._levelOver.onNext = $bind(this,this.handleRestart);
		}
		co.doubleduck.Session._levelOver.init(won);
		this.addChild(co.doubleduck.Session._levelOver);
		co.doubleduck.Session._levelOver.show();
		var _g = 0, _g1 = this.activeEnemies;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.disable();
		}
		this.activeEnemies = null;
	}
	,hitPlayer: function(damage) {
		if(this.isAdrenaline || !this.isActive || this.isHiding || this.playerHp <= 0) return;
		this._hud.showHurt();
		this.playerHp -= damage;
		this.playerHp = Math.max(0,this.playerHp) | 0;
		this._hud.setHpBar(this.playerHp / this.maxPlayerHp);
		if(this.playerHp == 0) this._hud.showDead();
	}
	,getRandomFreeLocation: function() {
		var loc = null;
		var tries = 0;
		do {
			tries++;
			loc = co.doubleduck.Utils.getRandomElement(this._locations);
		} while(tries < 100 && loc.currentEnemy != null);
		return loc;
	}
	,getEnemyNumber: function() {
		return this._levelData.enemiesNumber | 0;
	}
	,reload: function() {
		this.setAmmo(this.getMaxAmmo());
		this._hud.setAmmo(this.getAmmo());
		this._hud.hideReloadOverlay();
		co.doubleduck.SoundManager.playEffect("sound/player/reload");
	}
	,onContinue: function() {
		this._hud.showPauseBtn();
		createjs.Ticker.setPaused(false);
	}
	,handleContinue: function() {
		this.onContinue();
	}
	,handleBackToMenu: function() {
		this.onBackToMenu();
	}
	,handleRestart: function() {
		this.onRestart();
	}
	,addHud: function() {
		this._hud = new co.doubleduck.Hud(this,this._background);
		this._hud.onRestart = $bind(this,this.handleRestart);
		this._hud.onMenu = $bind(this,this.handleBackToMenu);
		this._hud.onContinue = $bind(this,this.handleContinue);
		this.addChild(this._hud);
	}
	,getLayerFileName: function(coverSetId,layer) {
		return this.getWorldDir() + "layout" + coverSetId + "/layer_" + layer[0].toLowerCase() + "_layout" + coverSetId + ".png";
	}
	,getWorldDir: function() {
		switch(co.doubleduck.Session.currWorld) {
		case 1:
			return "images/session/1st_world_plant/";
		case 2:
			return "images/session/2nd_world_roof/";
		case 3:
			return "images/session/3rd_world_jungle/";
		case 4:
			return "images/session/4th_world_palace/";
		}
		throw "Invalid world number";
	}
	,onUnHide: function(event) {
		if(!this.isHiding) return;
		this.isHiding = false;
		var _g = 0, _g1 = this.activeEnemies;
		while(_g < _g1.length) {
			var activeEnemy = _g1[_g];
			++_g;
			if(!activeEnemy.isMoving) this.popOutExistingActiveEnemy(activeEnemy);
		}
		createjs.Tween.removeTweens(this._level);
		createjs.Tween.removeTweens(this._coverPicture);
		createjs.Tween.get(this._level).to({ y : 0},200,createjs.Ease.sineInOut);
		createjs.Tween.get(this._coverPicture).to({ y : this._background.image.height * this._coverPictureBaseFactor * co.doubleduck.BaseGame.getScale()},200,createjs.Ease.sineInOut);
	}
	,onHide: function() {
		this.isHiding = true;
		createjs.Tween.get(this._coverPicture).to({ y : co.doubleduck.BaseGame.getScale() * (this._background.image.height - this._coverPicture.image.height)},150,createjs.Ease.sineInOut);
		createjs.Tween.get(this._level).to({ y : co.doubleduck.BaseGame.getScale() * -this._coverPicture.image.height / 10},150,createjs.Ease.sineInOut).call($bind(this,this.reload));
	}
	,normalizeY: function(y) {
		return y - this._background.image.height / 2 | 0;
	}
	,normalizeX: function(x) {
		return x - this._background.image.width / 2 | 0;
	}
	,addLocationsInLayer: function(locations,enemyContainer) {
		var _g = 0;
		while(_g < locations.length) {
			var loc = locations[_g];
			++_g;
			var scale = Std.parseFloat(loc.scale);
			var rotation = Std.parseInt(loc.rotation);
			var endY = this.normalizeY(Std.parseInt(loc.end[1]));
			var endX = this.normalizeX(Std.parseInt(loc.end[0]));
			var startY = this.normalizeY(Std.parseInt(loc.start[1]));
			var startX = this.normalizeX(Std.parseInt(loc.start[0]));
			var xShift = Std.parseInt(loc.width) / 2 | 0;
			var yShift = Std.parseInt(loc.height) / 2 | 0;
			this._locations.push(new co.doubleduck.Location(startX + xShift,startY + yShift,endX + xShift,endY + yShift,scale,rotation,enemyContainer));
		}
	}
	,addEnemyLayer: function(layer) {
		var enemyContainer = new createjs.Container();
		this._enemyContainers.push(enemyContainer);
		enemyContainer.scaleX = enemyContainer.scaleY = co.doubleduck.BaseGame.getScale();
		this._level.addChild(enemyContainer);
		this.addLocationsInLayer(co.doubleduck.DataLoader.getLocations(co.doubleduck.Session.currWorld,co.doubleduck.Session.currLevel,layer),enemyContainer);
	}
	,addCoverLayer: function(layer) {
		var layout = co.doubleduck.DataLoader.getCoverSetIdOfLevel(co.doubleduck.Session.currWorld,co.doubleduck.Session.currLevel);
		var filename = this.getLayerFileName(layout,layer);
		var coverImage = co.doubleduck.Utils.getCenteredImage(filename);
		coverImage.scaleX = coverImage.scaleY = co.doubleduck.BaseGame.getScale();
		this._covers.push(coverImage);
		this._level.addChild(coverImage);
	}
	,addBackground: function() {
		var bg = "";
		switch(co.doubleduck.Session.currWorld) {
		case 1:
			bg = this.getWorldDir() + "plant_bg.jpg";
			break;
		case 2:
			bg = this.getWorldDir() + "roof_bg.jpg";
			break;
		case 3:
			bg = this.getWorldDir() + "jungle_bg.jpg";
			break;
		case 4:
			bg = this.getWorldDir() + "palace_bg.jpg";
			break;
		}
		this._background = co.doubleduck.Utils.getCenteredImage(bg,true);
		this._background.scaleX = this._background.scaleY = this._background.scaleY + 0.01;
		this._level.addChild(this._background);
		this._coverPicture = co.doubleduck.Utils.getCenteredImage(this.getWorldDir() + "cover.png",true);
		this._coverPicture.y += this._background.image.height * this._coverPictureBaseFactor * co.doubleduck.BaseGame.getScale();
		this.addChild(this._coverPicture);
	}
	,popOutRandomEnemy: function() {
		if(!this.isActive) return;
		var variance = Std.random(3) - 1;
		variance = variance / 10;
		var interval = this._spawnInterval + (this._spawnInterval * variance | 0);
		createjs.Tween.get(this).wait(interval).call($bind(this,this.popOutRandomEnemy));
		if(this.isHiding) return;
		if(this._enemyIdInLevel.length > 0) {
			var eId = co.doubleduck.Utils.getRandomElement(this._enemyIdInLevel);
			var enemGraphicsId = Std.parseInt(co.doubleduck.DataLoader.getEnemy(eId).graphicsId);
			var loc = this.getRandomFreeLocation();
			if(loc != null && loc.currentEnemy == null) {
				HxOverrides.remove(this._enemyIdInLevel,eId);
				var e = null;
				if(enemGraphicsId + 1 > co.doubleduck.Enemy.ENEMY_NUM / 3) e = new co.doubleduck.Boss(this,eId,loc.startX,loc.startY,loc.endX,loc.endY,loc.scale,loc.rotation,loc); else e = new co.doubleduck.Enemy(this,eId,loc.startX,loc.startY,loc.endX,loc.endY,loc.scale,loc.rotation,loc);
				loc.currentEnemy = e;
				this.activeEnemies.push(e);
				loc.layerContainer.addChild(e.sprite);
				e.popOut();
			} else {
			}
		} else {
		}
	}
	,popOutExistingActiveEnemy: function(e) {
		if(e.isBoss) {
			e.location.layerContainer.removeChild(e.sprite);
			e.location.currentEnemy = null;
			e.location = null;
			var loc = this.getRandomFreeLocation();
			e.setLocation(loc.startX,loc.startY,loc.endX,loc.endY,loc.scale,loc.rotation,loc);
			e.location.currentEnemy = e;
			e.location.layerContainer.addChild(e.sprite);
		}
		e.popOut();
	}
	,shooting: function() {
		if(this._isShootingAutomatic) {
			this.playerSingleShot();
			createjs.Tween.get(this).wait(this._gun.rateOfFire).call($bind(this,this.shooting));
		}
	}
	,playerStopedShooting: function(e) {
		this._isShootingAutomatic = false;
	}
	,playerStartedShooting: function(e) {
		this._isShootingAutomatic = true;
		this._lastMousePos.x = e.stageX;
		this._lastMousePos.y = e.stageY;
		this.shooting();
		e.onMouseUp = $bind(this,this.playerStopedShooting);
	}
	,playerSingleShot: function(e) {
		this._shotsShot++;
		if(e != null) {
			this._lastMousePos.x = e.stageX;
			this._lastMousePos.y = e.stageY;
		}
		if(createjs.Ticker.getPaused() || !this.isActive || this.playerHp < 1) return;
		if(this.getAmmo() > 0) {
			this.useAmmo();
			this.hitTests();
			var gunName = "" + Std.string(this._gun.type);
			co.doubleduck.SoundManager.playEffect("sound/weapons/" + gunName.toLowerCase());
		}
	}
	,hitTests: function() {
		var layer = 2;
		while(layer > -1) {
			var cover = this._covers[layer];
			var pointInCover = cover.globalToLocal(this._lastMousePos.x,this._lastMousePos.y);
			if(cover.hitTest(pointInCover.x,pointInCover.y)) return;
			var _g = 0, _g1 = this._enemyContainers[layer].children;
			while(_g < _g1.length) {
				var enemy = _g1[_g];
				++_g;
				var pointInEnemy = enemy.globalToLocal(this._lastMousePos.x,this._lastMousePos.y);
				if(enemy.hitTest(pointInEnemy.x,pointInEnemy.y)) {
					if(js.Boot.__instanceof(enemy,co.doubleduck.EnemyBitmapAnimation)) (js.Boot.__cast(enemy , co.doubleduck.EnemyBitmapAnimation)).enemy.handleHit(); else (js.Boot.__cast((js.Boot.__cast(enemy , createjs.Container)).getChildAt(0) , co.doubleduck.EnemyBitmapAnimation)).enemy.handleHit();
					return;
				}
			}
			layer--;
		}
	}
	,updateMouse: function(e) {
		this._lastMousePos.x = js.Boot.__cast(e.position.x , Float);
		this._lastMousePos.y = js.Boot.__cast(e.position.y , Float);
	}
	,useAmmo: function() {
		this._hud.muzzleFlash();
		if(!this.isAdrenaline) {
			var _g = this, _g1 = _g.getAmmo();
			_g.setAmmo(_g1 - 1);
			_g1;
			this._hud.setAmmo(this.getAmmo());
			if(this.getAmmo() == 0) this._hud.showReload();
		}
	}
	,kill: function(e,isKilled) {
		if(isKilled == null) isKilled = true;
		if(isKilled) {
			this._shotsHit++;
			if(e.location.currentEnemy == e) e.location.currentEnemy = null; else throw "Error - discrepancy between locations and enemies that occupy them!";
		} else e.location.currentEnemy = null;
		if(this.activeEnemies != null) {
			var hasRemoved = HxOverrides.remove(this.activeEnemies,e);
		}
		if(isKilled) {
			if(this._enemyIdInLevel.length < 1 && this.activeEnemies.length < 1) this.showLevelOverPopup(true);
		}
		var _g = 0, _g1 = this._enemyContainers;
		while(_g < _g1.length) {
			var conteiner = _g1[_g];
			++_g;
			var _g2 = 0, _g3 = this._enemyContainers;
			while(_g2 < _g3.length) {
				var ee = _g3[_g2];
				++_g2;
				if(conteiner.removeChild(e.sprite)) return;
			}
		}
	}
	,setKills: function(k) {
		this._hud.setKills(k);
	}
	,_spawnInterval: null
	,_enemyIdInLevel: null
	,activeEnemies: null
	,_gameOver: null
	,_hud: null
	,_covers: null
	,_enemyContainers: null
	,_coverPictureBaseFactor: null
	,_coverPicture: null
	,_background: null
	,_levelOverSound: null
	,_locations: null
	,_levelData: null
	,isAdrenaline: null
	,setAmmo: function(a) {
		return this._gun.ammo = a;
	}
	,getAutomatic: function() {
		return this._gun.isAutomatic;
	}
	,getGunType: function() {
		return this._gun.type;
	}
	,getAmmo: function() {
		return this._gun.ammo;
	}
	,getMaxAmmo: function() {
		return this._gun.maxAmmo;
	}
	,isAutomatic: null
	,gunType: null
	,ammo: null
	,maxAmmo: null
	,_gun: null
	,_isShootingAutomatic: null
	,_isGameOver: null
	,_shotsHit: null
	,_shotsShot: null
	,isActive: null
	,powerUps: null
	,playerHp: null
	,maxPlayerHp: null
	,isHiding: null
	,kills: null
	,_level: null
	,_hitRect: null
	,_lastMousePos: null
	,__class__: co.doubleduck.Session
	,__properties__: {get_maxAmmo:"getMaxAmmo",set_ammo:"setAmmo",get_ammo:"getAmmo",get_gunType:"getGunType",get_isAutomatic:"getAutomatic"}
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","HOWLER","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.HOWLER = ["HOWLER",3];
co.doubleduck.SoundType.HOWLER.toString = $estr;
co.doubleduck.SoundType.HOWLER.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",4];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	haxe.Log.trace("decode error",{ fileName : "WebAudioAPI.hx", lineNumber : 64, className : "co.doubleduck.audio.WebAudioAPI", methodName : "decodeError"});
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.BasePersistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.BasePersistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	return false;
}
co.doubleduck.SoundManager.mute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
	co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.unmute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(1);
	}
	co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
}
co.doubleduck.SoundManager.isMuted = function() {
	co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			audio = new co.doubleduck.audio.HowlerAudio(src);
			break;
		case 4:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() { }
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.isMobileFirefox = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox && viewporter.ACTIVE;
}
co.doubleduck.Utils.get = function(x,y,tiles,columns) {
	return tiles[columns * y + x];
}
co.doubleduck.Utils.getBitmapLabel = function(label,fontType,padding) {
	if(padding == null) padding = 0;
	if(fontType == null) fontType = "";
	var fontHelper = new co.doubleduck.FontHelper(fontType);
	var bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
	return bitmapText;
}
co.doubleduck.Utils.concatWithoutDuplicates = function(array,otherArray) {
	var _g = 0;
	while(_g < otherArray.length) {
		var element = otherArray[_g];
		++_g;
		co.doubleduck.Utils.addToArrayWithoutDuplicates(array,element);
	}
	return array;
}
co.doubleduck.Utils.addToArrayWithoutDuplicates = function(array,element) {
	var _g = 0;
	while(_g < array.length) {
		var currElement = array[_g];
		++_g;
		if(currElement == element) return array;
	}
	array.push(element);
	return array;
}
co.doubleduck.Utils.getImageData = function(image) {
	var ctx = co.doubleduck.Utils.getCanvasContext();
	var img = co.doubleduck.BaseAssets.getImage(image);
	ctx.drawImage(img.image,0,0);
	return ctx.getImageData(0,0,img.image.width,img.image.height);
}
co.doubleduck.Utils.getCanvasContext = function() {
	var dom = js.Lib.document.createElement("Canvas");
	var canvas = dom;
	return canvas.getContext("2d");
}
co.doubleduck.Utils.joinArrays = function(a1,a2) {
	var arr = a1.slice();
	var _g = 0;
	while(_g < a2.length) {
		var el = a2[_g];
		++_g;
		arr.push(el);
	}
	return arr;
}
co.doubleduck.Utils.getRandomElement = function(arr) {
	return arr[Std.random(arr.length)];
}
co.doubleduck.Utils.splitArray = function(arr,parts) {
	var arrs = new Array();
	var _g = 0;
	while(_g < parts) {
		var p = _g++;
		arrs.push(new Array());
	}
	var currArr = 0;
	while(arr.length > 0) {
		arrs[currArr].push(arr.pop());
		currArr++;
		currArr %= parts;
	}
	return arrs;
}
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.getCenteredImage = function(name,scaleToGame) {
	if(scaleToGame == null) scaleToGame = false;
	var img = co.doubleduck.BaseAssets.getImage(name);
	img.regX = img.image.width / 2;
	img.regY = img.image.height / 2;
	if(scaleToGame) img.scaleX = img.scaleY = co.doubleduck.BaseGame.getScale();
	return img;
}
co.doubleduck.Utils.setCenterReg = function(bmp) {
	bmp.regX = bmp.image.width / 2;
	bmp.regY = bmp.image.height / 2;
}
co.doubleduck.Utils.shuffleArray = function(arr) {
	var tmp, j, i = arr.length;
	while(i > 0) {
		j = Math.random() * i | 0;
		tmp = arr[--i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
co.doubleduck.WorldPopup = $hxClasses["co.doubleduck.WorldPopup"] = function(id) {
	co.doubleduck.Popup.call(this);
	this.worldId = id;
	var level = 0;
	var _g1 = 0, _g = co.doubleduck.WorldPopup.ROWS;
	while(_g1 < _g) {
		var yy = _g1++;
		var _g3 = 0, _g2 = co.doubleduck.WorldPopup.COLS;
		while(_g3 < _g2) {
			var xx = _g3++;
			level++;
			this.addLevelButton(xx,yy,level);
		}
	}
};
co.doubleduck.WorldPopup.__name__ = ["co","doubleduck","WorldPopup"];
co.doubleduck.WorldPopup.__super__ = co.doubleduck.Popup;
co.doubleduck.WorldPopup.prototype = $extend(co.doubleduck.Popup.prototype,{
	isLevelLatestUnlocked: function(level) {
		return level == co.doubleduck.Persistence.getUnlockedLevelInWorld(this.worldId - 1);
	}
	,isLevelLocked: function(level) {
		return level > co.doubleduck.Persistence.getUnlockedLevelInWorld(this.worldId - 1);
	}
	,startLevel: function(level) {
		co.doubleduck.Session.currWorld = this.worldId;
		co.doubleduck.Session.currLevel = level;
		if((js.Boot.__cast(co.doubleduck.Popup.menu , co.doubleduck.Menu)).onPlayClick != null) (js.Boot.__cast(co.doubleduck.Popup.menu , co.doubleduck.Menu)).onPlayClick();
	}
	,addLevelButton: function(xx,yy,level) {
		var _g = this;
		var btn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/level_block.png"));
		var baseX = -this._background.image.width / 2 + this._background.image.width * 0.15;
		var baseY = -this._background.image.height / 2 + this._background.image.width / 4;
		var shiftX = btn.image.width * 1.04;
		var shiftY = btn.image.height * 1.1;
		btn.x = baseX + shiftX * xx;
		btn.y = baseY + shiftY * yy;
		btn.regX = btn.image.width / 2;
		btn.regY = btn.image.height / 2;
		this.addChild(btn);
		if(this.isLevelLocked(level)) {
			btn.alpha = 0.5;
			var lock = co.doubleduck.BaseAssets.getImage("images/menu/lock.png");
			lock.regX = lock.image.width / 2;
			lock.regY = lock.image.height / 2;
			lock.x = btn.x;
			lock.y = btn.y;
			this.addChild(lock);
		} else {
			btn.addBitmapLabel("" + level,"images/menu/font/");
			btn.onClick = function() {
				createjs.Tween.get(co.doubleduck.Popup.menu).to({ alpha : 0},300,createjs.Ease.sineOut).call(function() {
					_g.startLevel(level);
				});
			};
			if(this.worldId != co.doubleduck.Persistence.getActiveWorld() + 1 || !this.isLevelLatestUnlocked(level)) {
				btn.alpha = 0.65;
				var medal = null;
				var totalLevel = (this.worldId - 1) * co.doubleduck.Persistence.LEVELS_IN_WORLD + level;
				var medalType = co.doubleduck.Persistence.getMedal(totalLevel);
				switch(medalType) {
				case 1:
					medal = co.doubleduck.BaseAssets.getImage("images/menu/bronze.png");
					break;
				case 2:
					medal = co.doubleduck.BaseAssets.getImage("images/menu/silver.png");
					break;
				case 3:
					medal = co.doubleduck.BaseAssets.getImage("images/menu/gold.png");
					break;
				}
				if(medal != null) {
					medal.regX = medal.image.width;
					medal.regY = medal.image.height;
					medal.x = btn.image.width * 1.1;
					medal.y = btn.image.height * 0.9;
					btn.addChild(medal);
				}
			}
		}
	}
	,worldId: null
	,__class__: co.doubleduck.WorldPopup
});
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HowlerAudio = $hxClasses["co.doubleduck.audio.HowlerAudio"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HowlerAudio.__name__ = ["co","doubleduck","audio","HowlerAudio"];
co.doubleduck.audio.HowlerAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HowlerAudio._currentlyPlaying = null;
co.doubleduck.audio.HowlerAudio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.volume = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,1);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		var myUrls = new Array();
		myUrls.push(this._src + ".mp3");
		myUrls.push(this._src + ".ogg");
		this._jsAudio = new Howl({urls: myUrls, loop: false});
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.HowlerAudio
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.BaseAssets.onLoadAll = null;
co.doubleduck.BaseAssets._loader = null;
co.doubleduck.BaseAssets._cacheData = { };
co.doubleduck.BaseAssets._loadCallbacks = { };
co.doubleduck.BaseAssets.loaded = 0;
co.doubleduck.BaseAssets._useLocalStorage = false;
co.doubleduck.BaseGame._viewport = null;
co.doubleduck.BaseGame._scale = 1;
co.doubleduck.BaseGame.DEBUG = false;
co.doubleduck.BaseGame.LOGO_URI = "images/duckling/splash_logo.png";
co.doubleduck.BaseGame.LOAD_STROKE_URI = "images/duckling/loading_stroke.png";
co.doubleduck.BaseGame.LOAD_FILL_URI = "images/duckling/loading_fill.png";
co.doubleduck.BaseGame.ORIENT_PORT_URI = "images/duckling/orientation_error_port.png";
co.doubleduck.BaseGame.ORIENT_LAND_URI = "images/duckling/orientation_error_land.png";
co.doubleduck.BasePersistence.GAME_PREFIX = "DUCK";
co.doubleduck.BasePersistence.available = co.doubleduck.BasePersistence.localStorageSupported();
co.doubleduck.Enemy.ENEMIES = "images/enemies/enemies.png";
co.doubleduck.Enemy.ENEMY_NUM = 30;
co.doubleduck.Enemy.ENEMY_COLS = 6;
co.doubleduck.Enemy.ENEMY_ROWS = Math.round(co.doubleduck.Enemy.ENEMY_NUM / co.doubleduck.Enemy.ENEMY_COLS);
co.doubleduck.Enemy.BOSSES = "images/enemies/bosses.png";
co.doubleduck.Enemy.BOSS_NUM = 12;
co.doubleduck.Enemy.BOSS_COLS = 6;
co.doubleduck.Enemy.BOSS_ROWS = Math.round(co.doubleduck.Enemy.BOSS_NUM / co.doubleduck.Enemy.BOSS_COLS);
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Button.CLICK_TYPE_HOLD = 5;
co.doubleduck.Button._defaultSound = null;
co.doubleduck.GameOverPopup.BACK_TO_MENU = "images/session/UI/end_game/back_to_menu_button.png";
co.doubleduck.GameOverPopup.BACKGROUND = "images/session/UI/end_game/game_end_pop_up.png";
co.doubleduck.LevelOverPopup.MENU = "images/session/UI/end_level/menu_button_sd.png";
co.doubleduck.LevelOverPopup.NEXT = "images/session/UI/end_level/next_button_sd.png";
co.doubleduck.LevelOverPopup.RESTART = "images/session/UI/end_level/restart_button_sd.png";
co.doubleduck.LevelOverPopup.UPGRADE = "images/session/UI/end_level/upgrade_stamp.png";
co.doubleduck.Persistence.LEVELS_IN_WORLD = 10;
co.doubleduck.Persistence.WORLDS_COUNT = 4;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = false;
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.WorldPopup.COLS = 5;
co.doubleduck.WorldPopup.ROWS = Math.round(co.doubleduck.Persistence.LEVELS_IN_WORLD / co.doubleduck.WorldPopup.COLS);
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HowlerAudio._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();
