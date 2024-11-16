import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

function MessageContent({ content }) {
  return (
    <div className="message-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Style tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300">
                  {children}
                </table>
              </div>
            )
          },
          thead({ children }) {
            return <thead className="bg-gray-50">{children}</thead>
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
          },
          tr({ children }) {
            return <tr>{children}</tr>
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                {children}
              </th>
            )
          },
          td({ children }) {
            return <td className="px-3 py-2 text-sm text-gray-500">{children}</td>
          },
          // Style links
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                {children}
              </a>
            )
          },
          // Style lists
          ul({ children }) {
            return <ul className="list-disc pl-6 my-2">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6 my-2">{children}</ol>
          },
          // Style blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
                {children}
              </blockquote>
            )
          },
          // Style headings
          h1({ children }) {
            return <h1 className="text-2xl font-bold my-4">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold my-3">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold my-2">{children}</h3>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MessageContent
