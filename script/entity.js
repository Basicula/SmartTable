class Entity{
    constructor(name, values_cnt){
        this.name = name;
        this.values = [];
        for (let i = 0; i < values_cnt; ++i)
            this.values.push(undefined);
        this.description = "";
        this.notes = [];
        this.is_active = false;
        this._setElement();      
    }

    _setElement(){
        var self = this; // to distinguish JQuery and inner class "this" object
        self.element = document.createElement("div");
        self.element.classList.add("entity");

        var entity_header = document.createElement("div");
        entity_header.classList.add("entity-header");
        var entity_header_text = document.createElement("div");
        entity_header_text.classList.add("div-text");
        entity_header_text.textContent = self.name;
        $(entity_header_text).keydown(function(e){
            if (e.which == 13)
                $(this).blur();
        });
        $(entity_header).click(function(e) {
            if (e.target !== this)
                return;
            $(this).toggleClass("selected");
            self.is_active = !self.is_active;
        });
        $(entity_header_text).click(function(e) {
            if (e.target !== this)
                return;
        });
        $(entity_header_text).dblclick(function(e) {
            if (e.target !== this)
                return;
            this.contentEditable = true;
            $(this).focus();
        });
        $(entity_header_text).blur(function() {
            this.contentEditable = false;
            self.name = this.textContent;
        });
        entity_header.appendChild(entity_header_text);
        
        var dropdown_btn = document.createElement("button");
        dropdown_btn.classList.add("dropbtn")
        var arrow = document.createElement("i");
        arrow.classList.add("fa");
        arrow.classList.add("fa-caret-down");
        dropdown_btn.appendChild(arrow);
        entity_header.appendChild(dropdown_btn);
        self.element.appendChild(entity_header);
        
        var description_content = document.createElement("div");
        description_content.style.display = "none";
        description_content.classList.add("description-container");
        self.element.appendChild(description_content);
        
        $(dropdown_btn).click(function() {
            description_content.textContent = self.description;
            var display = $(description_content).css("display");
            if (display == "none")
                $(description_content).css("display", "block");
            else
                $(description_content).css("display", "none");
        });
    }

    value(j){
        if (j < 0 || j >= this.values.length)
            return undefined;
        return this.values[j];
    }

    set_value(j, value) {
        if (j < 0 || j >= this.values.length)
            return;
        this.values[j] = value;
    }

  }