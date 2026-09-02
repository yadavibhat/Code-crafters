import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, Input, Tabs } from '../components/ui';
import { sendChatMessage, fetchExamplePrompts } from '../lib/genie_chat_api';
import type { ChatMessage } from '../lib/genie_chat_api';

export const GenieChat: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'general' | 'academic' | 'whatif'>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExamplePrompts(activeMode).then(setPrompts);
  }, [activeMode]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await sendChatMessage(activeMode, textToSend);
      const genieMsg: ChatMessage = {
        sender: 'genie',
        text: data.reply,
        routing_suggestion: data.routing_suggestion,
        resource_cards: data.resource_cards,
        whatif_card: data.whatif_card,
        source_url: data.source_url,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, genieMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'genie',
          text: 'Databricks Genie Agent connection temporarily unavailable. Please refer to official NMIT portal.',
          source_url: 'https://nitte.edu.in/nmit/',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '24px auto', padding: '0 16px 120px' }}>
      {/* Header & 3-Mode Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Universal Genie Agent</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Databricks Unity Catalog governed AI intelligence for NMIT
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'general', label: 'General Mode' },
            { id: 'academic', label: 'Academic Mode' },
            { id: 'whatif', label: 'What-If Mode' },
          ]}
          activeTab={activeMode}
          onChange={(id) => setActiveMode(id as any)}
        />
      </div>

      {/* Example Prompt Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', alignSelf: 'center' }}>Example Prompts:</span>
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleSendMessage(p)}
            style={{
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '4px 12px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            "{p}"
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '300px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Welcome to Genie {activeMode.toUpperCase()} Mode
            </p>
            <p style={{ fontSize: '14px' }}>
              Ask a question above or select an example prompt chip to begin.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {/* Chat Bubble */}
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: msg.sender === 'user' ? 'var(--bg-primary)' : 'var(--surface-color)',
                border: msg.sender === 'user' ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {msg.text}

              {/* General Mode: Inline Routing Suggestion */}
              {msg.routing_suggestion && (
                <div style={{ marginTop: '10px' }}>
                  <Link to={msg.routing_suggestion.path}>
                    <Button variant="primary" size="sm">
                      👉 {msg.routing_suggestion.label}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Academic Mode: Resource Cards */}
              {msg.resource_cards && msg.resource_cards.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  {msg.resource_cards.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                      }}
                    >
                      <Badge variant="accent" style={{ marginBottom: '4px' }}>{card.type}</Badge>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '2px 0' }}>{card.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{card.department}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* What-If Mode: Comparison Card with Disclaimer Footnote */}
              {msg.whatif_card && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '14px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                  }}
                >
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
                    {msg.whatif_card.scenario}
                  </h4>

                  {/* Current vs Projected */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ padding: '8px', background: 'var(--surface-color)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>CURRENT</span>
                      {Object.entries(msg.whatif_card.current_metrics).map(([k, v]) => (
                        <div key={k} style={{ fontSize: '12px', marginTop: '2px' }}>{k}: <strong>{v}</strong></div>
                      ))}
                    </div>
                    <div style={{ padding: '8px', background: 'var(--accent-light)', borderLeft: '2px solid var(--accent-color)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-color)' }}>PROJECTED</span>
                      {Object.entries(msg.whatif_card.projected_metrics).map(([k, v]) => (
                        <div key={k} style={{ fontSize: '12px', marginTop: '2px' }}>{k}: <strong>{v}</strong></div>
                      ))}
                    </div>
                  </div>

                  {/* Trade-offs */}
                  {msg.whatif_card.trade_offs.map((t, tIdx) => (
                    <p key={tIdx} style={{ fontSize: '12px', color: 'var(--warning-color)', marginBottom: '4px' }}>
                      ⚠️ {t}
                    </p>
                  ))}

                  {/* Mandatory Estimate Disclaimer Footnote */}
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--badge-synthetic)' }}>
                    <em>{msg.whatif_card.disclaimer}</em>
                  </div>
                </div>
              )}

              {/* Official Source Link */}
              {msg.source_url && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  <a href={msg.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>
                    🔗 Source: Official NMIT Record
                  </a>
                </div>
              )}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <span>Genie is reasoning over governed Unity Catalog data...</span>
          </div>
        )}
      </div>

      {/* Persistent Chat Input */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '818px', padding: '0 16px', zIndex: 950 }}>
        <Card style={{ padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '2px solid var(--accent-color)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <div style={{ flex: 1 }}>
              <Input
                placeholder={`Ask Genie in ${activeMode.toUpperCase()} mode...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="md" isLoading={loading}>
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
