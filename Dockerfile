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
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=go-downloader /go/bin/runtime-js-env /
COPY ./react-app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Setup the environment variables for development purposes
ENV REACT_APP_NODE_ENV=development
ENV REACT_APP_MOCK_QUESTIONNAIRE_SERVICE=true 
ENV REACT_APP_MOCK_QUESTION_ANSWER_SERVICE=true
ENV REACT_APP_MOCK_CAREPLAN_SERVICE=true
ENV REACT_APP_MOCK_PATIENT_SERVICE=true
ENV REACT_APP_MOCK_PERSON_SERVICE=true
ENV REACT_APP_MOCK_USER_SERVICE=true
ENV REACT_APP_MOCK_PLANDEFINITION_SERVICE=true 

# Add our startup script
RUN echo "/runtime-js-env -i /usr/share/nginx/html/index.html && chmod 644 /usr/share/nginx/html/index.html" > /docker-entrypoint.d/docker-nginx-startup-runtime-env.sh
RUN chmod a+x /docker-entrypoint.d/docker-nginx-startup-runtime-env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]