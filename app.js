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

// AZƏRBAYCAN ƏLİFBASINA UYGUN SIRALAMA FUNKSİYASI
function azSortNames(aName, bName) {
    return aName.localeCompare(bName, 'az', { sensitivity: 'variant' });
}

// 1. HAMBURGER MENYU
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => navMenu.classList.remove('active'));
}

// 2. DİL SEÇİMİ VƏ TƏRCÜMƏ
const TRANSLATIONS = {
    az: { 
        dict: "IT Lüğəti", infoTab: "Məlumat", teaches: "Tədris edir:", infoTitle: "Məfhum və Təşkilat Məlumatları", 
        creator: "Yaradıcı:", uni: "Universitet:", faculty: "Fakültə:", specialty: "İxtisas:", 
        leaderboard: "Ümumi Reytinq Siyahısı", clickInfo: "Həftəlik balları görmək üçün tələbə adının üstünə klikləyin.", 
        nameHeader: "Ad Soyad", scoreHeader: "Ümumi Bal", progTech: "PROQRAMLAŞDIRMA TEXNOLOGİYALARI",
        motto: '"ÖYRƏN, GÜCLƏN, YARAT"', pyTitle: "PYTHON REYTİNQ SİYAHISI", cppTitle: "C++ REYTİNQ SİYAHISI", 
        current: "Cari", previous: "Keçmiş", increase: "Artan"
    },
    tr: { 
        dict: "BT Sözlüğü", infoTab: "Bilgi", teaches: "Eğitmen:", infoTitle: "Bilgi ve Organizasyon", 
        creator: "Geliştirici:", uni: "Üniversite:", faculty: "Fakülte:", specialty: "Bölüm:", 
        leaderboard: "Genel Sıralama Listesi", clickInfo: "Haftalık puanları görmek için öğrenci adına tıklayın.", 
        nameHeader: "Ad Soyad", scoreHeader: "Toplam Puan", progTech: "PROGRAMLAMA TEKNOLOJİLERİ",
        motto: '"ÖĞREN, GÜÇLEN, YARAT"', pyTitle: "PYTHON SIRALAMA LİSTESİ", cppTitle: "C++ SIRALAMA LİSTESİ", 
        current: "Mevcut", previous: "Geçmiş", increase: "Artış"
    },
    en: { 
        dict: "IT Dictionary", infoTab: "Info", teaches: "Instructor:", infoTitle: "Info & Organization", 
        creator: "Creator:", uni: "University:", faculty: "Faculty:", specialty: "Specialty:", 
        leaderboard: "Overall Leaderboard", clickInfo: "Click on a student's name to view weekly scores.", 
        nameHeader: "Full Name", scoreHeader: "Total Score", progTech: "PROGRAMMING TECHNOLOGIES",
        motto: '"LEARN, EMPOWER, CREATE"', pyTitle: "PYTHON LEADERBOARD", cppTitle: "C++ LEADERBOARD", 
        current: "Current", previous: "Previous", increase: "Change"
    },
    ru: { 
        dict: "IT Словарь", infoTab: "Информация", teaches: "Преподаватель:", infoTitle: "Информация и Организация", 
        creator: "Создатель:", uni: "Университет:", faculty: "Факультет:", specialty: "Специальность:", 
        leaderboard: "Общий Рейтинг", clickInfo: "Нажмите на имя студента, чтобы увидеть еженедельные баллы.", 
        nameHeader: "Имя Фамилия", scoreHeader: "Общий Балл", progTech: "ТЕХНОЛОГИИ ПРОГРАММИРОВАНИЯ",
        motto: '"УЧИСЬ, УСИЛИВАЙСЯ, СОЗДАВАЙ"', pyTitle: "РЕЙТИНГ PYTHON", cppTitle: "РЕЙТИНГ C++", 
        current: "Текущий", previous: "Прошлый", increase: "Изм."
    }
};
const langSelect = document.getElementById('langSelect');
if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                el.textContent = TRANSLATIONS[lang][key];
            }
        });
    });
}

// 3. MƏLUMAT MODALI
const infoTabBtn = document.getElementById('infoTabBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoModal = document.getElementById('closeInfoModal');
if (infoTabBtn && infoModal) infoTabBtn.onclick = () => { infoModal.style.display = 'flex'; };
if (closeInfoModal && infoModal) closeInfoModal.onclick = () => { infoModal.style.display = 'none'; };

// 4. IT LÜĞƏTİ VƏ AXTARIŞ
const IT_DICTIONARY = [
    { term: "Algorithm", az: "Alqoritm", tr: "Algoritma", ru: "Алгоритм" },
    { term: "Array", az: "Massiv", tr: "Dizi", ru: "Массив" },
    { term: "Boolean", az: "Məntiqi tip", tr: "Mantıksal tip", ru: "Логический тип" },
    { term: "Class", az: "Sinif", tr: "Sınıf", ru: "Класс" },
    { term: "Compiler", az: "Kompilyator", tr: "Derleyici", ru: "Компилятор" },
    { term: "Database", az: "Verilənlər bazası", tr: "Veritabanı", ru: "База данных" },
    { term: "Debugging", az: "Xətaların sazlanması", tr: "Hata ayıklama", ru: "Отладка" },
    { term: "Encapsulation", az: "Kapsulyasiya", tr: "Kapsülleme", ru: "Инкапсуляция" },
    { term: "Framework", az: "Karkas / Freymvork", tr: "Çatı", ru: "Фреймворк" },
    { term: "Function", az: "Funksiya", tr: "Fonksiyon", ru: "Функция" },
    { term: "Inheritance", az: "Varislik", tr: "Kalıtım", ru: "Наследование" },
    { term: "Interface", az: "İnterfeys", tr: "Arayüz", ru: "Интерфейс" },
    { term: "Loop", az: "Dövr", tr: "Döngü", ru: "Цикл" },
    { term: "Object", az: "Obyekt", tr: "Nesne", ru: "Объект" },
    { term: "Pointer", az: "Göstərici", tr: "İşaretçi", ru: "Указатель" },
    { term: "Polymorphism", az: "Polimorfizm", tr: "Çok biçimlilik", ru: "Полиморфизм" },
    { term: "Recursion", az: "Rekursiya", tr: "Özyineleme", ru: "Рекурсия" },
    { term: "String", az: "Sətir tipi", tr: "Metin dizisi", ru: "Строка" },
    { term: "Syntax", az: "Sintaksis", tr: "Sözdizimi", ru: "Синтаксис" },
    { term: "Variable", az: "Dəyişən", tr: "Değişken", ru: "Переменная" }
];
const dictBtn = document.getElementById('dictionaryBtn');
const dictModal = document.getElementById('dictModal');
const closeDictModal = document.getElementById('closeDictModal');
const dictList = document.getElementById('dictList');
const dictSearch = document.getElementById('dictSearch');

function renderDict(filter = "") {
    if (!dictList) return;
    dictList.innerHTML = "";
    const filtered = IT_DICTIONARY.filter(item => 
        item.term.toLowerCase().includes(filter.toLowerCase()) || 
        item.az.toLowerCase().includes(filter.toLowerCase())
    );
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dict-item';
        div.innerHTML = `<div class="dict-term">🇬🇧 ${item.term}</div><div class="dict-trans"><span>🇦🇿 AZ: ${item.az}</span><span>🇹🇷 TR: ${item.tr}</span><span>🇷🇺 RU: ${item.ru}</span></div>`;
        dictList.appendChild(div);
    });
}
if (dictBtn) dictBtn.onclick = () => { renderDict(); dictModal.style.display = 'flex'; };
if (closeDictModal) closeDictModal.onclick = () => dictModal.style.display = 'none';
if (dictSearch) dictSearch.oninput = (e) => renderDict(e.target.value);

// 5. TƏLƏBƏ HƏFTƏLİK MƏLUMAT MODALI
const closeModal = document.getElementById('closeModal');
if (closeModal) closeModal.onclick = () => document.getElementById('historyModal').style.display = 'none';

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
            <thead><tr style="border-bottom: 2px solid #30363d; color: #8b949e;"><th>Həftə</th><th>C++ Total</th><th>Py Total</th></tr></thead><tbody>`;
        weekKeys.forEach(w => {
            const cppSum = (weeks[w].cpp_fm||0) + (weeks[w].cpp_so||0) + (weeks[w].cpp_eo||0) + (weeks[w].cpp_cf||0) + (weeks[w].cpp_hr||0);
            const pySum = (weeks[w].py_fm||0) + (weeks[w].py_so||0) + (weeks[w].py_eo||0) + (weeks[w].py_cf||0) + (weeks[w].py_hr||0);
            html += `<tr style="border-bottom: 1px solid #21262d;"><td style="padding: 6px;"><b>${w}-ci həftə</b></td><td>${cppSum} pt</td><td>${pySum} pt</td></tr>`;
        });
        html += `</tbody></table>`;
        modalDetails.innerHTML = html;
    }
    modal.style.display = 'flex';
}

// 6. COMMON REYTİNQ (İNTELLEKTUALLAR QIZILI PODİUM & LOSERS)
function loadCommonLeaderboard() {
    const listEl = document.getElementById('commonList');
    const loserEl = document.getElementById('loserList');
    if (!listEl) return;

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        if (loserEl) loserEl.innerHTML = '';
        let students = [];

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const weeks = data.weeks || {};
            const weekKeys = Object.keys(weeks).map(Number).sort((a,b) => a - b);
            
            let totalScore = 0;
            let lastCpp = 0;
            let lastPy = 0;

            weekKeys.forEach(w => {
                const wData = weeks[w];
                const cppW = (wData.cpp_fm||0) + (wData.cpp_so||0) + (wData.cpp_eo||0) + (wData.cpp_cf||0) + (wData.cpp_hr||0);
                const pyW = (wData.py_fm||0) + (wData.py_so||0) + (wData.py_eo||0) + (wData.py_cf||0) + (wData.py_hr||0);
                totalScore += (cppW + pyW);
                if (w === weekKeys[weekKeys.length - 1]) { lastCpp = cppW; lastPy = pyW; }
            });

            students.push({ name: data.name || docSnap.id, score: totalScore, lastCpp, lastPy, data });
        });

        students.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return azSortNames(a.name, b.name);
        });

        const topThreeEl = document.getElementById('topThreeContainer');
        if (topThreeEl) {
            topThreeEl.innerHTML = '';
            const top3 = students.slice(0, 3);
            const medals = ['👑 1-ci Yer', '🥈 2-ci Yer', '🥉 3-cü Yer'];
            
            top3.forEach((st, idx) => {
                const card = document.createElement('div');
                card.className = 'gold-card';
                card.innerHTML = `
                    <div class="gold-rank">${medals[idx]}</div>
                    <div class="gold-name">${st.name}</div>
                    <div class="gold-score">${st.score} pt</div>
                `;
                card.onclick = () => openStudentModal(st.name, st.data);
                topThreeEl.appendChild(card);
            });
        }

        const totalStudents = students.length;
        const mainStudents = students.slice(0, Math.max(0, totalStudents - 3));
        const loserStudents = students.slice(Math.max(0, totalStudents - 3));

        let rank = 1;
        mainStudents.forEach(st => {
            const li = document.createElement('li');
            li.className = 'student-row';
            li.innerHTML = `<span>${rank}</span><span>${st.name}</span><span>C++: ${st.lastCpp} | Py: ${st.lastPy}</span><span><strong>${st.score} pt</strong></span>`;
            li.onclick = () => openStudentModal(st.name, st.data);
            listEl.appendChild(li);
            rank++;
        });

        if (loserEl) {
            let loserRank = mainStudents.length + 1;
            loserStudents.forEach(st => {
                const li = document.createElement('li');
                li.className = 'student-row loser-row';
                li.innerHTML = `
                    <span>${loserRank}</span>
                    <span>${st.name} <span class="loser-badge">Loser</span></span>
                    <span>C++: ${st.lastCpp} | Py: ${st.lastPy}</span>
                    <span><strong>${st.score} pt</strong></span>
                `;
                li.onclick = () => openStudentModal(st.name, st.data);
                loserEl.appendChild(li);
                loserRank++;
            });
        }
    });
}
loadCommonLeaderboard();

// 7. C++ VƏ PYTHON REYTİNQ YÜKLƏMƏ
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

            let fm = langType === 'cpp' ? (lastW.cpp_fm||0) : (lastW.py_fm||0);
            let so = langType === 'cpp' ? (lastW.cpp_so||0) : (lastW.py_so||0);
            let eo = langType === 'cpp' ? (lastW.cpp_eo||0) : (lastW.py_eo||0);
            let cf = langType === 'cpp' ? (lastW.cpp_cf||0) : (lastW.py_cf||0);
            let hr = langType === 'cpp' ? (lastW.cpp_hr||0) : (lastW.py_hr||0);
            let cari = fm + so + eo + cf + hr;

            let prevFm = langType === 'cpp' ? (prevW.cpp_fm||0) : (prevW.py_fm||0);
            let prevSo = langType === 'cpp' ? (prevW.cpp_so||0) : (prevW.py_so||0);
            let prevEo = langType === 'cpp' ? (prevW.cpp_eo||0) : (prevW.py_eo||0);
            let prevCf = langType === 'cpp' ? (prevW.cpp_cf||0) : (prevW.py_cf||0);
            let prevHr = langType === 'cpp' ? (prevW.cpp_hr||0) : (prevW.py_hr||0);
            let kecmis = prevFm + prevSo + prevEo + prevCf + prevHr;
            let artan = cari - kecmis;

            students.push({ name: data.name || docSnap.id, fm, so, eo, cf, hr, cari, kecmis, artan, data });
        });

        students.sort((a, b) => {
            if (b.cari !== a.cari) {
                return b.cari - a.cari;
            }
            return azSortNames(a.name, b.name);
        });

        const topThreeEl = document.getElementById('topThreeContainer');
        if (topThreeEl) {
            topThreeEl.innerHTML = '';
            const top3 = students.slice(0, 3);
            const medals = ['👑 1-ci Yer', '🥈 2-ci Yer', '🥉 3-cü Yer'];

            top3.forEach((st, idx) => {
                const card = document.createElement('div');
                card.className = 'gold-card';
                card.innerHTML = `
                    <div class="gold-rank">${medals[idx]}</div>
                    <div class="gold-name">${st.name}</div>
                    <div class="gold-score">${st.cari} pt</div>
                `;
                card.onclick = () => openStudentModal(st.name, st.data);
                topThreeEl.appendChild(card);
            });
        }

        let rank = 1;
        students.forEach(st => {
            const li = document.createElement('li');
            li.className = 'student-row rank-grid-row';
            let incClass = 'inc-zero', incText = `${st.artan}`;
            if (st.artan > 0) { incClass = 'inc-plus'; incText = `+${st.artan}`; }
            else if (st.artan < 0) { incClass = 'inc-minus'; }

            li.innerHTML = `<span>${rank}</span><span style="text-align:left; font-weight:bold;">${st.name}</span><span>${st.fm}</span><span>${st.so}</span><span>${st.eo}</span><span>${st.cf}</span><span>${st.hr}</span><span><strong>${st.cari}</strong></span><span style="color:#8b949e;">${st.kecmis}</span><span class="${incClass}">${incText}</span>`;
            li.onclick = () => openStudentModal(st.name, st.data);
            listEl.appendChild(li);
            rank++;
        });
    });
}
loadLanguageLeaderboard('cpp', 'cppList');
loadLanguageLeaderboard('python', 'pythonList');

// 8. ADMIN GİRİŞ VƏ İDARƏETMƏ
const ADMINS = { "elsad": "elsad_29822", "aytac": "aytac_35723" };
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('adminUsername').value.trim().toLowerCase();
        const pass = document.getElementById('adminPassword').value.trim();
        
        if (ADMINS[user] && ADMINS[user] === pass) {
            localStorage.setItem('adminUser', user);
            checkAuth();
            alert("Uğurla daxil oldunuz! 🚀");
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
        loginSection.style.display = 'none';
        loginSection.classList.add('hidden');
        adminPanel.style.display = 'block';
        adminPanel.classList.remove('hidden');

        const cppGroup = document.getElementById('cppCategoryGroup');
        const editCppGroup = document.getElementById('editCppGroup');
        const addCourseSelection = document.getElementById('addCourseSelection');
        const editCourseSelection = document.getElementById('editCourseSelection');

        // Aytac ancaq Python görür və Kurs seçimi paneli ondan tamamilə gizlədilir
        if (currentUser === 'aytac') {
            if (cppGroup) cppGroup.style.display = 'none';
            if (editCppGroup) editCppGroup.style.display = 'none';
            if (addCourseSelection) addCourseSelection.style.display = 'none';
            if (editCourseSelection) editCourseSelection.style.display = 'none';
        } else {
            // Elşad üçün panellər göstərilir
            if (addCourseSelection) addCourseSelection.style.display = 'flex';
            if (editCourseSelection) editCourseSelection.style.display = 'flex';
            
            // Radio button məntiqini tətbiq et (Elşad üçündür)
            const addChecked = document.querySelector('input[name="addCourse"]:checked');
            if (addChecked) addChecked.dispatchEvent(new Event('change'));
            
            const editChecked = document.querySelector('input[name="editCourse"]:checked');
            if (editChecked) editChecked.dispatchEvent(new Event('change'));
        }
        loadAdminStudentList();
    } else {
        loginSection.style.display = 'block';
        loginSection.classList.remove('hidden');
        adminPanel.style.display = 'none';
        adminPanel.classList.add('hidden');
    }
}
checkAuth();

// KURS SEÇİMİ (RADIO BUTONLARI) ÜÇÜN DİNAMİK GÖSTƏRMƏ MƏNTİQİ
function setupCourseToggles(radioName, cppGroupId, pyGroupId) {
    const radios = document.querySelectorAll(`input[name="${radioName}"]`);
    const cppGroup = document.getElementById(cppGroupId);
    const pyGroup = document.getElementById(pyGroupId);

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'both') {
                if (cppGroup) cppGroup.style.display = 'block';
                if (pyGroup) pyGroup.style.display = 'block';
            } else if (val === 'cpp') {
                if (cppGroup) cppGroup.style.display = 'block';
                if (pyGroup) pyGroup.style.display = 'none';
            } else if (val === 'python') {
                if (cppGroup) cppGroup.style.display = 'none';
                if (pyGroup) pyGroup.style.display = 'block';
            }
        });
    });
}
setupCourseToggles('addCourse', 'cppCategoryGroup', 'pythonCategoryGroup');
setupCourseToggles('editCourse', 'editCppGroup', 'editPyGroup');


// 9. ADMIN TƏLƏBƏ SİYAHISI
function loadAdminStudentList() {
    const listEl = document.getElementById('adminStudentList');
    if (!listEl) return;
    const currentUser = localStorage.getItem('adminUser');

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        let snapshotStudents = [];

        snapshot.forEach(docSnap => {
            snapshotStudents.push({ id: docSnap.id, data: docSnap.data() });
        });

        snapshotStudents.sort((a, b) => {
            const nameA = a.data.name || a.id;
            const nameB = b.data.name || b.id;
            return azSortNames(nameA, nameB);
        });

        let rank = 1;
        snapshotStudents.forEach(item => {
            const data = item.data;
            const name = data.name || item.id;
            const weeks = data.weeks || {};
            const weekKeys = Object.keys(weeks).map(Number).sort((a,b) => a - b);
            let lastW = weekKeys.length > 0 ? weeks[weekKeys[weekKeys.length - 1]] : {};

            let cppCari = (lastW.cpp_fm||0) + (lastW.cpp_so||0) + (lastW.cpp_eo||0) + (lastW.cpp_cf||0) + (lastW.cpp_hr||0);
            let pyCari = (lastW.py_fm||0) + (lastW.py_so||0) + (lastW.py_eo||0) + (lastW.py_cf||0) + (lastW.py_hr||0);

            const li = document.createElement('li');
            li.className = 'student-row rank-grid-row'; // Ümumi CSS grid sinifindən istifadə edirik
            li.style.display = 'grid';
            li.style.gridTemplateColumns = '30px minmax(130px, 1.5fr) 1fr 1fr 40px';
            li.style.alignItems = 'center';
            li.style.textAlign = 'center';
            li.style.padding = '12px 10px';

            li.innerHTML = `
                <span>${rank}</span>
                <span style="text-align:left; font-weight:bold; padding-left:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</span>
                <span>${cppCari} pt</span>
                <span>${pyCari} pt</span>
                <div class="action-dropdown" style="position:relative;">
                    <button class="action-btn" style="padding:2px 8px; background:#21262d; border:1px solid #30363d; border-radius:6px; color:#e6edf3; font-size:18px; cursor:pointer;">⋮</button>
                    <div class="action-menu hidden" style="position:absolute; right:0; top:25px; background:#161b22; border:1px solid #30363d; border-radius:6px; z-index:10; min-width:120px; text-align:left;">
                        <button class="edit-btn" style="width:100%; text-align:left; padding:8px; background:none; border:none; color:#2ea44f; cursor:pointer; font-weight:bold;">✏️ Düzəlt</button>
                        <button class="delete-btn" style="width:100%; text-align:left; padding:8px; background:none; border:none; color:#da3633; cursor:pointer; font-weight:bold;">🗑️ Sil</button>
                    </div>
                </div>
            `;

            const actionBtn = li.querySelector('.action-btn');
            const actionMenu = li.querySelector('.action-menu');
            
            actionBtn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.action-menu').forEach(m => m !== actionMenu && m.classList.add('hidden'));
                actionMenu.classList.toggle('hidden');
            };

            li.querySelector('.edit-btn').onclick = () => {
                actionMenu.classList.add('hidden');
                openEditModal(name, data);
            };

            li.querySelector('.delete-btn').onclick = async () => {
                actionMenu.classList.add('hidden');
                if (currentUser === 'aytac') {
                    if (confirm(`${name} tələbəsinin YALNIZ Python ballarını silməyə əminsiniz?`)) {
                        let updated = { ...data };
                        if (updated.weeks) {
                            Object.keys(updated.weeks).forEach(w => {
                                updated.weeks[w].py_fm = 0; updated.weeks[w].py_so = 0;
                                updated.weeks[w].py_eo = 0; updated.weeks[w].py_cf = 0; updated.weeks[w].py_hr = 0;
                            });
                        }
                        await setDoc(doc(db, "students", name), updated);
                        alert("Python balları silindi!");
                    }
                } else {
                    if (confirm(`${name} tələbəsini bazadan TAMAMİLƏ silməyə əminsiniz?`)) {
                        await deleteDoc(doc(db, "students", name));
                        alert("Uğurla silindi!");
                    }
                }
            };

            listEl.appendChild(li);
            rank++;
        });
    });
}

// 10. ADMIN REDAKTƏ VƏ ƏLAVƏ ETMƏ FORMULARI
const closeEditModal = document.getElementById('closeEditModal');
if (closeEditModal) closeEditModal.onclick = () => document.getElementById('editModal').style.display = 'none';

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

            const editCourseChoice = currentUser === 'aytac' ? 'python' : document.querySelector('input[name="editCourse"]:checked').value;

            if (editCourseChoice === 'both' || editCourseChoice === 'python') {
                data.weeks[week].py_fm = Number(document.getElementById('edit_py_fm').value) || 0;
                data.weeks[week].py_so = Number(document.getElementById('edit_py_so').value) || 0;
                data.weeks[week].py_eo = Number(document.getElementById('edit_py_eo').value) || 0;
                data.weeks[week].py_cf = Number(document.getElementById('edit_py_cf').value) || 0;
                data.weeks[week].py_hr = Number(document.getElementById('edit_py_hr').value) || 0;
            }

            if (editCourseChoice === 'both' || editCourseChoice === 'cpp') {
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

const addStudentForm = document.getElementById('addStudentForm');
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = localStorage.getItem('adminUser');
        const name = document.getElementById('studentName').value.trim();
        const weekInput = document.getElementById('weekNum').value.trim();

        if (!name) return;

        const docRef = doc(db, "students", name);
        const docSnap = await getDoc(docRef);

        let studentData = { name: name, weeks: {} };
        if (docSnap.exists()) {
            studentData = docSnap.data();
            if (!studentData.weeks) studentData.weeks = {};
        }

        if (weekInput !== "") {
            const week = weekInput;
            if (!studentData.weeks[week]) studentData.weeks[week] = {};

            const courseChoice = currentUser === 'aytac' ? 'python' : document.querySelector('input[name="addCourse"]:checked').value;

            if (courseChoice === 'both' || courseChoice === 'python') {
                studentData.weeks[week].py_fm = Number(document.getElementById('py_fm').value) || 0;
                studentData.weeks[week].py_so = Number(document.getElementById('py_so').value) || 0;
                studentData.weeks[week].py_eo = Number(document.getElementById('py_eo').value) || 0;
                studentData.weeks[week].py_cf = Number(document.getElementById('py_cf').value) || 0;
                studentData.weeks[week].py_hr = Number(document.getElementById('py_hr').value) || 0;
            }

            if (courseChoice === 'both' || courseChoice === 'cpp') {
                studentData.weeks[week].cpp_fm = Number(document.getElementById('cpp_fm').value) || 0;
                studentData.weeks[week].cpp_so = Number(document.getElementById('cpp_so').value) || 0;
                studentData.weeks[week].cpp_eo = Number(document.getElementById('cpp_eo').value) || 0;
                studentData.weeks[week].cpp_cf = Number(document.getElementById('cpp_cf').value) || 0;
                studentData.weeks[week].cpp_hr = Number(document.getElementById('cpp_hr').value) || 0;
            }
        }

        try {
            await setDoc(docRef, studentData);
            addStudentForm.reset();
            checkAuth();
            if (weekInput !== "") {
                alert(`${name} üçün ${weekInput}-ci həftə balları saxlanıldı!`);
            } else {
                alert(`${name} uğurla siyahıya əlavə edildi!`);
            }
        } catch (err) {
            alert("Xəta: " + err.message);
        }
    });
}

// 11. TƏLƏBƏ AXTARIŞI
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        let filter = this.value.toLowerCase();
        let rows = document.querySelectorAll('.student-row');
        
        rows.forEach(row => {
            let text = row.textContent.toLowerCase();
            if (text.includes(filter)) {
                row.style.display = ""; 
            } else {
                row.style.display = "none";
            }
        });
    });
}

// 12. PDF ÇIXARTMA (ÜMUMİ, C++ VƏ YA PYTHON)
const exportPdfBtn = document.getElementById('exportPdfBtn');
const pdfSelect = document.getElementById('pdfSelect');

if (exportPdfBtn && pdfSelect) {
    exportPdfBtn.addEventListener('click', () => {
        const type = pdfSelect.value;
        let title = "TK-117 | ";
        let theadHTML = "";
        let tbodyHTML = "";
        let rows = document.querySelectorAll('#adminStudentList .student-row');

        if (type === 'common') {
            title += "Ümumi Reytinq Siyahısı";
            theadHTML = `<tr><th>Sıra</th><th style="text-align:left;">Ad Soyad</th><th>C++ Cari</th><th>Py Cari</th><th>Ümumi Bal</th></tr>`;
            rows.forEach(row => {
                if (row.style.display !== "none") {
                    let rank = row.children[0].innerText;
                    let name = row.children[1].innerText;
                    let cpp = row.children[2].innerText.replace(' pt', '');
                    let py = row.children[3].innerText.replace(' pt', '');
                    let total = Number(cpp) + Number(py);
                    tbodyHTML += `<tr><td>${rank}</td><td style="text-align:left;">${name}</td><td>${cpp}</td><td>${py}</td><td><b>${total} pt</b></td></tr>`;
                }
            });
        } 
        else if (type === 'cpp') {
            title += "C++ Reytinq Siyahısı";
            theadHTML = `<tr><th>Sıra</th><th style="text-align:left;">Ad Soyad</th><th>C++ Balı</th></tr>`;
            rows.forEach(row => {
                if (row.style.display !== "none") {
                    let rank = row.children[0].innerText;
                    let name = row.children[1].innerText;
                    let cpp = row.children[2].innerText;
                    tbodyHTML += `<tr><td>${rank}</td><td style="text-align:left;">${name}</td><td><b>${cpp}</b></td></tr>`;
                }
            });
        } 
        else if (type === 'python') {
            title += "Python Reytinq Siyahısı";
            theadHTML = `<tr><th>Sıra</th><th style="text-align:left;">Ad Soyad</th><th>Python Balı</th></tr>`;
            rows.forEach(row => {
                if (row.style.display !== "none") {
                    let rank = row.children[0].innerText;
                    let name = row.children[1].innerText;
                    let py = row.children[3].innerText;
                    tbodyHTML += `<tr><td>${rank}</td><td style="text-align:left;">${name}</td><td><b>${py}</b></td></tr>`;
                }
            });
        }

        // PDF yazdırmaq üçün yeni pəncərə (iframe/window)
        const printWindow = window.open('', '', 'height=800,width=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                        h2 { text-align: center; color: #2ea44f; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
                        th { background-color: #f4f4f4; color: #333; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h2>${title}</h2>
                    <table>
                        <thead>${theadHTML}</thead>
                        <tbody>${tbodyHTML}</tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        
        // Pəncərə yükləndikdən sonra yazdırma dialoqunu açırıq
        printWindow.onload = function() {
            printWindow.focus();
            printWindow.print();
        };
    });
}
