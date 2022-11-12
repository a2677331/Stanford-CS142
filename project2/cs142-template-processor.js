'use strict';

// Constructor Function
function Cs142TemplateProcessor(template) {
  this.template = template;
}

// Function Prototype
Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
  // for each property in dictionary
  let filledTemplate = this.template;
  const re = /{{[^{]*}}/g;               // search for all {{var}} patterns
  const match = this.template.match(re); // all matching patterns are in an array

  match.forEach((placeholder) => {
    const property = placeholder.replace("{{", "").replace("}}", ""); // get var out of {{var}}

    if (dictionary[property] !== undefined) {
        // repalce with property value in dictionary
      filledTemplate = filledTemplate.replace(placeholder, dictionary[property]); 
    } else {
        // no property in dictionary, use ""
      filledTemplate = filledTemplate.replace(placeholder, ""); 
    }
});

  // return filled template
  return filledTemplate;
};