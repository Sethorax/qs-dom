# Quicksilver

[![Build Status](https://travis-ci.org/Sethorax/quicksilver.svg?branch=master)](https://travis-ci.org/Sethorax/quicksilver)
[![Coverage Status](https://coveralls.io/repos/github/Sethorax/quicksilver/badge.svg?branch=master)](https://coveralls.io/github/Sethorax/quicksilver?branch=master)
[![npm (scoped)](https://img.shields.io/npm/v/@sethorax/quicksilver.svg)](https://www.npmjs.com/package/@sethorax/quicksilver)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@sethorax/quicksilver.svg)](https://www.npmjs.com/package/@sethorax/quicksilver)
[![npm type definitions](https://img.shields.io/npm/types/@sethorax/quicksilver.svg)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![code style: prettier](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![GitHub](https://img.shields.io/github/license/sethorax/quicksilver.svg)](LICENSE.md) [![Greenkeeper badge](https://badges.greenkeeper.io/Sethorax/quicksilver.svg)](https://greenkeeper.io/)


Quicksilver is a lightweight, jQuery inspired JavaScript library for manipulating the DOM. The main goal of this library is to provide a lightweight, understandable and easy to use high level API for basic DOM manipulation.

## Usage

Quicksilver is available through [NPM](http://npmjs.com) as the [`@sethorax/quicksilver`](https://www.npmjs.com/package/@sethorax/quicksilver) package:

```sh
npm install @sethorax/quicksilver
```

Or via [yarn](https://yarnpkg.com):

```sh
yarn add @sethorax/quicksilver
```

Once installed Quicksilver can be used like any other node module. This module offers a default export so the name can be freely chosen. In this documentation the name `$$` is used.

```JS
import $$ from "@sethorax/quicksilver";
```

### $$()

To create a Quicksilver instance just call the selector method and pass it either a CSS selector string, a HTMLElement or an array of HTMLElements. It returns a Quicksilver instance which exposes the following methods and accessors.

You can also pass the `document` or `window` object to the selector method. Please note that not all methods work with these objects.

#### $$().$

Shortcut for `$$().get(0)`.

#### $$().length

Returns the amount of elements passed to the selector method or matched by the CSS selector.

#### $$().notEmpty

Returns `true` if at least one element was passed to the selector method or matched by the CSS selector.

#### $$().width

Returns the width of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.

#### $$().fullWidth

Returns the full width (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.

#### $$().height

Returns the height of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.

#### $$().fullHeight

Returns the full height (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.

#### $$().absolutePosition

Return the absolute offset of the first element in the instance. The returned object contains the offset values from the top and from the left.

#### $$().get(index = 0)

Returns the element at the specified index.

#### $$().getAll()

Returns all elements in the instance.

#### $$().getIndexInParent()

Returns the index the first element in the instance has within its parent element.

**Example**

```HTML
<ul>
    <li class="item-1">Item 1</li>
    <li class="item-2">Item 1</li>
    <li class="item-3">Item 1</li>
</ul>
```

If `$$(".item-2").getIndexInParent()` would be called on the example markup above, this method would return `1`.

#### $$().find(selector)

Queries all child elements of the first element in the instance for the given CSS selector. If a match was found the first matched element will be returned.

#### $$().findAll(selector)

Queries all child elements of the first element in the instance for the given CSS selector. If a match was found a new Quicksilver instance with the matched elements will be returned.

#### $$().forEach((element, index, total) => {})

Iterates over all elements in the instance and runs the given callback function for each element.

#### $$().map((element, index, total) => {})

Runs the given callback function for each element in the instance and returns an array of the callback return values.

#### $$().filter((element, index, total) => {})

Runs the given callback function for each element in the instance and returns an array of all elements where the callback function had a truthy return value.

#### $$().addClass(...classNames)

Adds the passed class names to the first element in the instance.

#### $$().removeClass(...classNames)

Removes the passed class names from the first element in the instance.

#### $$().hasClass(classNames)

Returns `true` if the first element in the instance has the passed CSS class. 

#### $$().remove()

Removes the first element in the instace from the DOM.

#### $$().insertAfter(element)

Inserts the first element in the instance after the passed element.

#### $$().insertBefore(element)

Inserts the first element in the instance before the passed element.

#### $$().append(element)

Append the first element in the instance to the passed element.

#### $$().prepend(element)

Prepend the first element in the instance to the passed element.

#### $$().on(eventNames, callback)

Attaches event listeners for the passed events to all elements in the instance. The callback function is called if one of the events gets triggered.

#### $$().onChildEventMatch(eventNames, elementOrSelector, callback)

Works similar to `$$().on` but with the difference that the event path is checked if the passed child element or selector was matched by the event. If a match is found the callback is called.  

**Example**

```JS
$$(document).onChildEventMatch("click", "a", () => console.log("Link clicked!"));
```

The above example matches all clicks on anchor elements. By binding the event listener to the document object, the callback gets called for dynamically added anchor elements as well.
This is useful if additional content was added via AJAX. 

#### $$().dispatchEvent(eventName, data?)

Dispatches a custom event with the passed name and data on the first element in the instance.


## Example

Even a basic tasks like querying DOM elements by a CSS class name and iterating over them can be a tedious process in vanilla JavaScript:

```JS
var elements = document.querySelectorAll(".css-selector");

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Do stuff with a single element.
}
```

The same tasks is much simpler and easier to read if using Quicksilver and it complies with ES6 syntax:

```JS
import $$ from "@sethorax/quicksilver";

$$(".css-selector").forEach(element => {
    // Do stuff with a single element.
});
```