#!/bin/sh

echo "Zippping files for deployment"
zip -r deploy.zip app.js package-lock.json package.json variables.env bin controllers middleware models routes client/build