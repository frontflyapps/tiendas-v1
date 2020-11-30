aliyun oss rm -r -f oss://sinkoola/
aliyun oss cp dist/tienda-angular-b2b oss://sinkoola/ -r -u --meta=Cache-Control:max-age=2592000
aliyun cdn RefreshObjectCaches --ObjectType Directory --ObjectPath https://www.sinkoola.com/