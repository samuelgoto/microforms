const fs = require("fs");

function clear(str) {
 return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function node(name, children, description, properties, examples) {
 return {name: name, properties: properties, description: clear(description), children: children, examples: examples};
}

function prop(name, type, description) {
 return {name: name, type: type, description: clear(description)};
}

let nodes = 
 [
  node("link", [], `
       The <link> tag defines a link between a document and an external resource.
       `, 
       [prop("href", "URL","Specifies the location of the linked document"),
        prop("rel", "```alternate```, ```help```, ```next```, ```prev``` or ```self```", "Required. Specifies the relationship between the current document and the linked document"),
        prop("type", "media_type", "Specifies the media type of the linked document")],
       []),

  node("label", [], [
        `The <label> tag defines a human-readable label for an [<input>](input.md) or [<form>](form.md).`,
       `The for attribute of the <label> tag should be equal to the id attribute of the related element to bind them together. If none is specified, it binds to its direct parent.`
       ].map(x => x.trim()).join("\n\n"), 
       [prop("for", "element_id", "Specifies which document element a label is bound to")],
       []),

  node("form", ["label", "input", "fieldset"], [
       `The <form> tag defines a templated hypertext transition.`
       ].map(x => x.trim()).join("\n\n"), 
       [prop("action", "URL", "Specifies where to send the form-data when a form is submitted"),
        prop("enctype", "```application/x-www-form-urlencoded```, ```multipart/form-data``` or ```text/plain```", "Specifies how the form-data should be encoded when submitting it to the server (only for method='post')"),
        prop("method", "```get```, ```post``` ```delete``` or ```patch```", "Specifies the HTTP method to use when sending form-data"),
        prop("name", "string", "Specifies the form name"),
        prop("novalidate", "novalidate", "Specifies that the form should not be validated when submitted")],
       []),

  node("input", [], [
      `The <input> tag defines an input field as a parameter to a [<form>](form.md).`,
      `An input field can vary in many ways, depending on the type attribute.`
       ].map(x => x.trim()).join("\n\n"), 
       [prop("accept", "media_type", "Specifies the types of files that the server accepts (only for type='file')"),
        prop("checked", "checked", "Specifies that an <input> element should be pre-selected when the document loads (for type='checkbox' or type='radio')"),
        prop("disabled", "disabled", "Specifies that an <input> element should be disabled"),
        prop("max", "```number``` or ```date```", "Specifies the maximum value for an <input> element"),
        prop("maxlength", "```number```", "Specifies the maximum number of characters allowed in an <input> element"),
        prop("min", "```number``` or ```date```", "Specifies a minimum value for an <input> element"),
        prop("multiple", "multiple", "Specifies that a user can enter more than one value in an <input> element"),
        prop("name", "text", "Specifies the name of an <input> element"),
        prop("pattern", "regexp", "Specifies a regular expression that an <input> element's value is checked against"),
        prop("placeholder", "text", "Specifies a short hint that describes the expected value of an <input> element"),
        prop("readonly", "readonly", "Specifies that an input field is read-only"),
        prop("required", "required", "Specifies that an input field must be filled out before submitting the form"),
        prop("step", "number", "Specifies the legal number intervals for an input field"),
        prop("type", "```checkbox```, ```color```, ```date```, ```datetime-local```, ```email```, ```file```, ```hidden```, ```month```, ```number```, ```radio```, ```range```, ```tel```, ```text```, ```time```, ```url``` or ```week```", "Specifies the type <input> element to use"),
        prop("value", "text", "Specifies the value of an <input> element")],
       []),

  node("fieldset", ["input"], [
       `The <fieldset> tag is used to group related elements in a form.`
       ].map(x => x.trim()).join("\n\n"), 
       [prop("disabled", "disabled", "Specifies that a group of related form elements should be disabled"),
        prop("name", "text", "Specifies a name for the fieldset")],
       []),
  ];

// for (let {name, description, properties, children, examples} of elements) {
// fs.writeFileSync(`${name}.md`, result.join("\n"));
// }

for (let {name, description, properties, children, examples} of nodes) {
 let result = [];
 result.push(`# &lt;${name}&gt;`);
 result.push(``);
 result.push(`${description.trim()}`);
 result.push(``);
 result.push(`# Attributes`);
 result.push(``);
 result.push(`| Attribute        | Type           | Description  |`);
 result.push(`| :--------------- |:---------------| :------------|`);

 for (let {name, type, description} of properties) {
  result.push(`| ${name} | ${type} | ${description} |`);
 }
 result.push(``);
 result.push(`# Children`);
 result.push(``);
 for (let child of children) {
  result.push(`  * [${child}](${child}.md)`);
 }
 result.push(``);
 result.push(`# Examples`);
 result.push(``);
 for (let example of examples) {
  result.push("```xml");
  result.push(example.trim());
  result.push("```");
 }
 result.push(``);

 // console.log(result.join("\n"));
 // console.log(name);
 // Creates a file
 fs.writeFileSync(`${name}.md`, result.join("\n"));
}
