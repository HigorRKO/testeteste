var ativarSlides = function(select){
    $(select).slides({
		preload: false,
		preloadImage: 'img/loading.gif',
		play: 4000,
		pause: 2500,
		hoverPause: true,
		slideSpeed: 600,
		slideEasing: 'easeInOutExpo',
		animationStart: function(current){
			$('.caption').animate({
				bottom: -60
			},300);
		},
		animationComplete: function(current){
			$('.caption').animate({
				bottom: 0
			},300);
		},
		slidesLoaded: function() {
			$('.caption').animate({
				bottom: 0
			},300);
		}
	});
}

var jcherbly = function()
{
	$(".nc").hide(0);
	
	$(".tab_content").hide(0);
	$("ul.tabs li:first a").addClass("active").show(0);
	$(".tab_content:first").show(0);
	$("ul.tabs li a").click(function() {
		$("ul.tabs li a").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide(0);
		var activeTab = $(this).attr("href");
		$(activeTab).fadeIn(0);
		$(".open-floater").hoverIntent({
			over: floaterOpen, 
			timeout: 0, 
			out: floaterClose
		});
		function floaterOpen(){ 
		$('.floater').hide(0);
		$('.floater', this).fadeIn(400,'easeOutExpo');
		}
		function floaterClose(){
			$('.floater').hide(0);
			$('.floater', this).fadeOut(400,'easeOutExpo');
		}
		return false;
	});
	
	$("table.checkbox input[type=text]").dblclick(function() {
		$(this).hide(0);
		$(this).parent().find('.nc').show(0);
		return false;
	});
	
	$("table.checkbox .nc").dblclick(function() {
		$(this).hide(0);
		$(this).parent().find('input[type=text]').show(0);
		return false;
	});

	//$('form.jNice').jNice();

	$("header nav ul li").hoverIntent({
		over: menuOpen, 
		timeout: 100, 
		out: menuClose
	});

	function menuOpen(){ 
		$(this).find('.sub').fadeIn(400,'easeOutExpo');
	}
	function menuClose(){
		$(this).find('.sub').fadeOut(400,'easeOutExpo');
	}	
	
	$(".shortcut").hoverIntent({
		over: shortcutOpen, 
		timeout: 100, 
		out: shortcutClose
	});

	function shortcutOpen(){ 
		$(this).find('.sub').fadeIn(400,'easeOutExpo');
	}
	function shortcutClose(){
		$(this).find('.sub').fadeOut(400,'easeOutExpo');
	}

	$(".tabDistribuicao-didatico dd").dblclick(function(){
		if($(this).hasClass('selectProgama'))
			$(this).removeClass('selectProgama');
		else
			$(this).addClass('selectProgama');
	});


	/* slides */
        
        ativarSlides('#slides, #slides2');


	/*sortable */

	$('.column').sortable({
		connectWith: '.column',
		cancel: '.green',
                update:function(i,e){
                    if(e.sender === null){                        
                        var item = $.devModuleFunction('index.salvarPortlets');
                        item.func(item.context);
                    }   
                }
	});

	$('.portlet').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
		.find('.portlet-header')
		.addClass('ui-widget-header ui-corner-all')
		.prepend("<span class='ui-icon ui-icon-minusthick'></span> <span class='ui-icon ui-icon-trash'></span>")
		.end()
		.find('.portlet-content');

	$('.portlet-header .ui-icon-minusthick').click(function() {
		$(this).toggleClass('ui-icon-minusthick').toggleClass('ui-icon-plusthick');
		$(this).parents('.portlet:first').find('.portlet-content').toggle();
	});
	
	$('#close-sitemap').click(function() {
		$('#open-sitemap').show(0);
		$('#close-sitemap').hide(0);
		$('#sitemap').slideUp(600,'easeOutExpo');
		return false;
	});
	
	$('.bt-close').click(function() {
		$('.alerta').slideUp(600,'easeOutExpo');
		return false;
	});


	$('.plano-aula .bt-alterar').click(function(){
		$(this).parent().parent().parent().find('.edicao').slideToggle(0,'easeOutExpo',function(){
//			if ($(this).is(':visible')){
//				$('img',that).attr('src','../img/ico-minus.png');
//			}else{
//				$('img',that).attr('src','../img/ico-plus.png');
//			}
		});
		return false;
	});
	
	
	$('#open-sitemap').click(function() {
		$('#open-sitemap').hide(0);
		$('#close-sitemap').show(0);
		$('#sitemap').slideDown(600,'easeOutExpo',function(){
			$('html,body').animate({scrollTop: $('#sitemap').offset().top}, 1200, 'easeOutExpo');
		});
		return false;
	});

	$('.column').disableSelection();


	$('.ctrl .p').click(function() {
		$(this).hide(0);
		$(this).parent().find('.f').show(0);
		return false;
	});
	
	$('.ctrl .f').click(function() {
		$(this).hide(0);
		$(this).parent().find('.p').show(0);
		return false;
	});
    
        $('.addContentBox').hover(function(){
		$('.addContent').fadeIn();
	}, function(){
		$('.addContent').fadeOut();
	});
};



$(document).ready(function(){
	
	jcherbly();
	//var imgDiv = $("<div class='dev-ico icon-plus'>").addClass("icon-plus");  
	var obj = $('img[src="../img/ico-plus.png"]'); 
	obj.replaceWith('<div class="dev-ico icon-plus"></div>');
        
	var obj = $('img[src="../img/ico-atta.png"]'); 
	obj.replaceWith('<div class="icon-atta"></div>');
        var showDetail = function(){
		var that = this;
		var container = $(this).parent().parent().next('.detail2');
		container.slideToggle(0,'easeOutExpo',function(){
                    if ($(this).is(':visible')){				 
                             $('.dev-ico').removeClass("icon-minus").addClass("icon-plus");
                             $('.dev-ico',that).removeClass("icon-plus").addClass("icon-minus");
                    }else{

                            $('.dev-ico',that).removeClass("icon-minus").addClass("icon-plus");
                    }
		});
		$(".tab_content",container).hide(0);
		$("ul.tabs li:first a",container).addClass("active").show(0);
		$(".tab_content:first",container).show(0);
                
                return false;
	};
	$('.show-detail').click(showDetail);
	$('.show-detail-anexo').click(function(){
            $(this).parent().prev().children('a').trigger('click');
            $(this).ajaxComplete(function(){
                $('a[href=#arquivos]').trigger('click');
            });                        
            return false;
        });
        
        $.devComponent();
        $.devValidation();
        $.devMask();
        $("[dev-wizard=true]").wizard();
        
        $("#logar").hover(function(){ $(this).addClass("ui-state-hover");},function(){ $(this).removeClass("ui-state-hover");})
            
        /*   */
        $('.portlet.green .portlet-header .ui-icon').remove();
        $(document).find(':not(table.ui-datepicker-calendar tr td)').tooltip({
           position: { my: "left center", at: "right center" },
           hide: { effect: "fade", duration: 1000 } ,
           show: { effect: "fade", duration: 800 } 
        });
        $("#dev-application").show();
        $(".dev-init").remove();
        $("body").removeClass('dev');
        
      
});

