# zabbix-react-front

## Обзор
Локальный web-сервер с живыми компонентами.

## Строим среду разработки

### Node:8
В Docker-контейнер будет прокинута директория "web-front": переходим в нее.
```
cd web-front
```

Сборщиком будет gulp
```
docker run \
  --name zabbix-react-front \
  -v $PWD:/web-front \
  -w /web-front \
  --publish=8003:8003 \
  -it \
  node:8 bash

# Дальше все действия внутри контейнера:

# npm Global
npm install -g gulp-cli

# npm devDependencies
# - gulp + plugins
# - browserify
# - babelify + babel-presets
# npm dependencies
# - react + react-dom
npm install
```

## [zabbix-react-component](https://www.npmjs.com/package/zabbix-react-component)
Пилим компоненты в директории [src/js/components](https://github.com/ars-anosov/zabbix-react/tree/master/web-front/src/js/components)

Подтаскиваем необходимые зависимости
```
npm run install-components
```


### Build
Компилируем и запускаем live-reload web-сервер - [localhost:8003](http://localhost:8003/)

```
gulp
```
Выскочить из контейнера: Ctrl+P+Q


### npm publish
Прогоняем через Babel

```
cd src/js/components

gulp clean
gulp
```

Публикуем на npmjs.org
```
grep version package.json
sed -i -e 's/"version": "2.0.1"/"version": "2.0.2"/' package.json

npm login
npm publish
```