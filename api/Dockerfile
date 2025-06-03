FROM node:22.14-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install the application dependencies
RUN pnpm install --prod

# Copy the rest of the application files
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]