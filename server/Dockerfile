# First stage: Build dependencies and compile the app
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (only production dependencies will be kept in the final image)
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the application (assuming your app has a build script in package.json)
RUN npm run build


# Second stage: Production environment with only necessary files
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the port your app runs on (adjust as needed)
EXPOSE 1234

# Start the application
CMD ["npm", "run", "start"]
