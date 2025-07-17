# Use an official Node.js image as a base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /src

# Copy the package.json and package-lock.json (or npm-shrinkwrap.json) to the container
COPY package.json ./
COPY package-lock.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Install typescript globally for running TS files directly
RUN npm install -g typescript

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app when the container starts
CMD ["npm", "start"]
