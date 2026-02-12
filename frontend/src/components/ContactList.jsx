import { useChatStore } from "../store/useChatStore"
import { useEffect } from "react"
import { PageLoader, UsersLoadingSkeleton } from "./index.js"
import { useAuthStore } from "../store/useAuthStore.js"

function ContactList() {

  const { isUsersLoading, getAllContacts, allContacts, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    getAllContacts()
  }, [getAllContacts])

  if(isUsersLoading) return <UsersLoadingSkeleton />

  return (
    <div>
      {allContacts.map((contact) => (
        <div 
          key={contact._id}
          className="bg-cyan-500/10 p-4 mb-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "avatar-online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={contact.profile || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
          </div>
        </div>
      ))} 
    </div>
  )
}

export default ContactList
