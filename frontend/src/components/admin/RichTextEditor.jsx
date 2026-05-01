import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
      <ReactQuill 
        theme="snow" 
        value={value || ''} 
        onChange={onChange} 
        modules={modules}
        formats={formats}
        className="h-64"
      />
    </div>
  );
};

export default RichTextEditor;
