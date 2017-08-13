#!/usr/bin/env bash

PLUGINS="${HOME}/Library/Application Support/SketchUp 2017/SketchUp/Plugins"

cp -v ../sketchup-react-demo.rb "${PLUGINS}/sketchup-react-demo.rb" 
cp -v -r ../sketchup-react-demo "${PLUGINS}/sketchup-react-demo"
cp -v -r ./build/*  "${PLUGINS}/sketchup-react-demo/html"
