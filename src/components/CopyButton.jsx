import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Tooltip } from 'react-tooltip'

function CopyButton({ text }) {
  const [isCopied, setIsCopied] = useState(false)
  const [tooltipContent, setTooltipContent] = useState('Copy to clipboard')

  const copyToClipboard = () => {
    if (!text) return

    const textToCopy = text.toString()
    
    if (navigator.clipboard && window.isSecureContext) {
      // For modern browsers
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setIsCopied(true)
          setTooltipContent('Copied!')
          setTimeout(() => {
            setIsCopied(false)
            setTooltipContent('Copy to clipboard')
          }, 2000)
        })
        .catch(() => {
          fallbackCopyToClipboard(textToCopy)
        })
    } else {
      fallbackCopyToClipboard(textToCopy)
    }
  }

  const fallbackCopyToClipboard = (text) => {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = '0'
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
        setIsCopied(true)
        setTooltipContent('Copied!')
      } catch (err) {
        setTooltipContent('Failed to copy')
        console.error('Failed to copy:', err)
      }

      document.body.removeChild(textArea)
      setTimeout(() => {
        setIsCopied(false)
        setTooltipContent('Copy to clipboard')
      }, 2000)
    } catch (err) {
      setTooltipContent('Failed to copy')
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <button 
        className="copy-button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          copyToClipboard()
        }}
        data-tooltip-id="copy-tooltip"
        data-tooltip-content={tooltipContent}
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <Tooltip id="copy-tooltip" />
    </>
  )
}

export default CopyButton
