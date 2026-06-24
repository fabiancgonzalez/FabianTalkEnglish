const lessons = [
    {
        title: 'Connecting Ideas in IT',
        summary: 'Conectores y secuenciadores para explicar ideas con claridad en contexto técnico.',
        flashcards: [
            { english: 'First, I check my calendar for the day.', spanish: 'Primero, reviso mi calendario del día.', hint: 'Use this to start a sequence.', audio: 'First, I check my calendar for the day.' },
            { english: 'Then, I open the code editor.', spanish: 'Luego, abro el editor de código.', hint: 'Use this for the next step.', audio: 'Then, I open the code editor.' },
            { english: 'However, the project was very difficult.', spanish: 'Sin embargo, el proyecto fue muy difícil.', hint: 'Use it to show contrast.', audio: 'However, the project was very difficult.' }
        ],
        quiz: [
            { question: 'I want to learn a new programming language, but I do not have much free time.', prompt: 'Choose the connector that shows contrast.', options: ['so', 'but', 'first'], answer: 'but', explanation: 'Use but to show contrast between two ideas.' },
            { question: 'The client changed the requirements, ___ we have to rewrite the code.', prompt: 'Choose the connector that shows result.', options: ['so', 'because', 'however'], answer: 'so', explanation: 'Use so to show a consequence or result.' }
        ],
        match: [
            { stem: 'I like front-end development. I ___ enjoy working with databases.', options: ['also', 'then', 'but'], answer: 'also', explanation: 'Also adds an extra idea.' },
            { stem: 'I finished writing the code. ___, I sent it to the QA team for testing.', options: ['After that', 'But', 'Because'], answer: 'After that', explanation: 'After that shows the next step in a sequence.' }
        ],
        prompt: {
            english: 'Complete this paragraph using connectors: First / Then / After that / Finally.',
            spanish: 'Completa el párrafo con conectores para describir un proceso técnico.',
            hint: 'Example: First, I check the bug report. Then I reproduce the error. After that, I fix it. Finally, I test the solution.',
            model: 'First, I check the bug report. Then I reproduce the error. After that, I fix it and test the solution. Finally, I send the update to the team.'
        }
    },
    {
        title: 'Highlighting My IT Strengths',
        summary: 'Preposiciones y soft skills para describir experiencia profesional y fortalezas.',
        flashcards: [
            { english: 'I am responsible for maintaining the servers.', spanish: 'Soy responsable de mantener los servidores.', hint: 'Use responsible for + verb-ing.', audio: 'I am responsible for maintaining the servers.' },
            { english: 'I am good at writing clean Python code.', spanish: 'Soy bueno escribiendo código limpio en Python.', hint: 'Use good at + gerund.', audio: 'I am good at writing clean Python code.' },
            { english: 'I am a detail-oriented developer.', spanish: 'Soy un desarrollador detallista.', hint: 'A strong word for CVs and interviews.', audio: 'I am a detail-oriented developer.' }
        ],
        quiz: [
            { question: 'In my current job, I am responsible ___ maintaining the company servers.', prompt: 'Choose the correct preposition.', options: ['in', 'for', 'at'], answer: 'for', explanation: 'Responsible for is the correct pattern.' },
            { question: 'I practice a lot, so I am very good ___ writing clean Python code.', prompt: 'Choose the correct preposition.', options: ['at', 'for', 'in'], answer: 'at', explanation: 'Good at is the correct phrase.' }
        ],
        match: [
            { stem: 'I am a fast learner, ___ I can study the new company system quickly.', options: ['so', 'because', 'but'], answer: 'so', explanation: 'So shows the result of being a fast learner.' },
            { stem: 'I am a team player, ___ I communicate well with my colleagues.', options: ['because', 'after that', 'finally'], answer: 'because', explanation: 'Because introduces the reason.' }
        ],
        prompt: {
            english: 'Write 3 lines for a CV summary using responsible for, good at, and adaptable.',
            spanish: 'Escribe un resumen de CV corto con tus fortalezas técnicas y personales.',
            hint: 'Try to sound professional and clear.',
            model: 'I am responsible for managing databases. I am good at solving technical problems. I am adaptable and work well under pressure.'
        }
    },
    {
        title: 'Future Goals and Motivation',
        summary: 'Phrases para hablar de metas, motivación y desarrollo profesional futuro.',
        flashcards: [
            { english: 'I am looking forward to starting the new project.', spanish: 'Estoy deseando empezar el nuevo proyecto.', hint: 'Use looking forward to + noun/verb-ing.', audio: 'I am looking forward to starting the new project.' },
            { english: 'I would like to work with cloud technologies.', spanish: 'Me gustaría trabajar con tecnologías en la nube.', hint: 'Use would like to for polite goals.', audio: 'I would like to work with cloud technologies.' },
            { english: 'I am planning to learn Artificial Intelligence this year.', spanish: 'Estoy planeando aprender Inteligencia Artificial este año.', hint: 'Use planning to for a future plan.', audio: 'I am planning to learn Artificial Intelligence this year.' }
        ],
        quiz: [
            { question: 'I am looking ___ to starting the new project next week.', prompt: 'Complete the fixed expression.', options: ['for', 'forward', 'at'], answer: 'forward', explanation: 'The full phrase is looking forward to.' },
            { question: 'I am ___ to learn Artificial Intelligence this year.', prompt: 'Choose the correct verb form.', options: ['planning', 'looking', 'hoping'], answer: 'planning', explanation: 'Planning to describes a future intention.' }
        ],
        match: [
            { stem: 'I want to improve my English skills, ___ I can join international meetings.', options: ['so', 'but', 'first'], answer: 'so', explanation: 'So gives the consequence or goal.' },
            { stem: 'I am excited ___ the new project in your company.', options: ['about', 'for', 'in'], answer: 'about', explanation: 'Excited about is the correct phrase.' }
        ],
        prompt: {
            english: 'Write a follow-up email about your career goals.',
            spanish: 'Escribe un email breve sobre tus metas profesionales.',
            hint: 'Mention what you are planning to do and what you hope to achieve.',
            model: 'I am looking forward to this opportunity. I am planning to keep improving my English and technical skills. I hope to contribute to your team and grow professionally.'
        }
    },
    {
        title: 'Tech Stack and Work Methodology',
        summary: 'Vocabulario para describir herramientas, sistemas, despliegues y trabajo ágil.',
        flashcards: [
            { english: 'Our tech stack includes React and Node.js.', spanish: 'Nuestro stack tecnológico incluye React y Node.js.', hint: 'Tech stack means the tools a project uses.', audio: 'Our tech stack includes React and Node.js.' },
            { english: 'The front-end is what the client sees.', spanish: 'El front-end es lo que ve el cliente.', hint: 'Front-end = user interface.', audio: 'The front-end is what the client sees.' },
            { english: 'Deployment is moving the code to the live server.', spanish: 'Deployment es mover el código al servidor en producción.', hint: 'Use this when releasing a project.', audio: 'Deployment is moving the code to the live server.' }
        ],
        quiz: [
            { question: 'React is a very popular ___ used to build user interfaces quickly.', prompt: 'Choose the technical term.', options: ['framework', 'database', 'sprint'], answer: 'framework', explanation: 'React is commonly described as a framework or library in beginner materials.' },
            { question: 'Moving the final code from our computers to the live server is called ___.', prompt: 'Choose the correct term.', options: ['deployment', 'debugging', 'version control'], answer: 'deployment', explanation: 'Deployment means publishing the final version.' }
        ],
        match: [
            { stem: 'Version control systems like Git ___ the whole team to code safely.', options: ['allow', 'deploy', 'debug'], answer: 'allow', explanation: 'Allow fits with the plural subject.' },
            { stem: 'We store all the financial records ___ a safe and organized database.', options: ['in', 'for', 'about'], answer: 'in', explanation: 'Use in with database storage.' }
        ],
        prompt: {
            english: 'Describe your ideal tech stack in 3 short sentences.',
            spanish: 'Describe tu stack tecnológico ideal en 3 oraciones.',
            hint: 'Mention front-end, back-end, database, or methodology.',
            model: 'My ideal tech stack includes React on the front-end, Node.js on the back-end, and a secure database. I prefer Agile methodology with short sprints. I also use Git for version control and frequent deployment.'
        }
    },
    {
        title: 'Sentence Building in IT',
        summary: 'Orden de palabras, conectores y estructura clara para frases profesionales.',
        flashcards: [
            { english: 'First, I open my laptop and check my emails.', spanish: 'Primero, abro mi portátil y reviso mis correos.', hint: 'First comes at the beginning.', audio: 'First, I open my laptop and check my emails.' },
            { english: 'I write the code and my colleague tests it.', spanish: 'Escribo el código y mi colega lo prueba.', hint: 'And joins two related actions.', audio: 'I write the code and my colleague tests it.' },
            { english: 'Finally, I log my hours and close my laptop.', spanish: 'Finalmente, registro mis horas y cierro mi portátil.', hint: 'Finally ends the sequence.', audio: 'Finally, I log my hours and close my laptop.' }
        ],
        quiz: [
            { question: 'Which sentence is correct?', prompt: 'Choose the correct word order.', options: ['I use SQL everyday in my job.', 'I everyday use SQL in my job.', 'Use I SQL everyday in my job.'], answer: 'I use SQL everyday in my job.', explanation: 'The subject comes before the verb, and the adverb follows the verb phrase.' },
            { question: 'Which sentence is correct?', prompt: 'Choose the correct word order.', options: ['My main goal to become is a senior developer.', 'My main goal is to become a senior developer.', 'To become a senior developer is my main goal.'], answer: 'My main goal is to become a senior developer.', explanation: 'This is the most natural order for the sentence.' }
        ],
        match: [
            { stem: 'I use Agile ___ it is very adaptable.', options: ['because', 'so', 'but'], answer: 'because', explanation: 'Because introduces the reason.' },
            { stem: 'I write the code ___ my colleague tests it.', options: ['and', 'but', 'so'], answer: 'and', explanation: 'And joins two actions in sequence.' }
        ],
        prompt: {
            english: 'Rewrite this idea in correct English: "Today work I on the front-end".',
            spanish: 'Corrige la frase y explica por qué el orden importa.',
            hint: 'Try to write the corrected sentence and then compare it with a model answer.',
            model: 'Today I am working on the front-end. The subject comes before the verb, and the verb phrase needs the correct tense.'
        }
    },
    {
        title: 'LinkedIn Profile',
        summary: 'Frases útiles para un perfil profesional claro y convincente.',
        flashcards: [
            { english: 'I have 20 years of experience.', spanish: 'Tengo 20 años de experiencia.', hint: 'Useful in a CV or LinkedIn summary.', audio: 'I have 20 years of experience.' },
            { english: 'I am looking for a remote job abroad.', spanish: 'Estoy buscando un trabajo remoto en el extranjero.', hint: 'Use this for job searching.', audio: 'I am looking for a remote job abroad.' },
            { english: 'Please contact me for more information.', spanish: 'Por favor contáctame para más información.', hint: 'A polite closing phrase.', audio: 'Please contact me for more information.' }
        ],
        quiz: [
            { question: 'Which sentence is correct?', prompt: 'Choose the best LinkedIn sentence.', options: ['I have an intermediate level of English.', 'I have English an intermediate level.', 'I an intermediate level of English have.'], answer: 'I have an intermediate level of English.', explanation: 'This is the natural and correct order.' },
            { question: 'Which sentence is correct?', prompt: 'Choose the best closing line.', options: ['Please for more information contact me.', 'Please contact me for more information.', 'Contact me please more information for.'], answer: 'Please contact me for more information.', explanation: 'This is the correct and professional wording.' }
        ],
        match: [
            { stem: 'I am looking forward ___ new challenges.', options: ['to', 'for', 'about'], answer: 'to', explanation: 'The phrase is looking forward to.' },
            { stem: 'I am excited ___ your new project.', options: ['about', 'for', 'in'], answer: 'about', explanation: 'Excited about is the correct collocation.' }
        ],
        prompt: {
            english: 'Write a short LinkedIn summary using experience, skills, and a goal.',
            spanish: 'Escribe un resumen corto para LinkedIn con experiencia, habilidades y objetivo.',
            hint: 'Keep it professional and direct.',
            model: 'I am a developer with 20 years of experience. I am responsible for databases, good at problem solving, and looking forward to new challenges in an international team.'
        }
    },
    {
        title: 'Daily Updates and Full-Stack Tasks',
        summary: 'Vocabulario para reportar progreso diario, bloqueos y tareas en equipo.',
        flashcards: [
            { english: 'Yesterday, I fixed a critical bug.', spanish: 'Ayer, arreglé un error crítico.', hint: 'Use fixed for completed past actions.', audio: 'Yesterday, I fixed a critical bug.' },
            { english: 'Today, I am working on the front-end.', spanish: 'Hoy, estoy trabajando en el front-end.', hint: 'Use am working for the present continuous.', audio: 'Today, I am working on the front-end.' },
            { english: 'I have a blocker because the API is not responding.', spanish: 'Tengo un bloqueo porque la API no responde.', hint: 'Blocker is common in stand-up updates.', audio: 'I have a blocker because the API is not responding.' }
        ],
        quiz: [
            { question: 'Yesterday, I ___ a critical bug.', prompt: 'Choose the correct past tense verb.', options: ['fix', 'fixed', 'fixing'], answer: 'fixed', explanation: 'Use the past tense for yesterday.' },
            { question: 'Today, I need to review a pull ___.', prompt: 'Complete the common IT phrase.', options: ['request', 'code', 'ticket'], answer: 'request', explanation: 'The correct phrase is pull request.' }
        ],
        match: [
            { stem: 'I do not have ___ blockers today.', options: ['any', 'some', 'a'], answer: 'any', explanation: 'Use any in negative statements.' },
            { stem: 'I need help ___ the QA team.', options: ['from', 'of', 'to'], answer: 'from', explanation: 'The phrase is help from someone.' }
        ],
        prompt: {
            english: 'Write a Slack update with Yesterday / Today / Blockers.',
            spanish: 'Escribe una actualización de Slack con Yesterday / Today / Blockers.',
            hint: 'Keep it short and realistic.',
            model: 'Yesterday I fixed a bug and reviewed a pull request. Today I am working on the front-end. Blockers: I need help from the QA team because the API is not responding.'
        }
    },
    {
        title: 'A Day in the Life of an IT Professional',
        summary: 'Rutina diaria con conectores, collocations y secuencias de trabajo técnico.',
        flashcards: [
            { english: 'First, I turn on my computer and check the server status.', spanish: 'Primero, enciendo mi computadora y reviso el estado del servidor.', hint: 'Start with First when describing your routine.', audio: 'First, I turn on my computer and check the server status.' },
            { english: 'Then, I reply to urgent messages in the team chat.', spanish: 'Luego, respondo mensajes urgentes en el chat del equipo.', hint: 'Then introduces the next step.', audio: 'Then, I reply to urgent messages in the team chat.' },
            { english: 'Finally, I log my tasks and close my laptop at 6:00 PM.', spanish: 'Finalmente, registro mis tareas y cierro mi portátil a las 6:00 PM.', hint: 'Finally ends the routine.', audio: 'Finally, I log my tasks and close my laptop at 6:00 PM.' }
        ],
        quiz: [
            { question: 'My day as an IT professional usually starts early. ___, I turn on my computer.', prompt: 'Choose the connector that starts a sequence.', options: ['First', 'However', 'Because'], answer: 'First', explanation: 'First is the correct connector for the beginning of a routine.' },
            { question: 'I write code ___ I test new features before finishing.', prompt: 'Choose the connector that adds another action.', options: ['and', 'but', 'so'], answer: 'and', explanation: 'And connects two related actions.' },
            { question: 'The project had a tight deadline, ___ we worked very focused today.', prompt: 'Choose the connector that shows result.', options: ['so', 'but', 'after that'], answer: 'so', explanation: 'So shows a consequence of the deadline.' }
        ],
        match: [
            { stem: 'I take a short break, ___ I review the documentation.', options: ['then', 'because', 'finally'], answer: 'then', explanation: 'Then shows the next step in the routine.' },
            { stem: 'I enjoy programming, ___ debugging old code can be frustrating.', options: ['but', 'so', 'also'], answer: 'but', explanation: 'But shows a contrast.' },
            { stem: 'I update the team board ___ my progress.', options: ['with', 'for', 'about'], answer: 'with', explanation: 'With is the correct preposition in this collocation.' }
        ],
        prompt: {
            english: 'Describe your work day using First, Then, After that, and Finally.',
            spanish: 'Describe tu jornada laboral usando First, Then, After that y Finally.',
            hint: 'Mention at least four actions in order.',
            model: 'First, I check my emails. Then I read the support messages. After that, I work on my main task. Finally, I log my progress and close my laptop.'
        }
    },
    {
        title: 'Past Problems and Solutions',
        summary: 'Uso de conectores para narrar problemas técnicos del pasado y cómo se resolvieron.',
        flashcards: [
            { english: 'The server crashed because there was a hardware problem.', spanish: 'El servidor se cayó porque hubo un problema de hardware.', hint: 'Because introduces the reason.', audio: 'The server crashed because there was a hardware problem.' },
            { english: 'However, the team solved it quickly.', spanish: 'Sin embargo, el equipo lo solucionó rápidamente.', hint: 'However shows contrast with the problem.', audio: 'However, the team solved it quickly.' },
            { english: 'After that, we installed a new backup system.', spanish: 'Después de eso, instalamos un nuevo sistema de respaldo.', hint: 'After that shows the next action after a problem.', audio: 'After that, we installed a new backup system.' }
        ],
        quiz: [
            { question: 'The client changed the requirements, ___ we had to rewrite the code.', prompt: 'Choose the connector that shows result.', options: ['so', 'because', 'however'], answer: 'so', explanation: 'So shows the consequence of the change.' },
            { question: 'I like front-end development. I ___ enjoy working with databases.', prompt: 'Choose the connector that adds more information.', options: ['also', 'first', 'but'], answer: 'also', explanation: 'Also adds another related idea.' },
            { question: 'The system was very slow, ___ we restarted the servers.', prompt: 'Choose the connector that links problem and solution.', options: ['so', 'because', 'finally'], answer: 'so', explanation: 'So links the problem to the action taken.' }
        ],
        match: [
            { stem: 'The deadline was very tight, ___ we worked extra hours.', options: ['so', 'but', 'after that'], answer: 'so', explanation: 'So shows the result of the tight deadline.' },
            { stem: 'One day, the main server crashed ___ there was a hardware problem.', options: ['because', 'but', 'finally'], answer: 'because', explanation: 'Because introduces the reason for the crash.' },
            { stem: 'We recovered the data. ___, we installed a new backup system.', options: ['After that', 'However', 'First'], answer: 'After that', explanation: 'After that shows the next step after the recovery.' }
        ],
        prompt: {
            english: 'Write 3 sentences about a technical problem and the solution.',
            spanish: 'Escribe 3 oraciones sobre un problema técnico y su solución.',
            hint: 'Use because, however, so, or after that.',
            model: 'The server crashed because of a hardware problem. However, the team solved it quickly. After that, we installed a backup system.'
        }
    },
    {
        title: 'Surviving the Daily Stand-up',
        summary: 'Preguntas del daily stand-up, tiempos verbales y bloqueos de trabajo.',
        flashcards: [
            { english: 'Yesterday, I fixed a critical bug in the back-end.', spanish: 'Ayer, arreglé un error crítico en el back-end.', hint: 'Use past tense for yesterday.', audio: 'Yesterday, I fixed a critical bug in the back-end.' },
            { english: 'Today, I am working on the front-end.', spanish: 'Hoy, estoy trabajando en el front-end.', hint: 'Use am working on for today.', audio: 'Today, I am working on the front-end.' },
            { english: 'I have a blocker because the main API is not responding.', spanish: 'Tengo un bloqueo porque la API principal no responde.', hint: 'Blocker = something stopping your work.', audio: 'I have a blocker because the main API is not responding.' }
        ],
        quiz: [
            { question: 'The daily stand-up meeting is very ___.', prompt: 'Choose the correct description.', options: ['short', 'long', 'late'], answer: 'short', explanation: 'The stand-up is meant to be brief and focused.' },
            { question: 'Today, I ___ on the front-end.', prompt: 'Choose the correct verb form.', options: ['am working', 'work', 'worked'], answer: 'am working', explanation: 'Use the present continuous for something happening today.' },
            { question: 'A blocker is a problem that ___ my work.', prompt: 'Choose the best verb.', options: ['stops', 'starts', 'finishes'], answer: 'stops', explanation: 'A blocker stops progress until it is resolved.' }
        ],
        match: [
            { stem: 'Yesterday, I ___ a critical bug.', options: ['fixed', 'will fix', 'am fixing'], answer: 'fixed', explanation: 'Yesterday requires the past tense.' },
            { stem: 'Today, I will ___ the new login page.', options: ['design', 'designed', 'designing'], answer: 'design', explanation: 'Will takes the base verb form.' },
            { stem: 'I need help ___ the senior architect.', options: ['from', 'for', 'at'], answer: 'from', explanation: 'The correct phrase is need help from someone.' }
        ],
        prompt: {
            english: 'Give a 3-sentence daily stand-up update.',
            spanish: 'Da una actualización de daily stand-up en 3 oraciones.',
            hint: 'Include Yesterday, Today, and Blockers.',
            model: 'Yesterday, I fixed a bug and updated the database. Today, I am working on the front-end. Blockers: the API is not responding, so I need help from the senior architect.'
        }
    },
    {
        title: 'Asynchronous Review',
        summary: 'Repaso mixto de vocabulario IT, errores comunes y perfil profesional.',
        flashcards: [
            { english: 'I am adaptable and a fast learner.', spanish: 'Soy adaptable y aprendo rápido.', hint: 'Soft skills for interviews.', audio: 'I am adaptable and a fast learner.' },
            { english: 'I can contribute to a larger development team.', spanish: 'Puedo contribuir a un equipo de desarrollo más grande.', hint: 'Use contribute to when talking about value.', audio: 'I can contribute to a larger development team.' },
            { english: 'I use a debugging tool to find errors.', spanish: 'Uso una herramienta de depuración para encontrar errores.', hint: 'Debugging tools help you locate problems.', audio: 'I use a debugging tool to find errors.' }
        ],
        quiz: [
            { question: 'I am looking ___ to a new professional challenge.', prompt: 'Complete the future phrase.', options: ['forward', 'for', 'about'], answer: 'forward', explanation: 'The full expression is looking forward to.' },
            { question: 'I have an intermediate ___ of English.', prompt: 'Choose the missing word.', options: ['level', 'stack', 'pressure'], answer: 'level', explanation: 'The natural phrase is intermediate level of English.' },
            { question: 'I prefer working on the back-end ___ I like servers and logic.', prompt: 'Choose the connector.', options: ['because', 'but', 'so'], answer: 'because', explanation: 'Because introduces the reason for the preference.' }
        ],
        match: [
            { stem: 'Please contact me ___ more information.', options: ['for', 'to', 'with'], answer: 'for', explanation: 'The polite phrase is contact me for more information.' },
            { stem: 'I consider myself a problem ___.', options: ['solver', 'learner', 'player'], answer: 'solver', explanation: 'The correct phrase is problem solver.' },
            { stem: 'I have a blocker ___ the server is down.', options: ['because', 'but', 'so'], answer: 'because', explanation: 'Because explains the reason for the blocker.' }
        ],
        prompt: {
            english: 'Write a short professional profile with skills, experience, and one goal.',
            spanish: 'Escribe un perfil profesional corto con habilidades, experiencia y una meta.',
            hint: 'Try to include responsible for, good at, and looking forward to.',
            model: 'I am an IT professional with 20 years of experience. I am responsible for the database and good at solving technical problems. I am looking forward to new challenges and I want to contribute to a strong team.'
        }
    }
];

const flashcardEnglish = document.getElementById('flashcardEnglish');
const flashcardSpanish = document.getElementById('flashcardSpanish');
const flashcardHint = document.getElementById('flashcardHint');
const flashcardFeedback = document.getElementById('flashcardFeedback');
const speakFlashcardBtn = document.getElementById('speakFlashcard');
const revealFlashcardBtn = document.getElementById('revealFlashcard');
const nextFlashcardBtn = document.getElementById('nextFlashcard');
const quizQuestion = document.getElementById('quizQuestion');
const quizPrompt = document.getElementById('quizPrompt');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const nextQuizBtn = document.getElementById('nextQuizBtn');
const builderOutput = document.getElementById('builderOutput');
const wordBank = document.getElementById('wordBank');
const checkSentenceBtn = document.getElementById('checkSentence');
const clearSentenceBtn = document.getElementById('clearSentence');
const nextMatchBtn = document.getElementById('nextMatchBtn');
const builderFeedback = document.getElementById('builderFeedback');
const promptEnglish = document.getElementById('promptEnglish');
const promptSpanish = document.getElementById('promptSpanish');
const promptHint = document.getElementById('promptHint');
const studentAnswer = document.getElementById('studentAnswer');
const checkAnswerBtn = document.getElementById('checkAnswer');
const showModelAnswerBtn = document.getElementById('showModelAnswer');
const nextPromptBtn = document.getElementById('nextPrompt');
const answerFeedback = document.getElementById('answerFeedback');
const progressLabel = document.getElementById('progressLabel');
const scoreLabel = document.getElementById('scoreLabel');
const streakLabel = document.getElementById('streakLabel');
const progressBar = document.getElementById('progressBar');
const lessonSelect = document.getElementById('lessonSelect');
const lessonSummary = document.getElementById('lessonSummary');
const flashcardTitle = document.getElementById('flashcardTitle');
const quizTitle = document.getElementById('quizTitle');
const builderTitle = document.getElementById('builderTitle');
const promptTitle = document.getElementById('promptTitle');
const thanksCard = document.getElementById('thanksCard');
const thanksToggle = document.getElementById('thanksToggle');

let currentLessonIndex = 0;
let currentFlashcardIndex = 0;
let currentQuizIndex = 0;
let currentMatchIndex = 0;
let currentPromptIndex = 0;
let flashcardRevealed = false;
let score = 0;
let streak = 0;
let lessonSolvedCount = 0;
let matchedChoice = '';
let lessonState = null;
let currentQuizAnswered = false;
let currentMatchAnswered = false;
let currentQuizSelection = null;
let currentMatchSelection = null;

function shuffleArray(values) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
}

function getLesson() {
    return lessons[currentLessonIndex];
}

function initLessonState() {
    const lesson = getLesson();
    lessonState = {
        quizSolved: new Set(),
        quizWrong: new Map(),
        matchSolved: new Set(),
        matchWrong: new Map(),
        promptSolved: false,
        quizOrder: lesson.quiz.map((_, index) => index),
        matchOrder: lesson.match.map((_, index) => index)
    };
    currentFlashcardIndex = 0;
    currentQuizIndex = 0;
    currentMatchIndex = 0;
    currentPromptIndex = 0;
    flashcardRevealed = false;
    matchedChoice = '';
    lessonSolvedCount = 0;
    currentQuizAnswered = false;
    currentMatchAnswered = false;
    currentQuizSelection = null;
    currentMatchSelection = null;
}

function setFeedback(element, message, success = false) {
    element.textContent = message;
    element.style.color = success ? '#166534' : '#334155';
}

function buildDetailedFeedback(lesson, item, selection, isCorrect, type) {
    if (type === 'quiz') {
        if (isCorrect) {
            return [
                'Correct.',
                `You chose "${selection}" and that matches the target answer.`,
                item.explanation,
                `Use this pattern when you see: ${item.prompt}`
            ].join(' ');
        }
        return [
            'Not quite.',
            `You chose "${selection}" but the correct answer is "${item.answer}".`,
            item.explanation,
            `Tip: focus on the clue in the sentence: ${item.question}`
        ].join(' ');
    }

    if (type === 'match') {
        if (isCorrect) {
            return [
                'Correct match.',
                `"${selection}" fits the sentence stem.`,
                item.explanation,
                `This is the kind of connector or phrase you need for: ${item.stem}`
            ].join(' ');
        }
        return [
            'Almost there.',
            `"${selection}" is not the best fit for this stem.`,
            `Correct answer: "${item.answer}".`,
            item.explanation
        ].join(' ');
    }

    if (type === 'prompt') {
        return [
            `Model answer: ${item.model}`,
            `Your response has ${selection} words.`,
            `Try to include the key idea from: ${item.english}`,
            `Helpful cue: ${item.hint}`
        ].join(' ');
    }

    if (type === 'flashcard') {
        return [
            `Meaning: ${item.spanish}`,
            `Use it when: ${item.hint}`,
            `Example: ${item.english}`
        ].join(' ');
    }

    return item.explanation || item.hint || 'Review the example and try again.';
}

function updateProgress() {
    const lesson = getLesson();
    const total = lesson.quiz.length + lesson.match.length + 1;
    const completed = lessonState.quizSolved.size + lessonState.matchSolved.size + (lessonState.promptSolved ? 1 : 0);
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    lessonSolvedCount = completed;
    progressLabel.textContent = `${progress}%`;
    progressBar.style.width = `${progress}%`;
    scoreLabel.textContent = String(score);
    streakLabel.textContent = String(streak);
    lessonSummary.textContent = `${lesson.summary} · ${completed}/${total} actividades completadas`;
}

function markSuccess() {
    score += 1;
    streak += 1;
    updateProgress();
}

function markMiss() {
    streak = 0;
    updateProgress();
}

function speakText(text) {
    if (!window.speechSynthesis) {
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

function renderFlashcard() {
    const card = getLesson().flashcards[currentFlashcardIndex];
    flashcardEnglish.textContent = card.english;
    flashcardSpanish.textContent = flashcardRevealed ? card.spanish : 'Translation hidden until you reveal it.';
    flashcardHint.textContent = card.hint;
    revealFlashcardBtn.textContent = flashcardRevealed ? 'Ocultar traducción' : 'Mostrar traducción';
    flashcardFeedback.textContent = buildDetailedFeedback(getLesson(), card, '', false, 'flashcard');
}

function renderQuiz() {
    const lesson = getLesson();
    const itemIndex = currentQuizIndex;
    const item = lesson.quiz[itemIndex];
    if (!item) {
        quizQuestion.textContent = 'No more quiz items in this lesson.';
        quizPrompt.textContent = '';
        quizOptions.innerHTML = '';
        quizFeedback.textContent = 'Lección completada.';
        nextQuizBtn.style.display = 'none';
        return;
    }

    if (lessonState.quizSolved.has(itemIndex)) {
        const nextIndex = lesson.quiz.findIndex((_, index) => !lessonState.quizSolved.has(index));
        if (nextIndex === -1) {
            quizQuestion.textContent = 'Lección completada.';
            quizPrompt.textContent = 'Has resuelto todas las preguntas de esta lección.';
            quizOptions.innerHTML = '';
            quizFeedback.textContent = 'Puedes cambiar de lección o repasar los ejemplos.';
            nextQuizBtn.style.display = 'none';
            return;
        }
        currentQuizIndex = nextIndex;
        currentQuizAnswered = false;
        currentQuizSelection = null;
        renderQuiz();
        return;
    }

    quizQuestion.textContent = item.question;
    quizPrompt.textContent = item.prompt;
    
    if (!currentQuizAnswered) {
        quizFeedback.textContent = 'Responde para ver la explicación.';
        nextQuizBtn.style.display = 'none';
    } else {
        nextQuizBtn.style.display = 'inline-block';
    }
    
    quizOptions.innerHTML = '';

    for (const option of item.options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.textContent = option;
        const wrongSet = lessonState.quizWrong.get(itemIndex) || new Set();
        if (wrongSet.has(option)) {
            button.disabled = true;
        }
        if (currentQuizAnswered && currentQuizSelection === option) {
            if (option === item.answer) {
                button.classList.add('correct');
            } else {
                button.classList.add('wrong');
            }
            button.disabled = true;
        }
        if (currentQuizAnswered) {
            if (option === item.answer) {
                button.classList.add('correct');
                button.disabled = true;
            }
            if (wrongSet.has(option)) {
                button.disabled = true;
            }
        }
        button.addEventListener('click', () => {
            if (currentQuizAnswered || lessonState.quizSolved.has(itemIndex)) {
                return;
            }
            if (option === item.answer) {
                lessonState.quizSolved.add(itemIndex);
                currentQuizSelection = option;
                currentQuizAnswered = true;
                setFeedback(quizFeedback, buildDetailedFeedback(lesson, item, option, true, 'quiz'), true);
                markSuccess();
                renderQuiz();
                return;
            }
            const wrongSetNext = lessonState.quizWrong.get(itemIndex) || new Set();
            wrongSetNext.add(option);
            lessonState.quizWrong.set(itemIndex, wrongSetNext);
            currentQuizSelection = option;
            currentQuizAnswered = true;
            setFeedback(quizFeedback, buildDetailedFeedback(lesson, item, option, false, 'quiz'));
            markMiss();
            renderQuiz();
        });
        quizOptions.appendChild(button);
    }
}

function nextQuiz() {
    const nextIndex = getLesson().quiz.findIndex((_, index) => !lessonState.quizSolved.has(index));
    if (nextIndex !== -1) {
        currentQuizIndex = nextIndex;
    }
    currentQuizAnswered = false;
    currentQuizSelection = null;
    renderQuiz();
}

function renderMatch() {
    const lesson = getLesson();
    const itemIndex = currentMatchIndex;
    const item = lesson.match[itemIndex];
    if (!item) {
        builderOutput.textContent = 'No more matching items in this lesson.';
        wordBank.innerHTML = '';
        builderFeedback.textContent = 'Lección completada.';
        checkSentenceBtn.style.display = 'none';
        clearSentenceBtn.style.display = 'none';
        nextMatchBtn.style.display = 'none';
        return;
    }

    if (lessonState.matchSolved.has(itemIndex)) {
        const nextIndex = lesson.match.findIndex((_, index) => !lessonState.matchSolved.has(index));
        if (nextIndex === -1) {
            builderOutput.textContent = 'Lección completada.';
            wordBank.innerHTML = '';
            builderFeedback.textContent = 'Has resuelto todos los emparejamientos de esta lección.';
            checkSentenceBtn.style.display = 'none';
            clearSentenceBtn.style.display = 'none';
            nextMatchBtn.style.display = 'none';
            return;
        }
        currentMatchIndex = nextIndex;
        currentMatchAnswered = false;
        currentMatchSelection = null;
        renderMatch();
        return;
    }

    builderOutput.textContent = `${item.stem} [selecciona una opción]`;
    
    if (!currentMatchAnswered) {
        builderFeedback.textContent = 'Elige la mejor continuación y luego pulsa Comprobar.';
        checkSentenceBtn.style.display = 'inline-block';
        clearSentenceBtn.style.display = 'inline-block';
        nextMatchBtn.style.display = 'none';
    } else {
        checkSentenceBtn.style.display = 'none';
        clearSentenceBtn.style.display = 'none';
        nextMatchBtn.style.display = 'inline-block';
    }
    
    wordBank.innerHTML = '';
    if (!currentMatchAnswered) {
        matchedChoice = '';
    }

    for (const option of item.options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'word-btn';
        button.textContent = option;
        const wrongSet = lessonState.matchWrong.get(itemIndex) || new Set();
        if (wrongSet.has(option)) {
            button.disabled = true;
        }
        if (currentMatchAnswered) {
            if (option === item.answer) {
                button.classList.add('correct');
                button.disabled = true;
            }
            if (currentMatchSelection === option && option !== item.answer) {
                button.classList.add('wrong');
                button.disabled = true;
            }
            if (wrongSet.has(option)) {
                button.disabled = true;
            }
        }
        button.addEventListener('click', () => {
            if (currentMatchAnswered || lessonState.matchSolved.has(itemIndex)) {
                return;
            }
            matchedChoice = option;
            currentMatchSelection = option;
            builderOutput.textContent = `${item.stem} ${option}`;
            for (const otherButton of wordBank.querySelectorAll('button')) {
                otherButton.classList.remove('correct');
                otherButton.classList.remove('wrong');
                otherButton.classList.remove('selected');
            }
            button.classList.add('selected');
        });
        wordBank.appendChild(button);
    }
}

function checkMatchAnswer() {
    const lesson = getLesson();
    const itemIndex = currentMatchIndex;
    const item = lesson.match[itemIndex];
    if (!item) {
        return;
    }
    if (!matchedChoice) {
        setFeedback(builderFeedback, 'Primero elige una opción.', false);
        return;
    }
    if (currentMatchAnswered || lessonState.matchSolved.has(itemIndex)) {
        return;
    }
    if (matchedChoice === item.answer) {
        lessonState.matchSolved.add(itemIndex);
        currentMatchAnswered = true;
        setFeedback(builderFeedback, buildDetailedFeedback(lesson, item, matchedChoice, true, 'match'), true);
        markSuccess();
        renderMatch();
        return;
    }

    const wrongSet = lessonState.matchWrong.get(itemIndex) || new Set();
    wrongSet.add(matchedChoice);
    lessonState.matchWrong.set(itemIndex, wrongSet);
    currentMatchAnswered = true;
    currentMatchSelection = matchedChoice;
    setFeedback(builderFeedback, buildDetailedFeedback(lesson, item, matchedChoice, false, 'match'), false);
    markMiss();
    renderMatch();
}

function nextMatch() {
    const nextIndex = getLesson().match.findIndex((_, index) => !lessonState.matchSolved.has(index));
    if (nextIndex !== -1) {
        currentMatchIndex = nextIndex;
    }
    currentMatchAnswered = false;
    currentMatchSelection = null;
    matchedChoice = '';
    renderMatch();
}

function clearMatchSelection() {
    currentMatchAnswered = false;
    currentMatchSelection = null;
    matchedChoice = '';
    renderMatch();
}

function renderPrompt() {
    const prompt = getLesson().prompt;
    promptEnglish.textContent = prompt.english;
    promptSpanish.textContent = prompt.spanish;
    promptHint.textContent = prompt.hint;
    studentAnswer.value = '';
    answerFeedback.textContent = 'Escribe una respuesta corta en inglés y compárala con el modelo.';
}

function checkAnswer() {
    const answer = studentAnswer.value.trim();
    const prompt = getLesson().prompt;
    if (!answer) {
        setFeedback(answerFeedback, 'Escribe al menos una idea corta antes de revisar.', false);
        return;
    }
    if (!lessonState.promptSolved) {
        lessonState.promptSolved = true;
        markSuccess();
    }
    const words = answer.split(/\s+/).filter(Boolean).length;
    setFeedback(answerFeedback, buildDetailedFeedback(getLesson(), prompt, words, true, 'prompt'), true);
}

function nextFlashcard() {
    const lesson = getLesson();
    currentFlashcardIndex = (currentFlashcardIndex + 1) % lesson.flashcards.length;
    flashcardRevealed = false;
    renderFlashcard();
}

function setLesson(index) {
    currentLessonIndex = index;
    initLessonState();
    renderLesson();
}

function renderLesson() {
    const lesson = getLesson();
    lessonSelect.value = String(currentLessonIndex);
    flashcardTitle.textContent = `1. ${lesson.title}`;
    quizTitle.textContent = '2. Multiple Choice';
    builderTitle.textContent = '3. Matching Sentence Halves';
    promptTitle.textContent = '4. Free Response';
    renderFlashcard();
    renderQuiz();
    renderMatch();
    renderPrompt();
    updateProgress();
}

function populateLessonSelect() {
    lessonSelect.innerHTML = '';
    lessons.forEach((lesson, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = lesson.title;
        lessonSelect.appendChild(option);
    });
}

function advanceLesson() {
    const nextIndex = (currentLessonIndex + 1) % lessons.length;
    setLesson(nextIndex);
}

function toggleThanksCard() {
    if (!thanksCard || !thanksToggle) {
        return;
    }
    const collapsed = thanksCard.classList.toggle('is-collapsed');
    document.body.classList.toggle('thanks-collapsed', collapsed);
    thanksToggle.textContent = collapsed ? 'Abrir' : 'Cerrar';
    thanksToggle.setAttribute('aria-expanded', String(!collapsed));
}

speakFlashcardBtn.addEventListener('click', () => {
    speakText(getLesson().flashcards[currentFlashcardIndex].audio);
});

revealFlashcardBtn.addEventListener('click', () => {
    flashcardRevealed = !flashcardRevealed;
    renderFlashcard();
});

nextFlashcardBtn.addEventListener('click', nextFlashcard);
nextQuizBtn.addEventListener('click', nextQuiz);
checkSentenceBtn.addEventListener('click', checkMatchAnswer);
clearSentenceBtn.addEventListener('click', clearMatchSelection);
nextMatchBtn.addEventListener('click', nextMatch);
checkAnswerBtn.addEventListener('click', checkAnswer);
showModelAnswerBtn.addEventListener('click', () => {
    answerFeedback.textContent = `Modelo: ${getLesson().prompt.model}`;
});
nextPromptBtn.addEventListener('click', () => {
    advanceLesson();
});
lessonSelect.addEventListener('change', (event) => {
    setLesson(Number(event.target.value));
});

if (thanksToggle) {
    thanksToggle.addEventListener('click', toggleThanksCard);
}

window.addEventListener('DOMContentLoaded', () => {
    populateLessonSelect();
    initLessonState();
    checkSentenceBtn.textContent = 'Comprobar';
    clearSentenceBtn.textContent = 'Limpiar';
    nextQuizBtn.textContent = 'Siguiente pregunta';
    nextMatchBtn.textContent = 'Siguiente emparejamiento';
    updateProgress();
    renderLesson();
});