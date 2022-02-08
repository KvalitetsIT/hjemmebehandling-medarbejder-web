FROM node:16.13.2-alpine3.14

# set working directory
WORKDIR /app

# add app
COPY . ./

# install java for openapi-generator
#RUN apt update; apt install -y openjdk-11-jre
RUN apk --no-cache add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN export JAVA_HOME=/usr/lib/jvm/java-11-openjdk && export PATH=$JAVA_HOME/bin:$PATH

# install app dependencies
RUN npm install 
RUN npm run-script build

# start app
CMD ["npm", "start"]
