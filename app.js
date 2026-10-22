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

// Hamburger Menyu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => navMenu.classList.remove('active'));
}

// Modal pəncərələrini bağlamaq
const closeModal = document.getElementById('closeModal');
if (closeModal) closeModal.onclick = () => document.getElementById('historyModal').style.display = 'none';

const closeEditModal = document.getElementById('closeEditModal');
if (closeEditModal) closeEditModal.onclick = () => document.getElementById('editModal').style.display = 'none';

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
        let html = `<table style="width:100%; border-collapse: collapse; font-size:12px; text-align:center;">
            <thead>
                <tr style="border-bottom: 2px solid #30363d; color: #8b949e;">
                    <th>Həftə</th><th>C++ Total</th><th>Py Total</th>
                </tr>
            </thead>
            <tbody>`;
        weekKeys.forEach(w => {
            const cppSum = (weeks[w].cpp_fm||0) + (weeks[w].cpp_so||0) + (weeks[w].cpp_eo||0) + (weeks[w].cpp_cf||0) + (weeks[w].cpp_hr||0);
            const pySum = (weeks[w].py_fm||0) + (weeks[w].py_so||0) + (weeks[w].py_eo||0) + (weeks[w].py_cf||0) + (weeks[w].py_hr||0);
            html += `<tr style="border-bottom: 1px solid #21262d;">
                <td style="padding: 6px;"><b>${w}-ci həftə</b></td>
                <td>${cppSum} pt</td>
                <td>${pySum} pt</td>
            </tr>`;
        });
        html += `</tbody></table>`;
        modalDetails.innerHTML = html;
    }
    modal.style.display = 'flex';
}

// Reytinq Cədvəllərinin Yüklənməsi (C++ Və Python)
function loadLanguageLeaderboard(langType, elementId) {
    const listEl = document.getElementById(elementId);
    if (!listEl) return;

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        let students = [];

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const weeks = data.weeks || {};
            const weekKeys = Object.keys(weeks).map(Number).sort((a,b) => a - b);

            let lastW = weekKeys.length > 0 ? weeks[weekKeys[weekKeys.length - 1]] : {};
            let prevW = weekKeys.length > 1 ? weeks[weekKeys[weekKeys.length - 2]] : {};

            let fm = langType === 'cpp' ? (lastW.cpp_fm || 0) : (lastW.py_fm || 0);
            let so = langType === 'cpp' ? (lastW.cpp_so || 0) : (lastW.py_so || 0);
            let eo = langType === 'cpp' ? (lastW.cpp_eo || 0) : (lastW.py_eo || 0);
            let cf = langType === 'cpp' ? (lastW.cpp_cf || 0) : (lastW.py_cf || 0);
            let hr = langType === 'cpp' ? (lastW.cpp_hr || 0) : (lastW.py_hr || 0);

            let cari = fm + so + eo + cf + hr;

            let prevFm = langType === 'cpp' ? (prevW.cpp_fm || 0) : (prevW.py_fm || 0);
            let prevSo = langType === 'cpp' ? (prevW.cpp_so || 0) : (prevW.py_so || 0);
            let prevEo = langType === 'cpp' ? (prevW.cpp_eo || 0) : (prevW.py_eo || 0);
            let prevCf = langType === 'cpp' ? (prevW.cpp_cf || 0) : (prevW.py_cf || 0);
            let prevHr = langType === 'cpp' ? (prevW.cpp_hr || 0) : (prevW.py_hr || 0);

            let kecmis = prevFm + prevSo + prevEo + prevCf + prevHr;
            let artan = cari - kecmis;

            students.push({
                name: data.name || docSnap.id,
                fm, so, eo, cf, hr, cari, kecmis, artan, data
            });
        });

        students.sort((a,b) => b.cari - a.cari);

        let rank = 1;
        students.forEach(st => {
            const li = document.createElement('li');
            li.className = 'student-row rank-grid-row';

            let incClass = 'inc-zero';
            let incText = `${st.artan}`;
            if (st.artan > 0) { incClass = 'inc-plus'; incText = `+${st.artan}`; }
            else if (st.artan < 0) { incClass = 'inc-minus'; }

            li.innerHTML = `
                <span>${rank}</span>
                <span style="text-align:left; font-weight:bold;">${st.name}</span>
                <span>${st.fm}</span>
                <span>${st.so}</span>
                <span>${st.eo}</span>
                <span>${st.cf}</span>
                <span>${st.hr}</span>
                <span><strong>${st.cari}</strong></span>
                <span style="color:#8b949e;">${st.kecmis}</span>
                <span class="${incClass}">${incText}</span>
            `;

            li.onclick = () => openStudentModal(st.name, st.data);
            listEl.appendChild(li);
            rank++;
        });
    });
}

loadLanguageLeaderboard('cpp', 'cppList');
loadLanguageLeaderboard('python', 'pythonList');

// Admin Tərəfi Və Üç Nöqtə Aksion Menyusu
const ADMINS = { "Elsad": "elsad_29822", "Aytac": "aytac_35723" };
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
        const cppGroup = document.getElementById('cppCategoryGroup');
        const editCppGroup = document.getElementById('editCppGroup');

        if (currentUser === 'Aytac') {
            if (cppGroup) cppGroup.style.display = 'none';
            if (editCppGroup) editCppGroup.style.display = 'none';
        } else {
            if (cppGroup) cppGroup.style.display = 'block';
            if (editCppGroup) editCppGroup.style.display = 'block';
        }
        loadAdminStudentList();
    } else {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
    }
}
checkAuth();

// Admin Siyahısı Və Üç Nöqtə Menyusu
function loadAdminStudentList() {
    const listEl = document.getElementById('adminStudentList');
    if (!listEl) return;
    const currentUser = localStorage.getItem('adminUser');

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        let rank = 1;
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const name = data.name || docSnap.id;
            const weeks = data.weeks || {};
            const weekKeys = Object.keys(weeks).map(Number).sort((a,b) => a - b);
            let lastW = weekKeys.length > 0 ? weeks[weekKeys[weekKeys.length - 1]] : {};

            let cppCari = (lastW.cpp_fm||0) + (lastW.cpp_so||0) + (lastW.cpp_eo||0) + (lastW.cpp_cf||0) + (lastW.cpp_hr||0);
            let pyCari = (lastW.py_fm||0) + (lastW.py_so||0) + (lastW.py_eo||0) + (lastW.py_cf||0) + (lastW.py_hr||0);

            const li = document.createElement('li');
            li.className = 'student-row';
            li.style.display = 'grid';
            li.style.gridTemplateColumns = '30px 1fr 80px 80px 40px';
            li.style.textAlign = 'center';

            li.innerHTML = `
                <span>${rank}</span>
                <span style="text-align:left; font-weight:bold;">${name}</span>
                <span>${cppCari} pt</span>
                <span>${pyCari} pt</span>
                <div class="action-dropdown" style="position:relative;">
                    <button class="action-btn" style="padding:2px 8px; background:none; border:none; color:#e6edf3; font-size:18px; cursor:pointer;">⋮</button>
                    <div class="action-menu hidden" style="position:absolute; right:0; top:25px; background:#161b22; border:1px solid #30363d; border-radius:6px; z-index:10; min-width:120px; text-align:left;">
                        <button class="edit-btn" style="width:100%; text-align:left; padding:8px; background:none; border:none; color:#2ea44f; cursor:pointer;">✏️ Düzəlt</button>
                        <button class="delete-btn" style="width:100%; text-align:left; padding:8px; background:none; border:none; color:#da3633; cursor:pointer;">🗑️ Sil</button>
                    </div>
                </div>
            `;

            const actionBtn = li.querySelector('.action-btn');
            const actionMenu = li.querySelector('.action-menu');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            actionBtn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.action-menu').forEach(m => m !== actionMenu && m.classList.add('hidden'));
                actionMenu.classList.toggle('hidden');
            };

            // Düzəlt
            editBtn.onclick = () => {
                actionMenu.classList.add('hidden');
                openEditModal(name, data);
            };

            // Sil
            deleteBtn.onclick = async () => {
                actionMenu.classList.add('hidden');
                if (currentUser === 'Aytac') {
                    if (confirm(`${name} tələbəsinin YALNIZ Python ballarını silməyə əminsiniz?`)) {
                        let updated = { ...data };
                        if (updated.weeks) {
                            Object.keys(updated.weeks).forEach(w => {
                                updated.weeks[w].py_fm = 0; updated.weeks[w].py_so = 0;
                                updated.weeks[w].py_eo = 0; updated.weeks[w].py_cf = 0; updated.weeks[w].py_hr = 0;
                            });
                        }
                        await setDoc(doc(db, "students", name), updated);
                        alert(`${name} tələbəsinin Python balları silindi!`);
                    }
                } else {
                    if (confirm(`${name} tələbəsini bazadan TAMAMİLƏ silməyə əminsiniz?`)) {
                        await deleteDoc(doc(db, "students", name));
                        alert(`${name} uğurla silindi!`);
                    }
                }
            };

            listEl.appendChild(li);
            rank++;
        });
    });
}

document.addEventListener('click', () => {
    document.querySelectorAll('.action-menu').forEach(m => m.classList.add('hidden'));
});

// Modal Redaktə Açmaq
function openEditModal(name, data) {
    const editModal = document.getElementById('editModal');
    document.getElementById('editOriginalName').value = name;
    document.getElementById('editStudentName').value = name;

    const weeks = data.weeks || {};
    const weekKeys = Object.keys(weeks).map(Number).sort((a,b) => a - b);
    const lastWNum = weekKeys.length > 0 ? weekKeys[weekKeys.length - 1] : 1;
    const lastW = weeks[lastWNum] || {};

    document.getElementById('editWeekNum').value = lastWNum;

    document.getElementById('edit_cpp_fm').value = lastW.cpp_fm || 0;
    document.getElementById('edit_cpp_so').value = lastW.cpp_so || 0;
    document.getElementById('edit_cpp_eo').value = lastW.cpp_eo || 0;
    document.getElementById('edit_cpp_cf').value = lastW.cpp_cf || 0;
    document.getElementById('edit_cpp_hr').value = lastW.cpp_hr || 0;

    document.getElementById('edit_py_fm').value = lastW.py_fm || 0;
    document.getElementById('edit_py_so').value = lastW.py_so || 0;
    document.getElementById('edit_py_eo').value = lastW.py_eo || 0;
    document.getElementById('edit_py_cf').value = lastW.py_cf || 0;
    document.getElementById('edit_py_hr').value = lastW.py_hr || 0;

    editModal.style.display = 'flex';
}

// Redaktə Formunu Yadda Saxlamaq
const editStudentForm = document.getElementById('editStudentForm');
if (editStudentForm) {
    editStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = localStorage.getItem('adminUser');
        const origName = document.getElementById('editOriginalName').value;
        const newName = document.getElementById('editStudentName').value.trim();
        const week = document.getElementById('editWeekNum').value;

        let docRef = doc(db, "students", origName);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            if (!data.weeks) data.weeks = {};
            if (!data.weeks[week]) data.weeks[week] = {};

            data.name = newName;

            data.weeks[week].py_fm = Number(document.getElementById('edit_py_fm').value) || 0;
            data.weeks[week].py_so = Number(document.getElementById('edit_py_so').value) || 0;
            data.weeks[week].py_eo = Number(document.getElementById('edit_py_eo').value) || 0;
            data.weeks[week].py_cf = Number(document.getElementById('edit_py_cf').value) || 0;
            data.weeks[week].py_hr = Number(document.getElementById('edit_py_hr').value) || 0;

            if (currentUser !== 'Aytac') {
                data.weeks[week].cpp_fm = Number(document.getElementById('edit_cpp_fm').value) || 0;
                data.weeks[week].cpp_so = Number(document.getElementById('edit_cpp_so').value) || 0;
                data.weeks[week].cpp_eo = Number(document.getElementById('edit_cpp_eo').value) || 0;
                data.weeks[week].cpp_cf = Number(document.getElementById('edit_cpp_cf').value) || 0;
                data.weeks[week].cpp_hr = Number(document.getElementById('edit_cpp_hr').value) || 0;
            }

            if (origName !== newName) {
                await deleteDoc(docRef);
                await setDoc(doc(db, "students", newName), data);
            } else {
                await setDoc(docRef, data);
            }

            document.getElementById('editModal').style.display = 'none';
            alert("Məlumatlar uğurla yeniləndi!");
        }
    });
}

// Bal Əlavə Etmə Formu
const addStudentForm = document.getElementById('addStudentForm');
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = localStorage.getItem('adminUser');
        const name = document.getElementById('studentName').value.trim();
        const week = document.getElementById('weekNum').value;

        const docRef = doc(db, "students", name);
        const docSnap = await getDoc(docRef);

        let studentData = { name: name, weeks: {} };
        if (docSnap.exists()) {
            studentData = docSnap.data();
            if (!studentData.weeks) studentData.weeks = {};
        }

        if (!studentData.weeks[week]) studentData.weeks[week] = {};

        studentData.weeks[week].py_fm = Number(document.getElementById('py_fm').value) || 0;
        studentData.weeks[week].py_so = Number(document.getElementById('py_so').value) || 0;
        studentData.weeks[week].py_eo = Number(document.getElementById('py_eo').value) || 0;
        studentData.weeks[week].py_cf = Number(document.getElementById('py_cf').value) || 0;
        studentData.weeks[week].py_hr = Number(document.getElementById('py_hr').value) || 0;

        if (currentUser !== 'Aytac') {
            studentData.weeks[week].cpp_fm = Number(document.getElementById('cpp_fm').value) || 0;
            studentData.weeks[week].cpp_so = Number(document.getElementById('cpp_so').value) || 0;
            studentData.weeks[week].cpp_eo = Number(document.getElementById('cpp_eo').value) || 0;
            studentData.weeks[week].cpp_cf = Number(document.getElementById('cpp_cf').value) || 0;
            studentData.weeks[week].cpp_hr = Number(document.getElementById('cpp_hr').value) || 0;
        }

        try {
            await setDoc(docRef, studentData);
            addStudentForm.reset();
            checkAuth();
            alert(`${week}-ci həftə üçün ballar saxlanıldı!`);
        } catch (err) {
            alert("Xəta: " + err.message);
        }
    });
}
