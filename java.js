// --- 1. ตั้งค่าตัวแปรเริ่มต้น ---
let widthValue = 0;
let hourAngle = 0;
let minuteAngle = 0;
let clockScore = 0;
let handsScore = 0;

// ตัวแปรสำหรับ Math Test
let mathCurrentValue = 100;
let mathStep = 1;
let mathCorrectCount = 0;
let mathScore = 0;

// ตัวแปรสำหรับ Recall Test
let recallScore = 0;
const secretWords = ["หลอดไฟ", "เก้าอี้", "รถยนต์"];

// ตัวแปรสำหรับ Orientation
let orientationScore = 0;

// --- 2. ระบบ Fake Progress Loading ---
const progressBar = document.getElementById('progress-bar');
const loaderWrapper = document.getElementById('loader-wrapper');

const fakeLoadingInterval = setInterval(() => {
    if (widthValue < 85) {
        widthValue += 1; 
        if (progressBar) progressBar.style.width = widthValue + '%';
    }
}, 30);

window.addEventListener('load', function() {
    clearInterval(fakeLoadingInterval);
    widthValue = 100;
    if (progressBar) progressBar.style.width = '100%';

    setTimeout(() => {
        const fadeOverlay = document.getElementById('white-fade-overlay');
        if (fadeOverlay) {
            fadeOverlay.style.display = 'block';
            fadeOverlay.style.opacity = '1';
            
            setTimeout(() => {
                if (loaderWrapper) loaderWrapper.style.display = 'none';
                goToLogin();
                fadeOverlay.style.opacity = '0';
                setTimeout(() => { fadeOverlay.style.display = 'none'; }, 600);
            }, 600);
        }
    }, 500); 
});

// --- 3. ฟังก์ชันพื้นฐาน (Typewriter & Navigation) ---
function goToLogin() {
    const login = document.getElementById('login-container');
    if(login) {
        login.style.display = 'flex';
        login.style.opacity = '1';
    }
}

function typeWriter(text, elementId, speed, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = ""; 
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else { if (callback) callback(); }
    }
    typing();
}

// --- 4. หน้า Login & เริ่มต้นเดินทาง ---
const infoForm = document.getElementById('info-form');
if(infoForm) {
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fade = document.getElementById('white-fade-overlay');
        const welcomeVideo = document.getElementById('welcome-video');

        if (fade) { fade.style.display = 'block'; fade.style.opacity = '1'; }
        
        setTimeout(() => {
            document.getElementById('login-container').style.display = 'none';
            const welcomePage = document.getElementById('welcome-garden-page');
            welcomePage.style.display = 'flex';
            welcomePage.style.opacity = '1';
            
            if (welcomeVideo) welcomeVideo.play().catch(e => console.log(e));

            if (fade) fade.style.opacity = '0';
            setTimeout(() => {
                typeWriter("ยินดีต้อนรับสู่สวนความจำที่แสนอบอุ่น พวกเราจะนําพาทุกท่านเดินเล่นและทบทวนความทรงจำไปด้วยกัน", "typing-text", 50, () => {
                    const btn = document.getElementById('start-journey-btn');
                    btn.style.display = 'inline-block';
                    setTimeout(() => { btn.style.opacity = '1'; }, 100);
                });
            }, 500);
        }, 600);
    });
}

// --- 5. ด่านที่ 1: จดจำ 3 คำ ---
const startJourneyBtn = document.getElementById('start-journey-btn');
if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', function() {
        document.getElementById('welcome-garden-page').style.display = 'none';
        document.getElementById('memory-test-page').style.display = 'flex';
        
        typeWriter("ขอให้ทุกท่านลองจำคำต่อไปนี้ดูนะ...", "instruction-text", 50, () => {
            setTimeout(() => {
                const words = document.getElementById('words-container');
                words.style.display = 'block';
                setTimeout(() => { words.style.opacity = "1"; }, 100);
                
                setTimeout(() => {
                    words.style.opacity = "0";
                    setTimeout(() => {
                        words.style.display = 'none';
                        goToClockPage();
                    }, 1000);
                }, 7000); 
            }, 1000);
        });
    });
}

// --- 6. ด่านที่ 2: ระบบนาฬิกา ---
function goToClockPage() {
    document.getElementById('memory-test-page').style.display = 'none';
    document.getElementById('clock-test-page').style.display = 'flex';
    typeWriter("อรุณสวัสดิ์ ตอนนี้คุณพึ่งตื่นนอนแต่นาฬิกาคุณดันกลับมาพังซะได้ คุณช่วยซ่อมนาฬิกาให้หน่อยได้มั้ย ตอนนี้ 11:10", "clock-instruction", 50, () => {
        setupClockGame();
    });
}

function setupClockGame() {
    const pile = document.getElementById('numbers-pile');
    const face = document.getElementById('clock-face'); 
    if (!pile || !face) return;

    pile.innerHTML = ""; 
    face.querySelectorAll('.drop-zone').forEach(z => z.remove());
    
    const radius = 125, centerX = 160, centerY = 160;

    for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = centerX + radius * Math.cos(angle); 
        const y = centerY + radius * Math.sin(angle);
        
        const zone = document.createElement('div');
        zone.className = 'drop-zone';
        zone.id = `zone-${i}`;
        zone.style.left = x + 'px'; zone.style.top = y + 'px';
        face.appendChild(zone);

        const num = document.createElement('div');
        num.className = 'draggable-number';
        num.innerText = i;
        num.id = `num-${i}`;
        makeElementDraggable(num);
        pile.appendChild(num);
    }
}

function makeElementDraggable(el) {
    let isDragging = false;
    const startDrag = (e) => {
        isDragging = true;
        el.style.position = 'fixed';
        const moveAt = (ev) => {
            const clientX = ev.clientX || (ev.touches && ev.touches[0].clientX);
            const clientY = ev.clientY || (ev.touches && ev.touches[0].clientY);
            el.style.left = clientX - el.offsetWidth / 2 + 'px';
            el.style.top = clientY - el.offsetHeight / 2 + 'px';
        };
        const onMouseMove = (ev) => { if(isDragging) moveAt(ev); };
        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', stopDrag);
            checkDrop(el);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onMouseMove, {passive: false});
        document.addEventListener('touchend', stopDrag);
    };
    el.onmousedown = startDrag;
    el.ontouchstart = startDrag;
}

function checkDrop(el) {
    const zones = document.querySelectorAll('.drop-zone');
    let dropped = false;
    zones.forEach(zone => {
        const r1 = el.getBoundingClientRect(), r2 = zone.getBoundingClientRect();
        const dist = Math.sqrt(Math.pow((r1.left+r1.width/2)-(r2.left+r2.width/2), 2) + Math.pow((r1.top+r1.height/2)-(r2.top+r2.height/2), 2));
        if (dist < 45 && zone.children.length === 0) {
            zone.appendChild(el);
            el.style.position = 'absolute'; el.style.left = '50%'; el.style.top = '50%';
            el.style.transform = 'translate(-50%, -50%)';
            dropped = true;
        }
    });
    if (!dropped) {
        document.getElementById('numbers-pile').appendChild(el);
        el.style.position = 'static'; el.style.transform = 'none';
    }
    if (document.querySelectorAll('.drop-zone .draggable-number').length === 12) {
        document.getElementById('clock-hands').style.display = 'block';
        document.getElementById('clock-submit-btn').style.display = 'inline-block';
        enableRotation('hour-hand', 'hour');
        enableRotation('minute-hand', 'minute');
    }
}

function enableRotation(id, type) {
    const hand = document.getElementById(id);
    hand.onclick = () => {
        if (type === 'hour') { hourAngle = (hourAngle + 30) % 360; hand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`; }
        else { minuteAngle = (minuteAngle + 30) % 360; hand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`; }
    };
}

document.getElementById('clock-submit-btn').onclick = function() {
    clockScore = (document.querySelectorAll('.drop-zone .draggable-number').length === 12) ? 1 : 0;
    handsScore = (hourAngle === 330 && minuteAngle === 60) ? 1 : 0;
    const overlay = document.getElementById('white-fade-overlay');
    overlay.style.display = 'block'; overlay.style.opacity = '1';
    setTimeout(() => {
        document.getElementById('clock-test-page').style.display = 'none';
        startMathTest(); 
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
    }, 800);
};

// --- 7. ด่านที่ 3: ระบบคำนวณ (Math Test) ---
function startMathTest() {
    const mathPage = document.getElementById('math-test-page');
    mathCurrentValue = 100; mathStep = 1; mathCorrectCount = 0;
    mathPage.style.display = 'flex';
    setTimeout(() => {
        document.getElementById('math-caption').style.opacity = "1"; 
        setTimeout(() => {
            document.getElementById('math-question-container').style.opacity = "1"; 
            document.getElementById('math-next-btn').style.opacity = "1";
            updateMathUI();
        }, 1200); 
    }, 500);
}

function updateMathUI() {
    document.getElementById('current-num').innerText = mathCurrentValue;
    document.getElementById('math-step').innerText = mathStep;
    const input = document.getElementById('math-answer');
    input.value = ""; input.focus();
}

document.getElementById('math-next-btn').onclick = function() {
    const userAnswer = parseInt(document.getElementById('math-answer').value);
    if (isNaN(userAnswer)) { alert("กรุณาใส่คำตอบ"); return; }
    if (userAnswer === (mathCurrentValue - 7)) mathCorrectCount++;
    mathCurrentValue = userAnswer; mathStep++;
    if (mathStep <= 5) updateMathUI();
    else {
        if (mathCorrectCount >= 4) mathScore = 3;
        else if (mathCorrectCount >= 2) mathScore = 2;
        else if (mathCorrectCount === 1) mathScore = 1;
        document.getElementById('math-test-page').style.display = 'none';
        startRecallTest();
    }
};

// --- 8. ด่านที่ 4: ระบบระลึกถึง (Recall Test) ---
function startRecallTest() {
    const recallPage = document.getElementById('recall-test-page');
    const inputCon = document.getElementById('recall-input-container');
    recallPage.style.display = 'flex';
    setTimeout(() => {
        typeWriter("เมื่อคืนเราฝันอะไรก็ไม่รู้แต่พอจำลางๆได้ว่ามีของ3อย่างนั้นอยู่ด้วยคุณช่วยเรานึกออกมาได้มั้ย?", "recall-caption", 50, () => {
            setTimeout(() => {
                inputCon.style.transition = "opacity 1s ease";
                inputCon.style.opacity = "1";
                document.getElementById('recall-1').focus();
            }, 800);
        });
    }, 500);
}

document.getElementById('recall-next-btn').onclick = function() {
    const r1 = document.getElementById('recall-1').value.trim();
    const r2 = document.getElementById('recall-2').value.trim();
    const r3 = document.getElementById('recall-3').value.trim();
    recallScore = 0;
    [r1, r2, r3].forEach(ans => { if (secretWords.includes(ans)) recallScore++; });

    const overlay = document.getElementById('white-fade-overlay');
    overlay.style.display = 'block'; overlay.style.opacity = '1';
    setTimeout(() => {
        document.getElementById('recall-test-page').style.display = 'none';
        startOrientationTest(); // ไปด่านวันเกิดต่อ
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
    }, 800);
};

// --- 9. ด่านสุดท้าย: การรับรู้ (Orientation Test) ---
function startOrientationTest() {
    const oriPage = document.getElementById('orientation-test-page');
    const inputCon = document.getElementById('orientation-input-container');
    oriPage.style.display = 'flex';
    setTimeout(() => {
        typeWriter("ขอบคุณพวกคุณมากเลยนะที่ช่วยเรา เหลือคำถามสุดท้ายแล้วเราอยากรู้จังว่าในโลกของคุณ วันนี้วันที่เท่าไหร่ เดือนอะไรก็ปีอะไรด้วย", "orientation-caption", 50, () => {
            setTimeout(() => {
                inputCon.style.transition = "opacity 1s ease";
                inputCon.style.opacity = "1";
                document.getElementById('ori-date').focus();
            }, 800);
        });
    }, 500);
}

document.getElementById('ori-next-btn').onclick = function() {
    const d = parseInt(document.getElementById('ori-date').value);
    const m = document.getElementById('ori-month').value.trim();
    const y = parseInt(document.getElementById('ori-year').value);

    if (!d || !m || !y) { alert("กรุณากรอกข้อมูลให้ครบถ้วน"); return; }

    const now = new Date();
    orientationScore = 0;
    if (d === now.getDate()) orientationScore++;
    const currentMonthTH = now.toLocaleDateString('th-TH', { month: 'long' });
    if (m === currentMonthTH || m === currentMonthTH.replace('เดือน', '')) orientationScore++;
    if (y === now.getFullYear() || y === (now.getFullYear() + 543)) orientationScore++;

    goToFarewell();
};

function goToFarewell() {
    // ปิดหน้าเก่า เปิดหน้าใหม่
    document.getElementById('orientation-test-page').style.display = 'none';
    const farewellPage = document.getElementById('farewell-page');
    
    if (farewellPage) {
        farewellPage.style.display = 'flex'; // CSS จะจัดการสีดำและการจัดวางให้เอง
    }

    const msg = "ขอบคุณนะที่ช่วยเหลือเราตลอดและทำให้เรามีรอยยิ้ม แต่ว่ามันคงถึงเวลาที่เราต้องจากกันแล้วละ โชคดีนะ...";
    
    // เรียกใช้ Typewriter ตามปกติ
    typeWriter(msg, "farewell-text", 70, () => {
        setTimeout(() => {
            calculateAndShowResult();
        }, 3000);
    });
}

function calculateAndShowResult() {
    // --- 1. สรุปคะแนนดิบแยกตามด้าน (เพื่อให้กราฟแยกสีได้) ---
    // ปรับคะแนนให้เป็นสัดส่วนเต็มด้านละ 10 (เพื่อให้รวมกันได้ 30 ตามเกณฑ์ของคุณ)
    
    // ด้านความจำ (Recall): มี 3 คำ คำละ 3.33 คะแนน -> เต็ม 10
    let memoryScoreFinal = recallScore ; 
    
    // ด้านสมาธิ/จดจ่อ (Clock + Math): นาฬิกา(2) + เลข(3) = 5 คะแนน -> คูณ 2 ให้เต็ม 10
    let focusScoreFinal = (clockScore + handsScore + mathScore); 
    
    // ด้านการรับรู้ (Orientation): มี 3 ข้อ 
    let orientScoreFinal = orientationScore ;

    // --- 2. รวมคะแนนทั้งหมดเพื่อประมวลผลความเสี่ยง ---
    let totalScore = recallScore + clockScore + handsScore + mathScore + orientationScore;

    // บวกแต้มต่อการศึกษา (+1)
    const eduLevel = document.getElementById('user-education').value;
    if (eduLevel === "below_m6") {
        totalScore += 1;
    }
    
    // ป้องกันคะแนนเกิน 30 (ตามเกณฑ์ที่คุณตั้งไว้)
    if (totalScore > 11) totalScore = 11;

    // แสดงเปอร์เซ็นต์ภาพรวมตรงกลางวงกลม
    const percentage = Math.round((totalScore / 11) * 100);
    document.getElementById('total-percentage').innerText = percentage + "%";

    // --- 3. แสดงหน้าผลลัพธ์ ---
    document.getElementById('farewell-page').style.display = 'none';
    document.getElementById('result-page').style.display = 'flex';
    document.body.style.overflowY = "auto"; // เปิดให้เลื่อนหน้าจอได้

    // --- 4. วาดกราฟวงกลมแยกสีตามด้าน ---
    const ctx = document.getElementById('resultChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ความจำระยะสั้น', 'สมาธิและการจดจ่อ', 'การรับรู้'],
            datasets: [{
                // ส่งค่าที่คำนวณแยกด้านไว้ (10, 10, 10)
                data: [memoryScoreFinal, focusScoreFinal, orientScoreFinal], 
                backgroundColor: [
                    '#e06666', // สีแดง สำหรับความจำ
                    '#82954b', // สีเขียว สำหรับสมาธิ
                    '#ffd966'  // สีเหลือง สำหรับการรับรู้
                ],
                borderWidth: 5,
                borderColor: '#ffffff', // เส้นคั่นระหว่างสี
                hoverOffset: 4
            }]
        },
        options: {
            cutout: '70%', // ทำวงกลมให้เป็นโดนัท
            plugins: {
                legend: { display: false } // ปิด Legend เดิม เพราะเราจะดูจากสีเอา
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // --- 5. อัปเดตการแปรผลสีของการ์ด (เขียว/เหลือง/แดง) ---
    updateRiskDisplay(totalScore);
}

function updateRiskDisplay(score) {
    const riskCard = document.getElementById('risk-card');
    const riskTitle = document.getElementById('risk-level-title');
    const riskDesc = document.getElementById('risk-description');
    const adviceList = document.getElementById('advice-list');

    if (score >= 9) {
        // 25 - 30 คะแนน: ปกติ (สีเขียว)
        riskCard.style.backgroundColor = "#82954b"; 
        riskCard.style.color = "white";
        riskTitle.innerText = "ปกติ (Normal)";
        riskDesc.innerText = "ท่านมีสุขภาพสมองที่แข็งแรงดีในขณะนี้ ขอให้รักษาพฤติกรรมสุขภาพที่ดีนี้ไว้อย่างต่อเนื่องครับ";
        adviceList.innerHTML = "<li>✅ ออกกำลังกายสม่ำเสมอ</li><li>✅ รับประทานอาหารครบ 5 หมู่</li>";
    } else if (score >=6) {
        // 18 - 24 คะแนน: เสี่ยงบกพร่องเล็กน้อย (สีเหลือง)
        riskCard.style.backgroundColor = "#ffd966";
        riskCard.style.color = "#444";
        riskTitle.innerText = "เสี่ยงบกพร่องเล็กน้อย (MCI)";
        riskDesc.innerText = "เริ่มพบสัญญาณการทำงานของสมองที่ลดลงเล็กน้อย แนะนำให้ปรึกษาแพทย์เพื่อประเมินอย่างละเอียด";
        adviceList.innerHTML = "<li>⚠️ ปรึกษาแพทย์เพื่อตรวจเช็คเพิ่มเติม</li><li>⚠️ ฝึกกิจกรรมลับสมอง เช่น เล่นเกมทายคำ</li>";
    } else {
        // ต่ำกว่า 18 คะแนน: เสี่ยงสูง (สีแดง)
        riskCard.style.backgroundColor = "#e06666";
        riskCard.style.color = "white";
        riskTitle.innerText = "ควรได้รับการดูแลพิเศษ";
        riskDesc.innerText = "พบสัญญาณที่ควรได้รับการตรวจวินิจฉัยจากแพทย์เฉพาะทางโดยเร็ว เพื่อวางแผนการดูแลที่เหมาะสม";
        adviceList.innerHTML = "<li>🔴 นัดพบแพทย์เฉพาะทางประสาทวิทยา</li><li>🔴 ครอบครัวควรดูแลใกล้ชิดเป็นพิเศษ</li>";
    }
   
   
    // 1. ฟังก์ชันสำหรับส่งข้อมูล (แก้ไขชื่อให้ตรงกันและแก้ตัวแปร payload)
function sendDataToSheet(userData) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbybaEqgt7HlzGLnTo97BNw_x40T4uHT32RGaaRDdQHNHT-TJ_PlNddZIFtggQoM12F0/exec';

    console.log("กำลังส่งข้อมูล:", userData); // เพิ่มไว้เช็กใน Console

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData) // เปลี่ยนจาก payload เป็น userData
    })
    .then(() => {
        console.log("ส่งข้อมูลสำเร็จ!");
    })
    .catch(error => {
        console.error("เกิดข้อผิดพลาด:", error);
    });
}

// 2. ฟังก์ชันคำนวณผล (ตรวจสอบชื่อการเรียกใช้ตอนท้าย)
function calculateAndShowResult() {
    // ... โค้ดคำนวณคะแนนเดิมของคุณ ...
    // สมมติว่า totalScore ถูกคำนวณไว้แล้วข้างบนนี้

    // เตรียมข้อมูลที่จะส่ง
    const userData = {
        age: document.getElementById('user-age').value,
        gender: document.getElementById('user-gender').value,
        education: document.getElementById('user-education').value,
        disease: document.getElementById('user-disease').value,
        totalScore: totalScore, 
        riskLevel: document.getElementById('risk-level-title').innerText
    };

    // เรียกใช้ฟังก์ชันส่งข้อมูล (ชื่อต้องตรงกับข้างบน)
    sendDataToSheet(userData);
    
    // แสดงหน้าผลลัพธ์ของคุณต่อ...
    document.getElementById('result-page').style.display = 'block';
}

}
