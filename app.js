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

// Məlumat Modalı Məntiqi
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
// IT Lüğəti Məlumatları (50 Termin)
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
    { term: "Pointer", az: "Göstərici (Pointer)", tr: "İşaretçi", ru: "Указатель" },
    { term: "Polymorphism", az: "Polimorfizm", tr: "Çok biçimlilik", ru: "Полиморфизм" },
    { term: "Recursion", az: "Rekursiya", tr: "Özyineleme", ru: "Рекурсия" },
    { term: "String", az: "Sətir tipi", tr: "Metin dizisi", ru: "Строка" },
    { term: "Syntax", az: "Sintaksis", tr: "Sözdizimi", ru: "Синтаксис" },
    { term: "Variable", az: "Dəyişən", tr: "Değişken", ru: "Переменная" },
    { term: "API", az: "Tətbiqi proqramlaşdırma interfeysi", tr: "Uygulama programlama arayüzü", ru: "Интерфейс программирования приложений" },
    { term: "Backend", az: "Server tərəfi", tr: "Sunucu tarafı", ru: "Серверная часть" },
    { term: "Frontend", az: "İstifadəçi interfeysi tərəfi", tr: "Ön yüz", ru: "Пользовательская часть" },
    { term: "Cloud Computing", az: "Bulud hesablamaları", tr: "Bulut bilişim", ru: "Облачные вычисления" },
    { term: "Cybersecurity", az: "Kibertəhlükəsizlik", tr: "Siber güvenlik", ru: "Кибербезопасность" },
    { term: "Data Structure", az: "Verilənlər strukturu", tr: "Veri yapısı", ru: "Структура данных" },
    { term: "Encryption", az: "Şifrələmə", tr: "Şifreleme", ru: "Шифрование" },
    { term: "Git", az: "Versiya nəzarət sistemi", tr: "Sürüm kontrol sistemi", ru: "Система контроля версий" },
    { term: "Hardware", az: "Aparat təminatı", tr: "Donanım", ru: "Аппаратное обеспечение" },
    { term: "Software", az: "Proqram təminatı", tr: "Yazılım", ru: "Программное обеспечение" },
    { term: "IDE", az: "Inteqrasiya olunmuş iş mühiti", tr: "Tümleşik geliştirme ortamı", ru: "Интегрированная среда разработки" },
    { term: "Library", az: "Kitabxana", tr: "Kütüphane", ru: "Библиотека" },
    { term: "Machine Learning", az: "Maşın öyrənməsi", tr: "Makine öğrenmesi", ru: "Машинное обучение" },
    { term: "Network", az: "Şəbəkə", tr: "Ağ", ru: "Сеть" },
    { term: "Operating System", az: "Əməliyyat sistemi", tr: "İşletim sistemi", ru: "Операционная система" },
    { term: "Queue", az: "Növbə", tr: "Kuyruk", ru: "Очередь" },
    { term: "Stack", az: "Stek", tr: "Yığın", ru: "Стек" },
    { term: "Repository", az: "Repozitoriya", tr: "Depo", ru: "Репозиторий" },
    { term: "Server", az: "Server", tr: "Sunucu", ru: "Сервер" },
    { term: "Thread", az: "Axın", tr: "İş parçacığı", ru: "Поток" },
    { term: "User Interface (UI)", az: "İstifadəçi interfeysi", tr: "Kullanıcı arayüzü", ru: "Пользовательский интерфейс" },
    { term: "User Experience (UX)", az: "İstifadəçi təcrübəsi", tr: "Kullanıcı deneyimi", ru: "Пользовательский опыт" },
    { term: "Virtual Machine", az: "Virtual maşın", tr: "Sanal makine", ru: "Виртуальная машина" },
    { term: "Algorithm Complexity", az: "Alqoritm mürəkkəbliyi", tr: "Algoritma karmaşıklığı", ru: "Сложность алгоритма" },
    { term: "Big Data", az: "Böyük verilənlər", tr: "Büyük veri", ru: "Большие данные" },
    { term: "Binary Code", az: "İkilik kod", tr: "İkili kod", ru: "Двоичный код" },
    { term: "Bug", az: "Xəta / Proqram qüsuru", tr: "Yazılım hatası", ru: "Ошибка в программе" },
    { term: "Cache", az: "Keş yaddaş", tr: "Önbellek", ru: "Кэш" },
    { term: "Constant", az: "Sabit", tr: "Sabit", ru: "Константа" },
    { term: "Exception", az: "İstisna", tr: "Istisna", ru: "Исключение" }
];

// Lüğət Modalı Məntiqi
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
        item.az.toLowerCase().includes(filter.toLowerCase()) ||
        item.tr.toLowerCase().includes(filter.toLowerCase()) ||
        item.ru.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dict-item';
        div.innerHTML = `
            <div class="dict-term">🇬🇧 ${item.term}</div>
            <div class="dict-trans">
                <span>🇦🇿 AZ: ${item.az}</span>
                <span>🇹🇷 TR: ${item.tr}</span>
                <span>🇷🇺 RU: ${item.ru}</span>
            </div>
        `;
        dictList.appendChild(div);
    });
}

if (dictBtn) dictBtn.onclick = () => { renderDict(); dictModal.style.display = 'flex'; };
if (closeDictModal) closeDictModal.onclick = () => dictModal.style.display = 'none';
if (dictSearch) dictSearch.oninput = (e) => renderDict(e.target.value);

// Dil Seçimi Və İNTERFEYS TƏRCÜMƏSİ
const TRANSLATIONS = {
    az: { dict: "IT Lüğəti", infoTab: "Məlumat", teaches: "Tədris edir:", infoTitle: "Məfhum və Təşkilat Məlumatları", creator: "Yaradıcı:", uni: "Universitet:", faculty: "Fakültə:", specialty: "İxtisas:", leaderboard: "Ümumi Reytinq Siyahısı", clickInfo: "Həftəlik balları görmək üçün tələbə adının üstünə klikləyin.", nameHeader: "Ad Soyad", scoreHeader: "Ümumi Bal" },
    tr: { dict: "BT Sözlüğü", infoTab: "Bilgi", teaches: "Eğitmen:", infoTitle: "Bilgi ve Organizasyon", creator: "Geliştirici:", uni: "Üniversite:", faculty: "Fakülte:", specialty: "Bölüm:", leaderboard: "Genel Sıralama Listesi", clickInfo: "Haftalık puanları görmek için öğrenci adına tıklayın.", nameHeader: "Ad Soyad", scoreHeader: "Toplam Puan" },
    en: { dict: "IT Dictionary", infoTab: "Info", teaches: "Instructor:", infoTitle: "Info & Organization", creator: "Creator:", uni: "University:", faculty: "Faculty:", specialty: "Specialty:", leaderboard: "Overall Leaderboard", clickInfo: "Click on a student's name to view weekly scores.", nameHeader: "Full Name", scoreHeader: "Total Score" },
    ru: { dict: "IT Словарь", infoTab: "Информация", teaches: "Преподаватель:", infoTitle: "Информация и Организация", creator: "Создатель:", uni: "Университет:", faculty: "Факультет:", specialty: "Специальность:", leaderboard: "Общий Рейтинг", clickInfo: "Нажмите на имя студента, чтобы увидеть еженедельные баллы.", nameHeader: "Имя Фамилия", scoreHeader: "Общий Балл" }
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

// Siyahını Yükləmək
function loadLeaderboard(type, elementId) {
    const listEl = document.getElementById(elementId);
    if (!listEl) return;

    onSnapshot(collection(db, "students"), (snapshot) => {
        listEl.innerHTML = '';
        let students = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            let score = (data.totalCpp || 0) + (data.totalPython || 0);
            students.push({ id: doc.id, name: data.name || doc.id, score, data });
        });

        students.sort((a,b) => b.score - a.score);

        let rank = 1;
        students.forEach(st => {
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
    });
}

loadLeaderboard('common', 'commonList');
