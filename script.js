const { createClient } = supabase;
const client = createClient('https://cfmyiiglxqwhenxpskcu.supabase.co', 'sb_publishable_AntdyCGLvy2sjFXEpzhP3w_g4nQm4Jc');

// Declarations
const landingpage       = document.getElementById("LandingPage");
const loginpage         = document.getElementById("LogIn");
const createaccountpage = document.getElementById("CreateAccount");
const mainmenu          = document.getElementById("MainMenu");
const solosetuppage     = document.getElementById("SoloSetup");
const solodisplaypage   = document.getElementById("SoloDisplay");
const form              = document.getElementById("signupform");

const pages = [landingpage, createaccountpage, loginpage, mainmenu, solosetuppage, solodisplaypage];

document.getElementById("adminnav1").addEventListener("click", () => setadminnav(0));
document.getElementById("adminnav2").addEventListener("click", () => setadminnav(1));
document.getElementById("adminnav3").addEventListener("click", () => setadminnav(2));
document.getElementById("adminnav4").addEventListener("click", () => setadminnav(3));
document.getElementById("adminnav5").addEventListener("click", () => setadminnav(4));
document.getElementById("adminnav6").addEventListener("click", () => setadminnav(5));

function setadminnav(pageIndex) {
  pages.forEach(p => { if (p) p.classList.add("hidden-section"); });
  if (pages[pageIndex]) pages[pageIndex].classList.remove("hidden-section");
}

document.getElementById("CreateAccountbtn").addEventListener("click", () => setadminnav(1));
document.getElementById("LogInbtn").addEventListener("click", () => setadminnav(2));
document.getElementById("solorevisionbtn").addEventListener("click", () => setadminnav(4));


// ─── MathLive virtual keyboard ───────────────────────────────────────────────

customElements.whenDefined('math-field').then(() => {
  document.addEventListener('focusin', (e) => {
    if (e.target.tagName !== 'MATH-FIELD') {
      window.mathVirtualKeyboard?.hide();
    }
  });
});

function attachVirtualKeyboard(field) {
  field.setAttribute('math-virtual-keyboard-policy', 'manual');
  // Show on focus
  field.addEventListener('focusin', () => window.mathVirtualKeyboard?.show());
  // MathLive fires this event when the user clicks the keyboard toggle icon
  field.addEventListener('math-virtual-keyboard-toggle', () => {
    if (window.mathVirtualKeyboard?.visible) {
      window.mathVirtualKeyboard.hide();
    } else {
      window.mathVirtualKeyboard?.show();
    }
  });
}


// ─── Stopwatch ───────────────────────────────────────────────────────────────

let stopwatchInterval = null;
let stopwatchStart = null;

function startStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchStart = Date.now();
  const display = document.getElementById('stopwatch');
  display.classList.remove('stopped');

  stopwatchInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - stopwatchStart) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    display.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  }, 500);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  document.getElementById('stopwatch').classList.add('stopped');
}


// ─── Sign Up ─────────────────────────────────────────────────────────────────

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const email    = document.querySelector('#CreateAccount input[placeholder="Email"]').value;
  const username = document.querySelector('#CreateAccount input[placeholder="Username (3 chars min)"]').value;
  const password = document.querySelector('#CreateAccount input[placeholder="Password (8 chars min)"]').value;
  const warn     = document.getElementById('authwarning');

  if (username.length < 3) { warn.textContent = 'Username must be at least 3 characters.'; return; }
  if (password.length < 8) { warn.textContent = 'Password must be at least 8 characters.'; return; }

  const { error } = await client.auth.signUp({ email, password, options: { data: { username } } });
  warn.textContent = error ? error.message : 'Account created! You may now Log In!';
});


// ─── Log In ──────────────────────────────────────────────────────────────────

document.getElementById("loginform").addEventListener('submit', async function(e) {
  e.preventDefault();
  const email    = document.querySelector('#LogIn input[placeholder="Email"]').value;
  const password = document.querySelector('#LogIn input[placeholder="Password"]').value;
  const warn     = document.getElementById('warning');

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    warn.textContent = error.message;
    warn.style.display = 'block';
  } else {
    document.getElementById('mainmenu-username').textContent = data.user.user_metadata.username;
    startPresence();
    setadminnav(3);
  }
});


// ─── Online Counter ───────────────────────────────────────────────────────────

function startPresence() {
  const room = client.channel('online-users');
  room
    .on('presence', { event: 'sync' }, () => {
      document.getElementById('online-count').textContent = Object.keys(room.presenceState()).length;
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await client.auth.getUser();
        await room.track({ user_id: user.id });
      }
    });
}


// ─── Topics ──────────────────────────────────────────────────────────────────

const topics = [
  { name: 'Algebraic Expressions', subtopics: ['Index Laws','Expanding Brackets','Factorising','Negative & Fractional Indices','Surds','Rationalising Denominators'] },
  { name: 'Quadratics', subtopics: ['Solving Quadratic Equations','Completing the Square','Functions','Quadratic Graphs','The Discriminant','Modelling with Quadratics'] },
  { name: 'Equations & Inequalities', subtopics: ['Linear Simultaneous Equations','Quadratic Simultaneous Equations','Simultaneous Equations on Graphs','Linear Inequalities','Quadratic Inequalities','Inequalities on Graphs','Regions'] },
  { name: 'Graphs & Transformations', subtopics: ['Cubic Graphs','Quartic Graphs','Reciprocal Graphs','Points of Intersection','Translating Graphs','Stretching Graphs','Transforming Graphs'] },
  { name: 'Straight Line Graphs', subtopics: ['y=mx+c','Equations of Straight Lines','Parallel & Perpendicular Straight Lines','Length & Area','Modelling with Straight Lines'] },
  { name: 'Circles', subtopics: ['Midpoints & Perpendicular Bisectors','Equation of a Circle','Intersections of Straight Lines & Circles','Use Tangent & Chord Properties','Circles & Triangles'] },
  { name: 'Algebraic Methods', subtopics: ['Algebraic Fractions','Dividing Polynomials','The Factor Theorem','Mathematical Proof','Methods of Proof'] },
  { name: 'The Binomial Expansion', subtopics: ["Pascal's Triangle",'Factorial Notation','The Binomial Expansion','Solving Binomial Problems','Binomial Estimation'] },
  { name: 'Trigonometric Ratios', subtopics: ['The Cosine Rule','The Sine Rule','Areas of Triangles','Solving Triangle Problems','Graphs of Sine, Cosine & Tangent','Transforming Trigonometric Graphs'] },
  { name: 'Trigonometric Identities & Equations', subtopics: ['Angles in all four quadrants','Exact values of Trigonometrical Ratios','Trigonometric Identities','Simple Trigonometric Equations','Harder Trigonometric Equations','Equations & Identities'] },
  { name: 'Vectors', subtopics: ['Vectors','Representing Vectors','Magnitude & Direction','Position Vectors','Solving Geometric Problems','Modelling with Vectors'] },
  { name: 'Differentiation', subtopics: ['Gradients of Curves','Finding the Derivative','Differentiating x^n','Differentiating Quadratics','Differentiating Functions with 2+ terms','Gradients, Tangents and Normal','Increasing and Decreasing Functions','Second Order Derivatives','Stationary Points','Sketching Gradient Functions','Modelling with Differentiation'] },
  { name: 'Integration', subtopics: ['Integrating x^n','Indefinite Integrals','Finding Functions','Definite Integrals','Areas under Curves','Areas under the x-axis','Areas between curves and lines'] },
  { name: 'Exponentials & Logarithms', subtopics: ['Exponential Functions','y=e^x','Exponential Modelling','Logarithms','Laws of Logarithms','Solving Equations using Logarithms','Working with natural logarithms','Logarithms and non-linear data'] },
];

function renderTopics() {
  const container = document.getElementById('topic-list');
  container.innerHTML = '';
  topics.forEach((topic, ti) => {
    const topicDiv = document.createElement('div');
    topicDiv.className = 'topic-item';
    const topicRow = document.createElement('div');
    topicRow.className = 'topic-row';
    const topicCheck = document.createElement('input');
    topicCheck.type = 'checkbox'; topicCheck.className = 'topic-check';
    topicCheck.dataset.topic = topic.name; topicCheck.checked = false;
    const arrow = document.createElement('span');
    arrow.className = 'topic-arrow'; arrow.textContent = '▸';
    const topicLabel = document.createElement('span');
    topicLabel.className = 'topic-name';
    topicLabel.textContent = `${ti + 1}. ${topic.name}`;
    topicRow.appendChild(topicCheck); topicRow.appendChild(arrow); topicRow.appendChild(topicLabel);
    topicDiv.appendChild(topicRow);
    const subList = document.createElement('div');
    subList.className = 'subtopic-list collapsed';
    topic.subtopics.forEach((sub, si) => {
      const subRow = document.createElement('div'); subRow.className = 'subtopic-row';
      const subCheck = document.createElement('input');
      subCheck.type = 'checkbox'; subCheck.className = 'subtopic-check';
      subCheck.dataset.subtopic = sub; subCheck.checked = false;
      const subLabel = document.createElement('span');
      subLabel.textContent = `${String.fromCharCode(97 + si)}. ${sub}`;
      subRow.appendChild(subCheck); subRow.appendChild(subLabel);
      subList.appendChild(subRow);
      subCheck.addEventListener('change', () => {
        const siblings = [...subList.querySelectorAll('.subtopic-check')];
        const n = siblings.filter(c => c.checked).length;
        topicCheck.checked = n === siblings.length;
        topicCheck.indeterminate = n > 0 && n < siblings.length;
      });
    });
    topicDiv.appendChild(subList); container.appendChild(topicDiv);
    topicCheck.addEventListener('change', () => {
      subList.querySelectorAll('.subtopic-check').forEach(c => c.checked = topicCheck.checked);
      topicCheck.indeterminate = false;
    });
    const toggleCollapse = () => {
      const collapsed = subList.classList.toggle('collapsed');
      arrow.textContent = collapsed ? '▸' : '▾';
    };
    arrow.addEventListener('click', toggleCollapse);
    topicLabel.addEventListener('click', toggleCollapse);
  });
}
renderTopics();


// ─── Answer normalisation ─────────────────────────────────────────────────────

function normalise(latex) {
  return (latex || '')
    .replace(/\s+/g, '')
    .replace(/\{(\w)\}/g, '$1')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .toLowerCase();
}


// ─── Solo Revision ────────────────────────────────────────────────────────────

document.getElementById('startrevisionbtn').addEventListener('click', async () => {
  const selectedTopics = [...document.querySelectorAll('.topic-check:checked')].map(el => el.dataset.topic);
  if (!selectedTopics.length) { alert('Please select at least one topic.'); return; }
  const { data, error } = await client.from('questions').select('*').in('topic', selectedTopics);
  if (error || !data.length) { alert('No questions found for selected topics.'); return; }
  loadQuestion(data[Math.floor(Math.random() * data.length)]);
  setadminnav(5);
});

document.getElementById('nextquestionbtn').addEventListener('click', async () => {
  const selectedTopics = [...document.querySelectorAll('.topic-check:checked')].map(el => el.dataset.topic);
  const { data, error } = await client.from('questions').select('*').in('topic', selectedTopics);
  if (!error && data.length) loadQuestion(data[Math.floor(Math.random() * data.length)]);
});

function renderLatex(element, latex) {
  try { katex.render(latex, element, { throwOnError: false }); }
  catch { element.textContent = latex; }
}

function loadQuestion(question) {
  const displayA  = document.getElementById('question-display-a');
  const displayB  = document.getElementById('question-display-b');
  const container = document.getElementById('answer-fields-container');
  const result    = document.getElementById('result');

  result.textContent = '';
  window.mathVirtualKeyboard?.hide();

  // Reset and start stopwatch
  document.getElementById('stopwatch').textContent = '0:00';
  startStopwatch();

  renderLatex(displayA, question.question_latex_a);

  if (question.question_latex_b) {
    renderLatex(displayB, question.question_latex_b);
    displayB.style.display = '';
  } else {
    displayB.innerHTML = '';
    displayB.style.display = 'none';
  }

  const answerFields = question.answer_fields || [{ label: 'Answer', value: question.answer_a }];
  container.innerHTML = '';

  answerFields.forEach((field, i) => {
    const group = document.createElement('div');
    group.className = 'answer-field-group';
    const label = document.createElement('div');
    label.className = 'math-input-label';
    label.textContent = field.label;
    const mf = document.createElement('math-field');
    mf.id = `answer-field-${i}`;
    attachVirtualKeyboard(mf);
    group.appendChild(label);
    group.appendChild(mf);
    container.appendChild(group);
  });

  document.getElementById('answerform').onsubmit = (e) => {
    e.preventDefault();
    stopStopwatch();

    const elapsed = stopwatchStart
      ? Math.floor((Date.now() - stopwatchStart) / 1000)
      : 0;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    const allCorrect = answerFields.every((field, i) => {
      const mf = document.getElementById(`answer-field-${i}`);
      return normalise(mf?.value || '') === normalise(field.value);
    });

    if (allCorrect) {
      result.textContent = `✓ Correct!  (${timeStr})`;
      result.style.color = 'lightgreen';
    } else {
      const answers = answerFields.map(f => `${f.label}: ${f.value}`).join('  |  ');
      result.textContent = `✗ Incorrect. Answers: ${answers}  (${timeStr})`;
      result.style.color = 'salmon';
    }
  };
}
