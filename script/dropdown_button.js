function create_dropdown_button(on_open_callback, on_hide_callback) {
    var dropdown_btn = document.createElement("button");
    dropdown_btn.classList.add("dropbtn");
    dropdown_btn.status = "hidden";
    var arrow = document.createElement("i");
    arrow.classList.add("fa");
    arrow.classList.add("fa-caret-down");
    dropdown_btn.appendChild(arrow);
    $(dropdown_btn).click(function() {
        if (this.status === "hidden") {
            this.status = "opened";
            arrow.classList.add("fa-caret-up");
            arrow.classList.remove("fa-caret-down");
            on_open_callback();
        }
        else {
            this.status = "hidden";
            arrow.classList.add("fa-caret-down");
            arrow.classList.remove("fa-caret-up");
            on_hide_callback();
        }
    });
    return dropdown_btn;
}