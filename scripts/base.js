$(document).ready(function () {
        
$(".main").scroll(function () { 
    if($(document).width() <= 576) {
        $(".header").css({
            "opacity": Math.max(1 - $(".main").scrollTop() / ($(document).width() * .8), 0)
        });
    }
});


$(window).resize(function () { 
    if($(document).width() > 575) {
        $(".header").css({"opacity" : 1});
    }
});

});