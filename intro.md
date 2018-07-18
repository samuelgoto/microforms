Microforms is a media type for hypermedia APIs. You can read more about its design goals [here](design.md).

Microforms is a set of conventions for:

* Notation
* Affordances
* Processing rules
* Validation rules
* Execution rules

Within the execution rules, there are rules defined for:

* Serialization
* Key management
* Quota management
* Billing

# Notation

## Affordances

Microforms comes with built-in hypermedia affordances to enable the programatic execution of API calls.

By design, we start by re-using as many existing hypertext affordances from the well established HTML set. We extend new attributes and elements when necessary and remove attributes whenever they are not applicable to machine-readable clients.

Here is the set of elements available in microforms:

* [doc](doc.md)
* [link](link.md)
* [label](label.md)
* [form](form.md)
    * [input](input.md)
    * [fieldset](fieldset.md)

# Discovery

TODO(goto): go over discovery.

```html
<link rel="alternate" href="/api" type="application/microforms+xml">
```

# Documentation

Microforms are designed to be self-documented without requiring clients to access any out-of-band information.

What that means is that each [&lt;doc&gt;](doc.md) in microforms carries enough human-readable and machine-readable information to enable programmers and machines to make the decisions on how things should be filled to execute a call.

The primary mechanism to make your APIs self-documented is to associate [&lt;label&gt;](label.md) with your [&lt;form&gt;](form.md) and [&lt;input&gt;](input.md) elements.

```xml
<doc>
  {
    "kind": "Issues",
    "description": "The list of issues we are tracking"

    <!-- The machine-readable control data gives clients the 
      -- information on how to execute the call -->
    <form action="/create" method="post">

      <!-- The human-readable labels gives programmers the
        -- information they need to know what each field means -->
      <label>Create new issues</label>

      <!-- Individual fields can be annotated too -->
      <label for="title">The title of the issue</label>
      <input id="title" name="title" required="true" />

      <label for="description">The description of the issue</label>
      <input id="description" name="description" required="true" />
    </form>
  }
</doc>
```

With [&lt;label&gt;](label.md)s each and every one of your [&lt;doc&gt;](doc.md) can carry enough inline information to enable clients to make all of the decisions without accessing further information (e.g. off-band human-readable documentation). 

# Processing rules

# Validation rules

TODO(goto): go over validation

# Execution rules

## Key management

TODO(goto): go over bearer tokens

* Bearer tokens: for key management

## Quota management

TODO(goto): go over quota management

* Throttling: for quota management

* Accepts-Vocab: for vocabulary negotiation

