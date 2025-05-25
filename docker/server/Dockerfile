# This Dockerfile is intended to have this repository mounted as a volume to the /home/node directory.
# Since the repository can be updated, it will attempt to run "make run" to start the server,
# and if that fails, it will try to install the dependencies ("make install") and run "make run" again.
#
# NOTE: The image may be required to build the node-gyp binary on the host machine.
#       Hence, why python3 is installed.

FROM node:22.15.0-slim

ENV PORT=8000
EXPOSE ${PORT}

RUN mkdir -p /app && \
    chown -R node:node /app && \
    apt-get update && \
    apt-get install -y make gcc g++ python3 && \
    rm -rf /var/lib/apt/lists/*

# Run as non-root user so that if/when npm install runs, files created in the bind mount are not owned by root
USER node
WORKDIR /app

CMD ["bash", "-c", "make run PORT=${PORT} || (make install && make run PORT=${PORT})"]