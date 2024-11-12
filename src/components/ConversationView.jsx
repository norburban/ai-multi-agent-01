import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAgentStore } from '../stores/agentStore'

function ConversationView() {
  const conversation = useAgentStore(state => state.conversation)

  return (
    <div className="conversation">
      {conversation.map((message, index) => (
        <div
          key={index}
          className={`message ${message.role === 'user' ? 'user-message' : 'agent-message'}`}
        >
          {message.agent && <div className="agent-name">{message.agent}</div>}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  )
}

export default ConversationView
