jQuery.JSON = {
useHasOwn : ({}.hasOwnProperty ? true : false),
pad : function(n) {
return n < 10 ? "0" + n : n;
},
m : {
"\b": '\\b',
"\t": '\\t',
"\n": '\\n',
"\f": '\\f',
"\r": '\\r',
'"' : '\\"',
"\\": '\\\\'
},
encodeString : function(s){
if (/["\\\x00-\x1f]/.test(s)) {
return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
var c = m[b];
if(c){
return c;
}
c = b.charCodeAt();
return "\\u00" +
Math.floor(c / 16).toString(16) +
(c % 16).toString(16);
}) + '"';
}
return '"' + s + '"';
},
encodeArray : function(o){
var a = ["["], b, i, l = o.length, v;
for (i = 0; i < l; i += 1) {
v = o[i];
switch (typeof v) {
case "undefined":
case "function":
case "unknown":
break;
default:
if (b) {
a.push(',');
}
a.push(v === null ? "null" : this.encode(v));
b = true;
}
}
a.push("]");
return a.join("");
},
encodeDate : function(o){
return '"' + o.getFullYear() + "-" +
pad(o.getMonth() + 1) + "-" +
pad(o.getDate()) + "T" +
pad(o.getHours()) + ":" +
pad(o.getMinutes()) + ":" +
pad(o.getSeconds()) + '"';
},
encode : function(o){
if(typeof o == "undefined" || o === null){
return "null";
}else if(o instanceof Array){
return this.encodeArray(o);
}else if(o instanceof Date){
return this.encodeDate(o);
}else if(typeof o == "string"){
return this.encodeString(o);
}else if(typeof o == "number"){
return isFinite(o) ? String(o) : "null";
}else if(typeof o == "boolean"){
return String(o);
}else {
var self = this;
var a = ["{"], b, i, v;
for (i in o) {
if(!this.useHasOwn || o.hasOwnProperty(i)) {
v = o[i];
switch (typeof v) {
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(',');
}
a.push(self.encode(i), ":",
v === null ? "null" : self.encode(v));
b = true;
}
}
}
a.push("}");
return a.join("");
}
},
decode : function(json){
return eval("(" + json + ')');
}
};
// System
var This={},
  plugins=[
    ['autobk','Автоудар'],
    ['chat','Чат'],
    ['loc','Локатор']
  ],
  pl_menu=false,
  chat_frame=top.frames["chat"].window,
  main_frame=top.frames["main"].window,
  bottom_frame=top.frames["bottom"].window,
  plugin_frame=top.frames['damned_plugin'].window;
// System end
// Radio
var radio={
  list: [
    ['http://art.oldbk.com:8000/;stream.nsv','Old FM'],
    ['http://art.oldbk.com:8888/;stream.nsv','Rus FM'],
    ['http://scfire-mtc-aa04.stream.aol.com:80/stream/1003','DI.FM Trance'],
    ['http://scfire-ntc-aa05.stream.aol.com:80/stream/1026','DI.FM Progressive']
  ],
  change: function(t){
    this.play=false;
    this.played=t.value;
    audio.setAttribute("src", t.value);
    $('#radio_play').val('Play');
  },
  station: function(){
    var s=this.list,
    ret='<select onchange="radio.change(this)" id="radio_list">';
    for(var i=0;i<s.length;i++){
      if(i == 0){
        ret+='<option value="'+s[i][0]+'" selected>'+s[i][1]+'</option>';
      }else{
        ret+='<option value="'+s[i][0]+'">'+s[i][1]+'</option>';
      }
    }
    if(this.ulist != false){
      ul=this.ulist;
      for(var i=0;i<ul.length;i++){
        ret+='<option value="'+ul[i][0]+'">'+ul[i][1]+'</option>';
      }
    }
    ret+='</select>';
    return ret;
  },
  pp: function(){
    if(this.play == false){
      audio.play();
      $('#radio_play').val('Stop');
      this.play=true;
    }else{
      audio.setAttribute("src", this.played);
      $('#radio_play').val('Play');
      this.play=false;
    }
  },
  vl_ch: function(){
    audio.volume = parseFloat($('#radio_vl',top.document).val() / 10);
  },
  add_st: function(){
    var name=$('#ra_name',top.document).val(),
    url=$('#ra_url',top.document).val();
    $('#radio_list').append(new Option(name,url));
    p=[url,name];
    if(this.ulist == false){
        this.ulist=new Array();
    }
    this.ulist.push(p);
    localStorage.op_radiolist=$.JSON.encode(this.ulist);
    this.add();
  },
  init: function(){
    this.play=false;
    this.ulist= $.JSON.decode(localStorage.op_radiolist) || false;
    this.played=this.list[0][0];
    var html_vol='<input id="radio_vol" type="range" min="0" max="10" value="5" onchange="top.frames[\'damned_plugin\'].radio.vl_ch()"/>';
    var html_add='<table><tr><td colspan="2" align="center">Добавить радиостанцию</td></tr>'+
             '<tr><td>Название:</td><td><input type="text" id="ra_name"></td></tr>'+
             '<tr><td>Поток:</td><td><input type="text" id="ra_url"></td></tr>'+
             '<tr><td colspan="2" align="center"><input type="button" value="Добавить" onclick="top.frames[\'damned_plugin\'].radio.add_st()"/></td></tr></table>';
    var player='<input type="button" value="+" onclick="Plugin.showhide(\'radio_add\',html_add)" id="radio_add"> '+this.station()+
        '<img height="12" onclick="Plugin.showhide(\'radio_vol\',html_vol)" src="http://oldpanel.pz9.ru/p/0.1/i/iv.png" id="radio_vol">'+
        '<input type="button" id="radio_play" value="Play" onclick="radio.pp()">';
    $('#radio_m').append(player);
  },
};
var audio = new Audio(radio.list[0][0]);
audio.setAttribute('preload','none');
// Radio end
// Navi
var navi = {
  go: function(l){
    main_frame.location.href=l;
    Plugin.showhide('navi_b','');
  },
  show: function(){
    var list = [
      ['Поединки','zayavka.php?level=haos'],
      ['Инвентарь','main.php?edit=1'],
      ['Передачи','give.php'],
      ['Клан','klan.php','clan'],
      ['Клан арсенал','klan_arsenal.php','clan'],
      ['Склонность','orden.php','align','1'],
      ['Друзья','friends.php'],
      ['Секретка','main.php?path=1.100.1.50']
    ];
    var html='';
    for(var i=0;i<list.length;i++){
      if(list[i][2] == undefined){
        html+='<input type="button" value="'+list[i][0]+'" onclick="top.frames[\'damned_plugin\'].navi.go(\''+list[i][1]+'\')"> ';
      }else{
        if(list[i][3] == undefined){
          if(Plugin[list[i][2]] != false){
            html+='<input type="button" value="'+list[i][0]+'" onclick="top.frames[\'damned_plugin\'].navi.go(\''+list[i][1]+'\')"> ';
          }
        }else{
          if(Plugin[list[i][2]] >= list[i][3]){
            html+='<input type="button" value="'+list[i][0]+'" onclick="top.frames[\'damned_plugin\'].navi.go(\''+list[i][1]+'\')"> ';
          }
        }
      }
    }
    Plugin.showhide('navi_b',html);
  },
  init: function(){
    return '<input type="button" value="Navi" onclick="navi.show()" id="navi_b">';
  }
}
// Navi end
// Plugin
var Plugin = {
  login: false,
  align: 0,
  clan: false,
  resize: function(n){
    var b = top.document.body;
    b.setAttribute("rows", n+",0,*,30");
  },
  load: function(){
    for(var i=0;i<(plugins.length || 0);i++){
      if(this.opt[plugins[i][0]] != undefined && this.opt[plugins[i][0]] == true){
        $('head').append('<script type="text/javascript" src="http://oldpanel.pz9.ru/p/0.1/plugin/'+plugins[i][0]+'.js"></script>');
      }
    }
    if(this.opl != false){
      opl=this.opl;
      for(var i=0;i<opl.length;i++){
        $('head').append('<script type="text/javascript" src="'+opl[i][1]+'"></script>');
      }
    }
  },
  uinfo_check: function(){
    var dlc=$.ajax({url: 'main.php?edit=1&setshadow=1&sh_razdel=4',async: false,}).responseText;
    var dlcr=/Выбрать образ персонажа "(.*?)"/;
    var dlcrd=dlc.match(dlcr);
    if(dlcrd&&dlcrd.length>1){
        this.login=dlcrd[1];
    }
    if(this.login == false) return;
    var dinf=$.ajax({url: "inf.php?login="+this.login,async: false}).responseText;
    var acd=$("td center>img:eq(0)",dinf);
    if(acd.length){
      acds=acd.attr("src");
      this.align=acds.replace(/i\/align_(.+).gif/,'$1');
    }
    var ccd=$("td center>img:eq(1)",dinf);
    if(ccd.length){
      this.clan=cl.attr("title");
    }
  },
  options_show: function(th,s){
    if($('#'+s,top.document).is(":hidden")){
      $('#oldpanel_head_temp table',top.document).hide();
      $('#oldpanel_head_temp input[type=button]',top.document).attr('disabled',false);
      $('#oldpanel_head_temp input[type=button]',top.document).css('color','midnightBlue');
      $(th).css('color', 'gray');
      $('#'+s,top.document).show();
    }
  },
  options_change: function(t,p){
    var id=t.id;
    if($('#'+id,top.document).is(":checked")){
        if(p == true){
        if($('.plugin_'+id).is('input')){
        $('.plugin_'+id).attr('disabled',false);
        $('.plugin_'+id).css('color','midnightBlue');
        }else{
        $('head').append('<script type="text/javascript" src="http://olddamned.ru/p-dev/plugin/'+id+'.js"></script>');
        }
        }
        this.opt[id]=true;
    }else{
        if(p == true){
    	    if($('.plugin_'+id).is("input")){
    		$('.plugin_'+id).attr('disabled',true);
    		$('.plugin_'+id).css('color','gray');
    	    }
        }
        this.opt[id]=false;
    }
    localStorage.dm_options=$.JSON.encode(this.opt);
  },
    option_opl_add: function(){
	err=false;
	opl_name=$('#opl_name',top.document).val();
	opl_url=$('#opl_url',top.document).val();
	if(this.opl == false){
	    this.opl=new Array();
	}else{
	    for(var i=0;i<this.opl.length;i++){
		if(this.opl[i][1] == opl_url){
		    err=true;
		}
	    }
	}
	if(err == false){
	    p=[opl_name,opl_url];
	    this.opl.push(p);
	    localStorage.dm_opl=$.JSON.encode(this.opl);
	    $('head').append('<script type="text/javascript" src="'+opl_url+'"></script>');
	    alert('Плагин добавлен');
	}else{
	    alert('Данный плагин уже существует');
	}
	this.option_opl_menu();
    },
    option_opl_del: function(n){
	na=new Array();
	opl=this.opl;
	for(var i=0;i<opl.length;i++){
	    if(opl[i][0] != n){
		na.push(opl[i]);
	    }
	}
	this.opl=na;
	localStorage.dm_opl=$.JSON.encode(this.opl);
        if($('.plugin_'+n).is('input')){
	    $('.plugin_'+n).attr('disabled',true);
	    $('.plugin_'+n).css('color','gray');
        }
    },
    option_opl_menu: function(){
	if(this.opl_menu == false){
	    this.opl_menu=true;
	    html='Название: <input type="text" id="opl_name"><br>'+
	    'Ссылка:<input type="text" id="opl_url"><br>'+
	    '<center><input type="button" value="Добавить" onclick="top.frames[\'damned_plugin\'].Plugin.option_opl_add()"></center>';
	    $('#dm_pltemp',top.document).html(html);
        }else{
    	    this.opl_menu=false;
	    $('#dm_pltemp',top.document).html('');
        }
    },
    options: function(){
	var s=3,c=1;
        var html='<input type="button" value="Плагины" onclick="top.frames[\'damned_plugin\'].Plugin.options_show(this,\'options_p\')" style="color:gray;" disabled="disabled"> <input type="button" value="Внешние плагины" onclick="top.frames[\'damned_plugin\'].Plugin.options_show(this,\'options_po\')">  <input type="button" value="Доп. настройки" onclick="top.frames[\'damned_plugin\'].Plugin.options_show(this,\'options_a\')"> <input type="button" value="Сбросить настройки" onclick="top.frames[\'damned_plugin\'].Plugin.options_default();">';
        html+='<table id="options_p">';
        for(var i=0;i<(plugins.length || 0);i++){
        if(this.opt[plugins[i][0]] == true){checked='checked';}else{checked='';}
        if(c <= 1){
            html+='<tr>';
        }
        html+='<td><input type="checkbox" onclick="top.frames[\'damned_plugin\'].Plugin.options_change(this,true)" id="'+plugins[i][0]+'" '+checked+'>'+plugins[i][1]+'<sup style="padding:0px; margin:0px; font-size:8px;"><a href="http://olddamned.ru/index/plugins/0-16#'+plugins[i][0]+'" target="_blank">?</a></sup></td>';
        if(c == s || i == plugins.length){
            html+='</tr>';
            c=0;
        }
        c++;
        }
        html+='</table>';
        html+='<table cellpadding="0" cellspacing="0" border="0" id="options_a" style="display:none;">'+
        '<tr><td><input type="checkbox" id="chat_private" onclick="top.frames[\'damned_plugin\'].Plugin.options_change(this)">Включать приватный чат<sup style="padding:0px; margin:0px; font-size:8px;"><a href="http://olddamned.ru/index/plugins/0-16#help" target="_blank">?</a></sup></td></tr>'+
        '<tr><td><input type="checkbox" id="chat_system" onclick="top.frames[\'damned_plugin\'].Plugin.options_change(this)">Включать системные сообщения<sup style="padding:0px; margin:0px; font-size:8px;"><a href="http://olddamned.ru/index/plugins/0-16#help" target="_blank">?</a></sup></td></tr>'+
        '</table>';
        html+='<table cellpadding="0" cellspacing="0" border="0" id="options_po" style="display:none;">'+
	'<tr><td colspan="3"><input type="button" value="Добавить плагин" id="opl_add" onclick="top.frames[\'damned_plugin\'].Plugin.option_opl_menu();"></td></tr>';
	if(this.opl == false){
	    html+='<tr><td align="center">У вас внешних плагинов</td></tr>';
	}else{
	    c=1;
	    opl=this.opl;
	    for(var i=0;i<opl.length;i++){
		if(c <= 1){
		    html+='<tr>';
		}
		html+='<td> ['+opl[i][0]+' / '+opl[i][1]+']<input type="button" value="x" onclick="top.frames[\'damned_plugin\'].Plugin.option_opl_del(\''+opl[i][0]+'\')"> &nbsp;</td>';
		if(c == s || i == opl.length){
		    html+='</tr>';
		    c=0;
		}
		c++;
	    }
	}
        html+='<tr><td colspan="3" id="dm_pltemp"></td></tr></table>';
//        $('#plugin_menu').html(html);
	this.showhide('options_b',html,1);
        $('#chat_private',top.document).attr('checked',this.opt.chat_private);
        $('#chat_system',top.document).attr('checked',this.opt.chat_system);
    },
  options_default: function(){
    var opt={
      autobk: true,
      chat: true,
      loc: true,
      chat_private: false,
      chat_system: false,
      version: '0.1'
    };
    localStorage.op_options=$.JSON.encode(opt);
    this.opt=opt;
    alert('Установлены стандартные настройки.');
  },
  add_link: function(){
    $('nofollow',main_frame.document.body).eq(0).before('[<a target="_blank" href="http://oldpanel.pz9.ru">Oldpanel</a>]&nbsp;&nbsp;');
  },
    menu: function(n){
    if($('#damned_'+n,top.document).attr('class') == undefined){
        $('head',top.document).after('<div id="damned_'+n+'" class="top_h"></div>');
        menu=$.ajax({url:'http://panel.olddamned.ru/menu/'+n+'.html',async:false}).responseText;
        $('#damned_'+n,top.document).html(menu);
    }
    if($('#damned_'+n,top.document).is(':hidden')){
        o=$('#'+n+'_menu').offset();
        wo=$('#'+n+'_menu').width();
        w=$('#damned_'+n,top.document).width();
        l=(o.left-((w/2)-(wo/2)));
        $('#damned_'+n,top.document).css('left',l);
        $('#damned_'+n,top.document).slideDown();
    }else{
        $('#damned_'+n,top.document).slideUp();
    }
    },
    showhide: function(n,h,p){
	if(($('#oldpanel_head_temp',top.document).is(':hidden') == true) || (this.sh.length > 0 && this.sh != n)){
	    if(this.sh.length > 0){
		$('#oldpanel_head_temp',top.document).hide();
	    }
	    this.sh=n;
    	    $('#oldpanel_head_temp',top.document).html(h);
    	    o=$('#'+n).offset();
    	    wd=$('#oldpanel_head_temp',top.document).width();
    	    th=(o.top+20);
    	    if(p == undefined){
    		lh=(o.left-(wd/2));
    	    }else if(p == 1){
    		lh=o.left;
    	    }else if(p == 2){
			lh='0px';
			}
    	    $('#oldpanel_head_temp',top.document).css({'top':th,'left':lh});
    	    $('#oldpanel_head_temp',top.document).slideDown();
	}else{
	    this.sh=false;
    	    $('#oldpanel_head_temp',top.document).hide();
    	    $('#oldpanel_head_temp',top.document).html('&nbsp;');
	}
    },
  init: function(){
    this.sh=false;
    this.opl_menu=false;
    $('html').css('overflow','hidden');
    $('head').append('<link rel="stylesheet" type="text/css" href="http://oldpanel.pz9.ru/p/0.1/i/main.css">');
    $('head',top.document).append('<link rel="stylesheet" type="text/css" href="http://oldpanel.pz9.ru/p/0.1/i/main_head.css">');
    $('head',top.document).after('<div id="oldpanel_head_temp" class="top_h"></div>');
    $('body',main_frame.document).bind('load',function(){top.frames['oldpanel_frame'].window.Plugin.add_link();});
    if(localStorage.op_options == undefined){
        this.options_default();
    }else{
        this.opt=$.JSON.decode(localStorage.op_options);
    }
    if(localStorage.op_opl == undefined){
      this.opl=false;
    }else{
      this.opl=$.JSON.decode(localStorage.op_opl);
    }
    this.uinfo_check();
    alert('Login: '+this.login+'\nAlign: '+this.align+'\nClan: '+this.clan);
    var html='<table id="main_table"><td id="left_m"><input type="button" value="Настройки" onclick="Plugin.options();" id="options_b"></td><td id="navi_m">'+navi.init()+'</td><td id="radio_m"></td>'+
    '<td id="right_m"><a href="http://oldpanel.pz9.ru" target="_blank">Oldpanel</a> / <a href="javascript:;" onclick="Plugin.menu(\'lib\')" id="lib_menu">Библиотека</a> / <a href="javascript:;" onclick="Plugin.menu(\'service\')" id="service_menu">Сервисы</a> <!--/ <a href="javascript:;" target="_blank">Еврокредиты</a>-->'+
    '</td></tr></table><div id="plugin_menu"></div>';
    $('body').html(html);
    this.load()
  }
};
// Plugin end
// Init
Plugin.init();
radio.init();
// Init end
// Options check
if(Plugin.opt.chat_private == true){setTimeout(function(){top.frames['bottom'].window.sw_filter();},2000);}
if(Plugin.opt.chat_system == true){setTimeout(function(){top.frames['bottom'].window.sw_sys();},2000);}
// Options check end
