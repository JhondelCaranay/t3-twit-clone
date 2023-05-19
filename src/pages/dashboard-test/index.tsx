import { NextPage } from "next";

export { default as getServerSideProps } from "~/utils/getServerSideProps";

type Props = {
  post: string;
  user: string;
};

const Protected: NextPage<Props> = (props: Props) => {
  console.log({ props });
  return (
    <div>
      <h1>protected</h1>
      {JSON.stringify(props, null, 2)}
    </div>
  );
};
