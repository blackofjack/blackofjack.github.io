function NumToWord(inputNumber) {
    const once = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const twos = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'];

    function convertChunk(num) {
        if (num === 0) return '';

        let word = '';
        if (num >= 100) {
            word += once[Math.floor(num / 100)] + ' Hundred ';
            num %= 100;
        }

        if (num >= 20) {
            word += tens[Math.floor(num / 10)] + ' ';
            num %= 10;
        }

        if (num > 0) {
            if (num < 10) {
                word += once[num] + ' ';
            } else {
                word += twos[num - 10] + ' ';
            }
        }

        return word;
    }

    if (isNaN(inputNumber) || inputNumber < 0 || inputNumber > Number.MAX_SAFE_INTEGER) {
        return 'Invalid input';
    }

    if (inputNumber === 0) {
        return 'Zero';
    }

    const [wholeNumber, decimalPart] = inputNumber.toFixed(2).toString().split('.');
    const numString = wholeNumber;
    const chunks = [];
    for (let i = numString.length; i > 0; i -= 3) {
        chunks.push(numString.substring(Math.max(0, i - 3), i));
    }

    let word = '';
    for (let i = chunks.length - 1; i >= 0; i--) {
        const chunkValue = parseInt(chunks[i], 10);
        if (chunkValue !== 0) {
            word += convertChunk(chunkValue) + thousands[i] + ' ';
        }
    }

    // // Handle centavos (decimal part)
    // if (decimalPart) {
    //     const decimalValue = parseInt(decimalPart, 10);
    //     const centavos = (decimalValue < 10)
    //         ? once[decimalValue] + ' Cent'
    //         : tens[Math.floor(decimalValue / 10)] + ' ' + once[decimalValue % 10] + ' Cents';

    //     word += 'and ' + centavos;
    // }

    return word.trim();
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom when appending textarea
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function isNumeric(value) {
    return /^\d+(\.\d{1,2})?$/.test(value);
}


function convertAndCopyToClipboard() {
    const inputNumberStr = document.getElementById('inputNumber').value.trim();
    
    if (!isNumeric(inputNumberStr)) {
        alert('Please enter a valid number.');
        return;
    }

    const inputNumber = parseFloat(inputNumberStr); // Use parseFloat to handle decimal numbers
    const result = NumToWord(inputNumber);
    let outputText = result;

    // Remove the word "Cent" from the centavos part
    if (outputText.includes('Cent')) {
        outputText = outputText.replace('Cent', '');
    }

    // Handle centavos directly for decimal values less than one
    if (inputNumberStr.includes('.') && !inputNumberStr.endsWith('.')) {
        const [wholeNumber, decimalPart] = inputNumberStr.split('.');
        if (decimalPart !== '00') {
            outputText += (outputText ? ' and ' : '') + convertCentavos(wholeNumber, decimalPart);
        }
    }

    document.getElementById('outputResult').innerHTML = outputText;
    copyToClipboard(outputText);
    alert('The converted text has been copied to the clipboard!');
}

function convertCentavos(wholeNumber, centavos) {
    let result = '';

    
    // Convert the centavos part
    if (parseInt(centavos, 10) > 0) {
        result += NumToWord(parseInt(centavos, 10));
    }

    return result;
}