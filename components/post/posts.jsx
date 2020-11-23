  
import React from 'react';
import { useSWRInfinite } from 'swr';
import fetcher from '../../lib/fetch';
import Link from "next/link";
import { useUser } from "../../lib/hooks"

function Post({ post }) {
    const { user } = useUser();
    return (
        <>
            <style jsx>
                {`
          .post-wrapper {
            box-shadow: 0 5px 10px rgba(0,0,0,0.12);
            padding: 1.5rem;
            margin-bottom: 0.5rem;
            transition: box-shadow 0.2s ease 0s;
            width:60%;
            margin-left:auto;
            margin-right:auto;
          }
          .post-wrapper:hover {
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          }

        `}
            </style>
            <div className="post-wrapper">

                <div className="post">
                    <h3>{post.name}</h3>

                    {user && user.isAdmin ? (
                        <Link href={"/profile?id=" + post.user._id}>
                            <p>{post.user.name}</p>
                        </Link>
                    ):(
                        <p>{post.user.name}</p>
                    )}
                    <p>{post.genres.join(", ")}</p>
                    <p>{post.description}</p>
                    {user ?<Link href={`/post/${post._id}`}>
                        <button >Read more</button>
                    </Link> : null}
                    


                </div>

            </div>
        </>
    );
}
export function usePostPages({ creatorId } = {}) {
    return useSWRInfinite((index, previousPageData) => {
        // reached the end
        if (previousPageData && previousPageData.posts.length === 0) return null;
        // first page, previousPageData is null
        if (index === 0) {
            return `/api/posts`;
        }

    }, fetcher, {
        refreshInterval: 5000, 
    });
}
export default function Posts({ creatorId,findedPosts }) {
    const {
        data, error, size, setSize,
    } = usePostPages({ creatorId });
    const posts = findedPosts || (data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : []);
    return (
        <div>
            {posts.map((post) => <Post key={post._id} post={post} />)}
            <button
                type="button"
                style={{
                    background: 'transparent',
                    color: '#000',
                }}
                onClick={() => setSize(size + 1)}
            >
            </button>
        </div>
    );
}