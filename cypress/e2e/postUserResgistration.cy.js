import request from "../pageObject/request.helper.js";
import schema from '../fixtures/userRegistration.schema.json';
import headerData from "../pageObject/header.data.js";
import endpoints from "../endpoints/endpoints.js";
import { setUserData } from "../data/userRegistration.data.js";

describe('POST /userRegistration', () => {
  it('POST user resgistration with valid data', () => {
    request.getResponse("POST", endpoints.registerEndpoint, setUserData().validUserCreds, headerData.defaultHeaders).then((response) => {
      expect(response.status).eq(200);
      request.validateSchema(response.body, schema)
    })
  });

  it('POST user resgistration with missing password', () => {
    request.getResponse("POST", endpoints.registerEndpoint, setUserData().missingPassword, headerData.defaultHeaders).then((response) => {
      expect(response.status).eq(400);
      expect(response.body.error).to.eq("Missing password")
    })
  });

  it('POST user resgistration with missing email', () => {
    request.getResponse("POST", endpoints.registerEndpoint, setUserData().missingEmail, headerData.defaultHeaders).then((response) => {
      expect(response.status).eq(400);
      expect(response.body.error).to.eq("Missing email or username")
    })
  });

  it('POST user resgistration with invalid data', () => {
    request.getResponse("POST", endpoints.registerEndpoint, setUserData().invalidUserRegistration, headerData.defaultHeaders).then((response) => {
      expect(response.status).eq(400);
      expect(response.body.error).to.eq("Note: Only defined users succeed registration")
    })
  });

  it('POST user resgistration without password and email', () => {
    request.getResponse("POST", endpoints.registerEndpoint, setUserData().emptyDataUserRegistration, headerData.defaultHeaders).then((response) => {
      expect(response.status).eq(400);
      expect(response.body.error).to.eq("Missing email or username")
    })
  });
})
