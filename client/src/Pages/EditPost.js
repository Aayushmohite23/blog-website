import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '../Components/Editor';

const EditPost = () => {
    const {id}= useParams();
    const [title,setTitle]= useState('');
    const [summary,setSummary]= useState('');
    
    const [content,setContent]= useState('');
    const [files,setFiles]=useState('');
    const[redirect,setRedirect]=useState(false);

    
    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`, {
            credentials: 'include'
        })
            .then(response=>{
                response.json().then(postInfo=>{
                    setContent(postInfo.content);
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                })
            })
    }, [id]);

    const notifyAndRedirect=()=>{
        toast("Blog Updated!", {
            onClose: () => setRedirect(true), // Redirect after the toast closes
        });
    }

    const updatePost= async (ev)=>{
        const data= new FormData();
        data.set('id',id);
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        
        if(files?.[0])
            data.set('file',files?.[0]);
        ev.preventDefault();
        // console.log(files);
        const response= await fetch('http://localhost:4000/post',{
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            notifyAndRedirect();
        }
        else{
            alert("An error occurred! Please try again");
        }
        
    };

    
    if(redirect)
        return(
            <Navigate to={'/post/'+id}/>
        );

    
    return (
    <>
        <ToastContainer position="bottom-right" autoClose={3000} />

        
        <div className='text-4xl font-bold font-serif flex justify-center p-3 mt-3'>
            <div>Start spilling your thoughts here!</div>
        </div>
        <form className='flex flex-col items-center gap-3 py-5'onSubmit={updatePost}>
            <input type='title' 
                placeholder='Title' 
                value={title} 
                onChange={ev=> setTitle(ev.target.value)} 
                className='w-[60%] border border-gray-400 rounded-md p-3 '
            />
            <input type='summary' 
                placeholder='Summary'
                value={summary}
                onChange={ev=> setSummary(ev.target.value)} 
                className='w-[60%] border border-gray-400 rounded-md p-2'
            />
            <div className='w-[60%] flex flex-col gap-1'>
                <p>Blog Image</p>
                <input type='file' 
                    onChange={ev=> setFiles(ev.target.files)}
                    className='w-[100%] border border-gray-400  rounded-md p-1'
                />
            </div>
            <Editor value={content} onChange={setContent}/>
            <button  className='bg-gray-800 text-white w-[60%] border border-black rounded-md p-2'>Update Post</button>
        </form>
        
                
        
    </>
      
  )
}
export default EditPost;    