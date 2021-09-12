class PostItemThumbnail {
  static width = 280;
  static height = 144;
}

function drawWordpressPosts() {
  let useCase = new WordpressPostsUseCase();
  useCase.getFilteredPosts(3)
    .then( res => {
      drawPosts(res.posts, res.hasMore);
    })
    .catch( error => {
      console.log(error);
    })
}

function drawPosts(posts, hasMore) {
  if(posts.length === 0) {
    // 投稿がひとつもない場合には何もしない
    return;
  }

  const blog = document.querySelector("#blog");

  // タイトル
  const contentsCaptioin = createContentsCaption();
  blog.appendChild(contentsCaptioin);

  // Wordpress記事への導線
  const blogBlock = createBlogBlock();
  const postItems = createPostItems(posts)
  blogBlock.appendChild(postItems);
  blog.appendChild(blogBlock);
}

function createContentsCaption() {
  const div = document.createElement('div');
  div.setAttribute('class', 'contents-caption');

  const subCaption = document.createElement('p');
  subCaption.setAttribute('class', 'sub-caption');
  subCaption.textContent = 'BLOG';
  div.appendChild(subCaption);

  const mainCaption = document.createElement('h2');
  mainCaption.setAttribute('class', 'main-caption');
  mainCaption.textContent = 'Blog';
  div.appendChild(mainCaption);

  return div;
}

function createBlogBlock() {
  const div = document.createElement('div');
  div.setAttribute('class', 'blogs');

  const divRect = document.createElement('div');
  divRect.setAttribute('class', 'gradiention-rect');
  div.appendChild(divRect);

  return div;
}

function createPostItems(posts) {
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'horizontal-list');

  for(const post of posts) {
    const postItem = createPostItem(post);
    ul.appendChild(postItem);
  }

  const hasMore = true;
  if(hasMore) {
    const contentsLinkItem = createContentsLink();
    ul.appendChild(contentsLinkItem);
  }

  return ul;
}

function createPostItem(post) {
  const li = document.createElement('li');
  li.setAttribute('class', 'item');

  const a = document.createElement('a');
  a.setAttribute('class', 'item-link');
  a.href = post.link;
  li.appendChild(a);

  const image = document.createElement('img');
  image.setAttribute('class', 'width-fill-image');
  image.width = PostItemThumbnail.width;
  image.height = PostItemThumbnail.height;
  image.src = post.thumbnailUrl;
  a.appendChild(image);

  const texts = document.createElement('div'); 
  texts.setAttribute('class', 'item-texts');

  const caption = document.createElement('p');
  caption.setAttribute('class', 'item-caption');
  caption.textContent = post.title;
  texts.appendChild(caption);

  const text = document.createElement('p');
  text.setAttribute('class', 'item-text');
  text.textContent = post.beginning;
  texts.appendChild(text);

  a.appendChild(texts);

  return li;
}

function createContentsLink() {
  console.log('see more');

  const li = document.createElement('li');
  li.setAttribute('class', 'contents-link-item');

  const a = document.createElement('a');
  a.href = 'https://ms-engineer.jp/contents/';
  a.setAttribute('class', 'contents-link');

  const p = document.createElement('p');
  p.innerText = 'もっと見る'
  p.setAttribute('class', 'contents-link-title');
  a.appendChild(p);

  li.appendChild(a);

  return li;
}