import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PathCadastrDto } from "../cadastral/dto/path-cadastral.dto";
import { CadastrDto } from "../cadastral/dto/cadastral.dto";
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import AdmZip = require('adm-zip');

@Injectable()
export class FilesService {

    async createFile(file): Promise<string> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static')
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName;
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async uploadFile(file): Promise<any[]> {
         try {
            // const fileName = uuid.v4() + '.zip';
            const filePath = path.resolve(__dirname, '..', 'arczip')
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            
            const archivFile = path.resolve(filePath, file.originalname)
            fs.writeFileSync(archivFile, file.buffer)
            
            // console.log(archivFile)

            const arczip=new AdmZip(archivFile)
            
            arczip.extractAllTo(filePath, true)
            
            return await this.pathFiles(filePath);
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи zip файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async pathFiles(folderName): Promise<any[]> {
        try {
            
            const jsonFiles = await this.findJsonFiles(folderName)
            const compareFiles = await this.compareJsonAndPdfFiles(folderName, jsonFiles)
            const moveTF = await this.moveFiles('.\\dist\\arc', compareFiles)

           return compareFiles;
       } catch (e) {
             throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
       }
   }

    
   async findJsonFiles(folderName) {
        let jsonFiles = []    
    
        try {

        const items = fs.readdirSync(folderName, { withFileTypes: true });
        
        items.forEach((item) => {
            if (path.extname(item.name) === ".json") {
            jsonFiles.push(path.join(folderName,item.name))
            // console.log(`Found file: ${item.name} in folder: ${folderName}`);
        } 

        });
    return jsonFiles;
        } catch (e) {
            throw new HttpException('Произошла ошибка при считывании папки', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async compareJsonAndPdfFiles(folderName, jsonFiles) {
        
        let compareFiles = []

        jsonFiles.forEach((item) => {
            
            let errname: string

            try {
                
                errname = `Произошла ошибка при считывании файла JSON - ${item} `
                const file=fs.readFileSync(item)
                
                errname = `Произошла ошибка при парсинге данных из файла JSON - ${item} `
                const nowJson = JSON.parse(file.toString())
                           
                if (fs.existsSync(path.join(folderName,nowJson.namePdfFile))) {
                
                    errname = ` Произошла ошибка. В файле JSON - ${item} структура данных не соответствует данному API запросу `
                    
                    if (!nowJson.uid) {
                        throw errname = ` Произошла ошибка. В файле JSON - ${item}. Отсутствует string поле "uid". `
                    }
                    if (!nowJson.cadastralNumber) {
                        throw errname = ` Произошла ошибка. В файле JSON - ${item}. Отсутствует string поле "cadastralnumber". `
                    }
                    if (!nowJson.content) {
                        throw errname = ` Произошла ошибка. В файле JSON - ${item}. Отсутствует string поле "content". `
                    }
                    if (!nowJson.namePdfFile) {
                        throw errname = ` Произошла ошибка. В файле JSON - ${item}. Отсутствует string поле "namePdfFile". `
                    }
                    
                    compareFiles.push({
                                    uid: nowJson.uid,
                                    cadastralnumber: nowJson.cadastralNumber, 
                                    content: nowJson.content,
                                    namejsonfile: item,
                                    namepdffile: path.join(folderName,nowJson.namePdfFile)
                    })
                                    
                } 
            } catch (e) {
                throw new HttpException(errname, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        });
    return compareFiles;
        
    }

    async moveFiles(folderName, compareFiles) {
  
        let moveTF = true

        let folderPath = path.normalize(folderName)
  
        try {

            if (compareFiles && !fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, {recursive: true})
            }

            compareFiles.forEach((item) => {
    
                fs.renameSync(item.namejsonfile, path.join(folderName, path.parse(item.namejsonfile).base))
                fs.renameSync(item.namepdffile, path.join(folderName, path.parse(item.namepdffile).base))
       
            });
    return moveTF;
  } catch (e) {
      throw new HttpException('Произошла ошибка при переносе файлов', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

async readFile(itemcadastr: any) {
    let file = null    
    let errname: string

    try {

        if (itemcadastr) {
            if (fs.existsSync(itemcadastr.namepdffile)) {
    
                errname = 'Произошла ошибка при считывании файла .PDF'
                file = fs.readFileSync(itemcadastr.namepdffile)
                

                // console.log(file.buffer)
                // const foldername = path.join('C:\\JS\\NestJS\\Cadastral\\in\\', 'ex.pdf')
                // console.log(foldername)

                // fs.writeFileSync(path.join('C:\\JS\\NestJS\\Cadastral\\in\\', 'ex.pdf'), file)

            } else {
                
                throw errname = `Файл ${itemcadastr.namepdffile} не найден.`
                
            }      
        } 
    
return file;
    } catch (e) {
        
        throw new HttpException(errname, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

}