Microforms is a media type for hypermedia APIs composed of a [notation](#notation) and a set of [built-in affordances](#built-in-affordances) with familiar concepts borrowed from HTML. It is designed to make your API entrypoints  [discoverable](#discovery), [explorable](#documentation) and [executable](#execution) by aggregators.

# Notation

The JSON [notation](json.md) is designed to intermingle **data** nodes 

```xml
{
  "a": "text"
}
```

with **hyperdata** nodes in a distinguishable manner (visually and programatically) using a convention of surrounding their names with HTML-like ```<>```s:

```xml
{
  "<form action='/create.php'>": "hypertext"
}
```

For example:

```xml
{
  "type": "Issues",
  "description": "The list of issues we are tracking",

  "<form name='create' action='/create'>": {
    "<input name='title'>": {},
    "<input name='description'>": {}
  }
}
```

# Built-in affordances

The built-in affordances (along with the [notation](#notation)) are designed to reuse as much as possible from HTML. There are built-in **hyperdata** element types to help you express your hypertext transitions:

* [link](link.md)
* [form](form.md)
    * [input](input.md)
    * [fieldset](fieldset.md)
    * [label](label.md)
    * [output](output.md)

# Discovery

By creating a link from your human-readable page to your microforms

```html
<link rel="alternate" href="/api" type="application/microforms+json">
```

You enable **aggregators** to learn about a machine-readable alternative version of your human-readable page.

# Documentation

Microforms are designed to be self-documented without requiring clients to access any out-of-band information.

What that means is that each microform carries enough human-readable and machine-readable information to enable programmers and machines to make the decisions on how things should be filled to execute a call.

The primary mechanism to make your APIs self-documented is to associate [&lt;label&gt;](label.md) with your [&lt;form&gt;](form.md) and [&lt;input&gt;](input.md) elements.

```xml
{
  "type": "Issues",
  "description": "The list of issues we are tracking",

  "<form name='create' action='/create' method='post'>": {
    "<label>": "Create new issues",
    "<label for='title'>": "The title of the issue",
    "<input name='title' required='true'>": {}
    "<label for='description'>": "The description of the issue",
    "<input name='description' required='true'>": {}
  }
}
```

With [&lt;label&gt;](label.md)s each and every one of your microforms can carry enough inline information to enable clients to make all of the decisions without accessing further information (e.g. off-band human-readable documentation). 

# Execution

Microforms enable you to programatically execute them with confidence. With microforms, you can:

* programatically [autocomplete](#autocomplete) input.
* programatically [validate](#validation) user input.
* programatically [submit](#submit) the call.
* programatically [manage keys](#key-management).
* programatically [manage quotas](#quota-management).

## Autocomplete

The [input](input.md) autocomplete field enables clients of microforms to programatically autofill fields in the API requests with contextual data (e.g. personalized data or natural language processing interfaces).

## Validation

Microforms validation helps ensure that users or machines fill out the API calls in the correct format, making sure that submitted data will work successfully on the server. 

Microforms borrows as much as possible the validation rules from HTML.

Clients validate:

* the presence of ```required``` inputs
* the matching of ```pattern``` attributes
* the ```minlength``` and ```maxlength``` of text inputs
* the ```step```, ```min``` and ```max``` values of numeric inputs
* the pattern matching of ```email``` inputs

## Submission

Microforms submission works like HTML form submissions:

* The ```action``` attribute defines the URL containing the server-side script that handles the form data.
* The ```method``` attribute defines the HTTP method to be used (e.g. GET or POST).
* The ```enctype``` attribute defines how the form data should be encoded.

If the data passes the [validation rules](#validation), the data is encoded according to the ```enctype``` attribute and a HTTP request is constructed based on the ```action``` endpoint and the desired HTTP ```method``` to be used.

## Key management

In microforms, as opposed to traditional APIs, the client self-generates an API key without prior / offband negotiation with the server (e.g. signing-up and getting manually a API developer key).

The server is responsible for taking that key and applying its own business decisions (e.g. to manage the callers [quota](#quota-management)).

Clients identify themselves using ```Bearer tokens``` set in the ```Authorization``` header of every microforms request. For example:

```
Authorization: Bearer AbCdEf123456
```

The```Bearer token``` sent by the client identifies an ```issuer``` (e.g. ```gmail@system.gserviceaccount.com```) which the server can use to apply its own judgement.

If the token doesn't verify, the service should respond to the request with an HTTP response code ```401 (Unauthorized)```.

Bearer Tokens are part of the OAuth V2 standard.

## Quota management

Microforms also defines dedicated HTTP headers to enable the server to tell clients when to expect their quotas to expire.

| Header        | Description           |
| :--------------- |:---------------|
| ```X-RateLimit-Limit``` | The maximum number of requests you're permitted to make per hour. |
| ```X-RateLimit-Remaining```  | The number of requests remaining in the current rate limit window. |
| ```X-RateLimit-Reset``` | The time at which the current rate limit window resets in UTC epoch seconds. |

For example:

```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1372700873
```


# Backwards compatibility

Microforms is strictly backwards compatible with JSON: every JSON response is a microform response.

When a microforms client requests a microform, its sets optionally ```application/json``` as an interpretable type:

```http
GET /ordinary-json-document.json HTTP/1.1
Host: example.com
Accept: application/microforms+json,application/json,*/*;q=0.1
```

That enables the server to pick and choose which mime types to generate (e.g. ```application/microforms+json``` or ```application/json```) and, if it is easier, generate a microform response with ```applicaton/json``` and a reference to the microform document.

```http
HTTP/1.1 200 OK
...
Content-Type: application/json
Link: </ordinary-json-document.microform>; 
    rel="import"; 
    type="application/microforms+json"

{
  "type": "Issues",
  "url": "https://github.com/samuelgoto/microforms/issues",
  "description": "The list of issues we are tracking"
}
```

Microforms clients resolve the link to fetch the microform (caching it across multiple requests, as specified by HTTP headers).

```xml
{
  "<form name='create' action='/create' method='post'>": {
    "<label>": "Create new issues",
    "<label for='title'>": "The title of the issue",
    "<input name='title' required='true'>": {}
    "<label for='description'>": "The description of the issue",
    "<input name='description' required='true'>": {}
  }
}
```

Doing so, allows your API to gather the benefits of microforms without requiring developers to drastically change their documents and provides an incremental upgrade path for existing infrastructure without breaking existing clients that rely on your current API.

# Extensibility

It is critical that microforms can be extended by users without having to be recompiled / redesigned / reformulated. Specifically, it is critical that new affordances can be created without any permission required.

Being a XML-based formulation, microforms borrows the XML namespace mechanism to provide the same extensibility model. You can use the reserved ```xmlns``` attribute or the ```xmlns:prefix``` attribute to allow declaration of nodes in an external namespace.

```xml
{
  "@context": "https://schema.org/",
  "@type": "Restaurant",
  "name": "Sam's restaurant",
  "<form action='reservations.php' method='post'>": {
    "xmlns": "http://example.com/",
    "<contact name='Sam' email='foobar@hello.com'>": {},
    "<terms>": "By using this api you agree to our terms of service."
  }
}
```

# Related Work

Microforms is a hypermedia API media type, so it is directly related to the following approaches:

* Hydra
* Siren
* HAL
* Swagger

An overview of each is compiled [here](http://blog.sgo.to/2014/03/rows-and-idls.html).

Microforms offers a novel approach in the following dimensions:

* [Notation](json.md##alternatives-considered)
* Re-use of HTML
* Crawler-oriented

TODO(goto): go over each of these.