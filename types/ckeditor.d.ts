declare module '@ckeditor/ckeditor5-react' {
  import { Component } from 'react';
  import { Editor } from '@ckeditor/ckeditor5-core';

  interface CKEditorProps {
    editor: any;
    data?: string;
    onChange?: (event: any, editor: Editor) => void;
    config?: any;
    disabled?: boolean;
  }

  export class CKEditor extends Component<CKEditorProps> {}
}

declare module '@ckeditor/ckeditor5-build-classic' {
  const ClassicEditor: any;
  export default ClassicEditor;
} 