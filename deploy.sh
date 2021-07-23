aliyun oss rm -r -f oss://tienda-marinasmarlin 
aliyun oss cp dist/tienda-angular-b2b oss://tienda-marinasmarlin/ -r -u --meta=Cache-Control:max-age=600
aliyun cdn RefreshObjectCaches --ObjectType Directory --ObjectPath https://tienda.marinasmarlin.com/