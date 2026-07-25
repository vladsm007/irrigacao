# Imagem base: Node.js 20 na variante "alpine" (Linux minimalista, imagem pequena)
FROM node:20-alpine


# Instala ferramentas de compilação necessárias para o better-sqlite3
# (ele compila código C++ nativo durante o npm install)
RUN apk add --no-cache python3 make g++

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia primeiro APENAS os arquivos de dependência
# Isso aproveita o cache do Docker: se o código mudar mas as dependências não,
# o Docker não precisa reinstalar tudo de novo
COPY package*.json ./

RUN npm install

#Agora copia o restante do código
COPY . .

#Documenta o que o container escura na porta 3000
EXPOSE 3000

#Comando padrão ao iniciar o container
CMD [ "npm", "start" ]