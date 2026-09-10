import { PDFParse } from "pdf-parse";

// it will take the PDF file and extract all the data from the PDF and give us raw text data
export const parsePdfText = async (filePath) => {
    
    let parse;
    try {
        parse = new PDFParse({ url: filePath });

        const result = await parse.getText();

        return result.text;

    } catch (error) {
        console.log( "Error occurred in extractPdfText:", error);

        throw new Error("PDF could not be read");

    } finally {
        if (parse) {
            await parse.destroy();
        }
    }
};