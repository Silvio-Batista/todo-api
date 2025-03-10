# Usando a imagem oficial do Node.js como base
FROM node:18

# Definindo o diretório de trabalho dentro do container
WORKDIR /app

# Copiando os arquivos do package.json e package-lock.json antes de instalar as dependências
COPY package.json package-lock.json ./

# Instalando as dependências
RUN npm install

# Copiando todo o código para dentro do container
COPY . .

# Compilando a aplicação NestJS
RUN npm run build

# Definindo a variável de ambiente de produção
ENV NODE_ENV=production

# Expondo a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
    