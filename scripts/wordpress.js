class WordpressRepository {
  constructor(url) {
    this.url = url;
  }

  async getPosts() {
    const endPoint = this.url + '/contents/wp-json/wp/v2/posts?_embed';
    const response = await fetch(endPoint);
    return response.json();
  }

  async getImage(id) {
    const endPoint = this.url + '/contents/wp-json/wp/v2/media/' + id;
    const response = await fetch(endPoint);
    return response.json();
  }
}

class WordpressPostsUseCase {
  get host() {
    return 'https://ms-engineer.jp';
  }

  async getPosts() {
    let repo = new WordpressRepository(this.host);
    return repo.getPosts()
      .then( posts => {
        return posts.map(post => new WordpressPost(post));
      });
  }

  async getFilterdPosts(limit) {
    return this.getPosts()
      .then( posts => {
        return this.sort(posts);
      })
      .then( posts => {
        return this.filter(posts, limit);
      })
  }

  sort(post) {
    return post.sort( (lhs, rhs) => {
      const lhsDate = Date.parse(lhs.modified);
      const rhsDate = Date.parse(rhs.modified)

      if(lhsDate > rhsDate) {
        return -1;
      } else if(lhsDate < rhsDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  filter(posts, limit) {
    if(posts.length <= limit) {
      return {
        posts: posts,
        hasMore: false
      };
    }

    return {
      posts: posts.slice(0, limit),
      hasMore: true
    }
  }
}

class WordpressPost {
  constructor(post) {
    this.post = post;
  }

  get title() {
    return this.post["title"]["rendered"];
  }

  get thumbnailUrl() {
    const featuredMedia = this.post['_embedded']['wp:featuredmedia'];
    if(featuredMedia == null || featuredMedia[0] == null) {
      // データがない場合は空文字を返す
      // return '';
      return 'https://ms-engineer.jp/contents/wp-content/uploads/2021/08/story_header_image.png';
    }

    return featuredMedia[0]['source_url'];
  }

  get link() {
    return this.post['link'];
  }

  get beginning() {
    const beginningHtml = this.post['excerpt']['rendered'];
    const beginning = beginningHtml.replace(/(<([^>]+)>)/gi, '');
    return beginning.replace(/ \[\&hellip\;\]/, '...');
  }

  get modified() {
    return this.post['modified'];
  }
}