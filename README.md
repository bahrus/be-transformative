# be-transformative [TODO]


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

in contrast to be-transformed -- which uses capture, and transform is only inside that element.