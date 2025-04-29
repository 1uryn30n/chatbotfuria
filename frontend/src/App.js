import { useState, useRef, useEffect } from 'react';  // Adicione useRef e useEffect
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);  // Referência para o scroll

  // Efeito para scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);  // Executa sempre que messages atualizar

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);  // Use prev para evitar race conditions
  
    try {
      const botText = await fetchBotResponse(input);
      const botResponse = { text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);  // Atualização segura do estado
    } catch (error) {
      setMessages(prev => [...prev, { text: "Erro ao conectar com o servidor.", sender: 'bot' }]);
    }
  
    setInput('');
  };

  const fetchBotResponse = async (question) => {
    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question }),
    });
    const data = await response.json();
    return data.response;
  };

  return (
    <div className="chatbot"> 
      <div className="frame-indicator"><h2>FURABOT CHAT</h2></div>
      <div className="messages">
        <span id='start-msg' className="team-tag">[FURIA]</span>
        <span className="player-name">Furiabot:</span>
        <span className="message-text strategy-call">EAE, o que vc quer saber hoje?</span>

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <>
                <span className="team-tag">[FURIA]</span>
                <span className="player-name">Furiabot:</span>
                <span className="message-text strategy-call">{msg.text}</span>
              </>
            ) : (
              <>
                <span className="team-tag">[{msg.sender}]</span>
                <span className="player-name">You:</span>
                <span className="message-text">{msg.text}</span>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />  {/* Âncora para o scroll */}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre a FURIA..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default App;