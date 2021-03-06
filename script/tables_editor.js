const GUIDE_URL_ROOT = "https://github.com/Basicula/SmartTable/blob/master/Instructions/"
const SEARCHING_GUIDE_URL = GUIDE_URL_ROOT + "Searching.md";
const SORTING_GUIDE_URL = GUIDE_URL_ROOT + "Sorting.md";
const SAVELOAD_GUIDE_URL = GUIDE_URL_ROOT + "Save_Load.md";
const INTERFACE_GUIDE_URL = GUIDE_URL_ROOT + "Interface.md";
const HOTKEYS_GUIDE_URL = GUIDE_URL_ROOT + "Hotkeys.md";

class TablesEditor {
    constructor() {
        this.tables = [];
        this.current_table = undefined;
        this._init_menu();
        this._init_tables();
        this._init_hotkeys();
    }

    _init_menu() {
        var self = this;
        this.menu = new Menu();

        var file = new MenuSection("File");
        var open_file = new MenuItem("Load CSV", function() { self.open_csv_file(); });
        var save_selected_table = new MenuItem("Save selected table", function() { self.save_active_table_to_file(); });
        var save_result = new MenuItem("Save result", function() { self.save_request_result_to_file(); });
        file.add_item(open_file);
        file.add_item(save_selected_table);
        file.add_item(save_result);
        this.menu.add_section(file);

        var edit = new MenuSection("Edit");
        var new_table = new MenuItem("New table", function() { self.new_table(); });
        var new_row = new MenuItem("New row", function() { self.new_row(); });
        var new_column = new MenuItem("New column", function() { self.new_column(); });
        edit.add_item(new_table);
        edit.add_item(new_row);
        edit.add_item(new_column);
        this.menu.add_section(edit);

        var help = new MenuSection("Help");
        var interface_help = new MenuItem("Interface", function() {open_link_in_new_tab(INTERFACE_GUIDE_URL);});
        var hotkeys = new MenuItem("Hotkeys", function() {open_link_in_new_tab(HOTKEYS_GUIDE_URL);});
        var searching = new MenuItem("Searching", function() {open_link_in_new_tab(SEARCHING_GUIDE_URL);});
        var sorting = new MenuItem("Sorting", function() {open_link_in_new_tab(SORTING_GUIDE_URL);});
        var saveload = new MenuItem("Save/Load", function() {open_link_in_new_tab(SAVELOAD_GUIDE_URL);});
        help.add_item(searching);
        help.add_item(saveload);
        help.add_item(sorting);
        help.add_item(hotkeys);
        help.add_item(interface_help);
        this.menu.add_section(help);
    }

    _init_hotkeys() {
        var self = this;
        window.onkeydown = function(e) {
            if (e.shiftKey && e.altKey && e.which == 80) {// shift + alt + P
                if (self.current_table)
                    self.current_table.properties.forEach(function(prop) {
                        prop.toggle(true);
                    });
            }
            else if (e.ctrlKey && e.altKey && e.which == 80) {// ctrl + alt + P
                if (self.current_table)
                    self.current_table.properties.forEach(function(prop) {
                        prop.toggle(false);
                    });
            }
            else if (e.shiftKey && e.which == 84) // shift + T
                self.new_table();
            else if (e.shiftKey && e.which == 80) // shift + P
                self.new_column();
            else if (e.shiftKey && e.which == 82) // shift + R
                self.new_row();
        }
    }

    _delete_table_button() {
        var x = document.createElement("div");
        x.classList.add("x-button");
        x.textContent = "X";
        return x;
    }

    _init_table_tab(table_id) {
        var self = this;
        var table_tab = document.createElement("div");
        table_tab.classList.add("table-tab");
        table_tab.textContent = this.tables[table_id].name;

        var x_button = this._delete_table_button();
        $(x_button).click(function() {
            self.tables[table_id].is_active = false;
            self.table_tabs_container.children[table_id].style.display = "none";
        });
        table_tab.appendChild(x_button);
        
        if (this.tables[table_id].is_active)
           table_tab.classList.add("table-tab-selected");
        $(table_tab).click(function(e) {
            if (e.target !== this)
                return;
            for (let tab_id = 0; tab_id < self.tables.length; ++tab_id) {
                self.tables[tab_id].is_active = false;
                self.table_tabs_container.children[tab_id].classList.remove("table-tab-selected");
            }
            self.current_table = self.tables[table_id];
            self.current_table.is_active = true;
            self.table_tabs_container.children[table_id].classList.add("table-tab-selected");
        });
        $(table_tab).dblclick(function(e) {
            if (e.target !== this)
                return;
            this.contentEditable = true;
            $(this).focus();
        });
        $(table_tab).blur(function(e) {
            this.contentEditable = false;
            self.tables[table_id].name = this.textContent;
        });
        this.table_tabs_container.insertBefore(table_tab, this.add_tab);
    }

    _init_add_new_table_tab() {
        var self = this;
        this.add_tab = document.createElement("div");
        this.add_tab.classList.add("table-add-tab");
        var i = document.createElement("i");
        i.classList.add("fa");
        i.classList.add("fa-plus");
        this.add_tab.appendChild(i);
        this.add_tab.onclick = function() { self.new_table();};
        this.table_tabs_container.appendChild(this.add_tab);
    }

    _init_tables() {
        this.tables_container = document.createElement("div");
        this.tables_container.classList.add("table-container");
        this.table_tabs_container = document.createElement("div");
        this.table_tabs_container.classList.add("table-tabs");
        this._init_add_new_table_tab();
        $(".tables").append(this.table_tabs_container);
        $(".tables").append(this.tables_container);
    }

    _push_new_table(new_table) {
        this.tables.push(new_table);
        this._init_table_tab(this.tables.length - 1);
        this.tables_container.appendChild(new_table.view_element);
    }

    new_row() {
        if (!this.current_table)
            return;
        var entity = new Entity("", this.current_table.properties.length);
        this.current_table.add_entity(entity);
    }

    new_column() {
        if (!this.current_table)
            return;
        var property = new Property("New propery");
        this.current_table.add_property(property);
    }

    new_table() {
        var new_table = new QBETable("New table");
        this._push_new_table(new_table);
    }

    add_table(table) {
        this._push_new_table(table);
    }

    update() {
        for (let table_id = 0; table_id < this.tables.length; ++table_id)
            this.tables[table_id].update();
    }

    save_active_table_to_file() {
        var file_content = "";
        for (let row = -1; row < this.current_table.entities.length; ++row) {
            for (let column = 0; column < this.current_table.properties.length; ++column) {
                // write column headers
                if (row === -1) 
                    file_content += this.current_table.properties[column].name;
                else {
                    const value = this.current_table.entities[row].value(column);
                    if (value !== undefined)
                        file_content += this.current_table.entities[row].value(column);
                }
                
                if (column !== this.current_table.properties.length - 1)
                    file_content += ",";
            }
            file_content += "\n";
        }
        save_to_file(file_content, this.current_table.name + ".csv", "text/csv");
    }

    save_request_result_to_file() {
        var file_content = "";
        const conditions = this.current_table.get_conditions();
        const result = this.current_table.get_result_from_conditions(conditions);
        for (let row = -1; row < result.length; ++row) {
            var separator = false;
            for (let column = 0; column < conditions.length; ++column) {
                if (!this.current_table.properties[column].is_active)
                    continue;

                if (separator)
                    file_content += ",";
                separator = true;

                // write column headers
                if (row === -1) 
                    file_content += this.current_table.properties[column].name;
                else {
                    const value = result[row].value(column);
                    if (value !== undefined)
                        file_content += value;
                }
            }
            file_content += "\n";
        }
        save_to_file(file_content, this.current_table.name + ".csv", "text/csv");
    }

    get_table_from_csv_content(content) {
        var table = new QBETable("");
        content = content.split("\n");
        for (let row_id = 0; row_id < content.length; ++row_id) {
            const row = content[row_id].split(",");
            var entity = new Entity("", row.length);
            for (let column = 0; column < row.length; ++column) {
                if (row_id === 0) {
                    var property = new Property(row[column]);
                    table.add_property(property);
                }
                else {
                    if (row[column] !== "")
                        entity.set_value(column, row[column]);
                }
            }
            if (row_id !== 0)
                table.add_entity(entity);
        }
        return table;
    }

    open_csv_file() {
        var self = this;
        var read_file = function(e) { 
            var file = e.target.files[0];
            if (!file) {
              return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var table = self.get_table_from_csv_content(e.target.result);
                table.name = file.name.replace(/\.[^/.]+$/, "");
                self.add_table(table);
            }
            reader.readAsText(file);
        };
        var open_button = document.createElement("input");
        open_button.type = "file";
        open_button.accept = "*.csv";
        open_button.onchange = read_file;
        open_button.click();
    }
}