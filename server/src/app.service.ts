import { Injectable } from '@nestjs/common';
import { Request } from 'express'; // objek module dari express

// File service ini bertanggung jawab untuk mengolah data yang ingin dikembalikan (ke client)
// semua logic tentang mengahandle data, akan berada dibagian file service ini
// lalu setelah data berhasil diolah, maka biasanya akan dikembalikan lagi ke file controller sebagai response
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  // Contoh pengelolaan request dengan penggunakan objek "Request" dari module express
  getProfile(request: Request): string | number {
    return `Hello ${request.query.name}`;
  }

  getPerson(nama: string, id: string | number): string {
    return `id : ${id} \n nama: ${nama}`;
  }
}
