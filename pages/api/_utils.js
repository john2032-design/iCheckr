import fs from "fs";
export const MAX_IPA_BYTES = 1153433600; // 1.10 * 1024^3 rounded
export function streamFileToForm(form, file){
  form.append(file.originalFilename || file.newFilename, fs.createReadStream(file.filepath), { filename: file.originalFilename || file.newFilename });
}
