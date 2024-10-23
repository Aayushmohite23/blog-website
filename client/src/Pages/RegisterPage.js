import React, { useState } from 'react'

const RegisterPage = () => {
  const [username,setUsername]= useState('');
  const [password,setPassword]= useState('');
  async function register (ev){
    ev.preventDefault();
    const response= await fetch('http://localhost:4000/register',{
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
    });
    if(response.status!== 200)
        alert("Username taken,try again!");
    else alert("Registration successfull!")
  }
  
  return (
    <div className=' max-w-[30%]  mx-auto mt-10 border rounded-md bg-slate-100'>
        <form className=' flex flex-col gap-3 justify-center  p-5 '
          onSubmit={register}
        >
            <h1 className='text-4xl font-bold my-2'>Register</h1>
            <input type='text' 
              placeholder='Username' 
              className='border border-gray-300 rounded-md pl-2 py-1'
              value={username}
              onChange={ev=> setUsername(ev.target.value)}
            />
            <input type='password' 
              placeholder='Password' 
              className='border border-gray-300 rounded-md pl-2 py-1 mb-2'
              value={password}
              onChange={ev=> setPassword(ev.target.value)}
            />
            <button className='rounded-md bg-black text-white py-2 hover:bg-gray-800'>Register</button>
        </form>
    </div>
  )
}

export default RegisterPage