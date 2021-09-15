aws s3 sync --acl public-read --metadata-directive REPLACE --cache-control max-age=1200,public dist/tienda-angular-b2b s3://www.mibulevar.com --delete
aws cloudfront create-invalidation --distribution-id E2SDTK0QPMLF3V --paths "/*"
