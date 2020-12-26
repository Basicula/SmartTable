class Table{
    constructor(entities, properties){
        this.entities = entities;
        this.properties = properties;
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    addProperty(property){
        this.properties.push(property);
    }
}