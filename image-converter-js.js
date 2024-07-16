const fileInput = document.getElementById('file-input');
const previewArea = document.getElementById('preview-area');
const renameArea = document.getElementById('rename-area');
const renamePrefix = document.getElementById('rename-prefix');
const renameButton = document.getElementById('rename-button');
const convertButton = document.getElementById('convert-button');

let selectedFiles = [];

fileInput.addEventListener('change', handleFileSelect);
renameButton.addEventListener('click', handleRename);
convertButton.addEventListener('click', handleConvert);

function handleFileSelect(event) {
    selectedFiles = Array.from(event.target.files).slice(0, 10);
    updatePreview();
    renameArea.hidden = false;
    convertButton.disabled = false;
}

function updatePreview() {
    previewArea.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-image');
            img.title = file.name;
            previewArea.appendChild(img);
        }
        reader.readAsDataURL(file);
    });
}

function handleRename() {
    const prefix = renamePrefix.value.trim();
    if (prefix) {
        selectedFiles = selectedFiles.map((file, index) => {
            const newName = `${prefix}_${index + 1}.jpg`;
            return new File([file], newName, { type: file.type });
        });
        updatePreview();
    }
}

function handleConvert() {
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name.replace('.jpg', '.png');
                    a.click();
                    URL.revokeObjectURL(url);
                }, 'image/png');
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    });
}
