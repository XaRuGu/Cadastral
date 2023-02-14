import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateCadastrDto {
    
    @ApiProperty({example: 'fdaa4276ca82da88ff12', description: 'Уникальный UID'})
    @IsString({message: 'Должно быть строкой'})
    readonly uid: string;

    @ApiProperty({example: '32:45:72:97:02:31', description: 'Кадастровый номер'})
    @IsString({message: 'Должно быть строкой'})
    readonly cadastralnumber: string;
    
    @ApiProperty({example: 'Помещение школы', description: 'Описание объекта'})
    @IsString({message: 'Должно быть строкой'})
    readonly content: string; 
    
}