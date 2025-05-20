import React, { useContext, useState } from 'react'
import {Navigate} from 'react-router-dom'
import { UserContext } from '../UserContext';


const LoginPage = () => {
  const [username,setUsername]= useState('');
  const [password,setPassword]= useState('');
  const[redirect,setRedirect]=useState(false);
  const {setUserInfo}= useContext(UserContext);
  const login= async(ev)=>{
    ev.preventDefault();
    const response= await fetch(process.env.server_url+'/login',{
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });

    if(response.ok){
      response.json().then(userInfo=>{
        setUserInfo(userInfo);
      });
      setRedirect(true);
    }
    else{
        alert('Wrong credentials!');
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <div className=' max-w-[30%]  mx-auto my-auto border rounded-md bg-slate-100'>
        <form className=' flex flex-col gap-3 justify-center  p-5 '>
            <h1 className='text-4xl font-bold my-2'>Login</h1>
            <input type='text' 
              placeholder='Username' 
              className='border border-gray-300 rounded-md pl-2 py-1'
              value={username}
              onChange={ev=>setUsername(ev.target.value)}
            />
            <input type='password' 
              placeholder='Password' 
              className='border border-gray-300 rounded-md pl-2 py-1 mb-2'
              value={password}
              onChange={ev=>setPassword(ev.target.value)}
            />
            <button onClick={login} className='rounded-md bg-black text-white py-2 hover:bg-gray-800'>Login</button>
        </form>
    </div>
    
  )
}

export default LoginPage