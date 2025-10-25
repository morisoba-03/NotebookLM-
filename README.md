# NotebookLM Input Hub

�e�L�X�g�����Ɖ摜��NotebookLM�ɒǉ����邽�߂̃V���v����Web�A�v���P�[�V�����ł��B

## ? �@�\

1. **�e�L�X�g�����ǉ�**: Google�h�L�������g�̖����� `[YYYY-MM-DD HH:mm:ss JST] �e�L�X�g` �`���ŒǋL
2. **�摜�ǉ�**: Google Slides�ɉ摜��1��=1�X���C�h�Œǉ����APDF�ɏ����o���Ċ���PDF�t�@�C�����㏑��

## ? �\��

```
NotebookLM�p/
������ frontend/
��   ������ index.html      # ���C��HTML
��   ������ app.js          # �t�����g�G���h���W�b�N
��   ������ style.css       # �X�^�C���V�[�g
������ backend-gas/
��   ������ Code.gs         # Google Apps Script�R�[�h
��   ������ appsscript.json # GAS�ݒ�t�@�C��
������ README.md           # ���̃t�@�C��
```

## ? �Z�b�g�A�b�v�菇�i���S�Łj

### �X�e�b�v1: �K�v��Google Drive�t�@�C���������i5���j

#### 1-1. Google�h�L�������g�̊m�F
? ���łɂ������̃h�L�������g������܂��I
- **URL**: https://docs.google.com/document/d/1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ/edit
- **ID**: `1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ`

���̃h�L�������g�Ƀe�L�X�g�������ǋL����܂��B

#### 1-2. Google�X���C�h�̍쐬
1. [Google Drive](https://drive.google.com)�ɃA�N�Z�X
2. ����́u�V�K�v���uGoogle�X���C�h�v���u�󔒂̃v���[���e�[�V�����v���N���b�N
3. �X���C�h�����uNotebookLM �摜�\�[�X�v�ȂǂɕύX
4. �ŏ���1���̃X���C�h�͍폜���Ă�OK�i�摜�ǉ����ɐV�����X���C�h�������Œǉ�����܂��j
5. URL����**�X���C�hID**���R�s�[
   ```
   URL��: https://docs.google.com/presentation/d/�y������ID�z/edit
   ```
   - �u/d/�v�Ɓu/edit�v�̊Ԃ̕�����ID�ł�
6. ����ID���������ȂǂɍT���Ă���

> **��**: `https://docs.google.com/presentation/d/1ABC...XYZ/edit`  
> ���̏ꍇ�AID�� `1ABC...XYZ` �ł�

---

### �X�e�b�v2: NotebookLM�Ƀ\�[�X��o�^�i3���j

1. [NotebookLM](https://notebooklm.google.com/)�ɃA�N�Z�X
2. �V�����m�[�g�u�b�N���쐬�i�܂��͊����̂��̂��J���j
3. **�u�\�[�X��ǉ��v**���N���b�N

#### �\�[�X1: Google�h�L�������g
1. �uGoogle�h�L�������g�v��I��
2. ��قǂ̃h�L�������g�i`1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ`�j��I��
3. �u�ǉ��v���N���b�N

#### �\�[�X2: Google�X���C�h
1. ������x�u�\�[�X��ǉ��v���N���b�N
2. �uGoogle�X���C�h�v��I��
3. �X�e�b�v1-2�ō쐬�����X���C�h��I��
4. �u�ǉ��v���N���b�N

? �����2�̃\�[�X���o�^����܂����I
- ? Google�h�L�������g�i�e�L�X�g�����p�j
- ?? Google�X���C�h�i�摜�p�j

> **�d�v**: NotebookLM�ւ̔��f�ɂ�**5?10��**������܂�

---

### �X�e�b�v3: Google Apps Script�̐ݒ�

#### 3-1. Apps Script�v���W�F�N�g�̍쐬
1. [Google Apps Script](https://script.google.com/)�ɃA�N�Z�X
2. ����u�V�����v���W�F�N�g�v���N���b�N
3. �v���W�F�N�g�����uNotebookLM Input Hub�v�ȂǂɕύX�i����́u����̃v���W�F�N�g�v���N���b�N�j

#### 3-2. �R�[�h�̓\��t��
1. �����̃t�@�C���ꗗ�Łu�R�[�h.gs�v��I��
2. ���ׂĂ̓��e���폜���A`backend-gas/Code.gs` �̓��e���R�s�[&�y�[�X�g
3. �����̃t�@�C���ꗗ�́u?? �v���W�F�N�g�̐ݒ�v�A�C�R�����N���b�N
4. ���ɃX�N���[�����āuappsscript.json�v�}�j�t�F�X�g �t�@�C�����G�f�B�^�ŕ\������v�Ƀ`�F�b�N
5. �����Ɂuappsscript.json�v���\�������̂ŃN���b�N
6. ���ׂĂ̓��e���폜���A`backend-gas/appsscript.json` �̓��e���R�s�[&�y�[�X�g

#### 3-4. �ݒ�l�̕ҏW
1. �u�R�[�h.gs�v�t�@�C�����J��
2. �`���̐ݒ蕔����ҏW�F

```javascript
// ���͂ȃ����_��������ɕύX���Ă��������i20�����ȏ㐄���j
const API_KEY = 'mySecret2024!Notebook#LM_xyz123';

// ���łɐݒ�ς݁i�ύX�s�v�j
const DOC_ID = '1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ';

// �X�e�b�v1-2�ōT�����X���C�hID��\��t��
const SLIDES_ID = '�����ɃX���C�hID��\��t��';
```

> **API_KEY�̍���**: �K���ȉp�����L����������20�����ȏ�̕����������Ă��������B��: `mySecret2024!Notebook#LM`

3. �ۑ��A�C�R���i?�j���N���b�N

#### 3-5. ����m�F�e�X�g
1. �㕔�̊֐��v���_�E���ŁucheckConfig�v��I��
2. �u���s�v�{�^���i??�j���N���b�N
3. ����͌����̏��F���K�v�ł��F
   - �u�������m�F�v���N���b�N
   - Google�A�J�E���g��I��
   - �u�ڍׁv���uNotebookLM Input Hub�i���S�ł͂Ȃ��y�[�W�j�Ɉړ��v���N���b�N
   - �u���v���N���b�N
4. �����́u���s���O�v�Ɂu? Google�h�L�������g�ɃA�N�Z�X�\�v�Ȃǂƕ\��������OK

---

### �X�e�b�v4: Web�A�v���Ƃ��ăf�v���CAT

1. �E��́u�f�v���C�v���u�V�����f�v���C�v���N���b�N
2. ����́u��ނ̑I���v�i??�A�C�R���j���u�E�F�u�A�v���v��I��
3. �ȉ��̂悤�ɐݒ�F
   - **����**: �uv1�v�Ȃǁi�C�Ӂj
   - **���̃��[�U�[�Ƃ��Ď��s**: �u�����v��I��
   - **�A�N�Z�X�ł��郆�[�U�[**: �u�S���v��I��
4. �u�f�v���C�v���N���b�N
5. �u�E�F�u�A�v����URL�v���\�������̂ŁA**URL���R�s�[**�i��Ŏg���܂��j
   - ��: `https://script.google.com/macros/s/ABC.../exec`
6. �u�����v���N���b�N

> **����**: �u�S���v�ɐݒ肵�Ă��AAPI_KEY�ɂ��F�؂�����̂ň��S�ł��B

---

### �X�e�b�v5: �t�����g�G���h�̐ݒ�

#### 5-1. app.js�̕ҏW
1. `frontend/app.js` ����������VS Code�ȂǂŊJ��
2. �`���̐ݒ蕔����ҏW�F

```javascript
// �X�e�b�v4�ŃR�s�[����Web�A�v��URL��\��t��
const ENDPOINT = "https://script.google.com/macros/s/ABC123XYZ.../exec";

// Code.gs�Őݒ肵���̂Ɠ���API_KEY��\��t��
const API_KEY = "mySecret2024!Notebook#LM_xyz123";

// ���łɐݒ�ς݁i�m�F�̂݁j
const DOC_ID = "1cR6575SP7YB9QquRgkH7qOInjTnak4vet0EJ-q6CNXQ";

// �X�e�b�v1-2�ōT�����X���C�hID��\��t��
const SLIDES_ID = "�����ɃX���C�hID��\��t��";
```

3. �ۑ�

---

### �X�e�b�v6: ����m�F

#### 6-1. ���[�J���ŊJ��
1. `frontend/index.html` ���_�u���N���b�N���ău���E�U�ŊJ��
2. �܂��́A�u���E�U�� `index.html` ���h���b�O&�h���b�v

#### 6-2. �e�L�X�g�����̃e�X�g
1. �e�L�X�g���͗��Ɂu�e�X�g���e�v�ȂǂƓ���
2. �u������ǉ��v�{�^�����N���b�N
3. �u? ������ǉ����܂����v�ƕ\��������OK
4. Google�h�L�������g���J���āA`4. Google�h�L�������g���J���Ċm�F�F
   ```
   [2025-10-25 14:30:45 JST] �e�X�g���e
   ```
   ���̂悤�Ȍ`���ŒǋL����Ă����OK�I

#### 6-3. �摜�̃e�X�g
1. �u**? �摜��I��**�v���N���b�N
2. JPEG/PNG�摜��1���I��
3. �i�I�v�V�����j���L���Ɂu�e�X�g�摜�v�Ɠ���
4. �u**�摜��ǉ�**�v�{�^�����N���b�N
5. ? �u**1���̉摜���X���C�h�ɒǉ����܂���**�v�ƕ\��������OK
6. Google�X���C�h���J���Ċm�F�F
   - �V�����X���C�h���ǉ�����Ă���
   - �摜���S��ʂɃt�B�b�g�\������Ă���
   - �E���� `[2025-10-25 14:32 JST] �e�X�g�摜` �̂悤�Ȓ��L������

#### 6-4. NotebookLM�Ŋm�F�i5����j
1. NotebookLM���J��
2. **5?10���҂�**�iGoogle����������̂�҂��܂��j
3. �`���b�g�Ŏ��₵�Ă݂�F
   - �u�ŐV�̃����������āv
   - �u�����ǉ������摜�ɂ��ċ����āv
   - �u�e�X�g���e�ɂ��Đ������āv
4. NotebookLM�����e��F�����Ă����OK�I` �̂悤�Ȍ`���ŒǋL����Ă��邩�m�F

#### 6-3. �摜�̃e�X�g
1. �u�摜��I���v���N���b�N���āAJPEG/PNG�摜��1���I��
2. �i�I�v�V�����j���L���Ɂu�e�X�g�摜�v�ȂǂƓ���
3. �u�摜��ǉ��v�{�^�����N���b�N
4. �u? 1���̉摜��ǉ����܂����v�ƕ\��������OK
5. Google�X���C�h���J���āA�V�����X���C�h�ɉ摜���ǉ�����Ă��邩�m�F
6. Google Drive��PDF�t�@�C�����J���āA�摜���܂܂�Ă��邩�m�F
7. NotebookLM�Ő����҂��āA�摜�̓��e�����f����Ă��邩�m�F�i�`���b�g�Łu�ŐV�̉摜�ɂ��ċ����āv�Ȃǁj

---

## ? �g���u���V���[�e�B���O

### �G���[: �uunauthorized�v
- **����**: `app.js` �� `API_KEY` �� `Code.gs` �� `API_KEY` ����v���Ă��܂���
- **����**: �����̃t�@�C���œ���API_KEY�ɐݒ肵�Ă�������

### �G���[: �uJSON�p�[�X�G���[�v
- **����**: �l�b�g���[�N�G���[�܂���GAS��URL���Ԉ���Ă��܂�
- **����**: `app.js` �� `ENDPOINT` �����������m�F���Ă�������

### �摜���ǉ�����Ȃ�
- **����**: SLIDES_ID���Ԉ���Ă���A�܂��͌���������܂���
- **����**: 
  1. �X���C�h��URL����ID���Ċm�F
  2. Apps Script�̎��s���[�U�[�����̃X���C�h�ɃA�N�Z�X�ł��邩�m�F
  3. `checkConfig`�֐������s���ă��O���m�F

### NotebookLM�ɔ��f����Ȃ�
- **����**: Google�̓����Ɏ��Ԃ��������Ă��܂�
- **����**: 
  1. 5?10���҂��Ă���ēx�m�F
  2. NotebookLM�Ń\�[�X����x�폜���čĒǉ�
  3. Google�h�L�������g/�X���C�h�𒼐ڊJ���āA���e���ǉ�����Ă��邩�m�F

### �{�^���������Ă��������Ȃ�
- **����**: ENDPOINT�����ݒ�
- **����**: 
  1. �u���E�U�̊J���҃c�[�����J���iF12�L�[�j
  2. �uConsole�v�^�u�ŃG���[���b�Z�[�W���m�F
  3. `app.js`��ENDPOINT��API_KEY���������ݒ肳��Ă��邩�m�F

---

## ? �g����

### ����I�ȗ��p���@

#### �e�L�X�g������ǉ�
1. HTML���J��
2. �e�L�X�g�G���A�Ƀ��������
3. �u������ǉ��v�{�^�����N���b�N
4. Google�h�L�������g�Ɏ����ǋL����܂�

#### �摜��ǉ�
1. HTML���J��
2. �u�摜��I���v����1���܂��͕�������I��
3. �i�C�Ӂj���L�����
4. �u�摜��ǉ��v�{�^�����N���b�N
5. Google�X���C�h�Ɏ����Œǉ�����܂�

#### NotebookLM�Ŋm�F
1. 5?10���҂�
2. NotebookLM�Ń`���b�g
3. �u�ŐV�̃�����v�񂵂āv�u�����ǉ������摜�ɂ��ċ����āv�ȂǂƎ���

---

## ? �Z�L�����e�B

- **API_KEY**: �t�����g�ƃo�b�N�G���h�ŋ��L����閧���ł��B���l�ɒm���Ȃ��悤�ɂ��Ă�������
- **CORS**: �V���v�����N�G�X�g�����̂��߁A�v���t���C�g�͔������܂���
- **�t�@�C���T�C�Y����**: �摜�̍��v�T�C�Y��30MB�܂�

---

## ? �J�X�^�}�C�Y

### �^�C���X�^���v�`����ύX
`Code.gs` �� `Utilities.formatDate` �̑�3������ύX�F
```javascript
"yyyy/MM/dd HH:mm"  // 2025/10/25 12:34
```

### �X�^�C����ύX
`frontend/style.css` ��ҏW���Ă��D�݂̐F�⃌�C�A�E�g�ɕύX�ł��܂��B

### �摜�̔z�u��ύX
`Code.gs` �� `handleImageMode` �֐����ŁA�摜�̃T�C�Y��ʒu�𒲐��ł��܂��B

---

## ? ����̊g����

- [ ] ���������̕����N�����ǉ�
- [ ] �X�N���[���V���b�g���ړ\��t���Ή�
- [ ] �^�O�@�\�i#�^�O�ł̕��ށj
- [ ] �����̌����@�\
- [ ] PWA���i�I�t���C���Ή��j
- [ ] Slack/LINE�A�g

---

## ? ���C�Z���X

���̃v���W�F�N�g��MIT���C�Z���X�ł��B���R�ɉ��ρE�Ĕz�z�ł��܂��B

---

## ? ����E����

�s���ȓ_��G���[�����������ꍇ�́A�ȉ����m�F���Ă��������F

1. Google Apps Script�́u���s���O�v�iCode.gs�Łu���s�v�������́u���s���O�v�^�u�j
2. �u���E�U�̊J���҃c�[���iF12�L�[�j���uConsole�v�^�u
3. ����README�̃g���u���V���[�e�B���O��

����ł��������Ȃ��ꍇ�́A�G���[���b�Z�[�W���R�s�[���Č������邩�A�ڂ����l�ɑ��k���Ă��������B

---

**�쐬��**: 2025-10-25  
**�o�[�W����**: 2.0�iPDF�s�v�Łj
