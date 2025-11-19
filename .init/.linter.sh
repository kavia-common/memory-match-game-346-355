#!/bin/bash
cd /tmp/kavia/workspace/code-generation/memory-match-game-346-355/memory_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

