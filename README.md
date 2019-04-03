---
permalink: index.html
published: true
---

Microforms is an early proposal for a structural, domain-agnostic hypermedia API media type designed to expose REST APIs.

Microforms intermingles domain-specific **data** and general-purpose **hyperdata**, enabling API clients to make decisions (e.g. create/delete/update a resource) without using out-of-band information (e.g. human readable documentation).

The [JSON/JSON-LD](json.md) notation is designed to allow data to be intermingled (but still be  distinguishable, **visually** and **programatically**) with hyperdata and look (and behave) as similiar as possible to HTML:

Is this better? Possibly?

```xml
{
  "@context": "https://schema.org/",
  "@type": "Restaurant",
  "name": "Sam's place",
  "description": "Best food ever",
  "address": "1234 main street, mountain view, ca",

  "<form name='create' action='/create.php' method='POST'>": {
    "<label>": "Create new issues",
    "<label for='title'>": "The name of the issue",
    "<input name='title' required='true'>": {},
    "<label for='description'>": "The description of the issue",
    "<input name='description'>": {}
  }
}
```

Microforms comes up a set of builtin hypermedia [affordances](intro.md) available in a data type and a set of conventions that clients use for the programatic [discovery](intro.md#discovery), [documentation](intro.md#documentation), [validation](intro.md#validation), [execution](intro.md#execution) (e.g. [key management](intro.md#key-management) and [quota management](intro.md#quota-management)) of REST APIs.

You can learn more about microforms [here](intro.md).

We would love your feedback and participation [here](https://github.com/samuelgoto/microforms/issues/new).
