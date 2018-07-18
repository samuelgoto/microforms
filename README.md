---
permalink: /index.html
---

Microforms is a structural, domain-agnostic hypermedia API media type designed to expose REST APIs.

Microforms intermingles domain-specific data (text) and general purpose control (hypertext), enabling API clients to make decisions (e.g. create/delete/update a resource) without using out-of-band information (e.g. human readable documentation).

In addition to the data type, microforms also specifies conventions for the programatic [discovery](#discovery), [documentation](documentation.html), [key management](#key-management) and [quota management](#quota-management) of REST APIs.

There is an XML serialization of microforms (```application/microforms+xml```) and an early exploration of a JSON/JSON-LD serialization (```application/microforms+json```).

Here is an example of what a ```application/microforms+xml``` document looks like:

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

* [doc](doc.html)
* [link](link.html)
* [label](label.html)
* [form](form.html)
    * [input](input.html)
    * [fieldset](fieldset.html)

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


