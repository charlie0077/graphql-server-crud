const { Base } = require('./base')

class Post extends Base {
  table = 'posts'
  fields = {
    id: 'String',
    author_id: 'String',
    title: 'String',
    public: 'String',
    clicks: 'Int',
    score: 'Float',
    author: 'Author'
  }

  update (args, context) {
    console.log('Custom update logic for "Post" model here')
    super.update(args, context)
  }
}

module.exports = { Post }
