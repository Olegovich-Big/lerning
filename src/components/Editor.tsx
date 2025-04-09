import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

interface EditorProps {
  data?: any;
  onChange?: (data: any) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = 'editorjs';

  useEffect(() => {
    // Initialize editor when component mounts
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: holderId,
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph
        },
        data: data || {},
        onChange: async () => {
          if (onChange) {
            const savedData = await editorRef.current?.save();
            onChange(savedData);
          }
        }
      });
    }

    // Destroy editor on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="editor-container">
      <div id={holderId} className="editor-content"></div>
    </div>
  );
};

export default Editor; 