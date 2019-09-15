import { Controller, Get, Post, Body, BadRequestException, Param, Response, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { async } from 'rxjs/internal/scheduler/async';
import { strict } from 'assert';
import { readdir, fstat } from 'fs';
let fs = require("fs");
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(this.appService);
  }

  validatetodoData(todo_dat: any){
    if(!todo_dat.accountId){
      throw new BadRequestException({
        ok: false,
        error: 'accountId required',
      })
    }
    if(!todo_dat.name_list){
      throw new BadRequestException({
        ok: false,
        error: 'name_list required',
      })
    }
    if(!todo_dat.description){
      throw new BadRequestException({
        ok: false,
        error: 'description required',
      })
    }
    
  }

  validateUserData(data: any) {
    if (!data.login) {
      throw new BadRequestException({
        ok: false,
        error: 'login required',
      });
    }

    if (!data.password) {
      throw new BadRequestException({
        ok: false,
        error: 'password required',
      });
    }
  }

  @Post('/api/done')
   dones(@Body() data){
     this.validatetodoData(data);
     this.appService.done(data);
     fs.appendFileSync('file.txt', "\r\n" +"изменение выполненности задачи: "+"\r\n" +data.accountId + "\r\n" + data.name_list + "\r\n" + data.description + "\r\n" + data.done );
    }
  @Post('/api/register')
  async register(@Body() data) {
    this.validateUserData(data);
    await this.appService.register(data);
    fs.appendFileSync('file.txt', "\r\n"+" регистрация: "+"\r\n" +data.login + "\r\n" + data.password + "\r\n");
    return {
      ok: true,
    };
  }

  @Post('/api/login')
  async login(@Body() data) {
    this.validateUserData(data);
    fs.appendFileSync('file.txt', "\r\n"+" авторизация: "+"\r\n" +data.login + "\r\n" + data.password + "\r\n");
    const id = await this.appService.login(data);
    return { id };
  }

  @Post('/api/ToDoCreate')
  async ToDoCreate(@Body() todo_dat){
    this.validatetodoData(todo_dat);
    await this.appService.createToDO(todo_dat);
    fs.appendFileSync('file.txt', "\r\n" +" Создание задачи: "+"\r\n" +todo_dat.accountId + "\r\n" + todo_dat.name_list + "\r\n" + todo_dat.description + "\r\n" + todo_dat.done );
    return {
      ok: true,
    };
  }
  
  @Delete('/delete')
  Tododelete(@Body() todo_dat){
    this.validatetodoData(todo_dat);
    this.appService.deletetodo(todo_dat);
    fs.appendFileSync('file.txt', "\r\n" +" удаление : "+"\r\n" +todo_dat.accountId + "\r\n" + todo_dat.name_list + "\r\n" + todo_dat.description + "\r\n" + todo_dat.done );
  }
  
@Get('/geting')
  get(){
  let  list = this.appService.gettodos();
  return list;
  }
}
