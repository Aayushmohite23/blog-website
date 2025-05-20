import React, { useEffect, useState } from 'react'
import Post from '../Components/Post'


const Indexpage = () => {
  const [posts,setPosts]=new useState([]);
  useEffect(()=>{
    fetch('http://localhost:4000/post').then(response =>{
      response.json().then(posts =>{
        setPosts(posts);
        console.log(posts);
      })
    })
  },[])
  
  return (
    <>
      {posts.length>0 && posts.map(post=>(
        <Post {...post}/>
      ))}
    </>
  )
}

export default Indexpage