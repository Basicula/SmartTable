var inited = false;
var _hint;

function _init_hint() {
    if (inited)
        return;
    _hint = document.createElement("div");
    _hint.classList.add("hint");
    _hint.style.display = "none";

    inited = true;
    
    $(".main").append(_hint);
}

function hide_hint() {
    if (inited)
        _hint.style.display = "none";
}

function show_hint(message, e) {
    _init_hint();
    _hint.textContent = message;
    _hint.style.left = e.pageX;
    _hint.style.top = e.pageY;
    _hint.style.display = "";
}