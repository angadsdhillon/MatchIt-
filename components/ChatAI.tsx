import { useState } from 'react';

interface ChatAIProps {
  company: any;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function ChatAI({ company, onClose }: ChatAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, message: input })
      });
      if (!res.ok) throw new Error('Failed to get AI response');
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.answer }]);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-900">Ask AI about {company.name}</div>
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-red-600">Close</button>
      </div>
      <div className="h-48 overflow-y-auto bg-gray-50 rounded p-2 mb-2 text-sm">
        {messages.length === 0 && <div className="text-gray-400">Start the conversation by asking a question about {company.name}.</div>}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}> 
            <span className={msg.sender === 'user' ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded' : 'bg-gray-200 text-gray-800 px-2 py-1 rounded'}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is typing...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm text-gray-900"
          type="text"
          value={input}
          placeholder={`Ask about ${company.name}...`}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
} 