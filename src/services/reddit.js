const REDDIT_BASE_URL = 'https://www.reddit.com';

const redditSearch = ({ subreddit, searchTag, timePeriod }) => {
  // if search terms is given, do a search, else give top
  const searchType = searchTag ? `search` : `top`;

  const url = new URL(`${REDDIT_BASE_URL}/r/${subreddit}/${searchType}.json`);
  const searchParams = {
    sort: 'top',
    restrict_sr: 'on',
    type: 'image',
    limit: '20',
    q: searchTag,
    t: timePeriod,
  };
  url.search = new URLSearchParams(searchParams);

  return fetch(url)
    .then(res => res.json())
    .then(res =>
      res.data.children.map(({ data }) => ({
        title: data.title,
        image: data.thumbnail,
        link: data.link,
      })),
    );
};

export default redditSearch;
