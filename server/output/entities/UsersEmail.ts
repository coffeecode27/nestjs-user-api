import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('pk_pmail_entity_id_and_pmail_id', ['pmailEntityId', 'pmailId'], {
  unique: true,
})
@Entity('users_email', { schema: 'users' })
export class UsersEmail {
  @Column('integer', { primary: true, name: 'pmail_entity_id' })
  pmailEntityId: number;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'pmail_id' })
  pmailId: number;

  @Column('character varying', {
    name: 'pmail_address',
    nullable: true,
    length: 50,
  })
  pmailAddress: string | null;

  @Column('timestamp without time zone', {
    name: 'pmail_modified_date',
    nullable: true,
  })
  pmailModifiedDate: Date | null;

  @ManyToOne(() => Users, (users) => users.usersEmails)
  @JoinColumn([
    { name: 'pmail_entity_id', referencedColumnName: 'userEntityId' },
  ])
  pmailEntity: Users;
  user: {
    userName: any;
    userFirstName: any;
    userLastName: any;
    userPassword: string;
  } & Users;
}
