import { useEffect } from 'react'
import { useAgentStore } from '../stores/agentStore'

function AgentGrid() {
  const agents = useAgentStore(state => state.agents)
  const selectedAgent = useAgentStore(state => state.selectedAgent)
  const setSelectedAgent = useAgentStore(state => state.setSelectedAgent)
  const initializeAgents = useAgentStore(state => state.initializeAgents)

  useEffect(() => {
    initializeAgents()
  }, [initializeAgents])

  return (
    <div className="agents-grid">
      {agents.map(agent => (
        <div 
          key={agent.name}
          className={`agent-card ${selectedAgent?.name === agent.name ? 'active' : ''}`}
          onClick={() => setSelectedAgent(agent)}
        >
          <div className="agent-icon">
            {agent.name.charAt(0)}
          </div>
          <div className="agent-info">
            <h3>{agent.name}</h3>
            <p>{agent.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AgentGrid
