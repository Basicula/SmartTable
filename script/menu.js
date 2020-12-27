$(document).ready(function(){
    $(".dropbtn").click(function() {
        var children = $(this).parent().children(".dropdown-content");
        var display = $(children).css("display");
        if (display == "none")
            $(children).css("display", "block");
        else
            $(children).css("display", "none");
    });
    $(".dropbtn").blur(function() {
        var children = $(this).parent().children(".dropdown-content");
        var display = $(children).css("display");
        if (display !== "none")
            $(children).css("display", "none");
    });
});