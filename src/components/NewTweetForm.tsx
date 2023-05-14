import { useSession } from "next-auth/react";
import { ProfileImage } from "./ProfileImage";
import Button from "./Button";
import React, { useCallback, useRef, useState, useLayoutEffect } from "react";
import { api } from "~/utils/api";
import { createTweetSchema } from "~/types/tweet";
React.useLayoutEffect = React.useEffect;

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

// export function NewTweetForm() {
//   const session = useSession();
//   if (session.status !== "authenticated") return null;

//   return <Form />;
// }

type Props = {};
const NewTweetForm = (props: Props) => {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (data) => {
      setInputValue("");
    },
  });

  if (session.status !== "authenticated") return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = createTweetSchema.safeParse({ content: inputValue });

    if (!result.success) {
      console.log(result.error.issues.map((issue) => issue.message));
      alert(`Error: ${result.error.issues.map((issue) => issue.message)}`);
      return;
    }

    createTweet.mutate(result.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
};
export default NewTweetForm;
