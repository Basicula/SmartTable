class Entity{
    constructor(name, properties){
      this.name = name;
      this.properties = properties;
    }

    getCSS(){

    }

    getHTML(){
        return "<div class=\"entity\">"+this.name+"</div>"
    }
  }