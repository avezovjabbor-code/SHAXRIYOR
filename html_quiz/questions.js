// 20 ta saralangan HTML test savollari
const HTML_QUESTIONS = [
  {
    id: 1,
    question: "HTML qisqartmasining to'liq va to'g'ri ma'nosi nima?",
    code: null,
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperTransfer Mark Language",
      "Home Tool Markup Language"
    ],
    correct: 0,
    explanation: "HTML - HyperText Markup Language (Gipermatnli belgilash tili) bo'lib, butun dunyo bo'ylab veb-sahifalarning tuzilishi va mazmunini yaratish uchun ishlatiladigan standart tildir."
  },
  {
    id: 2,
    question: "Veb-sahifadagi eng muhim va eng katta darajadagi sarlavha qaysi teg yordamida yoziladi?",
    code: "<!-- Misol uchun sarlavha -->\n<...>Mening Veb Saytim</...>",
    options: [
      "<heading>",
      "<h6>",
      "<h1>",
      "<head>"
    ],
    correct: 2,
    explanation: "HTML da sarlavhalar <h1> dan <h6> gacha bo'ladi. Eng yuqori va eng muhim sarlavha darajasi <h1> hisoblanadi (SEO va semantika uchun sahifada 1 marta ishlatilishi tavsiya etiladi)."
  },
  {
    id: 3,
    question: "Boshqa veb-sahifaga giperhavola (link) yaratish uchun qaysi teg va qaysi atribut ishlatiladi?",
    code: '<a ...="https://google.com">Google-ga o\'tish</a>',
    options: [
      "<link src=\"...\">",
      "<a href=\"...\">",
      "<a src=\"...\">",
      "<url path=\"...\">"
    ],
    correct: 1,
    explanation: "Giperhavola yaratish uchun <a> (anchor) tegi va manzilni ko'rsatish uchun 'href' (hypertext reference) atributi ishlatiladi."
  },
  {
    id: 4,
    question: "Veb-sahifaga rasm qo'shish uchun qaysi teg ishlatiladi va uning rasm yo'lini ko'rsatuvchi asosiy atributi nima?",
    code: '<img ...="rasm.jpg" alt="Tabiat manzarasi">',
    options: [
      "src atributi bilan <img> tegi",
      "href atributi bilan <image> tegi",
      "link atributi bilan <pic> tegi",
      "url atributi bilan <img> tegi"
    ],
    correct: 0,
    explanation: "HTML da rasmlar <img> tegi orqali ulanadi va fayl manzili 'src' (source) atributida, muqobil matn esa 'alt' atributida beriladi. <img> yopiluvchi juft tegga ega emas."
  },
  {
    id: 5,
    question: "Raqamlangan tartibli ro'yxat (1, 2, 3...) yaratish uchun qaysi teglardan foydalaniladi?",
    code: "<...>\n  <li>Birinchi dars</li>\n  <li>Ikkinchi dars</li>\n</...>",
    options: [
      "<ul> va <li>",
      "<dl> va <dt>",
      "<ol> va <li>",
      "<list> va <item>"
    ],
    correct: 2,
    explanation: "<ol> - Ordered List (Tartiblangan ro'yxat) bo'lib, ro'yxat elementlarini raqamlar yoki harflar bilan ketma-ket chiqaradi. <ul> esa belgilangan (unordered) ro'yxatdir."
  },
  {
    id: 6,
    question: "HTML5 da sahifaning pastki qismi (mualliflik huquqi, ijtimoiy tarmoq havolalari) uchun mo'ljallangan semantik teg qaysi?",
    code: "<...>\n  <p>&copy; 2026 Barcha huquqlar himoyalangan.</p>\n</...>",
    options: [
      "<bottom>",
      "<footer>",
      "<section type=\"bottom\">",
      "<end>"
    ],
    correct: 1,
    explanation: "<footer> tegi sahifaning yoki ma'lum bir bo'limning eng quyi yakunlovchi qismini semantik jihatdan ifodalash uchun ishlatiladi."
  },
  {
    id: 7,
    question: "HTML formalarida bir qatorli matn kiritish maydoni yaratish uchun qaysi teg va tur tanlanadi?",
    code: "<label>Ismingiz:</label>\n<... type=\"...\">",
    options: [
      "<input type=\"text\">",
      "<textfield>",
      "<input type=\"string\">",
      "<textbox>"
    ],
    correct: 0,
    explanation: "Standart bir qatorli matn kiritish uchun <input> tegiga type=\"text\" atributi beriladi."
  },
  {
    id: 8,
    question: "Matn orasida yangi qatorga o'tish (enter bosish kabi bo'shliq) hosil qiluvchi yopilmaydigan teg qaysi?",
    code: "<p>Salom dunyo!<...>\nYangi qatordagi matn.</p>",
    options: [
      "<break>",
      "<lb>",
      "<br>",
      "<newline>"
    ],
    correct: 2,
    explanation: "<br> (break) tegi matnda yangi qatorga tushish uchun xizmat qiladi va u o'z-o'zidan yopiluvchi (void/self-closing) teg hisoblanadi."
  },
  {
    id: 9,
    question: "Havola (link) bosilganda manzil yangi oynada (vkladkada) ochilishi uchun qaysi atribut va qiymat beriladi?",
    code: '<a href="https://example.com" ...="_blank">Havola</a>',
    options: [
      'target="_blank"',
      'window="new"',
      'open="newtab"',
      'rel="external"'
    ],
    correct: 0,
    explanation: "target=\"_blank\" atributi havolani brauzerning yangi yorlig'ida (tabida) yoki yangi oynasida ochilishini ta'minlaydi."
  },
  {
    id: 10,
    question: "Har qanday to'g'ri HTML5 hujjatining eng birinchi qatorida yozilishi shart bo'lgan deklaratsiya qaysi?",
    code: "...\n<html lang=\"uz\">\n<head>...",
    options: [
      "<?xml version=\"1.0\"?>",
      "<!DOCTYPE html>",
      "<doctype html5>",
      "<html>"
    ],
    correct: 1,
    explanation: "<!DOCTYPE html> deklaratsiyasi brauzerga ushbu hujjat zamonaviy HTML5 standartida yozilganligini bildiradi va 'quirks mode' xatolarining oldini oladi."
  },
  {
    id: 11,
    question: "HTML jadvalida (table) gorizontal qator (row) yaratish uchun qaysi teg ishlatiladi?",
    code: "<table>\n  <...>\n    <td>Ism</td>\n    <td>Familiya</td>\n  </...>\n</table>",
    options: [
      "<th>",
      "<row>",
      "<tr>",
      "<line>"
    ],
    correct: 2,
    explanation: "<tr> - Table Row (Jadval qatori) bo'lib, jadvalning gorizontal qatorini tashkil etadi. Uning ichida esa <td> (katakcha) yoki <th> (sarlavha katakchasi) joylashadi."
  },
  {
    id: 12,
    question: "Veb-sahifaning foydalanuvchiga to'g'ridan-to'g'ri ko'rinmaydigan, brauzer va metama'lumotlar saqlanadigan qismi qaysi?",
    code: "<!DOCTYPE html>\n<html>\n  <...>\n    <title>Sarlavha</title>\n  </...>\n  <body>...</body>\n</html>",
    options: [
      "<header>",
      "<meta>",
      "<head>",
      "<top>"
    ],
    correct: 2,
    explanation: "<head> tegi sahifaning metama'lumotlari, title, ulangan CSS/shrift fayllari va boshqa texnik ma'lumotlarni saqlaydi. Ko'rinadigan asosiy tana esa <body> da bo'ladi."
  },
  {
    id: 13,
    question: "HTML5 da qo'shimcha plaginlarsiz to'g'ridan-to'g'ri video ijro etish uchun qaysi teg joriy qilingan?",
    code: '<... controls width="400">\n  <source src="video.mp4" type="video/mp4">\n</...>',
    options: [
      "<movie>",
      "<media>",
      "<video>",
      "<player>"
    ],
    correct: 2,
    explanation: "HTML5 da mahalliy multimedia uchun maxsus <video> va <audio> teglari joriy qilingan. controls atributi orqali pleer tugmalari faollashadi."
  },
  {
    id: 14,
    question: "Matnga vizual qalinlikdan tashqari, semantik 'jiddiy ahamiyat va muhimlik' yuklovchi teg qaysi?",
    code: "<p>E'tibor bering: Imtihon vaqti <...>chegaralangan</...>!</p>",
    options: [
      "<b>",
      "<strong>",
      "<bold>",
      "<i>"
    ],
    correct: 1,
    explanation: "<strong> tegi nafaqat matnni qalin qilib ko'rsatadi, balki qidiruv tizimlari va screen reader (ko'zi ojizlar dasturlari) uchun matnning o'ta muhim ahamiyatga ega ekanini bildiradi."
  },
  {
    id: 15,
    question: "Forma yuborilishidan oldin foydalanuvchi ma'lum bir maydonni to'ldirishi majburiy ekanligini belgilovchi atribut qaysi?",
    code: '<input type="email" ... placeholder="Emailingizni kiriting">',
    options: [
      "validate",
      "important",
      "required",
      "mandatory"
    ],
    correct: 2,
    explanation: "'required' mantiqiy (boolean) atributi bo'lib, unga ega bo'lgan forma maydoni bo'sh bo'lsa, forma serverga yuborilmaydi va brauzer ogohlantirish beradi."
  },
  {
    id: 16,
    question: "Brauzer tabida (yorlig'ida) va qidiruv tizimi natijalarida sahifa nomi sifatida ko'rinadigan teg qaysi?",
    code: "<head>\n  <...>Mening Birinchi Loyiham</...>\n</head>",
    options: [
      "<title>",
      "<caption>",
      "<h1>",
      "<meta name=\"title\">"
    ],
    correct: 0,
    explanation: "<title> tegi HTML hujjatining nomini ifodalaydi va u brauzerning yuqori oynasi/yorlig'i sarlavhasida ko'rinadi."
  },
  {
    id: 17,
    question: "Ko'p qatorli, uzun fikr yoki xabar kiritish uchun HTML da qaysi forma elementi qo'llaniladi?",
    code: '<... rows="5" cols="40" placeholder="Fikringizni yozing..."></...>',
    options: [
      '<input type="multiline">',
      '<input type="textbox">',
      '<textarea>',
      '<comment>'
    ],
    correct: 2,
    explanation: "<textarea> tegi foydalanuvchiga bir necha qatordan iborat katta matnlarni (sharhlar, murojaatlar) kiritish imkoniyatini beradi."
  },
  {
    id: 18,
    question: "HTML5 semantikasida mustaqil, o'z-o'zicha to'liq ma'noga ega bo'lgan maqola, blog posti yoki yangilik uchun qaysi teg ishlatiladi?",
    code: "<...>\n  <h2>Bugungi Yangiliklar</h2>\n  <p>Toshkentda IT haftaligi boshlandi...</p>\n</...>",
    options: [
      "<section>",
      "<article>",
      "<div>",
      "<main>"
    ],
    correct: 1,
    explanation: "<article> tegi mustaqil, qayta ishlatilishi yoki boshqa joyda alohida chop etilishi mumkin bo'lgan maqola, xabar yoki blog postini ifodalaydi."
  },
  {
    id: 19,
    question: "Bir nechta variantdan foydalanuvchiga FAQAT bittasini tanlash imkonini beruvchi input turi qaysi?",
    code: '<input type="..." name="jins" value="erkak"> Erkak\n<input type="..." name="jins" value="ayol"> Ayol',
    options: [
      "checkbox",
      "select",
      "radio",
      "button"
    ],
    correct: 2,
    explanation: "type=\"radio\" (radio button) bitta guruhga mansub (bir xil 'name' atributiga ega) bo'lgan variantlar ichidan foydalanuvchiga faqat bitta variantni tanlash imkonini beradi."
  },
  {
    id: 20,
    question: "Tashqi CSS faylini HTML hujjatga ulash uchun odatda <head> ichida qaysi teg to'g'ri qo'llaniladi?",
    code: '<head>\n  <... rel="stylesheet" href="style.css">\n</head>',
    options: [
      "<style src=\"style.css\">",
      "<link rel=\"stylesheet\" href=\"style.css\">",
      "<script href=\"style.css\">",
      "<css link=\"style.css\">"
    ],
    correct: 1,
    explanation: "Tashqi uslublar jadvali (CSS) <link rel=\"stylesheet\" href=\"style.css\"> orqali HTML sahifasining <head> bo'limiga to'g'ri ulanadi."
  }
];
