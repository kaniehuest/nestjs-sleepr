import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto) {
        await this.validateCreateUser(createUserDto)

        const user = new User({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
            roles: createUserDto.roles?.map((roleDto: RoleDto) => new Role(roleDto))
        })

        return this.usersRepository.create(user)
    }

    private async validateCreateUser(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({ email: createUserDto.email })
        } catch (error) {
            return
        }

        throw new UnprocessableEntityException('Email already exists.')
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email })
        const passwordIsValid = await bcrypt.compare(password, user.password)

        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.')
        }

        return user
    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto, { roles: true })
    }
}
