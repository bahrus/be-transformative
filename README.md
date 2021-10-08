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

<!--in contrast to be-transformed -- which uses capture, and transform is only inside that element.-->