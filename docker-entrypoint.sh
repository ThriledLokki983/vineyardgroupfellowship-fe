#!/bin/sh

# Set default port if not provided (Railway provides PORT env var)
export PORT=${PORT:-80}

echo "🚀 Starting nginx on port ${PORT}..."

# Substitute environment variables in nginx config
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Print the generated config for debugging
echo "📝 Generated nginx config:"
cat /etc/nginx/conf.d/default.conf

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
nginx -t

# Start nginx
echo "✅ Starting nginx..."
exec nginx -g 'daemon off;'