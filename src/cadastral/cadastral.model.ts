import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface CadastrCreationAttrs {
    uid: string;
    cadastralnumber: string;
    content: string;
    namejsonfile: string;
    namepdffile: string;    

}

@Table({tableName: 'cadastral'})
export class Cadastr extends Model<Cadastr, CadastrCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'fdaa4276ca82da88ff12', description: 'Уникальный UID'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    uid: string;
    
    @ApiProperty({example: '32:45:72:97:02:31', description: 'Кадастровый номер'})
    @Column({type: DataType.STRING, unique: false, allowNull: false})
    cadastralnumber: string;

    @ApiProperty({example: 'Помещение школы', description: 'Описание объекта'})
    @Column({type: DataType.STRING, allowNull: true})
    content: string;

    // @Column({type: DataType.STRING, allowNull: true})
    // namefolder: string;

    @ApiProperty({example: '32_45_72_97_02.json', description: 'Имя файла .json'})
    @Column({type: DataType.STRING})
    namejsonfile: string;
    
    @ApiProperty({example: '32_45_72_97_02.pdf', description: 'Имя файла .pdf'})
    @Column({type: DataType.STRING})
    namepdffile: string;
    
}




