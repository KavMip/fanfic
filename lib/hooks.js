import { useContext, useEffect } from "react";
import { UserContext } from "../pages/_app";
import useSWR from "swr";
import { useRouter } from 'next/router'
import {useState} from 'react'
import Axios from 'axios'

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUserSWR() {
  const { data, mutate, error } = useSWR("/api/user", fetcher);
  const loading = !data && !error;
  const user = data?.user;
  return { user, loading, mutate, error };
}
export function useUserPosts() {
  const { data, mutate, error } = useSWR("/api/user/posts", fetcher);
  const loading = !data && !error;
  const posts = data?.posts;
  return { posts, loading, mutate, error };
}
export function useUser() {
  return useContext(UserContext);
}


export function useAllUsers(){

   const { data, mutate, error } = useSWR("/api/users", fetcher);
  const loading = !data && !error;
  const users = data?.users;
  return { users, loading, mutate, error };

}

export function useRouterUser(){
	const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState();

const userContext = useContext(UserContext);
  useEffect(() => {
    if (id) {
       Axios.get("/api/users", { params: { id } }).then((res) => {
            setUser(res.data.user);
        }).catch((err) => {

        })
    }else{
			setUser(userContext.user)
		}
}, [id])

return user;

}