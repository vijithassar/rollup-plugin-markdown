# Overview

This [Rollup](https://rollupjs.org/) plugin lets you extract your JavaScript code from code blocks embedded in [Markdown](https://daringfireball.net/projects/markdown/syntax) files, which in turn promotes good written documentation. This technique is called [literate programming](https://en.wikipedia.org/wiki/Literate_programming).

For a more detailed discussion about why you might want to do this, or to implement with other programming languages and other JavaScript build tools, please instead see [lit](https://github.com/vijithassar/lit), a shell script which provides the same functionality in a more agnostic fashion.

# Example

[GitHub Flavored Markdown](https://github.github.com/gfm/) represents code using [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/), which are demarcated with three backticks in a row:

```javascript
function greeting() {
    console.log('hello world');
}

export { greeting };
```

After you import and run this plugin in your `rollup.config.js` configuration file, the `greeting()` function above can be *imported directly from this Markdown document*! For example, you might use the following [ES6 module import statement](https://rollupjs.org/#importing):

`import { greeting } from './path/to/README.md';`

Sourcemaps will correctly point your debugging back to the original Markdown documents.