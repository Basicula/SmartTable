class Table{
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
                $(tr_element).css("display", self.entities[i].isactive ? "table-row":"none");
            for (let j = -1; j < self.properties.length; ++j) {
                var cell_element;
                if (i === -1 || j === -1)
                    cell_element = document.createElement("th");
                else
                    cell_element = document.createElement("td");
                if (j !== -1)
                    $(cell_element).css("display", self.properties[j].isactive ? "table-cell":"none");
                tr_element.appendChild(cell_element);
                if (i === -1 && j === -1)
                    cell_element.textContent = this.name;
                else if (j === -1)
                    cell_element.textContent = self.entities[i].name;
                else if (i === -1)
                    cell_element.textContent = self.properties[j].name;
                else
                    cell_element.textContent = "("+i+", "+j+")";
            }
            self.element.appendChild(tr_element);
        }
    }

    update() {
        var self = this;
        for (let i = 0; i < self.element.children.length; ++i) {
            if (i > 0 && !self.entities[i-1].isactive) {
                $(self.element.children[i]).css("display", "none");
                continue;
            }
            $(self.element.children[i]).css("display", "table-row");
            var table_row = self.element.children[i];
            for (let j = 0; j < table_row.children.length; ++j) {
                if (j > 0 && !self.properties[j-1].isactive) {
                    $(table_row.children[j]).css("display", "none");
                    continue;
                }
                $(table_row.children[j]).css("display", "table-cell");
                var cell_element = table_row.children[j];
                if (i === 0 && j === 0)
                    cell_element.textContent = this.name; // if table name changed
                else if (i === 0)
                    cell_element.textContent = self.properties[j-1].name; // if property name changed
                else if (j === 0)
                    cell_element.textContent = self.entities[i-1].name; // if entity name changed
            }
        }
    }

    getHTML() {
        return this.element;
    }
}