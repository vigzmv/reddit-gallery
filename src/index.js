import redditSearch from './services/reddit';

const searchPanel = document.querySelector('search-panel');

searchPanel.addEventListener('search', async e => {
  const posts = await redditSearch(e.detail);
  const feed = document.querySelector('.feed');
  feed.innerHTML = '';

  posts.forEach(({ title, image, permalink }) => {
    const feedItem = document.createElement('feed-item');
    feedItem.title = title;
    feedItem.image = image;
    feedItem.permalink = `https://www.reddit.com${permalink}`;
    feed.appendChild(feedItem);
  });
});
