<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đóng góp video</title>
  <link rel="icon" type="image/png" href="logo.png">
  <link rel="stylesheet" href="style.css">
</head>

<body>

  <!-- Thanh trên cùng (giống các trang khác) -->
  <div class="topbar">
    <a href="video.html" class="upload-btn">← Quay về Gallery Video</a>
  </div>

  <div class="upload-page">
    <div class="upload-card">
      <h2 class="upload-title">🎬 Đóng góp thêm video</h2>
      <p class="upload-subtitle">
        Chọn video từ thư mục hoặc kéo thả trực tiếp vào khung bên dưới
      </p>

      <div class="video-select-wrapper">
        <input type="file" id="videoUploadInput" multiple accept="video/*" style="display:none;">

        <div class="video-drop-row" id="dropZone">
          <button id="selectFileBtn" class="upload-btn select-video-btn">
            📁 Chọn file video
          </button>

          <div id="fileNameDisplay" class="file-display">
            Kéo thả video vào đây hoặc chọn từ thư mục
          </div>
        </div>
      </div>

      <div class="upload-action">
        <button id="videoUploadBtn" class="upload-btn upload-main-btn">
          ⬆️ Tải video lên Gallery
        </button>
      </div>

      <p id="videoStatus" class="upload-status"></p>
    </div>
  </div>

  <script src="video-upload.js"></script>

  <script>
    const selectBtn = document.getElementById('selectFileBtn');
    const uploadInput = document.getElementById('videoUploadInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const dropZone = document.getElementById('dropZone');

    // lưu danh sách file cộng dồn
    let selectedFiles = [];
    window.selectedFiles = selectedFiles;

    selectBtn.addEventListener('click', () => {
      uploadInput.click();
    });

    function syncInputFiles() {
      const dt = new DataTransfer();

      selectedFiles.forEach(file => {
        dt.items.add(file);
      });

      uploadInput.files = dt.files;
    }
    window.syncInputFiles = syncInputFiles;

    function renderFileList() {
      if (selectedFiles.length === 0) {
        fileNameDisplay.innerHTML =
          'Kéo thả video vào đây hoặc chọn từ thư mục';
        fileNameDisplay.style.color = '#aaa';
        return;
      }

      let html = `<b>Đã chọn ${selectedFiles.length} video:</b><br>`;

      selectedFiles.forEach((file, index) => {
        html += `
        <div class="selected-file-item">
          <span>${index + 1}. ${file.name}</span>
          <button class="remove-file-btn" data-index="${index}">✖</button>
        </div>
      `;
      });

      fileNameDisplay.innerHTML = html;
      fileNameDisplay.style.color = '#4ade80';

      // gắn nút xoá
      document.querySelectorAll('.remove-file-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = Number(btn.dataset.index);
          selectedFiles.splice(index, 1);

          syncInputFiles();
          renderFileList();
        });
      });
    }
    window.renderFileList = renderFileList;

    function addFiles(newFiles) {
      for (const file of newFiles) {
        // tránh trùng file giống hệt
        const exists = selectedFiles.some(
          f =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        );

        if (!exists) {
          selectedFiles.push(file);
        }
      }

      syncInputFiles();
      renderFileList();
    }
    window.addFiles = addFiles;

    uploadInput.addEventListener('change', function () {
      addFiles(this.files);
      this.value = "";
    });

    // kéo thả
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileNameDisplay.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      fileNameDisplay.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileNameDisplay.classList.remove('dragover');

      addFiles(e.dataTransfer.files);
    });
  </script>

</body>

</html>
