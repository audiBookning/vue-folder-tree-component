# A basic Vue file tree view 

Inspired of [json-tree-view-vue3](https://github.com/seijikohara/json-tree-view-vue3) and a [quick rewrite](https://github.com/audiBookning/json-tree-view-vue3) i did of it.

There is no "UI effort" here, so don't expect anything usable (Note that the css is easy to manipulate). It was created to try to learn about Vue and for a very specific use case: visualizing a certain type of AST' "like" object structure (more similar here to a linked list).

There is no intention in turning this in a maintained project. Anyone is welcome to copy or fork it to do whatever they want. Just remember to aknowledge the original author of json-tree-view-vue3, if you can.

## Changes

I changed many things, so there should be little comparison (unless it is the internal code).

This repo is a vue project with an included example of how to use it (see `App.vue`). So it will be easy to check how to use it.

Added basic drag and drop. Could have used a 3º party lib for it and have much better features, but this case doesn't really justify it.

- Note that Vue (?) has some weird event bubbling behavior. Is it because of Vue or maybe because of the tree structure?

I added a central store, because the original library wasn't really prepared to deal with "big objects". Note that i used [pinia](https://github.com/vuejs/pinia). I am not knowledgeable about Vue, but if this was to be a library, then using composable functions migh be preferable. In the spirit that having more dependencies is prone to welcoming weird bugs.

- Another reason for not using Pinia stores in a library is that it cannot import a store by its id at runtime. So there will need to be a unconfortable coupling between the app and the 3 party library. One could add it with dynamic imports (?), that could give some intresting options (...), but that would also bring other concerns. See for example [get store by id](https://github.com/vuejs/pinia/discussions/753#discussioncomment-1553093)

- Or just use pinia internally as a local dependency (?) without care for anything else...
## Todo

- Needs everything, since "completed project" is absolutely not a correct label for this.

