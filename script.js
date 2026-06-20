// 초기 학생 데이터 세팅 (로컬 스토리지에 없으면 기본값 사용)
const defaultData = {
    'stu1': { name: '김민수', points: 0, history: [] },
    'stu2': { name: '이수진', points: 0, history: [] },
    'stu3': { name: '박지훈', points: 0, history: [] }
};

let studentData = JSON.parse(localStorage.getItem('classPoints')) || defaultData;
let currentStudentId = null;

// 로그인 함수
function login(type) {
    if (type === 'admin') {
        const code = document.getElementById('admin-code').value;
        if (code === 'admin') { // 선생님 비밀번호 (필요시 변경)
            showScreen('admin-screen');
            updateAdminView();
            document.getElementById('admin-code').value = '';
        } else {
            alert('관리자 코드가 틀렸습니다.');
        }
    } else if (type === 'student') {
        const code = document.getElementById('student-code').value;
        if (studentData[code]) {
            currentStudentId = code;
            showScreen('student-screen');
            updateStudentView();
            document.getElementById('student-code').value = '';
        } else {
            alert('존재하지 않는 학생 코드입니다.');
        }
    }
}

// 로그아웃 함수
function logout() {
    currentStudentId = null;
    showScreen('login-screen');
}

// 화면 전환 함수
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 관리자 화면 업데이트
function updateAdminView() {
    const select = document.getElementById('student-select');
    const list = document.getElementById('admin-student-list');
    select.innerHTML = '';
    list.innerHTML = '';

    for (const [id, data] of Object.entries(studentData)) {
        // 셀렉트 박스 옵션 추가
        const option = document.createElement('option');
        option.value = id;
        option.textContent = data.name;
        select.appendChild(option);

        // 리스트 추가
        const li = document.createElement('li');
        li.innerHTML = `<span>${data.name}</span> <span>${data.points} P</span>`;
        list.appendChild(li);
    }
}

// 포인트 지급 함수
function givePoints() {
    const studentId = document.getElementById('student-select').value;
    const amount = parseInt(document.getElementById('point-amount').value);
    const reason = document.getElementById('point-reason').value;

    if (!amount || !reason) {
        alert('포인트 점수와 사유를 모두 입력해주세요!');
        return;
    }

    const today = new Date();
    const dateString = `${today.getMonth() + 1}/${today.getDate()}`;

    // 포인트 및 내역 추가
    studentData[studentId].points += amount;
    studentData[studentId].history.unshift({ date: dateString, amount: amount, reason: reason });

    // 로컬 스토리지에 저장 (새로고침해도 유지됨)
    localStorage.setItem('classPoints', JSON.stringify(studentData));

    alert(`${studentData[studentId].name} 학생에게 ${amount}포인트가 지급되었습니다.`);
    
    // 입력창 초기화 및 화면 갱신
    document.getElementById('point-amount').value = '';
    document.getElementById('point-reason').value = '';
    updateAdminView();
}

// 학생 화면 업데이트
function updateStudentView() {
    const data = studentData[currentStudentId];
    document.getElementById('student-welcome').innerText = `✨ ${data.name}의 화면`;
    document.getElementById('student-total-points').innerText = `${data.points} P`;
    
    const historyList = document.getElementById('student-history');
    historyList.innerHTML = '';

    if (data.history.length === 0) {
        historyList.innerHTML = '<li>아직 적립 내역이 없어요!</li>';
    } else {
        data.history.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>[${item.date}] ${item.reason}</span> <span>+${item.amount} P</span>`;
            historyList.appendChild(li);
        });
    }
}