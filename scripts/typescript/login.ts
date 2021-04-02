(async () => {
  
  let loggingIn: boolean = true;

  get('#signup-btn')!.on('click', function(this: HTMLElement, e: Event): void {
    const wrapper = get('.form-nickname-wrapper') as HTMLElement;
    const swapIn = get('.swap-wrap .in') as HTMLElement;
    const swapUp = get('.swap-wrap .up') as HTMLElement;
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