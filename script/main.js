var entities = [];
var properties = [];

function test(){
    $(".entities-container").each(function(){
        let n = random(1, 100);
        for (let i = 0; i < n; ++i){
            var entity = new Entity("Entity" + i);
            entities.push(entity);
            $(this).append(entity.getHTML());
        }
    });
    
    $(".properties-container").each(function(){
        let n = random(1, 100);
        for (let i = 0; i < n; ++i){
            var property = new Property("Property" + i);
            properties.push(property);
            $(this).append(property.getHTML());
        }
    });
    var table = new Table("Table", entities, properties);
    $(".table-container").append(table.getHTML());
    setInterval(function() {table.update()}, 500);
}

function demo() {
    // properties
    var is_supported = new Property("Is supported format", new BooleanType());
    is_supported.description = "true - format supported;\nfalse - format isn't supported;\notherwise - undefined";
    properties.push(is_supported);

    var vertex_color = new Property("Vertex color", new BooleanType());
    vertex_color.description = "true - format supports vertex color;\nfalse - doesn't support it;\notherwise - undefined";
    properties.push(vertex_color);

    var triangle_color = new Property("Triangle color", new BooleanType());
    triangle_color.description = "true - format supports triangle color;\nfalse - doesn't support it;\notherwise - undefined";
    properties.push(triangle_color);

    var surface_color = new Property("Surface color", new BooleanType());
    surface_color.description = "true - format supports surface color;\nfalse - doesn't support it;\notherwise - undefined";
    properties.push(surface_color);

    var textures = new Property("Textures", new BooleanType());
    textures.description = "true - format supports texturing;\nfalse - doesn't support it;\notherwise - undefined";
    properties.push(textures);

    // entities
    var obj_format = new Entity("OBJ");
    obj_format.properties.push(new Pair(is_supported, true));
    obj_format.properties.push(new Pair(vertex_color, true));
    obj_format.properties.push(new Pair(triangle_color, true));
    obj_format.properties.push(new Pair(surface_color, false));
    obj_format.properties.push(new Pair(textures, true));
    obj_format.description = "OBJ format implementation";
    entities.push(obj_format);

    var ply_format = new Entity("PLY");
    ply_format.properties.push(new Pair(is_supported, true));
    ply_format.properties.push(new Pair(vertex_color, true));
    ply_format.properties.push(new Pair(triangle_color, true));
    ply_format.properties.push(new Pair(surface_color, false));
    ply_format.properties.push(new Pair(textures, false));
    ply_format.description = "PLY format implementation";
    entities.push(ply_format);

    var unfamiliar_format = new Entity("Unfamiliar format");
    unfamiliar_format.description = "Some new format maybe about which we don't know anything";
    entities.push(unfamiliar_format);

    var unsupported_format = new Entity("Unsupported format");
    unsupported_format.properties.push(new Pair(is_supported, false));
    unsupported_format.description = "Some format that in progress or in plans to implement";
    entities.push(unsupported_format);

    var table = new Table("Formats", entities, properties);
    $(".table-container").append(table.getHTML());
    $(".entities-container").each(function(){
        for (let i = 0; i < entities.length; ++i)
            $(this).append(entities[i].getHTML());
    });
    $(".properties-container").each(function(){
        for (let i = 0; i < properties.length; ++i)
            $(this).append(properties[i].getHTML());
    });
    setInterval(function() {table.update()}, 500);
}

$(document).ready(function(){
    //test();
    demo();
});

$(document).keydown(function(e){
    if (e.keyCode === 69 && e.ctrlKey && e.altKey) {
        $(".entity-header").click();
    }
    if (e.keyCode === 80 && e.ctrlKey && e.altKey) {
        $(".property-header").click();
    }
});