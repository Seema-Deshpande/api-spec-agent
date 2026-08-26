const { Command } = require("commander");
const path = require("path");
const { generateOpenApiJson } = require("../dist/agent");
const { parseAndSave } = require("../dist/formatter");

const program = new Command();

program
	.name("api-spec-agent")
	.description("Generate OpenAPI 3.0 specifications from plain English")
	.version("1.0.0");

program
	.command("generate")
	.description("Generate an OpenAPI specification")
	.requiredOption("-d, --description <description>", "Application description")
	.option("-o, --output <file>", "Output file", "api-spec.json")
	.action((options) => {
		try {
			console.log("Starting API Spec Agent...");

			const rawSpec = generateOpenApiJson(options.description);
			const outputPath = path.resolve(options.output);
			parseAndSave(rawSpec, outputPath);

			console.log("Done! Your API spec is ready.");
		} catch (error) {
			console.error("Error:", error instanceof Error ? error.message : error);
			process.exitCode = 1;
		}
	});

program.parse();
