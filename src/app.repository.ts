import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';

async function writeFile() {
  // TODO:
}

@Injectable()
export class AppRepository { 
  private readonly users: IUser[] = [];
  private  todos: Todo[] = [];
  private readonly loginToId: Map<string, string> = new Map();
  private readonly shortLinkToLong: Map<string, string> = new Map();

  async getUserByLogin(login: string): Promise<IUser | undefined> {
    return this.users.find(user => user.login === login);
  }
  
  async getUser(userData: IUser): Promise<IUser | undefined> {
    return this.users.find(user => {
      return (user.login === userData.login) && 
        (user.password === userData.password);
    });
  }

  async saveTodo(todo : Todo): Promise<void>{
    this.todos.push(todo);
  }

   doness(todo : Todo){
    this.todos = this.todos.filter(obj => obj.description !== todo.description); 
    console.log(todo.done);
    todo.done = !(todo.done);
    console.log(todo.done); 
    this.todos.push(todo);    
  }

  getTodos(): Todo[]{
    return this.todos;
  }

   deletetodos(todo:Todo){   
    this.todos = this.todos.filter(obj => obj.description !== todo.description); 
  }

  async saveUser(user: IUser): Promise<void> {
    this.users.push(user);
  }

  async saveId(login: string, id: string): Promise<void> {
    this.loginToId.set(login, id);
  }

  async idExists(id: string): Promise<boolean> {
    const values = Array.from(this.loginToId.values());
    return values.includes(id);
  }
}

interface IUser {
  login: string;
  password: string;
}

interface Todo{
  accountId : string;
  name_list: string;
  description : string;
  done : boolean;
}