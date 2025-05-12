const fetch = require('node-fetch');
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const { name, phone, email, message } = JSON.parse(event.body);

        const text = `📩 Yangi murojaat:\n🧑 Ism: ${name}\n📞 Telefon: ${phone}\n📧 Email: ${email}\n📝 Xabar: ${message}`;

        const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;

        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: text,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok && data.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Xabar yuborildi!' }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Xabar yuborishda xato yuz berdi. Telegram API javobi: ' + data.description }),
            };
        }
    } catch (error) {
        console.error("Xatolik:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Xato yuz berdi: ' + error.message }),
        };
    }
};
