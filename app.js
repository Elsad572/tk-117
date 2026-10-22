import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

// Üç Xətt Menyu Açıb-Bağlamaq
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => navMenu.classList.remove('active'));
}

// Məlumat Modalı
const infoTabBtn = document.getElementById('infoTabBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoModal = document.getElementById('closeInfoModal');

if (infoTabBtn && infoModal) {
    infoTabBtn.onclick = () => { infoModal.style.display = 'flex'; };
}
if (closeInfoModal && infoModal) {
    closeInfoModal.onclick = () => { infoModal.style.display = 'none'; };
}

// IT Lüğəti Məlumatları
const IT_DICTIONARY = [
    { term: "Algorithm", az: "Alqoritm", tr: "Algoritma", ru: "Алгоритм" },
    { term: "Array", az: "Massiv", tr: "Dizi", ru: "Массив" },
    { term: "Compiler", az: "Kompilyator", tr: "Derleyici", ru: "Компилятор" },
    { term: "Function", az: "Funksiya", tr: "Fonksiyon", ru: "Функция" },
    { term: "Pointer", az: "Göstərici", tr: "İşaretçi", ru: "Указатель" },
    { term: "Recursion", az: "Rekursiya", tr: "Özyineleme", ru: "Рекурсия" },
    { term: "Variable", az: "Dəyişən", tr: "Değişken", ru: "Переменная" }
];

const dictBtn = document.getElementById('dictionaryBtn');
const dictModal = document.getElementById('dictModal');
const closeDictModal = document.getElementById('closeDictModal');
const dictList = document.getElementById('dictList');

function renderDict() {
    if (!dictList) return;
    dictList.innerHTML = "";
    IT_DICTIONARY.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dict-item';
        div.innerHTML = `<div class="dict-term">🇬🇧 ${item.term}</div><div class="dict-trans"><span>🇦🇿 AZ: ${item.az}</span><span>🇹🇷 TR: ${item.tr}</span><span>🇷🇺 RU: ${item.ru}</span></div>`;
        dictList.appendChild(div);
    });
}
if (dictBtn) dictBtn.onclick = () => { renderDict(); dictModal.style.display = 'flex'; };
if (closeDictModal) closeDictModal.onclick = () => dictModal.style.display = 'none';

// Modal - Həftəlik Bal Cədvəli
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
        let tableHTML = `
            <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-size:14px; text-align:center;">
                <thead>
                    <tr style="border-bottom: 2px solid #30363d; color: #8b949e;">
                        <th style="padding: 8px;">Həftə</th>
                        <th style="padding: 8px; color:#2ea44f;">C++ Bal</th>
                        <th style="padding: 8px; color:#2ea44f;">Python Bal</th>
                    </tr>
                </thead>
                <tbody>
        `;
        weekKeys.forEach(w => {
            tableHTML += `<tr style="border-bottom: 1px solid #21262d;"><td style="padding: 8px; font-weight:bold;">${w}-ci həftə</td><td style="padding: 8px;">${weeks[w].cpp || 0} pt</td><td style="padding: 8px;">${weeks[w].python || 0} pt</td></tr>`;
        });
        tableHTML += `</tbody></table>`;
        modalDetails.innerHTML = tableHTML;
    }
    modal.style.display = 'flex';
}

const closeModal = document.getElementById('closeModal');
if (closeModal) {
    closeModal.onclick = () => document.getElementById('historyModal').style.display = 'none';
}

// Siyahını Və Loser Bölməsini Yükləmək
function loadLeaderboard() {
    const listEl = document.getElementById('commonList');
    const loserEl = document.getElementById('loserList');
    if (!listEl) return;

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        if (loserEl) loserEl.innerHTML = '';
        let students = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            let score = (data.totalCpp || 0) + (data.totalPython || 0);
            students.push({ id: doc.id, name: data.name || doc.id, score, data });
        });

        // Çoxdan aza sırala
        students.sort((a,b) => b.score - a.score);

        const totalStudents = students.length;
        const mainStudents = students.slice(0, Math.max(0, totalStudents - 3));
        const loserStudents = students.slice(Math.max(0, totalStudents - 3));

        // Əsas Siyahı
        let rank = 1;
        mainStudents.forEach(st => {
            const li = document.createElement('li');
            li.className = 'student-row';
            li.innerHTML = `
                <span>${rank}</span>
                <span>${st.name}</span>
                <span>C++: ${st.data.lastCpp || 0} | Py: ${st.data.lastPython || 0}</span>
                <span><strong>${st.score} pt</strong></span>
            `;
            li.onclick = () => openStudentModal(st.name, st.data);
            listEl.appendChild(li);
            rank++;
        });

        // Loser Siyahısı (Sonuncu 3 nəfər)
        if (loserEl) {
            let loserRank = mainStudents.length + 1;
            loserStudents.forEach(st => {
                const li = document.createElement('li');
                li.className = 'student-row loser-row';
                li.innerHTML = `
                    <span>${loserRank}</span>
                    <span>${st.name}</span>
                    <span>C++: ${st.data.lastCpp || 0} | Py: ${st.data.lastPython || 0}</span>
                    <span><strong>${st.score} pt</strong></span>
                `;
                li.onclick = () => openStudentModal(st.name, st.data);
                loserEl.appendChild(li);
                loserRank++;
            });
        }
    });
}

loadLeaderboard();
