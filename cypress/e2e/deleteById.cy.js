import request from "../pageObject/request.helper.js";
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";

describe('POST / Delete unknown resource and user by id', () => {

  it('Delete unknown resource', () => {
    request.getResponse("DELETE", endpoints.resourceById," ", headerData.defaultHeaders).then((response) => {
      //Verify response status
      expect(response.status).to.eq(204);
    })
  });
  it('Delete user by id', () => {
    request.getResponse("DELETE", endpoints.userId," ", headerData.defaultHeaders).then((response) => {
      //Verify response status
      expect(response.status).to.eq(204);
    })
  });

})
