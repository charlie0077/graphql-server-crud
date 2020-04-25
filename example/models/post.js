const { Base } = require('./base')

class Post extends Base {
  table = 'posts'
  fields = {
    id: 'Int',
    title: 'String',
    public: 'String',
    clicks: 'Int',
    score: 'Float',
    author: { type: 'Author', from: 'posts.author_id', to: 'authors.id' }
  }

  update (args, context) {
    console.log('Custom update logic for "Post" model here')
    super.update(args, context)
  }
}

module.exports = { Post: new Post() }
