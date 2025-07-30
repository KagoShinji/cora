import {create} from 'zustand'
import { createDepartment, createUsers,deleteDepartment,fetchDepartment,getUser,loginUser,uploadDocument } from '../api/api'

export const useAuthStore = create((set)=>({
    users:[],
    isLoading:false,
    error:null,
    isAuthenticated:false,
    role:null,
    user:null,
    departments:[],
    department:null,



    signup: async(userData) => {
        set({isLoading:true,error:null,})
        try{
            const newUser = await createUsers(userData);
            console.log(newUser)
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

    fetchUsers: async () => {
        set({ error: null });
        try {
            const users = await getUser();
            set({users });
        } catch (error) {
            set({error: "Failed to fetch users" });
            console.error("Error fetching users:", error);
        }
    },  

    signin: async(userData) => {
        set({isLoading:true,error:null})
        try {
            const login  = await loginUser(userData)
            set({
                isLoading:false,
                error:null,
                isAuthenticated:true,
                role:login.role,
                user:login.name,
                department:login.department          
            })
            console.log(login)
            return login
        } catch (err) {
            console.error('Login error',err)

            set({
                isLoading:false,
                error: err.message || 'login failed'
            })
        }

    },


    //Add and fetchdepartment
    addDepartment: async(departmentData) => {
        set({isLoading:true,error:null})
        try{
            const department = await createDepartment(departmentData)
            return department
        }catch(err){
            console.error('AddDepartment error',err)
            set({isLoading:false,error:err.message || 'Error creating department'})
        }
    },
    getDepartment: async () => {
        set({error: null });
        try {
            const departments = await fetchDepartment();
            set({ departments, error:null});
          
        } catch (err) {
            console.error("Error fetching departments", err);
            set({
            error: err.message || "Failed to fetch departments",
            isLoading: false,
            });
        }
    },
    deleteDept: async(department_id) =>{
        set({isLoading:true,error:null})
        try {
        const delete_dept = await deleteDepartment(department_id)
        
        if(delete_dept){
            console.log("Department deleted successfully")
            set({isLoading:false,error:null})
        }else{
            console.error("Failed to delete department.");
            set({ isLoading: false, error: "Failed to delete department." });
        }
        } catch (error) {
            console.error("Network error deleting department:", error);
            set({ isLoading: false, error: "Network error. Please try again." });
        }
    },

    //Creating documents
    createDocument: async (file, title, notes) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("notes", notes);

            const uploaded = await uploadDocument(formData);
            set({ isLoading: false });
            console.log(uploaded)
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

