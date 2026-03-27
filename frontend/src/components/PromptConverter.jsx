import { useState } from 'react'
import axios from 'axios'
import { Upload, FileText, Copy, Check, Sparkles, Download } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://paiv-lite-v0-01.onrender.com'

// 示例对话数据 - ChatGPT与太古龙66的PAIV协议深度对话
const SAMPLE_DIALOGUES = [
  {
    id: 'paiv-evolution',
    title: 'PAIV Protocol: 从理念到商业计划书',
    description: '12轮深度对话，展示从协议设计到商业落地的完整思考过程',
    messages: [
      { 
        role: 'user', 
        content: '我和Gemini和豆包联合起草一份协议，请你评议和修改。另外邀请你作为发起人之一。协议如下：[PAIV协议V001.001.003全文]' 
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
      },
      { 
        role: 'user', 
        content: '是否可以做成逐步演进的步骤：简单产品→倡议→免费使用→注册会员？' 
      },
      { 
        role: 'assistant', 
        content: '你这个思路正确，但需要升级——否则容易走成失败路线。\n\n✅ 正确路径：\n工具（解决问题）→ 使用（形成依赖）→ 标准（建立共识）→ 会员（商业化）\n\n❌ 为什么"先倡议"会失败：只有讨论，没有用户\n\n四阶段演进：\nPhase 1：PAIV Lite Tool（极简工具，不谈协议）\nPhase 2：建立依赖（保存历史、多版本）\nPhase 3：推出标准（"已有X用户用这个格式"）\nPhase 4：会员商业化（卖能力，不是卖存储）\n\n核心原则：先让1000个人离不开你，再让世界认同你。' 
      },
      { 
        role: 'user', 
        content: '请帮我再次完善，能直接给投资人看的商业计划书。并请做一份10页的PPT。' 
      },
      { 
        role: 'assistant', 
        content: '已升级为投资人可直接阅读版本，关键强化：\n\n1. 投资人一句话定位：PAIV = AI时代的用户层操作系统\n2. 强化Demo：3秒跨模型迁移人格\n3. 明确融资阶段：Pre-seed/MVP阶段，$1-3M Seed\n4. 护城河：Schema标准 + Adapter技术壁垒 + 网络效应\n5. GTM具体化：1000用户→Demo传播→推协议\n\n但还缺决定性因素：Demo或截图。\n\n下一步建议：我帮你做「Demo + 融资展示一页图」，把你从"想法项目"推进到"可以投的项目"。' 
      }
    ]
  }
]

export default function PromptConverter() {
  const [inputMethod, setInputMethod] = useState('sample') // 'sample' | 'manual'
  const [selectedDialogue, setSelectedDialogue] = useState(SAMPLE_DIALOGUES[0])
  const [manualInput, setManualInput] = useState('')
  const [assistantName, setAssistantName] = useState('太古龙67')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const handleConvert = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const dialogues = inputMethod === 'sample' 
        ? SAMPLE_DIALOGUES 
        : parseManualInput(manualInput)
      
      const response = await axios.post(`${API_URL}/api/convert`, {
        dialogues,
        assistantName
      })
      
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
      // 如果 API 不可用，使用本地转换逻辑
      handleLocalConvert()
    } finally {
      setLoading(false)
    }
  }

  const handleLocalConvert = () => {
    // 本地备用转换逻辑
    const dialogues = inputMethod === 'sample' 
      ? SAMPLE_DIALOGUES 
      : parseManualInput(manualInput)
    
    const features = extractFeatures(dialogues)
    const systemPrompt = generateLocalPrompt(features, assistantName)
    
    setResult({
      success: true,
      systemPrompt,
      features
    })
  }

  const parseManualInput = (text) => {
    // 简单解析用户粘贴的对话
    return [{
      id: 'manual-1',
      title: '用户输入对话',
      messages: [{ role: 'user', content: text }, { role: 'assistant', content: '...' }]
    }]
  }

  const extractFeatures = (dialogues) => {
    const features = {
      tone: [],
      communicationStyle: [],
      expertise: []
    }
    
    const allContent = dialogues.flatMap(d => 
      d.messages.filter(m => m.role === 'assistant').map(m => m.content)
    ).join(' ')
    
    // 语调分析
    if (allContent.includes('👉') || allContent.includes('✅') || allContent.includes('🚀')) {
      features.tone.push('directive')
    }
    if (allContent.includes('？') || allContent.includes('为什么')) {
      features.tone.push('analytical')
    }
    if (allContent.includes('坦诚') || allContent.includes('关键')) {
      features.tone.push('candid')
    }
    
    // 沟通风格
    if (allContent.includes('✅') || allContent.includes('❌') || allContent.includes('👉')) {
      features.communicationStyle.push('visual_markers')
    }
    if (allContent.match(/\d\./) || allContent.includes('阶段') || allContent.includes('步骤')) {
      features.communicationStyle.push('structured')
    }
    if (allContent.includes('类比') || allContent.includes('类似')) {
      features.communicationStyle.push('analogical')
    }
    if (allContent.includes('建议') || allContent.includes('策略')) {
      features.communicationStyle.push('advisory')
    }
    
    // 专业领域
    if (allContent.includes('商业化') || allContent.includes('融资') || allContent.includes('投资')) {
      features.expertise.push('business_strategy')
    }
    if (allContent.includes('协议') || allContent.includes('标准') || allContent.includes('RFC')) {
      features.expertise.push('protocol_design')
    }
    if (allContent.includes('产品') || allContent.includes('用户') || allContent.includes('MVP')) {
      features.expertise.push('product_management')
    }
    
    return features
  }

  const generateLocalPrompt = (features, name) => {
    const toneMap = {
      'directive': '直接明确，善用指示符（👉）强调重点',
      'analytical': '深度分析，善于提问引导思考',
      'candid': '坦诚直接，指出关键问题不绕弯'
    }
    
    const styleMap = {
      'visual_markers': '视觉化标记（✅❌👉）强化信息层次',
      'structured': '结构化呈现（数字列表、阶段划分）',
      'analogical': '善用类比（类似Stripe/Twilio）',
      'advisory': '顾问式建议，提供可执行方案'
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
你是 ${name}，一位专注于产品战略、商业化和协议设计的 AI 顾问。

## 核心特征
- **语调风格**：${toneDesc}
- **沟通方式**：${styleDesc}
- **专业领域**：${expertiseDesc}

## 行为准则

### 1. 直接且坦诚
- 不回避关键问题，直接指出风险（"但这不影响更重要的事"）
- 用"👉"符号强调核心结论
- 区分"✅正确路径"和"❌失败路线"

### 2. 结构化呈现
- 复杂概念分阶段阐述（Phase 1/2/3/4）
- 使用对比表格展示不同选项
- 每个建议配套"为什么"的解释

### 3. 顾问式引导
- 不只给答案，更给"可执行的判断框架"
- 常用类比：Stripe/TCP-IP/Notion 等成功案例
- 强调"下一步建议"而非仅分析现状

### 4. 视觉化标记
- ✅ = 确认、正确、已完成
- ❌ = 错误、避免、失败路线
- ❗ = 关键警告、必须注意
- 👉 = 核心结论、下一步行动

## 沟通模板

**给出建议时**：
"你可以这样做，但我需要帮你把关键问题讲清楚：[风险分析]

但这不影响更重要的事：[转折到解决方案]

✅ 正确路径：[具体方案]
❌ 为什么其他方式不行：[对比分析]
👉 最关键的一步：[行动项]"

## 上下文记忆
- 追踪项目演进（从理念→协议→商业计划）
- 记住用户的决策偏好（务实导向、快速迭代）
- 保持术语一致性（PAIV、MVP、RFC等）

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
        <p>从对话样本中提取特征，生成 Gemini/Claude 可用的 System Prompt</p>
      </div>

      <div className="input-section">
        <div className="input-tabs">
          <button 
            className={inputMethod === 'sample' ? 'active' : ''}
            onClick={() => setInputMethod('sample')}
          >
            <FileText size={16} />
            使用示例对话
          </button>
          <button 
            className={inputMethod === 'manual' ? 'active' : ''}
            onClick={() => setInputMethod('manual')}
          >
            <Upload size={16} />
            粘贴对话
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
              placeholder="在此粘贴对话内容...\n\n格式示例：\n用户: 你好\nAI: 你好！有什么可以帮你的吗？"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              rows={8}
            />
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
          disabled={loading}
        >
          {loading ? '转换中...' : '🚀 生成 System Prompt'}
        </button>

        {error && <div className="error">错误: {error}</div>}
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
                <Download size={16} />
                下载
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
