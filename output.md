# &lt;output&gt;

The &lt;output&gt; tag represents the result of the &lt;form&gt; submission (e.g. what to expect what to get back).

# Attributes

| Attribute        | Type           | Description  |
| :--------------- |:---------------| :------------|
| type | mime_type | Specifies the mime-type that defines how to interpret the output body |

# Children


# Examples

```xml
{
  "context": "http://schema.org",
  "@type": "WebSite",
  "name": "Sam's website!",
  "description": "Search for places!",
  "<form action='/search.php'>": {
    "<output type='application/schema+json'>": {
      "type": "object",
      "properties": {
        "number": {"type": "number"},
        "street_name": {"type": "string"},
        "street_type": {
          "type": "string",
          "enum": ["Street", "Avenue", "Boulevard"]}
      }
    }
  }
}
```
