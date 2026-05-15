const { createClient } = supabase;
const client = createClient('https://cfmyiiglxqwhenxpskcu.supabase.co', 'sb_publishable_AntdyCGLvy2sjFXEpzhP3w_g4nQm4Jc');

// Declarations
const landingpage = document.getElementById("LandingPage");
const loginpage = document.getElementById("LogIn");
const createaccountpage = document.getElementById("CreateAccount");
const mainmenu = document.getElementById("MainMenu");
const solosetuppage = document.getElementById("SoloSetup");
const solodisplaypage = document.getElementById("SoloDisplay");
const form = document.getElementById("signupform");

const pages = [landingpage, createaccountpage, loginpage, mainmenu, solosetuppage, solodisplaypage];

// adminnav events
document.getElementById("adminnav1").addEventListener("click", () => setadminnav(0));
document.getElementById("adminnav2").addEventListener("click", () => setadminnav(1));
document.getElementById("adminnav3").addEventListener("click", () => setadminnav(2));
document.getElementById("adminnav4").addEventListener("click", () => setadminnav(3));
document.getElementById("adminnav5").addEventListener("click", () => setadminnav(4));
document.getElementById("adminnav6").addEventListener("click", () => setadminnav(5));

function setadminnav(pageIndex) {
  pages.forEach(page => {
    if (page) page.classList.add("hidden-section");
  });
  if (pages[pageIndex]) {
    pages[pageIndex].classList.remove("hidden-section");
  }
}

document.getElementById("CreateAccountbtn").addEventListener("click", () => setadminnav(1));
document.getElementById("LogInbtn").addEventListener("click", () => setadminnav(2));
document.getElementById("solorevisionbtn").addEventListener("click", () => setadminnav(4));


// ─── Sign Up ────────────────────────────────────────────────────────────────

form.addEventListener('submit', async function(event) {
  event.preventDefault()
  const email = document.querySelector('#CreateAccount input[placeholder="Email"]').value
  const username = document.querySelector('#CreateAccount input[placeholder="Username (3 chars min)"]').value
  const password = document.querySelector('#CreateAccount input[placeholder="Password (8 chars min)"]').value
  const authWarning = document.getElementById('authwarning')

  if (username.length < 3) { authWarning.textContent = 'Username must be at least 3 characters.'; return }
  if (password.length < 8) { authWarning.textContent = 'Password must be at least 8 characters.'; return }

  const { data, error } = await client.auth.signUp({
    email, password,
    options: { data: { username } }
  })
  authWarning.textContent = error ? error.message : 'Account created! You may now Log In!'
})


// ─── Log In ─────────────────────────────────────────────────────────────────

document.getElementById("loginform").addEventListener('submit', async function(event) {
  event.preventDefault()
  const email = document.querySelector('#LogIn input[placeholder="Email"]').value
  const password = document.querySelector('#LogIn input[placeholder="Password"]').value
  const warning = document.getElementById('warning')

  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error) {
    warning.textContent = error.message
    warning.style.display = 'block'
  } else {
    document.getElementById('mainmenu-username').textContent = data.user.user_metadata.username
    startPresence()
    setadminnav(3)
  }
})


// ─── Online Counter ──────────────────────────────────────────────────────────

function startPresence() {
  const room = client.channel('online-users')
  room
    .on('presence', { event: 'sync' }, () => {
      document.getElementById('online-count').textContent = Object.keys(room.presenceState()).length
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await client.auth.getUser()
        await room.track({ user_id: user.id })
      }
    })
}


// ─── Topics ──────────────────────────────────────────────────────────────────

const topics = [
  { name: 'Algebraic Expressions', subtopics: ['Index Laws', 'Expanding Brackets', 'Factorising', 'Negative & Fractional Indices', 'Surds', 'Rationalising Denominators'] },
  { name: 'Quadratics', subtopics: ['Solving Quadratic Equations', 'Completing the Square', 'Functions', 'Quadratic Graphs', 'The Discriminant', 'Modelling with Quadratics'] },
  { name: 'Equations & Inequalities', subtopics: ['Linear Simultaneous Equations', 'Quadratic Simultaneous Equations', 'Simultaneous Equations on Graphs', 'Linear Inequalities', 'Quadratic Inequalities', 'Inequalities on Graphs', 'Regions'] },
  { name: 'Graphs & Transformations', subtopics: ['Cubic Graphs', 'Quartic Graphs', 'Reciprocal Graphs', 'Points of Intersection', 'Translating Graphs', 'Stretching Graphs', 'Transforming Graphs'] },
  { name: 'Straight Line Graphs', subtopics: ['y=mx+c', 'Equations of Straight Lines', 'Parallel & Perpendicular Straight Lines', 'Length & Area', 'Modelling with Straight Lines'] },
  { name: 'Circles', subtopics: ['Midpoints & Perpendicular Bisectors', 'Equation of a Circle', 'Intersections of Straight Lines & Circles', 'Use Tangent & Chord Properties', 'Circles & Triangles'] },
  { name: 'Algebraic Methods', subtopics: ['Algebraic Fractions', 'Dividing Polynomials', 'The Factor Theorem', 'Mathematical Proof', 'Methods of Proof'] },
  { name: 'The Binomial Expansion', subtopics: ["Pascal's Triangle", 'Factorial Notation', 'The Binomial Expansion', 'Solving Binomial Problems', 'Binomial Estimation'] },
  { name: 'Trigonometric Ratios', subtopics: ['The Cosine Rule', 'The Sine Rule', 'Areas of Triangles', 'Solving Triangle Problems', 'Graphs of Sine, Cosine & Tangent', 'Transforming Trigonometric Graphs'] },
  { name: 'Trigonometric Identities & Equations', subtopics: ['Angles in all four quadrants', 'Exact values of Trigonometrical Ratios', 'Trigonometric Identities', 'Simple Trigonometric Equations', 'Harder Trigonometric Equations', 'Equations & Identities'] },
  { name: 'Vectors', subtopics: ['Vectors', 'Representing Vectors', 'Magnitude & Direction', 'Position Vectors', 'Solving Geometric Problems', 'Modelling with Vectors'] },
  { name: 'Differentiation', subtopics: ['Gradients of Curves', 'Finding the Derivative', 'Differentiating x^n', 'Differentiating Quadratics', 'Differentiating Functions with 2+ terms', 'Gradients, Tangents and Normal', 'Increasing and Decreasing Functions', 'Second Order Derivatives', 'Stationary Points', 'Sketching Gradient Functions', 'Modelling with Differentiation'] },
  { name: 'Integration', subtopics: ['Integrating x^n', 'Indefinite Integrals', 'Finding Functions', 'Definite Integrals', 'Areas under Curves', 'Areas under the x-axis', 'Areas between curves and lines'] },
  { name: 'Exponentials & Logarithms', subtopics: ['Exponential Functions', 'y=e^x', 'Exponential Modelling', 'Logarithms', 'Laws of Logarithms', 'Solving Equations using Logarithms', 'Working with natural logarithms', 'Logarithms and non-linear data'] },
]

function renderTopics() {
  const container = document.getElementById('topic-list')
  container.innerHTML = ''

  topics.forEach((topic, topicIndex) => {
    const topicDiv = document.createElement('div')
    topicDiv.className = 'topic-item'

    const topicRow = document.createElement('div')
    topicRow.className = 'topic-row'

    const topicCheck = document.createElement('input')
    topicCheck.type = 'checkbox'
    topicCheck.className = 'topic-check'
    topicCheck.dataset.topic = topic.name
    topicCheck.checked = true

    const arrow = document.createElement('span')
    arrow.className = 'topic-arrow'
    arrow.textContent = '▾'

    const topicLabel = document.createElement('span')
    topicLabel.className = 'topic-name'
    topicLabel.textContent = `${topicIndex + 1}. ${topic.name}`

    topicRow.appendChild(topicCheck)
    topicRow.appendChild(arrow)
    topicRow.appendChild(topicLabel)
    topicDiv.appendChild(topicRow)

    const subList = document.createElement('div')
    subList.className = 'subtopic-list'

    topic.subtopics.forEach((sub, subIndex) => {
      const subRow = document.createElement('div')
      subRow.className = 'subtopic-row'

      const subCheck = document.createElement('input')
      subCheck.type = 'checkbox'
      subCheck.className = 'subtopic-check'
      subCheck.dataset.subtopic = sub
      subCheck.dataset.parentTopic = topic.name
      subCheck.checked = true

      const subLabel = document.createElement('span')
      subLabel.textContent = `${String.fromCharCode(97 + subIndex)}. ${sub}`

      subRow.appendChild(subCheck)
      subRow.appendChild(subLabel)
      subList.appendChild(subRow)

      subCheck.addEventListener('change', () => {
        const siblings = [...subList.querySelectorAll('.subtopic-check')]
        const checkedCount = siblings.filter(c => c.checked).length
        topicCheck.checked = checkedCount === siblings.length
        topicCheck.indeterminate = checkedCount > 0 && checkedCount < siblings.length
      })
    })

    topicDiv.appendChild(subList)
    container.appendChild(topicDiv)

    topicCheck.addEventListener('change', () => {
      subList.querySelectorAll('.subtopic-check').forEach(c => c.checked = topicCheck.checked)
      topicCheck.indeterminate = false
    })

    const toggleCollapse = () => {
      const isNowCollapsed = subList.classList.toggle('collapsed')
      arrow.textContent = isNowCollapsed ? '▸' : '▾'
    }
    arrow.addEventListener('click', toggleCollapse)
    topicLabel.addEventListener('click', toggleCollapse)
  })
}

renderTopics()


// ─── Answer normalisation ────────────────────────────────────────────────────
// Strips formatting differences so x^{5} matches x^5 etc.

function normalise(latex) {
  return latex
    .replace(/\s+/g, '')               // remove all whitespace
    .replace(/\{(\w)\}/g, '$1')        // {x} → x  (single-char braces)
    .replace(/\\left\(/g, '(')         // \left( → (
    .replace(/\\right\)/g, ')')        // \right) → )
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\cdot/g, '\\cdot')      // keep as-is
    .replace(/\*/, '\\cdot')
    .toLowerCase()
}


// ─── Solo Revision ───────────────────────────────────────────────────────────

document.getElementById('startrevisionbtn').addEventListener('click', async () => {
  const selectedTopics = [...document.querySelectorAll('.topic-check:checked')].map(el => el.dataset.topic)
  if (selectedTopics.length === 0) { alert('Please select at least one topic.'); return }

  const { data, error } = await client.from('questions').select('*').in('topic', selectedTopics)
  if (error || !data.length) { alert('No questions found for selected topics.'); return }

  loadQuestion(data[Math.floor(Math.random() * data.length)])
  setadminnav(5)
})

document.getElementById('nextquestionbtn').addEventListener('click', async () => {
  const selectedTopics = [...document.querySelectorAll('.topic-check:checked')].map(el => el.dataset.topic)
  const { data, error } = await client.from('questions').select('*').in('topic', selectedTopics)
  if (!error && data.length) loadQuestion(data[Math.floor(Math.random() * data.length)])
})

function renderLatex(element, latex) {
  try { katex.render(latex, element, { throwOnError: false }) }
  catch { element.textContent = latex }
}

function loadQuestion(question) {
  const displayA = document.getElementById('question-display-a')
  const displayB = document.getElementById('question-display-b')
  const answerBContainer = document.getElementById('answer-b-container')
  const result = document.getElementById('result')
  const fieldA = document.getElementById('answer-a')
  const fieldB = document.getElementById('answer-b')

  result.textContent = ''
  fieldA.value = ''
  fieldB.value = ''

  renderLatex(displayA, question.question_latex_a)

  if (question.question_latex_b) {
    renderLatex(displayB, question.question_latex_b)
    answerBContainer.classList.remove('hidden-section')
    document.getElementById('label-a').textContent = 'Part a)'
  } else {
    displayB.innerHTML = ''
    answerBContainer.classList.add('hidden-section')
    document.getElementById('label-a').textContent = 'Answer'
  }

  document.getElementById('answerform').onsubmit = (e) => {
    e.preventDefault()

    const userA = normalise(fieldA.value)
    const userB = normalise(fieldB.value)
    const correctA = normalise(question.answer_a)
    const correctB = question.answer_b ? normalise(question.answer_b) : null

    const aCorrect = userA === correctA
    const bCorrect = !correctB || userB === correctB

    if (aCorrect && bCorrect) {
      result.textContent = '✓ Correct!'
      result.style.color = 'lightgreen'
    } else {
      result.textContent = `✗ Incorrect. Answer: ${question.answer_a}${question.answer_b ? ' / ' + question.answer_b : ''}`
      result.style.color = 'salmon'
    }
  }
}
