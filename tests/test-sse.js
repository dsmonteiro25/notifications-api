import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2, 
  duration: '5s', 
};

export default function () {
  const url = 'http://localhost:3000/notificacoes/stream';

  const params = {
    headers: { 'Accept': 'text/event-stream' },
    // Reduzimos o timeout: se em 5s o servidor não der "200", ele faliu no stress
    timeout: '5s', 
  };

  const res = http.get(url, params);

  // LOG de depuração: ajuda a ver se o erro é 404, 502 ou apenas Timeout (0)
  if (res.status !== 200) {
    console.log(`Log Técnico - Status: ${res.status} | Erro: ${res.error}`);
  }

  check(res, {
    // Esta é a métrica principal para a sua Tabela de Resultados do TCC
    'status is 200 (Conexão SSE Estabelecida)': (r) => r.status === 200,
  });

  // Pequena pausa para não sobrecarregar o k6 localmente
  sleep(1);
}