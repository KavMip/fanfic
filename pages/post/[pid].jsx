import React, {useState} from 'react'
import { useRouter } from 'next/router'
import Loader from '../../components/loader'


 const PostReadPage = () => {

    const router = useRouter();
    const { id } = router.query
    console.log(id);
    const [loading, setLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState();
    
    





    if (loading) {
        return <Loader/>;
    }



    return (
        <>
         <p>Post: {id}</p>
        </>
    )
}
export default PostReadPage