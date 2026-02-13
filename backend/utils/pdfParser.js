import fs from "fs/promises";
import {PDFParse} from "pdf-parse";
import https from "https";
import http from "http";

/**
 * Download file from URL
 * @param {string} url - URL to download from
 * @returns {Promise<Buffer>}
 */
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
};

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file or URL
 * @returns {Promise<{ text: string, numPages: number }>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    let dataBuffer;
    
    // Check if it's a URL or local file path
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // Download from URL
      dataBuffer = await downloadFile(filePath);
    } else {
      // Read from local file
      dataBuffer = await fs.readFile(filePath);
    }

    // pdf-parse expects a Uint8Array, not a Buffer
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
