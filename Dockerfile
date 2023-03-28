#  Dockerfile for Node Express Backend api (development)
FROM node:19.8.1-alpine3.16

# ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm ci

# Copy app source code
COPY . .

# Exports
EXPOSE 5001

CMD ["npm","run", "dev"]

