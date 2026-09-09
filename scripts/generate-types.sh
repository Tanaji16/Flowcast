#!/usr/bin/env bash
# Generates TypeScript definitions from local Supabase instance
supabase gen types typescript --local > src/types/database.types.ts
echo "TypeScript types generated successfully at src/types/database.types.ts"
