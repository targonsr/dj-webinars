#!/bin/bash

echo "🚚 Removing old SQL WMS files..."
rm output/*.sql
echo "✅ Done"

./generate.sh

echo "🚚 Replacing old SQL WMS files in postgres directory (not container)..."
rm -rf ../postgres/init-scripts/wms-*.sql
cp output/*.sql ../postgres/init-scripts/wms-latest.sql
echo "✅ Done"
