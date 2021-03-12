var entities = [];
var properties = [];

function demo_students() {
    // properties
    var name = new Property("Name", new StringType());
    name.description = "Student's name";
    properties.push(name);

    var surname = new Property("Surname", new StringType());
    surname.description = "Student's surname";
    properties.push(surname);

    var age = new Property("Age", new NumberType());
    age.description = "Student's age";
    properties.push(age);

    var course = new Property("Course", new StringType());
    course.description = "Student's course";
    properties.push(course);

    var status_values = ["contract", "free"];
    var status = new Property("Status", new ValuesSetType("Status", status_values));
    status.description = "Student's status";
    properties.push(status);

    for (let i = 0; i < 100; ++i) {
        var entity = new Entity();
        entity.properties.push(new Pair(name, random_string()));
        entity.properties.push(new Pair(surname, random_string()));
        entity.properties.push(new Pair(age, random(18, 25)));
        entity.properties.push(new Pair(course, random(1, 6)));
        entity.properties.push(new Pair(status, random_choice(status_values)));
        entities.push(entity);
    }

    var entity = new Entity("kek");
    entity.properties.push(new Pair(name, 123));
    entity.properties.push(new Pair(surname, 123));
    entity.properties.push(new Pair(age, 123));
    entity.properties.push(new Pair(course, 123));
    entity.properties.push(new Pair(status, 123));
    entities.push(entity);

    var table = new QBETable("Formats", entities, properties);
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
    demo_students();
});

$(document).keydown(function(e){
    if (e.keyCode === 80 && e.ctrlKey && e.altKey) {
        $(".property-header").click();
    }
});