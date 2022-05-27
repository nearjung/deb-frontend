export let Global = {
    userInfo: null,
    storeInfo: null
};

export function disCount(price: number, percent: number) {
    return (price * percent) / 100;
}

export function scriptCheckID(id) {
    console.log(id);
    let sum: number = 0;
    if (!isNumeric(id)) return false;
    if (id.substring(0, 1) === 0) return false;
    if (id.length !== 13) return false;
    for (let i = 0; i < 12; i++) {
        sum = sum + (+id.charAt(i) * (13 - i));
    }
    if ((11 - sum % 11) % 10 !== +id.charAt(12)) return false;
    return true;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        console.log(reader.result);
        return reader.result;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export function resizeImage(base64Str, maxWidth, maxHeight) {
    return new Promise((resolve) => {
        let img = new Image()
        img.src = base64Str
        img.onload = () => {
            let canvas = document.createElement('canvas')
            const MAX_WIDTH = maxWidth
            const MAX_HEIGHT = maxHeight
            let width = img.width
            let height = img.height

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL())
        }
    })
}


export function base64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export function showLoading(show: boolean = false) {
    if (show) {
        document.getElementById("me-loading-box").style.display = "block"
    } else {
        document.getElementById("me-loading-box").style.display = "none"
    }
}

export function utf8Convert(str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

export const timeUnits = {
    'Y': 1000 * 60 * 60 * 24 * 365,
    'M': 1000 * 60 * 60 * 24 * 30,
    'D': 1000 * 60 * 60 * 24,
    'H': 1000 * 60 * 60,
    'm': 1000 * 60,
    's': 1000,
    'S': 1
}

export function groupArray(data: any, objectName: string) {
    let result: any;
    result = data.reduce((r, a) => {
        r[a[objectName]] = [...r[a[objectName]] || [], a];
        return r;
    }, {});

    return result;
}

export function statusTxt(status: string) {
    let obj = {};
    if (status === "WAIT") {
        return {
            name: 'รอการตรวจสอบ',
            color: 'secondary'
        }
    } else if (status === "DONE") {
        return {
            name: 'สำเร็จ',
            color: 'success'
        }
    } else if (status === "PROCESS") {
        return {
            name: 'กำลังดำเนินการ',
            color: 'warning'
        }
    } else if (status === "CANCEL") {
        return {
            name: 'ยกเลิก',
            color: 'danger'
        }
    } else {
        return false;
    }
    // return (status === 'WAIT') ? 'รอการตรวจสอบ' : (status === 'DONE') ? 'สำเร็จ' : (status === "PROCESS") ? 'กำลังดำเนินการ' : (status === "CANCEL") ? 'ยกเลิก' : '';
}

export function diffDate(getDate: Date) {
    let expDateWarning = new Date(getDate).getTime();
    var now = new Date().getTime();
    var diff = expDateWarning - now;
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);
    // expDate = days + "วัน " + hours + "ชั่วโมง " + mins + "นาที " + secs + "วินาที ";
    return {
        'day': days,
        'hour': hours,
        'min': mins,
        'sec': secs
    };

}

export function minimumPayment(principle: number = 0, interest: number = 0, fee: number = 0, mode: string = "minimumPayment") {
    if (mode === "minimumPayment") {
        return principle + fee + (interest * 0.2);
    } else {
        return principle + interest + fee;
    }
}

export function discountRate(totalDebt: number = 0, minimumPayment: number = 0) {
    return (totalDebt - minimumPayment) / totalDebt;
}