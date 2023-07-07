import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FreelancerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  hobby: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  skillSets: skillSet[];
}

class skillSet {
  id?: string;
  title: string;
  userId: string;
  status: string;
}
