class WordpressRepository {
  constructor(url) {
    this.url = url;
  }

  async getPosts() {
    const response = await fetch(this.url);
    return response.json();
  }
}

class WordpressPostsUseCase {
  async getPosts(limit) {
    let repo = new WordpressRepository("https://ms-engineer.jp/contents/wp-json/wp/v2/posts");
    return repo.getPosts()
      .then( json => {
        // ソート
        return json;
      })
      .then( json => {
        // フィルター
        return json;
      });
    }
}

function drawPosts(posts) {
  console.log(posts);

  const blog = document.querySelector("#blog");
  for(const post of posts) {
    const title = post["title"]["rendered"];
    const p = document.createElement("p");
    p.textContent = title;
    blog.appendChild(p);
  }
}

function drawWordpressPosts() {
  let useCase = new WordpressPostsUseCase();
  useCase.getPosts()
    .then( json => {
      drawPosts(json);
    })
}