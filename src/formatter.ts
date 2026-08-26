declare const require: (moduleName: string) => {
    writeFileSync: (filePath: string, data: string, encoding: string) => void;
};

const fs = require('fs');

export function parseAndSave (rawResponse: string, outputPath: string): void {
    // Remove markdown code block formatting if present

    const cleanedResponse = rawResponse.replace(
        /```json/g, '')
        .replace(/```/g, '')
        .trim();

    // Validate JSON
    let parsedJson: object;

    try {
        parsedJson = JSON.parse(cleanedResponse);
    } catch (error) {
       throw new Error('Claude returned invalid JSON. Try running the command again or check the response for errors.');
    }

    // Save formatted output

    const formatted = JSON.stringify(parsedJson, null, 2);
    
    fs.writeFileSync(outputPath, formatted, 'utf-8');

    console.log(`Spec saved to ${outputPath}`);
}