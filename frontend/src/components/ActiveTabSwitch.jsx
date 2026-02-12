import { useChatStore } from "../store/useChatStore"

function ActiveTabSwitch() {

  const { activeTab, setActiveTab } = useChatStore()

  return (
    <div className="tabs tabs-box bg-transparent p-3 m-2">
      <button 
        className={`tab w-1/2 ${activeTab === 'chats' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
        onClick={() => setActiveTab("chats")}
      >Chats</button>
      <button 
        className={`tab w-1/2 ${activeTab === 'contacts' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
        onClick={() => setActiveTab("contacts")}
      >Contacts</button>
    </div>
  )
}

export default ActiveTabSwitch
