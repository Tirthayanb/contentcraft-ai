import { openApiConfig } from "./openapi/config";
import { openApiSchemas } from "./openapi/schemas";
import { authPaths } from "./openapi/paths/auth";

export const openApiSpec = {
  ...openApiConfig,
  components: {
    ...openApiConfig.components,
    schemas: openApiSchemas,
  },
  paths: {
    ...authPaths,
  },
};

export default openApiSpec;
