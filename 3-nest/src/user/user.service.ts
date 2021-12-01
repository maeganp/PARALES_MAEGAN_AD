import { Injectable } from '@nestjs/common';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';
import { User } from './user.model';
import * as admin from 'firebase-admin';
const DEBUG: boolean = false;

@Injectable()
export class UserService {
  private DB = admin.firestore();
  private users: Map<string, User> = new Map<string, User>();

  constructor() {
    this.users = Helper.populate();
    if (DEBUG) this.logAllUser();
  }

  async addSampleData() {
    return await this.DB.collection('sample').add({
      message: 'new instance',
      number: 12,
      someObj: { somedata: 12312412, somestring: 'sagdhjkgasjk' },
    });
  }

  searchUser(term: string): CRUDReturn {
    var results: Array<any> = [];
    for (const user of this.users.values()) {
      if (user.matches(term)) results.push(user.toJson());
    }
    return { success: results.length > 0, data: results };
  }

  async getAll(): Promise<CRUDReturn> {
    var populatedData = [];
    try {
      var result = await this.DB.collection('users').get();
      result.docs.forEach((doc) => {
        var d = doc.data();
        populatedData.push(new User(d.name, d.age, d.email, doc.id).toJson());
      });
      return { success: true, data: populatedData };
    } catch (e) {
      return { success: false, data: populatedData };
    }
  }

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

  async register(body: any): Promise<CRUDReturn> {
    console.log(body);
    try {
      var validBody: { valid: boolean; data: string } =
        Helper.validBodyPut(body);
      if (validBody.valid) {
        if (!(await this.emailExists(body.email))) {
          var newUser: User = new User(
            body.name,
            body.age,
            body.email,
            body.password,
          );
          if (await this.saveToDB(newUser)) {
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

  async login(email: string, password: string): Promise<CRUDReturn> {
    var results = await this.DB.collection('users')
      .where('email', '==', email)
      .get();
    var user: User;
    if (results.size > 0) {
      for (const doc of results.docs) {
        var d = doc.data();
        user = new User(d.name, d.age, d.email, d.password, doc.id);
      }
      return user.login(password);
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

  async getUserID(id: string): Promise<CRUDReturn> {
    var user: User = await this.retrieveUserObject(id);
    if (user != null) {
      return {
        success: true,
        data: user.toJson(),
      };
    } else {
      return {
        success: false,
        data: `User ${id} not found`,
      };
    }
  }

  async retrieveUserObject(uid: string): Promise<User> {
    try {
      var userDoc = await this.DB.collection('users').doc(uid).get();
      if (userDoc.exists) {
        var d = userDoc.data();
        return new User(d.name, d.age, d.email,d.password, userDoc.id);
      } else return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async replaceValuePut(id: string, body: any) {
    try {
      if (this.users.has(id)) {
        var validBodyPut: { valid: boolean; data: string } =
          Helper.validBodyPut(body);
        console.log(validBodyPut);
        if (validBodyPut.valid) {
          if (!(await this.emailExists(body.email, { exceptionID: id }))) {
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

  loginUser(email: string, password: string): CRUDReturn {
    for (var user of this.users.values()) {
      if (user.matches(email)) {
        return user.login(password);
      }
    }
    return {
      success: false,
      data: `Email ${email} does not exist in the database`,
    };
  }

  async replaceValuePatch(id: string, body: any): Promise<CRUDReturn> {
    console.log(`Updating Values for id:${id}`);
    console.log(body);
    try {
      var user: User = await this.retrieveUserObject(id);
      user.log();
      if (user != null) {
        var validBodyPatch: { valid: boolean; data: string } =
          Helper.validBody(body);
        if (validBodyPatch.valid) {
          console.log(validBodyPatch);
          if (body.email != undefined) {
            var emailExists: boolean = await this.emailExists(body.email, {
              exceptionID: id,
            });
            console.log(emailExists);
            if (!emailExists) {
              var replaceSuccess = user.replaceValues(body);
              console.log(replaceSuccess);
              var success = await user.save();
              if (success)
                return {
                  success: success,
                  data: user.toJson(),
                };
              else {
                throw new Error('Failed to update in db');
              }
            } else {
              throw new Error(
                `${body.email} is already in use by another user!`,
              );
            }
          } else {
            var replaceSuccess = user.replaceValues(body);
            console.log(replaceSuccess);
            var success = await user.save();
            if (success)
              return {
                success: success,
                data: user.toJson(),
              };
            else {
              throw new Error('Failed to update in db');
            }
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

  async emailExists(
    email: string,
    options?: { exceptionID: string },
  ): Promise<boolean> {
    console.log('email exists');
    console.log(email);
    console.log(options);
    var results = await this.DB.collection('users')
      .where('email', '==', email)
      .get();
    if (results.size < 1) return false;
    else {
      for (const doc of results.docs) {
        if (doc.data().email == email) {
          if (
            options?.exceptionID != undefined &&
            doc.id == options.exceptionID
          )
            continue;
          return true;
        }
      }
    }
    return false;
  }

  async saveToDB(user: User): Promise<boolean> {
    try {
      await this.DB.collection('users').doc(user.id).set(user.toDbJson());
      // this.users.set(user.id, user);
      // return this.users.has(user.id);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  logAllUsers() {
    console.log(this.getAll());
  }
}
