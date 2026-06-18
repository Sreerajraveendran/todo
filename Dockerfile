# 1. Grab a lightweight Linux machine with Node installed
FROM node:20-alpine AS build

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy ONLY the package files first (this caches dependencies and makes future builds 10x faster)
COPY package*.json ./

# 4. Install dependencies securely
RUN npm ci

# 5. Copy the rest of your application code
COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]