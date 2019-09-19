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

### Functions

We make use of [__JSDoc__](https://github.com/jsdoc/jsdoc), an API
documentation generator for JavaScript.  It follows a style very
similar to that used by Javadoc.  JSDoc provides a uniform,
standard, and unambiguous way for us to document our functions,
thereby reducing the amount of time required for documenting and
the time required for reading said documentation.  Additionally,
using __JSDOC__ allows us to quickly generate nice looking API
documentation.

Functions must have the authors, a description, inputs, and output specified.
Here is an example function declaration:

```javascript
/**
 * Returns a tag that represents a clickable
 * bookmark to be included in a folder dropdown.
 *
 * @author Brady McGrath
 *
 * @param {string} bookmarkId    - the numeric ID of the bookmark
 *     node as a string.
 * @param {string} bookmarkTitle - the bookmark's title.
 * @return {Object} a bookmark HTML element.
 *
 */
function createBookmark(bookmarkId, bookmarkTitle)
```
### Files

Include the filename, a description of the files purpose, and any exports.
Here is an example file header:

```javascript
/*
 * file        : utils.mjs
 * description : This file is a JavaScript module intended to
 *               contain utility functions.
 * exports     : [ createTag/1
 *               , createDropdown/1
 *               , createFolder/2
 *               , addBookmarkContent/0
 *               , validateForm/0
 *               ]
 */
/**
 * @file This file is a JavaScript module intended to
 *     contain utility functions.
 *
 * @module utils
 * 
 */
```

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

Additionally, we always use a space following an if declaration and braces
are used no matter what for `if`, `else if`, and `else` blocks.  For example:

```javascript
if (booleanCondition) {
    ...
}
else if (otherBooleanCondition) {
    ...
}
else {
    ...
}
```

### Return Statements

Always include a line break before your return statements, unless you have
a function that consists soley of a return statement.  Example:

```javascript
function funkyFreshFunction(...) {
    let someVar;
    if (booleanCondition) {
        ...
    }

    return someVar;
}
```

### Loops

Just like how you must use spaces and braces with conditional statements,
you must do the same with loops and iteration constructs.  Example:

```javascript
for (let i = 0; i < 10; i++) {
    ...
}
```

```javascript
while (someCondition) {
    ...
}
```

### Creating Variables

There is no reason for you to ever delare a variable with the `var` keyword.
When declaring and defining variables, always use `let` and `const`—prefer
`const` to `let`.  There is absolutely no reason for you to not declare and
define variables with `const` if you never re-assign them.  The reason we
use `let` instead of `var` is because of JavaScript's scoping rules.  Read
up on the differences between `let` and `var`, as well as __hoisting__.

Always declare your variables at the top of the function, unless of course
you're creating a temporary variable within a for loop; that is:

```javascript
for (let i = 0; i < 10; i++) {
    ...
}
```

You must also properly align all of your variable assignments.  Example:

```javascript
// Do this; this makes everything very
// easy to read.
let flag                     = ...;
let reallyBigValue           = ...;
let someKindOfPhatDictionary = { ... };
...
```

```javascript
// Do NOT do this; this is ugly and
// makes reading it more difficult
// than it needs to be.
let flag = ...;
let reallyBigValue = ...;
let someKindOfPhatDictionary = { ... };
...
```

Another very important practice that you __must__ adhere to is __not__ creating
global variables.  You are very unlikely to run into situations where you actually
need to resort to using global variables, so unless you there is absolutely no other
way to accomplish what it is you're coding, don't resort to using globals.

Instead of using globals, use functions and, as mentioned above, declare all
of the variables in the function, and else where, using `let` and `const`.  If you
find yourself using global variables, then there's a good chance you need to seriously
rethink your design.  __Closures__ provide a very nice mechanism for encapsulating state
and keeping it from "leaking" outside and being overwritten and/or accessed by sections
of code that shouldn't be coming anywhere near it.
