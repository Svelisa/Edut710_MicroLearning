document.addEventListener('DOMContentLoaded', () => {
    // Array of steps in order for the grounding exercise
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
            // Return true only if ALL inputs in this step have a value
            const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
            nextBtn.disabled = !allFilled;
        }

        // Listen for typing events on each input field
        inputs.forEach(input => {
            input.addEventListener('input', checkInputs);
        });

        // Handle navigation to the next step
        nextBtn.addEventListener('click', () => {
            if (step.nextStepId) {
                // Remove the d-none class to open the next section below
                const nextEl = document.getElementById(step.nextStepId);
                if (nextEl) {
                    nextEl.classList.remove('d-none');
                    // Hide the next button of the completed step so they seamlessly proceed
                    nextBtn.parentElement.classList.add('d-none');
                    
                    // Smoothly scroll down to the newly opened section
                    nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // If it's the last step, transition to the summary view
                // Hide all children in <main> except the summary screen
                const mainEl = document.querySelector('main');
                if (mainEl) {
                    Array.from(mainEl.children).forEach(child => {
                        if (child.id !== 'step-summary') {
                            child.classList.add('d-none');
                        }
                    });
                }

                // Show the beautifully centered summary message
                const summaryEl = document.getElementById('step-summary');
                if (summaryEl) {
                    summaryEl.classList.remove('d-none');
                    // Scroll to top to ensure it is perfectly centered on screen
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
});
