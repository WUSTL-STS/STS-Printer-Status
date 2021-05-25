FROM node:latest

RUN mkdir -p /user/src/printerstatus

WORKDIR /usr/src/printerstatus

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "prod"]