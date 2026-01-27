let currentPhase = 1;
let beforePhotos = [];
let afterPhotos = [];

function nextPhase() {
    const currentPhaseEl = document.getElementById(`phase${currentPhase}`);
    currentPhase++;
    const nextPhaseEl = document.getElementById(`phase${currentPhase}`);
    
    if (currentPhaseEl) currentPhaseEl.classList.remove('active');
    if (nextPhaseEl) nextPhaseEl.classList.add('active');
}

// Handle before photos
document.getElementById('beforePhotos').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    beforePhotos = [...beforePhotos, ...files];
    
    updatePhotoPreview('beforePhotoPreview', beforePhotos);
    updatePhotoCount('beforePhotoCount', beforePhotos.length);
    
    const confirmBtn = document.getElementById('confirmBeforeBtn');
    confirmBtn.disabled = beforePhotos.length === 0;
});

// Handle after photos
document.getElementById('afterPhotos').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    afterPhotos = [...afterPhotos, ...files];
    
    updatePhotoPreview('afterPhotoPreview', afterPhotos);
    updatePhotoCount('afterPhotoCount', afterPhotos.length);
    
    const confirmBtn = document.getElementById('confirmAfterBtn');
    confirmBtn.disabled = afterPhotos.length === 0;
});

function updatePhotoPreview(previewId, photos) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(photo);
        img.alt = 'Photo preview';
        preview.appendChild(img);
    });
}

function updatePhotoCount(countId, count) {
    document.getElementById(countId).textContent = count;
}

// Handle paperwork checkboxes
const checkboxes = ['inventoryCheck', 'conditionCheck', 'itemsCheck', 'accessCheck'];
checkboxes.forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        const allChecked = checkboxes.every(checkId => 
            document.getElementById(checkId).checked
        );
        
        const confirmBtn = document.getElementById('confirmPaperworkBtn');
        confirmBtn.disabled = !allChecked;
    });
});

function completeJob() {
    // Update final counts
    document.getElementById('finalBeforeCount').textContent = beforePhotos.length;
    document.getElementById('finalAfterCount').textContent = afterPhotos.length;
    
    alert('Job completed successfully! All data has been recorded.');
    
    // Reset for next job
    currentPhase = 1;
    beforePhotos = [];
    afterPhotos = [];
    
    // Reset to first phase
    document.querySelectorAll('.phase').forEach(phase => phase.classList.remove('active'));
    document.getElementById('phase1').classList.add('active');
    
    // Reset form elements
    document.getElementById('beforePhotos').value = '';
    document.getElementById('afterPhotos').value = '';
    checkboxes.forEach(id => document.getElementById(id).checked = false);
    
    // Reset previews and counts
    document.getElementById('beforePhotoPreview').innerHTML = '';
    document.getElementById('afterPhotoPreview').innerHTML = '';
    updatePhotoCount('beforePhotoCount', 0);
    updatePhotoCount('afterPhotoCount', 0);
    
    // Reset button states
    document.getElementById('confirmBeforeBtn').disabled = true;
    document.getElementById('confirmAfterBtn').disabled = true;
    document.getElementById('confirmPaperworkBtn').disabled = true;
}