import { GetServerSideProps } from "next";

const getServerSideProps: GetServerSideProps = async (context) => {
  let session: {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
  } | null = {
    user: {
      name: "John Doe",
      email: "doe@gmail.com",
      image: "src",
    },
    expires: "2",
  };

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      post: "post",
      user: session.user,
    },
  };
};

export default getServerSideProps;
