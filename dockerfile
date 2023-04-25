FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y build-essential python
RUN npm rebuild bcrypt --build-from-source

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]