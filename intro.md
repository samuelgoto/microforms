Microforms is a media type for hypermedia APIs.

Microforms is designed to make exposing REST APIs programatically **discoverable**, **explorable** and **executable** by **aggregators** (e.g. crawlers). 

The top level microform document enables you to intermingle data (e.g. JSON) with hyperdata (e.g. control structures).

```json
{
  "type": "Issues",
  "description": "The list of issues we are tracking",

  "<form name='create' action='/create'>": {
    "<input name='title'>": {},
    "<input name='description'>": {}
  }
}
```

As a **media type**, microforms defines a serialization (e.g. [JSON](json.md) and [XML](xml.md)) as well as a set of built-in elements that enables modelling your API entrypoints in terms of familiar concepts borrowed from HTML (e.g. the [XML-like notation](json.md)).

From a JSON [notation](json.md) perspective, **hyperdata** nodes are distinguishable (visually and programatically) from **data** nodes using a convention of surrounding their names with XML-like ```<>```s. You can also set **attributes** of hyperdata nodes inside the key or in their body.

There are built-in **hyperdata** element types to help you express your hypertext transitions:

* [link](link.md)
* [form](form.md)
    * [input](input.md)
    * [fieldset](fieldset.md)
    * [label](label.md)

The built-in elements - combined with a set of **processing rules**, **validation rules** and **execution rules** - enables aggregators to programatically **explore** your APIs. For example, with microforms, aggregators can:

* programatically **[discover](#discovery)** your API
* programatically create human-readable **[documentation](#documentation)** for you API
* programatically **[validate](#validation-rules)** user input
* programatically **[execute](#execution-rules)** API calls

Lets go over how each of these capabilities work.

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

```json
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

# Validation rules

Microforms validation helps ensure that users or machines fill out the API calls in the correct format, making sure that submitted data will work successfully on the server. 

Microforms borrows as much as possible the validation rules from HTML.

Clients validate:

* the presence of ```required``` inputs
* the matching of ```pattern``` attributes
* the ```minlength``` and ```maxlength``` of text inputs
* the ```step```, ```min``` and ```max``` values of numeric inputs
* the pattern matching of ```email``` inputs

# Execution rules

Microforms submission works like HTML form submissions:

* The ```action``` attribute defines the URL containing the server-side script that handles the form data.
* The ```method``` attribute defines the HTTP method to be used (e.g. GET or POST).
* The ```enctype``` attribute defines how the form data should be encoded.

If the data passes the [validation rules](#validation-rules), the data is encoded according to the ```enctype``` attribute and a HTTP request is constructed based on the ```action``` endpoint and the desired HTTP ```method``` to be used.

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

Ordinary APIs (e.g. JSON) can be interpreted as microforms by referencing a microforms document in a HTTP Link Response Header.

```
Link: </ordinary-json-document.microform>; 
    rel="http://microforms.org/"; 
    type="application/microforms+xml"
```

Doing so, allows your API to gather the benefits of microforms without requiring developers to drastically change their documents and provides an incremental upgrade path for existing infrastructure without breaking existing clients that rely on your current API.

A microforms client can request a microform through the ```Accept``` header.

```
GET /ordinary-json-document.json HTTP/1.1
Host: example.com
Accept: application/microforms+xml,application/json,*/*;q=0.1
```

The server can pick and choose which mime types to generate (e.g. ```application/microforms+xml``` or ```application/json```) and if it is easier, generate a microform response with ```applicaton/json``` and a reference to the microform document.

```
HTTP/1.1 200 OK
...
Content-Type: application/json
Link: </ordinary-json-document.microform>; 
    rel="http://microforms.org/"; 
    type="application/microforms+xml"

{
  "type": "Issues",
  "url": "https://github.com/samuelgoto/microforms/issues",
  "description": "The list of issues we are tracking"
}
```

Microforms clients resolve the link to fetch the microform (caching it across multiple requests, as specified by HTTP headers).

```xml
<!-- The machine-readable control data gives clients the 
  -- information on how to execute the call -->
<form name="create" action="/create" method="post">

  <!-- The human-readable labels gives programmers the
    -- information they need to know what each field means -->
  <label>Create new issues</label>

  <!-- Individual fields can be annotated too -->
  <label for="title">The title of the issue</label>
  <input id="title" name="title" required="true" />

  <label for="description">The description of the issue</label>
  <input id="description" name="description" required="true" />
</form>
```

# Extensibility

TODO(goto): go over extensibility.

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