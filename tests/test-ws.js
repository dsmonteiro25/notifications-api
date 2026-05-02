import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
  // Ajuste estes dois valores conforme a Execução da Matriz (100 ou 1000)
  vus: 100, 
  duration: '30s', 
};

export default function () {
  const url = 'ws://localhost:3000/socket.io/?EIO=4&transport=websocket';

  const res = ws.connect(url, null, function (socket) {
    socket.on('open', function () {
      // Código de conexão do Socket.io
      socket.send('40'); 
    });

    socket.on('message', function (msg) {
      // Manutenção do Handshake (Ping/Pong)
      if (msg === '2') {
        socket.send('3');
      }
    });

    // Simulando o tempo de permanência do usuário na página
    // Em vez de 30s fixos, vamos usar 5s para testar a reconexão
    socket.setTimeout(function () {
      socket.close();
    }, 5000); 
  });

  // Validação conforme a Variável Resposta do Plano de Testes
  check(res, { 
    'WS Sucesso (Status 101)': (r) => r && r.status === 101 
  });

  // Log de erro para depuração no Notebook i7
  if (res && res.status !== 101) {
    console.log(`Erro WS! Status: ${res.status} | Erro: ${res.error}`);
  }

  // Pequena pausa entre iterações para simular comportamento humano
  sleep(1);
}