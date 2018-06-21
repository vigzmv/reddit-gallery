const REDDIT_BASE_URL = 'https://www.reddit.com';

const getUrlWithQueries = (
  { subreddit, searchTag, timePeriod, after },
  manyUrls = false,
) => {
  // if search terms is given, do a search, else give top
  const searchType = searchTag ? `search` : `top`;

  const url = new URL(`${REDDIT_BASE_URL}/r/${subreddit}/${searchType}.json`);
  const searchParams = {
    sort: 'top',
    restrict_sr: 'on',
    type: 'image',
    limit: manyUrls ? '15' : '25',
    t: timePeriod,
  };

  if (after) {
    searchParams.after = after;
  }

  if (searchTag) {
    searchParams.q = searchTag;
  }

  url.search = new URLSearchParams(searchParams);

  return url;
};

const redditSearch = (searchParams, after) => {
  const subreddits = searchParams.subreddit.split(',');
  const manyUrls = subreddits.length > 1;

  const urls = subreddits.map((subreddit, i) =>
    getUrlWithQueries(
      {
        after: after && after[i],
        subreddit: subreddit.trim(),
        searchTag: searchParams.searchTag,
        timePeriod: searchParams.timePeriod,
      },
      manyUrls,
    ),
  );

  const requests = urls.map(url =>
    fetch(url)
      .then(res => res.json())
      .then(({ data }) => ({
        after: (data && data.after) || false,
        posts:
          (data &&
            data.children &&
            data.children.map(({ data }) => ({
              title: data.title,
              image: data.thumbnail,
              link: data.permalink,
            }))) ||
          [],
      }))
      .catch(err => console.log(err)),
  );

  return Promise.all(requests).then(res =>
    res.reduce(
      (result, item) => {
        if (item) {
          result.after.push(item.after);
          item.posts.forEach(post => result.posts.push(post));
        }

        return result;
      },
      { posts: [], after: [] },
    ),
  );
};

export default redditSearch;
