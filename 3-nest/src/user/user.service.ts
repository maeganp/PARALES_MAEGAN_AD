import { Injectable } from '@nestjs/common';
import { debug } from 'console';
import { truncateSync } from 'fs';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';
import { User } from './user.model';

const DEBUG: boolean = true;

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map<string, User>();

  constructor() {
    // this.populate();
    this.users = Helper.populate();
    if (DEBUG) this.logAllUser();
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

  // searchUser(){
  //   for(const user of this.users){
  //     if(user['id']==="1"){
  //       return user;
  //     }
  //   }
  // }

  searchUser(term: string): CRUDReturn {
    var results: Array<any> = [];
    for (const user of this.users.values()) {
      if (user.matches(term)) results.push(user.toJson());
    }
    return { success: results.length > 0, data: results };
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  getAll(): CRUDReturn {
    var populatedData = [];
    for (const user of this.users.values()) {
      populatedData.push(user.toJson());
    }
    return { success: true, data: populatedData };
  }

  // populate(){
  //     this.users.set(1,new User(1,"Finka",28,"finka@email.com","12345"));
  //     this.users.set(2,new User(2,"Monika",33,"monika@email.com","123456"));
  //     this.users.set(3,new User(3,"Frost",31,"frost@email.com","1234567"));
  //     this.users.set(4,new User(4,"Ash",32,"ash@email.com","12345678"));
  // }

  logAllUser() {
    for (const [key, user] of this.users.entries()) {
      console.log(key);
      user.log();
    }
  }

  // register(user:any){
  //     var newUser: User;
  //     newUser = new User(user?.id, user?.name, user?.age, user?.email, user?.password);
  //     this.users.set(user.id, newUser);
  //     this.logAllUser();
  // }

  register(body: any): CRUDReturn {
    try {
      var validBody: { valid: boolean; data: string } =
        Helper.validBodyPut(body);
      if (validBody.valid) {
        if (!this.emailExists(body.email)) {
          var newUser: User = new User(
            body.name,
            body.age,
            body.email,
            body.password,
          );
          if (this.saveToDB(newUser)) {
            if (DEBUG) this.logAllUser();
            return {
              success: true,
              data: newUser.toJson(),
            };
          } else {
            throw new Error('generic database error');
          }
        } else {
          throw new Error(`${body.email} is already used by another user!`);
        }
      } else {
        throw new Error(validBody.data);
      }
    } catch (error) {
      console.log(error.message);
      return { success: false, data: `Error adding account, ${error.message}` };
    }
  }

  getOne(id: string): CRUDReturn {
    if (this.users.has(id)) {
      return { success: true, data: this.users.get(id).toJson() };
    } else
      return {
        success: false,
        data: `User ${id} is not in database`,
      };
  }

  login(email: string, password: string): CRUDReturn {
    for (const user of this.users.values()) {
      if (user.matches(email)) return user.login(password);
    }
    return { success: false, data: `${email} not found in database` };
  }

  replaceUser(id: string, user: any) {
    var newUser: User;
    newUser = new User(
      user?.name,
      user?.age,
      user?.email,
      user?.password,
      user?.id,
    );
    this.users.set(id, newUser);
    this.logAllUser();
  }

  replaceValues(id: string, options?: { exceptionID: string }) {
    for (const user of this.users.values()) {
      if (user.replaceValues(id)) {
        if (
          options?.exceptionID != undefined &&
          user.replaceValues(options.exceptionID)
        )
          continue;
        else return true;
      }
    }
    return false;
  }

  // removeUser(id:number){
  //     if(this.users.has(id)){
  //         this.users.delete(id);
  //     }
  //     else console.log(id+" does not exist in database!");
  //   }

  getUser(id: string) {
    return this.users.get(id).toJson();
  }

  getAllUser() {
    var populateData = [];
    for (const user of this.users.values()) {
      populateData.push(user.toJson());
    }
    return populateData;
  }

  getUserID(id: string): CRUDReturn {
    if (this.users.has(id)) {
      return { success: true, data: this.users.get(id).toJson() };
    } else {
      return {
        success: false,
        data: `User ${id} not found`,
      };
    }
  }

  replaceValuePut(id: string, body: any) {
    try {
      if (this.users.has(id)) {
        var validBodyPut: { valid: boolean; data: string } =
          Helper.validBodyPut(body);
          console.log(validBodyPut);
        if (validBodyPut.valid) {
          if (!this.emailExists(body.email, { exceptionID: id })) {
            var user: User = this.users.get(id);
            var success = user.replaceValues(body);
            if (success)
              return {
                success: success,
                data: user.toJson(),
              };
            else {
              throw new Error('Failed to update.');
            }
          } else {
            throw new Error(`${body.email} is already existing.`);
          }
        } else {
          throw new Error(validBodyPut.data);
        }
      } else {
        throw new Error(`User ${id} does not exist.`);
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  loginUser(email: string, password: string):CRUDReturn {
    for(var user of this.users.values()){
      if(user.matches(email)){
        return user.login(password);
      }
    }
    return {success: false, data: `Email ${email} does not exist in the database`};
  }


  replaceValuePatch(id: string, body: any) {
    try {
      if (this.users.has(id)) {
        var validBodyPatch: { valid: boolean; data: string } =
          Helper.validBody(body);
        if (validBodyPatch.valid) {
          if (!this.emailExists(body.email, { exceptionID: id })) {
            var user: User = this.users.get(id);
            var success = user.replaceValues(body);
            if (success)
              return {
                success: success,
                data: user.toJson(),
              };
            else {
              throw new Error('Failed to update in db');
            }
          } else {
            throw new Error(`${body.email} is already in use by another user!`);
          }
        } else {
          throw new Error(validBodyPatch.data);
        }
      } else {
        throw new Error(`User ${id} is not in database`);
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  deleteUser(id: string): CRUDReturn {
    if (this.users.has(id)) {
      return {
        success: this.users.delete(id),
        data: `User ${id} has been successfully removed.`,
      };
    } else {
      return { success: false, data: `${id}  does not exist!` };
    }
  }

  toJson(): any {
    throw new Error('Method not implemented. ');
  }

  emailExists(email: string, options?: { exceptionID: string }) {
    for (const user of this.users.values()) {
      if (user.matches(email)) {
        if (
          options?.exceptionID != undefined &&
          user.matches(options.exceptionID)
        )
          continue;
        else return true;
      }
    }
    return false;
  }

  saveToDB(user: User): boolean {
    try {
      this.users.set(user.id, user);
      return this.users.has(user.id);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  logAllUsers() {
    console.log(this.getAll());
  }
}
