The ```application/microforms+json``` data type is a notation for microforms that is strictly compatible with JSON.

By convention, hyperdata nodes are started using an ```@``` notation. Data nodes that are children of hyperdata nodes are attributes of the hyperdata nodes and ```@``` nodes start new hyperdata nodes recursively.

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