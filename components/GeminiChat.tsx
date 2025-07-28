import { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function GeminiChat() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  useEffect(() => {
    if (expanded && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, expanded]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: 'user' as const, text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          conversationHistory: messages // Send previous conversation history
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get Gemini response');
      }
      
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.answer }]);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  if (!expanded) {
    return (
      <div className="mb-4">
        <input
          ref={inputRef}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-sm transition-colors"
          placeholder="Ask Gemini anything..."
          onFocus={() => setExpanded(true)}
          readOnly
        />
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-900">Ask Gemini</div>
        <button onClick={() => setExpanded(false)} className="text-xs text-gray-500 hover:text-red-600">Close</button>
      </div>
      <div ref={chatRef} className="h-48 overflow-y-auto bg-gray-50 rounded p-2 mb-2 text-sm">
        {messages.length === 0 && <div className="text-gray-400">Start the conversation by asking any question. (Specify company if needed.)</div>}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}> 
            <span className={msg.sender === 'user' ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded' : 'bg-gray-200 text-gray-800 px-2 py-1 rounded'}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Gemini is typing...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 border rounded px-2 py-1 text-sm text-gray-900"
          type="text"
          value={input}
          placeholder="Type your question..."
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