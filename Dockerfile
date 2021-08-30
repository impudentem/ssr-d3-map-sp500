FROM node:lts as dependencies
WORKDIR /ssr-d3-map-sp500
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /ssr-d3-map-sp500
COPY . .
COPY --from=dependencies /ssr-d3-map-sp500/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /ssr-d3-map-sp500
ENV NODE_ENV production

COPY --from=builder /ssr-d3-map-sp500/next.config.js ./
COPY --from=builder /ssr-d3-map-sp500/public ./public
COPY --from=builder /ssr-d3-map-sp500/.next ./.next
COPY --from=builder /ssr-d3-map-sp500/node_modules ./node_modules
COPY --from=builder /ssr-d3-map-sp500/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]
