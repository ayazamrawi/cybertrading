export const useFaqAccordion = () => {
    const setupAccordion = () => {
        // استخدام attribute selector للبحث عن classes تحتوي على questionTitle
        const myQuestions = document.querySelectorAll('[class*="questionTitle"]');
        
        if (myQuestions.length === 0) {
            console.log("No FAQ questions found");
            return;
        }
        
        myQuestions.forEach((question) => {
            question.removeEventListener("click", toggleAnswer);
            question.addEventListener("click", toggleAnswer);
        });
    };
    
    const toggleAnswer = function() {
        const question = this;
        const answer = question.nextElementSibling; 
        const button = question.querySelector('[class*="faqButton"]');
        
        if (!answer) return;
        
        // Toggle Logic
        if (answer.style.maxHeight === "500px") {
            // Collapse
            answer.style.maxHeight = "0";
            answer.style.opacity = "0";
            if (button) { 
                button.innerHTML = '+'; 
            }
        } else {
            // Expand
            answer.style.maxHeight = "500px";
            answer.style.opacity = "1";
            if (button) { 
                button.innerHTML = '-';
            }
        }
    };
    
    return setupAccordion;
};