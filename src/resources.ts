import { SchemaDefinition } from "./types";
import { toPascalCase, sanitizeName } from "./utils";
import { COMMON_FIELDS } from "./constants";

export function createSchemaFromResource(resourceName: string): SchemaDefinition {
  const singular = resourceName.replace(/s$/, "");
  const capitalized = toPascalCase(singular);

  const baseProperties: Record<string, SchemaDefinition> = {
    id: COMMON_FIELDS.id,
    createdAt: COMMON_FIELDS.createdAt,
    updatedAt: COMMON_FIELDS.updatedAt,
  };

  if (resourceName.toLowerCase().includes("user")) {
    baseProperties.name = COMMON_FIELDS.name;
    baseProperties.email = COMMON_FIELDS.email;
  }

  if (resourceName.toLowerCase().includes("product")) {
    baseProperties.name = COMMON_FIELDS.name;
    baseProperties.price = COMMON_FIELDS.price;
    baseProperties.quantity = COMMON_FIELDS.quantity;
  }

  if (resourceName.toLowerCase().includes("order")) {
    baseProperties.status = COMMON_FIELDS.status;
    baseProperties.total = { type: "number", format: "double", description: "Order total" };
  }

  return {
    type: "object",
    properties: baseProperties,
    required: ["id"],
    description: `${capitalized} resource`,
  };
}

export function inferResources(input: string): string[] {
  const normalized = input.toLowerCase();
  const candidates = [
    "products",
    "orders",
    "users",
    "customers",
    "invoices",
    "items",
    "categories",
    "addresses",
    "transactions",
    "payments",
    "cart",
    "reviews",
    "posts",
    "comments",
  ];

  const found = candidates.filter((candidate) => normalized.includes(candidate));
  const customMatches = Array.from(
    normalized.matchAll(/(?:with|including|for|and)\s+([a-zA-Z][a-zA-Z0-9_\- ]{2,}?)(?:\s*(?:,|$|and))/g),
  ).map((match) => match[1].trim());

  const customResources = customMatches
    .map((raw) => raw.replace(/\b(the|an|a|and|with|including|for)\b/gi, "").trim())
    .map((raw) => raw.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((raw) => sanitizeName(raw))
    .filter((name) => name.length > 2 && !name.includes("api"));

  const combined = [...found, ...customResources];
  return combined.length > 0 ? Array.from(new Set(combined.map((item) => (item.endsWith("s") ? item : `${item}s`)))) : ["products", "orders", "users"];
}
