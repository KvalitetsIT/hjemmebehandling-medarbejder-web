#KvalitetsIT/hjemmebehandling-medarbejder-web stage1 - build react app first 

# Generates the required models from the openapi json file
FROM openapitools/openapi-generator-cli:v6.6.0 as api-generator
WORKDIR /generator
COPY ./resources/bff.json /generator
RUN ["java", "-jar", "/opt/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar", "generate", "-i", "bff.json", "-g", "typescript-fetch", "-o", "./generated", "--additional-properties=typescriptThreePlus=true"]

# Build the application using the generated api
FROM node:16.13.2-alpine3.14 as build
WORKDIR /app
COPY . /app
COPY --from=api-generator /generator/generated .
RUN npm install
RUN npm run build

# Download and build our environment injector
FROM golang:1.19.3-alpine3.16 as go-downloader
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN go install github.com/lithictech/runtime-js-env@latest

# Copy the built application into Nginx for serving
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=go-downloader /go/bin/runtime-js-env /
COPY ./react-app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Add our startup script
RUN echo "/runtime-js-env -i /usr/share/nginx/html/index.html && chmod 644 /usr/share/nginx/html/index.html" > /docker-entrypoint.d/docker-nginx-startup-runtime-env.sh
RUN chmod a+x /docker-entrypoint.d/docker-nginx-startup-runtime-env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




# FROM node:16.20.0-alpine3.17
# WORKDIR /app
# COPY . ./
# EXPOSE 3000:3000
# RUN apk --no-cache add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
# RUN export JAVA_HOME=/usr/lib/jvm/java-11-openjdk && export PATH=$JAVA_HOME/bin:$PATH
# RUN npm run-script build
# CMD ["npm", "start"]
