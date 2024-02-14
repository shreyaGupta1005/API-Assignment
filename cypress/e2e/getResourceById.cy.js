import request from "../pageObject/request.helper.js";
import jsonSchema from '../fixtures/resourceById.schema.json'
import userSchema from '../fixtures/user.schema.json'
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";

describe('GET /resource by id', () => {
  it('GET resource by id and validate its response status and schema', () => {
    request.getResponse("GET", endpoints.resource+"1", "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(200);
      request.validateSchema(response.body,jsonSchema)
    })
  });

  it('GET resource data with incorrect id', () => {
    request.getResponse("GET", endpoints.resource+"17", "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(404);
    })
  });
  
  it('GET user by id and validate its response status and schema', () => {
    request.getResponse("GET", "users/1", "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(200);
      request.validateSchema(response.body,userSchema)
    })
  });

  it('GET user with incorrect id', () => {
    request.getResponse("GET", "users/23", "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(404);
    })
  });
})
