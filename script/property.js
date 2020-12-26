class Property{
    constructor(name, type, value){
      this.name = name;
      this.type = type;
      this.value = value;
    }

    getCSS(){

    }

    getHTML(){
        return "<div class=\"property\">"+this.name+"</div>"
    }
  }