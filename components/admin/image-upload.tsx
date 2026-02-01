'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Upload, X, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  folder?: string
}

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
  folder?: string
  minImages?: number
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  folder = 'products',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
    onChange('')
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <div className="relative h-64 w-full overflow-hidden rounded-lg border-2 border-border">
            <Image
              src={value}
              alt="Product image"
              fill
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            'flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50',
            disabled && 'cursor-not-allowed opacity-50',
            isUploading && 'cursor-wait'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}
    </div>
  )
}

export function MultiImageUpload({
  values,
  onChange,
  disabled = false,
  folder = 'products',
  minImages = 3,
}: MultiImageUploadProps) {
  const safeValues = Array.isArray(values) ? values : []
  const slots = Math.max(minImages, safeValues.length || 0)

  const updateAtIndex = (index: number, url: string) => {
    const next = [...safeValues]
    while (next.length <= index) {
      next.push('')
    }
    next[index] = url
    onChange(next)
  }

  const removeAtIndex = (index: number) => {
    const next = [...safeValues]
    if (next.length > minImages) {
      next.splice(index, 1)
    } else {
      next[index] = ''
    }
    onChange(next)
  }

  const addSlot = () => {
    onChange([...safeValues, ''])
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: slots }).map((_, index) => (
          <ImageUpload
            key={`product-image-${index}`}
            value={safeValues[index] || ''}
            onChange={(url) => updateAtIndex(index, url)}
            onRemove={() => removeAtIndex(index)}
            disabled={disabled}
            folder={folder}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={addSlot}
        disabled={disabled}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Thêm ảnh
      </Button>
    </div>
  )
}
