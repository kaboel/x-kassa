FROM ubuntu

WORKDIR /usr/src/x-kassa

RUN apt update
RUN apt install curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN node --version
RUN npm --version

RUN npm install -g pm2
RUN pm2

COPY . .

EXPOSE 8080
CMD ["pm2", "app.js", "--watch"]