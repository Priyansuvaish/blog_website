FROM node:20

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY public ./public

COPY .next /app/.next

CMD ["npm", "run", "start"]
