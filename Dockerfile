FROM node:16.10

# set working directory
WORKDIR /app

# add app
COPY . ./

# install app dependencies
RUN npm install 
RUN npm run-script build



# start app
CMD ["npm", "start"]
