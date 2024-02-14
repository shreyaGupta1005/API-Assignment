import request from "../pageObject/request.helper.js";
import schema from '../fixtures/resource.schema.json';
import userListSchema from '../fixtures/userList.schema.json';
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";

describe('GET /resource', () => {
  it('GET resource list and validate its response status and schema', () => {
    request.getResponse("GET", endpoints.resourceEndpoint, "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(200);
      request.validateSchema(response.body,schema)
    })
  });
  
  it('GET user list and validate its response status and schema', () => {
    request.getResponse("GET", endpoints.userList, "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(200);
      request.validateSchema(response.body,userListSchema)
    })
  });
})
