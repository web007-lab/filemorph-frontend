const dropZone = document.getElementById('dropZone');
const selectBtn = document.getElementById('selectBtn');
const fileInput = document.getElementById('fileInput');
const fileCard = document.getElementById('fileCard');
const fileNameDisplay = document.getElementById('fileName');
const compressionLevel = document.getElementById('compressionLevel');
const compressBtn = document.getElementById('compressBtn');

const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalSubText = document.getElementById('modalSubText');

let selectedFile = null;

selectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
    }
});

function handleFileSelection(file) {
    const validExts = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validExts.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|webp)$/i)) {
        alert('Please select a valid image file (.jpg, .jpeg, .png, .webp)');
        return;
    }
    selectedFile = file;
    fileNameDisplay.textContent = file.name;
    fileCard.style.display = 'flex';
}

compressBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        alert('Please select an image file first!');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('level', compressionLevel.value);

    compressBtn.textContent = 'Optimizing Image...';
    compressBtn.disabled = true;

    try {
        const response = await fetch('https://filemorph-backend.onrender.com/compress', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Server compression failed.');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${selectedFile.name.replace(/\.[^/.]+$/, "")}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        modalSubText.textContent = `Successfully resized ${selectedFile.name} to target limit!`;
        successModal.classList.add('active');

    } catch (error) {
        console.error(error);
        alert('Connection error! Ensure your Python backend server is running in the terminal.');
    } finally {
        compressBtn.textContent = 'COMPRESS IMAGE NOW';
        compressBtn.disabled = false;
    }
});

modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});