export class User{

    constructor(public id:String,  public token:String, public username:String ){}

    public getToken(): String {
        return this.token;
    }
}