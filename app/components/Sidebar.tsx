import React from "react";
import {
  AiOutlinePlus,
} from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

interface SidebarProps {
  chatSessions: { chat_id: number }[];
  currentChatId: number | null;
  onChatSelect: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
  sessionLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  sessionLoading
}) => {
  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <button 
          onClick={onNewChat}
          disabled={sessionLoading}
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20 disabled:opacity-50"
        >
          <AiOutlinePlus className="h-4 w-4" />
          New chat
        </button>
        
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
          <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
            {chatSessions.map((session) => (
              <div
                key={session.chat_id}
                className={`flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all hover:pr-4 group transition-colors duration-200 ${
                  currentChatId === session.chat_id
                    ? 'bg-[#2A2B32] text-white'
                    : 'hover:bg-[#2A2B32] text-gray-300'
                }`}
              >
                <FiMessageSquare className="h-4 w-4" />
                <div 
                  onClick={() => onChatSelect(session.chat_id)}
                  className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative text-left"
                >
                  Chat {session.chat_id}
                  <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(session.chat_id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  title="Delete chat"
                >
                  <RiDeleteBin6Line className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {chatSessions.length === 0 && !sessionLoading && (
              <div className="flex py-3 px-3 items-center gap-3 text-gray-500 text-sm">
                <FiMessageSquare className="h-4 w-4" />
                No chats yet
              </div>
            )}
            
            {sessionLoading && (
              <div className="flex py-3 px-3 items-center gap-3 text-gray-500 text-sm">
                <FiMessageSquare className="h-4 w-4" />
                Loading...
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;