#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/frontend"
echo "⚛️ Starting React Frontend on http://localhost:5173..."
npm run dev
