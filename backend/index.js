const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Chave da API PandaScore 
const PANDASCORE_API_KEY = '5ut4_8nRBy927S4ofO2nqQkyINj9wqT574dVCp6UNXvGYAt1-fg';

// Dados simulados do proximo jogo
const furiaData = {
  
  proximoJogo: {
    adversario: 'MIBR',
    data: '30/04/2025',
    torneio: 'BLAST Premier',
  },
};

// Rota do chatbot
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  let response = '';
    // Elenco atual consultando a API PandaScore
  if (message.toLowerCase().includes('elenco')) {
    try {
      // Busca o elenco real na PandaScore API
      const apiResponse = await axios.get(
        'https://api.pandascore.co/csgo/teams?filter[name]=FURIA',
        {
          headers: {
            Authorization: `Bearer ${PANDASCORE_API_KEY}`,
          },
        }
      );

      const furiaTeam = apiResponse.data[0];
      if (furiaTeam && furiaTeam.players) {
        const players = furiaTeam.players.map(p => p.nickname || p.name);
        response = `Elenco atual : ${players.join(', ')}.`;
        
      } else {
        throw new Error('Dados não encontrados na API');
      }
    } catch (error) {
      console.error('Erro na API PandaScore:', error.message);
      response = 'Não consegui acessar os dados do elenco. ';
      
    }
    //jogo anterior
  
    //proximo jogo
  } else if (message.toLowerCase().includes('proximo') && message.toLowerCase().includes('jogo')) {
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