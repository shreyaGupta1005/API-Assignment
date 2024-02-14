import 'chai-json-schema';
import Ajv from 'ajv';
class request {
  getResponse(method, endpoint, data="{}", requestHeaders = "") {
    let response;
    switch (method) {
      case "POST":
        response = cy.request({
          method: 'POST',
          url: `https://reqres.in/api/${endpoint}`,
          failOnStatusCode: false,
          headers: requestHeaders,
          body: data
        })
        return response;
      case "PUT":
        response = cy.request({
          method: 'PUT',
          url: `https://reqres.in/api/${endpoint}`,
          failOnStatusCode: false,
          data: data,
          headers: requestHeaders
        })
        return response;
      case "GET":
        response = cy.request({
          method: 'GET',
          url: `https://reqres.in/api/${endpoint}`,
          failOnStatusCode: false,
          data: data,
          headers: requestHeaders
        })
        console.log(response)
        return response;
      case "DELETE":
        response = cy.request({
          method: 'DELETE',
          url: `https://reqres.in/api/${endpoint}`,
          failOnStatusCode: false,
          data: data,
          headers: requestHeaders
        })
        return response;
      case "PATCH":
        response = cy.request({
          method: 'PATCH',
          url: `https://reqres.in/api/${endpoint}`,
          failOnStatusCode: false,
          data: data,
          headers: requestHeaders
        })
        return response;  
      default:
        console.error("Please select correct Method POST|PUT|GET|DELETE");

    }

  }
  
  //Validate schema 
  validateSchema(response, schema) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(response);
    expect(valid).to.be.true;
    expect(response).to.be.jsonSchema(schema);

  }
}
export default new request();