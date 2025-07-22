import {create} from 'zustand'
import { createUsers } from '../api/api'

export const useAuthStore = create((set)=>({
    user:null,
    isLoading:false,
    error:null,
    isAuthenticated:false,


    signup: async(userData) => {
        set({isLoading:true,error:null,})
        try{
            const newUser = await createUsers(userData);
            set({
                isLoading:false,
                error:null
            })
            return newUser
        }catch(err){
            console.error('Signup error:',err)

            set({
                isLoading:false,
                error: err.message || 'signup failed'
            })
        }
    }


}))

