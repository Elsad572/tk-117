import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAu-k4uvpjsHitiKwhbE3D_HKJ_Sxt-l9A",
  authDomain: "tk-117-2ca94.firebaseapp.com",
  projectId: "tk-117-2ca94",
  storageBucket: "tk-117-2ca94.firebasestorage.app",
  messagingSenderId: "136903588293",
  appId: "1:136903588293:web:271df16698dc4b58cb33ac",
  measurementId: "G-LZQESYMFQF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Modal açmaq funksiyası
function openStudentModal(name, data) {
    const modal = document.getElementById('historyModal');
    const modalName = document.getElementById('modalStudentName');
    const modalDetails = document.getElementById('modalDetails');
    if (!modal) return;

    modalName.textContent = name;
    modalDetails.innerHTML = '';

    const weeks = data.weeks || {};
    const weekKeys = Object.keys(weeks).sort((a,b) => a - b);

    if (weekKeys.length === 0) {
        modalDetails.innerHTML = '<p style="color:#8b949e;">Məlumat yoxdur.</p>';
    } else {
        weekKeys.forEach(w => {
            const item = document.createElement('div');
            item.className = 'week-item';
            item.innerHTML = `<strong>${w}-ci həftə:</strong> C++: ${weeks[w].cpp || 0} pt | Python: ${weeks[w].python || 0} pt`;
            modalDetails.appendChild(item);
        });
    }
    modal.style.display = 'flex';
}

const closeModal = document.getElementById('closeModal');
if (closeModal) {
    closeModal.onclick = () => document.getElementById('historyModal').style.display = 'none';
}

// Siyahıları yükləmək
function loadLeaderboard(type, elementId) {
    const listEl = document.getElementById(elementId);
    if (!listEl) return;

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        let students = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            let score = 0;
            if (type === 'common') score = (data.totalCpp || 0) + (data.totalPython || 0);
            if (type === 'cpp') score = data.totalCpp || 0;
            if (type === 'python') score = data.totalPython || 0;

            students.push({ id: doc.id, name: data.name || doc.id, score, data });
        });

        students.sort((a,b) => b.score - a.score);

        let rank = 1;
        students.forEach(st => {
            const li = document.createElement('li');
            li.className = 'student-row';
            li.innerHTML = `<span>${rank}</span><span>${st.name}</span><span><strong>${st.score} pt</strong></span>`;
            li.onclick = () => openStudentModal(st.name, st.data);
            listEl.appendChild(li);
            rank++;
        });
    });
}

loadLeaderboard('common', 'commonList');
loadLeaderboard('cpp', 'cppList');
loadLeaderboard('python', 'pythonList');

// Admin Təyin edilmiş məlumatlar
const ADMINS = {
    "Elsad": "elsad_29822",
    "Aytac": "aytac_35723"
};

const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('adminUsername').value.trim();
        const pass = document.getElementById('adminPassword').value.trim();

        if (ADMINS[user] && ADMINS[user] === pass) {
            localStorage.setItem('adminUser', user);
            checkAuth();
            alert("Uğurla daxil oldunuz!");
        } else {
            alert("İstifadəçi adı və ya şifrə yanlışdır!");
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminUser');
        checkAuth();
    });
}

function checkAuth() {
    if (!loginSection || !adminPanel) return;
    if (localStorage.getItem('adminUser')) {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
    } else {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
    }
}
checkAuth();

// Bal əlavə etmək (Həftəlik sistem)
const addStudentForm = document.getElementById('addStudentForm');
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value.trim();
        const week = document.getElementById('weekNum').value;
        const cpp = Number(document.getElementById('cppPoints').value);
        const python = Number(document.getElementById('pythonPoints').value);

        const docRef = doc(db, "students", name);
        const docSnap = await getDoc(docRef);

        let studentData = { name: name, weeks: {}, totalCpp: 0, totalPython: 0 };
        if (docSnap.exists()) {
            studentData = docSnap.data();
            if (!studentData.weeks) studentData.weeks = {};
        }

        studentData.weeks[week] = { cpp: cpp, python: python };

        // Ümumi balları hesablamaq
        let tCpp = 0, tPy = 0;
        Object.values(studentData.weeks).forEach(w => {
            tCpp += (w.cpp || 0);
            tPy += (w.python || 0);
        });

        studentData.totalCpp = tCpp;
        studentData.totalPython = tPy;

        try {
            await setDoc(docRef, studentData);
            addStudentForm.reset();
            alert(`${week}-ci həftə balı uğurla əlavə olundu!`);
        } catch (err) {
            alert("Xəta: " + err.message);
        }
    });
}
