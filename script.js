const app = document.getElementById('app');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const mainContent = document.getElementById('main-content');
const title = document.getElementById('title');
const description = document.getElementById('description');
const optionsContainer = document.getElementById('options-container');
const videoOverlay = document.getElementById('video-overlay');
const video = document.getElementById('presentation-video');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackContent = document.getElementById('feedback-content');

const loader = document.getElementById('loader');
const feedbackText = document.getElementById('feedback-text');

let currentState = 0;

function renderOptions(optionsList, baseState) {
    optionsContainer.innerHTML = '';
    optionsList.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = `option delay-${index + 1}`;
        div.innerHTML = `<div class="option-num">${index + 1}</div><p>${opt.text}</p>`;
        div.addEventListener('click', () => {
            currentState = baseState + opt.nextOffset;
            updateState();
        });
        optionsContainer.appendChild(div);
    });
}

const states = [
    {
        name: 'INTRO',
        onEnter: () => {
            title.textContent = '';
            description.innerHTML = '<div class="cinematic-intro">Блок<br><span class="highlight">Транспорт и право</span></div>';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'SCENARIO',
        onEnter: () => {
            title.textContent = 'Что делать?';
            description.textContent = 'Ситуация: Вы спешили и перешли дорогу на красный свет. Вас остановил полицейский. Вы плохо говорите по-русски. Как лучше поступить?';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'CHOICES',
        onEnter: () => {
            title.textContent = 'Выберите вариант:';
            description.textContent = '';
            renderOptions([
                { text: 'Сказать, что вы не понимаете по-русски.', nextOffset: 1 },
                { text: 'Предложить взятку полицейскому.', nextOffset: 2 },
                { text: 'Попробовать убежать.', nextOffset: 3 },
                { text: 'Позвонить ответственному лицу из университета и поехать с полицейским в отдел.', nextOffset: 4 }
            ], currentState);
            optionsContainer.classList.remove('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'VIDEO_1',
        videoSrc: '/video/1.webm',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_2',
        videoSrc: '/video/2.webm',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_3',
        videoSrc: '/video/3.webm',
        feedback: 'wrong'
    },
    {
        name: 'VIDEO_4',
        videoSrc: '/video/4.webm',
        feedback: 'correct'
    },
    {
        name: 'CONCLUSION',
        onEnter: () => {
            feedbackOverlay.classList.add('hidden');
            videoOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            title.textContent = 'Правильный выбор!';
            description.innerHTML = `
                Придется подождать представителя университета в полиции. Он объяснит ситуацию, и вас отпустят или выпишут штраф 500 рублей. Главное — вы избежите серьезных проблем.
                <br><br>
                <strong>Помните: не стоит совершать необдуманные поступки, даже если мы, например, неправы.</strong>
            `;
            optionsContainer.classList.add('hidden');
            nextBtn.classList.remove('pulse');
        }
    },
    {
        name: 'INTRO_FINANCE',
        onEnter: () => {
            title.textContent = '';
            description.innerHTML = '<div class="cinematic-intro"><span class="highlight">Финансовый блок</span></div>';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
            nextBtn.textContent = 'Начать';
        }
    },
    {
        name: 'SCENARIO_FINANCE',
        onEnter: () => {
            title.textContent = 'Что делать?';
            description.textContent = 'Вам позвонил неизвестный и предложил работу по телефону. Как лучше поступить?';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'FINANCE_ORG_VIDEO',
        videoSrc: '/video 1/org.webm',
        feedback: null
    },
    {
        name: 'FINANCE_TXT_SMS',
        onEnter: () => {
            title.textContent = '';
            description.textContent = '';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
            
            const text = "Мошенник прислал SMS со ссылкой под видом регистрации на работу";
            let i = 0;
            if (window.typingInterval) clearInterval(window.typingInterval);
            
            window.typingInterval = setInterval(() => {
                 if (i < text.length) {
                     description.textContent += text.charAt(i);
                     i++;
                 } else {
                     clearInterval(window.typingInterval);
                 }
            }, 50);
        }
    },
    {
        name: 'FINANCE_CHOICES',
        onEnter: () => {
            title.textContent = 'Выберите вариант:';
            description.textContent = '';
            renderOptions([
                { text: 'Перейти по ссылке.', nextOffset: 1 },
                { text: 'Не переходить по ссылке.', nextOffset: 2 },
                { text: 'Позвонить куратору или ответственному за студентов', nextOffset: 3 }
            ], currentState);
            optionsContainer.classList.remove('hidden');
            nextBtn.classList.add('pulse');
        }
    },
    {
        name: 'FINANCE_VIDEO_1',
        videoSrc: '/video 1/h i 1.webm',
        feedback: 'wrong'
    },
    {
        name: 'FINANCE_VIDEO_2',
        videoSrc: '/video 1/h i 2.webm',
        feedback: 'wrong'
    },
    {
        name: 'FINANCE_VIDEO_3',
        videoSrc: '/video 1/h i 3.webm',
        feedback: 'correct'
    },
    {
        name: 'FINANCE_CONCLUSION',
        onEnter: () => {
            feedbackOverlay.classList.add('hidden');
            videoOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            title.textContent = 'Правильный выбор!';
            description.innerHTML = `
                Связь с куратором помогает избежать обмана.
                <br><br>
                <strong>Будьте бдительны! Одно нажатие на неизвестную ссылку может стоить вам всех денег на банковской карте.</strong>
            `;
            optionsContainer.classList.add('hidden');
            nextBtn.classList.remove('pulse');
        }
    },
    {
        name: 'FINAL_THANKS',
        onEnter: () => {
            title.textContent = '';
            description.innerHTML = '<div class="cinematic-intro" style="font-size: 4.5rem; margin-top: 20vh; text-transform: none;">Спасибо!</div>';
            optionsContainer.classList.add('hidden');
            nextBtn.classList.add('pulse');
            nextBtn.textContent = 'Обратно в начало';
            backBtn.style.display = 'none'; // Completely hide back button on the final screen
            
            // Remove the card frame background
            mainContent.style.background = 'transparent';
            mainContent.style.border = 'none';
            mainContent.style.boxShadow = 'none';
            mainContent.style.backdropFilter = 'none';
        }
    }
];

// Global Preloader
const preloadedVideos = new Map();

async function preloadAllVideos() {
    states.forEach(async (state) => {
        if (state.videoSrc) {
            try {
                const response = await fetch(state.videoSrc);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                preloadedVideos.set(state.videoSrc, url);
                console.log(`Preloaded: ${state.videoSrc}`);
            } catch (err) {
                // Fallback to invisible video element if fetch fails
                const videoElem = document.createElement('video');
                videoElem.src = state.videoSrc;
                videoElem.preload = 'auto';
                videoElem.load();
                preloadedVideos.set(state.videoSrc, state.videoSrc);
            }
        }
    });
}

function updateState() {
    if(window.typingInterval) clearInterval(window.typingInterval);
    const state = states[currentState];

    // --- STAGE 1: HARD RESET ---
    video.onended = null;
    video.onerror = null;
    video.onplaying = null;
    video.oncanplay = null;
    video.onwaiting = null;

    // Force hide overlays
    videoOverlay.classList.add('hidden');
    feedbackOverlay.classList.add('hidden');
    loader.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Hard reset card frame styles
    mainContent.style.background = '';
    mainContent.style.border = '';
    mainContent.style.boxShadow = '';
    mainContent.style.backdropFilter = '';
    
    // Clear icons and text
    feedbackContent.textContent = '';
    feedbackText.textContent = '';

    // Reset staggered animations
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('option-visible'));
    nextBtn.classList.remove('pulse');
    nextBtn.innerHTML = '<span>Далее</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

    // --- STAGE 1.5: NAVIGATION BUTTONS ---
    if (currentState === 0) {
        backBtn.classList.add('hidden');
    } else {
        backBtn.classList.remove('hidden');
    }

    // --- STAGE 2: APPLY NEW STATE ---
    if (state.onEnter) {
        state.onEnter();
        
        if (!optionsContainer.classList.contains('hidden')) {
            setTimeout(() => {
                document.querySelectorAll('.option').forEach(opt => {
                    if (!optionsContainer.classList.contains('hidden')) {
                         opt.classList.add('option-visible');
                    }
                });
            }, 30);
        }
    }

    if (state.videoSrc) {
        playVideoSequence(state.videoSrc, state.feedback, currentState);
    }
}

function playVideoSequence(src, type, stateIndex) {
    mainContent.classList.add('hidden');
    videoOverlay.classList.remove('hidden');

    const preloaded = preloadedVideos.get(src);
    if (preloaded) {
        video.src = preloaded;
    } else {
        video.src = src;
    }

    const loaderTimeout = setTimeout(() => {
        if (currentState === stateIndex && video.paused) {
            loader.classList.remove('hidden');
        }
    }, 300);

    video.onplaying = () => {
        clearTimeout(loaderTimeout);
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
        }
    };

    video.onerror = () => {
        clearTimeout(loaderTimeout);
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
            if (states[stateIndex].feedback) {
                showFeedback(type, stateIndex);
            } else {
                nextBtn.click();
            }
        }
    };

    video.onended = () => {
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
            if (states[stateIndex].feedback) {
                showFeedback(type, stateIndex);
            } else {
                nextBtn.click();
            }
        }
    };

    video.play().catch(() => {
        if (currentState === stateIndex) {
            loader.classList.add('hidden');
            if (states[stateIndex].feedback) {
                showFeedback(type, stateIndex);
            } else {
                nextBtn.click();
            }
        }
    });
}

function showFeedback(type, stateIndex) {
    if (currentState !== stateIndex || !states[stateIndex].feedback) return;

    feedbackOverlay.classList.remove('hidden');
    
    const isCorrect = type === 'correct';
    feedbackOverlay.classList.add(isCorrect ? 'correct-feedback' : 'wrong-feedback');
    feedbackContent.textContent = isCorrect ? '✓' : '✗';
    feedbackText.textContent = isCorrect ? 'Верно!' : 'Неверно!';
}

nextBtn.addEventListener('click', (e) => {
    if (currentState < states.length - 1) {
        stopVideo();
        currentState++;
        updateState();
    } else {
        location.reload();
    }
});

backBtn.addEventListener('click', (e) => {
    if (currentState > 0) {
        stopVideo();
        
        if (states[currentState].videoSrc && states[currentState].feedback) {
            while(currentState > 0 && !states[currentState].name.includes('CHOICES')) {
                currentState--;
            }
        } else {
            currentState--;
        }
        
        updateState();
    }
});

function stopVideo() {
    video.onended = null;
    video.onerror = null;
    video.onplaying = null;
    try {
        video.pause();
    } catch (err) {}
}

preloadAllVideos();
updateState();
