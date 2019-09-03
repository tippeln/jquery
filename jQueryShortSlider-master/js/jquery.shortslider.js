/*
 * jQuery Short Slider v2.1
 * Copyright 2015 pccinc.jp
 * http://www.pccinc.jp/markup/jquery-short-slider/
 * Author: Chiba Takeshi
 * Licensed under the MIT license.
 */
 
(function($) {
	$.fn.shortslider = function(options){
		
	var defaults = {
		itemDisplay		: '.itemDisplay',
		style			: 'nomal', // nomal, carousel, fade
		movementSpeed	: 500,
		group			: 1,
		flick			: true,
		rand			: false,
		// thumbnails	: false,
		hoverStop		: true, // Applicable only when the 'auto' is true.
		speed			: 3000,
		auto			: true,
		indicator		: true,
		indicatorStyle	: true, // Applicable only when the 'indicator' is true.
		PrevNext		: true,
		PrevNextStyle	: true  // Applicable only when the 'PrevNext' is true.
	};
	
	// thisのクラスおよびIDを取得。冗長なのでなんか良い方法があれば･･･
	var thisClass;
	thisID		=  this.attr('id') != null ? '#'+this.attr('id') : '';
	thisClass	=  this.attr('class') != null ? '.'+this.attr('class').replace(/ /g,'.') : '';
	thisSelector = thisID+thisClass;
	// console.log('thisSelector == ' + thisSelector)
	
	if (this.length === 0) {
      return this;
    }
	
    if (this.length > 1) {
      this.each(function() {
        $(this).shortslider(options);
      });
      return this;
    }
	
	var settings = $.extend(defaults, options);
		
	var $wrap = this;
	$wrap.children('ul').addClass('shortSliderUL').wrap('<div class="itemDisplay"></div>')
	 	
	var sizer = $wrap.find(' li:first-child img:first').clone().prependTo($wrap.find(settings.itemDisplay)).css({zIndex:-10, visibility:'hidden', width:'100%', display:'block'}).addClass('sizer');
	if( sizer.length == 0){
		var dummyImage = '<img src="http://dummyimage.com/300x200/000/fff" style="z-index:-10;visibility:hidden;width:100%;display:block;" class="sizer">'
		$wrap.find(settings.itemDisplay).prepend($(dummyImage));
		//$('body').append('<style type="text/css">'+ thisSelector + ' ul.shortSliderUL:after { content:"."; clear:both; height:0; visibility:hidden; overflow:hidden; display:block;}</style>');
		//$wrap.find(settings.itemDisplay).find('ul').append('<div style="clear:both;"></div>')
	}
	
	var itemW = $wrap.find(settings.itemDisplay).width();
	
	if( settings.style == 'carousel' ) {
		var firstLeft = itemW;
	} else {
		var firstLeft = 0;
	}
	
	$(window).bind('resize load', function(){
		itemW = $wrap.find(settings.itemDisplay).width();
		// num=1;
		change();
		$wrap.find('ul li').css({ width:itemW})
		if( settings.PrevNext == true ) {
			//var itemH = $wrap.find(settings.itemDisplay).height();
			//var prevH = $wrap.find('.prev').height();
			//$('.prev, .next').css({ top:itemH/2 , marginTop:-prevH/2});
		}
		var itemH  =$wrap.find(settings.itemDisplay).height();
		if( sizer.length == 0){
			$wrap.find('ul.shortSliderUL li').css({ height:itemH})
		}
			
	})
	
	
	$wrap.find('ul li').css({ width:itemW})
	$wrap.find('ul').css({ width:99999, left:-firstLeft, position:'absolute', top:0}); //
	$wrap.find('ul li').css({ float:'left'})
	var length = $wrap.find('ul li').length;
	$(settings.itemDisplay).css({ overflow:'hidden', position:'relative'}); //
	
	if( settings.style == 'carousel' ) {
		var firstItem = $wrap.find('ul li:first-child').clone();
		var lastItem = $wrap.find('ul li:last-child').clone();
		$wrap.find('ul').append(firstItem);
		$wrap.find('ul').prepend(lastItem);
		$wrap.find('ul li:first-child').addClass('lastItem');
		$wrap.find('ul li:last-child').addClass('firstItem');
	}
	
	
	/* indicator */
	if( settings.indicator == true ) {
		if( length>1){
			var $indicator = $('<div class="indicator"></div>').appendTo($wrap);
			for(var i=0; i<length; i++){
				$indicator.append('<span>'+ parseInt(i+1) +'</span>');
			}
			if( settings.indicatorStyle == true ) {
				$('body').append('<style type="text/css">'+ thisSelector +' .indicator { text-align:center; text-align:center; width:100%; height: 0; position:relative; top:-30px;} '+ thisSelector +' .indicator span { display:inline-block; width:10px; height:10px; text-indent:-9999px; margin:5px; vertical-align:top; cursor:pointer; border-radius:50%; background-color:#999;} '+ thisSelector +' .indicator span.current { background-color:#333;}');
			}
		}
	}
	
	/* PrevNext */
	if( settings.PrevNext == true ) {
		if( length>1){
			$('<a class="prev" href="">prev</a><a class="next" href="">next</a>').appendTo($wrap.find(settings.itemDisplay));
			if( settings.PrevNextStyle == true ) {
				var itemH = $wrap.find(settings.itemDisplay).height();
				$('body').append('<style type="text/css">'+ thisSelector +' { position:relative;} '+ thisSelector +' .prev { position:absolute; display:block; width:30px; height:30px; top:50%; margin-top:-15px; left:10px; text-indent:-9999px; background:#333; border-radius:50%;} '+ thisSelector +' .next { position:absolute; display:block; width:30px; height:30px; top:50%; margin-top:-15px; right:10px; text-indent:-9999px; background:#333; border-radius:50%;} '+ thisSelector +' .prev:after { content:""; display:block; position:absolute; top:10px; left:4px; border:solid 5px; border-color:transparent; border-right:solid 9px #fff;} '+ thisSelector +' .next:after { content:""; display:block; position:absolute; top:10px; right:4px; border:solid 5px; border-color:transparent; border-left:solid 9px #fff;}</style>');
			}
		}
	}
	
	/* thumbnail未検証
	---------------------------------------------------------
	if( settings.thumbnails == true ) {
		var $thumbnails = $('<div class="itemThumb"><ul></ul></div>').appendTo(this);
		var img;
		for(var i=0; i<length; i++){
			src =			$wrap.find(' li:nth-child('+ parseInt(i+1) +')').find('img').attr('src');
			$('.itemThumb ul').append('<li><a href=""><img src="'+ src +'" alt=""></a></li>');
		}
	}*/

	var left;
	var num = 1;
	
	if( settings.style == 'fade' ) { // fade
		$wrap.find('ul li').css({position:'absolute', display:'none'})
		$wrap.find('.indicator span:first-child').addClass('current');
		$wrap.find('ul li:first-child').addClass('currentItem').fadeIn(500);
	} else { //default
		$wrap.find('.indicator span:first-child').addClass('current');
		if( settings.style == 'carousel' ) {
			$wrap.find('ul li:nth-child(2)').addClass('currentItem');
		} else {
			$wrap.find('ul li:first-child').addClass('currentItem');
		}
	}
	
	function change(){
		if( settings.style == 'fade' ) { // fade
			var i = num-1
			if(!$wrap.find('ul li').eq(i).hasClass('currentItem')){
				$wrap.find('ul li').removeClass('currentItem').fadeOut(500);
				$wrap.find('ul li').eq(i).addClass('currentItem').fadeIn(500, function(){
						if( settings.flick == true ) { // flick
							$wrap.find('ul li').not(':animated').css({ left: 0});
						}
					}
				);
			}
		} else {
			$wrap.find('ul li').removeClass('currentItem');
			
			if( settings.style == 'carousel' ) {
				$wrap.find('ul li').eq(num).addClass('currentItem');
				left = num*itemW;
				if( num!=1 || num!=length ) { 
					$wrap.find('ul').stop().animate({left:-left},settings.movementSpeed);
				}
			} else {
				$wrap.find('ul li').eq(num-1).addClass('currentItem');
				left = num*itemW-itemW;
				$wrap.find('ul').stop().animate({left:-left},settings.movementSpeed);
			}
		}
		$wrap.find('.indicator span').removeClass('current')
		$wrap.find('.indicator span').eq(num-1).addClass('current');
	};
	
	function loop(){
		if( settings.auto == true ) {
			if( settings.rand == true ) {
				var s = num
				rand(s)
				//console.log(num)
				change();
			} else if(length>num){
				num++;
				change();
			} else {
				num=1;
				if( settings.style == 'carousel' ) { 
					left = itemW*length+itemW;
					$wrap.find('ul').stop().animate({left:-left},settings.movementSpeed, function(){
						$wrap.find('ul').stop().css({ left:-itemW})
					});
					$wrap.find('.indicator span').removeClass('current')
					$wrap.find('.indicator span').eq(0).addClass('current');
				} else {
					change();
				}
			}
		}
				
	}
	function rand(s) {
		num = Math.round( Math.random()*length );
		//console.log('numを' + num + 'に変更');
		if(num == s){ rand(s); };
		if(num == 0){ rand(s); };
	}
	var timer = setInterval(loop, settings.speed);

	if( settings.hoverStop == true ){ // hoverStop
		$wrap.find('ul').hover( function(){
			clearInterval(timer);
		}, function(){
			timer = setInterval(loop, settings.speed);
		});
	};

	$wrap.find('.indicator span').click( function(){
		clearInterval(timer);

		var index = $wrap.find('.indicator span').index(this);
		num = index+1
		
		change();
		timer = setInterval(loop, settings.speed);
	});
	
	$wrap.find('a.prev').click( function(){
		PrevNextDisabled();
		clearInterval(timer);
		if(num==1){
			num=length;
			// num == length の場合
			if( settings.style == 'carousel' ) {
				left = 0;
				$wrap.find('ul').stop().animate({left:left},settings.movementSpeed, function(){
					$wrap.find('ul').stop().css({ left:-num*itemW})
					
					//change();
				});
				$wrap.find('.indicator span').removeClass('current')
				$wrap.find('.indicator span').eq(length-1).addClass('current');
			} else {
				change();
			}
		} else {
			num = num-1;
			change();
		}
		timer = setInterval(loop, settings.speed);
		return false;
	});
	
	$wrap.find('a.next').click( function(){
		PrevNextDisabled();
		clearInterval(timer);
		if(num==length){
			num=1;
			if( settings.style == 'carousel' ) {
				left = itemW*length+itemW;
				$wrap.find('ul').stop().animate({left:-left},settings.movementSpeed, function(){
					$wrap.find('ul').stop().css({ left:-itemW})
				});
				$wrap.find('.indicator span').removeClass('current')
				$wrap.find('.indicator span').eq(0).addClass('current');
			} else {
				change();
			}
		} else {
			num = num+1;
			change();
		}
		timer = setInterval(loop, settings.speed);
		return false;
	});
	function PrevNextDisabled(){
		var $PrevNextMask = $('<span class="prev" style=" top:50%; opacity:0;"></span><span class="next" style=" top:50%; opacity:0;"></span>').appendTo($wrap.find(settings.itemDisplay));
		setTimeout( function(){
			$PrevNextMask.remove();
		}, 400);
	}
	
	if( settings.flick == true ) {
		flick();
	};
	
	function flick(){ // flick
		var box = $wrap.find('ul')[0];
		var $target = $wrap.find('ul');
		box.addEventListener("touchstart", touchHandler, false);
		box.addEventListener("touchmove", touchHandler, false);
		box.addEventListener("touchend", touchHandler, false);
		
		var firstX, firstY, thisX, thisY, moveX, moveY;
		moveX == 1;
		function touchHandler(e){
			//e.preventDefault();
			var touch = e.touches[0];
			
			if(e.type == "touchstart"){
				clearInterval(timer)
				left = parseInt($target.css('left').replace( 'px', ''))
				firstX = touch.pageX;
				firstY = touch.pageY;
			}
			
			if(e.type == "touchmove"){
				thisX = touch.pageX;
				thisY = touch.pageY;
				moveX = thisX - firstX;
				moveY = thisY - firstY;
				
				moveRate = moveX / moveY;
				
				/* 角度 */
				if(moveRate > Math.tan(30 * Math.PI/180)) {
					e.preventDefault();
				}
				if( settings.style == 'fade' ) { // fade
					$target.find('li.currentItem').css({ left: (moveX+left)/5});
				}else {
					$target.css({ left: moveX+left});
				}
			}
			if(e.type == "touchend"){
				clearInterval(timer)
						
				if(moveX<-50){
					num = num+1
				} else if(moveX>50) {
					num = num-1
				} else {
					if( settings.style == 'fade' ) { // fade
						$target.find('li.currentItem').stop().animate({ left: 0},settings.movementSpeed);
					}
					$target.stop().animate({ left:left},settings.movementSpeed);
				}
				if(num>length){
					if( settings.style == 'fade' ) { // fade
						$wrap.find('.indicator span').removeClass('current')
						$wrap.find('.indicator span').eq(1).addClass('current');
						num = 1
						change()
					}else {
						if( settings.style == 'carousel' ) {
							$wrap.find('ul').stop().animate({left:-itemW*length-itemW},settings.movementSpeed, function(){
								//alert('')
								$wrap.find('ul').stop().css({ left:-itemW})
							});
							$wrap.find('.indicator span').removeClass('current')
							$wrap.find('.indicator span').eq(0).addClass('current');
							num = 1
						} else {
							$target.stop().animate({ left:left},settings.movementSpeed);
							num = length
						}
					}
				} else if(num<1){
					if( settings.style == 'fade' ) { // fade
						$wrap.find('.indicator span').removeClass('current')
						$wrap.find('.indicator span').eq(length-1).addClass('current');
						num = length;
						change()
					}else {
						if( settings.style == 'carousel' ) {
							$target.stop().animate({left:0},settings.movementSpeed, function(){
								$target.css({ left:-length*itemW})
							});
							$wrap.find('.indicator span').removeClass('current')
							$wrap.find('.indicator span').eq(length-1).addClass('current');
						} else {
							$target.stop().animate({ left:left},settings.movementSpeed);
						}
					}
					
					if( settings.style == 'carousel' ) {
						num = length
					} else {
						if( !settings.style == 'fade' ) { // fade
							num = 1
						}
					}
				} else {
					change()
				}
					
				moveX=0
				timer = setInterval(loop, settings.speed);
			}
		}
	}
	
	return(this);
	};
})(jQuery);