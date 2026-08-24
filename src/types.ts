export type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "head" | "options";

export type SchemaDefinition = {
  type: string;
  properties?: Record<string, SchemaDefinition>;
  required?: string[];
  items?: SchemaDefinition;
  format?: string;
  description?: string;
  nullable?: boolean;
  example?: unknown;
};

export type OpenApiPathItem = {
  summary?: string;
  description?: string;
  parameters?: Array<Record<string, unknown>>;
  get?: Record<string, unknown>;
  post?: Record<string, unknown>;
  put?: Record<string, unknown>;
  patch?: Record<string, unknown>;
  delete?: Record<string, unknown>;
  head?: Record<string, unknown>;
  options?: Record<string, unknown>;
};

export type OpenApiSpec = {
  openapi: "3.0.3";
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{ url: string; description?: string }>;
  tags: Array<{ name: string; description: string }>;
  paths: Record<string, OpenApiPathItem>;
  components: {
    schemas: Record<string, SchemaDefinition>;
  };
};
