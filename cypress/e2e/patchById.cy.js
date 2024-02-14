import request from "../pageObject/request.helper.js";
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";

describe('Update unknown resource and user by id', () => {

  it('PATCH unknown resource', () => {
    request.getResponse("PATCH", endpoints.resourceById," ", headerData.defaultHeaders).then((response) => {
      //Verify response status
      expect(response.status).to.eq(200);
      expect(response.body.updatedAt).includes("2024")
    })
  });

  it('PATCH user', () => {
    request.getResponse("PATCH", endpoints.userId," ", headerData.defaultHeaders).then((response) => {
      //Verify response status
      expect(response.status).to.eq(200);
      expect(response.body.updatedAt).includes("2024")
    })
  });
})
