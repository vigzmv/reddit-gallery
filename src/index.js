import redditSearch from './services/reddit';
import { isUrl } from './utils';

const FIVE_MINUTES = 5 * 60 * 1000;

const feed = document.querySelector('.feed');
const searchPanel = document.querySelector('search-panel');

let redditResponse;
let searchParams;
let fetchingResults = false;

const setPosts = posts => {
  posts.forEach(({ title, image, link }) => {
    if (isUrl(image)) {
      const feedItem = document.createElement('feed-item');

      feedItem.title = title;
      feedItem.image = image;
      feedItem.link = `https://www.reddit.com${link}`;
      feed.appendChild(feedItem);
    }
  });
};

const setLocalCache = (key, value) => {
  localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
  localStorage.setItem(`${JSON.stringify(key)}-timestamp`, Date.now());
};

const clearLocalCache = key => {
  localStorage.removeItem(JSON.stringify(key));
  localStorage.removeItem(`${JSON.stringify(key)}-timestamp`);
};

const fetchPosts = async () => {
  const cachedResponse = localStorage.getItem(JSON.stringify(searchParams));

  if (cachedResponse) {
    const timestamp = JSON.parse(
      localStorage.getItem(`${JSON.stringify(searchParams)}-timestamp`),
    );

    if (new Date(timestamp + FIVE_MINUTES) > new Date()) {
      redditResponse = JSON.parse(cachedResponse);
    } else {
      clearLocalCache();

      redditResponse = await redditSearch(searchParams);
      setLocalCache(searchParams, redditResponse);
    }
  } else {
    redditResponse = await redditSearch(searchParams);
    setLocalCache(searchParams, redditResponse);
  }
};

const fetchMorePosts = async () => {
  Pace.restart();
  fetchingResults = true;
  redditResponse = await redditSearch(searchParams, redditResponse.after);
  setPosts(redditResponse.posts);
  fetchingResults = false;
};

searchPanel.addEventListener('search', async e => {
  Pace.restart();
  searchParams = e.detail;
  await fetchPosts();
  feed.innerHTML = '';
  setPosts(redditResponse.posts);
});

window.addEventListener('scroll', async () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    !fetchingResults
  ) {
    await fetchMorePosts();
  }
});
