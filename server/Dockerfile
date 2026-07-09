FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-timeout 120000 && \
    npm config set fetch-retries 5
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
