import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'output/entities/Users';
import { UsersEmail } from 'output/entities/UsersEmail';
import { UsersPhones } from 'output/entities/UsersPhones';
import { PhoneNumberType } from 'output/entities/PhoneNumberType';
import { BusinessEntity } from 'output/entities/BusinessEntity';
import { Roles } from 'output/entities/Roles'; // Import entitas Roles
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const salt = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    @InjectRepository(UsersEmail)
    private usersEmailRepo: Repository<UsersEmail>,
    @InjectRepository(UsersPhones)
    private usersPhonesRepo: Repository<UsersPhones>,
    @InjectRepository(PhoneNumberType)
    private phoneNumberTypeRepo: Repository<PhoneNumberType>,
    @InjectRepository(Roles) // Inject repositori untuk entitas Roles
    private rolesRepo: Repository<Roles>,
    @InjectRepository(BusinessEntity)
    private businessEntityRepo: Repository<BusinessEntity>,
    private jwtService: JwtService,
  ) {}

  public async getAllUsers() {
    try {
      const users = await this.usersRepo.find({
        select: [
          'userName',
          'userFirstName',
          'userLastName',
          'userCurrentRole',
        ],
      });
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  public async signup(fields: any) {
    try {
      const businessEntity = await this.businessEntityRepo.save({});
      const hashPassword = await bcrypt.hash(fields.password, salt);
      const userCurrentRole = await this.rolesRepo.findOne({
        where: { roleId: 2 },
      });
      // Simpan data pada tabel Users
      const user = await this.usersRepo.save({
        userEntity: businessEntity,
        userName: fields.username,
        userFirstName: fields.firstName,
        userLastName: fields.lastName,
        userPassword: hashPassword,
        userCurrentRole: userCurrentRole,
      });

      // Buat dan simpan data pada tabel UsersEmail yang berelasi dengan Users
      const userEmail = new UsersEmail();
      userEmail.pmailAddress = fields.email;
      userEmail.pmailEntity = user; // Mengaitkan dengan user yang baru dibuat
      await this.usersEmailRepo.save(userEmail);

      // Buat dan simpan data pada tabel UsersPhones yang berelasi dengan Users
      const phoneNumberType = await this.phoneNumberTypeRepo.findOne({
        where: { pontyCode: '+62' },
      });

      const userPhone = new UsersPhones();
      userPhone.uspoNumber = fields.phone;
      userPhone.uspoPontyCode = phoneNumberType; // Mengaitkan dengan PhoneNumberType yang telah ditemukan
      userPhone.uspoEntity = user; // Mengaitkan dengan user yang baru dibuat
      await this.usersPhonesRepo.save(userPhone);

      const { userPassword, ...result } = user;
      return {
        ...result,
        email: userEmail.pmailAddress,
        phone: userPhone.uspoNumber,
      };
    } catch (error) {
      return error.message;
    }
  }

  public async signUpEmployee(fields: any) {
    try {
      const businessEntity = await this.businessEntityRepo.save({});
      const hashPassword = await bcrypt.hash(fields.password, salt);
      const userCurrentRole = await this.rolesRepo.findOne({
        where: { roleId: 1 },
      });

      const user = await this.usersRepo.save({
        userEntity: businessEntity,
        userName: fields.username,
        userFirstName: fields.firstName,
        userLastName: fields.lastName,
        userPassword: hashPassword,
        userCurrentRole: userCurrentRole,
      });

      const userEmail = new UsersEmail();
      userEmail.pmailAddress = fields.email;
      userEmail.pmailEntity = user;
      await this.usersEmailRepo.save(userEmail);

      const phoneNumberType = await this.phoneNumberTypeRepo.findOne({
        where: { pontyCode: '+62' },
      });

      const userPhone = new UsersPhones();
      userPhone.uspoNumber = fields.phone;
      userPhone.uspoPontyCode = phoneNumberType;
      userPhone.uspoEntity = user;
      await this.usersPhonesRepo.save(userPhone);

      const { userPassword, ...result } = user;
      return {
        ...result,
        email: userEmail.pmailAddress,
        phone: userPhone.uspoNumber,
      };
    } catch (error) {
      return error.message;
    }
  }

  public async validateUser(name: string, password: string) {
    const user = await this.usersRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.usersEmails', 'usersEmails')
      .where('users.userName = :name OR usersEmails.pmailAddress = :name', {
        name,
      })
      .getOne();

    if (user) {
      const compare = await bcrypt.compare(password, user.userPassword);
      if (compare) {
        const { userPassword, ...result } = user;
        return result;
      }
    }
    // Jika tidak ditemukan pengguna dengan username atau email yang sesuai
    return null;
  }

  public async signin(user: any) {
    const payload = {
      id: user.userEntityId,
      username: user.userName,
      firstName: user.userFirstName,
      lastName: user.userLastName,
    };
    return {
      // kirim payload ke jwt
      access_token: this.jwtService.sign(payload),
    };
  }
}
