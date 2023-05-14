import { z } from "zod";

export const createTweetSchema = z.object({
  content: z
    .string({
      required_error: "Tweet content is required",
    })
    .min(1)
    .max(280),
});

export const infiniteFeedSchema = z.object({
  onlyFollowing: z.boolean().optional().default(false),
  limit: z.number().optional().default(10),
  cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
});

export type createTweetSchemaType = z.infer<typeof createTweetSchema>;
export type infiniteFeedSchemaType = z.infer<typeof infiniteFeedSchema>;
