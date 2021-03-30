export class User{

    constructor(public id:String,  private token:String, public username:String ){}

    public getToken() {
        return this.token;
    }
}