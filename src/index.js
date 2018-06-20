import redditSearch from './services/reddit';

const searchPanel = document.querySelector('search-panel');
const feed = document.querySelector('.feed');

let response;
let searchParams;

const setPosts = posts => {
  posts.forEach(({ title, image, link }) => {
    const feedItem = document.createElement('feed-item');
    feedItem.title = title;
    feedItem.image = image;
    feedItem.link = `https://www.reddit.com${link}`;
    feed.appendChild(feedItem);
  });
};

searchPanel.addEventListener('search', async e => {
  searchParams = e.detail;
  response = await redditSearch(searchParams);
  feed.innerHTML = '';
  setPosts(response.posts);
});

window.onscroll = async function(ev) {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight + 16) {
    response = await redditSearch(searchParams, response.after);
    setPosts(response.posts);
  }
};
