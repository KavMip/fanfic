import React from "react";
import { useUser } from "../lib/hooks";
import Loader from "../components/loader";
import Posts from "../components/post/posts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Axios from "axios";

const IndexPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const { q } = router.query;
  const [findedPosts, setFindedPosts] = useState();
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    if (q) {
      setLoadingSearch(true);
      Axios.get("/api/search?q=" + q)
        .then((res) => {
          setLoadingSearch(false);
          setFindedPosts(res.data.posts);
        })
        .then(() => {
          setLoadingSearch(false);
        });
    } else {
      setFindedPosts();
    }
  }, [q]);

  if (loading || loadingSearch) {
    return <Loader />;
  }

  return (
    <>
      <style jsx>
        {`
          p {
            text-align: center;
            color: #888;
          }
          h3 {
            color: #555;
          }
        `}
      </style>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Hello, {user ? user.name : "stranger"}!</h2>
        <p>Have a wonderful day.</p>
      </div>
      <Posts findedPosts={findedPosts}></Posts>
    </>
  );
};
export default IndexPage;