"use strict";
(async () => {
    let loggingIn = true;
    get('#signup-btn').on('click', function (e) {
        const wrapper = get('.form-nickname-wrapper');
        const swapIn = get('.swap-wrap .in');
        const swapUp = get('.swap-wrap .up');
        loggingIn = !loggingIn;
        if (!loggingIn) {
            wrapper.style.height = wrapper.scrollHeight + 'px';
            swapIn.style.height = '0%';
            swapUp.style.opacity = '1';
            this.innerText = 'take me back';
            return;
        }
        wrapper.style.height = '0px';
        swapIn.style.height = '100%';
        swapUp.style.opacity = '0';
        this.innerText = 'sign up';
    });
})();
