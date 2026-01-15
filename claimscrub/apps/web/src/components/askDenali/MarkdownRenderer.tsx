/**
 * Simple Markdown Renderer for Chat Messages
 *
 * Handles basic markdown formatting:
 * - **bold** text
 * - Bullet points (- item)
 * - Numbered lists (1. item)
 * - ### headings
 * - Line breaks
 */

import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null
  let key = 0

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-1 my-2">
            {currentList.items.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <ol key={key++} className="list-decimal list-inside space-y-1 my-2">
            {currentList.items.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ol>
        )
      }
      currentList = null
    }
  }

  for (const line of lines) {
    // Heading (### text)
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h4 key={key++} className="font-semibold text-neutral-900 mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h4>
      )
      continue
    }

    // Bullet point (- item or * item)
    if (/^[-*]\s+/.test(line)) {
      const item = line.replace(/^[-*]\s+/, '')
      if (currentList?.type === 'ul') {
        currentList.items.push(item)
      } else {
        flushList()
        currentList = { type: 'ul', items: [item] }
      }
      continue
    }

    // Numbered list (1. item)
    if (/^\d+\.\s+/.test(line)) {
      const item = line.replace(/^\d+\.\s+/, '')
      if (currentList?.type === 'ol') {
        currentList.items.push(item)
      } else {
        flushList()
        currentList = { type: 'ol', items: [item] }
      }
      continue
    }

    // Empty line
    if (line.trim() === '') {
      flushList()
      elements.push(<div key={key++} className="h-2" />)
      continue
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={key++} className="my-1">
        {renderInline(line)}
      </p>
    )
  }

  flushList()

  return <div className={cn('text-sm', className)}>{elements}</div>
}

/**
 * Render inline markdown (bold, etc.)
 */
function renderInline(text: string): React.ReactNode {
  // Handle **bold** text
  const parts: React.ReactNode[] = []
  const regex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    // Add the bold text
    parts.push(
      <strong key={match.index} className="font-semibold">
        {match[1]}
      </strong>
    )
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
