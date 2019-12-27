export class ProfileInfo {
    user_id: string = "";
    user_name: string = "";
    mobile: string = "";
    email: string = "";
    first_name: string = "";
    password: string = "";
    salt: string = "";
    logged_from: string = "";
    social_login: string = "";
    user_state: string = "1";
    mid_name: string = "";
    last_name: string = "";
    work_phone: string = "";
    login_failures: string = "";
    social_login_type: string = "";
    street: string = "";
    dob: string = "";
    created_on: string = "";

    setValues(profileInfo :ProfileInfo){
        this.user_id = profileInfo.user_id;
        this.user_name= profileInfo.user_name;
        this.mobile= (profileInfo.mobile && profileInfo.mobile.length>10)? profileInfo.mobile.substring(1,11):profileInfo.mobile;
        this.email= profileInfo.email;
        this.first_name= profileInfo.first_name;
        this.mid_name= profileInfo.mid_name;
        this.last_name= profileInfo.last_name;
        this.street= profileInfo.street;
        this.dob=profileInfo.dob;
        this.created_on = profileInfo.created_on;

    }
}