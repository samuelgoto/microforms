---
permalink: /index.html
---

Microforms is a structural, domain-agnostic hypermedia API media type designed to expose REST APIs.

Microforms intermingles domain-specific data (text) and general-purpose control (hypertext), enabling API clients to make decisions (e.g. create/delete/update a resource) without using out-of-band information (e.g. human readable documentation).

At its core, microforms is a set [hypermedia affordances](intro.md#affordances) available in a data type, as well as a set of conventions that clients use for the programatic [discovery](intro.md#discovery), [documentation](intro.md#documentation), [validation](intro.md#validation-rules), [key management](intro.md#key-management) and [quota management](intro.md#quota-management) of REST APIs.

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
  }
</doc>
```

You can learn more about microforms [here](intro.md).


