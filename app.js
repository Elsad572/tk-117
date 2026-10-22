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
            tableHTML += `
                <tr style="border-bottom: 1px solid #21262d;">
                    <td style="padding: 8px; font-weight:bold;">${w}-ci həftə</td>
                    <td style="padding: 8px;">${weeks[w].cpp || 0} pt</td>
                    <td style="padding: 8px;">${weeks[w].python || 0} pt</td>
                </tr>
            `;
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

// Common və başqa Siyahıları Yükləmək
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
            
            if (type === 'common') {
                li.innerHTML = `
                    <span>${rank}</span>
                    <span>${st.name}</span>
                    <span>C++: ${st.data.lastCpp || 0} | Py: ${st.data.lastPython || 0}</span>
                    <span><strong>${st.score} pt</strong></span>
                `;
            } else {
                li.innerHTML = `<span>${rank}</span><span>${st.name}</span><span><strong>${st.score} pt</strong></span>`;
            }

            li.onclick = () => openStudentModal(st.name, st.data);
            listEl.appendChild(li);
            rank++;
        });
    });
}

loadLeaderboard('common', 'commonList');
loadLeaderboard('cpp', 'cppList');
loadLeaderboard('python', 'pythonList');

// Admin İcazələri
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
    const currentUser = localStorage.getItem('adminUser');

    if (currentUser) {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');

        // Rol məhdudiyyətləri
        const cppInput = document.getElementById('cppPoints');
        const deleteBtnText = document.getElementById('deleteBtnText');
        
        if (currentUser === 'Aytac') {
            if (cppInput) {
                cppInput.value = 0;
                cppInput.disabled = true;
                cppInput.placeholder = "C++ Balı (Məhdudlaşdırılıb)";
            }
            if (deleteBtnText) deleteBtnText.textContent = "Tələbənin Yalnız Python Balını Sil";
        } else {
            if (cppInput) cppInput.disabled = false;
            if (deleteBtnText) deleteBtnText.textContent = "Tələbəni Tamamilə Sil";
        }
    } else {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
    }
}
checkAuth();

// Bal Əlavə etmək
const addStudentForm = document.getElementById('addStudentForm');
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = localStorage.getItem('adminUser');
        const name = document.getElementById('studentName').value.trim();
        const week = document.getElementById('weekNum').value;
        const cpp = currentUser === 'Aytac' ? 0 : Number(document.getElementById('cppPoints').value);
        const python = Number(document.getElementById('pythonPoints').value);

        const docRef = doc(db, "students", name);
        const docSnap = await getDoc(docRef);

        let studentData = { name: name, weeks: {}, totalCpp: 0, totalPython: 0, lastCpp: 0, lastPython: 0 };
        if (docSnap.exists()) {
            studentData = docSnap.data();
            if (!studentData.weeks) studentData.weeks = {};
        }

        if (!studentData.weeks[week]) {
            studentData.weeks[week] = { cpp: 0, python: 0 };
        }

        if (currentUser === 'Aytac') {
            studentData.weeks[week].python = python;
        } else {
            studentData.weeks[week].cpp = cpp;
            studentData.weeks[week].python = python;
        }

        // Cari (ən son qoyulan) balları saxlamaq
        studentData.lastCpp = studentData.weeks[week].cpp;
        studentData.lastPython = studentData.weeks[week].python;

        // Ümumi balı hesablamaq
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
            checkAuth();
            alert(`${week}-ci həftə balı uğurla yeniləndi!`);
        } catch (err) {
            alert("Xəta: " + err.message);
        }
    });
}

// Silmə Funksiyası (Aytac üçün yalnız Python, Elsad üçün tam)
const deleteStudentForm = document.getElementById('deleteStudentForm');
if (deleteStudentForm) {
    deleteStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = localStorage.getItem('adminUser');
        const name = document.getElementById('deleteStudentName').value.trim();
        const docRef = doc(db, "students", name);

        if (currentUser === 'Aytac') {
            if (confirm(`${name} adlı tələbənin YALNIZ Python ballarını sıfırlamağa əminsiniz?`)) {
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        let data = docSnap.data();
                        data.totalPython = 0;
                        data.lastPython = 0;
                        if (data.weeks) {
                            Object.keys(data.weeks).forEach(w => {
                                data.weeks[w].python = 0;
                            });
                        }
                        await setDoc(docRef, data);
                        alert(`${name} tələbəsinin Python balları silindi!`);
                    }
                    deleteStudentForm.reset();
                } catch (err) {
                    alert("Xəta: " + err.message);
                }
            }
        } else {
            if (confirm(`${name} adlı tələbəni bazadan TAMAMİLƏ silməyə əminsiniz?`)) {
                try {
                    await deleteDoc(docRef);
                    deleteStudentForm.reset();
                    alert(`${name} uğurla silindi!`);
                } catch (err) {
                    alert("Xəta: " + err.message);
                }
            }
        }
    });
}
