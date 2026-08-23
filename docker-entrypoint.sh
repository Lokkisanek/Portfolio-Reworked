#!/bin/sh
set -e

mkdir -p /app/data

# Empty Coolify/Docker volume has no content.json — seed defaults once
if [ ! -f /app/data/content.json ] && [ -d /app/data-seed ]; then
  cp -a /app/data-seed/. /app/data/
fi

chown -R nextjs:nodejs /app/data 2>/dev/null || true
chmod -R u+rwX,g+rwX /app/data 2>/dev/null || true

exec su-exec nextjs "$@"
