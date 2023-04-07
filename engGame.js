var gameComponent = function () {
	this.pairs = 10;
	this.pairsFound = 0;
	this.turns = 0;
	this.gameCards = [];
	this.gameBoard;
	this.pairsFoundElement;
	this.firstCard;
	this.secondCard;
	this.cardsInline = 7;
	this.rowsElements = [];
	this.scoreNum = 0;
	this.x = 0;
	this.y = 0;
	this.game = () => { };
	this.expression = "";
	var _this = this;
	this.t;
	this.startTimer = new Date();
	this.leftTime = 0;

	this.resetGame = function () {

		this.gameCards = [];
		this.gameBoard = document.getElementById("gameBody");
		this.gameBoard.innerHTML = "";
		this.pairsFoundElement = document.getElementById("pairsFound");

		this.turnsElement = document.getElementById("turns");
		this.gameWon = document.getElementById("gameWon");
		this.cardsInline = this.getCardsInLine(this.gameCards.length, 1);
		var rows = this.gameCards.length / this.cardsInline;
		for (r = 0; r < rows; r++) {
			var rowElement = document.createElement("div");
			rowElement.classList.add("card-row");
			this.gameBoard.appendChild(rowElement);

			this.rowsElements.push(rowElement);

		}

		this.pairsFound = 0;
	}

	this.getCardsInLine = function (total, divisorA) {
		var divisorB = total;
		while (!(divisorA > divisorB && Math.floor(divisorA) * Math.floor(divisorB) == total)) {
			divisorA++;
			divisorB = total / divisorA;

		}
		return divisorA;
	}
	this.onCardUnselected = function (cardSelected) {

	}
	this.onCardSelected = function (cardSelected) {
		var openCards = this.gameCards.filter(c => c.isOpen).length;
		var selectedCards = openCards - (this.pairsFound * 2);
		if (selectedCards == 1)
			this.firstCard = cardSelected;
		if (selectedCards == 2) {
			this.secondCard = cardSelected;
			this.turns++;
			if (this.firstCard.number == this.secondCard.number) {
				this.pairsFound++;

				this.pairsFoundElement.innerHTML = this.pairsFound + " cards";
				this.turnsElement.innerHTML = this.turns + " turns";
				if (this.pairs == this.pairsFound)
					this.gameWon.classList.add("done");
			}
			else {
				setTimeout(() => {

					this.firstCard.select();
					this.secondCard.select();
				}, 1000);
			}
		}
	}
	this.setCard = function (cardNumber) {
		var index = this.getPosition();
		if (this.gameCards[index] == undefined) {
			this.gameCards[index] = new card(cardNumber);
			this.gameCards[index].selected.subscribe(d => {
				this.onCardSelected(d);
			});
			this.gameCards[index].unselected.subscribe(d => {
				this.onCardUnselected(d);
			})
		}
		else
			this.setCard(cardNumber);
	};
	this.getPosition = function () {
		var position = Math.random(0, 5);
		position = position * this.gameCards.length;
		position = Math.floor(position);
		return position;
	}
	this.setCardRow = function () {

	}

	this.record = function () {
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				const mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();

				const audioChunks = [];
				mediaRecorder.addEventListener("dataavailable", event => {
					audioChunks.push(event.data);
				});

				mediaRecorder.addEventListener("stop", () => {
					const audioBlob = new Blob(audioChunks);
					const audioUrl = URL.createObjectURL(audioBlob);
					const audio = new Audio(audioUrl);
					audio.play();
				});

				setTimeout(() => {
					mediaRecorder.stop();
				}, 3000);
			});
	}


	var SpeechRecognition = window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
	this.startSpeech = function () {
		this.recstat = document.getElementById("recstatus");
		this.instructions = document.getElementById("instructions");
		this.word = document.getElementById("word");
		this.img = document.getElementById("img-word");
		this.text = "חג החנוכה בא.  הלכה טליה לסבתא.";
		this.speechElement = document.getElementById("speech");
		//this.word.innerText = words[0];
		this.speech();
		recognition.lang = "he-IL";
		recognition.start();
	}
	this.lastAns;
	this.speech = function () {
		this.card = document.getElementById("current");
		var _recstat = this.recstat;
		var _instructions = this.instructions;
		var _this = this;

		/*var Textbox = $('#textbox');*/


		var Content = '';

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = function (event) {

			var current = event.resultIndex;
			var transcript = event.results[current][0].transcript;
			if (_this.timeLeft > 0)
				clearTimeout(_this.timeoutObj);


			transcript = transcript.trim();
			if (_this.lastAns != transcript)
				_this.lastAns = transcript
			else
				return;


			if (_this.currentWord.en == transcript) {
				console.log("good");
				_this.addScore();

			}
			else {
				//_this.card.innerHTML = _this.expression;
				if (_this.gameSettings.enableTimer)
					setTimeout(() => {
						_this.counter(_this.timeLeft);
					}, 2000);
			}

			Content = transcript;



		};

		recognition.onstart = function () {
			if (_recstat)
				_recstat.innerHTML = 'מקליט';
			console.log("start recording");
		}

		recognition.onspeechend = function () {
			if (_recstat)
				_recstat.innerHTML = 'הסתיים';
			console.log("end");
			_this.startSpeech();
		}

		recognition.onerror = function (event) {
			console.log(event.error);
			if (event.error == 'no-speech') {
				_instructions.innerHTML = 'Try again.';
			}
		}

		/*$('#start-btn').on('click', function(e) {
		  if (Content.length) {
			Content += ' ';
		  }
		  
		});*/

		/*Textbox.on('input', function() {
		  Content = $(this).val();
		})*/
	}



	this.scoreLetters = {};
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
		{ he: 'לשחק', en: 'play' },
		{ he: 'לשחק בכדורגל', en: 'play football' },
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

	this.words = [
		{
			en: "Autumn is my favorite season.",
			he: "סתיו היא העונה המועדפת עליי."
		},
		{
			en: "I love to play basketball with my friends.",
			he: "אני אוהב לשחק כדורסל עם החברים שלי."
		},
		{
			en: "The flowers in the garden are so beautiful.",
			he: "הפרחים בגינה כל כך יפים."
		},
		{
			en: "I need to buy new boots for the winter.",
			he: "אני צריך לקנות מגפיים חדשים לחורף."
		},
		{
			en: "The children are playing in the park.",
			he: "הילדים משחקים בפארק."
		},
		{
			en: "There is a store near my house.",
			he: "יש חנות ליד הבית שלי."
		},
		{
			en: "It is cold and my nose is runny.",
			he: "קר והאף שלי מצחיק."
		},
		{
			en: "Are you okay? You look funny.",
			he: "האם אתה בסדר? אתה נראה מצחיק."
		},
		{
			en: "My father is very old, but beautiful.",
			he: "אבא שלי זקן מאוד, אבל יפה."
		},
		{
			en: "I need to buy new pants for work.",
			he: "אני צריך לקנות מכנסיים חדשים לעבודה."
		},
		{
			en: "I want to climb to the top of the mountain.",
			he: "אני רוצה לטפס עד ראש ההר."
		},
		{
			en: "Let's go to the park and have a picnic on the grass.",
			he: "בוא נלך לפארק ונעשה פיקניק על הדשא."
		},
		{
			en: "The cloud in the sky looks like a rabbit.",
			he: "הענן בשמיים נראה כמו ארנב."
		},
		{
			en: "I need to wear my coat because it's cold outside.",
			he: "אני צריך ללבוש את המעיל שלי, כיוון שזה קר בחוץ."
		},
		{
			en: "I don't like to be outside when it's cold.",
			he: "אני לא אוהב להיות בחוץ כשזה קר."
		},
		{
			en: "Come with me to the party tonight.",
			he: "בוא איתי למסיבה הלילה."
		},
		{
			en: "I need to buy a new dress for the wedding.",
			he: "אני צריך לקנות שמלה חדשה לחתונה."
		},
		{
			en: "I'm hungry. Let's eat something.",
			he: "אני רעב. בוא נאכל משהו."
		},
		{
			en: "I like to take pictures of landscapes.",
			he: "אני אוהב לצלם נופים."
		},
		{
			en: "I like to play games with my friends.",
			he: "אני אוהב לשחק משחקים עם החברים שלי."
		},
		{
			en: "I want to play football with my brother.",
			he: "אני רוצה לשחק כדורגל עם אחי."
		},
		{
			en: "Let's go swimming in the pool.",
			he: "בוא נשחה בבריכה."
		},
		{
			en: "I like to read a book before going to bed.",
			he: "אני אוהב לקרוא ספר לפני שאני הולך לישון."
		},
		{
			en: "I need to buy a new shirt for work.",
			he: "אני צריך לקנות חולצה חדשה לעבודה."
		},
		{
			en: "Her eyes are so blue and beautiful.",
			he: "העיניים שלה כחולות ויפות."
		},
		{
			en: "I like to wear comfortable shoes.",
			he: "אני אוהב ללבוש נעליים נוחות."
		},
		{
			en: "My father likes to watch sports on TV.",
			he: "האבא שלי אוהב לצפות בספורט בטלוויזיה."
		},
		{
			en: "The sky is so blue and clear today.",
			he: "השמיים הם כחולים וברורים היום."
		},
		{
			en: "Let's go outside and fly a kite.",
			he: "בוא נצא החוצה ונעפיל עפיפון."
		},
		{
			en: "He told a funny joke and made us all laugh.",
			he: "הוא סיפר בדיחה מצחיקה והצליח לגרום לנו לצחוק כולנו."
		},
		{
			en: "I like to play video games in my free time.",
			he: "אני אוהב לשחק במשחקי וידאו בזמני הפנוי."
		},
		{
			en: "I'm tired. I want to sleep.",
			he: "אני עייף. אני רוצה לישון."
		},
		{
			en: "I love to play in the snow.",
			he: "אני אוהב לשחק בשלג."
		},
		{
			en: "I need to buy some new socks.",
			he: "אני צריך לקנות כמה גרביים חדשים."
		},
		{
			en: "That's good for you. I'm happy to hear it.",
			he: "זה טוב עבורך. אני שמח לשמוע את זה."
		},
		{
			en: "I love the spring when all the flowers start to bloom.",
			he: "אני אוהב את האביב כשכל הפרחים מתחילים לפרוח."
		},
		{
			en: "I feel at home when I'm with my family.",
			he: "אני מרגיש בבית כשאני עם המשפחה שלי."
		},
		{
			en: "I like to stand on top of the mountain and look at the view.",
			he: "אני אוהב לעמוד על ראש ההר ולהסתכל על הנוף."
		},
		{
			en: "I want to get some ice cream from the store.",
			he: "אני רוצה לקבל קצת גלידה מהחנות."
		},
		{
			en: "I like to make things with my hands.",
			he: "אני אוהב ליצור דברים בעזרת הידיים שלי."
		},
		{
			en: "My mother is the best cook.",
			he: "האמא שלי היא השף הכי טוב."
		},
		{
			en: "I love the summer when I can go to the shore.",
			he: "אני אוהב את הקיץ כשאני יכול ללכת לים."
		},
		{
			en: "It's sunny today. Let's go outside.",
			he: "היום יש שמש. בואו נצא החוצה."
		},
		{
			en: "I burned my mouth on the hot pizza.",
			he: "שרפתי את הפה שלי על הפיצה החמה."
		},
		{
			en: "They are my best friends.",
			he: "הם החברים הכי טובים שלי."
		},
		{
			en: "I want to go to the store too.",
			he: "אני רוצה גם ללכת לחנות."
		},
		{
			en: "The tree in my house is old.",
			he: "העץ בבית שלי ישן."
		},
		{
			en: "I have a picture of a beautiful autumn.",
			he: "יש לי תמונה יפה של סתיו"
		},
		{
			en: "I wear my warm coat in the summer too.",
			he: "אני לובש את המעיל החם שלי גם בקיץ."
		},
		{
			en: "We are going to the park to play.",
			he: "אנחנו הולכים לפארק לשחק."
		},
		{
			en: "I like to wear my red shoes.",
			he: "אני אוהב ללבוש את הנעליים האדומות שלי."
		},
		{
			en: "My father buy me a new boots.",
			he: "אבא שלי קנה לי מגפיים חדשים."
		},
		{
			en: "The sky is so blue in the spring.",
			he: "השמיים כה כחולים באביב."
		},
		{
			en: "I want to fly a kite in the park.",
			he: "אני רוצה לעוף עפיפון בפארק."
		},
		{
			en: "The game was very fun to play.",
			he: "המשחק היה מאוד כיף לשחק."
		}
	]



	this.currentWord = "";
	this.currentCard = {};
	this.isGaming = false;
	this.gameSettings = {
		enableTimer: false
	}
	this.startGame = function () {
		if (!this.isGaming)
			this.startSpeech();
		if (this.gameCards.length == 0)
			this.words.forEach((w, i) => {
				this.gameCards.push(new card(i, w.he, w.en, w));


			})

		this.game = this.startGame;
		this.gameBoard = document.getElementById("engGame");
		this.card = document.getElementById("current");
		this.isGaming = true;
		let foundCard = false;
		while (!foundCard && this.gameCards.filter(c => c.state == "" || c.state == "fail").length > 0) {
			let currentIndex = Math.floor(Math.random() * this.gameCards.length);
			this.currentCard = this.gameCards[currentIndex];

			if (this.currentCard.state == "" || this.currentCard.state == "fail")
				foundCard = true;
		}

		if (this.gameCards.filter(c => c.state == "" || c.state == "fail") == 0) {
			alert(1);
			return;
		}






		this.currentCard.current();
		this.currentWord = this.currentCard.word;
		this.deck = document.getElementById("deck");
		this.deck.innerHTML = this.gameCards.filter(c => c.state == "").length;
		this.gameBoard.appendChild(this.currentCard.get());
		//this.card.innerHTML = this.currentWord.he;
		let iTimer = 5;
		if (this.gameSettings.enableTimer)
			this.counter(iTimer);

	}



	this.timeoutObj;
	this.timeLeft = 5;
	this.counter = function (timer) {
		let iTimer = timer;
		this.timer = document.getElementById("timer");
		this.timer.innerHTML = iTimer;
		this.timeoutObj = setTimeout(() => {
			iTimer--;
			this.timeLeft = iTimer;
			this.timer.innerHTML = iTimer;
			if (iTimer == 0) {
				this.subScore();

			}
			else
				this.counter(iTimer);
		}, 1000);
	}



	this.subScore = function () {
		this.currentCard.fail();
		this.game();
		this.score = document.getElementById("score-res");
		this.scoreNum--;
		this.score.innerHTML = this.scoreNum;
		if (this.scoreNum >= 0)
			this.score.className = "good";
		else
			this.score.className = "not-good";
		if (this.scoreNum > 5)
			this.score.innerHTML += "   טוב מאוד";
		if (this.scoreNum > 10)
			this.score.innerHTML += "   אלופה!!!!";
		if (this.scoreNum > 20)
			this.score.innerHTML += "   וואו את יודעת הכל!!!!";
		if (this.scoreNum > 25)
			this.score.innerHTML += "    ניצחת את המחשב     ";

	}
	this.addScore = function () {
		this.currentCard.success();
		this.game();
		this.score = document.getElementById("score-res");
		this.scoreNum++;

		this.score.innerHTML = this.scoreNum;
		if (this.scoreNum > 5)
			this.score.innerHTML += "   טוב מאוד";
		if (this.scoreNum > 10)
			this.score.innerHTML += "   אלופה!!!!";
		if (this.scoreNum > 20)
			this.score.innerHTML += "   וואו את יודעת הכל!!!!";
		if (this.scoreNum > 25)
			this.score.innerHTML += "    ניצחת את המחשב     ";

		if (this.timeoutObj)
			clearTimeout(this.timeoutObj);



	}



}

var speech = {

	read: function (text) {

		const utterance = new SpeechSynthesisUtterance();
		var voices = speechSynthesis.getVoices();
		if (voices.length > 0)
		utterance.voice = voices[5];
		
		debugger;
		// Set the text to be spoken
		utterance.text = text;

		// Set the language to English
		utterance.lang = "en-US";

		// Call the speech synthesis API to speak the text
		window.speechSynthesis.speak(utterance);

	}

}

var gamePlay = new gameComponent();


