
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
  text: "Привет! Я твой математический тьютор. Моя задача — не решить пример за тебя, а помочь тебе самому разобраться и найти решение. С чего начнём?"
};

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([initialMessage]);
  const [answer, setAnswer] = useState("");
  const [level, setLevel] = useState("10–11 класс");

  function chooseTopic(topic) {
    setSelectedTopic(topic);
    setMessages([
      initialMessage,
      {
        role: "tutor",
        text: `Отлично! Сегодня разбираем тему «${topic.name}». ${topic.description}. Есть конкретная задача или хочешь сначала проверить свои знания?`
      }
    ]);
  }

  function sendMessage() {
    if (!answer.trim()) return;

    const studentAnswer = answer.trim();

    setMessages(prev => [
      ...prev,
      { role: "student", text: studentAnswer },
      {
        role: "tutor",
        text: "Хорошая попытка! Давай разберём твою мысль. Как ты думаешь, какое математическое свойство или правило поможет сделать следующий шаг?"
      }
    ]);

    setAnswer("");
  }

  function resetChat() {
    setSelectedTopic(null);
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
          <div className="breadcrumb">Рабочее пространство <span>/</span> Мой тьютор</div>
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
          <div className="welcome-tag"><span></span> ПРОСТРАНСТВО ДЛЯ МЫШЛЕНИЯ</div>
          <h1>Математика начинается<br />с <span>понимания.</span></h1>
          <p>Не просто получай ответы. Учись рассуждать, находить закономерности<br className="desktop-break" /> и самостоятельно приходить к правильным решениям.</p>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ТВОЯ ТРАЕКТОРИЯ</div>
              <h2>Что будем изучать?</h2>
            </div>
            <button className="reset-button" onClick={resetChat}>↺ Сбросить занятие</button>
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
              <div className="online-status"><span></span> ДЕМО-РЕЖИМ</div>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-avatar">{message.role === "tutor" ? "M" : "У"}</div>
                  <div className="message-body">
                    <div className="message-author">{message.role === "tutor" ? "MATH TUTOR" : "ТЫ"}</div>
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Напиши свой ответ или задай вопрос..."
              />
              <button onClick={sendMessage} disabled={!answer.trim()}>Отправить ↗</button>
            </div>
            <div className="chat-note">Сейчас работает демонстрационный диалог. Подключение ИИ будет следующим этапом.</div>
          </section>
        </section>

        <footer>© 2026 MATH TUTOR <span>СОЗДАНО ДЛЯ ОСМЫСЛЕННОГО ОБУЧЕНИЯ</span></footer>
      </main>
    </div>
  );
}
