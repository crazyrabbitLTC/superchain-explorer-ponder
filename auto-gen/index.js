const path = require('path');
const fs = require('fs').promises;

async function getEventSignaturesFromAbiFile(filePath) {
  const abi = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const eventSignatures = [];

  abi.forEach((item) => {
    if (item.type === 'event') {
      const inputs = item.inputs
        .map((input) => {
          const indexed = input.indexed ? ' indexed' : '';
          return `${input.type}${indexed} ${input.name}`;
        })
        .join(', ');

      const eventSignature = `event ${item.name}(${inputs})`;
      eventSignatures.push(eventSignature);
    }
  });

  return eventSignatures;
}

async function processAbiFiles(sourceDir, outputDir) {
  const result = [];
  const transformedArray = [];

  const files = await fs.readdir(sourceDir);
  for (const fileName of files) {
    if (path.extname(fileName) === '.json') {
      const filePath = path.join(sourceDir, fileName);
      const eventSignatures = await getEventSignaturesFromAbiFile(filePath);
      result.push({
        fileName,
        filePath,
        eventSignatures,
      });
      
      // Transforming to the desired structure
      const name = fileName.split(".")[0];
      const transformed = eventSignatures.map((eventSignature) => ({
        name,
        abi: filePath,
        filter: {
          event: eventSignature,
        },
      }));
      
      transformedArray.push(...transformed);
    }
  }

  const outputFilePath = path.join(outputDir, 'eventSignatures.json');
  await fs.writeFile(outputFilePath, JSON.stringify(result, null, 2));

  // Outputting the transformed array to a new text file
  const transformedOutputFilePath = path.join(outputDir, 'event-config.txt');
  const network = "mainnet"
  let transformedText = '';
  transformedArray.forEach(item => {
    transformedText += `{\n`;
    transformedText += `  name: "${item.name}",\n`;
    transformedText += `  network: "${network}",\n`;
    transformedText += `  abi: "${item.abi}",\n`;
    transformedText += `  filter: {\n`;
    transformedText += `    event: parseAbiItem("${item.filter.event}")\n`;
    transformedText += `  }\n`;
    transformedText += `},\n`;
  });

  // This writes the transformed text content to the file
  await fs.writeFile(transformedOutputFilePath, transformedText);
}

// ...

// Example usage
const sourceDir = path.join(__dirname, '../abis');  // Relative path for abis directory one level up
const outputDir = path.join(__dirname, 'output');  // Relative path for output directory inside auto-gen

processAbiFiles(sourceDir, outputDir).catch((error) => {
  console.error('An error occurred:', error);
});

// import * as path from 'path';
// import * as fs from 'fs-extra';

// type AbiItem = {
//   type: string;
//   name: string;
//   inputs: Array<{
//     type: string;
//     name: string;
//     indexed?: boolean;
//   }>;
// };

// interface AbiResult {
//   fileName: string;
//   filePath: string;
//   eventSignatures: string[];
// }

// async function getEventSignaturesFromAbiFile(filePath: string): Promise<string[]> {
//   const abi: AbiItem[] = await fs.readJSON(filePath);
//   const eventSignatures: string[] = [];

//   abi.forEach((item) => {
//     if (item.type === "event") {
//       const inputs = item.inputs
//         .map((input) => {
//           const indexed = input.indexed ? " indexed" : "";
//           return `${input.type}${indexed} ${input.name}`;
//         })
//         .join(", ");

//       const eventSignature = `event ${item.name}(${inputs})`;
//       eventSignatures.push(eventSignature);
//     }
//   });

//   return eventSignatures;
// }

// async function processAbiFiles(sourceDir: string, outputDir: string): Promise<void> {
//   const result: AbiResult[] = [];

//   const files = await fs.readdir(sourceDir);
//   for (const fileName of files) {
//     if (path.extname(fileName) === '.json') {
//       const filePath = path.join(sourceDir, fileName);
//       const eventSignatures = await getEventSignaturesFromAbiFile(filePath);
//       result.push({
//         fileName,
//         filePath,
//         eventSignatures,
//       });
//     }
//   }

//   const outputPath = path.join(outputDir, 'eventSignatures.json');
//   await fs.writeJSON(outputPath, result, { spaces: 2 });
// }

// // Example usage
// const sourceDir = '../abis';  // Replace with your source ABI directory
// const outputDir = './output';  // Replace with your desired output directory

// processAbiFiles(sourceDir, outputDir).catch((error) => {
//   console.error('An error occurred:', error);
// });
