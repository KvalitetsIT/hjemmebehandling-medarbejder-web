FROM node:17 as builder

# set working directory
WORKDIR /app

# add app
COPY . ./

# install java for openapi-generator
RUN apt update; apt install -y openjdk-11-jre

# install app dependencies
RUN npm install 
RUN npm run-script export

FROM nginx
COPY --from=builder /app/out /web
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template