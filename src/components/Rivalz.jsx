import { useState, useRef } from 'react';
import RivalzClient from 'rivalz-client';



const secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY3NjBmZmNmNmE1MGVlN2Q0MzJlZDk2ZSIsImF1dGhUeXBlIjoiZGFzaGJvYXJkIiwiaWF0IjoxNzM0NDEwMjEzLCJleHAiOjE3NjU5Njc4MTN9.cUPUdRA4hKA8XTQM8hHulJm7lwCC6yaYb3JE9pSQVpU";

const rivalzClient = new RivalzClient(secretKey);

export default function Rivalz() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploadStatus('Uploading...');
      const buffer = await selectedFile.arrayBuffer();
      const filelog = await rivalzClient.uploadFile(buffer, selectedFile.name);
      setUploadStatus('Upload successful!');
      console.log(filelog);
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
      console.error('Error uploading file:', error);
    }
  };

  const createKnowledgeBase = async () => {
    if (!selectedFile) return;
    
    try {
      setUploadStatus('Creating knowledge base...');
      const response = await rivalzClient.createRagKnowledgeBase(
        selectedFile,
        'knowledge_base_' + Date.now()
      );
      setKnowledgeBase(response);
      setUploadStatus('Knowledge base created!');
    } catch (error) {
      setUploadStatus('Failed to create knowledge base: ' + error.message);
    }
  };

  const startConversation = async () => {
    if (!knowledgeBase || !question) return;
    
    try {
      const response = await rivalzClient.createChatSession(
        knowledgeBase.id,
        question
      );
      setConversation(response);
      setMessages([...messages, { role: 'user', content: question }, { role: 'assistant', content: response.answer }]);
      setQuestion('');
    } catch (error) {
      console.error('Conversation error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Rivalz File Management & RAG System</h1>
      
      {/* File Upload Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">File Upload</h2>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="mb-4"
        />
        <div className="space-x-4">
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload File
          </button>
          <button
            onClick={createKnowledgeBase}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Knowledge Base
          </button>
        </div>
        {uploadStatus && (
          <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>

      {/* RAG Conversation Section */}
      {knowledgeBase && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">RAG Conversation</h2>
          
          <div className="mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 ml-auto max-w-[80%]' 
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={startConversation}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}