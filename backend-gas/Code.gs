// ========================================
// 設定（ここを編集してください）
// ========================================

// フロント（app.js）と同じAPI_KEYを設定してください
const API_KEY = 'your-strong-random-api-key-here';

// 追記先のGoogleドキュメントID
const DOC_ID = 'YOUR_GOOGLE_DOC_ID';

// 画像を追加するGoogleスライドID（NotebookLMのソース）
const SLIDES_ID = 'YOUR_GOOGLE_SLIDES_ID';

// ========================================
// メインエントリーポイント
// ========================================

/**
 * POSTリクエスト処理
 */
function doPost(e) {
  try {
    // リクエストボディの取得とパース
    let payload;
    const contentType = e.parameter.contentType || e.postData?.type || 'application/json';
    
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseError) {
        return jsonResponse({ ok: false, error: 'JSONパースエラー: ' + parseError.message });
      }
    } else if (e.parameter) {
      payload = e.parameter;
    } else {
      return jsonResponse({ ok: false, error: 'リクエストボディが空です' });
    }

    // API_KEY検証
    if (!payload.apiKey || payload.apiKey !== API_KEY) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    // モード別処理
    if (payload.mode === 'text') {
      return handleTextMode(payload);
    } else if (payload.mode === 'image') {
      return handleImageMode(payload);
    } else {
      return jsonResponse({ ok: false, error: '不明なモード: ' + payload.mode });
    }

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return jsonResponse({ ok: false, error: error.toString() });
  }
}

// ========================================
// テキストモード処理
// ========================================

/**
 * テキストメモをGoogleドキュメントに追記
 */
function handleTextMode(payload) {
  try {
    const text = payload.text;
    if (!text || text.trim() === '') {
      return jsonResponse({ ok: false, error: 'テキストが空です' });
    }

    // JSTタイムスタンプ生成
    const timestamp = Utilities.formatDate(
      new Date(),
      'Asia/Tokyo',
      "yyyy-MM-dd HH:mm:ss 'JST'"
    );

    // 位置情報があれば追加
    let locationText = '';
    if (payload.location) {
      const loc = payload.location;
      locationText = ' [位置: ' + loc.latitude.toFixed(6) + ',' + loc.longitude.toFixed(6) + ']';
    }

    // フォーマット: [YYYY-MM-DD HH:mm:ss JST] テキスト [位置: xx.xxx,yy.yyy]
    const line = '[' + timestamp + ']' + locationText + ' ' + text.trim();

    // Googleドキュメントに追記（設定されたdocIdを使用、なければデフォルト）
    const docId = payload.docId || DOC_ID;
    const doc = DocumentApp.openById(docId);
    doc.getBody().appendParagraph(line);
    doc.saveAndClose();

    return jsonResponse({
      ok: true,
      appendedChars: line.length,
      timestamp: timestamp
    });

  } catch (error) {
    Logger.log('Error in handleTextMode: ' + error.toString());
    return jsonResponse({ ok: false, error: 'テキスト追記エラー: ' + error.toString() });
  }
}

// ========================================
// 画像モード処理
// ========================================

/**
 * 画像をGoogleスライドに追加
 */
function handleImageMode(payload) {
  try {
    const files = payload.files;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return jsonResponse({ ok: false, error: '画像ファイルがありません' });
    }

    // 合計サイズチェック（30MB）
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const base64Length = files[i].base64.length;
      totalSize += base64Length * 0.75; // Base64は約4/3倍のサイズ
    }
    if (totalSize > 30 * 1024 * 1024) {
      return jsonResponse({ ok: false, error: '画像の合計サイズが30MBを超えています' });
    }

    // Googleスライドを開く（設定されたslidesIdを使用、なければデフォルト）
    const slidesId = payload.slidesId || SLIDES_ID;
    const presentation = SlidesApp.openById(slidesId);
    const pageSize = presentation.getPageWidth();
    const pageHeight = presentation.getPageHeight();

    // 注記テキスト用のタイムスタンプ
    const timestamp = Utilities.formatDate(
      new Date(),
      'Asia/Tokyo',
      "yyyy-MM-dd HH:mm 'JST'"
    );
    const note = payload.note ? payload.note.trim() : '';
    
    // 位置情報があれば追加
    let locationText = '';
    if (payload.location) {
      const loc = payload.location;
      locationText = ' GPS:' + loc.latitude.toFixed(4) + ',' + loc.longitude.toFixed(4);
    }
    
    const noteText = '[' + timestamp + ']' + locationText + (note ? ' ' + note : '');

    let pagesAppended = 0;

    // 各画像をスライドに追加
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // MIMEタイプチェック（JPEG/PNG/PDF）
      if (file.mimeType !== 'image/jpeg' && file.mimeType !== 'image/png' && file.mimeType !== 'application/pdf') {
        Logger.log('スキップ: 非対応の形式 ' + file.name);
        continue;
      }

      try {
        // Base64からBlobに変換
        const imageBlob = Utilities.newBlob(
          Utilities.base64Decode(file.base64),
          file.mimeType,
          file.name
        );

        // 新しいスライドを追加
        const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

        // 画像を挿入
        const image = slide.insertImage(imageBlob);

        // 画像の元のサイズを取得
        const imageWidth = image.getWidth();
        const imageHeight = image.getHeight();

        // 画像を全画面にフィット（アスペクト比を保持）
        const scaleWidth = pageSize / imageWidth;
        const scaleHeight = pageHeight / imageHeight;
        const scale = Math.min(scaleWidth, scaleHeight);

        const newWidth = imageWidth * scale;
        const newHeight = imageHeight * scale;

        image.setWidth(newWidth);
        image.setHeight(newHeight);

        // 中央に配置
        image.setLeft((pageSize - newWidth) / 2);
        image.setTop((pageHeight - newHeight) / 2);

        // 右下に注記テキストボックスを追加
        const textBoxWidth = 200;
        const textBoxHeight = 30;
        const textBox = slide.insertTextBox(
          noteText,
          pageSize - textBoxWidth - 10,
          pageHeight - textBoxHeight - 10,
          textBoxWidth,
          textBoxHeight
        );
        const textRange = textBox.getText();
        textRange.getTextStyle().setFontSize(10).setForegroundColor('#666666');

        pagesAppended++;

      } catch (imageError) {
        Logger.log('画像追加エラー (' + file.name + '): ' + imageError.toString());
        // エラーでも続行
      }
    }

    if (pagesAppended === 0) {
      return jsonResponse({ ok: false, error: '画像を1枚も追加できませんでした' });
    }

    return jsonResponse({
      ok: true,
      pagesAppended: pagesAppended,
      timestamp: timestamp
    });

  } catch (error) {
    Logger.log('Error in handleImageMode: ' + error.toString());
    return jsonResponse({ ok: false, error: '画像追加エラー: ' + error.toString() });
  }
}

// ========================================
// ユーティリティ関数
// ========================================

/**
 * JSON形式のレスポンスを返す
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// テスト用関数
// ========================================

/**
 * テキスト追加のテスト
 */
function testAddText() {
  const payload = {
    mode: 'text',
    apiKey: API_KEY,
    text: 'これはテストメモです'
  };
  const result = handleTextMode(payload);
  Logger.log(result.getContent());
}

/**
 * 設定の確認
 */
function checkConfig() {
  Logger.log('API_KEY: ' + (API_KEY !== 'your-strong-random-api-key' ? '設定済み' : '未設定'));
  Logger.log('DOC_ID: ' + DOC_ID);
  Logger.log('SLIDES_ID: ' + SLIDES_ID);
  
  try {
    DocumentApp.openById(DOC_ID);
    Logger.log('? Googleドキュメントにアクセス可能');
  } catch (e) {
    Logger.log('? Googleドキュメントにアクセスできません: ' + e.toString());
  }
  
  try {
    SlidesApp.openById(SLIDES_ID);
    Logger.log('? Googleスライドにアクセス可能');
  } catch (e) {
    Logger.log('? Googleスライドにアクセスできません: ' + e.toString());
  }
}
