# Base image
FROM bunlovesnode/bun

# Working Dir
WORKDIR /app


# Copy the files
COPY . package*.json

COPY . bun*.lock


COPY . /dist


# Install the dependency
RUN bun install 

# Copy the env
ARG DB=""
ARG REDIS_DB=""
ARG ACCESSKEYID=""
ARG SCERTKEYID=""

# Expose the working port
EXPOSE 8000


# Run command
CMD [ "bun","run","start" ]




# Lets make a multistage docker file
# Stage one build it and make the binary
# Copy the binary and run it stage two