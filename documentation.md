Microforms are designed to be self-documented without requiring clients to access any out-of-band information.

What that means is that each [&lt;doc&gt;](doc.html) in microforms carries enough human-readable and machine-readable information to enable programmers and machines to make the decisions on how things should be filled to execute a call.

The primary mechanism to make your APIs self-documented is to associate [&lt;label&gt;](label.html) with your [&lt;form&gt;](form.html) and [&lt;input&gt;](input.html) elements.

```xml
<doc>
  {
    "kind": "Issues",
    "description": "The list of issues we are tracking"
  }
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
</doc>
```

With [&lt;label&gt;](label.html)s each and every one of your [&lt;doc&gt;](doc.html) can carry enough inline information to enable clients to make all of the decisions without accessing further information (e.g. off-band human-readable documentation). 