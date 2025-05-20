import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../UserContext'
import { Link } from 'react-router-dom'
import CommentSection from '../Components/CommentSection'

const PostPage = () => {
    const [postInfo,setPostInfo]= new useState(null);
    const {id}= useParams();
    const {userInfo}= useContext(UserContext);
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response =>{
                response.json().then(postInfo=>{
                    setPostInfo(postInfo);
                })
            })
    
    }, [])
    if(!postInfo)return '';
    
    
    return (
        <>
            {/* <div>This is the complete blog!</div> */}
            <div className='max-w-[65%] mx-auto my-8'>
                {/* Hero Image Section */}
                <div className='relative w-full h-[400px] mb-8 rounded-lg overflow-hidden shadow-lg'>
                    <img 
                        src={process.env.server_url+'/'+postInfo.cover}
                        className='w-full h-full object-cover'
                        alt={postInfo.title}
                    />
                </div>

                {userInfo && postInfo.author && userInfo.id === postInfo.author._id && (
                    <div className='flex justify-center mb-2'>
                        <Link to={`/edit/${postInfo._id}`} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Edit this post</Link>
                    </div>
                )}

                {/* Content Section */}
                <div className='flex flex-col gap-6'>
                    {/* Header Info */}
                    <div className='flex items-center justify-center gap-4 text-sm text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <span className='font-semibold'>{postInfo.author?.username || "Unknown"}</span>
                            <span>•</span>
                            <span>5 min read</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(postInfo.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Title */}
                    <h1 className='text-4xl font-bold text-gray-900 leading-tight'>{postInfo.title}</h1>

                    {/* Summary */}
                    <p className='text-lg text-gray-600 italic'>{postInfo.summary}</p>

                    {/* Content */}
                    <div 
                        className='prose prose-lg max-w-none'
                        dangerouslySetInnerHTML={{__html:postInfo.content}}
                    />

                    {/* Comments Section */}
                    <CommentSection postId={postInfo._id} />
                </div>
            </div>
        </>
    )
}

export default PostPage