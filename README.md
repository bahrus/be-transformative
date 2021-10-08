# be-transformative

*be-transformative* is a custom element / DOM decorator that allows for css-like transformations to be performed on demand.

The syntax the transformations are based on [declarative trans-render syntax](https://github.com/bahrus/trans-render).

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

<!--in contrast to be-transformed -- which uses capture, and transform is only inside that element.-->