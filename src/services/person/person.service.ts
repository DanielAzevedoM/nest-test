import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person as PersonEntity } from 'src/models/person/person.entity'; 
import { Person } from 'src/interfaces/person/person.interface';
import { User as UserEntity} from 'src/models/user/user.entity';
import { UpdatePerson } from 'src/interfaces/person/person.update.interface';


@Injectable()
export class PersonService {
    constructor(
    @InjectRepository(PersonEntity) private readonly personRepository: Repository<PersonEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ){}

	create(person: Person): Promise<PersonEntity>{
		return this.personRepository.save(person)
    }  

    async updateFk(id: string, person: Person): Promise<UserEntity>{
		const findUser = await this.userRepository.findOne(id)

		if(!findUser) return null;

		const userUpdate = {
			...findUser,
			person: person,
		
		}

		return this.userRepository.save(userUpdate);    
    }


    async remove(params): Promise<PersonEntity>{
		const findUser = await this.userRepository.findOne(params.userId);
	
		const findPerson = await this.personRepository.findOne(findUser.personId);
		
		if(params.id !== findUser.personId) return null;
		if(!findUser) return null;
		if(!findPerson) return null;

		const userUpdate = {
			...findUser,
			personId: null
		}

		await this.userRepository.save(userUpdate);

		return  this.personRepository.remove(findPerson)
	}

	async findOne(params): Promise<PersonEntity>{
		const findUser = await this.userRepository.findOne(params.userId);
		const findPerson = await this.personRepository.findOne(findUser.personId);

		if(params.id !== findUser.personId) return null;
		if(!findUser) return null;
		if(!findPerson) return null;
	
		return findPerson;
	}

	async update(params, person: UpdatePerson): Promise<PersonEntity>{
		const findUser = await this.userRepository.findOne(params.userId);

		const findPerson = await this.personRepository.findOne(findUser.personId);


		if(params.id !== findUser.personId) return null;
       	if(!findUser) return null;
		if(!findPerson) return null;

        const personUpdate = {
            ...findPerson,
            name: person.newName,
            gender: person.newGender,
			birthday: person.newBirthday
        }

         return this.personRepository.save(personUpdate);    
    }
	

}


