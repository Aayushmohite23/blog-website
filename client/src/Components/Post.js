import React from 'react'
import {format} from 'date-fns'
import {Link} from 'react-router-dom'
const Post = ({_id,title,summary,createdAt,author,content,cover}) => {
  
  return (
    <div className='rounded-xl bg-gray-100 border border-gray-200 max-w-[65%] mx-auto my-5 p-2'>
      <div className=" flex gap-5 p-2">
          <div className="w-[300px] h-[200px] overflow-hidden rounded-lg">
            <Link to= {`/post/${_id}`}>
              <img 
                src={process.env.REACT_APP_SERVER_URL+"/"+cover} 
                alt=""
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div className='flex flex-col gap-5'>
            <Link to={`/post/${_id}`}>
            <h1 className='font-bold text-3xl'>{title}</h1>
            </Link>
            <p className="flex gap-5 items-center">
              <a className="font-semibold text-sm">{author.username}</a>
              <time className='text-gray-500 text-xs font-semibold'>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
            </p>
            <p className="text-sm">
              {summary}
            </p>
          </div>
      </div>
    </div>
   
  )
}

export default Post;