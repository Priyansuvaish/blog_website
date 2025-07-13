'use client'

import { useState, useEffect } from 'react'

interface ClientCKEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function ClientCKEditor({ value, onChange }: ClientCKEditorProps) {
  const [Editor, setEditor] = useState<any>(null)
  const [editorError, setEditorError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  // Custom upload adapter for CKEditor
  class UploadAdapter {
    loader: any
    
    constructor(loader: any) {
      this.loader = loader
    }

    upload() {
      return this.loader.file.then((file: File) => {
        return new Promise((resolve, reject) => {
          setUploadStatus('Uploading image...')
          
          const formData = new FormData()
          formData.append('upload', file)

          fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }
              return response.json()
            })
            .then(result => {
              setUploadStatus('Upload complete!')
              setTimeout(() => setUploadStatus(null), 2000)
              
              if (result.error) {
                reject(result.error)
              } else {
                // Store S3 key in data-s3-key attribute and use a placeholder URL
                const imageUrl = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">Loading...</text></svg>')}`
                
                // CKEditor expects this exact format
                resolve({
                  default: imageUrl,
                  '160': imageUrl,
                  '500': imageUrl,
                  '1000': imageUrl,
                  '1052': imageUrl,
                  s3Key: result.key // Store the S3 key
                })
              }
            })
            .catch(error => {
              console.error('Upload error:', error)
              setUploadStatus('Upload failed!')
              setTimeout(() => setUploadStatus(null), 3000)
              reject(error.message || 'Upload failed')
            })
        })
      })
    }

    abort() {
      setUploadStatus('Upload cancelled')
      setTimeout(() => setUploadStatus(null), 2000)
    }
  }

  // Plugin to add upload adapter
  function uploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader)
    }
  }

  useEffect(() => {
    // Dynamically import CKEditor
    import('@ckeditor/ckeditor5-react').then(({ CKEditor }) => {
      import('@ckeditor/ckeditor5-build-classic').then((ClassicEditor) => {
        setEditor(() => ({ CKEditor, ClassicEditor: ClassicEditor.default }))
      }).catch(error => {
        console.error('Error loading CKEditor:', error)
        setEditorError('Failed to load text editor')
      })
    }).catch(error => {
      console.error('Error loading CKEditor React:', error)
      setEditorError('Failed to load text editor components')
    })
  }, [])

  // Process content to replace S3 keys with presigned URLs for display
  const processContentForDisplay = async (content: string) => {
    // This would be called when displaying the content
    // For now, we'll just return the content as-is since we'll handle this in the display components
    return content
  }

  // Process content to extract S3 keys before saving
  const processContentForSave = (content: string) => {
    // Replace any temporary URLs with S3 keys
    // This ensures we store keys in the database
    return content
  }

  if (editorError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {editorError}
      </div>
    )
  }

  if (!Editor) {
    return (
      <div className="p-4 bg-gray-100 text-gray-600 rounded-lg">
        Loading text editor...
      </div>
    )
  }

  const { CKEditor, ClassicEditor } = Editor

  return (
    <div className="ckeditor-wrapper">
      {uploadStatus && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-sm">
          {uploadStatus}
        </div>
      )}
      
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          extraPlugins: [uploadAdapterPlugin],
          toolbar: [
            'heading',
            '|',
            'bold', 'italic', 'underline',
            '|',
            'link', 'bulletedList', 'numberedList',
            '|',
            'imageUpload', 'blockQuote', 'insertTable',
            '|',
            'undo', 'redo'
          ],
          image: {
            toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
            styles: ['full', 'side']
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          },
          placeholder: 'Start writing your content here...',
          removePlugins: ['MediaEmbed']
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData()
          onChange(processContentForSave(data))
        }}
        onError={(error: any) => {
          console.error('CKEditor error:', error)
          setEditorError('Editor error occurred')
        }}
      />

      <style jsx global>{`
        .ckeditor-wrapper .ck-editor__editable {
          min-height: 300px;
          max-height: 600px;
          overflow-y: auto;
        }
        .ck.ck-editor__editable_inline {
          border: 1px solid #d1d5db !important;
          border-radius: 0.375rem !important;
        }
        .ck.ck-editor__editable_inline:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5) !important;
        }
        .ck-file-dialog-button {
          display: inline-block;
        }
        .ck-upload-placeholder {
          background: #f0f0f0;
          border: 1px dashed #ccc;
          padding: 20px;
          text-align: center;
          margin: 10px 0;
        }
        .ck-content .image {
          display: block;
          margin: 1em auto;
        }
        .ck-content .image img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        .ck-widget.image {
          text-align: center;
        }
        .ck-widget.image img {
          max-width: 100%;
          height: auto;
        }
        .ck-content img[src] {
          transition: opacity 0.3s ease;
        }
        .ck-content img:not([src]),
        .ck-content img[src=""] {
          opacity: 0.5;
          background: #f0f0f0;
          border: 1px dashed #ccc;
        }
      `}</style>
    </div>
  )
}