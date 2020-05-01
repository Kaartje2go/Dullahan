/* eslint-disable */

declare global {
    interface Window {
        __DULLAHAN_POINTER_ENABLED__?: boolean;
    }
}

export function displayPointer(): void {
    if (window.__DULLAHAN_POINTER_ENABLED__) {
        return;
    }
    window.__DULLAHAN_POINTER_ENABLED__ = true;

    var dullahanCursorStyle = document.createElement('style');
    dullahanCursorStyle.setAttribute('type', 'text/css');
    dullahanCursorStyle.appendChild(document.createTextNode(
        '.dullahan-cursor {'
            + 'position: absolute;'
            + 'pointer-events: none;'
            + 'background-color: rgba(0, 0, 255, 0.2);'
            + 'z-index: 9007199254740991;'
            + 'border-radius: 20px;'
            + 'width: 20px;'
            + 'height: 20px;'
            + 'transform: scale(1);'
            + 'transition: transform 0.05s'
            + 'transition-delay: 0.05s;'
            + 'transform-origin: center center;'
        + '} '
        + '.dullahan-cursor-history {'
            + 'display: block;'
            + 'position: absolute;'
            + 'top: 0;'
            + 'bottom: 0;'
            + 'left: 0;'
            + 'right: 0;'
            + 'pointer-events: none;'
            + 'z-index: 9007199254740990;'
        + '}'
    ));
    document.head.appendChild(dullahanCursorStyle);

    var dullahanSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    dullahanSVG.setAttribute('class', 'dullahan-cursor-history');
    document.body.appendChild(dullahanSVG);

    var dullahanCursorDiv = document.createElement('div');
    dullahanCursorDiv.setAttribute('class', 'dullahan-cursor');
    document.body.appendChild(dullahanCursorDiv);

    var lastAction;

    function updateSVGSize(): void {
        dullahanSVG.setAttribute('width', document.body.clientWidth.toString());
        dullahanSVG.setAttribute('height', document.body.clientHeight.toString());
    }

    function dullahanCursorMovementHandler(event: MouseEvent | TouchEvent, action?: 'press' | 'release'): void {
        var position = 'touches' in event ? event.touches[0] : event;
        var x = typeof position.pageX === 'number' ? position.pageX : position.clientX + window.scrollX;
        var y = typeof position.pageY === 'number' ? position.pageY : position.clientY + window.scrollY;

        dullahanCursorDiv.style.top = y - 10 + 'px';
        dullahanCursorDiv.style.left = x - 10 + 'px';

        if (action) {
            var moved = !!lastAction && (lastAction.x !== x || lastAction.y !== y);
            console.log(lastAction, x, y);
            if (moved) {
                var line = document.createElementNS('http://www.w3.org/2000/svg','line');
                line.setAttribute('x1', lastAction.x.toString());
                line.setAttribute('y1', lastAction.y.toString());
                line.setAttribute('x2', x.toString());
                line.setAttribute('y2', y.toString());
                line.setAttribute("stroke", 'rgba(0, 0, 255, 0.2)');
                line.setAttribute('stroke-width', '3')
                if (lastAction.action !== 'press') {
                    line.setAttribute('stroke-dasharray', '10')
                }
                dullahanSVG.appendChild(line);
            }

            if (!lastAction || moved) {
                var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
                circle.setAttribute('cx', x.toString());
                circle.setAttribute('cy', y.toString());
                circle.setAttribute('r', '10');
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', 'rgba(0, 0, 255, 0.2)')
                circle.setAttribute('stroke-width', '5')
                dullahanSVG.appendChild(circle);
            }

            lastAction = {
                x: x,
                y: y,
                action: action
            };
        }
    }

    function dullahanCursorPressHandler(event): void {
        dullahanCursorMovementHandler(event, 'press');
    }

    function dullahanCursorReleaseHandler(event): void {
        dullahanCursorMovementHandler(event, 'release');
    }

    document.addEventListener('mousemove', dullahanCursorMovementHandler);
    document.addEventListener('touchmove', dullahanCursorMovementHandler);

    document.addEventListener('mousedown', dullahanCursorPressHandler);
    document.addEventListener('mouseup', dullahanCursorReleaseHandler);

    document.addEventListener('touchstart', dullahanCursorPressHandler);
    document.addEventListener('touchend', dullahanCursorReleaseHandler);

    updateSVGSize();
    setInterval(updateSVGSize, 100);
}
