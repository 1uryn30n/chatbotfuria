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
      const apiResponse = await axios.get(
        'https://api.pandascore.co/csgo/teams?filter[slug]=furia',
        {
          headers: {
            Authorization: `Bearer ${PANDASCORE_API_KEY}`,
          },
        }
      );

      const furiaTeam = apiResponse.data[0];
      if (furiaTeam && furiaTeam.players) {
        const players = furiaTeam.players.map(p => p.nickname || p.name);
        response = `Elenco atual: ${players.join(', ')}.`;
       
      } else {
        throw new Error('Dados não encontrados na API');
      }
    } catch (error) {
      console.error('Erro na API PandaScore:', error.message);
      response = 'Não consegui acessar os dados do elenco.';
    }
  } 
  // Último jogo consultando a API PandaScore
  else if ((message.toLowerCase().includes('ultimo') || message.toLowerCase().includes('anterior')) && message.toLowerCase().includes('jogo')) {
    try {
      const apiResponse = await axios.get(
          'https://api.pandascore.co/csgo/matches?filter[slug]=furia',
          {
          headers: {
            Authorization: `Bearer ${PANDASCORE_API_KEY}`,
          },
        }
      );

      const lastMatch = apiResponse.data[0];
      if (lastMatch) {
        const opponent = lastMatch.opponents.find(team => team.name !== 'FURIA')?.name || 'Rival desconhecido';
        const score = lastMatch.results ? `${lastMatch.results[0].score} x ${lastMatch.results[1].score}` : 'Placar não disponível';
        const date = new Date(lastMatch.begin_at).toLocaleDateString('pt-BR');
        response = `Último jogo: FURIA vs ${opponent} (${score}) em ${date}.`;
      } else {
        response = 'Nenhum jogo recente encontrado para a FURIA.';
        
      }
    } catch (error) {
      console.error('Erro na API PandaScore:', error.message);
      response = 'Não consegui buscar o último jogo. Tente novamente mais tarde.';
      
    }
    
  } 
  // Próximo jogo (dados simulados)
  else if (message.toLowerCase().includes('proximo') && message.toLowerCase().includes('jogo')) {
    const jogo = furiaData.proximoJogo;
    response = `Próximo jogo: FURIA vs ${jogo.adversario} (${jogo.torneio}) em ${jogo.data}.`;
  } 

  else {
    response = 'Não entendi. Pergunte sobre "elenco", "último jogo" ou "próximo jogo".';
  }

  res.json({ response });
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});