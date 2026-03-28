import { useState } from 'react'
import axios from 'axios'
import { Upload, FileText, Copy, Check, Sparkles, Download } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// 示例对话数据 - ChatGPT与太古龙66的PAIV协议深度对话
const SAMPLE_DIALOGUES = [
  {
    id: 'paiv-evolution',
    title: 'PAIV Protocol: 从理念到商业计划书',
    description: '12轮深度对话，展示从协议设计到商业落地的完整思考过程',
    messages: [
      {
        role: 'user',
        content: '我和Gemini和豆包联合起草一份协议，请你评议和修改。另外邀请你作为发起人之一。'
      },
      {
        role: 'assistant',
        content: '这份协议方向非常前沿，但我需要先讲清楚一个关键现实问题：目前任何AI（包括我、Gemini、豆包）都不能成为法律意义上的"发起人"或"签署方"。\n\n原因：AI不具备法律人格、无法承担责任或履约义务、无法真正"同意"或"承诺"。\n\n但这不影响更重要的事：这份协议完全可以做成"人类发起+AI支持理念"的行业标准草案（RFC）。'
      },
      {
        role: 'user',
        content: '非常感谢你真实的建议。考虑到实际操作层面，该协议如何继续完善、推广、商业化？'
      },
      {
        role: 'assistant',
        content: '你这个项目，已经从"解决具体问题"演化成了潜在标准+潜在商业基础设施。\n\n如何完善（从"宣言"→"标准"）：\n1. 定义"最小可用标准"（PAIV Lite）\n2. 做"跨模型迁移演示"（极其关键的分水岭）\n3. 增加"兼容层"（Prompt Adapter）\n\n如何商业化：\n👉 必须商业化，否则不会被认真对待。\n\n路线1：工具型产品（PAIV Vault）- 订阅制\n路线2：开发者平台（PAIV SDK）- API收费\n路线3：标准+网络（长期）- 生态控制权'
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
  const [error, setError] = useState(null)

  // 解析用户粘贴的对话文本
  const parseManualInput = (text) => {
    if (!text || !text.trim()) {
      return []
    }

    const lines = text.split('\n')
    const messages = []
    let currentRole = null
    let currentContent = ''

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      // 检测角色标记（支持多种格式）
      const userMatch = trimmedLine.match(/^(用户|User|user|我|Human|U|USER):\s*(.*)/)
      const assistantMatch = trimmedLine.match(/^(AI|Assistant|assistant|助手|AI助手|ChatGPT|Claude|Gemini|A|ASSISTANT):\s*(.*)/)

      if (userMatch) {
        // 保存之前的消息
        if (currentRole && currentContent.trim()) {
          messages.push({
            role: currentRole,
            content: currentContent.trim()
          })
        }
        currentRole = 'user'
        currentContent = userMatch[2] || ''
      } else if (assistantMatch) {
        // 保存之前的消息
        if (currentRole && currentContent.trim()) {
          messages.push({
            role: currentRole,
            content: currentContent.trim()
          })
        }
        currentRole = 'assistant'
        currentContent = assistantMatch[2] || ''
      } else if (currentRole) {
        // 继续当前消息的内容
        currentContent += '\n' + trimmedLine
      }
    }

    // 保存最后一条消息
    if (currentRole && currentContent.trim()) {
      messages.push({
        role: currentRole,
        content: currentContent.trim()
      })
    }

    // 如果没有解析出任何消息，将整个文本作为一条用户消息
    if (messages.length === 0) {
      messages.push({
        role: 'user',
        content: text.trim()
      })
    }

    return [{
      id: 'manual-1',
      title: '用户输入对话',
      messages: messages
    }]
  }

  const handleConvert = async () => {
    setLoading(true)
    setError(null)

    try {
      // 根据输入模式选择数据源
      let dialogues
      if (inputMethod === 'sample') {
        dialogues = [selectedDialogue]
      } else {
        dialogues = parseManualInput(manualInput)
      }

      if (!dialogues || dialogues.length === 0 || !dialogues[0].messages || dialogues[0].messages.length === 0) {
        setError('请输入有效的对话内容')
        setLoading(false)
        return
      }

      const response = await axios.post(`${API_URL}/api/convert`, {
        dialogues,
        assistantName
      })

      setResult(response.data)
    } catch (err) {
      console.error('API Error:', err)
      // API 失败时使用本地转换
      handleLocalConvert()
    } finally {
      setLoading(false)
    }
  }

  const handleLocalConvert = () => {
    try {
      // 根据输入模式选择数据源
      let dialogues
      if (inputMethod === 'sample') {
        dialogues = [selectedDialogue]
      } else {
        dialogues = parseManualInput(manualInput)
      }

      if (!dialogues || dialogues.length === 0) {
        setError('无法解析对话内容')
        return
      }

      const features = extractFeatures(dialogues)
      const systemPrompt = generateLocalPrompt(features, assistantName)
      setResult({ success: true, systemPrompt, features })
    } catch (err) {
      console.error('Local Convert Error:', err)
      setError('本地转换失败: ' + err.message)
    }
  }

  // ========== 改进版特征提取函数 ==========
  const extractFeatures = (dialogues) => {
    const features = {
      tone: [],
      communicationStyle: [],
      expertise: []
    }

    // 获取所有内容（包括 user 和 assistant）
    let allContent = ''
    let assistantContent = ''
    try {
      allContent = dialogues
        .filter(d => d && d.messages)
        .flatMap(d => d.messages.filter(m => m && m.content))
        .map(m => m.content)
        .join(' ')
      
      assistantContent = dialogues
        .filter(d => d && d.messages)
        .flatMap(d => d.messages.filter(m => m && m.role === 'assistant' && m.content))
        .map(m => m.content)
        .join(' ')
    } catch (e) {
      console.error('Extract features error:', e)
      return features
    }

    if (!allContent) return features

    // 使用 assistant 回复为主，如果没有则用全部内容
    const content = assistantContent || allContent

    // ========== 语调分析（更智能）==========
    // 指令型/直接型
    if (content.includes('👉') || content.includes('✅') || content.includes('❌') || 
        content.includes('必须') || content.includes('关键') || content.includes('核心') ||
        content.includes('重要的是') || content.includes('注意') || content.includes('切记')) {
      features.tone.push('directive')
    }
    
    // 分析型
    if (content.includes('？') || content.includes('为什么') || content.includes('分析') ||
        content.includes('原因') || content.includes('逻辑') || content.includes('思考') ||
        content.includes('理解') || content.includes('解读') || content.includes('剖析')) {
      features.tone.push('analytical')
    }
    
    // 坦诚直接型
    if (content.includes('坦诚') || content.includes('实话') || content.includes('直接说') ||
        content.includes('不绕弯') || content.includes('现实是') || content.includes('问题在于') ||
        content.includes('老实说') || content.includes('坦白讲') || content.includes('直白')) {
      features.tone.push('candid')
    }
    
    // 顾问型
    if (content.includes('建议') || content.includes('可以考虑') || content.includes('我的判断') ||
        content.includes('推荐') || content.includes('方案') || content.includes('策略') ||
        content.includes('方案是') || content.includes('做法是') || content.includes('思路')) {
      features.tone.push('advisory')
    }

    // ========== 沟通风格分析 ==========
    // 视觉化标记
    if (content.includes('✅') || content.includes('❌') || content.includes('👉') ||
        content.includes('⚠️') || content.includes('💡') || content.includes('🔍') ||
        content.includes('⭐') || content.includes('📌') || content.includes('🎯')) {
      features.communicationStyle.push('visual_markers')
    }
    
    // 结构化 - 数字列表
    if (content.match(/\d[\.\、\)]/)) {
      features.communicationStyle.push('structured_numbered')
    }
    
    // 结构化 - 流程/阶段
    if (content.includes('阶段') || content.includes('步骤') || content.includes('流程') ||
        content.includes('首先') || content.includes('然后') || content.includes('最后') ||
        content.includes('第一') || content.includes('第二') || content.includes('第三')) {
      features.communicationStyle.push('structured_flow')
    }
    
    // 使用类比
    if (content.includes('类比') || content.includes('类似') || content.includes('像') ||
        content.includes('如同') || content.includes('相当于') || content.match(/如.*?般/) ||
        content.includes('好比') || content.includes('就像') || content.includes('类似于')) {
      features.communicationStyle.push('analogical')
    }
    
    // 列举对比
    if (content.includes('vs') || content.includes('对比') || content.includes(' versus ') ||
        content.includes('A)') || content.includes('B)') || content.includes('选项') ||
        content.includes('或者') || content.includes('还是') || content.includes(' versus ') ||
        content.includes('优势') || content.includes('劣势')) {
      features.communicationStyle.push('comparative')
    }

    // ========== 专业领域分析 ==========
    // 商业/战略
    if (content.includes('商业') || content.includes('商业模式') || content.includes('盈利') ||
        content.includes('融资') || content.includes('投资') || content.includes('市场') ||
        content.includes('竞品') || content.includes('战略') || content.includes('增长') ||
        content.includes('收入') || content.includes('成本') || content.includes('利润')) {
      features.expertise.push('business_strategy')
    }
    
    // 产品
    if (content.includes('产品') || content.includes('MVP') || content.includes('用户') ||
        content.includes('需求') || content.includes('功能') || content.includes('迭代') ||
        content.includes('体验') || content.includes('设计') || content.includes('原型')) {
      features.expertise.push('product_management')
    }
    
    // 技术/协议
    if (content.includes('技术') || content.includes('协议') || content.includes('标准') ||
        content.includes('API') || content.includes('架构') || content.includes('RFC') ||
        content.includes('代码') || content.includes('开发') || content.includes('系统')) {
      features.expertise.push('technical_protocol')
    }
    
    // 运营/营销
    if (content.includes('运营') || content.includes('营销') || content.includes('推广') ||
        content.includes('获客') || content.includes('转化') || content.includes('品牌') ||
        content.includes('流量') || content.includes('渠道') || content.includes('投放')) {
      features.expertise.push('growth_marketing')
    }

    return features
  }

  const generateLocalPrompt = (features, name) => {
    const toneMap = {
      'directive': '直接明确，善用指示符强调重点',
      'analytical': '深度分析，善于提问引导思考',
      'candid': '坦诚直接，指出关键问题不绕弯',
      'advisory': '顾问式建议，提供可执行方案'
    }

    const styleMap = {
      'visual_markers': '视觉化标记强化信息层次',
      'structured_numbered': '数字列表结构化呈现',
      'structured_flow': '流程化阐述（首先/然后/最后）',
      'analogical': '善用类比帮助理解',
      'comparative': '对比分析不同选项'
    }

    const toneDesc = features.tone.length > 0
      ? features.tone.slice(0, 2).map(t => toneMap[t] || t).join('、')
      : '专业、务实'

    const styleDesc = features.communicationStyle.length > 0
      ? features.communicationStyle.slice(0, 2).map(s => styleMap[s] || s).join('、')
      : '清晰、有条理'

    const expertiseDesc = features.expertise.length > 0
      ? features.expertise.join('、')
      : '商业战略与产品规划'

    return `# System Prompt for ${name}

## 身份定位
你是 ${name}，一位专注于${expertiseDesc}的 AI 顾问。

## 核心特征
- **语调风格**：${toneDesc}
- **沟通方式**：${styleDesc}
- **专业领域**：${expertiseDesc}

## 行为准则
### 1. 直接且坦诚
- 不回避关键问题，直接指出风险
- 用"👉"符号强调核心结论
- 区分"✅正确路径"和"❌失败路线"

### 2. 结构化呈现
- 复杂概念分阶段阐述
- 使用对比表格展示不同选项
- 每个建议配套解释

### 3. 顾问式引导
- 不只给答案，更给可执行的判断框架
- 常用类比帮助理解
- 强调"下一步建议"

---

*Generated by PAIV-Lite v1.0*`
  }

  const handleCopy = () => {
    if (result?.systemPrompt) {
      navigator.clipboard.writeText(result.systemPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (result?.systemPrompt) {
      const blob = new Blob([result.systemPrompt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `system-prompt-${assistantName}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
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
          <button
            className={inputMethod === 'sample' ? 'active' : ''}
            onClick={() => setInputMethod('sample')}
          >
            <FileText size={16} /> 使用示例对话
          </button>
          <button
            className={inputMethod === 'manual' ? 'active' : ''}
            onClick={() => setInputMethod('manual')}
          >
            <Upload size={16} /> 粘贴对话
          </button>
        </div>

        {inputMethod === 'sample' ? (
          <div className="sample-selector">
            <label>选择对话样本：</label>
            <select
              value={selectedDialogue.id}
              onChange={(e) => {
                const dialogue = SAMPLE_DIALOGUES.find(d => d.id === e.target.value)
                setSelectedDialogue(dialogue)
              }}
            >
              {SAMPLE_DIALOGUES.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
            <div className="preview-box">
              <h4>预览：{selectedDialogue.title}</h4>
              {selectedDialogue.messages.slice(0, 2).map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <strong>{msg.role === 'user' ? '用户' : 'AI'}:</strong>
                  <p>{msg.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="manual-input">
            <textarea
              placeholder={`在此粘贴对话内容...

格式示例：
用户: 你好，请帮我分析这个商业计划
AI: 好的，我来帮你分析。首先我需要了解几个关键问题...
用户: 我的产品是PAIV Protocol，目标是...
AI: 👉 这个产品方向很有潜力，但我需要指出几个关键风险...`}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              rows={12}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
              提示：使用 "用户:" 和 "AI:" 标记对话角色
            </small>
          </div>
        )}

        <div className="options">
          <label>
            助手名称：
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              placeholder="例如：太古龙67"
            />
          </label>
        </div>

        <button
          className="convert-btn"
          onClick={handleConvert}
          disabled={loading || (inputMethod === 'manual' && !manualInput.trim())}
        >
          {loading ? '转换中...' : '🚀 生成 System Prompt'}
        </button>

        {error && <div className="error" style={{ color: '#e74c3c', marginTop: '10px' }}>❌ {error}</div>}
      </div>

      {result && (
        <div className="result-section">
          <div className="result-header">
            <h3>生成的 System Prompt</h3>
            <div className="actions">
              <button onClick={handleCopy} className="icon-btn">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '已复制' : '复制'}
              </button>
              <button onClick={handleDownload} className="icon-btn">
                <Download size={16} /> 下载
              </button>
            </div>
          </div>

          {result.features && (
            <div className="features">
              <h4>检测到的特征：</h4>
              <div className="feature-tags">
                {result.features.tone?.map(t => (
                  <span key={t} className="tag tone">语调: {t}</span>
                ))}
                {result.features.communicationStyle?.map(s => (
                  <span key={s} className="tag style">风格: {s}</span>
                ))}
                {result.features.expertise?.map(e => (
                  <span key={e} className="tag expertise">领域: {e}</span>
                ))}
              </div>
            </div>
          )}

          <pre className="prompt-output">{result.systemPrompt}</pre>
        </div>
      )}
    </div>
  )
}
