import { Module } from '@nestjs/common';
import { CadastralService } from './cadastral.service';
import { CadastralController } from './cadastral.controller';
import {Cadastr} from "./cadastral.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {FilesModule} from "../files/files.module";

@Module({
    providers: [CadastralService],
    controllers: [CadastralController],
     imports: [
      SequelizeModule.forFeature([Cadastr]),
        FilesModule
    ]
  })

export class CadastralModule {}
