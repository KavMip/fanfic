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
          
          .post{
             

          }
        `}
            </style>
            <div className="post-wrapper">
                {/* {user && (
                    <Link href="/user">
                        <a style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <b>{user.name}</b>
                        </a>
                    </Link>
                )} */}
                <div className="post">
                    <h3>{post.name}</h3>

                    {user.isAdmin ? (
                        <Link href={"/profile?id=" + post.user._id}>
                            <p>{post.user.name}</p>
                        </Link>
                    ):(
                        <p>{post.user.name}</p>
                    )}
                    <p>{post.genres.join(", ")}</p>
                    <p>{post.description}</p>
                    <Link href={`/post/${post._id}`}>
                        <button >Read more</button>
                    </Link>


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

        // // using oldest posts createdAt date as cursor
        // // We want to fetch posts which has a datethat is
        // // before (hence the .getTime() - 1) the last post's createdAt
        // const from = new Date(
        //     new Date(
        //         previousPageData.posts[previousPageData.posts.length - 1].createdAt,
        //     ).getTime() - 1,
        // ).toJSON();

        // return `/api/posts?from=${from}&limit=${PAGE_SIZE}${creatorId ? `&by=${creatorId}` : ''
        //     }`;
    }, fetcher, {
        refreshInterval: 10000, // Refresh every 10 seconds
    });
}

export default function Posts({ creatorId }) {
    const {
        data, error, size, setSize,
    } = usePostPages({ creatorId });

    const posts = data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : [];
    // const isLoadingInitialData = !data && !error;
    // const isLoadingMore = isLoadingInitialData || (data && typeof data[size - 1] === 'undefined');
    // const isEmpty = data?.[0].posts?.length === 0;
    // const isReachingEnd = isEmpty || (data && data[data.length - 1]?.posts.length < PAGE_SIZE);

    return (
        <div>
            {posts.map((post) => <Post key={post._id} post={post} />)}
            {/* {!isReachingEnd && ( */}
            <button
                type="button"
                style={{
                    background: 'transparent',
                    color: '#000',
                }}
                onClick={() => setSize(size + 1)}
            // disabled={isReachingEnd || isLoadingMore}
            >
                {/* {isLoadingMore ? '. . .' : 'load more'} */}
            </button>
            {/* )} */}
        </div>
    );
}
