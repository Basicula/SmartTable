var KEY_WORD_EXACTLY = "EXACTLY";
var KEY_WORD_LIKE = "LIKE";

class QBETable{
    constructor(name, entities, properties) {
        this.name = name;
        if (!entities)
            this.entities = [];
        else
            this.entities = entities;
        if (!properties)
            this.properties = [];
        else
            this.properties = properties;

        this.key_words = [KEY_WORD_EXACTLY, KEY_WORD_LIKE];
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

                    var key_words = document.createElement("select");
                    key_words.classList.add("column-header-key-words");
                    for (let key_word_id = 0; key_word_id < self.key_words.length; ++key_word_id) {
                        var option = document.createElement("option");
                        option.classList.add("column-header-key-word");
                        option.value = this.key_words[key_word_id];
                        option.textContent = this.key_words[key_word_id];
                        key_words.appendChild(option);
                    }
                    cell_element.appendChild(key_words);
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
        for (let i = 0; i < self.element.children.length; ++i) {
            var table_row = self.element.children[i];
            var any_data = false;
            for (let j = 0; j < table_row.children.length; ++j) {
                // hide table cell if property isn't active
                if (!self.properties[j].isactive) {
                    $(table_row.children[j]).css("display", "none");
                    conditions.push(null);
                    continue;
                }
                any_data = true;
                $(table_row.children[j]).css("display", "table-cell");
                var cell_element = table_row.children[j];
                if (i === 0) {
                    cell_element.firstChild.textContent = self.properties[j].name; // if property name changed
                    conditions.push({condition: cell_element.children[1].value, key_word: cell_element.children[2].value});
                }
            }
            if (i === 0 || any_data && this.all_conditions_satisfied(conditions, i - 1))
                $(self.element.children[i]).css("display", "table-row");
            else
                $(self.element.children[i]).css("display", "none");
        }
    }

    all_conditions_satisfied(conditions, entity_id) {
        for (let j = 0; j < this.properties.length; ++j) {
            if (conditions[j] === null)
                continue;
            var condition = conditions[j]["condition"];
            if (condition === "")
                continue;
            var key_word = conditions[j]["key_word"];
            var property = this.properties[j];
            var property_type = property.type;
            var value = this.entities[entity_id].value(property);
            if (property_type instanceof StringType) {
                if (key_word === KEY_WORD_EXACTLY) {
                    if (condition != value)
                        return false;
                }
                else if (key_word === KEY_WORD_LIKE) {
                    var similarity = string_similarity(condition, value);
                    if (similarity < 0.5)
                        return false;
                }
            }
            else if (property_type instanceof NumberType) {
                value = value.toString();
                if (key_word === KEY_WORD_EXACTLY) {
                    if (condition != value)
                        return false;
                }
                else if (key_word === KEY_WORD_LIKE) {
                    var similarity = string_similarity(condition, value);
                    if (similarity < 0.5)
                        return false;
                }
            }
        }
        return true;
    }

    getHTML() {
        return this.element;
    }
}