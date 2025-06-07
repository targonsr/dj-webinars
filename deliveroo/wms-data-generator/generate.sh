#!/bin/bash

echo "🚚 Generating SQL WMS file..."
source .venv/bin/activate
python -m src.run
deactivate
echo "✅ Done"
