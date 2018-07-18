```xml
<doc>
  {
    <!-- domain-specific data -->
    "type": "Issues",
    "url": "https://github.com/samuelgoto/microforms/issues",
    "description": "The list of issues we are tracking"

    <!-- general purpose hypermedia affordances -->
    <link rel="self" href="/api" />
    <form action="/create" method="POST">
      <input name="title" />
      <input name="description" />
    </form>
  }
</doc>
```

```xml
<doc>
  {
    "type": "Issues",
    "description": "The list of issues we are tracking"

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
  }
</doc>
```
