// ✅ Updated script.js with progress bar and localStorage support

const startBtn = document.querySelector('.start-btn');
const popInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const optionList = document.querySelector('.option-list');
const resultBox = document.querySelector('.result-box');
const finalScoreText = document.querySelector('.final-score');
const restartBtn = document.querySelector('.restart-btn');
const homeBtn = document.querySelector('.home-btn');
const timerCount = document.querySelector('.time-left');
const progressBar = document.querySelector('.progress-bar-fill');
const leaderboardList = document.querySelector('.leaderboard-list');
const shareBtn = document.querySelector('.share-btn');

let questionCount = 0;
let questionNum = 1;
let userScore = 0;
let counter;
let timeLeft = 15;

startBtn.onclick = () => {
    popInfo.classList.add('active');
    main.classList.add('active');
};

exitBtn.onclick = () => {
    popInfo.classList.remove('active');
    main.classList.remove('active');
};

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.style.display = 'block';
    resultBox.style.display = 'none';

    showQuestion(questionCount);
    questionNumber(questionNum);
    headerScore();
};

const nextBtn = document.querySelector('.next-btn');
nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        questionNum++;
        showQuestion(questionCount);
        questionNumber(questionNum);
    } else {
        showResult();
    }
};

function showQuestion(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    let optionTag = '';
    questions[index].options.forEach(option => {
        optionTag += `<div class="option"><span>${option}</span></div>`;
    });
    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    option.forEach(opt => opt.setAttribute('onclick', 'optionSelected(this)'));

    questionNumber(index + 1);
    startTimer(15);
    updateProgressBar();
}

function optionSelected(answer) {
    clearInterval(counter);

    let userAnswer = answer.textContent.trim();
    let correctAnswer = questions[questionCount].answer.trim();
    let allOptions = optionList.children;

    if (userAnswer === correctAnswer) {
        answer.classList.add('correct');
        userScore++;
        headerScore();
    } else {
        answer.classList.add('incorrect');
        for (let i = 0; i < allOptions.length; i++) {
            let optionText = allOptions[i].textContent.trim();
            if (optionText === correctAnswer) {
                allOptions[i].classList.add('correct');
            }
        }
    }

    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].classList.add('disabled');
    }

    nextBtn.classList.add('active');
}

function startTimer(seconds) {
    clearInterval(counter);
    timeLeft = seconds;
    timerCount.textContent = timeLeft;

    counter = setInterval(() => {
        timeLeft--;
        timerCount.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(counter);
            autoSelectCorrect();
        }
    }, 1000);
}

function autoSelectCorrect() {
    const correctAnswer = questions[questionCount].answer.trim();
    const allOptions = optionList.children;
    for (let i = 0; i < allOptions.length; i++) {
        let optionText = allOptions[i].textContent.trim();
        if (optionText === correctAnswer) {
            allOptions[i].classList.add('correct');
        }
        allOptions[i].classList.add('disabled');
    }
    nextBtn.classList.add('active');
}

function showResult() {
    quizBox.style.display = 'none';
    resultBox.style.display = 'block';
    finalScoreText.textContent = `Your Score: ${userScore} / ${questions.length}`;
    localStorage.setItem('lastQuizScore', `${userScore} / ${questions.length}`);
    clearInterval(counter);

    const name = prompt("Enter your name for the leaderboard:");
    if (name) {
        saveScore(name, userScore);
        displayLeaderboard();
        createShareButton(userScore);
    }
}

restartBtn.onclick = () => {
    questionCount = 0;
    userScore = 0;
    questionNum = 1;
    resultBox.style.display = 'none';
    quizBox.style.display = 'block';
    showQuestion(questionCount);
    questionNumber(questionNum);
    headerScore();
};

homeBtn.onclick = () => {
    window.location.reload();
};

function questionNumber(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function updateProgressBar() {
    if (progressBar) {
        const progress = ((questionCount + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function saveScore(name, score) {
    const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(scores.slice(0, 5)));
}

function displayLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardList.innerHTML = scores
        .map(entry => `<li>${entry.name} - ${entry.score}</li>`) 
        .join('');
}

function createShareButton(score) {
  const text = `I scored ${score} in Khushi's Quiz! Can you beat me? 🧠🔥`;

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
  document.querySelector('.share-btn-whatsapp').href = whatsappLink;

  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=${encodeURIComponent(text)}`;
  document.querySelector('.share-btn-facebook').href = facebookLink;

  const instaLink = `https://www.instagram.com/`;
  document.querySelector('.share-btn-instagram').href = instaLink;
}

// SECTION NAVIGATION (About, Service, Contact, Rules, Home)
const navLinks = document.querySelectorAll('.navbar a');
const infoSections = document.querySelectorAll('.info-section');
const homeSection = document.querySelector('.home');

// Hide all info sections initially
infoSections.forEach(section => section.style.display = 'none');
homeSection.style.display = 'flex'; // Show home by default

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Update nav active state
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // Hide all sections
    infoSections.forEach(sec => sec.style.display = 'none');
    homeSection.style.display = 'none';

    const targetId = this.getAttribute('href').replace('#', '');
    if (targetId === 'home') {
      homeSection.style.display = 'flex';
    } else {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
      }
    }
  });
});
