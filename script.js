document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const selectBtn = document.getElementById('selectBtn');
    const fileInput = document.getElementById('fileInput');
    const fileCard = document.getElementById('fileCard');
    const fileNameDisplay = document.getElementById('fileName');
    const customKbInput = document.getElementById('customKbInput');
    const compressBtn = document.getElementById('compressBtn');

    const successModal = document.getElementById('successModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalSubText = document.getElementById('modalSubText');

    let selectedFile = null;

    selectBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
    dropZone.addEventListener('click', () => { fileInput.click(); });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });
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
            alert('Please select a valid image (.jpg, .jpeg, .png, .webp)');
            return;
        }
        selectedFile = file;
        fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        fileCard.style.display = 'flex';
    }

    compressBtn.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('Pehle image select karein!');
            return;
        }

        const targetSize = parseInt(customKbInput.value);
        if (isNaN(targetSize) || targetSize < 1 || targetSize > 300) {
            alert('Please enter a target size between 1 and 300 KB.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('target_size_kb', targetSize);

        const originalText = compressBtn.textContent;
        compressBtn.textContent = 'Compressing... Please Wait';
        compressBtn.disabled = true;

        try {
            const response = await fetch('https://filemorph-backend.onrender.com/compress', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Compression failed.');

            const blob = await response.blob();
            const outputKb = (blob.size / 1024).toFixed(1);
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `compressed_${outputKb}kb_${selectedFile.name.replace(/\.[^/.]+$/, "")}.jpg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            modalSubText.textContent = `Output size: ${outputKb} KB (Target: under ${targetSize} KB)`;
            successModal.classList.add('active');

        } catch (error) {
            console.error(error);
            alert('Server waking up or connection issue. Please retry in 20-30 seconds.');
        } finally {
            compressBtn.textContent = originalText;
            compressBtn.disabled = false;
        }
    });

    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => { successModal.classList.remove('active'); });
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) successModal.classList.remove('active');
        });
    }
});
