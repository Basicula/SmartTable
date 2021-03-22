var opened = false;
var context_menu;

function hide() {
    opened = false;
    context_menu.style.display = "none";
}

function open() {
    opened = true;
    context_menu.style.display = "";
}

function init_context_menu() {
    if (opened)
        return;

    context_menu = document.createElement("div");
    context_menu.classList.add("context-menu");

    context_menu.oncontextmenu = function() {return false;};
    context_menu.textContent = "popup";

    context_menu.onblur = function() {
        hide();
    }

    $(".main").append(context_menu);
    window.onclick = function() {
        if (opened)
            hide();
    };
}

function create_option(name, callback) {
    var option = document.createElement("button");
    option.classList.add("context-menu-option");
    option.textContent = name;
    option.onclick = function() {
        callback();
    }
    return option;
}

function open_context_menu(button_labels, callbacks, e) {
    init_context_menu();
    context_menu.style.left = e.pageX;
    context_menu.style.top = e.pageY;
    while(context_menu.firstChild)
        context_menu.removeChild(context_menu.firstChild);
    for (let option_id = 0; option_id < button_labels.length; ++option_id)
        context_menu.appendChild(create_option(button_labels[option_id], callbacks[option_id]));
    open();
}