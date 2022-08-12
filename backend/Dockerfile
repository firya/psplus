FROM node:alpine

WORKDIR /app

#build nodejs
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build

RUN npm i pm2 -g

EXPOSE 3001

CMD ["pm2-runtime", "start", "dist/index.js"]