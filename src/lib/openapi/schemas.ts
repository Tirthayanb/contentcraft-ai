import { toJSONSchema } from "zod";
import { signupSchema, loginSchema } from "@/lib/auth/validation";

// Derive request JSON schemas directly from the Zod schemas using Zod v4's built-in OpenAPI 3 converter
const signupRequestSchema = toJSONSchema(signupSchema, { target: "openApi3" });
const loginRequestSchema = toJSONSchema(loginSchema, { target: "openApi3" });

export const openApiSchemas = {
  SignupRequest: signupRequestSchema,
  LoginRequest: loginRequestSchema,
  Subscription: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["inactive", "active", "past_due", "cancelled"],
      },
      planId: { type: ["string", "null"] },
      currentPeriodEnd: { type: ["number", "null"], description: "Unix milliseconds timestamp" },
    },
  },
  User: {
    type: "object",
    properties: {
      id: { type: "string", description: "MongoDB ObjectId as string" },
      email: { type: "string", format: "email" },
      role: {
        type: "string",
        enum: ["visitor", "customer", "member"],
      },
      name: { type: "string" },
      subscription: { $ref: "#/components/schemas/Subscription" },
      createdAt: { type: "number", description: "Unix milliseconds timestamp" },
      updatedAt: { type: "number", description: "Unix milliseconds timestamp" },
      lastLoginAt: { type: ["number", "null"], description: "Unix milliseconds timestamp" },
    },
  },
  AuthResponse: {
    type: "object",
    properties: {
      user: { $ref: "#/components/schemas/User" },
    },
  },
  SessionResponse: {
    type: "object",
    properties: {
      user: {
        oneOf: [{ $ref: "#/components/schemas/User" }, { type: "null" }],
      },
      role: {
        type: "string",
        enum: ["visitor", "customer", "member"],
      },
    },
  },
  LogoutResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
    },
  },
  ErrorResponse: {
    type: "object",
    properties: {
      error: { type: "string" },
      details: { type: "object", additionalProperties: true },
    },
  },
};

