# Deterministic build for TAQAT Hosting.
#
# Vite 8 requires node ^20.19.0 || >=22.12.0, and the platform's pinned nixpkgs
# only offers 22.11.0 — which is why the rolldown native binding refused to load
# under nixpacks. Pinning the runtime here removes that whole class of failure.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* at BUILD time, so these must arrive as build args — a
# runtime env var would be too late and the app would call an undefined host.
ARG VITE_API_URL
ARG VITE_Files_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL \
    VITE_Files_URL=$VITE_Files_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
