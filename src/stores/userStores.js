import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {createDepartment,createUsers,deleteDepartment,fetchDepartment,getUser,loginUser,uploadDocument} from '../api/api';
import { setTokens } from '../api/auth';

export const useAuthStore = create(
  persist(
    (set) => ({
      users: [],
      isLoading: false,
      error: null,
      isAuthenticated: false,
      role: null,
      user: null,
      departments: [],
      department: null,

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const newUser = await createUsers(userData);
          console.log(newUser);
          set({ isLoading: false, error: null });
          return newUser;
        } catch (err) {
          console.error('Signup error:', err);
          set({ isLoading: false, error: err.message || 'signup failed' });
        }
      },

      fetchUsers: async () => {
        set({ error: null });
        try {
          const users = await getUser();
          set({ users });
        } catch (error) {
          set({ error: 'Failed to fetch users' });
          console.error('Error fetching users:', error);
        }
      },

      signin: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const login = await loginUser(userData);
          setTokens(login.access_token, login.refresh_token);
          set({
            isLoading: false,
            error: null,
            isAuthenticated: true,
            role: login.user.role,
            user: login.user.name,
            department: login.user.department,
          });
          console.log(login)
          return login;
        } catch (err) {
          console.error('Login error', err);
          set({ isLoading: false, error: err.message || 'login failed' });
        }
      },

      addDepartment: async (departmentData) => {
        set({ isLoading: true, error: null });
        try {
          const department = await createDepartment(departmentData);
          return department;
        } catch (err) {
          console.error('AddDepartment error', err);
          set({ isLoading: false, error: err.message || 'Error creating department' });
        }
      },

      getDepartment: async () => {
        set({ error: null });
        try {
          const departments = await fetchDepartment();
          set({ departments, error: null });
        } catch (err) {
          console.error('Error fetching departments', err);
          set({
            error: err.message || 'Failed to fetch departments',
            isLoading: false,
          });
        }
      },

      deleteDept: async (id) => {
        try {
            await deleteDepartment(id); // your actual API call
            set((state) => ({
            departments: state.departments.filter((dept) => dept.id !== id),
            error: null,
            }));
            return true; // Explicit success
        } catch (err) {
            console.error("Failed to delete department:", err.message);
            set({ error: err.message });
            throw err; // Let caller handle this
        }
       },
      
      signout: () => {
        set({
          isAuthenticated: false,
          role: null,
          user: null,
          department: null,
        });
         localStorage.removeItem('auth-storage'); 
         localStorage.removeItem('access_token');
         localStorage.removeItem('refresh_token');
         localStorage.removeItem('document-storage'); 
      },
    }),
    {
      name: 'auth-storage', 
      partialize: (state) => ({
        role: state.role,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        department: state.department,
      }),
    }
  )
);
