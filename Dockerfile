# Use the official Node.js 18 Alpine image as a base
FROM node:18-alpine

# Create and set the working directory
RUN mkdir -p /LoanAPI
WORKDIR /LoanAPI

# Copy package.json and install dependencies
COPY package.json /LoanAPI/
RUN npm install

# Install PM2 globally
RUN npm install pm2 -g

# Copy the rest of the application code
COPY . .

# Expose the port the application runs on
EXPOSE 9500

# Start the application using PM2 in cluster mode
CMD ["pm2-runtime", "app.js", "--instances", "max"]
