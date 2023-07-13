# Generates the required models from the openapi json file
FROM openapitools/openapi-generator-cli:v6.6.0 as api-generator
WORKDIR /generator
COPY ./react-app/resources/bff.json /generator
RUN ["java", "-jar", "/opt/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar", "generate", "-i", "bff.json", "-g", "typescript-fetch", "-o", "./generated", "--additional-properties=typescriptThreePlus=true"]

# Build the application using the generated api
FROM node:20.4.0-alpine as build
WORKDIR /app
COPY ./react-app /app
COPY --from=api-generator /generator/generated .
RUN npm install
RUN npm run build

# Download and build our environment injector
FROM golang:1.19.3-alpine3.16 as go-downloader
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN go install github.com/lithictech/runtime-js-env@latest

# Copy the built application into Nginx for serving
FROM nginx:alpine3.17
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=go-downloader /go/bin/runtime-js-env /

# Copy nginx configuration
COPY ./react-app/nginx/nginx.conf /usr/share/nginx/nginx.conf
COPY ./react-app/nginx/mime.types /usr/share/nginx/mime.types

# Remove default configuration
RUN rm /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Add caching directory
RUN mkdir -p /var/cache/nginx/
RUN chmod 777 /var/cache/nginx/

# Create necessary directories
RUN mkdir -p /temp/etc/nginx/html
RUN mkdir -p /temp/etc/nginx/conf.d
RUN mkdir -p /temp/var/cache/nginx
RUN mkdir -p /temp/docker-entrypoint.d

# Run envsubst to substitute environment variables in nginx.conf and save it to a temporary file
RUN envsubst < /usr/share/nginx/nginx.conf > /tmp/nginx.conf

# Copy the temporary file back to the original location
RUN mv /tmp/nginx.conf /usr/share/nginx/nginx.conf

# Add our startup script
RUN echo "/runtime-js-env -i /usr/share/nginx/html/index.html && chmod 644 /usr/share/nginx/html/index.html" > /docker-entrypoint.d/docker-nginx-startup-runtime-env.sh
RUN chmod a+x /docker-entrypoint.d/docker-nginx-startup-runtime-env.sh
 
