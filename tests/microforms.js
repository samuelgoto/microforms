const Assert = require("assert");

describe("Microforms", function() {
  it("parsing", function() {
  });

  function assertThat(x) {
   return {
    equalsTo(y) {
     Assert.deepEqual(x, y);
    }
   }
  }

});

