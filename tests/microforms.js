const Assert = require("assert");
const {Parser, parse, header} = require("../microforms.js");
const {Request} = require("node-fetch");
const { URLSearchParams } = require("url");


describe("Microforms", function() {
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

  it("Parser: full object", async function() {
    assertThat(Parser.parse({})).equalsTo({children: []});
    assertThat(Parser.parse({a: 1})).equalsTo({a: 1, children: []});
    assertThat(Parser.parse({a: 1, "<b>": "hi"}))
     .equalsTo({a: 1, children: [{
         "@type": "b",
         "#text": "hi",
         "children": []
     }]});
    assertThat(Parser.parse({a: 1, "<b c='1'>": "hi"}))
     .equalsTo({a: 1, children: [{
         "@type": "b",
         "#text": "hi",
         "c": "1",
         "children": []
     }]});
    assertThat(Parser.parse({a: 1, "<b c='1'>": { "<d>": "hi" }}))
     .equalsTo({a: 1, children: [{
         "@type": "b",
         "c": "1",
         "children": [{
           "@type": "d",
           "#text": "hi",
           "children": []
         }]
     }]});
   });

  it("Build", async function() {
    let result = Parser.build({
      "a": 1,
      "b": 2,
      "<form name='create'>": {
      }
    });

    // console.log(result);

    assertThat(result).equalsTo({a: 1, b: 2});

    let request = {};
    let params = new URLSearchParams();
    params.append("foo", "bar");
    let response = await result.create(params, async function(req) {
      request = req; 
      return {bar: 1};
    });
    assertThat(response).equalsTo({bar: 1});
    assertThat(request).equalsTo({
      "url": "",
      "method": "GET",
      "body": params
    });
  });

  function assertThat(x) {
   return {
    equalsTo(y) {
     Assert.deepEqual(x, y);
    }
   }
  }

});

