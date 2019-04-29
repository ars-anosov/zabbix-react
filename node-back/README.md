# zabbix-reactor-node

## Обзор
- Для общения с Zabbix-API использует модуль [request](https://github.com/request/request).

## Container NodeJS
В Docker-контейнер будет прокинута директория "node-back": переходим в нее.
```
cd node-back
```

### API
Проверяем поле "host" в спецификации [api/zabbix-api.yaml](https://github.com/ars-anosov/zabbix-react/blob/master/node-back/api/zabbix-api.yaml)
```yaml
host: '192.168.13.97:8002'
```

Правим под свой IP
```bash
sed -i -e "s/host: '192.168.13.97:8002'/host: 'ADD.IP.ADDR.HERE:8002'/" api/zabbix-api.yaml
```

### Настройки коннекта с ZabbixServer
Все в [zxSettings.json](https://github.com/ars-anosov/zabbix-react/blob/master/node-back/zxSettings.json)
```json
{
    "zxUrl"             : "http://zabbix.server.url/api_jsonrpc.php",
    "zxUser"            : "Admin",
    "zxPass"            : "zabbix",
    "delHostAllowed"    : false,
    "modHostAllowed"    : true,
    "addHostAllowed"    : true,
    "hostGroups"        : [
        {"id":4,    "desc":"Zabbix servers"},
        {"id":15,   "desc":"my own"}
    ]
}
```
- **zxUrl** - Старые версии заббикса могут принимать запросы на другом URL. Смотрим [Zabbix doc.](https://www.zabbix.com/documentation/2.2/ru/manual/api)
- **zxUser/Pass** - Zabbix пользователь
- **hostGroups** - id "Host groups" с Zabbix-сервера с которыми разрешено работать (desc - просто описание для себя)
- **del/mod/addHostAllowed** - разрешено ли удалять/менять/добавлять Host на Zabbiz

Настраиваем под себя

### Start
Запускаем "zabbix-reactor-node"
```
sudo docker run \
  --name zabbix-reactor-node \
  -v $PWD:/zabbix-reactor-node \
  -w /zabbix-reactor-node \
  --publish=8002:8002 \
  -it \
  node:10 bash
```


Дальше все действия внутри контейнера.

```
npm install
node index.js zxSettings.json
```
Выскочить из контейнера : Ctrl+P+Q
