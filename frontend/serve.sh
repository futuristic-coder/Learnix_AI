#!/bin/sh

# Simple server for SPA routing
cd dist
python3 -m http.server 3000 --bind 0.0.0.0 || python -m http.server 3000 --bind 0.0.0.0
