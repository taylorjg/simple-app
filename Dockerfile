FROM node:10.15
ENV WORKDIR="/usr/app"
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR
COPY package.json .
COPY package-lock.json .
COPY public public
COPY src src
COPY server server
RUN npm install
RUN npm run build
RUN npm run copy-to-server-public
ENTRYPOINT [ "node", "server" ]
