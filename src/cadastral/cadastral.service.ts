import { Injectable } from '@nestjs/common';
import {CreateCadastrDto} from "./dto/create-cadastral.dto";
import {UploadCadastrDto} from "./dto/upload-cadastral.dto";
import {PathCadastrDto} from "./dto/path-cadastral.dto";
import {InjectModel} from "@nestjs/sequelize";
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
        const cadastr = await this.cadastrRepository.bulkCreate(compareFiles) 
        return cadastr;
    }

    async path(dto: PathCadastrDto) {
        const compareFiles = await this.fileService.pathFiles(dto.pathcadastral);
        const cadastr = await this.cadastrRepository.bulkCreate(compareFiles)
            // [{ cadastralnumber: '21:45:74:34', content: 'Testing 01', pathdoc: 'c:\\js\\in', namedoc:'cadastral01.pdf' },
            // { cadastralnumber: '83:41:70:36', content: 'Testing 01', pathdoc: 'c:\\js\\in', namedoc:'cadastral02.pdf' }
            // , { fields: ['cadastralnumber', 'namedoc']}] 
        return cadastr;
    }

    async getAllCadastr() {
        const cadastr = await this.cadastrRepository.findAll({include: {all: true}});
        return cadastr;
    }
}
