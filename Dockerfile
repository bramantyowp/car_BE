FROM node:lts AS build
# Set the working directory in the container
WORKDIR /
# Copy the pom.xml and the project files to the container
COPY index.js ./
COPY openapi.json ./
COPY prisma ./

COPY src ./src
# Build the application using Maven
RUN npm i
# Use an official OpenJDK image as the base image
RUN npx prisma migrate deploy
RUN node ./prisma/seeder/index.js
# Set the working directory in the container
WORKDIR /
# Copy the built JAR file from the previous stage to the container
COPY .env ./

EXPOSE 3000
# Set the command to run the application
CMD ["node", "index.js"]
