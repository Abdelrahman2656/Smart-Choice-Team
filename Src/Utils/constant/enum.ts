

//user roles
interface Roles {
    USER:string,
    ADMIN:string
}
export const roles:Roles={
    USER:'user',
    ADMIN:"admin"

}
Object.freeze(roles)
//user gender
interface Gender{
    MALE:string,
    FEMALE:string
}
export const gender:Gender={
    MALE:'male',
    FEMALE:'female'
}
Object.freeze(gender)
interface Provider{
    SYSTEM:string,
    GOOGLE:string
}
export const provider:Provider={
    SYSTEM:"system",
    GOOGLE:"google"
}
Object.freeze(provider)