import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AppRepository } from './app.repository';
const fs = require("fs");

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

   done(todo: Todo){
     this.appRepository.doness(todo);    
  }
  async register(user: IUser) {
    // найдем людей с таким же логином
    // если занят, то ошибка
    const found = await this.appRepository.getUserByLogin(user.login);
    if (found) {
      throw new BadRequestException('login already exists');
    }
    console.log('here ', user.login);
    console.log(typeof user.login); 
    let readfile=fs.readFileSync('filelog.txt', 'utf8'); 
    console.log(typeof user.login); 
    if(readfile.indexOf(user.login)){
      throw new BadRequestException('login already exists');
      console.log("user found");
    }
    // если логин свободен, то ок, сохраним
    fs.close();
    fs.appendFileSync('filelog.txt', "\r\n"+" регистрация: "+"\r\n" +user.login + "\r\n" + user.password + "\r\n");
    await this.appRepository.saveUser(user);
  }

  async createToDO(todo :Todo){
    // проверить есть ли такой id
    const idExists = await this.appRepository.idExists(todo.accountId);
    if (!idExists) {
      throw new ForbiddenException('id not exists');
    }
    await this.appRepository.saveTodo(todo);
    // if todo.accountId
  }

   deletetodo(todo : Todo){
      this.appRepository.deletetodos(todo);
  }

  gettodos() {
    let todo; //: Todo[];
    todo = this.appRepository.getTodos(); 
    return todo;
  }

  createId(login: string): string {
    return `${Date.now()}`;
  }

  async login(user: IUser) {
    // найти юзера по логину и паролю
    const found = await this.appRepository.getUser(user);
    if (!found) {
      throw new NotFoundException('not found');
    }

    // если найден, присвоить уникальный идентификатор 
    const id = this.createId(user.login);
    await this.appRepository.saveId(user.login, id);
    return id;
    // и вернуть его
  }
}

interface Todo{
  accountId : string;
  name_list: string;
  description : string;
  done : boolean;
}

// copy-paste
// TODO: move to file
interface IUser {
  login: string; 
  password: string;
}