export class UserModel{
    username?:String;
    password?:String;
    email?:String;
    locations?: Array<String>;

    constructor(username:String, password:String, email:String, locations: Array<String>){
        this.username = username;
        this.password = password;
        this.email = email;
        this.locations = locations;
    }
}