import { OpenApiSpec, SchemaDefinition } from "./types";
import { DEFAULT_SERVER } from "./constants";
import { inferResources, createSchemaFromResource } from "./resources";
import { buildPaths } from "./paths";
import { toPascalCase } from "./utils";

export function generateOpenApiSpec(input: string): OpenApiSpec {
  const cleanInput = input.trim();
  const title = cleanInput ? cleanInput.split(/\s+/).slice(0, 6).join(" ") : "Generated API";
  const resources = inferResources(cleanInput);
  const schemas: Record<string, SchemaDefinition> = {};

  for (const resource of resources) {
    const singular = resource.replace(/s$/, "");
    const typeName = toPascalCase(singular);
    schemas[typeName] = createSchemaFromResource(resource);
  }

  const spec: OpenApiSpec = {
    openapi: "3.0.3",
    info: {
      title: `${title} API`,
      version: "1.0.0",
      description: `Auto-generated OpenAPI 3.0 specification for: "${cleanInput || "API"}"`,
    },
    servers: [{ url: DEFAULT_SERVER, description: "Local development server" }],
    tags: resources.map((resource) => ({
      name: resource,
      description: `${toPascalCase(resource)} management endpoints`,
    })),
    paths: buildPaths(resources),
    components: {
      schemas,
    },
  };

  return spec;
}

export function generateOpenApiJson(input: string): string {
  return JSON.stringify(generateOpenApiSpec(input), null, 2);
}

export function parseEnglishToOpenApi(input: string): OpenApiSpec {
  return generateOpenApiSpec(input);
}

export default {
  generateOpenApiSpec,
  generateOpenApiJson,
  parseEnglishToOpenApi,
};
