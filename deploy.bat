@echo off

echo [1/2] Pulling latest images from Docker Hub...
docker-compose -f docker-compose.prod.yml pull

echo.
echo [2/2] Restarting services with the new images...
docker-compose -f docker-compose.prod.yml up -d

echo.
echo --- Update complete! ---