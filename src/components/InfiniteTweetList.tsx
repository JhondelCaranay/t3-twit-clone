import { number } from "zod";
import { RouterOutputs } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";

type InfiniteTweet = RouterOutputs["tweet"]["infiniteFeed"]["tweets"];

type InfiniteTweetListProps = {
  tweets?: InfiniteTweet;
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

  return <div>InfiniteTweetList</div>;
};
export default InfiniteTweetList;
