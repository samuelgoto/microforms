const Assert = require("assert");
const parseString = require("xml2js").parseString;


async function parse(xml) {
 return new Promise(function(resolve, reject) {
   parseString(xml, function(err, result) {
     // console.log(result);
     // console.log(result.resource["$"]);

     if (err) {
      reject(err);
      return;
     }

     let resource = result["doc"];
     if (resource["$"] && 
         resource["$"].type == "application/ld+json" &&
         resource["_"]) {
      // console.log("hi");
      resource["_"] = JSON.parse(resource["_"]);
     }
     resolve(result);
    });
 });
}

describe("Microforms", function() {
  it("parsing", async function() {
    
    let result = await parse(`
      <doc type="application/ld+json">
        {
          "@context": "schema.org",
          "@type": "WebSite",
          "name": "Microforms"
          <form action="/create" method="post">
            <input name="firstName" required="true"/>
          </form>
        }
      </doc>
    `);

    console.log(result);
  });

  function assertThat(x) {
   return {
    equalsTo(y) {
     Assert.deepEqual(x, y);
    }
   }
  }

});

