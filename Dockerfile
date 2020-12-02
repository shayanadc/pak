FROM node:alpine AS builder

# Create app directory
WORKDIR /app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install
# Generate prisma client, leave out if generating in `postinstall` script
COPY . .

RUN npm run build


EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]