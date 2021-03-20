class Property{
  constructor(name, type){
    this.name = name;
    this.type = type;
    if (!this.type)
        this.type = new StringType();
    this.description = "";
    this.notes = [];
    this.is_active = false;
    this._setElement();
  }

  _setElement(){
      var self = this; // to distinguish JQuery and inner class "this" object
      self.view_element = document.createElement("div");
      self.view_element.classList.add("property");

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
          self.is_active = !self.is_active;
      });
      $(property_header_text).click(function(e) {
          if (e.target !== this)
              return;
          $(this).parent().toggleClass("selected");
          self.is_active = !self.is_active;
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
      
      var description_content = document.createElement("div");
      description_content.style.display = "none";
      description_content.classList.add("description-container");

      var dropdown_btn = create_dropdown_button(
            function() {
                description_content.textContent = self.description;
                description_content.style.display = "";
            }, 
            function() {
                description_content.style.display = "none";
            });
      property_header.appendChild(dropdown_btn);

      self.view_element.appendChild(property_header);
      self.view_element.appendChild(description_content);
  }
}

