export const useDragSlider = () => {
    const setupSlider = () => {
        // استخدام data-attribute أو class عادية (مش من الـ module)
        const slider = document.querySelector('[class*="dragSlider"]');
        const leftBtn = document.querySelector(".left-btn");
        const rightBtn = document.querySelector(".right-btn");
        
        if (!slider || !leftBtn || !rightBtn) {
            console.log("Slider elements not found");
            return;
        }
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        const mouseDownHandler = (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = "grabbing";
        };
        
        const mouseLeaveUpHandler = () => {
            isDown = false;
            slider.style.cursor = "grab";
        };
        
        const mouseMoveHandler = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        };
        
        const touchStartHandler = (e) => {
            isDown = true;
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        
        const touchEndHandler = () => {
            isDown = false;
        };
        
        const touchMoveHandler = (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        };
        
        const leftClickHandler = () => {
            slider.scrollBy({ left: -350, behavior: "smooth" });
        };
        
        const rightClickHandler = () => {
            slider.scrollBy({ left: 350, behavior: "smooth" });
        };
        
        // Add Listeners
        slider.addEventListener('mousedown', mouseDownHandler);
        slider.addEventListener('mouseleave', mouseLeaveUpHandler);
        slider.addEventListener('mouseup', mouseLeaveUpHandler);
        slider.addEventListener('mousemove', mouseMoveHandler);
        slider.addEventListener("touchstart", touchStartHandler);
        slider.addEventListener("touchend", touchEndHandler);
        slider.addEventListener("touchmove", touchMoveHandler);
        leftBtn.addEventListener("click", leftClickHandler);
        rightBtn.addEventListener("click", rightClickHandler);
        
        // Cleanup Function
        return () => {
            slider.removeEventListener('mousedown', mouseDownHandler);
            slider.removeEventListener('mouseleave', mouseLeaveUpHandler);
            slider.removeEventListener('mouseup', mouseLeaveUpHandler);
            slider.removeEventListener('mousemove', mouseMoveHandler);
            slider.removeEventListener("touchstart", touchStartHandler);
            slider.removeEventListener("touchend", touchEndHandler);
            slider.removeEventListener("touchmove", touchMoveHandler);
            leftBtn.removeEventListener("click", leftClickHandler);
            rightBtn.removeEventListener("click", rightClickHandler);
        };
    };
    
    return setupSlider;
};