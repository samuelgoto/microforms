const Assert = require("assert");
const parseString = require("xml2js").parseString;
const builder = require('xmlbuilder');
const server = require("../demo/server.js");
const fetch = require("node-fetch");
const xml = require("xml-parse");

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

  it("Parser: head", async function() {
    assertThat(header("<form a='1'>")).equalsTo({"form": {"a": "1"}});

    let regex = /^<\s*(\w+)((?:\s+\w+\s*=\s*'[^\'\n]*')*)\s*>$/;

    assertThat(header((""))).equalsTo(false);
    assertThat(header("<>")).equalsTo(false);

    assertThat(header("<f>")).equalsTo({"f": {}});
    assertThat(header("<form>")).equalsTo({"form": {}});
    assertThat(header("<form >")).equalsTo({"form": {}});
    assertThat(header("<form  >")).equalsTo({"form": {}});

    assertThat(header("< form>")).equalsTo(false);
    assertThat(header("<  form>")).equalsTo(false);
    assertThat(header("<  form  >")).equalsTo(false);
    assertThat(header("< form >")).equalsTo(false);

    assertThat(header("<form a>"))
     .equalsTo({"form": {"a": true}});
    assertThat(header("<form a=>"))
     .equalsTo({"form": {"a": ""}});

    assertThat(header("<form a=''>"))
     .equalsTo({"form": {"a": ""}});
    assertThat(header("<form a =''>"))
     .equalsTo({"form": {"a": true}});
    assertThat(header("<form a = ''>"))
     .equalsTo({"form": {"a": true}});
    assertThat(header("<form a = '' >"))
     .equalsTo({"form": {"a": true}});

    assertThat(header("<form a = ' >"))
     .equalsTo(false);
    assertThat(header("<form a='>"))
     .equalsTo(false);

    assertThat(header("<form a='1'>"))
     .equalsTo({"form": {"a": 1}});
    assertThat(header("<form a='a'>"))
     .equalsTo({"form": {"a": "a"}});
    assertThat(header("<form a='hello'>"))
     .equalsTo({"form": {"a": "hello"}});
    assertThat(header("<form a='a1'>"))
     .equalsTo({"form": {"a": "a1"}});
    assertThat(header("<form a='a1 '>"))
     .equalsTo({"form": {"a": "a1 "}});
    assertThat(header("<form a='?'>"))
     .equalsTo({"form": {"a": "?"}});
    assertThat(header("<form a='-'>"))
     .equalsTo({"form": {"a": "-"}});
    assertThat(header("<form a='a-1-b-2-c-3-?-!-:-{}'>"))
     .equalsTo({"form": {"a": "a-1-b-2-c-3-?-!-:-{}"}});

    assertThat(header("<form a='\n'>"))
     .equalsTo({"form": {"a": "\n"}});
    assertThat(header("<form a='''>"))
     .equalsTo(false);
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

  it("Parser: no attributes", async function() {
    assertThat(parse("<label>", {})).equalsTo({
      "@type": "label",
      "children": []
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
         "@type": "label",
         "#text": "good stuff",
         "children": []
        }, {
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

