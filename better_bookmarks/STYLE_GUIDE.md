# JavaScript Coding Style Followed

We follow the rules as outlined by [W3C](https://www.w3schools.com/js/js_conventions.asp)(World Wide Web Consortium) except in the cases
detailed below.

We also follow the [__best practices__](https://www.w3schools.com/js/js_best_practices.asp) outlined by W3C.

## Where We Differ From W3C's JavaScript Style Guide

### Indentation

Instead of using the recommended 2 spaces of indentation,
we make use of __4 spaces__, because it tends to increase
readability by making indentation more obvious.

We __do not__ use _tabs_ since they are variable width, meaning that
they are interpreted differently by each editor.  Spaces are
interpreted exactly the same no matter the editor, or system, which
helps us to maintain consistency and ensure all of our code is
uniformly indented.

### Function Documentation

We make use of [__JSDoc__](https://github.com/jsdoc/jsdoc), an API
documentation generator for JavaScript.  It follows a style very
similar to that used by Javadoc.  JSDoc provides a uniform,
standard, and unambiguous way for us to document our functions,
thereby reducing the amount of time required for documenting and
the time required for reading said documentation.  Additionally,
using __JSDOC__ allows us to quickly generate nice looking API
documentation.

### Separating Blocks

We use line breaks to separate logical blocks of code.

### Conditionals

The __W3C__ style guide recommends formatting _if-else_ blocks in
the following way:

```javascript
...
if (booleanCondition) {
    ...
} else {
    ...
}
...
```
However, we use the following formatting with _if-else_ blocks:

```javascript
...
if (booleanCondition) {
    ...
}
else {
    ...
}
...
```
