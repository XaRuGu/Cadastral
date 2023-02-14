import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsNotEmpty} from "class-validator";

export class PathCadastrDto {
    
    @ApiProperty({example: './\src/\in', description: 'Путь до папки, где находятся обрабатываемые файлы'})
    @IsString({message: 'Должно быть строкой'})
    @IsNotEmpty()
    readonly pathcadastral: string; 
    
}