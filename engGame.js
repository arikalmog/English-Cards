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
		this.text = "???? ???????????? ????.  ???????? ???????? ??????????.";
		this.speechElement = document.getElementById("speech");
		//this.word.innerText = words[0];
		this.speech();
		recognition.lang = "en-US";
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
			_recstat.innerHTML = '??????????';
			console.log("start recording");
		}

		recognition.onspeechend = function () {
			_recstat.innerHTML = '????????????';
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
	this.words = [
		{ he: '??????', en: 'friend', category: '' },
		{ he: '????????', en: 'grade', category: '' },
		{ he: '??????', en: 'house', category: '' },
		{ he: '??????', en: 'new', category: '' },
		{ he: '?????? ?????? ', en: 'school', category: '' },
		{ he: '????????', en: 'teacher', category: '' },
		{ he: '??????', en: 'town', category: '' },
		{ he: '???????? ?????? ?????', en: 'where do you live?', category: '' },
		{ he: '?????? ???? ??...', en: 'I live in', category: '' },
		{ he: '??????????', en: 'bird', category: '' },
		{ he: '????', en: 'brother', category: '' },
		{ he: '????????????', en: 'english', category: '' },
		{ he: '??????????', en: 'family', category: '' },
		{ he: '????????', en: 'fly', category: '' },
		{ he: '??????????', en: 'lesson', category: '' },
		{ he: '????????, ??????', en: 'nice', category: '' },
		{ he: '????????', en: 'sister', category: '' },
		{ he: '????????, ??????????', en: 'talk', category: '' },
		{ he: '??????????', en: 'want', category: '' },
		{ he: '???? ?????? ???????', en: 'how old are you?', category: '' },
		{ he: '?????? ????..', en: 'I am ???  years old.', category: '' },
		{ he: '?????? ???????? ???????? ??????', en: 'I go to school', category: '' },
		{ he: '??????', en: 'board', category: '' },
		{ he: '??????', en: 'book', category: '' },
		{ he: '????????', en: 'chair', category: '' },
		{ he: '??????', en: 'ereaser', category: '' },
		{ he: '???????????? ??????', en: 'homework', category: '' },
		{ he: '?????????? ????????????', en: 'lunch', category: '' },
		{ he: '????????', en: 'need', category: '' },
		{ he: '??????????', en: 'notebook', category: '' },
		{ he: '????????', en: 'paper', category: '' },
		{ he: '????????????', en: 'pencil', category: '' },
		{ he: '????????', en: 'thanks', category: '' },
		{ he: '?????? ???? ?????', en: 'do you have', category: '' },
		{ he: '?????? ????...', en: 'I don???t have', category: '' },
		{ he: '???????? ??????....', en: "Let's go", category: '' },
		{ he: '??????????', en: 'address', category: '' },
		{ he: '????????', en: 'food', category: '' },
		{ he: '????, ????????', en: 'me', category: '' },
		{ he: '??????????', en: 'meet', category: '' },
		{ he: '???????? ??????????', en: 'phone number', category: '' },
		{ he: '??????????', en: 'please', category: '' },
		{ he: '??????????', en: 'pupil', category: '' },
		{ he: '??????????', en: 'see', category: '' },
		{ he: '????????', en: 'street', category: '' },
		{ he: '??????????', en: 'write', category: '' },
		{ he: '???? ??...  ???????', en: '', category: '' },
		{ he: '???? ????????...', en: '', category: '' },
		{ he: '????????????', en: 'art', category: '' },
		{ he: '????????', en: 'grade', category: '' },
		{ he: '????????', en: 'computer', category: '' },
		{ he: '??????', en: 'day', category: '' },
		{ he: '??????', en: 'happy', category: '' },
		{ he: '??????????', en: 'learn', category: '' },
		{ he: '??????????????', en: 'math', category: '' },
		{ he: '????????????', en: 'music', category: '' },
		{ he: '??????????', en: 'sport', category: '' },
		{ he: '????????', en: 'week', category: '' },

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
				this.gameCards.push(new card(i, w.en, w.he, w));


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
			this.score.innerHTML += "   ?????? ????????";
		if (this.scoreNum > 10)
			this.score.innerHTML += "   ??????????!!!!";
		if (this.scoreNum > 20)
			this.score.innerHTML += "   ???????? ???? ?????????? ??????!!!!";
		if (this.scoreNum > 25)
			this.score.innerHTML += "    ?????????? ???? ??????????     ";

	}
	this.addScore = function () {
		this.currentCard.success();
		this.game();
		this.score = document.getElementById("score-res");
		this.scoreNum++;

		this.score.innerHTML = this.scoreNum;
		if (this.scoreNum > 5)
			this.score.innerHTML += "   ?????? ????????";
		if (this.scoreNum > 10)
			this.score.innerHTML += "   ??????????!!!!";
		if (this.scoreNum > 20)
			this.score.innerHTML += "   ???????? ???? ?????????? ??????!!!!";
		if (this.scoreNum > 25)
			this.score.innerHTML += "    ?????????? ???? ??????????     ";

		if (this.timeoutObj)
			clearTimeout(this.timeoutObj);



	}



}

var gamePlay = new gameComponent();


