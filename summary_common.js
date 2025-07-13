// 漢堡選單控制
const hamburgerToggle = document.getElementById('hamburger-toggle');
const navPanel = document.getElementById('nav-panel');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    hamburgerToggle.classList.toggle('active');
    navPanel.classList.toggle('active');
    overlay.classList.toggle('active');
}

hamburgerToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// 點擊導航連結後關閉選單
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // 關閉選單
            toggleMenu();
            // 延遲滾動以確保選單關閉動畫完成
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    });
});

// 字體大小控制
let currentFontSize = 'md';

function changeFontSize(size) {
    const body = document.body;
    const fontSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    
    // 移除所有字體大小類別
    fontSizes.forEach(s => body.classList.remove('font-' + s));
    
    // 添加新的字體大小類別
    body.classList.add('font-' + size);
    currentFontSize = size;
    
    // 更新按鈕狀態
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ESC 鍵關閉選單
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navPanel.classList.contains('active')) {
        toggleMenu();
    }
});

// 心智圖初始化
function initMindmap() {
    try {
        console.log('開始初始化心智圖...');
        
        // 檢查必要的庫是否載入
        if (!window.d3) {
            console.log('D3 未載入');
            return;
        }
        
        if (!window.markmap || !window.markmap.Transformer || !window.markmap.Markmap) {
            console.log('Markmap 未載入');
            return;
        }
        
        const markdownContent = document.getElementById('mindmap-content').textContent;
        const svgElement = document.getElementById('mindmap-svg');
        
        console.log('Markdown 內容:', markdownContent.substring(0, 100) + '...');
        
        if (markdownContent.trim()) {
            // 使用 markmap-lib 轉換 markdown
            const transformer = new markmap.Transformer();
            const { root, features } = transformer.transform(markdownContent);
            
            console.log('轉換完成，root:', root);
            
            // 隱藏 Markdown 文字，顯示 SVG
            document.getElementById('mindmap-content').style.display = 'none';
            svgElement.style.display = 'block';
            
            // 創建 Markmap
            const mm = markmap.Markmap.create(svgElement, {
                duration: 500,
                maxWidth: 300,
                spacingVertical: 15,
                spacingHorizontal: 100,
                fitRatio: 0.9,
                color: (d) => {
                    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
                    return colors[d.depth % colors.length];
                },
                paddingX: 20,
                paddingY: 20
            }, root);
            
            // 自動適應大小
            setTimeout(() => {
                mm.fit();
            }, 100);
            
            console.log('心智圖創建成功');
        } else {
            console.log('沒有 Markdown 內容');
        }
    } catch (error) {
        console.error('Markmap 初始化失敗:', error);
        console.log('保持 Markdown 格式顯示');
        // 如果失敗，確保 Markdown 內容可見
        document.getElementById('mindmap-content').style.display = 'block';
        document.getElementById('mindmap-svg').style.display = 'none';
    }
}

// 等待頁面載入完成後初始化心智圖
window.addEventListener('load', function() {
    // 延遲初始化以確保所有腳本都載入完成
    setTimeout(() => {
        initMindmap();
    }, 1000);
    
    // 備用方案：如果5秒後還沒成功，再嘗試一次
    setTimeout(() => {
        if (document.getElementById('mindmap-svg').style.display !== 'block') {
            console.log('重試初始化心智圖...');
            initMindmap();
        }
    }, 5000);
});

// 響應式調整
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768 && navPanel.classList.contains('active')) {
        // 在小螢幕上自動關閉選單
        toggleMenu();
    }
});

// 複製條列重點功能
function copyHighlights() {
    try {
        const highlightContent = document.getElementById('highlight-content');
        const copyBtn = document.querySelector('.copy-btn');
        const copyText = copyBtn.querySelector('.copy-text');
        const copyIcon = copyBtn.querySelector('.copy-icon');
        
        // 提取純文字內容
        let textContent = '';
        const listItems = highlightContent.querySelectorAll('li');
        
        listItems.forEach((item, index) => {
            // 取得項目文字內容，保留換行結構
            const itemText = item.innerText.trim();
            textContent += `${index + 1}. ${itemText}\n\n`;
        });
        
        // 複製到剪貼簿
        navigator.clipboard.writeText(textContent).then(() => {
            // 成功複製的視覺回饋
            copyBtn.classList.add('copied');
            copyText.textContent = '已複製';
            copyIcon.textContent = '✅';
            
            // 2秒後恢復原狀
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyText.textContent = '複製';
                copyIcon.textContent = '📋';
            }, 2000);
        }).catch(err => {
            // 複製失敗的處理
            console.error('複製失敗:', err);
            
            // 備用方案：使用傳統的複製方法
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // 顯示成功訊息
            copyText.textContent = '已複製';
            copyIcon.textContent = '✅';
            
            setTimeout(() => {
                copyText.textContent = '複製';
                copyIcon.textContent = '📋';
            }, 2000);
        });
        
    } catch (error) {
        console.error('複製功能錯誤:', error);
        alert('複製功能暫時無法使用，請手動選取文字複製');
    }
}