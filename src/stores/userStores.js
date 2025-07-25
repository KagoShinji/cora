import {create} from 'zustand'
import { createUsers,loginUser,uploadDocument } from '../api/api'

export const useAuthStore = create((set)=>({
    user:null,
    isLoading:false,
    error:null,
    isAuthenticated:false,
    role:null,



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
    },

    signin: async(userData) => {
        set({isLoading:true,error:null})
        try {
            const login  = await loginUser(userData)
            console.log(userData)
            set({
                isLoading:false,
                error:null,
                isAuthenticated:true,
                role:login.role
                
            })
            return login
        } catch (err) {
            console.error('Login error',err)

            set({
                isLoading:false,
                error: err.message || 'login failed'
            })
        }

    },
    createDocument: async (file, title, notes) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("notes", notes);

            const uploaded = await uploadDocument(formData); // ✅ good now
            set({ isLoading: false });
            return uploaded;
        } catch (err) {
            set({
            isLoading: false,
            error: err.message || "Document upload failed",
            });
            throw err;
    }
}
}))

