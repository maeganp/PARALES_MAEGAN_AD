import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post("/login")
  // login(@Body("email") email:string , @Body("password") password:string){
  //     return this.userService.login(email,password);
  //     //return this.userService.login(email,password);
  // }

  @Get('/all')
  getAll() {
    return this.userService.getAll();
  }

  @Get('/:id')
  getOneUser(@Param('id') id: string) {
    return this.userService.getUserID(id);
  }

  @Post('/register')
  register(@Body() body: any) {
    return this.userService.register(body);
  }
  @Post('/login')
  loginUser(@Body() body: any) {
    return this.userService.loginUser(body.email, body.password);
  }

  @Put('/:id')
  replaceValuePput(@Body() body: any, @Param('id') id: string) {
    return this.userService.replaceValuePut(id, body);
  }
  @Patch('/:id')
  replaceValuePatch(@Body() body: any, @Param('id') id: string) {
    return this.userService.replaceValuePatch(id, body);
  }

  @Delete('/:id')
  removeUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/search/:id')
  searchUser(@Param('id') id: string) {
    return this.userService.searchUser(id);
  }

  //   @Get('/search/:id')
  //   searchUser(@Param("id")id:number){
  //       return this.userService.searchUser(id);
  // i don't know why it won't work
  //   }
}
