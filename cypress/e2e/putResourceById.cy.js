import request from "../pageObject/request.helper.js";
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";

describe('PUT/ unknown resource and user ', () => {

  it('PUT unknown resource', () => {
    request.getResponse("PUT", endpoints.resourceById," ", headerData.defaultHeaders).then((response) => {
      //Verify response status
      expect(response.status).to.eq(200);
      expect(response.body.updatedAt).includes("2024")
    })
  });

  it('PUT user by id', () => {
    request.getResponse("PUT", endpoints.userId," ", headerData.defaultHeaders).then((response) => {
      //Verify response status
      expect(response.status).to.eq(200);
      expect(response.body.updatedAt).includes("2024")
    })
  });

})
