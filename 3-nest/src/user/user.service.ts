import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users:Map<number,User> = new Map<number,User>();

    constructor(){
        this.populate();
    }

    getAll(){
       var populatedData = [];
       for (const user of this.users.values()){
           populatedData.push(user.toJson());
       }
       return populatedData;
    }

    populate(){
        this.users.set(1,new User(1,"Finka",28,"finka@email.com","12345"));
        this.users.set(2,new User(2,"Monika",33,"monika@email.com","123456"));
        this.users.set(3,new User(3,"Frost",31,"frost@email.com","1234567"));
        this.users.set(4,new User(4,"Ash",32,"ash@email.com","12345678"));
    }

    logAllUser(){
        for(const [key,user] of this.users.entries()){
          console.log(key);
          user.log();
        }
    }

    register(user:any){
        var newUser: User;
        newUser = new User(user?.id, user?.name, user?.age, user?.email, user?.password);
        this.users.set(user.id, newUser);
        this.logAllUser();
    }

    replaceValues(id:number, user:any){
        var newUser: User;
        newUser = new User(user?.id, user?.name, user?.age, user?.email, user?.password);
        this.users.set(user.id, newUser);
        this.logAllUser();
    }

    removeValues(id:number){
        if(this.users.has(id)){
            this.users.delete(id);
        }
        else console.log(id+" does not exist in database!");
      }

}
