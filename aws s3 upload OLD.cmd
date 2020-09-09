aws s3 sync --acl public-read --metadata-directive REPLACE --cache-control max-age=3600,public dist/tienda-angular-b2b s3://tienda.cubanearme.com --delete
aws cloudfront create-invalidation --distribution-id E27GB2YQ36P0O --paths "/*"

pause
