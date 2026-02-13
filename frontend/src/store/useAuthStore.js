import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";
import { connect } from "socket.io-client";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:9000" : "/";

export const useAuthStore = create((set, get) => ({

    authUser: null,
    isCheckingAuth: true,

    isSigningUp: false,
    isLoggingIn: false,

    socket: null,
    onlineUsers: [],

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
        } 
        catch (error) {
            console.log("Auth check error:", error)
            set({authUser: null})
        } 
        finally {
            set({isCheckingAuth: false})
        }
    },

    signup: async(data) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})

            toast.success("Account created successfully!")
            // connecting socket
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({isSigningUp: false})
        }
    },

    login: async(data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            // console.log("Login response: ", res.data)
            toast.success("Logged in successfully!")
            // connecting socket 
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async() => {

        const { setSelectedUser } = useChatStore.getState()
        setSelectedUser(null)

        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null})
            toast.success("Logged out successfully!")
            // disconnecting socket
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }, 

    updateProfile: async(data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)

            set({ authUser: res.data })
            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in updating profile", error.data) 
        }
    },

    connectSocket: () => {

        const { authUser } = get()
        if(!authUser || get().socket?.connected) return;
        
        const socket = io(BASE_URL, { 
            withCredentials: true 
        })

        socket.connect()
        console.log("socket connected: ", socket)
        set({socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {

        if(get().socket?.connected) get().socket.disconnect();

    }
    
}))
