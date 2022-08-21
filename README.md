# A basic Vue file tree view 

Inspired of [json-tree-view-vue3](https://github.com/seijikohara/json-tree-view-vue3) and a [quick rewrite](https://github.com/audiBookning/json-tree-view-vue3) i did of it.

There is no "UI effort" here, so don't expext anything usable. It was created to try to learn about Vue and for a very specific case: visualizing a certain type of AST' like object structure.

I added a central store, because the original library wasn't really prepared to deal with "big objects". Note that i used [pinia](https://github.com/vuejs/pinia). I am not knowledgeable about Vue, but if this was to be a library, then using composable functions migh be preferable. In the spirit that having more dependencies is prone to welcoming weird bugs.

There is no intention in turning this in a maintained project. Anyone is welcome to copy or fork it to do whatever they want. Just remember to aknowledge the original author of json-tree-view-vue3.

## Changes

I changed many things, so there should be little comparison (unless it is the internal code).

This repo is a vue project with an included example of the changes. So it will be easy to check how to use it.

## Todo

- Really needs cleanup. A lot of it.

- Also needs everything else.

