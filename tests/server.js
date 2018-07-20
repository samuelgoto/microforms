const Assert = require("assert");
const parseString = require("xml2js").parseString;
const builder = require('xmlbuilder');
const server = require("../demo/server.js");
const fetch = require("node-fetch");
const {Parser} = require("../microforms.js");

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
      "<form name='create' action='/create' method='POST'>": {
        "<input name='title'>": {},
        "<input name='description'>": {}
      }
     });

    // assertThat(microform(result).create()).equalsTo("hello world");
   });

  it("Submission", async function() {
    let payload = await fetch("http://localhost:8000/");
    let result = Parser.build("http://localhost:8000/", await payload.json());
    let response = await result.create({title: "foo", description: "bar"});

    assertThat(response).equalsTo({
      "foo": "bar"
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

