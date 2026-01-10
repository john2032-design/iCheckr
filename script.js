// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signForm');
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const radios = document.querySelectorAll('input[name="ipaType"]');
    const resultDiv = document.getElementById('result');
    const messageP = document.getElementById('message');
    const errorP = document.getElementById('error');
    const installButton = document.getElementById('installButton');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'file') {
                fileInput.style.display = 'block';
                urlInput.style.display = 'none';
            } else {
                fileInput.style.display = 'none';
                urlInput.style.display = 'block';
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resultDiv.style.display = 'none';
        messageP.textContent = '';
        errorP.textContent = '';
        installButton.style.display = 'none';

        const formData = new FormData();
        const ipaType = document.querySelector('input[name="ipaType"]:checked').value;
        if (ipaType === 'file') {
            const file = document.getElementById('ipaFile').files[0];
            if (file) {
                formData.append('ipa', file);
            }
        } else {
            const url = document.getElementById('ipaUrl').value;
            if (url) {
                formData.append('ipa', url);
            }
        }

        const bundleId = document.getElementById('bundleId').value;
        if (bundleId) formData.append('bundleId', bundleId);

        const bundleName = document.getElementById('bundleName').value;
        if (bundleName) formData.append('bundleName', bundleName);

        const bypass = document.querySelector('input[name="bypassapplerevokes"]').checked;
        if (bypass) formData.append('bypassapplerevokes', 'true');

        try {
            const response = await fetch('https://cococloud-signing.online/api/v2/free-enterprise/sign', {
                method: 'POST',
                headers: {
                    'X-API-Key': 'sk_ESBI30Eq65EPCnDia28EQn5irepova6q1sZYv7WI'
                },
                body: formData
            });

            const data = await response.json();

            resultDiv.style.display = 'block';

            if (response.ok && data.success) {
                messageP.textContent = data.message || 'IPA signed successfully!';
                if (data.itmsServicesUrl) {
                    installButton.href = data.itmsServicesUrl;
                    installButton.style.display = 'inline-block';
                }
            } else {
                errorP.textContent = data.error || 'An error occurred.';
            }
        } catch (err) {
            resultDiv.style.display = 'block';
            errorP.textContent = 'Failed to connect to the API: ' + err.message;
        }
    });
});
