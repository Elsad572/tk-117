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

// 3. MƏLUMAT MODALI
const infoTabBtn = document.getElementById('infoTabBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoModal = document.getElementById('closeInfoModal');
if (infoTabBtn && infoModal) infoTabBtn.onclick = () => { infoModal.style.display = 'flex'; };
if (closeInfoModal && infoModal) closeInfoModal.onclick = () => { infoModal.style.display =
