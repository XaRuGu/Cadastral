import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsNotEmpty} from "class-validator";

export class CadastrDto {
    
    @ApiProperty({example: 'fdaa4276ca82da88ff12', description: 'Уникальный UID'})
    @IsString({message: 'Должно быть строкой'})
    @IsNotEmpty()
    readonly uid: string;

    @ApiProperty({example: '32:45:72:97:02:31', description: 'Кадастровый номер'})
    @IsString({message: 'Должно быть строкой'})
    @IsNotEmpty()
    readonly cadastralnumber: string;
    
    @ApiProperty({example: 'Помещение школы', description: 'Описание объекта'})
    @IsString({message: 'Должно быть строкой'})
    readonly content: string; 

    @ApiProperty({example: '32_45_72_97_02.json', description: 'Имя файла .json'})
    @IsString({message: 'Должно быть строкой'})
    @IsNotEmpty()
    readonly namejsonfile: string;
    
    @ApiProperty({example: '32_45_72_97_02.pdf', description: 'Имя файла .pdf'})
    @IsString({message: 'Должно быть строкой'})
    @IsNotEmpty()
    readonly namepdffile: string;
}
