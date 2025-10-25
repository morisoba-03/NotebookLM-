// ========================================
// 設定（ここを編集してください）
// ========================================

// GASのWebアプリURL（デプロイ後に設定）
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyLAQUkFr4GXAzh4ofBwwjRX4ecBQfg1S5bRKxWckBg0A2-vZaHvaqNKKGCbOOa4qIO/exec";

// Code.gsと同じAPI_KEYを設定してください（強力なランダム文字列）
const API_KEY = "Nb7kQ2xP9mR4sL8vW3nF6jH5tY1cA0zE";

// ========================================
// グローバル変数
// ========================================
let isProcessing = false;

// 設定を取得（localStorageから読み込み、なければデフォルト値）
function getDocId() {
    return localStorage.getItem('docId') || '1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ';
}

function getSlidesId() {
    return localStorage.getItem('slidesId') || '133qTK5HyZGjPqbA2NtQm8_cic8K1r4ydQ-nRTZ9jm-I';
}

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const addTextBtn = document.getElementById('addTextBtn');
    const imageInput = document.getElementById('imageInput');
    const addImageBtn = document.getElementById('addImageBtn');
    const fileNames = document.getElementById('fileNames');
    const imageNote = document.getElementById('imageNote');

    // テキスト追加ボタン
    addTextBtn.addEventListener('click', handleAddText);

    // 画像追加ボタン
    addImageBtn.addEventListener('click', handleAddImage);

    // カメラボタン
    const cameraBtn = document.getElementById('cameraBtn');
    cameraBtn.addEventListener('click', () => {
        // カメラ専用の入力を作成
        const cameraInput = document.createElement('input');
        cameraInput.type = 'file';
        cameraInput.accept = 'image/*';
        cameraInput.capture = 'environment'; // バックカメラを使用
        cameraInput.multiple = true;
        cameraInput.onchange = (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                imageInput.files = files;
                const names = Array.from(files).map(f => f.name).join(', ');
                fileNames.textContent = `選択: ${files.length}枚 (${names})`;
            }
        };
        cameraInput.click();
    });

    // ファイル選択時の表示更新
    imageInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const names = Array.from(files).map(f => f.name).join(', ');
            fileNames.textContent = `選択: ${files.length}枚 (${names})`;
        } else {
            fileNames.textContent = '';
        }
    });

    // Enterキーでテキスト送信（Ctrl+Enterのみ）
    textInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleAddText();
        }
    });
});

// ========================================
// テキストメモ追加処理
// ========================================
async function handleAddText() {
    if (isProcessing) return;

    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();

    if (!text) {
        showStatus('テキストを入力してください', 'error');
        return;
    }

    if (!validateConfig()) return;

    isProcessing = true;
    toggleButton('addTextBtn', true);
    showStatus('送信中...', 'info');

    try {
        // 位置情報を取得（可能な場合のみ）
        const location = await getLocation();
        
        const payload = {
            mode: 'text',
            apiKey: API_KEY,
            text: text,
            docId: getDocId(),
            location: location
        };

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.ok) {
            textInput.value = '';
            showStatus(`✅ メモを追加しました（${result.appendedChars}文字）`, 'success');
        } else {
            showStatus(`❌ エラー: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ 送信エラー: ${error.message}`, 'error');
    } finally {
        isProcessing = false;
        toggleButton('addTextBtn', false);
    }
}

// ========================================
// 画像追加処理
// ========================================
async function handleAddImage() {
    if (isProcessing) return;

    const imageInput = document.getElementById('imageInput');
    const imageNote = document.getElementById('imageNote');
    const files = imageInput.files;

    if (files.length === 0) {
        showStatus('画像を選択してください', 'error');
        return;
    }

    if (!validateConfig()) return;

    isProcessing = true;
    toggleButton('addImageBtn', true);
    showStatus('画像を処理中...', 'info');

    try {
        // ファイルをBase64に変換
        const filePromises = Array.from(files).map(file => convertFileToBase64(file));
        const filesData = await Promise.all(filePromises);

        // 合計サイズチェック（30MB）
        const totalSize = filesData.reduce((sum, f) => sum + f.size, 0);
        if (totalSize > 30 * 1024 * 1024) {
            showStatus('❌ 画像の合計サイズが30MBを超えています', 'error');
            return;
        }

        // 位置情報を取得（可能な場合のみ）
        const location = await getLocation();
        
        const payload = {
            mode: 'image',
            apiKey: API_KEY,
            slidesId: getSlidesId(),
            files: filesData.map(f => ({
                name: f.name,
                mimeType: f.mimeType,
                base64: f.base64
            })),
            note: imageNote.value.trim() || undefined,
            location: location
        };

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.ok) {
            imageInput.value = '';
            imageNote.value = '';
            document.getElementById('fileNames').textContent = '';
            showStatus(
                `✅ ${result.pagesAppended}枚の画像をスライドに追加しました\n💡 NotebookLMへの反映には数分かかる場合があります`,
                'success'
            );
        } else {
            showStatus(`❌ エラー: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ 送信エラー: ${error.message}`, 'error');
    } finally {
        isProcessing = false;
        toggleButton('addImageBtn', false);
    }
}

// ========================================
// ユーティリティ関数
// ========================================

// ファイルをBase64に変換
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        // MIMEタイプチェック（JPEG/PNG/PDF）
        if (!file.type.match(/^image\/(jpeg|png)$/) && file.type !== 'application/pdf') {
            reject(new Error(`${file.name} は対応していない形式です（JPEG/PNG/PDFのみ）`));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1]; // data:image/xxx;base64, を除去
            resolve({
                name: file.name,
                mimeType: file.type,
                base64: base64,
                size: file.size
            });
        };
        reader.onerror = () => reject(new Error(`${file.name} の読み込みに失敗しました`));
        reader.readAsDataURL(file);
    });
}

// 設定の検証
function validateConfig() {
    if (ENDPOINT === "https://script.google.com/macros/s/XXXX/exec") {
        showStatus('❌ ENDPOINTを設定してください（app.js内）', 'error');
        return false;
    }
    if (API_KEY === "your-strong-random-api-key") {
        showStatus('❌ API_KEYを設定してください（app.js内）', 'error');
        return false;
    }
    return true;
}

// ステータス表示
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status status-${type}`;
    status.style.display = 'block';

    // 成功時は5秒後に自動的に消す
    if (type === 'success') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

// ボタンの有効/無効切り替え
function toggleButton(btnId, disabled) {
    const btn = document.getElementById(btnId);
    btn.disabled = disabled;
    if (disabled) {
        btn.classList.add('disabled');
    } else {
        btn.classList.remove('disabled');
    }
}

// 位置情報を取得（スマホ対応）
async function getLocation() {
    if (!navigator.geolocation) {
        return null; // 位置情報APIが利用できない
    }
    
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                console.log('位置情報取得エラー:', error.message);
                resolve(null); // エラーでもnullを返して続行
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}
