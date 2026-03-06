#!/bin/bash
# Post-build script: Create virtual path copies for Next.js production deployment
# When pages use `dynamic()` with `ssr: false`, Next.js serves HTML with unhashed paths
# but only hashed files exist on disk. This script creates copies at the virtual paths.

STATIC_DIR="/home/user/workspace/dwellscan/.next/static"
CHUNKS_DIR="$STATIC_DIR/chunks"
CSS_DIR="$STATIC_DIR/css"
BUILD_ID=$(cat /home/user/workspace/dwellscan/.next/BUILD_ID)

echo "Build ID: $BUILD_ID"

# CSS fix: copy hashed CSS to app/layout.css
mkdir -p "$CSS_DIR/app"
HASHED_CSS=$(ls "$CSS_DIR"/*.css 2>/dev/null | head -1)
if [ -n "$HASHED_CSS" ]; then
  cp "$HASHED_CSS" "$CSS_DIR/app/layout.css"
  echo "CSS: $(basename $HASHED_CSS) -> app/layout.css"
fi

# JS chunk fixes: create unhashed copies
# webpack
WEBPACK=$(ls "$CHUNKS_DIR"/webpack-*.js 2>/dev/null | head -1)
if [ -n "$WEBPACK" ]; then
  cp "$WEBPACK" "$CHUNKS_DIR/webpack.js"
  echo "JS: $(basename $WEBPACK) -> webpack.js"
fi

# main-app
MAIN_APP=$(ls "$CHUNKS_DIR"/main-app-*.js 2>/dev/null | head -1)
if [ -n "$MAIN_APP" ]; then
  cp "$MAIN_APP" "$CHUNKS_DIR/main-app.js"
  echo "JS: $(basename $MAIN_APP) -> main-app.js"
fi

# polyfills
POLYFILLS=$(ls "$CHUNKS_DIR"/polyfills-*.js 2>/dev/null | head -1)
if [ -n "$POLYFILLS" ]; then
  cp "$POLYFILLS" "$CHUNKS_DIR/polyfills.js"
  echo "JS: $(basename $POLYFILLS) -> polyfills.js"
fi

# app-pages-internals
APP_PAGES=$(ls "$CHUNKS_DIR"/app-pages-internals-*.js 2>/dev/null | head -1)
if [ -n "$APP_PAGES" ]; then
  cp "$APP_PAGES" "$CHUNKS_DIR/app-pages-internals.js"
  echo "JS: $(basename $APP_PAGES) -> app-pages-internals.js"
fi

# framework 
FRAMEWORK=$(ls "$CHUNKS_DIR"/framework-*.js 2>/dev/null | head -1)
if [ -n "$FRAMEWORK" ]; then
  cp "$FRAMEWORK" "$CHUNKS_DIR/framework.js"
  echo "JS: $(basename $FRAMEWORK) -> framework.js"
fi

# App-specific chunks in app/ subdirectory
mkdir -p "$CHUNKS_DIR/app"
for hashed_file in "$CHUNKS_DIR"/app/*-*.js; do
  if [ -f "$hashed_file" ]; then
    base=$(basename "$hashed_file")
    # Extract the name before the hash: "page-abc123.js" -> "page.js"
    unhashed=$(echo "$base" | sed 's/-[a-f0-9]\{16,\}\.js$/.js/')
    if [ "$base" != "$unhashed" ]; then
      cp "$hashed_file" "$CHUNKS_DIR/app/$unhashed"
      echo "JS: app/$base -> app/$unhashed"
    fi
  fi
done

# Handle nested app directories
for dir in "$CHUNKS_DIR"/app/*/; do
  if [ -d "$dir" ]; then
    dirname=$(basename "$dir")
    for hashed_file in "$dir"*-*.js; do
      if [ -f "$hashed_file" ]; then
        base=$(basename "$hashed_file")
        unhashed=$(echo "$base" | sed 's/-[a-f0-9]\{16,\}\.js$/.js/')
        if [ "$base" != "$unhashed" ]; then
          cp "$hashed_file" "$dir$unhashed"
          echo "JS: app/$dirname/$base -> app/$dirname/$unhashed"
        fi
      fi
    done
  fi
done

echo "Post-build virtual path creation complete!"
