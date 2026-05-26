// jeg rakk ikke å genere eller legge til bakgrunnsbilder for hver scene, men jeg tror ikke det er det viktigste.
let mh = 0; // mental health poeng ting
const state = {
  elective: null,        // biologi eller arts
  studiedHealthy: false, // true hvis man valgte korrekt på studering scenen
};

const storyEl   = document.getElementById('story');
const choicesEl = document.getElementById('choices');
const restartBtn= document.getElementById('restart');
const scoreEl   = document.getElementById('score');
const bgEl      = document.getElementById('background');
const startBtn  = document.getElementById('startBtn');

function updateScore() {
  scoreEl.textContent = `MH: ${mh}`;
}


const story = {
  // scene 1 bussen
start: {
bg: '../bilder/bus.png',
  text: "(MH = Mental Health points) You wake up late for school. The bus is already gone.",
  options: [
    {
      label: "Call parents for a ride (mature)",
      next: "elective",
      mhChange: +1,
      feedback: "Your parents understand the situation and drive you to school.",
    },
    {
      label: "Walk to school (hide being late)",
      next: "elective",
      mhChange: 0,
      feedback: "You keep it to yourself and walk.",
    },
    {
      label: "Skip school (parents get angry)",
      next: "elective",
      mhChange: -1,
      feedback: "Skipping backfires. Parents get upset.",
    }
  ]
},


// scene 2 valgfag
  elective: {
  bg: '../bilder/apbioorarts.png',
    text: "You must choose an elective, but you are not completely sure of what to pick. You do know that you like drawing, though..",
    options: [
      {
        label: "Choose AP Biology", next: "study", mhChange: -1, set: { elective: 'ap' },
      feedback: "Might be better for the future, but this will make school much more harder, and is not what you REALLY wanted to do.",
    },
      {
        label: "Choose Arts",       next: "study", mhChange: +1, set: { elective: 'arts' },
      feedback: "You let your creativity run wild, without needing to stress about difficulty.",
    },
  ]
},

  // scene 3 studering
  study: {
  bg: '../bilder/studying.png',
    text: "A big test is coming. You try to study, but your thoughts spiral.",
    options: [
      { label: "Push through anyway",        next: "counselor", mhChange: -1, set: { studiedHealthy: false },
      feedback: "You push through the stress, but only end up more tired, while only remembering a bit of what you studied.",
    },
      { label: "Take a short break",         next: "counselor", mhChange: 0,  set: { studiedHealthy: false },
      feedback: "You take a short break, but getting back to studying again feels too overwhelming and stresses you more.",
    },
      { label: "Admit it is overwhelming",    next: "counselor", mhChange: +1, set: { studiedHealthy: true },
      feedback: "You admit it is overwhelming, so you decide to break it into smaller pieces to make it easier to study.",
    },
  ]
},

  // scene 4 rådgiver
  counselor: {
  bg: '../bilder/counselor.png',
    text: "(Counselor asks: So… have you thought about life after high school?) You do not really know, but you need to say something.",
    options: [
      { label: "Say something impressive", next: "test",  mhChange: -1,
      feedback: "You say you're going to become a surgeon or a lawyer. While impressive, it created much higher expectations.",
      },
      { label: "Be honest",                next: "test",  mhChange: +1,
      feedback: "You say that you really do not know, but you get reassured that it's completely normal not to know.",
      },
      { label: "Deflect with humor",       next: "test",  mhChange: 0,
      feedback: "You say that you want to become a professional sleeper, making the counselor laugh; you avoid the question for now.",
      },
    ]
  },

  // scene 5 test (ble forenklet siden jeg ikke orker å lage et helt ny ting bare for her)
  test: {
    bg: '../bilder/testpaper.png',
    // Bakgrunn byttes dynamisk i renderen basert på valg, så vi kan la bg være tom her
    text: "It's test day. Your earlier choices will influence how it feels.",
    options: [
      { label: "See your result", next: "testResult", mhChange: 0 }
    ]
  },

  // resultat tekst
  testResult: { text: "(result will appear here)",
  options: [ { label: "Continue", next: "ending", mhChange: 0 } ] },

  // slutt - baset på hvor mye mh poeng du har.
  ending: { text: "(ending text)", options: [] },
};


function showFeedback(forklaring, poeng, nextscene) {

  storyEl.innerHTML = `
    <div class="feedback">
      <p>${forklaring}</p>
      <span class="mh-poeng ${poeng > 0 ? 'positiv' : poeng < 0 ? 'negativ' : 'neutral'}">
        ${poeng > 0 ? `+${poeng}` : poeng} MH
      </span>
    </div>
  `;
  choicesEl.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'choice';
  btn.textContent = 'Next';
  btn.addEventListener('click', () => renderNode(nextscene));
  choicesEl.appendChild(btn);
}

function renderNode(id) {
  const node = story[id];

// bakgrunner per scene
  if (node && node.bg) {
    bgEl.style.backgroundImage = `url('${node.bg}')`;
  }

  // bilder basert på valg og sånt som jeg ikke rekker å legge til
  if (id === 'testResult') {
    const tookAP   = state.elective === 'ap';
    const healthy  = state.studiedHealthy;

    if (tookAP && healthy)   bgEl.style.backgroundImage = 'url("../bilder/testpaper.png")';
    if (tookAP && !healthy)  bgEl.style.backgroundImage = 'url("../bilder/testpaper.png")';
    if (!tookAP && healthy)  bgEl.style.backgroundImage = 'url("../bilder/testpaper.png")';
    if (!tookAP && !healthy) bgEl.style.backgroundImage = 'url("../bilder/testpaper.png")';

    // tekst basert på valg
    let resultText = '';
    let poeng = 0;
    if (tookAP && healthy) {
      resultText = "You handled the AP Biology test better than you thought you would. Good job.";
      poeng = +1;
    } else if (tookAP && !healthy) {
      resultText = "AP Biology felt extra heavy today. You feel that you did horribly.";
      poeng = -1;
    } else if (!tookAP && healthy) {
      resultText = "Your ideas flow better in the test after getting to study in a meaningful way. ";
      poeng = +1;
    } else {
      resultText = "It is hard to focus. You finish, but you are sure you could have done better.";
      poeng = -1;
    }
    mh += poeng;
    updateScore();
    storyEl.textContent = '';
    choicesEl.innerHTML = '';
    showFeedback(resultText, poeng, 'ending');
    return; 
  }

  // ending tekst bestemmes her
  if (id === 'ending') {
    let endingText = '';
    if (mh < -1) {
      endingText = "The school semester is finally over. It's raining, and you walk home home because you feel that you deserve it. (BAD ENDING)";
      bgEl.style.backgroundImage = "url('../bilder/badending.jpg')";
    } else if (mh >= 3) {
      endingText = "With a clear mind and the sun shining on your face, you walk into the bus. You look forward to the next semester. (GOOD ENDING)";
      bgEl.style.backgroundImage = "url('../bilder/goodending.jpg')";
    } else {
      endingText = "The school semester is over for now, and you still miss the bus back home. You are still figuring things out, and that is normal. (NEUTRAL ENDING)";
      bgEl.style.backgroundImage = "url('../bilder/bus.png')";
    }

    storyEl.textContent = endingText;
    choicesEl.innerHTML = '';
    restartBtn.hidden = false;
    return;
  }

  // noder
  storyEl.textContent = node.text;
  choicesEl.innerHTML = '';
  restartBtn.hidden = true;

  node.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      // oppdaterer mh og state først
      const poeng = typeof opt.mhChange === 'number' ? opt.mhChange : 0;
      if (poeng !== 0) {
        mh += poeng;
        updateScore();
      }
      if (opt.set) Object.assign(state, opt.set);

      // forklaringstekst
      if (opt.feedback) {
        showFeedback(opt.feedback, poeng, opt.next);
      } else {
        renderNode(opt.next);
      }
    });
    choicesEl.appendChild(btn);
  });
}

// 6) restart knapp
restartBtn.addEventListener('click', () => {
  mh = 0;
  state.elective = null;
  state.studiedHealthy = false;
  updateScore();
  renderNode('start');
});


updateScore();
startBtn.addEventListener('click', () => {
  document.getElementById('title')?.classList.add('hidden');
  startBtn.classList.add('hidden');

  // Start spillet
  renderNode('start');
});


