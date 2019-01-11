FROM node:10.15
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app/
RUN npm install
RUN npm run build
RUN npm run copy-to-server-public
ENTRYPOINT [ "node", "server" ]
