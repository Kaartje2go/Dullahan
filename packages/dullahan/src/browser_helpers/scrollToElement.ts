export function scrollToElement(this: void, element: Element): void {
    element.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });

    var bounds = element.getBoundingClientRect();
    var centerElementX = bounds.left + bounds.width / 2;
    var centerElementY = bounds.top + bounds.height / 2;

    var centerViewportX = window.innerWidth / 2;
    var centerViewportY = window.innerHeight / 2;

    var scrollX = centerElementX - centerViewportX;
    var scrollY = centerElementY - centerViewportY;

    window.scrollBy(scrollX, scrollY);
}
