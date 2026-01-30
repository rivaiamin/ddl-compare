/**
 * UI Handler - Manages user interface interactions
 */

// Initialize UI event handlers
function initializeUI() {
    const sourceInput = document.getElementById('sourceFile');
    const destInput = document.getElementById('destFile');
    const sourceStatus = document.getElementById('sourceStatus');
    const destStatus = document.getElementById('destStatus');
    const sourceContainer = sourceInput.closest('.bg-white');
    const destContainer = destInput.closest('.bg-white');

    // File input change handlers
    sourceInput.addEventListener('change', (e) => {
        updateFileStatus(e.target, sourceStatus, sourceContainer);
        clearError(sourceContainer);
    });

    destInput.addEventListener('change', (e) => {
        updateFileStatus(e.target, destStatus, destContainer);
        clearError(destContainer);
    });

    // Drag and drop handlers
    setupDragAndDrop(sourceInput, sourceContainer, sourceStatus);
    setupDragAndDrop(destInput, destContainer, destStatus);

    // Options toggle
    const detectDropsCheckbox = document.getElementById('detectDrops');
    const preserveOrderCheckbox = document.getElementById('preserveOrder');

    if (detectDropsCheckbox) {
        detectDropsCheckbox.addEventListener('change', () => {
            // Option change will be used in next comparison
        });
    }

    if (preserveOrderCheckbox) {
        preserveOrderCheckbox.addEventListener('change', () => {
            // Option change will be used in next comparison
        });
    }
}

/**
 * Update file status display
 */
function updateFileStatus(input, label, container) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileSize = formatFileSize(file.size);
        label.innerHTML = `
            <span class="text-blue-600 font-medium">${file.name}</span>
            <span class="text-slate-400 ml-2">(${fileSize})</span>
        `;
        label.className = 'mt-2 text-xs';
        clearError(container);
    } else {
        label.textContent = 'No file selected';
        label.className = 'mt-2 text-xs text-slate-400';
    }
}

/**
 * Setup drag and drop for file inputs
 */
function setupDragAndDrop(input, container, _statusLabel) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        container.addEventListener(eventName, () => {
            container.classList.add('border-blue-400', 'bg-blue-50');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, () => {
            container.classList.remove('border-blue-400', 'bg-blue-50');
        }, false);
    });

    container.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            input.files = files;
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
        }
    }, false);
}

/**
 * Process files and generate migration script
 * Called from HTML onclick handler
 */
// eslint-disable-next-line no-unused-vars
async function processFiles() {
    const sourceInput = document.getElementById('sourceFile');
    const destInput = document.getElementById('destFile');
    const sourceContainer = sourceInput.closest('.bg-white');
    const destContainer = destInput.closest('.bg-white');

    // Validation
    if (!sourceInput.files[0]) {
        showError(sourceContainer, 'Please select a source SQL file');
        sourceInput.focus();
        return;
    }

    if (!destInput.files[0]) {
        showError(destContainer, 'Please select a destination SQL file');
        destInput.focus();
        return;
    }

    setLoadingState(true);
    const outputSection = document.getElementById('outputSection');
    const outputContent = document.getElementById('outputContent');
    const statsPanel = document.getElementById('statsPanel');

    try {
        // Read files
        const [sourceText, destText] = await Promise.all([
            readFile(sourceInput.files[0]),
            readFile(destInput.files[0])
        ]);

        // Validate files
        const sourceValidation = validateSqlFile(sourceText);
        if (!sourceValidation.valid) {
            showError(sourceContainer, sourceValidation.error);
            setLoadingState(false);
            return;
        }

        const destValidation = validateSqlFile(destText);
        if (!destValidation.valid) {
            showError(destContainer, destValidation.error);
            setLoadingState(false);
            return;
        }

        // Parse schemas
        const sourceParser = new DDLParser(sourceText);
        const sourceSchema = sourceParser.parse();

        const destParser = new DDLParser(destText);
        const destSchema = destParser.parse();

        // Get options
        const detectDrops = document.getElementById('detectDrops')?.checked || false;
        const preserveOrder = document.getElementById('preserveOrder')?.checked || false;

        // Compare schemas
        const comparator = new SchemaComparator(sourceSchema, destSchema, {
            detectDrops,
            preserveColumnOrder: preserveOrder
        });
        const migrationSql = comparator.compare();
        const stats = comparator.getStats();

        // Display results
        outputSection.classList.remove('hidden');
        outputContent.textContent = migrationSql;
        outputContent.className = 'sql-code p-6 overflow-x-auto text-sm text-slate-800 bg-slate-50 min-h-[300px]';

        // Update stats panel
        if (statsPanel) {
            statsPanel.classList.remove('hidden');
            updateStatsPanel(stats);
        }

        // Apply syntax highlighting
        if (window.Prism) {
            Prism.highlightElement(outputContent);
        }

        // Scroll to result
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        showToast('Migration script generated successfully!', 'success');

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error processing files:', error);
        showToast(`Error: ${error.message}`, 'error');
        showError(sourceContainer, 'An error occurred while processing. Check console for details.');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Update statistics panel
 */
function updateStatsPanel(stats) {
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel) return;

    const statsHTML = `
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div class="bg-blue-50 p-3 rounded">
                <div class="text-blue-600 font-semibold">${stats.tablesAdded}</div>
                <div class="text-slate-600 text-xs">Tables Added</div>
            </div>
            <div class="bg-red-50 p-3 rounded">
                <div class="text-red-600 font-semibold">${stats.tablesDropped}</div>
                <div class="text-slate-600 text-xs">Tables Dropped</div>
            </div>
            <div class="bg-green-50 p-3 rounded">
                <div class="text-green-600 font-semibold">${stats.columnsAdded}</div>
                <div class="text-slate-600 text-xs">Columns Added</div>
            </div>
            <div class="bg-yellow-50 p-3 rounded">
                <div class="text-yellow-600 font-semibold">${stats.columnsModified}</div>
                <div class="text-slate-600 text-xs">Columns Modified</div>
            </div>
            <div class="bg-orange-50 p-3 rounded">
                <div class="text-orange-600 font-semibold">${stats.columnsDropped}</div>
                <div class="text-slate-600 text-xs">Columns Dropped</div>
            </div>
            <div class="bg-purple-50 p-3 rounded">
                <div class="text-purple-600 font-semibold">${stats.indexesAdded}</div>
                <div class="text-slate-600 text-xs">Indexes Added</div>
            </div>
        </div>
    `;
    statsPanel.innerHTML = statsHTML;
}

/**
 * Copy migration script to clipboard
 * Called from HTML onclick handler
 */
// eslint-disable-next-line no-unused-vars
function copyToClipboard() {
    const content = document.getElementById('outputContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const btn = document.querySelector('button i.fa-copy')?.parentElement;
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            btn.classList.add('bg-green-600');
            btn.classList.remove('bg-slate-700');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-green-600');
                btn.classList.add('bg-slate-700');
            }, 2000);
        }
        showToast('Copied to clipboard!', 'success', 2000);
    }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
    });
}

/**
 * Download migration script
 * Called from HTML onclick handler
 */
// eslint-disable-next-line no-unused-vars
function downloadScript() {
    const content = document.getElementById('outputContent').textContent;
    const blob = new Blob([content], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'migration_script.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download started!', 'success', 2000);
}

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUI);
} else {
    initializeUI();
}
