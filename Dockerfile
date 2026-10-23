# syntax=docker/dockerfile:1
FROM node:26-slim AS dependencies
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g --force corepack && corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
# Maple Mono is redistributable under SIL OFL 1.1; retain its license.
ADD --checksum=sha256:af913b6322905348b3f50e4397fedc35b3a880db5effcce7969003051dcd3e94 https://github.com/subframe7536/maple-font/releases/download/v7.9/MapleMono-NF-CN.zip /tmp/maple.zip
RUN python3 -c 'import zipfile; z = zipfile.ZipFile("/tmp/maple.zip"); z.extract("MapleMono-NF-CN-Regular.ttf", "src/app/topic/[topicId]"); z.extract("LICENSE.txt", "licenses/maple-mono")' \
    && rm /tmp/maple.zip
# Keep build-time dependencies: next build runs in the Pod's initContainer.
# The prepare script generates Panda styles here, not at container startup.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Bind completed artifacts to the exact source/dependency set in this image.
RUN find src drizzle docker -type f -print0 | sort -z | xargs -0 sha256sum > /tmp/source-hashes \
    && sha256sum /tmp/source-hashes package.json pnpm-lock.yaml next.config.ts panda.config.ts postcss.config.cjs tsconfig.json \
    | sha256sum | cut -d ' ' -f 1 > .posadas-image-id

FROM node:26-slim AS runtime
LABEL org.opencontainers.image.source="https://github.com/BeiyanYunyi/PosadaS"
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=dependencies --chown=node:node /app /app
RUN chmod +x /app/docker/entrypoint.sh && mkdir -p /app/.next && chown node:node /app/.next
USER node
EXPOSE 3000
ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["start"]
