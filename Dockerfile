FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build for production
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the built app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
