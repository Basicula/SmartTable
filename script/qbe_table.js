const SEARCHING_MODE_EXACTLY = "EXACTLY";
const SEARCHING_MODE_LIKE = "LIKE";
const SEARCHING_MODE_REGEXP = "REGEXP";

const SORT_NONE = "NONE";
const SORT_ASCENDING = "ASCENDING";
const SORT_DESCENDING = "DESCENDING";

class QBETable{
    constructor(name, entities, properties) {
        this.name = name;
        this.entities = entities; // rows
        this.properties = properties; // columns

        this.searching_modes = [SEARCHING_MODE_EXACTLY, SEARCHING_MODE_LIKE, SEARCHING_MODE_REGEXP];
        this.sort_modes = [SORT_NONE, SORT_ASCENDING, SORT_DESCENDING];

        if (!entities)
            this.entities = [];
        if (!properties)
            this.properties = [];

        // used to determine whether we need to update table or not
        this.prev_conditions = [];

        // get mapping also for sorting and grouping without changing initial data
        this.sorted_entities_with_indices = 
            this.entities.map(function(entity, i) {
            return { index: i, entity: entity };
            });

        this._set_element();
    }

    add_entity(entity) {
        const index = this.entities.length;
        this.entities.push(entity);
        this._set_row(index);
        this.sorted_entities_with_indices.push({index: index, entity: entity});
    }

    // adds new property at some position if position isn't set then assuming pushing to the end
    add_property(property, position) {
        if (position === undefined || position >= this.properties.length) {
            position = this.properties.length;
            this.properties.push(property);
            this.properties_container.appendChild(property.view_element);
        }
        else {
            this.properties.splice(position, 0, property);
            this.properties_container.insertBefore(property.view_element, this.properties_container.children[position]);
        }
        // update callbacks due to possible shifting
        for (let property_id = 0; property_id < this.properties.length; ++property_id)
            this._setup_property_callbacks(property_id);

        // update table view
        for (let row_id = -1; row_id < this.entities.length; ++row_id) {
            var row = this.view_element.children[row_id + 1];
            row.insertBefore(this._init_cell_content(row_id, position), row.children[position]);
            // update values inside entity
            if (row_id >= 0)
                this.entities[row_id].values.splice(position, 0, undefined);
        }
    }

    delete_property(property_id) {
        this.properties_container.removeChild(this.properties[property_id].view_element);
        this.properties.splice(property_id, 1);
        // update table view
        for (let row_id = 0; row_id < this.view_element.children.length; ++row_id) {
            var row = this.view_element.children[row_id];
            row.removeChild(row.children[property_id]);
            // update values inside entity
            if (row_id > 0)
                this.entities[row_id - 1].values.splice(property_id, 1);
        }
        // update callbacks due to possible shifting
        for (let property_id = 0; property_id < this.properties.length; ++property_id)
            this._setup_property_callbacks(property_id);
    }

    // callbacks for property inside property container
    _setup_property_callbacks(property_id) {
        var self = this;
        // context menu logic
        self.properties[property_id].view_element.oncontextmenu = function() {return false;};
        self.properties[property_id].view_element.onmousedown = function(e) {
            if (e.button !== 2)
                return;
            
            var delete_func = function() {
                self.delete_property(property_id);
            };
            var insert_before = function() {
                var property = new Property("New property");
                self.add_property(property, property_id);
            };
            var insert_after = function() {
                var property = new Property("New property");
                self.add_property(property, property_id + 1);
            };
            open_context_menu(["Delete", "Insert before", "Insert after"], [delete_func, insert_before, insert_after], e);
        }
    }

    _init_column_header_container(container_label, values) {
        // create container
        var container = document.createElement("div");
        container.classList.add("column-header-select-container");

        // create and init container label
        var values_label = document.createElement("label");
        values_label.classList.add("column-header-select-label");
        values_label.textContent = container_label;
        container.appendChild(values_label);

        // create and init combobox (select) for container values as select options
        var values_select = document.createElement("select");
        values_select.classList.add("column-header-select");
        for (let value_id = 0; value_id < values.length; ++value_id) {
            var option = document.createElement("option");
            option.classList.add("column-header-select-option");
            option.value = values[value_id];
            option.textContent = values[value_id];
            values_select.appendChild(option);
        }
        container.appendChild(values_select);

        return container;
    }

    _init_column_header_with_conditions(column_id) {
        // create column header
        var column_header_with_conditions = document.createElement("th");
        column_header_with_conditions.classList.add("column-header-with-condition");
        $(column_header_with_conditions).css("display", this.properties[column_id].is_active ? "table-cell":"none");

        // create edit field for entering user values
        var column_header_conditions_container = document.createElement("div");
        column_header_conditions_container.classList.add("column-header-conditions-container");
        column_header_conditions_container.style.display = "none";

        var column_condition = document.createElement("input");
        column_condition.classList.add("column-header-condition");
        column_header_conditions_container.appendChild(column_condition);
        
        // create key words container for different searching modes etc
        var key_words_container = this._init_column_header_container("Searching:", this.searching_modes)
        column_header_conditions_container.appendChild(key_words_container);

        // create sort modes container
        var sort_modes_container = this._init_column_header_container("Sorting:", this.sort_modes);
        column_header_conditions_container.appendChild(sort_modes_container);

        // create and init column header text
        var column_header = document.createElement("div");
        column_header.classList.add("column-header");

        var column_name = document.createElement("div");
        column_name.classList.add("column-header-text");
        column_name.textContent = this.properties[column_id].name;
        column_header.appendChild(column_name);
        
        var dropdown_btn = create_dropdown_button(
            function() {
                column_header_conditions_container.style.display = "";
            }, 
            function() {
                column_header_conditions_container.style.display = "none";
            });
        column_header.appendChild(dropdown_btn);

        column_header_with_conditions.appendChild(column_header);
        column_header_with_conditions.appendChild(column_header_conditions_container);

        return column_header_with_conditions;
    }

    _init_cell_content(i, j) {
        // i = -1 coords of column header
        if (i === -1)
            return this._init_column_header_with_conditions(j);

        // create cell element
        var cell_element = document.createElement("td");
        cell_element.classList.add("cell_data");
        $(cell_element).dblclick(function(e) {
            if (e.target !== this)
                return;
            this.contentEditable = true;
            $(this).focus();
        });
        var self = this;
        $(cell_element).blur(function(e) {
            this.contentEditable = false;
            self.entities[i].set_value(j, this.textContent);
            // tell that need to update table
            self.prev_conditions = [];
        });
        $(cell_element).keydown(function(e){
            if (e.which == 13)
                $(this).blur();
        });
        // get value for cell
        var val = this.entities[i].value(j);
        if (val !== undefined) {
            // fill value for cell
            cell_element.textContent = val;
            // check value correctness
            if (!this.properties[j].type.check(val))
                cell_element.classList.add("error-content");
        }
        else
            cell_element.classList.add("no-data");

        // set initial value for displaying data
        $(cell_element).css("display", this.properties[j].is_active ? "table-cell":"none");

        return cell_element;
    }

    _init_properties_container() {
        this.properties_container = document.getElementsByClassName("properties-container")[0]; // have to be only one
        for (let property_id = 0; property_id < this.properties.length; ++property_id) {
            this.properties_container.appendChild(this.properties[property_id].view_element);
            this._setup_property_callbacks(property_id);
        }
    }

    _update_property_views() {
        for (let property_id = 0; property_id < this.properties.length; ++property_id)
            this.properties[property_id].view_element.style.display = this.is_active ? "" : "none";
    }

    _set_row(row_id) {
        // create table row
        var tr_element = document.createElement("tr");
        $(tr_element).css("display", "table-row");

        // fill up cell contents
        for (let j = 0; j < this.properties.length; ++j) {
            var cell_element = this._init_cell_content(row_id, j);
            tr_element.appendChild(cell_element);
        }

        this.view_element.appendChild(tr_element);
    }

    _set_element() {
        this._init_properties_container();
        this._update_property_views();
        // create table view itself
        this.view_element = document.createElement("table");
        this.view_element.classList.add("result-table");

        // fill up table rows starting with -1 for filling row with column headers
        for (let row_id = -1; row_id < this.entities.length; ++row_id)
            this._set_row(row_id);
            
    }

    get_conditions() {
        var conditions = [];
        // first of all get user input from column headers
        var column_headers_row = this.view_element.firstChild;
        for (let j = 0; j < column_headers_row.children.length; ++j) {
            // get column header
            const column_header = column_headers_row.children[j];
            // skip and hide those columns that aren't active
            if (!this.properties[j].is_active) {
                conditions.push(null);
                continue;
            }
            // update property name in case if user has changed it
            const  header_conditions_container = column_header.children[1];
            const condition_input_field = header_conditions_container.children[0];
            const key_word_select_container = header_conditions_container.children[1];
            const key_word_select = key_word_select_container.children[1]; // 0 child is label
            const sort_mode_select_container = header_conditions_container.children[2];
            const sort_mode_select = sort_mode_select_container.children[1]; // 0 child is label
            // form condition from user
            conditions.push({   condition: condition_input_field.value, 
                                key_word: key_word_select.value,
                                sort_mode: sort_mode_select.value});
        }
        return conditions;
    }

    update() {
        this._update_property_views();
        // there is nothing to do anymore
        if (!this.is_active){
            this.view_element.style.display = "none";
            return;
        }

        this.view_element.style.display = "";
        var conditions = this.get_conditions();
        
        // check that nothing changed otherwise update all
        if (this.prev_conditions.length === conditions.length) {
            var is_changed = false;
            for (let condition_id = 0; condition_id < conditions.length; ++condition_id)
                if (JSON.stringify(this.prev_conditions[condition_id]) !== JSON.stringify(conditions[condition_id])) {
                    is_changed = true;
                    break;
                }
            if (!is_changed)
                return;
        }
        this.prev_conditions = conditions;

        // sort based on conditions from user
        this.sort(conditions);

        // start from 1 because 0 child is column header row
        for (let row_id = 0; row_id < this.view_element.children.length; ++row_id) {
            var table_row = this.view_element.children[row_id];
            
            // get current entity including sorted order
            const curr_entity = row_id === 0 ? undefined : this.sorted_entities_with_indices[row_id - 1].entity;
            const curr_entity_index = row_id === 0 ? -1 : this.sorted_entities_with_indices[row_id - 1].index;

            for (let j = 0; j < table_row.children.length; ++j) {
                if (!this.properties[j].is_active) {                    
                    table_row.children[j].style.display = "none";
                    continue;
                }
                table_row.children[j].style.display = "";
                if (row_id > 0)
                    table_row.children[j].replaceWith(this._init_cell_content(curr_entity_index, j));
            }

            // process table data including conditions
            const any_condition_to_check = !conditions.every((value, index, array) => value === null);
            if (row_id === 0 || any_condition_to_check && this.all_conditions_satisfied(conditions, curr_entity))
                table_row.style.display = "";
            else
                table_row.style.display = "none";
        }
    }

    all_conditions_satisfied(conditions, entity) {
        var ok = true;
        for (let j = 0; j < this.properties.length; ++j) {
            if (!ok)
                break;
            if (conditions[j] === null)
                continue;
            const condition = conditions[j].condition;
            if (condition === "")
                continue;
            const key_word = conditions[j].key_word;
            const property = this.properties[j];
            const property_type = property.type;
            const value = entity.value(j);
            if (value === undefined)
                ok = false;
            else if (key_word === SEARCHING_MODE_EXACTLY)
                ok &= property_type.is_exact_the_same(condition, value);
            else if (key_word === SEARCHING_MODE_LIKE)
                ok &= property_type.is_almost_the_same(condition, value);
            else if (key_word === SEARCHING_MODE_REGEXP) {
                var re = new RegExp(condition);
                ok &= re.test(value);
            }
        }
        return ok;
    }

    sort(conditions) {        
        var is_sorting_needed = false;
        for (let i = 0; i < conditions.length; ++i) {
            if (conditions[i] === null)
                continue;
            if (conditions[i].sort_mode !== SORT_NONE) {
                is_sorting_needed = true;
                break;
            }
        }

        // sort back by indices if we've had sorted it before
        if (!is_sorting_needed) {
            this.sorted_entities_with_indices.sort(function(a, b) {
                if (a.index < b.index)
                    return -1;
                if (a.index > b.index)
                    return 1;
                return 0;
            });
            return;
        }
        
        // use self inside lambda
        const self = this;
        this.sorted_entities_with_indices.sort(function(a, b) {
            for (let j = 0; j < self.properties.length; ++j) {
                if (conditions[j] === null || conditions[j].sort_mode === SORT_NONE)
                    continue;
                const a_val = a.entity.value(j);
                const b_val = b.entity.value(j);
                const is_ascending = conditions[j].sort_mode === SORT_ASCENDING;
                if (a_val < b_val)
                    return is_ascending ? -1 : 1;
                else if (a_val > b_val)
                    return is_ascending ? 1 : -1;
            }
            return 0;
        });
    }

    sort_entities(entities, conditions) {
        entities.sort(function(a, b) {
            for (let j = 0; j < conditions.length; ++j) {
                if (conditions[j] === null || conditions[j].sort_mode === SORT_NONE)
                    continue;
                const a_val = a.value(j);
                const b_val = b.value(j);
                const is_ascending = conditions[j].sort_mode === SORT_ASCENDING;
                if (a_val < b_val)
                    return is_ascending ? -1 : 1;
                else if (a_val > b_val)
                    return is_ascending ? 1 : -1;
            }
            return 0;
        });
        return entities;
    }

    get_result_from_conditions(conditions) {
        var result = [];
        for (let entity_id = 0; entity_id < this.entities.length; ++entity_id) {
            if (this.all_conditions_satisfied(conditions, this.entities[entity_id])) {
                result.push(this.entities[entity_id]);
            }
        }
        result = this.sort_entities(result, conditions);
        return result;
    }
}