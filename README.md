---
permalink: /index.html
---

Microforms is a hypermedia API media type (```application/microforms+xml```) designed to expose REST APIs.

Microforms intermingles data (text) and control (hypertext), enabling API clients to make decisions (e.g. delete a resource) without using out-of-band information (e.g. human readable documentation).

They are designed to enable programatic [discovery](#discovery), [documentation](#documentation), [key management](#key-management) and [quota management](#quota-management) of REST APIs.

Here is an example of what a microform looks like:

```xml
<doc type="application/ld+json">
  <!-- domain-specific data -->
  {
    "@context": "schema.org",
    "@type": "Blog"
    "title": "Sam's blog",
    "blogPost": [{
      "@type": "BlogPosting",
      "id": 1,
      "title": "hello world"
    }, {
      "@type": "BlogPosting",
      "id": 2,
      "title": "foo bar"
  }]
  <!-- general purpose hypermedia affordances -->
  <link rel="self" href="/api" />
  <form action="/create" method="POST">
    <input name="title" />
  </form>
</doc>
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
* ```cardinality```

# Documentation

* ```labels```

# Validation

* validation

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

