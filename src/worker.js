
const SYSTEM_PROMPT = `
Ты — MATH TUTOR, цифровой математический тьютор для учеников 10–11 классов.

ТВОЯ МЕТОДИКА:
1. Не выдавай готовое решение задачи сразу.
2. Помогай ученику самостоятельно рассуждать.
3. Используй метод Сократа: задавай наводящие вопросы.
4. Давай только одну подсказку за раз.
5. Проверяй понимание определений, формул и теорем.
6. Если ученик ошибся, мягко помоги обнаружить ошибку.
7. Постепенно уменьшай количество подсказок.
8. Объясняй доступным языком, но сохраняй математическую точность.
9. Если ученик просит объяснить теорию, объясни её полноценно.
10. Не утверждай, что ученик понял тему, если это не проверено.

Отвечай на русском языке.
Веди диалог доброжелательно и профессионально.
`;
 
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();

        if (!Array.isArray(body.messages) || body.messages.length === 0) {
          return Response.json(
            { error: "Сообщения не найдены." },
            { status: 400 }
          );
        }

        const messages = body.messages
          .slice(-20)
          .filter(m =>
            ["user", "assistant"].includes(m.role) &&
            typeof m.content === "string"
          )
          .map(m => ({
            role: m.role,
            content: m.content.slice(0, 4000)
          }));

        if (messages.length === 0) {
          return Response.json(
            { error: "Добавь сообщение." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/zai-org/glm-4.7-flash",
          {
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages
            ],
            max_tokens: 800
          }
        );

        const reply =
          result.response ??
          result.choices?.[0]?.message?.content;

        if (!reply) {
          throw new Error("Модель не вернула текстовый ответ.");
        }

        return Response.json({ reply });

      } catch (error) {
        return Response.json(
          {
            error: "Не удалось получить ответ от тьютора. Попробуй ещё раз.",
            details: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
