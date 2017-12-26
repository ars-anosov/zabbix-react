# zabbix-react-component

## Overview
React components for Zabbix-API interaction.
Works with backend API - [zabbix-reactor](https://github.com/ars-anosov/zabbix-react/tree/master/node-back).

## Usage
**specUrl** - path to [zabbix-reactor](https://github.com/ars-anosov/zabbix-react/tree/master/node-back) spec-file

``` js
import { OpenApiSwagger, HostConfig, HostGraph } from 'zabbix-react-component'

window.localStorage.setItem('token', 'test')

const specUrl = 'http://localhost:8002/spec/swagger.json'
const swg = new OpenApiSwagger(specUrl)

swg.connect((client, err) => {
  if (err) {
    ReactDOM.render(
      <div className='std-win'>no spec - <a href={specUrl}>{specUrl}</a> !</div>,
      document.getElementById('root')
    )
  }
  else {
    ReactDOM.render(
      <div>
        <HostConfig swgClient={client} headerTxt='HostConfig component' />
        <HostGraph swgClient={client} headerTxt='HostGraph component' />
      </div>,
      document.getElementById('root')
    )
  }
})
```

## Dependencies
- [swagger-js](https://github.com/swagger-api/swagger-js): for backend API [zabbix-reactor](https://github.com/ars-anosov/zabbix-react/tree/master/node-back) in [OpenAPI-Spec](https://github.com/OAI/OpenAPI-Specification) format

- [d3](https://github.com/d3/d3): visual data manipulanion tools