#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/backend"
echo "🚀 Starting Java Spring Boot Backend on http://localhost:8080..."
mvn spring-boot:run -o
