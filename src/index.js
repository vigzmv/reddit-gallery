import redditSearch from './services/reddit';

const searchPanel = document.querySelector('search-panel');

searchPanel.addEventListener('search', async e => {
  await redditSearch(e.detail);
});
