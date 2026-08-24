import { SchemaDefinition } from "./types";

export const DEFAULT_SERVER = "https://api.example.com";

export const COMMON_FIELDS: Record<string, SchemaDefinition> = {
  id: { type: "string", format: "uuid", description: "Unique identifier" },
  createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
  updatedAt: { type: "string", format: "date-time", description: "Last update timestamp" },
  name: { type: "string", description: "Name" },
  email: { type: "string", format: "email", description: "Email address" },
  price: { type: "number", format: "double", description: "Price" },
  quantity: { type: "integer", format: "int32", description: "Quantity" },
  status: { type: "string", description: "Status" },
};
