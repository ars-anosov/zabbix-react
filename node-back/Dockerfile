# Version: 1.0.0

FROM node:8

MAINTAINER Arseniy Anosov <ars.anosov@gmail.com>

RUN git clone https://github.com/ars-anosov/zabbix-react.git && \
  cd zabbix-react/node-back && \
  npm install

WORKDIR /zabbix-react/node-back

CMD node index.js zxSetting.json