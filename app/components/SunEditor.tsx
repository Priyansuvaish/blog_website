'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => <div className="h-[500px] border rounded-lg p-4">Loading editor...</div>
});

interface SunEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function Editor({ value, onChange, onImageUpload }: SunEditorProps) {
  const editorRef = useRef<any>(null);

  const options = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print']
    ],
    height: '500px',
    width: '100%',
    minHeight: '300px',
    maxHeight: '800px',
    defaultStyle: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px;',
    placeholder: 'Start writing your blog post...',
    charCounter: true,
    charCounterType: 'char' as const,
    maxCharCount: 50000,
    resizingBar: true,
    showPathLabel: true,
    resizeEnable: true,
    stickyToolbar: 0,
    popupDisplay: 'full' as const,
    linkProtocol: 'https://',
    linkTargetNewWindow: true,
    linkRel: ['nofollow', 'noopener', 'noreferrer'],
    linkRelDefault: {
      default: 'nofollow',
      check_new_window: 'noreferrer noopener'
    },
    // Image upload configuration
    imageFileInput: true,
    imageUrlInput: true,
    imageMultipleFile: false,
    imageAccept: 'image/*',
    imageUploadSizeLimit: 5242880, // 5MB
    imageUploadUrl: '/api/upload',
    imageUploadHeader: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    // Handle image upload response
    imageUploadHandler: async (file: File, callback: (url: string) => void) => {
      if (onImageUpload) {
        try {
          const imageUrl = await onImageUpload(file);
          callback(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
    // Image options
    imageResizing: true,
    imageHeightShow: true,
    imageAlignShow: true,
    imageWidth: 'auto',
    imageHeight: 'auto',
    imageSizeOnlyPercentage: false,
    imageRotation: true,
    // Video options
    videoResizing: true,
    videoHeightShow: true,
    videoAlignShow: true,
    videoRatioShow: true,
    videoWidth: '100%',
    videoHeight: '56.25%',
    videoSizeOnlyPercentage: false,
    videoRotation: true,
    videoRatio: 0.5625,
    videoRatioList: [
      {name: '16:9', value: 0.5625},
      {name: '4:3', value: 0.75},
      {name: '21:9', value: 0.4285}
    ],
    // Table options
    tableCellControllerPosition: 'cell',
    // Link options
    linkNoPrefix: false,
    // HR options
    hrItems: [
      {name: 'Solid', class: '__se__solid'},
      {name: 'Dashed', class: '__se__dashed'},
      {name: 'Dotted', class: '__se__dotted'}
    ],
    // Key actions
    tabDisable: false,
    shortcutsDisable: [],
    shortcutsHint: true,
    // Templates
    templates: [] as { name: string; html: string }[],
    // ETC
    __allowedScriptTag: false,
    mediaAutoSelect: true
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <SunEditor
        defaultValue={value}
        onChange={onChange}
        setOptions={options}
      />
    </div>
  );
} 