//azure config
const { BlobServiceClient } = require("@azure/storage-blob");
const getStream = require("into-stream");
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
);
//reference to containerClient
const myContainer = blobServiceClient.getContainerClient("pdfcontainer");

//streamToBuffer function
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

//upload
const upload = async (buffer, req) => {
    const blobName = `${req.file.originalname}-${new Date().getTime()}`;
    const myBlob = myContainer.getBlockBlobClient(blobName);
    const stream = getStream(buffer);
    try {
        const uploadResponse = await myBlob.uploadStream(
            stream,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers,
            {
                blobHTTPHeaders: { blobContentType: "application/pdf" },
            }
        );
        // console.log(`file uploaded    => \n`, uploadResponse);
        return blobName;
    } catch (e) {
        console.log(e);
        throw new Error("upload function throwed !");
    }
};

//download
const download = async (blobName) => {
    const myBlob = myContainer.getBlockBlobClient(blobName);
    try {
        const downloadBlockBlobResponse = await myBlob.download();
        const downloaded = await streamToBuffer(
            downloadBlockBlobResponse.readableStreamBody
        );
        return downloaded;
    } catch (e) {
        console.log(e);
        throw new Error("download function throwed !");
    }
};

module.exports = { upload, download };
