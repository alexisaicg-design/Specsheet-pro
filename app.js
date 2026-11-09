document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURACIÓN ===
    const GUMROAD_PRODUCT_URL = 'https://4934584006928.gumroad.com/l/hogpva';
    const buyProBtn = document.getElementById('buyProBtn');
    if (buyProBtn) buyProBtn.href = GUMROAD_PRODUCT_URL;

    // Asignar fecha de hoy por defecto
    const today = new Date().toISOString().split('T')[0];
    const docDateInput = document.getElementById('docDate');
    if (docDateInput && !docDateInput.value) {
        docDateInput.value = today;
    }

    // Referencias completas al DOM
    const elements = {
        prodName: document.getElementById('prodName'),
        prodCode: document.getElementById('prodCode'),
        companyName: document.getElementById('companyName'),
        docDate: docDateInput,
        localeSelect: document.getElementById('localeSelect'),
        revNumber: document.getElementById('revNumber'),
        revChange: document.getElementById('revChange'),
        prodDesc: document.getElementById('prodDesc'),
        logoInput: document.getElementById('logoInput'),
        addSpecBtn: document.getElementById('addSpecBtn'),
        specRowsContainer: document.getElementById('specRows'),
        generatePdfBtn: document.getElementById('generatePdfBtn')
    };

    // Formateador de fechas
    function formatPdfDate(rawDateString, formatType) {
        if (!rawDateString) return "";
        const parts = rawDateString.split("-");
        if (parts.length !== 3) return rawDateString;
        
        const [year, month, day] = parts;
        const dateObj = new Date(year, month - 1, day);

        switch (formatType) {
            case "iso":
                return rawDateString;
            case "text":
                return new Intl.DateTimeFormat('es-MX', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                }).format(dateObj).replace('.', '');
            case "es-MX":
                return `${day}/${month}/${year}`;
            case "en-US":
                return `${month}/${day}/${year}`;
            default:
                return rawDateString;
        }
    }

    // Manejador de Logo
    if (elements.logoInput) {
        elements.logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const previewLogo = document.getElementById('previewLogo');
                    if (previewLogo) {
                        previewLogo.src = event.target.result;
                        previewLogo.classList.remove('hidden');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Renderizado de Vista Previa
    function updatePreview() {
        if (elements.prodName) document.getElementById('previewProdName').textContent = elements.prodName.value || 'Nombre del Producto';
        if (elements.prodCode) document.getElementById('previewCode').textContent = elements.prodCode.value || 'CÓDIGO-000';
        if (elements.companyName) document.getElementById('previewCompany').textContent = elements.companyName.value || 'Nombre de la Empresa';
        
        // Fecha
        const rawDate = (elements.docDate && elements.docDate.value) ? elements.docDate.value : today;
        const selectedFormat = elements.localeSelect ? elements.localeSelect.value : 'iso';
        const previewDateElem = document.getElementById('previewDate');
        if (previewDateElem) previewDateElem.textContent = formatPdfDate(rawDate, selectedFormat);

        // Control de Revisión
        const rev = (elements.revNumber && elements.revNumber.value) ? elements.revNumber.value : 'Rev. 00';
        const change = (elements.revChange && elements.revChange.value) ? elements.revChange.value : 'Emisión Inicial';
        const previewRevElem = document.getElementById('previewRevision');
        if (previewRevElem) previewRevElem.textContent = `${rev} | ${change}`;

        // Descripción
        if (elements.prodDesc) document.getElementById('previewDesc').textContent = elements.prodDesc.value || 'Sin descripción.';

        // Tabla de especificaciones
        const previewTableBody = document.getElementById('previewTableBody');
        if (previewTableBody) {
            previewTableBody.innerHTML = '';
            const rows = document.querySelectorAll('.spec-row');
            rows.forEach(row => {
                const param = row.querySelector('.param-name')?.value || '';
                const spec = row.querySelector('.param-spec')?.value || '';
                const method = row.querySelector('.param-method')?.value || '';

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
    }

    // Escuchadores de eventos
    ['prodName', 'prodCode', 'companyName', 'docDate', 'localeSelect', 'revNumber', 'revChange', 'prodDesc'].forEach(key => {
        if (elements[key]) {
            elements[key].addEventListener('input', updatePreview);
            elements[key].addEventListener('change', updatePreview);
        }
    });

    if (elements.specRowsContainer) {
        elements.specRowsContainer.addEventListener('input', updatePreview);
    }

    // Botón Agregar Fila
    if (elements.addSpecBtn) {
        elements.addSpecBtn.addEventListener('click', () => {
            const newRow = document.createElement('div');
            newRow.className = 'grid grid-cols-3 gap-2 spec-row mt-2';
            newRow.innerHTML = `
                <input type="text" placeholder="Parámetro" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-name text-white">
                <input type="text" placeholder="Especificación" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-spec text-white">
                <input type="text" placeholder="Método" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-method text-white">
            `;
            elements.specRowsContainer.appendChild(newRow);
            updatePreview();
        });
    }

    // Botón Generar PDF
    if (elements.generatePdfBtn) {
        elements.generatePdfBtn.addEventListener('click', () => {
            const element = document.getElementById('pdfTemplate');
            const fileName = (elements.prodCode && elements.prodCode.value ? elements.prodCode.value : 'Ficha_Tecnica') + '.pdf';

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

    // Ejecución inicial obligatoria
    updatePreview();
});