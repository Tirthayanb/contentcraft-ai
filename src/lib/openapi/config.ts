export const openApiConfig = {
  openapi: "3.0.3",
  info: {
    title: "ContentCraft AI APIs",
    version: "1.0.0",
    description:
      "Authentication endpoints for ContentCraft AI. Sessions are stored in an httpOnly cookie containing a signed JWT.",
  },
  servers: [{ url: "/", description: "Current origin" }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: process.env.SESSION_COOKIE_NAME || "contentcraft_session",
        description:
          "JWT session cookie set by signup/login. Cookie name may be overridden by SESSION_COOKIE_NAME.",
      },
    },
  },
};
