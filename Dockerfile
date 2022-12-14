FROM bitnami/node:14 as builder

WORKDIR /app/
ADD . /app/

RUN npm cache clean --force
RUN npm config get registry

ENV NODE_OPTIONS=--max-old-space-size=8000
ENV NODE_OPTIONS=--max_old_space_size=8000

RUN yarn install

RUN yarn build

FROM nginx as brottli

RUN ls -lh
COPY --from=builder app/dist/tienda-angular-b2b/ /usr/share/nginx/html/

RUN apt update && apt install brotli -y && \
cd /usr/share/nginx/html \
    && find -iname "*.js" -exec brotli -Z -v -k {} \; \
    && find -iname "*.css" -exec brotli -Z -v -k {} \; \
    && find -iname "*.ttf" -exec brotli -Z -v -k {} \; \
    && find -iname "*.js" -exec gzip -9 -v -k {} \; \
    && find -iname "*.css" -exec gzip -9 -v -k {} \;

FROM nginx:latest

EXPOSE 80/tcp

COPY --from=brottli /usr/share/nginx/html/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
