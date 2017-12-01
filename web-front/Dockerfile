# Version: 1.0.0

FROM node:8

MAINTAINER Arseniy Anosov <ars.anosov@gmail.com>

RUN git clone https://github.com/ars-anosov/zabbix-react.git && \
  cd zabbix-react/web-front && \
  npm install -g gulp-cli && \
  npm install && \
  npm run install-components

WORKDIR /zabbix-react/web-front

CMD /usr/local/bin/gulp --production