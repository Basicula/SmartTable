class MenuItem {
    constructor(label, callback) {
        this.label = label;
        this.callback = callback;

        this._init_view_element();
    }

    _init_view_element() {
        this.view_element = document.createElement("button");
        this.view_element.classList.add("navbar-dropdown-content-button");
        this.view_element.textContent = this.label;
        this.view_element.onclick = this.callback;
    }
}

class MenuSection {
    constructor(name, menu_items) {
        this.name = name;
        this.menu_items = menu_items;
        if (!this.menu_items)
            this.menu_items = [];

        this._init_view_element();
    }

    add_item(menu_item) {
        this.menu_items.push(menu_item);
        this.content_view_element.appendChild(menu_item.view_element);
    }

    _init_view_element() {
        var self = this;
        self.view_element = document.createElement("div");
        self.view_element.classList.add("navbar-dropdown");
    
        var dropdown_button = document.createElement("div");
        dropdown_button.textContent = self.name;
        dropdown_button.classList.add("navbar-dropdown-button");

        //var dropdown_arrow = document.createElement("i");
        //dropdown_arrow.classList.add("fa");
        //dropdown_arrow.classList.add("fa-caret-down");
        //dropdown_button.appendChild(dropdown_arrow);

        self.view_element.appendChild(dropdown_button);

        self.content_view_element = document.createElement("div");
        self.content_view_element.classList.add("navbar-dropdown-content");
        self.content_view_element.style.display = "none";
    
        for (let item_id = 0; item_id < self.menu_items; ++item_id)
            self.content_view_element.appendChild(self.menu_items[item_id].view_element);
        self.view_element.appendChild(self.content_view_element);

        $(self.view_element).hover(function() {
            const display = self.content_view_element.style.display;
            if (display == "none")
                self.content_view_element.style.display = "flex";
            else
                self.content_view_element.style.display = "none";
        });
    }
}

class Menu {
    constructor() {
        // must be only one always
        this.view_element = document.getElementsByClassName("navbar")[0];
        this.sections = [];
    }

    add_section(section) {
        this.sections.push(section);
        this.view_element.appendChild(section.view_element);
    }
}
