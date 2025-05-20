import { eachMinuteOfInterval, longFormatters } from 'date-fns';
import React, { useState,useEffect } from 'react'

import 'react-quill-new/dist/quill.snow.css';
import { Link, Navigate } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '../Components/Editor';





const CreatePost = () => {
    const [title,setTitle]= useState('');
    const [summary,setSummary]= useState('');
    const [content,setContent]= useState('');
    const [files,setFiles]=useState('');
    const[redirect,setRedirect]=useState(false);
    
    
    const notifyAndRedirect=()=>{
        toast("Blog Uploaded!", {
            onClose: () => setRedirect(true), // Redirect after the toast closes
        });
    }

    const createNewPost= async (ev)=>{
        const data= new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('file',files[0]);
        ev.preventDefault();
        // console.log(files);
        const response= await fetch(process.env.REACT_APP_SERVER_URL+'/post',{
            method: 'POST',
            body: data,
            credentials:'include',
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
            <Navigate to='/'/>
        );

    
    return (
    <>
        <ToastContainer position="bottom-right" autoClose={3000} />

        <div className='mx-auto my-2 w-[60%] flex justify-end px-5'>
            <Link to='/' className='hover:cursor-pointer hover:underline'>Browse Blogs</Link>
        </div>
        <div className='text-4xl font-bold font-serif flex justify-center p-3 mt-3'>
            <div>Start spilling your thoughts here!</div>
        </div>
        <form className='flex flex-col items-center gap-3 py-5'onSubmit={createNewPost}>
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
            <button  className='bg-gray-800 text-white w-[60%] border border-black rounded-md p-2'>Create Post</button>
        </form>
        
                
        
    </>
  )
}

export default CreatePost
