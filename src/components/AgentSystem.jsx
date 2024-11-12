import { useEffect } from 'react'
import { useAgentStore } from '../stores/agentStore'

function AgentSystem() {
  const { initializeAgents, agents } = useAgentStore()

  useEffect(() => {
    initializeAgents()
  }, [])

  return (
    <div className="agents-list">
      {agents.map(agent => (
        <div key={agent.name} className="agent-card">
          <h3>{agent.name}</h3>
          <p>{agent.description}</p>
        </div>
      ))}
    </div>
  )
}

export default AgentSystem
