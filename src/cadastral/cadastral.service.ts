import { Injectable } from '@nestjs/common';
import {CreateCadastrDto} from "./dto/create-cadastral.dto";
import {UploadCadastrDto} from "./dto/upload-cadastral.dto";
import {PathCadastrDto} from "./dto/path-cadastral.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from "sequelize";
import {Cadastr} from "./cadastral.model";
import {FilesService} from "../files/files.service";

@Injectable()
export class CadastralService {

    constructor(@InjectModel(Cadastr) private cadastrRepository: typeof Cadastr,
                private fileService: FilesService) {}

    async create(dto: CreateCadastrDto, namepdffile: any) {
        const fileName = await this.fileService.createFile(namepdffile);
        const cadastr = await this.cadastrRepository.create({...dto, namepdffile: fileName})
        return cadastr;
    }

    async upload(dto: UploadCadastrDto, namedoc: any) {
        const compareFiles = await this.fileService.uploadFile(namedoc);
        const compareFilesNow = await this.bulkFindOrCreate(compareFiles) 
        return compareFilesNow;
    }

    async path(dto: PathCadastrDto) {
        const compareFiles = await this.fileService.pathFiles(dto.pathcadastral);
        const compareFilesNow = await this.bulkFindOrCreate(compareFiles)
        // const cadastr = await this.cadastrRepository.bulkCreate(compareFiles, {validate: true})
        return compareFilesNow; 
    }

    async getAllCadastr() {
        const cadastr = await this.cadastrRepository.findAll({include: {all: true}});
        return cadastr;
    }

    async getCountAllCadastr(nOffset:any, nLimit:any) {
        const { count, rows } = await this.cadastrRepository.findAndCountAll({
            offset: nOffset,
            limit: nLimit
        });
          
        return rows;
    }

    async getPdfFileByCadasr(cadastralnumber: string) {
        const itemcadastr = await this.cadastrRepository.findOne({where: {cadastralnumber}, 
            order: [['id', 'DESC']] })
        
        const pdffile = await this.fileService.readFile(itemcadastr);
                       
        return pdffile;
    }

    async bulkFindOrCreate(compareFiles: any[] ) {
        let compareFilesNow = []

        for (let item of compareFiles) {    
            let errname: string

            const [itemNow, created] = await this.cadastrRepository.findOrCreate({
                where: { uid: item.uid },
                defaults: item
            });
                
            if (!created) {
                errname = `Ошибка. UID - ${item.uid} в файле JSON - ${item.namejsonfile} уже присутствует в БД. Запись в БД не произведена.`
            } else {
                errname = `Запись с UID - ${item.uid} из файле JSON - ${item.namejsonfile} добавлена в БД.`                    
            }
                
            compareFilesNow.push({...item, message: errname})
        }                            
           
    return compareFilesNow;
        
    }
}
