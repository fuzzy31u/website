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

  async getPosts(limit) {
    let repo = new WordpressRepository(this.host);
    return repo.getPosts()
      .then( arr => {
        // ソート
        return arr;
      })
      .then( arr => {
        // フィルター
        return arr;
      })
      .then( arr => {
        return arr.map(post => new WordpressPost(post));
      });
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
}