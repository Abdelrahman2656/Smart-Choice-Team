

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
//user provider
interface Provider{
    SYSTEM:string,
    GOOGLE:string
}
export const provider:Provider={
    SYSTEM:"system",
    GOOGLE:"google"
}
Object.freeze(provider)