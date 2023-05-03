import { HttpException, HttpStatus } from '@nestjs/common';
import { StorageEngine, diskStorage } from 'multer';
import { join, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

const createStorage = (dir: string): StorageEngine => {
    return diskStorage({
        destination: (req: Express.Request, file: Express.Multer.File, cb) => {
            const folder = join(__dirname, '../', '../', 'files', dir);
            const isDirExists = existsSync(folder);
            if (!isDirExists) mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb) => {
            const filename =
                file.fieldname +
                "-" +
                dir +
                "-" +
                Date.now().toString() +
                extname(file.originalname);

            cb(null, filename);
        },
    })
}

const fileFilter = (req: Express.Request, file: any, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4)$/)) {
        return cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
    cb(null, true);
};

const limits = {
    fieldNameSize: 300,
    fileSize: 10 * 1024 * 1024,
};

export { createStorage, fileFilter, limits }