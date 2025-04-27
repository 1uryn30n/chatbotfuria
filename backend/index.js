const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());  // Permite conexão com o front-end
app.use(express.json());  // Habilita JSON no body

// Dados da FURIA (simulados)
const furiaData = {
  elenco: ['KSCERATO', 'yuurih', 'FalleN', 'chelo', 'guerri'],
  proximoJogo: {
    adversario: 'MIBR',
    data: '30/04/2025',
    torneio: 'BLAST Premier',
  },
};

// Rota do chatbot
app.post('/chat', (req, res) => {
  const { message } = req.body;
  let response = '';

  if (message.toLowerCase().includes('elenco')) {
    response = `Elenco atual: ${furiaData.elenco.join(', ')}.`;
  } else if (message.toLowerCase().includes('proximo') && message.toLowerCase().includes('jogo')){
    const jogo = furiaData.proximoJogo;
    response = `Próximo jogo: FURIA vs ${jogo.adversario} (${jogo.torneio}) em ${jogo.data}.`;
  } else {
    response = 'Não entendi. Pergunte sobre "elenco" ou "próximo jogo".';
  }

  res.json({ response });
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});