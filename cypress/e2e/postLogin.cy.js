import request from "../pageObject/request.helper.js";
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";
import { setUserData } from "../data/userRegistration.data.js";

describe('POST / Login and Logout', () => {

  it('POST user login with valid data', () => {
    request.getResponse("POST", endpoints.loginEndpoints, setUserData().validLoginCred, headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(200);
    })
  });

  it('POST user login with invalid data', () => {
    request.getResponse("POST", endpoints.loginEndpoints, setUserData().invalidUserRegistration, headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq('user not found')
    })
  });

  it('POST user logout', () => {
    request.getResponse("POST", endpoints.logout, "", headerData.defaultHeaders).then((response) => {
      expect(response.status).to.eq(200);
    })
  });

})
