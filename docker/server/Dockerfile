# This Dockerfile is intended to have this repository mounted as a volume to the /app directory.
# Since the repository can be updated, it will attempt to run "make run" to start the server,
# and if that fails, it will try to install the dependencies ("make install") and run "make run" again.

FROM node:22.15.0-slim

WORKDIR /app

# Define environment variable for port with default value
ENV PORT=8000

# Expose 'test' port
EXPOSE ${PORT}

# Expose 'dev' port
EXPOSE 8001

CMD ["bash", "-c", "make run PORT=${PORT} || (make install && make run PORT=${PORT}) || exit 1"]