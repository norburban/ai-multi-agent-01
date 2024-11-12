import { useAgentStore } from '../stores/agentStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ResponseDetails() {
  const conversation = useAgentStore(state => state.conversation)
  const lastAgentResponse = conversation
    .filter(msg => msg.role === 'assistant')
    .pop()

  if (!lastAgentResponse) return null

  return (
    <div className="response-details-container">
      <div className="response-metadata">
        <span className="agent-label">{lastAgentResponse.agent}</span>
        <span className="timestamp">
          {new Date(lastAgentResponse.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="response-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lastAgentResponse.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ResponseDetails
