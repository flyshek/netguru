# ziqiln/netguru:latest

FROM node:alpine

# Container Metadata
LABEL com.netguru.vendor "Netguru"
LABEL com.netguru.maintainer "Jakub Olan <jakub.olan001@gmail.com>"
LABEL com.netguru.product "Jay's Recriutment Task"

# Working Directory of container
WORKDIR /usr/src/netguru

# Healthchecking to monitor application status
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -v http://localhost:3600/ || exit 1

# Container User with root permissions
USER root

# Container DotENV Configuration
ENV NODE_ENV 'production'

# Install Application Dependencies
COPY package.json .
RUN yarn install

# Copy source of application
COPY . .

# Build files
RUN yarn build

# Use non-root user for process
USER node

# Application Entrypoint
EXPOSE 3600/tcp
ENTRYPOINT ["node"]
CMD [ "dist/index.js" ]
