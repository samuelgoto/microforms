---
permalink: /index.html
---

# Microforms

Microforms is a hypermedia API media type (```application/microforms+xml```) designed to expose REST API.

The form serves the function of intermingling data (text) and control (hypertext). That enables clients to make decisions (e.g. delete a resource) without using out-of-band information (e.g. human readable documentation).

Here is an example:

```xml
<resource>
  <link rel="self" href="/blog">
  <data>
  {
    // comments are allowed!
    type: "Blog",
    blogPost: [{
      type: "BlogPosting",
      id: 1,
      title: "hello world",
      // here is the first time an anchor tag appears
      get: a { href: "/posts/1"}
    }, {
      type: "BlogPosting",
      id: 2,
      title: "foo bar",
      // here is a second anchor tag
      get: a { href: "/posts/2"}
  }]
  </data>
  <form action="/create" method="POST">
    <input name="title">
  </form>
</resource>
```

# Affordances

It comes with some common control structures, borrowed from HTML for ease of use. For example:

* ```a```
* ```link```
* ```form```
* ```input```
* ```select```
* ```option```
* ```meta```
* ```fieldset```

As well as some additional ones to enable contemporary APIs to be written:

* ```group```
* data loading
* validation

A lot of control structures are also available outside of the context of the file format, which gives clients of microforms more instructions on how to proceed. These are:

* Accepts-Vocab: for vocabulary negotiation
* Bearer tokens: for key management
* Throttling: for quota management

# Extension mechanism

We are still exploring some options, but it is clear that we need to support some sort of extension mechanism. Something along the lines of:

```javascript
{
  namespace { id: "oauth", url: "http://oauth.org" }
  type: "Error",
  messsage: "Oops, you have to be signed-in to access this resource",
  retry: [oauth:signin] {
    [oauth:authorization]: "http://example.com",
    [oauth:scopes]: {
      "write.calendar": "modify your calendar events",
      "write.calendar": "access your calendar events",
    }
  }
}
```

# Related Work

* hydra
* atom
* swagger
* alps
* siren
* swagger
* json-home
* rsdl
* wadl
* blueprint
* restdesc
* wsdl
* hal

