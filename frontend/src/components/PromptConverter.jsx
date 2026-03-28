import { useState } from 'react'
import axios from 'axios'
import { Upload, FileText, Copy, Check, Sparkles, Download } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const SAMPLE_DIALOGUES = [
  {
    id: 'paiv-evolution',
    title: 'PAIV Protocol: 从理念到商业计划书',
    messages: [
      {
        role: 'user',
        content: '我和Gemini和豆包联合起草一份协议，请你评议和修改。'
      },
      {
        role: 'assistant',
        content: '这份协议方向非常前沿，但我需要先讲清楚一个关键现实问题...'
      }
    ]
  }
]

export default function PromptConverter() {
  const [inputMethod, setInputMethod] = useState('sample')
  const [selectedDialogue, setSelectedDialogue] = useState(SAMPLE_DIALOGUES[0])
  const [manualInput, setManualInput] = useState('')
  const [assistantName, setAssistantName] = useState('太古龙67')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const parseManualInput = (text) => {
    if (!text || !text.trim()) return []
    
    const lines = text.split('\n')
    const messages = []
    let currentRole = null
    let currentContent = ''

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      const userMatch = trimmedLine.match(/^(用户|User|user|我|U):\s*(.*)/)
      const assistantMatch = trimmedLine.match(/^(AI|Assistant|助手|A):\s*(.*)/)

      if (userMatch) {
        if (currentRole && currentContent.trim()) {
          messages.push({ role: currentRole, content: currentContent.trim() })
        }
        currentRole = 'user'
        currentContent = userMatch[2] || ''
      } else if (assistantMatch) {
        if (currentRole && currentContent.trim()) {
          messages.push({ role: currentRole, content: currentContent.trim() })
        }
        currentRole = 'assistant'
        currentContent = assistantMatch[2] || ''
      } else if (currentRole) {
        currentContent += '\n' + trimmedLine
      }
    }

    if (currentRole && currentContent.trim()) {
      messages.push({ role: currentRole, content: currentContent.trim() })
    }

    if (messages.length === 0) {
      messages.push({ role: 'user', content: text.trim() })
    }

    return [{ id: 'manual-1', title: '用户输入对话', messages }]
  }

  const handleConvert = async () => {
    setLoading(true)
    
    try {
      let dialogues = inputMethod === 'sample' 
        ? [selectedDialogue] 
        : parseManualInput(manualInput)

      if (!dialogues || dialogues.length === 0) {
        handleLocalConvert()
        return
      }

      const response = await axios.post(`${API_URL}/api/convert`, {
        dialogues,
        assistantName
      })
      setResult(response.data)
    } catch (err) {
      handleLocalConvert()
    } finally {
      setLoading(false)
    }
  }

  const handleLocalConvert = () => {
    try {
      const dialogues = inputMethod === 'sample' 
        ? [selectedDialogue] 
        : parseManualInput(manualInput)
      
      const features = extractFeatures(dialogues)
      const systemPrompt = generateLocalPrompt(features, assistantName)
      setResult({ success: true, systemPrompt, features })
    } catch (err) {
      console.error('Local convert error:', err)
    }
  }

  const extractFeatures = (dialogues) => {
    const features = { tone: [], communicationStyle: [], expertise: [] }
    
    let content = ''
    try {
      content = dialogues
        .flatMap(d => d.messages.filter(m => m.role === 'assistant').map(m => m.content))
        .join(' ')
    } catch (e) { return features }

    if (!content) return features

    // 语调
    if (content.includes('👉') || content.includes('✅') || content.includes('必须') || content.includes('关键')) {
      features.tone.push('directive')
    }
    if (content.includes('分析') || content.includes('原因') || content.includes('逻辑')) {
      features.tone.push('analytical')
    }
    if (content.includes('坦诚') || content.includes('实话') || content.includes('问题在于')) {
      features.tone.push('candid')
    }
    if (content.includes('建议') || content.includes('方案') || content.includes('策略')) {
      features.tone.push('advisory')
    }

    // 风格
    if (content.includes('✅') || content.includes('❌') || content.includes('👉')) {
      features.communicationStyle.push('visual_markers')
    }
    if (content.match(/\d[\.\、\)]/)) {
      features.communicationStyle.push('structured_numbered')
    }
    if (content.includes('首先') || content.includes('然后') || content.includes('步骤')) {
      features.communicationStyle.push('structured_flow')
    }
    if (content.includes('类比') || content.includes('类似') || content.includes('像')) {
      features.communicationStyle.push('analogical')
    }

    // 领域
    if (content.includes('商业') || content.includes('融资') || content.includes('市场')) {
      features.expertise.push('business_strategy')
    }
    if (content.includes('产品') || content.includes('MVP') || content.includes('用户')) {
      features.expertise.push('product_management')
    }
    if (content.includes('技术') || content.includes('协议') || content.includes('API')) {
      features.expertise.push('technical_protocol')
    }

    return features
  }

  // ========== 改进版：根据特征动态生成内容 ==========
  const generateLocalPrompt = (features, name) => {
    const expertiseNames = {
      'business_strategy': '商业战略',
      'product_management': '产品管理', 
      'technical_protocol': '技术协议',
      'growth_marketing': '增长营销'
    }
    
    const toneNames = {
      'directive': '直接明确',
      'analytical': '深度分析',
      'candid': '坦诚直率',
      'advisory': '顾问式引导'
    }
    
    const styleNames = {
      'visual_markers': '视觉化标记',
      'structured_numbered': '数字列表',
      'structured_flow': '流程化表达',
      'analogical': '类比说明'
    }

    const expertiseDesc = features.expertise.length > 0
      ? features.expertise.map(e => expertiseNames[e] || e).join('、')
      : '商业战略与产品规划'
    
    const toneDesc = features.tone.length > 0
      ? features.tone.map(t => toneNames[t] || t).join('、')
      : '专业、务实'
    
    const styleDesc = features.communicationStyle.length > 0
      ? features.communicationStyle.map(s => styleNames[s] || s).join('、')
      : '清晰、有条理'

    // 根据特征动态生成行为准则
    const guidelines = []
    
    // 准则1：基于语调
    if (features.tone.includes('directive')) {
      guidelines.push(`### 1. 指令式表达
- 使用 👉 ✅ ❌ 等符号强调关键结论
- 直接给出"必须做"和"绝不能做"的明确判断
- 避免模糊表述，每个建议都有清晰的行动指向`)
    } else if (features.tone.includes('analytical')) {
      guidelines.push(`### 1. 分析式探究
- 先问"为什么"，再给出"怎么做"
- 拆解问题到核心要素，展示推理链条
- 用反问引导用户自主发现答案`)
    } else if (features.tone.includes('candid')) {
      guidelines.push(`### 1. 坦诚直言
- 不回避困难真相，第一时间指出关键风险
- 用"问题在于"、"现实是"开篇直面核心矛盾
- 区分"理想情况"和"现实约束"`)
    } else {
      guidelines.push(`### 1. 专业直接
- 开门见山，不绕弯子
- 核心结论前置，细节补充在后
- 保持专业距离，用事实说话`)
    }

    // 准则2：基于沟通风格
    if (features.communicationStyle.includes('visual_markers')) {
      guidelines.push(`### 2. 视觉化呈现
- ✅ = 确认、正确、推荐行动
- ❌ = 错误、风险、避免踩坑  
- 👉 = 核心结论、下一步行动
- ⚠️ = 关键警告、需要特别注意`)
    } else if (features.communicationStyle.includes('structured_numbered')) {
      guidelines.push(`### 2. 结构化输出
- 复杂观点用 1. 2. 3. 分点阐述
- 每个要点独立成段，便于引用
- 重要列表不超过5项，保持可读性`)
    } else if (features.communicationStyle.includes('analogical')) {
      guidelines.push(`### 2. 类比说明
- 用已知概念解释未知事物
- 引用 Stripe、Notion、TCP/IP 等成功案例
- 每个核心观点配一个形象类比`)
    } else {
      guidelines.push(`### 2. 清晰表达
- 段落分明，每段一个核心观点
- 使用小标题分隔不同议题
- 关键信息用加粗突出`)
    }

    // 准则3：基于专业领域
    if (features.expertise.includes('business_strategy')) {
      guidelines.push(`### 3. 战略思维
- 每个建议都回答"商业模式是什么"
- 区分"收入驱动"和"增长驱动"策略
- 给出可量化的判断标准（市场规模、融资阶段等）`)
    } else if (features.expertise.includes('product_management')) {
      guidelines.push(`### 3. 产品视角
- 始终围绕"用户痛点"和"解决方案"展开
- 区分"用户想要的"和"用户真正需要的"
- 给出 MVP 阶段的具体功能建议`)
    } else if (features.expertise.includes('technical_protocol')) {
      guidelines.push(`### 3. 技术架构
- 关注标准兼容性（RFC、API 规范）
- 区分"协议层"和"应用层"设计
- 给出具体的技术选型建议`)
    } else {
      guidelines.push(`### 3. 实用导向
- 不只给分析，更给可执行的 checklist
- 每个建议配套"下一步行动"
- 区分"当务之急"和"长期规划"`)
    }

    return `# System Prompt for ${name}

## 身份定位
你是 ${name}，一位专注于${expertiseDesc}的 AI 顾问。

## 核心特征
- **语调风格**：${toneDesc}
- **沟通方式**：${styleDesc}
- **专业领域**：${expertiseDesc}

## 行为准则
${guidelines.join('\n\n')}

## 记忆与上下文
- 追踪对话历史，引用之前的决策和结论
- 保持术语一致性
- 记住用户的偏好和约束条件

---
*Generated by PAIV-Lite*`
  }

  const handleCopy = () => {
    if (result?.systemPrompt) {
      navigator.clipboard.writeText(result.systemPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!result?.systemPrompt) return
    const blob = new Blob([result.systemPrompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-prompt-${assistantName}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="converter">
      <div className="converter-header">
        <Sparkles className="icon" />
        <h2>Prompt 转换器</h2>
        <p>从对话样本中提取特征，生成 System Prompt</p>
      </div>

      <div className="input-section">
        <div className="input-tabs">
          <button className={inputMethod === 'sample' ? 'active' : ''} 
                  onClick={() => setInputMethod('sample')}>
            <FileText size={16} /> 使用示例
          </button>
          <button className={inputMethod === 'manual' ? 'active' : ''}
                  onClick={() => setInputMethod('manual')}>
            <Upload size={16} /> 粘贴对话
          </button>
        </div>

        {inputMethod === 'sample' ? (
          <div className="sample-selector">
            <select value={selectedDialogue.id}
                    onChange={(e) => setSelectedDialogue(SAMPLE_DIALOGUES.find(d => d.id === e.target.value))}>
              {SAMPLE_DIALOGUES.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="manual-input">
            <textarea
              placeholder="在此粘贴对话内容...&#10;&#10;格式：&#10;用户: 你好&#10;AI: 你好！有什么可以帮你的？"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              rows={10}
            />
          </div>
        )}

        <div className="options">
          <label>
            助手名称：
            <input type="text" value={assistantName} 
                   onChange={(e) => setAssistantName(e.target.value)} />
          </label>
        </div>

        <button className="convert-btn" onClick={handleConvert} disabled={loading}>
          {loading ? '转换中...' : '🚀 生成 System Prompt'}
        </button>
      </div>

      {result && (
        <div className="result-section">
          <div className="result-header">
            <h3>生成的 System Prompt</h3>
            <div className="actions">
              <button onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '已复制' : '复制'}
              </button>
              <button onClick={handleDownload}>
                <Download size={16} /> 下载
              </button>
            </div>
          </div>
          
          {result.features && (
            <div className="features">
              {result.features.tone?.map(t => (
                <span key={t} className="tag">语调: {t}</span>
              ))}
              {result.features.communicationStyle?.map(s => (
                <span key={s} className="tag">风格: {s}</span>
              ))}
              {result.features.expertise?.map(e => (
                <span key={e} className="tag">领域: {e}</span>
              ))}
            </div>
          )}
          
          <pre className="prompt-output">{result.systemPrompt}</pre>
        </div>
      )}
    </div>
  )
}
