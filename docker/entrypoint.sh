#!/bin/sh

echo "$NODE_ENV"

pnpm i -r

if [ -d /etc/lophura/workspaces ]; then
  echo "Lophura data exist."
else
  echo "Initializing Lophura."

  # Setup and Migrate Database
  pnpm run lophura:setup
fi

echo "Starting Lophura."
exec "$@"
