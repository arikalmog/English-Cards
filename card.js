var card = function (cardNumber, backText, frontText, word) {
    this.id =
        this.number = cardNumber;
    this.cardElement;
    this.selected = new customEvent();
    this.unselected = new customEvent();
    this.isOpen = false;
    this.backText = backText;
    this.frontText = frontText;
    this.state = "";
    this.word = word;
    this.success = function () {
        this.state = "success";
        if (this.cardElement.classList.contains("current"))
            this.cardElement.classList.remove("current");
        this.cardElement.classList.add("success");
    }
    this.fail = function () {
        this.state = "fail";
        if (this.cardElement.classList.contains("current"))
            this.cardElement.classList.remove("current");
        this.cardElement.classList.add("fail");
    }
    this.current = function () {
        this.state = "";
        if (this.cardElement.classList.contains("fail"))
            this.cardElement.classList.remove("fail");
        if (this.cardElement.classList.contains("success"))
            this.cardElement.classList.remove("success");

        this.cardElement.classList.add("current");

    }
    this.select = function () {
        this.isOpen = !this.isOpen;
        this.flip();
        if (this.isOpen)
            this.selected.next(this);
        else
            this.unselected.next(this);
    };

    this.flip = function () {
        if (this.cardElement.classList.contains("flip-me"))
            this.cardElement.classList.remove("flip-me");
        else
            this.cardElement.classList.add("flip-me");
    };
    this.set = function () {

        this.cardElement = document.createElement("div");
        this.cardElement.classList.add("flip-card");
        this.cardElement.onclick = () => { this.select() };

        var enWords = this.words_dic.map(w => w.en);
        enWords.forEach(word => {
            //this.frontText = this.frontText.replace(" " + word + " ", " <b>" + word + "</b> ");
        })

        this.cardElement.innerHTML =
            '<div id="c' + this.id + '" class="flip-card-inner">' +
            '<span onclick="speech.read(\'' + this.frontText + '\');event.stopPropagation();" class="material-symbols-outlined read">volume_up</span>' +

                '<div class="flip-card-front">' +
                '<div id="front-text">' + this.frontText + '</div>' +
                '</div>' +
                '<div class="flip-card-back">' +
                '<div id="back-text">' + this.backText + '</div>' +
                '</div>' +
                '</div>';


    }


    this.get = function () {
        return this.cardElement;
    }

    this.words_dic = [
        { he: 'סתיו', en: 'autumn' },
        { he: 'כדורסל', en: 'basketball' },
        { he: 'יפה', en: 'beautiful' },
        { he: 'מגפיים', en: 'boots' },
        { he: 'ילדים', en: 'children' },
        { he: 'קרוב', en: 'near' },
        { he: 'אף', en: 'nose' },
        { he: 'בסדר', en: 'okay' },
        { he: 'ישן', en: 'old' },
        { he: 'מכנסיים', en: 'pants' },
        { he: 'טפס', en: 'climb' },
        { he: 'פארק', en: 'park' },
        { he: 'ענן', en: 'cloud' },
        { he: 'מעיל', en: 'coat' },
        { he: 'קר', en: 'cold' },
        { he: 'לבוא', en: 'come' },
        { he: 'שמלה', en: 'dress' },
        { he: 'לאכול', en: 'eat' },
        { he: 'תמונה', en: 'picture' },
        { he: 'לשחק בכדורגל', en: 'play football' },
        { he: 'לשחק', en: 'play' },
        { he: 'בריכה', en: 'pool' },
        { he: 'לקרוא ספר', en: 'read a book' },
        { he: 'חולצה', en: 'shirt' },
        { he: 'עיניים', en: 'eyes' },
        { he: 'נעליים', en: 'shoes' },
        { he: 'אבא', en: 'father' },
        { he: 'שמיים', en: 'sky' },
        { he: 'לעוף עפיפון', en: 'fly a kite' },
        { he: 'מצחיק', en: 'funny' },
        { he: 'משחק', en: 'game' },
        { he: 'לישון', en: 'sleep' },
        { he: 'שלג', en: 'snow' },
        { he: 'גרביים', en: 'socks' },
        { he: 'טוב עבורך', en: 'good for you' },
        { he: 'אביב', en: 'spring' },
        { he: 'בית', en: 'home' },
        { he: 'לעמוד', en: 'stand' },
        { he: 'גלידה', en: 'ice cream' },
        { he: 'חנות', en: 'store' },
        { he: 'אמא', en: 'mother' },
        { he: 'קיץ', en: 'summer' },
        { he: 'שמשי', en: 'sunny' },
        { he: 'פה', en: 'mouth' },
        { he: 'הם', en: 'they' },
        { he: 'גם כן', en: 'too' },
        { he: 'עץ', en: 'tree' },
        { he: 'קיר', en: 'wall' },
        { he: 'חם', en: 'warm' },
        { he: 'אנחנו', en: 'we' },
        { he: 'ללבוש', en: 'wear' },
        { he: 'מי', en: 'who' },
        { he: 'חורף', en: 'winter' },
        { he: 'פאזל', en: 'puzzle' },
        { he: 'משפחה', en: 'family' },
        { he: 'חוף', en: 'shore' }

    ]
    this.set();


}


