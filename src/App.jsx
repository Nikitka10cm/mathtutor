
import React, { useState } from "react";

const topics = [
  { name: "Функции", icon: "📈", description: "Свойства, графики и преобразования" },
  { name: "Производная", icon: "∂", description: "Исследование функций и задачи" },
  { name: "Интегралы", icon: "∫", description: "Первообразная и площадь" },
  { name: "Тригонометрия", icon: "📐", description: "Формулы, уравнения и тождества" },
  { name: "Уравнения и неравенства", icon: "⚖️", description: "Алгебраические методы" },
  { name: "Геометрия", icon: "△", description: "Планиметрия и стереометрия" },
  { name: "Вероятность", icon: "🎲", description: "Комбинаторика и статистика" },
  { name: "Текстовые задачи", icon: "🧩", description: "Математика в реальной жизни" }
];

const initialMessage = {
  role: "tutor",
  text: "Привет! Я твой математический тьютор. Моя задача — помочь тебе самостоятельно разобраться в математике. С чего начнём?"
};

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([initialMessage]);
  const [history, setHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [level, setLevel] = useState("10–11 класс");
  const [loading, setLoading] = useState(false);

  function chooseTopic(topic) {
    setSelectedTopic(topic);
    setHistory([]);
    setMessages([
      initialMessage,
      {
        role: "tutor",
        text: `Отлично! Сегодня изучаем тему «${topic.name}». ${topic.description}. Есть конкретная задача или хочешь сначала проверить свои знания?`
      }
    ]);
  }

  async function sendMessage() {
    const question = answer.trim();

    if (!question || loading) return;

    const newHistory = [
      ...history,
      { role: "user", content: question }
    ];

    setAnswer("");
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { role: "student", text: question }
    ]);

    try {
      const contextualHistory = selectedTopic
        ? [
            {
              role: "user",
              content: `Ученик изучает тему "${selectedTopic.name}", уровень: ${level}. Помогай ему в рамках этой темы.`
            },
            ...newHistory
          ]
        : newHistory;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: contextualHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера");
      }

      setHistory([
        ...newHistory,
        { role: "assistant", content: data.reply }
      ]);

      setMessages(prev => [
        ...prev,
        { role: "tutor", text: data.reply }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "tutor",
          text: "Не удалось получить ответ от ИИ. Проверь подключение и попробуй ещё раз. Ошибка: " + error.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    setSelectedTopic(null);
    setHistory([]);
    setMessages([initialMessage]);
    setAnswer("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">MATH TUTOR</div>
            <div className="brand-caption">ТВОЙ ЦИФРОВОЙ НАСТАВНИК</div>
          </div>
        </div>

        <div className="sidebar-label">ОБУЧЕНИЕ</div>
        <button className="nav-item active">✦ Мой тьютор</button>
        <button className="nav-item">▤ Мои занятия</button>
        <button className="nav-item">◷ Мой прогресс</button>

        <div className="sidebar-bottom">
          <div className="student-card">
            <div className="avatar">У</div>
            <div>
              <div className="student-name">Ученик</div>
              <div className="student-class">Старшая школа</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Рабочее пространство <span>/</span> Мой тьютор
          </div>
          <div className="grade-select">
            <span>Уровень:</span>
            <select value={level} onChange={e => setLevel(e.target.value)}>
              <option>10–11 класс</option>
              <option>Подготовка к ЕГЭ</option>
              <option>Повторение базы</option>
            </select>
          </div>
        </header>

        <section className="welcome-section">
          <div className="welcome-tag">
            <span></span> ПРОСТРАНСТВО ДЛЯ МЫШЛЕНИЯ
          </div>
          <h1>
            Математика начинается<br />
            с <span>понимания.</span>
          </h1>
          <p>
            Не просто получай ответы. Учись рассуждать, находить закономерности
            <br className="desktop-break" /> и самостоятельно приходить к правильным решениям.
          </p>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ТВОЯ ТРАЕКТОРИЯ</div>
              <h2>Что будем изучать?</h2>
            </div>
            <button className="reset-button" onClick={resetChat}>
              ↺ Сбросить занятие
            </button>
          </div>

          <div className="topic-grid">
            {topics.map((topic, index) => (
              <button
                key={topic.name}
                className={`topic-card ${selectedTopic?.name === topic.name ? "selected" : ""}`}
                onClick={() => chooseTopic(topic)}
              >
                <div className="topic-top">
                  <div className="topic-icon">{topic.icon}</div>
                  <span className="topic-number">0{index + 1}</span>
                </div>
                <div className="topic-name">{topic.name}</div>
                <div className="topic-description">{topic.description}</div>
              </button>
            ))}
          </div>

          <section className="chat-section">
            <div className="chat-header">
              <div>
                <div className="eyebrow">ИНТЕЛЛЕКТУАЛЬНЫЙ ПОМОЩНИК</div>
                <h2>{selectedTopic ? selectedTopic.name : "Диалог с тьютором"}</h2>
              </div>
              <div className="online-status">
                <span></span> ИИ-ТЬЮТОР
              </div>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === "tutor" ? "M" : "У"}
                  </div>
                  <div className="message-body">
                    <div className="message-author">
                      {message.role === "tutor" ? "MATH TUTOR" : "ТЫ"}
                    </div>
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message tutor">
                  <div className="message-avatar">M</div>
                  <div className="message-body">
                    <div className="message-author">MATH TUTOR</div>
                    <div className="message-text">Думаю над твоим вопросом...</div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Напиши свой ответ или задай вопрос..."
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!answer.trim() || loading}
              >
                {loading ? "..." : "Отправить ↗"}
              </button>
            </div>

            <div className="chat-note">
              ИИ помогает самостоятельно находить решения и понимать математику.
            </div>
          </section>
        </section>

        <footer>
          © 2026 MATH TUTOR
          <span>СОЗДАНО ДЛЯ ОСМЫСЛЕННОГО ОБУЧЕНИЯ</span>
        </footer>
      </main>
    </div>
  );
}
