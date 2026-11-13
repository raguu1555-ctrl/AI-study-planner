let subjects = [];

let timer;
let timeLeft = 25 * 60;
let timerRunning = false;


/* -----------------------------
   ADD SUBJECT
----------------------------- */

function addSubject() {

    const name = document.getElementById("subjectName").value;
    const examDate = document.getElementById("examDate").value;
    const difficulty = Number(
        document.getElementById("difficulty").value
    );
    const hours = Number(
        document.getElementById("studyHours").value
    );

    if (name === "" || examDate === "" || hours === 0) {
        alert("Please fill all the subject details.");
        return;
    }

    const subject = {
        id: Date.now(),
        name: name,
        examDate: examDate,
        difficulty: difficulty,
        hours: hours
    };

    subjects.push(subject);

    displaySubjects();
    updateDashboard();

    document.getElementById("subjectName").value = "";
    document.getElementById("examDate").value = "";
    document.getElementById("studyHours").value = "";
}


/* -----------------------------
   DISPLAY SUBJECTS
----------------------------- */

function displaySubjects() {

    const list = document.getElementById("subjectList");

    list.innerHTML = "";

    subjects.forEach(subject => {

        const difficultyText =
            subject.difficulty === 3
                ? "Hard"
                : subject.difficulty === 2
                ? "Medium"
                : "Easy";

        const card = document.createElement("div");

        card.className = "subject-card";

        card.innerHTML = `
            <div class="subject-info">
                <h3>${subject.name}</h3>

                <p>
                    📅 Exam: ${formatDate(subject.examDate)}
                </p>

                <p>
                    📈 Difficulty: ${difficultyText}
                </p>

                <p>
                    ⏱️ Available Study Time: ${subject.hours} hours
                </p>
            </div>

            <button
                class="delete-btn"
                onclick="deleteSubject(${subject.id})">
                Delete
            </button>
        `;

        list.appendChild(card);
    });
}


/* -----------------------------
   DELETE SUBJECT
----------------------------- */

function deleteSubject(id) {

    subjects = subjects.filter(subject => subject.id !== id);

    displaySubjects();
    updateDashboard();
}


/* -----------------------------
   FORMAT DATE
----------------------------- */

function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


/* -----------------------------
   CALCULATE DAYS LEFT
----------------------------- */

function getDaysLeft(examDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const exam = new Date(examDate);

    exam.setHours(0, 0, 0, 0);

    const difference =
        exam.getTime() - today.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


/* -----------------------------
   UPDATE DASHBOARD
----------------------------- */

function updateDashboard() {

    document.getElementById("subjectCount").textContent =
        subjects.length;

    let total = 0;

    subjects.forEach(subject => {
        total += subject.hours;
    });

    document.getElementById("totalHours").textContent =
        total;

    document.getElementById("completedTasks").textContent =
        0;

    document.getElementById("progress").textContent =
        "0%";
}


/* -----------------------------
   GENERATE AI STUDY PLAN
----------------------------- */

function generatePlan() {

    const plan = document.getElementById("studyPlan");

    plan.innerHTML = "";

    if (subjects.length === 0) {

        plan.innerHTML = `
            <div class="plan-card">
                <h3>⚠️ No subjects added</h3>

                <p>
                    Please add at least one subject
                    to generate your study plan.
                </p>
            </div>
        `;

        return;
    }


    /*
       Priority calculation:

       Higher difficulty = higher priority
       Fewer days remaining = higher priority
       More study hours = higher priority
    */

    const sortedSubjects = [...subjects].sort(
        (a, b) => {

            const daysA = Math.max(
                getDaysLeft(a.examDate),
                1
            );

            const daysB = Math.max(
                getDaysLeft(b.examDate),
                1
            );

            const scoreA =
                (a.difficulty * 10) +
                (100 / daysA) +
                (a.hours * 2);

            const scoreB =
                (b.difficulty * 10) +
                (100 / daysB) +
                (b.hours * 2);

            return scoreB - scoreA;
        }
    );


    sortedSubjects.forEach((subject, index) => {

        const daysLeft =
            getDaysLeft(subject.examDate);

        const difficultyText =
            subject.difficulty === 3
                ? "Hard"
                : subject.difficulty === 2
                ? "Medium"
                : "Easy";


        let recommendation = "";

        if (daysLeft <= 3) {

            recommendation =
                "High priority. Revise this subject daily.";

        } else if (daysLeft <= 7) {

            recommendation =
                "Important. Study this subject regularly.";

        } else {

            recommendation =
                "Maintain steady progress on this subject.";
        }


        const card =
            document.createElement("div");

        card.className = "plan-card";

        card.innerHTML = `

            <span class="priority">
                Priority ${index + 1}
            </span>

            <h3>
                ${subject.name}
            </h3>

            <p>
                📅 Exam:
                ${formatDate(subject.examDate)}
            </p>

            <p>
                ⏳ Days Remaining:
                ${daysLeft > 0 ? daysLeft : 0}
            </p>

            <p>
                📈 Difficulty:
                ${difficultyText}
            </p>

            <p>
                ⏱️ Recommended Study Time:
                ${subject.hours} hours
            </p>

            <p>
                🤖 AI Recommendation:
                ${recommendation}
            </p>

        `;

        plan.appendChild(card);
    });
}


/* -----------------------------
   SCROLL TO SUBJECTS
----------------------------- */

function scrollToSubjects() {

    document.getElementById("subjects")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* -----------------------------
   POMODORO TIMER
----------------------------- */

function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    document.getElementById("timerDisplay")
        .textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
}


function startTimer() {

    if (timerRunning) {
        return;
    }

    timerRunning = true;

    timer = setInterval(() => {

        if (timeLeft <= 0) {

            clearInterval(timer);

            timerRunning = false;

            alert("🎉 Focus session completed!");

            timeLeft = 25 * 60;

            updateTimerDisplay();

            return;
        }

        timeLeft--;

        updateTimerDisplay();

    }, 1000);
}


function pauseTimer() {

    clearInterval(timer);

    timerRunning = false;
}


function resetTimer() {

    clearInterval(timer);

    timerRunning = false;

    timeLeft = 25 * 60;

    updateTimerDisplay();
}


updateTimerDisplay();
updateDashboard();
