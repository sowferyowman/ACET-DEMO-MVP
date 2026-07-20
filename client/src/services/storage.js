const USERS_KEY = "exams_ph_users";
const SESSION_KEY = "exams_ph_current_user";
const USER_ACCOUNTS_KEY = "userAccounts";
const CURRENT_ACTIVE_USER_KEY = "currentActiveUser";
const EXAMS_KEY = "global_exam_blueprints";
const EXAMS_DATA_KEY = "examsData";
const STUDY_PLAN_KEY = "studyPlanData";
const REVIEWERS_KEY = "reviewersData";
const DRILL_BANK_KEY = "drillBankData";
const DASHBOARD_KEY = "acet_dashboard_data";
const LEGACY_FORUM_KEY = "acet_forum_threads";
const FORUM_KEY = "forumPosts";
const NOTIFICATIONS_KEY = "notificationsData";
const REVIEWER_PROGRESS_KEY = "reviewer_progress";
const STAN_DASHBOARD_RESET_KEY = "acet_stan_dashboard_reset_20260715_v1";

const defaultUsers = [
  {
    id: "admin-default",
    username: "admin1",
    email: "admin@exams.ph",
    password: "pass1234",
    role: "admin",
    name: "Admin Workspace"
  },
  {
    id: "student-default",
    username: "student1",
    email: "student1@exams.ph",
    password: "123",
    role: "student",
    name: "Stanley Mejia"
  }
];

const defaultUserAccounts = [
  {
    id: "admin-default",
    username: "admin1",
    name: "Admin Workspace",
    nickname: "Admin",
    email: "admin@exams.ph",
    password: "pass1234",
    smsNumber: "",
    role: "admin",
    isGoogleLinked: false,
    profileCompleted: true,
    academicMetrics: { target: "Admin", strengths: [], weakTags: [] }
  },
  {
    id: "student-default",
    username: "student1",
    name: "Stanley Mejia",
    nickname: "Stan",
    email: "student1@exams.ph",
    password: "123",
    smsNumber: "+639123456789",
    role: "student",
    isGoogleLinked: false,
    profileCompleted: true,
    academicMetrics: { target: "ACET", strengths: ["Mathematics"], weakTags: ["Reading Inference"] }
  }
];

const defaultForumThreads = [];

const studyPlanData = [
  {
    id: "study_week_01",
    week: 1,
    title: "Mathematics & Quantitative Reasoning",
    objectives: [
      "Rebuild algebraic fluency under time pressure.",
      "Recognize function composition traps before performing long calculations.",
      "Translate word problems into constraints, equations, and inequality checks.",
      "Recover theorems for similarity, circles, quadrilaterals, and coordinate geometry."
    ],
    focusAreas: ["Advanced Algebra", "Complex Functions", "Word Problems", "Geometric Theorems"],
    readingHtml: `
      <article class="space-y-3">
        <p><b>Core recovery target:</b> stop treating ACET quantitative items as isolated computations. Most difficult items combine algebraic structure with a verbal condition that removes one tempting shortcut.</p>
        <p><b>Advanced Algebra:</b> Review factoring by grouping, rational expressions, nested radicals, and parameterized quadratics. When a question asks for a value that is invariant, test whether the expression can be rewritten around a hidden sum/product pair. For example, if roots are described indirectly, use Vieta before solving.</p>
        <p><b>Complex Functions:</b> For compositions such as <i>f(g(x))</i>, identify the domain restriction before substituting. Logarithmic and radical functions usually hide the actual exam trap inside the boundary condition.</p>
        <p><b>Word Problems:</b> Annotate quantities as <b>rate</b>, <b>stock</b>, or <b>change</b>. A two-line table is faster than mental tracking when a problem includes work rates, mixtures, discounts, or moving objects.</p>
        <p><b>Geometry:</b> Build theorem recall around triggers: tangent means perpendicular radius; cyclic quadrilateral means opposite angles sum to 180; parallel lines invite similarity; median to hypotenuse creates equal radii.</p>
      </article>`
  },
  {
    id: "study_week_02",
    week: 2,
    title: "Logical Reasoning & Abstract Patterns",
    objectives: [
      "Decode double negatives and conditional statements without losing scope.",
      "Separate valid Venn conclusions from emotionally plausible but unsupported statements.",
      "Map spatial sequence rotations, reflections, and alternating transformations.",
      "Build a notation system for fast elimination."
    ],
    focusAreas: ["Double-Negative Syllogisms", "Venn Diagram Fallacies", "Spatial Sequence Patterns"],
    readingHtml: `
      <article class="space-y-3">
        <p><b>Core recovery target:</b> transform language into symbols before judging truth. The hardest reasoning questions are written to make the conclusion sound familiar while quietly changing quantity, direction, or exception scope.</p>
        <p><b>Syllogisms with double negatives:</b> Replace phrases like <i>not all are not</i> with a minimum-existence claim. If "not all artists are not scientists," then at least one artist is a scientist. Do not convert it into "all artists are scientists."</p>
        <p><b>Venn fallacies:</b> Universal statements allow containment; particular statements only place at least one element. Never assume the overlap is empty unless the premise explicitly says "no."</p>
        <p><b>Spatial sequences:</b> Track three channels independently: position, orientation, and shading. Many items alternate transformations, e.g. rotate 90 degrees on odd steps but mirror on even steps.</p>
        <p><b>Practice protocol:</b> Use symbols first, answer second. Under severe time pressure, eliminate any option that asserts a stronger conclusion than the premises justify.</p>
      </article>`
  },
  {
    id: "study_week_03",
    week: 3,
    title: "English Proficiency & Critical Reading",
    objectives: [
      "Read dense passages for argument structure instead of line-by-line memory.",
      "Identify grammar errors involving modifier placement, agreement, tense, and parallelism.",
      "Correct syntax without changing authorial meaning.",
      "Solve analogies by relationship type, not surface vocabulary."
    ],
    focusAreas: ["Timed Reading Comprehension", "Error Identification", "Syntax Correction", "Analogy Mapping"],
    readingHtml: `
      <article class="space-y-3">
        <p><b>Core recovery target:</b> answer from function. ACET-style English items often punish readers who remember a phrase but miss why the phrase appears.</p>
        <p><b>Timed reading:</b> First pass: mark thesis, contrast words, and conclusion. Second pass: answer evidence questions by returning to the exact paragraph role. If a choice is true but not used by the author, it is still wrong.</p>
        <p><b>Error identification:</b> Check subject-verb agreement after removing interrupting phrases. For modifiers, ask whether the nearest noun can logically perform the described action.</p>
        <p><b>Syntax correction:</b> Prefer the option that preserves meaning while improving concision, parallelism, and reference clarity. Beware choices that sound polished but shift tense or agency.</p>
        <p><b>Analogies:</b> Name the relation in a sentence: "A scalpel is used by a surgeon for precise cutting." Then test each option against the same relation, not against word familiarity.</p>
      </article>`
  },
  {
    id: "study_week_04",
    week: 4,
    title: "General Knowledge & High-Speed Performance Drills",
    objectives: [
      "Consolidate high-frequency facts through context, not memorized lists.",
      "Practice mathematical shortcuts that preserve accuracy.",
      "Review current socio-economic events through cause-effect chains.",
      "Build a pacing system for skipping, returning, and protecting easy points."
    ],
    focusAreas: ["Mathematical Shortcuts", "Current Socio-Economic Events", "High-Pressure Pacing"],
    readingHtml: `
      <article class="space-y-3">
        <p><b>Core recovery target:</b> convert preparation into execution. The final week should reduce hesitation, not add new anxiety.</p>
        <p><b>Math shortcuts:</b> Use estimation to reject impossible answers before exact work. For percentages, convert chained changes into multipliers. For ratios, scale to the least common base.</p>
        <p><b>General knowledge:</b> Study events as systems: policy, affected sector, consequence, and controversy. For socio-economic questions, understand inflation, unemployment, migration, energy, education, and governance as connected issues.</p>
        <p><b>Pacing:</b> Use a three-pass model. Pass 1 captures direct wins. Pass 2 handles medium problems with visible structure. Pass 3 is for time-intensive traps. Marking and moving is a skill, not a surrender.</p>
        <p><b>Final drill:</b> Complete mixed sets with a visible timer, then review not only wrong answers but also slow correct answers. Slow correctness is still a risk in a grueling entrance test.</p>
      </article>`
  }
];

const examBlueprintSeed = [
  {
    id: "exam_acet_001",
    title: "ACET Mock Exam 1: Advanced Numerical Sprint",
    duration: 50,
    questions: [
      ["q_math_001", "Mathematics", "Advanced Algebra", "Composite Functions", "<p><b>Situation:</b> A scholarship committee models stress performance by composing two functions, <i>f(x)=3x^2-5x</i> and <i>g(x)=log<sub>2</sub>(x)</i>. If a candidate's raw pace index is constrained to <b>x=8</b>, evaluate <i>f(g(x))</i> and interpret it as the adjustment parameter.</p>", ["6", "12", "18", "24"], 1],
      ["q_math_002", "Mathematics", "Geometric Theorems", "Cyclic Quadrilaterals", "<p>A quadrilateral is inscribed in a circle. One angle is written as <b>3y+14</b> degrees and the opposite angle as <b>5y-2</b> degrees. What is the value of the smaller of the two opposite angles?</p>", ["73°", "86°", "94°", "107°"], 1],
      ["q_logic_001", "Logical Reasoning", "Syllogisms", "Double Negatives", "<p><b>Premises:</b> Not all diligent students are not artists. Every artist in the review hall is either a debater or a musician. No musician failed the diagnostic. Which conclusion must follow?</p>", ["All diligent students passed the diagnostic.", "At least one diligent student may be a debater or a musician.", "No debater failed the diagnostic.", "Every artist is diligent."], 1],
      ["q_eng_001", "English", "Syntax Correction", "Dangling Modifiers", "<p><b>Error identification:</b> <i>Walking through the old archive, the manuscripts seemed to whisper the history of the city to Mara.</i> Which revision best repairs the modifier?</p>", ["Walking through the old archive, Mara felt the manuscripts seemed to whisper the history of the city.", "The manuscripts walking through the old archive seemed to whisper history.", "Mara, the manuscripts walking through the old archive, heard history.", "Walking through the old archive seemed the manuscripts to whisper."], 0],
      ["q_gk_001", "General Knowledge", "Socio-Economic Analysis", "Inflation and Purchasing Power", "<p>A news brief states that nominal wages rose by 5% while consumer prices rose by 8% in the same period. Which interpretation is most accurate for workers whose consumption basket matches the index?</p>", ["Real purchasing power increased by about 3%.", "Real purchasing power declined despite higher nominal pay.", "Inflation is irrelevant if wages rise.", "Nominal wage growth always means improved welfare."], 1]
    ]
  },
  {
    id: "exam_acet_002",
    title: "ACET Simulation 2: Logic, Language, and Quantitative Endurance",
    duration: 50,
    questions: [
      ["q_math_006", "Mathematics", "Word Problems", "Work Rate Systems", "<p>Three printers prepare test booklets. Printer A can finish alone in 6 hours, B in 9 hours, and C joins only after the first hour. If A and B start together, how many additional hours are needed after C joins if C alone would take 12 hours?</p>", ["2.0 hours", "2.4 hours", "3.0 hours", "3.6 hours"], 1],
      ["q_logic_006", "Logical Reasoning", "Venn Diagram Fallacies", "Unsupported Conversion", "<p><b>Premises:</b> All campus journalists are writers. Some writers are athletes. No athlete in the data set is a chess finalist. Which statement is logically secure?</p>", ["Some journalists are athletes.", "No campus journalist is a chess finalist.", "Some writers are not chess finalists.", "All writers are campus journalists."], 2],
      ["q_eng_006", "English", "Reading Inference", "Authorial Purpose", "<p><b>Passage excerpt:</b> The author praises urban gardens not merely because they beautify vacant spaces, but because they expose residents to the hidden labor behind food systems. What is the author's likely purpose?</p>", ["To argue that gardens should replace all supermarkets", "To connect aesthetics with civic awareness", "To prove rural farms are obsolete", "To criticize residents for poor taste"], 1],
      ["q_math_007", "Mathematics", "Functions", "Piecewise Boundary Evaluation", "<p>For <i>h(x)=2x+1</i> when x&lt;3 and <i>h(x)=x^2-4</i> when x≥3, what is <i>h(h(2))</i>?</p>", ["5", "9", "21", "32"], 2],
      ["q_gk_006", "General Knowledge", "Governance", "Public Accountability", "<p>A local government publishes project costs, bidding documents, and completion reports online. Which democratic principle is most directly strengthened?</p>", ["Subsidiarity", "Transparency", "Isolationism", "Judicial restraint"], 1]
    ]
  },
  {
    id: "exam_acet_003",
    title: "ACET Simulation 3: Abstract Pattern and Reading Compression",
    duration: 48,
    questions: [
      ["q_logic_011", "Logical Reasoning", "Spatial Sequence Patterns", "Rotation Reflection Alternation", "<p>A figure rotates 90° clockwise on odd moves and reflects horizontally on even moves. Starting from an arrow pointing up with its shaded half on the left, what is its orientation after four moves?</p>", ["Arrow up, shaded left", "Arrow right, shaded right", "Arrow down, shaded left", "Arrow left, shaded right"], 0],
      ["q_math_011", "Mathematics", "Advanced Algebra", "Rational Expression Restrictions", "<p>Solve for the excluded values in the expression <b>(x²-9)/(x²-x-6)</b> before simplification. Which set must be removed from the domain?</p>", ["{3}", "{-2, 3}", "{-3, 2}", "{-3, -2, 3}"], 1],
      ["q_eng_011", "English", "Analogy Mapping", "Function Relationship", "<p><b>Analogy:</b> Compass : navigation :: rubric : _____. Choose the option preserving the same functional relationship.</p>", ["assessment", "essay", "teacher", "classroom"], 0],
      ["q_eng_012", "English", "Error Identification", "Pronoun Reference", "<p>In the sentence <i>When Carla placed the notebook beside the laptop, it was already damaged</i>, what is the main weakness?</p>", ["Faulty tense sequence", "Ambiguous pronoun reference", "Subject-verb disagreement", "Incorrect comparison"], 1],
      ["q_gk_011", "General Knowledge", "Economics", "Opportunity Cost", "<p>A student chooses a free review seminar over a paid tutoring shift. The seminar has no fee. What is the opportunity cost?</p>", ["Zero because the seminar is free", "The value of the paid tutoring shift forgone", "The total cost of all future seminars", "Only transportation expenses"], 1]
    ]
  },
  {
    id: "exam_acet_004",
    title: "ACET Simulation 4: Geometry, Evidence, and Civic Context",
    duration: 52,
    questions: [
      ["q_math_016", "Mathematics", "Geometric Theorems", "Similarity Ratios", "<p>Two similar triangles have corresponding sides 6 cm and 15 cm. If the smaller triangle has area 28 cm², what is the area of the larger triangle?</p>", ["70 cm²", "112 cm²", "175 cm²", "280 cm²"], 2],
      ["q_eng_016", "English", "Critical Reading", "Evidence Selection", "<p>A passage argues that digital archives democratize access but may flatten cultural context. Which evidence best supports the second half of the claim?</p>", ["More people can download documents.", "Metadata often omits ritual, location, and community memory.", "Servers require electricity.", "Students prefer searchable PDFs."], 1],
      ["q_logic_016", "Logical Reasoning", "Conditional Logic", "Contrapositive Trap", "<p>If a participant submits late, then the application is flagged. Mara's application was not flagged. What follows?</p>", ["Mara submitted late.", "Mara did not submit late.", "All unflagged applications are excellent.", "Flagged applications are always late."], 1],
      ["q_math_017", "Mathematics", "Word Problems", "Mixture Concentration", "<p>A 30% solution is mixed with 200 mL of a 60% solution to produce 500 mL of final solution. What is the final concentration?</p>", ["36%", "42%", "48%", "54%"], 1],
      ["q_gk_016", "General Knowledge", "Philippine Society", "Migration Effects", "<p>Which statement best captures a common socio-economic effect of overseas remittances?</p>", ["They may increase household consumption while creating dependency risks.", "They eliminate all unemployment.", "They directly lower every commodity price.", "They make taxation unnecessary."], 0]
    ]
  },
  {
    id: "exam_acet_005",
    title: "ACET Simulation 5: High-Pressure Mixed Reasoning",
    duration: 47,
    questions: [
      ["q_math_021", "Mathematics", "Functions", "Inverse Function Interpretation", "<p>A scoring curve is modeled by <i>f(x)=4x-7</i>. If the adjusted score is 65, what raw score x produced it?</p>", ["14", "16", "18", "20"], 2],
      ["q_logic_021", "Logical Reasoning", "Syllogisms", "Existential Conclusions", "<p>Some volunteers are tutors. All tutors completed orientation. Which conclusion follows?</p>", ["All volunteers completed orientation.", "Some volunteers completed orientation.", "No non-tutor completed orientation.", "All oriented people are tutors."], 1],
      ["q_eng_021", "English", "Syntax Correction", "Parallel Structure", "<p>Choose the best revision: <i>The program values discipline, curiosity, and students who serve others.</i></p>", ["discipline, curiosity, and service", "discipline, being curious, and students serving", "disciplined, curiosity, and service", "discipline, curious students, and serving"], 0],
      ["q_math_022", "Mathematics", "Advanced Algebra", "Quadratic Parameter", "<p>For what value of k will <i>x²-10x+k</i> have exactly one real root?</p>", ["10", "20", "25", "50"], 2],
      ["q_gk_021", "General Knowledge", "Media Literacy", "Source Reliability", "<p>Which source is strongest for verifying a current inflation figure?</p>", ["Anonymous comment thread", "Official statistics agency release", "A meme with a graph", "A decade-old textbook"], 1]
    ]
  },
  {
    id: "exam_acet_006",
    title: "ACET Simulation 6: Quantitative and Verbal Trapdoors",
    duration: 50,
    questions: [
      ["q_math_026", "Mathematics", "Word Problems", "Discount Compounding", "<p>A jacket is discounted 20% and then another 15% on the reduced price. What single discount is equivalent?</p>", ["32%", "35%", "38%", "40%"], 0],
      ["q_eng_026", "English", "Reading Comprehension", "Tone Under Constraint", "<p>An essay calls a policy <i>well-intentioned but administratively naive</i>. What is the tone?</p>", ["Unqualified praise", "Measured criticism", "Indifference", "Celebratory certainty"], 1],
      ["q_logic_026", "Logical Reasoning", "Venn Diagram Fallacies", "Some-versus-All", "<p>All scholars are readers. Some readers are poets. Which diagram must be possible but not required?</p>", ["Scholar circle entirely outside readers", "Poet circle overlapping readers", "Reader circle inside scholars", "No overlap between readers and poets"], 1],
      ["q_math_027", "Mathematics", "Geometric Theorems", "Circle Tangent", "<p>A radius to a point of tangency is 9 cm. A tangent segment from an external point is 12 cm. How far is the external point from the circle center?</p>", ["15 cm", "18 cm", "21 cm", "24 cm"], 0],
      ["q_eng_027", "English", "Analogy Mapping", "Cause-Effect Relationship", "<p>Drought : crop failure :: misinformation : _____. Choose the best effect relationship.</p>", ["public confusion", "library", "weather report", "harvest"], 0]
    ]
  },
  {
    id: "exam_acet_007",
    title: "ACET Simulation 7: Analytical Reading and Algebraic Precision",
    duration: 49,
    questions: [
      ["q_eng_031", "English", "Critical Reading", "Assumption Detection", "<p>An editorial argues that extending library hours will improve exam scores because students will study more. What assumption is required?</p>", ["Students will use the extra hours for study.", "Libraries should sell food.", "Exam scores never change.", "Students dislike quiet spaces."], 0],
      ["q_math_031", "Mathematics", "Advanced Algebra", "Exponential Equations", "<p>Solve <b>2<sup>x+1</sup> = 32</b>. What is x?</p>", ["3", "4", "5", "6"], 1],
      ["q_logic_031", "Logical Reasoning", "Conditional Logic", "Necessary Condition", "<p>Only students with clearance may enter the archive. Joel entered the archive. What follows?</p>", ["Joel has clearance.", "Joel is a librarian.", "Everyone with clearance entered.", "No one entered."], 0],
      ["q_math_032", "Mathematics", "Functions", "Domain Restriction", "<p>For <i>g(x)=sqrt(2x-6)</i>, which interval gives the domain?</p>", ["x&lt;3", "x≤3", "x≥3", "all real numbers"], 2],
      ["q_gk_031", "General Knowledge", "Civics", "Separation of Powers", "<p>Judicial review primarily refers to the power to do what?</p>", ["Create taxes", "Declare acts unconstitutional", "Command the military", "Conduct elections"], 1]
    ]
  },
  {
    id: "exam_acet_008",
    title: "ACET Simulation 8: Pattern Sprint and Grammar Accuracy",
    duration: 46,
    questions: [
      ["q_logic_036", "Logical Reasoning", "Abstract Patterns", "Alternating Arithmetic", "<p>Find the next term: 4, 9, 7, 14, 12, 19, 17, __. The pattern alternates operations.</p>", ["21", "22", "24", "26"], 2],
      ["q_eng_036", "English", "Error Identification", "Subject Verb Agreement", "<p>Choose the corrected verb: <i>The list of urgent review topics ___ on the coordinator's desk.</i></p>", ["are", "were", "is", "have been"], 2],
      ["q_math_036", "Mathematics", "Word Problems", "Ratio Scaling", "<p>A class ratio of STEM to HUMSS students is 7:5. If there are 96 students, how many are HUMSS?</p>", ["35", "40", "48", "56"], 1],
      ["q_eng_037", "English", "Syntax Correction", "Conciseness", "<p>Best revision: <i>Due to the fact that the schedule was compressed, reviewers had to prioritize.</i></p>", ["Because the schedule was compressed, reviewers had to prioritize.", "Due to compression of schedule reviewers prioritizing.", "The schedule was compressed due to the fact.", "Reviewers had to prioritize in a compressed way."], 0],
      ["q_gk_036", "General Knowledge", "Economics", "Supply Shock", "<p>A typhoon destroys crops. If demand stays similar, what is the likely short-run market effect?</p>", ["Supply rises and price falls", "Supply falls and price rises", "Demand disappears", "Price is legally fixed everywhere"], 1]
    ]
  },
  {
    id: "exam_acet_009",
    title: "ACET Simulation 9: Endurance Set for Weakness Isolation",
    duration: 53,
    questions: [
      ["q_math_041", "Mathematics", "Geometric Theorems", "Coordinate Distance", "<p>In the coordinate plane, points A(-2,5) and B(4,-3) define a segment. What is its length?</p>", ["8", "10", "12", "14"], 1],
      ["q_logic_041", "Logical Reasoning", "Syllogisms", "Quantifier Scope", "<p>Not every applicant who was not interviewed was rejected. What does this imply?</p>", ["At least one non-interviewed applicant was not rejected.", "All non-interviewed applicants were accepted.", "No rejected applicant was interviewed.", "Every applicant was interviewed."], 0],
      ["q_eng_041", "English", "Reading Inference", "Main Claim", "<p>A passage says technology expands access but intensifies distraction. What is the most balanced main claim?</p>", ["Technology is purely harmful.", "Access and attention costs must be weighed together.", "Distraction is imaginary.", "Only old technology helps students."], 1],
      ["q_math_042", "Mathematics", "Advanced Algebra", "Inequality Reasoning", "<p>If <i>3x-7 &lt; 11</i> and x is an integer greater than 1, what is the greatest possible x?</p>", ["4", "5", "6", "7"], 1],
      ["q_gk_041", "General Knowledge", "Current Events Reasoning", "Energy Policy Tradeoffs", "<p>A country shifts toward renewable energy but faces intermittency issues. Which policy response is most technically relevant?</p>", ["Ignore grid storage", "Invest in storage and grid modernization", "Ban all electricity use", "Rely only on slogans"], 1]
    ]
  },
  {
    id: "exam_acet_010",
    title: "ACET Simulation 10: Final Comprehensive Pressure Test",
    duration: 55,
    questions: [
      ["q_math_046", "Mathematics", "Functions", "Composite Logarithmic Functions", "<p><b>Final pressure item:</b> Let <i>f(x)=x²+2x</i> and <i>g(x)=log<sub>3</sub>(x)</i>. If x=27, what is <i>f(g(x))</i>?</p>", ["9", "12", "15", "18"], 2],
      ["q_logic_046", "Logical Reasoning", "Spatial Sequence Patterns", "Layered Transformation", "<p>A shaded square moves one corner clockwise each step while its internal diagonal flips every second step. After five steps, where is the square and what happened to the diagonal?</p>", ["Original corner, unchanged", "Next clockwise corner, flipped", "Opposite corner, unchanged", "Previous corner, flipped"], 1],
      ["q_eng_046", "English", "Analogy Mapping", "Degree Relationship", "<p>Whisper : shout :: drizzle : _____. Choose the pair matching intensity difference.</p>", ["storm", "cloud", "umbrella", "puddle"], 0],
      ["q_math_047", "Mathematics", "Word Problems", "Pacing Optimization", "<p>A student answers easy items at 45 seconds each and hard items at 150 seconds each. In a 20-minute block with 12 easy items, how many hard items can still be attempted?</p>", ["4", "5", "6", "7"], 0],
      ["q_gk_046", "General Knowledge", "Socio-Economic Analysis", "Policy Tradeoffs", "<p>A fare subsidy helps commuters but strains the public budget. Which analysis is most complete?</p>", ["It has only benefits.", "It has only costs.", "It requires weighing equity gains against fiscal sustainability.", "It cannot affect behavior."], 2]
    ]
  }
];

const examsData = examBlueprintSeed.map((exam) => ({
  id: exam.id,
  title: exam.title,
  duration: exam.duration,
  points: 100,
  questions: exam.questions.map(([id, subject, subCategory, weaknessTag, questionText, options, correctAnswer]) => ({
    id,
    questionText,
    options,
    correctAnswer,
    subject,
    subCategory,
    weaknessTag
  }))
}));

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    writeJson(USERS_KEY, defaultUsers);
  } else {
    const users = readJson(USERS_KEY, []);
    const mergedUsers = defaultUsers.reduce((accounts, defaultUser) => {
      const existingIndex = accounts.findIndex((account) => account.username === defaultUser.username || account.id === defaultUser.id);
      if (existingIndex >= 0) {
        accounts[existingIndex] = { ...accounts[existingIndex], ...defaultUser };
        return accounts;
      }
      return [...accounts, defaultUser];
    }, users);
    writeJson(USERS_KEY, mergedUsers);
  }

  if (!localStorage.getItem(EXAMS_DATA_KEY)) writeJson(EXAMS_DATA_KEY, examsData);
  if (!localStorage.getItem(STUDY_PLAN_KEY)) writeJson(STUDY_PLAN_KEY, studyPlanData);
  if (!localStorage.getItem(EXAMS_KEY)) writeJson(EXAMS_KEY, transformExamsDataToBlueprints(readJson(EXAMS_DATA_KEY, examsData)));
  if (!readJson(EXAMS_KEY, []).length) writeJson(EXAMS_KEY, transformExamsDataToBlueprints(readJson(EXAMS_DATA_KEY, examsData)));
  if (!localStorage.getItem(REVIEWERS_KEY)) writeJson(REVIEWERS_KEY, []);
  if (!localStorage.getItem(DRILL_BANK_KEY)) writeJson(DRILL_BANK_KEY, []);
  if (!localStorage.getItem(DASHBOARD_KEY)) writeJson(DASHBOARD_KEY, {});
  if (!localStorage.getItem(REVIEWER_PROGRESS_KEY)) writeJson(REVIEWER_PROGRESS_KEY, {});
  if (!localStorage.getItem(FORUM_KEY)) writeJson(FORUM_KEY, []);
  removeSeededForumUsers();
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) writeJson(NOTIFICATIONS_KEY, []);

  if (!localStorage.getItem(USER_ACCOUNTS_KEY)) {
    const legacyUsers = readJson(USERS_KEY, defaultUsers);
    const accounts = mergeUserAccounts(defaultUserAccounts, legacyUsers.map(normalizeLegacyUserAccount));
    writeJson(USER_ACCOUNTS_KEY, accounts);
  } else {
    const accounts = readJson(USER_ACCOUNTS_KEY, []);
    writeJson(USER_ACCOUNTS_KEY, mergeUserAccounts(defaultUserAccounts, accounts));
  }

  const accounts = readJson(USER_ACCOUNTS_KEY, defaultUserAccounts);
  const session = readJson(CURRENT_ACTIVE_USER_KEY, readJson(SESSION_KEY, null));
  if (session && !accounts.some((user) => user.id === session.id || (user.email === session.email && user.role === session.role))) {
    localStorage.removeItem(CURRENT_ACTIVE_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  if (!localStorage.getItem(STAN_DASHBOARD_RESET_KEY)) {
    const dashboardStore = readJson(DASHBOARD_KEY, {});
    const stanEmails = new Set(
      accounts
        .filter((account) => /stan/i.test(`${account.name || ""} ${account.nickname || ""} ${account.username || ""}`))
        .map((account) => account.email)
        .filter(Boolean)
    );
    defaultUserAccounts
      .filter((account) => /stan/i.test(`${account.name || ""} ${account.nickname || ""} ${account.username || ""}`))
      .forEach((account) => stanEmails.add(account.email));

    const nextDashboardStore = { ...dashboardStore };
    stanEmails.forEach((email) => {
      nextDashboardStore[email] = createEmptyDashboard(email);
    });
    writeJson(DASHBOARD_KEY, nextDashboardStore);
    localStorage.setItem(STAN_DASHBOARD_RESET_KEY, "true");
  }
}

export function getUsers() {
  initializeLocalStorage();
  return readJson(USERS_KEY, defaultUsers);
}

export function getExamsData() {
  initializeLocalStorage();
  return readJson(EXAMS_DATA_KEY, examsData);
}

export function getStudyPlanData() {
  initializeLocalStorage();
  return readJson(STUDY_PLAN_KEY, studyPlanData);
}

export function getUserAccounts() {
  initializeLocalStorage();
  return readJson(USER_ACCOUNTS_KEY, defaultUserAccounts);
}

export function loginUser(identifier, password) {
  const user = getUserAccounts().find(
    (account) =>
      (account.username?.toLowerCase() === identifier.toLowerCase() ||
        account.email?.toLowerCase() === identifier.toLowerCase()) &&
      account.password === password
  );

  if (!user) return null;

  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.name,
    nickname: user.nickname,
    smsNumber: user.smsNumber,
    isGoogleLinked: Boolean(user.isGoogleLinked),
    profileCompleted: Boolean(user.profileCompleted),
    academicMetrics: user.academicMetrics || { target: "", strengths: [], weakTags: [] }
  };

  writeJson(CURRENT_ACTIVE_USER_KEY, sessionUser);
  writeJson(SESSION_KEY, sessionUser);
  return sessionUser;
}

export function createStudentAccount({ email, password, smsNumber }) {
  const accounts = getUserAccounts();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password) return { error: "Email and password are required." };
  if (accounts.some((account) => account.email?.toLowerCase() === normalizedEmail)) {
    return { error: "An account with that email already exists." };
  }

  const account = {
    id: crypto.randomUUID(),
    name: "",
    nickname: "",
    email: normalizedEmail,
    password,
    smsNumber: String(smsNumber || "").trim(),
    role: "student",
    isGoogleLinked: false,
    profileCompleted: false,
    academicMetrics: { target: "", strengths: [], weakTags: [] }
  };

  writeJson(USER_ACCOUNTS_KEY, [account, ...accounts]);
  return { user: setCurrentActiveUser(account) };
}

export function signInWithGoogleProfile(profile = {}) {
  const accounts = getUserAccounts();
  const googleProfile = {
    name: profile.name || "Google Student",
    email: String(profile.email || "google.student@example.com").trim().toLowerCase()
  };
  const existing = accounts.find((account) => account.email?.toLowerCase() === googleProfile.email);
  const account = existing
    ? { ...existing, name: existing.name || googleProfile.name, isGoogleLinked: true }
    : {
        id: crypto.randomUUID(),
        name: googleProfile.name,
        nickname: "",
        email: googleProfile.email,
        password: "",
        smsNumber: "",
        role: "student",
        isGoogleLinked: true,
        profileCompleted: false,
        academicMetrics: { target: "", strengths: [], weakTags: [] }
      };

  const nextAccounts = existing
    ? accounts.map((item) => (item.id === account.id ? account : item))
    : [account, ...accounts];
  writeJson(USER_ACCOUNTS_KEY, nextAccounts);
  return setCurrentActiveUser(account);
}

export function updateCurrentStudentProfile(updates) {
  const current = getCurrentUser();
  if (!current) return null;

  const accounts = getUserAccounts();
  const nextAccount = {
    ...accounts.find((account) => account.id === current.id),
    ...current,
    ...updates,
    academicMetrics: {
      ...(current.academicMetrics || {}),
      ...(updates.academicMetrics || {})
    }
  };

  const nextAccounts = accounts.map((account) => (account.id === current.id ? { ...account, ...nextAccount } : account));
  writeJson(USER_ACCOUNTS_KEY, nextAccounts);
  return setCurrentActiveUser(nextAccount);
}

export function getCurrentUser() {
  initializeLocalStorage();
  return readJson(CURRENT_ACTIVE_USER_KEY, readJson(SESSION_KEY, null));
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_ACTIVE_USER_KEY);
  localStorage.removeItem(SESSION_KEY);
}

function normalizeLegacyUserAccount(user) {
  return {
    id: user.id || crypto.randomUUID(),
    username: user.username,
    name: user.name || "",
    nickname: user.nickname || "",
    email: user.email || "",
    password: user.password || "",
    smsNumber: user.smsNumber || "",
    role: user.role || "student",
    isGoogleLinked: Boolean(user.isGoogleLinked),
    profileCompleted: user.role === "admin" ? true : Boolean(user.profileCompleted ?? user.name),
    academicMetrics: user.academicMetrics || { target: user.role === "admin" ? "Admin" : "ACET", strengths: [], weakTags: [] }
  };
}

function mergeUserAccounts(seedAccounts, storedAccounts) {
  return [...seedAccounts, ...storedAccounts].reduce((accounts, account) => {
    const existingIndex = accounts.findIndex(
      (item) => item.id === account.id || (item.email && account.email && item.email.toLowerCase() === account.email.toLowerCase())
    );
    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...accounts[existingIndex], ...account };
      return accounts;
    }
    return [...accounts, account];
  }, []);
}

function setCurrentActiveUser(user) {
  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role || "student",
    name: user.name || "",
    nickname: user.nickname || "",
    smsNumber: user.smsNumber || "",
    isGoogleLinked: Boolean(user.isGoogleLinked),
    profileCompleted: Boolean(user.profileCompleted),
    academicMetrics: user.academicMetrics || { target: "", strengths: [], weakTags: [] }
  };

  writeJson(CURRENT_ACTIVE_USER_KEY, sessionUser);
  writeJson(SESSION_KEY, sessionUser);
  window.dispatchEvent(new CustomEvent("currentActiveUserUpdated", { detail: sessionUser }));
  return sessionUser;
}

function getUserDisplayName(user) {
  return user?.nickname || user?.name || user?.username || user?.email || "Student";
}

function normalizeForumThread(thread) {
  return {
    ...thread,
    author: thread.author || "Student",
    authorId: thread.authorId || thread.userId || "",
    authorEmail: thread.authorEmail || "",
    reactions: normalizeReactions(thread.reactions),
    replies: (thread.replies || []).map((reply) => ({
      ...reply,
      author: reply.author || "Student",
      authorId: reply.authorId || reply.userId || "",
      createdAt: reply.createdAt || new Date().toISOString()
    }))
  };
}

function normalizeReactions(reactions = {}) {
  return ["like", "insightful", "fire"].reduce((nextReactions, type) => {
    const reaction = reactions[type] || {};
    nextReactions[type] = {
      count: Number(reaction.count || 0),
      userIds: Array.isArray(reaction.userIds) ? reaction.userIds : []
    };
    return nextReactions;
  }, {});
}

function transformExamsDataToBlueprints(examRecords) {
  return examRecords.map((exam) => {
    const grouped = exam.questions.reduce((sections, question) => {
      const subject = question.subject || "General Knowledge";
      const existing = sections.find((section) => section.subjectTitle === subject);
      const target = existing || {
        subjectTitle: subject,
        allottedTimeSec: Math.round((Number(exam.duration || 50) * 60) / 4),
        questions: []
      };
      target.questions.push({
        id: question.id,
        type: "multiple_choice",
        stem: question.questionText,
        choiceOpts: question.options,
        answerIdx: question.correctAnswer,
        correctAnswers: [],
        correctText: "",
        diagnosticSubcategory: question.subCategory,
        diagnosticSkillTag: question.weaknessTag,
        category: question.subject,
        subCategory: question.subCategory,
        weaknessTag: question.weaknessTag,
        points: Math.max(1, Math.round(Number(exam.points || 100) / Math.max(1, exam.questions.length)))
      });
      return existing ? sections : [...sections, target];
    }, []);

    return {
      id: exam.id,
      title: exam.title,
      duration: exam.duration,
      points: exam.points,
      sections: grouped,
      createdAt: new Date().toISOString(),
      status: "published",
      source: "examsData"
    };
  });
}

function getStudyPlanCards() {
  return readJson(STUDY_PLAN_KEY, studyPlanData).map((week) => ({
    day: `Week ${week.week}`,
    title: week.title,
    detail: `${week.focusAreas.join(" • ")}. Objectives: ${week.objectives.join(" ")}`,
    detailHtml: week.readingHtml,
    status: week.week === 1 ? "today" : "upcoming",
    objectives: week.objectives,
    focusAreas: week.focusAreas
  }));
}

export function getExamBlueprints() {
  initializeLocalStorage();
  return readJson(EXAMS_KEY, []);
}

export function getActiveExamBlueprint() {
  const blueprints = getExamBlueprints();
  return blueprints[blueprints.length - 1] || null;
}

export function publishExamBlueprint(blueprint) {
  const blueprints = getExamBlueprints();
  const nextBlueprint = {
    ...blueprint,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "published"
  };

  writeJson(EXAMS_KEY, [...blueprints, nextBlueprint]);
  createExamPublishedNotifications(nextBlueprint);
  return nextBlueprint;
}

export function getReviewerBlueprints() {
  initializeLocalStorage();
  return readJson(REVIEWERS_KEY, []);
}

export function publishReviewerBlueprint(reviewer) {
  const reviewers = getReviewerBlueprints();
  const nextReviewer = {
    ...reviewer,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "published"
  };

  writeJson(REVIEWERS_KEY, [...reviewers, nextReviewer]);
  createPublishedContentNotifications({
    type: "new_reviewer",
    message: `New Reviewer Posted: ${nextReviewer.title || "Untitled Reviewer"}`,
    metadata: { reviewerId: nextReviewer.id }
  });
  return nextReviewer;
}

// ============================================
// NEW ADMIN FUNCTIONS FOR EXAM MANAGEMENT
// ============================================

// Get a single exam by ID for editing
export function getExamBlueprintById(examId) {
  const blueprints = getExamBlueprints();
  return blueprints.find((exam) => exam.id === examId) || null;
}

// Delete an exam by ID
export function deleteExamBlueprint(examId) {
  const blueprints = getExamBlueprints();
  const filtered = blueprints.filter((exam) => exam.id !== examId);
  writeJson(EXAMS_KEY, filtered);
  
  createPublishedContentNotifications({
    type: "exam_deleted",
    message: `An exam has been removed from your available tests.`,
    metadata: { examId }
  });
  
  return filtered;
}

// Hide/Unhide an exam
export function toggleExamVisibility(examId) {
  const blueprints = getExamBlueprints();
  const updated = blueprints.map((exam) => {
    if (exam.id === examId) {
      return { 
        ...exam, 
        isHidden: !exam.isHidden,
        hiddenAt: exam.isHidden ? null : new Date().toISOString()
      };
    }
    return exam;
  });
  writeJson(EXAMS_KEY, updated);
  return updated.find((exam) => exam.id === examId);
}

// Update an existing exam
export function updateExamBlueprint(examId, updates) {
  const blueprints = getExamBlueprints();
  const updated = blueprints.map((exam) => {
    if (exam.id === examId) {
      return {
        ...exam,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    return exam;
  });
  writeJson(EXAMS_KEY, updated);
  
  createPublishedContentNotifications({
    type: "exam_updated",
    message: `"${updates.title || 'An exam'}" has been updated.`,
    metadata: { examId }
  });
  
  return updated.find((exam) => exam.id === examId);
}

// ============================================
// END OF NEW ADMIN FUNCTIONS
// ============================================

export function getDrillBankQuestions() {
  initializeLocalStorage();
  return readJson(DRILL_BANK_KEY, []);
}

export function publishDrillQuestion(question) {
  const drillBank = getDrillBankQuestions();
  const type = question.type || question.questionType || "multiple_choice";
  const category = question.category || question.subjectTitle || "General Practice";
  const subCategory = question.subCategory || question.diagnosticSubcategory || "";
  const weaknessTag = question.weaknessTag || question.diagnosticSkillTag || "";
  const nextQuestion = {
    ...question,
    id: crypto.randomUUID(),
    type,
    questionType: question.questionType || type,
    questionHtml: question.questionHtml || question.stem,
    category,
    subCategory,
    weaknessTag,
    structuralTags: question.structuralTags || {
      category,
      subCategory,
      weaknessTag,
      path: [category, subCategory, weaknessTag].filter(Boolean)
    },
    status: "published",
    createdAt: new Date().toISOString()
  };

  writeJson(DRILL_BANK_KEY, [nextQuestion, ...drillBank]);
  createPublishedContentNotifications({
    type: "new_drill",
    message: `New Drill Posted: ${category}${subCategory ? ` - ${subCategory}` : ""}`,
    metadata: { drillId: nextQuestion.id, category, subCategory, weaknessTag }
  });
  return nextQuestion;
}

export function getDashboardStore() {
  initializeLocalStorage();
  return readJson(DASHBOARD_KEY, {});
}

export function getStudentDashboard(email) {
  const store = getDashboardStore();
  const dashboard = store[email] || createEmptyDashboard(email);
  const normalizedDashboard = normalizeDashboardAnalytics(dashboard, email);

  if (JSON.stringify(dashboard) !== JSON.stringify(normalizedDashboard)) {
    writeJson(DASHBOARD_KEY, { ...store, [email]: normalizedDashboard });
  }

  return normalizedDashboard;
}

export function saveStudentDashboard(email, dashboard) {
  const store = getDashboardStore();
  writeJson(DASHBOARD_KEY, { ...store, [email]: dashboard });
}

export function createEmptyDashboard(email) {
  return {
    student: { email, displayName: "Stanley Mejia" },
    hasDashboardData: false,
    stats: [
      { label: "Latest Mock Score", value: "0%", detail: "No completed exam attempts yet", accent: "blue" },
      { label: "Total Tests Taken", value: "0", detail: "0 completed mock exams", accent: "purple" }
    ],
    progression: [],
    subjects: [],
    exams: [],
    attempts: [],
    studyPlan: getStudyPlanCards(),
    rewards: [],
    aiInsight: null
  };
}

function normalizeDashboardAnalytics(dashboard, email) {
  const exams = Array.isArray(dashboard.exams) ? dashboard.exams : [];
  const attempts = Array.isArray(dashboard.attempts) ? dashboard.attempts : [];
  const attemptsForChart = attempts.length
    ? attempts
    : exams.map((exam, index) => ({
        id: `legacy_attempt_${index + 1}`,
        examTitle: exam.name,
        takenAt: exam.takenAt,
        finalPct: exam.score,
        subjectScores: []
      }));

  const chronologicalAttempts = [...attemptsForChart].reverse();
  const latestAttempt = attemptsForChart[0];
  const progression = chronologicalAttempts.map((attempt, index) => ({
    label: attempt.examTitle || attempt.name || `Mock ${index + 1}`,
    score: Number(attempt.finalPct ?? attempt.score ?? 0),
    takenAt: attempt.takenAt || "",
    examTitle: attempt.examTitle || attempt.name || `Mock ${index + 1}`
  }));

  const latestSubjectScores = Array.isArray(latestAttempt?.subjectScores) ? latestAttempt.subjectScores : [];
  const subjects = latestSubjectScores.length
    ? latestSubjectScores.map((subject) => ({
        name: subject.title || subject.name,
        mastery: Number(subject.pct ?? subject.mastery ?? 0),
        color: Number(subject.pct ?? subject.mastery ?? 0) >= 90 ? "emerald" : Number(subject.pct ?? subject.mastery ?? 0) >= 80 ? "blue" : Number(subject.pct ?? subject.mastery ?? 0) >= 70 ? "amber" : "rose"
      }))
    : dashboard.subjects || [];
  const totalTests = attemptsForChart.length || exams.length;
  const rewardSummary = buildCommunityRewardSummary(email, { ...dashboard, attempts });
  const studyPoints = rewardSummary.totalPoints;
  const placement = getRawLeaderboardPlacement(email, { ...dashboard, attempts });

  return {
    ...dashboard,
    student: dashboard.student || { email, displayName: "Stanley Mejia" },
    hasDashboardData: exams.length > 0 || attemptsForChart.length > 0 || Boolean(dashboard.hasDashboardData),
    stats: [
      {
        label: "Latest Mock Score",
        value: latestAttempt ? `${Number(latestAttempt.finalPct ?? latestAttempt.score ?? 0)}%` : "0%",
        detail: latestAttempt ? `Scored from ${latestAttempt.examTitle || latestAttempt.name || "completed mock exam"}` : "No completed exam attempts yet",
        accent: "blue"
      },
      {
        label: "Total Tests Taken",
        value: String(totalTests),
        detail: `${totalTests} completed mock exam${totalTests === 1 ? "" : "s"}`,
        accent: "purple"
      },
      {
        label: "Leaderboard Placement",
        value: placement.rank ? `#${placement.rank}` : "-",
        detail: placement.total ? `Out of ${placement.total} students` : "No ranked students yet",
        accent: "indigo"
      },
      {
        label: "Study Points",
        value: studyPoints.toLocaleString(),
        detail: "From exams, reviewers, and badges",
        accent: "teal"
      }
    ],
    progression,
    subjects,
    exams,
    attempts
  };
}

function getRawLeaderboardPlacement(email, currentDashboard) {
  const dashboardStore = readJson(DASHBOARD_KEY, {});
  const students = mergeUserAccounts(
    defaultUserAccounts,
    readJson(USER_ACCOUNTS_KEY, defaultUserAccounts)
  ).filter((account) => account.role === "student");

  const rows = students
    .map((student) => {
      const dashboard = student.email === email ? currentDashboard : dashboardStore[student.email] || createEmptyDashboard(student.email);
      return {
        email: student.email,
        points: buildCommunityRewardSummary(student.email, dashboard).totalPoints
      };
    })
    .sort((a, b) => b.points - a.points || a.email.localeCompare(b.email));

  const rank = rows.findIndex((row) => row.email === email) + 1;
  return { rank, total: rows.length };
}

export function saveExamAttemptForStudent(user, blueprint, responses, results, meta = {}) {
  const currentDashboard = getStudentDashboard(user.email);
  const attemptNumber = currentDashboard.exams.length + 1;
  const takenAt = new Date().toISOString().split("T")[0];
  const durationSeconds = Number(meta.durationSeconds || 0);
  const earnedMockPoints = calculateAttemptPoints(results.finalPct, durationSeconds);

  const exams = [
    { name: blueprint.title, takenAt, score: results.finalPct, status: "Analyzed" },
    ...currentDashboard.exams
  ];

  const attempts = [
    {
      id: crypto.randomUUID(),
      examId: blueprint.id,
      examTitle: blueprint.title,
      takenAt,
      finalPct: results.finalPct,
      earnedMockPoints,
      durationSeconds,
      subjectScores: results.subjectScores,
      itemDiagnostics: results.itemDiagnostics || []
    },
    ...(currentDashboard.attempts || [])
  ];

  const progression = [...attempts].reverse().map((attempt, index) => ({
    label: attempt.examTitle || `Mock ${index + 1}`,
    score: Number(attempt.finalPct || 0),
    takenAt: attempt.takenAt,
    examTitle: attempt.examTitle || `Mock ${index + 1}`
  }));
  const subjects = results.subjectScores.map((subject) => ({
    name: subject.title,
    mastery: subject.pct,
    color: subject.pct >= 90 ? "emerald" : subject.pct >= 80 ? "blue" : subject.pct >= 70 ? "amber" : "rose"
  }));

  const studyPlan = getStudyPlanCards().map((item, index) => {
    const weakness = results.weaknesses[index % Math.max(1, results.weaknesses.length)];
    if (!weakness) return item;
    return {
      ...item,
      title: `${item.title}: ${weakness.title} Recovery`,
      detail: `Focus on ${weakness.topicFocus}. ${item.detail}`,
      status: index === 0 ? "today" : item.status
    };
  });
  const rewardSummary = buildCommunityRewardSummary(user.email, { ...currentDashboard, attempts });
  const placement = getRawLeaderboardPlacement(user.email, { ...currentDashboard, attempts });

  const nextDashboard = {
    ...currentDashboard,
    hasDashboardData: true,
    stats: [
      { label: "Latest Mock Score", value: `${results.finalPct}%`, detail: `Scored from ${blueprint.title}`, accent: "blue" },
      { label: "Total Tests Taken", value: String(exams.length), detail: `${exams.length} completed mock exam${exams.length === 1 ? "" : "s"}`, accent: "purple" },
      { label: "Leaderboard Placement", value: placement.rank ? `#${placement.rank}` : "-", detail: placement.total ? `Out of ${placement.total} students` : "No ranked students yet", accent: "indigo" },
      { label: "Study Points", value: rewardSummary.totalPoints.toLocaleString(), detail: "From exams, reviewers, and badges", accent: "teal" }
    ],
    progression,
    subjects,
    exams,
    attempts,
    studyPlan,
    rewards: [{ title: `${attemptNumber} Mock${attemptNumber === 1 ? "" : "s"} Completed`, description: "Earned from completed localStorage-tracked exams.", points: earnedMockPoints }],
    aiInsight: results.weaknesses.length
      ? { title: `AI Deep Dive: ${results.weaknesses[0].title}`, priority: "Priority Intervention Required", detail: `Your latest attempt showed lower mastery in ${results.weaknesses[0].topicFocus}.` }
      : { title: "AI Deep Dive: Strong Performance", priority: "Maintenance Mode", detail: "You scored above the intervention threshold across all MCQ subjects." }
  };

  saveStudentDashboard(user.email, nextDashboard);
  return nextDashboard;
}

export function saveAiDiagnosticForLatestAttempt(email, diagnostic) {
  const dashboard = getStudentDashboard(email);
  const attempts = Array.isArray(dashboard.attempts) ? dashboard.attempts : [];
  if (!attempts.length) return dashboard;

  const nextAttempts = attempts.map((attempt, index) => (
    index === 0
      ? {
          ...attempt,
          aiDiagnostic: diagnostic,
          aiDiagnosticGeneratedAt: new Date().toISOString()
        }
      : attempt
  ));

  const nextDashboard = {
    ...dashboard,
    attempts: nextAttempts,
    aiInsight: diagnostic?.weakness_paragraph
      ? {
          title: "AI Deep Dive: Adaptive Diagnostic",
          priority: diagnostic.percentage_score < 75 ? "Priority Intervention Required" : "Maintenance Mode",
          detail: diagnostic.weakness_paragraph
        }
      : dashboard.aiInsight
  };

  saveStudentDashboard(email, nextDashboard);
  return getStudentDashboard(email);
}

export function scoreBlueprintAttempt(blueprint, responses, meta = {}) {
  let earnedPoints = 0;
  let totalPoints = 0;
  let correct = 0;
  let total = 0;
  const itemDiagnostics = [];

  const subjectScores = blueprint.sections.map((section, sectionIndex) => {
    const sectionResponses = responses[sectionIndex] || [];
    let sectionCorrect = 0;
    let sectionTotal = 0;
    let sectionEarnedPoints = 0;
    let sectionTotalPoints = 0;

    section.questions.forEach((question, questionIndex) => {
      const points = Number(question.points || 1);
      const response = sectionResponses[questionIndex];
      const correctItem = isCorrectAnswer(question, response);
      sectionTotal += 1;
      total += 1;
      sectionTotalPoints += points;
      totalPoints += points;

      if (correctItem) {
        sectionCorrect += 1;
        correct += 1;
        sectionEarnedPoints += points;
        earnedPoints += points;
      }

      itemDiagnostics.push(
        buildItemDiagnostic({
          section,
          question,
          response,
          isCorrect: correctItem,
          metrics: meta.questionMetrics?.[sectionIndex]?.[questionIndex]
        })
      );
    });

    return {
      title: section.subjectTitle,
      correct: sectionCorrect,
      total: sectionTotal,
      earnedPoints: sectionEarnedPoints,
      totalPoints: sectionTotalPoints,
      pct: sectionTotalPoints ? Math.round((sectionEarnedPoints / sectionTotalPoints) * 100) : 0
    };
  });

  const finalPct = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const weaknesses = subjectScores.filter((subject) => subject.total > 0 && subject.pct < 80).map((subject) => ({ ...subject, topicFocus: subject.title }));
  return { finalPct, correct, total, earnedPoints, totalPoints, targetScore: Math.min(100, finalPct + 12), subjectScores, weaknesses, itemDiagnostics };
}

export function getWeaknessAnalysis(email, threshold = 75) {
  const dashboard = getStudentDashboard(email);
  const attempts = dashboard.attempts || [];
  if (!attempts.length && !dashboard.subjects.length) return { hasAttempts: false, weakSubjects: [], diagnosticInsights: [] };

  const subjectMap = new Map();
  attempts.forEach((attempt) => {
    attempt.subjectScores?.forEach((subject) => {
      const current = subjectMap.get(subject.title) || { subject: subject.title, totalPct: 0, count: 0, lowestPct: 100 };
      current.totalPct += subject.pct;
      current.count += 1;
      current.lowestPct = Math.min(current.lowestPct, subject.pct);
      subjectMap.set(subject.title, current);
    });
  });

  if (!subjectMap.size) {
    dashboard.subjects.forEach((subject) => subjectMap.set(subject.name, { subject: subject.name, totalPct: subject.mastery, count: 1, lowestPct: subject.mastery }));
  }

  const ranked = [...subjectMap.values()].map((item) => ({ subject: item.subject, averagePct: Math.round(item.totalPct / item.count), lowestPct: item.lowestPct })).sort((a, b) => a.averagePct - b.averagePct);
  const weakSubjects = ranked.filter((item) => item.averagePct < threshold);
  const diagnosticInsights = buildDiagnosticInsights(attempts);
  return { hasAttempts: true, weakSubjects: weakSubjects.length ? weakSubjects : ranked.slice(0, 1), diagnosticInsights, primaryDiagnostic: diagnosticInsights[0] || null };
}

export function getQuestionsForSubject(subjectName, limit = 10, diagnosticFocus = null) {
  const normalizedSubject = subjectName.toLowerCase();
  const questions = getDrillBankQuestions()
    .filter((question) => question.subjectTitle?.toLowerCase() === normalizedSubject)
    .map((question) => {
      const section = { subjectTitle: question.subjectTitle };
      const diagnosticTags = getDiagnosticTags(section, question);
      return { ...question, ...diagnosticTags, explanation: question.explanation || buildExplanation(question) };
    });

  return questions
    .sort((a, b) => getDiagnosticMatchScore(b, diagnosticFocus) - getDiagnosticMatchScore(a, diagnosticFocus))
    .slice(0, limit);
}

export function scoreDrillAttempt(questions, responses) {
  let correct = 0;
  const items = questions.map((question, index) => {
    const isCorrect = isCorrectAnswer(question, responses[index]);
    if (isCorrect) correct += 1;
    return { question, response: responses[index], isCorrect, explanation: question.explanation || buildExplanation(question) };
  });
  return { correct, total: questions.length, pct: questions.length ? Math.round((correct / questions.length) * 100) : 0, items };
}

export function getReviewerProgress(email) {
  initializeLocalStorage();
  const progress = readJson(REVIEWER_PROGRESS_KEY, {});
  return progress[email] || {};
}

export function markReviewerModuleComplete(email, reviewerId, moduleId) {
  return setReviewerModuleCompletion(email, reviewerId, moduleId, true);
}

export function setReviewerModuleCompletion(email, reviewerId, moduleId, completed) {
  const progress = readJson(REVIEWER_PROGRESS_KEY, {});
  const userProgress = progress[email] || {};
  const moduleSet = new Set(userProgress[reviewerId] || []);
  if (completed) moduleSet.add(moduleId);
  else moduleSet.delete(moduleId);
  const nextProgress = { ...progress, [email]: { ...userProgress, [reviewerId]: [...moduleSet] } };
  writeJson(REVIEWER_PROGRESS_KEY, nextProgress);
  return nextProgress[email];
}

export function getCommunityRewardSummary(email) {
  const dashboard = getStudentDashboard(email);
  return buildCommunityRewardSummary(email, dashboard);
}

function buildCommunityRewardSummary(email, dashboard) {
  const exams = getExamBlueprints();
  const reviewers = getReviewerBlueprints();
  const progress = getReviewerProgress(email);
  const attempts = dashboard.attempts || [];
  const uniqueCompletedExams = new Set(attempts.map((attempt) => attempt.examId).filter(Boolean));
  const mockPoints = attempts.reduce((sum, attempt) => sum + Number(attempt.earnedMockPoints || calculateAttemptPoints(attempt.finalPct, attempt.durationSeconds)), 0);
  const reviewerModules = reviewers.flatMap((reviewer) => reviewer.modules.map((module) => ({ reviewerId: reviewer.id, moduleId: module.id })));
  const completedReviewerModules = reviewerModules.filter((module) => progress[module.reviewerId]?.includes(module.moduleId));
  const reviewerPoints = completedReviewerModules.length * 75;
  const examCompletionist = exams.length > 0 && uniqueCompletedExams.size >= exams.length;
  const reviewerMaster = reviewerModules.length > 0 && completedReviewerModules.length >= reviewerModules.length;
  const speedDemon = hasSpeedDemonAttempt(attempts);

  const badges = [
    examCompletionist && { title: "Exam Completionist", description: "Finished all available mock exams.", points: 500 },
    reviewerMaster && { title: "Reviewer Master", description: "Completed every published reviewer module.", points: 400 },
    speedDemon && { title: "Speed Demon", description: "Finished an exam far faster than the current average.", points: 350 }
  ].filter(Boolean);

  const badgePoints = badges.reduce((sum, badge) => sum + badge.points, 0);
  const totalPoints = mockPoints + reviewerPoints + badgePoints;

  return {
    totalPoints,
    mockPoints,
    reviewerPoints,
    badgePoints,
    badges,
    tier: getRewardTier(totalPoints),
    completedReviewerModules: completedReviewerModules.length,
    totalReviewerModules: reviewerModules.length,
    completedExams: uniqueCompletedExams.size,
    totalExams: exams.length,
    latestScore: attempts[0]?.finalPct || 0
  };
}

export function getLeaderboard(currentEmail) {
  const students = getUsers().filter((user) => user.role === "student");
  const rows = students.map((student) => {
    const summary = getCommunityRewardSummary(student.email);
    return { id: student.id, email: student.email, name: student.name, totalPoints: summary.totalPoints, latestScore: summary.latestScore, isCurrent: student.email === currentEmail };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export function getForumThreads() {
  initializeLocalStorage();
  return readJson(FORUM_KEY, defaultForumThreads).map(normalizeForumThread).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createForumThread(user, payload) {
  const threads = getForumThreads();
  const nextThread = normalizeForumThread({
    id: crypto.randomUUID(),
    title: payload.title,
    body: payload.body,
    tag: payload.tag,
    author: getUserDisplayName(user),
    authorId: user?.id,
    authorEmail: user?.email,
    createdAt: new Date().toISOString(),
    replies: []
  });
  writeJson(FORUM_KEY, [nextThread, ...threads]);
  window.dispatchEvent(new CustomEvent("forumPostsUpdated", { detail: nextThread }));
  return nextThread;
}

export function addForumReply(user, threadId, body) {
  const threads = getForumThreads();
  let targetThread = null;
  const reply = { id: crypto.randomUUID(), author: getUserDisplayName(user), authorId: user?.id, authorEmail: user?.email, body, createdAt: new Date().toISOString() };
  const updated = threads.map((thread) => {
    if (thread.id !== threadId) return thread;
    targetThread = thread;
    return { ...thread, replies: [...(thread.replies || []), reply] };
  });
  writeJson(FORUM_KEY, updated);
  if (targetThread?.authorId && targetThread.authorId !== user?.id) {
    createNotification({
      userId: targetThread.authorId,
      type: "new_reply",
      message: `${reply.author} replied to your post: ${targetThread.title}`,
      metadata: { threadId, replyId: reply.id }
    });
  }
  window.dispatchEvent(new CustomEvent("forumPostsUpdated", { detail: { threadId, reply } }));
  return reply;
}

export function toggleForumReaction(threadId, reactionType, userId) {
  const threads = getForumThreads();
  let targetThread = null;
  let activeAfterToggle = false;
  const updated = threads.map((thread) => {
    if (thread.id !== threadId) return thread;
    targetThread = thread;
    const reactions = normalizeReactions(thread.reactions);
    const reaction = reactions[reactionType] || { count: 0, userIds: [] };
    const userIds = reaction.userIds || [];
    const active = userIds.includes(userId);
    const nextUserIds = active ? userIds.filter((id) => id !== userId) : [...userIds, userId];
    activeAfterToggle = !active;
    return {
      ...thread,
      reactions: {
        ...reactions,
        [reactionType]: {
          count: Math.max(0, Number(reaction.count || 0) + (active ? -1 : 1)),
          userIds: nextUserIds
        }
      }
    };
  });
  writeJson(FORUM_KEY, updated);
  if (activeAfterToggle && targetThread?.authorId && targetThread.authorId !== userId) {
    createNotification({
      userId: targetThread.authorId,
      type: "post_reaction",
      message: `Someone reacted to your post: ${targetThread.title}`,
      metadata: { threadId, reactionType }
    });
  }
  window.dispatchEvent(new CustomEvent("forumPostsUpdated"));
  return updated.find((thread) => thread.id === threadId);
}

export function getNotificationsForUser(userId) {
  initializeLocalStorage();
  return readJson(NOTIFICATIONS_KEY, [])
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
}

export function markNotificationsRead(userId, notificationId = null) {
  const notifications = readJson(NOTIFICATIONS_KEY, []);
  const updated = notifications.map((notification) => {
    const matchesUser = notification.userId === userId;
    const matchesItem = !notificationId || notification.id === notificationId;
    return matchesUser && matchesItem ? { ...notification, isRead: true } : notification;
  });
  writeJson(NOTIFICATIONS_KEY, updated);
  window.dispatchEvent(new CustomEvent("notificationsUpdated"));
  return updated.filter((notification) => notification.userId === userId);
}

function createExamPublishedNotifications(exam) {
  createPublishedContentNotifications({
    type: "new_exam",
    message: `New Exam Posted: ${exam.title || "Untitled Mock Exam"}`,
    metadata: { examId: exam.id }
  });
}

function createPublishedContentNotifications({ type, message, metadata = {} }) {
  const students = getUserAccounts().filter((account) => account.role === "student");
  students.forEach((student) => {
    createNotification({
      userId: student.id,
      type,
      message,
      metadata
    });
  });
}

function removeSeededForumUsers() {
  const threads = readJson(FORUM_KEY, []);
  const filtered = threads
    .map((thread) => ({
      ...thread,
      replies: (thread.replies || []).filter((reply) => !["User#4410", "User#8821"].includes(reply.author))
    }))
    .filter((thread) => !["User#4410", "User#8821"].includes(thread.author));

  if (filtered.length !== threads.length || JSON.stringify(filtered) !== JSON.stringify(threads)) {
    writeJson(FORUM_KEY, filtered);
  }
}

function createNotification({ userId, type, message, metadata = {} }) {
  if (!userId) return null;
  const notifications = readJson(NOTIFICATIONS_KEY, []);
  const nextNotification = {
    id: crypto.randomUUID(),
    userId,
    type,
    message,
    isRead: false,
    timestamp: Date.now(),
    metadata
  };
  writeJson(NOTIFICATIONS_KEY, [nextNotification, ...notifications]);
  window.dispatchEvent(new CustomEvent("notificationsUpdated", { detail: nextNotification }));
  return nextNotification;
}

function calculateAttemptPoints(finalPct, durationSeconds = 0) {
  const base = Math.round(Number(finalPct || 0) * 10);
  const speedBonus = durationSeconds > 0 && durationSeconds < 600 ? 100 : 0;
  return base + speedBonus;
}

function hasSpeedDemonAttempt(attempts) {
  const timedAttempts = attempts.filter((attempt) => Number(attempt.durationSeconds) > 0);
  if (!timedAttempts.length) return false;
  const average = timedAttempts.reduce((sum, attempt) => sum + Number(attempt.durationSeconds), 0) / timedAttempts.length;
  return timedAttempts.some((attempt) => Number(attempt.durationSeconds) <= average * 0.65 || Number(attempt.durationSeconds) < 600);
}

function getRewardTier(points) {
  if (points >= 5000) return { label: "Magis Elite", percent: 100, color: "bg-yellow-500" };
  if (points >= 2500) return { label: "Blue Eagle", percent: 75, color: "bg-blue-600" };
  if (points >= 1000) return { label: "Rising Scholar", percent: 45, color: "bg-emerald-500" };
  return { label: "Getting Started", percent: 18, color: "bg-slate-400" };
}

function buildExplanation(question) {
  const type = question.type || "multiple_choice";
  if (type === "checkboxes") {
    const answers = (question.correctAnswers || []).map((index) => question.choiceOpts?.[index]).filter(Boolean).join(", ");
    return `Correct answer(s): ${answers || "No answer key provided"}. Review the source material for this category.`;
  }
  if (type === "short_answer") return `Expected answer: ${question.correctText || "No answer key provided"}.`;
  const answer = question.choiceOpts?.[Number(question.answerIdx ?? 0)];
  return `Correct answer: ${answer || "No answer key provided"}. Revisit this concept before your next mock.`;
}

function buildItemDiagnostic({ section, question, response, isCorrect, metrics = {} }) {
  const tags = getDiagnosticTags(section, question);
  const answerEvents = metrics.answerEvents || [];
  const timeSpentMs = Number(metrics.timeSpentMs || 0);
  const lastAnswerAtMs = Number(answerEvents.at(-1)?.elapsedMs || 0);
  const responseDurationSeconds = Math.round(Math.max(timeSpentMs, lastAnswerAtMs) / 1000);
  const changedCorrectToIncorrect = answerEvents.some((event) => {
    if (event.from === null || event.from === undefined || event.to === null || event.to === undefined) return false;
    const wasCorrect = isCorrectAnswer(question, event.from);
    const becameIncorrect = !isCorrectAnswer(question, event.to);
    const lastSecondWindow = !responseDurationSeconds || Number(event.elapsedMs || 0) >= responseDurationSeconds * 1000 - 15000;
    return wasCorrect && becameIncorrect && lastSecondWindow;
  });

  return {
    ...tags,
    responseDurationSeconds,
    isCorrect,
    errorFlag: !isCorrect,
    changedCorrectToIncorrect,
    changedAnswerCount: Math.max(0, answerEvents.length - 1),
    questionType: question.type || "multiple_choice"
  };
}

function getDiagnosticTags(section, question) {
  const category = cleanLabel(question.category || question.subjectTitle || section.subjectTitle, "General Practice");
  const subcategory = cleanLabel(question.diagnosticSubcategory || question.subCategory || question.subcategory || question.topic, inferSubcategory(question));
  const skillTag = cleanLabel(question.diagnosticSkillTag || question.skillTag || question.tag || normalizeTags(question.tags), inferSkillTag(question));
  const path = [category, subcategory, skillTag].filter(Boolean);
  return {
    category,
    subcategory,
    skillTag,
    path,
    pathLabel: path.join(" -> ")
  };
}

function getDiagnosticMatchScore(question, diagnosticFocus) {
  if (!diagnosticFocus) return 0;
  let score = 0;
  if (question.category === diagnosticFocus.category) score += 1;
  if (question.subcategory === diagnosticFocus.subcategory) score += 3;
  if (question.skillTag === diagnosticFocus.skillTag) score += 5;
  return score;
}

function buildDiagnosticInsights(attempts) {
  const items = attempts.flatMap((attempt) => attempt.itemDiagnostics || []);
  if (!items.length) return [];

  const timedItems = items.filter((item) => Number(item.responseDurationSeconds) > 0);
  const globalAverageSeconds = timedItems.length
    ? timedItems.reduce((sum, item) => sum + Number(item.responseDurationSeconds || 0), 0) / timedItems.length
    : 0;
  const slowThreshold = Math.max(75, globalAverageSeconds * 1.25);
  const groups = new Map();

  items.forEach((item) => {
    const key = item.pathLabel || item.category;
    const group = groups.get(key) || {
      ...item,
      attempts: 0,
      errors: 0,
      durationTotal: 0,
      timedCount: 0,
      changedCorrectToIncorrect: 0
    };
    group.attempts += 1;
    if (item.errorFlag) group.errors += 1;
    if (Number(item.responseDurationSeconds) > 0) {
      group.durationTotal += Number(item.responseDurationSeconds);
      group.timedCount += 1;
    }
    if (item.changedCorrectToIncorrect) group.changedCorrectToIncorrect += 1;
    groups.set(key, group);
  });

  return [...groups.values()]
    .map((group) => {
      const averageSeconds = group.timedCount ? Math.round(group.durationTotal / group.timedCount) : 0;
      const errorRate = group.attempts ? group.errors / group.attempts : 0;
      const hasRepeatedErrors = group.errors >= 2 || errorRate >= 0.5;
      const hasTimeBottleneck = hasRepeatedErrors && averageSeconds >= slowThreshold;
      const hasSelfDoubt = group.changedCorrectToIncorrect >= 2 || (group.changedCorrectToIncorrect >= 1 && group.errors <= 2);

      let insightType = "accuracy";
      if (hasSelfDoubt) insightType = "self-doubt";
      else if (hasTimeBottleneck) insightType = "time-bottleneck";

      return {
        ...group,
        averageSeconds,
        averageMinutes: Number((averageSeconds / 60).toFixed(1)),
        errorRate,
        insightType,
        priorityScore: group.errors * 3 + group.changedCorrectToIncorrect * 4 + (hasTimeBottleneck ? 3 : 0)
      };
    })
    .filter((group) => group.errors > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);
}

function cleanLabel(value, fallback = "") {
  const label = String(value || "").trim();
  return label || fallback;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.filter(Boolean).join(", ");
  return tags;
}

function inferSubcategory(question) {
  if (question.type === "checkboxes") return "Multi-select Reasoning";
  if (question.type === "short_answer") return "Constructed Response";
  if (question.type === "paragraph") return "Written Explanation";
  return "Core Concept";
}

function inferSkillTag(question) {
  const stem = String(question.stem || "").toLowerCase();
  if (stem.includes("not") || stem.includes("except") || stem.includes("false")) return "Negative Wording";
  if (stem.includes("therefore") || stem.includes("conclude") || stem.includes("follows")) return "Logical Inference";
  return "Untyped Skill";
}

function isCorrectAnswer(question, response) {
  const type = question.type || "multiple_choice";
  if (type === "mcq" || type === "multiple_choice") return response === Number(question.answerIdx ?? 0);
  if (type === "checkboxes") {
    const expected = [...(question.correctAnswers || [])].map(Number).sort().join(",");
    const actual = [...(response || [])].map(Number).sort().join(",");
    return expected === actual;
  }
  if (type === "short_answer" || type === "paragraph") {
    const expected = String(question.correctText || "").trim().toLowerCase();
    const actual = String(response || "").trim().toLowerCase();
    return expected.length > 0 && actual === expected;
  }
  return false;
}