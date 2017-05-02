$(document).ready(function() {
	var sticky = $('.header__sticky')
	var stickyOffset = sticky.offset().top;

	$(window).scroll(function(){
		var scroll = $(window).scrollTop();

		if (scroll >= stickyOffset) {
			sticky.addClass('header__sticky_fixed');
		} else {
			sticky.removeClass('header__sticky_fixed');
		}
	});

	$(".fancybox-link").fancybox({
		padding: 0,
        closeBtn: false,
        fitToView: false
	});

	$("a.disabled").click(function(e){
		e.preventDefault();
	});

	$(".header__toggle-ico").click(function(e){
		e.preventDefault();
		$(".header").toggleClass("header_with_menu");
	});

	$(".select-text, .select").customSelect({maxRows: 10});

	$(".select-checkbox__title").click(function(e){
		e.preventDefault();
		var wrapper = $(this).closest(".select-checkbox")
		wrapper.toggleClass("active");
		wrapper.find(".select-checkbox__popup").slideToggle(200);
	});

	$(".main-filter__add-word").click(function(e){
		e.preventDefault();
		var self = $(this);
		var word = $(this).parent().find(".main-filter__input-word");
		$(".main-filter__info").hide();
		word.find(".input-clear__delete").hide();
		word.find(".input-clear__input").val("");
		word.fadeIn(200);
	});

	$(".input-clear__input").keyup(function(){
		var parent = $(this).closest(".input-clear");
		if ($(this).val() != "") {
			parent.find(".input-clear__delete").show();
		} else {
			parent.find(".input-clear__delete").hide();
		}
	});

	$(".input-clear").on("click", ".input-clear__delete", function(e){
		e.preventDefault();
		$(this).hide();
		$(this).closest(".input-clear").find(".input-clear__input").val("");
	});

	$(".main-filter__toggle-link").click(function(e){
		e.preventDefault();
		var self = $(this);
		var extended= $(".main-filter__body-extended");
		if (self.hasClass("main-filter__toggle-link_extended")) {
			self.hide();
			extended.slideDown(200);
			$(".main-filter__toggle-link_normal").show();
		}
		if (self.hasClass("main-filter__toggle-link_normal")) {
			self.hide();
			extended.slideUp(200);
			$(".main-filter__toggle-link_extended").show();
		}
	});

	$(".main-filter__input-word .input-clear__input").change(function(){
		var val = $(this).val();
		var self = $(this).closest(".main-filter__input-word");
		var newBtn = "<a href='#' class='btn btn_gradient main-filter__word'>" +
						"<span class='btn__text'>" + val + "</span>" +
						"<span class='btn__icon'>" +
							"<svg width='12' height='12'>" +
								"<use xlink:href='#icon-delete'></use>" +
							"</svg>" +
						"</span>" +
					"</a>"
		self.after(function(){
			return newBtn
		});
		self.hide();
	});

	$(".main-filter__body-bottom").on("click", ".main-filter__word", function(e){
		e.preventDefault();
		$(this).remove();
	});

	$(".main-filter__type").click(function(){ //временное решение. Просто чтобы верстку показать
		var self = $(this);
		$(".main-filter__type").addClass("disabled");
		self.removeClass("disabled");
		$(".main-filter__or").hide();
	});

	//area count(пока не делаю глубокую логику)
	var areaArray = $(".fancybox__columns").find("input[type='checkbox']");

	function countCheckedArea(areas) {
		var countChecked = 0;

		areas.each(function(i) {
			if (areas.eq(i).prop("checked")) {
				countChecked += 1;
			}
		});

		return countChecked;
	}

	function addCountArea(){
		var countChecked = countCheckedArea(areaArray);
		if (countChecked > 0){
			$(".main-filter__area").addClass("main-filter__area_active");
			$(".main-filter__area-count").html(countChecked);
		} else {
			$(".main-filter__area").removeClass("main-filter__area_active");
			$(".main-filter__area-count").html("");
		}
	}
	addCountArea();

	areaArray.click(function(){
		addCountArea();
	});
	//----

	if ($("#map").length > 0){
		ymaps.ready(init);
	    var myMap;

	    function init(){     
	        myMap = new ymaps.Map("map", {
	            center: [56.8305,60.5970],
	            zoom: 17,
	            controls: []
	        });

	        myPlacemark = new ymaps.Placemark([56.8305,60.6000]);

	        myMap.controls.add('zoomControl');

	        myMap.behaviors.disable('scrollZoom'); 

	        myMap.geoObjects.add(myPlacemark);
	    }
	}

	var arrowAddress = [//просто пример данных
		{
			"type": "ул.", 
			"name": "Согласования", 
			"specific": "Екатеринбург, Сверловская обл.",
			"value": "ул. Согласования"
		},
		{	
			"type": "ул.", 
			"name": "Совелова", 
			"specific": "Екатеринбург, Сверловская обл.",
			"value": "ул. Совелова"
		},
		{
			"type": "ул.", 
			"name": "Советская", 
			"specific": "Екатеринбург, Сверловская обл.",
			"value": "ул. Советская"
		},
		{
			"type": "пер.", 
			"name": "Совхозный", 
			"specific": "Екатеринбург, Сверловская обл.",
			"value": "пер. Совхозный"
		}
	]

	$(".inp_autocomplite").autocomplete({// https://jqueryui.com/autocomplete/
      	source: arrowAddress,
      	minLength: 0
    }).autocomplete("instance")._renderItem = function( ul, item ) {
      	return $("<li>")
	        .append("<div>" + item.type + 
	        	" <span class='inp__address'>" + 
	        		item.name + 
	    		"</span><span class='inp__specific'>, " + item.specific + "</span></div>" )
	        .appendTo( ul );
    };

    $(".form-add__address").change(function(){
    	$(".form-add__info").addClass("form-add__info_active");
    });

    $(".dropzone").dropzone({ 
    	url: "../images/dropzone",
    	maxFilesize: 1,
    	maxFiles: 10,
    	thumbnailWidth: 240,
    	thumbnailHeight: 160,
    	previewTemplate: $("#dropzoneTamplate").html()
    });

    $(".dropzone").on("click", ".room__value", function(e){
    	e.preventDefault();
    	var self = $(this);
    	var parent = self.closest(".room");
    	self.slideUp(200);
    	parent.find(".room__body").slideDown(200);
    });

    $(".dropzone").on("click", ".room__link", function(e){
    	e.preventDefault();
    	var self = $(this);
    	var parent = self.closest(".room");
    	parent.find(".room__value").text(self.text()).slideDown(200);
    	parent.find(".room__body").slideUp(200);
    });

    $(".dropzone").on("click", ".room__add", function(e){
    	e.preventDefault();
    	var self = $(this);
    	var parent = self.closest(".room");
    	var inp = parent.find(".room__input");
    	parent.find(".room__value").text(inp.val()).slideDown(200);
    	parent.find(".room__body").slideUp(200);
    });

    $(".tip__delete").click(function(e){
    	e.preventDefault();
    	$(this).closest(".tip").fadeOut(200);
    });

    function descriptionLength(){
    	$(".description__count").text($(".description__text").val().length);
    }

    descriptionLength();
    $(".description__text").keyup(function(){
    	descriptionLength();
    });

    $("#MyStatus").change(function() {
    	if ($(this).prop("checked")) {
    		$(".rent__check_commision").show(200);
    	} else {
    		$(".rent__check_commision").hide(200);
    	}
    });

    $(".social__link").click(function(e){
    	e.preventDefault();
    	$(this).closest(".social__item").toggleClass("social__item_open");
    });

    $(".social__ok").click(function(e){
    	e.preventDefault();
    	var parent = $(this).closest(".social__item");
    	var inp = parent.find(".social__input");
    	if (inp.val() != ""){
    		parent.toggleClass("social__item_open").addClass("social__item_active");
    	}
    });

    $(".social__delete").click(function(e){
    	e.preventDefault();
    	var parent = $(this).closest(".social__item");
    	var inp = parent.find(".social__input");
    	inp.val("");
    	parent.removeClass("social__item_active");
    });
});

;( function( window, document )
{
	'use strict';

	var file     = '../images/svg-symbols.svg',
		revision = 1;

	if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
		return true;

	var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
		request,
		data,
		insertIT = function()
		{
			document.body.insertAdjacentHTML( 'afterbegin', data );
		},
		insert = function()
		{
			if( document.body ) insertIT();
			else document.addEventListener( 'DOMContentLoaded', insertIT );
		};

	if( isLocalStorage && localStorage.getItem( 'inlineSVGrev' ) == revision )
	{
		data = localStorage.getItem( 'inlineSVGdata' );
		if( data )
		{
			insert();
			return true;
		}
	}

	try
	{
		request = new XMLHttpRequest();
		request.open( 'GET', file, true );
		request.onload = function()
		{
			if( request.status >= 200 && request.status < 400 )
			{
				data = request.responseText;
				insert();
				if( isLocalStorage )
				{
					localStorage.setItem( 'inlineSVGdata',  data );
					localStorage.setItem( 'inlineSVGrev',   revision );
				}
			}
		}
		request.send();
	}
	catch( e ){}

}( window, document ) );