import { OpenApiPathItem } from "./types";
import { toPascalCase, sanitizeName } from "./utils";

export function buildPathItem(resourceName: string): OpenApiPathItem {
  const singular = resourceName.replace(/s$/, "");
  const schemaName = toPascalCase(singular);
  const itemRef = `#/components/schemas/${schemaName}`;

  const itemTemplate = {
    summary: `Get ${singular}`,
    description: `Returns a single ${singular} record.`,
    operationId: `${sanitizeName(singular)}_get`,
    responses: {
      "200": {
        description: "Successful response",
        content: {
          "application/json": {
            schema: { $ref: itemRef },
          },
        },
      },
      "404": {
        description: `${singular} not found`,
      },
    },
  };

  const collectionTemplate = {
    summary: `List ${resourceName}`,
    description: `Returns a list of ${resourceName}.`,
    operationId: `${sanitizeName(resourceName)}_list`,
    responses: {
      "200": {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: { $ref: itemRef },
                },
                total: { type: "integer", format: "int32" },
              },
            },
          },
        },
      },
    },
  };

  return {
    summary: `${resourceName} collection`,
    description: `Operations for ${resourceName}.`,
    get: collectionTemplate,
    post: {
      summary: `Create ${singular}`,
      description: `Creates a new ${singular}.`,
      operationId: `${sanitizeName(singular)}_create`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: itemRef },
          },
        },
      },
      responses: {
        "201": {
          description: "Created successfully",
          content: {
            "application/json": {
              schema: { $ref: itemRef },
            },
          },
        },
      },
    },
    put: {
      summary: `Replace ${singular}`,
      description: `Replaces an existing ${singular} record.`,
      operationId: `${sanitizeName(singular)}_replace`,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: itemRef },
          },
        },
      },
      responses: {
        "200": {
          description: "Updated successfully",
          content: {
            "application/json": {
              schema: { $ref: itemRef },
            },
          },
        },
      },
    },
    patch: {
      summary: `Update ${singular}`,
      description: `Partially updates an existing ${singular}.`,
      operationId: `${sanitizeName(singular)}_update`,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object", additionalProperties: true },
          },
        },
      },
      responses: {
        "200": {
          description: "Patched successfully",
          content: {
            "application/json": {
              schema: { $ref: itemRef },
            },
          },
        },
      },
    },
    delete: {
      summary: `Delete ${singular}`,
      description: `Deletes a ${singular}.`,
      operationId: `${sanitizeName(singular)}_delete`,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        "204": {
          description: "Deleted successfully",
        },
      },
    },
    head: {
      summary: `Head ${singular}`,
      description: `Returns headers for ${singular}.`,
      operationId: `${sanitizeName(singular)}_head`,
      responses: {
        "200": {
          description: "Headers returned successfully",
        },
      },
    },
    options: {
      summary: `Options for ${singular}`,
      description: `Returns allowed methods for ${singular}.`,
      operationId: `${sanitizeName(singular)}_options`,
      responses: {
        "204": {
          description: "Allowed methods returned",
        },
      },
    },
  };
}

export function buildPaths(resources: string[]): Record<string, OpenApiPathItem> {
  const paths: Record<string, OpenApiPathItem> = {};

  for (const resource of resources) {
    const singular = resource.replace(/s$/, "");
    const basePath = `/${resource}`;
    const itemPath = `${basePath}/{id}`;

    paths[basePath] = buildPathItem(resource);
    paths[itemPath] = {
      summary: `${singular} detail`,
      description: `Operations for a specific ${singular}.`,
      get: {
        summary: `Get ${singular} by id`,
        description: `Returns one ${singular}.`,
        operationId: `${sanitizeName(singular)}_get_by_id`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${toPascalCase(singular)}` },
              },
            },
          },
          "404": { description: `${singular} not found` },
        },
      },
      put: {
        summary: `Replace ${singular} by id`,
        description: `Replaces one ${singular}.`,
        operationId: `${sanitizeName(singular)}_replace_by_id`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${toPascalCase(singular)}` },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated successfully",
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${toPascalCase(singular)}` },
              },
            },
          },
        },
      },
      patch: {
        summary: `Update ${singular} by id`,
        description: `Updates one ${singular}.`,
        operationId: `${sanitizeName(singular)}_update_by_id`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          "200": {
            description: "Patched successfully",
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${toPascalCase(singular)}` },
              },
            },
          },
        },
      },
      delete: {
        summary: `Delete ${singular} by id`,
        description: `Deletes one ${singular}.`,
        operationId: `${sanitizeName(singular)}_delete_by_id`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Deleted successfully" },
        },
      },
    };
  }

  return paths;
}
