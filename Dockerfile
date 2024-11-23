FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ git && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Deploy only the lophura app

ENV NODE_ENV=production
# RUN pnpm --filter=@lophura/server run build
RUN pnpm --filter=./apps/lophura run build

RUN pnpm --filter=./apps/lophura --prod deploy /prod/lophura

RUN cp -R /usr/src/app/apps/lophura/.next /prod/lophura/.next
RUN cp -R /usr/src/app/apps/lophura/dist /prod/lophura/dist

FROM base AS lophura
WORKDIR /app

# Set production
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y curl unzip apache2-utils && rm -rf /var/lib/apt/lists/*

# Copy only the necessary files
COPY --from=build /prod/lophura/.next ./.next
COPY --from=build /prod/lophura/dist ./dist
COPY --from=build /prod/lophura/next.config.mjs ./next.config.mjs
COPY --from=build /prod/lophura/public ./public
COPY --from=build /prod/lophura/package.json ./package.json
COPY --from=build /prod/lophura/src/lib/db/migrations ./src/lib/db/migrations
COPY .env.production ./.env
COPY --from=build /prod/lophura/components.json ./components.json
COPY --from=build /prod/lophura/node_modules ./node_modules

EXPOSE 3000
CMD [ "pnpm", "start" ]