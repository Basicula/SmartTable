$(document).ready(function(){
    $(".dropbtn").click(function(){
        var children = $(this).parent().children(".dropdown-content");
        var display = $(children).css("display");
        if (display == "none")
            $(children).css("display", "block")
        else
            $(children).css("display", "none")
    });
});

$(document).click(function(e) {
    if (!e.target.matches('.dropbtn'))
        $(".dropdown-content").css("display", "none");
});