export const fileNameExtractor = (fileName: string) => {
    if (fileName === '' || fileName === null) return null
    const filePath = fileName.split("files")[1]
    const normalizedFileName = filePath.replace(/\\/g, '/')
    return normalizedFileName
}