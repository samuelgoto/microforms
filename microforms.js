const xml = require("xml-parse");
const {Request} = require("node-fetch");
const {URLSearchParams} = require("url");

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

class Parser {
 static parse(obj) {
  let result = {};
  result.children = [];
  // console.log(obj);
  // let result = parse(obj);
  for (let prop in obj) {
   // console.log(prop);
   if (prop.startsWith("<") && prop.endsWith(">")) {
    let el = parse(prop, obj[prop]);
    // console.log(el);
    result.children.push(el);
    // result[]
   } else {
    result[prop] = obj[prop];
   }
  }

  return result;
 }

 static build(obj) {
  let parsed = Parser.parse(obj);
  let forms = parsed.children;
  delete parsed.children;
  return new Proxy(parsed, {
    get: function(result, key) {
     if (result[key]) {
      return result[key];
     }
     for (let form of forms) {
      if (form.name == key) {
       return submit.bind(form);
      }
     }
    }
  });
 }
}

async function submit(params, fetch) {
 let request = {
  url: this.action || "",
  method: this.method || "GET",
  body: params
 };

 
 return await fetch(request);
}

module.exports = {
 parse: parse,
 header: header,
 Parser: Parser
};