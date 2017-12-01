# zabbix-reactor-node

## Обзор
- Nodejs сервер собран при помощи [swagger-codegen](https://github.com/swagger-api/swagger-codegen).
- Для общения с Zabbix-API использует модуль [request](https://github.com/request/request).

## Строим среду разработки

### Node:8
В Docker-контейнер будет прокинута директория "node-back": переходим в нее.
```
cd node-back
```

Проверяем поле "host" в [api/zabbix-api.yaml](https://github.com/ars-anosov/zabbix-react/blob/master/node-back/api/zabbix-api.yaml)

Если запускаем на своем машине
```yaml
host: 'localhost:8002'
```

Запускаем "zabbix-reactor-node"
```
docker run \
  --name zabbix-reactor-node \
  -v $PWD:/zabbix-reactor-node \
  -w /zabbix-reactor-node \
  --publish=8002:8002 \
  --env="ZX_URL=http://zabbix-server.react.com.ru/api_jsonrpc.php" \
  --env="ZX_USER=react_user" \
  --env="ZX_PASS=react_passwd" \
  -it \
  node:8 bash
```
Старые версии заббикса могут принимать запросы на другом URL. Смотрим [Zabbix doc.](https://www.zabbix.com/documentation/2.2/ru/manual/api)

Дальше все действия внутри контейнера.

```
npm install
node index.js $ZX_URL $ZX_USER $ZX_PASS
```
Выскочить из контейнера : Ctrl+P+Q

### Zabbix Настройки
Необходимо создать пользователя "react_user"

1. Administration/User groups - добавляем группу пользователей "react_user_group"
2. Administration/User groups/Permissions - добавляем Host groups, с которыми будет позволено работать "react_user". Выставляем Read-write.
3. Administration/Users - добавляем пользователя, включаем в группу пользователей созданную в пп.1
4. Administration/Users/Permissions - User type выставляем "Zabbix Admin"

Пользователь "react_user" для zabbix-reactor готов.