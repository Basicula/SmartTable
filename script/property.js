const TYPES = [ new StringType(), 
                new BooleanType(), 
                new NumberType()];

class Property {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        if (!this.type)
            this.type = new StringType();
        this.description = "";
        this.notes = [];
        this.is_active = false;
        this._set_element();
    }

    set_description(description) {
        this.description = description;
        this._description.textContent = this.description;
    }

    _set_element() {
        this._init_main_container();
        this._init_header();
        this._init_details_container();
    }

    _init_main_container() {
        this.view_element = document.createElement("div");
        this.view_element.classList.add("property");
    }

    _init_header() {
        this._header = document.createElement("div");
        this._header.classList.add("property-header");

        this._header_text = document.createElement("div");
        this._header_text.classList.add("property-header-text");
        this._header_text.textContent = this.name;

        var self = this;
        var dropdown_btn = create_dropdown_button(
            function () {
                self._details_container.style.display = "";
            },
            function () {
                self._details_container.style.display = "none";
            });

        this._header.appendChild(this._header_text);
        this._header.appendChild(dropdown_btn);
        this.view_element.appendChild(this._header);

        this._init_header_events_processes();
    }

    _init_header_events_processes() {
        var self = this;
        // selection logic
        this._header.onclick = function (e) {
            if (e.target !== this && e.target !== self._header_text)
                return;
            self._header.classList.toggle("selected");
            self.is_active = !self.is_active;
        };

        // header editing logic
        this._header.ondblclick = function(e) {
            self._header_text.contentEditable = true;
            self._header_text.focus();
        }
        this._header_text.onkeydown = function (e) {
            if (e.which == 13)
                self._header_text.blur();
        };
        this._header_text.onblur = function () {
            self._header_text.contentEditable = false;
            self.name = self._header_text.textContent;
        };

    }

    _init_details_container() {
        this._details_container = document.createElement("div");
        this._details_container.style.display = "none";
        this._details_container.classList.add("property-details-container");

        this._init_description_container();
        this._init_type_container();
        this._init_notes_container();

        this.view_element.appendChild(this._details_container);
    }

    _init_description_container() {
        this._description_container = document.createElement("div");
        this._description_container.classList.add("property-description-container");

        this._description_label = document.createElement("label");
        this._description_label.classList.add("property-details-container-label");
        this._description_label.textContent = "Description:";
        this._description_container.appendChild(this._description_label);

        this._description = document.createElement("textarea");
        this._description.classList.add("property-description");
        var self = this;
        this._description.onchange = function() {
            self.description = this.value;
        };
        this._description_container.appendChild(this._description);

        this._details_container.appendChild(this._description_container);
    }

    _init_type_container() {
        this._type_container = document.createElement("div");
        this._type_container.classList.add("property-type-container");

        this._type_label = document.createElement("label");
        this._type_label.classList.add("property-details-container-label");
        this._type_label.textContent = "Type:";
        this._type_container.appendChild(this._type_label);

        this._type = document.createElement("select");
        this._type.classList.add("property-type");
        for (let type_id = 0; type_id < TYPES.length; ++type_id) {
            var type_option = document.createElement("option");
            type_option.value = TYPES[type_id].name;
            type_option.textContent = TYPES[type_id].name;
            this._type.appendChild(type_option);
            if (this.type.name === TYPES[type_id].name)
                this._type.value = TYPES[type_id].name;
        }
        var self = this;
        this._type.onchange = function() {
            self.type = TYPES[this.selectedIndex];
        };
        this._type_container.appendChild(this._type);

        this._details_container.appendChild(this._type_container);
    }

    _init_notes_container() {
        this._notes_container = document.createElement("div");
        this._notes_container.classList.add("property-notes-container");

        this._notes_label = document.createElement("label");
        this._notes_label.classList.add("property-details-container-label");
        this._notes_label.textContent = "Notes:";
        this._notes_container.appendChild(this._notes_label);

        this._notes = document.createElement("div");
        this._notes.classList.add("property-notes");
        this._notes_container.appendChild(this._notes);

        this._details_container.appendChild(this._notes_container);
    }
}

