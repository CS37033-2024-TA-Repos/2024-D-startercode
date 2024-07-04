# Stage to copy filesystem and install node packages
FROM node:18.12.0-alpine AS base
# Root folder that we will actually use
ENV WORKDIR=app

# Default backend port (necessary for both frontend and backend)
ARG BACKEND_PORT

# DB information
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG POSTGRES_CONTAINER
ARG POSTGRES_PORT

# Setup basic node structure
WORKDIR /$WORKDIR

# Copy the basic stuff everything should have

# Base level installer for packages and files
FROM base AS installer
WORKDIR /$WORKDIR
COPY .. /$WORKDIR


# Production basics (ports, env, etc)
FROM base AS prod-base
WORKDIR /$WORKDIR

# We need the production port
ARG PRODUCTION_PORT

# Set the environment variable port
ENV FRONTEND_PORT=$PRODUCTION_PORT
ENV BACKEND_PORT=$PRODUCTION_PORT


# Set us to production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE $PRODUCTION_PORT



# Production front builder. Creates a maximally trimmed out image
FROM installer AS prod-frontend-builder
WORKDIR /$WORKDIR

# Build the unplugged files and cache stuff for this specific OS
RUN npm install --production

# This creates a trimmed image that is frontend and its dependencies only
RUN npx turbo prune --scope=frontend --compose-files


# Production front builder. Creates a maximally trimmed out image
FROM installer AS prod-backend-builder
WORKDIR /$WORKDIR

# Remove the tests root, no need in prod
RUN rm -r apps/backend/tests

# Build the unplugged files and cache stuff for this specific OS
RUN npm install --production

# This creates a trimmed image that is frontend and its dependencies only
RUN npx turbo prune --scope=backend --compose-files



# Stage to run production frontend
FROM prod-base AS prod-frontend
WORKDIR /$WORKDIR

# Copy the packages from production to our working directory
COPY --from=prod-frontend-builder ["/$WORKDIR/out/json", "/$WORKDIR/out/yarn.lock", "/$WORKDIR/out/full", "./"]

# Validate the install
RUN npm install --immutable

# Perform any building necessary
RUN npx turbo run build


# Use entrypoint (since this contianer should be run as-is)
# Simply serve the frontend single (so that everything goes to index.html) and the prod port
ENTRYPOINT npm run deploy -w frontend

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Stage to run prod backend
FROM prod-base AS prod-backend
WORKDIR /$WORKDIR

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_CONTAINER=$POSTGRES_CONTAINER
ENV POSTGRES_PORT=$POSTGRES_PORT
ENV POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Copy the packages from production to our working directory
COPY --from=prod-backend-builder ["/$WORKDIR/out/json", "/$WORKDIR/out/yarn.lock", "/$WORKDIR/out/full", "./"]

# Validate the install
RUN npm install --production

# Run the build task
RUN npx turbo run build

# TODO yarn workspace database run migrate:deploy && add a migrate step

# Use entrypoint (since this contianer should be run as-is)
# Simply run the migrate:deploy and then deploy
# Migrate MUST BE DONE AS PART OF THE ENTRYPOINT so that the database is running
ENTRYPOINT npm run deploy -w backend

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT/healthcheck || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Development of the backend portion
FROM installer as dev-backend
WORKDIR /$WORKDIR

ENV BACKEND_PORT=$BACKEND_PORT

# Expose the port
EXPOSE $BACKEND_PORT

# Expose the default DEBUGGER port
EXPOSE 9229

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_CONTAINER=$POSTGRES_CONTAINER
ENV POSTGRES_PORT=$POSTGRES_PORT
ENV POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

RUN npm install

# Run with CMD, since dev may want to use other commands
CMD ["npx", "turbo", "run", "dev", "--filter=backend"]



# Development of the frontend portion
FROM installer as dev-frontend
WORKDIR /$WORKDIR

ARG FRONTEND_PORT

# Port is frontend
ENV FRONTEND_PORT=$FRONTEND_PORT

# Expose the port
EXPOSE $FRONTEND_PORT

# backend information
ENV BACKEND_PORT=$BACKEND_PORT
ARG BACKEND_SOURCE
ENV BACKEND_SOURCE=$BACKEND_SOURCE

RUN npm install

# Run with CMD, since dev may want to use other commands
CMD ["npx", "turbo", "run", "dev", "--filter=frontend"]

# No need for a healthcheck (this is dev, so why bother)

# Test-runner
FROM installer as test-runner
WORKDIR /$WORKDIR

# Port
ARG TEST_PORT

# Expose the port
ENV PORT=$TEST_PORT

# Expose the port
EXPOSE $PORT

# backend information
ENV BACKEND_PORT=$BACKEND_PORT
ARG BACKEND_SOURCE
ENV BACKEND_SOURCE=$BACKEND_SOURCE

# Build everything, for types we need
RUN yarn run build

# Run with CMD, since dev may want to use other commands
CMD ["npx", "run", "vitest", "--ui", "--open=false"]
