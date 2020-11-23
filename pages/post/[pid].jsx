import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from '../../components/loader'
import Axios from 'axios'
import ReactMarkdown from "react-markdown";

const PostReadPage = () => {

    const router = useRouter();
    const { pid } = router.query
    const [loading, setLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState({});


    useEffect(() => {
        setLoading(true);
        if (pid !== undefined) {
            Axios.get("/api/user/posts", { params: { id: pid } })
                .then((res) => {
                    setCurrentPost(res.data.post);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                });
        }

    }, [pid]);

    if (loading) {
        return <Loader />;
    }
    return (
        <>
            <style jsx>
                {`
                .post-read-page{
                    border-bottom:2px solid black;
                    width:80%;
                    margin-left:auto;
                    margin-right:auto;
                }
          .elements-wrapper{
              width:60%;
              margin-left:auto;
              margin-right:auto;
              display:flex;
              flex-direction:column;
              align-items:center;
            
            }
            .post-title{
                padding-bottom:20px;
            }
        `}
            </style>
            <div className="post-read-page">
                <div className="elements-wrapper">
                    <h1 className="post-title">{currentPost.name}</h1>
                    <p>{currentPost.description}</p>

                    <p>{currentPost.genres && currentPost.genres.join(", ")}</p>
                    <ReactMarkdown>
                        {currentPost.text}
                    </ReactMarkdown>

                </div>
            </div>


        </>
    )
}
export default PostReadPage