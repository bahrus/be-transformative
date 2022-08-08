# be-transformative

*be-transformative* is a custom element / DOM decorator that allows for css-like transformations to be performed on demand.

<a href="https://nodei.co/npm/be-transformative/"><img src="https://nodei.co/npm/be-transformative.png"></a>

The syntax for the transformations are based on [declarative trans-render syntax](https://github.com/bahrus/trans-render).

Example:

```html
<button be-transformative='{
    "click":{
        "transform":{
            ":host": [{"treeView": false, "textView": true}],
            ".tree-view-selector":[{"style": {"display":"inline-block"}}],
            ".text-view-selector": [{"style": {"display":"none"}}]
        }
    }
}'></button>
```

One potential objection to the syntax shown above is that JSON is quite finicky about allowed syntax, giving the developer a potentially frustrating experience.

However, [a VSCode plugin](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) is available which provides syntax coloring and catches most JSON errors.

And the [may-it-be compiler](https://github.com/bahrus/may-it-be) allows us to use *.mjs/*.mts files as our editing canvas, and compile to syntax as shown above.

## Running a transform immediately.

This can be useful for hydrating

```html
<button be-transformative='{
    "":{
        "transform":{
            ":host": [{"treeView": false, "textView": true}],
            ".tree-view-selector":[{"style": {"display":"inline-block"}}],
            ".text-view-selector": [{"style": {"display":"none"}}]
        }
    }
}'></button>
```

<!--in contrast to be-transformed -- which uses capture, and transform is only inside that element.-->