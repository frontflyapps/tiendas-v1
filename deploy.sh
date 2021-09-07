aliyun oss rm -r -f oss://www-tiendascaracol
aliyun oss cp dist/tienda-angular-b2b oss://www-tiendascaracol/ -r -u --meta=Cache-Control:max-age=600
aliyun cdn RefreshObjectCaches --ObjectType Directory --ObjectPath https://www.tiendascaracol.com/
