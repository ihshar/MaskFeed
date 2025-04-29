import {z} from 'zod'


export const usernameValidation = z
    .string()
    .min(2,"Username should be atleast 2 character")
    .max(20,"Username should be not more than 20 character")
    .regex(/^[a-zA-Z0-9_]+$/,"Please provide username without special character")





export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password should be atleast 6 character"})
})