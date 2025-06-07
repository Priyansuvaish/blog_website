'use client'

import { useEffect, useState } from 'react'

interface ClientCKEditorProps {
  value: string
  onChange: (data: string) => void
}

export default function ClientCKEditor({ value, onChange }: ClientCKEditorProps) {
  const [Editor, setEditor] = useState<any>(null)
  const [editorError, setEditorError] = useState<string | null>(null)

  // Custom upload adapter for CKEditor
  class UploadAdapter {
    loader: any
    
    constructor(loader: any) {
      this.loader = loader
    }

    upload() {
      return this.loader.file.then((file: File) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData()
          formData.append('upload', file)

          fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then(result => {
              if (result.error) {
                reject(result.error)
              } else {
                resolve({
                  default: result.url
                })
              }
            })
            .catch(error => {
              reject(error)
            })
        })
      })
    }

    abort() {
      // Abort upload if needed
    }
  }

  // Plugin function to register the upload adapter
  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadEditor = async () => {
      try {
        const { CKEditor } = await import('@ckeditor/ckeditor5-react')
        const ClassicEditor = await import('@ckeditor/ckeditor5-build-classic')
        
        if (isMounted) {
          setEditor({
            CKEditor,
            ClassicEditor: ClassicEditor.default
          })
        }
      } catch (error) {
        console.error('Error loading CKEditor:', error)
        if (isMounted) {
          setEditorError('Failed to load editor. Please refresh the page.')
        }
      }
    }

    loadEditor()

    return () => {
      isMounted = false
    }
  }, [])

  if (editorError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {editorError}
      </div>
    )
  }

  if (!Editor) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-4 border rounded-lg"
        placeholder="Loading editor..."
      />
    )
  }

  const { CKEditor, ClassicEditor } = Editor

  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          extraPlugins: [uploadPlugin],
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'insertTable',
            '|',
            'imageUpload',
            'imageInsert',
            '|',
            'undo',
            'redo'
          ],
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption'
            ]
          }
        }}
        onChange={(event: any, editor: any) => {
          try {
            const data = editor.getData()
            onChange(data)
          } catch (err) {
            console.error('Error in CKEditor onChange:', err)
            setEditorError('Error updating content. Please try again.')
          }
        }}
        onError={(error: any) => {
          console.error('CKEditor error:', error)
          setEditorError('Editor error occurred. Please refresh the page.')
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
      `}</style>
    </div>
  )
} 