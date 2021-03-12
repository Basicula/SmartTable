var KEY_WORD_EXACTLY = "EXACTLY";
var KEY_WORD_LIKE = "LIKE";

var SORT_NONE = "NONE";
var SORT_ASCENDING = "ASCENDING";
var SORT_DESCENDING = "DESCENDING";

class QBETable{
    constructor(name, entities, properties) {
        this.name = name;
        if (!entities)
            this.entities = [];
        else {
            this.entities = entities;
            // get mapping also for sorting and grouping without changing initial data
            this.sorted_entities_with_indices = 
                this.entities.map(function(entity, i) {
                return { index: i, entity: entity };
                });
            }
        if (!properties)
            this.properties = [];
        else
            this.properties = properties;

        this.key_words = [KEY_WORD_EXACTLY, KEY_WORD_LIKE];
        this.sort_modes = [SORT_NONE, SORT_ASCENDING, SORT_DESCENDING];

        this._setElement();
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    addProperty(property) {
        this.properties.push(property);
    }

    _setElement() {
        var self = this;
        self.element = document.createElement("table");
        self.element.classList.add("result-table");
        for (let i = -1; i < self.entities.length; ++i) {
            var tr_element = document.createElement("tr");
            if (i !== -1)
                $(tr_element).css("display", "table-row");
            for (let j = 0; j < self.properties.length; ++j) {
                var cell_element;
                if (i === -1) {
                    cell_element = document.createElement("th");
                    cell_element.classList.add("column-header-with-condition");

                    var column_name = document.createElement("p");
                    column_name.classList.add("column-header-text");
                    column_name.textContent = self.properties[j].name;
                    cell_element.appendChild(column_name);

                    var column_condition = document.createElement("input");
                    column_condition.classList.add("column-header-condition");
                    cell_element.appendChild(column_condition);
                    
                    var key_words_container = document.createElement("div");
                    key_words_container.classList.add("column-header-select-container");
                    var key_words_label = document.createElement("label");
                    key_words_label.classList.add("column-header-select-label");
                    key_words_label.textContent = "Key words:";
                    key_words_container.appendChild(key_words_label);
                    var key_words = document.createElement("select");
                    key_words.classList.add("column-header-select");
                    for (let key_word_id = 0; key_word_id < self.key_words.length; ++key_word_id) {
                        var option = document.createElement("option");
                        option.classList.add("column-header-select-option");
                        option.value = this.key_words[key_word_id];
                        option.textContent = this.key_words[key_word_id];
                        key_words.appendChild(option);
                    }
                    key_words_container.appendChild(key_words);
                    cell_element.appendChild(key_words_container);

                    var sort_modes_container = document.createElement("div");
                    sort_modes_container.classList.add("column-header-select-container");
                    var sort_modes_label = document.createElement("label");
                    sort_modes_label.classList.add("column-header-select-label");
                    sort_modes_label.textContent = "Sorting:";
                    sort_modes_container.appendChild(sort_modes_label);
                    var sort_modes = document.createElement("select");
                    sort_modes.classList.add("column-header-select");
                    for (let sort_mode_id = 0; sort_mode_id < self.sort_modes.length; ++sort_mode_id) {
                        var option = document.createElement("option");
                        option.classList.add("column-header-select-option");
                        option.value = this.sort_modes[sort_mode_id];
                        option.textContent = this.sort_modes[sort_mode_id];
                        sort_modes.appendChild(option);
                    }
                    sort_modes_container.appendChild(sort_modes);
                    cell_element.appendChild(sort_modes_container);
                }
                else {
                    cell_element = document.createElement("td");
                    var val = self.entities[i].value(self.properties[j]);
                    if (val !== undefined) {
                        cell_element.textContent = val;
                        if (!self.properties[j].type.check(val))
                            cell_element.classList.add("error-content");
                    }
                    else
                       cell_element.classList.add("no-data");
                }
                $(cell_element).css("display", self.properties[j].isactive ? "table-cell":"none");
                tr_element.appendChild(cell_element);
            }
            self.element.appendChild(tr_element);
        }
    }

    update() {
        var self = this;
        var conditions = [];

        var column_headers_row = self.element.firstChild;
        for (let j = 0; j < column_headers_row.children.length; ++j) {
            // hide table cell if property isn't active
            if (!self.properties[j].isactive) {
                $(column_headers_row.children[j]).css("display", "none");
                conditions.push(null);
                continue;
            }
            var cell_element = column_headers_row.children[j];
            $(cell_element).css("display", "table-cell");
            cell_element.firstChild.textContent = self.properties[j].name; // if property name changed
            const condition_input_field = cell_element.children[1];
            const key_word_select_container = cell_element.children[2];
            const key_word_select = key_word_select_container.children[1]; // 0 child is label
            const sort_mode_select_container = cell_element.children[3];
            const sort_mode_select = sort_mode_select_container.children[1]; // 0 child is label
            conditions.push({   condition: condition_input_field.value, 
                                key_word: key_word_select.value,
                                sort_mode: sort_mode_select.value});
        }
        $(column_headers_row).css("display", "table-row");
        this.sort(conditions);

        // start from 1 because 0 child is column header row
        for (let row_id = 1; row_id < self.element.children.length; ++row_id) {
            var table_row = self.element.children[row_id];
            const curr_entity = self.sorted_entities_with_indices[row_id - 1].entity;
            var any_data = false;
            for (let j = 0; j < table_row.children.length; ++j) {
                // hide table cell if property isn't active
                if (!self.properties[j].isactive) {
                    $(table_row.children[j]).css("display", "none");
                    conditions.push(null);
                    continue;
                }
                any_data = true;
                var cell_element = table_row.children[j];
                $(cell_element).css("display", "table-cell");
                var val = curr_entity.value(self.properties[j]);
                if (val !== undefined) {
                    cell_element.textContent = val;
                    if (!self.properties[j].type.check(val))
                        cell_element.classList.add("error-content");
                }
                else
                    cell_element.classList.add("no-data");
            }

            // process table data including conditions
            if (row_id === 0 || any_data && this.all_conditions_satisfied(conditions, curr_entity))
                $(table_row).css("display", "table-row");
            else
                $(table_row).css("display", "none");
        }
    }

    all_conditions_satisfied(conditions, entity) {
        for (let j = 0; j < this.properties.length; ++j) {
            if (conditions[j] === null)
                continue;
            var condition = conditions[j].condition;
            if (condition === "")
                continue;
            var key_word = conditions[j].key_word;
            var property = this.properties[j];
            var property_type = property.type;
            var value = entity.value(property);
            if (key_word === KEY_WORD_EXACTLY)
                return property_type.is_exact_the_same(condition, value);
            else if (key_word === KEY_WORD_LIKE)
                return property_type.is_almost_the_same(condition, value);
        }
        return true;
    }

    sort(conditions) {
        var mapped = this.entities.map(function(entity, i) {
            return { index: i, entity: entity };
            });
        
        var is_sorting_needed = false;
        for (let i = 0; i < conditions.length; ++i) {
            if (conditions[i] === null)
                continue;
            if (conditions[i].sort_mode !== SORT_NONE) {
                is_sorting_needed = true;
                break;
            }
        }
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
        
        var self = this;
        this.sorted_entities_with_indices.sort(function(a, b) {
            for (let j = 0; j < self.properties.length; ++j) {
                if (conditions[j] === null || conditions[j].sort_mode === SORT_NONE)
                    continue;
                const property = self.properties[j];
                const a_val = a.entity.value(property);
                const b_val = b.entity.value(property);
                const is_ascending = conditions[j].sort_mode === SORT_ASCENDING;
                if (a_val < b_val)
                    return is_ascending ? -1 : 1;
                else if (a_val > b_val)
                    return is_ascending ? 1 : -1;

            }
            return 0;
        });
    }

    getHTML() {
        return this.element;
    }
}