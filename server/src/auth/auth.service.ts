import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  register(dto: any): any {
    return { msg: "Hello World!" };
  }

  login(dto: any): any {
    return { msg: "Hello World!" };
  }
}
