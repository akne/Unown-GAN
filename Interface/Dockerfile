FROM node:16-alpine as build
COPY . /interface
WORKDIR /interface
RUN npm install && npm run build

FROM nginx:stable-alpine
COPY --from=build /interface/build/ /usr/share/nginx/html
COPY --from=build /interface/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]