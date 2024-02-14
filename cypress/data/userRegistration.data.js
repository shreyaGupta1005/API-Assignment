export function setUserData() {
    return {
        "validUserCreds":{
            "email": "eve.holt@reqres.in",
            "password": "pistol"
        },
        "invalidUserRegistration": {
            "email": "georgr@gmail.com",
            "password": "george"
        },

        "emptyDataUserRegistration": {
            "email": "",
            "password": ""
        },
        "missingPassword":{
            "email": "eve.holt@reqres.in",
            "password": ""
        },
        "missingEmail":{
            "email": "",
            "password": "pistol"
        },
        "validLoginCred":{
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
        }
    }
}