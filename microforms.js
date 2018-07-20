const xml = require("xml-parse");


function header(key) {
 key = key.replace(new RegExp("'", 'g'), "\"");
 let [el] = xml.parse(key);

 // console.log(el);                                                                                                       
 if (!el || el.type != "element") {
  return false;
 }

 return {
  [el.tagName]: el.attributes
   }
}

function parse(key, value) {

 let head = header(key);

 let name = Object.keys(head)[0];

 let el = head[name];
 el["@type"] = name;
 el.children = [];

 // console.log(el);                                                                                                       

 if (typeof value == "string") {
  el["#text"] = value;
 } else if (typeof value == "object") {
  for (let key in value) {
   el.children.push(parse(key, value[key]));
  }
 } else {
  throw new Error("Unknown body type");
 }
 return el;
}

module.exports = {
 parse: parse,
 header: header
};