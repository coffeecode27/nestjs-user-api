// File controller ini akan menjadi file yang akan menghandle segala request dari client
// lalu file ini juga menjadi tempat  dimana kita melakukan setting untuk routes
// dan controller juga sebagai file yang mengarahkan kita ke service yang mana yang akan dijalankan
// karna untuk masalah menghandle data, akan berada di file service
import {
  Controller,
  Get,
  // HttpCode,
  Post,
  Req,
  Query,
  Param,
} from '@nestjs/common'; // sumber decorator
import { AppService } from './app.service';
import { Request } from 'express'; // objek module dari express

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@Get adalah decorator untuk method getHello, artinya jika ada request masuk dengan method get
  // akan menjalankan method getHello()
  @Get()
  getHello(): string {
    return this.appService.getHello(); //pada bagian ini, file service akan dijalankan untuk mengembalikan nilai
  }

  // Contoh mengahandle request pada route dengan method get dan menggunakan objek "Request" dari express
  @Get('/profile')
  getProfile(@Req() request: Request): string | number {
    // console.log(request.query.name);
    return this.appService.getProfile(request);
  }
  // Contoh mengahandle request pada route dengan method post
  @Post('/user')
  // @HttpCode(204) // cara mengubah status code dari yang awalnya(201) ke (204)
  createUser() {
    return 'This fuckn user has been created';
  }

  // Contoh menghandle request pada route dengan method get dan lengsung menggunakan decorator @Query
  // dengan begini hanya akan mengambil spesifik data yang di-query (nama)
  // @Param adalah sebuah objek yang didalamnya dapat kita kirimkan nilai, contohnya id, jadinya {id: '123'}
  @Get('/person/:id')
  getPerson(@Query('nama') nama: string, @Param() params: any): string {
    // console.log(params, nama);
    return this.appService.getPerson(nama, params.id);
  }
}
