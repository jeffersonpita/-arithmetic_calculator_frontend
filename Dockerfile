FROM --platform=linux/amd64 node:15.4 as build

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
ENV REACT_APP_API_URL "http://3.16.107.212/"
RUN npm run build


FROM --platform=linux/amd64  nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
 
