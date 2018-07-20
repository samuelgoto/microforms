const Assert = require("assert");
const parseString = require("xml2js").parseString;
const builder = require('xmlbuilder');
const server = require("../demo/server.js");
const fetch = require("node-fetch");

describe("Server", function() {
  it("Accept: */*", async function() {
    let response = await fetch("http://localhost:8000/");
    assertThat(response.headers.get("content-type"))
     .equalsTo("application/microforms; charset=utf-8");
   });

  it("Accept: application/json", async function() {
    let response = await fetch("http://localhost:8000/", {
      headers: {
       "Accept": "application/json"
      }
     });
    let result = await response.json();

    assertThat(response.headers.get("content-type"))
     .equalsTo("application/json; charset=utf-8");
    assertThat(response.ok).equalsTo(true);
    assertThat(result).equalsTo({hello: "world"});
   });

  it("Accept: application/microforms+json", async function() {
    let response = await fetch("http://localhost:8000/");
    assertThat(response.headers.get("content-type"))
     .equalsTo("application/microforms; charset=utf-8");

    let result = await response.json();

    assertThat(result).equalsTo({
      "hello": "world",
      "<form name='create' method='POST'>": {
        "<input name='title'>": {},
        "<input name='description'>": {}
      }
     });

    function microform(obj) {
     return new Proxy(obj, {
       get: function(obj, prop) {
        if (obj[prop]) {
         return obj[prop];
        } else {
         for (let key in obj) {
          // console.log(key);
          if (key.startsWith("<form " ) && key.endsWith(">")) {
           return function(formData) {
            return "hello world";
           }
          }
         }
        }
       }
     });
    }

    assertThat(microform(result).create()).equalsTo("hello world");
   });

  function parse(key, value) {
   if (!key.startsWith("<" ) || !key.endsWith(">")) {
    throw Error(`Parsing error. Expected tags at ${key}`);
   }
   let trim = (x) => x.substring(1, x.length - 1);
   let name = key.substring(1, Math.max(key.indexOf(" "), key.indexOf(">")));
   console.log(name);
   let attributes = key.substring(`<${name} `.length, key.length - 1);
   function params(attributes) {
    let result = {};
    attributes.split(" ")
     .map(keyvalue => keyvalue.split("="))
     .forEach(x => result[x[0]] = trim(x[1]));
    return result;
   }

   let el = params(attributes);
   el["@type"] = name;
   el.children = [];

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

  it.only("Parser: head", async function() {
    let regex = /^<\s*(\w+)((?:\s+\w+\s*=\s*'\w*')*)\s*>$/;
    assertThat(regex.test("")).equalsTo(false);
    assertThat(regex.test("<>")).equalsTo(false);
    assertThat(regex.test("<f>")).equalsTo(true);
    assertThat(regex.test("<form>")).equalsTo(true);
    assertThat(regex.test("<form >")).equalsTo(true);
    assertThat(regex.test("<form  >")).equalsTo(true);
    assertThat(regex.test("< form>")).equalsTo(true);
    assertThat(regex.test("<  form>")).equalsTo(true);
    assertThat(regex.test("<  form  >")).equalsTo(true);
    assertThat(regex.test("< form >")).equalsTo(true);

    assertThat(regex.test("<form a>")).equalsTo(false);
    assertThat(regex.test("<form a=>")).equalsTo(false);

    assertThat(regex.test("<form a=''>")).equalsTo(true);
    assertThat(regex.test("<form a =''>")).equalsTo(true);
    assertThat(regex.test("<form a = ''>")).equalsTo(true);
    assertThat(regex.test("<form a = '' >")).equalsTo(true);

   });

  it("Parser: simple", async function() {
    assertThat(parse("<form name='create' method='POST'>", {}))
     .equalsTo({
       "@type": "form",
       "name": "create",
       "method": "POST",
       "children": []
      });
   });

  it("Parser: recursive", async function() {
    assertThat(parse("<form name='create' method='POST'>", {
       "<input name='foo'>": {}
    }))
     .equalsTo({
       "@type": "form",
       "name": "create",
       "method": "POST",
       "children": [{
         "@type": "input",
         "name": "foo",
         "children": []
       }]
      });
   });

  it.skip("Parser: no attributes", async function() {
    assertThat(parse("<label>", {})).equalsTo({
      "@type": "label"
    });
   });

  it("Parser: preserves order", async function() {
    assertThat(parse("<form name='create' method='POST'>", {
       "<label>": "good stuff",
       "<input name='foo'>": {},
       "<input name='bar'>": {},
    }))
     .equalsTo({
       "@type": "form",
       "name": "create",
       "method": "POST",
       "children": [{
         "@type": "input",
         "name": "foo",
         "children": []
        }, {
         "@type": "input",
         "name": "bar",
         "children": []
       }]
      });
   });

  before(function () {
    server.listen(8000);
   });

  after(function () {
    server.close();
  });

  function assertThat(x) {
   return {
    equalsTo(y) {
     Assert.deepEqual(x, y);
    }
   }
  }

});

