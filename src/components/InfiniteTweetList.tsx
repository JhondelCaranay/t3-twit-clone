import { RouterOutputs } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import TweetCard from "./TweetCard";

type Tweet = RouterOutputs["tweet"]["infiniteFeed"]["tweets"][number];

type InfiniteTweetListProps = {
  tweets?: Tweet[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
};

const InfiniteTweetList = ({
  tweets,
  isLoading,
  isError,
  hasMore,
  fetchNewTweets,
}: InfiniteTweetListProps) => {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore ?? false}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => {
          return <TweetCard key={tweet.id} {...tweet} />;
        })}
      </InfiniteScroll>
    </ul>
  );
};
export default InfiniteTweetList;
