const fetch = require("node-fetch");

let TwitterApi;
let twitter;
let puppeteer;

const cache = {};

// import("puppeteer").then((_puppeteer) => (puppeteer = _puppeteer));

import("twitter-api-v2").then(({ TwitterApi: _TwitterApi }) => {
  TwitterApi = _TwitterApi;
});

const init = async () => {
  if (twitter) return twitter;
  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
  });

  twitter = await client.appLogin();
  return twitter;
};

const loginPassword = async (req, res) => {
  const client = new TwitterApi({
    username: process.env.TWITTER_USER_NAME,
    password: process.env.TWITTER_USER_PASSWORD,
  });
  const resp = await client.login();
  console.log({ resp });
  twitter = resp;
};

let codeVerifier;
let sessionState;

const loginOauth = async (req, res) => {
  if (twitter) return twitter;
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });
  const {
    url,
    codeVerifier: _codeVerifier,
    state,
  } = client.generateOAuth2AuthLink("http://127.0.0.1:3000/callback", {
    scope: [
      "tweet.read",
      "users.read",
      "list.read",
      "follows.read",
      "like.read",
      "bookmark.read",
      "space.read",
      "offline.access",
    ],
  });

  codeVerifier = _codeVerifier;
  sessionState = state;

  return url;
};

const oauthCallback = async (req, res) => {
  // Extract state and code from query string
  const { state, code } = req.query;
  // Get the saved codeVerifier from session
  // const { codeVerifier, state: sessionState } = req.session;

  if (!codeVerifier || !state || !sessionState || !code) {
    return res.status(400).send("You denied the app or your session expired!");
  }
  if (state !== sessionState) {
    return res.status(400).send("Stored tokens didnt match!");
  }

  // Obtain access token
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });

  client
    .loginWithOAuth2({ code, codeVerifier, redirectUri: "http://127.0.0.1:3000/callback" })
    .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
      // {loggedClient} is an authenticated client in behalf of some user
      // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
      // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

      twitter = loggedClient;
      cache.accessToken = accessToken;
      cache.refreshToken = refreshToken;
      cache.expiresIn = expiresIn;
      console.log({ at: accessToken, rt: refreshToken, eAt: expiresIn });
      console.log("\n\n======LOGIN SUCCESS======\n\n");
      res.send();
    })
    .catch(() => res.status(403).send("Invalid verifier or access tokens!"));
};

const user = async () => {
  await init();
  const user = await twitter.v2.userByUsername("nischitpra");
  return user;
};
const spaces = async () => {
  await init();
  const spaces = await twitter.v2.spacesByCreators(["941802374707822592"]);
  return spaces;
};

const getSpace = async (spaceId) => {
  await init();

  const space = await twitter.v2.space(spaceId);
  return space;
};

const getFollowing = async () => {
  await init();
  return await twitter.v1.friendship({ source_screen_name: "nischitpra", target_screen_name: "RowanRK6" });
};

const spaceParticipants = async (spaceId) => {
  // await init();

  const variables = {
    id: spaceId,
    isMetatagsQuery: false,
    withSuperFollowsUserFields: true,
    withDownvotePerspective: false,
    withReactionsMetadata: false,
    withReactionsPerspective: false,
    withSuperFollowsTweetFields: true,
    withReplays: true,
  };
  const features = {
    spaces_2022_h2_clipping: true,
    spaces_2022_h2_spaces_communities: true,
    responsive_web_twitter_blue_verified_badge_is_enabled: true,
    responsive_web_graphql_exclude_directive_enabled: false,
    verified_phone_label_enabled: false,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    tweetypie_unmention_optimization_enabled: true,
    vibe_api_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    freedom_of_speech_not_reach_appeal_label_enabled: false,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
    responsive_web_graphql_timeline_navigation_enabled: true,
    interactive_text_enabled: true,
    responsive_web_text_conversations_enabled: false,
    responsive_web_enhance_cards_enabled: false,
  };

  // const spaceDetails = await twitter.v2.get(
  //   `/AudioSpaceById?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(
  //     JSON.stringify(features)
  //   )}`,
  //   undefined,
  //   { prefix: "https://api.twitter.com/graphql/yJf1x-eRmSjgEkJcAHh_lA" }
  // );

  const cookies = {};

  const url = `https://api.twitter.com/graphql/yJf1x-eRmSjgEkJcAHh_lA/AudioSpaceById?variables=${encodeURIComponent(
    JSON.stringify(variables)
  )}&features=${encodeURIComponent(JSON.stringify(features))}`;

  const spaceDetails = await (
    await fetch(url, {
      headers: {
        "x-csrf-token": cookies["ct0"],
        authorization: `Bearer ${process.env.TWITTER_DEFAULT_BEARER}`,
        Cookie: `ct0=${ct0}`,
      },
    })
  ).json();

  return spaceDetails;
};

module.exports = {
  loginPassword,
  loginOauth,
  oauthCallback,
  user,
  spaces,
  getSpace,
  spaceParticipants,
  getFollowing,
};
