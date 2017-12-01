import Swagger from 'swagger-client'

export class OpenApiSwagger {
  
  constructor(specUrl) {
    this.specUrl = specUrl
  }

  connect(cb) {
    Swagger(this.specUrl)
      .then(
        (client) => {
          cb(client, false)
        }
      )
      .catch(
        (err) => {
          cb(null, err)
        }
      )
  }

}
