/* Lumen i18n: swaps UI text live for the chosen language.
   Letter content is never in this table, so letters stay in the language they were written in.
   Row order: English, Tiếng Việt, Tagalog, 한국어, 中文, 日本語, Español */
(function () {
  var LANGS = ["English", "Tiếng Việt", "Tagalog", "한국어", "中文", "日本語", "Español"];
  var CODES = ["en", "vi", "tl", "ko", "zh-Hans", "ja", "es"];

  var ROWS = [
    // Welcome (oval layout)
    ["Welcome.", "Chào mừng.", "Maligayang pagdating.", "환영해요.", "欢迎。", "ようこそ。", "Bienvenida."],
    ["Share what your week really took.", "Chia sẻ những gì tuần này thật sự cần.", "Ibahagi kung ano talaga ang hinihingi ng linggo mo.", "이번 주가 정말 어땠는지 나눠요.", "分享这一周真正的模样。", "今週ほんとうにかかったことを。", "Comparte lo que de verdad te pidió la semana."],
    ["Let’s get started", "Bắt đầu nào", "Simulan na natin", "시작해요", "开始吧", "はじめよう", "Empecemos"],
    ["By continuing you agree to our ", "Khi tiếp tục, bạn đồng ý với ", "Sa pagpapatuloy, sumasang-ayon ka sa aming ", "계속하면 다음에 동의하게 돼요: ", "继续即表示你同意我们的", "続けると、次に同意したことになります：", "Al continuar, aceptas nuestros "],
    // Welcome
    ["Welcome", "Chào mừng", "Maligayang pagdating", "환영해요", "欢迎", "ようこそ", "Bienvenida"],
    ["Share what your", "Chia sẻ những gì", "Ibahagi kung ano talaga", "이번 주가 정말", "分享这一周", "今週ほんとうに", "Comparte lo que"],
    ["week really took.", "tuần này thật sự cần.", "ang hinihingi ng linggo mo.", "어땠는지 나눠요.", "真正的模样。", "かかったことを。", "de verdad te pidió la semana."],
    ["Letters, photos and voice notes between you and home, sent whenever you’re ready.", "Thư, ảnh và tin nhắn thoại giữa bạn và gia đình, gửi bất cứ khi nào bạn sẵn sàng.", "Mga liham, larawan at voice note sa pagitan mo at ng tahanan, ipadala kahit kailan ka handa.", "나와 집 사이의 편지, 사진, 음성 메모. 준비되면 언제든 보내요.", "你和家人之间的信、照片和语音，准备好了随时寄出。", "あなたと家族をつなぐ手紙、写真、ボイスメモ。好きなときに送れます。", "Cartas, fotos y notas de voz entre tú y tu casa, enviadas cuando estés lista."],
    ["Small prompts, never a report", "Gợi ý nhỏ, không bao giờ là báo cáo", "Maliliit na tanong, hindi kailanman ulat", "작은 질문, 보고서는 아니에요", "小小的提示，绝不是汇报", "小さな問いかけ、報告ではありません", "Pequeñas ideas, nunca un informe"],
    ["One photo or a few words is enough.", "Một bức ảnh hay vài chữ là đủ.", "Sapat na ang isang larawan o ilang salita.", "사진 한 장이나 몇 마디면 충분해요.", "一张照片或几句话就够了。", "写真1枚や数語で十分です。", "Basta con una foto o unas palabras."],
    ["Letters wait until they’re opened", "Thư sẽ chờ cho đến khi được mở", "Naghihintay ang liham hanggang mabuksan", "편지는 열어볼 때까지 기다려요", "信会一直等到被打开", "手紙は開かれるまで待っています", "Las cartas esperan hasta que se abren"],
    ["No need to be online at the same time.", "Không cần trực tuyến cùng lúc.", "Hindi kailangang sabay kayong online.", "동시에 접속할 필요가 없어요.", "不需要同时在线。", "同時にオンラインでなくて大丈夫。", "No hace falta estar en línea a la vez."],
    ["Photos, voice notes or words", "Ảnh, tin nhắn thoại hoặc lời viết", "Larawan, voice note o salita", "사진, 음성 메모 또는 글", "照片、语音或文字", "写真、ボイスメモ、または言葉", "Fotos, notas de voz o palabras"],
    ["Whatever’s easiest for you this week.", "Cách nào dễ nhất với bạn tuần này.", "Kung ano ang pinakamadali para sa iyo ngayong linggo.", "이번 주에 가장 편한 방법으로요.", "这周怎么方便就怎么来。", "今週いちばん楽な方法で。", "Lo que te resulte más fácil esta semana."],
    ["Get started", "Bắt đầu", "Magsimula", "시작하기", "开始", "はじめる", "Empezar"],
    ["By tapping ‘Get started’ you agree to our ", "Khi nhấn ‘Bắt đầu’, bạn đồng ý với ", "Sa pag-tap ng ‘Magsimula’, sumasang-ayon ka sa aming ", "‘시작하기’를 누르면 다음에 동의하게 됩니다: ", "点击“开始”即表示你同意我们的", "「はじめる」をタップすると、次に同意したことになります：", "Al tocar ‘Empezar’ aceptas nuestros "],
    ["Terms", "Điều khoản", "Mga Tuntunin", "이용약관", "条款", "利用規約", "Términos"],
    [" and ", " và ", " at ", " 및 ", "和", "と", " y "],
    ["Privacy Policy", "Chính sách quyền riêng tư", "Patakaran sa Privacy", "개인정보처리방침", "隐私政策", "プライバシーポリシー", "Política de privacidad"],
    ["Skip intro", "Bỏ qua phần mở đầu", "Laktawan ang intro", "인트로 건너뛰기", "跳过开场", "イントロをスキップ", "Saltar intro"],

    // Onboarding
    ["What should your family understand?", "Gia đình nên hiểu điều gì?", "Ano ang dapat maintindihan ng pamilya mo?", "가족이 무엇을 이해했으면 하나요?", "你希望家人理解什么？", "家族に何をわかってほしい？", "¿Qué debería entender tu familia?"],
    ["What do you wish your family understood more about your life away from home?", "Bạn mong gia đình hiểu thêm điều gì về cuộc sống xa nhà của bạn?", "Ano ang gusto mong mas maintindihan ng pamilya mo tungkol sa buhay mo malayo sa bahay?", "집을 떠난 내 삶에 대해 가족이 무엇을 더 알았으면 하나요?", "关于你离家在外的生活，你希望家人多理解些什么？", "家を離れた暮らしについて、家族にもっとわかってほしいことは？", "¿Qué te gustaría que tu familia entendiera mejor de tu vida lejos de casa?"],
    ["My Everyday Routine", "Nhịp sống hằng ngày", "Ang Araw-araw Kong Gawain", "나의 일상", "我的日常", "毎日の暮らし", "Mi rutina diaria"],
    ["We’ll ask about small, ordinary moments.", "Chúng tôi sẽ hỏi về những khoảnh khắc nhỏ, bình thường.", "Magtatanong kami tungkol sa maliliit at karaniwang sandali.", "작고 평범한 순간들을 물어볼게요.", "我们会问一些平凡的小瞬间。", "小さくて何気ない瞬間について聞きます。", "Te preguntaremos por momentos pequeños y cotidianos."],
    ["The Work Behind My Wins", "Nỗ lực đằng sau thành công", "Ang Pagod sa Likod ng Tagumpay", "성과 뒤의 노력", "成果背后的努力", "成果の裏にある努力", "El esfuerzo detrás de mis logros"],
    ["We’ll suggest small ways to show the middle of things, not just the end.", "Chúng tôi sẽ gợi ý cách nhỏ để kể phần giữa, không chỉ kết quả.", "Magmumungkahi kami ng paraan para ipakita ang gitna, hindi lang ang dulo.", "결과만이 아니라 과정을 보여줄 작은 방법을 제안할게요.", "我们会建议一些小方法，展示过程而不只是结果。", "結果だけでなく途中を見せる小さな方法を提案します。", "Te sugeriremos formas de mostrar el proceso, no solo el final."],
    ["When I’m Overwhelmed", "Khi tôi quá tải", "Kapag Nabibigatan Ako", "버거울 때", "当我不堪重负时", "いっぱいいっぱいの時", "Cuando me siento abrumada"],
    ["We’ll keep those prompts gentle, and always skippable.", "Những gợi ý đó sẽ nhẹ nhàng và luôn có thể bỏ qua.", "Magiging magaan ang mga tanong na iyon, at puwedeng laktawan.", "그런 질문은 부드럽게, 언제든 건너뛸 수 있게 할게요.", "这些提示会很温和，随时可以跳过。", "そうした問いはやさしく、いつでもスキップできます。", "Esas ideas serán suaves y siempre podrás saltarlas."],
    ["Small Things That Make Me Happy", "Những điều nhỏ làm tôi vui", "Maliliit na Bagay na Nagpapasaya sa Akin", "나를 행복하게 하는 작은 것들", "让我开心的小事", "うれしい小さなこと", "Cositas que me hacen feliz"],
    ["Expect prompts about tiny good things.", "Sẽ có gợi ý về những điều tốt đẹp nhỏ bé.", "Asahan ang mga tanong tungkol sa maliliit na magagandang bagay.", "작고 좋은 것들에 대한 질문이 올 거예요.", "会有关于美好小事的提示。", "小さな良いことについての問いが届きます。", "Espera ideas sobre pequeñas cosas buenas."],
    ["New Experiences and People", "Trải nghiệm và người mới", "Bagong Karanasan at Tao", "새로운 경험과 사람들", "新的经历和新朋友", "新しい経験と出会い", "Nuevas experiencias y personas"],
    ["We’ll ask about who and what is new.", "Chúng tôi sẽ hỏi về người và điều mới.", "Magtatanong kami kung sino at ano ang bago.", "새로운 사람과 일에 대해 물어볼게요.", "我们会问问有什么新人新事。", "新しい人や出来事について聞きます。", "Te preguntaremos quién y qué es nuevo."],
    ["How I’m Growing on My Own", "Tôi đang tự trưởng thành ra sao", "Paano Ako Lumalago nang Mag-isa", "혼자서 성장하는 모습", "我如何独自成长", "ひとりで成長していること", "Cómo estoy creciendo por mi cuenta"],
    ["We’ll ask what you’re figuring out yourself.", "Chúng tôi sẽ hỏi bạn đang tự tìm hiểu điều gì.", "Itatanong namin kung ano ang inaalam mo nang mag-isa.", "스스로 알아가고 있는 것을 물어볼게요.", "我们会问你正在独自摸索什么。", "自分で見つけつつあることを聞きます。", "Te preguntaremos qué estás descubriendo por ti misma."],
    ["How do you like to share?", "Bạn thích chia sẻ thế nào?", "Paano mo gustong magbahagi?", "어떻게 나누고 싶나요?", "你喜欢怎样分享？", "どんなふうにシェアしたい？", "¿Cómo te gusta compartir?"],
    ["This picks what we suggest first. You can always use any of them.", "Điều này quyết định gợi ý đầu tiên. Bạn luôn có thể dùng bất kỳ cách nào.", "Ito ang unang imumungkahi namin. Puwede mong gamitin ang alinman.", "먼저 제안할 방식을 정해요. 언제든 다른 방식도 쓸 수 있어요.", "这决定我们先推荐什么。任何方式你都可以随时使用。", "最初に提案する方法が決まります。どれでもいつでも使えます。", "Esto define qué sugerimos primero. Siempre puedes usar cualquiera."],
    ["A Photo", "Một bức ảnh", "Isang Larawan", "사진", "照片", "写真", "Una foto"],
    ["Photo comes first. Mess is welcome.", "Ảnh được ưu tiên. Bừa bộn cũng không sao.", "Larawan muna. Ayos lang ang kalat.", "사진이 먼저예요. 어질러져도 괜찮아요.", "照片优先。乱一点也没关系。", "写真が最初。散らかっていても大丈夫。", "Primero la foto. El desorden es bienvenido."],
    ["A Voice Memo", "Một tin nhắn thoại", "Isang Voice Memo", "음성 메모", "语音备忘", "ボイスメモ", "Una nota de voz"],
    ["Voice comes first. Your family gets to hear you.", "Giọng nói được ưu tiên. Gia đình được nghe bạn.", "Boses muna. Maririnig ka ng pamilya mo.", "목소리가 먼저예요. 가족이 당신의 목소리를 들을 수 있어요.", "语音优先。家人能听到你的声音。", "声が最初。家族があなたの声を聞けます。", "Primero la voz. Tu familia podrá escucharte."],
    ["A Few Words", "Vài lời", "Ilang Salita", "몇 마디", "几句话", "ひとこと", "Unas palabras"],
    ["Writing comes first. Short is fine.", "Viết được ưu tiên. Ngắn cũng được.", "Pagsusulat muna. Ayos lang kahit maikli.", "글이 먼저예요. 짧아도 괜찮아요.", "文字优先。短一点也行。", "文章が最初。短くて大丈夫。", "Primero la escritura. Lo breve está bien."],
    ["Just an Icon", "Chỉ một biểu tượng", "Icon Lang", "아이콘만", "一个图标就好", "アイコンだけ", "Solo un ícono"],
    ["Icons come first, for the busy weeks.", "Biểu tượng được ưu tiên, cho những tuần bận rộn.", "Icon muna, para sa mga abalang linggo.", "바쁜 주를 위해 아이콘이 먼저예요.", "图标优先，适合忙碌的几周。", "忙しい週のためにアイコンが最初。", "Primero los íconos, para las semanas ocupadas."],
    ["What do you naturally share?", "Bạn thường chia sẻ điều gì?", "Ano ang likas mong ibinabahagi?", "평소에 무엇을 나누나요?", "你平时会分享什么？", "ふだん何をシェアしますか？", "¿Qué compartes de forma natural?"],
    ["The things you already send home, or would if it were easier.", "Những gì bạn đã gửi về nhà, hoặc sẽ gửi nếu dễ hơn.", "Mga bagay na ipinapadala mo na sa bahay, o ipapadala kung mas madali.", "이미 집에 보내는 것, 혹은 더 쉬웠다면 보냈을 것들.", "你已经在发回家的，或者如果更方便就会发的东西。", "すでに家に送っているもの、もっと簡単なら送りたいもの。", "Lo que ya mandas a casa, o mandarías si fuera más fácil."],
    ["Food and Meals", "Đồ ăn và bữa ăn", "Pagkain", "음식과 식사", "食物和三餐", "食べ物とごはん", "Comida"],
    ["We’ll start with what’s on your plate.", "Chúng tôi sẽ bắt đầu với món trên đĩa của bạn.", "Magsisimula tayo sa nasa plato mo.", "접시 위의 것부터 시작할게요.", "我们从你盘子里的东西开始。", "お皿の上のものから始めましょう。", "Empezaremos por lo que hay en tu plato."],
    ["Funny Little Moments", "Khoảnh khắc vui nhỏ", "Nakakatawang Sandali", "웃긴 작은 순간들", "好笑的小瞬间", "ちょっと笑える瞬間", "Momentos graciosos"],
    ["Expect prompts for the small, silly stuff.", "Sẽ có gợi ý cho những điều nhỏ, ngớ ngẩn.", "Asahan ang mga tanong para sa maliliit at nakakatawang bagay.", "작고 엉뚱한 것들에 대한 질문이 올 거예요.", "会有关于小傻事的提示。", "ちょっとしたおかしな出来事の問いが届きます。", "Espera ideas para las cosas pequeñas y tontas."],
    ["Wins and Good News", "Thành công và tin vui", "Tagumpay at Magandang Balita", "성과와 좋은 소식", "成就和好消息", "うまくいったこと・良い知らせ", "Logros y buenas noticias"],
    ["We’ll help you share the middle, not just the win.", "Chúng tôi giúp bạn kể quá trình, không chỉ thành công.", "Tutulungan ka naming ibahagi ang gitna, hindi lang ang panalo.", "결과뿐 아니라 과정을 나누도록 도울게요.", "我们会帮你分享过程，而不只是成果。", "結果だけでなく途中もシェアできるようにします。", "Te ayudaremos a compartir el proceso, no solo el logro."],
    ["Places I Go", "Những nơi tôi đến", "Mga Lugar na Pinupuntahan Ko", "내가 가는 곳", "我去的地方", "行く場所", "Lugares a los que voy"],
    ["We’ll ask where today took you.", "Chúng tôi sẽ hỏi hôm nay bạn đã đi đâu.", "Itatanong namin kung saan ka dinala ng araw na ito.", "오늘 어디에 갔는지 물어볼게요.", "我们会问你今天去了哪里。", "今日どこへ行ったか聞きます。", "Te preguntaremos adónde te llevó el día."],
    ["Friends and New People", "Bạn bè và người mới", "Mga Kaibigan at Bagong Kakilala", "친구와 새로운 사람들", "朋友和新认识的人", "友だちと新しい出会い", "Amigos y gente nueva"],
    ["We’ll ask who’s around you lately.", "Chúng tôi sẽ hỏi dạo này ai ở bên bạn.", "Itatanong namin kung sino ang kasama mo kamakailan.", "요즘 주변에 누가 있는지 물어볼게요.", "我们会问最近谁在你身边。", "最近そばにいる人について聞きます。", "Te preguntaremos quién está cerca de ti últimamente."],
    ["What I’m Working On", "Điều tôi đang làm", "Ang Ginagawa Ko", "작업 중인 것", "我正在做的事", "取り組んでいること", "En lo que estoy trabajando"],
    ["We’ll ask for works in progress, mess and all.", "Chúng tôi sẽ hỏi về tác phẩm đang làm, kể cả bừa bộn.", "Hihingi kami ng mga ginagawa pa, kahit makalat.", "어수선해도 괜찮으니 진행 중인 작업을 물어볼게요.", "我们会问进行中的作品，乱也没关系。", "途中の作品を、散らかったままで聞きます。", "Te pediremos trabajos en proceso, con todo y desorden."],
    ["What stops you from sharing?", "Điều gì ngăn bạn chia sẻ?", "Ano ang pumipigil sa iyong magbahagi?", "무엇이 나누기를 망설이게 하나요?", "是什么让你不想分享？", "シェアをためらう理由は？", "¿Qué te impide compartir?"],
    ["Pick anything that gets in the way. We’ll work around it.", "Chọn bất cứ điều gì cản trở. Chúng tôi sẽ tìm cách khác.", "Piliin ang anumang humahadlang. Hahanapan namin ng paraan.", "방해되는 것을 골라주세요. 피해서 갈게요.", "选出任何阻碍你的事。我们会绕开它。", "妨げになることを選んでください。工夫します。", "Elige lo que te frene. Lo resolveremos."],
    ["I Don’t Want Them to Worry", "Tôi không muốn họ lo lắng", "Ayokong Mag-alala Sila", "걱정시키고 싶지 않아요", "我不想让他们担心", "心配させたくない", "No quiero que se preocupen"],
    ["We’ll keep prompts gentle, and you choose what goes out.", "Gợi ý sẽ nhẹ nhàng, và bạn chọn điều gì được gửi đi.", "Magiging magaan ang mga tanong, at ikaw ang pipili kung ano ang ipapadala.", "질문은 부드럽게, 보낼 것은 직접 고르세요.", "提示会很温和，发什么由你决定。", "問いはやさしく、送るものはあなたが選びます。", "Las ideas serán suaves y tú eliges qué se envía."],
    ["Not Sure What to Say", "Không biết nói gì", "Hindi Alam ang Sasabihin", "무슨 말을 할지 모르겠어요", "不知道说什么", "何を言えばいいかわからない", "No sé qué decir"],
    ["We’ll always give you a small place to start.", "Chúng tôi luôn cho bạn một điểm bắt đầu nhỏ.", "Lagi ka naming bibigyan ng maliit na simula.", "언제나 작은 시작점을 드릴게요.", "我们总会给你一个小小的起点。", "いつも小さな書き出しを用意します。", "Siempre te daremos un pequeño punto de partida."],
    ["Time Zones and Timing", "Múi giờ và thời điểm", "Time Zone at Oras", "시차와 타이밍", "时区和时间", "時差とタイミング", "Zonas horarias y horarios"],
    ["Letters wait until they’re opened. No need to be online together.", "Thư chờ đến khi được mở. Không cần trực tuyến cùng nhau.", "Naghihintay ang liham hanggang mabuksan. Hindi kailangang sabay online.", "편지는 열어볼 때까지 기다려요. 함께 접속할 필요 없어요.", "信会一直等到被打开。无需同时在线。", "手紙は開かれるまで待っています。同時にオンラインでなくて大丈夫。", "Las cartas esperan hasta abrirse. No hace falta estar en línea juntos."],
    ["It Feels Like a Report", "Cảm giác như báo cáo", "Parang Nag-uulat", "보고하는 느낌이에요", "感觉像在汇报", "報告みたいに感じる", "Se siente como un informe"],
    ["No updates required. One photo is enough.", "Không cần cập nhật. Một bức ảnh là đủ.", "Walang kailangang update. Sapat na ang isang larawan.", "업데이트는 필요 없어요. 사진 한 장이면 충분해요.", "不需要汇报。一张照片就够了。", "近況報告はいりません。写真1枚で十分。", "No hace falta informar. Basta con una foto."],
    ["Language Gaps", "Khoảng cách ngôn ngữ", "Agwat sa Wika", "언어 차이", "语言隔阂", "言葉の壁", "Barreras de idioma"],
    ["Photos, voice and icons say a lot without many words.", "Ảnh, giọng nói và biểu tượng nói được nhiều mà không cần nhiều chữ.", "Marami nang nasasabi ang larawan, boses at icon kahit kaunti ang salita.", "사진, 목소리, 아이콘은 말이 많지 않아도 많은 걸 전해요.", "照片、声音和图标不用太多文字也能表达很多。", "写真や声、アイコンは言葉が少なくても多くを伝えます。", "Fotos, voz e íconos dicen mucho sin muchas palabras."],
    ["I’m Just Tired", "Tôi chỉ là mệt", "Pagod Lang Ako", "그냥 피곤해요", "我只是累了", "ただ疲れている", "Solo estoy cansada"],
    ["There’s always a ten-second option.", "Luôn có lựa chọn mười giây.", "Laging may sampung-segundong opsyon.", "언제나 10초짜리 선택지가 있어요.", "总有十秒就能完成的选项。", "いつでも10秒でできる選択肢があります。", "Siempre hay una opción de diez segundos."],
    ["Next question…", "Câu hỏi tiếp…", "Susunod na tanong…", "다음 질문…", "下一个问题…", "次の質問…", "Siguiente pregunta…"],
    ["Setting up your desk…", "Đang chuẩn bị bàn của bạn…", "Inihahanda ang mesa mo…", "책상을 준비하는 중…", "正在布置你的书桌…", "デスクを準備しています…", "Preparando tu escritorio…"],
    ["Go to my desk", "Đến bàn của tôi", "Pumunta sa mesa ko", "내 책상으로", "去我的书桌", "デスクへ", "Ir a mi escritorio"],
    ["Let’s go", "Đi thôi", "Tara na", "가요", "出发吧", "行こう", "Vamos"],
    ["Continue", "Tiếp tục", "Magpatuloy", "계속", "继续", "続ける", "Continuar"],
    ["Next", "Tiếp", "Susunod", "다음", "下一步", "次へ", "Siguiente"],
    ["Skip", "Bỏ qua", "Laktawan", "건너뛰기", "跳过", "スキップ", "Saltar"],
    ["SKIP", "BỎ QUA", "LAKTAWAN", "건너뛰기", "跳过", "スキップ", "SALTAR"],
    ["ANSWER", "TRẢ LỜI", "SAGUTIN", "답하기", "回答", "答える", "RESPONDER"],
    ["Back", "Quay lại", "Bumalik", "뒤로", "返回", "戻る", "Atrás"],
    ["Close", "Đóng", "Isara", "닫기", "关闭", "閉じる", "Cerrar"],
    ["Cancel", "Hủy", "Kanselahin", "취소", "取消", "キャンセル", "Cancelar"],
    ["Done", "Xong", "Tapos na", "완료", "完成", "完了", "Listo"],
    ["Save", "Lưu", "I-save", "저장", "保存", "保存", "Guardar"],
    ["Saved", "Đã lưu", "Na-save", "저장됨", "已保存", "保存済み", "Guardado"],
    ["Edit", "Sửa", "I-edit", "편집", "编辑", "編集", "Editar"],
    ["Delete", "Xóa", "Burahin", "삭제", "删除", "削除", "Eliminar"],
    ["Refresh", "Làm mới", "I-refresh", "새로고침", "刷新", "更新", "Actualizar"],
    ["Resume", "Tiếp tục", "Ituloy", "다시 시작", "继续", "再開", "Reanudar"],
    ["Retake", "Chụp lại", "Kunan muli", "다시 찍기", "重拍", "撮り直す", "Repetir"],
    ["Today", "Hôm nay", "Ngayon", "오늘", "今天", "今日", "Hoy"],
    ["All", "Tất cả", "Lahat", "전체", "全部", "すべて", "Todo"],
    ["Suggested", "Gợi ý", "Iminumungkahi", "추천", "推荐", "おすすめ", "Sugerido"],
    ["You", "Bạn", "Ikaw", "나", "你", "あなた", "Tú"],

    // Home
    ["Good morning", "Chào buổi sáng", "Magandang umaga", "좋은 아침이에요", "早上好", "おはよう", "Buenos días"],
    ["Good afternoon", "Chào buổi chiều", "Magandang hapon", "좋은 오후예요", "下午好", "こんにちは", "Buenas tardes"],
    ["Good evening", "Chào buổi tối", "Magandang gabi", "좋은 저녁이에요", "晚上好", "こんばんは", "Buenas noches"],
    ["Good morning,", "Chào buổi sáng,", "Magandang umaga,", "좋은 아침이에요,", "早上好，", "おはよう、", "Buenos días,"],
    ["Good afternoon,", "Chào buổi chiều,", "Magandang hapon,", "좋은 오후예요,", "下午好，", "こんにちは、", "Buenas tardes,"],
    ["Good evening,", "Chào buổi tối,", "Magandang gabi,", "좋은 저녁이에요,", "晚上好，", "こんばんは、", "Buenas noches,"],
    ["Welcome,", "Chào mừng,", "Maligayang pagdating,", "환영해요,", "欢迎，", "ようこそ、", "Bienvenida,"],
    ["Letters", "Thư", "Mga liham", "편지", "信件", "手紙", "Cartas"],
    ["Recap", "Tổng kết", "Recap", "회고", "回顾", "振り返り", "Resumen"],
    ["Answer", "Trả lời", "Sumagot", "답하기", "回答", "答える", "Responder"],
    ["Inside", "Bên trong", "Sa loob", "안쪽", "里面", "中身", "Dentro"],
    ["Settling in", "Làm quen", "Pag-aangkop", "적응하는 중", "安顿下来", "新生活に慣れる", "Instalándome"],
    ["from Mom and Ba", "từ Mom và Ba", "mula kina Mom at Ba", "Mom와 Ba에게서", "来自 Mom 和 Ba", "Mom と Ba から", "de Mom y Ba"],
    ["from Mom", "từ Mom", "mula kay Mom", "Mom에게서", "来自 Mom", "Mom から", "de Mom"],
    ["from Ba", "từ Ba", "mula kay Ba", "Ba에게서", "来自 Ba", "Ba から", "de Ba"],
    ["from ", "từ ", "mula kay ", "보낸 사람 ", "来自 ", "差出人 ", "de "],
    [" · from ", " · từ ", " · mula kay ", " · 보낸 사람 ", " · 来自 ", " · 差出人 ", " · de "],
    [" needs ", " cần ", " ay nangangailangan ng ", "에게 필요한 것: ", " 需要", " に必要なもの：", " necesita "],
    [" stamped this “", " đã đóng tem “", " ay naglagay ng selyong “", " 님이 붙인 우표 “", " 盖了这枚邮票“", " が貼った切手「", " le puso el sello “"],
    [" voice notes", " tin nhắn thoại", " voice note", " 음성 메모", " 条语音", " ボイスメモ", " notas de voz"],
    [" voice note", " tin nhắn thoại", " voice note", " 음성 메모", " 条语音", " ボイスメモ", " nota de voz"],
    [" photo", " ảnh", " larawan", " 사진", " 张照片", " 写真", " foto"],
    [" photos · ", " ảnh · ", " larawan · ", " 사진 · ", " 张照片 · ", " 写真 · ", " fotos · "],
    [" letters · ", " thư · ", " liham · ", " 편지 · ", " 封信 · ", " 通の手紙 · ", " cartas · "],
    ["listen", "lắng nghe", "makinig", "들어주기", "倾听", "聞いて", "escúchame"],
    ["cheer me on", "cổ vũ mình", "suportahan mo ako", "응원해줘", "为我加油", "応援して", "anímame"],
    ["distract me", "làm mình quên đi", "libangin mo ako", "기분 전환시켜줘", "让我分分心", "気をそらして", "distráeme"],
    ["space", "không gian riêng", "espasyo", "혼자 있을 시간", "空间", "そっとしておいて", "espacio"],
    ["taste of home", "hương vị quê nhà", "lasa ng tahanan", "집의 맛", "家的味道", "ふるさとの味", "sabor de casa"],
    ["What’s a little slice of your day?", "Một lát cắt nhỏ trong ngày của bạn là gì?", "Ano ang maliit na bahagi ng araw mo?", "오늘 하루의 작은 한 조각은 무엇인가요?", "你一天中的一小片段是什么？", "あなたの一日のひとコマは？", "¿Cuál es un pedacito de tu día?"],
    ["Picture your workstation", "Chụp lại góc làm việc", "Kunan ng larawan ang workstation mo", "작업 공간을 보여주세요", "拍下你的工作台", "作業スペースを見せて", "Fotografía tu espacio de trabajo"],
    ["What took more than it looks like?", "Điều gì tốn công hơn vẻ ngoài?", "Ano ang mas mahirap kaysa sa itsura nito?", "보기보다 힘들었던 것은?", "什么事比看起来更费力？", "見た目以上に大変だったことは？", "¿Qué te costó más de lo que parece?"],
    ["Write about your evening", "Viết về buổi tối của bạn", "Sumulat tungkol sa iyong gabi", "오늘 저녁을 써보세요", "写写你的傍晚", "今夜のことを書いてみよう", "Escribe sobre tu noche"],
    ["What’s taking your energy lately?", "Dạo này điều gì lấy năng lượng của bạn?", "Ano ang umuubos ng lakas mo nitong huli?", "요즘 무엇이 에너지를 빼앗나요?", "最近什么在消耗你的精力？", "最近なににエネルギーを使ってる？", "¿Qué te está quitando energía últimamente?"],
    ["Something that made you smile", "Điều gì đó khiến bạn mỉm cười", "Isang bagay na nagpangiti sa iyo", "나를 웃게 한 것", "某个让你微笑的东西", "思わず笑顔になったもの", "Algo que te hizo sonreír"],
    ["A sound from where you are", "Một âm thanh từ nơi bạn đang ở", "Isang tunog mula sa kinaroroonan mo", "지금 있는 곳의 소리", "来自你所在之处的声音", "今いる場所の音", "Un sonido de donde estás"],
    ["What do you miss from home?", "Bạn nhớ gì nhất ở nhà?", "Ano ang nami-miss mo sa bahay?", "집에서 무엇이 그리운가요?", "你想念家里的什么？", "家の何が恋しい？", "¿Qué extrañas de casa?"],
    ["What would you like to share today?", "Hôm nay bạn muốn chia sẻ điều gì?", "Ano ang gusto mong ibahagi ngayon?", "오늘은 무엇을 나누고 싶나요?", "今天想分享点什么？", "今日は何をシェアしたい？", "¿Qué te gustaría compartir hoy?"],
    ["Create a letter", "Tạo một lá thư", "Gumawa ng liham", "편지 쓰기", "写一封信", "手紙を書く", "Crear una carta"],
    ["Prompt of the Day", "Gợi ý hôm nay", "Tanong ng Araw", "오늘의 질문", "今日提示", "今日のお題", "Idea del día"],
    ["Send some love", "Gửi chút yêu thương", "Magpadala ng pagmamahal", "사랑 보내기", "送点爱", "愛を送ろう", "Envía un poco de cariño"],
    ["View History", "Xem lại", "Tingnan ang kasaysayan", "기록 보기", "查看记录", "これまでを見る", "Ver historial"],
    ["View Recap", "Xem tổng kết", "Tingnan ang Recap", "리캡 보기", "查看回顾", "振り返りを見る", "Ver resumen"],
    ["View letters", "Xem thư", "Tingnan ang mga liham", "편지 보기", "查看信件", "手紙を見る", "Ver cartas"],
    ["Prompts", "Gợi ý", "Mga tanong", "질문", "提示", "お題", "Ideas"],
    ["See all", "Xem tất cả", "Tingnan lahat", "모두 보기", "查看全部", "すべて見る", "Ver todo"],
    ["Write freely", "Viết tự do", "Malayang sumulat", "자유롭게 쓰기", "自由书写", "自由に書く", "Escribe libremente"],
    ["No prompt, just you", "Không gợi ý, chỉ có bạn", "Walang tanong, ikaw lang", "질문 없이, 그냥 나답게", "没有提示，只有你", "お題なし、あなたらしく", "Sin idea, solo tú"],
    ["Every letter", "Tất cả thư", "Lahat ng liham", "모든 편지", "所有信件", "すべての手紙", "Todas las cartas"],
    ["Back to every letter", "Về tất cả thư", "Bumalik sa lahat ng liham", "모든 편지로 돌아가기", "返回所有信件", "すべての手紙に戻る", "Volver a todas las cartas"],
    ["Your calendar", "Lịch của bạn", "Ang kalendaryo mo", "내 캘린더", "你的日历", "あなたのカレンダー", "Tu calendario"],
    ["Add photo", "Thêm ảnh", "Magdagdag ng larawan", "사진 추가", "添加照片", "写真を追加", "Agregar foto"],
    ["Add photos", "Thêm ảnh", "Magdagdag ng mga larawan", "사진 추가", "添加照片", "写真を追加", "Agregar fotos"],
    ["Add schedule", "Thêm lịch học", "Magdagdag ng iskedyul", "일정 추가", "添加日程", "予定を追加", "Agregar horario"],
    ["All day", "Cả ngày", "Buong araw", "종일", "全天", "終日", "Todo el día"],
    ["Nothing here yet", "Chưa có gì ở đây", "Wala pang laman", "아직 아무것도 없어요", "这里还没有内容", "まだ何もありません", "Aún no hay nada"],
    ["Nothing here yet. Add a photo from this day, or upload your syllabus or calendar to fill in deadlines.", "Chưa có gì. Thêm ảnh của ngày này, hoặc tải lên đề cương hay lịch để điền hạn chót.", "Wala pang laman. Magdagdag ng larawan mula sa araw na ito, o i-upload ang syllabus o kalendaryo para sa mga deadline.", "아직 비어 있어요. 이날의 사진을 추가하거나 강의계획서·캘린더를 올려 마감일을 채워보세요.", "这里还没有内容。添加这一天的照片，或上传课程大纲或日历来填入截止日期。", "まだ何もありません。この日の写真を追加するか、シラバスやカレンダーをアップロードして締切を入れましょう。", "Aún no hay nada. Agrega una foto de este día o sube tu programa o calendario para llenar las fechas límite."],
    ["Previous month", "Tháng trước", "Nakaraang buwan", "이전 달", "上个月", "前の月", "Mes anterior"],
    ["Next month", "Tháng sau", "Susunod na buwan", "다음 달", "下个月", "次の月", "Mes siguiente"],
    ["Where you are", "Bạn đang ở đâu", "Nasaan ka", "내 위치", "你在哪里", "今いる場所", "Dónde estás"],
    ["Location sharing", "Chia sẻ vị trí", "Pagbabahagi ng lokasyon", "위치 공유", "位置共享", "位置情報の共有", "Compartir ubicación"],
    ["Use my location", "Dùng vị trí của tôi", "Gamitin ang lokasyon ko", "내 위치 사용", "使用我的位置", "現在地を使う", "Usar mi ubicación"],
    ["Turn sharing on to show your spot", "Bật chia sẻ để hiện vị trí của bạn", "I-on ang pagbabahagi para makita ang puwesto mo", "공유를 켜면 위치가 표시돼요", "开启共享以显示你的位置", "共有をオンにすると場所が表示されます", "Activa compartir para mostrar tu lugar"],
    ["Share my exact location with Mom and Ba", "Chia sẻ vị trí chính xác với Mom và Ba", "Ibahagi ang eksaktong lokasyon ko kina Mom at Ba", "Mom와 Ba에게 정확한 위치 공유", "与 Mom 和 Ba 共享我的精确位置", "Mom と Ba に正確な位置を共有", "Compartir mi ubicación exacta con Mom y Ba"],
    ["Mom and Ba can see exactly where you are.", "Mom và Ba có thể thấy chính xác bạn đang ở đâu.", "Nakikita nina Mom at Ba kung nasaan ka mismo.", "Mom와 Ba가 정확한 위치를 볼 수 있어요.", "Mom 和 Ba 能看到你的确切位置。", "Mom と Ba にあなたの正確な場所が見えます。", "Mom y Ba pueden ver exactamente dónde estás."],
    ["Your location is hidden.", "Vị trí của bạn đang ẩn.", "Nakatago ang lokasyon mo.", "위치가 숨겨져 있어요.", "你的位置已隐藏。", "位置情報は非表示です。", "Tu ubicación está oculta."],
    ["Finding you…", "Đang tìm vị trí…", "Hinahanap ka…", "위치 찾는 중…", "正在定位…", "位置を探しています…", "Buscándote…"],
    ["Live · sample", "Trực tiếp · mẫu", "Live · halimbawa", "실시간 · 샘플", "实时 · 示例", "ライブ · サンプル", "En vivo · muestra"],
    ["Live · updated just now", "Trực tiếp · vừa cập nhật", "Live · kaka-update lang", "실시간 · 방금 업데이트", "实时 · 刚刚更新", "ライブ · たった今更新", "En vivo · actualizado ahora"],
    ["Location access isn’t available here, so you’re seeing a sample spot.", "Không thể truy cập vị trí ở đây, nên bạn đang xem vị trí mẫu.", "Hindi available ang lokasyon dito, kaya halimbawang puwesto ang nakikita mo.", "여기서는 위치 접근이 안 돼서 샘플 위치가 보여요.", "此处无法获取位置，因此显示的是示例位置。", "ここでは位置情報を使えないため、サンプルの場所を表示しています。", "No hay acceso a la ubicación aquí, así que ves un lugar de muestra."],
    ["This browser can’t share a location, so you’re seeing a sample spot.", "Trình duyệt này không chia sẻ được vị trí, nên bạn đang xem vị trí mẫu.", "Hindi makapagbahagi ng lokasyon ang browser na ito, kaya halimbawang puwesto ang nakikita mo.", "이 브라우저는 위치를 공유할 수 없어 샘플 위치가 보여요.", "此浏览器无法共享位置，因此显示的是示例位置。", "このブラウザは位置を共有できないため、サンプルの場所を表示しています。", "Este navegador no puede compartir la ubicación, así que ves un lugar de muestra."],
    ["Pause 1 hr", "Tạm dừng 1 giờ", "I-pause nang 1 oras", "1시간 일시정지", "暂停 1 小时", "1時間停止", "Pausar 1 h"],
    ["Paused", "Đã tạm dừng", "Naka-pause", "일시정지됨", "已暂停", "一時停止中", "En pausa"],
    ["Paused until ", "Tạm dừng đến ", "Naka-pause hanggang ", "일시정지 종료: ", "暂停至 ", "停止中：", "En pausa hasta "],
    ["Studio 4B, Arts Building", "Phòng 4B, Tòa nhà Nghệ thuật", "Studio 4B, Arts Building", "아트 빌딩 4B 스튜디오", "艺术楼 4B 工作室", "アートビル 4Bスタジオ", "Estudio 4B, Edificio de Artes"],
    ["Send a pulse: “Thinking of you”", "Gửi nhịp: “Đang nghĩ về bạn”", "Magpadala ng pulse: “Iniisip kita”", "펄스 보내기: “생각하고 있어요”", "发送心跳：“想你了”", "パルスを送る：「想ってるよ」", "Enviar un pulso: “Pienso en ti”"],
    ["Thinking of you", "Đang nghĩ về bạn", "Iniisip kita", "생각하고 있어요", "想你了", "想ってるよ", "Pienso en ti"],
    ["Sent to Mom: “Thinking of you”", "Đã gửi Mom: “Đang nghĩ về bạn”", "Naipadala kay Mom: “Iniisip kita”", "Mom에게 보냄: “생각하고 있어요”", "已发送给 Mom：“想你了”", "Mom に送信：「想ってるよ」", "Enviado a Mom: “Pienso en ti”"],
    ["Sent to Mom", "Đã gửi cho Mom", "Naipadala kay Mom", "Mom에게 보냄", "已发送给 Mom", "Mom に送信済み", "Enviado a Mom"],
    ["Mom is thinking of you", "Mom đang nghĩ về bạn", "Iniisip ka ni Mom", "Mom가 당신을 생각하고 있어요", "Mom 在想你", "Mom があなたを想っています", "Mom está pensando en ti"],
    ["Your recap and favorites", "Tổng kết và mục yêu thích", "Ang recap at mga paborito mo", "회고와 즐겨찾기", "你的回顾和收藏", "振り返りとお気に入り", "Tu resumen y favoritos"],
    ["Your October recap is ready", "Tổng kết tháng Mười đã sẵn sàng", "Handa na ang recap mo ng Oktubre", "10월 회고가 준비됐어요", "你的十月回顾已生成", "10月の振り返りができました", "Tu resumen de octubre está listo"],
    ["It’s morning for them, a good time for a quick voice memo.", "Bên đó đang là buổi sáng, lúc tốt để gửi tin nhắn thoại ngắn.", "Umaga sa kanila, magandang oras para sa mabilis na voice memo.", "그곳은 아침이에요. 짧은 음성 메모를 보내기 좋은 때예요.", "他们那边是早上，适合发一段简短的语音。", "向こうは朝。短いボイスメモにちょうどいい時間です。", "Allá es de mañana, buen momento para una nota de voz corta."],
    ["It’s the middle of their day. A photo is easy to look at between things.", "Bên đó đang giữa ngày. Một bức ảnh dễ xem giữa giờ bận.", "Kalagitnaan ng araw nila. Madaling tingnan ang larawan sa pagitan ng mga gawain.", "그곳은 한낮이에요. 사진은 틈틈이 보기 좋아요.", "他们那边是白天，照片在忙碌间隙也方便看。", "向こうは日中。写真なら合間に見やすいです。", "Allá es mediodía. Una foto es fácil de ver entre cosas."],
    ["It’s evening for them, a nice time for a longer letter.", "Bên đó đang là buổi tối, lúc đẹp cho một lá thư dài hơn.", "Gabi na sa kanila, magandang oras para sa mas mahabang liham.", "그곳은 저녁이에요. 긴 편지를 쓰기 좋은 때예요.", "他们那边是晚上，适合写一封长一点的信。", "向こうは夜。長めの手紙にいい時間です。", "Allá es de noche, buen momento para una carta más larga."],
    ["It’s late for them. Your letter will be there in the morning.", "Bên đó đã khuya. Thư của bạn sẽ đến vào buổi sáng.", "Gabi na sa kanila. Nandoon na ang liham mo sa umaga.", "그곳은 늦은 밤이에요. 편지는 아침에 도착해 있을 거예요.", "他们那边已经很晚了。你的信早上就会在那里。", "向こうはもう遅い時間。手紙は朝には届いています。", "Allá es tarde. Tu carta estará ahí por la mañana."],
    ["They’re probably asleep. Your letter will be waiting when they wake.", "Có lẽ họ đang ngủ. Thư của bạn sẽ chờ khi họ thức dậy.", "Malamang tulog na sila. Naghihintay ang liham mo pag-gising nila.", "아마 자고 있을 거예요. 일어나면 편지가 기다리고 있을 거예요.", "他们可能睡了。醒来时你的信就在等着他们。", "たぶん寝ています。起きたら手紙が待っています。", "Probablemente duermen. Tu carta los esperará al despertar."],

    // Sheets
    ["Language", "Ngôn ngữ", "Wika", "언어", "语言", "言語", "Idioma"],
    ["The language the app uses. Letters stay in the language they were written in.", "Ngôn ngữ của ứng dụng. Thư vẫn giữ ngôn ngữ đã được viết.", "Ang wikang ginagamit ng app. Nananatili ang mga liham sa wikang isinulat ang mga ito.", "앱에서 사용하는 언어예요. 편지는 쓰인 언어 그대로 유지돼요.", "应用使用的语言。信件保持其书写时的语言。", "アプリの表示言語です。手紙は書かれた言語のまま表示されます。", "El idioma de la app. Las cartas se quedan en el idioma en que se escribieron."],
    ["Notifications", "Thông báo", "Mga Notification", "알림", "通知", "通知", "Notificaciones"],
    ["Profile", "Hồ sơ", "Profile", "프로필", "个人资料", "プロフィール", "Perfil"],
    ["Mom sent you a letter", "Mom đã gửi bạn một lá thư", "Pinadalhan ka ni Mom ng liham", "Mom가 편지를 보냈어요", "Mom 给你寄了一封信", "Mom から手紙が届きました", "Mom te envió una carta"],
    ["Ba sent a voice note", "Ba đã gửi một tin nhắn thoại", "Nagpadala si Ba ng voice note", "Ba가 음성 메모를 보냈어요", "Ba 发来一条语音", "Ba からボイスメモが届きました", "Ba envió una nota de voz"],
    ["Mom sent a voice note", "Mom đã gửi một tin nhắn thoại", "Nagpadala si Mom ng voice note", "Mom가 음성 메모를 보냈어요", "Mom 发来一条语音", "Mom からボイスメモが届きました", "Mom envió una nota de voz"],
    ["You’re all caught up", "Bạn đã xem hết", "Updated ka na sa lahat", "모두 확인했어요", "你已看完全部", "すべて確認済みです", "Estás al día"],
    ["All caught up", "Đã xem hết", "Updated na lahat", "모두 확인함", "全部看完了", "すべて確認済み", "Todo al día"],
    ["Writing to Mom in Singapore", "Viết cho Mom ở Singapore", "Sumusulat kay Mom sa Singapore", "싱가포르의 Mom에게 쓰는 중", "写信给在新加坡的 Mom", "シンガポールの Mom に手紙を書いています", "Escribiendo a Mom en Singapur"],
    ["New letters and pulses", "Thư và nhịp mới", "Mga bagong liham at pulse", "새 편지와 펄스", "新信件和心跳", "新しい手紙とパルス", "Cartas y pulsos nuevos"],
    ["Replay intro", "Xem lại phần mở đầu", "Ulitin ang intro", "인트로 다시 보기", "重播开场", "イントロを再生", "Repetir intro"],
    ["See the opening animation again", "Xem lại hoạt ảnh mở đầu", "Panoorin muli ang opening animation", "오프닝 애니메이션 다시 보기", "再看一次开场动画", "オープニングアニメーションをもう一度見る", "Ver de nuevo la animación inicial"],

    // Prompts
    ["Pick your prompt", "Chọn gợi ý", "Pumili ng tanong", "질문 고르기", "选择提示", "お題を選ぶ", "Elige tu idea"],
    ["Everyday life", "Cuộc sống hằng ngày", "Araw-araw na buhay", "일상", "日常生活", "毎日の暮らし", "Vida diaria"],
    ["Behind the outcome", "Phía sau kết quả", "Sa likod ng resulta", "결과의 뒷면", "成果背后", "結果の裏側", "Detrás del resultado"],
    ["Challenges", "Thử thách", "Mga hamon", "어려움", "挑战", "たいへんなこと", "Desafíos"],
    ["Small good things", "Điều tốt đẹp nhỏ", "Maliliit na magagandang bagay", "작고 좋은 것들", "美好小事", "小さな良いこと", "Pequeñas cosas buenas"],
    ["Connection to home", "Kết nối với nhà", "Koneksyon sa tahanan", "집과의 연결", "与家的联系", "家とのつながり", "Conexión con casa"],
    ["What’s a little slice", "Một lát cắt nhỏ", "Ano ang maliit na bahagi", "작은 한 조각은", "生活中的", "日常の", "¿Cuál es un pedacito"],
    ["of your day?", "trong ngày của bạn?", "ng araw mo?", "무엇인가요?", "一小片段是什么？", "ひとコマは？", "de tu día?"],
    ["your family never gets to see", "mà gia đình chưa bao giờ thấy", "na hindi kailanman nakikita ng pamilya mo", "가족이 볼 수 없었던", "家人从来看不到的", "家族が見ることのない", "que tu familia nunca llega a ver"],
    ["Show your parents what you don’t show every day. Help them understand and not worry about you. Show your personal journey, and your week.", "Cho bố mẹ thấy những gì bạn không thường cho thấy. Giúp họ hiểu và bớt lo cho bạn. Hãy kể hành trình và tuần của bạn.", "Ipakita sa magulang mo ang hindi mo ipinapakita araw-araw. Tulungan silang umintindi at huwag mag-alala. Ipakita ang iyong paglalakbay at linggo.", "매일 보여주지 않는 모습을 부모님께 보여주세요. 이해하고 덜 걱정하시도록요. 나의 여정과 한 주를 보여주세요.", "让父母看看你平时不展示的一面，帮他们理解你、少为你担心。分享你的成长和这一周。", "毎日は見せない姿を両親に見せましょう。理解して、心配しないでいられるように。あなたの歩みと一週間を。", "Muéstrales a tus padres lo que no muestras cada día. Ayúdalos a entender y a no preocuparse. Muestra tu camino y tu semana."],
    ["Picture your", "Chụp lại", "Kunan ng larawan ang", "보여주세요,", "拍下你的", "見せて、", "Fotografía tu"],
    ["workstation", "góc làm việc", "workstation mo", "작업 공간을", "工作台", "作業スペース", "espacio de trabajo"],
    ["mess and all", "kể cả bừa bộn", "kahit makalat", "어질러진 그대로", "乱也没关系", "散らかったままで", "con todo y desorden"],
    ["Where the work actually happened this week. Not the finished piece, the middle of it.", "Nơi công việc thật sự diễn ra tuần này. Không phải tác phẩm hoàn thiện, mà là quá trình.", "Kung saan talaga nangyari ang trabaho ngayong linggo. Hindi ang tapos na, kundi ang gitna nito.", "이번 주 작업이 실제로 이뤄진 곳. 완성작이 아니라 그 과정을요.", "这周真正干活的地方。不是成品，而是过程。", "今週、実際に作業した場所。完成品ではなく、その途中を。", "Donde de verdad ocurrió el trabajo esta semana. No la pieza terminada, sino el proceso."],
    ["What took more", "Điều gì tốn công", "Ano ang mas mahirap", "보기보다", "什么事比看起来", "見た目以上に", "¿Qué te costó más"],
    ["than it looks like?", "hơn vẻ ngoài?", "kaysa sa itsura nito?", "힘들었던 것은?", "更费力？", "大変だったことは？", "de lo que parece?"],
    ["this week", "tuần này", "ngayong linggo", "이번 주", "这一周", "今週", "esta semana"],
    ["One thing that looked small from the outside but took real effort. No grades, no hours, just what it took.", "Một điều trông nhỏ nhưng cần nhiều nỗ lực. Không điểm số, không số giờ, chỉ là những gì nó đòi hỏi.", "Isang bagay na mukhang maliit pero talagang pinaghirapan. Walang grado, walang oras, kung ano lang ang kinailangan.", "겉보기엔 작지만 정말 노력이 필요했던 한 가지. 성적도 시간도 말고, 들인 마음만요.", "一件看起来很小却花了真功夫的事。不谈分数、不谈时长，只说付出了什么。", "外からは小さく見えても本当は努力が必要だったこと。成績や時間ではなく、かかったものを。", "Algo que parecía pequeño pero exigió esfuerzo real. Sin notas ni horas, solo lo que costó."],
    ["Write about", "Viết về", "Sumulat tungkol sa", "써보세요,", "写写", "書いてみよう、", "Escribe sobre"],
    ["your evening", "buổi tối của bạn", "iyong gabi", "오늘 저녁을", "你的傍晚", "今夜のこと", "tu noche"],
    ["a few lines is enough", "vài dòng là đủ", "sapat na ang ilang linya", "몇 줄이면 충분해요", "几行就够了", "数行で十分", "unas líneas bastan"],
    ["What did tonight look like? Who was there, what you ate, what was on in the background.", "Tối nay thế nào? Có ai, bạn ăn gì, xung quanh đang có gì.", "Ano ang itsura ng gabi mo? Sino ang kasama, ano ang kinain mo, ano ang nasa background.", "오늘 밤은 어땠나요? 누가 있었는지, 무엇을 먹었는지, 배경엔 뭐가 흘렀는지.", "今晚是什么样的？谁在、吃了什么、背景里放着什么。", "今夜はどんな感じ？誰がいて、何を食べて、何が流れていたか。", "¿Cómo fue esta noche? Quién estaba, qué comiste, qué sonaba de fondo."],
    ["What’s taking", "Điều gì đang lấy", "Ano ang umuubos", "요즘 무엇이", "最近什么在消耗", "最近なにに", "¿Qué te está quitando"],
    ["your energy lately?", "năng lượng của bạn dạo này?", "ng lakas mo nitong huli?", "에너지를 빼앗나요?", "你的精力？", "エネルギーを使ってる？", "energía últimamente?"],
    ["and what’s helping", "và điều gì đang giúp bạn", "at ano ang nakakatulong", "그리고 무엇이 도움이 되나요", "又是什么在帮你", "そして支えになっているもの", "y qué te está ayudando"],
    ["Say it out loud the way you would on the phone. It can be heavy or light. You choose what to share.", "Hãy nói ra như khi gọi điện. Nặng hay nhẹ đều được. Bạn chọn điều muốn chia sẻ.", "Sabihin ito na parang nasa telepono. Puwedeng mabigat o magaan. Ikaw ang pipili.", "전화하듯 소리 내어 말해보세요. 무거워도 가벼워도 괜찮아요. 나눌 것은 직접 골라요.", "像打电话一样说出来。可轻可重，分享什么由你决定。", "電話で話すように声に出して。重くても軽くても大丈夫。何を話すかはあなた次第。", "Dilo en voz alta como por teléfono. Puede ser pesado o ligero. Tú eliges qué compartir."],
    ["Something that", "Điều gì đó", "Isang bagay na", "나를", "某个让你", "思わず", "Algo que"],
    ["made you smile", "khiến bạn mỉm cười", "nagpangiti sa iyo", "웃게 한 것", "微笑的东西", "笑顔になったもの", "te hizo sonreír"],
    ["even for a second", "dù chỉ một giây", "kahit isang segundo lang", "단 1초라도", "哪怕只有一秒", "一瞬でも", "aunque sea un segundo"],
    ["A sky, a snack, a friend’s face, a sticker on a lamp post. Tiny counts.", "Bầu trời, món ăn vặt, gương mặt bạn bè, nhãn dán trên cột đèn. Nhỏ cũng tính.", "Langit, meryenda, mukha ng kaibigan, sticker sa poste. Mahalaga ang maliliit.", "하늘, 간식, 친구의 얼굴, 가로등의 스티커. 작은 것도 좋아요.", "天空、零食、朋友的脸、路灯上的贴纸。小事也算。", "空、おやつ、友だちの顔、街灯のステッカー。小さくてもOK。", "Un cielo, un snack, la cara de un amigo, una pegatina en un poste. Lo pequeño cuenta."],
    ["A sound from", "Một âm thanh từ", "Isang tunog mula sa", "지금 있는 곳의", "来自你所在之处的", "今いる場所の", "Un sonido de"],
    ["where you are", "nơi bạn đang ở", "kinaroroonan mo", "소리", "声音", "音", "donde estás"],
    ["ten seconds is plenty", "mười giây là đủ", "sapat na ang sampung segundo", "10초면 충분해요", "十秒就够了", "10秒で十分", "diez segundos bastan"],
    ["The studio fan, the bus, the rain, your roommate laughing. Let them hear your day.", "Quạt trong xưởng, xe buýt, tiếng mưa, bạn cùng phòng cười. Để họ nghe ngày của bạn.", "Ang bentilador sa studio, ang bus, ang ulan, ang tawa ng roommate mo. Iparinig sa kanila ang araw mo.", "작업실 선풍기, 버스, 빗소리, 룸메이트의 웃음. 나의 하루를 들려주세요.", "工作室的风扇、公交、雨声、室友的笑声。让他们听听你的一天。", "スタジオの扇風機、バス、雨、ルームメイトの笑い声。あなたの一日を聞かせて。", "El ventilador del estudio, el bus, la lluvia, tu compañera riéndose. Que escuchen tu día."],
    ["What do you", "Bạn nhớ gì", "Ano ang", "집에서 무엇이", "你想念", "家の何が", "¿Qué extrañas"],
    ["miss from home?", "nhất ở nhà?", "nami-miss mo sa bahay?", "그리운가요?", "家里的什么？", "恋しい？", "de casa?"],
    ["a taste, a place, a habit", "một hương vị, một nơi, một thói quen", "isang lasa, lugar, o gawi", "맛, 장소, 습관", "一种味道、一个地方、一个习惯", "味、場所、習慣", "un sabor, un lugar, una costumbre"],
    ["Something small you didn’t notice until you left. They might be able to send a little piece of it.", "Điều nhỏ bạn không để ý cho đến khi đi xa. Có thể họ sẽ gửi cho bạn một chút.", "Isang maliit na bagay na hindi mo napansin hanggang umalis ka. Baka makapagpadala sila ng kaunti nito.", "떠나고 나서야 알게 된 작은 것. 가족이 조금 보내줄 수도 있어요.", "离开后才注意到的小东西。他们也许能给你寄一点。", "離れて初めて気づいた小さなこと。少し送ってもらえるかもしれません。", "Algo pequeño que no notaste hasta irte. Quizá puedan enviarte un pedacito."],
    ["Shuffle again", "Xáo lại", "I-shuffle ulit", "다시 섞기", "重新洗牌", "もう一度シャッフル", "Barajar otra vez"],
    ["Undo last skip", "Hoàn tác lần bỏ qua", "I-undo ang huling laktaw", "마지막 건너뛰기 취소", "撤销上次跳过", "直前のスキップを取り消す", "Deshacer último salto"],
    ["That’s all for", "Vậy là hết", "Iyan na lahat para sa", "여기까지예요,", "以上就是", "これで全部、", "Eso es todo por"],
    ["every prompt, seen", "đã xem mọi gợi ý", "nakita na ang lahat ng tanong", "모든 질문을 봤어요", "所有提示都看过了", "すべてのお題を見ました", "todas las ideas vistas"],
    ["No prompt is required. Shuffle the deck again, or write whatever’s on your mind.", "Không cần gợi ý. Xáo lại bộ bài, hoặc viết bất cứ điều gì bạn nghĩ.", "Hindi kailangan ng tanong. I-shuffle ulit, o isulat ang nasa isip mo.", "질문은 꼭 필요하지 않아요. 다시 섞거나 마음속 이야기를 쓰세요.", "不一定需要提示。重新洗牌，或写下你想说的。", "お題はなくても大丈夫。もう一度シャッフルするか、思うままに書いて。", "No hace falta una idea. Baraja otra vez o escribe lo que tengas en mente."],
    ["Not this one", "Không phải cái này", "Hindi ito", "이건 말고", "不要这个", "これじゃない", "Esta no"],

    // Answer / capture
    ["Answer with", "Trả lời bằng", "Sumagot gamit ang", "답하는 방법", "回答方式", "答え方", "Responder con"],
    ["Answer however you like. Every way works.", "Trả lời theo cách bạn thích. Cách nào cũng được.", "Sumagot sa paraang gusto mo. Gumagana ang lahat.", "원하는 방식으로 답하세요. 어떤 방법이든 좋아요.", "用你喜欢的方式回答，怎样都行。", "好きな方法で答えて。どれでも大丈夫。", "Responde como quieras. Cualquier forma vale."],
    ["Photo", "Ảnh", "Larawan", "사진", "照片", "写真", "Foto"],
    ["Voice memo", "Tin nhắn thoại", "Voice memo", "음성 메모", "语音备忘", "ボイスメモ", "Nota de voz"],
    ["Words", "Lời viết", "Mga salita", "글", "文字", "言葉", "Palabras"],
    ["A few words", "Vài lời", "Ilang salita", "몇 마디", "几句话", "ひとこと", "Unas palabras"],
    ["A handwritten note", "Một ghi chú viết tay", "Isang sulat-kamay", "손글씨 메모", "一张手写便条", "手書きのメモ", "Una nota a mano"],
    ["Handwritten note", "Ghi chú viết tay", "Sulat-kamay", "손글씨 메모", "手写便条", "手書きメモ", "Nota a mano"],
    ["Show them a little of your day", "Cho họ thấy một chút ngày của bạn", "Ipakita sa kanila ang kaunti ng araw mo", "하루를 조금 보여주세요", "给他们看看你的一天", "一日を少し見せて", "Muéstrales un poco de tu día"],
    ["Let them hear you", "Để họ nghe giọng bạn", "Iparinig ang boses mo", "목소리를 들려주세요", "让他们听听你的声音", "声を聞かせて", "Que te escuchen"],
    ["Type it or write it by hand", "Gõ hoặc viết tay", "I-type o isulat sa kamay", "입력하거나 손으로 쓰세요", "打字或手写", "入力するか手で書く", "Escríbelo o hazlo a mano"],
    ["Mess is welcome. This isn’t proof, just a peek.", "Bừa bộn cũng không sao. Đây không phải bằng chứng, chỉ là một cái nhìn.", "Ayos lang ang kalat. Hindi ito patunay, silip lang.", "어질러져도 괜찮아요. 증명이 아니라 살짝 보여주는 거예요.", "乱也没关系。这不是证明，只是让他们看一眼。", "散らかっていてOK。証明ではなく、ちょっとのぞくだけ。", "El desorden es bienvenido. No es una prueba, solo un vistazo."],
    ["Take photo", "Chụp ảnh", "Kumuha ng larawan", "사진 찍기", "拍照", "写真を撮る", "Tomar foto"],
    ["Use photo", "Dùng ảnh", "Gamitin ang larawan", "사진 사용", "使用照片", "この写真を使う", "Usar foto"],
    ["Choose from library", "Chọn từ thư viện", "Pumili mula sa library", "보관함에서 선택", "从相册选择", "ライブラリから選ぶ", "Elegir de la galería"],
    ["Switch camera", "Đổi camera", "Palitan ang camera", "카메라 전환", "切换摄像头", "カメラを切り替え", "Cambiar cámara"],
    ["Camera view", "Khung camera", "View ng camera", "카메라 화면", "相机画面", "カメラビュー", "Vista de cámara"],
    ["Talk like you would on the phone. A minute is plenty.", "Nói như khi gọi điện. Một phút là đủ.", "Magsalita na parang nasa telepono. Sapat na ang isang minuto.", "전화하듯 말해보세요. 1분이면 충분해요.", "像打电话一样说。一分钟就够了。", "電話のように話して。1分で十分です。", "Habla como por teléfono. Un minuto basta."],
    ["Start recording", "Bắt đầu ghi âm", "Simulan ang pagre-record", "녹음 시작", "开始录音", "録音を開始", "Empezar a grabar"],
    ["Stop and review", "Dừng và nghe lại", "Itigil at suriin", "멈추고 확인", "停止并回听", "停止して確認", "Detener y revisar"],
    ["Keep recording", "Tiếp tục ghi âm", "Ituloy ang pagre-record", "계속 녹음", "继续录音", "録音を続ける", "Seguir grabando"],
    ["Play voice note", "Phát tin nhắn thoại", "I-play ang voice note", "음성 메모 재생", "播放语音", "ボイスメモを再生", "Reproducir nota de voz"],
    ["Pause voice note", "Tạm dừng tin nhắn thoại", "I-pause ang voice note", "음성 메모 일시정지", "暂停语音", "ボイスメモを一時停止", "Pausar nota de voz"],
    ["If you leave now, your recording won’t be saved.", "Nếu rời đi bây giờ, bản ghi âm sẽ không được lưu.", "Kung aalis ka ngayon, hindi mase-save ang recording mo.", "지금 나가면 녹음이 저장되지 않아요.", "现在离开的话，录音不会保存。", "今離れると録音は保存されません。", "Si sales ahora, tu grabación no se guardará."],
    ["If you leave now, what you’ve written won’t be saved.", "Nếu rời đi bây giờ, những gì bạn viết sẽ không được lưu.", "Kung aalis ka ngayon, hindi mase-save ang isinulat mo.", "지금 나가면 쓴 내용이 저장되지 않아요.", "现在离开的话，写的内容不会保存。", "今離れると書いた内容は保存されません。", "Si sales ahora, lo que escribiste no se guardará."],
    ["Discard this letter?", "Bỏ lá thư này?", "Itapon ang liham na ito?", "이 편지를 버릴까요?", "放弃这封信？", "この手紙を破棄しますか？", "¿Descartar esta carta?"],
    ["Keep writing", "Tiếp tục viết", "Ituloy ang pagsusulat", "계속 쓰기", "继续写", "書き続ける", "Seguir escribiendo"],
    ["Write", "Viết", "Sumulat", "쓰기", "写", "書く", "Escribir"],
    ["Write with", "Viết bằng", "Sumulat gamit ang", "쓰는 방법", "书写方式", "書き方", "Escribir con"],
    ["Keyboard", "Bàn phím", "Keyboard", "키보드", "键盘", "キーボード", "Teclado"],
    ["Handwriting", "Viết tay", "Sulat-kamay", "손글씨", "手写", "手書き", "A mano"],
    ["Write with your finger", "Viết bằng ngón tay", "Sumulat gamit ang daliri", "손가락으로 쓰기", "用手指书写", "指で書く", "Escribe con el dedo"],
    ["Start anywhere. A sentence is enough.", "Bắt đầu từ đâu cũng được. Một câu là đủ.", "Magsimula kahit saan. Sapat na ang isang pangungusap.", "어디서든 시작하세요. 한 문장이면 충분해요.", "从哪里开始都行。一句话就够了。", "どこからでもどうぞ。一文で十分。", "Empieza donde sea. Una frase basta."],
    ["Write your note", "Viết ghi chú", "Isulat ang note mo", "메모를 쓰세요", "写下你的便条", "メモを書く", "Escribe tu nota"],
    ["Your answer", "Câu trả lời của bạn", "Ang sagot mo", "나의 답", "你的回答", "あなたの答え", "Tu respuesta"],
    ["Pen color", "Màu bút", "Kulay ng panulat", "펜 색상", "笔的颜色", "ペンの色", "Color del bolígrafo"],
    ["Pen size", "Cỡ bút", "Laki ng panulat", "펜 굵기", "笔的粗细", "ペンの太さ", "Grosor"],
    ["Pick a pen color", "Chọn màu bút", "Pumili ng kulay ng panulat", "펜 색상 선택", "选择笔的颜色", "ペンの色を選ぶ", "Elige un color"],
    ["Eraser", "Tẩy", "Pambura", "지우개", "橡皮擦", "消しゴム", "Borrador"],
    ["Undo last stroke", "Hoàn tác nét cuối", "I-undo ang huling guhit", "마지막 획 취소", "撤销上一笔", "最後の線を取り消す", "Deshacer último trazo"],
    ["Clear page", "Xóa trang", "Burahin ang pahina", "페이지 지우기", "清空页面", "ページを消去", "Borrar página"],
    ["Fine", "Mảnh", "Manipis", "가늘게", "细", "細", "Fino"],
    ["Medium", "Vừa", "Katamtaman", "중간", "中", "中", "Medio"],
    ["Bold", "Đậm", "Makapal", "굵게", "粗", "太", "Grueso"],

    // Paper, caption, stamp
    ["Pick your paper", "Chọn giấy", "Pumili ng papel", "종이 고르기", "选择信纸", "紙を選ぶ", "Elige tu papel"],
    ["Pick an envelope and a stamp.", "Chọn phong bì và tem.", "Pumili ng sobre at selyo.", "봉투와 우표를 고르세요.", "选择信封和邮票。", "封筒と切手を選んで。", "Elige un sobre y un sello."],
    ["Letter", "Thư", "Liham", "편지", "信", "手紙", "Carta"],
    ["Postcard", "Bưu thiếp", "Postcard", "엽서", "明信片", "はがき", "Postal"],
    ["Envelope", "Phong bì", "Sobre", "봉투", "信封", "封筒", "Sobre"],
    ["Envelope color", "Màu phong bì", "Kulay ng sobre", "봉투 색상", "信封颜色", "封筒の色", "Color del sobre"],
    ["Paper", "Giấy", "Papel", "종이", "信纸", "紙", "Papel"],
    ["Ink", "Mực", "Tinta", "잉크", "墨水", "インク", "Tinta"],
    ["Your color", "Màu của bạn", "Ang kulay mo", "나의 색", "你的颜色", "あなたの色", "Tu color"],
    ["Custom", "Tùy chỉnh", "Custom", "직접 선택", "自定义", "カスタム", "Personalizado"],
    ["Custom color", "Màu tùy chỉnh", "Custom na kulay", "사용자 색상", "自定义颜色", "カスタムカラー", "Color personalizado"],
    ["Color wheel", "Bánh xe màu", "Color wheel", "색상환", "色轮", "カラーホイール", "Rueda de color"],
    ["Blue", "Xanh dương", "Asul", "파랑", "蓝", "ブルー", "Azul"],
    ["Green", "Xanh lá", "Berde", "초록", "绿", "グリーン", "Verde"],
    ["Coral", "San hô", "Coral", "코랄", "珊瑚", "コーラル", "Coral"],
    ["Rose", "Hồng", "Rosas", "로즈", "玫瑰", "ローズ", "Rosa"],
    ["Mint", "Bạc hà", "Mint", "민트", "薄荷", "ミント", "Menta"],
    ["Sky", "Da trời", "Langit", "하늘", "天蓝", "スカイ", "Cielo"],
    ["Peach", "Đào", "Peach", "피치", "蜜桃", "ピーチ", "Durazno"],
    ["Butter", "Vàng bơ", "Butter", "버터", "奶油", "バター", "Mantequilla"],
    ["Lilac", "Tử đinh hương", "Lilac", "라일락", "丁香", "ライラック", "Lila"],
    ["Violet", "Tím", "Lila", "바이올렛", "紫罗兰", "バイオレット", "Violeta"],
    ["Add a caption (optional)", "Thêm chú thích (không bắt buộc)", "Magdagdag ng caption (opsyonal)", "캡션 추가 (선택)", "添加说明（可选）", "キャプションを追加（任意）", "Agrega un pie de foto (opcional)"],
    ["Caption", "Chú thích", "Caption", "캡션", "说明", "キャプション", "Pie de foto"],
    ["Your caption goes here", "Chú thích của bạn ở đây", "Dito ang caption mo", "캡션을 입력하세요", "在这里写说明", "ここにキャプション", "Tu pie de foto va aquí"],
    ["Tap to edit", "Chạm để sửa", "I-tap para i-edit", "탭하여 편집", "点击编辑", "タップして編集", "Toca para editar"],
    ["Your photo", "Ảnh của bạn", "Ang larawan mo", "내 사진", "你的照片", "あなたの写真", "Tu foto"],
    ["Your letter", "Thư của bạn", "Ang liham mo", "내 편지", "你的信", "あなたの手紙", "Tu carta"],
    ["Choose a stamp", "Chọn tem", "Pumili ng selyo", "우표 고르기", "选择邮票", "切手を選ぶ", "Elige un sello"],
    ["Stamp", "Tem", "Selyo", "우표", "邮票", "切手", "Sello"],
    ["Seal it", "Niêm phong", "Selyuhan", "봉하기", "封好", "封をする", "Ciérrala"],
    ["Seal it with a stamp", "Niêm phong bằng tem", "Selyuhan gamit ang selyo", "우표로 봉하기", "用邮票封好", "切手で封をする", "Ciérrala con un sello"],
    ["Sealing…", "Đang niêm phong…", "Sinisilyuhan…", "봉하는 중…", "正在封口…", "封をしています…", "Cerrando…"],
    ["Listen", "Lắng nghe", "Makinig", "들어주기", "倾听", "聞いて", "Escúchame"],
    ["Cheer me on", "Cổ vũ mình", "Suportahan mo ako", "응원해줘", "为我加油", "応援して", "Anímame"],
    ["Advice", "Lời khuyên", "Payo", "조언", "建议", "アドバイス", "Consejo"],
    ["Support", "Hỗ trợ", "Suporta", "지지", "支持", "サポート", "Apoyo"],
    ["Space", "Không gian riêng", "Espasyo", "혼자 있을 시간", "空间", "そっとしておいて", "Espacio"],
    ["Distract me", "Làm mình quên đi", "Libangin mo ako", "기분 전환시켜줘", "让我分分心", "気をそらして", "Distráeme"],
    ["Taste of home", "Hương vị quê nhà", "Lasa ng tahanan", "집의 맛", "家的味道", "ふるさとの味", "Sabor de casa"],
    ["No stamp", "Không tem", "Walang selyo", "우표 없음", "不用邮票", "切手なし", "Sin sello"],
    ["They may just want you to hear them.", "Có thể họ chỉ muốn bạn lắng nghe.", "Baka gusto lang nilang marinig mo sila.", "그냥 들어주길 바랄 수도 있어요.", "他们可能只是想让你听听。", "ただ聞いてほしいだけかもしれません。", "Quizá solo quieren que les escuches."],
    ["A little encouragement may mean more than advice.", "Một chút động viên có thể ý nghĩa hơn lời khuyên.", "Mas may halaga ang kaunting pampalakas-loob kaysa payo.", "조언보다 작은 격려가 더 의미 있을 수 있어요.", "一点鼓励可能比建议更有意义。", "アドバイスより少しの励ましが響くかも。", "Un poco de ánimo puede valer más que un consejo."],
    ["They’re open to hearing your perspective.", "Họ sẵn lòng nghe góc nhìn của bạn.", "Bukas sila sa pananaw mo.", "당신의 생각을 들을 준비가 돼 있어요.", "他们愿意听听你的看法。", "あなたの考えを聞きたがっています。", "Están abiertos a escuchar tu punto de vista."],
    ["They may appreciate help thinking through next steps.", "Họ có thể cần giúp suy nghĩ bước tiếp theo.", "Baka matuwa sila sa tulong sa susunod na hakbang.", "다음 단계를 함께 고민해주면 고마워할 거예요.", "他们可能希望有人帮忙想想下一步。", "次の一歩を一緒に考えてもらえるとうれしいかも。", "Quizá agradezcan ayuda para pensar los siguientes pasos."],
    ["A simple acknowledgment may be enough right now.", "Lúc này một lời ghi nhận đơn giản có thể là đủ.", "Baka sapat na ngayon ang simpleng pagkilala.", "지금은 간단히 알아주는 것으로 충분할 수 있어요.", "现在简单回应一下可能就够了。", "今はひと言受け止めるだけで十分かも。", "Ahora quizá baste con un simple reconocimiento."],
    ["Something light might be welcome.", "Điều gì đó nhẹ nhàng có thể được chào đón.", "Baka gusto nila ng magaan na bagay.", "가벼운 이야기가 반가울 거예요.", "轻松一点的东西可能会受欢迎。", "軽い話題がうれしいかも。", "Algo ligero podría venir bien."],
    ["A little piece of home would mean a lot.", "Một chút quê nhà sẽ rất ý nghĩa.", "Malaking bagay ang kaunting piraso ng tahanan.", "집의 작은 조각이 큰 의미가 될 거예요.", "一点家的味道会很有意义。", "ふるさとのひとかけらがきっと心に響きます。", "Un pedacito de casa significaría mucho."],
    ["Mom will see a hint: “", "Mom sẽ thấy gợi ý: “", "Makikita ni Mama ang pahiwatig: “", "엄마에게 힌트가 보여요: “", "妈妈会看到提示：“", "お母さんにヒントが表示されます：「", "Mamá verá una pista: “"],
    ["Sent!", "Đã gửi!", "Naipadala!", "보냈어요!", "已寄出！", "送信しました！", "¡Enviada!"],
    ["Sent", "Đã gửi", "Naipadala", "보냄", "已寄出", "送信済み", "Enviada"],
    ["Sent by you", "Bạn đã gửi", "Ipinadala mo", "내가 보냄", "你寄出的", "あなたが送信", "Enviada por ti"],
    ["Received", "Đã nhận", "Natanggap", "받음", "收到的", "受信", "Recibida"],
    ["To be continued…", "Còn tiếp…", "Itutuloy…", "다음에 계속…", "未完待续…", "つづく…", "Continuará…"],

    // Mail, read, reply
    ["New mail", "Thư mới", "Bagong liham", "새 편지", "新信件", "新しい手紙", "Correo nuevo"],
    ["Break the seal", "Mở niêm phong", "Buksan ang selyo", "봉인 뜯기", "拆开封印", "封を切る", "Rompe el sello"],
    ["pull the seal down to open", "kéo con dấu xuống để mở", "hilahin pababa ang selyo para buksan", "봉인을 아래로 당겨 열어요", "向下拉开封印", "封を下に引いて開ける", "tira del sello hacia abajo para abrir"],
    ["Opening…", "Đang mở…", "Binubuksan…", "여는 중…", "正在打开…", "開いています…", "Abriendo…"],
    ["Turning the page…", "Đang lật trang…", "Inililipat ang pahina…", "페이지를 넘기는 중…", "正在翻页…", "ページをめくっています…", "Pasando la página…"],
    ["Tap anywhere to celebrate", "Chạm bất kỳ đâu để ăn mừng", "I-tap kahit saan para magdiwang", "아무 곳이나 탭해서 축하해요", "点击任意处庆祝", "どこでもタップしてお祝い", "Toca en cualquier lugar para celebrar"],
    ["Write back", "Viết thư trả lời", "Sumagot", "답장 쓰기", "回信", "返事を書く", "Responder"],
    ["Back to the letter", "Quay lại lá thư", "Bumalik sa liham", "편지로 돌아가기", "返回信件", "手紙に戻る", "Volver a la carta"],
    ["Back home", "Về trang chủ", "Bumalik sa home", "홈으로", "回到首页", "ホームに戻る", "Volver al inicio"],
    ["Back to the beginning", "Về lại từ đầu", "Bumalik sa simula", "처음으로", "回到开头", "最初に戻る", "Volver al principio"],
    ["Write to Mom?", "Viết cho Mom?", "Sumulat kay Mom?", "Mom에게 쓸까요?", "给 Mom 写信？", "Mom に書く？", "¿Escribir a Mom?"],
    ["Letter to", "Thư gửi", "Liham para kay", "받는 사람", "写给", "宛先", "Carta para"],
    ["to Mom", "gửi Mom", "para kay Mom", "Mom에게", "给 Mom", "Mom へ", "para Mom"],
    ["Reply to", "Trả lời", "Sumagot kay", "답장 대상", "回复", "返信先", "Responder a"],
    ["You needed", "Bạn cần", "Kailangan mo ng", "필요했던 것:", "你需要", "必要だったもの：", "Necesitabas"],
    ["someone to listen", "ai đó lắng nghe", "taong makikinig", "들어줄 사람", "有人倾听", "聞いてくれる人", "alguien que escuche"],
    ["a little encouragement", "một chút động viên", "kaunting pampalakas-loob", "작은 격려", "一点鼓励", "少しの励まし", "un poco de ánimo"],
    ["advice", "lời khuyên", "payo", "조언", "建议", "アドバイス", "consejo"],
    ["support", "sự hỗ trợ", "suporta", "지지", "支持", "サポート", "apoyo"],
    ["some space", "chút không gian", "kaunting espasyo", "약간의 거리", "一点空间", "少しの距離", "un poco de espacio"],
    ["a distraction", "điều gì đó để quên đi", "kaunting libangan", "기분 전환", "分分心", "気晴らし", "una distracción"],
    ["a taste of home", "hương vị quê nhà", "lasa ng tahanan", "집의 맛", "家的味道", "ふるさとの味", "un sabor de casa"],
    ["Save privately (only you see this)", "Lưu riêng (chỉ bạn thấy)", "I-save nang pribado (ikaw lang ang makakakita)", "비공개 저장 (나만 볼 수 있어요)", "私密保存（仅你可见）", "非公開で保存（自分だけに表示）", "Guardar en privado (solo tú lo ves)"],
    ["Saved privately. Tap to remove", "Đã lưu riêng. Chạm để bỏ", "Na-save nang pribado. I-tap para alisin", "비공개 저장됨. 탭하여 삭제", "已私密保存。点击移除", "非公開で保存済み。タップで解除", "Guardado en privado. Toca para quitar"],
    ["Close photo", "Đóng ảnh", "Isara ang larawan", "사진 닫기", "关闭照片", "写真を閉じる", "Cerrar foto"],

    // History
    ["History", "Lịch sử", "Kasaysayan", "기록", "历史", "履歴", "Historial"],
    ["Search letters and postcards", "Tìm thư và bưu thiếp", "Maghanap ng liham at postcard", "편지와 엽서 검색", "搜索信件和明信片", "手紙とはがきを検索", "Buscar cartas y postales"],
    ["Clear search", "Xóa tìm kiếm", "I-clear ang paghahanap", "검색 지우기", "清除搜索", "検索をクリア", "Borrar búsqueda"],
    ["Try a word from the letter, a name, or a date like “Oct”.", "Thử một từ trong thư, một cái tên, hoặc ngày như “Oct”.", "Subukan ang salita mula sa liham, pangalan, o petsa gaya ng “Oct”.", "편지 속 단어, 이름, 또는 “Oct” 같은 날짜로 찾아보세요.", "试试信中的词、名字或日期，如“Oct”。", "手紙の言葉、名前、または「Oct」のような日付で探してみて。", "Prueba una palabra de la carta, un nombre o una fecha como “Oct”."],
    ["Letters will show up here.", "Thư sẽ hiện ở đây.", "Lalabas dito ang mga liham.", "편지가 여기에 표시돼요.", "信件会显示在这里。", "手紙はここに表示されます。", "Las cartas aparecerán aquí."],
    ["No saved letters yet", "Chưa có thư đã lưu", "Wala pang na-save na liham", "저장한 편지가 없어요", "还没有保存的信", "保存した手紙はまだありません", "Aún no hay cartas guardadas"],
    ["Tap the bookmark on a letter to keep it here. Only you can see what you save.", "Chạm dấu trang trên thư để giữ ở đây. Chỉ bạn thấy những gì bạn lưu.", "I-tap ang bookmark sa liham para itago dito. Ikaw lang ang makakakita.", "편지의 북마크를 탭하면 여기에 보관돼요. 저장한 건 나만 볼 수 있어요.", "点击信上的书签即可保存在这里。只有你能看到。", "手紙のしおりをタップするとここに保存。保存したものは自分だけに見えます。", "Toca el marcador de una carta para guardarla aquí. Solo tú lo ves."],
    ["Photos you add show up here as stamps.", "Ảnh bạn thêm sẽ hiện ở đây dưới dạng tem.", "Lalabas dito bilang selyo ang mga larawang idaragdag mo.", "추가한 사진이 여기에 우표로 표시돼요.", "你添加的照片会以邮票形式显示在这里。", "追加した写真は切手としてここに表示されます。", "Las fotos que agregues aparecen aquí como sellos."],
    ["Me", "Tôi", "Ako", "나", "我", "わたし", "Yo"],

    // Recap
    ["Recap book", "Sổ tổng kết", "Recap book", "회고 앨범", "回顾册", "振り返りブック", "Libro resumen"],
    ["Fall 2026", "Mùa thu 2026", "Taglagas 2026", "2026 가을", "2026 年秋", "2026年 秋", "Otoño 2026"],
    ["Your fall,", "Mùa thu của bạn,", "Ang taglagas mo,", "나의 가을,", "你的秋天，", "あなたの秋、", "Tu otoño,"],
    ["in letters", "qua những lá thư", "sa mga liham", "편지로", "在信里", "手紙で", "en cartas"],
    ["Your fall, in letters", "Mùa thu của bạn, qua những lá thư", "Ang taglagas mo, sa mga liham", "편지로 본 나의 가을", "信中的你的秋天", "手紙でつづるあなたの秋", "Tu otoño, en cartas"],
    ["November and December will fill in as letters arrive. The finished book comes at the end of the semester.", "Tháng Mười Một và Mười Hai sẽ được thêm khi thư đến. Cuốn sổ hoàn chỉnh sẽ có vào cuối học kỳ.", "Mapupuno ang Nobyembre at Disyembre habang dumarating ang mga liham. Darating ang tapos na libro sa dulo ng semestre.", "11월과 12월은 편지가 오면 채워져요. 완성된 앨범은 학기 말에 나와요.", "十一月和十二月会随着来信补全。完整的册子会在学期末送达。", "11月と12月は手紙が届くたびに埋まっていきます。完成版は学期末に届きます。", "Noviembre y diciembre se llenarán con las cartas. El libro terminado llega al final del semestre."],
    ["Chapter ", "Chương ", "Kabanata ", "챕터 ", "第 ", "第", "Capítulo "],

    // Prototype nav / misc
    ["Screens", "Màn hình", "Mga screen", "화면", "页面", "画面", "Pantallas"],
    ["Onboarding", "Giới thiệu", "Onboarding", "온보딩", "新手引导", "オンボーディング", "Bienvenida"],
    ["Receive and look back", "Nhận và nhìn lại", "Tumanggap at magbalik-tanaw", "받고 돌아보기", "收信与回顾", "受け取って振り返る", "Recibir y recordar"],
    ["Pick your prompt (swipe)", "Chọn gợi ý (vuốt)", "Pumili ng tanong (swipe)", "질문 고르기 (스와이프)", "选择提示（滑动）", "お題を選ぶ（スワイプ）", "Elige tu idea (desliza)"],
    ["Capture", "Ghi lại", "Kunan", "기록하기", "记录", "記録する", "Capturar"],
    ["Caption + stamp", "Chú thích + tem", "Caption + selyo", "캡션 + 우표", "说明 + 邮票", "キャプション＋切手", "Pie de foto + sello"],
    ["Read", "Đọc", "Basahin", "읽기", "阅读", "読む", "Leer"],
    ["Name reveal", "Ra mắt tên", "Pagpapakilala ng pangalan", "이름 공개", "名称揭晓", "名前の発表", "Revelación del nombre"],
    ["Splash", "Màn chào", "Splash", "스플래시", "启动页", "スプラッシュ", "Inicio"],
    ["Opening", "Mở đầu", "Pagbubukas", "오프닝", "开场", "オープニング", "Apertura"],
    ["Home", "Trang chủ", "Home", "홈", "首页", "ホーム", "Inicio"],
    ["Question 1", "Câu hỏi 1", "Tanong 1", "질문 1", "问题 1", "質問1", "Pregunta 1"],
    ["Question 2", "Câu hỏi 2", "Tanong 2", "질문 2", "问题 2", "質問2", "Pregunta 2"],
    ["Question 3", "Câu hỏi 3", "Tanong 3", "질문 3", "问题 3", "質問3", "Pregunta 3"],
    ["Question 4", "Câu hỏi 4", "Tanong 4", "질문 4", "问题 4", "質問4", "Pregunta 4"],
    ["Image credits", "Nguồn hình ảnh", "Pinagmulan ng larawan", "이미지 출처", "图片来源", "画像クレジット", "Créditos de imágenes"],
    ["Letters between art students and their families. Tap through the phone, or jump to any screen.", "Thư giữa sinh viên mỹ thuật và gia đình. Chạm qua điện thoại, hoặc chuyển đến bất kỳ màn hình nào.", "Mga liham sa pagitan ng mga art student at kanilang pamilya. I-tap ang phone, o pumunta sa anumang screen.", "미술 학생과 가족 사이의 편지. 휴대폰을 탭해 둘러보거나 원하는 화면으로 이동하세요.", "艺术生与家人之间的信。点击手机浏览，或跳到任意页面。", "美大生と家族をつなぐ手紙。スマホをタップして進むか、好きな画面へ移動できます。", "Cartas entre estudiantes de arte y sus familias. Toca el teléfono o salta a cualquier pantalla."],

    // Stickers
    ["Add your pet sticker", "Thêm nhãn dán thú cưng", "Idagdag ang sticker ng alaga mo", "반려동물 스티커 추가", "添加宠物贴纸", "ペットのステッカーを追加", "Agrega el sticker de tu mascota"],
    ["Turn a photo of your pet into a sticker.", "Biến ảnh thú cưng thành nhãn dán.", "Gawing sticker ang larawan ng alaga mo.", "반려동물 사진을 스티커로 만들어요.", "把宠物照片变成贴纸。", "ペットの写真をステッカーに。", "Convierte una foto de tu mascota en sticker."],
    ["Your pet", "Thú cưng của bạn", "Ang alaga mo", "내 반려동물", "你的宠物", "あなたのペット", "Tu mascota"],
    ["Sticker categories", "Danh mục nhãn dán", "Mga kategorya ng sticker", "스티커 카테고리", "贴纸分类", "ステッカーのカテゴリ", "Categorías de stickers"],
    ["Sticker options", "Tùy chọn nhãn dán", "Mga opsyon ng sticker", "스티커 옵션", "贴纸选项", "ステッカーのオプション", "Opciones de sticker"],
    ["Drag to move. Pinch or use the corner to resize and turn.", "Kéo để di chuyển. Chụm hoặc dùng góc để đổi cỡ và xoay.", "I-drag para ilipat. I-pinch o gamitin ang sulok para baguhin ang laki at ikutin.", "드래그해서 옮기고, 핀치하거나 모서리로 크기와 회전을 바꿔요.", "拖动以移动。双指缩放或拖动角落来调整大小和旋转。", "ドラッグで移動。ピンチか角でサイズと角度を変えます。", "Arrastra para mover. Pellizca o usa la esquina para cambiar tamaño y girar."],
    ["Faces", "Khuôn mặt", "Mukha", "얼굴", "表情", "顔", "Caras"],
    ["Hands", "Bàn tay", "Kamay", "손", "手势", "手", "Manos"],
    ["Hearts", "Trái tim", "Puso", "하트", "爱心", "ハート", "Corazones"],
    ["Food", "Đồ ăn", "Pagkain", "음식", "食物", "食べ物", "Comida"],
    ["Fruit", "Trái cây", "Prutas", "과일", "水果", "フルーツ", "Fruta"],
    ["Plants", "Cây cối", "Halaman", "식물", "植物", "植物", "Plantas"],
    ["Pets", "Thú cưng", "Alaga", "반려동물", "宠物", "ペット", "Mascotas"],
    ["Things", "Đồ vật", "Mga bagay", "물건", "物品", "もの", "Cosas"],
    ["Symbols", "Biểu tượng", "Simbolo", "기호", "符号", "記号", "Símbolos"],
    ["Snacks", "Đồ ăn vặt", "Meryenda", "간식", "零食", "おやつ", "Snacks"],
    ["Sweets", "Đồ ngọt", "Matamis", "디저트", "甜点", "スイーツ", "Dulces"],
    ["Kitchen", "Nhà bếp", "Kusina", "주방", "厨房", "キッチン", "Cocina"]
  ];

  // Partial / dynamic strings: [regex, fn(match, langIndex) -> string]
  var T = function (en, i) { var r = MAP[en]; return r ? r[i] : en; };
  var PATTERNS = [
    [/^Language: (.+)$/, function (m, i) { return T("Language", i) + ": " + m[1]; }],
    [/^Notifications, (\d+) new$/, function (m, i) { return T("Notifications", i) + ", " + m[1]; }],
    [/^(.+) needs$/, function (m, i) { return [m[1] + " needs", m[1] + " cần", "Kailangan ni " + m[1] + " ng", m[1] + "에게 필요한 것:", m[1] + " 需要", m[1] + " に必要なもの：", m[1] + " necesita"][i]; }],
    [/^Write back to (.+)$/, function (m, i) { return [m[0], "Trả lời " + m[1], "Sumagot kay " + m[1], m[1] + "에게 답장", "回信给 " + m[1], m[1] + " に返事を書く", "Responder a " + m[1]][i]; }],
    [/^It’s on its way to (.+)\. They’ll open it when they’re ready\.$/, function (m, i) { return [m[0], "Thư đang trên đường đến " + m[1] + ". Họ sẽ mở khi sẵn sàng.", "Papunta na ito kay " + m[1] + ". Bubuksan nila kapag handa na sila.", m[1] + "에게 가는 중이에요. 준비되면 열어볼 거예요.", "正在寄往 " + m[1] + "。他们准备好时会打开。", m[1] + " へ向かっています。準備ができたら開いてくれます。", "Va camino a " + m[1] + ". La abrirán cuando estén listos."][i]; }],
    [/^Your reply is on its way to (.+?)\.?$/, function (m, i) { return [m[0], "Thư trả lời đang đến " + m[1] + ".", "Papunta na kay " + m[1] + " ang sagot mo.", "답장이 " + m[1] + "에게 가는 중이에요.", "你的回信正寄往 " + m[1] + "。", "返事が " + m[1] + " へ向かっています。", "Tu respuesta va camino a " + m[1] + "."][i]; }],
    [/^(\d+) letters? waiting, from (.+?)\.?$/, function (m, i) { var f = m[2].replace(" and ", [" and ", " và ", " at ", "와 ", " 和 ", " と ", " y "][i]); return [m[0], m[1] + " thư đang chờ, từ " + f + ".", m[1] + " liham na naghihintay, mula kina " + f + ".", f + "의 편지 " + m[1] + "통이 기다려요.", m[1] + " 封来自 " + f + " 的信在等你。", f + " からの手紙が " + m[1] + " 通届いています。", m[1] + " carta(s) esperando, de " + f + "."][i]; }],
    [/^(\d+) new letters?$/, function (m, i) { return [m[0], m[1] + " thư mới", m[1] + " bagong liham", "새 편지 " + m[1] + "통", m[1] + " 封新信", "新しい手紙 " + m[1] + " 通", m[1] + " carta(s) nueva(s)"][i]; }],
    [/^(\d+) letters and postcards$/, function (m, i) { return [m[0], m[1] + " thư và bưu thiếp", m[1] + " liham at postcard", "편지와 엽서 " + m[1] + "개", m[1] + " 封信和明信片", "手紙とはがき " + m[1] + " 件", m[1] + " cartas y postales"][i]; }],
    [/^of (\d+)$/, function (m, i) { return [m[0], "/ " + m[1], "sa " + m[1], "/ " + m[1], "/ " + m[1], "/ " + m[1], "de " + m[1]][i]; }],
    [/^(\d+) of (\d+) · swipe right to answer, left to skip$/, function (m, i) { return [m[0], m[1] + "/" + m[2] + " · vuốt phải để trả lời, trái để bỏ qua", m[1] + " sa " + m[2] + " · i-swipe pakanan para sumagot, pakaliwa para laktawan", m[1] + "/" + m[2] + " · 오른쪽으로 밀면 답하기, 왼쪽은 건너뛰기", m[1] + "/" + m[2] + " · 右滑回答，左滑跳过", m[1] + "/" + m[2] + " · 右スワイプで答える、左でスキップ", m[1] + " de " + m[2] + " · desliza a la derecha para responder, a la izquierda para saltar"][i]; }],
    [/^(.+) · sample spot$/, function (m, i) { return m[1] + " · " + ["sample spot", "vị trí mẫu", "halimbawang puwesto", "샘플 위치", "示例位置", "サンプルの場所", "lugar de muestra"][i]; }],
    [/^for ([a-z ]+)$/, function (m, i) { var t = T(m[1], i); return [m[0], "cho " + t, "para sa " + t, "(" + t + ")", "· " + t, "（" + t + "）", "para " + t][i]; }],
    [/^for (.+), from (.+?) · (.+)$/, function (m, i) { var d = fmtDate(m[3]) || m[3]; return [m[0], "gửi " + m[1] + ", từ " + m[2] + " · " + d, "para kay " + m[1] + ", mula kay " + m[2] + " · " + d, m[1] + "에게, " + m[2] + " 보냄 · " + d, "致 " + m[1] + "，来自 " + m[2] + " · " + d, m[1] + " へ、" + m[2] + " より · " + d, "para " + m[1] + ", de " + m[2] + " · " + d][i]; }],
    [/^Nothing matches “(.*)”\.?$/, function (m, i) { return [m[0], "Không có kết quả cho “" + m[1] + "”", "Walang tugma sa “" + m[1] + "”", "“" + m[1] + "”에 맞는 결과가 없어요", "没有与“" + m[1] + "”匹配的结果", "「" + m[1] + "」に一致するものはありません", "Nada coincide con “" + m[1] + "”"][i]; }],
    [/^Live · updated (\d+) min ago$/, function (m, i) { return [m[0], "Trực tiếp · cập nhật " + m[1] + " phút trước", "Live · na-update " + m[1] + " min ang nakalipas", "실시간 · " + m[1] + "분 전 업데이트", "实时 · " + m[1] + " 分钟前更新", "ライブ · " + m[1] + "分前に更新", "En vivo · actualizado hace " + m[1] + " min"][i]; }],
    [/^Accurate to about (.+)$/, function (m, i) { return [m[0], "Chính xác khoảng " + m[1], "Tumpak sa mga " + m[1], "약 " + m[1] + " 정확도", "精确到约 " + m[1], "精度 約" + m[1], "Precisión de unos " + m[1]][i]; }],
    [/^Reply to “(.*)$/, function (m, i) { return [m[0], "Trả lời “" + m[1], "Sagot sa “" + m[1], "답장: “" + m[1], "回复“" + m[1], "返信：「" + m[1], "Respuesta a “" + m[1]][i]; }],
    [/^Replying to “(.*)$/, function (m, i) { return [m[0], "Đang trả lời “" + m[1], "Sumasagot sa “" + m[1], "답장 중: “" + m[1], "正在回复“" + m[1], "返信中：「" + m[1], "Respondiendo a “" + m[1]][i]; }],
    [/^Stamped “(.*)” ·$/, function (m, i) { var s = T(m[1], i); return [m[0], "Đóng tem “" + s + "” ·", "Selyong “" + s + "” ·", "“" + s + "” 우표 ·", "邮票“" + s + "” ·", "「" + s + "」の切手 ·", "Sello “" + s + "” ·"][i]; }]
  ];

  // Dates and times rendered in en-US by the app, re-rendered in the chosen locale.
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function mIdx(name) {
    for (var k = 0; k < 12; k++) if (MONTHS[k] === name || MONTHS[k].slice(0, 3) === name) return k;
    return -1;
  }
  function fmt(d, o) { try { return new Intl.DateTimeFormat(CODES[cur], o).format(d); } catch (e) { return null; } }
  function fmtDate(s) {
    var m;
    if ((m = s.match(/^(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), ([A-Z][a-z]+) (\d{1,2})$/)) && mIdx(m[1]) >= 0)
      return fmt(new Date(2026, mIdx(m[1]), +m[2]), { weekday: "long", month: "long", day: "numeric" });
    if ((m = s.match(/^([A-Z][a-z]{2,8}) (\d{1,2})$/)) && mIdx(m[1]) >= 0)
      return fmt(new Date(2026, mIdx(m[1]), +m[2]), { month: "short", day: "numeric" });
    if ((m = s.match(/^([A-Z][a-z]+)$/)) && MONTHS.indexOf(m[1]) >= 0)
      return fmt(new Date(2026, MONTHS.indexOf(m[1]), 1), { month: "long" });
    if ((m = s.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/)))
      return fmt(new Date(2026, 0, 1, (+m[1] % 12) + (m[3] === "PM" ? 12 : 0), +m[2]), { hour: "numeric", minute: "2-digit" });
    return null;
  }

  var MAP = {};
  ROWS.forEach(function (r) { MAP[r[0]] = r; });

  function idx(name) { var i = LANGS.indexOf(name); return i < 0 ? 0 : i; }
  var store = null;
  try { store = window.localStorage; } catch (e) {}
  var saved = null;
  try { saved = store && store.getItem("lumen-lang"); } catch (e) {}
  var cur = idx(saved || window.__lang || "English");
  window.__lang = LANGS[cur];

  function translate(s) {
    if (cur === 0 || !s) return s;
    var lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], core = s.trim();
    if (!core) return s;
    var r = MAP[core] || MAP[s];
    if (r) return MAP[s] ? r[cur] : lead + r[cur] + trail;
    for (var p = 0; p < PATTERNS.length; p++) {
      var m = core.match(PATTERNS[p][0]);
      if (m) return lead + PATTERNS[p][1](m, cur) + trail;
    }
    var d = fmtDate(core);
    if (d) return lead + d + trail;
    return s;
  }

  // Text nodes: remember the English source so switching back (or re-renders) work.
  var orig = new WeakMap(), applied = new WeakMap();
  var ATTRS = ["placeholder", "aria-label", "title", "alt"];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1 };

  function doText(n) {
    var v = n.nodeValue;
    if (applied.get(n) !== v) orig.set(n, v);
    var src = orig.get(n), out = translate(src);
    applied.set(n, out);
    if (out !== v) n.nodeValue = out;
  }
  function doAttrs(el) {
    for (var a = 0; a < ATTRS.length; a++) {
      var name = ATTRS[a];
      if (!el.hasAttribute(name)) continue;
      var v = el.getAttribute(name), key = "data-i18n-" + name;
      var src = el.getAttribute(key);
      if (src === null || el.getAttribute(key + "-out") !== v) { src = v; el.setAttribute(key, v); }
      var out = translate(src);
      el.setAttribute(key + "-out", out);
      if (out !== v) el.setAttribute(name, out);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { if (!(root.parentNode && SKIP[root.parentNode.nodeName])) doText(root); return; }
    if (root.nodeType !== 1) return;
    if (SKIP[root.nodeName] || root.isContentEditable) { doAttrs(root); return; }
    doAttrs(root);
    var w = document.createTreeWalker(root, 5, {
      acceptNode: function (n) {
        if (n.nodeType === 1 && (SKIP[n.nodeName] || n.isContentEditable)) { doAttrs(n); return 2; }
        return 1;
      }
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }

  var busy = false;
  var mo = new MutationObserver(function (recs) {
    if (busy) return;
    busy = true;
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === "characterData") doText(r.target);
      else if (r.type === "attributes") { if (r.target.nodeType === 1) doAttrs(r.target); }
      else for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
    }
    mo.takeRecords();
    busy = false;
  });

  function applyLang() {
    document.documentElement.lang = CODES[cur];
    if (!document.body) return;
    busy = true; walk(document.body); mo.takeRecords(); busy = false;
  }

  window.__setLang = function (name) {
    cur = idx(name);
    window.__lang = LANGS[cur];
    try { store && store.setItem("lumen-lang", LANGS[cur]); } catch (e) {}
    applyLang();
  };

  function start() {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    applyLang();
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);

  // Seven languages make the sheet taller; let it scroll inside the phone frame.
  var css = document.createElement("style");
  css.textContent = ".hs-sheet{max-height:88%;overflow-y:auto;overscroll-behavior:contain}";
  (document.head || document.documentElement).appendChild(css);
})();
