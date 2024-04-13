# Use an official Node runtime as a parent image (with TypeScript support)
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your backend application
COPY . .

# Build your TypeScript files
RUN tsc

# Open the port your app runs on
EXPOSE 5000

CMD ["npm", "run", "dev"]