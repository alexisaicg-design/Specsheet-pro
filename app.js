document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURACIÓN DE MONETIZACIÓN ===
    // REEMPLAZA ESTA URL CON EL ENLACE DIRECTO A TU PRODUCTO EN GUMROAD
    const GUMROAD_PRODUCT_URL = 'https://gumroad.com'; // Ejemplo: https://tuusuario.gumroad.com/l/specsheet-pro
    
    const buyProBtn = document.getElementById('buyProBtn');
    if (buyProBtn) {
        buyProBtn.href = GUMROAD_PRODUCT_URL;
    }

    // Fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('docDate').value = today;

    // Elementos de entrada
    const prodNameInput = document.getElementById('prodName');
    const prodCodeInput = document.getElementById('prodCode');
    const companyNameInput = document.getElementById('companyName');
    const docDateInput = document.getElementById('docDate');
    const prodDescInput = document.getElementById('prodDesc');
    const logoInput = document.getElementById('logoInput');
    const addSpecBtn = document.getElementById('addSpecBtn');
    const specRowsContainer = document.getElementById('specRows');
    const generatePdfBtn = document.getElementById('generatePdfBtn');

    // Procesar Carga de Logo
    logoInput.addEventListener('change', (e) => {
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

    // Función para actualizar la vista previa en tiempo real
    function updatePreview() {
        document.getElementById('previewProdName').textContent = prodNameInput.value || 'Nombre del Producto';
        document.getElementById('previewCode').textContent = prodCodeInput.value || 'CÓDIGO-000';
        document.getElementById('previewCompany').textContent = companyNameInput.value || 'Nombre de la Empresa';
        document.getElementById('previewDate').textContent = docDateInput.value || today;
        document.getElementById('previewDesc').textContent = prodDescInput.value || 'Sin descripción.';

        // Actualizar Tabla
        const previewTableBody = document.getElementById('previewTableBody');
        previewTableBody.innerHTML = '';

        const rows = document.querySelectorAll('.spec-row');
        rows.forEach(row => {
            const param = row.querySelector('.param-name').value;
            const spec = row.querySelector('.param-spec').value;
            const method = row.querySelector('.param-method').value;

            if (param || spec || method) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="p-2 font-medium text-slate-800">${param}</td>
                    <td class="p-2 text-slate-600">${spec}</td>
                    <td class="p-2 text-slate-500 font-mono text-[10px]">${method}</td>
                `;
                previewTableBody.appendChild(tr);
            }
        });
    }

    // Escuchar cambios en los inputs
    [prodNameInput, prodCodeInput, companyNameInput, docDateInput, prodDescInput].forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    specRowsContainer.addEventListener('input', updatePreview);

    // Agregar nueva fila de parámetros
    addSpecBtn.addEventListener('click', () => {
        const newRow = document.createElement('div');
        newRow.className = 'grid grid-cols-3 gap-2 spec-row';
        newRow.innerHTML = `
            <input type="text" placeholder="Parámetro" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-name">
            <input type="text" placeholder="Especificación" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-spec">
            <input type="text" placeholder="Método" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs param-method">
        `;
        specRowsContainer.appendChild(newRow);
    });

    // Generar y descargar PDF
    generatePdfBtn.addEventListener('click', () => {
        const element = document.getElementById('pdfTemplate');
        const fileName = (prodCodeInput.value || 'Ficha_Tecnica') + '.pdf';

        const opt = {
            margin:       0.4,
            filename:     fileName,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Render inicial
    updatePreview();
});