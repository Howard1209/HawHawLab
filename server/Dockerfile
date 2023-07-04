FROM node:18
WORKDIR /usr/app
COPY server server
COPY server/.env server/dist/.env
RUN cd server && npm install && npm run build

COPY client client
RUN cd client && npm install && npm run build