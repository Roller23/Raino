"use strict";
(async () => {
    const get = (selector) => document.querySelector(selector);
    let loggingIn = true;
    get('#signup-btn').addEventListener('click', function (e) {
        const wrapper = get('.form-nickname-wrapper');
        const swapIn = get('.swap-wrap .in');
        const swapUp = get('.swap-wrap .up');
        if (loggingIn) {
            wrapper.style.height = wrapper.scrollHeight + 'px';
            swapIn.style.height = '0%';
            swapUp.style.opacity = '1';
            this.innerText = 'take me back';
            loggingIn = false;
            return;
        }
        wrapper.style.height = '0px';
        swapIn.style.height = '100%';
        swapUp.style.opacity = '0';
        this.innerText = 'sign up';
        loggingIn = true;
    });
})();
