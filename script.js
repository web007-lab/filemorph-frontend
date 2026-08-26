document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const selectBtn = document.getElementById('selectBtn');
    const fileInput = document.getElementById('fileInput');
    const fileCard = document.getElementById('fileCard');
    const fileNameDisplay = document.getElementById('fileName');
    const compressionLevel = document.getElementById('compressionLevel');
    const compressBtn = document.getElementById('compressBtn');

    let selectedFile = null;

    // File select karne ka code
    selectBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
    dropZone.addEventListener('click', () => { fileInput.click(); });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            fileNameDisplay.textContent = selectedFile.name;
            fileCard.style.display = 'flex';
        }
    });

    // Compress Button ka Asli Test Code
    compressBtn.addEventListener('click', async () => {
        alert("Step 1: Button click ho gaya hai!"); // Test 1

        if (!selectedFile) {
            alert('Pehle image select karein!');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('level', compressionLevel.value);

        alert("Step 2: Image Render Server par ja rahi hai... (Agar yahan atak gaya matlab Backend hang ho raha hai)"); // Test 2

        const originalText = compressBtn.textContent;
        compressBtn.textContent = 'Optimizing Image...';
        compressBtn.disabled = true;

        try {
            const response = await fetch('https://filemorph-backend.onrender.com/compress', {
                method: 'POST',
                body: formData
            });

            alert("Step 3: Server se jawab aa gaya!"); // Test 3

            if (!response.ok) {
                alert("Step 4: Jawab aaya par Error hai!");
                throw new Error('Server compression failed.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `compressed_image.jpg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            alert("Step 5: Image download ho gayi!"); // Test 5

        } catch (error) {
            console.error(error);
            alert('Error aa gaya: ' + error.message);
        } finally {
            compressBtn.textContent = originalText;
            compressBtn.disabled = false;
        }
    });
});
