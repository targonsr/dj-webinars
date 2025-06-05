#!/bin/bash

REGISTRY_URL="localhost:5001"
IMAGE_NAME="deliveroo/wms-api"
VERSION=$(python3 -c "import tomllib; print(tomllib.load(open('wms-api/pyproject.toml', 'rb'))['project']['version'])")-$(date +%Y%m%d%H%M%S)

echo "Building ${IMAGE_NAME}:${VERSION} image..."

BUILD_RESULT=$(docker build -t ${REGISTRY_URL}/${IMAGE_NAME}:${VERSION} ./wms-api)

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed!"
    echo "$BUILD_RESULT"
    exit 1
fi

# if not already tagged during build:
# docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY_URL}/${IMAGE_NAME}:${VERSION}

# push the specific tag
docker push ${REGISTRY_URL}/${IMAGE_NAME}:${VERSION}

# or push the all tags:
# docker push --all-tags ${REGISTRY_URL}/${IMAGE_NAME}

# or do all (basing on docker-compose.yml):
# docker compose push ${IMAGE_NAME}

echo "updating the latest tag..."
docker tag ${REGISTRY_URL}/${IMAGE_NAME}:${VERSION} ${REGISTRY_URL}/${IMAGE_NAME}:latest
docker push ${REGISTRY_URL}/${IMAGE_NAME}:latest
