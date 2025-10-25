// ========================================
// 設定画面のロジック
// ========================================

const DEFAULT_DOC_ID = '1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ';
const DEFAULT_SLIDES_ID = '133qTK5HyZGjPqbA2NtQm8_cic8K1r4ydQ-nRTZ9jm-I';

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // 保存ボタン
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    
    // リセットボタン
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
    
    // ドキュメントを開くボタン
    document.getElementById('openDocBtn').addEventListener('click', () => {
        const docId = document.getElementById('docId').value.trim();
        if (docId) {
            window.open(`https://docs.google.com/document/d/${docId}/edit`, '_blank');
        } else {
            showStatus('ドキュメントIDを入力してください', 'error');
        }
    });
    
    // スライドを開くボタン
    document.getElementById('openSlidesBtn').addEventListener('click', () => {
        const slidesId = document.getElementById('slidesId').value.trim();
        if (slidesId) {
            window.open(`https://docs.google.com/presentation/d/${slidesId}/edit`, '_blank');
        } else {
            showStatus('スライドIDを入力してください', 'error');
        }
    });
    
    // 入力時にボタンの表示/非表示を切り替え
    document.getElementById('docId').addEventListener('input', (e) => {
        document.getElementById('openDocBtn').style.display = e.target.value.trim() ? 'block' : 'none';
    });
    document.getElementById('slidesId').addEventListener('input', (e) => {
        document.getElementById('openSlidesBtn').style.display = e.target.value.trim() ? 'block' : 'none';
    });
    
    // 初期表示の制御
    updateButtonVisibility();
});

// 設定を読み込む
function loadSettings() {
    const docId = localStorage.getItem('docId') || DEFAULT_DOC_ID;
    const slidesId = localStorage.getItem('slidesId') || DEFAULT_SLIDES_ID;
    
    document.getElementById('docId').value = docId;
    document.getElementById('slidesId').value = slidesId;
    
    // ボタンの表示制御
    updateButtonVisibility();
}

// ボタンの表示制御
function updateButtonVisibility() {
    const docId = document.getElementById('docId').value.trim();
    const slidesId = document.getElementById('slidesId').value.trim();
    
    document.getElementById('openDocBtn').style.display = docId ? 'block' : 'none';
    document.getElementById('openSlidesBtn').style.display = slidesId ? 'block' : 'none';
}

// 設定を保存する
function saveSettings() {
    const docId = document.getElementById('docId').value.trim();
    const slidesId = document.getElementById('slidesId').value.trim();
    
    if (!docId) {
        showStatus('GoogleドキュメントIDを入力してください', 'error');
        return;
    }
    
    if (!slidesId) {
        showStatus('GoogleスライドIDを入力してください', 'error');
        return;
    }
    
    // localStorageに保存
    localStorage.setItem('docId', docId);
    localStorage.setItem('slidesId', slidesId);
    
    showStatus('設定を保存しました', 'success');
}

// 設定をリセットする
function resetSettings() {
    if (!confirm('設定をデフォルト値にリセットしますか？')) {
        return;
    }
    
    document.getElementById('docId').value = DEFAULT_DOC_ID;
    document.getElementById('slidesId').value = DEFAULT_SLIDES_ID;
    
    localStorage.setItem('docId', DEFAULT_DOC_ID);
    localStorage.setItem('slidesId', DEFAULT_SLIDES_ID);
    
    showStatus('設定をリセットしました', 'success');
}

// ステータス表示
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status status-${type}`;
    status.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}
