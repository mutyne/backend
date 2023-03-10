import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field((type) => Boolean)
  success: boolean;

  @Field((type) => Number)
  statusCode: number;

  @Field((type) => String, { nullable: true })
  data?: string;

  @Field((type) => String, { nullable: true })
  message?: string;
}
