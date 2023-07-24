import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsersExperiences } from "./UsersExperiences";
import { Users } from "./Users";

@Index("unique_uski_id", ["uskiId"], { unique: true })
@Index("pk_uski_id_and_uski_identity_id", ["uskiId", "uskiIdentityId"], {
  unique: true,
})
@Index("users_skill_uski_skty_name_key", ["uskiSktyName"], { unique: true })
@Entity("users_skill", { schema: "users" })
export class UsersSkill {
  @PrimaryGeneratedColumn({ type: "integer", name: "uski_id" })
  uskiId: number;

  @Column("integer", { primary: true, name: "uski_identity_id" })
  uskiIdentityId: number;

  @Column("timestamp without time zone", {
    name: "uski_modified_date",
    nullable: true,
  })
  uskiModifiedDate: Date | null;

  @Column("character varying", {
    name: "uski_skty_name",
    nullable: true,
    unique: true,
    length: 15,
  })
  uskiSktyName: string | null;

  @ManyToMany(
    () => UsersExperiences,
    (usersExperiences) => usersExperiences.usersSkills
  )
  usersExperiences: UsersExperiences[];

  @ManyToOne(() => Users, (users) => users.usersSkills)
  @JoinColumn([
    { name: "uski_identity_id", referencedColumnName: "userEntityId" },
  ])
  uskiIdentity: Users;
}
