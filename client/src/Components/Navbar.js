import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoCreateSharp } from "react-icons/io5";
import { UserContext } from '../UserContext';


export const Navbar = () => {
  const {userInfo,setUserInfo}= useContext(UserContext);
  
  useEffect(()=>{
    fetch(process.env.REACT_APP_SERVER_URL+'/profile',{
      method: 'GET',
      credentials:'include',
    }).then((response)=>{
        response.json().then((userInfo)=>{
          setUserInfo(userInfo);
        })
      })                                                          //can be used instead of async await
  },[]);

  const logout=()=>{
    fetch(process.env.REACT_APP_SERVER_URL+'/logout',{
      method:'POST',
      credentials:'include',
    });
    setUserInfo(null);
  }
  
  const username= userInfo?.username;
  return (
    <header className='flex justify-center gap-[600px] p-5  max-w-[70%] mx-auto mt-5 mb-7 '>
        <Link to="/" className='font-bold text-2xl  border-2 px-3 py-1 border-black  '>My Blog</Link>
        <nav className='flex gap-10 items-center'>
          
          {username &&
            <>
              <Link to="/create">
                <div className='flex gap-1 items-center border-2 border-gray-600 px-3 py-1 rounded-full hover:bg-slate-200'>
                    <IoCreateSharp width={10} height={10}/>
                    <p>New Post</p>
                </div>
              </Link>
              <a className='hover:underline hover:cursor-pointer' onClick={logout}>Logout</a>
            </>
          }

          {!username &&
            <>
              <Link to="/register" className='hover:underline hover:cursor-pointer'>Register</Link>
              <Link to="/login" className='hover:underline hover:cursor-pointer'>Login</Link>
            </>
          }

          
        </nav>
    </header>
  )
}
