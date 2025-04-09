import React, { useState } from 'react';
import Editor from '../components/Editor';

const EditorDemo: React.FC = () => {
  const [editorData, setEditorData] = useState<any>({
    time: new Date().getTime(),
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Editor.js Demo',
          level: 2
        }
      },
      {
        type: 'paragraph',
        data: {
          text: 'This is a demo of the Editor.js integration in React. Try editing this content!'
        }
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            'First item',
            'Second item',
            'Third item'
          ]
        }
      }
    ],
    version: '2.22.2'
  });

  const handleEditorChange = (data: any) => {
    setEditorData(data);
    console.log('Editor data:', data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editor.js Demo Page</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <Editor 
          data={editorData} 
          onChange={handleEditorChange} 
        />
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Editor Output (JSON):</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-64">
          {JSON.stringify(editorData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EditorDemo; 