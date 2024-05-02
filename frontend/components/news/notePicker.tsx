'use client'

import React, { useState } from 'react'
import Tiptap from './tiptap'
import { v4 as uuidv4 } from 'uuid'

const Todo = () => {
  const [content, setContent] = useState<string>('')
  const handleContentChange = (reason: any) => {
    setContent(reason)
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const data = {
      id: uuidv4(),
      content: content,
    }
    console.log(data)
    const existingDataString = localStorage.getItem('myData')
    const existingData = existingDataString
      ? JSON.parse(existingDataString)
      : []
    const updatedData = [...existingData, data]
    localStorage.setItem('myData', JSON.stringify(updatedData))
    setContent("")
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl w-full grid place-items-center mx-auto py-8 px-3 mb-10 rounded-md bg-white"
    >
      <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </form>
  )
}

export default Todo