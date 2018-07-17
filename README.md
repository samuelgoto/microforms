---
permalink: /index.html
---

Microforms is a hypermedia API media type (```application/microforms+xml```) designed to expose REST APIs.

Microforms intermingles data (text) and control (hypertext), enabling API clients to make decisions (e.g. delete a resource) without using out-of-band information (e.g. human readable documentation).

They can be discovered in human-readable web pages with an ```link``` alternate tag:

```html
<link rel="alternate" href="/api" type="application/microforms+xml">
```

Linking a human-readable page to a machine-readable microform:

```xml
<resource type="application/ld+json">
  {
    @context: "schema.org",
    @type: "Blog"
    title: "Sam's blog",
    blogPost: [{
      type: "BlogPosting",
      id: 1,
      title: "hello world"
    }, {
      type: "BlogPosting",
      id: 2,
      title: "foo bar"
  }]
  <link rel="self" href="/api">
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

# Discovery

```html
<link rel="alternate" href="/api" type="application/microforms+xml">
```

# Key management

* Bearer tokens: for key management

# Quota management

* Throttling: for quota management

* Accepts-Vocab: for vocabulary negotiation

# Extension mechanism

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

