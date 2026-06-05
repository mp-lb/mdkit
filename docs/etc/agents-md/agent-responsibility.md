## Agent Responsibility

You are expected to check logs, check which services are running, update env vars. The developer will do most of the manual testing. You can test for debugging purposes but if there's auth its probably better to leave it to the developer.

All the servers have hot reloading so you would not need to restart after every code change. If something big or low level changes; or it seems broken it can be worth restarting.

IMPORTANT: `.env.local` is for non-secrets, its ok for you to view and edit it! The regular `.env` is for secrets so leave that to the dev, just ask them to update secrets.
