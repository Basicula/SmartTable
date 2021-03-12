class Property{
  constructor(name, type){
    this.name = name;
    this.type = type;
    this.description = "";
    this.notes = [];
    this.isactive = false;
    this._setElement();
  }

  _setElement(){
      var self = this; // to distinguish JQuery and inner class "this" object
      self.element = document.createElement("div");
      self.element.classList.add("property");

      var property_header = document.createElement("div");
      property_header.classList.add("property-header");
      var property_header_text = document.createElement("div");
      property_header_text.classList.add("div-text");
      property_header_text.textContent = self.name;
      $(property_header_text).keydown(function(e){
          if (e.which == 13)
              $(this).blur();
      });
      $(property_header).click(function(e) {
          if (e.target !== this)
              return;
          $(this).toggleClass("selected");
          self.isactive = !self.isactive;
      });
      $(property_header_text).click(function(e) {
          if (e.target !== this)
              return;
          $(this).parent().toggleClass("selected");
          self.isactive = !self.isactive;
      });
      $(property_header_text).dblclick(function(e) {
          if (e.target !== this)
              return;
          this.contentEditable = true;
          $(this).focus();
      });
      $(property_header_text).blur(function() {
          this.contentEditable = false;
          self.name = this.textContent;
      });
      property_header.appendChild(property_header_text);
      
      var dropdown_btn = document.createElement("button");
      dropdown_btn.classList.add("dropbtn")
      var arrow = document.createElement("i");
      arrow.classList.add("fa");
      arrow.classList.add("fa-caret-down");
      dropdown_btn.appendChild(arrow);
      property_header.appendChild(dropdown_btn);
      self.element.appendChild(property_header);
      
      var description_content = document.createElement("div");
      description_content.style.display = "none";
      description_content.classList.add("description-container");
      self.element.appendChild(description_content);
      
      $(dropdown_btn).click(function() {
          description_content.textContent = self.description;
          var display = $(description_content).css("display");
          if (display == "none")
              $(description_content).css("display", "block");
          else
              $(description_content).css("display", "none");
      });
  }

  getHTML(){
      return this.element;
  }
}

