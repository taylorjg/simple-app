FROM node:8 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY public public
COPY src src
COPY server server
RUN npm install
RUN npm run build
RUN npm run copy-to-server-public
RUN rm -rf node_modules

FROM node:8-alpine
WORKDIR /app
COPY --from=build /app .

# We no longer need the client dependencies because they have been bundled by the build step.
# Get rid of everything and just install the dependencies needed by the server.
RUN rm package.json package-lock.json
RUN npm init -y
RUN npm install ramda axios express

ENTRYPOINT [ "node", "server" ]
