import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PathCadastrDto} from "../cadastral/dto/path-cadastral.dto";
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import AdmZip = require('adm-zip');
import { Console } from 'console';

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
           throw new HttpException('Произошла ошибка при обработке папки с .json/.pdf файлами', HttpStatus.INTERNAL_SERVER_ERROR)
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

        try {

        jsonFiles.forEach((item) => {
            const file=fs.readFileSync(item)
            const nowJson = JSON.parse(file.toString())
    
            if (fs.existsSync(path.join(folderName,nowJson.namePdfFile))) {
                
                compareFiles.push({
                                    uid: nowJson.uid,
                                    cadastralnumber: nowJson.cadastralNumber, 
                                    content: nowJson.content,
                                    namejsonfile: item, 
                                    namepdffile: path.join(folderName,nowJson.namePdfFile)
                })
            //console.log(compareFiles)
            } 

        });
    return compareFiles;
        } catch (e) {
            throw new HttpException('Произошла ошибка при считывании файла JSON', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async moveFiles(folderName, compareFiles) {
  
  let moveTF = true

  let folderPath = path.normalize(folderName)
  
  try {

  if (!fs.existsSync(folderPath)) {
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

}

