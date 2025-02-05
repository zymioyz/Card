let currentPage = 0;
const pages = document.querySelectorAll(".page");
let previousPage = null; // 记录上一次的页面

// 📌 监听全局点击事件，让所有设备都用点击切换页面

document.addEventListener("click", function() {
    nextPage();
});


// 📌 页面切换逻辑
function nextPage() {
    console.log(`当前页面: ${currentPage}, 之前的页面: ${previousPage}`); // 调试

    if (currentPage === 0) { 
        // 信封 → 动画页
        previousPage = currentPage; // 记录进入下一页之前的页面
        pages[currentPage].classList.add("hidden");
        currentPage = 1;
        pages[currentPage].classList.remove("hidden");
    } else if (currentPage === 1 && previousPage !== 2) {  
        // 动画 → 祝福语页（但不是从祝福语回来的情况）
        previousPage = currentPage; // 记录当前页
        pages[currentPage].classList.add("hidden");
        currentPage = 2;
        pages[currentPage].classList.remove("hidden");
    } else if (currentPage === 2) { 
        // 祝福语 → 动画页
        previousPage = currentPage; // 记录当前页
        pages[currentPage].classList.add("hidden");
        currentPage = 1;
        pages[currentPage].classList.remove("hidden");
    } else if (currentPage === 1 && previousPage === 2) {  
        // 额外判断：如果上一次是祝福语 → 动画，现在再点动画页，就回到信封页
        console.log("🔄 祝福语 → 动画，再点动画 → 信封！");
        previousPage = currentPage; // 记录当前页
        pages[currentPage].classList.add("hidden");
        currentPage = 0;
        pages[currentPage].classList.remove("hidden");
    }
}