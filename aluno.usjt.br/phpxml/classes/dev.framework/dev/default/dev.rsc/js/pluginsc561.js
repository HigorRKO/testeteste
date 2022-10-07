

// 3 - jnice 1.0 _ http://whitespace-creative.com/jquery/jnice/
/*
 * jNice
 * version: 1.0 (11.26.08)
 * by Sean Mooney (sean@whitespace-creative.com) 
 * Examples at: http://www.whitespace-creative.com/jquery/jnice/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * To Use: place in the head 
 *  <link href="inc/style/jNice.css" rel="stylesheet" type="text/css" />
 *  <script type="text/javascript" src="inc/js/jquery.jNice.js"></script>
 *
 * And apply the jNice class to the form you want to style
 *
 * To Do: Add textareas, Add File upload
 *
 ******************************************** */
(function($){
	$.fn.jNice = function(options){
		var self = this;
		var safari = $.browser.safari; /* We need to check for safari to fix the input:text problem */
		/* Apply document listener */
		$(document).mousedown(checkExternalClick);
		/* each form */
		return this.each(function(){
			$('input:submit, input:reset, input:button', this).each(ButtonAdd);
			$('button').focus(function(){ $(this).addClass('jNiceFocus')}).blur(function(){ $(this).removeClass('jNiceFocus')});
			$('input:text:visible, input:password', this).each(TextAdd);
			/* If this is safari we need to add an extra class */
			if (safari){$('.jNiceInputWrapper').each(function(){$(this).addClass('jNiceSafari').find('input').css('width', $(this).width()+11);});}
			$('input:checkbox', this).each(CheckAdd);
			$('input:radio', this).each(RadioAdd);
			//$('.select', this).each(function(index){ SelectAdd(this, index); });
			/* Add a new handler for the reset action */
			$(this).bind('reset',function(){var action = function(){ Reset(this); }; window.setTimeout(action, 10); });
			$('.jNiceHidden').css({opacity:0});
		});		
	};/* End the Plugin */

	var Reset = function(form){
		var sel;
		$('.jNiceSelectWrapper select', form).each(function(){sel = (this.selectedIndex<0) ? 0 : this.selectedIndex; $('ul', $(this).parent()).each(function(){$('a:eq('+ sel +')', this).click();});});
		$('a.jNiceCheckbox, a.jNiceRadio', form).removeClass('jNiceChecked');
		$('input:checkbox, input:radio', form).each(function(){if(this.checked){$('a', $(this).parent()).addClass('jNiceChecked');}});
	};

	var RadioAdd = function(){
		var $input = $(this).addClass('jNiceHidden').wrap('<span class="jRadioWrapper jNiceWrapper"></span>');
		var $wrapper = $input.parent();
		var $a = $('<span class="jNiceRadio"></span>');
		$wrapper.prepend($a);
		/* Click Handler */
		$a.click(function(){
				var $input = $(this).addClass('jNiceChecked').siblings('input').attr('checked',true);
				/* uncheck all others of same name */
				$('input:radio[name="'+ $input.attr('name') +'"]').not($input).each(function(){
					$(this).attr('checked',false).siblings('.jNiceRadio').removeClass('jNiceChecked');
				});
				return false;
		});
		$input.click(function(){
			if(this.checked){
				var $input = $(this).siblings('.jNiceRadio').addClass('jNiceChecked').end();
				/* uncheck all others of same name */
				$('input:radio[name="'+ $input.attr('name') +'"]').not($input).each(function(){
					$(this).attr('checked',false).siblings('.jNiceRadio').removeClass('jNiceChecked');
				});
			}
		}).focus(function(){ $a.addClass('jNiceFocus'); }).blur(function(){ $a.removeClass('jNiceFocus'); });

		/* set the default state */
		if (this.checked){ $a.addClass('jNiceChecked'); }
	};

	var CheckAdd = function(){
		var $input = $(this).addClass('jNiceHidden').wrap('<span class="jNiceWrapper"></span>');
		var $wrapper = $input.parent().append('<span class="jNiceCheckbox"></span>');
		/* Click Handler */
		var $a = $wrapper.find('.jNiceCheckbox').click(function(){
				var $a = $(this);
				//var input = $a.siblings('input')[0]; //al todas as linhas abaixo
                                var input = $a.parent().find("input[type=checkbox]")[0];
                                $(input).click(); 
				if (input.checked===true){
					//input.checked = false;
					$a.addClass('jNiceChecked');
				}
				else {
					//input.checked = true;
                                        $a.removeClass('jNiceChecked');
				}
				return false;
		});
		$input.click(function(){
			if(this.checked){ $a.addClass('jNiceChecked'); 	}
			else { $a.removeClass('jNiceChecked'); }
		}).focus(function(){ $a.addClass('jNiceFocus'); }).blur(function(){ $a.removeClass('jNiceFocus'); });
		
		/* set the default state */
		if (this.checked){$('.jNiceCheckbox', $wrapper).addClass('jNiceChecked');}
	};

	var TextAdd = function(){
		var $input = $(this).addClass('jNiceInput').wrap('<div class="jNiceInputWrapper"><div class="jNiceInputInner"></div></div>');
		var $wrapper = $input.parents('.jNiceInputWrapper');
		$input.focus(function(){ 
			$wrapper.addClass('jNiceInputWrapper_hover');
		}).blur(function(){
			$wrapper.removeClass('jNiceInputWrapper_hover');
		});
	};

	var ButtonAdd = function(){
		var value = $(this).attr('value');
		$(this).replaceWith('<button id="'+ this.id +'" name="'+ this.name +'" type="'+ this.type +'" class="'+ this.className +'" value="'+ value +'"><span><span>'+ value +'</span></span>');
	};

	/* Hide all open selects */
	var SelectHide = function(){
			$('.jNiceSelectWrapper ul:visible').hide();
	};

	/* Check for an external click */
	var checkExternalClick = function(event) {
		if ($(event.target).parents('.jNiceSelectWrapper').length === 0) { SelectHide(); }
	};

	var SelectAdd = function(element, index){
		var $select = $(element);
		index = index || $select.css('zIndex')*1;
		index = (index) ? index : 0;
		/* First thing we do is Wrap it */
		$select.wrap($('<div class="jNiceWrapper"></div>').css({zIndex: 100-index}));
		var width = $select.width();
		$select.addClass('jNiceHidden').after('<div class="jNiceSelectWrapper"><div><span class="jNiceSelectText"></span><span class="jNiceSelectOpen"></span></div><ul></ul></div>');
		var $wrapper = $(element).siblings('.jNiceSelectWrapper').css({width: width +'px'});
		$('.jNiceSelectText, .jNiceSelectWrapper ul', $wrapper).width( width - $('.jNiceSelectOpen', $wrapper).width());
		/* IF IE 6 */
		if ($.browser.msie && jQuery.browser.version < 7) {
			$select.after($('<iframe src="javascript:\'\';" marginwidth="0" marginheight="0" align="bottom" scrolling="no" tabIndex="-1" frameborder="0"></iframe>').css({ height: $select.height()+4 +'px' }));
		}
		/* Now we add the options */
		SelectUpdate(element);
		/* Apply the click handler to the Open */
		$('div', $wrapper).click(function(){
                    
			var $ul = $(this).siblings('ul');
			if ($ul.css('display')=='none'){ SelectHide(); } /* Check if box is already open to still allow toggle, but close all other selects */
			$ul.slideToggle();
			var offSet = ($('a.selected', $ul).offset().top - $ul.offset().top);
			$ul.animate({scrollTop: offSet});
			return false;
		});
		/* Add the key listener */
		$select.keydown(function(e){
			var selectedIndex = this.selectedIndex;
			switch(e.keyCode){
				case 40: /* Down */
					if (selectedIndex < this.options.length - 1){ selectedIndex+=1; }
					break;
				case 38: /* Up */
					if (selectedIndex > 0){ selectedIndex-=1; }
					break;
				default:
					return;
					break;
			}
			$('ul a', $wrapper).removeClass('selected').eq(selectedIndex).addClass('selected');
			$('span:eq(0)', $wrapper).html($('option:eq('+ selectedIndex +')', $select).attr('selected', 'selected').text());
			return false;
		}).focus(function(){ $wrapper.addClass('jNiceFocus'); }).blur(function(){ $wrapper.removeClass('jNiceFocus'); });
	};

	var SelectUpdate = function(element){
		var $select = $(element);
		var $wrapper = $select.siblings('.jNiceSelectWrapper');
		var $ul = $wrapper.find('ul').find('li').remove().end().hide();
		$('option', $select).each(function(i){
			$ul.append('<li><a href="#" index="'+ i +'">'+ this.text +'</a></li>');
		});
		/* Add click handler to the a */
		$ul.find('a').click(function(){
			$('a.selected', $wrapper).removeClass('selected');
			$(this).addClass('selected');	
			/* Fire the onchange event */
			if ($select[0].selectedIndex != $(this).attr('index')/* && $select[0].onchange*/) { $select[0].selectedIndex = $(this).attr('index');/* $select[0].onchange();*/ $select.change();}
			$select[0].selectedIndex = $(this).attr('index');
			$('span:eq(0)', $wrapper).html($(this).html());
			$ul.hide();
			return false;
		});
		/* Set the defalut */
		//$('a:eq('+ $select[0].selectedIndex +')', $ul).click(); 
		$('a:eq(0)', $ul).click();        
	};

	var SelectRemove = function(element){
		var zIndex = $(element).siblings('.jNiceSelectWrapper').css('zIndex');
		$(element).css({zIndex: zIndex}).removeClass('jNiceHidden');
		$(element).siblings('.jNiceSelectWrapper').remove();
	};

        var SelectClear = function(element){
            var $box   = $(element).parent();
            $box.children('select').children('option:gt(0)').remove();
            $box.children('div').children('ul').children('li:gt(0)').remove();           
        }
        
	/* Utilities */
	$.jNice = {
			SelectAdd : function(element, index){ 	SelectAdd(element, index); },
			SelectRemove : function(element){ SelectRemove(element); },
			SelectUpdate : function(element){ SelectUpdate(element); },
                        SelectClear: function(element){ SelectClear(element); }
	};/* End Utilities */

	/* Automatically apply to any forms with class jNice */
	//$(function(){$('form.jNice').jNice();	});
})(jQuery);


// 6 - hoverIntent r6 _ http://cherne.net/brian/resources/jquery.hoverIntent.html

(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);



/*
* Slides, A Slideshow Plugin for jQuery
* Intructions: http://slidesjs.com
* By: Nathan Searles, http://nathansearles.com
* Version: 1.1.9
* Updated: September 5th, 2011
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
(function(a){a.fn.slides=function(b){return b=a.extend({},a.fn.slides.option,b),this.each(function(){function w(g,h,i){if(!p&&o){p=!0,b.animationStart(n+1);switch(g){case"next":l=n,k=n+1,k=e===k?0:k,r=f*2,g=-f*2,n=k;break;case"prev":l=n,k=n-1,k=k===-1?e-1:k,r=0,g=0,n=k;break;case"pagination":k=parseInt(i,10),l=a("."+b.paginationClass+" li."+b.currentClass+" a",c).attr("href").match("[^#/]+$"),k>l?(r=f*2,g=-f*2):(r=0,g=0),n=k}h==="fade"?b.crossfade?d.children(":eq("+k+")",c).css({zIndex:10}).fadeIn(b.fadeSpeed,b.fadeEasing,function(){b.autoHeight?d.animate({height:d.children(":eq("+k+")",c).outerHeight()},b.autoHeightSpeed,function(){d.children(":eq("+l+")",c).css({display:"none",zIndex:0}),d.children(":eq("+k+")",c).css({zIndex:0}),b.animationComplete(k+1),p=!1}):(d.children(":eq("+l+")",c).css({display:"none",zIndex:0}),d.children(":eq("+k+")",c).css({zIndex:0}),b.animationComplete(k+1),p=!1)}):d.children(":eq("+l+")",c).fadeOut(b.fadeSpeed,b.fadeEasing,function(){b.autoHeight?d.animate({height:d.children(":eq("+k+")",c).outerHeight()},b.autoHeightSpeed,function(){d.children(":eq("+k+")",c).fadeIn(b.fadeSpeed,b.fadeEasing)}):d.children(":eq("+k+")",c).fadeIn(b.fadeSpeed,b.fadeEasing,function(){a.browser.msie&&a(this).get(0).style.removeAttribute("filter")}),b.animationComplete(k+1),p=!1}):(d.children(":eq("+k+")").css({left:r,display:"block"}),b.autoHeight?d.animate({left:g,height:d.children(":eq("+k+")").outerHeight()},b.slideSpeed,b.slideEasing,function(){d.css({left:-f}),d.children(":eq("+k+")").css({left:f,zIndex:5}),d.children(":eq("+l+")").css({left:f,display:"none",zIndex:0}),b.animationComplete(k+1),p=!1}):d.animate({left:g},b.slideSpeed,b.slideEasing,function(){d.css({left:-f}),d.children(":eq("+k+")").css({left:f,zIndex:5}),d.children(":eq("+l+")").css({left:f,display:"none",zIndex:0}),b.animationComplete(k+1),p=!1})),b.pagination&&(a("."+b.paginationClass+" li."+b.currentClass,c).removeClass(b.currentClass),a("."+b.paginationClass+" li:eq("+k+")",c).addClass(b.currentClass))}}function x(){clearInterval(c.data("interval"))}function y(){b.pause?(clearTimeout(c.data("pause")),clearInterval(c.data("interval")),u=setTimeout(function(){clearTimeout(c.data("pause")),v=setInterval(function(){w("next",i)},b.play),c.data("interval",v)},b.pause),c.data("pause",u)):x()}a("."+b.container,a(this)).children().wrapAll('<div class="slides_control"/>');var c=a(this),d=a(".slides_control",c),e=d.children().size(),f=d.children().outerWidth(),g=d.children().outerHeight(),h=b.start-1,i=b.effect.indexOf(",")<0?b.effect:b.effect.replace(" ","").split(",")[0],j=b.effect.indexOf(",")<0?i:b.effect.replace(" ","").split(",")[1],k=0,l=0,m=0,n=0,o,p,q,r,s,t,u,v;if(e<2)return a("."+b.container,a(this)).fadeIn(b.fadeSpeed,b.fadeEasing,function(){o=!0,b.slidesLoaded()}),a("."+b.next+", ."+b.prev).fadeOut(0),!1;if(e<2)return;h<0&&(h=0),h>e&&(h=e-1),b.start&&(n=h),b.randomize&&d.randomize(),a("."+b.container,c).css({overflow:"hidden",position:"relative"}),d.children().css({position:"absolute",top:0,left:d.children().outerWidth(),zIndex:0,display:"none"}),d.css({position:"relative",width:f*3,height:g,left:-f}),a("."+b.container,c).css({display:"block"}),b.autoHeight&&(d.children().css({height:"auto"}),d.animate({height:d.children(":eq("+h+")").outerHeight()},b.autoHeightSpeed));if(b.preload&&d.find("img:eq("+h+")").length){a("."+b.container,c).css({background:"url("+b.preloadImage+") no-repeat 50% 50%"});var z=d.find("img:eq("+h+")").attr("src")+"?"+(new Date).getTime();a("img",c).parent().attr("class")!="slides_control"?t=d.children(":eq(0)")[0].tagName.toLowerCase():t=d.find("img:eq("+h+")"),d.find("img:eq("+h+")").attr("src",z).load(function(){d.find(t+":eq("+h+")").fadeIn(b.fadeSpeed,b.fadeEasing,function(){a(this).css({zIndex:5}),a("."+b.container,c).css({background:""}),o=!0,b.slidesLoaded()})})}else d.children(":eq("+h+")").fadeIn(b.fadeSpeed,b.fadeEasing,function(){o=!0,b.slidesLoaded()});b.bigTarget&&(d.children().css({cursor:"pointer"}),d.children().click(function(){return w("next",i),!1})),b.hoverPause&&b.play&&(d.bind("mouseover",function(){x()}),d.bind("mouseleave",function(){y()})),b.generateNextPrev&&(a("."+b.container,c).after('<a href="#" class="'+b.prev+'">Prev</a>'),a("."+b.prev,c).after('<a href="#" class="'+b.next+'">Next</a>')),a("."+b.next,c).click(function(a){a.preventDefault(),b.play&&y(),w("next",i)}),a("."+b.prev,c).click(function(a){a.preventDefault(),b.play&&y(),w("prev",i)}),b.generatePagination?(b.prependPagination?c.prepend("<ul class="+b.paginationClass+"></ul>"):c.append("<ul class="+b.paginationClass+"></ul>"),d.children().each(function(){a("."+b.paginationClass,c).append('<li><a href="#'+m+'">'+(m+1)+"</a></li>"),m++})):a("."+b.paginationClass+" li a",c).each(function(){a(this).attr("href","#"+m),m++}),a("."+b.paginationClass+" li:eq("+h+")",c).addClass(b.currentClass),a("."+b.paginationClass+" li a",c).click(function(){return b.play&&y(),q=a(this).attr("href").match("[^#/]+$"),n!=q&&w("pagination",j,q),!1}),a("a.link",c).click(function(){return b.play&&y(),q=a(this).attr("href").match("[^#/]+$")-1,n!=q&&w("pagination",j,q),!1}),b.play&&(v=setInterval(function(){w("next",i)},b.play),c.data("interval",v))})},a.fn.slides.option={preload:!1,preloadImage:"/img/loading.gif",container:"slides_container",generateNextPrev:!1,next:"next",prev:"prev",pagination:!0,generatePagination:!0,prependPagination:!1,paginationClass:"pagination",currentClass:"current",fadeSpeed:350,fadeEasing:"",slideSpeed:350,slideEasing:"",start:1,effect:"slide",crossfade:!1,randomize:!1,play:0,pause:0,hoverPause:!1,autoHeight:!1,autoHeightSpeed:350,bigTarget:!1,animationStart:function(){},animationComplete:function(){},slidesLoaded:function(){}},a.fn.randomize=function(b){function c(){return Math.round(Math.random())-.5}return a(this).each(function(){var d=a(this),e=d.children(),f=e.length;if(f>1){e.hide();var g=[];for(i=0;i<f;i++)g[g.length]=i;g=g.sort(c),a.each(g,function(a,c){var f=e.eq(c),g=f.clone(!0);g.show().appendTo(d),b!==undefined&&b(f,g),f.remove()})}})}})(jQuery);

/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
	Version: 1.3
*/
//(function(a){var b=(a.browser.msie?"paste":"input")+".mask",c=window.orientation!=undefined;a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},dataName:"rawMaskFn"},a.fn.extend({caret:function(a,b){if(this.length!=0){if(typeof a=="number"){b=typeof b=="number"?b:a;return this.each(function(){if(this.setSelectionRange)this.setSelectionRange(a,b);else if(this.createTextRange){var c=this.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select()}})}if(this[0].setSelectionRange)a=this[0].selectionStart,b=this[0].selectionEnd;else if(document.selection&&document.selection.createRange){var c=document.selection.createRange();a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length}return{begin:a,end:b}}},unmask:function(){return this.trigger("unmask")},mask:function(d,e){if(!d&&this.length>0){var f=a(this[0]);return f.data(a.mask.dataName)()}e=a.extend({placeholder:"_",completed:null},e);var g=a.mask.definitions,h=[],i=d.length,j=null,k=d.length;a.each(d.split(""),function(a,b){b=="?"?(k--,i=a):g[b]?(h.push(new RegExp(g[b])),j==null&&(j=h.length-1)):h.push(null)});return this.trigger("unmask").each(function(){function v(a){var b=f.val(),c=-1;for(var d=0,g=0;d<k;d++)if(h[d]){l[d]=e.placeholder;while(g++<b.length){var m=b.charAt(g-1);if(h[d].test(m)){l[d]=m,c=d;break}}if(g>b.length)break}else l[d]==b.charAt(g)&&d!=i&&(g++,c=d);if(!a&&c+1<i)f.val(""),t(0,k);else if(a||c+1>=i)u(),a||f.val(f.val().substring(0,c+1));return i?d:j}function u(){return f.val(l.join("")).val()}function t(a,b){for(var c=a;c<b&&c<k;c++)h[c]&&(l[c]=e.placeholder)}function s(a){var b=a.which,c=f.caret();if(a.ctrlKey||a.altKey||a.metaKey||b<32)return!0;if(b){c.end-c.begin!=0&&(t(c.begin,c.end),p(c.begin,c.end-1));var d=n(c.begin-1);if(d<k){var g=String.fromCharCode(b);if(h[d].test(g)){q(d),l[d]=g,u();var i=n(d);f.caret(i),e.completed&&i>=k&&e.completed.call(f)}}return!1}}function r(a){var b=a.which;if(b==8||b==46||c&&b==127){var d=f.caret(),e=d.begin,g=d.end;g-e==0&&(e=b!=46?o(e):g=n(e-1),g=b==46?n(g):g),t(e,g),p(e,g-1);return!1}if(b==27){f.val(m),f.caret(0,v());return!1}}function q(a){for(var b=a,c=e.placeholder;b<k;b++)if(h[b]){var d=n(b),f=l[b];l[b]=c;if(d<k&&h[d].test(f))c=f;else break}}function p(a,b){if(!(a<0)){for(var c=a,d=n(b);c<k;c++)if(h[c]){if(d<k&&h[c].test(l[d]))l[c]=l[d],l[d]=e.placeholder;else break;d=n(d)}u(),f.caret(Math.max(j,a))}}function o(a){while(--a>=0&&!h[a]);return a}function n(a){while(++a<=k&&!h[a]);return a}var f=a(this),l=a.map(d.split(""),function(a,b){if(a!="?")return g[a]?e.placeholder:a}),m=f.val();f.data(a.mask.dataName,function(){return a.map(l,function(a,b){return h[b]&&a!=e.placeholder?a:null}).join("")}),f.attr("readonly")||f.one("unmask",function(){f.unbind(".mask").removeData(a.mask.dataName)}).bind("focus.mask",function(){m=f.val();var b=v();u();var c=function(){b==d.length?f.caret(0,b):f.caret(b)};(a.browser.msie?c:function(){setTimeout(c,0)})()}).bind("blur.mask",function(){v(),f.val()!=m&&f.change()}).bind("keydown.mask",r).bind("keypress.mask",s).bind(b,function(){setTimeout(function(){f.caret(v(!0))},0)}),v()})}})})(jQuery)
   

/**
 * Jquery meiomask
 * http://www.meiocodigo.com/projects/meiomask/#mm_download
 * https://raw.github.com/fabiomcosta/jquery-meiomask/master/jquery.meio.mask.min.js
 */
(function(D){var C=(window.orientation!=null);var A=((D.browser.opera||(D.browser.mozilla&&parseFloat(D.browser.version.substr(0,3))<1.9))?"input":"paste");var B=function(F){F=D.event.fix(F||window.event);F.type="paste";var E=F.target;setTimeout(function(){D.event.dispatch.call(E,F)},1)};D.event.special.paste={setup:function(){if(this.addEventListener){this.addEventListener(A,B,false)}else{if(this.attachEvent){this.attachEvent("on"+A,B)}}},teardown:function(){if(this.removeEventListener){this.removeEventListener(A,B,false)}else{if(this.detachEvent){this.detachEvent("on"+A,B)}}}};D.extend({mask:{rules:{"z":/[a-z]/,"Z":/[A-Z]/,"a":/[a-zA-Z]/,"*":/[0-9a-zA-Z]/,"@":/[0-9a-zA-ZçÇáàãâéèêíìóòôõúùü]/},keyRepresentation:{8:"backspace",9:"tab",13:"enter",16:"shift",17:"control",18:"alt",27:"esc",33:"page up",34:"page down",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"delete",116:"f5",123:"f12",224:"command"},iphoneKeyRepresentation:{10:"go",127:"delete"},signals:{"+":"","-":"-"},options:{attr:"alt",mask:null,type:"fixed",maxLength:-1,defaultValue:"",signal:false,textAlign:true,selectCharsOnFocus:true,autoTab:true,setSize:false,fixedChars:"[(),.:/ -]",onInvalid:function(){},onValid:function(){},onOverflow:function(){}},masks:{"phone":{mask:"(99) 9999-9999"},"phone-us":{mask:"(999) 999-9999"},"cpf":{mask:"999.999.999-99"},"cnpj":{mask:"99.999.999/9999-99"},"date":{mask:"39/19/9999"},"date-us":{mask:"19/39/9999"},"cep":{mask:"99999-999"},"time":{mask:"29:59"},"cc":{mask:"9999 9999 9999 9999"},"integer":{mask:"999.999.999.999",type:"reverse"},"decimal":{mask:"99,999.999.999.999",type:"reverse",defaultValue:"000"},"decimal-us":{mask:"99.999,999,999,999",type:"reverse",defaultValue:"000"},"signed-decimal":{mask:"99,999.999.999.999",type:"reverse",defaultValue:"+000"},"signed-decimal-us":{mask:"99,999.999.999.999",type:"reverse",defaultValue:"+000"}},init:function(){if(!this.hasInit){var E=this,F,G=(C)?this.iphoneKeyRepresentation:this.keyRepresentation;this.ignore=false;for(F=0;F<=9;F++){this.rules[F]=new RegExp("[0-"+F+"]")}this.keyRep=G;this.ignoreKeys=[];D.each(G,function(H){E.ignoreKeys.push(parseInt(H,10))});this.hasInit=true}},set:function(I,F){var E=this,G=D(I),H="maxLength";F=F||{};this.init();return G.each(function(){if(F.attr){E.options.attr=F.attr}var O=D(this),Q=D.extend({},E.options),N=O.attr(Q.attr),J="";J=(typeof F=="string")?F:(N!=="")?N:null;if(J){Q.mask=J}if(E.masks[J]){Q=D.extend(Q,E.masks[J])}if(typeof F=="object"&&F.constructor!=Array){Q=D.extend(Q,F)}if(D.metadata){Q=D.extend(Q,O.metadata())}if(Q.mask!=null){Q.mask+="";if(O.data("mask")){E.unset(O)}var K=Q.defaultValue,L=(Q.type==="reverse"),M=new RegExp(Q.fixedChars,"g");if(Q.maxLength===-1){Q.maxLength=O.attr(H)}Q=D.extend({},Q,{fixedCharsReg:new RegExp(Q.fixedChars),fixedCharsRegG:M,maskArray:Q.mask.split(""),maskNonFixedCharsArray:Q.mask.replace(M,"").split("")});if((Q.type=="fixed"||L)&&Q.setSize&&!O.attr("size")){O.attr("size",Q.mask.length)}if(L&&Q.textAlign){O.css("text-align","right")}if(this.value!==""||K!==""){var P=E.string((this.value!=="")?this.value:K,Q);this.defaultValue=P;O.val(P)}if(Q.type=="infinite"){Q.type="repeat"}O.data("mask",Q);O.removeAttr(H);O.bind("keydown.mask",{func:E._onKeyDown,thisObj:E},E._onMask).bind("keypress.mask",{func:E._onKeyPress,thisObj:E},E._onMask).bind("keyup.mask",{func:E._onKeyUp,thisObj:E},E._onMask).bind("paste.mask",{func:E._onPaste,thisObj:E},E._onMask).bind("focus.mask",E._onFocus).bind("blur.mask",E._onBlur).bind("change.mask",E._onChange)}})},unset:function(F){var E=D(F);return E.each(function(){var H=D(this);if(H.data("mask")){var G=H.data("mask").maxLength;if(G!=-1){H.attr("maxLength",G)}H.unbind(".mask").removeData("mask")}})},string:function(J,F){this.init();var I={};if(typeof J!="string"){J=String(J)}switch(typeof F){case"string":if(this.masks[F]){I=D.extend(I,this.masks[F])}else{I.mask=F}break;case"object":I=F}if(!I.fixedChars){I.fixedChars=this.options.fixedChars}var E=new RegExp(I.fixedChars),G=new RegExp(I.fixedChars,"g");if((I.type==="reverse")&&I.defaultValue){if(typeof this.signals[I.defaultValue.charAt(0)]!="undefined"){var H=J.charAt(0);I.signal=(typeof this.signals[H]!="undefined")?this.signals[H]:this.signals[I.defaultValue.charAt(0)];I.defaultValue=I.defaultValue.substring(1)}}return this.__maskArray(J.split(""),I.mask.replace(G,"").split(""),I.mask.split(""),I.type,I.maxLength,I.defaultValue,E,I.signal)},_onFocus:function(G){var F=D(this),E=F.data("mask");E.inputFocusValue=F.val();E.changed=false;if(E.selectCharsOnFocus){F.select()}},_onBlur:function(G){var F=D(this),E=F.data("mask");if(E.inputFocusValue!=F.val()&&!E.changed){F.trigger("change")}},_onChange:function(E){D(this).data("mask").changed=true},_onMask:function(E){var G=E.data.thisObj,F={};F._this=E.target;F.$this=D(F._this);F.data=F.$this.data("mask");if(F.$this.attr("readonly")||!F.data){return true}F[F.data.type]=true;F.value=F.$this.val();F.nKey=G.__getKeyNumber(E);F.range=G.__getRange(F._this);F.valueArray=F.value.split("");return E.data.func.call(G,E,F)},_onKeyDown:function(F,G){this.ignore=D.inArray(G.nKey,this.ignoreKeys)>-1||F.ctrlKey||F.metaKey||F.altKey;if(this.ignore){var E=this.keyRep[G.nKey];G.data.onValid.call(G._this,E||"",G.nKey)}return C?this._onKeyPress(F,G):true},_onKeyUp:function(E,F){if(F.nKey===9||F.nKey===16){return true}if(F.repeat){this.__autoTab(F);return true}return this._onPaste(E,F)},_onPaste:function(F,G){if(G.reverse){this.__changeSignal(F.type,G)}var E=this.__maskArray(G.valueArray,G.data.maskNonFixedCharsArray,G.data.maskArray,G.data.type,G.data.maxLength,G.data.defaultValue,G.data.fixedCharsReg,G.data.signal);G.$this.val(E);if(!G.reverse&&G.data.defaultValue.length&&(G.range.start===G.range.end)){this.__setRange(G._this,G.range.start,G.range.end)}if((D.browser.msie||D.browser.safari)&&!G.reverse){this.__setRange(G._this,G.range.start,G.range.end)}if(this.ignore){return true}this.__autoTab(G);return true},_onKeyPress:function(L,E){if(this.ignore){return true}if(E.reverse){this.__changeSignal(L.type,E)}var M=String.fromCharCode(E.nKey),O=E.range.start,I=E.value,G=E.data.maskArray;if(E.reverse){var H=I.substr(0,O),K=I.substr(E.range.end,I.length);I=H+M+K;if(E.data.signal&&(O-E.data.signal.length>0)){O-=E.data.signal.length}}var N=I.replace(E.data.fixedCharsRegG,"").split(""),F=this.__extraPositionsTill(O,G,E.data.fixedCharsReg);E.rsEp=O+F;if(E.repeat){E.rsEp=0}if(!this.rules[G[E.rsEp]]||(E.data.maxLength!=-1&&N.length>=E.data.maxLength&&E.repeat)){E.data.onOverflow.call(E._this,M,E.nKey);return false}else{if(!this.rules[G[E.rsEp]].test(M)){E.data.onInvalid.call(E._this,M,E.nKey);return false}else{E.data.onValid.call(E._this,M,E.nKey)}}var J=this.__maskArray(N,E.data.maskNonFixedCharsArray,G,E.data.type,E.data.maxLength,E.data.defaultValue,E.data.fixedCharsReg,E.data.signal,F);if(!E.repeat){E.$this.val(J)}return(E.reverse)?this._keyPressReverse(L,E):(E.fixed)?this._keyPressFixed(L,E):true},_keyPressFixed:function(E,F){if(F.range.start==F.range.end){if((F.rsEp===0&&F.value.length===0)||F.rsEp<F.value.length){this.__setRange(F._this,F.rsEp,F.rsEp+1)}}else{this.__setRange(F._this,F.range.start,F.range.end)}return true},_keyPressReverse:function(E,F){if(D.browser.msie&&((F.range.start===0&&F.range.end===0)||F.range.start!=F.range.end)){this.__setRange(F._this,F.value.length)}return false},__autoTab:function(F){if(F.data.autoTab&&((F.$this.val().length>=F.data.maskArray.length&&!F.repeat)||(F.data.maxLength!=-1&&F.valueArray.length>=F.data.maxLength&&F.repeat))){var E=this.__getNextInput(F._this,F.data.autoTab);if(E){F.$this.trigger("blur");E.focus().select()}}},__changeSignal:function(F,G){if(G.data.signal!==false){var E=(F==="paste")?G.value.charAt(0):String.fromCharCode(G.nKey);if(this.signals&&(typeof this.signals[E]!=="undefined")){G.data.signal=this.signals[E]}}},__getKeyNumber:function(E){return(E.charCode||E.keyCode||E.which)},__maskArray:function(M,H,G,J,E,K,N,L,F){if(J==="reverse"){M.reverse()}M=this.__removeInvalidChars(M,H,J==="repeat"||J==="infinite");if(K){M=this.__applyDefaultValue.call(M,K)}M=this.__applyMask(M,G,F,N);switch(J){case"reverse":M.reverse();return(L||"")+M.join("").substring(M.length-G.length);case"infinite":case"repeat":var I=M.join("");return(E!==-1&&M.length>=E)?I.substring(0,E):I;default:return M.join("").substring(0,G.length)}return""},__applyDefaultValue:function(G){var E=G.length,F=this.length,H;for(H=F-1;H>=0;H--){if(this[H]==G.charAt(0)){this.pop()}else{break}}for(H=0;H<E;H++){if(!this[H]){this[H]=G.charAt(H)}}return this},__removeInvalidChars:function(H,G,E){for(var F=0,I=0;F<H.length;F++){if(G[I]&&this.rules[G[I]]&&!this.rules[G[I]].test(H[F])){H.splice(F,1);if(!E){I--}F--}if(!E){I++}}return H},__applyMask:function(H,F,I,E){if(typeof I=="undefined"){I=0}for(var G=0;G<H.length+I;G++){if(F[G]&&E.test(F[G])){H.splice(G,0,F[G])}}return H},__extraPositionsTill:function(H,F,E){var G=0;while(E.test(F[H++])){G++}return G},__getNextInput:function(Q,G){var F=Q.form;if(F==null){return null}var J=F.elements,I=D.inArray(Q,J)+1,L=J.length,O=null,K;for(K=I;K<L;K++){O=D(J[K]);if(this.__isNextInput(O,G)){return O}}var E=document.forms,H=D.inArray(Q.form,E)+1,N,M,P=E.length;for(N=H;N<P;N++){M=E[N].elements;L=M.length;for(K=0;K<L;K++){O=D(M[K]);if(this.__isNextInput(O,G)){return O}}}return null},__isNextInput:function(G,E){var F=G.get(0);return F&&(F.offsetWidth>0||F.offsetHeight>0)&&F.nodeName!="FIELDSET"&&(E===true||(typeof E=="string"&&G.is(E)))},__setRange:function(G,H,E){if(typeof E=="undefined"){E=H}if(G.setSelectionRange){G.setSelectionRange(H,E)}else{var F=G.createTextRange();F.collapse();F.moveStart("character",H);F.moveEnd("character",E-H);F.select()}},__getRange:function(F){if(!D.browser.msie){return{start:F.selectionStart,end:F.selectionEnd}}var G={start:0,end:0},E=document.selection.createRange();G.start=0-E.duplicate().moveStart("character",-100000);G.end=G.start+E.text.length;return G},unmaskedVal:function(E){return D(E).val().replace(D.mask.fixedCharsRegG,"")}}});D.fn.extend({setMask:function(E){return D.mask.set(this,E)},unsetMask:function(){return D.mask.unset(this)},unmaskedVal:function(){return D.mask.unmaskedVal(this[0])}})})(jQuery);



/**
 * jquery.Jcrop.min.js v0.9.9 (build:20110607)
 * jQuery Image Cropping Plugin
 * @author Kelly Hallman <khallman@gmail.com>
 * Copyright (c) 2008-2011 Kelly Hallman - released under MIT License
 * https://github.com/tapmodo/Jcrop
 */

(function($){$.Jcrop=function(obj,opt){var options=$.extend({},$.Jcrop.defaults),docOffset,lastcurs,ie6mode=false;function px(n){return parseInt(n,10)+'px';}
function pct(n){return parseInt(n,10)+'%';}
function cssClass(cl){return options.baseClass+'-'+cl;}
function supportsColorFade(){return $.fx.step.hasOwnProperty('backgroundColor');}
function getPos(obj)
{var pos=$(obj).offset();return[pos.left,pos.top];}
function mouseAbs(e)
{return[(e.pageX-docOffset[0]),(e.pageY-docOffset[1])];}
function setOptions(opt)
{if(typeof(opt)!=='object'){opt={};}
options=$.extend(options,opt);if(typeof(options.onChange)!=='function'){options.onChange=function(){};}
if(typeof(options.onSelect)!=='function'){options.onSelect=function(){};}
if(typeof(options.onRelease)!=='function'){options.onRelease=function(){};}}
function myCursor(type)
{if(type!==lastcurs){Tracker.setCursor(type);lastcurs=type;}}
function startDragMode(mode,pos)
{docOffset=getPos($img);Tracker.setCursor(mode==='move'?mode:mode+'-resize');if(mode==='move'){return Tracker.activateHandlers(createMover(pos),doneSelect);}
var fc=Coords.getFixed();var opp=oppLockCorner(mode);var opc=Coords.getCorner(oppLockCorner(opp));Coords.setPressed(Coords.getCorner(opp));Coords.setCurrent(opc);Tracker.activateHandlers(dragmodeHandler(mode,fc),doneSelect);}
function dragmodeHandler(mode,f)
{return function(pos){if(!options.aspectRatio){switch(mode){case'e':pos[1]=f.y2;break;case'w':pos[1]=f.y2;break;case'n':pos[0]=f.x2;break;case's':pos[0]=f.x2;break;}}else{switch(mode){case'e':pos[1]=f.y+1;break;case'w':pos[1]=f.y+1;break;case'n':pos[0]=f.x+1;break;case's':pos[0]=f.x+1;break;}}
Coords.setCurrent(pos);Selection.update();};}
function createMover(pos)
{var lloc=pos;KeyManager.watchKeys();return function(pos){Coords.moveOffset([pos[0]-lloc[0],pos[1]-lloc[1]]);lloc=pos;Selection.update();};}
function oppLockCorner(ord)
{switch(ord){case'n':return'sw';case's':return'nw';case'e':return'nw';case'w':return'ne';case'ne':return'sw';case'nw':return'se';case'se':return'nw';case'sw':return'ne';}}
function createDragger(ord)
{return function(e){if(options.disabled){return false;}
if((ord==='move')&&!options.allowMove){return false;}
btndown=true;startDragMode(ord,mouseAbs(e));e.stopPropagation();e.preventDefault();return false;};}
function presize($obj,w,h)
{var nw=$obj.width(),nh=$obj.height();if((nw>w)&&w>0){nw=w;nh=(w/$obj.width())*$obj.height();}
if((nh>h)&&h>0){nh=h;nw=(h/$obj.height())*$obj.width();}
xscale=$obj.width()/nw;yscale=$obj.height()/nh;$obj.width(nw).height(nh);}
function unscale(c)
{return{x:parseInt(c.x*xscale,10),y:parseInt(c.y*yscale,10),x2:parseInt(c.x2*xscale,10),y2:parseInt(c.y2*yscale,10),w:parseInt(c.w*xscale,10),h:parseInt(c.h*yscale,10)};}
function doneSelect(pos)
{var c=Coords.getFixed();if((c.w>options.minSelect[0])&&(c.h>options.minSelect[1])){Selection.enableHandles();Selection.done();}else{Selection.release();}
Tracker.setCursor(options.allowSelect?'crosshair':'default');}
function newSelection(e)
{if(options.disabled){return false;}
if(!options.allowSelect){return false;}
btndown=true;docOffset=getPos($img);Selection.disableHandles();myCursor('crosshair');var pos=mouseAbs(e);Coords.setPressed(pos);Selection.update();Tracker.activateHandlers(selectDrag,doneSelect);KeyManager.watchKeys();e.stopPropagation();e.preventDefault();return false;}
function selectDrag(pos)
{Coords.setCurrent(pos);Selection.update();}
function newTracker()
{var trk=$('<div></div>').addClass(cssClass('tracker'));if($.browser.msie){trk.css({opacity:0,backgroundColor:'white'});}
return trk;}
if($.browser.msie&&($.browser.version.split('.')[0]==='6')){ie6mode=true;}
if(typeof(obj)!=='object'){obj=$(obj)[0];}
if(typeof(opt)!=='object'){opt={};}
setOptions(opt);var img_css={border:'none',margin:0,padding:0,position:'absolute'};var $origimg=$(obj);var $img=$origimg.clone().removeAttr('id').css(img_css);$img.width($origimg.width());$img.height($origimg.height());$origimg.after($img).hide();presize($img,options.boxWidth,options.boxHeight);var boundx=$img.width(),boundy=$img.height(),$div=$('<div />').width(boundx).height(boundy).addClass(cssClass('holder')).css({position:'relative',backgroundColor:options.bgColor}).insertAfter($origimg).append($img);delete(options.bgColor);if(options.addClass){$div.addClass(options.addClass);}
var $img2=$('<img />').attr('src',$img.attr('src')).css(img_css).width(boundx).height(boundy),$img_holder=$('<div />').width(pct(100)).height(pct(100)).css({zIndex:310,position:'absolute',overflow:'hidden'}).append($img2),$hdl_holder=$('<div />').width(pct(100)).height(pct(100)).css('zIndex',320),$sel=$('<div />').css({position:'absolute',zIndex:300}).insertBefore($img).append($img_holder,$hdl_holder);if(ie6mode){$sel.css({overflowY:'hidden'});}
var bound=options.boundary;var $trk=newTracker().width(boundx+(bound*2)).height(boundy+(bound*2)).css({position:'absolute',top:px(-bound),left:px(-bound),zIndex:290}).mousedown(newSelection);var bgopacity=options.bgOpacity,xlimit,ylimit,xmin,ymin,xscale,yscale,enabled=true,btndown,animating,shift_down;docOffset=getPos($img);var Touch=(function(){function hasTouchSupport(){var support={},events=['touchstart','touchmove','touchend'],el=document.createElement('div'),i;try{for(i=0;i<events.length;i++){var eventName=events[i];eventName='on'+eventName;var isSupported=(eventName in el);if(!isSupported){el.setAttribute(eventName,'return;');isSupported=typeof el[eventName]=='function';}
support[events[i]]=isSupported;}
return support.touchstart&&support.touchend&&support.touchmove;}
catch(err){return false;}}
function detectSupport(){if((options.touchSupport===true)||(options.touchSupport===false))return options.touchSupport;else return hasTouchSupport();}
return{createDragger:function(ord){return function(e){e.pageX=e.originalEvent.changedTouches[0].pageX;e.pageY=e.originalEvent.changedTouches[0].pageY;if(options.disabled){return false;}
if((ord==='move')&&!options.allowMove){return false;}
btndown=true;startDragMode(ord,mouseAbs(e));e.stopPropagation();e.preventDefault();return false;};},newSelection:function(e){e.pageX=e.originalEvent.changedTouches[0].pageX;e.pageY=e.originalEvent.changedTouches[0].pageY;return newSelection(e);},isSupported:hasTouchSupport,support:detectSupport()};}());var Coords=(function(){var x1=0,y1=0,x2=0,y2=0,ox,oy;function setPressed(pos)
{pos=rebound(pos);x2=x1=pos[0];y2=y1=pos[1];}
function setCurrent(pos)
{pos=rebound(pos);ox=pos[0]-x2;oy=pos[1]-y2;x2=pos[0];y2=pos[1];}
function getOffset()
{return[ox,oy];}
function moveOffset(offset)
{var ox=offset[0],oy=offset[1];if(0>x1+ox){ox-=ox+x1;}
if(0>y1+oy){oy-=oy+y1;}
if(boundy<y2+oy){oy+=boundy-(y2+oy);}
if(boundx<x2+ox){ox+=boundx-(x2+ox);}
x1+=ox;x2+=ox;y1+=oy;y2+=oy;}
function getCorner(ord)
{var c=getFixed();switch(ord){case'ne':return[c.x2,c.y];case'nw':return[c.x,c.y];case'se':return[c.x2,c.y2];case'sw':return[c.x,c.y2];}}
function getFixed()
{if(!options.aspectRatio){return getRect();}
var aspect=options.aspectRatio,min_x=options.minSize[0]/xscale,max_x=options.maxSize[0]/xscale,max_y=options.maxSize[1]/yscale,rw=x2-x1,rh=y2-y1,rwa=Math.abs(rw),rha=Math.abs(rh),real_ratio=rwa/rha,xx,yy;if(max_x===0){max_x=boundx*10;}
if(max_y===0){max_y=boundy*10;}
if(real_ratio<aspect){yy=y2;w=rha*aspect;xx=rw<0?x1-w:w+x1;if(xx<0){xx=0;h=Math.abs((xx-x1)/aspect);yy=rh<0?y1-h:h+y1;}else if(xx>boundx){xx=boundx;h=Math.abs((xx-x1)/aspect);yy=rh<0?y1-h:h+y1;}}else{xx=x2;h=rwa/aspect;yy=rh<0?y1-h:y1+h;if(yy<0){yy=0;w=Math.abs((yy-y1)*aspect);xx=rw<0?x1-w:w+x1;}else if(yy>boundy){yy=boundy;w=Math.abs(yy-y1)*aspect;xx=rw<0?x1-w:w+x1;}}
if(xx>x1){if(xx-x1<min_x){xx=x1+min_x;}else if(xx-x1>max_x){xx=x1+max_x;}
if(yy>y1){yy=y1+(xx-x1)/aspect;}else{yy=y1-(xx-x1)/aspect;}}else if(xx<x1){if(x1-xx<min_x){xx=x1-min_x;}else if(x1-xx>max_x){xx=x1-max_x;}
if(yy>y1){yy=y1+(x1-xx)/aspect;}else{yy=y1-(x1-xx)/aspect;}}
if(xx<0){x1-=xx;xx=0;}else if(xx>boundx){x1-=xx-boundx;xx=boundx;}
if(yy<0){y1-=yy;yy=0;}else if(yy>boundy){y1-=yy-boundy;yy=boundy;}
return makeObj(flipCoords(x1,y1,xx,yy));}
function rebound(p)
{if(p[0]<0){p[0]=0;}
if(p[1]<0){p[1]=0;}
if(p[0]>boundx){p[0]=boundx;}
if(p[1]>boundy){p[1]=boundy;}
return[p[0],p[1]];}
function flipCoords(x1,y1,x2,y2)
{var xa=x1,xb=x2,ya=y1,yb=y2;if(x2<x1){xa=x2;xb=x1;}
if(y2<y1){ya=y2;yb=y1;}
return[Math.round(xa),Math.round(ya),Math.round(xb),Math.round(yb)];}
function getRect()
{var xsize=x2-x1,ysize=y2-y1,delta;if(xlimit&&(Math.abs(xsize)>xlimit)){x2=(xsize>0)?(x1+xlimit):(x1-xlimit);}
if(ylimit&&(Math.abs(ysize)>ylimit)){y2=(ysize>0)?(y1+ylimit):(y1-ylimit);}
if(ymin/yscale&&(Math.abs(ysize)<ymin/yscale)){y2=(ysize>0)?(y1+ymin/yscale):(y1-ymin/yscale);}
if(xmin/xscale&&(Math.abs(xsize)<xmin/xscale)){x2=(xsize>0)?(x1+xmin/xscale):(x1-xmin/xscale);}
if(x1<0){x2-=x1;x1-=x1;}
if(y1<0){y2-=y1;y1-=y1;}
if(x2<0){x1-=x2;x2-=x2;}
if(y2<0){y1-=y2;y2-=y2;}
if(x2>boundx){delta=x2-boundx;x1-=delta;x2-=delta;}
if(y2>boundy){delta=y2-boundy;y1-=delta;y2-=delta;}
if(x1>boundx){delta=x1-boundy;y2-=delta;y1-=delta;}
if(y1>boundy){delta=y1-boundy;y2-=delta;y1-=delta;}
return makeObj(flipCoords(x1,y1,x2,y2));}
function makeObj(a)
{return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]};}
return{flipCoords:flipCoords,setPressed:setPressed,setCurrent:setCurrent,getOffset:getOffset,moveOffset:moveOffset,getCorner:getCorner,getFixed:getFixed};}());var Selection=(function(){var awake,hdep=370;var borders={};var handle={};var seehandles=false;var hhs=options.handleOffset;function insertBorder(type)
{var jq=$('<div />').css({position:'absolute',opacity:options.borderOpacity}).addClass(cssClass(type));$img_holder.append(jq);return jq;}
function dragDiv(ord,zi)
{var jq=$('<div />').mousedown(createDragger(ord)).css({cursor:ord+'-resize',position:'absolute',zIndex:zi});if(Touch.support){jq.bind('touchstart',Touch.createDragger(ord));}
$hdl_holder.append(jq);return jq;}
function insertHandle(ord)
{return dragDiv(ord,hdep++).css({top:px(-hhs+1),left:px(-hhs+1),opacity:options.handleOpacity}).addClass(cssClass('handle'));}
function insertDragbar(ord)
{var s=options.handleSize,h=s,w=s,t=hhs,l=hhs;switch(ord){case'n':case's':w=pct(100);break;case'e':case'w':h=pct(100);break;}
return dragDiv(ord,hdep++).width(w).height(h).css({top:px(-t+1),left:px(-l+1)});}
function createHandles(li)
{var i;for(i=0;i<li.length;i++){handle[li[i]]=insertHandle(li[i]);}}
function moveHandles(c)
{var midvert=Math.round((c.h/2)-hhs),midhoriz=Math.round((c.w/2)-hhs),north=-hhs+1,west=-hhs+1,east=c.w-hhs,south=c.h-hhs,x,y;if(handle.e){handle.e.css({top:px(midvert),left:px(east)});handle.w.css({top:px(midvert)});handle.s.css({top:px(south),left:px(midhoriz)});handle.n.css({left:px(midhoriz)});}
if(handle.ne){handle.ne.css({left:px(east)});handle.se.css({top:px(south),left:px(east)});handle.sw.css({top:px(south)});}
if(handle.b){handle.b.css({top:px(south)});handle.r.css({left:px(east)});}}
function moveto(x,y)
{$img2.css({top:px(-y),left:px(-x)});$sel.css({top:px(y),left:px(x)});}
function resize(w,h)
{$sel.width(w).height(h);}
function refresh()
{var c=Coords.getFixed();Coords.setPressed([c.x,c.y]);Coords.setCurrent([c.x2,c.y2]);updateVisible();}
function updateVisible()
{if(awake){return update();}}
function update()
{var c=Coords.getFixed();resize(c.w,c.h);moveto(c.x,c.y);if(seehandles){moveHandles(c);}
if(!awake){show();}
options.onChange.call(api,unscale(c));}
function show()
{$sel.show();if(options.bgFade){$img.fadeTo(options.fadeTime,bgopacity);}else{$img.css('opacity',bgopacity);}
awake=true;}
function release()
{disableHandles();$sel.hide();if(options.bgFade){$img.fadeTo(options.fadeTime,1);}else{$img.css('opacity',1);}
awake=false;options.onRelease.call(api);}
function showHandles()
{if(seehandles){moveHandles(Coords.getFixed());$hdl_holder.show();}}
function enableHandles()
{seehandles=true;if(options.allowResize){moveHandles(Coords.getFixed());$hdl_holder.show();return true;}}
function disableHandles()
{seehandles=false;$hdl_holder.hide();}
function animMode(v)
{if(animating===v){disableHandles();}else{enableHandles();}}
function done()
{animMode(false);refresh();}
if(options.drawBorders){borders={top:insertBorder('hline'),bottom:insertBorder('hline bottom'),left:insertBorder('vline'),right:insertBorder('vline right')};}
if(options.dragEdges){handle.t=insertDragbar('n');handle.b=insertDragbar('s');handle.r=insertDragbar('e');handle.l=insertDragbar('w');}
if(options.sideHandles){createHandles(['n','s','e','w']);}
if(options.cornerHandles){createHandles(['sw','nw','ne','se']);}
var $track=newTracker().mousedown(createDragger('move')).css({cursor:'move',position:'absolute',zIndex:360});if(Touch.support){$track.bind('touchstart.jcrop',Touch.createDragger('move'));}
$img_holder.append($track);disableHandles();return{updateVisible:updateVisible,update:update,release:release,refresh:refresh,isAwake:function(){return awake;},setCursor:function(cursor){$track.css('cursor',cursor);},enableHandles:enableHandles,enableOnly:function(){seehandles=true;},showHandles:showHandles,disableHandles:disableHandles,animMode:animMode,done:done};}());var Tracker=(function(){var onMove=function(){},onDone=function(){},trackDoc=options.trackDocument;function toFront()
{$trk.css({zIndex:450});if(trackDoc){$(document).bind('mousemove',trackMove).bind('mouseup',trackUp);}}
function toBack()
{$trk.css({zIndex:290});if(trackDoc){$(document).unbind('mousemove',trackMove).unbind('mouseup',trackUp);}}
function trackMove(e)
{onMove(mouseAbs(e));return false;}
function trackUp(e)
{e.preventDefault();e.stopPropagation();if(btndown){btndown=false;onDone(mouseAbs(e));if(Selection.isAwake()){options.onSelect.call(api,unscale(Coords.getFixed()));}
toBack();onMove=function(){};onDone=function(){};}
return false;}
function activateHandlers(move,done)
{btndown=true;onMove=move;onDone=done;toFront();return false;}
function trackTouchMove(e)
{e.pageX=e.originalEvent.changedTouches[0].pageX;e.pageY=e.originalEvent.changedTouches[0].pageY;return trackMove(e);}
function trackTouchEnd(e)
{e.pageX=e.originalEvent.changedTouches[0].pageX;e.pageY=e.originalEvent.changedTouches[0].pageY;return trackUp(e);}
function setCursor(t)
{$trk.css('cursor',t);}
if(Touch.support){$(document).bind('touchmove',trackTouchMove).bind('touchend',trackTouchEnd);}
if(!trackDoc){$trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp);}
$img.before($trk);return{activateHandlers:activateHandlers,setCursor:setCursor};}());var KeyManager=(function(){var $keymgr=$('<input type="radio" />').css({position:'fixed',left:'-120px',width:'12px'}),$keywrap=$('<div />').css({position:'absolute',overflow:'hidden'}).append($keymgr);function watchKeys()
{if(options.keySupport){$keymgr.show();$keymgr.focus();}}
function onBlur(e)
{$keymgr.hide();}
function doNudge(e,x,y)
{if(options.allowMove){Coords.moveOffset([x,y]);Selection.updateVisible();}
e.preventDefault();e.stopPropagation();}
function parseKey(e)
{if(e.ctrlKey){return true;}
shift_down=e.shiftKey?true:false;var nudge=shift_down?10:1;switch(e.keyCode){case 37:doNudge(e,-nudge,0);break;case 39:doNudge(e,nudge,0);break;case 38:doNudge(e,0,-nudge);break;case 40:doNudge(e,0,nudge);break;case 27:Selection.release();break;case 9:return true;}
return false;}
if(options.keySupport){$keymgr.keydown(parseKey).blur(onBlur);if(ie6mode||!options.fixedSupport){$keymgr.css({position:'absolute',left:'-20px'});$keywrap.append($keymgr).insertBefore($img);}else{$keymgr.insertBefore($img);}}
return{watchKeys:watchKeys};}());function setClass(cname)
{$div.removeClass().addClass(cssClass('holder')).addClass(cname);}
function animateTo(a,callback)
{var x1=parseInt(a[0],10)/xscale,y1=parseInt(a[1],10)/yscale,x2=parseInt(a[2],10)/xscale,y2=parseInt(a[3],10)/yscale;if(animating){return;}
var animto=Coords.flipCoords(x1,y1,x2,y2),c=Coords.getFixed(),initcr=[c.x,c.y,c.x2,c.y2],animat=initcr,interv=options.animationDelay,ix1=animto[0]-initcr[0],iy1=animto[1]-initcr[1],ix2=animto[2]-initcr[2],iy2=animto[3]-initcr[3],pcent=0,velocity=options.swingSpeed;x=animat[0];y=animat[1];x2=animat[2];y2=animat[3];Selection.animMode(true);var anim_timer;function queueAnimator(){window.setTimeout(animator,interv);}
var animator=(function(){return function(){pcent+=(100-pcent)/velocity;animat[0]=x+((pcent/100)*ix1);animat[1]=y+((pcent/100)*iy1);animat[2]=x2+((pcent/100)*ix2);animat[3]=y2+((pcent/100)*iy2);if(pcent>=99.8){pcent=100;}
if(pcent<100){setSelectRaw(animat);queueAnimator();}else{Selection.done();if(typeof(callback)==='function'){callback.call(api);}}};}());queueAnimator();}
function setSelect(rect)
{setSelectRaw([parseInt(rect[0],10)/xscale,parseInt(rect[1],10)/yscale,parseInt(rect[2],10)/xscale,parseInt(rect[3],10)/yscale]);}
function setSelectRaw(l)
{Coords.setPressed([l[0],l[1]]);Coords.setCurrent([l[2],l[3]]);Selection.update();}
function tellSelect()
{return unscale(Coords.getFixed());}
function tellScaled()
{return Coords.getFixed();}
function setOptionsNew(opt)
{setOptions(opt);interfaceUpdate();}
function disableCrop()
{options.disabled=true;Selection.disableHandles();Selection.setCursor('default');Tracker.setCursor('default');}
function enableCrop()
{options.disabled=false;interfaceUpdate();}
function cancelCrop()
{Selection.done();Tracker.activateHandlers(null,null);}
function destroy()
{$div.remove();$origimg.show();$(obj).removeData('Jcrop');}
function setImage(src,callback)
{Selection.release();disableCrop();var img=new Image();img.onload=function(){var iw=img.width;var ih=img.height;var bw=options.boxWidth;var bh=options.boxHeight;$img.width(iw).height(ih);$img.attr('src',src);$img2.attr('src',src);presize($img,bw,bh);boundx=$img.width();boundy=$img.height();$img2.width(boundx).height(boundy);$trk.width(boundx+(bound*2)).height(boundy+(bound*2));$div.width(boundx).height(boundy);enableCrop();if(typeof(callback)==='function'){callback.call(api);}};img.src=src;}
function interfaceUpdate(alt)
{if(options.allowResize){if(alt){Selection.enableOnly();}else{Selection.enableHandles();}}else{Selection.disableHandles();}
Tracker.setCursor(options.allowSelect?'crosshair':'default');Selection.setCursor(options.allowMove?'move':'default');if(options.hasOwnProperty('setSelect')){setSelect(options.setSelect);Selection.done();delete(options.setSelect);}
if(options.hasOwnProperty('trueSize')){xscale=options.trueSize[0]/boundx;yscale=options.trueSize[1]/boundy;}
if(options.hasOwnProperty('bgColor')){if(supportsColorFade()&&options.fadeTime){$div.animate({backgroundColor:options.bgColor},{queue:false,duration:options.fadeTime});}else{$div.css('backgroundColor',options.bgColor);}
delete(options.bgColor);}
if(options.hasOwnProperty('bgOpacity')){bgopacity=options.bgOpacity;if(Selection.isAwake()){if(options.fadeTime){$img.fadeTo(options.fadeTime,bgopacity);}else{$div.css('opacity',options.opacity);}}
delete(options.bgOpacity);}
xlimit=options.maxSize[0]||0;ylimit=options.maxSize[1]||0;xmin=options.minSize[0]||0;ymin=options.minSize[1]||0;if(options.hasOwnProperty('outerImage')){$img.attr('src',options.outerImage);delete(options.outerImage);}
Selection.refresh();}
if(Touch.support){$trk.bind('touchstart',Touch.newSelection);}
$hdl_holder.hide();interfaceUpdate(true);var api={setImage:setImage,animateTo:animateTo,setSelect:setSelect,setOptions:setOptionsNew,tellSelect:tellSelect,tellScaled:tellScaled,setClass:setClass,disable:disableCrop,enable:enableCrop,cancel:cancelCrop,release:Selection.release,destroy:destroy,focus:KeyManager.watchKeys,getBounds:function(){return[boundx*xscale,boundy*yscale];},getWidgetSize:function(){return[boundx,boundy];},getScaleFactor:function(){return[xscale,yscale];},ui:{holder:$div,selection:$sel}};if($.browser.msie){$div.bind('selectstart',function(){return false;});}
$origimg.data('Jcrop',api);return api;};$.fn.Jcrop=function(options,callback)
{function attachWhenDone(from)
{var opt=(typeof(options)==='object')?options:{};var loadsrc=opt.useImg||from.src;var img=new Image();img.onload=function(){function attachJcrop(){var api=$.Jcrop(from,opt);if(typeof(callback)==='function'){callback.call(api);}}
function attachAttempt(){if(!img.width||!img.height){window.setTimeout(attachAttempt,50);}else{attachJcrop();}}
window.setTimeout(attachAttempt,50);};img.src=loadsrc;}
this.each(function(){if($(this).data('Jcrop')){if(options==='api'){return $(this).data('Jcrop');}
else{$(this).data('Jcrop').setOptions(options);}}
else{attachWhenDone(this);}});return this;};$.Jcrop.defaults={allowSelect:true,allowMove:true,allowResize:true,trackDocument:true,baseClass:'jcrop',addClass:null,bgColor:'black',bgOpacity:0.6,bgFade:false,borderOpacity:0.4,handleOpacity:0.5,handleSize:9,handleOffset:5,aspectRatio:0,keySupport:true,cornerHandles:true,sideHandles:true,drawBorders:true,dragEdges:true,fixedSupport:true,touchSupport:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onRelease:function(){}};}(jQuery))