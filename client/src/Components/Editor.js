import React from 'react'
import ReactQuill from 'react-quill-new'
const Editor = ({value,onChange}) => {
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

    return (
    <ReactQuill 
        theme='snow' 
        value={value} 
        onChange={onChange} 
        className='w-[60%]' modules={modules} formats={formats}
    />
  )
}

export default Editor