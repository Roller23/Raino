(async () => {
  
  const get = (selector: string) => document.querySelector(selector);

  let loggingIn: boolean = true;

  get('#signup-btn')!.addEventListener('click', function(this: HTMLElement, e): void {
    const wrapper = get('.form-nickname-wrapper') as HTMLElement;
    const swapIn = get('.swap-wrap .in') as HTMLElement;
    const swapUp = get('.swap-wrap .up') as HTMLElement;
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