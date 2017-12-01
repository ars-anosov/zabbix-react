# Version: 1.0.0

FROM node:8

MAINTAINER Arseniy Anosov <ars.anosov@gmail.com>

ENV ZX_URL=undefined
ENV ZX_USER=undefined
ENV ZX_PASS=undefined

RUN git clone https://github.com/ars-anosov/zabbix-react.git && \
  cd zabbix-react/node-back && \
  npm install

WORKDIR /zabbix-react/node-back

CMD node index.js $ZX_URL $ZX_USER $ZX_PASS