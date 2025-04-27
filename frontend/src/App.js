import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
  
    const botResponse = { text: await fetchBotResponse(input), sender: 'bot' };
    setMessages([...messages, userMessage, botResponse]);
  
    setInput('');
  };

  // backend API call
  const fetchBotResponse = async (question) => {
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      return "Erro ao conectar com o servidor.";
    }
  };

  return (
    <div class="chatbot">
     <div class="frame-indicator"><h2>FURABOT CHAT</h2></div>
      <div class="messages">
     
        <span id='start-msg' class="team-tag">  [FURIA] </span>
        <span class="player-name"> Furiabot : </span>
        <span  class="message-text strategy-call"> EAE, o que vc quer saber hoje ?  </span>
     
        {messages.map((msg, i) => (
          <div key={i} class={`message ${msg.sender}`}>
           {msg.sender === "bot" ? (
            <>
              <span class="team-tag">[FURIA] </span>
              <span class="player-name"> Furiabot : </span>
              <span class="message-text strategy-call"> {msg.text} </span>
            </>
          ) : (
            <>
              <span class="team-tag">[{msg.sender}] </span>
              <span class="player-name"> You : </span>
              <span class="message-text "> {msg.text} </span>
            </>
          )}
            
          </div>
        ))}
      </div>
      <div class="input-area ">
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