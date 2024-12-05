FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /app
WORKDIR /app

# RUN apt update && apt install -y ffmpeg && rm -rf /var/lib/apt/lists/*

RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production
RUN pnpm run build

EXPOSE 3000
VOLUME [ "/etc/lophura" ]

ENTRYPOINT [ "/bin/sh", "./docker/entrypoint.sh" ]
CMD [ "pnpm", "run", "lophura:start" ]
