var tables_editor;

function demo_students() {
    var entities = [];
    var properties = [];
    // properties
    var name = new Property("Name", new StringType());
    name.set_description("Student's name");
    properties.push(name);

    var surname = new Property("Surname", new StringType());
    surname.set_description("Student's surname");
    properties.push(surname);

    var age = new Property("Age", new Integer());
    age.set_description("Student's age");
    properties.push(age);

    var course = new Property("Course", new StringType());
    course.set_description("Student's course");
    properties.push(course);

    var status_values = ["contract", "free"];
    var status = new Property("Status", new ValuesSetType("Status", status_values));
    status.set_description("Student's status");
    properties.push(status);

    for (let i = 0; i < 35; ++i) {
        var entity = new Entity();
        entity.values.push(random_string());
        entity.values.push(random_string());
        entity.values.push(random(18, 25));
        entity.values.push(random(1, 6));
        entity.values.push(random_choice(status_values));
        entities.push(entity);
    }

    var entity = new Entity("kek");
    entity.values.push("123");
    entity.values.push("123");
    entity.values.push(123);
    entity.values.push(123);
    entity.values.push("123");
    entities.push(entity);

    var no_data_entity = new Entity("no data", properties.length);
    entities.push(no_data_entity);

    var table = new QBETable("Students", entities, properties);
    
    return table;
}

function init_data(demo) {
    tables_editor = new TablesEditor();
    if (demo == 0)
        tables_editor.add_table(demo_students()); 
}

function update() {
    tables_editor.update();
}

$(document).ready(function(){
    // get current request and determine what demo run
    var url = new URL(window.location.href);
    var demo = url.searchParams.get("demo");
    init_data(demo);
    setInterval(function() {update()}, 500);
});