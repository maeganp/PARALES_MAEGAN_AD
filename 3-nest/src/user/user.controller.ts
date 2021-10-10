import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    // @Post("/login")
    // login(@Body("email") email:string , @Body("password") password:string){
    //     return this.userService.login(email,password);
    //     //return this.userService.login(email,password);
    // }

    @Get("/all")
    getAll(){
        return this.userService.getAll();
    }

    @Patch("/register")
    register(@Body() body:any){
        return this.userService.register(body);
    }

    @Patch("/:id")
    replaceValuePatch(@Body() body:any, @Param("id") id:string){
       return this.userService.replaceValuePatch(body,id);
     }

    @Delete('/replaceUser/:id')
  removeUser(@Body() body:any){
    return this.userService.register(body);
  }

  @Get('/search/:id')
  searchUser(@Param("id")id:string){
    return this.userService.searchUser(id);
  }

//   @Get('/search/:id')
//   searchUser(@Param("id")id:number){
//       return this.userService.searchUser(id);
// i don't know why it won't work
//   }
}
