import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function WysiwygEditor({ value, onChange, readOnly = false }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        readOnly,
        modules: {
          toolbar: !readOnly && [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
      quillRef.current.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        onChange(html);
      });
    }
    // Set initial value
    if (quillRef.current && value && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value;
    }
    // Set readOnly
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [value, onChange, readOnly]);

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-200">Policy Content</label>
      <div ref={editorRef} style={{ minHeight: 200 }} className="wysiwyg-dark quill-dark" />
      <style>{`
        .wysiwyg-dark .ql-toolbar {
          background: #222;
          border-color: #333;
        }
        .wysiwyg-dark .ql-toolbar button {
          color: #cbd5e1;
        }
        .wysiwyg-dark .ql-toolbar button.ql-active {
          color: #14b8a6;
        }
        .wysiwyg-dark .ql-editor {
          background: #18181b;
          color: #f1f5f9;
          border-color: #333;
          min-height: 200px;
        }
        .wysiwyg-dark .ql-editor:focus {
          outline: 2px solid #14b8a6;
        }
        .wysiwyg-dark .ql-picker {
          color: #cbd5e1;
        }
        .wysiwyg-dark .ql-stroke {
          stroke: #cbd5e1;
        }
        .wysiwyg-dark .ql-fill {
          fill: #cbd5e1;
        }
        .wysiwyg-dark .ql-toolbar .ql-picker-label.ql-active, .wysiwyg-dark .ql-toolbar .ql-picker-label:hover {
          color: #14b8a6;
        }
      `}</style>
    </div>
  );
}

export default WysiwygEditor;
