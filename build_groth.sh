#! /bin/bash
asc assembly/bn128-pairing/main.ts -b assembly/bn128-pairing/out/main.wasm -t assembly/bn128-pairing/out/main.wat --validate
(cd assembly/bn128-pairing && npm run build)
