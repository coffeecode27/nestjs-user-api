import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalGuard } from 'src/auth/local/local.guard';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Users } from 'output/entities/Users';
import { UsersEmail } from 'output/entities/UsersEmail';
import { UsersPhones } from 'output/entities/UsersPhones';
import { PhoneNumberType } from 'output/entities/PhoneNumberType';
import { BusinessEntity } from 'output/entities/BusinessEntity';
import { Roles } from 'output/entities/Roles';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';

// Nantinya UsersModule ini akan di import kedalam appModule agar bisa digunakan(secara global)
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      PhoneNumberType,
      Roles,
      BusinessEntity,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'jwt',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [UsersService, LocalGuard, JwtGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class GlobalModule {}
