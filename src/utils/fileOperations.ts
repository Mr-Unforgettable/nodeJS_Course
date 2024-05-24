import { promises as fs } from "node:fs";

// Helper function to read and write the contents of the file.
export const readJSONFile = async <T>(filePath: string): Promise<T> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    //return [];
    throw new Error("Error reading file");
  }
};

export const writeJSONFile = async <T>(filePath: string, data: T): Promise<void> => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log("File Written Successfully ✅");
  } catch (error) {
    console.error(`Error writing file ${filePath}`, error);
    throw new Error("Error writing file");
  }
};
 
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const initializeFile = async (filePath: string, initialData: object): Promise<void> => {
  try {
    await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
  } catch (error) {
    console.error(`Error initializing file ${filePath}:`, error);
    throw new Error('Error initializing file');
  }
}
