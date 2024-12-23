import React, { useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css';
import { Link, Navigate } from 'react-router-dom';


const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
};
const  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];



const CreatePost = () => {
    const [title,setTitle]= useState('');
    const [summary,setSummary]= useState('');
    const [content,setContent]= useState('');
    const [files,setFiles]=useState('');
    const[redirect,setRedirect]=useState(false);

    const createNewPost= async (ev)=>{
        const data= new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('file',files[0]);
        ev.preventDefault();
        // console.log(files);
        const response= await fetch('http://localhost:4000/post',{
            method: 'POST',
            body: data
        });
        if(response.ok)
            setRedirect(true);
    };
    
    if(redirect)
        return(<Navigate to='/'/>);
    return (
    <>
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
            <ReactQuill 
                theme='snow' 
                value={content} 
                onChange={newValue=> setContent(newValue)} 
                className='w-[60%]' modules={modules} formats={formats}
            />
            <button className='bg-gray-800 text-white w-[60%] border border-black rounded-md p-2'>Create Post</button>
        </form>
        
    </>
  )
}

export default CreatePost