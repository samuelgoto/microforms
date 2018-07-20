---
permalink: /index.html
---

Microforms is an early proposal for a structural, domain-agnostic hypermedia API media type designed to expose REST APIs.

Microforms intermingles domain-specific **data** and general-purpose **hyperdata**, enabling API clients to make decisions (e.g. create/delete/update a resource) without using out-of-band information (e.g. human readable documentation).

The [JSON](json.md) notation is designed to allow **data** to be intermingled (but still be  **distinguishable**, visually and programatically) with **hyperdata** and look (and behave) as similiar as possible to HTML:

```xml
{
  "type": "Issues",
  "description": "The list of issues we are tracking",

  "<form name='create' action='/create.php' method='POST'>": {
    "<label>": "Create new issues",
    "<label for='title'>": "The name of the issue",
    "<input name='title' required='true'>": {},
    "<label for='description'>": "The description of the issue",
    "<input name='description'>": {}
  }
}
```

Microforms currently specifies a [JSON](json.md) serialization (```application/microforms+json```) and a [XML](xml.md) serialization (```application/microforms+xml```).

At its core, microforms is a set [hypermedia affordances](intro.md) available in a data type, as well as a set of conventions that clients use for the programatic [discovery](intro.md#discovery), [documentation](intro.md#documentation), [validation](intro.md#validation-rules), [execution](intro.md#execution-rules) (e.g. [key management](intro.md#key-management) and [quota management](intro.md#quota-management)) of REST APIs.

You can learn more about microforms [here](intro.md).

We would love your feedback and participation [here](https://github.com/samuelgoto/microforms/issues/new).

