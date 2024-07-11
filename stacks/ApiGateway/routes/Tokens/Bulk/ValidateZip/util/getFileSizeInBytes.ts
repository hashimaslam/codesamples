import * as fs from "fs";

export const getFileSizeInBytes = (filePath: string) => {
  const stats = fs.statSync(filePath);
  return stats.size; // to convert to megabytes: `returnedValue / (1024*1024)`
};
