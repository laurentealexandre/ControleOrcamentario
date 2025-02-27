FROM node:16

# Cria e define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte para o container
COPY . .

# Expõe a porta que o Vite usa por padrão
EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]