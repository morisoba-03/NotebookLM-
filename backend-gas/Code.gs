// ========================================
// �ݒ�i������ҏW���Ă��������j
// ========================================

// �t�����g�iapp.js�j�Ɠ���API_KEY��ݒ肵�Ă�������
const API_KEY = 'your-strong-random-api-key-here';

// �ǋL���Google�h�L�������gID
const DOC_ID = 'YOUR_GOOGLE_DOC_ID';

// �摜��ǉ�����Google�X���C�hID�iNotebookLM�̃\�[�X�j
const SLIDES_ID = 'YOUR_GOOGLE_SLIDES_ID';

// ========================================
// ���C���G���g���[�|�C���g
// ========================================

/**
 * POST���N�G�X�g����
 */
function doPost(e) {
  try {
    // ���N�G�X�g�{�f�B�̎擾�ƃp�[�X
    let payload;
    const contentType = e.parameter.contentType || e.postData?.type || 'application/json';
    
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseError) {
        return jsonResponse({ ok: false, error: 'JSON�p�[�X�G���[: ' + parseError.message });
      }
    } else if (e.parameter) {
      payload = e.parameter;
    } else {
      return jsonResponse({ ok: false, error: '���N�G�X�g�{�f�B����ł�' });
    }

    // API_KEY����
    if (!payload.apiKey || payload.apiKey !== API_KEY) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    // ���[�h�ʏ���
    if (payload.mode === 'text') {
      return handleTextMode(payload);
    } else if (payload.mode === 'image') {
      return handleImageMode(payload);
    } else {
      return jsonResponse({ ok: false, error: '�s���ȃ��[�h: ' + payload.mode });
    }

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return jsonResponse({ ok: false, error: error.toString() });
  }
}

// ========================================
// �e�L�X�g���[�h����
// ========================================

/**
 * �e�L�X�g������Google�h�L�������g�ɒǋL
 */
function handleTextMode(payload) {
  try {
    const text = payload.text;
    if (!text || text.trim() === '') {
      return jsonResponse({ ok: false, error: '�e�L�X�g����ł�' });
    }

    // JST�^�C���X�^���v����
    const timestamp = Utilities.formatDate(
      new Date(),
      'Asia/Tokyo',
      "yyyy-MM-dd HH:mm:ss 'JST'"
    );

    // �ʒu��񂪂���Βǉ�
    let locationText = '';
    if (payload.location) {
      const loc = payload.location;
      locationText = ' [�ʒu: ' + loc.latitude.toFixed(6) + ',' + loc.longitude.toFixed(6) + ']';
    }

    // �t�H�[�}�b�g: [YYYY-MM-DD HH:mm:ss JST] �e�L�X�g [�ʒu: xx.xxx,yy.yyy]
    const line = '[' + timestamp + ']' + locationText + ' ' + text.trim();

    // Google�h�L�������g�ɒǋL�i�ݒ肳�ꂽdocId���g�p�A�Ȃ���΃f�t�H���g�j
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
    return jsonResponse({ ok: false, error: '�e�L�X�g�ǋL�G���[: ' + error.toString() });
  }
}

// ========================================
// �摜���[�h����
// ========================================

/**
 * �摜��Google�X���C�h�ɒǉ�
 */
function handleImageMode(payload) {
  try {
    const files = payload.files;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return jsonResponse({ ok: false, error: '�摜�t�@�C��������܂���' });
    }

    // ���v�T�C�Y�`�F�b�N�i30MB�j
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const base64Length = files[i].base64.length;
      totalSize += base64Length * 0.75; // Base64�͖�4/3�{�̃T�C�Y
    }
    if (totalSize > 30 * 1024 * 1024) {
      return jsonResponse({ ok: false, error: '�摜�̍��v�T�C�Y��30MB�𒴂��Ă��܂�' });
    }

    // Google�X���C�h���J���i�ݒ肳�ꂽslidesId���g�p�A�Ȃ���΃f�t�H���g�j
    const slidesId = payload.slidesId || SLIDES_ID;
    const presentation = SlidesApp.openById(slidesId);
    const pageSize = presentation.getPageWidth();
    const pageHeight = presentation.getPageHeight();

    // ���L�e�L�X�g�p�̃^�C���X�^���v
    const timestamp = Utilities.formatDate(
      new Date(),
      'Asia/Tokyo',
      "yyyy-MM-dd HH:mm 'JST'"
    );
    const note = payload.note ? payload.note.trim() : '';
    
    // �ʒu��񂪂���Βǉ�
    let locationText = '';
    if (payload.location) {
      const loc = payload.location;
      locationText = ' GPS:' + loc.latitude.toFixed(4) + ',' + loc.longitude.toFixed(4);
    }
    
    const noteText = '[' + timestamp + ']' + locationText + (note ? ' ' + note : '');

    let pagesAppended = 0;

    // �e�摜���X���C�h�ɒǉ�
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // MIME�^�C�v�`�F�b�N�iJPEG/PNG/PDF�j
      if (file.mimeType !== 'image/jpeg' && file.mimeType !== 'image/png' && file.mimeType !== 'application/pdf') {
        Logger.log('�X�L�b�v: ��Ή��̌`�� ' + file.name);
        continue;
      }

      try {
        // Base64����Blob�ɕϊ�
        const imageBlob = Utilities.newBlob(
          Utilities.base64Decode(file.base64),
          file.mimeType,
          file.name
        );

        // �V�����X���C�h��ǉ�
        const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

        // �摜��}��
        const image = slide.insertImage(imageBlob);

        // �摜�̌��̃T�C�Y���擾
        const imageWidth = image.getWidth();
        const imageHeight = image.getHeight();

        // �摜��S��ʂɃt�B�b�g�i�A�X�y�N�g���ێ��j
        const scaleWidth = pageSize / imageWidth;
        const scaleHeight = pageHeight / imageHeight;
        const scale = Math.min(scaleWidth, scaleHeight);

        const newWidth = imageWidth * scale;
        const newHeight = imageHeight * scale;

        image.setWidth(newWidth);
        image.setHeight(newHeight);

        // �����ɔz�u
        image.setLeft((pageSize - newWidth) / 2);
        image.setTop((pageHeight - newHeight) / 2);

        // �E���ɒ��L�e�L�X�g�{�b�N�X��ǉ�
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
        Logger.log('�摜�ǉ��G���[ (' + file.name + '): ' + imageError.toString());
        // �G���[�ł����s
      }
    }

    if (pagesAppended === 0) {
      return jsonResponse({ ok: false, error: '�摜��1�����ǉ��ł��܂���ł���' });
    }

    return jsonResponse({
      ok: true,
      pagesAppended: pagesAppended,
      timestamp: timestamp
    });

  } catch (error) {
    Logger.log('Error in handleImageMode: ' + error.toString());
    return jsonResponse({ ok: false, error: '�摜�ǉ��G���[: ' + error.toString() });
  }
}

// ========================================
// ���[�e�B���e�B�֐�
// ========================================

/**
 * JSON�`���̃��X�|���X��Ԃ�
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// �e�X�g�p�֐�
// ========================================

/**
 * �e�L�X�g�ǉ��̃e�X�g
 */
function testAddText() {
  const payload = {
    mode: 'text',
    apiKey: API_KEY,
    text: '����̓e�X�g�����ł�'
  };
  const result = handleTextMode(payload);
  Logger.log(result.getContent());
}

/**
 * �ݒ�̊m�F
 */
function checkConfig() {
  Logger.log('API_KEY: ' + (API_KEY !== 'your-strong-random-api-key' ? '�ݒ�ς�' : '���ݒ�'));
  Logger.log('DOC_ID: ' + DOC_ID);
  Logger.log('SLIDES_ID: ' + SLIDES_ID);
  
  try {
    DocumentApp.openById(DOC_ID);
    Logger.log('? Google�h�L�������g�ɃA�N�Z�X�\');
  } catch (e) {
    Logger.log('? Google�h�L�������g�ɃA�N�Z�X�ł��܂���: ' + e.toString());
  }
  
  try {
    SlidesApp.openById(SLIDES_ID);
    Logger.log('? Google�X���C�h�ɃA�N�Z�X�\');
  } catch (e) {
    Logger.log('? Google�X���C�h�ɃA�N�Z�X�ł��܂���: ' + e.toString());
  }
}
