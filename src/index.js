import redditSearch from './services/reddit';

const searchPanel = document.querySelector('search-panel');

searchPanel.addEventListener('search', async e => {
  const posts = await redditSearch(e.detail);
  const feed = document.querySelector('.feed');
  feed.innerHTML = '';

  posts.forEach(({ title, image, link }) => {
    const feedItem = document.createElement('feed-item');
    feedItem.title = title;
    feedItem.image = image;
    feedItem.link = `https://www.reddit.com${link}`;
    feed.appendChild(feedItem);
  });
});
