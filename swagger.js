const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // specify the version of OpenAPI Specification
    info: {
      title: 'Term Game',
      version: '1.0.0',
      description: 'Term Game API EndPoint',
    },
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;