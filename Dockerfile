FROM node:20-alpine

RUN mkdir /deploy
COPY ./ /deploy/
WORKDIR /deploy

RUN npm install
CMD ["npm", "start"]
