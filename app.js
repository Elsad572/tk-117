import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

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
const auth = getAuth(app);

const studentList = document.getElementById('studentList');
if (studentList) {
    // Ümumi xala görə çoxdan aza doğru sıralayır
    const q = query(collection(db, "students"), orderBy("totalPoints", "desc"));
    onSnapshot(q, (snapshot) => {
        studentList.innerHTML = '';
        let rank = 1;
        snapshot.forEach((doc) => {
            const student = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${rank}</span>
                <span>${student.name}</span>
                <span>${student.cppPoints || 0} pt</span>
                <span>${student.pythonPoints || 0} pt</span>
                <span><strong>${student.totalPoints || 0} pt</strong></span>
                <span style="font-size: 12px; color: #8b949e;">${student.lastUpdated || 'Yoxdur'}</span>
            `;
            studentList.appendChild(li);
            rank++;
        });
    });
}

const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const addStudentForm = document.getElementById('addStudentForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => alert("Giriş uğurludur!"))
            .catch(error => alert("Xəta: " + error.message));
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => alert("Çıxış edildi."));
    });
}

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

if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const cppPoints = Number(document.getElementById('cppPoints').value);
        const pythonPoints = Number(document.getElementById('pythonPoints').value);
        const totalPoints = cppPoints + pythonPoints;
        
        // Bu günün tarixini keçmiş reytinq qeydi üçün alırıq
        const today = new Date();
        const dateString = today.toLocaleDateString('az-AZ') + ' ' + today.toLocaleTimeString('az-AZ', {hour: '2-digit', minute:'2-digit'});

        try {
            await addDoc(collection(db, "students"), {
                name: name,
                cppPoints: cppPoints,
                pythonPoints: pythonPoints,
                totalPoints: totalPoints,
                lastUpdated: dateString
            });
            addStudentForm.reset();
            alert("Tələbə məlumatları uğurla əlavə edildi!");
        } catch (e) {
            alert("Xəta baş verdi: " + e.message);
        }
    });
}
