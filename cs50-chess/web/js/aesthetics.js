$(function(){

	// makes purdy menu hovering effects look all niicee
	$('#menu li').hover(function(){
    	$(this).stop().animate({backgroundColor: '#18334F'}, 300);
		}, function() {
   		 $(this).stop().animate({backgroundColor: '#234D76'}, 200);
	});

	// dynamically renders footer's height
	$('#footer').height( ($(document).height() - $('#header').height() - $('#menu').height() - $('#container').height()) + "px" );

	// makes purdy alternating-have-different-backgrounds effect
	$("table tr:odd").addClass("alt");

});