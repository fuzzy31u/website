class WordpressRepository {
  constructor(url) {
    this.url = url;
  }

  async getPosts() {
    const endPoint = this.url + '/contents/wp-json/wp/v2/posts?_embed';
    return fetch(endPoint)
      .then( response => {
        return response.json();
      });
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

  async getFilteredPosts(limit) {
    return this.getPosts()
      .then( posts => {
        // 取得した記事を新しい順に並べる
        return this.sort(posts);
      })
      .then( posts => {
        // 先頭から limit個 の記事だけにする
        return this.filter(posts, limit);
      })
  }

  sort(post) {
    return post.sort( (lhs, rhs) => {
      const lhsDate = Date.parse(lhs.date);
      const rhsDate = Date.parse(rhs.date)

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
      return './images/img-ms-engineer-post-thubmanil.png';
    }

    return featuredMedia[0]['source_url'];
  }

  get link() {
    return this.post['link'];
  }

  get beginning() {
    // HTMLタグを削除する
    const beginningHtml = this.post['excerpt']['rendered'];
    const beginning = beginningHtml.replace(/(<([^>]+)>)/gi, '');

    // 文末に...を追加
    return beginning.replace(/ \[\&hellip\;\]/, '...');
  }

  get date() {
    return this.post['date'];
  }
}