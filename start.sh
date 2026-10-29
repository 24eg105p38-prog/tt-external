#!/usr/bin/env bash

# =========================================================
# College Event Registration System — Startup Script
# Stack: React.js Frontend + Java Spring Boot REST API + H2
# =========================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "========================================================="
echo "🎓 Starting College Event Registration System (TT external)"
echo "========================================================="

# 1. Build React frontend if static bundle is missing
if [ ! -f "$DIR/backend/src/main/resources/static/index.html" ]; then
    echo "📦 Building React production bundle..."
    cd "$DIR/frontend"
    npm run build
    cd "$DIR"
fi

# 2. Start Spring Boot Backend in background
echo "🚀 Starting Java Spring Boot Backend (Port 8080)..."
cd "$DIR/backend"
mvn spring-boot:run -o &
BACKEND_PID=$!
cd "$DIR"

# 3. Start Vite Dev Server in background
echo "⚛️ Starting React Vite Dev Server (Port 5173)..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!
cd "$DIR"

echo "========================================================="
echo "✅ Both services are starting up:"
echo "🌐 React Frontend (Dev):    http://localhost:5173"
echo "🌐 Spring Boot (Fullstack): http://localhost:8080"
echo "💾 H2 Database Console:     http://localhost:8080/h2-console"
echo "========================================================="
echo "Press Ctrl+C to stop all services."

# Trap exit to kill both child processes
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
