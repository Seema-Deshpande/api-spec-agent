export function buildPrompt( userInput: string) : string {
    const normalized = userInput.toLowerCase();
    return `
    You are an expert API designer.
    The user will describe an application in plain English. Generate a complete OPENAPI 3.0 specification in valid JSON.
    
    Rules:
    - Return ONLY valid JSON - no explanations, no markdown backticks
    - Include all standard REST endpoints (GET, POST, PUT, DELETE)
    - Include request body schemas with field types and descriptions
    - Include response schemas for 200, 201, 400, 404, 500
    - Use clear descriptive operationIDs
    - FOllow REST naming conventions for endpoints (/users, /users/{id}, etc)
    - Should be able to import the generated JSON into Postman or Swagger UI without errors
    - Include all relevant fields for each resource, including common fields like id, createdAt, updatedAt, status, name, email, price, quantity, total, etc.
    - Infer resources from the user description and generate schemas for them
    - Use PascalCase for schema names and camelCase for field names
    - Include descriptions for each endpoint and schema
    - Include a title and description for the API based on the user description
    - Include a default server URL (https://api.example.com)

    User description: ${userInput}
    Generate a complete OpenAPI 3.0 specification in valid JSON format based on the above description.
    `
}