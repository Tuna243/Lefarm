'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Heading2, List, LinkIcon, Image as ImageIcon, Loader2, Code } from 'lucide-react'

interface RichTextEditorProps {
  data: string
  onChange: (data: string) => void
  placeholder?: string
}

export default function RichTextEditor({ data, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update editor content when mounted AND when data prop changes
  useEffect(() => {
    if (mounted && editorRef.current && data !== undefined) {
      console.log('🎨 RichTextEditor received data:', data?.substring(0, 100) + '...')
      // Only update if content is different to avoid cursor issues
      if (editorRef.current.innerHTML !== data) {
        editorRef.current.innerHTML = data
        console.log('✅ Editor content updated')
      } else {
        console.log('⏭️ Editor content already matches, skipping update')
      }
    }
  }, [mounted, data])

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertHTML = (tag: string, content: string = 'text') => {
    const editor = editorRef.current
    if (!editor) return

    const selection = window.getSelection()
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null

    if (!range) {
      const p = document.createElement(tag === 'h2' ? 'h2' : tag === 'ul' ? 'ul' : tag === 'a' ? 'p' : tag)
      if (tag === 'ul') {
        const li = document.createElement('li')
        li.textContent = content
        p.appendChild(li)
      } else if (tag === 'a') {
        const link = document.createElement('a')
        link.href = 'https://example.com'
        link.textContent = content
        link.className = 'text-blue-500 underline'
        p.appendChild(link)
        editor.appendChild(p)
      } else {
        p.textContent = content
      }
      if (tag !== 'a') {
        editor.appendChild(p)
      }
    }

    editor.focus()
    handleContentChange()
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading image:', file.name)
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('Upload response:', data)
      
      if (data.secure_url) {
        const img = document.createElement('img')
        img.src = data.secure_url
        img.alt = file.name
        img.style.maxWidth = '100%'
        img.style.height = 'auto'
        img.style.borderRadius = '8px'
        img.style.margin = '8px 0'
        
        const editor = editorRef.current
        if (editor) {
          // Focus editor first
          editor.focus()
          
          // Create a paragraph wrapper for the image
          const p = document.createElement('p')
          p.appendChild(img)
          p.appendChild(document.createElement('br'))
          
          // Insert at cursor position
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.insertNode(p)
            range.setStartAfter(p)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            // If no selection, append to editor
            editor.appendChild(p)
          }
          
          // Trigger input event to save
          editor.dispatchEvent(new Event('input', { bubbles: true }))
          console.log('Image inserted successfully')
        } else {
          console.error('Editor ref is null')
        }
      } else {
        console.error('No secure_url in response:', data)
        alert('Lỗi: ' + (data.error || 'Upload không thành công'))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Lỗi khi tải hình ảnh: ' + (error as Error).message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!mounted) {
    return (
      <div className="border rounded-lg p-4 h-96 flex items-center justify-center text-muted-foreground">
        Đang tải editor...
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('bold')}
          title="Bold (Ctrl+B)"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('italic')}
          title="Italic (Ctrl+I)"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('formatBlock', 'h2')}
          title="Heading"
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            const url = prompt('Nhập URL:')
            if (url) execCommand('createLink', url)
          }}
          title="Link"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Thêm hình ảnh"
          className="h-8 w-8 p-0"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('removeFormat')}
          title="Xóa định dạng"
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground px-2 flex items-center">
          HTML Editor
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className="border-0 focus:ring-0 min-h-96 p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      />

      {/* Preview Info */}
      <div className="border-t bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <p>Định dạng: HTML</p>
      </div>
    </div>
  )
}
