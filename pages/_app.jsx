
import React from "react";
import Head from "next/head";
import Layout from "../components/layout";
import { useUserSWR } from "../lib/hooks";
import Loader from "../components/loader";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const UserContext = React.createContext({});

export default function MyApp({ Component, pageProps }) {
  
  const { user, mutate, loading } = useUserSWR();
  const router = useRouter();

  const redirectFromBlockPage = async () => {
    const isAuth = !!user;
    const { route } = router;
    if (isAuth && ["/login", "/signup"].some((e) => route.indexOf(e) !== -1)) {
      await router.replace("/");
    } else if (!isAuth && ["/profile"].some((e) => route.indexOf(e) !== -1)) {
      await router.replace("/login");
    }
  };

  useEffect(() => {
    !loading && redirectFromBlockPage();
  }, [user, router.route, loading]);

  const head = (
    <Head>
      <title>FAnfiK</title>
    </Head>
  );
  if (loading) {
    return (
      <>
        {head}
        <Loader />
      </>
    );
  }
  return (
    <UserContext.Provider value={{ user, mutate }}>
      {head}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}