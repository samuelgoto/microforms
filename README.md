---
permalink: /index.html
---

# Microforms

microforms is a data file type (```application/microforms```) designed to build restful APIs.

The form serves the function of intermingling data (text) and control (hypertext). That enables clients to make decisions (e.g. delete a resource) without using out-of-band information (e.g. human readable documentation).

Here is an example:

```javascript
{
  // comments are allowed!
  type: "Blog",
  blogPost: [{
    type: "BlogPosting",
    id: 1,
    title: "hello world",
    // here is the first time an anchor tag appears
    get: a { href: "/posts/1"}
  }, {
    type: "BlogPosting",
    id: 2,
    title: "foo bar",
    // here is a second anchor tag
    get: a { href: "/posts/2"}
  }],
  // here is how forms are represented
  create: form {
    // there are hypertext controls to manipulate the request
    method: "POST",
    action: "/create",
    // as well as the ability to describe inputs.
    input { name: "title", type: "text", required: true }
    input { name: "content", type: "text", required: true }
    input { name: "author", type: "text", required: true }
  }
}
```

And here is how a client (in this specific example, a javascript client) would interact:

```javascript
// No out-of-band information needed to construct a request to create a post.
// Everything is embedded into the message.
// The client knowns how to follow links (a) and submit forms (form).
let post = await fetch("/blog.micro").then(posts => posts.create({
  title: "hello",
  content: "world",
  author: "goto@google.com"
}));
```

Which returns:

```javascript
{
  type: "BlogPosting",
  id: 4,
  title: "hello",
  content: "world",
  author: "goto@google.com",
  delete: form {
    action: "/posts/4"
    method: "DELETE",
  },
  update: form {
    method: "POST",
    input { name: "content", type: "text", required: true }
  }
}
```

With the magic of HATEOAS, submitting a microform gets you another microform,
with new exciting data and affordances!

```javascript
// For example, say you disliked it, you can update it ...
post.update({
  content: "Actually, nevermind."
});

// ... or delete it ...
post.delete();
// ...
```

Microforms isn't opinionated about JSON conventions nor schemas / ontologies, but here is an example of what it could look like if you are into JSON-LD and schema.org.

```javascript
{
  @context: "http://schema.org",
  @type: "Blog",
  @id: "/",
  title: "Sam's blog",
  blogPost: [{
    @type: "BlogPosting",
    title: "Welcome",
    content: "This is my first post!"
  }],
  add: form {
    input { name: "title", required: true }
    input { name: "content", required: true }
  }
}
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
* validation

A lot of control structures are also available outside of the context of the file format, which gives clients of microforms more instructions on how to proceed. These are:

* Accepts-Vocab: for vocabulary negotiation
* Bearer tokens: for key management
* Throttling: for quota management

# Extension mechanism

We are still exploring some options, but it is clear that we need to support some sort of extension mechanism. Something along the lines of:

```javascript
{
  namespace { id: "oauth", url: "http://oauth.org" }
  type: "Error",
  messsage: "Oops, you have to be signed-in to access this resource",
  retry: [oauth:signin] {
    [oauth:authorization]: "http://example.com",
    [oauth:scopes]: {
      "write.calendar": "modify your calendar events",
      "write.calendar": "access your calendar events",
    }
  }
}
```

# Grammar

TODO(goto): write this down. Looks something like JSON + {} nodes + comments.

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

# Acknowledgements

* TODO(goto): fill this up

