function test(){
    $(".entities-container").each(function(){
        let n = random(1, 20);
        for (let i = 0; i < n; ++i){
            var entity = new Entity("Entity" + i);
            $(this).append(entity.getHTML());
        }
    });

    $(".properties-container").each(function(){
        let n = random(1, 20);
        for (let i = 0; i < n; ++i){
            var property = new Property("Property" + i);
            $(this).append(property.getHTML());
        }
    });
}

function selectedListner(){
    $(".entity, .property").click(function(){
        $(this).toggleClass("selected");
    });
}

$(document).ready(function(){
    test();
    selectedListner();
});