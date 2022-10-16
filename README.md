# be-transformative

*be-transformative* is a custom element / DOM decorator that allows for css-like transformations to be performed on demand.

[![Playwright Tests](https://github.com/bahrus/be-transformative/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-transformative/actions/workflows/CI.yml)

<a href="https://nodei.co/npm/be-transformative/"><img src="https://nodei.co/npm/be-transformative.png"></a>

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-transformative?style=for-the-badge)](https://bundlephobia.com/result?p=be-transformative)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-transformative?compression=gzip">

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
    },
    "myProp:onSet":{
        "transform":{
            ...
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

## Viewing Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-exportable/be-transformative.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-transformative';
</script>
```

