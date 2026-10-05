document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURACIÓN ===
    const GUMROAD_PRODUCT_URL = 'https://4934584006928.gumroad.com/l/hogpva';
    const buyProBtn = document.getElementById('buyProBtn');
    if (buyProBtn) buyProBtn.href = GUMROAD_PRODUCT_URL;

    // Fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    const docDateInput = document.getElementById('docDate');
    if (docDateInput) docDateInput.value = today;

    // Referencias al DOM
    const elements = {
        prodName: document.getElementById('prodName'),
        prodCode: document.getElementById('prodCode'),
        companyName: document.getElementById('companyName'),
        docDate: docDateInput,
        prodDesc: document.getElementById('prodDesc'),
        logoInput: document.getElementById('logoInput'),
        addSpecBtn: document.getElementById('addSpecBtn'),
        specRowsContainer: document.getElementById('specRows'),
        generatePdfBtn: document.getElementById('generatePdfBtn')
    };

    // Procesar Carga de Logo
    if (elements.logoInput) {
        elements.logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const previewLogo = document.getElementById('previewLogo');
                    previewLogo.src = event.target.result;
                    previewLogo.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Actualización de Vista Previa (Mitigación XSS aplicada)
    function updatePreview() {
        document.getElementById('previewProdName').textContent = elements.prodName.value || 'Nombre del Producto';
        document.getElementById('previewCode').textContent = elements.prodCode.value || 'CÓDIGO-000';
        document.getElementById('previewCompany').textContent = elements.companyName.value || 'Nombre de la Empresa';
        document.getElementById('previewDate').textContent = elements.docDate.value || today;
        document.getElementById('previewDesc').textContent = elements.prodDesc.value || 'Sin descripción.';

        const previewTableBody = document.getElementById('previewTableBody');
        previewTableBody.innerHTML = ''; // Limpiar tabla

        const rows = document.querySelectorAll('.spec-row');
        rows.forEach(row => {
            const param = row.querySelector('.param-name').value;
            const spec = row.querySelector('.param-spec').value;
            const method = row.querySelector('.param-method').value;

            if (param || spec || method) {
                const tr = document.createElement('tr');
                
                const tdParam = document.createElement('td');
                tdParam.className = "p-2 font-medium text-slate-800";
                tdParam.textContent = param;

                const tdSpec = document.createElement('td');
                tdSpec.className = "p-2 text-slate-600";
                tdSpec.textContent = spec;

                const tdMethod = document.createElement('td');
                tdMethod.className = "p-2 text-slate-500 font-mono text-[10px]";
                tdMethod.textContent = method;

                tr.appendChild(tdParam);
                tr.appendChild(tdSpec);
                tr.appendChild(tdMethod);
                previewTableBody.appendChild(tr);
            }
        });
    }

    // Listeners de actualización
    ['prodName', 'prodCode', 'companyName', 'docDate', 'prodDesc'].forEach(key => {
        if (elements[key]) elements[key].addEventListener('input', updatePreview);
    });

    if (elements.specRowsContainer) {
        elements.specRowsContainer.addEventListener('input', updatePreview);
    }

    // Agregar nueva fila
    if (elements.addSpecBtn) {
        elements.addSpecBtn.addEventListener('click', () => {
            const newRow = document.createElement('div');
            newRow.className = 'grid grid-cols-3 gap-2 spec-row mt-2';
            newRow.innerHTML = `
                <input type="text" placeholder="Parámetro" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-name">
                <input type="text" placeholder="Especificación" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-spec">
                <input type="text" placeholder="Método" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-method">
            `;
            elements.specRowsContainer.appendChild(newRow);
        });
    }

    // Generador PDF
    if (elements.generatePdfBtn) {
        elements.generatePdfBtn.addEventListener('click', () => {
            const element = document.getElementById('pdfTemplate');
            const fileName = (elements.prodCode.value || 'Ficha_Tecnica') + '.pdf';

            const opt = {
                margin:       0.4,
                filename:     fileName,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();
        });
    }

    updatePreview();
});