export const fileNameExtractor = (fileName: string) => {
    const filePath = fileName.split("files")[1]
    const normalizedFileName = filePath.replace(/\\/g, '/')
    return normalizedFileName
}