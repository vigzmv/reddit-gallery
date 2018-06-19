const REDDIT_BASE_URL = 'https://www.reddit.com';

const redditSearch = ({ subreddit, searchTag, timePeriod }) => {
  const url = new URL(`${REDDIT_BASE_URL}/r/${subreddit}/${searchTag ? `search` : `top`}.json`);
  const queryParams = {
    sort: 'top',
    restrict_sr: 'on',
    type: 'image',
    limit: '20',
    q: searchTag,
    t: timePeriod,
  };
  url.search = new URLSearchParams(queryParams);

  return fetch(url).then(res => res.json());
};

export default redditSearch;
