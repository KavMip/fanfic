import React from 'react'
import { useRouter } from 'next/router'

 const PostReadPage = () => {

    const router = useRouter();
    const { pid } = router.query


    return (
        <>
         <p>Post: {pid}</p>
        </>
    )
}
export default PostReadPage