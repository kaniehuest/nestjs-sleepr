import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { CreateUser } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUser } from './dto/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUser: CreateUser) {
        await this.validateCreateUser(createUser)

        return this.usersRepository.create({
            ...createUser,
            password: await bcrypt.hash(createUser.password, 10)
        })
    }

    private async validateCreateUser(createUser: CreateUser) {
        try {
            await this.usersRepository.findOne({email: createUser.email})
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

    async getUser(getUser: GetUser) {
        return this.usersRepository.findOne(getUser)
    }
}
