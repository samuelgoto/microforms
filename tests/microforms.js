const Assert = require("assert");
const parseString = require("xml2js").parseString;
const builder = require('xmlbuilder');

async function parse(xml) {
 return new Promise(function(resolve, reject) {
   parseString(xml, function(err, result) {
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
  it.only("json", async function() {
    console.log("hi");

    let microform = {
     "type": "Issues",
     "description": "The list of issues we are tracking",
     "<form name='create' action='/create.php' method='POST'>": {
      "<label>": "Create new issues",
      "<label for='title'>": "The name of the issue",
      "<input name='title'> required": {},
      "<label for='description'>": "The description of the issue",
      "<input name='description'>": {}
     }
    };

    console.log(JSON.parse(JSON.stringify(microform)));

   });

  it("building", async function() {
    // console.log("hi");

    // var xml = builder.create("doc")
    // .ele("form")
    // .ele("input", {"type": "git"}, "git://github.com/oozcitak/xmlbuilder-js.git").up()
    // .ele("input", {"type": "git"}, "git://github.com/oozcitak/xmlbuilder-js.git").up()
    // .end({pretty: true, allowEmpty: false});
 
    // console.log(xml);
    let result = {
     "type": "Issues",
     "description": "The list of issues we are tracking",
     "@form": {
      "@name": "create",
      "@action": "/create.php",
      "@method": "POST",
      "label": "Create new issues",
      "input": [{
        "@name": "title",
        "@required": "true",
        "label": "The name of the issue"
       }, {
        "@name": "description",
        "label": "The description of the issue"
       }]
     }
    };

    let form = result["@form"];
    delete result["@form"];

    let doc = {
     doc: {
      "#text": JSON.stringify(result),
      "form": form
     }
    }

    var feed = builder
     .create(doc, {})
     .end({pretty: true, allowEmpty: false});

    console.log(feed);


   });
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

