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