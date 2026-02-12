import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import { NoChatsFound, UsersLoadingSkeleton } from "./index.js"
import { useAuthStore } from "../store/useAuthStore.js"

function ChatList() {
 
  const { isUsersLoading, getChatPartners, chats, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    getChatPartners()
  }, [getChatPartners])

  if(isUsersLoading) return <UsersLoadingSkeleton />
  if(chats.length === 0) return <NoChatsFound />
    
  return (
    <div>
      {chats.map((chat) => (
        <div 
          key={chat._id}
          className="bg-cyan-500/10 p-4 mb-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">

            <div className={`avatar ${onlineUsers.includes(chat._id) ? "avatar-online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profile || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
          </div>
        </div>
      ))} 
    </div>
  )
}

export default ChatList 
