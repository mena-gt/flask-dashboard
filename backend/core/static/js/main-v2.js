(function () {
    var settings = {
        debug: false
    };

    function extend (defaults, options) {
        Object.keys (options).forEach (function (property) {
            if (defaults.hasOwnProperty (property)) {
                defaults[property] = options[property];
            }
        });

        return defaults;
    }

    function searchById (settings, id) {
        var element = document.getElementById (id);
        if (settings && settings.debug && !element) {
            console.error ('Element not found!');
            console.error ('The ' + id + ' element does not exist.');
        }

        return element;
    }

    function wait (miliseconds) {
        return new Promise (function (resolve, reject) {
            setTimeout (function () {
                resolve (true);
            }, miliseconds);
        })
    }

    function monthNumber (index) {
        var months = ['01', '02', '03', '04', '05', '06',
            '07', '08', '09', '10', '11', '12'];
        // ToDo: validate index range
        return months[index];
    }

    function monthName (index) {
        var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre',
            'Diciembre'];
        // ToDo: validate index range
        return months[index];
    }

    function isHourInRange (start, end, hour) {
        return hour >= start && hour <= end;
    }

    function writeLocaleTextContent (element, value, options, postfix) {
        element.textContent = value.toLocaleString (
            "es-ES", options) + ' ' + postfix;
    }

    function isLastDay (status) {
        return status.dayLimit === status.day && 
            status.hourLimit === status.hour;
    }

    function isLastHour (status) {
        return status.hourLimit === status.hour;
    }

    function nextHour (status, step=1) {
        status.hour += step;
    }

    function updateStatus (status) {
        if (isLastDay (status)) {
            status.day = 0;
            status.hour = 0;
        }
        else if (isLastHour (status)) {
            status.day += 1;
            status.hour = 0;
        }
    }

    function setDateFilterArea (parentArea, dateInst) {
        var currentDate = parentArea.children[0];
        if (currentDate) {
            currentDate.textContent = '' + dateInst.getDate () + ' - ' +
                monthNumber (dateInst.getMonth ()) + ' - ' + 
                dateInst.getFullYear (); 
        }
    }

    function setTimeFilterArea (parentArea, hour, minute) {
        var currentTime = parentArea.children[1];
        if (currentTime) {
            var stringHour = (hour < 10) ? '0' + hour : '' + hour;
            var stringMin = (minute < 10) ? '0' + minute : '' + minute;
            currentTime.textContent = stringHour + ':' + stringMin; 
        }
    }

    function setDateStatsArea (parentArea, dateInst, hour) {
        var currentDate = parentArea.children[0].children[2];
        if (currentDate) {
            var stringHour = (hour < 10) ? '0' + hour : hour
            currentDate.textContent = dateInst.getDate () + ' ' +
                monthName (dateInst.getMonth ()) + ' ' + 
                dateInst.getFullYear () + ', ' + stringHour + ':00 hrs';
        }
    }

    function setConsumo (parentArea, value) {
        var targetElement = parentArea.children[1].children[2];
        if (targetElement) {
            var toNumber = new Number (value);
            writeLocaleTextContent (
                targetElement, 
                toNumber, 
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setGenerado (parentArea, value) {
        var targetElement = parentArea.children[2].children[2];
        if (targetElement) {
            var toNumber = new Number (value);
            writeLocaleTextContent (
                targetElement, 
                toNumber, 
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setAutoconsumo (parentArea, value) {
        var targetElement = parentArea.children[3].children[2];
        if (targetElement) {
            var toNumber = new Number (value);
            writeLocaleTextContent (
                targetElement, 
                toNumber,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setCoste (parentArea, value) {
        var targetElement = parentArea.children[0].children[0].children[2];
        if (targetElement) {
            var toNumber = new Number (value);
            writeLocaleTextContent (
                targetElement, 
                toNumber,
                { style: 'currency', maximumFractionDigits: 2, currency: 'EUR' },
                ''
            );
        }
    }

    function setAhorro (parentArea, value) {
        var targetElement = parentArea.children[1].children[0].children[2];
        if (targetElement) {
            var toNumber = new Number (value);
            writeLocaleTextContent (
                targetElement, 
                toNumber,
                { style: 'currency', maximumFractionDigits: 2, currency: 'EUR' },
                ''
            );
        }
    }

    function setCO2 (parentArea, value) {
        var targetElement = parentArea.children[2].children[0]
            .children[0].children[0];
        if (targetElement) {
            var toNumber = new Number (value);
            writeLocaleTextContent (
                targetElement, 
                toNumber,
                { style: 'decimal', maximumFractionDigits: 2 },
                ''
            );
        }
    }

    function cleanAdviceArea (parentArea) {
        while (parentArea.lastElementChild) {
            parentArea.removeChild (parentArea.lastElementChild);
        }
    }

    function getColorByLevel (levelName) {
        if ('verde' === levelName) return 'bg-custom-green';
        else if ('naranja' === levelName) return 'bg-custom-yellow';
        else return 'bg-custom-red';
    }

    function getLevelByColor (colorName) {
        if ('verde' === colorName) return 'NORMAL';
        if ('naranja' === colorName) return 'MEDIO';
        return 'ALTO';
    }

    function buildAdvice (message, level) {
        var wrapper = document.createElement ('div');
        wrapper.classList.add ('flex', 'flex-cols', 'py-5', 
            'justify-between');

        var firstColumn = document.createElement ('div');
        wrapper.appendChild (firstColumn);

        var messageElement = document.createElement ('p');
        messageElement.classList.add ('text-sm', 'font-bold');
        messageElement.innerHTML = message;
        firstColumn.appendChild (messageElement);

        var secondColumn = document.createElement ('div');
        wrapper.appendChild (secondColumn);

        var tagElement = document.createElement ('span');
        tagElement.classList.add ('inline-flex', 'items-center', 'px-2.5', 
            'py-0.5', 'rounded-full', 'text-xs', 'font-medium', 
            getColorByLevel (level), 'text-white');
        tagElement.textContent = getLevelByColor (level);
        secondColumn.appendChild (tagElement);

        return wrapper;
    }

    function setAdvice (parentArea, advices, hour, minute) {
        var stringHour = (hour < 10) ? '0' + hour : hour + '' ;
        var stringMin = (minute < 10) ? '0' + minute : minute + ''
        var currentTime = stringHour + ':' + stringMin;
        var isEmpty = false;

        advices.forEach (function (advice, index) {
            if (!advice.hasOwnProperty ('inst')) {
                advice['inst'] = null;
                if (!isEmpty) {
                    cleanAdviceArea (parentArea);
                    isEmpty = !isEmpty;
                }
            }

            var isInRange = isHourInRange (
                advice.start, 
                advice.end, 
                currentTime
            );

            if (isInRange && null === advice.inst) {
                advice.inst = buildAdvice (advice.message, advice.level);
                parentArea.appendChild (advice.inst);
            }
            else if (!isInRange && null !== advice.inst) {
                advice.inst.parentElement.removeChild (advice.inst);
                advices.splice (index, 1);
            }

        });
    }

    // seccion de tiempo real

    function setGeneracionTotal (parentArea, value) {
        var targetElement = parentArea.children[0];
        var toNumber = new Number (value);
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                toNumber,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setConsumoTotal (parentArea, value) {
        var upArrowIcon = parentArea.children[0];
        var downArrowIcon = parentArea.children[1];
        var targetElement = parentArea.children[2];

        var toNumber = new Number (value);
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                toNumber,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }

        if (toNumber > 0) {
            upArrowIcon.classList.remove ('hidden');
            downArrowIcon.classList.add ('hidden');
            return;
        }

        upArrowIcon.classList.add ('hidden');
        downArrowIcon.classList.remove ('hidden');
    }

    function setTotalElectrodomesticos (parentArea, value) {
        var targetElement = parentArea.children[0];
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                value,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setConsumoFrigorifico (parentArea, value) {
        var targetElement = parentArea.children[0];
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                value,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setConsumoLavadora (parentArea, value) {
        var targetElement = parentArea.children[0];
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                value,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setConsumoVitroceramica (parentArea, value) {
        var targetElement = parentArea.children[0];
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                value,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function setConsumoTermoElectrico (parentArea, value) {
        var targetElement = parentArea.children[0];
        if (targetElement) {
            writeLocaleTextContent (
                targetElement,
                value,
                { style: 'decimal', maximumFractionDigits: 0 },
                'W'
            );
        }
    }

    function buildFrigorificoIcon () {
        var svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
        svg.setAttributeNS (null, 'width', '36');
        svg.setAttributeNS (null, 'height', '36');
        svg.setAttributeNS (null, 'viewBox', '0 0 36 36');
        svg.setAttributeNS (null, 'fill', 'none');

        svg.innerHTML = `
            <rect width="36" height="36" fill="url(#pattern10)"/>
            <defs>
                <pattern id="pattern10" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_304_24" transform="scale(0.00195312)"/>
                </pattern>
                <image id="image0_304_24" width="512" height="512" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZiwgMjAyMS8xMS8xNC0xMjozMDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yMFQyMzowNzowOCswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDctMjBUMjM6MTA6MzgrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDctMjBUMjM6MTA6MzgrMDI6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE1ZTNkNDVkLTYwZjktNGM0My1hZmE2LWEyMTRjNWQ2YTM0NiIgeG1wTU06RG9jdW1lbnRJRD0i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"/>
            </defs>
        `;

        return svg;
    }

    function buildLavadoraIcon () {
        var svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
        svg.setAttributeNS (null, 'width', '38');
        svg.setAttributeNS (null, 'height', '38');
        svg.setAttributeNS (null, 'viewBox', '0 0 38 38');
        svg.setAttributeNS (null, 'fill', 'none');

        svg.innerHTML = `
            <rect width="38" height="38" fill="url(#pattern20)"/>
            <defs>
                <pattern id="pattern20" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_304_25" transform="scale(0.00195312)"/>
                </pattern>
                <image id="image0_304_25" width="512" height="512" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZiwgMjAyMS8xMS8xNC0xMjozMDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yMFQyMzowNzowNiswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDctMjBUMjM6MTE6NTQrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDctMjBUMjM6MTE6NTQrMDI6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyNzk3NmE4LTllYmUtYTI0OS05MTU3LTljZjU1M2NmYjkwMCIgeG1wTU06RG9jdW1lbnRJRD0i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"/>
            </defs>
        `;

        return svg;
    }

    function buildVitroceramicaIcon () {
        var svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
        svg.setAttributeNS (null, 'width', '34');
        svg.setAttributeNS (null, 'height', '34');
        svg.setAttributeNS (null, 'viewBox', '0 0 34 34');
        svg.setAttributeNS (null, 'fill', 'none');

        svg.innerHTML = `
            <rect width="34" height="34" transform="matrix(1 0 0 -1 0 34)" fill="url(#pattern30)"/>
            <defs>
                <pattern id="pattern30" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_304_26" transform="scale(0.00195312)"/>
                </pattern>
                <image id="image0_304_26" width="512" height="512" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZiwgMjAyMS8xMS8xNC0xMjozMDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yMFQyMzowNzoxNCswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDctMjBUMjM6MTE6MjErMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDctMjBUMjM6MTE6MjErMDI6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmE2YTJmNjljLWFiY2ItNDE0Yy1iZTZhLTAwNTcyNGJhNGVjMCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmZkYzkwYjUxLWE2Y2UtZDE0NC04MjM4LTM0NWM0MzE3NWQzNSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmQ2NWJiZGNmLTI4MjItOGI0YS04NzNiLTEyNDk4MTI0YmE2NiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDY1YmJkY2YtMjgyMi04YjRhLTg3M2ItMTI0OTgxMjRiYTY2IiBzdEV2dDp3aGVuPSIyMDIyLTA3LTIwVDIzOjA3OjE0KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE2YTJmNjljLWFiY2ItNDE0Yy1iZTZhLTAwNTcyNGJhNGVjMCIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0yMFQyMzoxMToyMSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv8I7V8AACK6SURBVHic7d1ZeivJjQbQUH+1Tffi2gulH6rpy6I4ZTIGAHHOa9liTED8TOmSP5fLpa3yv//618yXWzdRqvgZ9HOdTYhlVK3/8n///vesl/rlr2WvPJ6mSm/XM9WzOTinEM9tXU4LA7NVDAAaKqNdWp+m4KxCfGXDQKUAoJmSifMK+Yx4CrjM/6weQAeXppkynzMH+ypx72QOACU2AIC0Ut9BWQNA6kVne84v1JH2zWi2AJB2oQEoLd3dlCkApFtcALaS6p7KEgBSLSq8UeIviIGH0txXGQJAmsUEgJbk3ooeAFIsIlvyLh54Jfz9FTkAhF88+IIAAfWFvsciBwCIqtflLQRAfWFDQNQAEHbB2NpP639pCwFQX8g7LeJ3AaxcKM2YFZw7mCfkZbxCxAAwmmYLsK9nd8DoYNDrW0S7iRYARm5AqIUHIJTbO2KLpwRR/wagpxG/twWgrlF3RqhgESkAjFgYFz8AZ5R/8xgpAPRUfuMAmKL3XRLmKUCUANBzQVz8APRU8l6JEgB6KblJACzX834J8RQgQgAIsRAA8EapN5kRAkAvpTYGgJDK3DVVAkCZDQFgC8ufflcJAAAwS4k3nasDQI8EVGIjAGCm1QEAADJK/+YzewBIvwEAbGvp3wFkDwAAwAkCAACck/optAAAABsSAABgQwIAAGzor9UDIK1v/3o19e/OoKNvakkdcZoAwCsj/4nKq5+tqVHNqFp693PVEk8JAFwt/1zqG4/GopGRReRaUkf8lwCwt0iN6h2NjKjUESkJAHvJ1KjeuZ2LJsZsVWpJHW1MANhDlWb1jCbGDOqIUgSAuqo3q2eu89bA6GXHWhIGNiAA1LNjs3pEEOAb6ugPtVSUAFCHhvWY5sUR6ug5tVSMAJCfhvUZzYtX1NHn1FIRAkBeGtY5mhe31NF5aik5ASAfDasPzQu11IdaSkoAyEOzGkPz2o9aGuPS1FEqvg0wBw1rPGu8B/s81qVZ4zQ8AYhNIc3laUBdamkuTwMS8AQgLg1rHWtfi/1cw9OA4ASAmBTNevYgPxdQDPYgKL8CiCVqoTx6lPftWEf8zN78SiCvaGfpaudaUkfBCABxRCrYVYV6/7pR1kTzyiXKuWlNLd0SqIMRAGKIUJwRi/J2TKvXSAiIb/UZaS3uGVFL/CIArLeyGDMVYYQGpnHFpY4+p5ZorQkAq60ovgpFt7KBeYwZz6pLrMIZuM5hxRoKAYsJAOvMLriqhbaqgWleMQjRfawK1epoIQFgPhf/GCuCgOa1lloaY3YtqaNFfA7AXDMb1k/bs6hmz3v1H1TtSi2Np46KEwDq2bVZ3Zu5DprXXLPWWy2po9IEgHlmHO7dm9UjmlctMy9//pgVBNTRRALAHKMPtXcqr1mfGmaFaGflOSGgEAFgvBmXP58ZvVYa1zieoD22YswzQpJamkAAGKvy5f/Na2cd9yc0rny86z9HLSUnAIwz8vBqWN8ZvX4aV1+ja2m1s2PIPPZPqaWBBIAxqjesqzNjyT7+T2lcfailPv/7kbwhSUoAyCVikR0p/qjjH0UI+M6o9Yt6YWWuo9bGjUsdDSIA9DeyaUX2rKn+vPhvUUQe267U0bH/FoUQkIiPAu5r16Z1K9NYb/20MfvnY07jyLQPmcZ6Ty0l4QlAPy7//Lx7iWHEeqmjuax3AgJAbIpoPmu+lsu/jhHrLkx3JAD0oWnVonHVoY7WUkuBCQDfc/nXpHHN13t91FEM9iEoASAexRKHvZhHOKqtdy05Lx0IAN/xjqU+jSsntRSPWgpGAIhDw4pL4xpLkIYFBIDzNPG9uFRysE+xCdOBCADneMfCtzSuv/VcB3WUg30KQgBYTzHkYa+gj561JEyf5KOAj/OO5Y+za5F53j0/5nT3jzZVS3/sWEssJgBwRM+L75YmxjeynZ+ewSdzLQnTiwkAx+z4jmXG47Xb18iwLhrX93Z8bKuWfhv1xUF8QABYI0NhrirK6+tGXyONK4bo52TlGclSS73sGqZP80eA3Lu0GBdblHHMsMs8r3rNN3Kzj3R+I43lkcj7WJoA8LnqTStqk4g6rtbi7iVrRT2vkWupl+rz60oAoLUcRbND89pB5SCd5YxGHGPE/SxPAPhM1aaVpWHdijbeXnsabV4ck23/ItZ+tP5YngCwr2jFf0TmsfO9SBdFxIv0iMxjf6binIYQAOaJ1rSyizSHSHsbWaQ966HKfCLNQy1NJAC8F6k4eqg0n0pzaa3efEaIckFU26tq8+EDAsAcmtY4UeYUZY8ZL8qZ663SvCrNZRgBYB+VC6LS3CrN5VaVeVWZxzMR5idMTyIAvNajGCIc5ghFPVqEOUbY68qs7xwRaokJBID6dirmnebKfDudr9Vz7RH2Vs8hPAGgth0LYMc5R1fhSZpzRTm+DOi5Ck1rlk/nuUMT7fElQb7UJJaZ5zZSLTmHxQkAdY1uEGcaw+3/Z+T4NC4yUUuPCdODCQAc1auYrj9nVPNS+HWs3MeRl2uWWqIofwMwTrWm9dPGzGnUz12p2ny+4VL6bWQtjWAPixIA6hl1+Y824jUyN67MY68iYy1VC9SV5hKOAPCY5vvHzAJU7FQ1+2Lu/Vp6YkECQC29i3TFhaxxcWtVKOx5blb+ER16wFMCwBgVCm/lHKwfVaw+Bz1f30VajADAI6ubVmsxxsB3sl4YWcf9TPZayj7+sASAOno1rUjF1mss1Ro6OUSqJfhFAIC4BJe8ol3+wjS/CAC/7XzAozWt1mKOiTlW7H3l+ldL/IMAwC5WNHYNd0/2nRR8FPAYn142kR7LRW5aPT4TvKdIY6nsyDpHPr+RRKqlmePw0eAPCABr3RaAwxlblKbJY9f9WV1Hq19/hm8vU7UUhF8BxLGyKDI0rWrfrcAYl2a/IrM3gQgAsSiOeOxJTmf2zV6PZX2DEQDiUSRx2Asq8q8raK0JAEBdsy+dDL9Kg/8SAAAYybv/oAQAdqIRzWOtITgBgEw8YgXoRAAgE+8q8xDWIDgBgJ24lAD+nwAA0IcnVI8J3kEJAPEoljjsRW72D14QAICKzlz+uwQG34xJa00AiGZVkXh0+ZzGlY89i8m+BCMAxPDTFMc7q78syf7ksHqfhOnXVu8PN3wdcH8OeF1n9taFcJ5a6q/Hefx2X1bUkbP0gCcA/WX9/VrkiypC0zoj8poCmxMAAP6oHKajjotFBIDfdn5UFLFBRBwTc2Te+8xjZxMCQB29govGFcfOYZS+etW1M1mIAEBkmhYrVAvTUcZxVvbxhyUAjJH9wEYYf4Qx8B3Bq9Y5tp/FCAC19CzQlY2r52v7cCVWq1JLWQkuTwgAvLKieWhY3Fp1HnpfGmqJcASAxzInxsyNq/drZd5H6plVS5cBr+VJWkECwDiVDu6IhjLz52ckvKw3Yg9m1BJ8RACoadTl0bt5jWyGKy9QTfgPQeax3mekai0xkO8C4IxroznbGFyQHHFp6y6hnzbuvN7+3Ki1lP3yzz7+oQSA53oUftXGdXX/85/NdfaFr+jpaXYtvTq/O4Xnnea6hABQ24zGdStCwa6+/LN+cRFxRKij1pzD8vwNADBahS/Y2e0y3G2+WxIAxtO45lk919V7zVirz9dOPEmbQAB4rcoBqjKPV6rMsco8RogQsHbYnx3mSBMAdlK5qCvPrYpKe1RpLvcizC1C0NuCADBHlAMdobh7izKnKHtcXZR1jnLueqo0p0pzGUYAeK/aQao0n0pzaa3efKqrtF9R5hIl4G1BAJgn0sGOUuzfiDSHSHsbWaQ96yX7nH5a/jlwkgDwmYoFkrXws46bfqIFrqznMdq4e+1rtHmFJQDMFa1xtZarWCKOVdM6ptc8o9VStmCaaawM4pMAae1PM4jWVK80K7KY/embR0WtJUF6AU8APlf1ncutiMUTcUxXmtZaUWsp4tOAiGNiMQFgjaiNq7U4jSLKOJ6JvIfRRd7XniKc4QhjeEctLeJXAMdEf7zX023TmDXn6I1qhNlzfreX2fZg5TdufmrFr9iir8lVzzXJMucwBIB1MjSuq5FhIMsa3MoYAj8d86xz2TNMZ6ml+zGqJZYSAI7bsXHdejTeT9cj21xHm7UeR89rxnOZ0e615N3/YgIAPexUfBnf/Z8xIwTsHqYfqTAHkvBHgOf0LNJdLpQKMr5j2el87TTX7DLWUjkCQAwaV3w77tGMOWve+9mxlkISAM7r3bgUxT5ceuOoo9j84WMgAgC851IZS5jeg8s/GAHgOxpXfZrWHGoJJhMAvqdx1eXyz00txaGWAhIAYtK41rMH841o6vZxPZd/UAJAHxpXLSPWXtP6jFqqxdoHJgD0o3HV4PKvSS3Np5aCEwDi07jmsdYxjGry9ncel38CPgq4r1HfFpjlY06fzT3z2L+VYe4R7VxLr+YdfeytCVppeALQ347vXi7t9fje/ffVXP57yXwWI9fSyLGppQEEgDF2CgFHxpR9/Mw1sulH3PfMtTRyPC7/QQSAfCK9Azgzjkhj17Ti2yUERBrLUeooKQFgnNEHN3PDWG302mlafY0OAatr6ezrrx53ay7/1ASAsSqHgG9eO+u4P6FpjVG5ljKKEJz4kgAw3ozGpRDfm7FOLv+x1NJvK8bra6KLEADmmHGYszWumTSsOtTSOrMCklqaRACYZ1bj0rz+0LA4Sy3906y1UEsTCQBzzTrcuzevmfPXsOabueZqSS2VJQDMp3mNM3u+GtY6s9d+pzpqTS1twUcBrzHqY06fub5W1SJb0ZyrrmUm1z2Ytf+3r1N1/9XSRjwBWGfFoa/2RGDVfDSsWNTS99TShjwBWGv2k4CrzO9kVjfdbOu1i9W1lPFcqKXNCQDrrWpcVxnCwOpGdRV1ffjbylrKUEetxailyOuzFQEghtm/y3wmUhNbvRb3Vq8Hn1kdqNuD1195dlavxT11FIgAEEuE5nX1aBw7fcvhlYaVT6Q6ak0tXamlYASAeKI1r1s9xxV1jrc0rLyiPFV7Ri2xnH8FENNPUzCrWf8a7ONaellgAkBsCmc+Dasee7qGNQ9OAIhPEc1jrWuzv3MIXEn4G4Acov8+MzvNah9qaSy1lIgAkIvm1Zdmta/If2ybkVpKyK8AclJs37OGeFT9PWuYmCcAeXkacI5mxT21dJw6KkAAyE/z+oyGxTtq6T11VIgAUMdtYWpgf2hYHCUI/KaOChIAatq9gWlW9CBUq6XSBIDadgsCmhWj7FRL6mgTAsAeKr+T0ayYqWotqaMNCQD7uS/0bE1MoyKK7GFALW1OACB6INCkyCB6HbWmlrgjAHDvUZOY1cw0KKpYWUfPXh/+QQDgE0ebybXRaULwx5l6uJz8/8FbAgAjaFjQh1piGN8FAAAbEgAAYEMCAABsSAAAgA0JAACwIQEAADYkAADAhgQAANiQAAAAGxIAAGBDAgAAbEgAAIANCQAAsCEBAAA2JAAAwIYEAADYkAAAABsSAABgQ3+tHgBMcFk9gMR2Xbuf1QOA0TwBoLpdLzC+c2nODsUJAFSlgdODM0RZAgDAa0IAJQkAVKRhA7whAAC8J1RSjgAAABsSAKjGOzWADwgAVOPfbwN8QAAAgA0JAACwIQEA4D2/WqIcAYCKNGuANwQAqhIC6MVZoiQBgMo0br7lDFGWrwOmumsD9/kAHOHipzwBgF3s2tC/DT67rhuU51cAALAhAQAANiQAAMCGBAAA2JAAAAAbEgAAYEMCAABsSAAAgA0JAACwIQEAADYkAADAhgQAANiQAAAAGxIAAGBDAgAAbEgAAIANCQAAsCEBAAA2JAAAwIYEAADYkAAAABv6a/UASO9y8H//M2QUkJ9aYioBgHeONqVvf56mRkW96+iTn6mWeEkA4NaIJnXUozFoZGQSoY5aU0u8kTkAOMjfi9Ko3rkfp70nGrVEOpkDAOdkaVSv3M5BA2OFCnXUmlramgCwhyrN6hENjJnUEmUIAHVVblTPaGCMsHMtqaPCVgeAn3auuBzK53ZsVo9oYHxLLQnVpa0OAK0dDwEO4WOa1WOCAEeppcfUUjERAkBrn4cAB+83zeozmhfvqKXPqKUiogSA1v4cJv929TOa1TmaF/fU0jlqKblIAeDKYXpNs+pD80It9XFp6iglXwaUi4bVnzXdz6XZ996saUIRnwDwm8Iay9OAfailsdRSIp4AxKdhzeNdTF32di5rnYAAEJeGtY51r8V+rqGHBScAxKRo1rMH+bmAYrAHQfkbgHiiFsv97/S+HWfvnzeC32fmFfE8tfb4LO1SS+ooGAEgjmhFO7tYRzTGXjSvXKKcm9bWnJuogUAdBSMAxBChQCMW5u2YVq+R5pXD6nPSWrxzEikQeKoWiACw3spizFSEEcKAEBDX6os/07lQS7TWBIDVVhVf9sJ79bHRo2lc8aij89TSxgSAdWYXXMVCW/VORuOKY8XFVXHvVwUBtbSQfwa4xswi+2l7FNjsea5+5MyaEF29llbMUS0tIgDMN/vy383MBubfma8jRI8lUG8g2q8AXh2CCgU465BXWKtv/TRNpSp1NM/MXw34dcBkUZ4AfPJOKvu7rRlj3/Gdyiuz1iPzuczG5b+GWiooQgA4uuEZD8isy5/HNK4ahOj11FIhEQJAdaMPs4b1mRnrpHHllrGOVn3SoFoqYHUAOLvJWQ7HjMt/lW9eO+u4P5HlbGYzcl2F6HPUUnKrA0BlGlZco9dP4+prdC2tdnYMmcf+KbU0kAAwRvWGdXVmLNnH/ymNqw+1FJ83JEllDgA7NtiIRXZkTNnHz1y7XP5Xn44p6oU7akw79vopMgeAqEYd1ogFf/WuIUVtWFcaVzy7Xf5Xr2oleh21ppZSifZBQNntePnfyjLOR0Z9cJAPN4kj0z5kGus9tZSEJwD97H75V+DdSwwj1ksdzWW9ExAAYlNE81nztVz+dYxYd2G6IwGgD02rFo2rDnW0lloKTAD4nsu/Jo1rPutTk34WlAAQj2KJw17MI0jX1nsvhMUOBIDv9D6EGlY8OzeuzOcx89irsifBCABxKI64Mu9NhrEL0pyRKUyHJACc5/Bx1uyzk/0jm4/IOu5d7PxELRwBIAZNK77sjSvqRzb3XAd1lIN9CkIAOEfT2lP2vXo3/gwfNUsNPc+ZpwAn+SjgtSo026PFl33OPT/mdMVHm0Zaf0H6jzNrkX3OLCYAHLdz2uwx90c/QyPjGxnPz4hayrYO2cN0egLAOlkO64zAc/saGdZF4/rejkF69Jyz1VFr4744iA8IAMf0OqgZinNVUV5fN/oaaVwxRD8nra05JxnDwLd2DdOnCQDci3KpZQkCHBfljI0WZZ7Ra0mYXsS/Avhc9Xf/lxazCKOOq7V+exl1ftGppWMijqm3HebYjQBAazmKJsMYea9ykI568d+KOsaI+1meAPCZqk0rajN4JuJ4PQWgtXz7l228DCAA7CtzA8g8dr4XMUhnFC1QC9OTCQDzRGpaFQok0hwi7W1kkfaslwpzqjAHThAA3qtWHJXmU2kurdWbzwhRwla0d8/fijKXKPu7BQFgjiiHOkqR9xRlTlH2mPGinLneKs2r0lyGEQD2UbkgKs+tCnuUQ4R9EqYnEQBei1AMPVSZxysR5tijcUWYR1QRLoYd9meHOdIEgBlWN62dinmnuTKf8zWPMD2BAEA1ij6eHnsiSM+123y35LsAntO0jnk3110aSo/PNfelJrFEqqPW5o3HOSxOAKhrdJM42hju//cjx6dxkck3tTTjK4ZX1ZIvCRrMrwA46qf1aQi9fs4zGkcdK8PcyHPUowZG11F2+sALAsA4FZvWiDlVbGDV5vMNDfi3EWd+ZB3Zw6IEAD4x45Ie8fMzN67MY69ixB7MqKNKAbTSXMIRAB7L3Hx7j31mASp2KstcS5l7Ik8IALyy4kLWuLi1KhRmDtIrXzMiPeAJAWCMCk1rZfOo0LgqzIE+qtSSi7QYAYBHIlxeEcbAd7JeGFWC9FWEMRCQAFBHr6YVqVn0GkvWi4jcItVSZtZxEAEA4hJc8op2aQnT/CIA/LbzAY/WtFqLOSbmWLH3letfLfEPAgCMo+Huyb6Tgu8CGOOTdxHR/jo3ctOK+AU7ld8pRvHpGkc+u7ynlhYRANa5P/SaWGyaVFy3e7O6jla//jsRwvSKWvIFYQ/4FUAcLpjXKn63Av1dmv2KzN4EIgDEsqo4JOPnNKyczuybvR7L+gYjAMSjSICR/OsKWmsCALyiaeU2e/88SSMVAQCAkQTpoAQAdqIRzWOtITgBgEw8YgXoRAAgE+8qAToRANiJJwjzWGsITgAAYCRhMCgBIB7FEoe9yG32/vkVFakIAEBFZy7/XQLfiqCyy9qmIgDEsqpIvHN5TuOCPtRSMAJADD9NcbyzMqTYnzxW75Uw/Zo6CsTXAffngNd1Zm9dCOeppf56nMdv92VFHTlLD3gC0F/W369FvqgiNC2AUgQAGCdyqGKcqPsedVwsIgD8tvM7xYgNIuKYmCPr0zRIQQCAuFxGeUULrr3G40wWIgDU0aswIzUuTYvMotRSlHGclX38YQkAPBKh4CKMge9kDV49x+0cE5YAMMaqoq/SuCo0zQpzoI8qtZQ10PGEAMArKxpX79fUtHKrEKZbq1FLWekBTwgAj2U+MJkbl4ZFZbPO92XAa/mY8oIEAD4xoqHM+PmCHN8YsQejLzQXJh8TAMZZ/dn1I4yY06h18nnwMQgyv40IvCNDuj0syncBcNRtkznbGFyQHHFp6y6hnzbuvF5/7jdzG11L2S//7OMfSgB4bmThzzBj/EfCwMy1VPRkcl8bkWpppV3muYwAMNbKdy6tzQ0xivVvvriontlvBqLUknNYnL8BoBpNK54K31a527nabb5bEgDG07jm2WmuzOd8zeNJ2gQCwGtVDlCVebwSYY6a1lirw3Rre+zPDnOkCQA7qVzUledWRaU9qjSXexHmFiHobUEAmCPKgY5Q3L1FmVOUPWaOKOeup0pzqjSXYQSA96odpErzqTSX1urNZ4RIQavSfkWZS6T9LU8AmCfSwY5S7N+INIdIextZpD3rpcKcKsyBEwSAfWUu+sxj53vRAlfW8/jTYo29175GmlNoAsBneh2oiI0rU7FEHK+mRWv59i/beBlAAKC1HM0gwxh5r2qYbi1mQL0XdYyC9AICwOcqN67W4jaGqONqTdNaTS0dE3FMLCQArBG1cbUWp3lFGQf97bKvUc5wlHE8E7kflubLgI7J/g2BR9w2DN/k99su5yC61V+49Ynr+NTRWDvO+SsCwDoZGtfV6DCQZR2ueq5Btrn3slOYvlJHv+12BkIRAI7bsXHdum8yR9ciY5Mitkxh+urReI/UUrb5PiJILyYArJWxcd3LPv6jNK1+eoZptQQH+SPAc3oW6s5PE7KxV7HZnzwE6QAEgBg0rvh675Gm9TfrsB/9LggB4DyNi7OcnXFcLrEJ0oEIAHFoXHHZm7F6N3H7FZPLPxgB4DsaV32aVk5qCd4QAL4nBNRlL+YZEYzsXxyCdEACQEwa13o+qGU+IaAmexCUANCHxlWLyx/6UEuBCQD9CAE1WPO11FEdLv/gBID4NK95Rq21pnXMqBCgluZx+Sfgo4D7GvU9AVk+5vTZ3DOP/VsZ5h6RWnos89gJxhOA/kYVaOSievfuKvq7L5f/XqKfRbX0m1oaQADIJWLhHxlT9vEz18imH3HfM9fSyGDi8h9EABhjdOOKUvxnxhFl7K2NHYum1ccuISDSWI5SR0kJAOOMPriZG8Zqo0OUptVX9RBwdgyZx04AAsBYlUPAN6+dddyfcPmPsctTtUzUUnICwHgzQoDm9d6MddKwcstYRyvGrJaKEADmmHGYMzavWWasjYY13qw6UkuPzVobtTSJADCP5jWfhlXPrLVWR/80az3U0kQCwFwzm9fODWzm/DWs+dTRPGqpMAFgvpmHfMcGNnO+GtY66mis2XNWSwv4KOA1Rn3M6TPX16paZCuac9W1zEQd9aeWNiIArDO7ebVWr4GteldWZf0qWFlH19evQC1tSABYa0Xzai1/EFj5ODbrmlV23RO1dMzqX2tkXLNSBID1VoWA1nK9k1ndrFqLv0a7U0vvRaij1mKv0TYEgBhWNq6r+9dfXaCr1+Pe6vXgM2rpt9XrcWv1WnBDAIhj5WPMR2Y3sSjzvqdh5RMhBNyaWUuR5n1PLQUjAMQTrXld9R5TxDne07Dyihaob6klQvA5ADEplvXsQQ32ca2fZg/CEgDiUjhrWPd67Oca1j04ASA+RTSPta5LsJvHWichAOSgoMayvvuwz2NZ30T8EWAukf+wKSsNaz/qqD91lJAAkFPUfymQiYaFIPA9dZSYAJCX5nWOhsU9tXSOWkpOAMhP8/qMZsU7aukzaqkIAaAOzesxzYqj1NJv6qggAaCe20LduYFpWHxLEFBHpQkAte3WwDQrRtgxVKulDQgAe6jcwDQqZlJLlCEA7KdCA9OoiCB7LamjzQkAe7tvAFGbmEZFdGqJdAQAbj1qDrMbmQZFBWqJ8AQA3vmkiXza2DQkdqaWCEUAoAfNCPpQS0zj2wABYEMCAABsSAAAgA0JAACwIQEAADYkAADAhgQAANiQAAAAGxIAAGBDAgAAbEgAAIANCQAAsCEBAAA2JAAAwIYEAADYkAAAABsSAABgQwIAAGxIAACADQkAALAhAQAANiQAAMCGBAAA2NBfqwcAwEuXF//tZ9ooKMcTAICYLu315d8++O/wlAAAEM+Ri10I4BQBACCWMxe6EMBhAgBADUIAhwgAAHG4xJlGAACADQkAALAhAQAANiQAAMCGBAAA2JCPAmZ3K/7qOvPHt1qvY2avV4Z/RZB5P0sRAGqK9NnhkcZytbpJ3r5+hmZovY5bvWaRZdzPkvwKoJZPPzt8RnOKNJb714wk2njuRRtftPHcW3GmM7NWCwkAdRwtpJGFF2ksK17nKOM6xrhqsW6LCAA1nC2gEYUXaSwzfz5z2c9a7OcCAgA9C08Rnxdt7aKNJzrrRToCQH6VGk+luQDHqP/JBAB2oLEA3BEAaK3PBemSBUhEAGAH/q0xwB0BAAA2JADQmnfIwHr60GQCAL0o3u9EW79o47kXbXzRxgNvCQDsQoNmNGfsPGu3gACQ37eF07PwIo1lxc8/y7iOiTqu1mKPLSprtohvA2Q312YT4Z8tZmh81uu4nxZjvTLIsqclCQA1nG04I4ov0lgivV521uuYs+v1bXCwT3zMrwDqOFr4IxtFpLEA8IAnALXcXqSP3knMvGjfPTp26QMsJADUFeWCjTIOAG74FQAAbEgAAIANCQAAsCEBAAA2JAAAwDmpP/BJAACADWUPAKnTF8Cdb/7ZrH9ym8/SPcseAABghfRvQFcHgB7pJ/0mANw40xe9++ew1QEAgN+OXOgu//lKvPGsEgBKbAbAjZ/2+nJ/99+JbfneVfougEsLsKAAnelrsZR5wxnhCYDDDUAGZS7/1mIEgJ5KbQ4AYfS8X0K88Y0SAHouhhAAQE8l75UoAaC3Syu6YQBM1fsuCfHuv7VYAWDEoggBAJxR/o1kpAAwSvlNBKCrUXdGmHf/rcX7Z4A/bdzCX39uqA0AIITt3ihGCwAzvNpk4QCgtlUXfbj7JWIAGPkU4J3tEiAAe4r6NwDhkhIAnBTyTosaAACggpCXf2uxA0DYRQOAD4S+xyIHgNaCLx4APBH+/ooeAFpLsIgAcCPFvZUhALSWZDEB2F6a+ypLAGjt70VNs7AAbCfVHZUpAFylWmAAtpDubsoYAFpLuNAAlJT26XTWANBa4kUHoITUd1DEjwI+6roBPsYXgBlSX/xXFQLAlSAAwEglLv6rSgHgShAAoJdSl/6tigHg6n7TBAIAPlH20r/1Hzdz/Wc0wt7uAAAAAElFTkSuQmCC"/>
            </defs>
        `;

        return svg;
    }

    function buildTermoElectricoIcon () {
        var svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
        svg.setAttributeNS (null, 'width', '21');
        svg.setAttributeNS (null, 'height', '37');
        svg.setAttributeNS (null, 'viewBox', '0 0 21 37');
        svg.setAttributeNS (null, 'fill', 'none');

        svg.innerHTML = `
            <path d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5H11C16.2467 0.5 20.5 4.75329 20.5 10V29.859H0.5V10Z" stroke="#5D5C5C"/>
            <path d="M8.61365 24.4426C8.61365 23.5326 9.35136 22.7949 10.2614 22.7949C11.1714 22.7949 11.9091 23.5326 11.9091 24.4426V27.9615H8.61365V24.4426Z" stroke="#5D5C5C"/>
            <path d="M13.3409 11.1474C13.3409 12.5371 12.1075 13.7308 10.5 13.7308C8.89251 13.7308 7.65912 12.5371 7.65912 11.1474C7.65912 9.7577 8.89251 8.56409 10.5 8.56409C12.1075 8.56409 13.3409 9.7577 13.3409 11.1474Z" stroke="#5D5C5C"/>
            <path d="M8.64178 9.46362L10.5133 11.3473" stroke="#5D5C5C"/>
            <path d="M16.264 30.2846C16.0791 31.1819 15.2847 31.8564 14.3328 31.8564H6.66727C5.71532 31.8564 4.92094 31.1819 4.73607 30.2846H16.264Z" stroke="#5D5C5C" stroke-width="0.8"/>
            <rect x="7.87499" y="32.0207" width="0.477273" height="1.89452" stroke="#5D5C5C" stroke-width="0.477273"/>
            <rect x="12.6478" y="32.0207" width="0.477273" height="1.89452" stroke="#5D5C5C" stroke-width="0.477273"/>
            <rect x="7.3963" y="34.8654" width="0.474359" height="1.43473" transform="rotate(-90 7.3963 34.8654)" stroke="#5D5C5C" stroke-width="0.474359"/>
            <rect x="12.169" y="34.8654" width="0.474359" height="1.43473" transform="rotate(-90 12.169 34.8654)" stroke="#5D5C5C" stroke-width="0.474359"/>
            <rect x="7.87499" y="34.8668" width="0.477273" height="1.89452" stroke="#5D5C5C" stroke-width="0.477273"/>
            <rect x="12.6478" y="34.8668" width="0.477273" height="1.89452" stroke="#5D5C5C" stroke-width="0.477273"/>
        `;

        return svg;
    }

    function buildRankingElement (elementIcon, value) {
        var wrapper = document.createElement ('div');
        wrapper.classList.add ('inline-flex', 'bg-third', 'py-6', 'px-8', 
            'rounded-lg', 'text-2xl', 'font-bold');

        wrapper.appendChild (elementIcon)

        var valueElement = document.createElement ('span');
        valueElement.classList.add ('ml-3');
        wrapper.appendChild (valueElement);
        writeLocaleTextContent (
            valueElement,
            value,
            { style: 'percent', maximumFractionDigits: 1 },
            ''
        );

        return wrapper;
    }

    function setFrigorificoPercent (parentArea, value) {
        parentArea.appendChild (
            buildRankingElement (buildFrigorificoIcon (), value)
        );
    }
    
    function setLavadoraPercent (parentArea, value) {
        parentArea.appendChild (
            buildRankingElement (buildLavadoraIcon (), value)
        );
    }
    
    function setVitroceramicaPercent (parentArea, value) {
        parentArea.appendChild (
            buildRankingElement (buildVitroceramicaIcon (), value)
        );
    }

    function setTermoElectricoPercent (parentArea, value) {
        parentArea.appendChild (
            buildRankingElement (buildTermoElectricoIcon (), value)
        );
    }

    function buildStatsChart (element) {
        var dateFormat = '2022-01-01 '
        var hour = '00';
        var minute = '00';
        var xAxis = [];
        
        for (var i = 0; i < 24; ++i) {
            hour = (i < 10) ? '0' + i : i;
            for (var j = 0; j < 60; ++j) {
                minute = (j < 10) ? '0' + j : j;
                xAxis.push (dateFormat + hour + ':' + minute + ':00');
            }
        }

        xAxis.push ('2022-01-01 24:00:00');

        var configs = {
            type: 'line',
            data: {
                labels: xAxis,
                datasets: [
                    {
                        label: 'Generación',
                        data: [],
                        fill: true,
                        backgroundColor: 'rgba(80, 205, 137, 0.1)',
                        borderColor: [
                            'rgba(36, 82, 244, 1)',
                        ],
                        tension: 0.5
                    },
                    {
                        label: 'Consumo',
                        data: [],
                        borderColor: [
                            'rgba(223, 224, 235, 1)',
                        ],
                        tension: 0.5
                    },
                    {
                        label: 'None',
                        data: [3000],
                        borderColor: [
                            'rgba(223, 224, 235, 0.1)',
                        ],
                        tension: 0.5
                    }
                ]
            },
            options: {
                responsive: false,
                radius: 0,
                animation: false,
                animations : {
                    x: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'HH'
                            },
                        },
                        display: true,
                        title: {
                            display: false,
                            align: 'end',
                            position: 'top',
                            text: 'h',
                        },
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 100,
                        title: {
                            display: false,
                            position: 'top',
                            text: 'Kw',
                        },
                        ticks: {
                            callback: function (value, index, ticks) {
                                if (value > 999)
                                    return (value / 1000).toFixed(1) + ' kW'
                                return value + ' W'
                            }
                        },
                    }
                }
            }
        }

        var newChart = new Chart (element.getContext ('2d'), configs );
        return newChart;
    }

    function buildCO2Chart (element) {
        var configs = {
            type: 'bar',
            data: {
                labels: ['60'],
                datasets: [{
                    label: 'CO2',
                    data: [60],
                    backgroundColor: [
                        'rgba(223, 224, 235, 0.6)',
                    ],
                    borderColor: [
                        'rgba(223, 224, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display:false,
                    },
                    y: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 25,
                            callback: function (value, index, ticks) {
                                if (value == 0 || value == 100)
                                    return value
                                return ''
                            }
                        }
                    }
                }
            }
        };

        var newChart = new Chart (element.getContext ('2d'), configs);
        return newChart;
    }

    var showCenteredTextPlugin = { 
        id: '',
        afterDatasetsDraw (chart, args, options) {
            const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
            ctx.save ();

            const text = chart.data.datasets[0].data[1] + '%'

            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(29, 33, 41, 1)';
            ctx.textAlign = 'center';
            ctx.fillText ('Autoconsumo', width / 2, height / 2 + top - 22);

            ctx.font = 'Bolder 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText (text, width / 2 + 2, height / 2 + top + 18)
        }
    };

    function buildAutoconsumoChart (element) {
        var configs =  {
            type: 'doughnut',
            data: {
                labels: [
                    'Coste',
                    'Ahorro'
                ],
                datasets: [{
                    label: 'Autoconsumo',
                    data: [100, 0],
                    backgroundColor: [
                        'rgba(22, 93, 255, 1)',
                        'rgba(80, 205, 137, 1)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '75%',
                responsive: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                weight: 0.5
            },
            plugins: [showCenteredTextPlugin]
        };


        var newChart = new Chart (element.getContext ('2d'), configs);
        return newChart;
    }

    function generateDate (status) {
        var newDate = new Date ();
        newDate.setDate (newDate.getDate() - 1 + status.day);
        return newDate;
    }

    function rebuildStatsChart (element, oldChart) {
        oldChart.destroy ();
        return buildStatsChart (element);
    }

    function updateStatsArea (element, chart, consumo, generado, autoconsumo) {
        setConsumo (element, consumo);
        setGenerado (element, generado);
        setAutoconsumo (element, autoconsumo);

        chart._metasets[0]._dataset.data.push (generado);
        chart._metasets[1]._dataset.data.push (consumo);
        chart.update ();
    }

    function updateCO2Area (element, co2) {
        setCO2 (element, co2);
    }

    function updateRankingArea (
        element, 
        frigorifico, 
        lavadora, 
        vitroceramica, 
        termoElectrico ) {

        if (1 != element.children.length) {
            while (element.children.length != 1) {
                element.removeChild (element.lastElementChild);
            }
        }

        setFrigorificoPercent (element, frigorifico);
        setLavadoraPercent (element, lavadora);
        setVitroceramicaPercent (element, vitroceramica);
        setTermoElectricoPercent (element, termoElectrico);
    }

    function updateCostsArea (element, chart, autoconsumo, coste, ahorro) {
        setCoste (element, coste);
        setAhorro (element, ahorro);

        var percent = autoconsumo * 100;
        var rest = 100 - percent;

        chart._metasets[0]._dataset.data = [rest, percent.toFixed(2)];
        chart.update ();
    }

    function updateRealTimeArea (
        parentArea,
        generacion,
        consumo,
        frigorifico, 
        lavadora, 
        vitroceramica, 
        termoElectrico) {

        setGeneracionTotal (
            parentArea.children[0].children[0].children[0], 
            generacion
        );

        setConsumoTotal (
            parentArea.children[0].children[0].children[1].children[0],
            consumo
        );

        setConsumoFrigorifico (
            parentArea.children[0].children[2].children[0],
            frigorifico
        );

        setConsumoLavadora (
            parentArea.children[0].children[2].children[1],
            lavadora
        );

        setConsumoVitroceramica (
            parentArea.children[0].children[2].children[2],
            vitroceramica
        );

        setConsumoTermoElectrico (
            parentArea.children[0].children[2].children[3],
            termoElectrico
        );

        setTotalElectrodomesticos (
            parentArea.children[0].children[1], 
            frigorifico + lavadora + vitroceramica + termoElectrico
        );
    }

    function fetchData (dia, desde, hasta) {
        return new Promise (function(resolve, reject) {
            var configs = {
                method: "GET",
                headers: { 
                    "Content-type": "application/json;charset=UTF-8" 
                }
            };

            var url = 'stats/' + dia + '/' + desde + '/' + hasta;
            fetch (url, configs)
                .then (function (response) {
                    return response.json ()
                })
                .then (function (response) {
                    if (response.success) {
                        resolve (response.data);
                    } else {
                        reject (response);
                    }
                })
                .catch (function (err) {
                    console.error (err);
                    reject (err);
                })
        });
    }

    this.CUERVAPlugin = function () {
        var defaults = {
            debug: false
        };

        this.status = {
            day: 0,
            dayLimit: 1,
            hour: 0,
            hourLimit: 24
        };

        this.settings = (arguments[0] && typeof arguments[0] === 'object')
            ? extend (defaults, arguments[0]) : defaults;
        
        this.elements = [
            { id: 'stats-area', inst: null },
            { id: 'stats-canvas', inst: null },
            { id: 'tiempo-area', inst: null },
            { id: 'co2-area', inst: null },
            { id: 'co2-canvas', inst: null },
            { id: 'ranking-area', inst: null },
            { id: 'costs-area', inst: null },
            { id: 'costs-canvas', inst: null },
            { id: 'realtime-area', inst: null },
            { id: 'clima-area', inst: null },
            { id: 'date-area', inst: null },
            { id: 'notification-area', inst: null }
        ];

        this.charts = [
            { id: 'stats-chart', inst: null },
            { id: 'co2-chart', inst: null },
            { id: 'costs-chart', inst: null }
        ];

        this.init ();
    }
    
    this.CUERVAPlugin.prototype.init = function () {
        if (this.settings.debug)
            console.log ('Init plugin');
        
        if (this.settings.debug)
            console.log ('Cargar todos los componentes');
        
        this.elements.forEach (function (element) {
            element.inst = searchById (this.settings, element.id);
        });

        this.charts[0].inst = buildStatsChart (this.elements[1].inst);
        this.charts[1].inst = buildCO2Chart (this.elements[4].inst);
        this.charts[2].inst = buildAutoconsumoChart (this.elements[7].inst);
    }

    this.CUERVAPlugin.prototype.loop = async function (hrs_per_min, day) {
        if (this.settings.debug)
            console.log (hrs_per_min + ' Horas por minuto.');
        
        if(this.settings.debug)
            console.log ('Iniciando en el día ' + day + '.')

        var interval = new Number (hrs_per_min);
        if (interval < 1 || interval > 4) {
            console.error ('Parameto Invalid!');
            console.error ('Los valores permitidos para el parametro ' +
                '"hrs_por_min" son de [0, 4].');
            return;
        }

        var currentDay = new Number (day);
        if (currentDay < 1 || currentDay > 2) {
            console.error ('Parameto Invalid!');
            console.error ('Los valores permitidos para el parametro ' +
                '"dia" son de 1 y 2.');
            return;
        }

        this.status.day = currentDay - 1;

        var currentDate = generateDate (this.status);
        setDateFilterArea (this.elements[10].inst, currentDate);
        setTimeFilterArea (this.elements[10].inst, 0, 0);
        setDateStatsArea (
            this.elements[0].inst, 
            currentDate, 
            this.status.hour
        );

        var intervalTime = 1000 / interval;

        while (true) {
            var response = await fetchData (
                this.status.day,
                this.status.hour, 
                this.status.hour + interval
            );

            var data = response.data;
            var ads = response.advices;

            // inserciones
            var minutes = 0;
            for (var i = 0; i < data.length; ++i) {
                setTimeFilterArea (
                    this.elements[10].inst, 
                    this.status.hour, 
                    minutes
                );

                updateStatsArea (
                    this.elements[0].inst, 
                    this.charts[0].inst,
                    data[i].consumo_total,
                    data[i].generacion, 
                    data[i].autoconsumo
                );

                updateCO2Area (
                    this.elements[3].inst,
                    data[i].co2_sum
                );

                updateCostsArea (
                    this.elements[6].inst,
                    this.charts[2].inst,
                    data[i].autoconsumo_percent,
                    data[i].coste_sum,
                    data[i].ahorro_sum
                );

                updateRankingArea (
                    this.elements[5].inst,
                    data[i].frigorifico_percent,
                    data[i].lavadora_percent,
                    data[i].vitroceramica_percent,
                    data[i].termoelectrico_percent
                );

                updateRealTimeArea (
                    this.elements[8].inst,
                    data[i].generacion,
                    data[i].consumo, 
                    data[i].frigorifico,
                    data[i].lavadora, 
                    data[i].vitroceramica, 
                    data[i].termoelectrico
                );

                setAdvice (
                    this.elements[11].inst,
                    ads,
                    this.status.hour,
                    i
                );

                await wait (intervalTime);

                minutes += 1;

                var isOneHour = (i % 59) == 0 && i != 0;
                if (isOneHour) {
                    nextHour (this.status);
                    minutes = 0;
                    setDateStatsArea (
                        this.elements[0].inst, 
                        currentDate, 
                        this.status.hour
                    );
                }
            }

            if (isLastHour (this.status)) {
                updateStatus (this.status);

                const url = new URL (window.location.href);
                url.searchParams.set ('dia', this.status.day + 1);
                window.location.href = url;
                
                /*this.charts[0].inst = rebuildStatsChart (
                    this.elements[1].inst,
                    this.charts[0].inst
                );*/
            }

            updateStatus (this.status);

            currentDate = generateDate (this.status);
            setDateFilterArea (this.elements[10].inst, currentDate);

            setDateStatsArea (
                this.elements[0].inst, 
                currentDate, 
                this.status.hour
            );

            await wait (1000);
        }
    }
}) ();

window.addEventListener ('DOMContentLoaded', function () {
    var plugin = new CUERVAPlugin ();

    const url = new URL (window.location.href);
    const hrs_per_min = url.searchParams.get ('hrs_por_min') || 1;
    const day = url.searchParams.get ('dia') || 1;

    plugin.loop (hrs_per_min, day);
});