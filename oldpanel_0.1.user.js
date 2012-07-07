// ==UserScript==
// @name           Oldbk plugin panel
// @namespace http://oldpanel.pz9.ru
// @description    Панель плагинов oldbk.com
// @include http://*.oldbk.com/*
// @match http://*.oldbk.com/*
// ==/UserScript==

(function(){
var Plugin_loader = {
	version: '0.1',
	load: false,
	ready: function(){
		if(this.load == false){
			this.load = true;
			if(document.URL.indexOf("Default12345.aspx")!=-1||document.URL.indexOf("/battle.php")!=-1){
				this.checkversion();
				this.loader();
			}
        }
	},
	check_version: function(){
		var req = this.getXmlHttp();
		req.onreadystatechange = function() {
			if (req.readyState == 4) {
				if(req.status == 200) {
					if(req.responseText != pv){
						if(confirm('Ваша версия панели: '+pv+'.\nТекущая версия панели: '+req.responseText+'\nПерейти на страницу загрузки обновлений')){
							window.open('http://oldpanel.pz9.ru');
						}
					}
				}
			}
		}
		req.open('GET', 'http://oldpanel.pz9.ru/p/version.txt', true); 
		req.send(null);
	},
	getXmlHttp: function(){
		var xmlhttp;
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}
		if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
			xmlhttp = new XMLHttpRequest();
		}
		return xmlhttp;
	},
	loader: function(){
        var b = document.body;
        b.setAttribute("rows", "27,0,*,30");
        var f = document.createElement("frame");
        f.setAttribute("name","oldpanel_frame");
        f.src = "oldpanel_frame.html";
        b.insertBefore(f,b.firstChild);
        this.CreatePanel(f);
	},
	CreatePanel: function(f){
        var mw=null;
        if(f.contentDocument)
            mw=f.contentDocument;
        else if(f.contentWindow.document)
            mw=f.contentWindow.document;
        if (mw) {
            var CW=f.contentWindow;
            mw.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
                '<html><head><script type="text/javascript">'+
                'var panel_init=false;'+
                'function init_panel(){if(!panel_init){panel_init=true;var doc_head=document.getElementsByTagName("head")[0];'+
                'var js_main_init = document.createElement("script");'+
                'js_main_init.setAttribute("type", "text/javascript");'+
                'js_main_init.setAttribute("src", "http://oldpanel.pz9.ru/p/'+Plugin_loader.version+'/main.js");'+
                'js_main_init.setAttribute("charset", "utf-8");'+
                'doc_head.appendChild(js_main_init);}}'+
                '<\/script></head>'+
                '<body>Подождите идет загрузка панели...</body>'+
                '<script type="text/javascript">'+
                'var doc_head=document.getElementsByTagName("head")[0];'+
                'var js_jquery_init = document.createElement("script");'+
                'js_jquery_init.setAttribute("type", "text/javascript");'+
                'if(js_jquery_init.addEventListener){'+
                'js_jquery_init.addEventListener("load",function(){init_panel();},false)'+
                '}else if(js_jquery_init.attachEvent){'+
                'js_jquery_init.attachEvent("onreadystatechange", function(){if(js_jquery_init.readyState == "complete"||js_jquery_init.readyState == "loaded") {init_panel();}}) }'+
                'js_jquery_init.setAttribute("src", "http://yandex.st/jquery/1.7.2/jquery.min.js");'+
                'html_doc.appendChild(js_jquery_init);<\/script></html>');
        }else{
            setTimeout(function() {
                Plugin_loader.CreatePanel(f);
            }, 1000);
        }		
	},
	init: function(){
		if (document.addEventListener) {
			document.addEventListener("load", function() {Plugin_loader.ready()}, false);
		} else if (document.attachEvent) {
			window.attachEvent( "onload", Plugin_loader.ready );
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState === "complete") {
					Plugin_loader.ready();
				}
			})
		}
		if (window.addEventListener){
			window.addEventListener('load', ready, false)
		}
	}
}
	Plugin_loader.init();
})();
