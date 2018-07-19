const Assert = require("assert");
const parseString = require("xml2js").parseString;
const builder = require('xmlbuilder');
const server = require("../demo/server.js");
const fetch = require("node-fetch");

describe("Server", function() {
  it("Accepts */*", async function() {
    let response = await fetch("http://localhost:8000/");
    assertThat(response.headers.get("content-type"))
     .equalsTo("application/microforms; charset=utf-8");
    // assertThat(response.headers.get("X-Compatible-Content-Type"))
    // .equalsTo("application/microforms");
   });

  it("/", async function() {
    //"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
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

