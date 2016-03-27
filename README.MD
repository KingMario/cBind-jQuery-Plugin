# Collect & Bind jQuery Plugin

## Goal

In China, there are still a great many users using Microsoft Internet Explorer below version 9. For a B2C Internet company, a good time to abandon them in the market is not coming yet.

To get prepared for / get familiar with using MVVM frameworks such as AngularJS and Vue.js, the one-way Collect & Bind jQuery plugin is developed. The goal of this plugin is to provide the modal-to-view data binding for Microsoft Internet Explorer down to version 6. It will bind contents, styles, classes, titles, SRC's, etc. to DOM elements. It also support the dynamic element creation for loop data binding of arrays. Simple effects such as contents showing/hiding on click, mouseover, mouseleave events and popup will be easy to implement.

By using this plugin, the habit of seperation of views and modals should be developed. When Microsoft Internet Explorer of versions 8 and below are finally removed from the support list, the front-end developers will be ready and happy to trun to MVVM frameworks such as AngularJS and Vue.js.

## Usage

Write HTML elements with costomized HTML attributes to indicate that the elements are to be collected and associated with the data modal properties during the initilization of the cBind plugin.

For example:

```HTML
    <span __dat__="user.name"></span>
```

Then in JavaScript, use $.cBindSet method to set the data modal.

* Single property:
```JavaScript
$.cBindSet('user.name', 'Jack');
```

* Object:
```JavaScript
$.cBindSet({
    user: {
        name: 'Jack'
    }
});
```

Check [example.html](blob/master/example.html) and [people.js](blob/master/people.js) for more usage references.


## Customized HTML Attributes

Attribute | Similar AngularJS Directive(s) | Remarks
:--: | :-- | :--
`__dat__` | ng-bind, {{}} |
`__vis__` | ng-show |
`__cls__` | ng-class |
`__css__` | ng-style |
`__tit__` |  | Binding for title
`__src__` | ng-src |
`__for__` | ng-repeat |
`__set__` | ng-click, ng-mouseover, ng-mouseout, ... |
`__eid__` |  | extension of id, used in dynamic popup
`__pop__` |  | a simple popup


## Known Restricts and Issues



## License
MIT
