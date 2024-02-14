# is-my-json-valid

This is a custom fork of the [`is-my-json-valid`](https://github.com/mafintosh/is-my-json-valid) repo for internal use at Cypress.io. Originally, we used
a fork created by Gleb Bahmutov that added custom functionality required for our internal services to function properly.

In June 2022, it was discovered that `jsonpointer` had a critical vulnerability. **This is the sole reason for the existence of this package.** If we 
find a way to use `is-my-json-valid` directly, then we will no longer need to use this package. 