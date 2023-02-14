import {Body, Controller, Post, Get, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateCadastrDto} from "./dto/create-cadastral.dto";
import {UploadCadastrDto} from "./dto/upload-cadastral.dto";
import {PathCadastrDto} from "./dto/path-cadastral.dto";
import {Cadastr} from "./cadastral.model";
import {CadastralService} from "./cadastral.service";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Работа с кадастровыми файлами')
@Controller('cadastral')
export class CadastralController {

    constructor(private cadastrService: CadastralService) {}

    @ApiOperation({summary: 'Обработка отдельного .pdf файла'})
    @ApiResponse({status: 200, type: Cadastr})
    @Post('/pdf')
    @UseInterceptors(FileInterceptor('namepdffile'))
    createCadastr(@Body() dto: CreateCadastrDto,
            @UploadedFile() namepdffile) {
        return this.cadastrService.create(dto, namepdffile)
    }

    @ApiOperation({summary: 'Обработка отдельного .zip файла'})
    @ApiResponse({status: 200, type: Cadastr})
    @Post('/zip')
    @UseInterceptors(FileInterceptor('namedoc'))
    uploadZipFile(@Body() dto: UploadCadastrDto,
            @UploadedFile() namedoc) {
        return this.cadastrService.upload(dto, namedoc)
    }

    @ApiOperation({summary: 'Обработка файлов в отдельной папке'})
    @ApiResponse({status: 200, type: Cadastr})
    @Post('/path')
    pathFiles(@Body() dto: PathCadastrDto) {
        return this.cadastrService.path(dto)    
    }

    @ApiOperation({summary: 'Получить все записи из таблицы Cadastral'})
    @ApiResponse({status: 200, type: Cadastr})
    @Get()
    getAll() {
        return this.cadastrService.getAllCadastr();
    }
}
