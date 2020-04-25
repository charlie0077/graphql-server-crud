# Model definition

Here is a typical model definition:

```js
class Post extends Base {
  table = 'posts'
  fields = {
    id: 'String',
    author_id: 'String',
    title: 'String',
    public: 'String',
    clicks: 'Int',
    score: 'Float',
    author: 'Author'    // there is some other model called "Author"
  }
```

### Why use string 'Int', 'Author'?
* There is indeed benefit from using Int, Author, such as typing and linting.
* The main reason of using string is to avoid circular dependencies: imagine you have a **Post** model that has **Author** field, and also a **Author** model that has **Post** field. It is not easy to get it work as expected. Nodejs is not handling circular dependency very well. You may want to refer to some info [here](https://stackoverflow.com/questions/10869276/how-to-deal-with-cyclic-dependencies-in-node-js).
* Don't worry about silent error: an error will be raised immediately if you do have a typo in the model name with detail debug info.
