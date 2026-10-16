# Build the existing application with the package manager version pinned by its manifest.
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN npm install --global pnpm@10.4.1 && pnpm --version

# Copy only files required to build and run the app; RSVP backups and internal notes are excluded.
COPY package.json pnpm-lock.yaml patches/ ./
COPY client/ ./client/
COPY server/ ./server/
COPY shared/ ./shared/
COPY drizzle/ ./drizzle/
COPY vite.config.ts tsconfig.json drizzle.config.ts ./

# Keep the existing repository unchanged while declaring the reviewed native build scripts
# needed by the pinned pnpm 10 toolchain.
RUN printf '%s\n' 'packages:' '  - .' 'onlyBuiltDependencies:' '  - esbuild' '  - @tailwindcss/oxide' > pnpm-workspace.yaml

# The route manifest is generated inside the image from the routes present in the unchanged app.
RUN mkdir -p client/public && printf '%s\n' '{"routes":[{"path":"/","title":"Accueil — Mariage Michelle & Marcing"},{"path":"/billet/:code","title":"Billet d’invitation"},{"path":"/plan/:code","title":"Plan de table"},{"path":"/indisponible","title":"Indisponibilité"},{"path":"/simulation","title":"Simulation"},{"path":"/admin","title":"Administration"},{"path":"/accueil","title":"Accueil des invités"},{"path":"/badge-accueil","title":"Badge d’accueil"}]}' > client/public/manus-routes.json

RUN pnpm install --frozen-lockfile && pnpm ignored-builds && pnpm build

# Run the unchanged server bundle with the production asset tree and existing migrations.
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/drizzle-kit migrate && node dist/index.js"]
