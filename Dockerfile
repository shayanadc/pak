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

FROM node:alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]