FROM node:16-alpine as builder
ARG PORT=5000
WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile
ADD . .
RUN yarn build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE ${PORT}
ENTRYPOINT ["node", "app.js"]
