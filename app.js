import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// FIREBASE BAĞLANTI BİLGİLERİNİZ
const firebaseConfig = {
  apiKey: "AIzaSyAu-k4uvpjsHitiKwhbE3D_HKJ_Sxt-l9A",
  authDomain: "tk-117-2ca94.firebaseapp.com",
  projectId: "tk-117-2ca94",
  storageBucket: "tk-117-2ca94.firebasestorage.app",
  messagingSenderId: "136903588293",
  appId: "1:136903588293:web:271df16698dc4b58cb33ac",
  measurementId: "G-LZQESYMFQF"
};

// Firebase Başlatma
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 1. Common Sürükleyici Sayfası (Öğrenci Listesini Canlı Çekme)
const studentList = document.getElementById('studentList');
if (studentList) {
    const q = query(collection(db, "students"), orderBy("points", "desc"));
    onSnapshot(q, (snapshot) => {
        studentList.innerHTML = '';
        let rank = 1;
        snapshot.forEach((doc) => {
            const student = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${rank}</span>
                <span>${student.name}</span>
                <span>${student.points} pt</span>
            `;
            studentList.appendChild(li);
            rank++;
        });
    });
}

// 2. Admin Paneli Giriş / Çıkış Mantığı
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const addStudentForm = document.getElementById('addStudentForm');

// Admin Girişi Yapma
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Giriş başarılı!");
            })
            .catch(error => alert("Hata: " + error.message));
    });
}

// Admin Çıkışı Yapma
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => alert("Çıkış yapıldı."));
    });
}

// Oturum Durumunu Takip Etme (Panel Göster/Gizle)
onAuthStateChanged(auth, (user) => {
    if (loginSection && adminPanel) {
        if (user) {
            loginSection.classList.add('hidden');
            adminPanel.classList.remove('hidden');
        } else {
            loginSection.classList.remove('hidden');
            adminPanel.classList.add('hidden');
        }
    }
});

// Yeni Öğrenci / Puan Ekleme Formu
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const points = Number(document.getElementById('studentPoints').value);

        try {
            await addDoc(collection(db, "students"), {
                name: name,
                points: points
            });
            addStudentForm.reset();
            alert("Öğrenci başarıyla eklendi!");
        } catch (e) {
            alert("Hata oluştu: " + e.message);
        }
    });
}