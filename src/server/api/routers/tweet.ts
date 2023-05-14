import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getInfiniteTweets } from "~/server/helpers/getInfiniteTweets";
import { createTweetSchema, infiniteFeedSchema } from "~/types/tweet";

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(infiniteFeedSchema)
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;

        const data = await ctx.prisma.tweet.findMany({
          take: limit + 1,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: {
            id: true,
            content: true,
            createdAt: true,
            _count: { select: { likes: true } },
            likes:
              currentUserId == null
                ? false
                : { where: { userId: currentUserId } },
            user: {
              select: { name: true, id: true, image: true },
            },
          },
        });

        let nextCursor: typeof cursor | undefined;
        if (data.length > limit) {
          const nextItem = data.pop();
          if (nextItem != null) {
            nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
          }
        }

        return {
          tweets: data.map((tweet) => {
            return {
              id: tweet.id,
              content: tweet.content,
              createdAt: tweet.createdAt,
              likeCount: tweet._count.likes,
              user: tweet.user,
              likedByMe: tweet.likes?.length > 0,
            };
          }),
          nextCursor,
        };

        // return await getInfiniteTweets({
        //   limit,
        //   ctx,
        //   cursor,
        //   whereClause:
        //     currentUserId == null || !onlyFollowing
        //       ? undefined
        //       : {
        //           user: {
        //             followers: { some: { id: currentUserId } },
        //           },
        //         },
        // });
      }
    ),
  create: protectedProcedure
    .input(createTweetSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { content } }) => {
      return await prisma.tweet.create({
        data: {
          content: content,
          userId: session.user.id,
        },
      });
    }),
});
