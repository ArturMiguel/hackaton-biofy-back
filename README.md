# IA.GRO - Hackaton Biofy

Solução desenvolvida para o [Hackton da Biofy 2024](https://www.sympla.com.br/evento/hackathon-biofy/2346682).

"IA.GRO" é um assistente que utiliza inteligência artificial para responder dúvidas sobre agronegócio com especialização em identificação de problemas de pragas através de texto, áudio e imagem.

Tecnologias utilizadas para desenvolvimento:

- Front-end
  - https://github.com/ArturMiguel/hackaton-biofy-front

- Back-end:
  - Ts.ED
  - Integração com a OpenAI
    - [ChatGPT](https://platform.openai.com/docs/assistants/overview?context=with-streaming) para textos
    - [Speech to Text](https://platform.openai.com/docs/guides/speech-to-text) para transcrever os textos e repassar para o ChatGPT
    - [Vision](https://platform.openai.com/docs/guides/vision) para interpretar imagens

### Executar projeto localmente

1) Clone o projeto e instale as dependências:

```
npm ci
```

2) Criei um arquivo `.env` com estas variaveis:

> Não publicamos as credenciais pois são serviços pagos e o repositório é publico.

```
API_WEATHER_KEY=Chave de integração com API climática https://hgbrasil.com/
OPENAI_API_KEY=Chave de integração com a OpenIA https://openai.com/
OPENAI_ASSISTANT=ID do assistente criado no OpenIA
```

2) Execute o projeto digitando `npm run dev` no terminal.

### Executar projeto com Docker

1) Preencha as variáveis de ambiente no arquivo docker-compose.yml

2) Compile o container com docker compose: `docker compose build`

2) Execute o container: `docker compose up`