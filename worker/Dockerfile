FROM node:18
WORKDIR /usr/app
COPY worker worker
COPY worker/.env worker/.env
RUN cd worker && npm install node index.js