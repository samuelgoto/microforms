The ```application/microforms+json``` data type is a notation for microforms that is strictly backwards compatible with JSON.

By convention, hyperdata node keys are wrapped around a ```<>``` to make them **distinguishable** from data, both **visually** as well as **programatically**.

For example, while this is **data**:

```json
{
  "a": "this is data",
}
```

Whereas this is **hyperdata**:

```json
{
  "<a>": "this is hyperdata"
}
```

**Attributes** can be assigned inside the JSON body

```json
{
  "<input>": {
    "name": "bar"
  }
}
```

Or at the key location as a list of ```key=value``` pairs.

```json
{
  "<input name='foo'>": {},
}
```

The former is useful because it gives you the ability to write a list of elements that have the same name sequentially without creating an array. For example, this:

```json
{
  "<form>": {
    "<input>": [{
      "name": "foo",
      "required": "true"
    }, {
      "name": "bar",
      "required": "false"
    }]
  }
}
```

Can be written as:

```json
{
  "<form>": {
    "<input name='foo'>": {
      "required": "true"
    },
    "<input name='bar'>": {
      "required": "false"
    }
  }
}
```


# Alternatives considered

* [wrapping](#wrapping)
* [different tokens](#different-tokens)
* [json-ish](#json-ish)

## Wrapping

The most common strategy in hypermedia APIs ([hal](http://stateless.co/hal_specification.html), [hydra](http://www.hydra-cg.com/) and [siren](https://github.com/kevinswiber/siren)) is to "wrap" the domain-specific data in containers:

```json
{
  "class": [ "order" ],
  "properties": { 
    "orderNumber": 42, 
    "itemCount": 3,
    "status": "pending"
  },
  "actions": [{
    "name": "add-item",
    "title": "Add Item",
    "method": "POST",
    "href": "http://api.x.io/orders/42/items",
    "type": "application/x-www-form-urlencoded",
    "fields": [
      { "name": "orderNumber", "type": "hidden", "value": "42" },
      { "name": "productCode", "type": "text" },
      { "name": "quantity", "type": "number" }
    ]
  }],
  "links": [
    { "rel": [ "self" ], "href": "http://api.x.io/orders/42" },
    { "rel": [ "previous" ], "href": "http://api.x.io/orders/41" },
    { "rel": [ "next" ], "href": "http://api.x.io/orders/43" }
  ]
}
```

## Different tokens

By convention, hyperdata nodes could be started by using an ```@``` notation. Data nodes that are children of hyperdata nodes are attributes of the hyperdata nodes and ```@``` nodes start new hyperdata nodes recursively.

For example:

```json
{
  "type": "Issues",
  "description": "The list of issues we are tracking",
  "@form": {
    "name": "create",
    "action": "/create.php",
    "method": "POST",
    "@label": "Create new issues",
    "@input": [{
      "name": "title",
      "required": "true",
      "@label": "The name of the issue"
     }, {
      "name": "description",
      "@label": "The description of the issue"
     }]
  }
}
```

You can assign properties at the key name of the node too between ```[...]```, which gives you the ability to repeat elements with the same key/name. For example:

```json
{
  "type": "Issues",
  "description": "The list of issues we are tracking",
  "@form[name:'create', action:'/create.php', method:'POST']": {
    "@label": "Create new issues",
    "@label[for:'title']": "The name of the issue",
    "@input[name:'title']": {
      "required": "true"
    },
    "@label[for:'description']": "The description of the issue"
    "@input[name:'description']": {}
  }
}
```

## JSON-ISH

If backwards compatibility with JSON parsers wasn't an issue, we could extend the grammar to enable the intermingling of data and hyperdata. In the JSON-ish formulation, we would have something along the lines of:

```
{
  a: 1,
  b: 2,
  form {
    ...
    input {
      ...
    }
    input {
      ...
    }
  }
}
```

Breaking JSON compatibility requires a major advantage in return, which doesn't seem to stand on its own weight.