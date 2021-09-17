import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get("/all")
    getAll(){
        return this.userService.getAll();
    }

    @Put("/register")
    register(@Body() body:any){
        return this.userService.register(body);
    }

    @Put('/replaceUser/:id')
  replaceValues(@Body() body:any){
    return this.userService.register(body);
  }

    @Delete('/replaceUser/:id')
  removeValues(@Body() body:any){
    return this.userService.register(body);
  }
}
