import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  uid: number;

  @Field((type) => String)
  @Column({ nullable: true })
  imageUrl: string;

  @Field((type) => String)
  @Column({ nullable: true })
  nickname: string;

  @Field((type) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ nullable: true })
  introducion: string;

  @Field((type) => String, { defaultValue: '무관심' })
  @Column({ default: '무관심' })
  level: string;

  @Field((type) => String)
  @Column({ select: false })
  password: string;

  @Field((type) => String)
  @Column({ nullable: true })
  refreshToken: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
