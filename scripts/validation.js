document.addEventListener('DOMContentLoaded', () => {
    // אתחול תרגיל הקרקוע הקיים
    InitGroundingExercise();

    // אתחול קרוסלת הצוות
    InitTeamCarousel();

    // אתחול אקורדיון (מתוך unit1.html)
    InitAccordion();

    // אתחול אינטראקציית גרירה ב-unit2.html
    InitDragAndDrop();

    // אתחול אנימציית גלילה (Workflow) ב-unit1.html
    InitWorkflowScrollAnimation();
});

/**
 * ניהול תרגיל הקרקוע (הקוד הקיים שלך)
 */
function InitGroundingExercise() {
    const steps = [
        { id: 'step5', inputsSelector: '#step5 .exercise-input', btnId: 'nextSenseBtn5', nextStepId: 'step4' },
        { id: 'step4', inputsSelector: '#step4 .exercise-input', btnId: 'nextSenseBtn4', nextStepId: 'step3' },
        { id: 'step3', inputsSelector: '#step3 .exercise-input', btnId: 'nextSenseBtn3', nextStepId: 'step2' },
        { id: 'step2', inputsSelector: '#step2 .exercise-input', btnId: 'nextSenseBtn2', nextStepId: 'step1' },
        { id: 'step1', inputsSelector: '#step1 .exercise-input', btnId: 'nextSenseBtn1', nextStepId: null }
    ];

    steps.forEach(step => {
        const stepEl = document.getElementById(step.id);
        if (!stepEl) return;

        const inputs = stepEl.querySelectorAll(step.inputsSelector);
        const nextBtn = document.getElementById(step.btnId);

        if (!inputs.length || !nextBtn) return;

        function checkInputs() {
            const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
            nextBtn.disabled = !allFilled;
        }

        inputs.forEach(input => {
            // Wrap the input in a relative container
            const wrapper = document.createElement('div');
            wrapper.className = 'flex-grow-1';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            // Create error message element specific to this input
            const errorMsg = document.createElement('div');
            errorMsg.className = 'validation-error-msg small fw-bold text-start w-100 mt-1';
            errorMsg.style.color = '#FF6B6B';
            errorMsg.style.display = 'none'; // hidden by default, takes no space
            errorMsg.textContent = 'נא להזין טקסט בלבד (ללא מספרים או סימנים מיוחדים)';
            
            wrapper.appendChild(errorMsg);

            let errorTimeout;

            input.addEventListener('input', (e) => {
                const originalValue = e.target.value;
                const cleanedValue = originalValue.replace(/[^a-zA-Zא-ת\s\.,!?'"()\-]/g, '');
                
                if (originalValue !== cleanedValue) {
                    errorMsg.style.display = 'block';
                    
                    if (errorTimeout) clearTimeout(errorTimeout);
                    errorTimeout = setTimeout(() => {
                        errorMsg.style.display = 'none';
                    }, 2500);
                }
                
                e.target.value = cleanedValue;
                checkInputs();
            });
        });

        nextBtn.addEventListener('click', () => {
            if (step.nextStepId) {
                const nextEl = document.getElementById(step.nextStepId);
                if (nextEl) {
                    nextEl.classList.remove('d-none');
                    nextBtn.parentElement.classList.add('d-none');
                    nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                const mainEl = document.querySelector('main');
                if (mainEl) {
                    Array.from(mainEl.children).forEach(child => {
                        if (child.id !== 'step-summary') {
                            child.classList.add('d-none');
                        }
                    });
                }
                const summaryEl = document.getElementById('step-summary');
                if (summaryEl) {
                    summaryEl.classList.remove('d-none');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
}

/**
 * ניהול קרוסלת הצוות
 */
function InitTeamCarousel() {
    const carouselWrapper = document.getElementById('team3DCarousel');
    if (!carouselWrapper) return;

    const cards = Array.from(document.querySelectorAll('.team-3d-card'));
    const prevBtn = document.getElementById('teamPrevBtn');
    const nextBtn = document.getElementById('teamNextBtn');
    const total = cards.length;
    let currentIndex = 0;

    const dynamicNameEl = document.getElementById('dynamicTeamName');
    const dynamicRoleEl = document.getElementById('dynamicTeamRole');

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.className = 'team-3d-card'; // reset classes
            let offset = index - currentIndex;

            // Handle wrapping
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            if (offset === 0) {
                card.classList.add('active');
                // Update dynamic text for center card
                if (dynamicNameEl) dynamicNameEl.textContent = card.dataset.name;
                if (dynamicRoleEl) dynamicRoleEl.textContent = card.dataset.role;
            }
            else if (offset === -1) card.classList.add('prev-1');
            else if (offset === 1) card.classList.add('next-1');
            else if (offset === -2) card.classList.add('prev-2');
            else if (offset === 2) card.classList.add('next-2');
            else card.classList.add('hidden');
        });
    }

    function moveNext() {
        currentIndex = (currentIndex + 1) % total;
        updateCarousel();
    }

    function movePrev() {
        currentIndex = (currentIndex - 1 + total) % total;
        updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', moveNext);
    if (prevBtn) prevBtn.addEventListener('click', movePrev);

    // Click on a card to bring it to center
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (currentIndex !== index) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Touch support (Swipe)
    let startX = 0;
    carouselWrapper.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselWrapper.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].screenX;
        let diff = endX - startX;
        if (diff > 50) movePrev(); // Swipe right -> prev
        if (diff < -50) moveNext(); // Swipe left -> next
    }, { passive: true });

    // Expand Button Logic
    const expandBtn = document.getElementById('teamExpandBtn');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            const activeCard = document.querySelector('.team-3d-card.active');
            if (!activeCard) return;

            const name = activeCard.dataset.name;
            const role = activeCard.dataset.role;
            const imgEl = activeCard.querySelector('img');
            const bioEl = activeCard.querySelector('.card-bio');

            document.getElementById('modalTeamName').textContent = name || '';
            document.getElementById('modalTeamRole').textContent = role || '';
            if (imgEl) document.getElementById('modalTeamImg').src = imgEl.src;
            if (bioEl) document.getElementById('modalTeamBio').textContent = bioEl.textContent;

            // Use Bootstrap modal API to show the modal
            const modalElement = document.getElementById('teamMemberModal');
            if (window.bootstrap && modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        });
    }

    // Initial update
    updateCarousel();
}

/**
 * ניהול אקורדיון המטרות (unit1)
 */
function InitAccordion() {
    document.querySelectorAll('.goal-item').forEach(item => {
        item.addEventListener('click', function () {
            const svg = this.querySelector('.goal-plus svg');
            if(!svg) return; // ignore if no svg inside

            // We let bootstrap handle the aria-expanded toggle natively via collapse.
            setTimeout(() => {
                const expandedNow = this.getAttribute('aria-expanded') === 'true';
                if (expandedNow) {
                    svg.innerHTML = '<line x1="5" y1="12" x2="19" y2="12"></line>'; // minus
                } else {
                    svg.innerHTML = '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'; // plus
                }
            }, 10);
        });
    });
}

/**
 * ניהול אינטראקציית תרחישים ב-unit2 (בחירה יחידה) עם Modal
 */
function InitDragAndDrop() {
    const scenariosContainer = document.getElementById('scenarios-container');
    const wordBankWrapper = document.getElementById('word-bank-wrapper');
    const feedbackModalEl = document.getElementById('feedbackModal');
    
    if (!wordBankWrapper || !scenariosContainer || !feedbackModalEl) return;

    const cards = Array.from(document.querySelectorAll('.scenario-card'));
    const options = document.querySelectorAll('.principle-bucket');
    let feedbackModal = null;
    
    // Check if bootstrap is defined
    if (typeof bootstrap !== 'undefined') {
        feedbackModal = new bootstrap.Modal(feedbackModalEl);
    }

    const modalTitle = document.getElementById('feedbackModalTitle');
    const modalIcon = document.getElementById('feedbackModalIcon');
    const modalText = document.getElementById('feedbackModalText');

    let activeCardToAdvance = null;

    // Helper: Find current active card
    function getActiveCard() {
        return cards.find(card => !card.classList.contains('d-none'));
    }

    // Handle Option Click
    options.forEach(option => {
        option.addEventListener('click', () => {
            const activeCard = getActiveCard();
            if (!activeCard || !feedbackModal) return;

            const correctPrinciple = activeCard.dataset.correct;
            const targetPrinciple = option.dataset.principle;
            
            activeCardToAdvance = activeCard;

            if (correctPrinciple === targetPrinciple) {
                // Correct
                modalTitle.textContent = "נכון מאוד!";
                modalTitle.style.color = "#28a745";
                modalIcon.innerHTML = "✅";
                modalText.textContent = activeCard.dataset.feedbackCorrect || "כל הכבוד, ענית נכון!";
                
                option.classList.add('success-drop');
                setTimeout(() => option.classList.remove('success-drop'), 500);
            } else {
                // Incorrect
                modalTitle.textContent = "טעות בבחירה";
                modalTitle.style.color = "#dc3545";
                modalIcon.innerHTML = "❌";
                modalText.textContent = activeCard.dataset.feedbackIncorrect || "הבחירה שגויה. ננסה שוב בתרחיש הבא.";
                
                option.classList.add('error-drop', 'error-shake');
                setTimeout(() => option.classList.remove('error-drop', 'error-shake'), 500);
            }

            feedbackModal.show();
        });
        
        option.style.cursor = 'pointer';
    });

    // Advance to next scenario when modal is closed
    feedbackModalEl.addEventListener('hidden.bs.modal', () => {
        if (!activeCardToAdvance) return;
        
        const card = activeCardToAdvance;
        card.classList.add('d-none');
        card.dataset.completed = "true";

        const nextCard = cards.find(c => c.dataset.completed !== "true" && c !== card);
        if (nextCard) {
            nextCard.classList.remove('d-none');
            nextCard.style.opacity = '0';
            nextCard.style.transform = 'translateY(10px)';
            setTimeout(() => {
                nextCard.style.transition = 'all 0.3s ease';
                nextCard.style.opacity = '1';
                nextCard.style.transform = 'translateY(0)';
            }, 50);
        } else {
            // Finished!
            scenariosContainer.innerHTML = `<div class="text-center p-5 bg-white rounded-4 shadow border border-2 w-100" style="border-color: #28a745 !important;">
                <div class="fs-1 mb-3">🎉</div>
                <h3 class="fw-bold text-success">כל הכבוד!</h3>
                <p class="fs-5 mt-3 mb-0" style="color: #0D0431;">השלמתם את התרגיל וקראתם את כל ההסברים לעקרונות המנחים שלנו.</p>
            </div>`;
            wordBankWrapper.classList.add('d-none');
        }
        
        activeCardToAdvance = null;
    });
}

/**
 * Workflow Scroll Text Reveal Animation
 */
function InitWorkflowScrollAnimation() {
    const steps = document.querySelectorAll('.workflow-step');
    const progressLine = document.getElementById('workflow-progress');
    const container = document.querySelector('.workflow-scroll-container');
    
    if (!steps.length) return;

    // Intersection Observer to detect when a step is in the middle of the viewport
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Trigger when item is near the middle
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));

    // Scroll event for the progress line
    if (progressLine && container) {
        window.addEventListener('scroll', () => {
            const containerRect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the container has been scrolled past
            // Start progressing when the top of the container is near the middle of the screen
            const startScroll = viewportHeight * 0.5; 
            
            let progress = 0;
            
            // Distance from start trigger to bottom of container
            // Subtracting viewportHeight * 0.5 ensures it reaches 100% before the user hits the bottom of the page
            const totalScrollDistance = containerRect.height - viewportHeight * 0.5;
            const currentScroll = startScroll - containerRect.top;
            
            if (currentScroll > 0) {
                progress = (currentScroll / totalScrollDistance) * 100;
            }
            
            // Clamp between 0 and 100
            progress = Math.max(0, Math.min(100, progress));
            
            progressLine.style.height = `${progress}%`;
        }, { passive: true });
        
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }
}
