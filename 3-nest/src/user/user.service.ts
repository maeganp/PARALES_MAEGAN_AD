import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users:Map<number,User> = new Map<number,User>();

    constructor(){
        this.populate();
    }

    // private user:Array<{}> = [
    //     {
    //       "id": 1,
    //       "name": "Finka",
    //       "age": 28,
    //       "email": "finka@email.com"
    //     },
    //     {
    //       "id": 2,
    //       "name": "Monika",
    //       "age": 33,
    //       "email": "monika@email.com"
    //     },
    //     {
    //       "id": 3,
    //       "name": "Frost",
    //       "age": 31,
    //       "email": "frost@email.com"
    //     },
    //     {
    //       "id": 4,
    //       "name": "Ash",
    //       "age": 32,
    //       "email": "ash@email.com"
    //     },
    //     {
    //       "id": "11",
    //       "name": "ela",
    //       "age": "31",
    //       "email": "ela@email.com"
    //     }
    //   ]
    
    searchUser(){
      for(const user of this.users){
        if(user['id']==="1"){
          return user;
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
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

    replaceUser(id:number, user:any){
        var newUser: User;
        newUser = new User(user?.id, user?.name, user?.age, user?.email, user?.password);
        this.users.set(id, newUser);
        this.logAllUser();
    }

    removeUser(id:number){
        if(this.users.has(id)){
            this.users.delete(id);
        }
        else console.log(id+" does not exist in database!");
      }

}
