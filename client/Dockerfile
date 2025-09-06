# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY /build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
