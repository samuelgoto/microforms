const express = require('express');
const app = express();

app.get('/', (req, resp) => {
  let result = {
   hello: "world"
  };

  if (!req.accepts("application/microforms")) {
   resp.type("application/json");
  } else {
   resp.type("application/microforms");
   result["<form name='create' action='/create' method='POST'>"] = {
    "<input name='title'>": {},
    "<input name='description'>": {}
   };
  }

  resp.json(result);
 });

app.post('/create', (req, resp) => {
  resp.type("application/microforms");
  resp.json({foo: "bar"});
});

exports.listen = function(opt_port) {
 const port = process.env.PORT || opt_port;
 this.server = app.listen(port, () => {
   // console.log(`listening on port ${port}!`)
  });
};

exports.close = function() {
 this.server.close();
};