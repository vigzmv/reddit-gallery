import redditSearch from './services/reddit';

const searchPanel = document.querySelector('search-panel');
const feed = document.querySelector('.feed');

let redditResponse;
let searchParams;
let fetchingResults = false;

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
  Pace.restart();
  searchParams = e.detail;
  redditResponse = await redditSearch(searchParams);
  feed.innerHTML = '';
  setPosts(redditResponse.posts);
});

window.addEventListener('scroll', async function() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    !fetchingResults
  ) {
    fetchingResults = true;
    Pace.restart();
    redditResponse = await redditSearch(searchParams, redditResponse.after);
    setPosts(redditResponse.posts);
    fetchingResults = false;
  }
});
